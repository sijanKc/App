"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardVisualizerProps {
    language: "nepali" | "english";
}

import { NEPALI_UNICODE_ROMANIZED_MAP } from "@/lib/nepali-unicode";

const ROWS = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Space"],
];

const NEPALI_UNICODE_MAP = NEPALI_UNICODE_ROMANIZED_MAP;

const FINGER_COLORS: Record<string, string> = {
    "lp": "border-pink-200 bg-pink-50/50",   // Left Pinky
    "lr": "border-orange-200 bg-orange-50/50", // Left Ring
    "lm": "border-yellow-200 bg-yellow-50/50", // Left Middle
    "li": "border-emerald-200 bg-emerald-50/50", // Left Index
    "ri": "border-blue-200 bg-blue-50/50",   // Right Index
    "rm": "border-indigo-200 bg-indigo-50/50", // Right Middle
    "rr": "border-purple-200 bg-purple-50/50", // Right Ring
    "rp": "border-rose-200 bg-rose-50/50",    // Right Pinky
    "thumb": "border-slate-200 bg-slate-50/50", // Thumbs
};

const KEY_FINGER_MAP: Record<string, string> = {
    "`": "lp", "1": "lp", "q": "lp", "a": "lp", "z": "lp", "Tab": "lp", "CapsLock": "lp", "Shift": "lp",
    "2": "lr", "w": "lr", "s": "lr", "x": "lr",
    "3": "lm", "e": "lm", "d": "lm", "c": "lm",
    "4": "li", "5": "li", "r": "li", "t": "li", "f": "li", "g": "li", "v": "li", "b": "li",
    "6": "ri", "7": "ri", "y": "ri", "u": "ri", "h": "ri", "j": "ri", "n": "ri", "m": "ri",
    "8": "rm", "i": "rm", "k": "rm", ",": "rm",
    "9": "rr", "o": "rr", "l": "rr", ".": "rr",
    "0": "rp", "-": "rp", "=": "rp", "p": "rp", "[": "rp", "]": "rp", "\\": "rp", ";": "rp", "'": "rp", "/": "rp", "Backspace": "rp", "Enter": "rp",
    "Space": "thumb"
};

const FINGER_LABELS: Record<string, string> = {
    "lp": "Pinky", "lr": "Ring", "lm": "Middle", "li": "Index",
    "ri": "Index", "rm": "Middle", "rr": "Ring", "rp": "Pinky",
    "thumb": "Thumb"
};

// Simple visualizer with primary focus on QWERTY layout since that's what physical keyboards have
export default function KeyboardVisualizer({ language }: KeyboardVisualizerProps) {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isShiftDown, setIsShiftDown] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setActiveKey(e.key.toLowerCase());
            if (e.key === "Shift") setIsShiftDown(true);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setActiveKey((prev) => (prev === e.key.toLowerCase() ? null : prev));
            if (e.key === "Shift") setIsShiftDown(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const getKeyLabels = (key: string) => {
        if (key.length > 1) return { primary: key };

        if (language === "nepali") {
            const normal = NEPALI_UNICODE_MAP[key.toLowerCase()] || "";
            const shifted = NEPALI_UNICODE_MAP[key.toUpperCase()] || "";
            return { primary: normal, secondary: shifted, en: key };
        }
        return { primary: key };
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-8 rounded-[40px] bg-white border border-slate-100 mt-12 shadow-2xl shadow-slate-200/50">
            {/* Finger Guide Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Left Hand</span>
                    {["lp", "lr", "lm", "li"].map(f => (
                        <div key={f} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border ${FINGER_COLORS[f].split(' ')[0]} ${FINGER_COLORS[f].split(' ')[1].replace('bg-', 'bg-').replace('/50', '')}`} />
                            <span className="text-[10px] font-black text-slate-500">{FINGER_LABELS[f]}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Right Hand</span>
                    {["ri", "rm", "rr", "rp"].map(f => (
                        <div key={f} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border ${FINGER_COLORS[f].split(' ')[0]} ${FINGER_COLORS[f].split(' ')[1].replace('bg-', 'bg-').replace('/50', '')}`} />
                            <span className="text-[10px] font-black text-slate-500">{FINGER_LABELS[f]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {ROWS.map((row, i) => (
                    <div key={i} className="flex justify-center gap-2">
                        {row.map((key, j) => {
                            const normalizedKey = key === "Space" ? " " : key.toLowerCase();
                            const isActive = activeKey === normalizedKey;
                            const isSpecial = key.length > 1;
                            const { primary, secondary, en } = getKeyLabels(key);
                            const finger = KEY_FINGER_MAP[key] || (key === "Space" ? "thumb" : "");
                            const fingerStyle = finger ? FINGER_COLORS[finger] : "bg-slate-50 border-slate-100";

                            return (
                                <motion.div
                                    key={j}
                                    animate={{
                                        scale: isActive ? 0.94 : 1,
                                        y: isActive ? 2 : 0,
                                        boxShadow: isActive
                                            ? "inset 0 4px 10px rgba(0,0,0,0.1)"
                                            : "0 6px 0 rgb(241, 245, 249)"
                                    }}
                                    transition={{ duration: 0.1, type: "spring", stiffness: 400 }}
                                    className={`
                                        relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-150
                                        ${isActive
                                            ? "bg-slate-950 border-slate-950 text-white z-10"
                                            : `${fingerStyle} text-slate-900 border-b-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30`}
                                        ${isSpecial && key !== "Space" ? "px-5 py-2.5 text-[11px] font-black uppercase tracking-widest" : "w-12 h-12 md:w-16 md:h-16 text-base font-black"}
                                        ${key === "Space" ? "w-80 md:w-full max-w-[500px]" : ""}
                                        ${key === "Backspace" ? "w-28" : ""}
                                        ${key === "Tab" ? "w-20" : ""}
                                        ${key === "CapsLock" ? "w-24" : ""}
                                        ${key === "Enter" ? "w-28" : ""}
                                        ${["Shift"].includes(key) ? "w-32" : ""}
                                        cursor-default select-none border-b-[6px]
                                    `}
                                >
                                    {!isSpecial && language === "nepali" ? (
                                        <>
                                            <span className={`absolute top-2 right-2.5 text-[11px] ${isShiftDown || isActive ? "text-indigo-600 font-black" : "text-slate-300"}`}>
                                                {secondary}
                                            </span>
                                            <span className={`text-2xl leading-none ${!isShiftDown || isActive ? (isActive ? "text-white" : "text-slate-900") : "text-slate-200"}`}>
                                                {primary}
                                            </span>
                                            <span className={`absolute bottom-2 left-2.5 text-[10px] uppercase font-mono ${isActive ? "text-white/40" : "text-slate-300"}`}>
                                                {en}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-mono font-black">{primary}</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-10 text-[10px] text-slate-400 uppercase tracking-widest font-black border-t border-slate-50 pt-8">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-950 shadow-lg" />
                    <span>Current Key</span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 italic">
                    {language === "nepali" ? "Nepali Romanized Layout" : "Standard QWERTY Layout"}
                </div>
            </div>
        </div>
    );
}
