// A small kit for the Nobel series explainers: a framed figure with a crisp canvas, sliders,
// buttons, a live readout and an animation loop that runs only while the figure is on screen.
// Colours come from the page's CSS variables, so light, dark and red-light modes all work.
// Every stage carries a small "fibub.com" mark at 50% opacity in a corner (house rule for plots).
export type Colours = { ink: string; muted: string; line: string; bg: string; soft: string; accent: string; blue: string; amber: string; teal: string; violet: string; good: string; warn: string; bad: string };

export function colours(): Colours {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
  return {
    ink: v('--ink', '#0a0a0a'), muted: v('--muted', '#5c5c5c'), line: v('--line', '#e3e3e3'), bg: v('--bg', '#fff'), soft: v('--accent-soft', '#f2f2f2'),
    accent: v('--accent', '#0a0a0a'), blue: v('--c-tools', '#1d4ed8'), amber: v('--c-blog', '#b45309'), teal: v('--c-learn', '#0f766e'), violet: v('--c-home', '#6d28d9'),
    good: v('--good', '#146c34'), warn: v('--warn', '#8a5300'), bad: v('--bad', '#b3261e'),
  };
}

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const fmt = (x: number, d = 2) => (Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-3 && x !== 0) ? x.toExponential(d - 1).replace('e+', ' × 10^').replace('e-', ' × 10^-') : (+x.toPrecision(d + 1)).toLocaleString('en-GB'));
/** A seeded random number generator, so a scene looks the same each time it starts. */
export function rng(seed = 1) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
/** A standard normal draw. */
export const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());

export type Stage = {
  fig: HTMLElement; cv: HTMLCanvasElement; c: CanvasRenderingContext2D; W: number; H: number; col: Colours;
  ctl: HTMLElement; out: (html: string) => void;
  slider: (label: string, min: number, max: number, step: number, value: number, show: (v: number) => string, on?: (v: number) => void) => { get: () => number; set: (v: number) => void };
  button: (text: string, on: () => void) => HTMLButtonElement;
  choice: (opts: [string, string][], value: string, on: (v: string) => void) => { get: () => string };
  play: (frame: (dt: number, t: number) => void) => void;
  draw: () => void;
  mark: () => void;
  pointer: (on: (x: number, y: number, kind: 'down' | 'move' | 'up') => void) => void;
};

