// Lightweight Web Audio API sound engine — no external dependencies

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
    if (!audioCtx && typeof window !== "undefined") {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx!;
}

/**
 * Plays a short click sound for a correct keystroke.
 */
export async function playKeystroke(): Promise<void> {
    try {
        const ctx = getCtx();
        if (ctx.state === "suspended") await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    } catch {
        // silently ignore if audio is not available
    }
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
