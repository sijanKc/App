"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface SoundToggleProps {
    enabled: boolean;
    onToggle: () => void;
}

/**
 * Simple icon button to toggle keystroke sound effects on/off.
 */
export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className={`
        w-9 h-9 rounded-xl flex items-center justify-center
        bg-slate-900/5 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-sm
        transition-colors
        ${enabled ? "text-green-400 hover:text-green-300" : "text-gray-500 hover:text-gray-300"}
      `}
            aria-label={enabled ? "Disable sound" : "Enable sound"}
        >
            {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </motion.button>
    );
}
