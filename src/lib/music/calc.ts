// Tempo-synced times, LFO rates, gig fee and royalty maths. Plain TypeScript, no DOM (checks in tests/tools/*.mjs).

export type Feel = 'straight' | 'dotted' | 'triplet';
export const FEEL_FACTOR: Record<Feel, number> = { straight: 1, dotted: 1.5, triplet: 2 / 3 };

/** Length of a quarter-note beat in ms. */
export const beatMs = (bpm: number) => 60000 / bpm;
/** Length of a 1/n note in ms (n = 1 whole note, 4 quarter, ...), with feel. */
export const noteMs = (bpm: number, n: number, feel: Feel = 'straight') => ((4 * beatMs(bpm)) / n) * FEEL_FACTOR[feel];
export const barMs = (bpm: number, beats = 4) => beats * beatMs(bpm);
export const msToHz = (ms: number) => 1000 / ms;
export const msToSamples = (ms: number, rate: number) => (ms * rate) / 1000;

export const NOTE_DIVS = [1, 2, 4, 8, 16, 32, 64];

export interface DelayRow { label: string; n: number; feel: Feel; ms: number; hz: number; s441: number; s48: number }
export function delayTable(bpm: number, divs = NOTE_DIVS): DelayRow[] {
  const rows: DelayRow[] = [];
  for (const n of divs) for (const feel of ['straight', 'dotted', 'triplet'] as Feel[]) {
    const ms = noteMs(bpm, n, feel);
    rows.push({ label: noteLabel(n, feel), n, feel, ms, hz: msToHz(ms), s441: msToSamples(ms, 44100), s48: msToSamples(ms, 48000) });
  }
  return rows;
}
export const noteLabel = (n: number, feel: Feel) => `1/${n}${feel === 'dotted' ? ' dotted' : feel === 'triplet' ? ' triplet' : ''}`;

export interface Suggest { label: string; ms: number; note: string }
/** Starting points for reverb pre-delay and decay, and compressor attack and release. */
export function reverbSuggestions(bpm: number): { pre: Suggest[]; decay: Suggest[] } {
  return {
    pre: [
      { label: '1/64 note', ms: noteMs(bpm, 64), note: 'Tight: the dry sound stays clear and the room follows at once.' },
      { label: '1/128 note', ms: noteMs(bpm, 128), note: 'Almost none: for dense or fast music.' },
      { label: '1/32 note', ms: noteMs(bpm, 32), note: 'A little more air between the sound and its room.' },
    ],
    decay: [
      { label: 'Tail ends on the next 1/4 note', ms: noteMs(bpm, 4), note: 'Short and tidy.' },
      { label: 'Tail ends on the next 1/2 note', ms: noteMs(bpm, 2), note: 'A medium room that clears before the next beat 3.' },
      { label: 'Tail ends on the next bar (4/4)', ms: barMs(bpm), note: 'Long and wide: leaves space in the arrangement.' },
    ],
  };
}
export function compressorSuggestions(bpm: number): Suggest[] {
  return [
    { label: 'Attack, 1/128 note', ms: noteMs(bpm, 128), note: 'Fast: catches the front of the hit.' },
    { label: 'Attack, 1/64 note', ms: noteMs(bpm, 64), note: 'Lets a little of the click through.' },
    { label: 'Release, 1/16 note', ms: noteMs(bpm, 16), note: 'Quick recovery for busy parts.' },
    { label: 'Release, 1/8 note', ms: noteMs(bpm, 8), note: 'Gain is back before the next off-beat.' },
    { label: 'Release, 1/4 note', ms: noteMs(bpm, 4), note: 'Slow and smooth: gain is back for the next beat.' },
  ];
}

