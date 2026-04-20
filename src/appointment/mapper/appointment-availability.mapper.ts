import {
  AppointmentAvailabilityDto,
  AvailableSlotDto,
} from '../dto/appointment-availability.dto';

type AvailabilityRaw = {
  date: string;
  totalSlots: number;
  availableSlots: number;
  clinicLocationId?: string;
  available: { start: string; end: string }[];
  message?: string;
};

export class AppointmentAvailabilityMapper {
  static toDto(data: AvailabilityRaw): AppointmentAvailabilityDto {
    return new AppointmentAvailabilityDto({
      date: data.date,
      totalSlots: data.totalSlots,
      availableSlots: data.availableSlots,
      clinicLocationId: data.clinicLocationId,
      available: data.available.map(
        (slot) =>
          ({
            start: slot.start,
            end: slot.end,
          }) as AvailableSlotDto,
      ),
      message: data.message,
    });
  }
}
