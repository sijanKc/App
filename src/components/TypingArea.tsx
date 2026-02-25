"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypingAreaProps {
    passage: string;
    typedText: string;
    onType: (value: string) => void;
    isFinished: boolean;
    fontClass: string;
    language: "nepali" | "english";
    isLocked?: boolean;
    onStart?: () => void;
}

/**
 * Renders the passage with per-character color coding:
 *   - green  → typed correctly
 *   - red    → typed incorrectly
 *   - blue underline → current cursor position
 *   - gray   → not yet typed
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
}: TypingAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    return (
        <div className="relative w-full">
            {/* Visible passage display */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
          ${fontClass} text-xl md:text-2xl leading-relaxed tracking-wide
          p-6 rounded-2xl border-2 border-slate-300 dark:border-white/10
          bg-white/50 dark:bg-black/20 backdrop-blur-md
          min-h-[140px] cursor-text select-none
          relative overflow-hidden
        `}
                onClick={() => textareaRef.current?.focus()}
            >

                <div className="relative z-10 flex flex-wrap gap-0">
                    {segments.map((char, index) => {
                        let colorClass = "text-slate-400 dark:text-gray-500"; // not yet typed

                        if (index < typedSegments.length) {
                            if (typedSegments[index] === char) {
                                colorClass = "text-emerald-400"; // correct
                            } else {
                                colorClass =
                                    char === " "
                                        ? "bg-red-400/40 text-red-300 rounded-sm" // space error
                                        : "text-red-400"; // wrong char
                            }
                        }

                        // Current cursor character
                        const isCurrent = index === typedSegments.length;

                        return (
                            <span
                                key={index}
                                className={`
                  ${colorClass}
                  ${isCurrent ? "border-b-2 border-blue-400 animate-pulse" : ""}
                  ${char === " " ? "w-[0.5ch]" : ""}
                  transition-colors duration-75
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
                onChange={(e) => !isLocked && onType(e.target.value)}
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
                    className="absolute inset-0 flex items-center justify-center rounded-2xl
            bg-black/40 backdrop-blur-sm"
                >
                    <span className="text-white text-2xl font-bold drop-shadow-lg">
                        ✓ Complete!
                    </span>
                </motion.div>
            )}

            {/* Start Overlay */}
            {isLocked && !isFinished && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl
            bg-slate-500/10 dark:bg-black/40 backdrop-blur-[2px]"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
                        className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900
                font-bold text-lg shadow-2xl transition-all border border-white/10"
                    >
                        {language === "nepali" ? "सुरु गर्नुहोस्" : "Start Practice"}
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
