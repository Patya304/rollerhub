-- AlterTable
ALTER TABLE "Scooter" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "profileIsPublic" BOOLEAN NOT NULL DEFAULT false;
