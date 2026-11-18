// Small helpers on top of theory.ts: chords of any 7-note scale, common progressions rendered into a key,
// key finding from chords, chord naming from notes and voicings. Plain TypeScript, no DOM.
import {
  CHORDS, SCALES, camelot, chordPcs, diatonicChords, keyUsesFlats, mod12, noteName, parseChord, scalePcs, type Key, type ScaleId,
} from './theory.ts';

export type ChordInfo = { degree: number; roman: string; root: number; symbol: string; ints: number[] };

const plainName = (id: ScaleId) => SCALES[id].name.replace(/ \(.*\)/, '');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
/** Semitones from a mode's tonic down to the major key with the same notes. */
const PARENT: Partial<Record<ScaleId, number>> = { major: 0, dorian: 2, phrygian: 4, lydian: 5, mixolydian: 7, 'natural-minor': 9, locrian: 11 };

/** Whether a scale has a minor third (so it is written with the flats of minor keys). */
export const isMinorish = (id: ScaleId) => SCALES[id].steps.includes(3) && !SCALES[id].steps.includes(4);

/** Flats or sharps for a scale's notes. */
export function scaleUsesFlats(tonic: number, id: ScaleId): boolean {
  const parent = PARENT[id];
  if (parent !== undefined) return keyUsesFlats({ tonic: mod12(tonic - parent), mode: 'major' });
  return keyUsesFlats({ tonic, mode: isMinorish(id) ? 'minor' : 'major' });
}

/** Camelot code that fits a scale: exact for major and natural minor, the parent major for modes, the nearest key otherwise. */
export function camelotFor(tonic: number, id: ScaleId): { code: string; note: string } {
  const parent = PARENT[id];
  if (id === 'major' || id === 'natural-minor') {
    const k: Key = { tonic, mode: id === 'major' ? 'major' : 'minor' };
    return { code: camelot(k), note: '' };
  }
  if (parent !== undefined) {
    const k: Key = { tonic: mod12(tonic - parent), mode: 'major' };
    return { code: camelot(k), note: `${plainName(id)} uses the same notes as ${noteName(k.tonic, keyUsesFlats(k))} major, so DJs file it under that code.` };
  }
  const minor = isMinorish(id);
  const k: Key = { tonic, mode: minor ? 'minor' : 'major' };
  return { code: camelot(k), note: `${plainName(id)} is filed under the ${minor ? 'minor' : 'major'} key on the same note.` };
}

const TRIADS: Record<string, string> = { '4,7': '', '3,7': 'm', '3,6': 'dim', '4,8': 'aug' };
/** Chords stacked in thirds on each note of a 7-note scale (triads or sevenths). Empty for scales with fewer notes. */
export function scaleChords(tonic: number, id: ScaleId, sevenths = false): ChordInfo[] {
  const st = SCALES[id].steps;
  if (st.length !== 7) return [];
  if (id === 'major' || id === 'natural-minor') {
    return diatonicChords({ tonic, mode: id === 'major' ? 'major' : 'minor' }, sevenths).map((d) => ({
      degree: d.degree, roman: d.roman, root: d.root, symbol: d.symbol, ints: CHORDS[d.quality]?.ints ?? chordIntsFromSuffix(d.quality),
    }));
  }
  const flats = scaleUsesFlats(tonic, id);
  return st.map((_, i) => {
    const at = (j: number) => mod12(st[(i + j) % 7] - st[i]);
    const [t, f, s] = [at(2), at(4), at(6)];
    const tri = TRIADS[`${t},${f}`] ?? '';
    let suffix = tri, ints = [0, t, f];
    if (sevenths) {
      ints = [0, t, f, s];
      suffix = tri === '' ? (s === 11 ? 'maj7' : '7') : tri === 'm' ? (s === 11 ? 'mMaj7' : 'm7') : tri === 'dim' ? (s === 10 ? 'm7b5' : 'dim7') : 'maj7#5';
    }
    const lower = tri === 'm' || tri === 'dim';
    let roman = lower ? ROMAN[i].toLowerCase() : ROMAN[i];
    if (tri === 'aug') roman += '+';
    if (tri === 'dim') roman += sevenths ? (suffix === 'm7b5' ? 'ø' : '°') : '°';
    if (sevenths) roman += '7';
    const root = mod12(tonic + st[i]);
    return { degree: i + 1, roman, root, symbol: noteName(root, flats) + suffix, ints };
  });
}
function chordIntsFromSuffix(suffix: string): number[] {
  return suffix === 'maj7#5' ? [0, 4, 8, 11] : CHORDS[suffix]?.ints ?? [0, 4, 7];
}

