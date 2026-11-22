// Gibbs energy against temperature: ΔG = ΔH − TΔS is a straight line with intercept ΔH and slope −ΔS. Move the
// sliders to see the four sign cases, the shaded spontaneous region (ΔG < 0) and the crossover temperature.
import { canvas, axes, line, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let dH = 100, dS = 150; // kJ/mol, J/(K mol)
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Gibbs energy change against temperature for chosen enthalpy and entropy changes' });
  const ctl = row(host);
  slider(ctl, { label: 'ΔH', min: -200, max: 200, step: 5, value: dH, fmt: (v) => `${v} kJ/mol`, oninput: (v) => { dH = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'ΔS', min: -400, max: 400, step: 10, value: dS, fmt: (v) => `${v} J/(K mol)`, oninput: (v) => { dS = v; cv.redraw(); show(); } });
  const out = readout(host);
  const Tx = () => (dS !== 0 ? (dH * 1000) / dS : NaN);
  const show = () => {
    const t = Tx();
    let msg;
    if (dH <= 0 && dS >= 0) msg = 'ΔH negative and ΔS positive: spontaneous at <b>every</b> temperature.';
    else if (dH >= 0 && dS <= 0) msg = 'ΔH positive and ΔS negative: <b>never</b> spontaneous (the reverse reaction is).';
    else if (dH < 0) msg = `Both negative: spontaneous only <b>below ${fmt(t, 3)} K</b>, where the favourable ΔH outweighs −TΔS.`;
    else msg = `Both positive: spontaneous only <b>above ${fmt(t, 3)} K</b>, where −TΔS outweighs the unfavourable ΔH.`;
    out.innerHTML = `${msg} At 298 K, ΔG = ${fmt(dH - (298 * dS) / 1000, 3)} kJ/mol.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const T1 = 1500, G = (T) => dH - (T * dS) / 1000;
    const A = axes(ctx, w, h, col, { x: [0, T1], y: [-800, 800], xlabel: 'temperature T (K)', ylabel: 'ΔG (kJ/mol)', l: 46, t: 24 });
    ctx.save(); A.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(A.L, A.Y(0), A.R - A.L, A.B - A.Y(0));
    line(ctx, [[A.X(0), A.Y(0)], [A.X(T1), A.Y(0)]], col.muted, 1.5);
    line(ctx, [[A.X(0), A.Y(G(0))], [A.X(T1), A.Y(G(T1))]], col.s[0], 3);
    const t = Tx();
    if (t > 0 && t < T1) {
      line(ctx, [[A.X(t), A.T], [A.X(t), A.B]], col.s[2], 1.5, [5, 4]);
      ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(A.X(t), A.Y(0), 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    text(ctx, 'spontaneous (ΔG < 0)', A.L + 6, A.B - 10, { color: col.good || col.ink, size: 11, weight: 600 });
    text(ctx, 'not spontaneous', A.L + 6, A.T + 10, { color: col.muted, size: 11 });
    if (t > 0 && t < T1) text(ctx, `T = ${fmt(t, 3)} K`, A.X(t) + 6, A.Y(0) - 12, { color: col.s[2], size: 11, weight: 600, halo: col.panel });
  };
  cv.redraw(); show();
}
