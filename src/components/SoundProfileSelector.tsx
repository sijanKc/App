"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Music } from "lucide-react";
import { setSwitchType, SwitchType } from "@/lib/soundEngine";

const SWITCHES: { id: SwitchType; label: string; activeColor: string; inactiveColor: string; desc: string }[] = [
    { id: "blue", label: "Blue", activeColor: "bg-blue-600", inactiveColor: "text-blue-600", desc: "Clicky & Tactile" },
    { id: "brown", label: "Brown", activeColor: "bg-amber-600", inactiveColor: "text-amber-600", desc: "Quiet & Tactile" },
    { id: "red", label: "Red", activeColor: "bg-rose-600", inactiveColor: "text-rose-600", desc: "Linear & Smooth" },
];

export default function SoundProfileSelector() {
    const [selected, setSelected] = useState<SwitchType>("blue");

    const handleSelect = (type: SwitchType) => {
        setSelected(type);
        setSwitchType(type);
    };

    return (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-100 shadow-sm">
            {SWITCHES.map((sw) => (
                <button
                    key={sw.id}
                    onClick={() => handleSelect(sw.id)}
                    className={`
            px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all
            ${selected === sw.id
                            ? `${sw.activeColor} text-white shadow-md shadow-slate-200`
                            : `text-slate-400 hover:bg-slate-50 ${sw.inactiveColor.replace('text-', 'hover:text-')}`}
          `}
                    title={sw.desc}
                >
                    {sw.label}
                </button>
            ))}
        </div>
    );
}
