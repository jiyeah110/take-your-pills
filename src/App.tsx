import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TaskItem, ArchiveRecord, TimePeriod } from './types';
import {
  loadStoredTasks,
  saveStoredTasks,
  loadStoredArchives,
  saveStoredArchives,
  loadStoredCurrentDate,
  saveStoredCurrentDate,
  loadStoredTornPackets,
  saveStoredTornPackets,
  resetAllStorage,
} from './utils/storage';
import { getCurrentTimePeriod, addDays, formatPharmacyDate } from './utils/dateHelpers';
import { INITIAL_TASKS, INITIAL_ARCHIVES, INITIAL_DATE } from './data/initialData';
import { DaySection } from './components/DaySection';
import { WaterGlass } from './components/WaterGlass';
import { TaskEditor } from './components/TaskEditor';
import { ArchiveDrawer } from './components/ArchiveDrawer';
import { FlyingPillOverlay, FlyingPillData } from './components/FlyingPillOverlay';
import { soundEffects } from './utils/audio';
import { Volume2, VolumeX, CalendarDays, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState<string>(loadStoredCurrentDate);
  const [tasks, setTasks] = useState<TaskItem[]>(loadStoredTasks);
  const [archives, setArchives] = useState<ArchiveRecord[]>(loadStoredArchives);
  const [tornPackets, setTornPackets] = useState<Record<string, boolean>>(loadStoredTornPackets);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>(getCurrentTimePeriod);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modal editor state
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Flying pill animation state
  const [flyingPill, setFlyingPill] = useState<FlyingPillData | null>(null);

  // Ref to the glass for coordinate targeting
  const glassRef = useRef<HTMLDivElement>(null);

  // Sync state to local storage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredArchives(archives);
  }, [archives]);

  useEffect(() => {
    saveStoredCurrentDate(currentDate);
  }, [currentDate]);

  useEffect(() => {
    saveStoredTornPackets(tornPackets);
  }, [tornPackets]);

  // Update current time period periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPeriod(getCurrentTimePeriod());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Display 3 continuous days on the roll (Current Day, Day+1, Day+2)
  const displayedDates = [
    currentDate,
    addDays(currentDate, 1),
    addDays(currentDate, 2),
  ];

  // Helper to mark a packet as torn
  const markPacketTorn = useCallback((date: string, period: TimePeriod) => {
    const key = `${date}-${period}`;
    setTornPackets((prev) => ({ ...prev, [key]: true }));
    soundEffects.playPouchTear();
  }, []);

  // Handle task completion with realistic flight to water glass
  const handleCompleteTask = useCallback(
    (taskId: string, triggerElement?: HTMLElement | null) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.completed) return;

      // Mark the packet open/torn
      markPacketTorn(task.date, task.timePeriod);

      // Determine starting coordinates
      let startCoords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        startCoords = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      // Determine target coordinates (top surface opening of water glass)
      let targetCoords = { x: window.innerWidth - 180, y: 220 };
      const glassElem = document.getElementById('water-glass-container');
      if (glassElem) {
        const gRect = glassElem.getBoundingClientRect();
        targetCoords = {
          x: gRect.left + gRect.width / 2,
          y: gRect.top + 95, // hits water surface
        };
      }

      // Start flight animation
      setFlyingPill({
        task,
        startCoords,
        targetCoords,
        isReversing: false,
      });

      // After flight lands in water (approx 550ms), commit completion state
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completed: true,
                  completedAt: new Date().toISOString(),
                  glassPlacement: {
                    xRatio: 0.15 + (Math.random() * 0.7),
                    yRatio: Math.random() * 8,
                    rotation: Math.floor(Math.random() * 50) - 25,
                  },
                }
              : t
          )
        );
      }, 550);
    },
    [tasks, markPacketTorn]
  );

  // Handle task undo: pill rises from water back to packet
  const handleUndoTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || !task.completed) return;

      // Find origin packet element
      const packetElem = document.getElementById(`packet-${task.date}-${task.timePeriod}`);
      let targetCoords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (packetElem) {
        const pRect = packetElem.getBoundingClientRect();
        targetCoords = {
          x: pRect.left + pRect.width / 2,
          y: pRect.top + 70,
        };
      }

      let startCoords = { x: window.innerWidth - 180, y: 280 };
      const pillInWater = document.getElementById(`completed-pill-${taskId}`);
      if (pillInWater) {
        const wRect = pillInWater.getBoundingClientRect();
        startCoords = {
          x: wRect.left + wRect.width / 2,
          y: wRect.top + wRect.height / 2,
        };
      }

      // Trigger reverse flight
      setFlyingPill({
        task,
        startCoords: targetCoords,
        targetCoords: startCoords,
        isReversing: true,
      });

      soundEffects.playPillClick();

      // Commit uncompleted state
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completed: false,
                  completedAt: undefined,
                  glassPlacement: undefined,
                }
              : t
          )
        );
      }, 500);
    },
    [tasks]
  );

  // Add a new task to a packet
  const handleAddTask = useCallback(
    (newTask: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>) => {
      const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const task: TaskItem = {
        ...newTask,
        id,
        completed: false,
      };
      setTasks((prev) => [...prev, task]);
    },
    []
  );

  // Update existing task
  const handleSaveTask = useCallback((updated: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  // Delete task
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    soundEffects.playPillClick();
  }, []);

  // Prototype / Demo Control: Advance Day Transition
  // Yesterday crumples into a used packet, enters drawer, and today advances
  const handleAdvanceDay = useCallback(() => {
    const todayTasks = tasks.filter((t) => t.date === currentDate);
    const completedCount = todayTasks.filter((t) => t.completed).length;

    // Create archive record for passing day
    const newArchive: ArchiveRecord = {
      date: currentDate,
      formattedDate: formatPharmacyDate(currentDate),
      tasks: todayTasks,
      completedCount,
      totalCount: todayTasks.length,
      archivedAt: new Date().toISOString(),
      crumpleSeed: Math.floor(Math.random() * 100),
    };

    setArchives((prev) => [newArchive, ...prev]);

    // Advance current date to next day
    const nextDate = addDays(currentDate, 1);
    setCurrentDate(nextDate);

    soundEffects.playPouchTear();
  }, [currentDate, tasks]);

  // Reset to initial prototype state (back to today's packets and pristine state)
  const handleResetData = useCallback(() => {
    resetAllStorage();
    setCurrentDate(INITIAL_DATE);
    setTasks(INITIAL_TASKS.map((t) => ({ ...t, completed: false, completedAt: undefined, glassPlacement: undefined })));
    setArchives(INITIAL_ARCHIVES);
    setTornPackets({});
    setEditingTask(null);
    setFlyingPill(null);
    soundEffects.playPillClick();
  }, []);

  // Toggle sound effects
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
  };

  // Completed pills for the active day (and current session) visible in the water glass
  const completedPillsInGlass = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans-ui pb-28">
      {/* Top Physical Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white shadow-xs">
              <span className="font-pharmacy font-black text-sm">Rx</span>
            </div>
            <div>
              <h1 className="font-pharmacy text-sm font-extrabold uppercase tracking-tight text-neutral-900 leading-none">
                Medication Packet To-Do
              </h1>
              <span className="font-pharmacy text-[10px] text-neutral-400 tracking-wider uppercase block mt-0.5">
                Physical Dose Packaging • ATPS Format
              </span>
            </div>
          </div>

          {/* Minimal Controls */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              id="toggle-audio-btn"
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title={soundEnabled ? 'Mute physical audio' : 'Enable physical audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Prototype Demo Day Transition Control */}
            <button
              onClick={handleAdvanceDay}
              id="advance-day-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              title="Crumple current day into archive drawer & advance to next day"
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Simulate Next Day</span>
              <span className="sm:hidden">Next Day</span>
            </button>

            {/* Reset to Today */}
            <button
              onClick={handleResetData}
              id="reset-demo-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Reset all packets back to today's doses"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Reset to Today</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10 items-start justify-center">
        {/* Left / Center Column: Continuous Roll of Transparent Medicine Strips */}
        <div className="w-full lg:max-w-md xl:max-w-lg flex-1 flex flex-col items-center">
          {/* Packaging dispenser guide text */}
          <div className="mb-4 text-center select-none">
            <span className="font-pharmacy text-[10px] text-neutral-400 uppercase tracking-widest bg-white/70 px-3 py-1 rounded-full border border-neutral-200">
              DISPENSARY ROLL • CONTINUOUS VERTICAL STRIP
            </span>
          </div>

          {/* Render continuous days (Today, Tomorrow, Day after) */}
          {displayedDates.map((date, idx) => {
            const dayTasks = tasks.filter((t) => t.date === date);
            const isToday = date === currentDate;

            // Collect torn state for each period on this day
            const dayTornPackets: Record<TimePeriod, boolean> = {
              morning: !!tornPackets[`${date}-morning`],
              afternoon: !!tornPackets[`${date}-afternoon`],
              evening: !!tornPackets[`${date}-evening`],
            };

            return (
              <DaySection
                key={date}
                date={date}
                tasks={dayTasks}
                currentPeriod={currentPeriod}
                isToday={isToday}
                tornPackets={dayTornPackets}
                onSelectPill={setEditingTask}
                onCompletePill={handleCompleteTask}
                onAddTask={handleAddTask}
                showDividerBelow={idx < displayedDates.length - 1}
              />
            );
          })}
        </div>

        {/* Right Column: Realistic Glass of Water (Persistent Docked Companion) */}
        <div className="w-full lg:w-72 xl:w-80 lg:sticky lg:top-24 flex flex-col items-center justify-center pt-2">
          <div ref={glassRef}>
            <WaterGlass
              completedTasks={completedPillsInGlass}
              onUndoTask={handleUndoTask}
              animatingPill={flyingPill ? { task: flyingPill.task } : null}
            />
          </div>

          {/* Guidance note under water glass */}
          <div className="mt-8 max-w-xs text-center select-none bg-white/50 border border-neutral-200/60 rounded-xl p-3.5">
            <div className="flex items-center justify-center gap-1.5 text-neutral-700 font-pharmacy text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Physical Pill Mechanics</span>
            </div>
            <p className="font-sans-ui text-xs text-neutral-500 leading-relaxed">
              Doses leave the transparent packet when taken, splashing into the tumbler. Click any resting pill in the water to retrieve it back into its pouch.
            </p>
          </div>
        </div>
      </main>

      {/* Persistent Archive Drawer at the bottom */}
      <ArchiveDrawer archives={archives} />

      {/* Floating Pill Animation Overlay */}
      <FlyingPillOverlay
        flyingPill={flyingPill}
        onAnimationComplete={() => setFlyingPill(null)}
      />

      {/* Lightweight Task / Dose Detail Editor Popover */}
      <TaskEditor
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onComplete={(taskId) => {
          handleCompleteTask(taskId);
        }}
      />
    </div>
  );
}
