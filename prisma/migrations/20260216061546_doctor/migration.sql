/*
  Warnings:

  - You are about to drop the column `expreience` on the `doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "expreience",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
