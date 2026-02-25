"use client";

import { Trophy } from "lucide-react";
import { HighScore } from "@/lib/storage";

interface HighScorePanelProps {
    scores: HighScore[];
    language: "nepali" | "english";
}

/**
 * Shows top WPM scores for the current language mode from localStorage.
 */
export default function HighScorePanel({ scores, language }: HighScorePanelProps) {
    const filtered = scores
        .filter((s) => s.language === language)
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 5);

    return (
        <div className="rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-yellow-500 dark:text-yellow-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-widest">
                    Best Scores
                </h3>
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-4">
                    No records yet — start typing!
                </p>
            ) : (
                <ol className="space-y-2">
                    {filtered.map((s, i) => (
                        <li key={i} className="flex items-center justify-between
              text-sm px-3 py-2 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <span className="text-gray-400 w-5 font-mono">{i + 1}.</span>
                            <span className="font-bold text-emerald-400">{s.wpm} <span className="text-xs text-gray-500">WPM</span></span>
                            <span className="text-purple-400">{s.accuracy}%</span>
                            <span className="text-gray-500 text-xs">{s.duration}s</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
