-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emoji" TEXT NOT NULL DEFAULT '🐣',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Couple" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteCode" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anniversary" DATETIME,
    "turnUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT,
    CONSTRAINT "Couple_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Couple_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coupleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "promptEmoji" TEXT NOT NULL DEFAULT '💌',
    "requestText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "drawnAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "completionNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Letter_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Letter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Letter_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_inviteCode_key" ON "Couple"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_userOneId_key" ON "Couple"("userOneId");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_userTwoId_key" ON "Couple"("userTwoId");

-- CreateIndex
CREATE INDEX "Letter_coupleId_drawnAt_idx" ON "Letter"("coupleId", "drawnAt");

-- CreateIndex
CREATE INDEX "Letter_recipientId_status_idx" ON "Letter"("recipientId", "status");
