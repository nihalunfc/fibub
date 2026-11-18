// Transpose a song sheet: chords above lyrics, or inline [C] chords. Lyrics are never touched. Plain TypeScript, no DOM.
import { chordQuality, keyUsesFlats, mod12, noteName, parseChord, type Key } from './theory.ts';
import { findKeys } from './theory-extra.ts';

const LOOSE_SUFFIX = /^(?:maj|min|m|M|dim|aug|sus[24]?|add\d+|no\d+|\d+|[#b♭♯+°ø\-Δ]|\([^)]*\))*$/;
/** Whether a word is a chord symbol such as C, F#m7, Bbmaj7, Dsus4, G/B, Am(add9). */
export function isChord(tok: string): boolean {
  const c = parseChord(tok.replace(/\(.*\)$/, (m) => m));
  if (c) return chordQuality(c.suffix) !== null || LOOSE_SUFFIX.test(c.suffix);
  // Slash chords with a loose suffix on the bass side are covered by parseChord; anything else is not a chord.
  return false;
}
const FILLER = /^(?:\||\|\||:\|\||\|:|-|–|—|\/|\\|x\d+|\d+x|\(?x\d+\)?|N\.?C\.?|%|\.{2,}|~+)$/i;
/** A line made only of chords (and bar lines or repeat marks), with at least one chord. */
export function isChordLine(line: string): boolean {
  const toks = line.trim().split(/\s+/).filter(Boolean);
  if (!toks.length) return false;
  let n = 0;
  for (const t of toks) { if (isChord(t)) n++; else if (!FILLER.test(t)) return false; }
  return n > 0;
}

export type SpellOpts = { n: number; flats?: boolean; targetKey?: Key };
const move = (sym: string, o: SpellOpts) => {
  const c = parseChord(sym); if (!c) return sym;
  const flats = o.targetKey ? keyUsesFlats(o.targetKey) : o.flats ?? c.flats;
  const f = o.flats ?? flats;
  return noteName(c.root + o.n, f) + c.suffix + (c.bass !== null ? '/' + noteName(c.bass + o.n, f) : '');
};
/** Move the chords on one chord-only line, keeping each at the same column (adds a space only when a longer name would run into the next). */
function shiftChordLine(line: string, o: SpellOpts): string {
  let out = '';
  const re = /\S+/g; let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const col = m.index, tok = isChord(m[0]) ? move(m[0], o) : m[0];
    if (out.length < col) out += ' '.repeat(col - out.length);
    else if (out.length && !out.endsWith(' ')) out += ' ';
    out += tok;
  }
  return out;
}
/** Transpose a whole sheet by o.n semitones. */
export function transposeSheet(text: string, o: SpellOpts): string {
  return text.split('\n').map((line) => {
    const raw = line.replace(/\r$/, '');
    if (isChordLine(raw)) return shiftChordLine(raw, o);
    return raw.replace(/\[([^\]\n]+)\]/g, (all, inner) => (isChord(inner.trim()) ? '[' + move(inner.trim(), o) + ']' : all));
  }).join('\n');
}
/** Every chord symbol in a sheet, in order. */
export function sheetChords(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    if (isChordLine(line)) out.push(...line.trim().split(/\s+/).filter(isChord));
    else for (const m of line.matchAll(/\[([^\]\n]+)\]/g)) if (isChord(m[1].trim())) out.push(m[1].trim());
  }
  return out;
}
/** Best-guess key of a sheet from its chords. */
export function sheetKey(text: string): Key | null {
  const ch = sheetChords(text);
  return ch.length ? findKeys(ch)[0].key : null;
}

const OPEN = new Set(['C', 'D', 'E', 'G', 'A', 'Am', 'Em', 'Dm', 'E7', 'A7', 'D7', 'G7', 'C7', 'B7', 'Am7', 'Em7', 'Dm7', 'Cmaj7', 'Fmaj7', 'Asus2', 'Asus4', 'Dsus2', 'Dsus4', 'Esus4', 'Cadd9', 'Gsus4', 'Amaj7', 'Dmaj7']);
/** Shape name with the bass dropped, for the open-chord check. */
const shapeBase = (s: string) => s.replace(/\/.*$/, '');
export type CapoOption = { capo: number; shapes: string[]; easy: number; total: number };
/** For capo 0-9: the shapes to play for a set of sounding chords, and how many are common open chords. Best first. */
export function capoOptions(chords: string[], flatsFor: (capo: number) => boolean | undefined): CapoOption[] {
  const uniq = [...new Set(chords)];
  const list: CapoOption[] = [];
  for (let capo = 0; capo <= 9; capo++) {
    const shapes = uniq.map((c) => move(c, { n: -capo, flats: flatsFor(capo) }));
    list.push({ capo, shapes, easy: shapes.filter((s) => OPEN.has(shapeBase(s))).length, total: shapes.length });
  }
  return list.sort((a, b) => b.easy - a.easy || a.capo - b.capo);
}
export const semitoneRange = (n: number) => { const m = mod12(n); return m > 6 ? m - 12 : m; };
