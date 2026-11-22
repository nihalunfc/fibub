// Moles: the bridge between grams, particles and gas volume. Pick a substance and a mass; every other way of
// counting it updates. Gas volumes at STP use 22.4 L/mol (0 °C, 1 atm); at 0 °C and 1 bar it is 22.7 L/mol.
import { canvas, text, row, slider, choice, readout, fmt, arrow } from '../../kit.js';

const NA = 6.022e23;
const SUBS = {
  h2o: { name: 'H₂O', M: 18, atoms: 3, gas: false },
  co2: { name: 'CO₂', M: 44, atoms: 3, gas: true },
  nh3: { name: 'NH₃', M: 17, atoms: 4, gas: true },
  nacl: { name: 'NaCl', M: 58.5, atoms: 2, gas: false, ions: true },
  c6: { name: 'C₆H₁₂O₆', M: 180, atoms: 24, gas: false },
};
export default function (host) {
  let key = 'co2', mass = 22;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'Mass, moles, particles and gas volume linked through the mole' });
  const ctl = row(host);
  choice(ctl, 'Substance', Object.entries(SUBS).map(([k, s]) => [k, s.name]), key, (v) => { key = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Mass', min: 1, max: 200, step: 1, value: mass, fmt: (v) => `${v} g`, oninput: (v) => { mass = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const s = SUBS[key], n = mass / s.M;
    out.innerHTML = `${mass} g of ${s.name} ÷ ${s.M} g/mol = <b>${fmt(n, 3)} mol</b> = ${fmt(n * NA, 3)} ${s.ions ? 'formula units' : 'molecules'} = ${fmt(n * NA * s.atoms, 3)} ${s.ions ? 'ions' : 'atoms'}${s.gas ? `; as a gas at STP, ${fmt(n * 22.4, 3)} L` : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = SUBS[key], n = mass / s.M, cx = w / 2, cy = h / 2;
    const box = (x, y, top, val, c) => {
      ctx.fillStyle = col.soft; ctx.strokeStyle = c; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - 62, y - 24, 124, 48, 8); ctx.fill(); ctx.stroke();
      text(ctx, top, x, y - 9, { color: col.muted, size: 11, align: 'center' });
      text(ctx, val, x, y + 9, { color: col.ink, size: 13, weight: 600, align: 'center' });
    };
    const P = { m: [cx - w * 0.32, cy], p: [cx + w * 0.32, cy], v: [cx, cy + h * 0.33], n: [cx, cy - h * 0.12] };
    arrow(ctx, P.m[0] + 62, P.m[1], P.n[0] - 64, P.n[1], col.muted, 1.5);
    arrow(ctx, P.n[0] + 64, P.n[1], P.p[0] - 62, P.p[1], col.muted, 1.5);
    if (s.gas) arrow(ctx, P.n[0], P.n[1] + 26, P.v[0], P.v[1] - 26, col.muted, 1.5);
    text(ctx, `÷ ${s.M} g/mol`, (P.m[0] + P.n[0]) / 2, P.n[1] - 30, { color: col.muted, size: 11, align: 'center' });
    text(ctx, '× 6.022×10²³', (P.p[0] + P.n[0]) / 2, P.n[1] - 30, { color: col.muted, size: 11, align: 'center' });
    box(...P.m, 'mass', `${mass} g`, col.s[0]);
    box(...P.n, 'moles', `${fmt(n, 3)} mol`, col.s[1]);
    box(...P.p, s.ions ? 'formula units' : 'molecules', fmt(n * NA, 3), col.s[2]);
    if (s.gas) { box(...P.v, 'gas volume at STP', `${fmt(n * 22.4, 3)} L`, col.s[3]); text(ctx, '× 22.4 L/mol', P.v[0] + 70, (P.n[1] + P.v[1]) / 2, { color: col.muted, size: 11 }); }
  };
  cv.redraw(); show();
}