// ---------- LFO ----------
export interface LfoRow { label: string; hz: number; ms: number; bars: number }
export function lfoTable(bpm: number): LfoRow[] {
  const rows: LfoRow[] = [];
  for (const bars of [4, 2]) {
    const ms = barMs(bpm) * bars;
    rows.push({ label: `${bars} bars`, hz: msToHz(ms), ms, bars: bars });
  }
  for (const n of [1, 2, 4, 8, 16, 32]) for (const feel of ['straight', 'dotted', 'triplet'] as Feel[]) {
    const ms = noteMs(bpm, n, feel);
    rows.push({ label: n === 1 && feel === 'straight' ? '1/1 (1 bar)' : noteLabel(n, feel), hz: msToHz(ms), ms, bars: ms / barMs(bpm) });
  }
  return rows;
}
/** The note value whose rate is closest to a frequency (compared on a log scale). */
export function nearestNote(bpm: number, hz: number): { row: LfoRow; ratio: number } {
  const rows = lfoTable(bpm);
  let best = rows[0];
  for (const r of rows) if (Math.abs(Math.log(r.hz / hz)) < Math.abs(Math.log(best.hz / hz))) best = r;
  return { row: best, ratio: hz / best.hz };
}
export function sidechainRelease(bpm: number) {
  const q = beatMs(bpm);
  return { fast: q / 4, usual: q / 2, full: q * 0.9 };
}
export type Shape = 'sine' | 'triangle' | 'saw' | 'square';
/** LFO value from -1 to 1 at phase 0..1 (saw falls, like a ducking envelope drawn upward). */
export function lfoValue(shape: Shape, phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  if (shape === 'sine') return Math.sin(2 * Math.PI * p);
  if (shape === 'triangle') return p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4;
  if (shape === 'saw') return 1 - 2 * p;
  return p < 0.5 ? 1 : -1;
}

// ---------- Gig fee ----------
export interface GigIn {
  setH: number; prepH: number; travelH: number; distance: number; perDist: number;
  hire: number; wear: number; agentPct: number; taxPct: number; rate: number; marginPct: number; depositPct: number;
}
export interface GigOut {
  hours: number; travelCost: number; costs: number; labour: number; minFee: number; quote: number; deposit: number; balance: number;
  agent: number; tax: number; keep: number; effective: number; ok: boolean;
}
/** Minimum fee so that, after agent cut, costs and the tax set-aside, you keep hours x rate. */
export function gigFee(g: GigIn): GigOut {
  const hours = g.setH + g.prepH + g.travelH;
  const travelCost = g.distance * g.perDist;
  const costs = travelCost + g.hire + g.wear;
  const labour = hours * g.rate;
  const a = g.agentPct / 100, t = g.taxPct / 100;
  const ok = a < 1 && t < 1;
  const minFee = ok ? (labour / (1 - t) + costs) / (1 - a) : NaN;
  const quote = minFee * (1 + g.marginPct / 100);
  const deposit = quote * (g.depositPct / 100);
  const agent = quote * a, profit = quote - agent - costs, tax = Math.max(0, profit) * t, keep = profit - tax;
  return { hours, travelCost, costs, labour, minFee, quote, deposit, balance: quote - deposit, agent, tax, keep, effective: hours > 0 ? keep / hours : NaN, ok };
}

// ---------- Royalties ----------
export interface StreamRow { service: string; streams: number; rate: number }
export interface Collab { name: string; pct: number }
export interface RoyOut {
  streams: number; gross: number; distributorCut: number; afterDistributor: number; labelCut: number; pool: number;
  perRow: number[]; shares: { name: string; pct: number; amount: number }[]; splitTotal: number; splitOk: boolean; perStream: number;
}
export function royalties(rows: StreamRow[], distPct: number, labelPct: number, collabs: Collab[]): RoyOut {
  const perRow = rows.map((r) => (r.streams || 0) * (r.rate || 0));
  const streams = rows.reduce((s, r) => s + (r.streams || 0), 0);
  const gross = perRow.reduce((s, x) => s + x, 0);
  const distributorCut = gross * (distPct / 100), afterDistributor = gross - distributorCut;
  const labelCut = afterDistributor * (labelPct / 100), pool = afterDistributor - labelCut;
  const splitTotal = collabs.reduce((s, c) => s + (c.pct || 0), 0);
  const shares = collabs.map((c) => ({ name: c.name, pct: c.pct, amount: pool * ((c.pct || 0) / 100) }));
  return { streams, gross, distributorCut, afterDistributor, labelCut, pool, perRow, shares, splitTotal, splitOk: Math.abs(splitTotal - 100) < 1e-9, perStream: streams > 0 ? pool / streams : 0 };
}
/** Streams needed to receive `target`, given what one stream is worth to the person after all cuts. */
export const streamsNeeded = (target: number, perStreamToYou: number) => (perStreamToYou > 0 ? Math.ceil(target / perStreamToYou - 1e-9) : NaN);
