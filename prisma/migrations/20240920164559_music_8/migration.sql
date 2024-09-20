/*
  Warnings:

  - You are about to drop the column `streamId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `streamId` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `streamId` on the `UrlUpVotes` table. All the data in the column will be lost.
  - Changed the type of `type` on the `ActiveStreams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ActiveStreamsId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ActiveStreamsId` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ActiveStreamsId` to the `UrlUpVotes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActiveStreamsType" AS ENUM ('Spotify', 'Youtube');

-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_streamId_fkey";

-- DropForeignKey
ALTER TABLE "UrlUpVotes" DROP CONSTRAINT "UrlUpVotes_streamId_fkey";

-- AlterTable
ALTER TABLE "ActiveStreams" DROP COLUMN "type",
ADD COLUMN     "type" "ActiveStreamsType" NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "streamId",
ADD COLUMN     "ActiveStreamsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "streamId",
ADD COLUMN     "ActiveStreamsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UrlUpVotes" DROP COLUMN "streamId",
ADD COLUMN     "ActiveStreamsId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "StreamType";

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_ActiveStreamsId_fkey" FOREIGN KEY ("ActiveStreamsId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlUpVotes" ADD CONSTRAINT "UrlUpVotes_ActiveStreamsId_fkey" FOREIGN KEY ("ActiveStreamsId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
