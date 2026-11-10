// Small drawing and page helpers shared by the round-2 "n" Learn tools (Class 11 mechanics, fluids, heat,
// waves and periodic table). Canvas set-up, arrows, fact lists, number formatting and Level/mode switches.
import { pagePalette, type Palette } from './report';

export { pagePalette, type Palette };

/** Size a canvas to its CSS width at a fixed height, sharp on high-density screens. */
export function setupCanvas(c: HTMLCanvasElement, h: number) {
  const w = Math.max(260, Math.round(c.clientWidth || c.parentElement?.clientWidth || 320)), dpr = Math.min(3, window.devicePixelRatio || 1);
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.height = `${h}px`;
  const ctx = c.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pal = pagePalette();
  ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, w, h);
  ctx.font = '12px system-ui, sans-serif'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return { ctx, w, h, pal };
}

/** An arrow from (x, y) by (dx, dy) with a label near its head. */
export function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, col: string, label = '', opts: { dash?: boolean; width?: number; head?: number } = {}) {
  const len = Math.hypot(dx, dy); if (len < 2) return;
  const ux = dx / len, uy = dy / len, hd = Math.min(opts.head ?? 10, len * 0.6);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = opts.width ?? (opts.dash ? 1.8 : 3);
  if (opts.dash) ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx - ux * hd * 0.8, y + dy - uy * hd * 0.8); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(x + dx, y + dy); ctx.lineTo(x + dx - ux * hd - uy * hd / 2, y + dy - uy * hd + ux * hd / 2); ctx.lineTo(x + dx - ux * hd + uy * hd / 2, y + dy - uy * hd - ux * hd / 2); ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = ux > 0.3 ? 'left' : ux < -0.3 ? 'right' : 'center';
    ctx.fillText(label, x + dx + ux * 6, y + dy + uy * 6 + (uy > 0.3 ? 10 : uy < -0.3 ? -2 : 4));
  }
  ctx.restore();
}

/** Text at (x, y) with alignment, in the page font. */
export function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, col: string, align: CanvasTextAlign = 'left', size = 12, weight = 400) {
  ctx.save(); ctx.fillStyle = col; ctx.font = `${weight} ${size}px system-ui, sans-serif`; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore();
}

/** Round to d decimals and drop trailing zeros; minus sign as −. */
export const f = (x: number, d = 2) => {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '–';
  const r = Math.round(x * 10 ** d) / 10 ** d;
  return (Object.is(r, -0) ? 0 : r).toFixed(d).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '').replace('-', '−');
};
/** Number with thousands spaces (for big values). */
export const big = (x: number, d = 0) => { const s = f(x, d), [a, b] = s.split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (b ? '.' + b : ''); };

/** One <div><dt><dd> fact for an .ax-facts list. */
export function fact(k: string, v: string, sm = '') {
  const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
  dt.textContent = k; dd.textContent = v;
  if (sm) { const e = document.createElement('small'); e.textContent = sm; dd.append(e); }
  d.append(dt, dd); return d;
}
/** A paragraph from parts; [text] parts are bold. */
export function para(parts: (string | [string])[]) {
  const el = document.createElement('p');
  for (const x of parts) { if (typeof x === 'string') el.append(x); else { const b = document.createElement('b'); b.textContent = x[0]; el.append(b); } }
  return el;
}

/** Wire an .ax-seg group of buttons with data-v; calls on(value) and keeps aria-pressed in step. */
export function seg(group: HTMLElement, on: (v: string) => void) {
  const bs = [...group.querySelectorAll<HTMLButtonElement>('button')];
  for (const b of bs) b.addEventListener('click', () => { bs.forEach((o) => o.setAttribute('aria-pressed', String(o === b))); on(b.dataset.v!); });
  return (v: string) => { bs.forEach((o) => o.setAttribute('aria-pressed', String(o.dataset.v === v))); };
}

/** Redraw when the theme changes or the canvas width changes. */
export function keepDrawn(c: HTMLElement, draw: () => void) {
  document.addEventListener('fibub:theme', draw);
  let rw = 0; new ResizeObserver(() => { const w = c.clientWidth; if (w !== rw) { rw = w; draw(); } }).observe(c);
}

/** Pointer drag on a canvas: calls move(x, y, first) in CSS pixels while held. */
export function drag(c: HTMLCanvasElement, move: (x: number, y: number, first: boolean) => void, up?: () => void) {
  let on = false;
  const at = (e: PointerEvent, first: boolean) => { const r = c.getBoundingClientRect(); move(e.clientX - r.left, e.clientY - r.top, first); };
  c.addEventListener('pointerdown', (e) => { on = true; c.setPointerCapture(e.pointerId); at(e, true); });
  c.addEventListener('pointermove', (e) => { if (on) at(e, false); });
  const end = () => { if (on) { on = false; up?.(); } };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}
