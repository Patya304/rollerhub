/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "preferredLanguage" TEXT NOT NULL DEFAULT 'hu',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'black-white',
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
