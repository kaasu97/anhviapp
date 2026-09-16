import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { getCoupleWithMembers } from "@/lib/couple";
import { createLetterSchema } from "@/lib/validation";
import { addDays, startOfDay } from "@/lib/dates";
import { letterInclude } from "@/lib/letterSelect";

async function sweepExpired(coupleId: string) {
  await prisma.letter.updateMany({
    where: { coupleId, status: "PENDING", dueAt: { lt: new Date() } },
    data: { status: "EXPIRED" },
  });
}

export async function GET() {
  try {
    const user = await requireUser();
    const couple = await getCoupleWithMembers(user.id);
    if (!couple) {
      return NextResponse.json({ pending: [], history: [] });
    }

    await sweepExpired(couple.id);

    const letters = await prisma.letter.findMany({
      where: { coupleId: couple.id },
      orderBy: { drawnAt: "desc" },
      include: letterInclude,
    });

    const pending = letters.filter((l) => l.status === "PENDING");
    const history = letters.filter((l) => l.status !== "PENDING");

    return NextResponse.json({ pending, history });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const couple = await getCoupleWithMembers(user.id);
    if (!couple || !couple.userTwoId) {
      throw new ApiError(400, "Cần ghép đôi trước khi gửi thư nhé.");
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

    const body = await req.json();
    const parsed = createLetterSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
    }

    const recipientId = couple.userOneId === user.id ? couple.userTwoId! : couple.userOneId;
    const now = new Date();

    const letter = await prisma.$transaction(async (tx) => {
      const created = await tx.letter.create({
        data: {
          coupleId: couple.id,
          authorId: user.id,
          recipientId,
          promptText: parsed.data.promptText,
          promptEmoji: parsed.data.promptEmoji,
          requestText: parsed.data.requestText,
          drawnAt: now,
          dueAt: addDays(now, 7),
        },
        include: letterInclude,
      });

      await tx.couple.update({
        where: { id: couple.id },
        data: { turnUserId: recipientId },
      });

      return created;
    });

    return NextResponse.json(letter);
  } catch (error) {
    return errorResponse(error);
  }
}
