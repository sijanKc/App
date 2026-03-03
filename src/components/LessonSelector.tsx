"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Lock } from "lucide-react";
import { ENGLISH_LESSONS, NEPALI_LESSONS, Lesson, Unit } from "@/data/lessons";

interface LessonSelectorProps {
    language: "nepali" | "english";
    completedLessonIds: string[];
    onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonSelector({
    language,
    completedLessonIds,
    onSelectLesson,
}: LessonSelectorProps) {
    const units = language === "english" ? ENGLISH_LESSONS : NEPALI_LESSONS;

    return (
        <div className="space-y-12 max-w-5xl mx-auto p-4">
            {units.map((unit, unitIdx) => (
                <div key={unit.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                            <BookOpen size={20} className="text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight">{unit.title}</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Foundational Mastery</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {unit.lessons.map((lesson, lessonIdx) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            // Simple logic: first lesson or previous lesson completed
                            const isLocked = unitIdx === 0 && lessonIdx === 0 ? false :
                                lessonIdx > 0 ? !completedLessonIds.includes(unit.lessons[lessonIdx - 1].id) :
                                    !completedLessonIds.includes(units[unitIdx - 1].lessons[units[unitIdx - 1].lessons.length - 1].id);

                            return (
                                <motion.button
                                    key={lesson.id}
                                    whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                                    onClick={() => !isLocked && onSelectLesson(lesson)}
                                    className={`
                    flex items-center justify-between p-6 rounded-[24px] border transition-all text-left
                    ${isLocked
                                            ? "bg-slate-50/50 border-slate-100 opacity-40 cursor-not-allowed"
                                            : "bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5"}
                  `}
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-black text-slate-900 tracking-tight">{lesson.title}</span>
                                            {isCompleted && <CheckCircle2 size={16} className="text-emerald-600" />}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium leading-relaxed">{lesson.description}</span>
                                    </div>

                                    {!isCompleted && (
                                        <div className="flex items-center justify-center ml-4">
                                            {isLocked ? (
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Lock size={14} className="text-slate-400" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                            )}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
