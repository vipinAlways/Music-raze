-- CreateEnum
CREATE TYPE "type" AS ENUM ('invite', 'anyone');

-- CreateEnum
CREATE TYPE "StreamType" AS ENUM ('Spotify', 'Youtube');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Google');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
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
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ActiveStreams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upVotes" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "upVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "members" TEXT[],
    "streamId" TEXT NOT NULL,
    "type" "type" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveStreams_groupId_key" ON "ActiveStreams"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "upVotes_userID_streamId_key" ON "upVotes"("userID", "streamId");

-- AddForeignKey
ALTER TABLE "ActiveStreams" ADD CONSTRAINT "ActiveStreams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upVotes" ADD CONSTRAINT "upVotes_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upVotes" ADD CONSTRAINT "upVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "ActiveStreams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
