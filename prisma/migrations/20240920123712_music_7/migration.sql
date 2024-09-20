/*
  Warnings:

  - You are about to drop the column `active` on the `ActiveStreams` table. All the data in the column will be lost.
  - You are about to drop the column `extractedId` on the `ActiveStreams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActiveStreams" DROP COLUMN "active",
DROP COLUMN "extractedId";
