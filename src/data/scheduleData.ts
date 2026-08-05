import { ScheduleEvent } from '../types/schedule';

// Helper function to generate mock dates relative to current time for testing
const getRelativeDate = (daysOffset: number, hoursOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hoursOffset, 0, 0, 0);
  return d.toISOString();
};

// We will replace this dummy data once the real schedule is provided
export const MOCK_SCHEDULE: ScheduleEvent[] = [
  // PAST EVENTS (Yesterday)
  {
    id: '1',
    title: 'Registration & Welcome',
    startTime: getRelativeDate(-1, -10), 
    endTime: getRelativeDate(-1, -8),
    location: 'Main Auditorium',
    band: 'Both',
    description: 'Check-in and collect your orientation kits.'
  },
  {
    id: '2',
    title: 'Campus Tour',
    startTime: getRelativeDate(-1, -7), 
    endTime: getRelativeDate(-1, -5),
    location: 'Library Square',
    band: 'Both',
  },

  // LIVE EVENT (Today, right now)
  {
    id: '3',
    title: 'Dean\'s Address & Keynote',
    startTime: getRelativeDate(0, -1), // Started 1 hour ago
    endTime: getRelativeDate(0, 1),    // Ends in 1 hour
    location: 'Central Hall',
    band: 'Both',
    description: 'Welcome speech from the Dean and introduction to the university.'
  },

  // UPCOMING EVENTS (Today, later)
  {
    id: '4',
    title: 'Department Introduction (Red)',
    startTime: getRelativeDate(0, 2),
    endTime: getRelativeDate(0, 4),
    location: 'Block A, Room 101',
    band: 'Red',
  },
  {
    id: '5',
    title: 'Department Introduction (Blue)',
    startTime: getRelativeDate(0, 2),
    endTime: getRelativeDate(0, 4),
    location: 'Block B, Room 202',
    band: 'Blue',
  },
  {
    id: '6',
    title: 'Club Exhibition',
    startTime: getRelativeDate(0, 5),
    endTime: getRelativeDate(0, 7),
    location: 'Sports Complex',
    band: 'Both',
    description: 'Explore various student clubs and societies.'
  },

  // FUTURE EVENTS (Tomorrow)
  {
    id: '7',
    title: 'Alumni Meet & Greet',
    startTime: getRelativeDate(1, -2),
    endTime: getRelativeDate(1, 0),
    location: 'Student Center',
    band: 'Both',
  },
  {
    id: '8',
    title: 'Closing Ceremony',
    startTime: getRelativeDate(1, 1),
    endTime: getRelativeDate(1, 3),
    location: 'Main Auditorium',
    band: 'Both',
  }
];
