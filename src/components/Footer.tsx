"use client";

import { Heart, Github, Linkedin, Globe } from "lucide-react";

/**
 * Professional footer with developer attribution and social links.
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full mt-20 pb-12 px-6 border-t border-slate-200/60 pt-12">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

                {/* Branding & Developer Credits */}
                <div className="flex flex-col items-center text-center">
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mb-3">
                        Crafted with <Heart size={16} className="text-rose-400 fill-rose-100" /> by
                        <span className="text-slate-900 font-bold hover:text-indigo-600 transition-colors cursor-default">
                            Sijan KC
                        </span>
                    </p>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                        © {currentYear} टाइपिंग अभ्यास • Made in Nepal 🇳🇵
                    </p>
                </div>

                {/* Personal Link */}
                <div className="flex items-center gap-8">
                    <a
                        href="https://sijankc.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all group px-4 py-2 rounded-xl bg-slate-50 border border-slate-100"
                        title="Sijan KC Portfolio"
                    >
                        <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-bold">sijankc.com.np</span>
                    </a>
                </div>

                {/* Anti-Copy Protection Hint */}
                <div className="text-slate-300 text-[10px] font-medium select-none uppercase tracking-widest">
                    Original Software Design • Sijan KC
                </div>
            </div>
        </footer>
    );
}
