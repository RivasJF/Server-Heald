-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "speciality" TEXT,
    "biography" TEXT,
    "consultationTime" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Doctor" ("biography", "consultationTime", "createdAt", "id", "speciality", "updatedAt", "userId") SELECT "biography", "consultationTime", "createdAt", "id", "speciality", "updatedAt", "userId" FROM "Doctor";
DROP TABLE "Doctor";
ALTER TABLE "new_Doctor" RENAME TO "Doctor";
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
