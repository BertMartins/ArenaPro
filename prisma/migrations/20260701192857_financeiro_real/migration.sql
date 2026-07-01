-- CreateEnum
CREATE TYPE "FinancialDirection" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "FinancialCategory" AS ENUM ('monthly_fee', 'daily_fee', 'expense');

-- CreateTable
CREATE TABLE "MonthlyFeeConfig" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthlyFeeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyFeeConfig_month_year_key" ON "MonthlyFeeConfig"("month", "year");

-- AlterTable: add new nullable columns first, backfill, then enforce NOT NULL
ALTER TABLE "FinancialEntry" ADD COLUMN "direction" "FinancialDirection";
ALTER TABLE "FinancialEntry" ADD COLUMN "category" "FinancialCategory";
ALTER TABLE "FinancialEntry" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DataMigration: reclassify existing rows by their old "type"
UPDATE "FinancialEntry" SET "direction" = 'income', "category" = 'monthly_fee'
  WHERE "type" = 'arena_payment';

UPDATE "FinancialEntry" SET "direction" = 'income', "category" = 'daily_fee'
  WHERE "type" = 'daily_fee';

UPDATE "FinancialEntry" SET "direction" = 'income', "category" = 'monthly_fee'
  WHERE "type" = 'monthly_income';

-- DataMigration: move the "fee_config" hack rows into MonthlyFeeConfig, then drop them
INSERT INTO "MonthlyFeeConfig" ("id", "month", "year", "totalAmount")
SELECT
  substr(md5(random()::text || clock_timestamp()::text), 1, 25),
  EXTRACT(MONTH FROM "date")::int,
  EXTRACT(YEAR FROM "date")::int,
  "amount"
FROM "FinancialEntry"
WHERE "type" = 'adjustment' AND "note" = 'fee_config'
ON CONFLICT ("month", "year") DO UPDATE SET "totalAmount" = EXCLUDED."totalAmount";

DELETE FROM "FinancialEntry" WHERE "type" = 'adjustment' AND "note" = 'fee_config';

-- DataMigration: any other stray "adjustment" rows become manual expenses (kept, not discarded)
UPDATE "FinancialEntry" SET "direction" = 'expense', "category" = 'expense'
  WHERE "type" = 'adjustment' AND "direction" IS NULL;

-- Safety net: any row that somehow still has no direction/category (should not happen)
UPDATE "FinancialEntry" SET "direction" = 'expense', "category" = 'expense'
  WHERE "direction" IS NULL OR "category" IS NULL;

-- Enforce NOT NULL now that every row has been classified
ALTER TABLE "FinancialEntry" ALTER COLUMN "direction" SET NOT NULL;
ALTER TABLE "FinancialEntry" ALTER COLUMN "category" SET NOT NULL;

-- Drop the old column/enum
ALTER TABLE "FinancialEntry" DROP COLUMN "type";
DROP TYPE "FinancialType";
