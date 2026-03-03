"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { mapKeyToNepaliUnicode, isMappableKey } from "@/lib/nepali-unicode";
import { Scroll, Trophy, Lightbulb, ArrowRight, ArrowLeft, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import Link from "next/link";

interface Challenge {
    sequence: string[];
    result: string;
    description: string;
    keys: string;
}

const CHALLENGES: Challenge[] = [
    { sequence: ["क", "ा"], result: "का", description: "Combine Ka with the 'aa' matra.", keys: "sf" },
    { sequence: ["क", "ि"], result: "कि", description: "Combine Ka with the short 'i' matra.", keys: "sl" },
    { sequence: ["द", "्", "ध"], result: "द्ध", description: "Da + Halant + Dha makes 'Dha-dha' conjunct.", keys: "d\\D" },
    { sequence: ["त", "्", "त"], result: "त्त", description: "Ta + Halant + Ta makes 'Tta' conjunct.", keys: "t\\t" },
    { sequence: ["ङ", "्", "ख"], result: "ङ्ख", description: "Nga + Halant + Kha makes 'Nkha' conjunct.", keys: "<\\K" },
    { sequence: ["ह", "्", "र"], result: "ह्र", description: "Ha + Halant + Ra makes 'Hra' (short Ra).", keys: "h\\r" },
    { sequence: ["क", "्", "ष"], result: "क्ष", description: "Ka + Halant + Sha makes the conjunct 'Ksha'.", keys: "s\\z" },
    { sequence: ["त", "्", "र"], result: "त्र", description: "Ta + Halant + Ra makes the conjunct 'Tra'.", keys: "t\\r" },
    { sequence: ["ज", "्", "ञ"], result: "ज्ञ", description: "Ja + Halant + Jna makes the conjunct 'Gyana'.", keys: "j\\Y" },
    { sequence: ["श", "्", "र"], result: "श्र", description: "Sha + Halant + Ra makes 'Shra'.", keys: "S\\r" },
    { sequence: ["न", "े", "प", "ा", "ल"], result: "नेपाल", description: "Type the name of the country. N-E-P-A-L", keys: "nepal" },
];

export default function MatraBuilder() {
    const { addXp, updateStats, soundEnabled } = useGame();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [status, setStatus] = useState<"typing" | "correct" | "wrong">("typing");
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentChallenge = CHALLENGES[currentIndex];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (status !== "typing" || isFinished) return;

        if (isMappableKey(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            const char = mapKeyToNepaliUnicode(e.key);
            const newText = typedText + char;
            setTypedText(newText);

            if (newText === currentChallenge.result) {
                handleSuccess();
            } else if (!currentChallenge.result.startsWith(newText)) {
                handleError();
            }
        } else if (e.key === "Backspace") {
            setTypedText(prev => prev.slice(0, -1));
        }
    };

    const handleSuccess = () => {
        setStatus("correct");
        setScore(s => s + 100);
        if (soundEnabled) import("@/lib/soundEngine").then(m => m.playKeystroke());

        setTimeout(() => {
            if (currentIndex < CHALLENGES.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setTypedText("");
                setStatus("typing");
                setShowHint(false);
            } else {
                setIsFinished(true);
                addXp(500);
                updateStats({ gamesPlayed: 1 });
            }
        }, 1500);
    };

    const handleError = () => {
        setStatus("wrong");
        if (soundEnabled) import("@/lib/soundEngine").then(m => m.playError());
        setTimeout(() => {
            setTypedText("");
            setStatus("typing");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-indigo-100 font-noto" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Ancient Header */}
            <header className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <Link href="/games" className="flex items-center gap-2 text-slate-400 hover:text-slate-950 font-bold transition-all group uppercase text-[10px] tracking-widest">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.3em]">Knowledge Scroll</div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter italic">
                            {currentIndex + 1} <span className="text-slate-200">/</span> {CHALLENGES.length}
                        </div>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-4xl relative mt-12">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-indigo-50/50 blur-[120px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center gap-16"
                        >
                            {/* The Challenge Display - Clean Paper Style */}
                            <div className="flex items-center gap-6 text-7xl md:text-9xl font-black">
                                {currentChallenge.sequence.map((char, i) => (
                                    <React.Fragment key={i}>
                                        <motion.div
                                            initial={{ scale: 0.8, rotateY: 45 }}
                                            animate={{ scale: 1, rotateY: 0 }}
                                            transition={{ delay: i * 0.1, type: "spring" }}
                                            className="relative"
                                        >
                                            <div className="bg-white border-4 border-slate-50 w-28 h-40 md:w-40 md:h-52 flex items-center justify-center rounded-[32px] shadow-2xl shadow-slate-200/50 relative overflow-hidden group hover:border-indigo-100 transition-all">
                                                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
                                                <span className="relative z-10 text-slate-950 drop-shadow-sm">
                                                    {char}
                                                </span>
                                            </div>
                                        </motion.div>
                                        {i < currentChallenge.sequence.length - 1 && (
                                            <span className="text-slate-200 text-5xl font-light">+</span>
                                        )}
                                    </React.Fragment>
                                ))}

                                <motion.div
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-indigo-600/20 mx-6"
                                >
                                    <ArrowRight size={64} />
                                </motion.div>

                                <div className={`
                                    w-28 h-40 md:w-40 md:h-52 rounded-[32px] border-4 flex items-center justify-center relative transition-all duration-300 shadow-2xl
                                    ${status === 'correct' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' :
                                        status === 'wrong' ? 'border-rose-500 bg-rose-50 text-rose-600' :
                                            'border-slate-50 bg-slate-50/50 text-slate-100'}
                                `}>
                                    <span className="text-7xl md:text-9xl font-black relative z-10">
                                        {status === 'correct' ? currentChallenge.result : "?"}
                                    </span>
                                </div>
                            </div>

                            {/* Description & Hint */}
                            <div className="text-center space-y-6">
                                <p className="text-3xl text-slate-900 font-bold tracking-tight italic">
                                    "{currentChallenge.description}"
                                </p>
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] text-slate-400 font-black flex items-center gap-3 mx-auto hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all uppercase tracking-[0.3em]"
                                >
                                    <Lightbulb size={16} />
                                    {showHint ? `SEQUENCE: ${currentChallenge.keys}` : "SEEK GUIDANCE"}
                                </button>
                            </div>

                            {/* Input Display - Clean Tablet Style */}
                            <div className="w-full h-32 rounded-[40px] bg-slate-50 border-4 border-white flex items-center justify-center p-8 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
                                <motion.span
                                    key={typedText}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-5xl font-black tracking-[0.4em] text-slate-950 relative z-10"
                                >
                                    {typedText || <span className="opacity-10 text-[11px] uppercase font-black tracking-[1.5em] italic">Engrave your answer...</span>}
                                </motion.span>
                                {status === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-10 z-20"><CheckCircle2 size={48} className="text-emerald-500" /></motion.div>}
                                {status === 'wrong' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-10 z-20"><XCircle size={48} className="text-rose-500" /></motion.div>}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border-4 border-slate-50 p-16 rounded-[64px] text-center shadow-2xl shadow-slate-200/50"
                        >
                            <div className="w-32 h-32 bg-indigo-50 border border-indigo-100 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-lg">
                                <BookOpen size={64} className="text-indigo-600" />
                            </div>
                            <h2 className="text-6xl font-black mb-4 tracking-tighter text-slate-950 italic uppercase italic">Master of Matras</h2>
                            <p className="text-slate-400 mb-12 font-black uppercase text-[11px] tracking-[0.4em] leading-relaxed max-w-lg mx-auto">
                                You have unraveled the secrets of the ancient script. Your precision is legendary.
                            </p>

                            <div className="flex items-center justify-center gap-16 mb-16">
                                <div className="text-center">
                                    <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-3">Wisdom Gained</div>
                                    <div className="text-6xl font-black text-indigo-600">500</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-3">Scrolls Read</div>
                                    <div className="text-6xl font-black text-slate-950">{CHALLENGES.length}</div>
                                </div>
                            </div>

                            <Link
                                href="/games"
                                className="inline-flex items-center justify-center px-16 py-6 rounded-3xl bg-slate-950 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px] scale-100 hover:scale-[1.02]"
                            >
                                BACK TO THE HUB
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Background Accent */}
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-indigo-600/10" />
        </div>
    );
}
