// Sample chopper maths: slice points (from transients, a beat grid or by hand), each slice rendered with fades,
// normalising and reversing, and a small Standard MIDI File writer that maps slices to notes for a sampler.
// Plain TypeScript, no DOM. Browser checks in tests/tools/sample-chopper.mjs.

export type SliceOpts = { fadeIn: number; fadeOut: number; normalise: boolean; reverse: boolean }; // fades in ms
export const DEFAULT_SLICE: SliceOpts = { fadeIn: 1, fadeOut: 5, normalise: false, reverse: false };

/**
 * Move each rough onset time (s) to the real attack in the sound: within -30 ms to +20 ms of the guess, the first
 * sample whose level reaches a quarter of the loudest sample in that window, less 1 ms so the attack is kept whole.
 * A guess is dropped when the sound does not get louder there (the peak after it is under 1.3 times the peak of the
 * 30 ms before), such as the end of a note that stops abruptly.
 */
export function refineOnsets(x: Float32Array, rate: number, times: number[]): number[] {
  const out: number[] = [];
  for (const t of times) {
    const a = Math.max(0, Math.round((t - 0.03) * rate)), b = Math.min(x.length, Math.round((t + 0.02) * rate));
    let peak = 0; for (let i = a; i < b; i++) { const v = Math.abs(x[i]); if (v > peak) peak = v; }
    let at = Math.round(t * rate);
    if (peak > 0) for (let i = a; i < b; i++) if (Math.abs(x[i]) >= peak * 0.25) { at = i; break; }
    let pre = 0; for (let i = Math.max(0, at - Math.round(0.03 * rate)); i < at - Math.round(0.002 * rate); i++) { const v = Math.abs(x[i]); if (v > pre) pre = v; }
    if (peak === 0 || peak < 1.3 * pre) continue;
    out.push(Math.max(0, at - Math.round(0.001 * rate)) / rate);
  }
  return out;
}

/** Slice starts (s) on a beat grid: every `per` beats (1 = quarter notes, 0.5 = eighths, 0.25 = sixteenths, 4 = bars). */
export function gridStarts(bpm: number, offset: number, per: number, duration: number): number[] {
  if (!(bpm > 0) || !(per > 0)) return [];
  const step = (60 / bpm) * per, out: number[] = [];
  let s = offset; while (s - step >= -1e-9) s -= step; // the first slice point at or after 0
  for (; s < duration - 0.005; s += step) if (s >= -1e-9) out.push(Math.max(0, s));
  return out;
}

/** Keep starts in order, inside the sound and at least `minGap` s apart. */
export function cleanStarts(starts: number[], duration: number, minGap = 0.01): number[] {
  const s = starts.filter((t) => t >= 0 && t < duration - minGap).sort((a, b) => a - b), out: number[] = [];
  for (const t of s) if (!out.length || t - out[out.length - 1] >= minGap) out.push(t);
  return out;
}

/** The slices (sample ranges) between the starts; the last one runs to the end. */
export function slicesFrom(starts: number[], rate: number, length: number): { a: number; b: number }[] {
  return starts.map((t, i) => ({ a: Math.round(t * rate), b: i + 1 < starts.length ? Math.round(starts[i + 1] * rate) : length })).filter((s) => s.b > s.a);
}

/** One slice of every channel with fades (linear, in ms, never longer than half the slice), normalised to -0.3 dBFS peak and/or reversed. */
export function renderSlice(chans: Float32Array[], rate: number, a: number, b: number, o: SliceOpts): Float32Array[] {
  const n = Math.max(0, b - a), out = chans.map((c) => c.slice(a, b));
  if (o.reverse) out.forEach((c) => c.reverse());
  const fi = Math.min(Math.floor(n / 2), Math.round((o.fadeIn / 1000) * rate)), fo = Math.min(Math.floor(n / 2), Math.round((o.fadeOut / 1000) * rate));
  for (const c of out) {
    for (let i = 0; i < fi; i++) c[i] *= i / fi;
    for (let i = 0; i < fo; i++) c[n - 1 - i] *= i / fo;
  }
  if (o.normalise) {
    let p = 0; for (const c of out) for (let i = 0; i < n; i++) { const v = Math.abs(c[i]); if (v > p) p = v; }
    if (p > 1e-6) { const g = Math.pow(10, -0.3 / 20) / p; for (const c of out) for (let i = 0; i < n; i++) c[i] *= g; }
  }
  return out;
}

/** Join rendered pieces one after another. */
export function joinPieces(pieces: Float32Array[][]): Float32Array[] {
  const ch = pieces[0]?.length ?? 1, n = pieces.reduce((s, p) => s + p[0].length, 0), out = Array.from({ length: ch }, () => new Float32Array(n));
  let o = 0; for (const p of pieces) { for (let c = 0; c < ch; c++) out[c].set(p[Math.min(c, p.length - 1)], o); o += p[0].length; }
  return out;
}

// ---------- Standard MIDI File (format 0) ----------
const vlq = (v: number) => { const b = [v & 0x7f]; while ((v >>= 7)) b.unshift((v & 0x7f) | 0x80); return b; };

/**
 * A one-track MIDI file (format 0, 480 ticks per quarter note) with one note per slice at the slice's own time and
 * length, slice 1 on `firstNote`, slice 2 a semitone up, and so on. Played into a sampler with the slices loaded
 * from `firstNote` up, it plays the loop back as it was; move the notes to make new patterns.
 */
export function slicesMidi(slices: { start: number; end: number }[], bpm: number, firstNote = 24, name = 'Slices'): Uint8Array {
  const ppq = 480, tempo = Math.round(60e6 / (bpm > 0 ? bpm : 120)), tick = (s: number) => Math.round((s * 1e6 / tempo) * ppq);
  const ev: { t: number; d: number[] }[] = [];
  slices.forEach((s, i) => {
    const note = Math.min(127, firstNote + i), on = tick(s.start), off = Math.max(on + 1, tick(s.end));
    ev.push({ t: on, d: [0x90, note, 100] }, { t: off, d: [0x80, note, 0] });
  });
  ev.sort((a, b) => a.t - b.t || (a.d[0] === 0x80 ? -1 : 1) - (b.d[0] === 0x80 ? -1 : 1)); // note-offs first at the same tick
  const nm = Array.from(new TextEncoder().encode(name.slice(0, 60)));
  const trk: number[] = [0, 0xff, 0x03, ...vlq(nm.length), ...nm, 0, 0xff, 0x51, 3, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255];
  let last = 0; for (const e of ev) { trk.push(...vlq(e.t - last), ...e.d); last = e.t; }
  trk.push(0, 0xff, 0x2f, 0);
  const head = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, ppq >> 8, ppq & 255];
  const len = trk.length, th = [0x4d, 0x54, 0x72, 0x6b, (len >>> 24) & 255, (len >> 16) & 255, (len >> 8) & 255, len & 255];
  return new Uint8Array([...head, ...th, ...trk]);
}
