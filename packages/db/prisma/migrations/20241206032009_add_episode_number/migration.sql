-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_episodes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "podcast_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "manuscript" TEXT,
    "backgroundMusicId" TEXT,
    "audio_url" TEXT,
    "audio_duration" INTEGER,
    "state" TEXT NOT NULL DEFAULT 'draft',
    "published_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "episode_number" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "episodes_backgroundMusicId_fkey" FOREIGN KEY ("backgroundMusicId") REFERENCES "background_musics" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "episodes_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_episodes" ("audio_duration", "audio_url", "backgroundMusicId", "created_at", "description", "id", "image_url", "manuscript", "podcast_id", "published_at", "state", "title", "updated_at") SELECT "audio_duration", "audio_url", "backgroundMusicId", "created_at", "description", "id", "image_url", "manuscript", "podcast_id", "published_at", "state", "title", "updated_at" FROM "episodes";
DROP TABLE "episodes";
ALTER TABLE "new_episodes" RENAME TO "episodes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
