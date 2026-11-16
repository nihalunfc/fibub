// Loudness as broadcasters and streaming services measure it: ITU-R BS.1770-4 (K-weighting, gated integrated
// loudness in LUFS), loudness range (EBU Tech 3342) and true peak (4x oversampled). Plain TypeScript, no DOM.

type Biquad = { b: [number, number, number]; a: [number, number, number] };

/** The two K-weighting filters for any sample rate (BS.1770 values; design as in libebur128, which matches the 48 kHz table). */
export function kWeighting(rate: number): [Biquad, Biquad] {
  let K = Math.tan((Math.PI * 1681.974450955533) / rate), Q = 0.7071752369554196;
  const Vh = Math.pow(10, 3.999843853973347 / 20), Vb = Math.pow(Vh, 0.4996667741545416);
  let a0 = 1 + K / Q + K * K;
  const shelf: Biquad = {
    b: [(Vh + (Vb * K) / Q + K * K) / a0, (2 * (K * K - Vh)) / a0, (Vh - (Vb * K) / Q + K * K) / a0],
    a: [1, (2 * (K * K - 1)) / a0, (1 - K / Q + K * K) / a0],
  };
  K = Math.tan((Math.PI * 38.13547087602444) / rate); Q = 0.5003270373238773; a0 = 1 + K / Q + K * K;
  const hp: Biquad = { b: [1, -2, 1], a: [1, (2 * (K * K - 1)) / a0, (1 - K / Q + K * K) / a0] };
  return [shelf, hp];
}

function filter(x: Float32Array, f: Biquad): Float64Array {
  const y = new Float64Array(x.length), [b0, b1, b2] = f.b, [, a1, a2] = f.a;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) { const v = x[i], o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o; }
  return y;
}

/** Channel weights: 1 for left, right and centre, 1.41 for surrounds (5.1 order L R C LFE Ls Rs; LFE left out). */
const weight = (c: number, n: number) => (n === 6 ? [1, 1, 1, 0, 1.41, 1.41][c] : n === 5 ? [1, 1, 1, 1.41, 1.41][c] : 1);
const lufs = (ms: number) => -0.691 + 10 * Math.log10(ms);

export type Loudness = { integrated: number; range: number; maxMomentary: number; maxShortTerm: number; truePeak: number; samplePeak: number };

/** Mean-square power of each block (len samples, every hop samples) of the K-weighted, channel-weighted sum. */
function blocks(kw: Float64Array[], n: number, len: number, hop: number, wts: number[]): number[] {
  const out: number[] = [];
  if (n < len) return out;
  // Running sums of squares per channel, so each block costs O(1).
  const cum = kw.map((y) => { const c = new Float64Array(n + 1); for (let i = 0; i < n; i++) c[i + 1] = c[i] + y[i] * y[i]; return c; });
  for (let s = 0; s + len <= n; s += hop) { let z = 0; cum.forEach((c, ch) => (z += wts[ch] * (c[s + len] - c[s]) / len)); out.push(z); }
  return out;
}

// True peak: the three in-between points of 4x oversampling, from a 12-tap Kaiser-windowed sinc per phase (as BS.1770 Annex 2 does).
const TP = [1, 2, 3].map((p) => {
  const f = p / 4, h: number[] = [];
  const i0 = (v: number) => { let s = 1, t = 1; for (let k = 1; k < 25; k++) { t *= (v / (2 * k)) ** 2; s += t; } return s; };
  for (let k = -5; k <= 6; k++) { const t = k - f, r = t / 6.5, w = Math.abs(r) >= 1 ? 0 : i0(6 * Math.sqrt(1 - r * r)) / i0(6); h.push(t === 0 ? 1 : (Math.sin(Math.PI * t) / (Math.PI * t)) * w); }
  return h;
});
function interPeak(x: Float32Array): number {
  let p = 0;
  for (let i = 5; i + 7 < x.length; i++) for (const h of TP) {
    let s = 0; for (let k = 0; k < 12; k++) s += x[i - 5 + k] * h[k];
    const a = s < 0 ? -s : s; if (a > p) p = a;
  }
  return p;
}

