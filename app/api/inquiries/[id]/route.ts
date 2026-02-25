import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { requireAdminRole } from "@/lib/auth";
import { serializeBigInt } from "@/lib/serializeBigInt";

function parseId(value: string) {
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(prisma as any).inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry model is not ready" },
        { status: 500 }
      );
    }

    await requireAdminRole();
    const { id } = await context.params;
    const inquiryId = parseId(id);
    if (!inquiryId) {
      return NextResponse.json(
        { success: false, message: "Invalid inquiry id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const status = String(body?.status || "").trim();
    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const updated = await (prisma as any).inquiry.update({
      where: { id: inquiryId },
      data: { status, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry status updated",
      data: serializeBigInt(updated),
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
    console.error("INQUIRY_UPDATE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
