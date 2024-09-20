/*
  Warnings:

  - You are about to drop the column `ActiveStreamsId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `ActiveStreamsId` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `ActiveStreamsId` on the `UrlUpVotes` table. All the data in the column will be lost.
  - Changed the type of `type` on the `ActiveStreams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `streamId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamId` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamId` to the `UrlUpVotes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('Spotify', 'Youtube');

-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_ActiveStreamsId_fkey";

-- DropForeignKey
ALTER TABLE "UrlUpVotes" DROP CONSTRAINT "UrlUpVotes_ActiveStreamsId_fkey";

-- AlterTable
ALTER TABLE "ActiveStreams" DROP COLUMN "type",
ADD COLUMN     "type" "StreamType" NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "ActiveStreamsId",
ADD COLUMN     "streamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "ActiveStreamsId",
ADD COLUMN     "streamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UrlUpVotes" DROP COLUMN "ActiveStreamsId",
ADD COLUMN     "streamId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ActiveStreamsType";

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlUpVotes" ADD CONSTRAINT "UrlUpVotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
