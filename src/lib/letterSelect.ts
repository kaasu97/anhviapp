export const personSelect = {
  id: true,
  name: true,
  emoji: true,
} as const;

export const letterInclude = {
  author: { select: personSelect },
  recipient: { select: personSelect },
} as const;