export function stage(el: HTMLElement, o: { tag?: string; title: string; w?: number; h?: number; caption?: string; alt: string }): Stage {
  const W = o.w ?? 640, H = o.h ?? 360;
  const fig = document.createElement('figure');
  fig.className = 'nx';
  fig.innerHTML = `<span class="nx-tag">${o.tag ?? 'Try it'}</span><p class="nx-title"></p>`;
  fig.querySelector('.nx-title')!.textContent = o.title;
  const cv = document.createElement('canvas');
  cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', o.alt);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr;
  const c = cv.getContext('2d')!;
  c.scale(dpr, dpr);
  const ctl = document.createElement('div'); ctl.className = 'nx-ctl';
  const outEl = document.createElement('p'); outEl.className = 'nx-out'; outEl.setAttribute('aria-live', 'polite'); outEl.hidden = true;
  fig.append(cv, ctl, outEl);
  if (o.caption) { const cap = document.createElement('figcaption'); cap.className = 'nx-cap'; cap.textContent = o.caption; fig.append(cap); }
  el.append(fig);

  let frame: ((dt: number, t: number) => void) | null = null, running = false, visible = false, raf = 0, last = 0, t = 0;
  const s: Stage = {
    fig, cv, c, W, H, col: colours(), ctl,
    out: (html) => { outEl.hidden = false; outEl.innerHTML = html; },
    slider(label, min, max, step, value, show, on) {
      const l = document.createElement('label');
      l.innerHTML = `<span><b></b><output></output></span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
      l.querySelector('b')!.textContent = label;
      const inp = l.querySelector('input')!, op = l.querySelector('output')!;
      const upd = () => { op.textContent = show(+inp.value); };
      inp.addEventListener('input', () => { upd(); on?.(+inp.value); if (!running) s.draw(); });
      upd(); ctl.append(l);
      return { get: () => +inp.value, set: (v) => { inp.value = String(v); upd(); } };
    },
    button(text, on) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = text;
      b.addEventListener('click', () => { on(); if (!running) s.draw(); }); ctl.append(b); return b;
    },
    choice(opts, value, on) {
      let cur = value; const bs: HTMLButtonElement[] = [];
      for (const [v, txt] of opts) {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.setAttribute('aria-pressed', String(v === cur));
        b.addEventListener('click', () => { cur = v; bs.forEach((x, i) => x.setAttribute('aria-pressed', String(opts[i][0] === cur))); on(v); if (!running) s.draw(); });
        bs.push(b); ctl.append(b);
      }
      return { get: () => cur };
    },
    play(f) {
      frame = f;
      const btn = document.createElement('button'); btn.type = 'button';
      const label = () => { btn.textContent = running ? 'Pause' : 'Play'; btn.setAttribute('aria-pressed', String(running)); };
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now; t += dt;
        frame!(dt, t); raf = running && visible ? requestAnimationFrame(tick) : 0;
      };
      const go = () => { if (running && visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
      btn.addEventListener('click', () => { running = !running; label(); go(); });
      ctl.prepend(btn);
      running = !reduced(); label();
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; go(); }).observe(fig);
      frame(0, 0);
    },
    draw() { s.col = colours(); frame?.(0, t); },
    mark() { c.save(); c.globalAlpha = 0.5; c.fillStyle = s.col.ink; c.font = '600 11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'alphabetic'; c.fillText('fibub.com', W - 6, H - 6); c.restore(); },
    pointer(on) {
      const at = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H] as const; };
      let down = false;
      cv.addEventListener('pointerdown', (e) => { down = true; cv.setPointerCapture(e.pointerId); const [x, y] = at(e); on(x, y, 'down'); if (!running) s.draw(); });
      cv.addEventListener('pointermove', (e) => { if (!down) return; const [x, y] = at(e); on(x, y, 'move'); if (!running) s.draw(); });
      cv.addEventListener('pointerup', (e) => { down = false; const [x, y] = at(e); on(x, y, 'up'); if (!running) s.draw(); });
    },
  };
  // Follow theme switches (dark, red light) without a reload.
  new MutationObserver(() => { s.col = colours(); if (!running) s.draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  return s;
}

/** Clear the stage to the page background. */
export function clear(s: Stage) { s.c.fillStyle = s.col.bg; s.c.fillRect(0, 0, s.W, s.H); }
/** Text helper. */
export function text(s: Stage, str: string, x: number, y: number, o: { size?: number; colour?: string; align?: CanvasTextAlign; bold?: boolean; base?: CanvasTextBaseline } = {}) {
  const c = s.c; c.fillStyle = o.colour ?? s.col.ink; c.font = `${o.bold ? '600 ' : ''}${o.size ?? 13}px system-ui, sans-serif`; c.textAlign = o.align ?? 'left'; c.textBaseline = o.base ?? 'alphabetic'; c.fillText(str, x, y);
}
export function dot(s: Stage, x: number, y: number, r: number, fill: string, alpha = 1) { const c = s.c; c.globalAlpha = alpha; c.fillStyle = fill; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1; }
export function line(s: Stage, pts: [number, number][], stroke: string, w = 1.5, dash: number[] = []) {
  const c = s.c; c.strokeStyle = stroke; c.lineWidth = w; c.setLineDash(dash); c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); c.setLineDash([]);
}
/** A small plot box: maps data to a rectangle and draws axes with labels. */
export function plot(s: Stage, box: { x: number; y: number; w: number; h: number }, xr: [number, number], yr: [number, number], o: { xLabel?: string; yLabel?: string; xTicks?: number[]; yTicks?: number[]; xf?: (v: number) => string; yf?: (v: number) => string } = {}) {
  const X = (v: number) => box.x + ((v - xr[0]) / (xr[1] - xr[0])) * box.w;
  const Y = (v: number) => box.y + box.h - ((v - yr[0]) / (yr[1] - yr[0])) * box.h;
  const c = s.c; c.strokeStyle = s.col.line; c.lineWidth = 1;
  for (const t of o.yTicks ?? []) { c.beginPath(); c.moveTo(box.x, Y(t)); c.lineTo(box.x + box.w, Y(t)); c.stroke(); text(s, o.yf ? o.yf(t) : String(t), box.x - 5, Y(t) + 4, { size: 11, colour: s.col.muted, align: 'right' }); }
  for (const t of o.xTicks ?? []) text(s, o.xf ? o.xf(t) : String(t), X(t), box.y + box.h + 14, { size: 11, colour: s.col.muted, align: 'center' });
  line(s, [[box.x, box.y], [box.x, box.y + box.h], [box.x + box.w, box.y + box.h]], s.col.muted, 1);
  if (o.xLabel) text(s, o.xLabel, box.x + box.w / 2, box.y + box.h + 30, { size: 12, align: 'center' });
  if (o.yLabel) { c.save(); c.translate(box.x - 38, box.y + box.h / 2); c.rotate(-Math.PI / 2); text(s, o.yLabel, 0, 0, { size: 12, align: 'center' }); c.restore(); }
  return { X, Y };
}
