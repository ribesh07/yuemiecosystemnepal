import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";
import bcrypt from "bcryptjs";
import { randomCode } from "@/lib/randomCode";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const serialNumber = String(body?.serialNumber || "").trim();
    const purchaseDateRaw = body?.purchaseDate ? new Date(body.purchaseDate) : null;
    const purchaseSource = body?.purchaseSource === "online" ? "online" : "store";
    const customerName = String(body?.customerName || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const address = String(body?.address || "").trim();

    if (!serialNumber) {
      return NextResponse.json(
        { success: false, message: "Serial number is required" },
        { status: 400 }
      );
    }

    if (purchaseSource === "store") {
      if (!customerName) {
        return NextResponse.json(
          { success: false, message: "Customer name is required" },
          { status: 400 }
        );
      }
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required" },
          { status: 400 }
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid email address" },
          { status: 400 }
        );
      }
      if (!phone) {
        return NextResponse.json(
          { success: false, message: "Contact number is required" },
          { status: 400 }
        );
      }
    }

    const prismaAny = prisma as any;
    const unit = prismaAny.productUnit?.findUnique
      ? await prismaAny.productUnit.findUnique({
          where: { serialNumber },
          include: {
            product: {
              select: { name: true, productCode: true },
            },
            warranty: true,
          },
        })
      : null;

    let unitInfo: any = unit;
    let warrantyDays = 365;
    let existingWarranty: any = unit?.warranty || null;

    if (!unitInfo) {
      const rows = (await prisma.$queryRawUnsafe(
        `
          SELECT pu.id, pu.serial_number as serialNumber, pu.product_code as productCode,
                 pu.status as unitStatus,
                 p.product_name as productName, p.warranty_days as warrantyDays
          FROM product_units pu
          JOIN products p ON p.product_code = pu.product_code
          WHERE pu.serial_number = ?
          LIMIT 1
        `,
        serialNumber
      )) as any[];

      unitInfo = rows?.[0] || null;
      warrantyDays = Number(unitInfo?.warrantyDays || 365);

      if (unitInfo?.id) {
        const existing = (await prisma.$queryRawUnsafe(
          "SELECT id FROM warranties WHERE product_unit_id = ? LIMIT 1",
          unitInfo.id
        )) as any[];
        existingWarranty = existing?.[0] || null;
      }
    } else {
      const wdRows = (await prisma.$queryRawUnsafe(
        "SELECT warranty_days as warrantyDays FROM products WHERE product_code = ? LIMIT 1",
        unitInfo.productCode
      )) as any[];
      warrantyDays = Number(wdRows?.[0]?.warrantyDays || 365);
    }

    if (!unitInfo) {
      return NextResponse.json(
        { success: false, message: "Serial number not found" },
        { status: 404 }
      );
    }

    const currentStatus = String(unitInfo?.status || unitInfo?.unitStatus || "").toLowerCase();
    if (currentStatus && currentStatus !== "in_stock") {
      return NextResponse.json(
        {
          success: false,
          message:
            currentStatus === "sold"
              ? "This serial number is already sold/registered"
              : `This serial number is not available for registration (${currentStatus})`,
        },
        { status: 400 }
      );
    }

    if (existingWarranty) {
      return NextResponse.json({
        success: true,
        message: "Warranty already registered",
        data: serializeBigInt(existingWarranty),
      });
    }

    let customerId: bigint | null = null;
    let customerInfo: {
      customerId: bigint | null;
      customerName: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
    } = {
      customerId: null,
      customerName: customerName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
    };

    try {
      const user = await requireAuth();
      customerId = BigInt(user.sub);
    } catch {
      // continue with offline customer mapping
    }

    if (customerId && (customerName || email || phone)) {
      const authUser = await prisma.user.findUnique({
        where: { id: customerId },
        select: { id: true, fullName: true, email: true, phone: true },
      });

      if (authUser?.id) {
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (customerName && customerName !== authUser.fullName) {
          updateData.fullName = customerName;
        }

        if (phone && phone !== authUser.phone) {
          const phoneTaken = await prisma.user.findFirst({
            where: {
              phone,
              id: { not: authUser.id },
            },
            select: { id: true },
          });
          if (!phoneTaken) {
            updateData.phone = phone;
          }
        }

        if (email && email !== authUser.email) {
          const emailTaken = await prisma.user.findFirst({
            where: {
              email,
              id: { not: authUser.id },
            },
            select: { id: true },
          });
          if (!emailTaken) {
            updateData.email = email;
          }
        }

        const updatedAuthUser = await prisma.user.update({
          where: { id: authUser.id },
          data: updateData,
          select: { id: true, fullName: true, email: true, phone: true },
        });

        customerInfo = {
          customerId: updatedAuthUser.id,
          customerName: updatedAuthUser.fullName || customerName || null,
          email: updatedAuthUser.email || email || null,
          phone: updatedAuthUser.phone || phone || null,
          address: address || null,
        };
      }
    }

    if (!customerId && (email || phone || customerName)) {
      let userByEmail: any = null;
      let userByPhone: any = null;

      if (email) {
        userByEmail = await prisma.user.findUnique({
          where: { email },
          select: { id: true, fullName: true, email: true, phone: true },
        });
      }

      if (!userByEmail && phone) {
        userByPhone = await prisma.user.findFirst({
          where: { phone },
          select: { id: true, fullName: true, email: true, phone: true },
        });
      }

      const existingUser = userByEmail || userByPhone;

      if (existingUser?.id) {
        const safeName = customerName || existingUser.fullName || "Store Customer";
        const updateData: any = {
          fullName: safeName,
          updatedAt: new Date(),
        };

        // update phone safely (unique)
        if (phone && phone !== existingUser.phone) {
          const phoneTaken = await prisma.user.findFirst({
            where: {
              phone,
              id: { not: existingUser.id },
            },
            select: { id: true },
          });
          if (!phoneTaken) {
            updateData.phone = phone;
          }
        }

        // update email safely (unique)
        if (email && email !== existingUser.email) {
          const emailTaken = await prisma.user.findFirst({
            where: {
              email,
              id: { not: existingUser.id },
            },
            select: { id: true },
          });
          if (!emailTaken) {
            updateData.email = email;
          }
        }

        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
          select: { id: true, fullName: true, email: true, phone: true },
        });

        customerId = updatedUser.id;
        customerInfo = {
          customerId,
          customerName: updatedUser.fullName || null,
          email: updatedUser.email || null,
          phone: updatedUser.phone || null,
          address: address || null,
        };
      } else if (email) {
        const safeName = customerName || "Store Customer";
        const tempPassword = randomBytes(16).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        let safePhone: string | null = null;
        if (phone) {
          const phoneTaken = await prisma.user.findFirst({
            where: { phone },
            select: { id: true },
          });
          if (!phoneTaken) {
            safePhone = phone;
          }
        }

        const createdUser = await prisma.user.create({
          data: {
            userId: randomCode("U"),
            fullName: safeName,
            email,
            phone: safePhone,
            password: hashedPassword,
            status: false,
            isEmailVerified: false,
          },
          select: { id: true, fullName: true, email: true, phone: true },
        });

        customerId = createdUser.id;
        customerInfo = {
          customerId,
          customerName: createdUser.fullName || null,
          email: createdUser.email || null,
          phone: createdUser.phone || null,
          address: address || null,
        };
      }
    }

    if (customerId && customerInfo.customerName === null) {
      const mappedUser = await prisma.user.findUnique({
        where: { id: customerId },
        select: { fullName: true, email: true, phone: true },
      });
      customerInfo = {
        customerId,
        customerName: mappedUser?.fullName || customerName || null,
        email: mappedUser?.email || email || null,
        phone: mappedUser?.phone || phone || null,
        address: address || null,
      };
    }

    const purchaseDate = purchaseDateRaw && !Number.isNaN(purchaseDateRaw.valueOf())
      ? purchaseDateRaw
      : new Date();
    const days = Number(warrantyDays || 365);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + days);

    let warranty: any = null;
    if (prismaAny.warranty?.create) {
      warranty = await prismaAny.warranty.create({
        data: {
          productUnitId: unitInfo.id,
          orderId: null,
          customerId,
          purchaseDate,
          expiryDate,
          purchaseSource,
        },
      });
    } else {
      await prisma.$executeRawUnsafe(
        `
          INSERT INTO warranties
          (product_unit_id, order_id, customer_id, purchase_date, expiry_date, purchase_source)
          VALUES (?, NULL, ?, ?, ?, ?)
        `,
        unitInfo.id,
        customerId ? customerId.toString() : null,
        purchaseDate,
        expiryDate,
        purchaseSource
      );
      const createdRows = (await prisma.$queryRawUnsafe(
        "SELECT * FROM warranties WHERE product_unit_id = ? LIMIT 1",
        unitInfo.id
      )) as any[];
      warranty = createdRows?.[0] || null;
    }

    await prisma.$executeRawUnsafe(
      "UPDATE product_units SET status = 'sold' WHERE id = ?",
      unitInfo.id.toString()
    );
    await prisma.$executeRawUnsafe(
      "UPDATE products SET availableQuantity = GREATEST(availableQuantity - 1, 0) WHERE product_code = ?",
      unitInfo.product?.productCode || unitInfo.productCode
    );

    return NextResponse.json({
      success: true,
      message: "Warranty registered successfully",
      data: serializeBigInt({
        warranty,
        product: {
          name: unitInfo.product?.name || unitInfo.productName || null,
          productCode: unitInfo.product?.productCode || unitInfo.productCode || null,
        },
        customer: {
          customerId: customerInfo.customerId,
          customerName: customerInfo.customerName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
        },
      }),
    });
  } catch (error) {
    console.error("WARRANTY_REGISTER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to register warranty" },
      { status: 500 }
    );
  }
}
