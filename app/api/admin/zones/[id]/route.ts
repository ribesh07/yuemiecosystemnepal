
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { zoneName } = await req.json();

    const updatedZone = await prisma.addressZone.update({
      where: { id: BigInt(params.id) },
      data: {
        zoneName,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedZone);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update zone" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.addressZone.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete zone" },
      { status: 500 }
    );
  }
}
