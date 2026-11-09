// Colour difference: sRGB / XYZ / CIELAB / LCh conversions and the CIE colour difference formulas ΔE*ab (1976),
// ΔE94 and CIEDE2000, for fading surveys of museum objects and any colour measurement. Plain maths, no DOM.

export type V3 = [number, number, number];
export type White = 'D65' | 'D50';
/** CIE 1931 2° chromaticities of the two usual reference whites. */
export const WHITE_XY: Record<White, [number, number]> = { D65: [0.3127, 0.329], D50: [0.3457, 0.3585] };
/** The reference white as XYZ with Y = 100. */
export const whiteXYZ = (w: White): V3 => { const [x, y] = WHITE_XY[w]; return [(100 * x) / y, 100, (100 * (1 - x - y)) / y]; };

const mul = (m: number[][], v: V3): V3 => [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2], m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2], m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
function inv3(m: number[][]): number[][] {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
  return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
}
const mm = (p: number[][], q: number[][]) => p.map((r) => [0, 1, 2].map((j) => r[0] * q[0][j] + r[1] * q[1][j] + r[2] * q[2][j]));

// sRGB to XYZ as printed in IEC 61966-2-1 (D65 white).
const SRGB_M = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]];
const SRGB_INV = inv3(SRGB_M);
// Bradford chromatic adaptation.
const BRAD = [[0.8951, 0.2664, -0.1614], [-0.7502, 1.7135, 0.0367], [0.0389, -0.0685, 1.0296]], BRAD_INV = inv3(BRAD);
function adaptM(from: White, to: White): number[][] {
  const s = mul(BRAD, whiteXYZ(from)), d = mul(BRAD, whiteXYZ(to));
  return mm(BRAD_INV, mm([[d[0] / s[0], 0, 0], [0, d[1] / s[1], 0], [0, 0, d[2] / s[2]]], BRAD));
}
/** XYZ (Y = 100 for white) seen under one white, adapted to another with the Bradford transform. */
export const adapt = (xyz: V3, from: White, to: White): V3 => (from === to ? [...xyz] as V3 : mul(adaptM(from, to), xyz));

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
/** sRGB 0–255 to XYZ (Y = 100), relative to D65. */
export const srgbToXyz = (rgb: V3): V3 => mul(SRGB_M, rgb.map((c) => lin(c / 255)) as V3).map((v) => v * 100) as V3;
/** XYZ (Y = 100, D65) to sRGB 0–255, unclipped. */
export const xyzToSrgb = (xyz: V3): V3 => mul(SRGB_INV, xyz.map((v) => v / 100) as V3).map((c) => 255 * gam(c)) as V3;

const EPS = 216 / 24389, KAPPA = 24389 / 27;
export function xyzToLab(xyz: V3, w: White = 'D65'): V3 {
  const W = whiteXYZ(w), f = (t: number) => (t > EPS ? Math.cbrt(t) : (KAPPA * t + 16) / 116);
  const [fx, fy, fz] = xyz.map((v, i) => f(v / W[i]));
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
export function labToXyz(lab: V3, w: White = 'D65'): V3 {
  const W = whiteXYZ(w), fy = (lab[0] + 16) / 116, fx = fy + lab[1] / 500, fz = fy - lab[2] / 200;
  const fi = (t: number) => (t ** 3 > EPS ? t ** 3 : (116 * t - 16) / KAPPA);
  const yr = lab[0] > KAPPA * EPS ? fy ** 3 : lab[0] / KAPPA;
  return [fi(fx) * W[0], yr * W[1], fi(fz) * W[2]];
}
/** L*, C*ab, hab in degrees 0–360. */
export function labToLch(lab: V3): V3 { const h = (Math.atan2(lab[2], lab[1]) * 180) / Math.PI; return [lab[0], Math.hypot(lab[1], lab[2]), h < 0 ? h + 360 : h]; }
export function lchToLab(lch: V3): V3 { const r = (lch[2] * Math.PI) / 180; return [lch[0], lch[1] * Math.cos(r), lch[1] * Math.sin(r)]; }

export type Space = 'lab' | 'lch' | 'xyz' | 'srgb';
/** Any input to CIELAB under the chosen white. sRGB is D65 by definition and is adapted (Bradford) to D50 if asked. */
export function toLab(v: V3, space: Space, w: White = 'D65'): V3 {
  if (space === 'lab') return [...v] as V3;
  if (space === 'lch') return lchToLab(v);
  if (space === 'xyz') return xyzToLab(v, w);
  return xyzToLab(adapt(srgbToXyz(v), 'D65', w), w);
}
/** CIELAB to an sRGB swatch colour (clipped) and whether it was inside the sRGB gamut. */
export function labToSrgb(lab: V3, w: White = 'D65'): { rgb: V3; inGamut: boolean; hex: string } {
  const raw = xyzToSrgb(adapt(labToXyz(lab, w), w, 'D65'));
  const inGamut = raw.every((c) => c >= -0.5 && c <= 255.5);
  const rgb = raw.map((c) => Math.min(255, Math.max(0, Math.round(c)))) as V3;
  return { rgb, inGamut, hex: '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('') };
}
/** "#a1b2c3", "a1b2c3" or "#abc" to 0–255, or null. */
export function parseHex(s: string): V3 | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s.trim()); if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as V3;
}

