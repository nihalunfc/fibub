// Science colour palettes: build sequential, diverging and qualitative palettes in OKLCH (a perceptually even
// colour space), check them for colour-blind safety (smallest CIEDE2000 difference between any two colours after
// simulation) and contrast with the background, and write them out for CSS, matplotlib, R and JSON. No DOM.
import { cvdMatrix, toLinear, toSrgb, XYZ_FROM_RGB, type Cvd } from './figcheck.ts';

export type RGB = [number, number, number]; // sRGB, 0..1
export type Lab = [number, number, number];

export function hexToRgb(h: string): RGB | null {
  const m = h.trim().replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const s = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255) as RGB;
}
export const rgbToHex = (c: RGB) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');

// ---------- OKLab (Björn Ottosson, 2020) ----------
export function linToOklab([r, g, b]: RGB): Lab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export function oklabToLin([L, a, b]: Lab): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
export const srgbToOklab = (c: RGB) => linToOklab(c.map(toLinear) as RGB);
export const oklabToSrgb = (c: Lab) => oklabToLin(c).map(toSrgb) as RGB;
/** OKLCH: lightness 0..1, chroma, hue in degrees. */
export function oklch(c: RGB): Lab { const [L, a, b] = srgbToOklab(c); const h = (Math.atan2(b, a) * 180) / Math.PI; return [L, Math.hypot(a, b), h < 0 ? h + 360 : h]; }
const fromLch = (L: number, C: number, h: number): Lab => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
const inGamut = (c: RGB, e = 1e-6) => c.every((v) => v >= -e && v <= 1 + e);
/** OKLCH → sRGB, lowering chroma (keeping lightness and hue) until the colour fits the sRGB gamut. */
export function lchToSrgb(L: number, C: number, h: number): RGB {
  const Lc = Math.max(0, Math.min(1, L));
  let c = oklabToSrgb(fromLch(Lc, C, h));
  if (inGamut(c)) return c.map((v) => Math.max(0, Math.min(1, v))) as RGB;
  let lo = 0, hi = C;
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (inGamut(oklabToSrgb(fromLch(Lc, mid, h)))) lo = mid; else hi = mid; }
  c = oklabToSrgb(fromLch(Lc, lo, h));
  return c.map((v) => Math.max(0, Math.min(1, v))) as RGB;
}

// ---------- CIELAB (D65) and CIEDE2000 ----------
const WHITE = [0.95047, 1, 1.08883];
export function srgbToLab(c: RGB): Lab {
  const lin = c.map(toLinear), xyz = XYZ_FROM_RGB.map((r) => r[0] * lin[0] + r[1] * lin[1] + r[2] * lin[2]);
  const f = (t: number) => (t > (6 / 29) ** 3 ? Math.cbrt(t) : t / (3 * (6 / 29) ** 2) + 4 / 29);
  const [fx, fy, fz] = xyz.map((v, i) => f(v / WHITE[i]));
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
/** CIEDE2000 colour difference (Sharma, Wu and Dalal 2005 formulation), kL = kC = kH = 1. */
export function de2000(a: Lab, b: Lab): number {
  const [L1, a1, b1] = a, [L2, a2, b2] = b, rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1, a2p = (1 + G) * a2, C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hp = (x: number, y: number) => { if (x === 0 && y === 0) return 0; const h = Math.atan2(y, x) / rad; return h < 0 ? h + 360 : h; };
  const h1p = hp(a1p, b1), h2p = hp(a2p, b2);
  const dL = L2 - L1, dC = C2p - C1p;
  let dh = 0;
  if (C1p * C2p !== 0) { dh = h2p - h1p; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin((dh * rad) / 2);
  const Lm = (L1 + L2) / 2, Cmp = (C1p + C2p) / 2;
  let hm = h1p + h2p;
  if (C1p * C2p !== 0) { if (Math.abs(h1p - h2p) > 180) hm = h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2; else hm = (h1p + h2p) / 2; }
  const T = 1 - 0.17 * Math.cos((hm - 30) * rad) + 0.24 * Math.cos(2 * hm * rad) + 0.32 * Math.cos((3 * hm + 6) * rad) - 0.2 * Math.cos((4 * hm - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const RC = 2 * Math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7));
  const SL = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2), SC = 1 + 0.045 * Cmp, SH = 1 + 0.015 * Cmp * T;
  const RT = -Math.sin(2 * dTheta * rad) * RC;
  return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH));
}

/** WCAG 2 relative luminance and contrast ratio. */
export const luminance = (c: RGB) => { const l = c.map(toLinear); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
export function contrast(a: RGB, b: RGB) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

/** A colour as seen with a colour vision deficiency (full strength unless given). */
export function simulateRgb(c: RGB, t: Cvd, severity = 1): RGB {
  const m = cvdMatrix(t, severity), l = c.map(toLinear);
  return m.map((r) => toSrgb(Math.max(0, Math.min(1, r[0] * l[0] + r[1] * l[1] + r[2] * l[2])))) as RGB;
}
export const grey = (c: RGB): RGB => { const y = toSrgb(XYZ_FROM_RGB[1][0] * toLinear(c[0]) + XYZ_FROM_RGB[1][1] * toLinear(c[1]) + XYZ_FROM_RGB[1][2] * toLinear(c[2])); return [y, y, y]; };

export type Vision = 'normal' | Cvd | 'grey';
export const VISIONS: Vision[] = ['normal', 'deutan', 'protan', 'tritan', 'grey'];
export const VISION_NAMES: Record<Vision, string> = { normal: 'Normal vision', deutan: 'Deuteranopia', protan: 'Protanopia', tritan: 'Tritanopia', grey: 'Greyscale' };
export const seen = (c: RGB, v: Vision) => (v === 'normal' ? c : v === 'grey' ? grey(c) : simulateRgb(c, v));

export type PairCheck = { vision: Vision; min: number; i: number; j: number };
/** For each kind of vision, the closest pair of colours (CIEDE2000). For ordered palettes only neighbours are compared. */
export function closestPairs(cols: RGB[], neighboursOnly = false): PairCheck[] {
  return VISIONS.map((v) => {
    const labs = cols.map((c) => srgbToLab(seen(c, v)));
    let best: PairCheck = { vision: v, min: Infinity, i: -1, j: -1 };
    for (let i = 0; i < labs.length; i++) for (let j = i + 1; j < labs.length; j++) {
      if (neighboursOnly && j !== i + 1) continue;
      const d = de2000(labs[i], labs[j]);
      if (d < best.min) best = { vision: v, min: d, i, j };
    }
    return best;
  });
}

// ---------- Palette builders ----------
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hueLerp = (a: number, b: number, t: number) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; return (a + d * t + 360) % 360; };
const span = (n: number) => Array.from({ length: n }, (_, i) => (n === 1 ? 0.5 : i / (n - 1)));

