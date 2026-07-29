/*
  Warnings:

  - Added the required column `name` to the `DailyLogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyLogEntry" ADD COLUMN     "name" TEXT NOT NULL;
