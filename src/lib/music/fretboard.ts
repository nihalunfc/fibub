// Fretted-instrument helpers: tunings, common open shapes, chord names from frets, fingering, SVG chord diagrams and text tab.
// Plain TypeScript, no DOM. Strings are listed from the lowest-sounding to the highest; fret -1 means muted, 0 open.
import { noteName } from './theory.ts';
import { nameChord } from './theory-extra.ts';

export type Tuning = { id: string; name: string; midi: number[] };
export type Instrument = { id: string; name: string; tunings: Tuning[]; shapes: Record<string, number[]> };

const G = (id: string, name: string, midi: number[]): Tuning => ({ id, name, midi });
/** Low E to high e. Shapes are written for standard tuning and are only a starting point in other tunings. */
export const INSTRUMENTS: Instrument[] = [
  {
    id: 'guitar', name: 'Guitar (6 strings)',
    tunings: [G('std', 'Standard (E A D G B E)', [40, 45, 50, 55, 59, 64]), G('dropd', 'Drop D (D A D G B E)', [38, 45, 50, 55, 59, 64]), G('dadgad', 'DADGAD', [38, 45, 50, 55, 57, 62]), G('openg', 'Open G (D G D G B D)', [38, 43, 50, 55, 59, 62]), G('halfdown', 'Half step down (E♭ A♭ D♭ G♭ B♭ E♭)', [39, 44, 49, 54, 58, 63])],
    shapes: {
      C: [-1, 3, 2, 0, 1, 0], D: [-1, -1, 0, 2, 3, 2], E: [0, 2, 2, 1, 0, 0], G: [3, 2, 0, 0, 0, 3], A: [-1, 0, 2, 2, 2, 0],
      Am: [-1, 0, 2, 2, 1, 0], Em: [0, 2, 2, 0, 0, 0], Dm: [-1, -1, 0, 2, 3, 1],
      E7: [0, 2, 0, 1, 0, 0], A7: [-1, 0, 2, 0, 2, 0], D7: [-1, -1, 0, 2, 1, 2], G7: [3, 2, 0, 0, 0, 1], C7: [-1, 3, 2, 3, 1, 0], B7: [-1, 2, 1, 2, 0, 2],
      Am7: [-1, 0, 2, 0, 1, 0], Em7: [0, 2, 0, 0, 0, 0], Dm7: [-1, -1, 0, 2, 1, 1], Cmaj7: [-1, 3, 2, 0, 0, 0], Fmaj7: [-1, -1, 3, 2, 1, 0],
      Asus2: [-1, 0, 2, 2, 0, 0], Asus4: [-1, 0, 2, 2, 3, 0], Dsus2: [-1, -1, 0, 2, 3, 0], Dsus4: [-1, -1, 0, 2, 3, 3], Cadd9: [-1, 3, 2, 0, 3, 0],
      F: [1, 3, 3, 2, 1, 1], Fm: [1, 3, 3, 1, 1, 1], Bm: [-1, 2, 4, 4, 3, 2], Bb: [-1, 1, 3, 3, 3, 1], 'F#m': [2, 4, 4, 2, 2, 2], B: [-1, 2, 4, 4, 4, 2],
    },
  },
  {
    id: 'ukulele', name: 'Ukulele (4 strings)',
    tunings: [G('std', 'Standard (G C E A)', [67, 60, 64, 69]), G('lowg', 'Low G (G C E A, low G)', [55, 60, 64, 69]), G('baritone', 'Baritone (D G B E)', [50, 55, 59, 64])],
    shapes: { C: [0, 0, 0, 3], F: [2, 0, 1, 0], G: [0, 2, 3, 2], Am: [2, 0, 0, 0], Dm: [2, 2, 1, 0], Em: [0, 4, 3, 2], A: [2, 1, 0, 0], D: [2, 2, 2, 0], C7: [0, 0, 0, 1], G7: [0, 2, 1, 2], Fmaj7: [2, 4, 1, 3], Bb: [3, 2, 1, 1] },
  },
  {
    id: 'bass', name: 'Bass (4 strings)',
    tunings: [G('std', 'Standard (E A D G)', [28, 33, 38, 43]), G('dropd', 'Drop D (D A D G)', [26, 33, 38, 43]), G('five', 'Half step down', [27, 32, 37, 42])],
    shapes: {},
  },
];

/** MIDI notes sounded by a shape, lowest string first, muted strings left out. */
export const shapeMidi = (frets: number[], t: Tuning) => frets.flatMap((f, i) => (f >= 0 ? [t.midi[i] + f] : []));
/** Chord name, or null if the notes are not a chord fibub knows. */
export function shapeName(frets: number[], t: Tuning): string | null {
  const m = shapeMidi(frets, t);
  if (m.length < 2) return null;
  const lowest = [...m].sort((a, b) => a - b);
  const sh = nameChord(lowest, false), fl = nameChord(lowest, true);
  let name = fl && /^(Db|Eb|Ab|Bb)/.test(fl) ? fl : sh;
  // On ukuleles and other re-entrant tunings the lowest note is not the bass, so leave the slash off.
  const ascending = t.midi.every((x, i) => i === 0 || x > t.midi[i - 1]);
  if (name && !ascending) name = name.replace(/\/.*$/, '');
  return name;
}
export const shapeNoteNames = (frets: number[], t: Tuning) => shapeMidi(frets, t).map((m) => noteName(m));

