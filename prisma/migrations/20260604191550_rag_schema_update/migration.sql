/*
  Warnings:

  - You are about to drop the column `sourceLebal` on the `document_embeddings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chunkKey]` on the table `document_embeddings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "document_embeddings" DROP COLUMN "sourceLebal",
ADD COLUMN     "sourceLabel" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "document_embeddings_chunkKey_key" ON "document_embeddings"("chunkKey");
