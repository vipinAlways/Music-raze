/*
  Warnings:

  - Made the column `streamId` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "streamId" SET NOT NULL;
