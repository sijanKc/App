/**
 * Official Nepali Unicode Romanized Keyboard Mapping
 * This is the layout typically preferred by users who are used to Romanized typing.
 */

export const NEPALI_UNICODE_ROMANIZED_MAP: Record<string, string> = {
    // Top Row
    "q": "ठ", "Q": "ट",
    "w": "ौ", "W": "औ",
    "e": "े", "E": "ए",
    "r": "र", "R": "ृ",
    "t": "त", "T": "थ",
    "y": "य", "Y": "ञ",
    "u": "ु", "U": "ू",
    "i": "ि", "I": "ी",
    "o": "ो", "O": "ओ",
    "p": "प", "P": "फ",
    "[": "इ", "{": "ई",
    "]": "ऐ", "}": "ऐ", // Follows image: ] is ऐ.
    "\\": "्", "|": "र्", // Halant (virama) is usually on backslash

    // Home Row
    "a": "ा", "A": "आ",
    "s": "स", "S": "श",
    "d": "द", "D": "ध",
    "f": "उ", "F": "ऊ",
    "g": "ग", "G": "घ",
    "h": "ह", "H": "अ",
    "j": "ज", "J": "झ",
    "k": "क", "K": "ख",
    "l": "ल", "L": "ळ",
    ";": ";", ":": ":",
    "'": "'", "\"": "\"",

    // Bottom Row
    "z": "ष", "Z": "ऋ",
    "x": "ड", "X": "ढ",
    "c": "च", "C": "छ",
    "v": "व", "V": "ब",
    "b": "ब", "B": "भ",
    "n": "न", "N": "ण",
    "m": "म", "M": "ं",
    ",": ",", "<": "ङ",
    ".": ".", ">": "॥",
    "/": "।", "?": "?",

    // Numbers
    "1": "१", "2": "२", "3": "३", "4": "४", "5": "५", "6": "६", "7": "७", "8": "८", "9": "९", "0": "०",
    "!": "!", "@": "@", "#": "#", "$": "$", "%": "%", "^": "^", "&": "&", "*": "*", "(": "(", ")": ")",
    "-": "-", "_": "_", "=": "=", "+": "+"
};

/**
 * Maps a single English key to its Nepali Unicode equivalent (Romanized).
 */
export function mapKeyToNepaliUnicode(key: string): string {
    return NEPALI_UNICODE_ROMANIZED_MAP[key] ?? key;
}

/**
 * Checks if a key is a character that should be mapped.
 */
export function isMappableKey(key: string): boolean {
    return key.length === 1 && !["Enter", "Backspace", "Tab", "Escape"].includes(key);
}
