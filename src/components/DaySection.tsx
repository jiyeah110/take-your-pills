import React from 'react';
import { TimePeriod, TaskItem } from '../types';
import { MedicineStrip } from './MedicineStrip';
import { formatPharmacyDate } from '../utils/dateHelpers';
import { Scissors } from 'lucide-react';

interface DaySectionProps {
  date: string;
  tasks: TaskItem[];
  currentPeriod: TimePeriod;
  isToday: boolean;
  tornPackets: Record<TimePeriod, boolean>;
  onSelectPill: (task: TaskItem) => void;
  onCompletePill: (taskId: string, triggerElement?: HTMLElement | null) => void;
  onAddTask: (newTask: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>) => void;
  showDividerBelow?: boolean;
}

export const DaySection: React.FC<DaySectionProps> = ({
  date,
  tasks,
  currentPeriod,
  isToday,
  tornPackets,
  onSelectPill,
  onCompletePill,
  onAddTask,
  showDividerBelow = true,
}) => {
  const formattedDate = formatPharmacyDate(date);

  return (
    <div className="relative w-full flex flex-col items-center" id={`day-section-${date}`}>
      {/* Medicine Strip for this day */}
      <MedicineStrip
        date={date}
        formattedDate={formattedDate}
        tasks={tasks}
        currentPeriod={currentPeriod}
        isToday={isToday}
        tornPackets={tornPackets}
        onSelectPill={onSelectPill}
        onCompletePill={onCompletePill}
        onAddTask={onAddTask}
      />

      {/* Visual Strip Tear / Dispenser Notched Perforation separating consecutive days */}
      {showDividerBelow && (
        <div className="my-6 w-full max-w-sm flex items-center justify-center gap-2 select-none opacity-60 hover:opacity-100 transition-opacity">
          {/* Left Pinking Notch */}
          <div className="w-3 h-3 -mr-1 rounded-r-full bg-[#E5E7EB] border-y border-r border-neutral-300" />

          {/* Center Perforation Line */}
          <div className="flex-1 h-[2px] perforation-dots flex items-center justify-center">
            <span className="font-pharmacy text-[9px] uppercase tracking-widest text-neutral-400 bg-[#F8F9FA] px-2 py-0.5 rounded flex items-center gap-1">
              <Scissors className="w-2.5 h-2.5" />
              TEAR LINE • NEXT ROLL UNIT
            </span>
          </div>

          {/* Right Pinking Notch */}
          <div className="w-3 h-3 -ml-1 rounded-l-full bg-[#E5E7EB] border-y border-l border-neutral-300" />
        </div>
      )}
    </div>
  );
};
