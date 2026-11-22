// Maxwell distribution of molecular speeds. Pick a gas and a temperature: the curve shows what fraction of molecules
// move at each speed, with the most probable, average and r.m.s. speeds marked. The dashed curve is the same gas at 300 K.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const R = 8.314;
const GAS = { h2: ['H₂', 2], he: ['He', 4], n2: ['N₂', 28], o2: ['O₂', 32], co2: ['CO₂', 44] };
const f = (u, M, T) => { const m = M / 1000, a = m / (2 * R * T); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * u * u * Math.exp(-a * u * u); };

export default function (host) {
  let key = 'n2', T = 300;
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Maxwell distribution of molecular speeds for a chosen gas and temperature' });
  const ctl = row(host);
  choice(ctl, 'Gas', Object.entries(GAS).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Temperature', min: 100, max: 1500, step: 50, value: T, fmt: (v) => `${v} K`, oninput: (v) => { T = v; cv.redraw(); show(); } });
  const out = readout(host);
  const speeds = (M, T) => { const m = M / 1000; return [Math.sqrt(2 * R * T / m), Math.sqrt(8 * R * T / (Math.PI * m)), Math.sqrt(3 * R * T / m)]; };
  const show = () => {
    const [name, M] = GAS[key], [mp, av, rms] = speeds(M, T);
    out.innerHTML = `${name} at ${T} K: most probable <b>${fmt(mp, 3)} m/s</b>, average <b>${fmt(av, 3)} m/s</b>, r.m.s. <b>${fmt(rms, 3)} m/s</b>. Average kinetic energy per mole = (3/2)RT = ${fmt(1.5 * R * T / 1000, 3)} kJ, the same for every gas at this temperature.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const [, M] = GAS[key], xmax = 3.2 * speeds(M, 1500)[0], ymax = f(speeds(M, 100)[0], M, 100) * 1.08;
    const A = axes(ctx, w, h, col, { x: [0, xmax], y: [0, ymax], xlabel: 'speed (m/s)', ylabel: 'share of molecules', l: 24, t: 26, yt: [] });
    ctx.save(); A.clip();
    const curve = (TT) => { const pts = []; for (let i = 0; i <= 200; i++) { const u = (xmax * i) / 200; pts.push([A.X(u), A.Y(f(u, M, TT))]); } return pts; };
    if (T !== 300) line(ctx, curve(300), col.muted, 1.5, [5, 4]);
    const pts = curve(T);
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(A.X(xmax), A.Y(0)); ctx.closePath(); ctx.fill();
    line(ctx, pts, col.s[0], 2.5);
    const sp = speeds(M, T), labels = ['mp', 'avg', 'rms'];
    sp.forEach((u, i) => {
      const x = A.X(u);
      line(ctx, [[x, A.Y(0)], [x, A.Y(f(u, M, T))]], col.s[i + 1], 1.5);
    });
    ctx.restore();
    sp.forEach((u, i) => text(ctx, labels[i], A.X(u) + (i - 1) * 8, Math.max(A.T + 6 + i * 12, A.Y(f(u, M, T)) - 10 - (2 - i) * 12), { color: col.s[i + 1], size: 11, weight: 600, align: 'center', halo: col.panel }));
    if (T !== 300) text(ctx, 'dashed: 300 K', A.R - 4, A.T + 16, { color: col.muted, size: 11, align: 'right' });
  };
  cv.redraw(); show();
}
