"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyboardVisualizerProps {
    language: "nepali" | "english";
}

const ROWS = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Space"],
];

const NEPALI_UNICODE_MAP: Record<string, string> = {
    "q": "त्र", "w": "ध", "e": "भ", "r": "च", "t": "त", "y": "थ", "u": "ग", "i": "ष", "o": "य", "p": "उ",
    "a": "ब", "s": "क", "d": "म", "f": "ा", "g": "न", "h": "ज", "j": "व", "k": "प", "l": "ि", ";": "स", "'": "ु",
    "z": "श", "x": "ह", "c": "अ", "v": "ख", "b": "द", "n": "ल", "m": "ा", ",": "ो", ".": "ौ", "/": "र",
    "Q": "त्त", "W": "द्ध", "E": "भ्", "R": "च्", "T": "त्", "Y": "थ्", "U": "ग्", "I": "ष्", "O": "य्", "P": "ऊ",
    "A": "ब्", "S": "क्", "D": "म्", "F": "ँ", "G": "न्", "H": "ज्", "J": "व्", "K": "प्", "L": "ी", ":": "स्", "\"": "ू",
    "Z": "श्", "X": "ह्", "C": "आ", "V": "ख्", "B": "द्", "N": "ल्", "M": "ा", "<": "ओ", ">": "औ", "?": "र्",
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

    const getKeyLabel = (key: string) => {
        if (key.length > 1) return key;
        if (language === "nepali") {
            const char = isShiftDown ? key.toUpperCase() : key;
            return NEPALI_UNICODE_MAP[char] || key;
        }
        return key;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mt-8">
            <div className="flex flex-col gap-2">
                {ROWS.map((row, i) => (
                    <div key={i} className="flex justify-center gap-1.5">
                        {row.map((key, j) => {
                            const isActive = activeKey === key.toLowerCase() || (key === "Space" && activeKey === " ");
                            const isSpecial = key.length > 1;

                            return (
                                <div
                                    key={j}
                                    className={`
                    flex flex-col items-center justify-center rounded-lg border transition-all duration-100
                    ${isActive
                                            ? "bg-blue-600 border-blue-400 text-white translate-y-0.5 shadow-inner"
                                            : "bg-white/5 border-white/10 text-gray-400"}
                    ${isSpecial && key !== "Space" ? "px-3 py-2 text-[10px]" : "w-10 h-10 md:w-12 md:h-12 text-sm"}
                    ${key === "Space" ? "w-64" : ""}
                    ${key === "Backspace" ? "w-20" : ""}
                    ${key === "Tab" ? "w-16" : ""}
                    ${key === "CapsLock" ? "w-20" : ""}
                    ${key === "Enter" ? "w-20" : ""}
                    ${key === "Shift" ? "w-24" : ""}
                  `}
                                >
                                    <span className="font-mono">{getKeyLabel(key)}</span>
                                    {!isSpecial && language === "nepali" && (
                                        <span className="text-[10px] opacity-30 mt-0.5">{key}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Active Key</span>
                </div>
                <div>
                    Layout: {language === "nepali" ? "Nepali Unicode" : "English QWERTY"}
                </div>
            </div>
        </div>
    );
}
