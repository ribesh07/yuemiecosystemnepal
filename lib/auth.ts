import { headers } from "next/headers";
import { verifyToken } from "./jwt";

export const requireAuth = async () => {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
};

export const requireAdminRole = async (...roles: string[]) => {
  const user = await requireAuth();

  if (user.type !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (roles.length && !roles.includes(user.role!)) {
    throw new Error("FORBIDDEN");
  }

  return user;
};
