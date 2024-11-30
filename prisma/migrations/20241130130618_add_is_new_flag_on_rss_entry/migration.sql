-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_rss_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rss_feed_id" TEXT NOT NULL,
    "is_new" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "rss_entries_rss_feed_id_fkey" FOREIGN KEY ("rss_feed_id") REFERENCES "rss_feeds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rss_entries" ("content", "created_at", "id", "link", "published_at", "rss_feed_id", "title", "updated_at") SELECT "content", "created_at", "id", "link", "published_at", "rss_feed_id", "title", "updated_at" FROM "rss_entries";
DROP TABLE "rss_entries";
ALTER TABLE "new_rss_entries" RENAME TO "rss_entries";
CREATE UNIQUE INDEX "rss_entries_link_key" ON "rss_entries"("link");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
