"use client";

import React, { useMemo } from "react";
import { getHistory } from "@/lib/storage";
import { TrendingUp, Activity } from "lucide-react";

export default function ProgressInsights() {
    const history = useMemo(() => getHistory().reverse(), []);

    if (history.length < 2) return (
        <div className="p-10 rounded-[32px] bg-white border border-slate-100 flex flex-col items-center gap-4 text-center shadow-xl shadow-slate-200/50">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <Activity size={32} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed italic">
                Complete at least 2 sessions to see your progress chart!
            </p>
        </div>
    );

    const wpms = history.map(h => h.wpm);
    const maxWpm = Math.max(...wpms, 60);
    const minWpm = Math.min(...wpms);

    const width = 400;
    const height = 150;
    const padding = 20;

    const points = wpms.map((wpm, i) => {
        const x = padding + (i / (wpms.length - 1)) * (width - padding * 2);
        const y = (height - padding) - ((wpm - 0) / (maxWpm - 0)) * (height - padding * 2);
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="p-8 rounded-[32px] bg-white border border-slate-100 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <TrendingUp size={16} className="text-emerald-600" />
                    </div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic">WPM Trend</h3>
                </div>
                <span className="text-2xl font-black text-slate-900 italic">{history[history.length - 1].wpm} <span className="text-[10px] text-slate-400 uppercase tracking-widest not-italic ml-1">LATEST</span></span>
            </div>

            <div className="relative w-full overflow-hidden px-1">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-50" strokeWidth="2" strokeDasharray="6" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-50" strokeWidth="2" />

                    {/* The Line */}
                    <polyline
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        className="drop-shadow-lg"
                    />

                    {/* Data Points */}
                    {wpms.map((h, i) => {
                        const [x, y] = points.split(" ")[i].split(",");
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#4F46E5"
                                className="stroke-white stroke-2 shadow-sm"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4 border-t border-slate-50 italic">
                <span>Origin</span>
                <span>Present</span>
            </div>
        </div>
    );
}
