import { TaskItem, ArchiveRecord } from '../types';
import { INITIAL_TASKS, INITIAL_ARCHIVES, INITIAL_DATE } from '../data/initialData';

const TASKS_KEY = 'rx_todo_tasks_v2';
const ARCHIVES_KEY = 'rx_todo_archives_v2';
const CURRENT_DATE_KEY = 'rx_todo_current_date_v2';
const TORN_PACKETS_KEY = 'rx_todo_torn_packets_v2';

export function loadStoredTasks(): TaskItem[] {
  try {
    // Clear old v1 keys if present to reset cleanly
    localStorage.removeItem('rx_todo_tasks_v1');
    localStorage.removeItem('rx_todo_archives_v1');
    localStorage.removeItem('rx_todo_current_date_v1');
    localStorage.removeItem('rx_todo_torn_packets_v1');

    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
  }
  return INITIAL_TASKS;
}

export function saveStoredTasks(tasks: TaskItem[]) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
}

export function loadStoredArchives(): ArchiveRecord[] {
  try {
    const raw = localStorage.getItem(ARCHIVES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load archives from localStorage', e);
  }
  return INITIAL_ARCHIVES;
}

export function saveStoredArchives(archives: ArchiveRecord[]) {
  try {
    localStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives));
  } catch (e) {
    console.error('Failed to save archives to localStorage', e);
  }
}

export function loadStoredCurrentDate(): string {
  try {
    const raw = localStorage.getItem(CURRENT_DATE_KEY);
    if (raw) return raw;
  } catch (e) {
    console.error('Failed to load date from localStorage', e);
  }
  return INITIAL_DATE;
}

export function saveStoredCurrentDate(date: string) {
  try {
    localStorage.setItem(CURRENT_DATE_KEY, date);
  } catch (e) {
    console.error('Failed to save date to localStorage', e);
  }
}

export function loadStoredTornPackets(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(TORN_PACKETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load torn packets from localStorage', e);
  }
  return {};
}

export function saveStoredTornPackets(torn: Record<string, boolean>) {
  try {
    localStorage.setItem(TORN_PACKETS_KEY, JSON.stringify(torn));
  } catch (e) {
    console.error('Failed to save torn packets to localStorage', e);
  }
}

export function resetAllStorage() {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(ARCHIVES_KEY);
    localStorage.removeItem(CURRENT_DATE_KEY);
    localStorage.removeItem(TORN_PACKETS_KEY);
    localStorage.removeItem('rx_todo_tasks_v1');
    localStorage.removeItem('rx_todo_archives_v1');
    localStorage.removeItem('rx_todo_current_date_v1');
    localStorage.removeItem('rx_todo_torn_packets_v1');
  } catch (e) {
    console.error('Failed to reset localStorage', e);
  }
}
