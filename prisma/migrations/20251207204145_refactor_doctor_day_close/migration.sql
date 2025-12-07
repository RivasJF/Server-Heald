-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DoctorDayClose" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "closedAt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DoctorDayClose_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DoctorDayClose" ("closedAt", "createdAt", "date", "doctorId", "id") SELECT "closedAt", "createdAt", "date", "doctorId", "id" FROM "DoctorDayClose";
DROP TABLE "DoctorDayClose";
ALTER TABLE "new_DoctorDayClose" RENAME TO "DoctorDayClose";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
