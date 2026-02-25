"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Dark/light mode toggle using next-themes.
 * Renders only after mount to avoid hydration mismatch.
 */
export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-9 h-9" />;

    const isDark = theme === "dark";

    return (
        <motion.button
            whileTap={{ scale: 0.9, rotate: 20 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
        w-9 h-9 rounded-xl flex items-center justify-center
        bg-slate-200/50 dark:bg-white/10 border border-slate-300/50 dark:border-white/10 backdrop-blur-sm
        text-yellow-600 dark:text-yellow-300 hover:text-yellow-700 dark:hover:text-yellow-200 transition-colors
      "
            aria-label="Toggle dark/light mode"
        >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.button>
    );
}
