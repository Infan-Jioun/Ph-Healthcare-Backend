-- CreateTable
CREATE TABLE "speclities" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "speclities_title_key" ON "speclities"("title");

-- CreateIndex
CREATE INDEX "idx_speciality_isDeleted" ON "speclities"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_speciality_title" ON "speclities"("title");
