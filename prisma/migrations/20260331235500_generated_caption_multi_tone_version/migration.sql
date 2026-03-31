-- DropIndex
DROP INDEX "GeneratedCaption_movieLogId_versionNo_key";

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedCaption_movieLogId_versionNo_tone_key" ON "GeneratedCaption"("movieLogId", "versionNo", "tone");
