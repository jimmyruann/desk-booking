/*
  Warnings:

  - You are about to drop the column `name` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `allowBookings` on the `Location` table. All the data in the column will be lost.
  - Added the required column `displayName` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapUrl` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "name",
ADD COLUMN     "allowBooking" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "allowBookings",
ADD COLUMN     "mapUrl" TEXT NOT NULL,
ALTER COLUMN "allowBookingTill" SET DEFAULT 1439;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
