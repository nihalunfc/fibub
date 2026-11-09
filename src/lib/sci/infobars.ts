// A simple bar chart Figure (for report.ts and paint()) used by the information theory tools: symbol
// frequencies, probabilities and letter counts. Labels under the bars are thinned when they would overlap.
import type { Figure, Palette } from '../report.ts';

export type Bars = {
  labels: string[]; values: number[]; /** Optional second series drawn as thin bars beside the first. */ values2?: number[];
  names?: [string, string]; yLabel?: string; /** Label every n-th bar only. */ tickEvery?: number; w?: number; h?: number; percent?: boolean;
};

export function barsFigure(b: Bars, alt: string): Figure {
  const w = b.w ?? 720, h = b.h ?? 300;
  return {
    w, h, alt,
    draw: (ctx, W, H, pal: Palette) => {
      const fs = 12, font = (s: number, bold = false) => `${bold ? 700 : 400} ${s}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
      const n = b.labels.length, both = !!b.values2;
      const top0 = Math.max(...b.values, ...(b.values2 ?? []), 0);
      const step = top0 > 0 ? niceStep(top0 / 4) : 1, top = Math.max(step, Math.ceil(top0 / step - 1e-9) * step);
      const fmt = (v: number) => (b.percent ? `${+(v * 100).toPrecision(3)} %` : `${+v.toPrecision(4)}`);
      ctx.font = font(fs);
      const ticks: number[] = []; for (let v = 0; v <= top + step * 1e-9; v += step) ticks.push(+v.toPrecision(10));
      const left = Math.max(...ticks.map((t) => ctx.measureText(fmt(t)).width)) + (b.yLabel ? 26 : 10);
      const legendH = both && b.names ? 22 : 0, right = 8, topM = 10 + legendH, bottom = 34;
      const pw = W - left - right, ph = H - topM - bottom;
      const Y = (v: number) => topM + ph - (v / top) * ph;
      ctx.strokeStyle = pal.grid; ctx.lineWidth = 1; ctx.fillStyle = pal.muted; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (const t of ticks) { ctx.beginPath(); ctx.moveTo(left, Y(t) + 0.5); ctx.lineTo(W - right, Y(t) + 0.5); ctx.stroke(); ctx.fillText(fmt(t), left - 6, Y(t)); }
      if (b.yLabel) { ctx.save(); ctx.translate(11, topM + ph / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(b.yLabel, 0, 0); ctx.restore(); }
      const slot = pw / Math.max(1, n), bw = Math.max(1, slot * (both ? 0.4 : 0.75));
      const c1 = pal.red ? pal.ink : pal.accent, c2 = pal.red ? pal.muted : pal.accent2;
      for (let i = 0; i < n; i++) {
        const x = left + slot * i + (slot - bw * (both ? 2 : 1)) / 2;
        ctx.fillStyle = c1; ctx.fillRect(x, Y(b.values[i]), bw, Y(0) - Y(b.values[i]));
        if (both) { ctx.fillStyle = c2; ctx.fillRect(x + bw, Y(b.values2![i]), bw, Y(0) - Y(b.values2![i])); }
      }
      ctx.strokeStyle = pal.ink; ctx.beginPath(); ctx.moveTo(left, Y(0) + 0.5); ctx.lineTo(W - right, Y(0) + 0.5); ctx.stroke();
      ctx.fillStyle = pal.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = font(fs);
      const lw = Math.max(...b.labels.map((l) => ctx.measureText(l).width), 1) + 6, every = b.tickEvery ?? Math.max(1, Math.ceil(lw / slot));
      for (let i = 0; i < n; i += every) ctx.fillText(b.labels[i], left + slot * (i + 0.5), Y(0) + 6);
      if (both && b.names) {
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; let x = left;
        [[c1, b.names[0]], [c2, b.names[1]]].forEach(([c, t]) => { ctx.fillStyle = c; ctx.fillRect(x, 6, 12, 12); ctx.fillStyle = pal.ink; ctx.fillText(t, x + 17, 12); x += 17 + ctx.measureText(t).width + 18; });
      }
    },
  };
}

function niceStep(raw: number): number {
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999)!;
}

/** A readable label for a symbol: spaces, new lines and other invisible characters spelled out. */
export function showSymbol(s: string): string {
  if (s === ' ') return '␣';
  if (s === '\n') return '↵';
  if (s === '\t') return '⇥';
  if (s === '\r') return '␍';
  if (/^\p{C}$/u.test(s)) return `U+${s.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;
  return s;
}
