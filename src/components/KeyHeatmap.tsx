"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { getKeyErrors } from "@/lib/storage";

interface KeyHeatmapProps {
    language: "nepali" | "english";
}

export default function KeyHeatmap({ language }: KeyHeatmapProps) {
    const errors = useMemo(() => getKeyErrors(), []);

    const sortedKeys = useMemo(() => {
        return Object.entries(errors)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8); // Top 8 problem keys
    }, [errors]);

    if (sortedKeys.length === 0) return null;

    const maxErrors = sortedKeys[0][1];

    return (
        <div className="w-full space-y-5 p-6 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Problem Keys</h3>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Focus Areas</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {sortedKeys.map(([key, count]) => {
                    const intensity = (count / maxErrors) * 100;
                    return (
                        <motion.div
                            key={key}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 border border-white relative overflow-hidden shadow-sm"
                        >
                            {/* Heat gradient background */}
                            <div
                                className="absolute inset-0 bg-rose-200"
                                style={{ opacity: Math.max(0.1, intensity / 100) }}
                            />

                            <span className="text-xl font-black text-slate-950 relative z-10 italic">{key === " " ? "SPC" : key}</span>
                            <span className="text-[9px] font-black text-slate-500 relative z-10 uppercase tracking-tighter">{count} ERR</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
