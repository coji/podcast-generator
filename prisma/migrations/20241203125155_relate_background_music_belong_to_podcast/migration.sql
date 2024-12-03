/*
  Warnings:

  - Added the required column `podcast_id` to the `background_musics` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_background_musics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "podcast_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audio_file" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "background_musics_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_background_musics" ("audio_file", "created_at", "description", "duration", "id", "name", "updated_at") SELECT "audio_file", "created_at", "description", "duration", "id", "name", "updated_at" FROM "background_musics";
DROP TABLE "background_musics";
ALTER TABLE "new_background_musics" RENAME TO "background_musics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
