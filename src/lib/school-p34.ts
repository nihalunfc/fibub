// Small drawing helpers shared by the Class 12 electricity, induction and EM-wave Learn tools built in batch p34
// (coulomb-forces, gauss-law, dipole-torque, potential-map, capacitor-network, faraday-cage, motional-emf,
// inductance-lab, rms-waveform, transformer-calculator, em-wave-3d, em-spectrum, displacement-current).
import { sig, fmtExp } from './sci/num';
import { isRight, type Question } from './sci/elec-quiz';
import { n3 } from './sci/em-p34';

export const sg = (x: number, n = 3) => sig(x, n);
/** Three significant figures, switching to "a × 10ⁿ" for very big or very small numbers. */
export function sci3(x: number) {
  if (!Number.isFinite(x)) return sig(x, 3);
  const r = Number(x.toPrecision(3));
  return r !== 0 && (Math.abs(r) >= 1e4 || Math.abs(r) < 1e-3) ? fmtExp(r, 3) : String(r).replace('-', '−');
}

/** Size a canvas for a w × h drawing, sharp on high-density screens; returns its context in CSS pixels. */
export function setup(c: HTMLCanvasElement, w: number, h: number) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.aspectRatio = `${w} / ${h}`; }
  const x = c.getContext('2d')!; x.setTransform(dpr, 0, 0, dpr, 0, 0); return x;
}

/** An arrow from (x0, y0) to (x1, y1), with an optional label just past the tip. */
export function arrow(c: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, col: string, w = 2.5, label = '') {
  const L = Math.hypot(x1 - x0, y1 - y0);
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w;
  if (L >= 2) {
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, hl = Math.min(9, L * 0.5), hw = 3 + w * 0.6;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - hl * ux, y1 - hl * uy); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - hl * ux - hw * uy, y1 - hl * uy + hw * ux); c.lineTo(x1 - hl * ux + hw * uy, y1 - hl * uy - hw * ux); c.closePath(); c.fill();
  }
  if (label) {
    c.font = '700 12px system-ui, sans-serif'; c.textAlign = 'center';
    const ux = L ? (x1 - x0) / L : 1, uy = L ? (y1 - y0) / L : 0;
    c.fillText(label, x1 + 12 * ux, y1 + 12 * uy + 4);
  }
}

/** One fact for an `.ax-facts` list: a label, a value and an optional small note. */
export function fact(k: string, v: string, sm = '') {
  const d = document.createElement('div');
  d.innerHTML = '<dt></dt><dd></dd>';
  d.querySelector('dt')!.textContent = k; d.querySelector('dd')!.textContent = v;
  if (sm) { const e = document.createElement('small'); e.textContent = sm; d.querySelector('dd')!.append(e); }
  return d;
}

/** Wire an `.ax-seg` group of buttons with data-v values; calls back with the pressed value. */
export function seg(box: HTMLElement, on: (v: string) => void) {
  box.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b || !box.contains(b)) return;
    for (const x of box.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
    on(b.dataset.v!);
  });
}

/** Redraw when the page switches between light, dark and red night mode. */
export const onTheme = (fn: () => void) => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

/** Engineering style: a number with an SI prefix, e.g. 0.0021 → "2.1 m". */
export function si(x: number, unit: string, n = 3) {
  if (x === 0 || !Number.isFinite(x)) return `${x === 0 ? 0 : '—'} ${unit}`;
  const P: [number, string][] = [[1e18, 'E'], [1e15, 'P'], [1e12, 'T'], [1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f'], [1e-18, 'a']];
  const a = Math.abs(x);
  for (const [f, p] of P) if (a >= f * 0.9995) return `${n === 3 ? sci3(x / f) : sg(x / f, n)} ${p}${unit}`;
  return `${sci3(x / 1e-18)} a${unit}`;
}


/** Accepts "2e-8", "2 × 10^-8", "2x10-8" and "2 × 10⁻⁸" as the same number. */
export function tidyNumber(s: string) {
  const SUP: Record<string, string> = { '⁻': '-', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  return s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => SUP[c]).replace(/[−–]/g, '-').replace(/\s*[×x*]\s*10\s*\^?\s*(-?\d+)/i, 'e$1').replace(/\s+/g, '');
}

/** "Check yourself" block: fresh questions, answers checked here, worked answer shown. Nothing stored or sent. */
export function quiz(box: HTMLElement, make: () => Question[]) {
  const draw = () => {
    const list = document.createElement('ol');
    list.className = 'eq-list';
    make().forEach((q, i) => {
      const li = document.createElement('li'); li.className = 'eq-q';
      const p = document.createElement('p'); p.textContent = q.text;
      const row = document.createElement('div'); row.className = 'ax-row';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.inputMode = 'text'; inp.className = 'eq-in'; inp.autocomplete = 'off';
      inp.placeholder = Math.abs(q.answer) >= 1e4 ? 'e.g. 3.2e5' : Math.abs(q.answer) < 1e-3 ? 'e.g. 2.5e-8' : '';
      inp.setAttribute('aria-label', `Answer to question ${i + 1}${q.unit ? ` in ${q.unit}` : ''}`);
      inp.style.maxWidth = '10em';
      const unit = document.createElement('span'); unit.textContent = q.unit;
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn secondary small eq-go'; btn.textContent = 'Check';
      const res = document.createElement('p'); res.className = 'eq-res'; res.setAttribute('aria-live', 'polite');
      const det = document.createElement('details'); det.className = 'eq-work';
      const sum = document.createElement('summary'); sum.textContent = 'Show the working';
      const steps = document.createElement('div');
      for (const s of q.steps) { const d = document.createElement('p'); d.textContent = s; steps.append(d); }
      det.append(sum, steps);
      const check = () => {
        const ok = isRight(tidyNumber(inp.value), q);
        res.className = 'eq-res ' + (ok === null ? '' : ok ? 'eq-ok' : 'eq-no');
        res.textContent = ok === null ? 'Type a number first.' : ok ? `Right: ${n3(q.answer)}${q.unit ? ' ' + q.unit : ''}.` : 'Not quite. Try again, or open the working.';
        if (ok) det.open = true;
      };
      btn.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      row.append(inp, unit, btn);
      li.append(p, row, res, det);
      list.append(li);
    });
    const again = document.createElement('button');
    again.type = 'button'; again.className = 'btn secondary small eq-new'; again.textContent = 'New questions';
    again.addEventListener('click', draw);
    box.replaceChildren(list, again);
  };
  draw();
}
