import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TaskItem } from '../types';
import { Pill } from './Pill';
import { RotateCcw } from 'lucide-react';

interface CompletedPillProps {
  task: TaskItem;
  onUndo: (taskId: string) => void;
  index: number;
}

export const CompletedPill: React.FC<CompletedPillProps> = ({
  task,
  onUndo,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Deterministic organic resting position at the bottom of the glass
  const placement = task.glassPlacement || {
    xRatio: 0.15 + ((index * 0.28) % 0.7),
    yRatio: (index % 3) * 6,
    rotation: ((index * 23) % 45) - 22,
  };

  return (
    <div
      className="relative group cursor-pointer"
      style={{
        transform: `rotate(${placement.rotation}deg)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onUndo(task.id)}
      id={`completed-pill-${task.id}`}
      title={`Completed: ${task.title} (Click to retrieve / undo)`}
    >
      {/* Underwater Pill with aquatic refraction */}
      <motion.div
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative flex items-center justify-center"
      >
        <Pill
          shape={task.pillShape}
          appearance={task.pillAppearance}
          size="sm"
          isUnderwater={true}
        />

        {/* Underwater caustic caustic spot */}
        <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-[1px] pointer-events-none" />

        {/* Hover retrieve indicator */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white text-[9px] font-pharmacy py-0.5 px-2 rounded-full whitespace-nowrap shadow-md flex items-center gap-1 z-30 pointer-events-none"
          >
            <RotateCcw className="w-2.5 h-2.5 text-cyan-300" />
            <span>Retrieve</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
