import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IAppointmentRepository } from '../repository/appointment.repository.imp';
import { IScheduleRepository } from "src/schedule/repositories/schedule.repository.imp";
import { IDoctorRepository } from "src/doctor/repositories/doctor.repository.imp";
import { IDoctorDayCloseRepository } from "src/doctor-status/repository/doctor-day-close.repository.imp";
import { IDoctorDayOffRepository } from "src/doctor-status/repository/doctor-day-off.repository.imp";
import { addMinutes } from "date-fns/addMinutes";
import { IClinicRepository } from "src/clinic/repository/clinic.repository.imp";

@Injectable()
export class GenerateAvailabilityUseCase {
    constructor(
        @Inject('IAppointmentRepository')
        private readonly appointmentRepository: IAppointmentRepository,
        @Inject('IScheduleRepository')
        private readonly scheduleRepository: IScheduleRepository,
        @Inject('IDoctorRepository')
        private readonly doctorRepository: IDoctorRepository,
        @Inject('IDoctorDayCloseRepository')
        private readonly doctorDayCloseRepository: IDoctorDayCloseRepository,
        @Inject('IDoctorDayOffRepository')
        private readonly doctorDayOffRepository: IDoctorDayOffRepository,
        @Inject('IClinicRepository')
        private readonly clinicRepository: IClinicRepository
    ) { }
    async execute(id: string, date: string) {
        const doctor = await this.doctorRepository.findByIdWithServiceStatus(id);
        if (!doctor) {
            throw new NotFoundException('Doctor no encontrado');
        }

        if (!doctor.serviceIsActive()) {
            //retornar un dto con el mensaje de que el doctor no está activo
            return {
        date,
        totalSlots: 0,
        availableSlots: 0,
        available: [],
        message: 'El doctor tiene su servicio desactivado',
      };
        }

        const selectedDate = new Date(`${date}T00:00:00`);
        if (isNaN(selectedDate.getTime())) {
            throw new BadRequestException('Fecha inválida');
        }

        const weekday = selectedDate
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toUpperCase();

        const schedule = await this.scheduleRepository.findByDoctorId(doctor.getId());
        if (!schedule) {
            throw new Error(`No schedule found for doctor with id ${id} on ${weekday}`);
        }

        const isDayOff = `${date}T00:00:00.000Z`

        const doctorDayOff = await this.doctorDayOffRepository.findByDoctorIdAndDate(doctor.getId(), isDayOff);
        if (doctorDayOff) {
            //retornar un dto con el mensaje de que el doctor tiene día libre
            return {
        date,
        totalSlots: 0,
        availableSlots: 0,
        available: [],
        message: 'El doctor no atenderá este día',
      };
        }

        const WEEK_MAP = {
            MON: 'MON',
            TUE: 'TUE',
            WED: 'WED',
            THU: 'THU',
            FRI: 'FRI',
            SAT: 'SAT',
            SUN: 'SUN',
        };

        const dayConfig = schedule.getDays().find((d) => d.getDay() === WEEK_MAP[weekday]);

        if (!dayConfig) {
            //retornar un dto con el mensaje de que el doctor no trabaja ese día
            //talvez adaptar dto
            return {
        date,
        available: [],
        totalSlots: 0,
        availableSlots: 0,
        message: 'El doctor no trabaja este día',
      };
        }

        const dailyClosure = await this.doctorDayCloseRepository.findByDoctorIdAndDate(doctor.getId(), isDayOff);
        //201


        const dayStart = new Date(`${date}T${dayConfig.getStartTime()}:00`);
        let dayEnd = new Date(`${date}T${dayConfig.getEndTime()}:00`);
        if (dailyClosure) {
            const closureTime = new Date(`${date}T${dailyClosure.getClosedAt()}:00`);
            if (closureTime < dayEnd) {
                dayEnd = closureTime;
            }
        }

        const slots: { start: Date; end: Date }[] = [];

        let current = dayStart;
        while (current < dayEnd) {
            const slotEnd = addMinutes(current, schedule.getConsultationTime());

            if (slotEnd <= dayEnd) {
                slots.push({
                    start: new Date(current),
                    end: new Date(slotEnd),
                });
            }

            current = slotEnd;
        }

        const todaysBreaks = schedule.getBreaks().filter(
            (b) => b.getDay() === WEEK_MAP[weekday],
        );
        //240

        const slotsAfterBreak = slots.filter((slot) => {
            return !todaysBreaks.some((b) => {
                const breakStart = new Date(`${date}T${b.getStartTime()}:00`);
                const breakEnd = new Date(`${date}T${b.getEndTime()}:00`);
                return (
                    slot.start.getTime() >= breakStart.getTime() &&
                    slot.start.getTime() < breakEnd.getTime()
                );
            });
        });

        const appointments = await this.appointmentRepository.findByDoctorIdInRange(doctor.getId(), dayStart, dayEnd);

        const slotsAfterAppointments = slotsAfterBreak.filter((slot) => {
            return !appointments.some((app) => {
                const appStart = new Date(app.getStartTime()).getTime();
                return slot.start.getTime() === appStart;
            });
        });

        const filteredByTime = slotsAfterAppointments;


        const formattedAvailable = filteredByTime.map((s) => ({
            start: s.start.toISOString(),
            end: s.end.toISOString(),
        }));

        //return dto 

        const clinicLocation = await this.clinicRepository.findByDoctorId(doctor.getId());
        if (!clinicLocation) {
            throw new NotFoundException(
                `No existe ubicación para el doctor ${doctor.getId()}`,
            );
        }

        return {
            date,
            totalSlots: slots.length,
            availableSlots: formattedAvailable.length,
            clinicLocationId: clinicLocation.getId(),
            available: formattedAvailable,
        };

    }
}