// Titration curves: pH against volume of titrant for 25 mL of acid, worked out exactly from the charge balance at
// each point (no approximations). The shaded bands are the colour-change ranges of methyl orange (3.1 to 4.4) and
// phenolphthalein (8.3 to 10.0). An indicator works when its band sits inside the steep jump.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const KW = 1e-14;
const CASES = {
  ss: { name: 'HCl + NaOH', Ka: 1e3, base: 'strong', label: 'strong acid, strong base' },
  ws: { name: 'CH₃COOH + NaOH', Ka: 1.8e-5, base: 'strong', label: 'weak acid, strong base' },
  sw: { name: 'HCl + NH₃', Ka: 1e3, base: 'weak', label: 'strong acid, weak base' },
};
const KB = 1.8e-5; // ammonia
function pHat(cs, Ca, Va, Cb, Vb) {
  const V = Va + Vb, A = (Ca * Va) / V, B = (Cb * Vb) / V;
  const f = (h) => {
    const anion = (A * cs.Ka) / (cs.Ka + h);
    const cation = cs.base === 'strong' ? B : (B * h) / (h + KW / KB);
    return h + cation - KW / h - anion;
  };
  let lo = -14.5, hi = 1; // log10 h
  for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; f(10 ** m) > 0 ? (hi = m) : (lo = m); }
  return -(lo + hi) / 2;
}
export default function (host) {
  let key = 'ws', Ca = 0.1, Vb = 20;
  const Va = 25, Cb = 0.1;
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 280, label: 'Titration curve: pH against volume of base added' });
  const ctl = row(host);
  choice(ctl, 'Titration', Object.entries(CASES).map(([k, c]) => [k, c.name]), key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Acid', min: 0.02, max: 0.2, step: 0.01, value: Ca, fmt: (v) => `${v.toFixed(2)} M`, oninput: (v) => { Ca = v; upd(); } });
  slider(ctl, { label: 'Base added', min: 0, max: 60, step: 0.5, value: Vb, fmt: (v) => `${v} mL`, oninput: (v) => { Vb = v; upd(); } });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const cs = CASES[key], Veq = (Ca * Va) / Cb, pe = pHat(cs, Ca, Va, Cb, Veq), p = pHat(cs, Ca, Va, Cb, Vb);
    const ind = key === 'ss' ? 'either methyl orange or phenolphthalein works (the jump covers both bands)' : key === 'ws' ? 'use phenolphthalein (the jump lies in basic pH; methyl orange would change far too early)' : 'use methyl orange (the jump lies in acidic pH)';
    out.innerHTML = `25 mL of ${Ca.toFixed(2)} M acid, titrant 0.1 M (${cs.label}). After ${Vb} mL: pH = <b>${p.toFixed(2)}</b>. Equivalence at ${fmt(Veq)} mL, pH ${pe.toFixed(2)}${key === 'ws' ? ' (above 7: the acetate ion is a weak base)' : key === 'sw' ? ' (below 7: NH₄⁺ is a weak acid)' : ''}; ${ind}.${key === 'ws' ? ` At half-equivalence (${fmt(Veq / 2)} mL), pH = pKa = 4.74.` : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cs = CASES[key];
    const { X, Y, L, R } = axes(ctx, w, h, col, { x: [0, 60], y: [0, 14], xlabel: 'base added (mL)', ylabel: 'pH', t: 26, yt: [0, 2, 4, 6, 8, 10, 12, 14] });
    ctx.save(); ctx.globalAlpha = 0.18;
    ctx.fillStyle = col.s[3]; ctx.fillRect(L, Y(4.4), R - L, Y(3.1) - Y(4.4));
    ctx.fillStyle = col.s[4]; ctx.fillRect(L, Y(10), R - L, Y(8.3) - Y(10));
    ctx.restore();
    text(ctx, 'methyl orange', R - 4, Y(3.75), { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'phenolphthalein', R - 4, Y(9.15), { color: col.muted, size: 10, align: 'right' });
    const pts = []; for (let v = 0; v <= 60.001; v += 0.25) pts.push([X(v), Y(pHat(cs, Ca, Va, Cb, v))]);
    line(ctx, pts, col.s[0], 2.5);
    const Veq = (Ca * Va) / Cb;
    if (Veq <= 60) { line(ctx, [[X(Veq), Y(0)], [X(Veq), Y(14)]], col.muted, 1, [3, 3]); text(ctx, 'equivalence', X(Veq) + 4, Y(13), { color: col.muted, size: 10 }); }
    dot(ctx, X(Vb), Y(pHat(cs, Ca, Va, Cb, Vb)), 5, col.s[1]);
    text(ctx, cs.name, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  upd();
}