export type Barre = { fret: number; from: number; to: number };
/** A barre is the lowest fretted fret pressed on two or more strings with nothing open or muted between them. */
export function findBarre(frets: number[]): Barre | null {
  const pressed = frets.filter((f) => f > 0);
  if (!pressed.length) return null;
  const f0 = Math.min(...pressed), at = frets.map((f, i) => (f === f0 ? i : -1)).filter((i) => i >= 0);
  if (at.length < 2) return null;
  const from = at[0], to = at[at.length - 1];
  for (let i = from; i <= to; i++) if (frets[i] < f0) return null;
  return { fret: f0, from, to };
}
/** Finger numbers 1-4 (0 = none) for each string: a barre is finger 1, the rest go in order of fret then string. */
export function autoFingers(frets: number[]): number[] {
  const out = frets.map(() => 0), b = findBarre(frets);
  let next = 1;
  if (b) { for (let i = b.from; i <= b.to; i++) if (frets[i] === b.fret) out[i] = 1; next = 2; }
  const rest = frets.map((f, i) => ({ f, i })).filter((x) => x.f > 0 && !out[x.i]).sort((a, c) => a.f - c.f || a.i - c.i);
  for (const x of rest) if (next <= 4) out[x.i] = next++;
  return out;
}
/** First fret to show: 1 unless every pressed fret is beyond the fifth. */
export function baseFret(frets: number[], span = 5): number {
  const pressed = frets.filter((f) => f > 0);
  if (!pressed.length || Math.max(...pressed) <= span) return 1;
  return Math.min(...pressed);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export type DiagramOpts = { name: string; frets: number[]; fingers: number[]; base: number; span?: number };
/** A self-contained SVG chord diagram (black on white, so it prints and exports cleanly). */
export function diagramSvg(o: DiagramOpts): string {
  const n = o.frets.length, span = o.span ?? 5, gap = 20, rowH = 24, W = 160, x0 = (W - (n - 1) * gap) / 2, top = 46, H = top + span * rowH + 12;
  const sx = (i: number) => x0 + i * gap, fy = (f: number) => top + (f - o.base) * rowH + rowH / 2;
  const p: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="${esc(o.name || 'Chord')} chord diagram">`, `<rect width="${W}" height="${H}" fill="#fff"/>`];
  p.push(`<text x="${W / 2}" y="18" text-anchor="middle" font-size="16" font-weight="700" fill="#000">${esc(o.name)}</text>`);
  for (let i = 0; i < n; i++) {
    const f = o.frets[i];
    if (f < 0) p.push(`<text x="${sx(i)}" y="38" text-anchor="middle" font-size="13" fill="#000">×</text>`);
    else if (f === 0) p.push(`<circle cx="${sx(i)}" cy="33" r="4.5" fill="none" stroke="#000" stroke-width="1.4"/>`);
    p.push(`<line x1="${sx(i)}" y1="${top}" x2="${sx(i)}" y2="${top + span * rowH}" stroke="#000" stroke-width="1.2"/>`);
  }
  for (let r = 0; r <= span; r++) p.push(`<line x1="${sx(0)}" y1="${top + r * rowH}" x2="${sx(n - 1)}" y2="${top + r * rowH}" stroke="#000" stroke-width="${r === 0 && o.base === 1 ? 4 : 1.2}"/>`);
  if (o.base > 1) p.push(`<text x="${sx(n - 1) + 8}" y="${top + rowH / 2 + 4}" font-size="11" fill="#000">${o.base}fr</text>`);
  const b = findBarre(o.frets);
  if (b && b.fret >= o.base && b.fret < o.base + span) p.push(`<rect class="barre" x="${sx(b.from) - 8}" y="${fy(b.fret) - 8}" width="${sx(b.to) - sx(b.from) + 16}" height="16" rx="8" fill="#000"/>`);
  for (let i = 0; i < n; i++) {
    const f = o.frets[i];
    if (f > 0 && f >= o.base && f < o.base + span) {
      const inBarre = b && f === b.fret && i >= b.from && i <= b.to;
      p.push(`<circle class="dot" cx="${sx(i)}" cy="${fy(f)}" r="8" fill="#000"${inBarre ? ' fill-opacity="0"' : ''}/>`);
      if (o.fingers[i]) p.push(`<text x="${sx(i)}" y="${fy(f) + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${o.fingers[i]}</text>`);
    }
  }
  p.push('</svg>');
  return p.join('');
}

/** Text tab. grid[string][step] is a fret number text ('' for none), strings lowest first; printed highest string first. */
export function tabText(grid: string[][], t: Tuning, barEvery = 4): string {
  const n = grid.length, steps = grid[0]?.length ?? 0;
  const labels = t.midi.slice(0, n).map((m, i) => { const s = noteName(m, false).replace('#', '#'); return i === n - 1 && n > 1 ? s.toLowerCase() : s; });
  const lw = Math.max(...labels.map((l) => l.length));
  const widths = Array.from({ length: steps }, (_, c) => Math.max(1, ...grid.map((row) => (row[c] ?? '').length)));
  const lines: string[] = [];
  for (let s = n - 1; s >= 0; s--) {
    let line = labels[s].padEnd(lw) + '|-';
    for (let c = 0; c < steps; c++) {
      line += (grid[s][c] ?? '').padEnd(widths[c], '-') + '-';
      if (barEvery && (c + 1) % barEvery === 0) line += '|' + (c + 1 < steps ? '-' : '');
    }
    if (!(barEvery && steps % barEvery === 0)) line += '|';
    lines.push(line);
  }
  return lines.join('\n');
}
