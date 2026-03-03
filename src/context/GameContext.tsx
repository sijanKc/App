"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculateLevel } from "@/lib/gameEngine";

interface GameStats {
    totalWordsTyped: number;
    highestWpm: number;
    gamesPlayed: number;
}

interface GameContextType {
    xp: number;
    level: number;
    addXp: (amount: number) => void;
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    stats: GameStats;
    updateStats: (newStats: Partial<GameStats>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [xp, setXp] = useLocalStorage<number>("typer_xp", 0);
    const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>("typer_sound", true);
    const [stats, setStats] = useLocalStorage<GameStats>("typer_stats", {
        totalWordsTyped: 0,
        highestWpm: 0,
        gamesPlayed: 0,
    });

    const level = calculateLevel(xp);

    const addXp = (amount: number) => {
        setXp((prev) => prev + amount);
    };

    const updateStats = (newStats: Partial<GameStats>) => {
        setStats((prev) => ({ ...prev, ...newStats }));
    };

    return (
        <GameContext.Provider
            value={{
                xp,
                level,
                addXp,
                soundEnabled,
                setSoundEnabled,
                stats,
                updateStats,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
