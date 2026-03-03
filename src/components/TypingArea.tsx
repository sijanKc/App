"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { mapKeyToNepaliUnicode, isMappableKey } from "@/lib/nepali-unicode";

interface TypingAreaProps {
    passage: string;
    typedText: string;
    onType: (value: string) => void;
    isFinished: boolean;
    fontClass: string;
    language: "nepali" | "english";
    isLocked?: boolean;
    onStart?: () => void;
    targetWpm?: number;
}

/**
 * Renders the passage with per-character color coding:
 *   - green  → typed correctly
 *   - red    → typed incorrectly
 *   - blue underline → current cursor position
 *   - gray   → not yet typed
 *   - orange highlight → ghost racer (target WPM)
 */
export default function TypingArea({
    passage,
    typedText,
    onType,
    isFinished,
    fontClass,
    language,
    isLocked = false,
    onStart,
    targetWpm = 0,
}: TypingAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [ghostIndex, setGhostIndex] = React.useState(0);
    const ghostTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Ghost Racer logic
    useEffect(() => {
        if (targetWpm > 0 && !isLocked && !isFinished && typedText.length > 0) {
            const charsPerSecond = (targetWpm * 5) / 60;
            const intervalMs = 1000 / charsPerSecond;

            if (!ghostTimerRef.current) {
                ghostTimerRef.current = setInterval(() => {
                    setGhostIndex(prev => prev + 1);
                }, intervalMs);
            }
        } else if (isFinished || isLocked) {
            if (ghostTimerRef.current) {
                clearInterval(ghostTimerRef.current);
                ghostTimerRef.current = null;
            }
        }

        return () => {
            if (ghostTimerRef.current) {
                clearInterval(ghostTimerRef.current);
                ghostTimerRef.current = null;
            }
        };
    }, [targetWpm, isLocked, isFinished, typedText.length]);

    // Reset ghost when passage changes or restart
    useEffect(() => {
        setGhostIndex(0);
    }, [passage]);

    // Auto-focus the hidden textarea so typing starts immediately
    useEffect(() => {
        if (!isFinished && !isLocked) textareaRef.current?.focus();
    }, [isFinished, isLocked, passage]);

    const segments = React.useMemo(() => {
        if (!passage) return [];
        try {
            const segmenter = new Intl.Segmenter(language === "nepali" ? "ne" : "en", { granularity: "grapheme" });
            return Array.from(segmenter.segment(passage)).map(s => s.segment);
        } catch (e) {
            // Fallback for environments where Intl.Segmenter is not available
            return passage.split("");
        }
    }, [passage, language]);

    const typedSegments = React.useMemo(() => {
        if (!typedText) return [];
        try {
            const segmenter = new Intl.Segmenter(language === "nepali" ? "ne" : "en", { granularity: "grapheme" });
            return Array.from(segmenter.segment(typedText)).map(s => s.segment);
        } catch (e) {
            return typedText.split("");
        }
    }, [typedText, language]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isLocked || isFinished) return;

        // If in Nepali mode, we intercept alphabetical/punctuation keys to map them
        if (language === "nepali" && isMappableKey(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const mappedChar = mapKeyToNepaliUnicode(e.key);
            onType(typedText + mappedChar);
        }
    };

    return (
        <div className="relative w-full">
            {/* Target WPM Indicator */}
            {targetWpm > 0 && !isFinished && (
                <div className="absolute -top-6 left-0 right-0 flex justify-between px-2">
                    <span className="text-[10px] font-bold text-orange-500/50 uppercase tracking-widest">Ghost Racer: {targetWpm} WPM</span>
                    <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">Your Position</span>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
          ${fontClass} text-xl md:text-2xl leading-relaxed tracking-wide
          ${!isLocked && !isFinished ? 'p-8' : 'p-10'} rounded-[32px] border border-slate-200/60
          bg-white shadow-xl shadow-slate-200/40
          min-h-[140px] cursor-text select-none
          relative overflow-hidden transition-all duration-500
        `}
                onClick={() => textareaRef.current?.focus()}
            >

                <div className="relative z-10 flex flex-wrap gap-0">
                    {segments.map((char, index) => {
                        let colorClass = "text-slate-300"; // not yet typed

                        if (index < typedSegments.length) {
                            if (typedSegments[index] === char) {
                                colorClass = "text-emerald-600 font-medium"; // correct
                            } else {
                                colorClass =
                                    char === " "
                                        ? "bg-red-50 text-red-500 rounded-lg" // space error
                                        : "text-red-500 font-bold"; // wrong char
                            }
                        }

                        // Current cursor character
                        const isCurrent = index === typedSegments.length;

                        // Ghost Racer Position
                        const isGhost = targetWpm > 0 && index === ghostIndex && index >= typedSegments.length;

                        return (
                            <span
                                key={index}
                                className={`
                  ${colorClass}
                  ${isCurrent ? "border-b-4 border-indigo-400 -mb-1 animate-pulse" : ""}
                  ${isGhost ? "bg-amber-50 text-amber-600 border-b-4 border-amber-400/50 -mb-1" : ""}
                  ${char === " " ? "w-[0.5ch]" : ""}
                  transition-all duration-100
                `}
                            >
                                {char}
                            </span>
                        );
                    })}
                </div>
            </motion.div>

            {/* Hidden textarea captures actual input */}
            <textarea
                ref={textareaRef}
                value={typedText}
                onChange={(e) => {
                    // In English mode, let onChange handle it normally.
                    // In Nepali mode, handleKeyDown does most work, but mobile might use onChange.
                    if (language === "english") {
                        !isLocked && onType(e.target.value);
                    }
                }}
                onKeyDown={handleKeyDown}
                disabled={isFinished || isLocked}
                className="absolute opacity-0 top-0 left-0 w-full h-full resize-none cursor-default"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Typing area — ${language} mode`}
                lang={language === "nepali" ? "ne" : "en"}
            />


            {/* Overlay hint when finished */}
            {isFinished && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center rounded-[32px]
            bg-white/80 backdrop-blur-sm z-30"
                >
                    <span className="text-slate-900 text-3xl font-black drop-shadow-sm italic uppercase tracking-tighter">
                        ✓ Practice Complete
                    </span>
                </motion.div>
            )}

            {/* Start Overlay */}
            {isLocked && !isFinished && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-[32px]
            bg-white/40 backdrop-blur-sm"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="px-12 py-4 rounded-3xl bg-slate-950 text-white
                font-black text-xl shadow-2xl transition-all border border-slate-800 uppercase tracking-widest"
                    >
                        {language === "nepali" ? "सुरु गर्नुहोस्" : "Start Practice"}
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
