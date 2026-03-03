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
        className="flex flex-col items-center gap-1 px-6 py-4
      rounded-3xl bg-white shadow-sm border border-slate-200/60 min-w-[110px]"
    >
        <span className={`text-3xl font-bold tracking-tight tabular-nums ${color}`}>{value}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</span>
    </motion.div>
);

/**
 * Displays WPM, Accuracy, and Time Remaining in three styled stat cards.
 */
export default function StatsBar({ wpm, accuracy, timeLeft, duration }: StatsBarProps) {
    // Time turns red when <= 10 seconds remain
    const timeColor =
        timeLeft <= 10 && timeLeft > 0 ? "text-red-500" : "text-indigo-600";

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            <Stat label="WPM" value={wpm} unit="WPM" color="text-emerald-600" />
            <Stat label="Accuracy" value={accuracy} unit="%" color="text-slate-700" />
            <Stat label="Time" value={timeLeft} unit="sec" color={timeColor} />
        </div>
    );
}
