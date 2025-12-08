/*
  Warnings:

  - You are about to drop the column `status` on the `Appointment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicLocationId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_clinicLocationId_fkey" FOREIGN KEY ("clinicLocationId") REFERENCES "ClinicLocation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("clinicLocationId", "createdAt", "doctorId", "endTime", "id", "patientId", "startTime", "updatedAt") SELECT "clinicLocationId", "createdAt", "doctorId", "endTime", "id", "patientId", "startTime", "updatedAt" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
