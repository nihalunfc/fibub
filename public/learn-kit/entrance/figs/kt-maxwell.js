// Kinetic theory: the Maxwell distribution of molecular speeds. Choose a gas and a temperature; the curve shows
// what fraction of molecules move at each speed, with the most probable, average and rms speeds marked
// (always in the order v_p < v_avg < v_rms). Heavier or colder gases have a taller, narrower curve.
import { canvas, axes, line, text, row, slider, choice, readout } from '../../kit.js';

const R = 8.314;
const GASES = { h2: ['H₂', 0.002], he: ['He', 0.004], n2: ['N₂', 0.028], o2: ['O₂', 0.032], co2: ['CO₂', 0.044] };
export default function (host) {
  let gas = 'n2', T = 300, ghost = null;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'Distribution of molecular speeds in a gas with the three typical speeds marked' });
  const ctl = row(host);
  choice(ctl, 'Gas', Object.entries(GASES).map(([k, [nm]]) => [k, nm]), gas, (v) => { ghost = { gas, T }; gas = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Temperature', min: 100, max: 1500, step: 10, value: T, fmt: (v) => `${v} K`, oninput: (v) => { ghost = ghost || { gas, T }; T = v; cv.redraw(); show(); } });
  const out = readout(host);
  const speeds = (g, t) => { const M = GASES[g][1]; return { vp: Math.sqrt((2 * R * t) / M), va: Math.sqrt((8 * R * t) / (Math.PI * M)), vr: Math.sqrt((3 * R * t) / M) }; };
  const f = (g, t, v) => { const M = GASES[g][1], a = M / (2 * R * t); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v); };
  const show = () => {
    const { vp, va, vr } = speeds(gas, T);
    out.innerHTML = `${GASES[gas][0]} at ${T} K: most probable v<sub>p</sub> = √(2RT/M) = <b>${vp.toFixed(0)} m/s</b>, average √(8RT/πM) = <b>${va.toFixed(0)} m/s</b>, rms √(3RT/M) = <b>${vr.toFixed(0)} m/s</b>. ` +
      `Ratio 1 : 1.13 : 1.22. Average kinetic energy per molecule (3/2)kT = ${(1.5 * 1.380649e-23 * T * 1e21).toFixed(2)} × 10⁻²¹ J, the same for every gas at this temperature.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const vmax = gas === 'h2' || gas === 'he' ? 8000 : 2000;
    const peak = Math.max(f(gas, T, speeds(gas, T).vp), ghost && (ghost.gas === 'h2' || ghost.gas === 'he') === (vmax === 8000) ? f(ghost.gas, ghost.T, speeds(ghost.gas, ghost.T).vp) : 0);
    const { X, Y, clip, T: top, B } = axes(ctx, w, h, col, { x: [0, vmax], y: [0, peak * 1.15], xlabel: 'speed (m/s)', ylabel: 'fraction per m/s', fy: () => '', t: 26 });
    ctx.save(); clip();
    const curve = (g, t) => Array.from({ length: 201 }, (_, i) => { const v = (vmax * i) / 200; return [X(v), Y(f(g, t, v))]; });
    if (ghost && !(ghost.gas === gas && ghost.T === T)) line(ctx, curve(ghost.gas, ghost.T), col.muted, 1.5, [5, 4]);
    const pts = curve(gas, T);
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(X(vmax), Y(0)); ctx.closePath(); ctx.fill();
    line(ctx, pts, col.s[0], 2.5);
    const { vp, va, vr } = speeds(gas, T);
    [[vp, 'v_p', col.s[1]], [va, 'v_avg', col.s[2]], [vr, 'v_rms', col.s[3]]].forEach(([v, lab, c], i) => {
      line(ctx, [[X(v), B], [X(v), Y(f(gas, T, v))]], c, 2);
      text(ctx, lab, X(v) + 3, top + 10 + i * 14, { color: c, size: 11, weight: 700 });
    });
    ctx.restore();
    if (ghost && !(ghost.gas === gas && ghost.T === T)) text(ctx, `dashed: ${GASES[ghost.gas][0]} at ${ghost.T} K`, 60, 12, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