const D = Math.PI / 180;
/** ΔE*ab (CIE 1976): straight-line distance in CIELAB. */
export const dE76 = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export type Weights94 = 'graphic' | 'textiles';
/** ΔE94 (CIE 1994). The first colour is the reference (its chroma sets the weights), so it is not symmetric. */
export function dE94(ref: V3, s: V3, app: Weights94 = 'graphic'): number {
  const [kL, K1, K2] = app === 'textiles' ? [2, 0.048, 0.014] : [1, 0.045, 0.015];
  const C1 = Math.hypot(ref[1], ref[2]), C2 = Math.hypot(s[1], s[2]);
  const dL = ref[0] - s[0], dC = C1 - C2, da = ref[1] - s[1], db = ref[2] - s[2];
  const dH2 = Math.max(0, da * da + db * db - dC * dC);
  return Math.sqrt((dL / kL) ** 2 + (dC / (1 + K1 * C1)) ** 2 + dH2 / (1 + K2 * C1) ** 2);
}

/** CIEDE2000 with parametric factors kL, kC, kH (all 1 for reference conditions). Sharma, Wu and Dalal (2005). */
export function dE00(c1: V3, c2: V3, kL = 1, kC = 1, kH = 1): number {
  const [L1, a1, b1] = c1, [L2, a2, b2] = c2;
  const Cab = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2, G = 0.5 * (1 - Math.sqrt(Cab ** 7 / (Cab ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2, Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
  const hp = (b: number, a: number) => { if (b === 0 && a === 0) return 0; const h = Math.atan2(b, a) / D; return h < 0 ? h + 360 : h; };
  const h1 = hp(b1, ap1), h2 = hp(b2, ap2);
  const dL = L2 - L1, dC = Cp2 - Cp1;
  let dh = 0;
  if (Cp1 * Cp2 !== 0) { dh = h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dh / 2) * D);
  const Lm = (L1 + L2) / 2, Cm = (Cp1 + Cp2) / 2;
  let hm = h1 + h2;
  if (Cp1 * Cp2 !== 0) { if (Math.abs(h1 - h2) > 180) hm = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2; else hm = (h1 + h2) / 2; }
  const T = 1 - 0.17 * Math.cos((hm - 30) * D) + 0.24 * Math.cos(2 * hm * D) + 0.32 * Math.cos((3 * hm + 6) * D) - 0.2 * Math.cos((4 * hm - 63) * D);
  const dTh = 30 * Math.exp(-(((hm - 275) / 25) ** 2)), RC = 2 * Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7));
  const SL = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2), SC = 1 + 0.045 * Cm, SH = 1 + 0.015 * Cm * T;
  const RT = -Math.sin(2 * dTh * D) * RC;
  const l = dL / (kL * SL), c = dC / (kC * SC), h = dH / (kH * SH);
  return Math.sqrt(l * l + c * c + h * h + RT * c * h);
}

export type Diff = { dL: number; da: number; db: number; dC: number; dH: number; dh: number; e76: number; e94: number; e00: number };
/** Every difference from the reference (before) to the sample (after). Signs: after − before. */
export function compare(before: V3, after: V3, o: { kL?: number; kC?: number; kH?: number; app?: Weights94 } = {}): Diff {
  const [L1, C1, h1] = labToLch(before), [L2, C2, h2] = labToLch(after);
  const da = after[1] - before[1], db = after[2] - before[2], dC = C2 - C1;
  let dh = h2 - h1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = Math.sign(dh) * Math.sqrt(Math.max(0, da * da + db * db - dC * dC));
  return { dL: L2 - L1, da, db, dC, dH, dh: C1 && C2 ? dh : 0, e76: dE76(before, after), e94: dE94(before, after, o.app), e00: dE00(before, after, o.kL, o.kC, o.kH) };
}

