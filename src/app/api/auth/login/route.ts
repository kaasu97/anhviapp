import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { ApiError, errorResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    const token = await createSessionToken({ userId: user.id });
    await setSessionCookie(token);

    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    return errorResponse(error);
  }
}
