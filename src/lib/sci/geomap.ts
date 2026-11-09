// Map-style charts for the geophysics tools: a chart drawn with the same scale on both axes (so circles stay round
// and distances read true), and a colour grid (an anomaly map) with a colour bar. Drawn through plot.ts painters.
import type { Figure, Palette } from '../report';
import { drawChart, canvasPainter, OKABE_ITO, type Chart, type Painter } from './plot.ts';

const noop = (P: Painter): Painter => ({ line() {}, poly() {}, circle() {}, text() {}, measure: P.measure, clip() {}, unclip() {} });

/** Data extent of a chart's series. */
function extent(c: Chart) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const s of c.series) s.x.forEach((x, i) => { const y = s.y[i]; if (!Number.isFinite(x) || !Number.isFinite(y)) return; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  return { x0, x1, y0, y1 };
}

/** Draw chart c with one unit on x the same length as one unit on y. Returns drawChart's maps. */
export function drawEqual(P: Painter, c: Chart) {
  const e = extent(c);
  if (!Number.isFinite(e.x0)) return drawChart(P, c);
  const padX = (e.x1 - e.x0) * 0.06 || 1, padY = (e.y1 - e.y0) * 0.06 || 1;
  let xa = e.x0 - padX, xb = e.x1 + padX, ya = e.y0 - padY, yb = e.y1 + padY;
  for (let pass = 0; pass < 3; pass++) {
    const m = drawChart(noop(P), { ...c, xMin: xa, xMax: xb, yMin: ya, yMax: yb });
    const w = m.px1 - m.px0, h = m.py1 - m.py0;
    const sx = (xb - xa) / w, sy = (yb - ya) / h, s = Math.max(sx, sy);
    const cx = (xa + xb) / 2, cy = (ya + yb) / 2;
    xa = cx - (s * w) / 2; xb = cx + (s * w) / 2; ya = cy - (s * h) / 2; yb = cy + (s * h) / 2;
  }
  return drawChart(P, { ...c, xMin: xa, xMax: xb, yMin: ya, yMax: yb });
}

const pageColors = (pal: Palette) => (pal.red ? ['#a30000', '#7a0000', '#c00000', '#5a0000'] : pal.bg === '#ffffff' ? OKABE_ITO : ['#56B4E9', '#E69F00', '#5fd3a8', '#e59ac4', '#f0e442', '#9ecae1', '#ffffff', '#d55e00']);

/** A Figure for an equal-scale chart, recoloured to the page palette. */
export function equalFigure(c: Omit<Chart, 'w' | 'h'> & { w?: number; h?: number }, alt: string): Figure {
  const w = c.w ?? 600, h = c.h ?? 500;
  return { w, h, alt, draw: (ctx, W, H, pal) => { drawEqual(canvasPainter(ctx), { ...c, w: W, h: H, ink: pal.ink, muted: pal.muted, gridColor: pal.grid, bg: null, colors: c.colors ?? pageColors(pal) }); } };
}

/** Diverging blue-white-red colour for t in [−1, 1] (red palette: dark to bright red). */
export function divColor(t: number, red = false): string {
  t = Math.max(-1, Math.min(1, t));
  if (red) { const v = Math.round(40 + 140 * (t + 1) / 2); return `rgb(${v},0,0)`; }
  const a = Math.abs(t);
  const [r, g, b] = t >= 0 ? [255, 255 - 190 * a, 255 - 205 * a] : [255 - 215 * a, 255 - 160 * a, 255];
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

/**
 * A colour map of grid values z[row][col] over x (columns) and y (rows), with equal scale, a colour bar in `unit`,
 * and extra series (points, lines) drawn on top. Colours are symmetric about zero.
 */
export function gridFigure(g: { x: number[]; y: number[]; z: number[][]; unit: string; xLabel: string; yLabel: string; series?: Chart['series'] }, alt: string, w = 600, h = 520): Figure {
  return {
    w, h, alt,
    draw: (ctx, W, H, pal) => {
      const P = canvasPainter(ctx), barH = 46;
      let zmax = 0; for (const r of g.z) for (const v of r) if (Number.isFinite(v)) zmax = Math.max(zmax, Math.abs(v));
      if (!(zmax > 0)) zmax = 1;
      const dx = g.x.length > 1 ? (g.x[1] - g.x[0]) / 2 : 0.5, dy = g.y.length > 1 ? (g.y[1] - g.y[0]) / 2 : 0.5;
      const frame = { name: '', x: [g.x[0] - dx, g.x[g.x.length - 1] + dx], y: [g.y[0] - dy, g.y[g.y.length - 1] + dy], mode: 'points' as const, marker: 'none' as const };
      const base: Chart = { w: W, h: H - barH, xLabel: g.xLabel, yLabel: g.yLabel, series: [frame, ...(g.series ?? [])], legend: 'none', grid: false, ink: pal.ink, muted: pal.muted, gridColor: pal.grid, bg: null, colors: [pal.ink, ...pageColors(pal)] };
      // First pass for the maps, then paint cells under a second, real pass.
      const m = drawEqual(noop(P), base);
      for (let i = 0; i < g.y.length; i++) for (let j = 0; j < g.x.length; j++) {
        const v = g.z[i][j]; if (!Number.isFinite(v)) continue;
        const xa = m.X(g.x[j] - dx), xb = m.X(g.x[j] + dx), ya = m.Y(g.y[i] - dy), yb = m.Y(g.y[i] + dy);
        ctx.fillStyle = divColor(v / zmax, pal.red);
        ctx.fillRect(Math.min(xa, xb), Math.min(ya, yb), Math.abs(xb - xa) + 0.6, Math.abs(yb - ya) + 0.6);
      }
      drawEqual(P, base);
      // Colour bar.
      const bx0 = m.px0, bx1 = m.px1, by = H - barH + 8, n = 60;
      for (let k = 0; k < n; k++) { ctx.fillStyle = divColor(-1 + (2 * (k + 0.5)) / n, pal.red); ctx.fillRect(bx0 + ((bx1 - bx0) * k) / n, by, (bx1 - bx0) / n + 0.6, 12); }
      const lab = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toPrecision(2)).replace('-', '−');
      P.text(bx0, by + 15, lab(-zmax), 12, pal.muted, 'start');
      P.text((bx0 + bx1) / 2, by + 15, `0 ${g.unit}`, 12, pal.muted, 'middle');
      P.text(bx1, by + 15, lab(zmax), 12, pal.muted, 'end');
    },
  };
}
