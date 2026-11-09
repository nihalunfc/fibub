// One chart drawer for every science tool, with three outputs: the canvas on the page, SVG (vector,
// any font) and PDF (vector, via pdf-lib). A chart is drawn through a small "painter", so the layout,
// ticks and legend are identical in all three.
import type { Figure, Palette } from '../report';

export type Anchor = 'start' | 'middle' | 'end';
export type Baseline = 'top' | 'middle' | 'bottom';
export interface Painter {
  line(pts: [number, number][], color: string, width: number, dash?: number[]): void;
  poly(pts: [number, number][], fill: string | null, stroke: string | null, width?: number): void;
  circle(x: number, y: number, r: number, fill: string | null, stroke: string | null, width?: number): void;
  text(x: number, y: number, s: string, size: number, color: string, anchor?: Anchor, baseline?: Baseline, rotate?: number, bold?: boolean): void;
  measure(s: string, size: number, bold?: boolean): number;
  clip(x: number, y: number, w: number, h: number): void;
  unclip(): void;
}

export type Marker = 'circle' | 'square' | 'triangle' | 'diamond' | 'open-circle' | 'open-square' | 'open-triangle' | 'cross' | 'none';
export type Series = {
  name: string; x: number[]; y: number[]; yErr?: (number | undefined)[]; xErr?: (number | undefined)[];
  mode?: 'points' | 'line' | 'both'; color?: string; marker?: Marker; dash?: number[]; width?: number; size?: number;
  /** Optional text drawn just right of each point. */
  labels?: string[];
};
export type Chart = {
  w: number; h: number; title?: string; xLabel?: string; yLabel?: string;
  /** Larger values lower down, as astronomers draw magnitudes. */
  yReverse?: boolean;
  /** Larger values to the left, as infrared spectra are drawn (wavenumber falling to the right). */
  xReverse?: boolean;
  xLog?: boolean; yLog?: boolean; xMin?: number; xMax?: number; yMin?: number; yMax?: number;
  series: Series[]; legend?: 'auto' | 'none' | 'inside' | 'below'; font?: number; grid?: boolean;
  colors?: string[]; ink?: string; muted?: string; gridColor?: string; bg?: string | null;
  /** Extra marks drawn in data space after the series (labels, reference lines). */
  marks?: { kind: 'hline' | 'vline'; at: number; color?: string; dash?: number[]; label?: string }[];
};

/** Okabe and Ito's colour-blind safe palette, in a print-friendly order. */
export const OKABE_ITO = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#000000', '#F0E442'];
export const GREYS = ['#000000', '#555555', '#888888', '#bbbbbb'];
export const MARKERS: Marker[] = ['circle', 'square', 'triangle', 'diamond', 'open-circle', 'open-square', 'open-triangle', 'cross'];

