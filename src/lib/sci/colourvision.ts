// Colour vision deficiency simulation in linear RGB, after Viénot, Brettel and Mollon (1999): convert to cone (LMS)
// responses, replace the missing cone's response by a mix of the other two chosen so that white and one anchor
// colour (blue for protan and deutan, red for tritan) look the same, and convert back. Every matrix is computed
// here from its definition: the sRGB primaries and D65 white (IEC 61966-2-1) give RGB to XYZ, and the
// Hunt-Pointer-Estevez cone matrix (normalised to equal-energy white, as used in colour appearance models) gives
// XYZ to LMS. Anomalous trichromacy is approximated by mixing normal and dichromat vision by severity.
// Plain TypeScript, no DOM.

export type M3 = number[][];
export type Kind = 'protan' | 'deutan' | 'tritan' | 'achromat';

export const mul = (a: M3, b: M3): M3 => a.map((r) => b[0].map((_, j) => r[0] * b[0][j] + r[1] * b[1][j] + r[2] * b[2][j]));
export const apply = (m: M3, v: number[]) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
export function inv(m: M3): M3 {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
  return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
}
export const I3: M3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/** sRGB (0 to 1) to linear light, IEC 61966-2-1. */
export const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
/** Linear light to sRGB (0 to 1). */
export const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** RGB to XYZ from primaries' and white's chromaticities (the standard derivation). */
export function rgbToXyz(prim = [[0.64, 0.33], [0.3, 0.6], [0.15, 0.06]], white = [0.3127, 0.329]): M3 {
  const col = (x: number, y: number) => [x / y, 1, (1 - x - y) / y];
  const P = [0, 1, 2].map((r) => prim.map(([x, y]) => col(x, y)[r]));
  const W = col(white[0], white[1]), S = apply(inv(P), W);
  return P.map((r) => r.map((v, j) => v * S[j]));
}
/** Hunt-Pointer-Estevez XYZ to LMS (equal-energy normalised). */
export const HPE: M3 = [[0.38971, 0.68898, -0.07868], [-0.22981, 1.1834, 0.04641], [0, 0, 1]];
export const RGB2XYZ = rgbToXyz();
export const RGB2LMS = mul(HPE, RGB2XYZ);
export const LMS2RGB = inv(RGB2LMS);

/** The dichromat matrix in linear RGB (Viénot, Brettel and Mollon 1999 single-plane projection). */
export function dichromat(kind: Exclude<Kind, 'achromat'>): M3 {
  const lw = apply(RGB2LMS, [1, 1, 1]), la = apply(RGB2LMS, kind === 'tritan' ? [1, 0, 0] : [0, 0, 1]);
  // Missing cone k = p*a + q*b, where (a, b) are the two remaining cones; solve with white and the anchor.
  const k = kind === 'protan' ? 0 : kind === 'deutan' ? 1 : 2, [i, j] = [0, 1, 2].filter((x) => x !== k);
  const det = lw[i] * la[j] - lw[j] * la[i];
  const p = (lw[k] * la[j] - lw[j] * la[k]) / det, q = (lw[i] * la[k] - lw[k] * la[i]) / det;
  const S = I3.map((r) => [...r]); S[k] = [0, 0, 0]; S[k][i] = p; S[k][j] = q;
  return mul(LMS2RGB, mul(S, RGB2LMS));
}
/** Relative luminance weights of linear sRGB (the Y row of RGB to XYZ). */
export const LUMA = RGB2XYZ[1];
/** The simulation matrix in linear RGB for a kind and a severity from 0 (normal) to 1 (dichromat / no colour). */
export function cvdMatrix(kind: Kind, severity = 1): M3 {
  const s = Math.max(0, Math.min(1, severity));
  const D = kind === 'achromat' ? [LUMA, LUMA, LUMA] : dichromat(kind);
  return D.map((r, a) => r.map((v, b) => s * v + (1 - s) * I3[a][b]));
}
/** The usual name of a kind at a severity. */
export function cvdName(kind: Kind, severity: number): string {
  if (severity <= 0) return 'Normal colour vision';
  if (kind === 'achromat') return severity >= 1 ? 'Achromatopsia (no colour)' : 'Partial colour loss';
  const base = { protan: 'Prot', deutan: 'Deuter', tritan: 'Trit' }[kind];
  return severity >= 1 ? `${base}anopia` : `${base}anomaly`;
}
/** Simulate one sRGB colour (0 to 255 each); returns 0 to 255 values, clipped. */
export function simulate(rgb: number[], m: M3): number[] {
  const lin = rgb.map((c) => toLinear(c / 255)), o = apply(m, lin);
  return o.map((c) => Math.round(toSrgb(Math.max(0, Math.min(1, c))) * 255));
}
/** Simulate RGBA pixel data in place, using lookup tables for speed. */
export function simulatePixels(px: Uint8ClampedArray | Uint8Array, m: M3) {
  const dec = new Float64Array(256); for (let i = 0; i < 256; i++) dec[i] = toLinear(i / 255);
  const N = 4096, enc = new Uint8Array(N + 1); for (let i = 0; i <= N; i++) enc[i] = Math.round(toSrgb(i / N) * 255);
  const [a, b, c] = m;
  for (let o = 0; o < px.length; o += 4) {
    const r = dec[px[o]], g = dec[px[o + 1]], bl = dec[px[o + 2]];
    const R = a[0] * r + a[1] * g + a[2] * bl, G = b[0] * r + b[1] * g + b[2] * bl, B = c[0] * r + c[1] * g + c[2] * bl;
    px[o] = enc[Math.round(Math.max(0, Math.min(1, R)) * N)]; px[o + 1] = enc[Math.round(Math.max(0, Math.min(1, G)) * N)]; px[o + 2] = enc[Math.round(Math.max(0, Math.min(1, B)) * N)];
  }
}
