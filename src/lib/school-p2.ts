// Small shared page helpers for the p2 batch of Learn tools (electricity, magnetism, AC, EM waves).
// Canvas set-up, key-fact rows and segmented buttons. Nothing is stored or sent anywhere.

/** Sizes a canvas for a w × h drawing, sharp on high-density screens; returns its context in CSS pixels. */
export function setup(c: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.aspectRatio = `${w} / ${h}`; }
  const x = c.getContext('2d')!; x.setTransform(dpr, 0, 0, dpr, 0, 0); return x;
}

/** One key fact for an `.ax-facts` list: name, value and an optional small note. */
export function fact(k: string, v: string, sm = '') {
  const d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
  dt.textContent = k; dd.textContent = v;
  if (sm) { const e = document.createElement('small'); e.textContent = sm; dd.append(e); }
  d.append(dt, dd); return d;
}

/** Wires an `.ax-seg` group of buttons with data-v values; calls on(value) when one is pressed. */
export function seg(box: HTMLElement, on: (v: string) => void) {
  const bs = [...box.querySelectorAll<HTMLButtonElement>('button')];
  for (const b of bs) b.addEventListener('click', () => { for (const o of bs) o.setAttribute('aria-pressed', String(o === b)); on(b.dataset.v!); });
}

/** Redraws when the page switches between light, dark and red night mode. */
export const onTheme = (f: () => void) => new MutationObserver(f).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

/** A canvas point from a pointer event, in drawing units (w wide). */
export function pointer(c: HTMLCanvasElement, e: PointerEvent, w: number) {
  const r = c.getBoundingClientRect(), k = w / r.width;
  return [(e.clientX - r.left) * k, (e.clientY - r.top) * k] as const;
}

/** Arrow from (x0, y0) to (x1, y1) with a head of size s. */
export function arrow(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, s = 6) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - s * Math.cos(a - 0.45), y1 - s * Math.sin(a - 0.45)); c.lineTo(x1 - s * Math.cos(a + 0.45), y1 - s * Math.sin(a + 0.45)); c.closePath(); c.fill();
}

/** True when the visitor asked for less motion. */
export const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
