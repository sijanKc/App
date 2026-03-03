"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Zap, Target, BarChart3 } from "lucide-react";
import KeyHeatmap from "./KeyHeatmap";

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
          bg-white/90 backdrop-blur-xl p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative w-full max-w-lg rounded-[48px] overflow-hidden
            border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]
            bg-white"
                >

                    <div className="p-12 flex flex-col items-center gap-10">
                        {/* Title */}
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mb-2 shadow-sm border border-amber-100">
                                <Trophy className="text-amber-500" size={40} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Session Complete</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                                {language} mode · {duration}s focus
                            </p>
                        </div>

                        {/* High Score Badge */}
                        {isNewHighScore && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                                className="px-8 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]
                  bg-amber-100 text-amber-900 border border-amber-200 italic"
                            >
                                🏆 New Record Established
                            </motion.div>
                        )}

                        {/* Lok Sewa Qualification Badge */}
                        {language === "nepali" && duration === 300 && (
                            <div className={`px-8 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] italic border ${wpm >= 30 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
                                {wpm >= 30 ? "✅ Lok Sewa Qualified" : "❌ Speed Deficiency"}
                            </div>
                        )}

                        <div className="w-full">
                            <KeyHeatmap language={language} />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 w-full">
                            <StatBox icon={<Zap size={22} className="text-indigo-600" />}
                                label="WPM" value={wpm} unit="words/min" color="text-slate-950" />
                            <StatBox icon={<Target size={22} className="text-rose-600" />}
                                label="Accuracy" value={accuracy} unit="percent" color="text-slate-950" />
                        </div>

                        {/* Restart */}
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRestart}
                            className="flex items-center gap-4 px-12 py-5 rounded-[24px]
                 bg-slate-950 text-white
                 font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-900 transition-all w-full justify-center uppercase tracking-widest border-b-4 border-slate-800"
                        >
                            <RotateCcw size={22} />
                            Restart Experience
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
        <div className="flex flex-col items-center gap-2 p-6 rounded-[28px] bg-slate-50 border border-slate-100">
            {icon}
            <span className={`text-4xl font-bold tracking-tight tabular-nums ${color}`}>{value}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</span>
        </div>
    );
}
