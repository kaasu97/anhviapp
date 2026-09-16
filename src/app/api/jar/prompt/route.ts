import { NextResponse } from "next/server";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { getCoupleWithMembers } from "@/lib/couple";
import { drawRandomPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/prisma";
import { startOfDay } from "@/lib/dates";

export async function GET() {
  try {
    const user = await requireUser();
    const couple = await getCoupleWithMembers(user.id);
    if (!couple || !couple.userTwoId) {
      throw new ApiError(400, "Cần ghép đôi trước khi bốc thăm nhé.");
    }
    if (couple.turnUserId !== user.id) {
      throw new ApiError(403, "Hôm nay chưa đến lượt bạn bốc thăm.");
    }
    const drawnToday = await prisma.letter.findFirst({
      where: { coupleId: couple.id, drawnAt: { gte: startOfDay(new Date()) } },
    });
    if (drawnToday) {
      throw new ApiError(409, "Hôm nay bình thư đã được mở rồi.");
    }

    return NextResponse.json(drawRandomPrompt());
  } catch (error) {
    return errorResponse(error);
  }
}
