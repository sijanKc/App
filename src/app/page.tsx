"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Keyboard } from "lucide-react";

// Components
import TypingArea from "@/components/TypingArea";
import StatsBar from "@/components/StatsBar";
import ProgressBar from "@/components/ProgressBar";
import LanguageToggle from "@/components/LanguageToggle";
import FontSelector, { NEPALI_FONTS, getFontClass } from "@/components/FontSelector";
import TimerSelector from "@/components/TimerSelector";
import SoundToggle from "@/components/SoundToggle";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";
import HighScorePanel from "@/components/HighScorePanel";
import HistoryPanel from "@/components/HistoryPanel";
import KeyboardVisualizer from "@/components/KeyboardVisualizer";

// Hooks
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTimer } from "@/hooks/useTimer";
import { useStats } from "@/hooks/useStats";

// Data & Storage
import { getRandomPassage } from "@/data/passages";
import {
  getHighScores,
  saveHighScore,
  getHistory,
  saveHistory,
  clearHistory,
  HistoryEntry,
  HighScore,
} from "@/lib/storage";

export default function Home() {
  // ── Session config ─────────────────────────────────────────────────────────
  const [language, setLanguage] = useState<"nepali" | "english">("nepali");
  const [duration, setDuration] = useState(60);
  const [selectedFont, setSelectedFont] = useState("noto");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // ── Passage ────────────────────────────────────────────────────────────────
  const [passage, setPassage] = useState("");

  // ── UI state ───────────────────────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"scores" | "history">("scores");
  const [hasStarted, setHasStarted] = useState(false);

  // Track elapsed seconds for WPM (starts at 0, counts up once typing begins)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted data and initial passage on mount
  useEffect(() => {
    setIsMounted(true);
    setHighScores(getHighScores());
    setHistory(getHistory());
    setPassage(getRandomPassage(language));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Timer ──────────────────────────────────────────────────────────────────
  // ── Session control ────────────────────────────────────────────────────────
  const finishSessionRef = useRef<() => void>(() => { });

  const { timeLeft, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer(
    duration,
    () => finishSessionRef.current()
  );

  const finishSession = useCallback(() => {
    stopTimer();
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
    setShowResult(true);
  }, [stopTimer]);

  useEffect(() => {
    finishSessionRef.current = finishSession;
  }, [finishSession]);

  const handleStart = useCallback(() => {
    startTimer();
    // Start elapsed counter
    elapsedRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, [startTimer]);

  const { typedText, correctChars, errorChars, isActive, isFinished, handleType, reset: resetEngine } =
    useTypingEngine({ passage, soundEnabled, onStart: handleStart, onFinish: finishSession, language });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const { wpm, accuracy } = useStats({
    correctChars,
    totalTyped: typedText.length,
    elapsedSeconds,
  });

  const progress = Math.min(100, (typedText.length / passage.length) * 100);

  // ── Save results when session ends ─────────────────────────────────────────
  useEffect(() => {
    if (!showResult) return;
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      wpm,
      accuracy,
      language,
      duration,
      date: new Date().toISOString(),
    };
    const newHS = saveHighScore(entry);
    saveHistory(entry);
    setIsNewHighScore(newHS);
    setHighScores(getHighScores());
    setHistory(getHistory());
  }, [showResult, wpm, accuracy, language, duration]);

  // ── Restart / Reset ────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    resetEngine();
    resetTimer();
    setElapsedSeconds(0);
    setShowResult(false);
    setIsNewHighScore(false);
    setHasStarted(false);
    setPassage(getRandomPassage(language));
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
  }, [resetEngine, resetTimer, language]);

  // ── Language change ────────────────────────────────────────────────────────
  const handleLanguageChange = useCallback(
    (lang: "nepali" | "english") => {
      setLanguage(lang);
      setPassage(getRandomPassage(lang));
      resetEngine();
      resetTimer();
      setElapsedSeconds(0);
      setShowResult(false);
      setHasStarted(false);
    },
    [resetEngine, resetTimer]
  );

  // ── Duration change ────────────────────────────────────────────────────────
  const handleDurationChange = useCallback(
    (d: number) => {
      setDuration(d);
      resetEngine();
      resetTimer();
      setElapsedSeconds(0);
      setShowResult(false);
      setHasStarted(false);
      setPassage(getRandomPassage(language));
    },
    [resetEngine, resetTimer, language]
  );

  // ── Clear history ──────────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const fontClass =
    language === "nepali" ? getFontClass(selectedFont) : "font-sans";

  if (!isMounted) return null;

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: "var(--bg-color)" }}
    >

      {/* ── Simplified background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[800px] h-[800px] rounded-full border border-blue-500/10" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 w-full px-4 py-4 flex items-center justify-between
        max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-red-600 to-blue-700 shadow-lg">
            <Keyboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              टाइपिंग अभ्यास
            </h1>
            <p className="text-[11px] text-gray-400 leading-none">Typing Practice</p>
          </div>
        </div>

        {/* Header controls */}
        <div className="flex items-center gap-2">
          <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled((s) => !s)} />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-10">

        {/* Control row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <LanguageToggle
              language={language}
              onChange={handleLanguageChange}
              disabled={isActive}
            />
            <TimerSelector
              duration={duration}
              onChange={handleDurationChange}
              disabled={isActive}
            />
          </div>
          <div className="flex items-center gap-3">
            {language === "nepali" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Font</span>
                <FontSelector selectedFont={selectedFont} onChange={setSelectedFont} />
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                bg-white/10 border border-white/10 text-gray-300
                hover:text-white hover:bg-white/15 text-sm font-medium
                transition-all backdrop-blur-sm"
            >
              <RotateCcw size={14} />
              Restart
            </motion.button>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── LEFT: Typing zone ── */}
          <div className="flex flex-col gap-5">

            {/* Stats */}
            <StatsBar
              wpm={wpm}
              accuracy={accuracy}
              timeLeft={timeLeft}
              duration={duration}
            />

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            {/* Typing area */}
            <TypingArea
              passage={passage}
              typedText={typedText}
              onType={handleType}
              isFinished={isFinished || timeLeft === 0}
              fontClass={fontClass}
              language={language}
              isLocked={!hasStarted}
              onStart={() => setHasStarted(true)}
            />

            {/* Keyboard Visualizer */}
            {!isFinished && hasStarted && (
              <KeyboardVisualizer language={language} />
            )}

            {/* Hint */}
            <AnimatePresence>
              {!isActive && !isFinished && timeLeft === duration && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm text-gray-500 mt-1"
                >
                  {language === "nepali"
                    ? "⌨️  टाइप गर्न सुरु गर्नुहोस् — टाइमर स्वचालित रूपमा सुरु हुन्छ"
                    : "⌨️  Start typing — the timer starts automatically"}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Error count */}
            {typedText.length > 0 && (
              <div className="flex justify-center gap-6 text-xs text-slate-500 dark:text-gray-400 font-medium">
                <span className="text-emerald-600 dark:text-emerald-500">✓ {correctChars} correct</span>
                <span className="text-red-500">✗ {errorChars} errors</span>
              </div>
            )}
          </div>

          {/* ── RIGHT: Side panels ── */}
          <div className="flex flex-col gap-4">

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {(["scores", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                    ${activeTab === tab
                      ? "bg-white/15 text-white"
                      : "text-gray-500 hover:text-gray-300"}`}
                >
                  {tab === "scores" ? "🏆 Best Scores" : "📋 History"}
                </button>
              ))}
            </div>

            {activeTab === "scores" ? (
              <HighScorePanel scores={highScores} language={language} />
            ) : (
              <HistoryPanel history={history} onClear={handleClearHistory} />
            )}

            {/* Nepal info card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
              <div className="text-3xl mb-2">🇳🇵</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Supports Nepali Unicode Devanagari script with multiple font choices.
                Practise daily to improve your typing speed!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Result overlay ── */}
      {
        showResult && (
          <ResultCard
            wpm={wpm}
            accuracy={accuracy}
            duration={duration}
            language={language}
            isNewHighScore={isNewHighScore}
            onRestart={handleRestart}
          />
        )
      }
    </div >
  );
}
