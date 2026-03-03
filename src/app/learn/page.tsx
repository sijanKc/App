"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import LessonSelector from "@/components/LessonSelector";
import LessonPractice from "@/components/LessonPractice";
import LanguageToggle from "@/components/LanguageToggle";
import { Lesson, ENGLISH_LESSONS, NEPALI_LESSONS } from "@/data/lessons";
import Footer from "@/components/Footer";

const STORAGE_KEY = "typing-practice-lessons-progress";

export default function LearnPage() {
    const [language, setLanguage] = useState<"nepali" | "english">("nepali");
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setCompletedLessonIds(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        }
    }, []);

    const handleCompleteLesson = useCallback((lessonId: string) => {
        setCompletedLessonIds((prev) => {
            if (prev.includes(lessonId)) return prev;
            const next = [...prev, lessonId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const handleNextLesson = useCallback(() => {
        if (!currentLesson) return;
        const units = language === "english" ? ENGLISH_LESSONS : NEPALI_LESSONS;

        // Find current unit and lesson index
        for (let u = 0; u < units.length; u++) {
            const unit = units[u];
            const lIdx = unit.lessons.findIndex(l => l.id === currentLesson.id);

            if (lIdx !== -1) {
                // Next lesson in same unit?
                if (lIdx < unit.lessons.length - 1) {
                    setCurrentLesson(unit.lessons[lIdx + 1]);
                    return;
                }
                // Next unit?
                else if (u < units.length - 1) {
                    setCurrentLesson(units[u + 1].lessons[0]);
                    return;
                }
            }
        }
        // No more lessons
        setCurrentLesson(null);
    }, [currentLesson, language]);

    const hasNextLesson = useCallback(() => {
        if (!currentLesson) return false;
        const units = language === "english" ? ENGLISH_LESSONS : NEPALI_LESSONS;

        for (let u = 0; u < units.length; u++) {
            const unit = units[u];
            const lIdx = unit.lessons.findIndex(l => l.id === currentLesson.id);

            if (lIdx !== -1) {
                if (lIdx < unit.lessons.length - 1) return true;
                if (u < units.length - 1) return true;
            }
        }
        return false;
    }, [currentLesson, language]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col font-noto">
            {/* Header */}
            <header className="relative z-10 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 border border-slate-200 shadow-sm group hover:bg-slate-200 transition-all">
                        <ArrowLeft size={20} className="text-slate-900 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={24} className="text-indigo-600" />
                            <h1 className="text-2xl font-black text-slate-950 tracking-tight italic uppercase">Learning Center</h1>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Master the art of typing</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageToggle
                        language={language}
                        onChange={(lang) => {
                            setLanguage(lang);
                            setCurrentLesson(null);
                        }}
                        disabled={!!currentLesson}
                    />
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <AnimatePresence mode="wait">
                    {!currentLesson ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="mb-16 text-center space-y-3">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Let's Master Typing</h2>
                                <p className="text-slate-500 font-medium text-lg">Follow our structured path to become a typing pro in {language === 'nepali' ? 'Nepali' : 'English'}.</p>
                            </div>

                            <LessonSelector
                                language={language}
                                completedLessonIds={completedLessonIds}
                                onSelectLesson={setCurrentLesson}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="practice"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <LessonPractice
                                lesson={currentLesson}
                                language={language}
                                onBack={() => setCurrentLesson(null)}
                                onComplete={handleCompleteLesson}
                                onNext={handleNextLesson}
                                hasNext={hasNextLesson()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
