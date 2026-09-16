import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { completeLetterSchema } from "@/lib/validation";
import { letterInclude } from "@/lib/letterSelect";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await context.params;

    const letter = await prisma.letter.findUnique({ where: { id } });
    if (!letter) {
      throw new ApiError(404, "Không tìm thấy lá thư này.");
    }
    if (letter.recipientId !== user.id) {
      throw new ApiError(403, "Đây không phải nhiệm vụ của bạn.");
    }
    if (letter.status === "EXPIRED") {
      throw new ApiError(409, "Lá thư này đã hết hạn rồi.");
    }
    if (letter.status === "COMPLETED") {
      throw new ApiError(409, "Bạn đã hoàn thành lá thư này rồi.");
    }

    const body = await req.json().catch(() => ({}));
    const parsed = completeLetterSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, "Dữ liệu không hợp lệ");
    }

    const updated = await prisma.letter.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        completionNote: parsed.data.note || null,
      },
      include: letterInclude,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
