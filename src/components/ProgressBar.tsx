"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number; // 0–100
}

/**
 * A smooth animated progress bar that fills horizontally as the user types.
 */
export default function ProgressBar({ progress }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50 shadow-inner">
            <motion.div
                className="h-full rounded-full"
                style={{
                    background: "linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${clamped}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
        </div>
    );
}
