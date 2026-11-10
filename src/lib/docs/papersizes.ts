// Paper sizes in mm (portrait: width x height). ISO 216 / 269 values are the standard rounded sizes.
export type PaperSize = { id: string; name: string; group: string; w: number; h: number };
const series = (g: string, p: string, dims: number[][]): PaperSize[] => dims.map(([w, h], i) => ({ id: p + i, name: p + i, group: g, w, h }));
export const SIZES: PaperSize[] = [
  ...series('A series', 'A', [[841, 1189], [594, 841], [420, 594], [297, 420], [210, 297], [148, 210], [105, 148], [74, 105], [52, 74], [37, 52], [26, 37]]),
  ...series('B series', 'B', [[1000, 1414], [707, 1000], [500, 707], [353, 500], [250, 353], [176, 250], [125, 176], [88, 125], [62, 88], [44, 62], [31, 44]]),
  ...series('C series (envelopes)', 'C', [[917, 1297], [648, 917], [458, 648], [324, 458], [229, 324], [162, 229], [114, 162], [81, 114], [57, 81], [40, 57], [28, 40]]),
  { id: 'letter', name: 'US Letter', group: 'US and Canada', w: 215.9, h: 279.4 },
  { id: 'legal', name: 'US Legal', group: 'US and Canada', w: 215.9, h: 355.6 },
  { id: 'tabloid', name: 'Tabloid (Ledger)', group: 'US and Canada', w: 279.4, h: 431.8 },
  { id: 'executive', name: 'Executive', group: 'US and Canada', w: 184.15, h: 266.7 },
  { id: 'statement', name: 'Statement (Half letter)', group: 'US and Canada', w: 139.7, h: 215.9 },
  { id: 'junior', name: 'Junior Legal', group: 'US and Canada', w: 127, h: 203.2 },
  { id: 'ansic', name: 'ANSI C', group: 'US and Canada', w: 431.8, h: 558.8 },
  { id: 'ansid', name: 'ANSI D', group: 'US and Canada', w: 558.8, h: 863.6 },
  { id: 'ansie', name: 'ANSI E', group: 'US and Canada', w: 863.6, h: 1117.6 },
  { id: 'p3x5', name: 'Photo 3.5 x 5 in', group: 'Photo prints', w: 88.9, h: 127 },
  { id: 'p4x6', name: 'Photo 4 x 6 in', group: 'Photo prints', w: 101.6, h: 152.4 },
  { id: 'p5x7', name: 'Photo 5 x 7 in', group: 'Photo prints', w: 127, h: 177.8 },
  { id: 'p8x10', name: 'Photo 8 x 10 in', group: 'Photo prints', w: 203.2, h: 254 },
  { id: 'p8x12', name: 'Photo 8 x 12 in', group: 'Photo prints', w: 203.2, h: 304.8 },
  { id: 'p11x14', name: 'Photo 11 x 14 in', group: 'Photo prints', w: 279.4, h: 355.6 },
  { id: 'p16x20', name: 'Photo 16 x 20 in', group: 'Photo prints', w: 406.4, h: 508 },
  { id: 'p20x30', name: 'Photo 20 x 30 in', group: 'Photo prints', w: 508, h: 762 },
  { id: 'pp35', name: 'Passport photo 35 x 45 mm (India, UK, EU)', group: 'Photo prints', w: 35, h: 45 },
  { id: 'ppus', name: 'Passport photo 2 x 2 in (US, India visa)', group: 'Photo prints', w: 50.8, h: 50.8 },
  { id: 'ppca', name: 'Passport photo 50 x 70 mm (Canada)', group: 'Photo prints', w: 50, h: 70 },
];
export const byId = (id: string) => SIZES.find((s) => s.id === id)!;
export type Unit = 'mm' | 'cm' | 'in';
export const inUnit = (mm: number, u: Unit) => (u === 'in' ? mm / 25.4 : u === 'cm' ? mm / 10 : mm);
export const px = (mm: number, dpi: number) => Math.round((mm / 25.4) * dpi);
/** Percent to scale a page of size a so it fits on size b (whole page visible), plus the width-only and height-only ratios. */
export function scaleBetween(a: PaperSize, b: PaperSize) {
  const sw = b.w / a.w, sh = b.h / a.h;
  return { fit: Math.min(sw, sh) * 100, fill: Math.max(sw, sh) * 100, width: sw * 100, height: sh * 100 };
}
