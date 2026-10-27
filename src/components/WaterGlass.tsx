import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from '../types';
import { CompletedPill } from './CompletedPill';
import { soundEffects } from '../utils/audio';
import { Droplet, Info } from 'lucide-react';

interface WaterGlassProps {
  completedTasks: TaskItem[];
  onUndoTask: (taskId: string) => void;
  animatingPill?: {
    task: TaskItem;
    originRect?: DOMRect;
  } | null;
  onAnimationEnd?: () => void;
}

interface Bubble {
  id: number;
  x: number; // percentage
  size: number;
  duration: number;
  delay: number;
}

export const WaterGlass: React.FC<WaterGlassProps> = ({
  completedTasks,
  onUndoTask,
  animatingPill,
  onAnimationEnd,
}) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Trigger water disturbance and splash sound when a new pill arrives
  useEffect(() => {
    if (animatingPill) {
      // Delay slightly so splash happens as pill hits the water surface
      const timer = setTimeout(() => {
        setRipples((prev) => [...prev, Date.now()]);
        soundEffects.playWaterDrop();

        // Spawn dynamic bubble burst
        const newBubbles: Bubble[] = Array.from({ length: 7 }).map((_, i) => ({
          id: Date.now() + i,
          x: 30 + Math.random() * 40,
          size: 2 + Math.random() * 4,
          duration: 1.2 + Math.random() * 0.8,
          delay: i * 0.08,
        }));
        setBubbles((b) => [...b, ...newBubbles]);

        // Clean up ripples after wave finishes
        setTimeout(() => {
          setRipples((r) => r.filter((t) => Date.now() - t < 1500));
        }, 1600);

        setTimeout(() => {
          soundEffects.playBubble();
        }, 350);

        if (onAnimationEnd) {
          setTimeout(onAnimationEnd, 1000);
        }
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [animatingPill, onAnimationEnd]);

  // Ambient gentle bubbles rising occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const ambientBubble: Bubble = {
          id: Date.now(),
          x: 20 + Math.random() * 60,
          size: 2 + Math.random() * 3,
          duration: 2.2 + Math.random() * 1.5,
          delay: 0,
        };
        setBubbles((b) => [...b.slice(-8), ambientBubble]);
      }
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center select-none"
      id="water-glass-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Glass Label */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-black/10 shadow-xs">
          <Droplet className="w-3.5 h-3.5 text-cyan-600" />
          <span className="font-pharmacy text-[11px] font-bold text-neutral-800 uppercase tracking-tight">
            Taken Doses ({completedTasks.length})
          </span>
        </div>
        <p className="font-sans-ui text-[11px] text-neutral-500 mt-1">
          {completedTasks.length > 0
            ? 'Click any pill below to retrieve (undo)'
            : 'Water ready for daily medication'}
        </p>
      </div>

      {/* The Physical Glass */}
      <div className="relative w-48 h-72 sm:w-52 sm:h-80">
        {/* Glass Outer Cylinder */}
        <div
          className="absolute inset-0 rounded-b-[28px] rounded-t-[14px] border-2 border-white/60 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(240,249,255,0.15) 50%, rgba(255,255,255,0.25) 100%)',
            backdropFilter: 'blur(1.5px)',
            boxShadow:
              '0 20px 35px -10px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -4px 10px rgba(186,230,253,0.3)',
          }}
        >
          {/* Heavy Glass Bottom Puck (Thick solid glass base) */}
          <div
            className="absolute bottom-0 inset-x-0 h-9 rounded-b-[26px] border-t border-cyan-200/50"
            style={{
              background: 'linear-gradient(180deg, rgba(224,242,254,0.3) 0%, rgba(186,230,253,0.6) 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 6px rgba(0,0,0,0.06)',
            }}
          />

          {/* Left Specular Glass Wall Highlight (Curved vertical reflection) */}
          <div className="absolute top-2 bottom-8 left-3 w-3 bg-gradient-to-r from-white/70 to-transparent rounded-full blur-[1px] pointer-events-none z-30" />
          <div className="absolute top-2 bottom-8 right-3 w-1.5 bg-gradient-to-l from-white/40 to-transparent rounded-full blur-[0.5px] pointer-events-none z-30" />

          {/* Water Volume Body */}
          <div className="absolute top-16 bottom-9 inset-x-0 overflow-hidden z-10">
            {/* Water liquid tint */}
            <div className="absolute inset-0 glass-water-gradient opacity-90" />

            {/* Subtle underwater caustic ripples */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 50% 80%, rgba(56,189,248,0.5) 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 40%)',
              }}
            />

            {/* Rising Bubbles */}
            <AnimatePresence>
              {bubbles.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ y: 220, opacity: 0.8, x: `${b.x}%` }}
                  animate={{
                    y: -10,
                    opacity: 0,
                    x: `${b.x + (Math.random() * 10 - 5)}%`,
                  }}
                  transition={{
                    duration: b.duration,
                    delay: b.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute bottom-2 rounded-full bg-white/80 shadow-[0_0_2px_rgba(255,255,255,0.9)] pointer-events-none z-20"
                  style={{
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Completed Pills Resting at the Bottom */}
            <div className="absolute bottom-2 inset-x-3 min-h-[50px] flex flex-wrap items-end justify-center gap-2 p-1.5 z-20">
              <AnimatePresence>
                {completedTasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    layoutId={`pill-water-${task.id}`}
                    initial={{ y: -80, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -70, opacity: 0, scale: 0.6 }}
                    transition={{
                      type: 'spring',
                      damping: 18,
                      stiffness: 140,
                      mass: 0.8,
                    }}
                  >
                    <CompletedPill
                      task={task}
                      onUndo={onUndoTask}
                      index={idx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Water Surface Meniscus (The curved top water line) */}
          <div className="absolute top-16 inset-x-0 h-4 z-20 pointer-events-none">
            {/* Curved meniscus ellipse */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="w-full h-3 rounded-[50%] border-t-2 border-cyan-100/90 shadow-[0_1px_3px_rgba(255,255,255,0.8)]"
                style={{
                  background: 'linear-gradient(180deg, rgba(224,242,254,0.4) 0%, rgba(186,230,253,0.1) 100%)',
                }}
              />
            </div>

            {/* Ripple Disturbance Waves when pill drops */}
            {ripples.map((ripId) => (
              <motion.div
                key={ripId}
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute top-0 inset-x-4 h-3 rounded-[50%] border border-white/90 shadow-[0_0_4px_rgba(255,255,255,0.9)] pointer-events-none"
              />
            ))}
          </div>

          {/* Top Glass Rim Opening (Ellipse) */}
          <div
            className="absolute top-0 inset-x-0 h-5 rounded-[50%] border-2 border-white/80 z-30"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {/* Front rim highlight arc */}
            <div className="w-1/2 h-[2px] mx-auto mt-0.5 bg-white rounded-full blur-[0.4px]" />
          </div>
        </div>

        {/* Physical Cast Shadow of the Glass onto Tabletop */}
        <div className="absolute -bottom-3 inset-x-4 h-6 rounded-[50%] bg-neutral-900/10 blur-[6px] pointer-events-none -z-10" />
      </div>

      {/* Empty State Prompt */}
      {completedTasks.length === 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-neutral-400 font-pharmacy text-[10px]">
          <Info className="w-3 h-3" />
          <span>Doses taken today will rest here</span>
        </div>
      )}
    </div>
  );
};
