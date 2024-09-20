/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `ActiveStreams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ActiveStreams_groupId_key" ON "ActiveStreams"("groupId");
