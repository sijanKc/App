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
        w-10 h-10 rounded-xl flex items-center justify-center
        bg-white border border-slate-100 shadow-sm transition-all
        ${enabled ? "text-emerald-600 hover:bg-slate-50" : "text-slate-400 hover:bg-slate-50"}
      `}
            aria-label={enabled ? "Disable sound" : "Enable sound"}
        >
            {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.button>
    );
}
