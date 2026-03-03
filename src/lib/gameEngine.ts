/**
 * Logic for XP and Leveling system
 */

export const XP_PER_LEVEL = 1000;
export const XP_PER_CORRECT_CHAR = 1;
export const XP_BONUS_PER_WPM = 5;
export const XP_BONUS_FOR_FINISHING = 50;

/**
 * Calculates level from total XP.
 * Level 1: 0 - 999 XP
 * Level 2: 1000 - 1999 XP, etc.
 */
export function calculateLevel(xp: number): number {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * Calculates XP progress within the current level.
 * Returns a value between 0 and XP_PER_LEVEL.
 */
export function calculateLevelProgress(xp: number): number {
    return xp % XP_PER_LEVEL;
}

/**
 * Calculates XP earned for a typing session.
 */
export function calculateSessionXP(correctChars: number, wpm: number, accuracy: number): number {
    let xp = correctChars * XP_PER_CORRECT_CHAR;
    xp += Math.round(wpm * XP_BONUS_PER_WPM * (accuracy / 100));
    xp += XP_BONUS_FOR_FINISHING;
    return xp;
}
