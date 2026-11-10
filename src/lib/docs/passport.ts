// Passport photo helpers: country sizes, print-sheet layout and background whitening. Sizes were read from official pages on 2026-11-10.
export interface Spec { id: string; name: string; wmm: number; hmm: number; headMin: number; headMax: number; note: string }
export const SPECS: Spec[] = [
  { id: 'ca', name: 'Canada passport (50 x 70 mm)', wmm: 50, hmm: 70, headMin: 31, headMax: 36, note: 'Face height from chin to crown 31 to 36 mm.' },
  { id: 'us', name: 'United States passport (2 x 2 in)', wmm: 50.8, hmm: 50.8, headMin: 25, headMax: 35, note: 'Head 1 to 1 3/8 in (25 to 35 mm) from chin to top of head.' },
  { id: 'uk', name: 'United Kingdom passport (35 x 45 mm)', wmm: 35, hmm: 45, headMin: 29, headMax: 34, note: 'Head 29 to 34 mm from chin to crown.' },
  { id: 'in', name: 'India passport (2 x 2 in, 51 x 51 mm)', wmm: 50.8, hmm: 50.8, headMin: 35, headMax: 40, note: 'Head 35 to 40 mm (1.4 to 1.6 in) from top of hair to chin.' },
];
export const DPI = 300;
export const mmToPx = (mm: number) => Math.round(mm / 25.4 * DPI);
export const SHEETS: Record<string, { name: string; w: number; h: number }> = {
  '4x6': { name: '4 x 6 in', w: 1200, h: 1800 },
  '10x15': { name: '10 x 15 cm', w: mmToPx(100), h: mmToPx(150) },
};

/** How many tiles fit on the sheet, in the better of portrait or landscape. */
export function layout(sw: number, sh: number, w: number, h: number) {
  const fit = (W: number, H: number) => ({ W, H, cols: Math.floor(W / w), rows: Math.floor(H / h) });
  const a = fit(sw, sh), b = fit(sh, sw), best = a.cols * a.rows >= b.cols * b.rows ? a : b;
  return { ...best, count: best.cols * best.rows };
}

/** Turn pixels close to the colour of the photo's top corners into white, with a soft edge. */
export function whitenBackground(img: ImageData): void {
  const { width: w, height: h, data: d } = img, n = Math.max(2, Math.round(Math.min(w, h) * 0.04));
  let r = 0, g = 0, b = 0, c = 0;
  for (const x0 of [0, w - n]) for (let y = 0; y < n; y++) for (let x = x0; x < x0 + n; x++) { const o = (y * w + x) * 4; r += d[o]; g += d[o + 1]; b += d[o + 2]; c++; }
  r /= c; g /= c; b /= c;
  for (let o = 0; o < d.length; o += 4) {
    const dist = Math.hypot(d[o] - r, d[o + 1] - g, d[o + 2] - b), t = dist <= 35 ? 1 : dist >= 75 ? 0 : (75 - dist) / 40;
    if (t > 0) for (let k = 0; k < 3; k++) d[o + k] = d[o + k] * (1 - t) + 255 * t;
  }
}
