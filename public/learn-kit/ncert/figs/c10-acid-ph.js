// Class 10 Acids, Bases and Salts: the pH scale. pH = -log10 [H+]. Every step of 1 in pH means ten times more or fewer
// H+ ions. Universal indicator colours run red (strong acid) through green (neutral) to violet (strong base).
// Slide the pH, see the colour, the ion balance, and the nearest everyday substance.
import { canvas, text, title, row, slider, readout, rng } from '../../kit.js';

const EX = [[0, 'battery acid'], [1.5, 'stomach acid'], [2.2, 'lemon juice'], [2.9, 'vinegar'], [3.5, 'orange juice'], [4.5, 'tomato juice'], [5, 'black coffee'], [6.4, 'milk'], [7, 'pure water'], [7.4, 'blood'], [8.3, 'baking soda solution'], [9, 'toothpaste'], [10, 'soap'], [10.5, 'milk of magnesia'], [11.5, 'ammonia cleaner'], [13, 'drain cleaner (NaOH)'], [14, 'concentrated NaOH']];
const STOPS = [[0, [214, 34, 40]], [2, [238, 90, 40]], [4, [244, 170, 50]], [5.5, [236, 220, 70]], [7, [80, 180, 90]], [8.5, [40, 160, 150]], [10, [50, 110, 190]], [12, [80, 60, 170]], [14, [100, 30, 130]]];
const uni = (p) => { for (let i = 1; i < STOPS.length; i++) if (p <= STOPS[i][0]) { const [a, A] = STOPS[i - 1], [b, B] = STOPS[i], f = (p - a) / (b - a); return `rgb(${A.map((v, k) => Math.round(v + (B[k] - v) * f)).join(',')})`; } return 'rgb(100,30,130)'; };
export default function (host) {
  let pH = 7;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'The pH scale with universal indicator colour, hydrogen and hydroxide ions, and everyday examples' });
  const ctl = row(host);
  slider(ctl, { label: 'pH', min: 0, max: 14, step: 0.1, value: 7, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; say(); } });
  const out = readout(host);
  const R = rng(11), pos = Array.from({ length: 60 }, () => [R(), R()]);
  function say() {
    const near = EX.reduce((b, e) => (Math.abs(e[0] - pH) < Math.abs(b[0] - pH) ? e : b));
    const h = Math.pow(10, -pH);
    out.innerHTML = `pH ${pH.toFixed(1)}: [H⁺] = 10<sup>−${pH.toFixed(1)}</sup> = ${h.toExponential(1).replace('e-', ' × 10<sup>−') + '</sup>'} mol/L. ${pH < 6.9 ? 'Acidic' : pH > 7.1 ? 'Basic (alkaline)' : 'Neutral'}. Close to: <b>${near[1]}</b> (pH ${near[0]}). One pH step = 10 times the H⁺.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'pH 0 (strong acid) to 14 (strong base)', col) + 10;
    // colour bar
    const x0 = 14, bw = w - 28, by = top + 6;
    for (let i = 0; i < bw; i++) { ctx.fillStyle = uni((i / bw) * 14); ctx.fillRect(x0 + i, by, 1.4, 26); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x0, by, bw, 26);
    for (let k = 0; k <= 14; k += 2) text(ctx, String(k), x0 + (k / 14) * bw, by + 38, { color: col.muted, size: 10, align: 'center' });
    const mx = x0 + (pH / 14) * bw; ctx.beginPath(); ctx.moveTo(mx, by + 28); ctx.lineTo(mx - 6, by + 40 - 12 + 4); ctx.lineTo(mx + 6, by + 40 - 12 + 4); ctx.closePath(); ctx.fillStyle = col.ink; ctx.fill();
    // beaker with ions
    const bx = x0 + 4, bt = by + 60, bwid = Math.min(150, w * 0.42), bh = h - bt - 22;
    ctx.fillStyle = uni(pH); ctx.globalAlpha = 0.45; ctx.fillRect(bx, bt + bh * 0.15, bwid, bh * 0.85); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, bt); ctx.lineTo(bx, bt + bh); ctx.lineTo(bx + bwid, bt + bh); ctx.lineTo(bx + bwid, bt); ctx.stroke();
    const nh = Math.round(34 * (1 - pH / 14) ** 1.3), noh = Math.round(34 * (pH / 14) ** 1.3);
    pos.forEach(([a, b], i) => {
      const x = bx + 8 + a * (bwid - 16), y = bt + bh * 0.2 + b * (bh * 0.72);
      if (i < nh) { ctx.fillStyle = col.s[7]; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); text(ctx, '+', x, y, { color: '#fff', size: 8, weight: 700, align: 'center', fit: false }); }
      else if (i >= 60 - noh) { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); text(ctx, '−', x, y, { color: '#fff', size: 8, weight: 700, align: 'center', fit: false }); }
    });
    text(ctx, 'H⁺ (red)  OH⁻ (blue)', bx + bwid / 2, bt + bh + 13, { color: col.muted, size: 10, align: 'center' });
    // list of examples
    const lx = bx + bwid + 14; let ly = bt;
    const ni = EX.findIndex((e) => e === EX.reduce((b, e2) => (Math.abs(e2[0] - pH) < Math.abs(b[0] - pH) ? e2 : b))), a0 = Math.max(0, Math.min(EX.length - 9, ni - 4));
    EX.slice(a0, a0 + 9).forEach(([p, nm]) => { const on = p === EX[ni][0]; if (ly < h - 14) { text(ctx, `${p} ${nm}`, lx, ly, { color: on ? col.ink : col.muted, size: on ? 11 : 9.5, weight: on ? 700 : 400 }); ly += on ? 14 : 12; } });
  };
  say();
}
