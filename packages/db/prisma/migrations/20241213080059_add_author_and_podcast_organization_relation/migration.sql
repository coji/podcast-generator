/*
  Warnings:

  - Added the required column `author` to the `podcasts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `podcasts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_podcasts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
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
INSERT INTO "new_podcasts" ("category_id", "created_at", "description", "id", "image", "language", "slug", "speaker", "spotify_url", "title", "updated_at", "author", "organization_id") SELECT "category_id", "created_at", "description", "id", "image", "language", "slug", "speaker", "spotify_url", "title", "updated_at", 'techtalk', 'org_2q9410e1qN63cMu12xAhiVt7HcT' FROM "podcasts";
DROP TABLE "podcasts";
ALTER TABLE "new_podcasts" RENAME TO "podcasts";
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
