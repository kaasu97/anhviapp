export type LetterStatus = "PENDING" | "COMPLETED" | "EXPIRED";

export type PersonDTO = {
  id: string;
  name: string;
  emoji: string;
};

export type LetterDTO = {
  id: string;
  coupleId: string;
  authorId: string;
  recipientId: string;
  promptText: string;
  promptEmoji: string;
  requestText: string;
  status: LetterStatus;
  drawnAt: string;
  dueAt: string;
  completedAt: string | null;
  completionNote: string | null;
  authorReaction: string | null;
  createdAt: string;
  author: PersonDTO;
  recipient: PersonDTO;
};

export type CoupleDTO = {
  id: string;
  inviteCode: string;
  paired: boolean;
  anniversary: string | null;
  daysTogether: number | null;
  partner: PersonDTO | null;
  isTurnMine: boolean;
  turnName: string | null;
  canDrawToday: boolean;
  alreadyDrawnToday: boolean;
};

export type MeDTO = {
  user: PersonDTO & { email: string };
  couple: CoupleDTO | null;
};
