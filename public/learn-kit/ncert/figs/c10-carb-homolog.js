// Class 10 Carbon: homologous series. Alkanes CnH2n+2, alkenes CnH2n, alkynes CnH2n-2. Each member differs from the
// next by one CH2 unit (14 u). Boiling points rise steadily with n, so small members are gases and long ones liquids
// and waxy solids. Boiling points (degC) from CRC Handbook values for the straight-chain compounds.
import { canvas, text, title, line, dot, row, slider, choice, readout, axes } from '../../kit.js';

const NM = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
const BP = { ane: [-162, -89, -42, -1, 36, 69, 98, 126, 151, 174], ene: [null, -104, -48, -6, 30, 63, 94, 121, 147, 171], yne: [null, -84, -23, 8, 40, 71, 100, 126, 151, 174] };
export default function (host) {
  let n = 4, s = 'ane';
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'A homologous series: chain length, formula and boiling point as n changes' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Carbons n', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; fix(); } });
  choice(ctl, 'Series', [['ane', 'Alkane'], ['ene', 'Alkene'], ['yne', 'Alkyne']], s, (v) => { s = v; fix(); });
  const out = readout(host);
  function fix() { if (s !== 'ane' && n < 2) { n = 2; sl.set(2); } say(); }
  const H = () => (s === 'ane' ? 2 * n + 2 : s === 'ene' ? 2 * n : 2 * n - 2);
  const nameOf = () => NM[n - 1] + s;
  function say() {
    const m = 12 * n + H(), bp = BP[s][n - 1];
    out.innerHTML = `<b>${nameOf()}</b>: C<sub>${n}</sub>H<sub>${H()}</sub>, mass ${m} u, boils at ${bp} °C (${bp < 20 ? 'a gas at room temperature' : bp < 250 ? 'a liquid' : 'a solid'}). Rule: C<sub>n</sub>H<sub>${s === 'ane' ? '2n+2' : s === 'ene' ? '2n' : '2n−2'}</sub>; each next member adds one CH₂ (14 u).`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${nameOf()}: C${n}H${H()}`, col) + 8;
    // chain
    const step = Math.min(34, (w - 40) / Math.max(1, n)), x0 = (w - step * (n - 1)) / 2, cy = top + 42;
    const P = Array.from({ length: n }, (_, i) => [x0 + i * step, cy + (i % 2 ? -10 : 10)]);
    for (let i = 0; i < n - 1; i++) {
      const o = i === 0 && s === 'ene' ? 2 : i === 0 && s === 'yne' ? 3 : 1;
      const [a, b] = [P[i], P[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
      for (let j = 0; j < o; j++) { const off = (j - (o - 1) / 2) * 4; line(ctx, [[a[0] + nx * off, a[1] + ny * off], [b[0] + nx * off, b[1] + ny * off]], col.ink, 2.4); }
      if (i >= 1) { /* repeat unit marks */ }
    }
    P.forEach(([x, y], i) => { dot(ctx, x, y, Math.min(10, step * 0.3), col.panel, i === n - 1 && n > 1 ? col.s[1] : col.s[0]); });
    if (n >= 2) text(ctx, 'each extra CH₂ (orange) adds 14 u', w / 2, cy + 36, { color: col.s[1], size: 10.5, align: 'center' });
    // graph of bp vs n
    const gx = 40, gy = cy + 54, gw = w - gx - 16, gh = h - gy - 34;
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    const yv = (v) => gy + gh - ((v + 180) / 370) * gh, xv = (i) => gx + 8 + ((i - 1) / 9) * (gw - 16);
    [-150, -100, -50, 0, 50, 100, 150].forEach((v) => { line(ctx, [[gx, yv(v)], [gx + gw, yv(v)]], col.line, v === 0 ? 1.4 : 0.5); text(ctx, String(v), gx - 4, yv(v), { color: col.muted, size: 9, align: 'right' }); });
    text(ctx, 'boiling point (°C) against number of carbons n', gx + gw / 2, gy + gh + 22, { color: col.muted, size: 10, align: 'center' });
    for (let i = 1; i <= 10; i++) text(ctx, String(i), xv(i), gy + gh + 9, { color: col.muted, size: 9, align: 'center' });
    const pts = []; BP[s].forEach((v, i) => { if (v !== null) pts.push([xv(i + 1), yv(v)]); });
    line(ctx, pts, col.s[0], 2);
    pts.forEach((p) => dot(ctx, p[0], p[1], 3, col.s[0]));
    const bp = BP[s][n - 1]; dot(ctx, xv(n), yv(bp), 6, col.s[1], col.ink);
    text(ctx, 'room temp (25 °C): above it = liquid', gx + gw - 2, yv(25) - 7, { color: col.muted, size: 9, align: 'right' });
  };
  say();
}
