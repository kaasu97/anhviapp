import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { joinCoupleSchema } from "@/lib/validation";
import { getCoupleWithMembers } from "@/lib/couple";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const existing = await getCoupleWithMembers(user.id);
    if (existing) {
      throw new ApiError(409, "Bạn đã ở trong một cặp đôi rồi.");
    }

    const body = await req.json();
    const parsed = joinCoupleSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? "Mã mời không hợp lệ");
    }

    const couple = await prisma.couple.findUnique({ where: { inviteCode: parsed.data.inviteCode } });
    if (!couple) {
      throw new ApiError(404, "Không tìm thấy mã mời này.");
    }
    if (couple.userOneId === user.id) {
      throw new ApiError(400, "Đây là mã mời của chính bạn.");
    }
    if (couple.userTwoId) {
      throw new ApiError(409, "Cặp đôi này đã đủ hai người rồi.");
    }

    const updated = await prisma.couple.update({
      where: { id: couple.id },
      data: { userTwoId: user.id, startedAt: new Date() },
    });

    return NextResponse.json({ id: updated.id });
  } catch (error) {
    return errorResponse(error);
  }
}
