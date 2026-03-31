-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "WatchMethod" AS ENUM ('THEATER', 'OTT', 'TV', 'DVD', 'OTHER');

-- CreateEnum
CREATE TYPE "CaptionTone" AS ENUM ('EMOTIONAL', 'WITTY', 'CALM', 'REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "externalMovieId" TEXT,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "releaseDate" TIMESTAMP(3),
    "posterUrl" TEXT,
    "overview" TEXT,
    "runtime" INTEGER,
    "genres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL,
    "watchPlace" TEXT,
    "watchMethod" "WatchMethod" NOT NULL,
    "companions" TEXT,
    "rating" DECIMAL(2,1),
    "shortReview" TEXT,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedCaption" (
    "id" TEXT NOT NULL,
    "movieLogId" TEXT NOT NULL,
    "tone" "CaptionTone" NOT NULL,
    "captionText" TEXT NOT NULL,
    "hashtagsText" TEXT,
    "versionNo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedCaption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_externalMovieId_key" ON "Movie"("externalMovieId");

-- CreateIndex
CREATE INDEX "Movie_title_idx" ON "Movie"("title");

-- CreateIndex
CREATE INDEX "Movie_releaseDate_idx" ON "Movie"("releaseDate");

-- CreateIndex
CREATE INDEX "Movie_createdAt_idx" ON "Movie"("createdAt");

-- CreateIndex
CREATE INDEX "MovieLog_userId_watchedAt_idx" ON "MovieLog"("userId", "watchedAt" DESC);

-- CreateIndex
CREATE INDEX "MovieLog_movieId_watchedAt_idx" ON "MovieLog"("movieId", "watchedAt" DESC);

-- CreateIndex
CREATE INDEX "MovieLog_watchMethod_idx" ON "MovieLog"("watchMethod");

-- CreateIndex
CREATE INDEX "MovieLog_createdAt_idx" ON "MovieLog"("createdAt");

-- CreateIndex
CREATE INDEX "GeneratedCaption_movieLogId_createdAt_idx" ON "GeneratedCaption"("movieLogId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "GeneratedCaption_tone_idx" ON "GeneratedCaption"("tone");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedCaption_movieLogId_versionNo_key" ON "GeneratedCaption"("movieLogId", "versionNo");

-- AddForeignKey
ALTER TABLE "MovieLog" ADD CONSTRAINT "MovieLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieLog" ADD CONSTRAINT "MovieLog_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedCaption" ADD CONSTRAINT "GeneratedCaption_movieLogId_fkey" FOREIGN KEY ("movieLogId") REFERENCES "MovieLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