// ---------- Common progressions ----------
export type ProgStep = { semi: number; q: string };
export type Progression = { id: string; genre: string; mode: 'major' | 'minor'; steps: ProgStep[]; note: string };
const s = (semi: number, q = ''): ProgStep => ({ semi, q });
/** Patterns that are common in each style. Starting points, not rules. */
export const PROGRESSIONS: Progression[] = [
  { id: 'pop', genre: 'Pop', mode: 'major', steps: [s(0), s(7), s(9, 'm'), s(5)], note: 'The best-known pop loop.' },
  { id: 'pop-50s', genre: 'Pop (1950s style)', mode: 'major', steps: [s(0), s(9, 'm'), s(5), s(7)], note: 'I–vi–IV–V, the classic doo-wop turnaround.' },
  { id: 'rnb', genre: 'R&B and jazz-pop', mode: 'major', steps: [s(2, 'm7'), s(7, '7'), s(0, 'maj7'), s(9, 'm7')], note: 'ii–V–I with 7th chords, then a vi7 to turn round.' },
  { id: 'lofi', genre: 'Lo-fi', mode: 'major', steps: [s(0, 'maj9'), s(5, 'maj7'), s(4, 'm7'), s(9, 'm7')], note: 'Soft maj7 and 9 chords with a gentle drift.' },
  { id: 'house-maj', genre: 'Deep house', mode: 'major', steps: [s(0, 'maj7'), s(5, 'maj7')], note: 'A two-chord vamp that repeats for bars.' },
  { id: 'dnb-maj', genre: 'Drum and bass (liquid)', mode: 'major', steps: [s(9, 'm7'), s(5, 'maj7'), s(0, 'maj7'), s(7)], note: 'Starts on vi, so it feels wistful.' },
  { id: 'techno-maj', genre: 'Techno', mode: 'major', steps: [s(0)], note: 'One chord, or just the root note as a drone.' },
  { id: 'house', genre: 'House', mode: 'minor', steps: [s(0, 'm'), s(8), s(3), s(10)], note: 'i–VI–III–VII, a very common minor loop.' },
  { id: 'deep-house', genre: 'Deep house', mode: 'minor', steps: [s(0, 'm7'), s(5, 'm7')], note: 'i7–iv7 vamp, often held for 2 bars each.' },
  { id: 'hiphop', genre: 'Hip-hop', mode: 'minor', steps: [s(0, 'm'), s(10), s(8), s(10)], note: 'i–VII–VI–VII, a rolling minor loop.' },
  { id: 'trap', genre: 'Trap', mode: 'minor', steps: [s(0, 'm'), s(8), s(10)], note: 'i–VI–VII, then back to the start.' },
  { id: 'rnb-min', genre: 'R&B and jazz-pop', mode: 'minor', steps: [s(2, 'm7b5'), s(7, '7'), s(0, 'm7'), s(8, 'maj7')], note: 'Minor ii–V–i with 7th chords (the V uses the raised 7th).' },
  { id: 'lofi-min', genre: 'Lo-fi', mode: 'minor', steps: [s(0, 'm7'), s(5, 'm7'), s(10, '7'), s(3, 'maj7')], note: 'Warm 7th chords moving by fourths.' },
  { id: 'techno', genre: 'Techno', mode: 'minor', steps: [s(0, 'm')], note: 'One chord (or a drone on the root) for the whole track.' },
  { id: 'dnb', genre: 'Drum and bass', mode: 'minor', steps: [s(0, 'm'), s(8), s(5, 'm'), s(7)], note: 'i–VI–iv–V.' },
  { id: 'pop-min', genre: 'Pop and rock', mode: 'minor', steps: [s(0, 'm'), s(10), s(8), s(7)], note: 'i–VII–VI–V, the "Andalusian" descent.' },
];
const ROM_MAJ: Record<number, string> = { 0: 'I', 1: '♭II', 2: 'II', 3: '♭III', 4: 'III', 5: 'IV', 6: '♯IV', 7: 'V', 8: '♭VI', 9: 'VI', 10: '♭VII', 11: 'VII' };
const ROM_MIN: Record<number, string> = { 0: 'I', 1: '♭II', 2: 'II', 3: 'III', 4: '♯III', 5: 'IV', 6: '♭V', 7: 'V', 8: 'VI', 9: '♯VI', 10: 'VII', 11: '♯VII' };
/** Roman numeral text for a step ("vi", "ii7", "Imaj7"), relative to a major or a natural minor key. */
export function romanOf(step: ProgStep, mode: 'major' | 'minor'): string {
  let r = (mode === 'major' ? ROM_MAJ : ROM_MIN)[mod12(step.semi)];
  const minor = step.q.startsWith('m') && !step.q.startsWith('maj');
  if (minor) r = r.replace(/[IV]+/, (m) => m.toLowerCase());
  const tail: Record<string, string> = { '': '', m: '', '7': '7', m7: '7', maj7: 'maj7', maj9: 'maj9', m7b5: 'ø7', m9: '9' };
  return r + (tail[step.q] ?? step.q);
}
/** A progression written in a key. */
export function renderProgression(tonic: number, p: Progression, flats = false): ChordInfo[] {
  return p.steps.map((st, i) => {
    const root = mod12(tonic + st.semi);
    return { degree: i + 1, roman: romanOf(st, p.mode), root, symbol: noteName(root, flats) + st.q, ints: CHORDS[st.q].ints };
  });
}
/** MIDI notes for a chord: bass note in the octave below middle C, the chord above it around middle C. */
export function voicing(root: number, ints: number[], bass = true): number[] {
  const r = mod12(root), base = 60 + (r >= 6 ? r - 12 : r);
  return [...(bass ? [36 + r] : []), ...ints.map((i) => base + i)];
}

