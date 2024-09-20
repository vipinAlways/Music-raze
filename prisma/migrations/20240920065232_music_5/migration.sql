/*
  Warnings:

  - You are about to drop the column `url` on the `ActiveStreams` table. All the data in the column will be lost.
  - You are about to drop the `upVotes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "upVotes" DROP CONSTRAINT "upVotes_streamId_fkey";

-- DropForeignKey
ALTER TABLE "upVotes" DROP CONSTRAINT "upVotes_userId_fkey";

-- AlterTable
ALTER TABLE "ActiveStreams" DROP COLUMN "url";

-- DropTable
DROP TABLE "upVotes";

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlUpVotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "UrlUpVotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlUpVotes_userId_urlId_key" ON "UrlUpVotes"("userId", "urlId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlUpVotes" ADD CONSTRAINT "UrlUpVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlUpVotes" ADD CONSTRAINT "UrlUpVotes_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlUpVotes" ADD CONSTRAINT "UrlUpVotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
