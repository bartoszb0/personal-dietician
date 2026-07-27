/*
  Warnings:

  - You are about to drop the column `dietType` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "dietType";

-- DropEnum
DROP TYPE "DietType";
