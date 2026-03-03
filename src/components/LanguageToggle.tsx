"use client";

import { motion } from "framer-motion";

interface LanguageToggleProps {
    language: "nepali" | "english";
    onChange: (lang: "nepali" | "english") => void;
    disabled?: boolean;
}

/**
 * Toggle button between Nepali and English typing modes.
 * Disabled while a session is in progress.
 */
export default function LanguageToggle({
    language,
    onChange,
    disabled,
}: LanguageToggleProps) {
    return (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-100 shadow-sm">
            {(["nepali", "english"] as const).map((lang) => (
                <motion.button
                    key={lang}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !disabled && onChange(lang)}
                    disabled={disabled}
                    className={`
            relative px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest
            ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            ${language === lang
                            ? "bg-slate-950 text-white shadow-md shadow-slate-200"
                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}
          `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {lang === "nepali" ? "🇳🇵 NP" : "🇬🇧 EN"}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
