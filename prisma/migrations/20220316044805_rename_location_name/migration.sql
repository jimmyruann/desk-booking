/*
  Warnings:

  - You are about to drop the column `name` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Location_name_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "name",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_locationId_key" ON "Location"("locationId");
