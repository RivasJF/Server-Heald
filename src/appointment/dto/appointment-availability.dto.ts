export class AppointmentAvailabilityDto {
  date: string;
  available: {
    start: string;
    end: string;
  }[];
}
