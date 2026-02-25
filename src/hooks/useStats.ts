import { useMemo } from "react";

interface UseStatsProps {
    correctChars: number;
    totalTyped: number;
    elapsedSeconds: number;
}

/**
 * Derives WPM and accuracy from raw typing counts.
 * WPM = (correctChars / 5) / elapsedMinutes  (standard word = 5 chars)
 * Accuracy = (correctChars / totalTyped) * 100
 */
export function useStats({ correctChars, totalTyped, elapsedSeconds }: UseStatsProps) {
    const wpm = useMemo(() => {
        if (elapsedSeconds < 1 || correctChars === 0) return 0;
        const elapsedMinutes = elapsedSeconds / 60;
        return Math.round(correctChars / 5 / elapsedMinutes);
    }, [correctChars, elapsedSeconds]);

    const accuracy = useMemo(() => {
        if (totalTyped === 0) return 100;
        return Math.round((correctChars / totalTyped) * 100);
    }, [correctChars, totalTyped]);

    return { wpm, accuracy };
}
