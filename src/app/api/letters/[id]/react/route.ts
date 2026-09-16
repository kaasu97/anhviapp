import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, ApiError, errorResponse } from "@/lib/api";
import { reactLetterSchema } from "@/lib/validation";
import { letterInclude } from "@/lib/letterSelect";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await context.params;

    const letter = await prisma.letter.findUnique({ where: { id } });
    if (!letter) {
      throw new ApiError(404, "Không tìm thấy lá thư này.");
    }
    if (letter.authorId !== user.id) {
      throw new ApiError(403, "Chỉ người viết yêu cầu mới có thể thả cảm xúc.");
    }
    if (letter.status !== "COMPLETED") {
      throw new ApiError(409, "Lá thư này chưa được hoàn thành.");
    }

    const body = await req.json();
    const parsed = reactLetterSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError(400, "Dữ liệu không hợp lệ");
    }

    const updated = await prisma.letter.update({
      where: { id },
      data: { authorReaction: parsed.data.emoji },
      include: letterInclude,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}