export type SeqOpts = { n: number; hue: number; hueShift: number; lLight: number; lDark: number; chroma: number };
/** Light to dark, lightness falling evenly; chroma peaks in the middle so the ends stay near white and near black. */
export function sequential(o: SeqOpts): RGB[] {
  return span(o.n).map((t) => lchToSrgb(lerp(o.lLight, o.lDark, t), o.chroma * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, 0.15 + 0.85 * t))), (o.hue + o.hueShift * t + 360) % 360));
}
export type DivOpts = { n: number; hueA: number; hueB: number; lEnd: number; lMid: number; chroma: number };
/** Two hues meeting at a light, nearly grey middle; equal lightness at equal distance from the middle. */
export function diverging(o: DivOpts): RGB[] {
  return span(o.n).map((t) => {
    const d = Math.abs(2 * t - 1), h = t < 0.5 ? o.hueA : o.hueB;
    return lchToSrgb(lerp(o.lMid, o.lEnd, d), o.chroma * Math.sin((Math.PI / 2) * d) ** 0.8, h);
  });
}
export type QualOpts = { n: number; l: number; chroma: number; spread: number; start?: number };
/**
 * Evenly spaced hues at the given lightness and chroma, with lightness alternating by ±spread so colours also differ
 * in brightness. Without `start`, the starting hue is the one (in 1° steps) that gives the largest smallest
 * colour-blind difference, so the palette is as safe as these settings allow.
 */
export function qualitative(o: QualOpts): { cols: RGB[]; start: number } {
  const make = (h0: number) => Array.from({ length: o.n }, (_, i) => lchToSrgb(o.l + [1, -1, 0][i % 3] * o.spread, o.chroma, (h0 + (360 * i) / o.n) % 360));
  if (o.start !== undefined) return { cols: make(o.start), start: o.start };
  let best = 0, bestScore = -1;
  for (let h0 = 0; h0 < 360 / Math.max(1, o.n); h0 += 1) {
    const s = Math.min(...closestPairs(make(h0)).filter((p) => p.vision !== 'grey').map((p) => p.min));
    if (s > bestScore + 1e-9) { bestScore = s; best = h0; }
  }
  return { cols: make(best), start: best };
}

// ---------- Export ----------
export type Fmt = 'hex' | 'css' | 'matplotlib' | 'r' | 'json';
export function exportPalette(cols: RGB[], name: string, kind: string, fmt: Fmt): string {
  const hex = cols.map(rgbToHex), id = name.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').toLowerCase() || 'palette';
  if (fmt === 'hex') return hex.join('\n') + '\n';
  if (fmt === 'css') return `:root {\n${hex.map((h, i) => `  --${id.replace(/_/g, '-')}-${i + 1}: ${h};`).join('\n')}\n}\n`;
  if (fmt === 'matplotlib') {
    const list = hex.map((h) => `"${h}"`).join(', ');
    return kind === 'qualitative'
      ? `# ${name}: ${cols.length} colours from fibub.com\nimport matplotlib.pyplot as plt\nfrom cycler import cycler\n${id} = [${list}]\nplt.rcParams["axes.prop_cycle"] = cycler(color=${id})\n`
      : `# ${name}: ${cols.length}-step ${kind} colour map from fibub.com\nfrom matplotlib.colors import LinearSegmentedColormap, ListedColormap\n${id} = [${list}]\ncmap_${id} = LinearSegmentedColormap.from_list("${id}", ${id})  # smooth\ncmap_${id}_steps = ListedColormap(${id}, name="${id}_steps")  # stepped\n`;
  }
  if (fmt === 'r') {
    const list = hex.map((h) => `"${h}"`).join(', ');
    return kind === 'qualitative'
      ? `# ${name}: ${cols.length} colours from fibub.com\n${id} <- c(${list})\n# ggplot2: + scale_colour_manual(values = ${id})\n`
      : `# ${name}: ${cols.length}-step ${kind} palette from fibub.com\n${id} <- c(${list})\n${id}_ramp <- colorRampPalette(${id})\n# ggplot2: + scale_fill_gradientn(colours = ${id})\n`;
  }
  return JSON.stringify({ name, kind, colours: hex, oklch: cols.map((c) => oklch(c).map((v, i) => +v.toFixed(i === 2 ? 1 : 4))) }, null, 2) + '\n';
}

/** Hex colours from free text (any separators). Returns the colours or the first bad token. */
export function parseHexList(text: string): RGB[] | string {
  const toks = text.split(/[\s,;"'\[\]()]+/).filter(Boolean);
  const out: RGB[] = [];
  for (const t of toks) { const c = hexToRgb(t); if (!c) return t; out.push(c); }
  return out;
}
