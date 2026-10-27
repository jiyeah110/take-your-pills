import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from '../types';
import { Pill } from './Pill';

export interface FlyingPillData {
  task: TaskItem;
  startCoords: { x: number; y: number };
  targetCoords: { x: number; y: number };
  isReversing?: boolean; // undo animation
}

interface FlyingPillOverlayProps {
  flyingPill: FlyingPillData | null;
  onAnimationComplete: () => void;
}

export const FlyingPillOverlay: React.FC<FlyingPillOverlayProps> = ({
  flyingPill,
  onAnimationComplete,
}) => {
  const [phase, setPhase] = useState<'flying' | 'sinking' | 'done'>('flying');

  useEffect(() => {
    if (flyingPill) {
      setPhase('flying');
      // After flight, pill plunges into water
      const timer1 = setTimeout(() => {
        setPhase('sinking');
      }, 550);

      const timer2 = setTimeout(() => {
        setPhase('done');
        onAnimationComplete();
      }, 950);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [flyingPill, onAnimationComplete]);

  if (!flyingPill || phase === 'done') return null;

  const { task, startCoords, targetCoords, isReversing } = flyingPill;

  // Flight trajectory keyframes
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {!isReversing ? (
          /* FORWARD: Pill leaves packet, arcs toward water glass, plunges down */
          <motion.div
            key={`flying-forward-${task.id}`}
            initial={{
              x: startCoords.x,
              y: startCoords.y,
              scale: 1,
              rotate: 0,
              opacity: 1,
            }}
            animate={
              phase === 'flying'
                ? {
                    x: [startCoords.x, (startCoords.x + targetCoords.x) / 2, targetCoords.x],
                    y: [startCoords.y, Math.min(startCoords.y, targetCoords.y) - 60, targetCoords.y],
                    scale: [1, 1.15, 0.9],
                    rotate: [0, 45, 120],
                    opacity: 1,
                  }
                : {
                    x: targetCoords.x,
                    y: targetCoords.y + 110, // plunge into bottom of glass
                    scale: 0.75,
                    rotate: 150,
                    opacity: 0.95,
                  }
            }
            transition={{
              duration: phase === 'flying' ? 0.55 : 0.4,
              ease: phase === 'flying' ? 'easeInOut' : 'easeOut',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"
          >
            <Pill
              shape={task.pillShape}
              appearance={task.pillAppearance}
              size="md"
              isUnderwater={phase === 'sinking'}
            />
          </motion.div>
        ) : (
          /* REVERSE (UNDO): Pill rises out of water, arcs back to original packet */
          <motion.div
            key={`flying-reverse-${task.id}`}
            initial={{
              x: targetCoords.x,
              y: targetCoords.y + 110,
              scale: 0.75,
              rotate: 150,
              opacity: 1,
            }}
            animate={{
              x: [targetCoords.x, (targetCoords.x + startCoords.x) / 2, startCoords.x],
              y: [targetCoords.y + 110, Math.min(startCoords.y, targetCoords.y) - 50, startCoords.y],
              scale: [0.75, 1.1, 1],
              rotate: [150, 75, 0],
              opacity: 1,
            }}
            transition={{
              duration: 0.65,
              ease: 'easeInOut',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-xl"
          >
            <Pill
              shape={task.pillShape}
              appearance={task.pillAppearance}
              size="md"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
