-- CreateEnum
CREATE TYPE "VotingStatus" AS ENUM ('scheduled', 'open', 'closed');

-- CreateTable
CREATE TABLE "LevelVotingSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Votação de Nível',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "VotingStatus" NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "LevelVotingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelVote" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LevelVote_sessionId_voterId_targetId_key" ON "LevelVote"("sessionId", "voterId", "targetId");

-- AddForeignKey
ALTER TABLE "LevelVotingSession" ADD CONSTRAINT "LevelVotingSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelVote" ADD CONSTRAINT "LevelVote_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LevelVotingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelVote" ADD CONSTRAINT "LevelVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelVote" ADD CONSTRAINT "LevelVote_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
