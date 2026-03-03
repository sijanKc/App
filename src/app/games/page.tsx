"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Trophy, Sword, Target, Scroll, User, Calendar, Star, ChevronRight } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { XPBar, LevelBadge } from "@/components/game/GameStatus";

const GAMES = [
    {
        id: "falling-words",
        title: "Warrior's Words",
        nepaliTitle: "योद्धाको शब्द",
        description: "Defend the realm from falling scripts. Speed is your enemy, precision is your shield.",
        icon: <Sword className="text-blue-400" />,
        color: "from-blue-500/20 to-indigo-500/20",
        borderColor: "border-blue-500/20",
        xpReward: "Medium XP",
    },
    {
        id: "typing-shooter",
        title: "Archery Duel",
        nepaliTitle: "धनुष कला",
        description: "Channel the spirit of Rama. Target the hidden words with divine arrows.",
        icon: <Target className="text-amber-500" />,
        color: "from-amber-600/20 to-orange-600/20",
        borderColor: "border-amber-500/20",
        xpReward: "High XP",
    },
    {
        id: "matra-builder",
        title: "Knowledge Scrolls",
        nepaliTitle: "ज्ञान पत्र",
        description: "Unravel ancient combinations of the Nepali script. Master the Matras.",
        icon: <Scroll className="text-emerald-400" />,
        color: "from-emerald-500/20 to-teal-500/20",
        borderColor: "border-emerald-500/20",
        xpReward: "Educational XP",
    },
];

export default function GamesPage() {
    const { level, xp } = useGame();

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-noto">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-50 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors group uppercase tracking-widest font-bold"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-slate-900 italic">
                                WARRIOR HUB
                            </h1>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em]">The path of the script is the path of the soul.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 p-5 rounded-3xl backdrop-blur-md min-w-[280px] shadow-sm">
                        <LevelBadge />
                        <div className="flex-1">
                            <XPBar />
                        </div>
                    </div>
                </header>

                {/* Game Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GAMES.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/games/${game.id}`} className="group block h-full">
                                <div className={`
                                    h-full relative overflow-hidden rounded-[32px] border border-slate-200
                                    bg-white p-8
                                    transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]
                                `}>
                                    {/* Overlay Gradient (Subtle) */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 transition-opacity`} />

                                    <div className="relative mb-8 p-5 rounded-2xl bg-slate-50 w-fit border border-slate-100 group-hover:border-blue-200 transition-colors">
                                        {game.icon}
                                    </div>

                                    <div className="relative mb-4">
                                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{game.nepaliTitle}</h2>
                                        <h3 className="text-2xl font-black italic tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{game.title}</h3>
                                    </div>

                                    <p className="relative text-sm text-slate-500 leading-relaxed mb-10 font-medium">
                                        {game.description}
                                    </p>

                                    <div className="relative flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Trophy size={14} className="text-amber-500/50" />
                                            {game.xpReward}
                                        </div>
                                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-[10px] tracking-widest transition-transform group-hover:scale-105 shadow-xl shadow-slate-200">
                                            <Play size={12} fill="currentColor" />
                                            PLAY Now
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Footer / Daily Mission */}
                <footer className="mt-20">
                    <div className="p-10 rounded-[48px] bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-sm">
                        <div>
                            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-4">Current Quest</h4>
                            <p className="text-3xl font-black italic mb-2 text-slate-900">MASTER THE SCRIPT</p>
                            <p className="text-slate-500 text-sm font-medium">Unravel the Wisdom Scrolls to unlock profound XP rewards.</p>
                        </div>
                        <button className="px-10 py-5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-black shadow-xl shadow-slate-200 text-[10px] tracking-[0.3em] uppercase">
                            Begin Quest
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
}