/** About `count` round tick values covering [lo, hi]. */
export function niceTicks(lo: number, hi: number, count = 6): number[] {
  if (!(hi > lo)) { const d = Math.abs(lo) || 1; lo -= d / 2; hi += d / 2; }
  const raw = (hi - lo) / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999)!;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : +v.toPrecision(12));
  return out;
}
/** Expand [lo, hi] outward to round numbers, with a little padding. */
export function niceRange(lo: number, hi: number, log = false): [number, number] {
  if (log) {
    if (!(lo > 0)) lo = hi > 0 ? hi / 100 : 0.1;
    return [10 ** Math.floor(Math.log10(lo) + 1e-9), 10 ** Math.ceil(Math.log10(hi) - 1e-9 || Math.log10(lo) + 1)];
  }
  if (lo === hi) { const d = Math.abs(lo) * 0.1 || 1; return [lo - d, hi + d]; }
  const t = niceTicks(lo, hi, 6), step = t[1] - t[0];
  return [Math.min(t[0], Math.floor(lo / step) * step), Math.max(t[t.length - 1], Math.ceil(hi / step) * step)];
}
export function logTicks(lo: number, hi: number): { major: number[]; minor: number[] } {
  const a = Math.floor(Math.log10(lo) + 1e-9), b = Math.ceil(Math.log10(hi) - 1e-9);
  const major: number[] = [], minor: number[] = [];
  const decades = b - a, every = Math.max(1, Math.ceil(decades / 8));
  for (let e = a; e <= b; e++) {
    const v = 10 ** e;
    if (v >= lo * 0.999 && v <= hi * 1.001 && (e - a) % every === 0) major.push(v);
    if (decades <= 6) for (let m = 2; m <= 9; m++) { const u = m * v; if (u > lo && u < hi) minor.push(u); }
  }
  if (major.length < 2 && decades <= 1) for (const m of [2, 5]) for (let e = a; e <= b; e++) { const u = m * 10 ** e; if (u > lo && u < hi) major.push(u); }
  return { major: major.sort((x, y) => x - y), minor };
}
/** Tick label text: plain numbers, with × 10ⁿ only for very large or small values. */
export function tickLabel(v: number, step: number, log = false): string {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (log) {
    const e = Math.round(Math.log10(a));
    if (Math.abs(a - 10 ** e) / a < 1e-9 && (e > 4 || e < -3)) return `10${superscript(e)}`;
  }
  if (a >= 1e5 || a < 1e-4) { const [m, e] = v.toExponential(2).split('e'); return `${parseFloat(m)}×10${superscript(+e)}`; }
  const dec = log ? Math.max(0, -Math.floor(Math.log10(a) + 1e-9)) : stepDecimals(step);
  return v.toFixed(Math.min(dec, 10)).replace('-', '−');
}
// Decimals the tick step needs, so 2.5 keeps one and 0.25 keeps two.
function stepDecimals(step: number): number {
  for (let d = 0; d <= 10; d++) { const x = step * 10 ** d; if (Math.abs(x - Math.round(x)) < 1e-6 * Math.max(1, x)) return d; }
  return 10;
}
const SUPS: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const superscript = (n: number) => String(n).split('').map((c) => SUPS[c] ?? c).join('');

