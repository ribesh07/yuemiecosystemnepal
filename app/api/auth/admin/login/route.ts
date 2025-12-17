import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/prisma-client";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { role: true }
  });

  if (!admin) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  const roleData = await prisma.adminRole.findUnique({
    where : {
        id : admin.roleId
    }
  })

  const token = signToken({
    sub: admin.id.toString(),
    role: roleData?.name,
    type: "ADMIN"
  });

  return NextResponse.json({ token });
}
