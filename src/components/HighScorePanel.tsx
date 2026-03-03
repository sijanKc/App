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
        <div className="rounded-[32px] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Trophy size={16} className="text-amber-500" />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">
                    Best Performances
                </h3>
            </div>

            {filtered.length === 0 ? (
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center py-8 italic border-2 border-dashed border-slate-50 rounded-2xl">
                    No records yet — start typing!
                </p>
            ) : (
                <ol className="space-y-3">
                    {filtered.map((s, i) => (
                        <li key={i} className="flex items-center justify-between
              text-xs px-4 py-3 rounded-2xl bg-slate-50 border border-white hover:border-indigo-100 transition-all shadow-sm">
                            <span className="text-slate-300 w-5 font-black italic">{i + 1}.</span>
                            <span className="font-black text-slate-950 italic">{s.wpm} <span className="text-[10px] text-slate-400 uppercase tracking-tighter not-italic ml-1">WPM</span></span>
                            <span className="text-indigo-600 font-black italic">{s.accuracy}%</span>
                            <span className="text-slate-400 font-black">{s.duration}s</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
