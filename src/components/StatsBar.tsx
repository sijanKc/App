"use client";

import { motion } from "framer-motion";

interface StatsBarProps {
    wpm: number;
    accuracy: number;
    timeLeft: number;
    duration: number;
}

const Stat = ({
    label,
    value,
    unit,
    color,
}: {
    label: string;
    value: number;
    unit: string;
    color: string;
}) => (
    <motion.div
        key={value}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center gap-1 px-4 py-3
      rounded-xl bg-slate-900/5 dark:bg-white/5 backdrop-blur-sm
      border border-slate-200 dark:border-white/10 min-w-[90px]"
    >
        <span className={`text-3xl font-mono font-bold tabular-nums ${color}`}>{value}</span>
        <span className="text-xs text-gray-300 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] text-gray-500">{unit}</span>
    </motion.div>
);

/**
 * Displays WPM, Accuracy, and Time Remaining in three styled stat cards.
 */
export default function StatsBar({ wpm, accuracy, timeLeft, duration }: StatsBarProps) {
    // Time turns red when <= 10 seconds remain
    const timeColor =
        timeLeft <= 10 && timeLeft > 0 ? "text-red-400" : "text-blue-300";

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            <Stat label="Speed" value={wpm} unit="WPM" color="text-emerald-400" />
            <Stat label="Accuracy" value={accuracy} unit="%" color="text-purple-400" />
            <Stat label="Time" value={timeLeft} unit="sec" color={timeColor} />
        </div>
    );
}
