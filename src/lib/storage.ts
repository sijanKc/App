// Utility functions for persisting high scores and typing history in localStorage

export interface HighScore {
    wpm: number;
    accuracy: number;
    language: "nepali" | "english";
    duration: number;
    date: string;
}

export interface HistoryEntry extends HighScore {
    id: string;
}

const HIGH_SCORE_KEY = "typingApp_highScores";
const HISTORY_KEY = "typingApp_history";
const MAX_HISTORY = 20;

// ─── High Scores ────────────────────────────────────────────────────────────

export function getHighScores(): HighScore[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(HIGH_SCORE_KEY) || "[]");
    } catch {
        return [];
    }
}

export function saveHighScore(entry: HighScore): boolean {
    const scores = getHighScores();
    const langScores = scores.filter((s) => s.language === entry.language);
    const topScore = langScores.reduce(
        (best, s) => (s.wpm > best ? s.wpm : best),
        0
    );

    // Always record, check if it's a new high score
    const isNew = entry.wpm > topScore;

    // Keep top 5 per language
    const updated = [...scores, entry]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 10);

    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(updated));
    return isNew;
}

export function getBestScore(language: "nepali" | "english"): HighScore | null {
    const scores = getHighScores().filter((s) => s.language === language);
    if (scores.length === 0) return null;
    return scores.reduce((best, s) => (s.wpm > best.wpm ? s : best));
}

// ─── History ─────────────────────────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
        return [];
    }
}

export function saveHistory(entry: HistoryEntry): void {
    const history = getHistory();
    const updated = [entry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}

// ─── Key Errors (Heatmap) ───────────────────────────────────────────────────
const KEY_ERRORS_KEY = "typingApp_keyErrors";

export interface KeyErrorMap {
    [key: string]: number;
}

export function getKeyErrors(): KeyErrorMap {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(KEY_ERRORS_KEY) || "{}");
    } catch {
        return {};
    }
}

export function saveKeyError(key: string): void {
    if (!key || key === " ") return;
    const errors = getKeyErrors();
    errors[key] = (errors[key] || 0) + 1;
    localStorage.setItem(KEY_ERRORS_KEY, JSON.stringify(errors));
}

export function clearKeyErrors(): void {
    localStorage.removeItem(KEY_ERRORS_KEY);
}
