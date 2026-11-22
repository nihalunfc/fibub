// 7.6 Inverting and non-inverting amplifiers with live gain. Top: the circuit, with the node voltages written on
// it. Bottom: the transfer curve V_out against V_in, clipped at the saturation levels of a +/-12 V supply
// (+/-11 V swing), with the present input marked. Sliders set R_in (or R_1), R_f and V_in.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const VSAT = 11;

function resistor(ctx, x0, y0, x1, y1, color) {
  // a zig-zag resistor between two points (horizontal or vertical)
  const n = 6, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, px = -uy, py = ux;
  const lead = L * 0.25, body = L - 2 * lead, amp = Math.min(6, L * 0.08);
  const pts = [[x0, y0], [x0 + ux * lead, y0 + uy * lead]];
  for (let i = 1; i <= n; i++) {
    const s = lead + (body * (i - 0.5)) / n, sg = i % 2 ? 1 : -1;
    pts.push([x0 + ux * s + px * amp * sg, y0 + uy * s + py * amp * sg]);
  }
  pts.push([x0 + ux * (L - lead), y0 + uy * (L - lead)], [x1, y1]);
  line(ctx, pts, color, 1.6);
}
function ground(ctx, x, y, color) {
  line(ctx, [[x - 9, y], [x + 9, y]], color, 1.6);
  line(ctx, [[x - 6, y + 4], [x + 6, y + 4]], color, 1.4);
  line(ctx, [[x - 3, y + 8], [x + 3, y + 8]], color, 1.2);
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 560, min: 400, label: 'Op-amp amplifier circuit and its transfer curve' });
  let mode = 'inv', Rin = 10, Rf = 47, Vin = 0.5;
  const ctl = row(host);
  const out = readout(host);
  const gain = () => (mode === 'inv' ? -Rf / Rin : 1 + Rf / Rin);
  const vout = (v) => Math.max(-VSAT, Math.min(VSAT, gain() * v));
  const show = () => {
    const ideal = gain() * Vin, sat = Math.abs(ideal) > VSAT;
    out.innerHTML = `Gain ${mode === 'inv' ? '−R<sub>f</sub>/R<sub>in</sub>' : '1 + R<sub>f</sub>/R<sub>1</sub>'} = <b>${fmt(gain(), 3)}</b>. V<sub>out</sub> = <b>${fmt(vout(Vin), 3)} V</b>` +
      (sat ? ` — SATURATED: the ideal value ${fmt(ideal, 3)} V is beyond the ±${VSAT} V swing, so the virtual short no longer holds.` : `. The inverting input sits at ${mode === 'inv' ? '0 V (virtual ground)' : `${fmt(Vin, 3)} V, the same as the + input (virtual short)`}.`);
  };
  choice(ctl, 'Circuit', [['inv', 'Inverting'], ['non', 'Non-inverting']], mode, (v) => { mode = v; cv.redraw(); show(); });
  slider(ctl, { label: 'R_in or R_1 (kΩ)', min: 1, max: 100, log: true, value: Rin, fmt: (v) => fmt(v, 2), oninput: (v) => { Rin = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'R_f (kΩ)', min: 1, max: 1000, log: true, value: Rf, fmt: (v) => fmt(v, 2), oninput: (v) => { Rf = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'V_in (V)', min: -2, max: 2, step: 0.01, value: Vin, fmt: (v) => fmt(v, 3), oninput: (v) => { Vin = v; cv.redraw(); show(); } });

  cv.draw = (ctx, w, h, col) => {
    // ---- circuit (top 48%) ----
    const H = h * 0.48, ink = col.ink, hot = col.s[0];
    const cx = w * 0.56, cy = H * 0.58, tw = Math.min(110, w * 0.22), th = tw * 0.9;
    const xL = cx - tw / 2, xR = cx + tw / 2, yM = cy - th * 0.25, yP = cy + th * 0.25; // - input top, + input bottom
    line(ctx, [[xL, cy - th / 2], [xR, cy], [xL, cy + th / 2], [xL, cy - th / 2]], ink, 2);
    text(ctx, '−', xL + 8, yM, { color: ink, size: 15, weight: 700 });
    text(ctx, '+', xL + 8, yP, { color: ink, size: 15, weight: 700 });
    const xo = Math.min(w - 40, xR + 40), xs = Math.max(30, xL - tw * 1.3), yTop = cy - th * 0.95;
    line(ctx, [[xR, cy], [xo, cy]], hot, 2);
    dot(ctx, xo, cy, 3.5, hot);
    text(ctx, `V_out = ${fmt(vout(Vin), 3)} V`, xo - 4, cy + 18, { color: hot, size: 12, weight: 700, align: 'right' });
    // feedback resistor over the top
    const xn = xL - 18; // node on the inverting input
    line(ctx, [[xL, yM], [xn, yM], [xn, yTop]], ink, 1.6);
    resistor(ctx, xn, yTop, xo - 10, yTop, ink);
    line(ctx, [[xo - 10, yTop], [xo, yTop], [xo, cy]], ink, 1.6);
    text(ctx, `R_f = ${fmt(Rf, 2)} kΩ`, (xn + xo) / 2, yTop - 13, { color: ink, size: 11, align: 'center' });
    dot(ctx, xn, yM, 3, ink);
    if (mode === 'inv') {
      resistor(ctx, xs + 14, yM, xn, yM, ink);
      text(ctx, `R_in = ${fmt(Rin, 2)} kΩ`, (xs + xn) / 2 + 6, yM - 14, { color: ink, size: 11, align: 'center' });
      line(ctx, [[xs, yM], [xs + 14, yM]], col.s[2], 2);
      text(ctx, `V_in = ${fmt(Vin, 3)} V`, xs - 4, yM + 16, { color: col.s[2], size: 12, weight: 700 });
      line(ctx, [[xL, yP], [xL - 12, yP], [xL - 12, yP + 12]], ink, 1.6);
      ground(ctx, xL - 12, yP + 12, ink);
      text(ctx, '0 V (virtual ground)', xn - 4, yM + 14, { color: col.muted, size: 10, align: 'right' });
    } else {
      resistor(ctx, xn, yM, xn, Math.min(H - 14, yM + th * 0.95), ink);
      ground(ctx, xn, Math.min(H - 14, yM + th * 0.95), ink);
      text(ctx, `R_1 = ${fmt(Rin, 2)} kΩ`, xn - 10, yM + th * 0.5, { color: ink, size: 11, align: 'right' });
      line(ctx, [[xs, yP], [xL, yP]], col.s[2], 2);
      text(ctx, `V_in = ${fmt(Vin, 3)} V`, xs - 4, yP - 14, { color: col.s[2], size: 12, weight: 700 });
      text(ctx, `${fmt(Math.abs(vout(Vin)) < VSAT ? Vin : vout(Vin) / gain(), 3)} V`, xn + 6, yM - 12, { color: col.muted, size: 10 });
    }
    // ---- transfer curve (bottom) ----
    const ax = axes(ctx, w, h, col, { x: [-2, 2], y: [-12, 12], t: H + 18, yt: [-11, 0, 11], xlabel: 'V_in (V)', ylabel: 'V_out (V)' });
    line(ctx, [[ax.L, ax.Y(VSAT)], [ax.R, ax.Y(VSAT)]], col.muted, 1, [3, 4]);
    line(ctx, [[ax.L, ax.Y(-VSAT)], [ax.R, ax.Y(-VSAT)]], col.muted, 1, [3, 4]);
    const xs2 = Array.from({ length: 401 }, (_, i) => -2 + (4 * i) / 400);
    line(ctx, xs2.map((v) => [ax.X(v), ax.Y(vout(v))]), hot, 2.5);
    dot(ctx, ax.X(Vin), ax.Y(vout(Vin)), 5.5, col.s[3], col.panel);
    text(ctx, 'saturation', ax.L + 6, ax.Y(VSAT) + 10, { color: col.muted, size: 10 });
  };
  cv.redraw(); show();
}
