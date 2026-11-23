// Class 11 Thermodynamics: why Cp is bigger than Cv. Warm one mole of gas from T to T + dT. At constant volume (vertical path) no work is done, Q = Cv dT. At constant pressure (horizontal path to the same final temperature isotherm... the end point lies on
// the higher isotherm) the gas also pushes the piston out, W = P dV = R dT, so Q = Cv dT + R dT = Cp dT and Cp - Cv = R (Mayer). Monatomic: Cv = 3R/2, Cp = 5R/2, gamma = 5/3. Diatomic (room temperature): Cv = 5R/2, Cp = 7R/2, gamma = 7/5.
import { canvas, text, title, axes, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let cvn = 1.5, dT = 100;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'Two isotherms on a P-V diagram with a constant-volume path and a constant-pressure path between them and bars for the heat needed' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Gas', [[1.5, 'monatomic (He)'], [2.5, 'diatomic (N₂)']], cvn, (v) => { cvn = v; go(); });
  slider(ctl, { label: 'temperature rise ΔT (K)', min: 20, max: 200, step: 10, value: dT, fmt: (v) => v + ' K', oninput: (v) => { dT = v; go(); } });
  const R = 8.314, T0 = 300;
  const go = () => { const Qv = cvn * R * dT, Qp = (cvn + 1) * R * dT; ro.textContent = `One mole warmed by ${dT} K: at constant volume Q = CᵥΔT = ${Qv.toFixed(0)} J. At constant pressure Q = CₚΔT = ${Qp.toFixed(0)} J: the extra ${(Qp - Qv).toFixed(0)} J = RΔT is the work of pushing the piston out. γ = Cₚ/Cᵥ = ${((cvn + 1) / cvn).toFixed(2)}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Cₚ − Cᵥ = R', col), gw = w * 0.58, Ag = axes(ctx, gw, h - 20, col, { x: [0, 5], y: [0, 6], xlabel: 'V', ylabel: 'P', l: 30, t: top + 8, b: 34, r: 8, xt: [], yt: [] });
    const f = (T) => T / T0 * 2.4; ctx.save(); Ag.clip(); [T0, T0 + dT].forEach((T, i) => { const p = []; for (let V = 0.5; V <= 5; V += 0.05) p.push([Ag.X(V), Ag.Y(f(T) * 1 / V * 1.0)]); line(ctx, p, i ? col.s[1] : col.s[0], 2); }); ctx.restore();
    const V1 = 1.2, P1 = f(T0) / V1, P2 = f(T0 + dT) / V1, V2 = f(T0 + dT) / P1;
    arrow(ctx, Ag.X(V1), Ag.Y(P1), Ag.X(V1), Ag.Y(P2) + 6, col.s[2], 3, 8); text(ctx, 'volume fixed', Ag.X(V1) + 6, Ag.Y((P1 + P2) / 2), { color: col.s[2], size: 10, weight: 700 });
    arrow(ctx, Ag.X(V1) + 3, Ag.Y(P1) + 0, Ag.X(V2) - 6, Ag.Y(P1), col.s[3], 3, 8); text(ctx, 'pressure fixed', Ag.X(V2 * 0.85), Ag.Y(P1) + 16, { color: col.s[3], size: 10, weight: 700, align: 'center' });
    dot(ctx, Ag.X(V1), Ag.Y(P1), 4.5, col.ink); text(ctx, T0 + ' K', Ag.X(4.9), Ag.Y(f(T0) / 4.9) - 10, { color: col.s[0], size: 10, weight: 700, align: 'right' }); text(ctx, (T0 + dT) + ' K', Ag.X(4.9), Ag.Y(f(T0 + dT) / 4.9) - 10, { color: col.s[1], size: 10, weight: 700, align: 'right' });
    const bx = gw + 14, by = h - 44, mx = (cvn + 1) * R * 200, sc = (by - top - 20) / mx, bw = (w - bx - 14) / 2 - 4, Qv = cvn * R * dT, W = R * dT;
    ctx.fillStyle = col.s[2]; ctx.fillRect(bx, by - Qv * sc, bw, Qv * sc); ctx.fillStyle = col.s[2]; ctx.fillRect(bx + bw + 8, by - Qv * sc, bw, Qv * sc); ctx.fillStyle = col.s[4]; ctx.fillRect(bx + bw + 8, by - (Qv + W) * sc, bw, W * sc);
    text(ctx, 'Qᵥ', bx + bw / 2, by + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'Qₚ', bx + bw * 1.5 + 8, by + 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'extra = W', bx + bw * 1.5 + 8, by - (Qv + W) * sc - 8, { color: col.s[4], size: 10, weight: 700, align: 'center' });
  };
  go();
}
