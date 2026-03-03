"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/data/lessons";
import TypingArea from "@/components/TypingArea";
import ProgressBar from "@/components/ProgressBar";
import KeyboardVisualizer from "@/components/KeyboardVisualizer";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { getFontClass } from "@/components/FontSelector";

interface LessonPracticeProps {
    lesson: Lesson;
    language: "nepali" | "english";
    onBack: () => void;
    onComplete: (lessonId: string) => void;
    onNext: () => void;
    hasNext: boolean;
}

export default function LessonPractice({
    lesson,
    language,
    onBack,
    onComplete,
    onNext,
    hasNext,
}: LessonPracticeProps) {
    const [hasStarted, setHasStarted] = useState(false);
    const [soundEnabled] = useState(true); // Default to on for lessons

    const {
        typedText,
        correctChars,
        errorChars,
        isActive,
        isFinished,
        handleType,
        reset,
    } = useTypingEngine({
        passage: lesson.content,
        soundEnabled,
        onStart: () => setHasStarted(true),
        onFinish: () => onComplete(lesson.id),
        language,
    });

    const progress = Math.min(100, (typedText.length / lesson.content.length) * 100);
    const fontClass = language === "nepali" ? getFontClass("noto") : "font-sans";

    const handleRestart = useCallback(() => {
        reset();
        setHasStarted(false);
    }, [reset]);

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-8 font-noto">
            {/* Header */}
            <div className="flex items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-950 font-bold transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Lessons</span>
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight italic uppercase">{lesson.title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lesson.description}</p>
                </div>

                <button
                    onClick={handleRestart}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-100 transition-all"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Focus Keys Hint */}
            <div className="flex flex-col items-center gap-4 py-4">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Mastering these keys:</span>
                <div className="flex gap-3">
                    {lesson.keysFocus.map(key => (
                        <span key={key} className="px-6 py-3 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-lg border border-indigo-100 shadow-sm">
                            {key}
                        </span>
                    ))}
                </div>
            </div>

            <ProgressBar progress={progress} />

            <div className="relative">
                <TypingArea
                    passage={lesson.content}
                    typedText={typedText}
                    onType={handleType}
                    isFinished={isFinished}
                    fontClass={fontClass}
                    language={language}
                    isLocked={!hasStarted}
                    onStart={() => setHasStarted(true)}
                    targetWpm={25}
                />
            </div>

            {/* Keyboard Visualizer */}
            {!isFinished && hasStarted && (
                <div className="mt-8">
                    <KeyboardVisualizer language={language} />
                </div>
            )}

            {/* Footer/Completion */}
            <AnimatePresence>
                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-8 p-12 rounded-[40px] bg-emerald-50 border border-emerald-100 shadow-xl shadow-emerald-500/5 mt-8"
                    >
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-emerald-100">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Well Done!</h3>
                                <p className="text-emerald-700 font-medium">You've successfully completed this module.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full max-w-sm">
                            <button
                                onClick={onBack}
                                className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-all shadow-sm"
                            >
                                Units
                            </button>
                            {hasNext && (
                                <button
                                    onClick={onNext}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                                >
                                    Next
                                    <ArrowRight size={20} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats during practice */}
            {!isFinished && typedText.length > 0 && (
                <div className="flex justify-center gap-8 text-[11px] font-bold uppercase tracking-widest pt-4">
                    <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {correctChars} Correct
                    </span>
                    <span className="text-rose-600 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {errorChars} Errors
                    </span>
                </div>
            )}
        </div>
    );
}
