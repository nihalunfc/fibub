// Mix planner: read a track list (title, BPM, key, optional energy and file) and order it for a DJ set with a beam
// search that rewards key compatibility (theory.ts compatibility()), keeps BPM jumps small and follows an energy shape.
// Plain TypeScript, no DOM. Scores are fibub's own.
import { parseKey, compatibility, shiftKey, type Key, type Compat } from './theory.ts';

export type Track = { title: string; bpm: number; key: Key | null; energy: number | null; file: string };
export type Shape = 'steady' | 'build' | 'peak';
export type PlanOpts = { start: number; shape: Shape; maxJump: number; allowShift: boolean; beam?: number };
export type Step = { track: Track; index: number; shift: number; key: Key | null; compat: Compat | null; jump: number; tooFar: boolean };

/** Split one CSV or tab line, honouring "quoted, cells". */
export function splitLine(line: string): string[] {
  const sep = line.includes('\t') ? '\t' : line.includes(';') && !line.includes(',') ? ';' : ',';
  const out: string[] = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === sep) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/**
 * Read a track list. With a header row (columns named file/title/name/track, bpm/tempo, key/camelot, energy) the
 * columns are taken by name, so the Track analyser's CSV works as it is. Without one, each line is
 * "title, BPM, key" in any order: the first number from 40 to 300 is the BPM, the first cell that reads as a key
 * is the key, a whole number 1-10 after those is the energy, the rest is the title.
 */
export function parseTracks(text: string): { tracks: Track[]; skipped: number } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const tracks: Track[] = []; let skipped = 0;
  if (!lines.length) return { tracks, skipped };
  const head = splitLine(lines[0]).map((h) => h.toLowerCase());
  const col = (...names: string[]) => head.findIndex((h) => names.includes(h));
  const hasHead = col('bpm', 'tempo') >= 0 && (col('key', 'camelot', 'initial key') >= 0 || col('file', 'title', 'name', 'track') >= 0);
  if (hasHead) {
    const cT = col('title', 'name', 'track'), cF = col('file', 'path', 'location'), cB = col('bpm', 'tempo'), cC = col('camelot'), cK = col('key', 'initial key'), cE = col('energy');
    for (const l of lines.slice(1)) {
      const c = splitLine(l), bpm = parseFloat(c[cB]);
      const key = (cC >= 0 && parseKey(c[cC] ?? '')) || (cK >= 0 && parseKey(c[cK] ?? '')) || null;
      const file = cF >= 0 ? c[cF] ?? '' : '';
      const title = (cT >= 0 ? c[cT] : '') || file.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '') || `Track ${tracks.length + 1}`;
      if (!(bpm > 0)) { skipped++; continue; }
      const e = cE >= 0 ? parseFloat(c[cE]) : NaN;
      tracks.push({ title, bpm, key, energy: isFinite(e) ? e : null, file });
    }
    return { tracks, skipped };
  }
  for (const l of lines) {
    const c = splitLine(l).filter((x) => x !== '');
    let bpm = NaN, key: Key | null = null, energy: number | null = null; const rest: string[] = [];
    for (const cell of c) {
      const v = cell.replace(/\s*bpm$/i, '');
      if (isNaN(bpm) && /^\d+(\.\d+)?$/.test(v) && +v >= 40 && +v <= 300) { bpm = +v; continue; }
      if (!key) { const k = parseKey(cell); if (k) { key = k; continue; } }
      if (energy === null && !isNaN(bpm) && /^(10|[1-9])$/.test(cell)) { energy = +cell; continue; }
      rest.push(cell);
    }
    if (isNaN(bpm)) { skipped++; continue; }
    tracks.push({ title: rest.join(', ') || `Track ${tracks.length + 1}`, bpm, key, energy, file: '' });
  }
  return { tracks, skipped };
}

/** Target energy (0-1) at position i of n for a shape. */
export const target = (shape: Shape, i: number, n: number) => {
  const x = n > 1 ? i / (n - 1) : 0;
  return shape === 'build' ? x : shape === 'peak' ? 1 - Math.abs(2 * x - 1) : 0.5;
};

