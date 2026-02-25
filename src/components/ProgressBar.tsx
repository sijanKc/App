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
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{
                    background:
                        "linear-gradient(90deg, #dc143c 0%, #3b82f6 50%, #a855f7 100%)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${clamped}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
        </div>
    );
}
