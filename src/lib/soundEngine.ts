// Lightweight Web Audio API sound engine — no external dependencies

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!audioCtx && typeof window !== "undefined") {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx!;
}

export type SwitchType = "blue" | "red" | "brown";
let currentSwitch: SwitchType = "blue";

export function setSwitchType(type: SwitchType) {
    currentSwitch = type;
}

/**
 * Plays a synthesized mechanical switch sound.
 */
export async function playKeystroke(): Promise<void> {
    try {
        const ctx = getCtx();
        if (ctx.state === "suspended") await ctx.resume();

        const now = ctx.currentTime;

        // Base "Thud" (Low frequency)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(currentSwitch === "red" ? 150 : 200, now);
        gain1.gain.setValueAtTime(0.05, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc1.start(now);
        osc1.stop(now + 0.1);

        // "Click" for Blue and Brown
        if (currentSwitch !== "red") {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = currentSwitch === "blue" ? "square" : "triangle";
            osc2.frequency.setValueAtTime(currentSwitch === "blue" ? 1200 : 800, now);
            gain2.gain.setValueAtTime(currentSwitch === "blue" ? 0.02 : 0.01, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + (currentSwitch === "blue" ? 0.03 : 0.05));
            osc2.start(now);
            osc2.stop(now + 0.05);
        }

        // Acoustic Echo/Body Resonance (The "Premium" Polish)
        const convolve = ctx.createOscillator();
        const convolveGain = ctx.createGain();
        convolve.connect(convolveGain);
        convolveGain.connect(ctx.destination);
        convolve.type = "sine";
        convolve.frequency.setValueAtTime(60, now);
        convolveGain.gain.setValueAtTime(0.01, now);
        convolveGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        convolve.start(now);
        convolve.stop(now + 0.2);
    } catch { }
}

/**
 * Plays a subtle buzz for an error keystroke.
 */
export async function playError(): Promise<void> {
    try {
        const ctx = getCtx();
        if (ctx.state === "suspended") await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
    } catch { }
}

/**
 * Plays a pleasant chime when a session completes.
 */
export async function playComplete(): Promise<void> {
    try {
        const ctx = getCtx();
        if (ctx.state === "suspended") await ctx.resume();
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            const startTime = ctx.currentTime + i * 0.15;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    } catch { }
}
