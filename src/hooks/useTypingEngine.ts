import React, { useState, useCallback, useRef, useMemo } from "react";

export interface TypingState {
    typedText: string;
    correctChars: number;
    errorChars: number;
    isActive: boolean;
    isFinished: boolean;
}

interface UseTypingEngineProps {
    passage: string;
    soundEnabled: boolean;
    onStart: () => void;
    onFinish: () => void;
    language?: "nepali" | "english";
}

/**
 * Manages all typing state: current input, character correctness counts,
 * and session lifecycle (active / finished).
 */
export function useTypingEngine({
    passage,
    soundEnabled,
    onStart,
    onFinish,
    language = "nepali",
}: UseTypingEngineProps) {
    const [typedText, setTypedText] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const startedRef = useRef(false);
    const segmenterRef = useRef<Intl.Segmenter | null>(null);

    // Initialize segmenter once
    const getSegmenter = useCallback(() => {
        if (!segmenterRef.current && typeof Intl !== 'undefined' && Intl.Segmenter) {
            segmenterRef.current = new Intl.Segmenter(language === "nepali" ? "ne" : "en", { granularity: "grapheme" });
        }
        return segmenterRef.current;
    }, [language]);

    const segments = useMemo(() => {
        const seg = getSegmenter();
        return seg ? Array.from(seg.segment(passage)).map(s => s.segment) : passage.split("");
    }, [passage, getSegmenter]);

    const typedSegments = useMemo(() => {
        const seg = getSegmenter();
        return seg ? Array.from(seg.segment(typedText)).map(s => s.segment) : typedText.split("");
    }, [typedText, getSegmenter]);

    // Count correct and incorrect characters compared against passage
    const correctChars = typedSegments.reduce((acc, ch, i) => (ch === segments[i] ? acc + 1 : acc), 0);
    const errorChars = typedSegments.length - correctChars;

    const handleType = useCallback(
        async (value: string) => {
            if (isFinished) return;

            // First keypress starts the timer
            if (!startedRef.current && value.length > 0) {
                startedRef.current = true;
                setIsActive(true);
                onStart();
            }

            setTypedText(value);

            const seg = getSegmenter();
            const valSegments = seg ? Array.from(seg.segment(value)).map(s => s.segment) : value.split("");

            // Play sounds
            if (soundEnabled && valSegments.length > typedSegments.length) {
                const lastIdx = valSegments.length - 1;
                const isCorrect = valSegments[lastIdx] === segments[lastIdx];
                if (isCorrect) {
                    const { playKeystroke } = await import("@/lib/soundEngine");
                    playKeystroke();
                } else {
                    const { playError } = await import("@/lib/soundEngine");
                    playError();
                }
            }

            if (valSegments.length >= segments.length) {
                setIsFinished(true);
                setIsActive(false);
                onFinish();
                if (soundEnabled) {
                    const { playComplete } = await import("@/lib/soundEngine");
                    playComplete();
                }
            }
        },
        [isFinished, typedSegments.length, soundEnabled, onStart, onFinish, getSegmenter, segments]
    );

    const reset = useCallback(() => {
        setTypedText("");
        setIsActive(false);
        setIsFinished(false);
        startedRef.current = false;
    }, []);

    return { typedText, correctChars, errorChars, isActive, isFinished, handleType, reset };
}
