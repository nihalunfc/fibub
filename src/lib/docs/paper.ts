// Printable paper: lined, graph, dot grid, isometric, hex and music staff. Drawn once into a "sink" (mm, y down),
// so the page preview (canvas) and the PDF come from the same code.
import { PDFDocument, rgb } from 'pdf-lib';

export type PaperType = 'lined' | 'graph' | 'dots' | 'iso' | 'hex' | 'staff';
export const TYPES: { id: PaperType; name: string; spacing: number; hint: string }[] = [
  { id: 'lined', name: 'Lined', spacing: 7.1, hint: 'Gap between lines. 8.7 wide, 7.1 college, 6.4 narrow.' },
  { id: 'graph', name: 'Graph', spacing: 5, hint: 'Square size. Every Nth line is darker.' },
  { id: 'dots', name: 'Dot grid', spacing: 5, hint: 'Gap between dots.' },
  { id: 'iso', name: 'Isometric', spacing: 5, hint: 'Gap between lines along each direction.' },
  { id: 'hex', name: 'Hexagon', spacing: 6, hint: 'Length of one side of a hexagon.' },
  { id: 'staff', name: 'Music staff', spacing: 1.8, hint: 'Gap between the 5 lines of a staff.' },
];
export type Sink = { line(x1: number, y1: number, x2: number, y2: number, w: number, dark?: boolean): void; dot(x: number, y: number, r: number): void };
export type PaperOpts = { w: number; h: number; margin: number; spacing: number; major: number; weight: number };
export const SIZES = { a4: [210, 297], letter: [215.9, 279.4], a5: [148, 210] } as const;
export const toMm = (v: number, unit: 'mm' | 'in') => (unit === 'in' ? v * 25.4 : v);

function clip(x1: number, y1: number, x2: number, y2: number, r: [number, number, number, number]): [number, number, number, number] | null {
  const [xa, ya, xb, yb] = r; let t0 = 0, t1 = 1; const dx = x2 - x1, dy = y2 - y1;
  for (const [p, q] of [[-dx, x1 - xa], [dx, xb - x1], [-dy, y1 - ya], [dy, yb - y1]] as const) {
    if (p === 0) { if (q < 0) return null; continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
}

export function drawPaper(type: PaperType, o: PaperOpts, sink: Sink) {
  const x0 = o.margin, y0 = o.margin, x1 = o.w - o.margin, y1 = o.h - o.margin, s = Math.max(0.5, o.spacing), wt = o.weight;
  const R: [number, number, number, number] = [x0, y0, x1, y1];
  const L = (a: number, b: number, c: number, d: number, w = wt, dark = false) => { const k = clip(a, b, c, d, R); if (k) sink.line(k[0], k[1], k[2], k[3], w, dark); };
  if (type === 'lined') {
    for (let y = y0 + s; y <= y1 + 1e-6; y += s) L(x0, y, x1, y);
  } else if (type === 'graph') {
    const m = Math.max(1, Math.round(o.major));
    for (let i = 0, x = x0; x <= x1 + 1e-6; i++, x = x0 + i * s) L(x, y0, x, y1, i % m === 0 ? wt * 1.8 : wt, i % m === 0);
    for (let i = 0, y = y0; y <= y1 + 1e-6; i++, y = y0 + i * s) L(x0, y, x1, y, i % m === 0 ? wt * 1.8 : wt, i % m === 0);
  } else if (type === 'dots') {
    for (let x = x0; x <= x1 + 1e-6; x += s) for (let y = y0; y <= y1 + 1e-6; y += s) sink.dot(x, y, Math.max(0.15, wt * 0.9));
  } else if (type === 'iso') {
    const h = s * Math.cos(Math.PI / 6), tn = Math.tan(Math.PI / 6), n = Math.ceil((x1 - x0) / h) + 1;
    for (let i = 0; i <= n; i++) L(x0 + i * h, y0, x0 + i * h, y1);
    const span = (x1 - x0) * tn, k0 = -Math.ceil(span / s) - 1, k1 = Math.ceil((y1 - y0) / s) + 1;
    for (let k = k0; k <= k1; k++) { L(x0, y0 + k * s, x1, y0 + k * s + (x1 - x0) * tn); L(x0, y0 + k * s + (x1 - x0) * tn, x1, y0 + k * s); }
  } else if (type === 'hex') {
    const hw = s * Math.sqrt(3), row = s * 1.5;
    for (let r = -1, y = y0; y - s <= y1; r++, y = y0 + r * row) for (let x = x0 - (r & 1 ? hw : hw / 2); x - hw / 2 <= x1; x += hw) {
      const cx = x, cy = y, pts: [number, number][] = [];
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; pts.push([cx + s * Math.cos(a), cy + s * Math.sin(a)]); }
      for (let k = 0; k < 6; k++) { const a = pts[k], b = pts[(k + 1) % 6]; L(a[0], a[1], b[0], b[1]); }
    }
  } else {
    const staffH = 4 * s, gap = Math.max(9 * s, 12);
    for (let y = y0 + 4; y + staffH <= y1; y += staffH + gap) for (let k = 0; k < 5; k++) L(x0, y + k * s, x1, y + k * s);
  }
}
/** How many staves, lines etc. a page holds is not needed by callers; this counts drawn marks for tests. */
export function countMarks(type: PaperType, o: PaperOpts) {
  let lines = 0, dots = 0; drawPaper(type, o, { line: () => { lines++; }, dot: () => { dots++; } }); return { lines, dots };
}

export type Tone = 'grey' | 'blue' | 'black';
const TONES: Record<Tone, [[number, number, number], [number, number, number]]> = {
  grey: [[0.78, 0.78, 0.78], [0.6, 0.6, 0.6]], blue: [[0.7, 0.8, 0.92], [0.5, 0.65, 0.85]], black: [[0.2, 0.2, 0.2], [0, 0, 0]],
};
export const toneCss = (t: Tone, dark: boolean) => `rgb(${TONES[t][dark ? 1 : 0].map((v) => Math.round(v * 255)).join(',')})`;

export async function paperPdf(types: PaperType[], pagesEach: number, o: PaperOpts, tone: Tone, spacings: Partial<Record<PaperType, number>>) {
  const doc = await PDFDocument.create(); const k = 72 / 25.4;
  for (const t of types) for (let n = 0; n < Math.max(1, pagesEach); n++) {
    const page = doc.addPage([o.w * k, o.h * k]);
    drawPaper(t, { ...o, spacing: spacings[t] ?? TYPES.find((x) => x.id === t)!.spacing }, {
      line: (a, b, c, d, w, dark) => page.drawLine({ start: { x: a * k, y: (o.h - b) * k }, end: { x: c * k, y: (o.h - d) * k }, thickness: w * k, color: rgb(...TONES[tone][dark ? 1 : 0]) }),
      dot: (x, y, r) => page.drawCircle({ x: x * k, y: (o.h - y) * k, size: r * k, color: rgb(...TONES[tone][1]) }),
    });
  }
  return { bytes: await doc.save(), pages: types.length * Math.max(1, pagesEach) };
}
