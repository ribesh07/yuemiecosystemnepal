import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 1️⃣ Get data from request body
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 400 }
    );
  }

  // 2️⃣ Create response
  const res = NextResponse.json({ success: true });

  // 3️⃣ Save token into secure HttpOnly cookie
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  // 4️⃣ Return response
  return res;
}



// import { cookies } from "next/headers";

// export async function GET() {
//   console.log("Fetching token from cookies...");
//   const cookieStore = await cookies();
//   const token = cookieStore.get("admin_token")?.value;

//   return Response.json({ token });
// }