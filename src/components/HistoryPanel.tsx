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
        <div className="rounded-[32px] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <History size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">
                        Session Log
                    </h3>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-[10px] font-black text-rose-600 hover:bg-rose-100 transition-all uppercase tracking-widest"
                    >
                        <Trash2 size={12} /> Clear
                    </button>
                )}
            </div>

            {history.length === 0 ? (
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center py-8 italic border-2 border-dashed border-slate-50 rounded-2xl">
                    No records found
                </p>
            ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {history.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between text-[11px]
                px-4 py-3 rounded-2xl bg-slate-50 border border-white hover:border-indigo-100 transition-all shadow-sm"
                        >
                            <span className="text-slate-400 font-black italic">
                                {new Date(entry.date).toLocaleDateString()}
                            </span>
                            <span className={`capitalize font-black italic ${entry.language === "nepali" ? "text-rose-600" : "text-indigo-600"
                                }`}>
                                {entry.language === "nepali" ? "NP" : "EN"}
                            </span>
                            <span className="text-slate-950 font-black">{entry.wpm} <span className="text-[9px] text-slate-400 uppercase not-italic">WPM</span></span>
                            <span className="text-emerald-600 font-black italic">{entry.accuracy}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
