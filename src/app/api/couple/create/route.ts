import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { createCoupleSchema } from "@/lib/validation";
import { generateInviteCode, getCoupleWithMembers } from "@/lib/couple";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const existing = await getCoupleWithMembers(user.id);
    if (existing) {
      throw new ApiError(409, "Bạn đã ở trong một cặp đôi rồi.");
    }

    const body = await req.json().catch(() => ({}));
    const parsed = createCoupleSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, "Dữ liệu không hợp lệ");
    }

    let inviteCode = generateInviteCode();
    for (let attempts = 0; attempts < 5; attempts++) {
      const taken = await prisma.couple.findUnique({ where: { inviteCode } });
      if (!taken) break;
      inviteCode = generateInviteCode();
    }

    const anniversary = parsed.data.anniversary ? new Date(parsed.data.anniversary) : null;

    const couple = await prisma.couple.create({
      data: {
        inviteCode,
        userOneId: user.id,
        turnUserId: user.id,
        anniversary,
      },
    });

    return NextResponse.json({ id: couple.id, inviteCode: couple.inviteCode });
  } catch (error) {
    return errorResponse(error);
  }
}
