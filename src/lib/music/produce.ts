// Maths and data for the production and business tools: split sheets, EQ guide, song planner, drum sketcher.
// Plain TypeScript, no DOM. Checks in tests/tools/*.mjs and tests/music-produce.mjs.

// ---------- Split sheet ----------
export interface Writer { name: string; role: string; society: string; ipi: string; writing: number; master: number }
export const ROLES = ['Songwriter', 'Lyricist', 'Composer', 'Producer', 'Performer', 'Beat maker', 'Other'];
export const sum = (xs: number[]) => Math.round(xs.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0) * 1e4) / 1e4;
/** Shares that add to exactly 100 (to 2 decimals): the first people get the extra 0.01 where 100 does not divide evenly. */
export function equalShares(n: number): number[] {
  if (n < 1) return [];
  const cents = 10000, base = Math.floor(cents / n), extra = cents - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i < extra ? 1 : 0)) / 100);
}
export interface SplitCheck { ok: boolean; writing: number; master: number; message: string }
export function checkSplit(rows: Pick<Writer, 'writing' | 'master'>[]): SplitCheck {
  const writing = sum(rows.map((r) => r.writing)), master = sum(rows.map((r) => r.master));
  const msg = (label: string, t: number) => (t === 100 ? '' : t < 100 ? `${label} adds up to ${t}%, so ${sum([100, -t])}% is still to give out.` : `${label} adds up to ${t}%, which is ${sum([t, -100])}% too much.`);
  const parts = [msg('Writing', writing), msg('Master', master)].filter(Boolean);
  return { ok: !parts.length, writing, master, message: parts.length ? parts.join(' ') : 'Both columns add up to 100%.' };
}
const q = (s: string) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
export function splitCsv(meta: { title: string; date: string; isrc: string }, rows: Writer[]): string {
  const head = ['Song', 'Date', 'ISRC', 'Name', 'Role', 'PRO or society', 'IPI', 'Writing %', 'Master %'];
  const lines = rows.map((r) => [meta.title, meta.date, meta.isrc, r.name, r.role, r.society, r.ipi, String(r.writing), String(r.master)].map(q).join(','));
  const tot = ['', '', '', 'Total', '', '', '', String(sum(rows.map((r) => r.writing))), String(sum(rows.map((r) => r.master)))].join(',');
  return [head.join(','), ...lines, tot].join('\n') + '\n';
}

