"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { mapKeyToNepaliUnicode, isMappableKey } from "@/lib/nepali-unicode";
import { ArrowLeft, RotateCcw, Target as TargetIcon, Sparkles, Flame, Shield } from "lucide-react";
import Link from "next/link";
import { calculateSessionXP } from "@/lib/gameEngine";

interface Target {
    id: string;
    text: string;
    x: number;
    y: number;
}

interface Arrow {
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

const ENEMIES_EN = ["a", "s", "d", "f", "j", "k", "l", ";", "apple", "sky", "fire", "brave"];
const ENEMIES_NE = ["क", "म", "न", "स", "प", "ल", "र", "त", "आगो", "पर्वत", "नदी", "हावा"];

export default function ArcheryDuel() {
    const { addXp, updateStats, soundEnabled } = useGame();
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [language, setLanguage] = useState<"nepali" | "english">("nepali");

    const [currentTarget, setCurrentTarget] = useState<Target | null>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [typedText, setTypedText] = useState("");
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const spawnTarget = useCallback(() => {
        const pool = language === "english" ? ENEMIES_EN : ENEMIES_NE;
        const text = pool[Math.floor(Math.random() * pool.length)];
        const id = Math.random().toString(36).substr(2, 9);
        // Position targets on the right side
        const x = 70 + Math.random() * 15;
        const y = 20 + Math.random() * 60;

        setCurrentTarget({ id, text, x, y });
    }, [language]);

    const fireArrow = (targetX: number, targetY: number) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newArrow: Arrow = {
            id,
            startX: 10, // Archer position (left)
            startY: 50,
            endX: targetX,
            endY: targetY
        };
        setArrows(prev => [...prev, newArrow]);

        // Remove arrow after animation
        setTimeout(() => {
            setArrows(prev => prev.filter(a => a.id !== id));
            // Damage/Destroy target logic handled in typing
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (gameState !== "playing" || !currentTarget) return;

        if (language === "nepali") {
            if (isMappableKey(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                const char = mapKeyToNepaliUnicode(e.key);
                processTyping(char);
            } else if (e.key === "Backspace") {
                setTypedText(prev => prev.slice(0, -1));
            }
        }
    };

    const processTyping = (char: string) => {
        if (!currentTarget) return;

        const newText = typedText + char;
        setTypedText(newText);

        if (currentTarget.text.startsWith(newText)) {
            if (currentTarget.text === newText) {
                // Bullseye!
                fireArrow(currentTarget.x, currentTarget.y);
                setScore(s => s + (newText.length * 10) + (combo * 5));
                setCombo(c => c + 1);
                setTypedText("");

                if (soundEnabled) {
                    import("@/lib/soundEngine").then(m => m.playKeystroke());
                }

                // Brief delay before next target for impact feel
                setCurrentTarget(null);
                setTimeout(spawnTarget, 200);
            }
        } else {
            // Missed string - break combo
            setCombo(0);
            setTypedText("");
            if (soundEnabled) {
                import("@/lib/soundEngine").then(m => m.playError());
            }
        }
    };

    useEffect(() => {
        if (gameState === "playing") {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        setGameState("gameover");
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);

            spawnTarget();

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState, spawnTarget]);

    const startGame = (lang: "nepali" | "english") => {
        setLanguage(lang);
        setScore(0);
        setCombo(0);
        setTimeLeft(60);
        setTypedText("");
        setGameState("playing");
    };

    const finishGame = () => {
        const xpEarned = calculateSessionXP(score / 2, 50, 100);
        addXp(xpEarned);
        updateStats({ gamesPlayed: 1 });
    };

    useEffect(() => {
        if (gameState === "gameover") {
            finishGame();
        }
    }, [gameState]);

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col p-6 overflow-hidden font-noto">
            {/* Rama Archer HUD */}
            <div className="z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm">
                <Link href="/games" className="flex items-center gap-2 text-slate-400 hover:text-slate-950 font-bold transition-all group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Warrior Dashboard
                </Link>

                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-1">Time Remaining</div>
                    <div className="text-4xl font-black tabular-nums tracking-tighter text-slate-900 italic">
                        {timeLeft}s
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Divine Power</div>
                    <div className="text-3xl font-black text-slate-900 italic">{score}</div>
                </div>
            </div>

            {/* Game Arena */}
            <div className="flex-1 relative mt-12 mb-24 rounded-[64px] bg-slate-50/50 border-4 border-slate-50 overflow-hidden shadow-2xl shadow-indigo-500/5">
                {/* Background Decor - Traditional Patterns */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent" />
                </div>

                {/* Archer Visual (Left) */}
                <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="relative"
                    >
                        {/* Styled Bow SVG */}
                        <svg width="140" height="240" viewBox="0 0 100 200" className="drop-shadow-xl">
                            <path d="M50 10 C 10 10, 10 190, 50 190" fill="none" stroke="#4F46E5" strokeWidth="6" />
                            <line x1="50" y1="10" x2="50" y2="190" stroke="#4F46E5" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                            <circle cx="50" cy="100" r="10" fill="#4F46E5" />
                        </svg>

                        {/* Archer Glow Case */}
                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10 rounded-full" />
                    </motion.div>
                </div>

                {/* Arrows in Flight */}
                <AnimatePresence>
                    {arrows.map(arrow => (
                        <motion.div
                            key={arrow.id}
                            initial={{
                                x: `calc(${arrow.startX}% + 80px)`,
                                y: `${arrow.startY}%`,
                                rotate: -30,
                                opacity: 1
                            }}
                            animate={{
                                x: `${arrow.endX}%`,
                                y: `${arrow.endY}%`,
                                rotate: 0,
                                opacity: [1, 1, 0]
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute z-30 pointer-events-none"
                        >
                            <div className="relative">
                                {/* Arrow Head */}
                                <div className="w-16 h-1.5 bg-gradient-to-r from-transparent via-indigo-600 to-indigo-400 rounded-full shadow-lg" />
                                {/* Arrow Trail / Magic Trail */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 2, 0], opacity: [0.8, 0] }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-500 rounded-full blur-md"
                                />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-12 bg-indigo-500/5 blur-xl -z-10" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Current Target (Right) */}
                <AnimatePresence>
                    {currentTarget && (
                        <motion.div
                            key={currentTarget.id}
                            initial={{ scale: 0, opacity: 0, x: "90%" }}
                            animate={{ scale: 1, opacity: 1, x: currentTarget.x + "%", y: currentTarget.y + "%" }}
                            exit={{ scale: 2, opacity: 0, transition: { duration: 0.3 } }}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="relative group">
                                {/* The Target Orb */}
                                <div className="w-40 h-40 rounded-full border-4 border-slate-100 bg-white flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/10 transition-transform group-hover:scale-110">
                                    <div className="absolute inset-2 border-2 border-dashed border-indigo-100 rounded-full animate-spin-slow" />
                                    <Sparkles size={24} className="text-indigo-600/30 mb-2" />
                                    <span className="text-4xl font-black text-slate-900 tracking-tight italic">
                                        {currentTarget.text}
                                    </span>
                                </div>
                                <div className="absolute -top-4 -right-4">
                                    <div className="px-4 py-1 rounded-full bg-slate-950 text-white text-[10px] font-black uppercase italic tracking-widest shadow-xl">
                                        Strike
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === "idle" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 bg-white/95 backdrop-blur-xl z-[60]">
                        <div className="flex flex-col items-center text-center px-12">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="w-32 h-32 rounded-[40px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 shadow-2xl shadow-slate-200/50"
                            >
                                <TargetIcon size={64} className="text-indigo-600" />
                            </motion.div>
                            <h2 className="text-7xl font-black mb-4 tracking-tighter text-slate-950 italic uppercase italic">
                                Archery Duel
                            </h2>
                            <p className="max-w-md text-slate-400 uppercase text-[11px] tracking-[0.4em] font-black mx-auto">
                                Channels the spirit of Rama. Type accurately to fire divine arrows.
                            </p>
                        </div>

                        <div className="flex gap-6 w-full max-w-sm">
                            <button
                                onClick={() => startGame("nepali")}
                                className="flex-1 py-5 rounded-3xl bg-slate-950 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[11px] scale-100 hover:scale-[1.02]"
                            >
                                NEPALI
                            </button>
                            <button
                                onClick={() => startGame("english")}
                                className="flex-1 py-5 rounded-3xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100 uppercase tracking-[0.2em] text-[11px] scale-100 hover:scale-[1.02]"
                            >
                                ENGLISH
                            </button>
                        </div>
                    </div>
                )}

                {gameState === "gameover" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-white/95 backdrop-blur-3xl z-[70]">
                        <h2 className="text-8xl font-black mb-4 italic tracking-tighter text-slate-950 uppercase italic">Victory</h2>
                        <div className="flex gap-20 text-center">
                            <div>
                                <div className="text-slate-300 text-[11px] font-black uppercase tracking-widest mb-3">Divine Energy</div>
                                <div className="text-7xl font-black text-indigo-600">{score}</div>
                            </div>
                            <div>
                                <div className="text-slate-300 text-[11px] font-black uppercase tracking-widest mb-3">Longest Streak</div>
                                <div className="text-7xl font-black text-slate-950">{combo}x</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
                            <button
                                onClick={() => startGame(language)}
                                className="py-6 rounded-3xl bg-slate-950 text-white font-black flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 text-xs tracking-[0.2em]"
                            >
                                <RotateCcw size={20} />
                                DUEL AGAIN
                            </button>
                            <Link
                                href="/games"
                                className="py-6 rounded-3xl bg-white border-2 border-slate-50 text-center font-black text-slate-400 hover:text-slate-950 hover:bg-slate-50 transition-all text-xs tracking-[0.2em]"
                            >
                                TO THE TEMPLE
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Focused Input Area */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8">
                <AnimatePresence>
                    {combo > 1 && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="bg-slate-950 px-10 py-3 rounded-full font-black italic shadow-2xl shadow-indigo-500/10 flex items-center gap-3 border-2 border-indigo-600 text-white"
                        >
                            <Flame size={20} className="text-indigo-400" />
                            POWER {combo}x
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    <div className="w-[36rem] px-12 py-8 rounded-[32px] bg-slate-50 border-4 border-white flex items-center justify-center shadow-2xl shadow-indigo-500/5">
                        <span className="text-5xl font-black uppercase tracking-[0.4em] text-slate-950">
                            {typedText || <span className="opacity-10 italic">CONCENTRATE...</span>}
                        </span>
                    </div>
                    <input
                        ref={inputRef}
                        className="opacity-0 absolute inset-0 cursor-default"
                        value={typedText}
                        onChange={(e) => language === "english" && processTyping(e.target.value.slice(-1))}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
}
