export type TimePeriod = 'morning' | 'afternoon' | 'evening';

export type PillShape =
  | 'round-white'
  | 'oval-tablet'
  | 'two-tone-capsule'
  | 'small-circle'
  | 'translucent-softgel'
  | 'elongated-capsule';

export interface PillAppearance {
  shape: PillShape;
  primaryColor?: string;
  secondaryColor?: string;
  imprint?: string;
  subtleTint?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  memo?: string;
  date: string; // YYYY-MM-DD
  timePeriod: TimePeriod;
  pillShape: PillShape;
  pillAppearance: PillAppearance;
  completed: boolean;
  completedAt?: string;
  // Natural resting placement inside water glass when completed
  glassPlacement?: {
    xRatio: number; // 0 to 1 relative to glass bottom bed
    yRatio: number; // resting height offset
    rotation: number; // degrees tilt
  };
}

export interface DayData {
  date: string; // YYYY-MM-DD
  isArchived: boolean;
  tornPackets: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}

export interface ArchiveRecord {
  date: string;
  formattedDate: string;
  tasks: TaskItem[];
  completedCount: number;
  totalCount: number;
  archivedAt: string;
  crumpleSeed: number; // for visual crumpled paper/vinyl variation
}

export interface WaterSplashEvent {
  id: string;
  x: number; // 0 to 1 across glass surface
  timestamp: number;
}