/** What the change looks like, in words: lighter or darker, more or less saturated, and which way the hue turned. */
export function describe(d: Diff, before?: V3): string {
  const parts: string[] = [];
  if (Math.abs(d.dL) >= 0.5) parts.push(d.dL > 0 ? 'lighter' : 'darker');
  if (Math.abs(d.dC) >= 0.5) parts.push(d.dC > 0 ? 'more saturated' : 'less saturated');
  if (Math.abs(d.dH) >= 0.5 && before) {
    const h = labToLch(before)[2], names = ['red', 'yellow', 'green', 'blue'];
    // The hue angle turns from red (0°) through yellow (90°), green (180°) and blue (270°): name the next one it moves towards.
    const k = d.dH > 0 ? Math.floor(h / 90 + 1e-9) + 1 : Math.ceil(h / 90 - 1e-9) - 1;
    parts.push(`hue towards ${names[((k % 4) + 4) % 4]}`);
  }
  return parts.length ? parts.join(', ') : 'about the same';
}

export type SurveyRow = { label: string; before: V3; after: V3; d: Diff };
/**
 * A fading survey pasted as rows: a label, three before values, three after values (or two hex codes for sRGB).
 * A header row and blank lines are skipped. Returns rows and plain messages for lines that could not be read.
 */
export function parseSurvey(text: string, space: Space, w: White, o: Parameters<typeof compare>[2] = {}): { rows: SurveyRow[]; bad: string[] } {
  const rows: SurveyRow[] = [], bad: string[] = [];
  const lines = text.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim()).filter((l) => l && !/^#(?![0-9a-f]{6}\b|[0-9a-f]{3}\b)/i.test(l));
  const sep = lines.some((l) => l.includes('\t')) ? /\t/ : lines.some((l) => l.includes(';')) ? /;/ : lines.some((l) => l.includes(',')) ? /,/ : /\s+/;
  lines.forEach((line, i) => {
    const cells = line.split(sep).map((c) => c.trim().replace(/^"(.*)"$/, '$1'));
    const isNum = (c: string) => c !== '' && Number.isFinite(Number(c.replace(/[−–]/g, '-').replace(',', '.')));
    let vals: number[] = [], label = '';
    const hexes = space === 'srgb' ? cells.filter((c) => c.startsWith('#')).map(parseHex).filter((x): x is V3 => !!x) : [];
    if (hexes.length === 2) { label = cells.find((c) => c && !c.startsWith('#')) ?? `Row ${rows.length + 1}`; vals = [...hexes[0], ...hexes[1]]; }
    else {
      label = isNum(cells[0]) ? `Row ${rows.length + 1}` : cells[0];
      vals = cells.slice(isNum(cells[0]) ? 0 : 1).filter((c) => c !== '').map((c) => (isNum(c) ? Number(c.replace(/[−–]/g, '-').replace(',', '.')) : NaN));
    }
    if (vals.length !== 6 || vals.some((v) => !Number.isFinite(v))) {
      if (!(i === 0 && !cells.slice(1).some(isNum))) bad.push(`Line ${i + 1} ("${line.slice(0, 40)}") needs a label and six numbers: three before and three after${space === 'srgb' ? ' (or two hex codes)' : ''}.`);
      return;
    }
    const before = toLab(vals.slice(0, 3) as V3, space, w), after = toLab(vals.slice(3, 6) as V3, space, w);
    rows.push({ label, before, after, d: compare(before, after, o) });
  });
  return { rows, bad };
}

/** A made-up fading survey of six textile samples (L*, a*, b* before and after a display period), D65. */
export const EXAMPLE_SURVEY = `Sample\tL1\ta1\tb1\tL2\ta2\tb2
Red silk band\t42.1\t48.3\t22.6\t44.0\t44.9\t21.8
Blue wool ground\t35.4\t2.1\t-28.7\t36.2\t1.6\t-26.1
Yellow silk thread\t78.5\t6.2\t62.4\t79.4\t4.8\t55.0
Green wool leaf\t48.9\t-22.4\t18.3\t50.6\t-17.9\t20.2
Undyed linen\t82.0\t1.4\t9.8\t81.3\t1.9\t11.6
Black wool outline\t21.3\t0.6\t-1.2\t21.6\t0.7\t-0.9`;
