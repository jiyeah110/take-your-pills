import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArchiveRecord } from '../types';
import { CrumpledPacket } from './CrumpledPacket';
import { ArchivedDayDetail } from './ArchivedDayDetail';
import { soundEffects } from '../utils/audio';
import { Archive, ChevronDown, ChevronUp } from 'lucide-react';

interface ArchiveDrawerProps {
  archives: ArchiveRecord[];
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({ archives }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(null);

  const toggleDrawer = () => {
    soundEffects.playPouchTear();
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className="fixed bottom-0 inset-x-0 z-40 flex flex-col items-center pointer-events-none"
        id="archive-cabinet-container"
      >
        {/* Visual Drawer Header / Pull Handle Bar (Always clickable) */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={toggleDrawer}
            id="archive-drawer-handle-btn"
            className="group relative -mb-1 px-6 py-2.5 bg-[#EAE8E3] hover:bg-[#E2DFD9] border-t-2 border-x-2 border-neutral-400/60 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center gap-3 transition-all cursor-pointer"
            style={{
              backgroundImage:
                'linear-gradient(180deg, #F3F1EC 0%, #E5E2DC 100%)',
            }}
            aria-expanded={isOpen}
            aria-label="Toggle archive medicine drawer"
          >
            {/* Metal Drawer Pull Handle (Brass/Matte Steel look) */}
            <div className="w-16 h-2 rounded-full bg-neutral-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.8)] border border-neutral-700/80 group-hover:scale-105 transition-transform" />

            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-neutral-700" />
              <span className="font-pharmacy text-xs font-bold tracking-wider text-neutral-800 uppercase">
                Used Packets Drawer ({archives.length})
              </span>
            </div>

            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-neutral-600 group-hover:translate-y-0.5 transition-transform" />
            ) : (
              <ChevronUp className="w-4 h-4 text-neutral-600 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>

        {/* Sliding Physical Drawer Box Tray */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="pointer-events-auto w-full max-w-4xl bg-[#DFDCD5] border-t-4 border-neutral-400/80 shadow-[0_-12px_40px_rgba(0,0,0,0.18),inset_0_4px_10px_rgba(0,0,0,0.1)] overflow-hidden"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #D7D4CC 0%, #E3E0D8 100%)',
              }}
            >
              {/* Drawer interior tray with felt rim and bevel */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-neutral-400/40 pb-2">
                  <div>
                    <span className="font-pharmacy text-xs font-extrabold uppercase tracking-widest text-neutral-800">
                      ARCHIVED USED PACKETS
                    </span>
                    <p className="font-sans-ui text-xs text-neutral-600 mt-0.5">
                      Click any crumpled packet to inspect past day prescription records
                    </p>
                  </div>

                  <span className="font-pharmacy text-[10px] text-neutral-500 uppercase bg-neutral-200/80 px-2 py-0.5 rounded">
                    DRAWER REPOSITORY
                  </span>
                </div>

                {archives.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="font-pharmacy text-xs text-neutral-500">
                      No crumpled packets archived yet. Past days will be stored here automatically.
                    </p>
                  </div>
                ) : (
                  /* The crumpled packets resting inside the drawer */
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 py-2 overflow-x-auto">
                    {archives.map((record) => (
                      <CrumpledPacket
                        key={record.date}
                        record={record}
                        onClick={() => setSelectedRecord(record)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Past Day Detail Modal rendered outside pointer-events-none container */}
      <ArchivedDayDetail
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </>
  );
};
