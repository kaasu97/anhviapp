import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên").max(50),
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự").max(100),
  emoji: z.string().trim().min(1).max(8).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const joinCoupleSchema = z.object({
  inviteCode: z.string().trim().toUpperCase().length(6, "Mã mời gồm 6 ký tự"),
});

export const createCoupleSchema = z.object({
  anniversary: z.string().trim().optional(),
});

export const createLetterSchema = z.object({
  promptText: z.string().trim().min(1).max(300),
  promptEmoji: z.string().trim().min(1).max(8),
  requestText: z.string().trim().min(3, "Hãy viết rõ hơn một chút nhé").max(500),
});

export const completeLetterSchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export const reactLetterSchema = z.object({
  emoji: z.string().trim().min(1).max(8),
});