/**
 * Score of playing b (shifted by sb semitones) after a, with b at position pos of n (higher is better):
 *   key score 0-100 (compatibility(); 40 when a key is unknown)
 *   − 3 × BPM jump (in BPM), and − 300 when the jump is over maxJump
 *   − 60 × |b's energy − the shape's target| (energy from the list, else BPM, scaled 0-1 across the list; steady skips it)
 *   − 15 for a pitch-shifted track.
 */
function stepScore(a: Track, ka: Key | null, b: Track, kb: Key | null, sb: number, pos: number, n: number, eNorm: number, o: PlanOpts) {
  const key = ka && kb ? compatibility(ka, kb).score : 40;
  const jump = Math.abs(b.bpm - a.bpm);
  let s = key - 3 * jump - (jump > o.maxJump ? 300 : 0) - (sb ? 15 : 0);
  if (o.shape !== 'steady') s -= 60 * Math.abs(eNorm - target(o.shape, pos, n));
  return s;
}

/** Order the tracks: beam search (width 48) from the chosen start, each track once. */
export function plan(tracks: Track[], o: PlanOpts): Step[] {
  const n = tracks.length;
  if (!n) return [];
  const useE = tracks.every((t) => t.energy !== null), vals = tracks.map((t) => (useE ? t.energy! : t.bpm));
  const lo = Math.min(...vals), hi = Math.max(...vals), norm = vals.map((v) => (hi > lo ? (v - lo) / (hi - lo) : 0.5));
  const shifts = o.allowShift ? [0, -1, 1] : [0];
  type Node = { seq: number[]; sh: number[]; used: Uint8Array; score: number };
  const start = Math.max(0, Math.min(n - 1, o.start));
  const u0 = new Uint8Array(n); u0[start] = 1;
  let beam: Node[] = [{ seq: [start], sh: [0], used: u0, score: 0 }];
  const W = o.beam ?? 48;
  for (let pos = 1; pos < n; pos++) {
    const next: Node[] = [];
    for (const nd of beam) {
      const ai = nd.seq[nd.seq.length - 1], a = tracks[ai], ka = a.key ? shiftKey(a.key, nd.sh[nd.sh.length - 1]) : null;
      for (let bi = 0; bi < n; bi++) {
        if (nd.used[bi]) continue;
        const b = tracks[bi];
        for (const sb of b.key ? shifts : [0]) {
          const s = nd.score + stepScore(a, ka, b, b.key ? shiftKey(b.key, sb) : null, sb, pos, n, norm[bi], o);
          next.push({ seq: nd.seq.concat(bi), sh: nd.sh.concat(sb), used: nd.used, score: s });
        }
      }
    }
    next.sort((x, y) => y.score - x.score);
    // Keep the best W, at most 3 that end on the same track, so the beam stays varied.
    const seen = new Map<string, number>(); beam = [];
    for (const c of next) {
      const k = c.seq[c.seq.length - 1] + ':' + c.sh[c.sh.length - 1], m = seen.get(k) ?? 0;
      if (m >= 3) continue;
      seen.set(k, m + 1);
      const used = c.used.slice(); used[c.seq[c.seq.length - 1]] = 1;
      beam.push({ ...c, used });
      if (beam.length >= W) break;
    }
  }
  const best = beam[0];
  return best.seq.map((ti, i) => {
    const t = tracks[ti], key = t.key ? shiftKey(t.key, best.sh[i]) : null;
    if (!i) return { track: t, index: ti, shift: best.sh[i], key, compat: null, jump: 0, tooFar: false };
    const p = tracks[best.seq[i - 1]], pk = p.key ? shiftKey(p.key, best.sh[i - 1]) : null, jump = t.bpm - p.bpm;
    return { track: t, index: ti, shift: best.sh[i], key, compat: pk && key ? compatibility(pk, key) : null, jump, tooFar: Math.abs(jump) > o.maxJump };
  });
}

/** Short label for a transition: perfect, good, energy boost, mood change or risky. */
export function transitionTag(s: Step): 'perfect' | 'good' | 'energy boost' | 'mood change' | 'risky' | 'unknown key' {
  if (!s.compat) return 'unknown key';
  if (s.tooFar) return 'risky';
  if (s.compat.label.startsWith('Energy boost')) return 'energy boost';
  if (s.compat.tier === 'ok') return 'mood change';
  return s.compat.tier === 'perfect' ? 'perfect' : s.compat.tier === 'good' ? 'good' : 'risky';
}
