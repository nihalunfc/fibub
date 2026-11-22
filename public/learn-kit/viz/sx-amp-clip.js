// A common-emitter amplifier at work. Left: the DC load line I_C = (V_CC − V_CE)/R_C (V_CC = 12 V, R_C = 2 kΩ) with the
// Q-point and the swinging operating point. Right: the input voltage and the output V_CE against time. I_C follows the
// exponential I_C = I_CQ e^(v_be/V_T), so a big input is squashed on one side; if the output reaches saturation
// (V_CE ≈ 0.2 V) or cutoff (V_CE = V_CC) it clips. Move the Q-point and the input size.
import { canvas, axes, line, dot, text, row, slider, readout, loop, title } from '../kit.js';

const VCC = 12, RC = 2000, VT = 0.02585, VSAT = 0.2;
export default function (host) {
  let ph = 0;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Load line with Q-point, and input and output waveforms of a transistor amplifier' });
  const ctl = row(host);
  const sq = slider(ctl, { label: 'Bias current I_CQ', min: 0.4, max: 5.4, step: 0.1, value: 2.8, fmt: (v) => v.toFixed(1) + ' mA', oninput: () => cv.redraw() });
  const sv = slider(ctl, { label: 'Input amplitude', min: 1, max: 60, step: 1, value: 10, fmt: (v) => v + ' mV', oninput: () => cv.redraw() });
  loop(host, (dt) => { ph += dt * 2; cv.redraw(); }).button(row(host));
  const out = readout(host);
  const ic = (vin) => Math.min((VCC - VSAT) / RC * 1000, sq.value * Math.exp(vin / 1000 / VT));
  const vce = (vin) => VCC - (ic(vin) * RC) / 1000;
  cv.draw = (ctx, w, h, col) => {
    const split = Math.round(w * 0.42), vq = VCC - (sq.value * RC) / 1000, A = sv.value;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, split, h); ctx.clip();
    const L = axes(ctx, split, h, col, { x: [0, 12], y: [0, 6], xlabel: 'V_CE (V)', ylabel: 'I_C (mA)', l: 36, r: 6, t: 36, xt: [0, 6, 12], yt: [0, 3, 6] });
    line(ctx, [[L.X(0), L.Y(6)], [L.X(12), L.Y(0)]], col.s[2], 2);
    const now = A * Math.sin(ph), lo = vce(-A), hi = vce(A);
    line(ctx, [[L.X(Math.max(0, lo)), L.Y((VCC - Math.max(0, lo)) / 2)], [L.X(Math.min(12, hi)), L.Y((VCC - Math.min(12, hi)) / 2)]], col.s[1], 5);
    dot(ctx, L.X(vq), L.Y(sq.value), 5, col.ink); dot(ctx, L.X(vce(now)), L.Y(ic(now)), 6, col.s[1], col.ink);
    ctx.restore();
    text(ctx, 'Q', L.X(vq) + 7, L.Y(sq.value) - 8, { color: col.ink, size: 11, weight: 700 });
    // waveforms
    const L2 = split + 4, W2 = w - L2 - 8, T2 = 40, B2 = h - 30, M = (T2 + B2) / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L2 + 22, T2); ctx.lineTo(L2 + 22, B2); ctx.lineTo(L2 + W2, B2); ctx.stroke();
    const Yo = (v) => B2 - (v / 12) * (B2 - T2), Xo = (i) => L2 + 22 + (i / 120) * (W2 - 24);
    [0, 6, 12].forEach((v) => text(ctx, String(v), L2 + 18, Yo(v), { color: col.muted, size: 10, align: 'right' }));
    line(ctx, [[L2 + 22, Yo(VSAT)], [L2 + W2, Yo(VSAT)]], col.bad, 1, [3, 3]);
    text(ctx, 'saturation', L2 + W2, Yo(VSAT) - 7, { color: col.bad, size: 9.5, align: 'right' });
    const pin = [], pout = [];
    for (let i = 0; i <= 120; i++) { const v = A * Math.sin((i / 120) * 4 * Math.PI - ph); pin.push([Xo(i), M + (v / 60) * (B2 - T2) * 0.2]); pout.push([Xo(i), Yo(vce(v))]); }
    line(ctx, pin, col.muted, 2); line(ctx, pout, col.s[0], 2.5);
    text(ctx, 'v_in', Xo(2), M + 14, { color: col.muted, size: 10.5, weight: 600 }); text(ctx, 'V_CE (output)', Xo(40), T2 - 6, { color: col.s[0], size: 10.5, weight: 700 });
    title(ctx, 'Common-emitter amplifier', col);
    const swing = hi - lo, gm = sq.value / 1000 / VT, clipped = hi >= 11.95 || lo <= VSAT + 0.01 || sq.value * Math.exp(A / 1000 / VT) > (VCC - VSAT) / 2;
    out.innerHTML = `<b>Q-point: I_C = ${sq.value.toFixed(1)} mA, V_CE = ${vq.toFixed(1)} V.</b> Small-signal gain = −g_mR_C = −${(gm * RC).toFixed(0)} (g_m = I_C/V_T = ${(gm * 1000).toFixed(0)} mS), inverted. Output swings ${Math.max(0, lo).toFixed(1)} to ${Math.min(12, hi).toFixed(1)} V for a ±${A} mV input. ${sq.value * Math.exp(A / 1000 / VT) > (VCC - VSAT) / 2 ? 'The bottom of the output is flat: the transistor saturates. ' : ''}${sq.value < 1 && A > 8 ? 'The top is squashed: the transistor is near cutoff. ' : ''}${!clipped ? 'No clipping: the Q-point is near the middle of the load line (V_CE ≈ V_CC/2 gives the biggest clean swing). Note the tops and bottoms are not mirror images: the exponential makes the output slightly distorted.' : 'Shrink the input, or move the Q-point towards the middle of the load line, to remove the clipping.'}`;
  };
  cv.redraw();
}
