"use client";

export const NEPALI_FONTS: { label: string; value: string; className: string }[] = [
    { label: "Noto Sans Devanagari", value: "noto", className: "font-noto" },
    { label: "Mukta", value: "mukta", className: "font-mukta" },
    { label: "Hind", value: "hind", className: "font-hind" },
    { label: "Noto Serif Devanagari", value: "tiro", className: "font-tiro" },
    { label: "Preeti", value: "preeti", className: "font-preeti" },
    { label: "Kantipur", value: "kantipur", className: "font-kantipur" },
    { label: "Sagarmatha", value: "sagarmatha", className: "font-sagarmatha" },
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
          bg-white/10 border border-white/20 text-white text-sm rounded-lg
          px-3 py-1.5 backdrop-blur-sm cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500
          [&>option]:bg-gray-900
        "
            >
                {NEPALI_FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
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
