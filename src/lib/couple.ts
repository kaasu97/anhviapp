import { prisma } from "@/lib/prisma";

export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function getCoupleWithMembers(userId: string) {
  const couple = await prisma.couple.findFirst({
    where: {
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    include: {
      userOne: true,
      userTwo: true,
    },
  });
  return couple;
}

export function getPartner<T extends { id: string }>(
  couple: { userOneId: string; userOne: T; userTwo: T | null },
  userId: string
): T | null {
  if (couple.userOneId === userId) return couple.userTwo;
  return couple.userOne;
}
