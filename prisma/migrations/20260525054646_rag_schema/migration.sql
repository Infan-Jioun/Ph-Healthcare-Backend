-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "DocumentEmbedding" (
    "id" TEXT NOT NULL,
    "chunkKey" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceLebal" TEXT,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(384) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentEmbedding_pkey" PRIMARY KEY ("id")
);