/** Draw the chart. Returns the plot area and the data-to-pixel maps (for tools that draw more on top). */
export function drawChart(P: Painter, c: Chart) {
  const fs = c.font ?? 13, ink = c.ink ?? '#000', muted = c.muted ?? '#555', gridColor = c.gridColor ?? '#e6e6e6';
  const colors = c.colors ?? OKABE_ITO;
  if (c.bg) P.poly([[0, 0], [c.w, 0], [c.w, c.h], [0, c.h]], c.bg, null);
  const finite = (v: number, log?: boolean) => Number.isFinite(v) && (!log || v > 0);
  // Data extents, including error bars.
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const s of c.series) s.x.forEach((xv, i) => {
    const yv = s.y[i];
    if (!finite(xv, c.xLog) || !finite(yv, c.yLog)) return;
    const ye = s.yErr?.[i] ?? 0, xe = s.xErr?.[i] ?? 0;
    x0 = Math.min(x0, c.xLog ? xv : xv - xe); x1 = Math.max(x1, xv + xe);
    y0 = Math.min(y0, c.yLog && yv - ye <= 0 ? yv : yv - ye); y1 = Math.max(y1, yv + ye);
  });
  for (const m of c.marks ?? []) if (m.kind === 'hline' && finite(m.at, c.yLog)) { y0 = Math.min(y0, m.at); y1 = Math.max(y1, m.at); }
  if (!Number.isFinite(x0)) { x0 = c.xLog ? 1 : 0; x1 = c.xLog ? 10 : 1; y0 = c.yLog ? 1 : 0; y1 = c.yLog ? 10 : 1; }
  let [xa, xb] = niceRange(x0, x1, c.xLog), [ya, yb] = niceRange(y0, y1, c.yLog);
  if (c.xMin != null && finite(c.xMin, c.xLog)) xa = c.xMin; if (c.xMax != null && finite(c.xMax, c.xLog)) xb = c.xMax;
  if (c.yMin != null && finite(c.yMin, c.yLog)) ya = c.yMin; if (c.yMax != null && finite(c.yMax, c.yLog)) yb = c.yMax;
  if (!(xb > xa)) xb = xa + 1; if (!(yb > ya)) yb = ya + 1;

  const xt = c.xLog ? logTicks(xa, xb) : { major: niceTicks(xa, xb, Math.max(3, Math.round(c.w / 110))).filter((v) => v >= xa - 1e-12 && v <= xb + 1e-12), minor: [] };
  const yt = c.yLog ? logTicks(ya, yb) : { major: niceTicks(ya, yb, Math.max(3, Math.round(c.h / 70))).filter((v) => v >= ya - 1e-12 && v <= yb + 1e-12), minor: [] };
  const xstep = xt.major.length > 1 ? xt.major[1] - xt.major[0] : 1, ystep = yt.major.length > 1 ? yt.major[1] - yt.major[0] : 1;
  const yLabels = yt.major.map((v) => tickLabel(v, ystep, c.yLog));
  const xLabels = xt.major.map((v) => tickLabel(v, xstep, c.xLog));

  // Legend placement decides the margins.
  const named = c.series.filter((s) => s.name);
  const legend = c.legend === 'none' || named.length < 2 && c.legend !== 'inside' && c.legend !== 'below' ? 'none' : (c.legend === 'auto' || !c.legend ? (named.length > 4 ? 'below' : 'inside') : c.legend);
  const lfs = fs * 0.92, lineH = lfs * 1.5;
  const left = (c.yLabel ? fs * 1.8 : 0) + Math.max(...yLabels.map((t) => P.measure(t, fs * 0.9)), 10) + 10;
  const top = (c.title ? fs * 2 : fs * 0.8);
  let legendRows = 0, legendCols = 1;
  if (legend === 'below') {
    const wItem = Math.max(...named.map((s) => P.measure(s.name, lfs))) + 34;
    legendCols = Math.max(1, Math.floor((c.w - left - 10) / wItem)); legendRows = Math.ceil(named.length / legendCols);
  }
  const bottom = fs * 1.6 + (c.xLabel ? fs * 1.6 : 0) + (legend === 'below' ? legendRows * lineH + 8 : 0) + 4;
  const right = Math.max(12, P.measure(xLabels[c.xReverse ? 0 : xLabels.length - 1] ?? '', fs * 0.9) / 2 + 4);
  const px0 = left, px1 = c.w - right, py0 = top, py1 = c.h - bottom;
  const lx = (v: number) => (c.xLog ? Math.log10(v) : v), ly = (v: number) => (c.yLog ? Math.log10(v) : v);
  const X = (v: number) => (c.xReverse ? px1 - ((lx(v) - lx(xa)) / (lx(xb) - lx(xa))) * (px1 - px0) : px0 + ((lx(v) - lx(xa)) / (lx(xb) - lx(xa))) * (px1 - px0));
  const Y = (v: number) => (c.yReverse ? py0 + ((ly(v) - ly(ya)) / (ly(yb) - ly(ya))) * (py1 - py0) : py1 - ((ly(v) - ly(ya)) / (ly(yb) - ly(ya))) * (py1 - py0));

  if (c.title) P.text(px0, fs * 0.4, c.title, fs * 1.08, ink, 'start', 'top', 0, true);
  // Grid and ticks.
  if (c.grid !== false) {
    for (const v of yt.major) P.line([[px0, Y(v)], [px1, Y(v)]], gridColor, 1);
    for (const v of xt.major) P.line([[X(v), py0], [X(v), py1]], gridColor, 1);
  }
  P.line([[px0, py0], [px0, py1], [px1, py1]], ink, 1.2);
  yt.major.forEach((v, i) => { P.line([[px0 - 5, Y(v)], [px0, Y(v)]], ink, 1); P.text(px0 - 8, Y(v), yLabels[i], fs * 0.9, ink, 'end', 'middle'); });
  for (const v of yt.minor) P.line([[px0 - 3, Y(v)], [px0, Y(v)]], ink, 0.8);
  xt.major.forEach((v, i) => { P.line([[X(v), py1], [X(v), py1 + 5]], ink, 1); P.text(X(v), py1 + 8, xLabels[i], fs * 0.9, ink, 'middle', 'top'); });
  for (const v of xt.minor) P.line([[X(v), py1], [X(v), py1 + 3]], ink, 0.8);
  if (c.xLabel) P.text((px0 + px1) / 2, py1 + fs * 1.6 + 6, c.xLabel, fs, ink, 'middle', 'top');
  if (c.yLabel) P.text(fs * 0.6, (py0 + py1) / 2, c.yLabel, fs, ink, 'middle', 'top', -90);

  // A little room past the frame, so a marker on the last tick is drawn whole.
  const pad = 7;
  P.clip(px0 - pad, py0 - pad, px1 - px0 + 2 * pad, py1 - py0 + 2 * pad);
  for (const m of c.marks ?? []) {
    const col = m.color ?? muted;
    if (m.kind === 'hline' && finite(m.at, c.yLog)) { P.line([[px0, Y(m.at)], [px1, Y(m.at)]], col, 1, m.dash ?? [5, 4]); if (m.label) P.text(px1 - 4, Y(m.at) - 3, m.label, fs * 0.82, col, 'end', 'bottom'); }
    if (m.kind === 'vline' && finite(m.at, c.xLog)) { P.line([[X(m.at), py0], [X(m.at), py1]], col, 1, m.dash ?? [5, 4]); if (m.label) P.text(X(m.at) + 4, py0 + 4, m.label, fs * 0.82, col, 'start', 'top'); }
  }
  c.series.forEach((s, si) => {
    const col = s.color ?? colors[si % colors.length], mode = s.mode ?? 'points';
    const pts = s.x.map((xv, i) => [xv, s.y[i]] as [number, number]).filter(([a, b]) => finite(a, c.xLog) && finite(b, c.yLog));
    // Error bars first, so markers sit on top.
    s.x.forEach((xv, i) => {
      const yv = s.y[i]; if (!finite(xv, c.xLog) || !finite(yv, c.yLog)) return;
      const ye = s.yErr?.[i], xe = s.xErr?.[i], cap = 3.5;
      if (ye && ye > 0) { const lo = c.yLog ? Math.max(yv - ye, ya) : yv - ye; P.line([[X(xv), Y(lo)], [X(xv), Y(yv + ye)]], col, 1); P.line([[X(xv) - cap, Y(lo)], [X(xv) + cap, Y(lo)]], col, 1); P.line([[X(xv) - cap, Y(yv + ye)], [X(xv) + cap, Y(yv + ye)]], col, 1); }
      if (xe && xe > 0) { const lo = c.xLog ? Math.max(xv - xe, xa) : xv - xe; P.line([[X(lo), Y(yv)], [X(xv + xe), Y(yv)]], col, 1); P.line([[X(lo), Y(yv) - cap], [X(lo), Y(yv) + cap]], col, 1); P.line([[X(xv + xe), Y(yv) - cap], [X(xv + xe), Y(yv) + cap]], col, 1); }
    });
    if (mode !== 'points' && pts.length > 1) P.line(pts.map(([a, b]) => [X(a), Y(b)]), col, s.width ?? 1.8, s.dash);
    if (mode !== 'line') for (const [a, b] of pts) marker(P, X(a), Y(b), s.marker ?? 'circle', s.size ?? 3.6, col);
    if (s.labels) s.x.forEach((xv, i) => { const yv = s.y[i], t = s.labels![i]; if (t && finite(xv, c.xLog) && finite(yv, c.yLog)) P.text(X(xv) + (s.size ?? 3.6) + 3, Y(yv), t, fs * 0.82, muted, 'start', 'middle'); });
  });
  P.unclip();

  if (legend !== 'none' && named.length) {
    const items = named.map((s) => ({ s, col: s.color ?? colors[c.series.indexOf(s) % colors.length] }));
    const sw = (it: (typeof items)[number], x: number, y: number) => {
      const mode = it.s.mode ?? 'points';
      if (mode !== 'points') P.line([[x, y], [x + 22, y]], it.col, it.s.width ?? 1.8, it.s.dash);
      if (mode !== 'line') marker(P, x + 11, y, it.s.marker ?? 'circle', it.s.size ?? 3.6, it.col);
    };
    if (legend === 'below') {
      const colW = (c.w - left) / legendCols;
      items.forEach((it, i) => { const x = left + (i % legendCols) * colW, y = c.h - legendRows * lineH + Math.floor(i / legendCols) * lineH; sw(it, x, y); P.text(x + 28, y, it.s.name, lfs, ink, 'start', 'middle'); });
    } else {
      const wMax = Math.max(...items.map((it) => P.measure(it.s.name, lfs))) + 40, hBox = items.length * lineH + 8;
      // Put the box in the emptiest corner of the plot.
      const corners: [number, number][] = [[px1 - wMax - 6, py0 + 6], [px0 + 6, py0 + 6], [px1 - wMax - 6, py1 - hBox - 6], [px0 + 6, py1 - hBox - 6]];
      const busy = (bx: number, by: number) => c.series.reduce((n, s) => n + s.x.filter((xv, i) => finite(xv, c.xLog) && finite(s.y[i], c.yLog) && X(xv) >= bx && X(xv) <= bx + wMax && Y(s.y[i]) >= by && Y(s.y[i]) <= by + hBox).length, 0);
      const [bx, by] = corners.map((p) => [p, busy(p[0], p[1])] as const).sort((a, b) => a[1] - b[1])[0][0];
      P.poly([[bx, by], [bx + wMax, by], [bx + wMax, by + hBox], [bx, by + hBox]], c.bg ?? '#ffffff', gridColor, 1);
      items.forEach((it, i) => { const y = by + 4 + lineH * (i + 0.5); sw(it, bx + 8, y); P.text(bx + 36, y, it.s.name, lfs, ink, 'start', 'middle'); });
    }
  }
  return { px0, px1, py0, py1, X, Y, xa, xb, ya, yb };
}

