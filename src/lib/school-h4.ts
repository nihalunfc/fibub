// Small drawing and page helpers shared by the Learn tools built by NCERT helper 4 (gravity, solids, fluids,
// waves and periodic-table tools). Plain DOM helpers; no data is stored or sent.

/** Size a canvas to its box at the screen's pixel density and return a 2D context in CSS pixels. */
export function setupCanvas(c: HTMLCanvasElement, h: number) {
  const w = Math.max(260, Math.round(c.clientWidth || c.parentElement!.clientWidth || 320)), dpr = Math.min(3, window.devicePixelRatio || 1);
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.height = `${h}px`;
  const ctx = c.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w };
}

/** A straight arrow from (x, y) by (dx, dy) with an optional label at the tip. */
export function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, col: string, label = '', width = 3) {
  const len = Math.hypot(dx, dy); if (len < 3) return;
  const ux = dx / len, uy = dy / len;
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx - ux * 8, y + dy - uy * 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + dx, y + dy); ctx.lineTo(x + dx - ux * 10 - uy * 5, y + dy - uy * 10 + ux * 5); ctx.lineTo(x + dx - ux * 10 + uy * 5, y + dy - uy * 10 - ux * 5); ctx.closePath(); ctx.fill();
  if (label) { ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = ux > 0.3 ? 'left' : ux < -0.3 ? 'right' : 'center'; ctx.fillText(label, x + dx + ux * 6, y + dy + uy * 6 + (uy > 0.3 ? 12 : uy < -0.3 ? -3 : 4)); }
  ctx.restore();
}

/** Format a number with at most `d` decimals, trailing zeros dropped, minus sign as −. */
export const fmt = (x: number, d = 2) => {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞';
  const r = Math.round(x * 10 ** d) / 10 ** d;
  return (Object.is(r, -0) ? 0 : r).toFixed(d).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '').replace('-', '−');
};
/** Format with `s` significant figures, using × 10ⁿ for very large or small numbers. */
export function sig(x: number, s = 3): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞';
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -3 && e < 6) { const d = Math.max(0, s - 1 - e); return fmt(Number(x.toPrecision(s)), d); }
  const m = x / 10 ** e, sup = (n: number) => String(n).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]);
  return `${fmt(Number(m.toPrecision(s)), s - 1)} × 10${sup(e)}`;
}

/** A <div><dt><dd></div> row for an .ax-facts list. */
export function fact(k: string, v: string, small = '') {
  const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
  dt.textContent = k; dd.textContent = v;
  if (small) { const e = document.createElement('small'); e.textContent = small; dd.append(e); }
  d.append(dt, dd); return d;
}

/** Paragraphs that start with a bold label: [[label, text], ...]. */
export function lines(rows: [string, string][]) {
  return rows.map(([b, t]) => { const p = document.createElement('p'), bb = document.createElement('b'); bb.textContent = b; p.append(bb, t); return p; });
}

/** Wire an .ax-seg group of buttons with data-v; calls on(value) and keeps aria-pressed in step. */
export function segmented(box: HTMLElement, on: (v: string) => void) {
  const btns = [...box.querySelectorAll<HTMLButtonElement>('button')];
  const set = (v: string) => { btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v))); on(v); };
  btns.forEach((b) => b.addEventListener('click', () => set(b.dataset.v!)));
  return set;
}

/** Redraw on theme change and on width change. */
export function keepDrawn(c: HTMLCanvasElement, draw: () => void) {
  document.addEventListener('fibub:theme', draw);
  let rw = 0; new ResizeObserver(() => { const w = c.clientWidth; if (w !== rw) { rw = w; draw(); } }).observe(c);
}

