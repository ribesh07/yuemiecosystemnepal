import { prisma } from "@/prisma/prisma-client";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function POST(req) {
  try {
    const body = await req.json();

    const address = await prisma.customerAddress.create({
      data: {
        customerId: BigInt(body.customerId),
        fullName: body.fullName,
        phone: body.phone,
        provinceId: BigInt(body.provinceId),
        cityId: BigInt(body.cityId),
        zoneId: BigInt(body.zoneId),
        address: body.address,
        landmark: body.landmark,
        addressType: body.addressType || "HOME",
        defaultShipping: body.defaultShipping || false,
        defaultBilling: body.defaultBilling || false,
      },
    });

    return new Response(JSON.stringify(address), { status: 200 });
  } catch (error) {
    console.error("Error creating address:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create address" }),
      { status: 500 }
    );
  }
}
