import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Countdown timer hook.
 * Counts down from `duration` seconds once started.
 * Calls `onExpire` when time reaches 0.
 */
export function useTimer(duration: number, onExpire: () => void) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onExpireRef = useRef(onExpire);

    // Keep onExpire ref fresh without re-creating start/reset
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    // Sync timeLeft when duration prop changes (user picks new duration)
    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    const start = useCallback(() => {
        if (intervalRef.current) return; // already running
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    onExpireRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const stop = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        stop();
        setTimeLeft(duration);
    }, [stop, duration]);

    return { timeLeft, start, stop, reset };
}
