// Pictures for the astronomy tools, drawn on canvas so they show on the page and in downloads.
import type { Figure, Palette } from '../report';
import { localTime, localHours } from './place';
import { altAzBody, observer, type Night } from './sky';
import type { Place } from './place';

export const SERIES = ['#0b7fa6', '#d97706', '#7c3aed', '#137a3e', '#db2777', '#4f5bd5', '#0f766e', '#b45309'];
export const seriesColour = (i: number, pal: Palette) => (pal.red ? ['#ff3b30', '#c0261c', '#ff7a70', '#8f1d15'][i % 4] : pal.bg === '#ffffff' ? SERIES[i % SERIES.length] : ['#5cc8f0', '#f5a83a', '#b69cff', '#6fe39b', '#ff7aa6', '#8f99ff', '#5eead4', '#fbbf24'][i % 8]);

export type Horizon = { az: number; alt: number }[];
/** Altitude of a custom horizon (trees, roofs) at an azimuth, by straight lines between points. */
export function horizonAt(h: Horizon | null | undefined, az: number) {
  if (!h || h.length === 0) return 0;
  const pts = [...h].sort((a, b) => a.az - b.az);
  const a = ((az % 360) + 360) % 360;
  let lo = pts[pts.length - 1], hi = pts[0];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].az >= a) { hi = pts[i]; lo = pts[(i - 1 + pts.length) % pts.length]; break; }
    if (i === pts.length - 1) { lo = pts[i]; hi = pts[0]; }
  }
  const span = (hi.az - lo.az + 360) % 360 || 360;
  const f = ((a - lo.az + 360) % 360) / span;
  return lo.alt + (hi.alt - lo.alt) * f;
}

type Line = { label: string; pts: { time: Date; alt: number; az: number }[] };
export function altitudeFigure(o: { place: Place; night: Night; lines: Line[]; from: Date; to: Date; minAlt?: number; horizon?: Horizon | null; w?: number; h?: number; title?: string }): Figure {
  const W = o.w ?? 900, H = o.h ?? 380;
  return {
    w: W, h: H, alt: `Altitude through the night for ${o.lines.map((l) => l.label).join(', ')}`,
    draw(ctx, w, h, pal) {
      const L = 44, R = 12, T = 14, B = 34, pw = w - L - R, ph = h - T - B;
      const t0 = o.from.getTime(), t1 = o.to.getTime();
      const X = (t: number) => L + ((t - t0) / (t1 - t0)) * pw, Y = (a: number) => T + ph - (Math.max(0, a) / 90) * ph;
      // Sky colour by the Sun's height.
      const obs = observer(o.place);
      const step = (t1 - t0) / 120;
      for (let t = t0; t < t1; t += step) {
        const s = altAzBody('Sun', new Date(t + step / 2), obs).alt;
        ctx.fillStyle = s > 0 ? pal.day : s > -6 ? mix(pal.day, pal.twilight, 0.5) : s > -12 ? pal.twilight : s > -18 ? mix(pal.twilight, pal.night, 0.5) : pal.night;
        ctx.fillRect(X(t), T, X(t + step) - X(t) + 0.6, ph);
      }
      // Grid.
      ctx.font = '12px system-ui, sans-serif'; ctx.textBaseline = 'middle';
      for (let a = 0; a <= 90; a += 15) {
        ctx.strokeStyle = a === 0 ? pal.line : 'rgba(255,255,255,.14)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, Y(a)); ctx.lineTo(L + pw, Y(a)); ctx.stroke();
        ctx.fillStyle = pal.muted; ctx.textAlign = 'right'; ctx.fillText(`${a}°`, L - 6, Y(a));
      }
      if (o.minAlt) {
        ctx.setLineDash([5, 4]); ctx.strokeStyle = pal.red ? pal.muted : 'rgba(255,255,255,.55)';
        ctx.beginPath(); ctx.moveTo(L, Y(o.minAlt)); ctx.lineTo(L + pw, Y(o.minAlt)); ctx.stroke(); ctx.setLineDash([]);
      }
      // Hour ticks in local time.
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const first = Math.ceil(t0 / 36e5) * 36e5;
      const every = pw / ((t1 - t0) / 36e5) < 34 ? 2 : 1;
      for (let t = first; t <= t1; t += 36e5) {
        const hr = Math.round(localHours(new Date(t), o.place.tz)) % 24;
        if (hr % every) continue;
        ctx.strokeStyle = pal.line; ctx.beginPath(); ctx.moveTo(X(t), T + ph); ctx.lineTo(X(t), T + ph + 4); ctx.stroke();
        ctx.fillStyle = pal.muted; ctx.fillText(localTime(new Date(t), o.place.tz).replace(':00', ''), X(t), T + ph + 7);
      }
      // Custom horizon: shade what the trees and roofs hide, along each line's azimuth.
      // Lines.
      o.lines.forEach((ln, i) => {
        const c = seriesColour(i, pal);
        ctx.lineWidth = 2.4; ctx.strokeStyle = c;
        let started = false;
        ctx.beginPath();
        for (const p of ln.pts) {
          if (p.time.getTime() < t0 || p.time.getTime() > t1) continue;
          const hidden = p.alt < horizonAt(o.horizon, p.az);
          if (p.alt < 0) { started = false; continue; }
          ctx.globalAlpha = 1;
          if (!started) { ctx.moveTo(X(p.time.getTime()), Y(p.alt)); started = true; } else ctx.lineTo(X(p.time.getTime()), Y(p.alt));
          if (hidden) { ctx.stroke(); ctx.beginPath(); ctx.setLineDash([3, 4]); ctx.moveTo(X(p.time.getTime()), Y(p.alt)); }
          else if (ctx.getLineDash().length) { ctx.stroke(); ctx.beginPath(); ctx.setLineDash([]); ctx.moveTo(X(p.time.getTime()), Y(p.alt)); }
        }
        ctx.stroke(); ctx.setLineDash([]);
        // Label at the highest point.
        const best = ln.pts.reduce((a, b) => (b.alt > a.alt ? b : a), ln.pts[0]);
        if (best && best.alt > 0) {
          ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          const x = Math.min(L + pw - 40, Math.max(L + 40, X(best.time.getTime())));
          ctx.fillStyle = c; ctx.fillText(ln.label.length > 22 ? ln.label.slice(0, 21) + '…' : ln.label, x, Y(best.alt) - 4);
        }
      });
      ctx.strokeStyle = pal.line; ctx.lineWidth = 1; ctx.strokeRect(L + 0.5, T + 0.5, pw, ph);
    },
  };
}
function mix(a: string, b: string, f: number) {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * f)).join(',')})`;
}

/** The Moon's lit shape for a phase angle (0 new, 180 full). */
export function moonFigure(phase: number, size = 120): Figure {
  return {
    w: size, h: size, alt: 'Moon phase',
    draw(ctx, w, h, pal) {
      const r = w / 2 - 4, cx = w / 2, cy = h / 2;
      ctx.fillStyle = pal.red ? '#1a0302' : '#2b3245'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      const k = Math.cos((phase * Math.PI) / 180); // 1 new, -1 full
      const waxing = phase < 180;
      ctx.fillStyle = pal.red ? '#ff3b30' : '#f4f1e6';
      ctx.beginPath();
      // Lit limb half circle, then the terminator ellipse back.
      ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !waxing);
      ctx.ellipse(cx, cy, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === waxing ? true : false);
      ctx.fill();
    },
  };
}
