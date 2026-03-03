"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  RotateCcw,
  Keyboard,
  GraduationCap,
  Sparkles,
  Music,
  History as HistoryIcon
} from "lucide-react";

// Components
import TypingArea from "@/components/TypingArea";
import StatsBar from "@/components/StatsBar";
import ProgressBar from "@/components/ProgressBar";
import LanguageToggle from "@/components/LanguageToggle";
import FontSelector, { getFontClass } from "@/components/FontSelector";
import TimerSelector from "@/components/TimerSelector";
import SoundToggle from "@/components/SoundToggle";
import SoundProfileSelector from "@/components/SoundProfileSelector";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";
import HighScorePanel from "@/components/HighScorePanel";
import HistoryPanel from "@/components/HistoryPanel";
import KeyboardVisualizer from "@/components/KeyboardVisualizer";
import ProgressInsights from "@/components/ProgressInsights";
import { LevelBadge } from "@/components/game/GameStatus";

// Hooks
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useTimer } from "@/hooks/useTimer";
import { useStats } from "@/hooks/useStats";

// Data & Storage
import { getRandomPassage, nepaliPassages } from "@/data/passages";
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
  const [targetWpm, setTargetWpm] = useState(40);

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

      {/* ── Minimal background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-peach-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 w-full px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100">
            <Keyboard size={24} className="text-slate-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              टाइपिंग अभ्यास
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Flow State Practice</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm shadow-sm"
          >
            <Sparkles size={18} className="text-amber-400" />
            Games
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-sm shadow-md shadow-slate-200"
          >
            <GraduationCap size={18} />
            Learn
          </Link>
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled((s) => !s)} />
          <SoundProfileSelector />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className={`relative z-10 max-w-6xl mx-auto px-6 transition-all duration-500 ${hasStarted ? 'pt-4 pb-12' : 'pt-12 pb-20'}`}>

        {/* Hero Section - Hidden when typing starts for vertical focus */}
        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, height: "auto" }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center mb-16 overflow-hidden"
            >
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
              >
                Master your flow.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-500 font-medium"
              >
                Practice typing in a peaceful, focused environment.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control row */}
        <motion.div
          animate={{ marginBottom: hasStarted ? "1.5rem" : "2.5rem" }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-1 py-1 rounded-2xl bg-slate-100/50 border border-slate-200/60">
            <LanguageToggle
              language={language}
              onChange={handleLanguageChange}
              disabled={isActive}
            />
          </div>

          <div className="flex items-center gap-2 px-1 py-1 rounded-2xl bg-slate-100/50 border border-slate-200/60">
            <TimerSelector
              duration={duration}
              onChange={handleDurationChange}
              disabled={isActive}
            />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200/60 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
            <input
              type="number"
              value={targetWpm}
              onChange={(e) => setTargetWpm(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-10 bg-transparent text-slate-900 text-sm font-bold outline-none"
              min="10"
              max="200"
            />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WPM</span>
          </div>

          {language === "nepali" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDuration(300);
                const formalPassages = nepaliPassages.slice(-2);
                setPassage(formalPassages[Math.floor(Math.random() * formalPassages.length)]);
                resetEngine();
                resetTimer();
                setHasStarted(false);
              }}
              className="px-6 py-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-all shadow-sm"
            >
              Lok Sewa Mode
            </motion.button>
          )}

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-all shadow-sm"
          >
            <RotateCcw size={16} />
            Restart
          </motion.button>
        </motion.div>

        {/* Two-column layout on desktop - Adjusted to comfortably fit sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

          {/* ── LEFT: Typing zone ── */}
          <div className="flex flex-col gap-5">

            {/* Stats */}
            <div className="mb-0">
              <StatsBar
                wpm={wpm}
                accuracy={accuracy}
                timeLeft={timeLeft}
                duration={duration}
              />
            </div>

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
              targetWpm={targetWpm}
            />

            {/* Keyboard Visualizer */}
            {!isFinished && hasStarted && (
              <KeyboardVisualizer language={language} />
            )}



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
            <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
              {(["scores", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all
                    ${activeTab === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"}`}
                >
                  {tab === "scores" ? "🏆 Best" : "📋 History"}
                </button>
              ))}
            </div>

            {activeTab === "scores" ? (
              <HighScorePanel scores={highScores} language={language} />
            ) : (
              <HistoryPanel history={history} onClear={handleClearHistory} />
            )}

            <ProgressInsights />

            {/* Nepal info card */}
            <div className="rounded-3xl bg-white border border-slate-200/60 p-6 text-center shadow-sm">
              <div className="text-4xl mb-3">🇳🇵</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Native support for Nepali Unicode. Choose your favorite font and start your flow.
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
