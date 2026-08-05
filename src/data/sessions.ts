export type PillType = 'blue' | 'red'

export interface Mentor {
  name: string
  role: string
  avatar: string // initials fallback
}

export interface Session {
  id: string
  pill: PillType
  title: string
  subtitle: string
  date: string        // ISO string
  time: string
  duration: string
  venue: string
  mentor: Mentor
  faculty: Mentor
  description: string
  tags: string[]
}

export const sessions: Session[] = [
  {
    id: 'blue-001',
    pill: 'blue',
    title: 'Welcome to the Blue World',
    subtitle: 'Orientation: Systems & Structure',
    date: '2026-08-05',
    time: '10:00 AM',
    duration: '2 hrs',
    venue: 'Hall A, Block 1',
    mentor: {
      name: 'Arjun Mehta',
      role: 'Senior Mentor',
      avatar: 'AM',
    },
    faculty: {
      name: 'Dr. Priya Sharma',
      role: 'Head of Department',
      avatar: 'PS',
    },
    description:
      'Dive into the structured world of academics, rules, and campus life. This session covers everything you need to settle in.',
    tags: ['Academics', 'Campus Life', 'Rules'],
  },
  {
    id: 'red-001',
    pill: 'red',
    title: 'Welcome to the Red World',
    subtitle: 'Orientation: Exploration & Innovation',
    date: '2026-08-05',
    time: '02:00 PM',
    duration: '2 hrs',
    venue: 'Innovation Lab, Block 3',
    mentor: {
      name: 'Riya Kapoor',
      role: 'Innovation Lead',
      avatar: 'RK',
    },
    faculty: {
      name: 'Prof. Vikram Nair',
      role: 'Research Director',
      avatar: 'VN',
    },
    description:
      'Choose the path less taken. This session is for those who want to push boundaries — hackathons, research, startups, and beyond.',
    tags: ['Innovation', 'Research', 'Startups'],
  },
]

export const getSessionByPill = (pill: PillType): Session | undefined =>
  sessions.find((s) => s.pill === pill)

export const getUpcomingSessions = (): Session[] => {
  const today = new Date().toISOString().split('T')[0]
  return sessions.filter((s) => s.date >= today)
}
