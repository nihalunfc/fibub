// A small Web Audio note player for tools that let people hear a note or chord (soft sine/triangle with a gentle envelope).
let ac: AudioContext | null = null;
export type PlayOpts = { secs?: number; volume?: number; wave?: OscillatorType; a4?: number; stagger?: number };
/** Play MIDI notes together (stagger > 0 spreads them like a strum). Volume 0-1, default quiet. */
export async function playNotes(midis: number[], o: PlayOpts = {}) {
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  ac ??= new AC();
  if (ac.state === 'suspended') await ac.resume();
  const secs = o.secs ?? 1.2, vol = o.volume ?? 0.15, a4 = o.a4 ?? 440, t0 = ac.currentTime + 0.02;
  const master = ac.createGain(), per = vol / Math.max(1, Math.sqrt(midis.length));
  master.connect(ac.destination);
  midis.forEach((m, i) => {
    const osc = ac!.createOscillator(), g = ac!.createGain(), t = t0 + i * (o.stagger ?? 0);
    osc.type = o.wave ?? 'triangle';
    osc.frequency.value = a4 * Math.pow(2, (m - 69) / 12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(per, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + secs);
    osc.connect(g); g.connect(master); osc.start(t); osc.stop(t + secs + 0.05);
  });
}
/** Play a frequency in Hz. */
export const playFreq = (hz: number, o: PlayOpts = {}) => playNotes([69 + 12 * Math.log2(hz / (o.a4 ?? 440))], o);
