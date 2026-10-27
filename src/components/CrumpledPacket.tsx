import React from 'react';
import { motion } from 'motion/react';
import { ArchiveRecord } from '../types';
import { soundEffects } from '../utils/audio';

interface CrumpledPacketProps {
  record: ArchiveRecord;
  onClick: () => void;
}

export const CrumpledPacket: React.FC<CrumpledPacketProps> = ({
  record,
  onClick,
}) => {
  // Deterministic slight angle and crinkle based on seed
  const rotation = record.crumpleSeed % 2 === 0 ? -2.5 : 3.2;
  const isAllComplete = record.completedCount === record.totalCount;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, rotate: rotation > 0 ? rotation + 2 : rotation - 2, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        soundEffects.playPouchTear();
        onClick();
      }}
      id={`crumpled-packet-${record.date}`}
      className="relative text-left p-3.5 rounded-lg transition-shadow cursor-pointer select-none group focus:outline-none"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Crumpled Vinyl Pouch Body with creases and folds */}
      <div
        className="relative w-44 h-28 bg-white/70 backdrop-blur-[2px] rounded-md border border-neutral-300 shadow-[0_4px_10px_rgba(0,0,0,0.06),inset_0_1px_3px_rgba(255,255,255,0.9)] overflow-hidden"
        style={{
          boxShadow: '0 6px 14px -3px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.9)',
        }}
      >
        {/* Jagged Torn Open Mouth at the top of the used pouch */}
        <div className="absolute top-0 inset-x-0 h-3 overflow-hidden bg-neutral-200/50">
          <svg
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            className="w-full h-full fill-white/80 stroke-neutral-400/80 stroke-[0.6]"
          >
            <path d="M0,0 L6,5 L14,1 L20,6 L28,2 L35,5 L42,1 L50,7 L58,2 L66,6 L74,1 L82,6 L90,2 L100,5 L100,8 L0,8 Z" />
          </svg>
        </div>

        {/* Heat Seal Crimp at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-2.5 pouch-heat-seal-h border-t border-black/10 opacity-70" />

        {/* Diagonal Plastic Crease Lines (Simulating physical crumpling and folding) */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-4 left-2 w-32 h-[1px] bg-black/30 rotate-[24deg] shadow-[0_1px_1px_rgba(255,255,255,0.9)]" />
          <div className="absolute top-10 right-2 w-28 h-[1px] bg-black/25 -rotate-[18deg] shadow-[0_1px_1px_rgba(255,255,255,0.9)]" />
          <div className="absolute bottom-6 left-4 w-24 h-[1px] bg-black/20 rotate-[35deg]" />
          {/* Crumple shadow folds */}
          <div className="absolute top-8 left-10 w-16 h-10 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[2px]" />
        </div>

        {/* Printed Thermal Identification Text */}
        <div className="relative z-10 pt-4 px-3">
          <div className="flex items-center justify-between">
            <span className="font-pharmacy text-xs font-bold text-neutral-900 tracking-tight">
              {record.formattedDate}
            </span>
            <span
              className={`font-pharmacy text-[9px] font-bold px-1.5 py-0.5 rounded ${
                isAllComplete
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {record.completedCount}/{record.totalCount} DOSES
            </span>
          </div>

          <div className="font-pharmacy text-[9px] text-neutral-500 uppercase tracking-wider mt-1">
            USED PRESCRIPTION PACKET
          </div>

          {/* Quick pill preview micro dots */}
          <div className="mt-2.5 flex items-center gap-1">
            {record.tasks.slice(0, 5).map((t, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full border ${
                  t.completed
                    ? 'bg-neutral-800 border-neutral-900'
                    : 'bg-white border-neutral-400'
                }`}
              />
            ))}
            {record.tasks.length > 5 && (
              <span className="font-pharmacy text-[8px] text-neutral-400">
                +{record.tasks.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Shadow Cast onto drawer base */}
      <div className="absolute -bottom-1 inset-x-4 h-4 bg-black/10 rounded-full blur-[4px] pointer-events-none -z-10" />
    </motion.button>
  );
};
