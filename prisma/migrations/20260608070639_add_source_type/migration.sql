/*
  Warnings:

  - You are about to drop the column `sourceLebal` on the `document_embeddings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chunkKey]` on the table `document_embeddings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceType` to the `document_embeddings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "document_embeddings" DROP COLUMN "sourceLebal",
ADD COLUMN     "sourceLabel" TEXT,
ADD COLUMN     "sourceType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "document_embeddings_chunkKey_key" ON "document_embeddings"("chunkKey");
