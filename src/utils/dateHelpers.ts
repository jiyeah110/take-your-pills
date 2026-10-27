import { TimePeriod } from '../types';

export function getCurrentTimePeriod(): TimePeriod {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

export function formatPharmacyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const monthName = date
      .toLocaleDateString('en-US', { month: 'short' })
      .toUpperCase();
    const dayPadded = String(day).padStart(2, '0');
    return `${monthName} ${dayPadded} ${year}`;
  } catch {
    return dateStr.toUpperCase();
  }
}

export function addDays(dateStr: string, daysToAdd: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + daysToAdd);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