// ---------- Finding a key from chords ----------
export type KeyGuess = { key: Key; fit: number; total: number; score: number };
/** Rank the 24 major and minor keys by how many of the typed chords belong to them. Chord symbols that are not understood are skipped. */
export function findKeys(symbols: string[]): KeyGuess[] {
  const chords = symbols.map((x) => ({ x, pcs: chordPcs(x), p: parseChord(x) })).filter((c) => c.pcs && c.p);
  const out: KeyGuess[] = [];
  for (const mode of ['major', 'minor'] as const) for (let tonic = 0; tonic < 12; tonic++) {
    const k: Key = { tonic, mode };
    const dia = new Set(diatonicChords(k, false, mode === 'minor').map((d) => d.root + ':' + d.quality));
    const allowed = new Set(scalePcs(tonic, mode === 'major' ? 'major' : 'natural-minor'));
    if (mode === 'minor') allowed.add(mod12(tonic + 11));
    let fit = 0, score = 0;
    chords.forEach((c, i) => {
      const notesIn = c.pcs!.filter((n) => allowed.has(n)).length / c.pcs!.length;
      const exact = dia.has(c.p!.root + ':' + (chordQ(c.p!.suffix) ?? ''));
      if (notesIn === 1) fit++;
      score += notesIn + (exact ? 0.5 : 0);
      if (c.p!.root === tonic && (i === 0 || i === chords.length - 1)) score += 0.75;
    });
    out.push({ key: k, fit, total: chords.length, score });
  }
  return out.sort((a, b) => b.score - a.score || b.fit - a.fit);
}
function chordQ(suffix: string): string | null {
  const t = suffix.replace(/^(7|9|11|13)$/, '$1');
  const triadMap: Record<string, string> = { m7: 'm', '7': '', maj7: '', m9: 'm', maj9: '', add9: '', '6': '', m6: 'm', sus2: 'sus2', sus4: 'sus4', min: 'm', m: 'm', dim: 'dim', aug: 'aug', '': '' };
  return t in triadMap ? triadMap[t] : null;
}

// ---------- Naming chords from notes ----------
/** Name a chord from MIDI-style or pitch-class notes, lowest first: "C", "Am7", "C/E". Null when nothing matches. */
export function nameChord(notes: number[], flats = false): string | null {
  const pcs = [...new Set(notes.map(mod12))];
  if (pcs.length < 2) return null;
  const bass = mod12(notes[0]);
  const order = [bass, ...pcs.filter((p) => p !== bass)];
  for (const r of order) {
    const set = new Set(pcs.map((p) => mod12(p - r)));
    for (const [suffix, c] of Object.entries(CHORDS)) {
      const want = new Set(c.ints.map((i) => i % 12));
      if (want.size === set.size && [...want].every((i) => set.has(i))) {
        return noteName(r, flats) + suffix + (r !== bass ? '/' + noteName(bass, flats) : '');
      }
    }
  }
  // Seventh chords with the fifth left out (common on guitar): C E B♭ is C7.
  for (const r of order) {
    const set = new Set(pcs.map((p) => mod12(p - r)));
    for (const suffix of ['7', 'maj7', 'm7']) {
      const want = new Set(CHORDS[suffix].ints.filter((i) => i !== 7));
      if (want.size === set.size && [...want].every((i) => set.has(i))) return noteName(r, flats) + suffix + (r !== bass ? '/' + noteName(bass, flats) : '');
    }
  }
  return pcs.length === 2 ? intervalName(pcs, bass, flats) : null;
}
function intervalName(pcs: number[], bass: number, flats: boolean): string | null {
  const other = pcs.find((p) => p !== bass)!;
  const d = mod12(other - bass);
  return d === 7 ? noteName(bass, flats) + '5' : null;
}
