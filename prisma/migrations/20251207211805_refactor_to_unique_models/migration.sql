/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `DoctorDayClose` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `DoctorDayOff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctorDayClose_date_key" ON "DoctorDayClose"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDayOff_date_key" ON "DoctorDayOff"("date");
