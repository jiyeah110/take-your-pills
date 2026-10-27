import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillShape, TaskItem } from '../types';
import { Pill } from './Pill';
import { soundEffects } from '../utils/audio';
import { Trash2, Check, X } from 'lucide-react';

interface TaskEditorProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: TaskItem) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

const PILL_OPTIONS: { shape: PillShape; label: string; primaryColor: string; secondaryColor?: string; imprint?: string }[] = [
  { shape: 'round-white', label: 'White Tablet', primaryColor: '#FDFEFE', imprint: '500' },
  { shape: 'two-tone-capsule', label: 'Blue / White Capsule', primaryColor: '#1E40AF', secondaryColor: '#F8FAFC', imprint: 'MED' },
  { shape: 'translucent-softgel', label: 'Amber Softgel', primaryColor: '#F59E0B' },
  { shape: 'oval-tablet', label: 'Peach Tablet', primaryColor: '#FB923C', imprint: 'ACT' },
  { shape: 'small-circle', label: 'Yellow Micro-tab', primaryColor: '#FBBF24', imprint: '81' },
  { shape: 'elongated-capsule', label: 'Emerald Capsule', primaryColor: '#059669', secondaryColor: '#FEF3C7', imprint: 'ECO' },
];

export const TaskEditor: React.FC<TaskEditorProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onComplete,
}) => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedShape, setSelectedShape] = useState<PillShape>('round-white');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setMemo(task.memo || '');
      setSelectedShape(task.pillShape);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    const selectedPreset = PILL_OPTIONS.find((p) => p.shape === selectedShape);
    onSave({
      ...task,
      title: title.trim(),
      memo: memo.trim() || undefined,
      pillShape: selectedShape,
      pillAppearance: {
        shape: selectedShape,
        primaryColor: selectedPreset?.primaryColor || task.pillAppearance.primaryColor,
        secondaryColor: selectedPreset?.secondaryColor || task.pillAppearance.secondaryColor,
        imprint: selectedPreset?.imprint || task.pillAppearance.imprint,
      },
    });
    soundEffects.playPillClick();
    onClose();
  };

  const handleTakePill = () => {
    onComplete(task.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Soft backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        />

        {/* Floating Physical-styled popover */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 8 }}
          transition={{ type: 'spring', damping: 26, stiffness: 350 }}
          className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.06)] border border-neutral-100 z-10"
          id="task-editor-modal"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="font-pharmacy text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                Dose Prescription
              </span>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-pharmacy uppercase">
                {task.timePeriod}
              </span>
            </div>
            <button
              onClick={onClose}
              id="close-task-editor-btn"
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pill Visual Preview */}
          <div className="py-4 flex flex-col items-center justify-center bg-[#FAFBFB] rounded-xl my-4 border border-neutral-100">
            <div className="scale-125 my-1">
              <Pill
                shape={selectedShape}
                appearance={
                  PILL_OPTIONS.find((p) => p.shape === selectedShape) || task.pillAppearance
                }
                size="lg"
              />
            </div>
            <span className="font-pharmacy text-[11px] text-neutral-500 mt-2">
              {PILL_OPTIONS.find((p) => p.shape === selectedShape)?.label}
            </span>
          </div>

          {/* Form */}
          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="edit-task-title"
                className="block font-pharmacy text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1"
              >
                Medication / Task Title
              </label>
              <input
                id="edit-task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Review tax accounting notes"
                className="w-full text-sm font-sans-ui font-medium text-neutral-900 border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="edit-task-memo"
                className="block font-pharmacy text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1"
              >
                Prescription Memo (Optional)
              </label>
              <textarea
                id="edit-task-memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
                placeholder="Dosage notes, instructions, or subtasks..."
                className="w-full text-xs font-sans-ui text-neutral-700 border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Pill Shape Selector */}
            <div>
              <span className="block font-pharmacy text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                Pill Appearance
              </span>
              <div className="grid grid-cols-6 gap-2">
                {PILL_OPTIONS.map((opt) => (
                  <button
                    key={opt.shape}
                    type="button"
                    onClick={() => {
                      setSelectedShape(opt.shape);
                      soundEffects.playPillClick();
                    }}
                    id={`select-pill-${opt.shape}`}
                    className={`h-12 flex items-center justify-center rounded-xl border transition-all ${
                      selectedShape === opt.shape
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 shadow-sm'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                    title={opt.label}
                  >
                    <Pill shape={opt.shape} appearance={opt} size="mini" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleTakePill}
              id="take-pill-btn"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors shadow-sm active:scale-[0.99]"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Take Pill & Drop in Water</span>
            </button>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                id="delete-task-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard Pill</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                id="save-task-btn"
                className="px-4 py-1.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
