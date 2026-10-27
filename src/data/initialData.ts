import { TaskItem, ArchiveRecord } from '../types';

export const INITIAL_DATE = '2026-09-09';

export const INITIAL_TASKS: TaskItem[] = [
  // MORNING
  {
    id: 'task-m1',
    title: 'Review tax accounting notes',
    memo: 'Chapter 4 & 5 corporate depreciation rules',
    date: '2026-09-09',
    timePeriod: 'morning',
    pillShape: 'two-tone-capsule',
    pillAppearance: {
      shape: 'two-tone-capsule',
      primaryColor: '#1E40AF', // Deep Royal Blue
      secondaryColor: '#F8FAFC', // Pure Off-White
      imprint: 'TAX',
    },
    completed: false,
  },
  {
    id: 'task-m2',
    title: 'Drink water',
    memo: '500ml room temperature with lemon',
    date: '2026-09-09',
    timePeriod: 'morning',
    pillShape: 'translucent-softgel',
    pillAppearance: {
      shape: 'translucent-softgel',
      primaryColor: '#F59E0B', // Golden Amber Glow
      subtleTint: '#FDE68A',
    },
    completed: false,
  },
  {
    id: 'task-m3',
    title: 'Check email',
    memo: 'Prioritize team sprint review items',
    date: '2026-09-09',
    timePeriod: 'morning',
    pillShape: 'round-white',
    pillAppearance: {
      shape: 'round-white',
      primaryColor: '#FDFEFE',
      imprint: '500',
    },
    completed: false,
  },

  // AFTERNOON
  {
    id: 'task-a1',
    title: 'Solve accounting problems',
    memo: 'Practice set B questions 12 to 24',
    date: '2026-09-09',
    timePeriod: 'afternoon',
    pillShape: 'oval-tablet',
    pillAppearance: {
      shape: 'oval-tablet',
      primaryColor: '#FB923C', // Soft Peach / Coral
      imprint: 'ACT',
    },
    completed: false,
  },
  {
    id: 'task-a2',
    title: 'Read financial article',
    memo: 'Quarterly macroeconomic outlook report',
    date: '2026-09-09',
    timePeriod: 'afternoon',
    pillShape: 'elongated-capsule',
    pillAppearance: {
      shape: 'elongated-capsule',
      primaryColor: '#059669', // Emerald Green
      secondaryColor: '#FEF3C7', // Warm Cream
      imprint: 'ECO',
    },
    completed: false,
  },

  // EVENING
  {
    id: 'task-e1',
    title: "Review today's study progress",
    memo: 'Summarize flashcards and error logs',
    date: '2026-09-09',
    timePeriod: 'evening',
    pillShape: 'small-circle',
    pillAppearance: {
      shape: 'small-circle',
      primaryColor: '#FBBF24', // Canary Yellow Coated Tablet
      imprint: '81',
    },
    completed: false,
  },
  {
    id: 'task-e2',
    title: 'Plan tomorrow',
    memo: 'Outline morning focus blocks and deliverables',
    date: '2026-09-09',
    timePeriod: 'evening',
    pillShape: 'round-white',
    pillAppearance: {
      shape: 'round-white',
      primaryColor: '#F8FAFC',
      imprint: 'PLN',
    },
    completed: false,
  },
];