// ---------- EQ guide ----------
export const MIN_HZ = 20, MAX_HZ = 20000;
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
/** MIDI note number to Hz: f = 440 * 2^((n - 69) / 12). */
export const midiToHz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
export function hzToNote(hz: number): { name: string; midi: number; cents: number } {
  const exact = 69 + 12 * Math.log2(hz / 440), midi = Math.round(exact);
  return { name: NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1), midi, cents: Math.round((exact - midi) * 100) };
}
/** Note name such as "A4" or "C#3" to MIDI number (C4 = 60). */
export function noteToMidi(s: string): number {
  const m = /^([A-G])(#?)(-?\d+)$/.exec(s.trim()); if (!m) return NaN;
  return NOTE_NAMES.indexOf(m[1] + m[2]) + 12 * (+m[3] + 1);
}
export const logPos = (hz: number) => (Math.log(hz / MIN_HZ) / Math.log(MAX_HZ / MIN_HZ));
export const fromLogPos = (p: number) => MIN_HZ * Math.pow(MAX_HZ / MIN_HZ, p);

export interface Band { id: string; name: string; lo: number; hi: number; feel: string; moves: string[] }
export const BANDS: Band[] = [
  { id: 'sub', name: 'Sub', lo: 20, hi: 60, feel: 'Felt as much as heard: the floor of a kick or a bass.', moves: ['Cut below about 30 Hz on everything that is not a kick or bass. It is rumble that eats headroom.', 'Boost a little here only if the track sounds thin on big speakers.', 'Check on small speakers: they cannot play this, so make sure the bass is still audible higher up.'] },
  { id: 'bass', name: 'Bass', lo: 60, hi: 250, feel: 'Weight and warmth: kick body, bass notes, the low end of a voice.', moves: ['Add a little around 80 to 100 Hz for a fuller kick or bass.', 'If two things fight (kick and bass), cut one where the other lives.', 'Too boomy: cut a little around 120 to 200 Hz.'] },
  { id: 'lowmid', name: 'Low mids', lo: 250, hi: 500, feel: 'Body, and the home of "mud" when too much builds up.', moves: ['Cut mud: a gentle dip around 250 to 400 Hz often clears a crowded mix.', 'Boxy sound: try a narrow cut near 400 to 500 Hz.', 'Thin sound: a small lift here adds body.'] },
  { id: 'mid', name: 'Mids', lo: 500, hi: 2000, feel: 'Where most instruments and the main part of a voice sit.', moves: ['Nasal or honky: cut a little around 800 Hz to 1 kHz.', 'Part is lost behind others: lift it a touch here, or cut the others.', 'Make small moves; ears are very sensitive in this range.'] },
  { id: 'upmid', name: 'Upper mids', lo: 2000, hi: 4000, feel: 'Clarity and bite, and where ears are most sensitive, so harsh sounds show up here.', moves: ['Harsh or tiring: cut a little around 2 to 4 kHz.', 'Vocal or guitar buried: a small lift around 3 kHz brings it forward.', 'Boosting here makes everything louder-sounding, so compare at equal volume.'] },
  { id: 'presence', name: 'Presence', lo: 4000, hi: 6000, feel: 'Edge and attack: consonants in a voice, the click of a kick, pick noise.', moves: ['Add presence: a small lift around 5 kHz makes a voice or snare step forward.', 'Sharp "s" sounds: cut a little around 5 to 8 kHz or use a de-esser.', 'Dull sound: check this band first.'] },
  { id: 'air', name: 'Air', lo: 6000, hi: 20000, feel: 'Sparkle and openness: cymbals, breath, the top of a mix.', moves: ['Add air: a gentle shelf boost from about 10 kHz opens up a vocal or a mix.', 'Hissy or brittle: cut the shelf or lower it.', 'Many files and speakers hold little above 16 kHz, so do not chase it.'] },
];

export interface Instrument { id: string; name: string; lo: number; hi: number; kind: 'notes' | 'rough'; harmTo: number; source: string }
const n = (s: string) => midiToHz(noteToMidi(s));
/** Note-range instruments come from standard note ranges converted to Hz; drums are rough typical ranges, not measurements. */
export const INSTRUMENTS: Instrument[] = [
  { id: 'kick', name: 'Kick', lo: 40, hi: 100, kind: 'rough', harmTo: 5000, source: 'Rough typical range: body about 40 to 100 Hz, beater click a few kHz. Varies a lot by drum and tuning.' },
  { id: 'bass', name: 'Bass guitar', lo: n('E1'), hi: n('G4'), kind: 'notes', harmTo: 3000, source: '4-string bass: E1 (open low string) up to G4 (24th fret of the G string), standard tuning.' },
  { id: 'snare', name: 'Snare', lo: 150, hi: 250, kind: 'rough', harmTo: 8000, source: 'Rough typical range: body about 150 to 250 Hz, wire rattle and snap a few kHz up to 8 kHz. Varies by drum and tuning.' },
  { id: 'vocals', name: 'Vocals', lo: n('E2'), hi: n('C6'), kind: 'notes', harmTo: 8000, source: 'Singing voice from the lowest common bass note (E2) to the top of a soprano range (C6); one singer covers about two octaves of this.' },
  { id: 'guitar', name: 'Guitar', lo: n('E2'), hi: n('E6'), kind: 'notes', harmTo: 6000, source: 'Standard-tuned 6-string guitar: E2 open low string up to E6 at the 24th fret of the high string.' },
  { id: 'piano', name: 'Piano', lo: n('A0'), hi: n('C8'), kind: 'notes', harmTo: MAX_HZ, source: '88-key piano: A0 (27.5 Hz) to C8 (about 4186 Hz).' },
  { id: 'hats', name: 'Hi-hats', lo: 3000, hi: 8000, kind: 'rough', harmTo: 16000, source: 'Rough typical range: most energy from about 3 kHz up to 16 kHz. Unpitched, so there is no single fundamental.' },
  { id: 'cymbals', name: 'Cymbals', lo: 300, hi: 5000, kind: 'rough', harmTo: 16000, source: 'Rough typical range: a wash from a few hundred Hz up past 16 kHz. Unpitched.' },
];
export const bandOf = (hz: number) => BANDS.find((b) => hz >= b.lo && hz < b.hi) ?? BANDS[BANDS.length - 1];

// ---------- Song planner ----------
export interface Sect { id: number; kind: string; bars: number }
export const SECTION_KINDS = ['Intro', 'Verse', 'Pre-chorus', 'Chorus', 'Drop', 'Breakdown', 'Build', 'Bridge', 'Outro'];
export const TEMPLATES: Record<string, { name: string; bpm: number; parts: [string, number][] }> = {
  pop: { name: 'Pop song', bpm: 110, parts: [['Intro', 4], ['Verse', 8], ['Pre-chorus', 4], ['Chorus', 8], ['Verse', 8], ['Pre-chorus', 4], ['Chorus', 8], ['Bridge', 8], ['Chorus', 8], ['Outro', 4]] },
  house: { name: 'House or techno club edit', bpm: 124, parts: [['Intro', 16], ['Build', 8], ['Drop', 32], ['Breakdown', 16], ['Build', 8], ['Drop', 32], ['Outro', 16]] },
  hiphop: { name: 'Hip-hop', bpm: 90, parts: [['Intro', 4], ['Verse', 16], ['Chorus', 8], ['Verse', 16], ['Chorus', 8], ['Bridge', 8], ['Chorus', 8], ['Outro', 4]] },
  dnb: { name: 'Drum and bass', bpm: 174, parts: [['Intro', 16], ['Build', 8], ['Drop', 32], ['Breakdown', 16], ['Build', 8], ['Drop', 32], ['Outro', 16]] },
};
export const secPerBar = (bpm: number, num: number, den: number) => ((num * 4) / den) * (60 / bpm);
export const fmtTime = (s: number) => { const t = Math.round(s * 10) / 10, m = Math.floor(t / 60); return `${m}:${(t - m * 60).toFixed(1).padStart(4, '0')}`; };
export interface Placed extends Sect { startBar: number; startS: number; lenS: number }
export function timeline(secs: Sect[], bpm: number, num: number, den: number): { rows: Placed[]; totalBars: number; totalS: number } {
  const spb = secPerBar(bpm, num, den); let bar = 0;
  const rows = secs.map((s) => { const r = { ...s, startBar: bar + 1, startS: bar * spb, lenS: s.bars * spb }; bar += s.bars; return r; });
  return { rows, totalBars: bar, totalS: bar * spb };
}
export function songText(title: string, secs: Sect[], bpm: number, num: number, den: number): string {
  const t = timeline(secs, bpm, num, den);
  return [`${title || 'Song plan'} (${bpm} BPM, ${num}/${den})`, ...t.rows.map((r) => `${fmtTime(r.startS)}  bar ${r.startBar}  ${r.kind} (${r.bars} bars)`), `Total: ${t.totalBars} bars, ${fmtTime(t.totalS)}`].join('\n') + '\n';
}
export function songCsv(secs: Sect[], bpm: number, num: number, den: number): string {
  const t = timeline(secs, bpm, num, den);
  return ['Section,Start bar,Bars,Start (s),Length (s),Start (m:ss)', ...t.rows.map((r) => [r.kind, r.startBar, r.bars, r.startS.toFixed(3), r.lenS.toFixed(3), fmtTime(r.startS)].join(','))].join('\n') + '\n';
}
const hms = (s: number) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s - h * 3600 - m * 60; return `${h}:${String(m).padStart(2, '0')}:${x.toFixed(3).padStart(6, '0')}`; };
/** Markers as a plain CSV of names and times (Name, Start in seconds, Start as h:mm:ss.mmm): most editors can import or paste a list like this. */
export function markersCsv(secs: Sect[], bpm: number, num: number, den: number): string {
  const t = timeline(secs, bpm, num, den);
  return ['Name,Start (s),Start (h:mm:ss.mmm)', ...t.rows.map((r, i) => [`${i + 1} ${r.kind}`, r.startS.toFixed(3), hms(r.startS)].join(','))].join('\n') + '\n';
}

