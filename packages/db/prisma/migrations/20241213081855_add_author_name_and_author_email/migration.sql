-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_podcasts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL DEFAULT 'author',
    "author_email" TEXT NOT NULL DEFAULT 'email',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "speaker" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ja',
    "category_id" TEXT NOT NULL,
    "spotify_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "podcasts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_podcasts" ("category_id", "created_at", "description", "id", "image", "language", "organization_id", "slug", "speaker", "spotify_url", "title", "updated_at") SELECT "category_id", "created_at", "description", "id", "image", "language", "organization_id", "slug", "speaker", "spotify_url", "title", "updated_at" FROM "podcasts";
DROP TABLE "podcasts";
ALTER TABLE "new_podcasts" RENAME TO "podcasts";
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