// Sample archived past days in the visual drawer
export const INITIAL_ARCHIVES: ArchiveRecord[] = [
  {
    date: '2026-09-08',
    formattedDate: 'SEP 08 2026',
    completedCount: 5,
    totalCount: 6,
    archivedAt: '2026-09-08T23:59:00',
    crumpleSeed: 1,
    tasks: [
      {
        id: 'arch-1',
        title: 'Review balance sheet fundamentals',
        memo: 'Asset vs liability classifications',
        date: '2026-09-08',
        timePeriod: 'morning',
        pillShape: 'round-white',
        pillAppearance: { shape: 'round-white', primaryColor: '#FDFEFE', imprint: 'ACC' },
        completed: true,
        completedAt: '2026-09-08T09:15:00',
      },
      {
        id: 'arch-2',
        title: 'Submit weekly expense reports',
        date: '2026-09-08',
        timePeriod: 'morning',
        pillShape: 'two-tone-capsule',
        pillAppearance: { shape: 'two-tone-capsule', primaryColor: '#DC2626', secondaryColor: '#F8FAFC', imprint: 'EXP' },
        completed: true,
        completedAt: '2026-09-08T11:30:00',
      },
      {
        id: 'arch-3',
        title: 'Client portfolio audit check',
        memo: 'Verify interest rates on Q3 notes',
        date: '2026-09-08',
        timePeriod: 'afternoon',
        pillShape: 'translucent-softgel',
        pillAppearance: { shape: 'translucent-softgel', primaryColor: '#F59E0B', subtleTint: '#FDE68A' },
        completed: true,
        completedAt: '2026-09-08T14:20:00',
      },
      {
        id: 'arch-4',
        title: 'Update spreadsheet models',
        date: '2026-09-08',
        timePeriod: 'afternoon',
        pillShape: 'oval-tablet',
        pillAppearance: { shape: 'oval-tablet', primaryColor: '#38BDF8', imprint: 'XL' },
        completed: true,
        completedAt: '2026-09-08T16:45:00',
      },
      {
        id: 'arch-5',
        title: '30-minute evening walk & stretch',
        date: '2026-09-08',
        timePeriod: 'evening',
        pillShape: 'small-circle',
        pillAppearance: { shape: 'small-circle', primaryColor: '#A78BFA', imprint: '30' },
        completed: true,
        completedAt: '2026-09-08T20:10:00',
      },
      {
        id: 'arch-6',
        title: 'Draft tax exemption summary memo',
        memo: 'Deferred to next week',
        date: '2026-09-08',
        timePeriod: 'evening',
        pillShape: 'elongated-capsule',
        pillAppearance: { shape: 'elongated-capsule', primaryColor: '#475569', secondaryColor: '#CBD5E1', imprint: 'MEM' },
        completed: false, // Incomplete pill in archived day!
      },
    ],
  },
  {
    date: '2026-09-07',
    formattedDate: 'SEP 07 2026',
    completedCount: 4,
    totalCount: 4,
    archivedAt: '2026-09-07T23:59:00',
    crumpleSeed: 2,
    tasks: [
      {
        id: 'arch-7-1',
        title: 'Prepare syllabus reading schedule',
        date: '2026-09-07',
        timePeriod: 'morning',
        pillShape: 'round-white',
        pillAppearance: { shape: 'round-white', primaryColor: '#FFFFFF', imprint: 'SYL' },
        completed: true,
        completedAt: '2026-09-07T08:40:00',
      },
      {
        id: 'arch-7-2',
        title: 'Organize study desk & stationery',
        date: '2026-09-07',
        timePeriod: 'morning',
        pillShape: 'translucent-softgel',
        pillAppearance: { shape: 'translucent-softgel', primaryColor: '#10B981', subtleTint: '#A7F3D0' },
        completed: true,
        completedAt: '2026-09-07T11:00:00',
      },
      {
        id: 'arch-7-3',
        title: 'Review corporate tax lecture audio',
        date: '2026-09-07',
        timePeriod: 'afternoon',
        pillShape: 'two-tone-capsule',
        pillAppearance: { shape: 'two-tone-capsule', primaryColor: '#7C3AED', secondaryColor: '#F5F3FF', imprint: 'LCT' },
        completed: true,
        completedAt: '2026-09-07T15:30:00',
      },
      {
        id: 'arch-7-4',
        title: 'Journal reflections and set goals',
        date: '2026-09-07',
        timePeriod: 'evening',
        pillShape: 'small-circle',
        pillAppearance: { shape: 'small-circle', primaryColor: '#F472B6', imprint: 'G' },
        completed: true,
        completedAt: '2026-09-07T21:40:00',
      },
    ],
  },
];