// ---------- Drum sketcher ----------
export const ROWS = [
  { id: 'k', name: 'Kick', note: 36 }, { id: 's', name: 'Snare', note: 38 }, { id: 'c', name: 'Clap', note: 39 }, { id: 'h', name: 'Closed hat', note: 42 },
  { id: 'o', name: 'Open hat', note: 46 }, { id: 't', name: 'Tom', note: 45 }, { id: 'r', name: 'Rim', note: 37 }, { id: 'p', name: 'Perc', note: 47 },
] as const;
export type RowId = typeof ROWS[number]['id'];
export interface Drums { bpm: number; swing: number; len: 16 | 32; vol: number[]; steps: Record<RowId, boolean[]> }
export const emptySteps = (): Record<RowId, boolean[]> => Object.fromEntries(ROWS.map((r) => [r.id, Array(32).fill(false)])) as Record<RowId, boolean[]>;
export const fromStr = (s: string) => Array.from({ length: 32 }, (_, i) => s[i % s.length] === 'x');
const mk = (bpm: number, swing: number, p: Partial<Record<RowId, string>>): Drums => {
  const steps = emptySteps(); for (const r of ROWS) if (p[r.id]) steps[r.id] = fromStr(p[r.id]!);
  return { bpm, swing, len: 16, vol: [100, 90, 80, 55, 60, 80, 70, 70], steps };
};
/** Generic starting patterns: common shapes, not rules. */
export const PRESETS: Record<string, { name: string; make: () => Drums }> = {
  house: { name: 'Four on the floor', make: () => mk(124, 50, { k: 'x...x...x...x...', c: '....x.......x...', h: 'x...x...x...x...', o: '..x...x...x...x.' }) },
  boombap: { name: 'Boom bap', make: () => mk(90, 58, { k: 'x.....x..x.x....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }) },
  breakbeat: { name: 'Breakbeat-style', make: () => mk(130, 50, { k: 'x.....x.x....x..', s: '....x..x.x..x...', h: 'x.x.x.x.x.x.x.x.', o: '..............x.' }) },
  trap: { name: 'Trap hats', make: () => mk(140, 50, { k: 'x.....x......x..', c: '........x.......', h: 'x.xxx.x.xx.xx.xx', o: '......x.......x.' }) },
};
/** Time in seconds of step i (a sixteenth note). Off-beat sixteenths are pushed later by swing (50 = straight, 66.7 = triplet feel). */
export function stepTime(i: number, bpm: number, swing: number): number {
  const step = 60 / bpm / 4, pair = Math.floor(i / 2) * 2 * step;
  return i % 2 ? pair + (swing / 100) * 2 * step : pair;
}
// Hash: #b=95&w=57&l=16&v=100,90,...&k=8888&s=...  (each row is 4 hex digits per 16 steps)
const hexOf = (a: boolean[], len: number) => { let o = ''; for (let g = 0; g < len; g += 4) o += ((a[g] ? 8 : 0) + (a[g + 1] ? 4 : 0) + (a[g + 2] ? 2 : 0) + (a[g + 3] ? 1 : 0)).toString(16); return o; };
export function drumsToHash(d: Drums): string {
  const p = new URLSearchParams({ b: String(d.bpm), w: String(d.swing), l: String(d.len), v: d.vol.join(',') });
  for (const r of ROWS) { const h = hexOf(d.steps[r.id], d.len); if (/[1-9a-f]/.test(h)) p.set(r.id, h); }
  return p.toString();
}
export function drumsFromHash(hash: string): Drums | null {
  const p = new URLSearchParams(hash.replace(/^#/, '')); if (!p.has('b')) return null;
  const len = p.get('l') === '32' ? 32 : 16, steps = emptySteps();
  for (const r of ROWS) { const h = p.get(r.id) ?? ''; for (let i = 0; i < len; i++) { const c = parseInt(h[i >> 2] ?? '0', 16) || 0; steps[r.id][i] = !!(c & (8 >> (i % 4))); } }
  const vol = (p.get('v') ?? '').split(',').map((x) => Math.max(0, Math.min(100, +x || 0)));
  return { bpm: Math.max(40, Math.min(240, +p.get('b')! || 100)), swing: Math.max(50, Math.min(75, +p.get('w')! || 50)), len, vol: ROWS.map((_, i) => vol[i] ?? 80), steps };
}

// Sounds: each is a Float32Array at the given sample rate, built from sine sweeps and filtered noise.
function noiseGen(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2147483648 - 1; }; }
export function drumSound(id: RowId, rate: number): Float32Array {
  const dur = { k: 0.45, s: 0.25, c: 0.3, h: 0.07, o: 0.4, t: 0.4, r: 0.06, p: 0.15 }[id], len = Math.floor(dur * rate), out = new Float32Array(len), rnd = noiseGen(12345 + id.charCodeAt(0));
  let ph = 0, lp = 0, prev = 0, prev2 = 0;
  for (let i = 0; i < len; i++) {
    const t = i / rate; let v = 0; const w = rnd();
    if (id === 'k') { const f = 45 + 110 * Math.exp(-t * 28); ph += (2 * Math.PI * f) / rate; v = Math.sin(ph) * Math.exp(-t * 9) + 0.25 * w * Math.exp(-t * 160); }
    else if (id === 's') { ph += (2 * Math.PI * (185 + 60 * Math.exp(-t * 40))) / rate; const hp = w - prev; prev = w; v = 0.6 * Math.sin(ph) * Math.exp(-t * 22) + 0.7 * hp * 0.5 * Math.exp(-t * 18); }
    else if (id === 'c') { lp += 0.35 * (w - lp); const bp = lp - prev; prev += 0.02 * (lp - prev); const burst = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) * 400) : 0), 0); v = bp * 2.2 * (burst + 0.6 * Math.exp(-t * 18)); }
    else if (id === 'h' || id === 'o') { const hp = w - 2 * prev + prev2; prev2 = prev; prev = w; v = hp * 0.3 * Math.exp(-t * (id === 'h' ? 70 : 9)); }
    else if (id === 't') { ph += (2 * Math.PI * (95 + 70 * Math.exp(-t * 18))) / rate; v = Math.sin(ph) * Math.exp(-t * 8); }
    else if (id === 'r') { ph += (2 * Math.PI * 1700) / rate; v = (Math.sin(ph) * 0.6 + w * 0.4) * Math.exp(-t * 120); }
    else { ph += (2 * Math.PI * (880 - 200 * t)) / rate; v = Math.sin(ph) * Math.exp(-t * 28); }
    out[i] = v * 0.8;
  }
  return out;
}
/** Hit times for N bars of the pattern: [row index, seconds, velocity 0..1]. */
export function hits(d: Drums, bars: number): { row: number; t: number; step: number }[] {
  const total = bars * 16, out: { row: number; t: number; step: number }[] = [];
  for (let i = 0; i < total; i++) ROWS.forEach((r, ri) => { if (d.steps[r.id][i % d.len]) out.push({ row: ri, t: stepTime(i, d.bpm, d.swing), step: i }); });
  return out;
}
/** Render N bars of the loop. The ring-out of the last hits is folded onto the start so the file loops cleanly. */
export function renderLoop(d: Drums, bars: number, rate = 44100): Float32Array {
  const total = Math.round(bars * 4 * (60 / d.bpm) * rate), out = new Float32Array(total);
  const snd = Object.fromEntries(ROWS.map((r) => [r.id, drumSound(r.id, rate)])) as Record<RowId, Float32Array>;
  const list = hits(d, bars);
  list.forEach((h) => {
    const id = ROWS[h.row].id, s = snd[id], g = (d.vol[h.row] ?? 80) / 100, start = Math.round(h.t * rate);
    let end = s.length;
    if (id === 'o') { // a closed hat on a later step chokes the open hat
      const c = list.find((x) => ROWS[x.row].id === 'h' && x.t > h.t); if (c) end = Math.min(end, Math.round((c.t - h.t) * rate));
    }
    for (let i = 0; i < end; i++) { const fade = id === 'o' && end < s.length ? Math.min(1, (end - i) / 200) : 1; out[(start + i) % total] += s[i] * g * fade; }
  });
  let pk = 0; for (let i = 0; i < total; i++) pk = Math.max(pk, Math.abs(out[i]));
  if (pk > 0.95) for (let i = 0; i < total; i++) out[i] *= 0.95 / pk;
  return out;
}
/** Standard MIDI file (format 0, 480 ticks per quarter), drums on channel 10, GM drum notes. */
export function writeMidi(d: Drums, bars: number): Uint8Array {
  const PPQ = 480, ev: { tick: number; bytes: number[]; order: number }[] = [];
  const vlq = (v: number) => { const b = [v & 0x7f]; while ((v >>= 7)) b.unshift((v & 0x7f) | 0x80); return b; };
  const uspq = Math.round(60e6 / d.bpm);
  ev.push({ tick: 0, order: 0, bytes: [0xff, 0x51, 3, (uspq >> 16) & 255, (uspq >> 8) & 255, uspq & 255] });
  ev.push({ tick: 0, order: 0, bytes: [0xff, 0x58, 4, 4, 2, 24, 8] });
  const notes: Record<string, number> = { k: 36, s: 38, c: 39, h: 42, o: 46, t: 45, r: 37, p: 47 };
  for (const h of hits(d, bars)) {
    const id = ROWS[h.row].id, tick = Math.round((stepTime(h.step, d.bpm, d.swing) * d.bpm * PPQ) / 60), vel = Math.max(1, Math.round(127 * ((d.vol[h.row] ?? 80) / 100)));
    ev.push({ tick, order: 2, bytes: [0x99, notes[id], vel] }, { tick: tick + 60, order: 1, bytes: [0x89, notes[id], 0] });
  }
  const end = bars * 4 * PPQ; ev.sort((a, b) => a.tick - b.tick || a.order - b.order);
  const body: number[] = []; let last = 0;
  for (const e of ev) { body.push(...vlq(e.tick - last), ...e.bytes); last = e.tick; }
  body.push(...vlq(Math.max(0, end - last)), 0xff, 0x2f, 0);
  const u32 = (v: number) => [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
  return new Uint8Array([0x4d, 0x54, 0x68, 0x64, ...u32(6), 0, 0, 0, 1, PPQ >> 8, PPQ & 255, 0x4d, 0x54, 0x72, 0x6b, ...u32(body.length), ...body]);
}
