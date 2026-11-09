// Colour contrast (WCAG 2.x) and readability scores (Flesch reading ease, Flesch-Kincaid grade). Plain TypeScript.
import { toLinear } from './colourvision.ts';

export type RGB = [number, number, number];

/** Read a colour: #rgb, #rrggbb, rgb(r, g, b) or "r, g, b" (0 to 255). Throws an Error with a plain message. */
export function parseColour(s: string): RGB {
  const t = s.trim().toLowerCase();
  let m = /^#?([0-9a-f]{3})$/.exec(t);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16)) as RGB;
  m = /^#?([0-9a-f]{6})$/.exec(t);
  if (m) return [0, 2, 4].map((i) => parseInt(m![1].slice(i, i + 2), 16)) as RGB;
  if (/^#?([0-9a-f]{4}|[0-9a-f]{8})$/.test(t)) throw new Error(`"${s.trim()}" has transparency. Contrast needs solid colours: drop the last ${t.replace('#', '').length === 4 ? 'digit' : 'two digits'}.`);
  m = /^(?:rgba?\s*\()?\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)?$/.exec(t);
  if (m) { const v = m.slice(1, 4).map(Number); if (v.every((x) => x <= 255)) return v as RGB; throw new Error(`"${s.trim()}": each of red, green and blue must be 0 to 255.`); }
  throw new Error(`"${s.trim() || '(empty)'}" is not a colour this page reads. Use #1a2b3c, #abc or rgb(26, 43, 60).`);
}
export const hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Relative luminance (WCAG 2.x definition, with the sRGB standard's 0.04045 threshold). */
export function luminance(c: number[]): number {
  const [r, g, b] = c.map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** Contrast ratio from 1 to 21. */
export function contrast(a: number[], b: number[]): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
/** The ratio as shown: cut (not rounded) to 2 decimals, so 4.499 never shows as 4.50. */
export const ratioText = (r: number) => `${(Math.floor(r * 100) / 100).toFixed(2)}:1`;

export const LEVELS = [
  { id: 'aa', name: 'AA, normal text', need: 4.5, sc: '1.4.3' },
  { id: 'aa-large', name: 'AA, large text', need: 3, sc: '1.4.3' },
  { id: 'aaa', name: 'AAA, normal text', need: 7, sc: '1.4.6' },
  { id: 'aaa-large', name: 'AAA, large text', need: 4.5, sc: '1.4.6' },
  { id: 'ui', name: 'AA, buttons, icons and graphics', need: 3, sc: '1.4.11' },
];

// HSL, for keeping a colour's hue and saturation while changing its lightness.
export function toHsl([r, g, b]: number[]): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
export function fromHsl(h: number, s: number, l: number): RGB {
  const k = (n: number) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as RGB;
}
/**
 * The nearest colour to `c` (same hue and saturation, lightness changed as little as possible) that reaches the
 * target ratio against `other`, as 8-bit RGB; null if no lightness can reach it.
 */
export function nearestPassing(c: RGB, other: RGB, need: number): RGB | null {
  if (contrast(c, other) >= need) return c;
  const [h, s, l0] = toHsl(c);
  let best: RGB | null = null, bestD = Infinity;
  for (const dir of [-1, 1]) {
    const end = dir < 0 ? 0 : 1;
    if (contrast(fromHsl(h, s, end), other) < need) continue;
    // Contrast grows monotonically as lightness moves away from the other colour on this side: bisect.
    let lo = l0, hi = end;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (contrast(fromHsl(h, s, mid), other) >= need) hi = mid; else lo = mid; }
    // Rounding to 8 bits can land just short: step on until it passes.
    let l = hi, rgb = fromHsl(h, s, l);
    for (let i = 0; i < 300 && contrast(rgb, other) < need; i++) { l = Math.max(0, Math.min(1, l + dir * 0.0005)); rgb = fromHsl(h, s, l); }
    if (contrast(rgb, other) >= need && Math.abs(l - l0) < bestD) { bestD = Math.abs(l - l0); best = rgb; }
  }
  return best;
}

// ---------- Readability ----------
/** Syllables in one English word, by a vowel-group rule with common silent-e and -ed/-es fixes (an estimate). */
export function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouyhsxz]es|[^laeiouydt]ed|[^laeiouy]e)$/, (m) => m[0]).replace(/^y/, '');
  const groups = w.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}
export type Readability = { words: number; sentences: number; syllables: number; fre: number; fk: number; poly: number };
/** Words, sentences and syllables of a text, with the Flesch reading ease and Flesch-Kincaid grade. */
export function readability(text: string): Readability {
  const words = text.match(/[A-Za-z0-9À-ɏ]+(?:['’-][A-Za-zÀ-ɏ]+)*/g) ?? [];
  // A sentence ends at . ! ? (one or more), or at a blank line; numbers like 3.5 do not end one.
  const sentences = text.split(/(?<!\d)[.!?]+(?=\s|$|["'”’)])|\n\s*\n/).filter((s) => /[A-Za-z0-9]/.test(s)).length;
  const syl = words.map((w) => (/^\d+$/.test(w) ? 1 : syllables(w)));
  const nW = words.length, nS = Math.max(1, sentences), nSy = syl.reduce((a, b) => a + b, 0);
  return {
    words: nW, sentences: nW ? nS : 0, syllables: nSy, poly: syl.filter((s) => s >= 3).length,
    fre: nW ? 206.835 - 1.015 * (nW / nS) - 84.6 * (nSy / nW) : NaN,
    fk: nW ? 0.39 * (nW / nS) + 11.8 * (nSy / nW) - 15.59 : NaN,
  };
}
/** Flesch's own description of a reading-ease score. */
export function freBand(s: number): string {
  if (s >= 90) return 'very easy'; if (s >= 80) return 'easy'; if (s >= 70) return 'fairly easy'; if (s >= 60) return 'plain English';
  if (s >= 50) return 'fairly difficult'; if (s >= 30) return 'difficult'; return 'very difficult';
}
