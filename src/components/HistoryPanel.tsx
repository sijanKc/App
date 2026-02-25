"use client";

import { History, Trash2 } from "lucide-react";
import { HistoryEntry } from "@/lib/storage";

interface HistoryPanelProps {
    history: HistoryEntry[];
    onClear: () => void;
}

/**
 * Shows the last N typing sessions with date, WPM, accuracy, and mode.
 */
export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
    return (
        <div className="rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-blue-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                        History
                    </h3>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                        <Trash2 size={12} /> Clear
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <p className="text-gray-500 text-xs text-center py-4">
                    No sessions yet — start typing!
                </p>
            ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {history.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between text-xs
                px-3 py-2 rounded-lg bg-white/5 border border-white/5"
                        >
                            <span className="text-gray-400 truncate w-20">
                                {new Date(entry.date).toLocaleDateString()}
                            </span>
                            <span className={`capitalize font-medium ${entry.language === "nepali" ? "text-red-400" : "text-blue-400"
                                }`}>
                                {entry.language === "nepali" ? "नेपाली" : "EN"}
                            </span>
                            <span className="text-emerald-400 font-bold">{entry.wpm} WPM</span>
                            <span className="text-purple-400">{entry.accuracy}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
