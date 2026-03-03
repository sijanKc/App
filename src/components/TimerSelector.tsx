"use client";

import { motion } from "framer-motion";

const OPTIONS = [30, 60, 120] as const;

interface TimerSelectorProps {
    duration: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}

/**
 * Three-button selector for practice session duration (30s, 60s, 120s).
 * Disabled while a session is in progress.
 */
export default function TimerSelector({
    duration,
    onChange,
    disabled,
}: TimerSelectorProps) {
    return (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-100 shadow-sm">
            {OPTIONS.map((opt) => (
                <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !disabled && onChange(opt)}
                    disabled={disabled}
                    className={`
            px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 uppercase tracking-widest
            ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            ${duration === opt
                            ? "bg-slate-950 text-white shadow-md shadow-slate-200"
                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}
          `}
                >
                    {opt}s
                </motion.button>
            ))}
        </div>
    );
}
