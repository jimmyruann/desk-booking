/*
  Warnings:

  - Added the required column `displayName` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeZone` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "allowBookingFrom" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "allowBookingTill" INTEGER NOT NULL DEFAULT 86399,
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "timeZone" TEXT NOT NULL;
