export type Band = 'Red' | 'Blue' | 'Both';

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // ISO String format
  endTime: string;   // ISO String format
  location: string;
  band: Band;
  description?: string;
}
