// Music theory for the music and DJ tools: note names, MIDI and frequency, scales, chords, diatonic chords with
// roman numerals, chord transposition, keys in three notations (musical, Camelot-style wheel codes 1A-12B, and
// Open Key-style codes 1d-12m), harmonic compatibility of two keys and the pitch change a tempo change brings.
// Plain TypeScript, no DOM. Checks in tests/music.mjs.
//
// The wheel codes follow the widely published circle-of-fifths layout DJs use (8B = C major, 8A = A minor, one
// step = a fifth); fibub is not affiliated with any company that uses these names.

export const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** Name of a pitch class (0 = C). */
export const noteName = (pc: number, flats = false) => (flats ? FLATS : SHARPS)[mod12(Math.round(pc))];

/** Pretty form with real sharp and flat signs (C♯, E♭). */
export const pretty = (s: string) => s.replace(/(^|[A-G])#/g, '$1♯').replace(/([A-G])b/g, '$1♭');

/** Pitch class of a note name: C, c#, Db, D♭, B#, Cb, F##, Bbb. Null if it is not a note. */
export function parseNote(s: string): number | null {
  const m = s.trim().match(/^([A-Ga-g])((?:#|♯|b|♭|x|𝄪|𝄫)*)$/);
  if (!m) return null;
  let pc = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase() as 'C']!;
  for (const ch of m[2]) pc += ch === '#' || ch === '♯' ? 1 : ch === 'x' || ch === '𝄪' ? 2 : ch === '𝄫' ? -2 : -1;
  return mod12(pc);
}

/** Frequency of a MIDI note (69 = A4), with A4 at a4 Hz. */
export const midiToFreq = (m: number, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);
/** MIDI note number (not rounded) of a frequency. */
export const freqToMidi = (f: number, a4 = 440) => 69 + 12 * Math.log2(f / a4);
/** Name with octave, MIDI 60 = C4. */
export const midiName = (m: number, flats = false) => noteName(m, flats) + (Math.floor(Math.round(m) / 12) - 1);
/** MIDI number of a name like C4, F#3, Bb-1. */
export function parseMidi(s: string): number | null {
  const m = s.trim().match(/^([A-Ga-g][#♯b♭]*)(-?\d+)$/);
  if (!m) return null;
  const pc = parseNote(m[1]);
  if (pc === null) return null;
  // Cb4 is B3 and B#3 is C4: count from the letter, then add the accidentals.
  const letter = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1][0].toUpperCase() as 'C']!;
  let acc = 0; for (const ch of m[1].slice(1)) acc += ch === '#' || ch === '♯' ? 1 : -1;
  return (+m[2] + 1) * 12 + letter + acc;
}

// ---------- Scales ----------
export type ScaleId = 'major' | 'natural-minor' | 'harmonic-minor' | 'melodic-minor' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'locrian' | 'major-pentatonic' | 'minor-pentatonic' | 'blues';
/** Semitones above the root. Melodic minor is the rising (jazz) form. */
export const SCALES: Record<ScaleId, { name: string; steps: number[] }> = {
  major: { name: 'Major (Ionian)', steps: [0, 2, 4, 5, 7, 9, 11] },
  'natural-minor': { name: 'Natural minor (Aeolian)', steps: [0, 2, 3, 5, 7, 8, 10] },
  'harmonic-minor': { name: 'Harmonic minor', steps: [0, 2, 3, 5, 7, 8, 11] },
  'melodic-minor': { name: 'Melodic minor (rising)', steps: [0, 2, 3, 5, 7, 9, 11] },
  dorian: { name: 'Dorian', steps: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian', steps: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian', steps: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian', steps: [0, 2, 4, 5, 7, 9, 10] },
  locrian: { name: 'Locrian', steps: [0, 1, 3, 5, 6, 8, 10] },
  'major-pentatonic': { name: 'Major pentatonic', steps: [0, 2, 4, 7, 9] },
  'minor-pentatonic': { name: 'Minor pentatonic', steps: [0, 3, 5, 7, 10] },
  blues: { name: 'Blues', steps: [0, 3, 5, 6, 7, 10] },
};
/** Pitch classes of a scale. */
export const scalePcs = (root: number, id: ScaleId) => SCALES[id].steps.map((s) => mod12(root + s));

// ---------- Chords ----------
/** Chord formulas by symbol suffix (semitones above the root). */
export const CHORDS: Record<string, { name: string; ints: number[] }> = {
  '': { name: 'major', ints: [0, 4, 7] },
  m: { name: 'minor', ints: [0, 3, 7] },
  dim: { name: 'diminished', ints: [0, 3, 6] },
  aug: { name: 'augmented', ints: [0, 4, 8] },
  sus2: { name: 'suspended 2nd', ints: [0, 2, 7] },
  sus4: { name: 'suspended 4th', ints: [0, 5, 7] },
  '6': { name: 'major 6th', ints: [0, 4, 7, 9] },
  m6: { name: 'minor 6th', ints: [0, 3, 7, 9] },
  '7': { name: 'dominant 7th', ints: [0, 4, 7, 10] },
  maj7: { name: 'major 7th', ints: [0, 4, 7, 11] },
  m7: { name: 'minor 7th', ints: [0, 3, 7, 10] },
  m7b5: { name: 'half-diminished 7th', ints: [0, 3, 6, 10] },
  dim7: { name: 'diminished 7th', ints: [0, 3, 6, 9] },
  '9': { name: 'dominant 9th', ints: [0, 4, 7, 10, 14] },
  maj9: { name: 'major 9th', ints: [0, 4, 7, 11, 14] },
  m9: { name: 'minor 9th', ints: [0, 3, 7, 10, 14] },
  add9: { name: 'added 9th', ints: [0, 4, 7, 14] },
  '11': { name: 'dominant 11th', ints: [0, 4, 7, 10, 14, 17] },
  '13': { name: 'dominant 13th', ints: [0, 4, 7, 10, 14, 21] },
};
/** Other ways people write the same suffixes. */
const ALIAS: Record<string, string> = {
  M: '', maj: '', major: '', min: 'm', minor: 'm', '-': 'm', '°': 'dim', o: 'dim', '+': 'aug', sus: 'sus4',
  M7: 'maj7', 'Δ': 'maj7', 'Δ7': 'maj7', ma7: 'maj7', min7: 'm7', '-7': 'm7', 'ø': 'm7b5', 'ø7': 'm7b5', 'm7♭5': 'm7b5', 'min7b5': 'm7b5',
  '°7': 'dim7', o7: 'dim7', dom7: '7', M9: 'maj9', min9: 'm9', '-9': 'm9', '(add9)': 'add9', min6: 'm6', '-6': 'm6',
};
export const chordQuality = (suffix: string): string | null => (suffix in CHORDS ? suffix : suffix in ALIAS ? ALIAS[suffix] : null);

export type ParsedChord = { root: number; rootText: string; suffix: string; bass: number | null; bassText: string | null; flats: boolean };
/** Parse a chord symbol such as C, F#m7, Bbmaj7, Dm7b5, Gsus4, F#m7/C#. The suffix is kept as written. */
export function parseChord(sym: string): ParsedChord | null {
  const m = sym.trim().match(/^([A-G](?:#|♯|b|♭)?)([^/\s]*)(?:\/([A-G](?:#|♯|b|♭)?))?$/);
  if (!m) return null;
  const root = parseNote(m[1]);
  const bass = m[3] ? parseNote(m[3]) : null;
  if (root === null) return null;
  return { root, rootText: m[1], suffix: m[2], bass, bassText: m[3] ?? null, flats: /[b♭]/.test(m[1] + (m[3] ?? '')) };
}
/** Pitch classes in a chord (null if the suffix is not one fibub knows). */
export function chordPcs(sym: string): number[] | null {
  const c = parseChord(sym);
  if (!c) return null;
  const q = chordQuality(c.suffix);
  if (q === null) return null;
  const pcs = CHORDS[q].ints.map((i) => mod12(c.root + i));
  if (c.bass !== null && !pcs.includes(c.bass)) pcs.unshift(c.bass);
  return pcs;
}

// ---------- Keys ----------
export type Mode = 'major' | 'minor';
export type Key = { tonic: number; mode: Mode };
export const keyEq = (a: Key, b: Key) => a.tonic === b.tonic && a.mode === b.mode;

/** Whether a key is usually written with flats (F, B♭, E♭, A♭, D♭ major; D, G, C, F, B♭, E♭ minor). G♭/F♯ major is written F♯. */
export const keyUsesFlats = (k: Key) => (k.mode === 'major' ? [5, 10, 3, 8, 1] : [2, 7, 0, 5, 10, 3]).includes(k.tonic);
/** "A minor", "F♯ major" (pretty) or "Am", "F#" (short, plain ASCII when ascii is true). */
export function keyName(k: Key, style: 'long' | 'short' = 'long', ascii = false): string {
  const n = noteName(k.tonic, keyUsesFlats(k)), p = ascii ? n : pretty(n);
  return style === 'long' ? `${p} ${k.mode}` : p + (k.mode === 'minor' ? 'm' : '');
}

/** Wheel number 1-12 of a key (C major and A minor = 8). Each step round the wheel is a fifth. */
export function camelotNumber(k: Key): number {
  const rel = k.mode === 'major' ? k.tonic : mod12(k.tonic + 3); // relative major
  return mod12(rel * 7 + 7) + 1;
}
/** Camelot-style code: 8B = C major, 8A = A minor. */
export const camelot = (k: Key) => `${camelotNumber(k)}${k.mode === 'major' ? 'B' : 'A'}`;
/** Open Key-style code: 1d = C major, 1m = A minor (the same wheel, numbered from C). */
export const openKey = (k: Key) => `${mod12(camelotNumber(k) - 8) + 1}${k.mode === 'major' ? 'd' : 'm'}`;
/** Key from a wheel number (1-12) and mode. */
export function fromCamelot(n: number, mode: Mode): Key {
  const rel = mod12((n - 8) * 7); // relative major: C at 8, one step = +7 semitones
  return { tonic: mode === 'major' ? rel : mod12(rel - 3), mode };
}

/** Read a key written any common way: 8A, 08B, 1d, 12m, Am, A minor, Amin, F#m, F♯ minor, Eb, E♭ major, C maj. */
export function parseKey(s: string): Key | null {
  const t = s.trim().replace(/\s+/g, ' ');
  let m = t.match(/^0?([1-9]|1[0-2])\s?([ABab])$/);
  if (m) return fromCamelot(+m[1], /b/i.test(m[2]) ? 'major' : 'minor');
  m = t.match(/^0?([1-9]|1[0-2])\s?([dmDM])$/);
  if (m) return fromCamelot(mod12(+m[1] - 1 + 7) + 1, /d/i.test(m[2]) ? 'major' : 'minor');
  m = t.match(/^([A-Ga-g](?:#|♯|b|♭)?)\s?(m|min|minor|maj|major|M|-)?$/);
  if (m) {
    const tonic = parseNote(m[1]);
    if (tonic === null) return null;
    const minor = m[2] === 'm' || m[2] === 'min' || m[2] === 'minor' || m[2] === '-';
    return { tonic, mode: minor ? 'minor' : 'major' };
  }
  return null;
}

export type KeyNotation = 'camelot' | 'openkey' | 'musical';
/** Write a key in the chosen notation. */
export const keyIn = (k: Key, n: KeyNotation) => (n === 'camelot' ? camelot(k) : n === 'openkey' ? openKey(k) : keyName(k, 'short'));

/** The relative major or minor (A minor <-> C major). */
export const relative = (k: Key): Key => (k.mode === 'major' ? { tonic: mod12(k.tonic - 3), mode: 'minor' } : { tonic: mod12(k.tonic + 3), mode: 'major' });
/** Key after shifting the pitch by n semitones (rounded to whole semitones). */
export const shiftKey = (k: Key, semitones: number): Key => ({ tonic: mod12(k.tonic + Math.round(semitones)), mode: k.mode });
/** Pitch classes of a key's scale (natural minor for minor keys). */
export const keyPcs = (k: Key) => scalePcs(k.tonic, k.mode === 'major' ? 'major' : 'natural-minor');

export type Tier = 'perfect' | 'good' | 'ok' | 'risky';
export type Compat = { score: number; label: string; tier: Tier; move: string };
/**
 * How well track b follows track a in a mix (fibub's own scores, 0-100, from the usual wheel moves):
 * same key 100; one step round the wheel or the relative major/minor 90 (perfect);
 * diagonal step (8A -> 9B, 8B -> 7A; 6 of 7 notes shared) 75 and +2 steps "energy boost" (up a whole tone) 70 (good);
 * +7 steps "mood change" (up a semitone) or -7 (down a semitone) 55 and the parallel key (C major <-> C minor) 50 (ok);
 * anything else scores by the notes the two scales share, at most 40 (risky).
 */
export function compatibility(a: Key, b: Key): Compat {
  const na = camelotNumber(a), nb = camelotNumber(b), d = mod12(nb - na), same = a.mode === b.mode;
  if (same && d === 0) return { score: 100, label: 'Same key', tier: 'perfect', move: '0' };
  if (same && (d === 1 || d === 11)) return { score: 90, label: d === 1 ? 'One step up the wheel' : 'One step down the wheel', tier: 'perfect', move: d === 1 ? '+1' : '−1' };
  if (!same && d === 0) return { score: 90, label: `Relative ${b.mode}`, tier: 'perfect', move: a.mode === 'minor' ? 'A→B' : 'B→A' };
  if (!same && ((a.mode === 'minor' && d === 1) || (a.mode === 'major' && d === 11))) return { score: 75, label: 'Diagonal step', tier: 'good', move: a.mode === 'minor' ? '+1 A→B' : '−1 B→A' };
  if (same && d === 2) return { score: 70, label: 'Energy boost (+2, up a tone)', tier: 'good', move: '+2' };
  if (same && d === 7) return { score: 55, label: 'Mood change (+7, up a semitone)', tier: 'ok', move: '+7' };
  if (same && d === 5) return { score: 50, label: 'Mood change (−7, down a semitone)', tier: 'ok', move: '−7' };
  if (!same && a.tonic === b.tonic) return { score: 50, label: `Parallel ${b.mode} (same root)`, tier: 'ok', move: a.mode === 'major' ? '−3 B→A' : '+3 A→B' };
  const pa = keyPcs(a), shared = keyPcs(b).filter((p) => pa.includes(p)).length;
  return { score: Math.round((shared / 7) * 40), label: `Risky: ${shared} of 7 notes shared`, tier: 'risky', move: `${d > 6 ? '−' + (12 - d) : '+' + d}${same ? '' : a.mode === 'minor' ? ' A→B' : ' B→A'}` };
}

/** Keys that mix well after k, best first (score 50 and up). */
export function compatibleKeys(k: Key): (Compat & { key: Key })[] {
  const out: (Compat & { key: Key })[] = [];
  for (const mode of ['minor', 'major'] as Mode[]) for (let t = 0; t < 12; t++) {
    const key = { tonic: t, mode }, c = compatibility(k, key);
    if (c.score >= 50) out.push({ ...c, key });
  }
  return out.sort((x, y) => y.score - x.score || camelotNumber(x.key) - camelotNumber(y.key));
}

// ---------- Diatonic chords ----------
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
export type Diatonic = { degree: number; roman: string; root: number; quality: string; symbol: string };
/**
 * The seven chords built on each note of a key's scale, as triads or (sevenths = true) seventh chords.
 * Minor keys use the natural minor scale; harmonicV = true makes v -> V (and v7 -> V7) as the raised 7th gives.
 */
export function diatonicChords(k: Key, sevenths = false, harmonicV = false): Diatonic[] {
  const steps = SCALES[k.mode === 'major' ? 'major' : 'natural-minor'].steps.slice();
  const flats = keyUsesFlats(k);
  return steps.map((_, i) => {
    const sc = harmonicV && k.mode === 'minor' && i === 4 ? SCALES['harmonic-minor'].steps : steps;
    const at = (j: number) => { const idx = i + j; return sc[idx % 7] + 12 * Math.floor(idx / 7) - sc[i]; };
    const third = at(2), fifth = at(4), sev = at(6);
    let q = third === 4 ? (fifth === 8 ? 'aug' : '') : fifth === 6 ? 'dim' : 'm';
    if (sevenths) q = q === '' ? (sev === 11 ? 'maj7' : '7') : q === 'm' ? 'm7' : q === 'dim' ? (sev === 10 ? 'm7b5' : 'dim7') : 'maj7#5';
    const minorish = q.startsWith('m') && !q.startsWith('maj') || q.startsWith('dim');
    let roman = minorish ? ROMAN[i].toLowerCase() : ROMAN[i];
    if (q === 'dim' || q === 'dim7') roman += '°';
    else if (q === 'm7b5') roman += 'ø';
    else if (q === 'aug') roman += '+';
    if (sevenths) roman += '7';
    // Flat-side degrees of minor keys (III, VI, VII) are written ♭III, ♭VI, ♭VII by some books; fibub keeps plain numerals.
    const root = mod12(k.tonic + sc[i]);
    return { degree: i + 1, roman, root, quality: q, symbol: noteName(root, flats) + q };
  });
}

// ---------- Transposing ----------
/**
 * Move a chord symbol by n semitones. Spelling: the target key's (if given), else flats if the chord was
 * written with flats, else sharps. "F#m7/C#" up 2 -> "G#m7/D#"; with key E♭ major -> "Abm7/Eb".
 */
export function transposeChord(sym: string, n: number, targetKey?: Key, preferFlats?: boolean): string | null {
  const c = parseChord(sym);
  if (!c) return null;
  const flats = targetKey ? keyUsesFlats(targetKey) : preferFlats ?? c.flats;
  return noteName(c.root + n, flats) + c.suffix + (c.bass !== null ? '/' + noteName(c.bass + n, flats) : '');
}
/** Transpose every chord symbol in a line of text; words that are not chords are left alone. */
export function transposeText(text: string, n: number, targetKey?: Key, preferFlats?: boolean): string {
  return text.replace(/(^|[\s|(\[,])([A-G](?:#|♯|b|♭)?[^\s|)\],/]*(?:\/[A-G](?:#|♯|b|♭)?)?)(?=$|[\s|)\],])/g, (all, pre, sym) => {
    const c = parseChord(sym);
    if (!c || chordQuality(c.suffix) === null) return all;
    return pre + transposeChord(sym, n, targetKey, preferFlats);
  });
}

// ---------- Tempo and pitch ----------
/** Semitones the pitch moves when a track is sped from oldBpm to newBpm without keeping pitch (12·log2(new/old)). */
export const tempoSemitones = (oldBpm: number, newBpm: number) => 12 * Math.log2(newBpm / oldBpm);
/** Percent speed change from one tempo to another. */
export const tempoPercent = (oldBpm: number, newBpm: number) => (newBpm / oldBpm - 1) * 100;
/** Key heard after a tempo change without key lock (rounded to the nearest semitone) and the exact shift. */
export function keyAfterTempo(k: Key, oldBpm: number, newBpm: number): { key: Key; semitones: number } {
  const s = tempoSemitones(oldBpm, newBpm);
  return { key: shiftKey(k, s), semitones: s };
}
