// Streaming loudness meter (ITU-R BS.1770-4, EBU Tech 3341/3342): feed it sound in chunks of any size and read
// momentary (400 ms), short-term (3 s), integrated since reset (gated), loudness range and true peak (4x oversampled).
// Plain TypeScript, no DOM; the LUFS meter page feeds it from the microphone, a shared tab or a playing file.
import { kWeighting } from './loudness.ts';

const lufs = (ms: number) => (ms > 0 ? -0.691 + 10 * Math.log10(ms) : -Infinity);
// The same 4x interpolator as loudness.ts and master.ts (12-tap Kaiser-windowed sinc per phase).
const H = (() => {
  const out: number[] = [];
  const i0 = (v: number) => { let s = 1, t = 1; for (let k = 1; k < 25; k++) { t *= (v / (2 * k)) ** 2; s += t; } return s; };
  for (const p of [1, 2, 3]) for (let k = -5; k <= 6; k++) { const t = k - p / 4, r = t / 6.5, w = Math.abs(r) >= 1 ? 0 : i0(6 * Math.sqrt(1 - r * r)) / i0(6); out.push(t === 0 ? 1 : (Math.sin(Math.PI * t) / (Math.PI * t)) * w); }
  return Float64Array.from(out);
})();

export class LoudnessMeter {
  readonly rate: number;
  private nc: number; private sub: number; private coef: number[][];
  private st: Float64Array[]; private hist: Float64Array[]; private hpos = 0;
  private acc = 0; private accN = 0; private subs: number[] = [];
  /** Power of every 400 ms block (one per 100 ms) since reset, and of every 3 s block. */
  blocks: number[] = []; stBlocks: number[] = [];
  peak = 0; momentary = -Infinity; shortTerm = -Infinity; maxMomentary = -Infinity; maxShortTerm = -Infinity;
  constructor(rate: number, channels: number) {
    this.rate = rate; this.nc = channels; this.sub = Math.round(rate / 10);
    const [a, b] = kWeighting(rate); this.coef = [[...a.b, a.a[1], a.a[2]], [...b.b, b.a[1], b.a[2]]];
    this.st = Array.from({ length: channels }, () => new Float64Array(8));
    this.hist = Array.from({ length: channels }, () => new Float64Array(12));
  }
  reset() {
    this.blocks = []; this.stBlocks = []; this.subs = []; this.acc = 0; this.accN = 0; this.peak = 0;
    this.momentary = this.shortTerm = this.maxMomentary = this.maxShortTerm = -Infinity;
  }
  /** Add a chunk (one Float32Array per channel, all the same length). Returns true when a new 100 ms step finished. */
  push(chans: Float32Array[]): boolean {
    const n = chans[0]?.length ?? 0, [s, h] = this.coef; let stepped = false;
    for (let i = 0; i < n; i++) {
      let z = 0;
      for (let c = 0; c < this.nc; c++) {
        const x = chans[c] ? chans[c][i] : 0, q = this.st[c];
        // Shelf then high pass, Direct Form I; state: x1 x2 y1 y2 for each stage.
        const y = s[0] * x + s[1] * q[0] + s[2] * q[1] - s[3] * q[2] - s[4] * q[3]; q[1] = q[0]; q[0] = x; q[3] = q[2]; q[2] = y;
        const w = h[0] * y + h[1] * q[4] + h[2] * q[5] - h[3] * q[6] - h[4] * q[7]; q[5] = q[4]; q[4] = y; q[7] = q[6]; q[6] = w;
        z += w * w;
        // True peak: the sample, and the three points between the sample 6 back and 5 back.
        const hb = this.hist[c]; hb[this.hpos] = x;
        const ax = x < 0 ? -x : x; if (ax > this.peak) this.peak = ax;
        for (let p = 0; p < 36; p += 12) {
          let v = 0; for (let k = 0; k < 12; k++) v += hb[(this.hpos + 1 + k) % 12] * H[p + k];
          const a = v < 0 ? -v : v; if (a > this.peak) this.peak = a;
        }
      }
      this.hpos = (this.hpos + 1) % 12;
      this.acc += z; this.accN++;
      if (this.accN === this.sub) { this.step(this.acc / this.sub); this.acc = 0; this.accN = 0; stepped = true; }
    }
    return stepped;
  }
  private step(p: number) {
    this.subs.push(p); if (this.subs.length > 30) this.subs.shift();
    const k = this.subs.length;
    if (k >= 4) {
      const m = (this.subs[k - 1] + this.subs[k - 2] + this.subs[k - 3] + this.subs[k - 4]) / 4;
      this.blocks.push(m); this.momentary = lufs(m); if (this.momentary > this.maxMomentary) this.maxMomentary = this.momentary;
    }
    if (k === 30) {
      const m = this.subs.reduce((a, b) => a + b, 0) / 30;
      this.stBlocks.push(m); this.shortTerm = lufs(m); if (this.shortTerm > this.maxShortTerm) this.maxShortTerm = this.shortTerm;
    }
  }
  /** Gated integrated loudness since reset (-70 LUFS absolute, then 10 LU below the mean). */
  integrated(): number {
    const abs = this.blocks.filter((z) => lufs(z) > -70);
    if (!abs.length) return -Infinity;
    const rel = lufs(abs.reduce((s, z) => s + z, 0) / abs.length) - 10, g = abs.filter((z) => lufs(z) > rel);
    return g.length ? lufs(g.reduce((s, z) => s + z, 0) / g.length) : -Infinity;
  }
  /** Loudness range (EBU Tech 3342): 10th to 95th percentile of gated short-term values. */
  range(): number {
    const sa = this.stBlocks.filter((z) => lufs(z) > -70);
    if (sa.length < 2) return 0;
    const rel = lufs(sa.reduce((s, z) => s + z, 0) / sa.length) - 20, v = sa.map(lufs).filter((l) => l > rel).sort((a, b) => a - b);
    if (v.length < 2) return 0;
    const q = (p: number) => v[Math.min(v.length - 1, Math.round(p * (v.length - 1)))];
    return q(0.95) - q(0.1);
  }
  truePeakDb(): number { return this.peak > 0 ? 20 * Math.log10(this.peak) : -Infinity; }
}
