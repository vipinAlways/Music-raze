-- CreateTable
CREATE TABLE "Favroutie" (
    "id" TEXT NOT NULL,
    "Audio_url" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "title_url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Favroutie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favroutie" ADD CONSTRAINT "Favroutie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
