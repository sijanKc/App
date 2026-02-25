"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Zap, Target } from "lucide-react";

interface ResultCardProps {
    wpm: number;
    accuracy: number;
    duration: number;
    language: "nepali" | "english";
    isNewHighScore: boolean;
    onRestart: () => void;
}

/**
 * Full-screen overlay card shown at session end with WPM, accuracy,
 * and a "new high score" badge if applicable.
 */
export default function ResultCard({
    wpm,
    accuracy,
    duration,
    language,
    isNewHighScore,
    onRestart,
}: ResultCardProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/60 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-full max-w-md rounded-2xl overflow-hidden
            border border-slate-300 dark:border-white/10 shadow-2xl
            bg-white dark:bg-[#0f172a]"
                >

                    <div className="p-8 flex flex-col items-center gap-6">
                        {/* Title */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                            <Trophy className="text-yellow-500 dark:text-yellow-400" size={36} />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Session Complete!</h2>
                            <p className="text-slate-500 dark:text-gray-400 text-sm capitalize">
                                {language} · {duration}s mode
                            </p>
                        </div>

                        {/* New high score badge */}
                        {isNewHighScore && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                                className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                  bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900"
                            >
                                🏆 New High Score!
                            </motion.div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <StatBox icon={<Zap size={20} className="text-emerald-400" />}
                                label="WPM" value={wpm} unit="words/min" color="text-emerald-400" />
                            <StatBox icon={<Target size={20} className="text-purple-400" />}
                                label="Accuracy" value={accuracy} unit="percent" color="text-purple-400" />
                        </div>

                        {/* Restart */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRestart}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl
                 bg-slate-900 dark:bg-white text-white dark:text-slate-900
                 font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                        >
                            <RotateCcw size={18} />
                            Try Again
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function StatBox({
    icon, label, value, unit, color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    unit: string;
    color: string;
}) {
    return (
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {icon}
            <span className={`text-4xl font-mono font-bold tabular-nums ${color}`}>{value}</span>
            <span className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}
