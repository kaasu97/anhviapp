import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, errorResponse } from "@/lib/api";
import { getPartner } from "@/lib/couple";
import { startOfDay, daysBetween } from "@/lib/dates";

export async function GET() {
  try {
    const user = await requireUser();

    const couple = await prisma.couple.findFirst({
      where: { OR: [{ userOneId: user.id }, { userTwoId: user.id }] },
      include: { userOne: true, userTwo: true },
    });

    if (!couple) {
      return NextResponse.json({
        user: { id: user.id, name: user.name, emoji: user.emoji, email: user.email },
        couple: null,
      });
    }

    const partner = getPartner(couple, user.id);
    const paired = Boolean(couple.userTwoId);

    let canDrawToday = false;
    let alreadyDrawnToday = false;
    if (paired) {
      const todayStart = startOfDay(new Date());
      const drawnToday = await prisma.letter.findFirst({
        where: { coupleId: couple.id, drawnAt: { gte: todayStart } },
      });
      alreadyDrawnToday = Boolean(drawnToday);
      canDrawToday = couple.turnUserId === user.id && !drawnToday;
    }

    const anchorDate = couple.anniversary ?? (paired ? couple.startedAt : null);
    const daysTogether = anchorDate ? Math.max(0, daysBetween(anchorDate, new Date())) : null;

    return NextResponse.json({
      user: { id: user.id, name: user.name, emoji: user.emoji, email: user.email },
      couple: {
        id: couple.id,
        inviteCode: couple.inviteCode,
        paired,
        anniversary: couple.anniversary,
        daysTogether,
        partner: partner ? { id: partner.id, name: partner.name, emoji: partner.emoji } : null,
        isTurnMine: paired && couple.turnUserId === user.id,
        turnName: paired ? (couple.turnUserId === user.id ? user.name : partner?.name ?? null) : null,
        canDrawToday,
        alreadyDrawnToday,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
