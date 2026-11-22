// Dia-, para- and ferromagnetism at the level of atoms. Each arrow is an atomic magnetic moment. Raise B and lower T.
// Diamagnet: tiny moments opposite to B. Paramagnet: moments partly line up, a little more at low T (M ∝ B/T, Curie).
// Ferromagnet below its Curie temperature: moments already lined up in domains; B makes the favourable domains swallow the
// others. Above T_c it behaves like a paramagnet. The readout gives M relative to full alignment.
import { canvas, text, row, slider, choice, readout, loop, arrow, rng } from '../kit.js';

const NX = 9, NY = 6;
export default function (host) {
  let kind = 'para', B = 0.5, T = 1.0, t = 0, ang = [];
  const R = rng(3), thr = Array.from({ length: NX * NY }, () => R()), dom = Array.from({ length: NX * NY }, (_, i) => { const x = i % NX, y = (i / NX) | 0; return (x < 4 ? 0 : 1) + (y < 3 ? 0 : 2); });
  const DA = [Math.PI, 0, Math.PI / 2, -Math.PI / 2]; // domain directions (B is along 0 = to the right)
  const cv = canvas(host, { aspect: 0.7, max: 340, min: 240, label: 'Atomic magnetic moments in diamagnetic, paramagnetic and ferromagnetic materials' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Material', [['dia', 'Diamagnetic'], ['para', 'Paramagnetic'], ['ferro', 'Ferromagnetic']], kind, (v) => { kind = v; roll(); });
  slider(c2, { label: 'Field B', min: 0, max: 1, value: B, step: 0.02, fmt: (x) => x.toFixed(2) + ' (arb.)', oninput: (x) => { B = x; roll(); } });
  slider(c2, { label: 'Temperature T', min: 0.2, max: 2.5, value: T, step: 0.05, fmt: (x) => x.toFixed(2) + (x < 1 ? ' (below T_c)' : ''), oninput: (x) => { T = x; roll(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt; if (t > 0.18) { t = 0; roll(); } }); anim.button(ctl);
  const sample = (x) => { if (x < 0.05) return Math.random() * 6.2832; for (let k = 0; k < 60; k++) { const a = (Math.random() * 2 - 1) * Math.PI; if (Math.random() < Math.exp(x * (Math.cos(a) - 1))) return a; } return 0; };
  function roll() {
    ang = []; let M = 0;
    for (let i = 0; i < NX * NY; i++) {
      let a;
      if (kind === 'dia') a = Math.PI; // induced moment opposes B (and exists only while B is on)
      else if (kind === 'para') a = sample(3.2 * B / T);
      else if (T < 1) a = B > thr[i] * 0.9 ? sample(8 * (1 - T)) * 0.4 : DA[dom[i]] + (Math.random() - 0.5) * 0.35 * T;
      else a = sample(3.2 * B / (T - 0.9));
      ang.push(a); M += Math.cos(a);
    }
    M /= NX * NY;
    out.innerHTML = kind === 'dia' ? `Diamagnet: every atom gets a tiny induced moment <b>opposite</b> to B (χ ≈ −10⁻⁵), about the same at all temperatures. M/M<sub>full</sub> ≈ <b>−0.1</b> (drawn large, in reality far smaller).` : kind === 'para' ? `Paramagnet: heat keeps the moments random, the field only tilts them a little the same way. M/M<sub>full</sub> = <b>${M.toFixed(2)}</b>. Curie law: M ∝ B/T, so lower T or higher B lines them up more (χ ∝ 1/T).` : T < 1 ? `Ferromagnet below T<sub>c</sub>: four domains, each fully lined up inside. M/M<sub>full</sub> = <b>${M.toFixed(2)}</b>. With B = 0 the domains cancel (M ≈ 0); raising B grows the domains lined up with it until the whole sample is one domain (saturation).` : `Above T<sub>c</sub> (T > 1) the domains melt: it behaves like a paramagnet, χ ∝ 1/(T − T<sub>c</sub>). M/M<sub>full</sub> = <b>${M.toFixed(2)}</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const cw = w / NX, ch = (h - 26) / NY;
    if (kind === 'ferro' && T < 1) { ctx.globalAlpha = 0.12; [col.s[0], col.s[2], col.s[5], col.s[3]].forEach((c, d) => { ctx.fillStyle = c; ctx.fillRect((d & 1) * 4 * cw, (d >> 1) * 3 * ch + 24, (d & 1 ? 5 : 4) * cw, 3 * ch); }); ctx.globalAlpha = 1; }
    ang.forEach((a, i) => { const x = (i % NX + 0.5) * cw, y = 24 + ((i / NX | 0) + 0.5) * ch, L = kind === 'dia' ? 6 : Math.min(cw, ch) * 0.7; arrow(ctx, x - Math.cos(a) * L / 2, y - Math.sin(a) * L / 2, x + Math.cos(a) * L / 2, y + Math.sin(a) * L / 2, kind === 'dia' ? col.s[0] : col.s[5], kind === 'dia' ? 1.4 : 2.2, kind === 'dia' ? 4 : 6); });
    text(ctx, B > 0 ? `B → (${B.toFixed(2)})` : 'B = 0', 10, 14, { color: col.ink, size: 12, weight: 700 }); arrow(ctx, 90, 14, 90 + 30 * B + 6, 14, col.ink, 2, 6);
  };
  roll();
}
