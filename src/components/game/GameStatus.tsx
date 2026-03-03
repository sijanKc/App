"use client";

import React from "react";
import { useGame } from "@/context/GameContext";
import { calculateLevelProgress, XP_PER_LEVEL } from "@/lib/gameEngine";
import { motion } from "framer-motion";

export function LevelBadge() {
    const { level } = useGame();
    return (
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-950 text-white font-black shadow-xl border-2 border-white italic">
            {level}
        </div>
    );
}

export function XPBar() {
    const { xp, level } = useGame();
    const progress = calculateLevelProgress(xp);
    const percentage = (progress / XP_PER_LEVEL) * 100;

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-end text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                <span>Rank {level}</span>
                <span>{progress} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"
                />
            </div>
        </div>
    );
}
