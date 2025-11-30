-- CreateTable
CREATE TABLE "ClinicLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicLocation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicLocation_doctorId_key" ON "ClinicLocation"("doctorId");
