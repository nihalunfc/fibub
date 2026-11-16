// Test tones, sweeps, noise, DTMF keys and phone call-progress signals as samples. Plain TypeScript, no DOM.
export type Wave = 'sine' | 'square' | 'triangle' | 'sawtooth';

const TAU = 2 * Math.PI;
const shape = (w: Wave, ph: number) => {
  const p = ph - Math.floor(ph); // 0..1
  if (w === 'sine') return Math.sin(TAU * p);
  if (w === 'square') return p < 0.5 ? 1 : -1;
  if (w === 'triangle') return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
  return p < 0.5 ? 2 * p : 2 * p - 2; // sawtooth, starting at 0
};

/** A short fade at each end (default 5 ms) so the start and stop do not click. */
export function fadeEdges(x: Float32Array, rate: number, ms = 5): Float32Array {
  const n = Math.min(Math.floor(x.length / 2), Math.round((rate * ms) / 1000));
  for (let i = 0; i < n; i++) { const g = i / n; x[i] *= g; x[x.length - 1 - i] *= g; }
  return x;
}

export const dbToAmp = (db: number) => Math.pow(10, db / 20);

/** A steady tone. amp is the peak (1 = full scale). */
export function tone(wave: Wave, freq: number, secs: number, rate: number, amp = 0.5): Float32Array {
  const n = Math.max(1, Math.round(secs * rate)), out = new Float32Array(n), k = freq / rate;
  for (let i = 0; i < n; i++) out[i] = amp * shape(wave, i * k);
  return fadeEdges(out, rate);
}

/** A sine sweep from f1 to f2; log = equal time per octave (the usual speaker and room test). */
export function sweep(f1: number, f2: number, secs: number, rate: number, amp = 0.5, log = true): Float32Array {
  const n = Math.max(1, Math.round(secs * rate)), out = new Float32Array(n), T = n / rate;
  const L = Math.log(f2 / f1);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const ph = log && f1 !== f2 ? (f1 * T / L) * (Math.exp((t / T) * L) - 1) : f1 * t + ((f2 - f1) * t * t) / (2 * T);
    out[i] = amp * Math.sin(TAU * ph);
  }
  return fadeEdges(out, rate);
}

/** White or pink noise (pink: Paul Kellet's filter, -3 dB per octave). seed makes it repeatable. */
export function noise(kind: 'white' | 'pink', secs: number, rate: number, amp = 0.5, seed = 1): Float32Array {
  const n = Math.max(1, Math.round(secs * rate)), out = new Float32Array(n);
  let s = seed >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296 * 2 - 1; };
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < n; i++) {
    const w = rnd();
    if (kind === 'white') { out[i] = w; continue; }
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
  }
  let p = 0; for (let i = 0; i < n; i++) p = Math.max(p, Math.abs(out[i]));
  if (p) for (let i = 0; i < n; i++) out[i] *= amp / p;
  return fadeEdges(out, rate);
}

/** DTMF (touch-tone) frequency pairs, ITU-T Q.23: low (row) and high (column) in Hz. */
export const DTMF: Record<string, [number, number]> = {};
const ROWS = [697, 770, 852, 941], COLS = [1209, 1336, 1477, 1633], KEYS = ['123A', '456B', '789C', '*0#D'];
KEYS.forEach((r, i) => [...r].forEach((k, j) => (DTMF[k] = [ROWS[i], COLS[j]])));

/** Several sine tones added together, each at amp. */
function mix(freqs: number[], n: number, rate: number, amp: number, out: Float32Array, at: number) {
  for (let i = 0; i < n && at + i < out.length; i++) { let v = 0; for (const f of freqs) v += Math.sin((TAU * f * i) / rate); out[at + i] = amp * v; }
}

/** A DTMF sequence such as "1234#". A comma is a 0.5 s pause; other characters are skipped. */
export function dtmf(seq: string, rate: number, toneMs = 100, gapMs = 100, amp = 0.35): Float32Array {
  const keys = [...seq.toUpperCase()].filter((c) => c in DTMF || c === ',');
  const tn = Math.round((rate * toneMs) / 1000), gn = Math.round((rate * gapMs) / 1000), pn = Math.round(rate / 2);
  const n = keys.reduce((s, c) => s + (c === ',' ? pn : tn + gn), 0), out = new Float32Array(Math.max(1, n));
  let at = 0;
  for (const c of keys) {
    if (c === ',') { at += pn; continue; }
    mix(DTMF[c], tn, rate, amp, out, at); fadeEdges(out.subarray(at, at + tn), rate, 3); at += tn + gn;
  }
  return out;
}

/** Call-progress tones from ITU-T E.180 Supplement 2 (tones used in national networks). on/off pattern in seconds; [] = steady. */
export const SIGNALS: Record<string, { name: string; freqs: number[]; pattern: number[] }> = {
  'na-dial': { name: 'North America: dial tone', freqs: [350, 440], pattern: [] },
  'na-ring': { name: 'North America: ringing (ringback)', freqs: [440, 480], pattern: [2, 4] },
  'na-busy': { name: 'North America: busy', freqs: [480, 620], pattern: [0.5, 0.5] },
  'na-reorder': { name: 'North America: fast busy (reorder)', freqs: [480, 620], pattern: [0.25, 0.25] },
  'uk-dial': { name: 'UK: dial tone', freqs: [350, 450], pattern: [] },
  'uk-ring': { name: 'UK: ringing', freqs: [400, 450], pattern: [0.4, 0.2, 0.4, 2] },
  'uk-busy': { name: 'UK: engaged', freqs: [400], pattern: [0.375, 0.375] },
  'in-dial': { name: 'India: dial tone (400 Hz × 25 Hz)', freqs: [375, 425], pattern: [] },
  'in-ring': { name: 'India: ringing (400 Hz × 25 Hz)', freqs: [375, 425], pattern: [0.4, 0.2, 0.4, 2] },
  'in-busy': { name: 'India: busy', freqs: [400], pattern: [0.75, 0.75] },
};

/** A call-progress signal lasting secs (cadences repeat; each burst faded so it does not click). */
export function signal(id: string, secs: number, rate: number, amp = 0.3): Float32Array {
  const s = SIGNALS[id], n = Math.max(1, Math.round(secs * rate)), out = new Float32Array(n);
  if (!s) return out;
  const a = amp / s.freqs.length * (s.freqs.length > 1 ? 1.4 : 1);
  if (!s.pattern.length) { mix(s.freqs, n, rate, a, out, 0); return fadeEdges(out, rate); }
  let at = 0, k = 0;
  while (at < n) {
    const len = Math.round(s.pattern[k % s.pattern.length] * rate);
    if (k % 2 === 0) { const m = Math.min(len, n - at); mix(s.freqs, m, rate, a, out, at); fadeEdges(out.subarray(at, at + m), rate, 4); }
    at += len; k++;
  }
  return out;
}

/** Strength of one frequency (Goertzel), as the amplitude of a sine at that frequency. For checks and the DTMF test. */
export function goertzel(x: Float32Array, freq: number, rate: number): number {
  const w = (TAU * freq) / rate, c = 2 * Math.cos(w); let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) { const s0 = x[i] + c * s1 - s2; s2 = s1; s1 = s0; }
  return (2 * Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2))) / x.length;
}
