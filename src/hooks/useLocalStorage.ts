import { useState, useCallback } from "react";

/**
 * Generic hook for reading and writing a JSON-serialized value in localStorage.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === "undefined") return defaultValue;
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    const setStored = useCallback(
        (newValue: T | ((prev: T) => T)) => {
            setValue((prev) => {
                const resolved = typeof newValue === "function"
                    ? (newValue as (prev: T) => T)(prev)
                    : newValue;
                try {
                    localStorage.setItem(key, JSON.stringify(resolved));
                } catch { }
                return resolved;
            });
        },
        [key]
    );

    return [value, setStored] as const;
}
