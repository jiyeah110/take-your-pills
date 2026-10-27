import React from 'react';
import { TimePeriod, TaskItem } from '../types';
import { MedicinePacket } from './MedicinePacket';

interface MedicineStripProps {
  date: string;
  formattedDate: string;
  tasks: TaskItem[];
  currentPeriod: TimePeriod;
  isToday: boolean;
  tornPackets: Record<TimePeriod, boolean>;
  onSelectPill: (task: TaskItem) => void;
  onCompletePill: (taskId: string, triggerElement?: HTMLElement | null) => void;
  onAddTask: (newTask: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>) => void;
}

const PERIODS: TimePeriod[] = ['morning', 'afternoon', 'evening'];

export const MedicineStrip: React.FC<MedicineStripProps> = ({
  date,
  formattedDate,
  tasks,
  currentPeriod,
  isToday,
  tornPackets,
  onSelectPill,
  onCompletePill,
  onAddTask,
}) => {
  return (
    <div className="relative w-full max-w-md mx-auto my-6" id={`strip-${date}`}>
      {/* Pharmacy Roll Header Tag */}
      <div className="relative mx-auto w-[92%] bg-neutral-900 text-white rounded-t-lg px-4 py-2 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-2">
          <span className="font-pharmacy text-xs font-bold tracking-wider">
            {formattedDate}
          </span>
          {isToday && (
            <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-pharmacy font-bold">
              ACTIVE DAY
            </span>
          )}
        </div>
        <span className="font-pharmacy text-[9px] text-neutral-400 tracking-wider">
          CONTINUOUS PACKET STRIP
        </span>
      </div>

      {/* Connected 3-packet Strip Body */}
      <div className="relative bg-neutral-100/40 p-2 rounded-b-2xl border border-black/10 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06)]">
        {PERIODS.map((period) => {
          const periodTasks = tasks.filter((t) => t.timePeriod === period);
          const isCurrent = isToday && currentPeriod === period;
          const isTorn = tornPackets[period] || periodTasks.some((t) => t.completed);

          return (
            <MedicinePacket
              key={`${date}-${period}`}
              date={date}
              formattedDate={formattedDate}
              timePeriod={period}
              tasks={periodTasks}
              isCurrentTimePeriod={isCurrent}
              isTorn={isTorn}
              onSelectPill={onSelectPill}
              onCompletePill={onCompletePill}
              onAddTask={onAddTask}
            />
          );
        })}
      </div>
    </div>
  );
};
