-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "tempoTotal" INTEGER NOT NULL DEFAULT 0,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Flow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flow" ("complete", "createdAt", "endTime", "id", "importance", "startTime", "title", "updatedAt", "userId") SELECT "complete", "createdAt", "endTime", "id", "importance", "startTime", "title", "updatedAt", "userId" FROM "Flow";
DROP TABLE "Flow";
ALTER TABLE "new_Flow" RENAME TO "Flow";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
