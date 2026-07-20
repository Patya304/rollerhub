-- CreateEnum
CREATE TYPE "ConditionLevel" AS ENUM ('GOOD', 'FAIR', 'NEEDS_ATTENTION');

-- CreateEnum
CREATE TYPE "KnownIssuesState" AS ENUM ('NOT_PROVIDED', 'NONE_REPORTED', 'REPORTED');

-- AlterTable
ALTER TABLE "SaleReport" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "snapshot" JSONB,
ADD COLUMN     "snapshotHash" TEXT,
ADD COLUMN     "snapshotVersion" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ScooterCondition" (
    "id" TEXT NOT NULL,
    "scooterId" TEXT NOT NULL,
    "overall" "ConditionLevel",
    "battery" "ConditionLevel",
    "brakes" "ConditionLevel",
    "tires" "ConditionLevel",
    "lights" "ConditionLevel",
    "frame" "ConditionLevel",
    "cosmetics" "ConditionLevel",
    "knownIssuesState" "KnownIssuesState" NOT NULL DEFAULT 'NOT_PROVIDED',
    "knownIssues" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScooterCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScooterCondition_scooterId_key" ON "ScooterCondition"("scooterId");

-- AddForeignKey
ALTER TABLE "ScooterCondition" ADD CONSTRAINT "ScooterCondition_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
