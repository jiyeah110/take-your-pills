import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillShape, TimePeriod, TaskItem } from '../types';
import { Pill } from './Pill';
import { soundEffects } from '../utils/audio';
import { Plus, X } from 'lucide-react';

interface AddTaskControlProps {
  date: string;
  timePeriod: TimePeriod;
  onAddTask: (newTask: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>) => void;
}

const PILL_OPTIONS: { shape: PillShape; label: string; primaryColor: string; secondaryColor?: string; imprint?: string }[] = [
  { shape: 'round-white', label: 'White Tablet', primaryColor: '#FFFFFF', imprint: '500' },
  { shape: 'two-tone-capsule', label: 'Blue / White Capsule', primaryColor: '#1E40AF', secondaryColor: '#F8FAFC', imprint: 'MED' },
  { shape: 'translucent-softgel', label: 'Amber Softgel', primaryColor: '#F59E0B' },
  { shape: 'oval-tablet', label: 'Peach Tablet', primaryColor: '#FB923C', imprint: 'ACT' },
  { shape: 'small-circle', label: 'Micro-tablet', primaryColor: '#FBBF24', imprint: '81' },
  { shape: 'elongated-capsule', label: 'Emerald Capsule', primaryColor: '#059669', secondaryColor: '#FEF3C7', imprint: 'ECO' },
];

export const AddTaskControl: React.FC<AddTaskControlProps> = ({
  date,
  timePeriod,
  onAddTask,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedShape, setSelectedShape] = useState<PillShape>('round-white');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const preset = PILL_OPTIONS.find((p) => p.shape === selectedShape);
    onAddTask({
      title: title.trim(),
      memo: memo.trim() || undefined,
      date,
      timePeriod,
      pillShape: selectedShape,
      pillAppearance: {
        shape: selectedShape,
        primaryColor: preset?.primaryColor || '#FFFFFF',
        secondaryColor: preset?.secondaryColor,
        imprint: preset?.imprint,
      },
    });

    soundEffects.playPillClick();
    setTitle('');
    setMemo('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => {
            setIsOpen(true);
            soundEffects.playPillClick();
          }}
          id={`add-pill-${timePeriod}-btn`}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-black/20 hover:border-black/50 bg-white/40 hover:bg-white/80 backdrop-blur-[1px] transition-all text-neutral-600 hover:text-black"
          aria-label={`Add pill to ${timePeriod} packet`}
        >
          <div className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:rotate-90">
            <Plus className="w-2.5 h-2.5" />
          </div>
          <span className="font-pharmacy text-[10px] tracking-wide font-medium">
            + INSERT PILL
          </span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            className="w-full bg-white/95 backdrop-blur-md rounded-xl p-4 border border-black/10 shadow-[0_12px_24px_rgba(0,0,0,0.08)] z-20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-pharmacy text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                New Prescription Dose
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dose item / task title..."
                autoFocus
                className="w-full text-xs font-sans-ui border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />

              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Optional dosage memo or notes..."
                className="w-full text-[11px] font-sans-ui border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />

              <div>
                <span className="block font-pharmacy text-[9px] text-neutral-400 font-semibold mb-1.5 uppercase">
                  Pill Type
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {PILL_OPTIONS.map((opt) => (
                    <button
                      key={opt.shape}
                      type="button"
                      onClick={() => setSelectedShape(opt.shape)}
                      className={`h-9 px-2 flex items-center justify-center rounded-lg border transition-all ${
                        selectedShape === opt.shape
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                      title={opt.label}
                    >
                      <Pill shape={opt.shape} appearance={opt} size="mini" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-3.5 py-1 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Dispense Pill
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
