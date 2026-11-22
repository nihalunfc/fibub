// Degrees of freedom switching on. Each way a molecule can store energy (move, spin, vibrate) holds 1/2 kT only when
// kT is big compared with that mode's spacing; at low temperature it is "frozen out". Slide the temperature and watch
// C_v for He, H₂, N₂ or CO₂ climb in steps (3/2 R, 5/2 R, 7/2 R...), with the modes that are awake lit up below.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../kit.js';

// thetaR (K, rotation), vibration temperatures (K), number of rotational DOF (0, 2, 3)
const MOL = { he: ['He (monatomic)', 0, [], 0], h2: ['H₂', 85, [6330], 2], n2: ['N₂', 2.9, [3374], 2], co2: ['CO₂ (linear)', 0.56, [960, 960, 1920, 3380], 2] };
const rotCv = (th, T) => { // exact rigid rotor C/R from the partition sum over J
  if (T > 40 * th) return 1;
  let Z = 0, E = 0, E2 = 0; for (let J = 0; J < 60; J++) { const e = (J * (J + 1) * th) / T, g = (2 * J + 1) * Math.exp(-e); Z += g; E += g * e; E2 += g * e * e; }
  return E2 / Z - (E / Z) ** 2;
};
const vibCv = (th, T) => { const x = th / T; return x > 60 ? 0 : (x * x * Math.exp(x)) / (Math.exp(x) - 1) ** 2; };
const cv_ = (m, T) => 1.5 + (m[3] ? rotCv(m[1], T) : 0) + m[2].reduce((s, t) => s + vibCv(t, T), 0);
export default function (host) {
  let mol = 'h2', T = 300;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Heat capacity of a gas against temperature, with the awake modes' });
  const ctl = row(host);
  choice(ctl, 'Gas', Object.entries(MOL).map(([k, v]) => [k, v[0]]), mol, (v) => { mol = v; upd(); });
  slider(ctl, { label: 'Temperature', min: 10, max: 10000, value: T, log: true, fmt: (v) => `${Math.round(v)} K`, oninput: (v) => { T = v; upd(); } });
  const out = readout(host);
  const upd = () => {
    const m = MOL[mol], c = cv_(m, T), rot = m[3] ? rotCv(m[1], T) : 0, vib = m[2].reduce((s, t) => s + vibCv(t, T), 0);
    out.innerHTML = `At ${Math.round(T)} K: C<sub>v</sub> = <b>${c.toFixed(2)} R</b> = translation 1.50 + rotation ${rot.toFixed(2)} + vibration ${vib.toFixed(2)}. Equipartition gives ½R per quadratic term, but a mode only counts once kT ≫ its spacing (rotation k θ = ${m[1] || '–'} K, vibration ${m[2].length ? [...new Set(m[2])].join(', ') + ' K' : 'none'}). Classical values: 3/2, 5/2 (+rotation), 7/2 (+vibration).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const m = MOL[mol]; title(ctx, `${m[0]}: C_v / R against T`, col);
    const top = h * 0.74, A = (ctx.save(), ctx.translate(0, 10), axes(ctx, w, top, col, { x: [10, 10000], y: [0, 4.5], xlog: true, xlabel: 'T (K)', ylabel: 'C_v / R', t: 26, l: 42, yt: [0, 1.5, 2.5, 3.5, 4.5], fy: (v) => v.toFixed(1), xt: [10, 100, 1000, 10000] }));
    const pts = []; for (let k = 0; k <= 160; k++) { const t = 10 * Math.pow(1000, k / 160); pts.push([A.X(t), A.Y(cv_(m, t))]); }
    line(ctx, pts, col.s[0], 2.5);
    [1.5, 2.5, 3.5].forEach((v) => line(ctx, [[A.L, A.Y(v)], [A.R, A.Y(v)]], col.line, 1, [3, 4]));
    dot(ctx, A.X(T), A.Y(cv_(m, T)), 6.5, col.s[3], col.panel);
    ctx.restore();
    // modes lit
    const rot = m[3] ? rotCv(m[1], T) : 0, vib = m[2].length ? m[2].reduce((s, t) => s + vibCv(t, T), 0) / m[2].length : 0;
    const modes = [['move', 1, col.s[1]], ['spin', m[3] ? rot / 1 : null, col.s[2]], ['vibrate', m[2].length ? vib : null, col.s[3]]];
    const y = h - 22, bw = Math.min(100, (w - 40) / 3);
    modes.forEach(([n, f, c], i) => {
      const x = 14 + i * (bw + 8); ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 12, bw, 24);
      if (f === null) text(ctx, `${n}: none`, x + bw / 2, y, { color: col.muted, size: 11, align: 'center' });
      else { ctx.fillStyle = c; ctx.globalAlpha = 0.15 + 0.7 * Math.min(1, f); ctx.fillRect(x + 1, y - 11, bw - 2, 22); ctx.globalAlpha = 1; text(ctx, `${n} ${Math.round(Math.min(1, f) * 100)} %`, x + bw / 2, y, { color: col.ink, size: 11, weight: 600, align: 'center' }); }
    });
  };
  upd();
}
