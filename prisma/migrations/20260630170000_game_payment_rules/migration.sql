-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('monthly_priority', 'general');

-- AlterTable: Game
-- Renomeia "cutoffTime" (nunca era lido pelo código) para "paymentWindowStart"
-- e adiciona os novos campos de regra de jogo/pagamento.
ALTER TABLE "Game" RENAME COLUMN "cutoffTime" TO "paymentWindowStart";
ALTER TABLE "Game" ALTER COLUMN "paymentWindowStart" SET DEFAULT '12:00';
ALTER TABLE "Game" ADD COLUMN     "type" "GameType" NOT NULL DEFAULT 'monthly_priority',
ADD COLUMN     "paymentDeadlineMinutes" INTEGER NOT NULL DEFAULT 60;

-- AlterTable: GamePlayer
ALTER TABLE "GamePlayer" ADD COLUMN     "mainEnteredAt" TIMESTAMP(3),
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false;