function marker(P: Painter, x: number, y: number, m: Marker, r: number, col: string) {
  const open = m.startsWith('open-'), shape = m.replace('open-', '');
  const fill = open ? null : col, stroke = open ? col : null;
  if (shape === 'circle') P.circle(x, y, r, fill, stroke ?? col, 1.2);
  else if (shape === 'square') P.poly([[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]], fill, stroke ?? col, 1.2);
  else if (shape === 'triangle') { const h = r * 1.25; P.poly([[x, y - h], [x + h, y + h * 0.75], [x - h, y + h * 0.75]], fill, stroke ?? col, 1.2); }
  else if (shape === 'diamond') { const h = r * 1.3; P.poly([[x, y - h], [x + h, y], [x, y + h], [x - h, y]], fill, stroke ?? col, 1.2); }
  else if (shape === 'cross') { P.line([[x - r, y - r], [x + r, y + r]], col, 1.5); P.line([[x - r, y + r], [x + r, y - r]], col, 1.5); }
}

// ---------- Painters ----------
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function canvasPainter(ctx: CanvasRenderingContext2D, family = FONT): Painter {
  const font = (size: number, bold?: boolean) => `${bold ? 700 : 400} ${size}px ${family}`;
  return {
    line(pts, color, width, dash) { if (pts.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.setLineDash(dash ?? []); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); },
    poly(pts, fill, stroke, width = 1) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.setLineDash([]); ctx.stroke(); } },
    circle(x, y, r, fill, stroke, width = 1) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.setLineDash([]); ctx.stroke(); } },
    text(x, y, s, size, color, anchor = 'start', baseline = 'top', rotate = 0, bold) {
      ctx.save(); ctx.font = font(size, bold); ctx.fillStyle = color; ctx.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left'; ctx.textBaseline = baseline;
      ctx.translate(x, y); if (rotate) ctx.rotate((rotate * Math.PI) / 180); ctx.fillText(s, 0, 0); ctx.restore();
    },
    measure(s, size, bold) { ctx.save(); ctx.font = font(size, bold); const w = ctx.measureText(s).width; ctx.restore(); return w; },
    clip(x, y, w, h) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); },
    unclip() { ctx.restore(); },
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f2 = (n: number) => +n.toFixed(2);
/** Draws into an SVG document string. Text sizes are measured with a canvas when one is available. */
export function svgPainter(w: number, h: number, family = 'Helvetica, Arial, sans-serif') {
  const parts: string[] = [];
  let clipN = 0;
  const mctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  const P: Painter & { toString(): string } = {
    line(pts, color, width, dash) { if (pts.length < 2) return; parts.push(`<polyline points="${pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"${dash?.length ? ` stroke-dasharray="${dash.join(' ')}"` : ''}/>`); },
    poly(pts, fill, stroke, width = 1) { parts.push(`<polygon points="${pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" fill="${fill ?? 'none'}"${stroke ? ` stroke="${stroke}" stroke-width="${width}"` : ''}/>`); },
    circle(x, y, r, fill, stroke, width = 1) { parts.push(`<circle cx="${f2(x)}" cy="${f2(y)}" r="${r}" fill="${fill ?? 'none'}"${stroke ? ` stroke="${stroke}" stroke-width="${width}"` : ''}/>`); },
    text(x, y, s, size, color, anchor = 'start', baseline = 'top', rotate = 0, bold) {
      const db = baseline === 'top' ? '0.8em' : baseline === 'middle' ? '0.35em' : '0';
      parts.push(`<text x="${f2(x)}" y="${f2(y)}" dy="${db}" font-size="${size}" fill="${color}" text-anchor="${anchor}"${bold ? ' font-weight="700"' : ''}${rotate ? ` transform="rotate(${rotate} ${f2(x)} ${f2(y)})"` : ''}>${esc(s)}</text>`);
    },
    measure(s, size, bold) { if (mctx) { mctx.font = `${bold ? 700 : 400} ${size}px ${family}`; return mctx.measureText(s).width; } return s.length * size * 0.55; },
    clip(x, y, cw, ch) { clipN++; parts.push(`<clipPath id="c${clipN}"><rect x="${f2(x)}" y="${f2(y)}" width="${f2(cw)}" height="${f2(ch)}"/></clipPath><g clip-path="url(#c${clipN})">`); },
    unclip() { parts.push('</g>'); },
    toString() { return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${family}">\n${parts.join('\n')}\n</svg>\n`; },
  };
  return P;
}

/** A Figure (the shape report.ts and paint() use) for a chart, recoloured to the page palette. */
export function chartFigure(c: Omit<Chart, 'w' | 'h'> & { w?: number; h?: number }, alt: string): Figure {
  const w = c.w ?? 720, h = c.h ?? 420;
  return {
    w, h, alt,
    draw: (ctx, W, H, pal: Palette) => {
      drawChart(canvasPainter(ctx), { ...c, w: W, h: H, ink: pal.ink, muted: pal.muted, gridColor: pal.grid, bg: null, colors: c.colors ?? (pal.red ? ['#a30000', '#7a0000', '#c00000', '#5a0000'] : pal.bg === '#ffffff' ? OKABE_ITO : ['#56B4E9', '#E69F00', '#5fd3a8', '#e59ac4', '#f0e442', '#9ecae1', '#ffffff', '#d55e00']) });
    },
  };
}

/**
 * The chart as a vector PDF page of w × h points (1/72 inch). Uses the built-in Helvetica, which
 * covers Western European text plus µ, ±, ², ³ and °; other symbols are replaced and listed in `lost`
 * (the SVG download keeps every character). With `scale`, the page is c.w × c.h chart units of
 * `scale` points each.
 */
export async function chartPdf(c: Chart, scale = 1): Promise<{ bytes: Uint8Array; lost: string[] }> {
  const lib = await import('pdf-lib');
  const { PDFDocument, StandardFonts, rgb, degrees, pushGraphicsState, popGraphicsState, rectangle, clip, endPath, concatTransformationMatrix } = lib;
  const doc = await PDFDocument.create();
  const page = doc.addPage([c.w * scale, c.h * scale]);
  // `scale` points per chart unit: everything below is drawn in chart units.
  if (scale !== 1) page.pushOperators(concatTransformationMatrix(scale, 0, 0, scale, 0, 0));
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const lost = new Set<string>();
  const MAP: Record<string, string> = { '−': '-', '–': '-', '—': '-', '⁻': '-', '⁰': '0', '¹': '1', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '·': '·', '×': '×', 'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'Δ': 'D', 'λ': 'l', 'σ': 's', 'θ': 'th', 'Ω': 'Ohm', 'π': 'pi' };
  const safe = (s: string) => [...s].map((ch) => { try { font.encodeText(ch); return ch; } catch { lost.add(ch); return MAP[ch] ?? '?'; } }).join('');
  const col = (hex: string) => { const h = hex.replace('#', ''); const v = h.length === 3 ? h.split('').map((x) => x + x).join('') : h; return rgb(parseInt(v.slice(0, 2), 16) / 255, parseInt(v.slice(2, 4), 16) / 255, parseInt(v.slice(4, 6), 16) / 255); };
  const path = (pts: [number, number][], close: boolean) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)} ${f2(y)}`).join(' ') + (close ? ' Z' : '');
  const P: Painter = {
    line(pts, color, width, dash) { if (pts.length < 2) return; page.drawSvgPath(path(pts, false), { x: 0, y: c.h, borderColor: col(color), borderWidth: width, borderDashArray: dash?.length ? dash : undefined, borderLineCap: 1 as any }); },
    poly(pts, fill, stroke, width = 1) { page.drawSvgPath(path(pts, true), { x: 0, y: c.h, color: fill ? col(fill) : undefined, borderColor: stroke ? col(stroke) : undefined, borderWidth: stroke ? width : 0 }); },
    circle(x, y, r, fill, stroke, width = 1) { page.drawCircle({ x, y: c.h - y, size: r, color: fill ? col(fill) : undefined, borderColor: stroke ? col(stroke) : undefined, borderWidth: stroke ? width : 0 }); },
    text(x, y, s, size, color, anchor = 'start', baseline = 'top', rotate = 0, b) {
      const f = b ? bold : font, t = safe(s), w = f.widthOfTextAtSize(t, size);
      const dx = anchor === 'middle' ? -w / 2 : anchor === 'end' ? -w : 0;
      const dy = baseline === 'top' ? -size * 0.78 : baseline === 'middle' ? -size * 0.35 : 0;
      const a = (-rotate * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
      // Offsets are in the text's own (rotated) frame; PDF y runs upward.
      const ox = dx * cos - dy * sin, oy = dx * sin + dy * cos;
      page.drawText(t, { x: x + ox, y: c.h - y + oy, size, font: f, color: col(color), rotate: degrees(-rotate) });
    },
    measure(s, size, b) { return (b ? bold : font).widthOfTextAtSize(safe(s), size); },
    clip(x, y, w, h) { page.pushOperators(pushGraphicsState(), rectangle(x, c.h - y - h, w, h), clip(), endPath()); },
    unclip() { page.pushOperators(popGraphicsState()); },
  };
  drawChart(P, c);
  return { bytes: await doc.save(), lost: [...lost] };
}

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b: Uint8Array) { let c = 0xffffffff; for (const v of b) c = CRC[(c ^ v) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
/** A PNG with its resolution recorded (a pHYs chunk), so Word and journals place it at the right size. */
export function pngWithDpi(png: Uint8Array, dpi: number): Uint8Array {
  if (png.length < 33 || png[12] !== 0x49 || png[13] !== 0x48) return png; // not IHDR first: leave as is
  const ppm = Math.round(dpi / 0.0254), chunk = new Uint8Array(21), dv = new DataView(chunk.buffer);
  dv.setUint32(0, 9); chunk.set([0x70, 0x48, 0x59, 0x73], 4); dv.setUint32(8, ppm); dv.setUint32(12, ppm); chunk[16] = 1;
  dv.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(png.length + 21);
  out.set(png.subarray(0, 33)); out.set(chunk, 33); out.set(png.subarray(33), 54);
  return out;
}
