// Rows for a table of every MIDI note (0 to 127 = C-1 to G9) and a search that understands names, MIDI numbers and Hz.
import { freqToMidi, midiToFreq, noteName, parseMidi, pretty } from './theory.ts';

export const SPEED_OF_SOUND = 343; // m/s in dry air at 20 °C
export type Convention = 'scientific' | 'midi';
export type NoteRow = { midi: number; name: string; sharp: string; flat: string; octave: number; freq: number; periodMs: number; wavelength: number; pianoKey: number | null };

/** Octave number of a MIDI note: middle C (60) is C4 in the scientific style and C3 in the MIDI-program style. */
export const octaveOf = (m: number, c: Convention = 'scientific') => Math.floor(m / 12) - (c === 'scientific' ? 1 : 2);
/** "C4" or "C♯4 / D♭4". */
export function labelOf(m: number, c: Convention = 'scientific', ascii = false) {
  const o = octaveOf(m, c), sh = noteName(m, false) + o, fl = noteName(m, true) + o;
  const f = ascii ? (x: string) => x : pretty;
  return sh === fl ? f(sh) : `${f(sh)} / ${f(fl)}`;
}
export function noteRow(m: number, a4 = 440, c: Convention = 'scientific'): NoteRow {
  const freq = midiToFreq(m, a4), o = octaveOf(m, c);
  return {
    midi: m, name: labelOf(m, c), sharp: noteName(m, false) + o, flat: noteName(m, true) + o, octave: o, freq,
    periodMs: 1000 / freq, wavelength: SPEED_OF_SOUND / freq, pianoKey: m >= 21 && m <= 108 ? m - 20 : null,
  };
}
export const allRows = (a4 = 440, c: Convention = 'scientific') => Array.from({ length: 128 }, (_, m) => noteRow(m, a4, c));

export type Hit = { row: NoteRow; cents: number; from: 'name' | 'midi' | 'freq'; input: number };
/** Understand "A4", "C#3", "60" (MIDI) or "261.6 Hz". Null if it is not a note, number or frequency in range. */
export function search(q: string, a4 = 440, c: Convention = 'scientific'): Hit | null {
  const t = q.trim().replace(/♯/g, '#').replace(/♭/g, 'b');
  if (!t) return null;
  const hz = t.match(/^(\d+(?:[.,]\d+)?)\s*(?:hz|hertz)$/i);
  const num = t.match(/^\d+(?:[.,]\d+)?$/);
  let hit = (f: number, from: Hit['from']): Hit | null => {
    if (!(f > 0)) return null;
    const x = freqToMidi(f, a4), m = Math.round(x);
    if (m < 0 || m > 127) return null;
    return { row: noteRow(m, a4, c), cents: (x - m) * 100, from, input: f };
  };
  if (hz) return hit(parseFloat(hz[1].replace(',', '.')), 'freq');
  if (num) {
    const v = parseFloat(t.replace(',', '.'));
    if (Number.isInteger(v) && v >= 0 && v <= 127 && !/[.,]/.test(t)) return { row: noteRow(v, a4, c), cents: 0, from: 'midi', input: v };
    return hit(v, 'freq');
  }
  const nm = t.match(/^([A-Ga-g][#b]*)(-?\d+)$/);
  if (nm) {
    const m = parseMidi(nm[1] + (+nm[2] + (c === 'midi' ? 1 : 0)));
    if (m !== null && m >= 0 && m <= 127) return { row: noteRow(m, a4, c), cents: 0, from: 'name', input: m };
  }
  return null;
}
