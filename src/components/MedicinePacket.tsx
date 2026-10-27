import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimePeriod, TaskItem } from '../types';
import { Pill } from './Pill';
import { AddTaskControl } from './AddTaskControl';
import { soundEffects } from '../utils/audio';

interface MedicinePacketProps {
  date: string;
  formattedDate: string;
  timePeriod: TimePeriod;
  tasks: TaskItem[];
  isCurrentTimePeriod: boolean;
  isTorn: boolean;
  onSelectPill: (task: TaskItem) => void;
  onCompletePill: (taskId: string, triggerElement?: HTMLElement | null) => void;
  onAddTask: (newTask: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>) => void;
}

export const MedicinePacket: React.FC<MedicinePacketProps> = ({
  date,
  formattedDate,
  timePeriod,
  tasks,
  isCurrentTimePeriod,
  isTorn,
  onSelectPill,
  onCompletePill,
  onAddTask,
}) => {
  const uncompletedTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const remainingCount = uncompletedTasks.length;

  const handlePillClick = (task: TaskItem) => {
    soundEffects.playPillClick();
    onSelectPill(task);
  };

  const handleQuickTake = (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    onCompletePill(task.id, target);
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isCurrentTimePeriod ? 'scale-[1.01]' : 'opacity-95'
      }`}
      id={`packet-${date}-${timePeriod}`}
    >
      {/* Top Perforation / Pinked Border or Torn Mouth */}
      <div className="relative w-full h-8 overflow-hidden z-20">
        {isTorn ? (
          /* Realistic Torn Plastic Edge */
          <motion.div
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full flex flex-col justify-end"
          >
            {/* Split jagged edge */}
            <div className="relative w-full h-4 bg-transparent">
              <svg
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                className="w-full h-3 text-slate-300/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] fill-white/80 stroke-slate-400/70 stroke-[0.5]"
              >
                <path d="M0,0 L4,5 L7,1 L12,6 L18,2 L23,5 L30,1 L36,7 L42,3 L48,6 L55,2 L62,7 L68,3 L75,6 L82,1 L88,6 L94,2 L100,5 L100,8 L0,8 Z" />
              </svg>
            </div>
            {/* Open pouch mouth gap showing inner darkness/depth */}
            <div className="h-2 w-full bg-gradient-to-b from-black/15 via-black/5 to-transparent border-t border-black/20" />
          </motion.div>
        ) : (
          /* Sealed Crimp with Perforation Line */
          <div className="w-full h-full flex flex-col justify-center items-center">
            {/* Pinked edge cut line at junction */}
            <div className="w-full h-1.5 pinked-edge-top opacity-60" />
            {/* Heat-sealed crimp bar */}
            <div className="w-full h-4 pouch-heat-seal-h border-y border-black/10 flex items-center justify-center">
              {/* Center perforation stitches */}
              <div className="w-[94%] h-[2px] perforation-dots opacity-80" />
            </div>
          </div>
        )}
      </div>

      {/* Main Transparent Vinyl Pouch Body */}
      <div
        className="relative mx-auto w-full bg-white/65 backdrop-blur-[2px] rounded-[3px] border-x-2 border-black/15 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_4px_rgba(255,255,255,0.8),inset_0_-1px_3px_rgba(0,0,0,0.03)] overflow-hidden"
        style={{
          boxShadow:
            '0 6px 16px -4px rgba(0,0,0,0.06), inset 0 2px 5px rgba(255,255,255,0.9), inset 0 -2px 5px rgba(0,0,0,0.04)',
        }}
      >
        {/* Left and Right heat seal crimp margins (simulating ATPS medicine strip seals) */}
        <div className="absolute top-0 bottom-0 left-0 w-3 pouch-heat-seal-v border-r border-black/10 pointer-events-none z-10 opacity-75" />
        <div className="absolute top-0 bottom-0 right-0 w-3 pouch-heat-seal-v border-l border-black/10 pointer-events-none z-10 opacity-75" />

        {/* Clear vinyl plastic sheen and wrinkled refraction highlights */}
        <div className="absolute inset-0 vinyl-sheen pointer-events-none z-10 opacity-80" />
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.7) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
        />

        {/* Printed Thermal Pharmacy Text (Directly on the transparent plastic) */}
        <div className="px-6 pt-3 pb-2 flex items-start justify-between relative z-10 select-none border-b border-black/5">
          <div>
            <div className="font-pharmacy text-xs font-bold text-black tracking-tight flex items-center gap-2">
              <span>{formattedDate}</span>
              {isCurrentTimePeriod && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
            <div className="font-pharmacy text-base font-extrabold text-black tracking-normal uppercase mt-0.5">
              {timePeriod}
            </div>
          </div>

          <div className="text-right">
            <div className="font-pharmacy text-xs font-bold text-black tracking-tight">
              {remainingCount} {remainingCount === 1 ? 'PILL' : 'PILLS'}
            </div>
            <div className="font-pharmacy text-[9px] text-neutral-500 uppercase tracking-wider mt-0.5">
              {isTorn ? 'OPENED PACKET' : 'SEALED PACKET'}
            </div>
          </div>
        </div>

        {/* Prescription Pills Content Container */}
        <div className="px-5 py-4 min-h-[130px] relative z-10 flex flex-col justify-between">
          {uncompletedTasks.length === 0 ? (
            /* Empty pouch state after pills taken */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="font-pharmacy text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
                {completedTasks.length > 0 ? 'All doses taken' : 'Empty pouch'}
              </span>
              <p className="font-sans-ui text-xs text-neutral-400 mt-1">
                {completedTasks.length > 0
                  ? 'Pills resting in water glass'
                  : 'Add medication to this packet'}
              </p>
            </div>
          ) : (
            /* Active pills inside pouch */
            <div className="space-y-3">
              {uncompletedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  id={`pill-item-${task.id}`}
                  layoutId={`pill-container-${task.id}`}
                  className="group relative flex items-center justify-between p-2.5 rounded-xl bg-white/75 hover:bg-white/95 border border-black/10 hover:border-black/25 shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all cursor-pointer select-none"
                  onClick={() => handlePillClick(task)}
                >
                  {/* Pill Visual */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-14 h-9">
                      <Pill
                        shape={task.pillShape}
                        appearance={task.pillAppearance}
                        size="md"
                        className="group-hover:scale-105 group-hover:rotate-1"
                      />
                    </div>

                    {/* Prescription Label */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-sans-ui text-sm font-semibold text-neutral-900 tracking-tight truncate">
                        {task.title}
                      </div>
                      {task.memo && (
                        <div className="font-sans-ui text-xs text-neutral-500 truncate mt-0.5">
                          {task.memo}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Physical "Take & Drop" quick action button */}
                  <div className="shrink-0 pl-2">
                    <button
                      type="button"
                      onClick={(e) => handleQuickTake(e, task)}
                      id={`take-pill-quick-${task.id}`}
                      className="px-2.5 py-1 text-[10px] font-pharmacy font-bold rounded-md bg-neutral-900 text-white hover:bg-black active:scale-95 shadow-xs transition-all opacity-85 group-hover:opacity-100 flex items-center gap-1"
                      title="Take pill and drop into water"
                    >
                      TAKE DOSE
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Pill Button at bottom of packet */}
          <div className="mt-4 pt-2 flex items-center justify-between border-t border-black/5">
            <AddTaskControl
              date={date}
              timePeriod={timePeriod}
              onAddTask={onAddTask}
            />

            {/* Subtle pouch ID code */}
            <span className="font-pharmacy text-[8px] text-neutral-400/80 tracking-widest uppercase select-none">
              LOT-{date.replace(/-/g, '')}-{timePeriod.slice(0, 3).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Subtle bottom crimp line */}
        <div className="h-1 pouch-heat-seal-h border-t border-black/10" />
      </div>

      {/* Bottom perforation boundary */}
      <div className="w-full h-2 flex items-center justify-center">
        <div className="w-full h-1.5 pinked-edge-bottom opacity-60" />
      </div>
    </div>
  );
};
