-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('Spotify', 'Youtube');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveStreams" (
    "id" TEXT NOT NULL,
    "type" "StreamType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "extractedId" TEXT NOT NULL,

    CONSTRAINT "ActiveStreams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upVotes" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "upVotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "upVotes_userID_streamId_key" ON "upVotes"("userID", "streamId");

-- AddForeignKey
ALTER TABLE "ActiveStreams" ADD CONSTRAINT "ActiveStreams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upVotes" ADD CONSTRAINT "upVotes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upVotes" ADD CONSTRAINT "upVotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
