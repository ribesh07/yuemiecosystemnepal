import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAuth } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { sendMail } from "@/lib/mailer";
import { buildOrderPlacedEmail } from "@/lib/orderEmail";
import { generateInvoicePdf } from "@/lib/invoicePdf";
import { logConnectIPSDebug } from "@/lib/connectipsDebug";

type OrderInputItem = {
  productId: bigint;
  quantity: number;
};

type ProductForOrder = {
  id: bigint;
  name: string | null;
  productCode: string;
  sellPrice: unknown;
  availableQuantity: bigint;
};

const toNumber = (value: unknown) => Number(value ?? 0);

async function hasColumn(tableName: string, columnName: string) {
  try {
    const rows = (await prisma.$queryRawUnsafe(
      `
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = ?
          AND column_name = ?
        LIMIT 1
      `,
      tableName,
      columnName
    )) as any[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                productCode: true,
                name: true,
                mainImage: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(orders),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("ORDER_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const customerId = BigInt(user.sub);
    const body = await req.json();

    const productId = body?.productId ? BigInt(body.productId) : null;
    const addressId = body?.addressId ? BigInt(body.addressId) : null;
    const quantity = Number(body?.quantity || 0);
    const paymentMethod = String(body?.paymentMethod || "").toLowerCase();
    const items = Array.isArray(body?.items) ? body.items : null;

    if (!addressId) {
      return NextResponse.json(
        { success: false, message: "Invalid order payload" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "cod" && paymentMethod !== "connectips") {
      return NextResponse.json(
        { success: false, message: "Unsupported payment method" },
        { status: 400 }
      );
    }

    const connectipsReferenceId = body?.connectipsReferenceId
      ? String(body.connectipsReferenceId)
      : null;
    if (paymentMethod === "connectips") {
      await logConnectIPSDebug({
        step: "order:create:connectips:start",
        referenceId: connectipsReferenceId || undefined,
        data: {
          customerId: customerId.toString(),
          addressId: addressId.toString(),
          itemCount: Array.isArray(items) ? items.length : 1,
        },
      });
    }

    const address = await prisma.customerAddress.findFirst({
      where: { id: addressId, customerId },
      include: { city: true },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const normalizedItems: OrderInputItem[] = items?.length
      ? items
          .map((item: any) => ({
            productId: item?.productId ? BigInt(item.productId) : null,
            quantity: Number(item?.quantity || 0),
          }))
          .filter((item: any) => item.productId && item.quantity > 0)
      : productId && quantity > 0
        ? [{ productId, quantity }]
        : [];

    if (!normalizedItems.length) {
      return NextResponse.json(
        { success: false, message: "No valid items found for order" },
        { status: 400 }
      );
    }

    const productIds = normalizedItems.map((item: OrderInputItem) => item.productId);
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        productCode: true,
        sellPrice: true,
        availableQuantity: true,
      },
      where: { id: { in: productIds } },
    });

    const productMap = new Map<string, ProductForOrder>(
      products.map((p: ProductForOrder) => [p.id.toString(), p])
    );
    for (const item of normalizedItems) {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      if (item.quantity > toNumber(product.availableQuantity)) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    const subtotal = normalizedItems.reduce((sum: number, item: OrderInputItem) => {
      const product = productMap.get(item.productId.toString());
      return sum + toNumber(product?.sellPrice) * item.quantity;
    }, 0);

    const shippingCost = Number(address.city?.shippingCost || 0);
    const discount = 0;
    const tax = 0;
    const totalAmount = subtotal + shippingCost + tax - discount;
    const orderNumber = BigInt(
      `${Date.now()}${Math.floor(100 + Math.random() * 900)}`
    );

    const result = await prisma.$transaction(
      async (tx: any) => {
        const txAny = tx as any;
        const hasWarrantyProductCodeColumn = await hasColumn("warranties", "product_code");
        const hasRequiresSerialColumn = await hasColumn("products", "requires_serial");
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId,
            ...(paymentMethod === "connectips" && connectipsReferenceId
              ? { transactionId: connectipsReferenceId }
              : {}),
            subtotal: String(subtotal),
            tax: String(tax),
            shippingCost: String(shippingCost),
            discount: String(discount),
            totalAmount: String(totalAmount),
            orderStatus: "processing",
            paymentStatus: paymentMethod === "connectips" ? "paid" : "unpaid",
          },
        });

        for (const item of normalizedItems) {
          const product = productMap.get(item.productId.toString())!;
          const unitPrice = toNumber(product.sellPrice);
          const hasSerialUnits = (
            (await tx.$queryRawUnsafe(
              "SELECT id FROM product_units WHERE product_code = ? LIMIT 1",
              product.productCode
            )) as any[]
          ).length > 0;
          const requiresSerialRows = hasRequiresSerialColumn
            ? ((await tx.$queryRawUnsafe(
                "SELECT requires_serial as requiresSerial FROM products WHERE product_code = ? LIMIT 1",
                product.productCode
              )) as any[])
            : [];
          const requiresSerial =
            requiresSerialRows?.[0]?.requiresSerial !== undefined &&
            requiresSerialRows?.[0]?.requiresSerial !== null
              ? Boolean(Number(requiresSerialRows[0].requiresSerial))
              : hasSerialUnits;

          const availableUnits = txAny.productUnit?.findMany
            ? await txAny.productUnit.findMany({
                where: {
                  productCode: product.productCode,
                  status: "in_stock",
                },
                orderBy: { serialNumber: "asc" },
                take: item.quantity,
              })
            : await tx.$queryRawUnsafe(
                `
                  SELECT id, product_code as productCode
                  FROM product_units
                  WHERE product_code = ? AND status = 'in_stock'
                  ORDER BY serial_number ASC
                  LIMIT ?
                `,
                product.productCode,
                item.quantity
              );

          // Serial-managed product must have enough serial units.
          if (requiresSerial && availableUnits.length < item.quantity) {
            throw new Error(
              `INSUFFICIENT_UNITS:${product.productCode}:${availableUnits.length}:${item.quantity}`
            );
          }

          const wdRows = (await tx.$queryRawUnsafe(
            "SELECT warranty_days as warrantyDays FROM products WHERE product_code = ? LIMIT 1",
            product.productCode
          )) as any[];
          const days = Number(wdRows?.[0]?.warrantyDays || 365);
          const purchaseDate = new Date();
          const expiryDate = new Date(purchaseDate);
          expiryDate.setDate(expiryDate.getDate() + days);

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productCode: product.productCode,
              quantity: BigInt(item.quantity),
              price: String(unitPrice),
              subtotal: String(unitPrice * item.quantity),
            },
          });

          // Non-serial products keep warranty registration at order creation.
          if (!requiresSerial) {
            for (let i = 0; i < item.quantity; i += 1) {
              if (hasWarrantyProductCodeColumn) {
                await tx.$executeRawUnsafe(
                  `
                    INSERT INTO warranties
                    (product_unit_id, product_code, order_id, customer_id, purchase_date, expiry_date, purchase_source)
                    VALUES (NULL, ?, ?, ?, ?, ?, 'online')
                  `,
                  product.productCode,
                  order.id.toString(),
                  customerId.toString(),
                  purchaseDate,
                  expiryDate
                );
              } else {
                await tx.$executeRawUnsafe(
                  `
                    INSERT INTO warranties
                    (product_unit_id, order_id, customer_id, purchase_date, expiry_date, purchase_source)
                    VALUES (NULL, ?, ?, ?, ?, 'online')
                  `,
                  order.id.toString(),
                  customerId.toString(),
                  purchaseDate,
                  expiryDate
                );
              }
            }
          }
        }

        await tx.orderPayment.create({
          data: {
            orderId: order.id,
            paymentMode: paymentMethod === "connectips" ? "ConnectIPS" : "COD",
            ...(paymentMethod === "connectips"
              ? {
                  transactionId: connectipsReferenceId,
                  paidAmount: String(totalAmount),
                  dueAmount: "0",
                  status: "paid",
                }
              : {
                  paidAmount: "0",
                  dueAmount: String(totalAmount),
                  status: "unpaid",
                }),
          },
        });

        for (const item of normalizedItems) {
          const product = productMap.get(item.productId.toString())!;
          const available = toNumber(product.availableQuantity);

          await tx.product.update({
            where: { id: product.id },
            data: {
              availableQuantity: BigInt(available - item.quantity),
            },
          });
        }

        await tx.user.update({
          where: { id: customerId },
          data: {
            orderCount: { increment: 1 },
          },
        });

        return order;
      }
    );

    try {
      const fullOrder = await prisma.order.findUnique({
        where: { id: result.id },
        include: {
          user: true,
          items: {
            include: {
              product: {
                select: { name: true, productCode: true },
              },
            },
          },
        },
      });

      if (fullOrder?.user?.email) {
        const addressSnapshot = await prisma.customerAddress.findFirst({
          where: { id: addressId, customerId },
          include: {
            province: true,
            city: true,
            zone: true,
          },
        });
        const mail = buildOrderPlacedEmail(fullOrder, addressSnapshot);
        let invoicePdf: Buffer | null = null;
        try {
          invoicePdf = await generateInvoicePdf(fullOrder, addressSnapshot);
        } catch (pdfError) {
          console.error("ORDER_INVOICE_PDF_ERROR", pdfError);
        }
        await sendMail({
          to: fullOrder.user.email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          attachments: invoicePdf
            ? [
                {
                  filename: `invoice-${fullOrder.orderNumber}.pdf`,
                  content: invoicePdf,
                  contentType: "application/pdf",
                },
              ]
            : undefined,
        });
      }
    } catch (mailError) {
      console.error("ORDER_EMAIL_ERROR", mailError);
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: serializeBigInt(result),
    });
  } catch (error) {
    await logConnectIPSDebug({
      step: "order:create:error",
      data: { message: error instanceof Error ? error.message : String(error) },
    });
    if (error instanceof Error && error.message.startsWith("INSUFFICIENT_UNITS")) {
      const [, code, available, requested] = error.message.split(":");
      const availableCount = Number(available || 0);
      const requestedCount = Number(requested || 0);
      const message =
        availableCount <= 0
          ? `All serial numbers are sold out for ${code}`
          : `Only ${availableCount} serial number(s) available for ${code}, requested ${requestedCount}`;
      return NextResponse.json(
        { success: false, message },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("ORDER_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}
