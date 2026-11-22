// 5.1 Maxwell speed distribution. Pick a gas and move the temperature: the curve spreads out and its peak drops and
// moves right, while the area stays 1. Markers show the most probable, mean and rms speeds; the dashed curve is the
// same gas at 300 K for comparison.
import { canvas, axes, line, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

const k = 1.380649e-23, u = 1.66053906660e-27;
const GASES = { H2: ['Hydrogen H₂', 2.016], He: ['Helium', 4.003], N2: ['Nitrogen N₂', 28.01], CO2: ['CO₂', 44.01], Xe: ['Xenon', 131.3] };

const f = (v, m, T) => { const a = m / (2 * k * T); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Maxwell speed distribution with the three characteristic speeds marked' });
  let gas = 'N2', T = 300;
  const ctl = row(host);
  choice(ctl, 'Gas', Object.entries(GASES).map(([key, [name]]) => [key, name]), gas, (v) => { gas = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Temperature', min: 50, max: 2000, step: 10, value: T, fmt: (v) => fmt(v, 4) + ' K', oninput: (v) => { T = v; cv.redraw(); show(); } });
  const out = readout(host);
  const speeds = (m) => [Math.sqrt(2 * k * T / m), Math.sqrt(8 * k * T / (Math.PI * m)), Math.sqrt(3 * k * T / m)];
  const show = () => {
    const m = GASES[gas][1] * u, [vp, va, vr] = speeds(m);
    out.innerHTML = `At ${fmt(T, 4)} K: most probable <b>${fmt(vp, 3)} m/s</b>, mean <b>${fmt(va, 3)} m/s</b>, rms <b>${fmt(vr, 3)} m/s</b>, always in the ratio 1 : 1.128 : 1.225. The peak height falls as 1/√T because the area under the curve must stay 1.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const m = GASES[gas][1] * u;
    // fixed speed axis per gas (room for 2000 K) so the reader sees the curve move; height fits the 300 K curve
    const vmax = Math.sqrt(2 * k * 2000 / m) * 2.6;
    const top = f(Math.sqrt(2 * k * Math.min(T, 300) / m), m, Math.min(T, 300)) * 1.2;
    const ax = axes(ctx, w, h, col, { x: [0, vmax], y: [0, top], xlabel: 'speed v (m/s)', ylabel: 'f(v)', fy: () => '', t: 34 });
    title(ctx, `${GASES[gas][0]}: share of molecules per unit speed`, col);
    ctx.save(); ax.clip();
    const curve = (TT) => { const pts = []; for (let i = 0; i <= 300; i++) { const v = (i / 300) * vmax; pts.push([ax.X(v), ax.Y(f(v, m, TT))]); } return pts; };
    line(ctx, curve(300), col.muted, 1.3, [5, 4]);
    const pts = curve(T);
    ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(ax.X(vmax), ax.Y(0)); ctx.closePath();
    ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, pts, col.s[0], 2.5);
    const names = ['v_mp', 'v̄', 'v_rms'];
    speeds(m).forEach((v, i) => {
      const x = ax.X(v), y = ax.Y(f(v, m, T)), c = col.s[[2, 3, 4][i]];
      line(ctx, [[x, ax.Y(0)], [x, y]], c, 2);
      text(ctx, names[i], x, ax.Y(0) - 12 - i * 14, { color: c, size: 12, weight: 700, align: 'center', halo: col.panel });
    });
    ctx.restore();
  };
  cv.redraw(); show();
}