/** Measure loudness. Silence gives -Infinity. */
export function measure(chans: Float32Array[], rate: number): Loudness {
  const n = chans[0]?.length ?? 0, [shelf, hp] = kWeighting(rate);
  const kw = chans.map((c) => { const y = filter(c, shelf); return Float64Array.from(filter(Float32Array.from(y), hp)); });
  const wts = chans.map((_, c) => weight(c, chans.length));
  // Integrated: 400 ms blocks, 75% overlap; absolute gate -70 LUFS, then relative gate 10 LU below the mean.
  const m = blocks(kw, n, Math.round(0.4 * rate), Math.round(0.1 * rate), wts);
  const abs = m.filter((z) => lufs(z) > -70);
  let integrated = -Infinity;
  if (abs.length) {
    const rel = lufs(abs.reduce((s, z) => s + z, 0) / abs.length) - 10, g = abs.filter((z) => lufs(z) > rel);
    if (g.length) integrated = lufs(g.reduce((s, z) => s + z, 0) / g.length);
  }
  // Loudness range: 3 s blocks every 100 ms (Tech 3342 uses at least 10 per second), gates -70 and -20 LU, 10th to 95th percentile.
  const st = blocks(kw, n, Math.round(3 * rate), Math.round(0.1 * rate), wts);
  let range = 0;
  const sa = st.filter((z) => lufs(z) > -70);
  if (sa.length) {
    const rel = lufs(sa.reduce((s, z) => s + z, 0) / sa.length) - 20, v = sa.map(lufs).filter((l) => l > rel).sort((a, b) => a - b);
    if (v.length > 1) { const q = (p: number) => v[Math.min(v.length - 1, Math.round(p * (v.length - 1)))]; range = q(0.95) - q(0.1); }
  }
  let samplePeak = 0, truePeak = 0;
  for (const c of chans) {
    for (let i = 0; i < c.length; i++) samplePeak = Math.max(samplePeak, Math.abs(c[i]));
    truePeak = Math.max(truePeak, interPeak(c));
  }
  const db = (v: number) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
  return {
    integrated, range,
    maxMomentary: m.length ? lufs(Math.max(...m)) : -Infinity,
    maxShortTerm: st.length ? lufs(Math.max(...st)) : -Infinity,
    truePeak: db(Math.max(truePeak, samplePeak)), samplePeak: db(samplePeak),
  };
}

/** Common loudness targets (integrated LUFS and the highest true peak they allow, in dBTP). */
export const TARGETS = [
  { id: 'stream', lufs: -14, peak: -1, name: 'Spotify, YouTube, Tidal (−14 LUFS)' },
  { id: 'apple', lufs: -16, peak: -1, name: 'Apple Music, podcasts (−16 LUFS)' },
  { id: 'podcast-mono', lufs: -19, peak: -1, name: 'Mono podcast (−19 LUFS)' },
  { id: 'ebu', lufs: -23, peak: -1, name: 'EBU R 128 broadcast, Europe (−23 LUFS)' },
  { id: 'atsc', lufs: -24, peak: -2, name: 'ATSC A/85 broadcast, North America (−24 LKFS)' },
];

/** The gain (dB) to reach target LUFS, lowered if needed so the true peak stays at or under maxPeak. */
export function planGain(l: Loudness, target: number, maxPeak: number): { gain: number; limitedByPeak: boolean } {
  if (!isFinite(l.integrated)) return { gain: 0, limitedByPeak: false };
  const want = target - l.integrated, room = maxPeak - l.truePeak;
  return want > room ? { gain: room, limitedByPeak: true } : { gain: want, limitedByPeak: false };
}
