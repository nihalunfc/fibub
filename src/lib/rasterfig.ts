// An image of values (spectrogram, heat map, simulated field) with axes, as a Figure for paint() and the
// report downloads. Values are 0..1 (NaN is left blank). Grey runs from the page background to the ink colour, so
// loud or high is dark on white; "colour" is viridis (colour-blind safe); red night mode always uses dim red.
import type { Figure, Palette } from './report';
import { niceTicks, tickLabel } from './sci/plot';

export type Raster = {
  cols: number; rows: number; v: Float32Array;
  x: [number, number]; y: [number, number]; xLabel?: string; yLabel?: string;
  cmap?: 'grey' | 'colour'; smooth?: boolean; axes?: boolean;
  yTicks?: { at: number; label: string }[];
  bar?: { lo: string; hi: string };
  overlay?: (ctx: CanvasRenderingContext2D, X: (x: number) => number, Y: (y: number) => number, pal: Palette) => void;
};

export function viridis(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t));
  const r = 0.2777273272234177 + t * (0.1050930431085774 + t * (-0.3308618287255563 + t * (-4.634230498983486 + t * (6.228269936347081 + t * (4.776384997670288 + t * -5.435455855934631)))));
  const g = 0.005407344544966578 + t * (1.404613529898575 + t * (0.214847559468213 + t * (-5.799100973351585 + t * (14.17993336680509 + t * (-13.74514537774601 + t * 4.645852612178535)))));
  const b = 0.3340998053353061 + t * (1.384590162594685 + t * (0.09509516302823659 + t * (-19.33244095627987 + t * (56.69055260068105 + t * (-65.35303263337234 + t * 26.3124352495832)))));
  return [r * 255, g * 255, b * 255];
}
const hex = (s: string): [number, number, number] => { const h = s.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]; };

/** Where the image sits inside a w × h figure. */
export function plotBox(w: number, h: number, r: Pick<Raster, 'bar' | 'axes' | 'yTicks'>) {
  if (r.axes === false) return { l: 0, t: 0, r: w, b: h };
  return { l: r.yTicks ? 64 : 58, t: 10, r: w - (r.bar ? 46 : 14), b: h - 44 };
}

export function rasterFigure(r: Raster, w: number, h: number, alt: string): Figure {
  return {
    w, h, alt,
    draw(ctx, W, H, pal) {
      const box = plotBox(W, H, r), pw = box.r - box.l, ph = box.b - box.t;
      const lo = pal.red ? [0, 0, 0] as const : hex(pal.bg), hi = pal.red ? [200, 0, 0] as const : hex(pal.ink);
      const col = (t: number): [number, number, number] => (pal.red || r.cmap !== 'colour' ? [lo[0] + (hi[0] - lo[0]) * t, lo[1] + (hi[1] - lo[1]) * t, lo[2] + (hi[2] - lo[2]) * t] : viridis(t));
      const c = document.createElement('canvas'); c.width = r.cols; c.height = r.rows;
      const cx = c.getContext('2d')!, img = cx.createImageData(r.cols, r.rows);
      for (let i = 0; i < r.v.length; i++) {
        const t = r.v[i]; if (!Number.isFinite(t)) continue;
        const [R, G, B] = col(Math.max(0, Math.min(1, t)));
        img.data[i * 4] = R; img.data[i * 4 + 1] = G; img.data[i * 4 + 2] = B; img.data[i * 4 + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
      ctx.save(); ctx.imageSmoothingEnabled = !!r.smooth; ctx.drawImage(c, box.l, box.t, pw, ph); ctx.restore();
      const X = (x: number) => box.l + ((x - r.x[0]) / (r.x[1] - r.x[0])) * pw, Y = (y: number) => box.b - ((y - r.y[0]) / (r.y[1] - r.y[0])) * ph;
      if (r.overlay) { ctx.save(); ctx.beginPath(); ctx.rect(box.l, box.t, pw, ph); ctx.clip(); r.overlay(ctx, X, Y, pal); ctx.restore(); }
      if (r.axes === false) return;
      ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.strokeRect(box.l + 0.5, box.t + 0.5, pw - 1, ph - 1);
      ctx.fillStyle = pal.muted; ctx.font = '12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
      const xt = niceTicks(r.x[0], r.x[1], Math.max(5, Math.round(pw / 60))).filter((v) => v >= r.x[0] - 1e-9 && v <= r.x[1] + 1e-9), xs = xt.length > 1 ? xt[1] - xt[0] : 1;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const v of xt) { const px = X(v); ctx.fillRect(px, box.b, 1, 4); ctx.fillText(tickLabel(v, xs), px, box.b + 6); }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      if (r.yTicks) for (const t of r.yTicks) { ctx.fillRect(box.l - 4, Y(t.at), 4, 1); ctx.fillText(t.label, box.l - 6, Y(t.at)); }
      else { const yt = niceTicks(r.y[0], r.y[1], Math.max(3, Math.round(ph / 50))).filter((v) => v >= r.y[0] - 1e-9 && v <= r.y[1] + 1e-9), ys = yt.length > 1 ? yt[1] - yt[0] : 1; for (const v of yt) { const py = Y(v); ctx.fillRect(box.l - 4, py, 4, 1); ctx.fillText(tickLabel(v, ys), box.l - 6, py); } }
      ctx.fillStyle = pal.ink; ctx.font = '13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
      if (r.xLabel) { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(r.xLabel, box.l + pw / 2, H - 4); }
      if (r.yLabel) { ctx.save(); ctx.translate(13, box.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(r.yLabel, 0, 0); ctx.restore(); }
      if (r.bar) {
        const bx = box.r + 10, bw = 10;
        for (let i = 0; i < ph; i++) { const [R, G, B] = col(1 - i / (ph - 1)); ctx.fillStyle = `rgb(${R | 0},${G | 0},${B | 0})`; ctx.fillRect(bx, box.t + i, bw, 1.5); }
        ctx.strokeStyle = pal.line; ctx.strokeRect(bx + 0.5, box.t + 0.5, bw - 1, ph - 1);
        ctx.fillStyle = pal.muted; ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.save(); ctx.translate(bx + bw + 12, box.t + ph / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`${r.bar.lo} → ${r.bar.hi}`, 0, 0); ctx.restore();
      }
    },
  };
}
