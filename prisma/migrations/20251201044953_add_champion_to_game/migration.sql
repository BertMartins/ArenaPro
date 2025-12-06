/*
  Warnings:

  - You are about to drop the `Champion` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "championId" TEXT;

-- DropTable
DROP TABLE "Champion";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_championId_fkey" FOREIGN KEY ("championId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
