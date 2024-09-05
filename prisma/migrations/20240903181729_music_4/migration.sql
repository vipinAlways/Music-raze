/*
  Warnings:

  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "group" DROP CONSTRAINT "group_streamId_fkey";

-- DropForeignKey
ALTER TABLE "group" DROP CONSTRAINT "group_userId_fkey";

-- DropIndex
DROP INDEX "ActiveStreams_groupId_key";

-- DropTable
DROP TABLE "group";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "members" TEXT[],
    "streamId" TEXT NOT NULL,
    "type" "type" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveStreams" ADD CONSTRAINT "ActiveStreams_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
