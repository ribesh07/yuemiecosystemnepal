import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { serializeBigInt } from "@/lib/serializeBigInt";
import { requireAdminRole } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    if (!(prisma as any).inquiry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Inquiry model is not ready. Run prisma migrate/generate and restart server.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const inquiryType = String(body?.inquiryType || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    const allowedTypes = new Set(["Personal", "Retail", "Institutional"]);
    if (!allowedTypes.has(inquiryType)) {
      return NextResponse.json(
        { success: false, message: "Invalid inquiry type" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        inquiryType,
        message,
        status: "new",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        data: serializeBigInt(inquiry),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("INQUIRY_CREATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    if (!(prisma as any).inquiry) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Inquiry model is not ready. Run prisma migrate/generate and restart server.",
        },
        { status: 500 }
      );
    }

    await requireAdminRole();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const inquiryType = searchParams.get("inquiryType");

    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(inquiryType ? { inquiryType } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(inquiries),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    console.error("INQUIRY_LIST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
