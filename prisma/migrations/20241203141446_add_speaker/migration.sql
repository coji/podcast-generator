-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_podcasts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT,
    "speaker" TEXT NOT NULL DEFAULT '497929760',
    "language" TEXT NOT NULL DEFAULT 'ja',
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "podcasts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_podcasts" ("category_id", "created_at", "description", "id", "image", "language", "link", "slug", "title", "updated_at", "user_id") SELECT "category_id", "created_at", "description", "id", "image", "language", "link", "slug", "title", "updated_at", "user_id" FROM "podcasts";
DROP TABLE "podcasts";
ALTER TABLE "new_podcasts" RENAME TO "podcasts";
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
