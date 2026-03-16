/*
  Warnings:

  - You are about to drop the column `source` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "leads" DROP COLUMN "source",
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceName" TEXT NOT NULL DEFAULT 'Site Web';

-- DropEnum
DROP TYPE "LeadSource";

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "influencer" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sources_slug_key" ON "sources"("slug");
