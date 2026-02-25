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
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
            {OPTIONS.map((opt) => (
                <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !disabled && onChange(opt)}
                    disabled={disabled}
                    className={`
            px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${duration === opt
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-white/10"}
          `}
                >
                    {opt}s
                </motion.button>
            ))}
        </div>
    );
}
