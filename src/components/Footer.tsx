"use client";

import { Heart, Github, Linkedin, Globe } from "lucide-react";

/**
 * Professional footer with developer attribution and social links.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full mt-12 pb-8 px-4 border-t border-white/5 pt-8">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">

                {/* Branding & Developer Credits */}
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-400 text-sm flex items-center gap-1.5 mb-2">
                        Built with <Heart size={14} className="text-red-500 fill-red-500" /> by
                        <span className="text-white font-bold hover:text-blue-400 transition-colors cursor-default">
                            Sijan KC
                        </span>
                    </p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                        © {currentYear} टाइपिंग अभ्यास (Typing Practice) • Made in Nepal 🇳🇵
                    </p>
                </div>

                {/* Personal & Project Links */}
                <div className="flex items-center gap-6">
                    <a
                        href="https://sijankc.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors group"
                        title="Sijan KC Portfolio"
                    >
                        <Globe size={18} className="group-hover:animate-pulse" />
                        <span className="text-xs font-medium">sijankc.com.np</span>
                    </a>
                    <a
                        href="https://github.com/sijanKc/App"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                        title="GitHub Repository"
                    >
                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">GitHub</span>
                    </a>
                </div>

                {/* Anti-Copy Protection Hint */}
                <div className="text-gray-600 text-[9px] select-none opacity-50">
                    Original Software Architecture & Design by Sijan KC. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}
