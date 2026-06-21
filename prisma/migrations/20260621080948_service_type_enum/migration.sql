/*
  Warnings:

  - Changed the type of `type` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('TIRE_CHANGE', 'BRAKE_CHANGE', 'BATTERY', 'SERVICE', 'OTHER');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "type",
ADD COLUMN     "type" "ServiceType" NOT NULL;
