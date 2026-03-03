"use client";

export const NEPALI_FONTS: { label: string; value: string; className: string }[] = [
    { label: "Noto Sans Devanagari", value: "noto", className: "font-noto" },
    { label: "Mukta", value: "mukta", className: "font-mukta" },
    { label: "Hind", value: "hind", className: "font-hind" },
    { label: "Noto Serif Devanagari", value: "tiro", className: "font-tiro" },
];

interface FontSelectorProps {
    selectedFont: string;
    onChange: (value: string) => void;
}

/**
 * Font selector dropdown shown only in Nepali mode.
 * Lets users switch between available Devanagari font families.
 */
export default function FontSelector({ selectedFont, onChange }: FontSelectorProps) {
    return (
        <div className="flex items-center gap-2">
            <select
                value={selectedFont}
                onChange={(e) => onChange(e.target.value)}
                className="
          bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl
          px-4 py-2 shadow-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          transition-all
        "
            >
                {NEPALI_FONTS.map((f) => (
                    <option key={f.value} value={f.value} className="bg-white text-slate-900">
                        {f.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

/** Returns the Tailwind font class for the current selection. */
export function getFontClass(value: string): string {
    return NEPALI_FONTS.find((f) => f.value === value)?.className ?? "font-noto";
}
