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
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
            {(["nepali", "english"] as const).map((lang) => (
                <motion.button
                    key={lang}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !disabled && onChange(lang)}
                    disabled={disabled}
                    className={`
            relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${language === lang
                            ? "bg-gradient-to-r from-red-600 to-blue-700 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"}
          `}
                >
                    {lang === "nepali" ? "🇳🇵 नेपाली" : "🇬🇧 English"}
                </motion.button>
            ))}
        </div>
    );
}
