import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArchiveRecord } from '../types';
import { Pill } from './Pill';
import { X, CheckCircle2, Clock } from 'lucide-react';

interface ArchivedDayDetailProps {
  record: ArchiveRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArchivedDayDetail: React.FC<ArchivedDayDetailProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const completedTasks = record.tasks.filter((t) => t.completed);
  const incompleteTasks = record.tasks.filter((t) => !t.completed);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
        {/* Soft backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Inspection Sheet Popover */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md max-h-[85vh] bg-white rounded-2xl p-6 shadow-[0_25px_50px_rgba(0,0,0,0.2)] border border-neutral-200 overflow-hidden flex flex-col z-10 pointer-events-auto"
          id="archived-day-detail-modal"
          role="dialog"
          aria-modal="true"
        >
          {/* Header styled like a medical prescription record sheet */}
          <div className="flex items-start justify-between pb-4 border-b border-neutral-100 shrink-0">
            <div>
              <div className="font-pharmacy text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Archived Dose Log
              </div>
              <h2 className="font-pharmacy text-lg font-extrabold text-neutral-900 mt-0.5">
                {record.formattedDate}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-pharmacy text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                  {record.completedCount} of {record.totalCount} taken
                </span>
                <span className="font-sans-ui text-[11px] text-neutral-400">
                  Archived packet record
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              id="close-archive-detail-btn"
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close archive detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body with Completed and Incomplete sections */}
          <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
            {/* COMPLETED SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-pharmacy text-xs font-bold uppercase tracking-wider text-neutral-800">
                  COMPLETED ({completedTasks.length})
                </h3>
              </div>

              {completedTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-neutral-50 text-neutral-400 text-xs font-sans-ui text-center">
                  No completed doses recorded for this day.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/80 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0 flex items-center justify-center w-12 h-8">
                          <Pill
                            shape={task.pillShape}
                            appearance={task.pillAppearance}
                            size="sm"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-sans-ui text-xs font-semibold text-neutral-900 truncate">
                            {task.title}
                          </div>
                          {task.memo && (
                            <div className="font-sans-ui text-[11px] text-neutral-500 truncate mt-0.5">
                              {task.memo}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-pharmacy text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-600">
                          {task.timePeriod}
                        </span>
                        {task.completedAt && (
                          <div className="flex items-center gap-1 font-pharmacy text-[8px] text-emerald-600 mt-1 justify-end">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {new Date(task.completedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INCOMPLETE SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="font-pharmacy text-xs font-bold uppercase tracking-wider text-neutral-800">
                  INCOMPLETE ({incompleteTasks.length})
                </h3>
              </div>

              {incompleteTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-800 text-xs font-sans-ui text-center">
                  All prescribed doses were successfully taken on this day!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {incompleteTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-50/30 border border-amber-200/70 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0 flex items-center justify-center w-12 h-8 opacity-75">
                          <Pill
                            shape={task.pillShape}
                            appearance={task.pillAppearance}
                            size="sm"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="font-sans-ui text-xs font-semibold text-neutral-800 truncate">
                            {task.title}
                          </div>
                          {task.memo && (
                            <div className="font-sans-ui text-[11px] text-neutral-500 truncate mt-0.5">
                              {task.memo}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-pharmacy text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {task.timePeriod}
                        </span>
                        <div className="font-pharmacy text-[8px] text-amber-700/80 mt-1">
                          Unfinished
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-neutral-100 flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              id="done-inspecting-btn"
              className="px-5 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-black transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              Done Inspecting
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
