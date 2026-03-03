"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { mapKeyToNepaliUnicode, isMappableKey } from "@/lib/nepali-unicode";
import { Shield, Trophy, Sword, ArrowLeft, RotateCcw, Flame } from "lucide-react";
import Link from "next/link";
import { calculateSessionXP } from "@/lib/gameEngine";

interface FallingWord {
    id: string;
    text: string;
    x: number;
    y: number;
    speed: number;
}

const EASY_WORDS_EN = ["a", "s", "d", "f", "j", "k", "l", ";"];
const MEDIUM_WORDS_EN = ["apple", "bread", "code", "dream", "eagle", "fire", "grape", "heart"];
const HARD_WORDS_EN = ["beautiful", "challenge", "developer", "experience", "foundation", "generative"];

const EASY_WORDS_NE = ["क", "म", "न", "स", "प", "ल", "र", "त"];
const MEDIUM_WORDS_NE = ["नेपाल", "कमल", "घर", "पानी", "हावा", "माटो", "आकाश", "माया"];
const HARD_WORDS_NE = ["सगरमाथा", "परिश्रमी", "बुद्धिमानी", "संस्कृति", "विकास", "प्रविधि"];

export default function FallingWords() {
    const { addXp, updateStats, soundEnabled } = useGame();
    const [language, setLanguage] = useState<"nepali" | "english">("nepali");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

    const [words, setWords] = useState<FallingWord[]>([]);
    const [typedText, setTypedText] = useState("");
    const [lives, setLives] = useState(5);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalSpawned, setTotalSpawned] = useState(0);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastSpawnTime = useRef(0);
    const requestRef = useRef<number>(0);

    const getWordPool = useCallback(() => {
        if (language === "english") {
            if (difficulty === "easy") return EASY_WORDS_EN;
            if (difficulty === "medium") return MEDIUM_WORDS_EN;
            return HARD_WORDS_EN;
        } else {
            if (difficulty === "easy") return EASY_WORDS_NE;
            if (difficulty === "medium") return MEDIUM_WORDS_NE;
            return HARD_WORDS_NE;
        }
    }, [language, difficulty]);

    const spawnWord = useCallback(() => {
        const pool = getWordPool();
        const text = pool[Math.floor(Math.random() * pool.length)];
        const id = Math.random().toString(36).substr(2, 9);
        const x = 10 + Math.random() * 80; // 10% to 90%

        // VASTLY SLOWER SPEEDS as requested
        const baseSpeed = difficulty === "hard" ? 0.35 : difficulty === "easy" ? 0.12 : 0.22;
        const speed = baseSpeed + (score / 10000);

        setWords(prev => [...prev, { id, text, x, y: -10, speed }]);
        setTotalSpawned(s => s + 1);
    }, [getWordPool, score, difficulty]);

    const gameLoop = useCallback((time: number) => {
        if (lastSpawnTime.current === 0) lastSpawnTime.current = time;

        const spawnInterval = Math.max(1200, 3000 - (score / 10));

        if (time - lastSpawnTime.current > spawnInterval) {
            spawnWord();
            lastSpawnTime.current = time;
        }

        setWords(prev => {
            const newWords: FallingWord[] = [];
            let lifeLost = 0;

            for (const word of prev) {
                const nextY = word.y + word.speed;
                if (nextY > 100) {
                    lifeLost++;
                } else {
                    newWords.push({ ...word, y: nextY });
                }
            }

            if (lifeLost > 0) {
                setLives(l => {
                    const next = l - lifeLost;
                    if (next <= 0) {
                        setGameState("gameover");
                        return 0;
                    }
                    return next;
                });
            }

            return newWords;
        });

        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    }, [spawnWord, score, gameState]);

    useEffect(() => {
        if (gameState === "playing") {
            requestRef.current = requestAnimationFrame(gameLoop);
            inputRef.current?.focus();
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, gameLoop]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (gameState !== "playing") return;

        if (language === "nepali") {
            if (isMappableKey(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                const char = mapKeyToNepaliUnicode(e.key);
                setTypedText(prev => prev + char);
            } else if (e.key === "Backspace") {
                setTypedText(prev => prev.slice(0, -1));
            }
        }
    };

    useEffect(() => {
        if (typedText === "") return;

        const matchedIndex = words.findIndex(w => w.text === typedText);
        if (matchedIndex !== -1) {
            setWords(prev => prev.filter((_, i) => i !== matchedIndex));
            setScore(s => s + (typedText.length * 10));
            setCorrectCount(c => c + 1);
            setTypedText("");

            if (soundEnabled) {
                import("@/lib/soundEngine").then(m => m.playKeystroke());
            }
        }
    }, [typedText, words, soundEnabled]);

    const startGame = (lang: "nepali" | "english") => {
        setLanguage(lang);
        setWords([]);
        setScore(0);
        setLives(5);
        setTypedText("");
        setCorrectCount(0);
        setTotalSpawned(0);
        setGameState("playing");
        lastSpawnTime.current = 0;
    };

    const finishGame = () => {
        const accuracy = totalSpawned > 0 ? Math.round((correctCount / totalSpawned) * 100) : 0;
        const xpEarned = calculateSessionXP(correctCount * 5, 40, accuracy);
        addXp(xpEarned);
        updateStats({ gamesPlayed: 1 });
    };

    useEffect(() => {
        if (gameState === "gameover") {
            finishGame();
        }
    }, [gameState]);

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 font-noto">
            {/* Header / Stats Overlay */}
            <div className="fixed top-0 left-0 right-0 p-8 flex items-center justify-between z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <Link href="/games" className="flex items-center gap-2 text-slate-400 hover:text-slate-950 font-bold transition-all group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Warrior Dashboard
                </Link>

                {gameState === "playing" && (
                    <div className="flex items-center gap-10 bg-slate-50 px-8 py-3 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-3">
                            <Trophy className="text-amber-500" size={24} />
                            <span className="text-3xl font-black text-slate-900 tabular-nums">{score}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                                <Shield
                                    key={i}
                                    size={24}
                                    className={`${i < lives ? "text-indigo-600 fill-indigo-100" : "text-slate-200"}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="w-40 flex justify-end">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Mod: {difficulty}
                    </div>
                </div>
            </div>

            {/* Game Screen Content */}
            <div className="relative w-full max-w-5xl h-[75vh] rounded-[48px] border-4 border-slate-50 bg-white overflow-hidden shadow-2xl shadow-slate-200/50 mt-12" ref={gameAreaRef}>
                {/* Background Decorations (Faded) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border-2 border-dashed border-slate-200 rounded-full animate-spin-slow" />
                </div>

                {gameState === "idle" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center p-12 bg-white/90 backdrop-blur-sm z-20">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-24 h-24 rounded-[32px] bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-lg"
                        >
                            <Sword size={48} className="text-indigo-600" />
                        </motion.div>
                        <div>
                            <h2 className="text-6xl font-black mb-4 tracking-tighter text-slate-950 italic uppercase italic">
                                Warrior's Words
                            </h2>
                            <p className="max-w-md text-slate-400 uppercase text-[11px] tracking-[0.4em] font-black mx-auto">
                                The path of precision is the path of glory.
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 w-full max-w-sm">
                            <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                                {(["easy", "medium", "hard"] as const).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`flex-1 py-3 px-4 rounded-xl capitalize transition-all font-black tracking-widest text-[10px] ${difficulty === d ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => startGame("nepali")}
                                    className="flex-1 py-5 rounded-3xl bg-slate-950 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 scale-100 hover:scale-[1.02]"
                                >
                                    NEPALI
                                </button>
                                <button
                                    onClick={() => startGame("english")}
                                    className="flex-1 py-5 rounded-3xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100 scale-100 hover:scale-[1.02]"
                                >
                                    ENGLISH
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === "playing" && (
                    <>
                        <AnimatePresence>
                            {words.map(word => (
                                <motion.div
                                    key={word.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.1 } }}
                                    style={{
                                        position: "absolute",
                                        left: `${word.x}%`,
                                        top: `${word.y}%`,
                                        transform: "translateX(-50%)",
                                    }}
                                    className={`
                                        px-6 py-4 rounded-2xl border-2 bg-white
                                        text-2xl font-black shadow-lg shadow-slate-200/50 whitespace-nowrap
                                        ${word.text.startsWith(typedText)
                                            ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                                            : "border-slate-100 text-slate-900"}
                                        transition-all duration-200
                                    `}
                                >
                                    {word.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Input Indicator */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
                            <div className="h-20 w-[420px] bg-slate-50 border border-slate-200 rounded-[32px] flex items-center justify-center p-6 shadow-2xl shadow-indigo-500/10">
                                <span className="text-4xl font-black tracking-[0.2em] text-slate-950">
                                    {typedText || <span className="text-slate-300 italic opacity-50">FOCUS...</span>}
                                </span>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                className="opacity-0 absolute inset-0 pointer-events-none"
                                value={typedText}
                                onChange={(e) => language === "english" && setTypedText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                    </>
                )}

                {gameState === "gameover" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 text-center p-12 bg-white/95 backdrop-blur-md z-30">
                        <div className="w-28 h-28 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 shadow-lg shadow-rose-200/50">
                            <Flame size={56} className="text-rose-500" />
                        </div>
                        <div>
                            <h2 className="text-7xl font-black mb-2 tracking-tighter text-slate-950 italic uppercase">Redeemed</h2>
                            <p className="text-slate-400 uppercase text-[11px] tracking-[0.4em] font-black">Success is falling nine times and getting up ten.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">XP Reward</span>
                                <span className="text-4xl font-black text-indigo-600">{score}</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <span className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Words Mastery</span>
                                <span className="text-4xl font-black text-slate-900">{correctCount}</span>
                            </div>
                        </div>

                        <div className="flex gap-6 w-full max-w-sm mt-4">
                            <button
                                onClick={() => setGameState("idle")}
                                className="flex-1 py-5 rounded-2xl bg-white text-slate-500 hover:text-slate-900 font-black border border-slate-200 text-xs tracking-widest transition-all shadow-sm"
                            >
                                DASHBOARD
                            </button>
                            <button
                                onClick={() => startGame(language)}
                                className="flex-1 py-5 rounded-2xl bg-slate-950 text-white font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-xs tracking-widest shadow-xl shadow-slate-200"
                            >
                                <RotateCcw size={16} />
                                AGAIN
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Accent */}
            <div className="fixed bottom-0 left-0 right-0 h-2 bg-indigo-600 z-40" />
        </div>
    );
}
