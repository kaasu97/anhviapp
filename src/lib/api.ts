import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ error: "Đã có lỗi xảy ra, thử lại sau nhé." }, { status: 500 });
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new ApiError(401, "Bạn cần đăng nhập trước.");
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    throw new ApiError(401, "Phiên đăng nhập không hợp lệ.");
  }
  return user;
}
