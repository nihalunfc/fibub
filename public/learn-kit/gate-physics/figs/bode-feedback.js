// 9.2 Bode plot with feedback. An amplifier with DC gain A0 and two or three real poles; a flat feedback factor beta.
// Top: |A| (open loop), |1/beta| and the closed-loop gain |A/(1 + A beta)| in dB. Bottom: phase of the loop gain.
// Readout: loop-gain crossover, phase margin, closed-loop peaking. Where |A| meets 1/beta is where the loop gain is 1.
import { canvas, row, slider, choice, readout, axes, line, dot, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.86, max: 560, min: 380, label: 'Bode magnitude and phase of an amplifier with and without negative feedback, with the phase margin marked' });
  let poles = 2, A0db = 80, f2 = 5, bdb = 20; // first pole 10 Hz; f2 = log10 of second pole (Hz); 1/beta in dB
  const f1 = 10;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Poles', [[2, 'Two'], [3, 'Three (equal 2nd and 3rd)']], poles, (v) => { poles = v; re(); });
  slider(ctl, { label: 'Closed-loop target 1/β (dB)', min: 0, max: 70, step: 1, value: bdb, fmt: (v) => `${v} dB`, oninput: (v) => { bdb = v; re(); } });
  slider(ctl, { label: 'Second pole (Hz)', min: 3, max: 7, step: 0.05, value: f2, fmt: (v) => fmt(10 ** v, 2), oninput: (v) => { f2 = v; re(); } });
  slider(ctl, { label: 'Open-loop DC gain (dB)', min: 40, max: 110, step: 1, value: A0db, fmt: (v) => `${v} dB`, oninput: (v) => { A0db = v; re(); } });
  const A = (f) => { // complex open-loop gain as [mag, phase(rad)]
    const A0 = 10 ** (A0db / 20), p2 = 10 ** f2;
    let mag = A0 / Math.hypot(1, f / f1), ph = -Math.atan(f / f1);
    for (let i = 1; i < poles; i++) { mag /= Math.hypot(1, f / p2); ph -= Math.atan(f / p2); }
    return [mag, ph];
  };
  const beta = () => 10 ** (-bdb / 20);
  const closed = (f) => { const [m, p] = A(f), b = beta(); const re_ = 1 + b * m * Math.cos(p), im = b * m * Math.sin(p); return m / Math.hypot(re_, im); };
  const crossing = () => { // loop gain |A beta| = 1
    const b = beta(); let lo = 1e-2, hi = 1e10; if (A(lo)[0] * b < 1) return null;
    for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); if (A(m)[0] * b > 1) lo = m; else hi = m; }
    return lo;
  };
  const show = () => {
    const fc = crossing();
    if (!fc) { out.innerHTML = 'The loop gain is below 1 even at DC: the feedback hardly acts (closed loop ≈ open loop).'; return; }
    const pm = 180 + A(fc)[1] * 180 / Math.PI;
    let peak = 0, fpk = 0; for (let e = -1; e <= 9; e += 0.01) { const g = closed(10 ** e); if (g > peak) { peak = g; fpk = 10 ** e; } }
    const flat = closed(1e-2), pk = 20 * Math.log10(peak / flat);
    out.innerHTML = `Loop gain at DC = ${fmt(A0db - bdb, 3)} dB. Loop gain reaches 1 at <b>${fmt(fc, 3)} Hz</b>, where its phase is ${fmt(A(fc)[1] * 180 / Math.PI, 3)}°: phase margin <b>${fmt(pm, 3)}°</b>. ${pm <= 0 ? '<b>Unstable</b>: the closed loop would oscillate.' : pk > 0.05 ? `Closed-loop peaking ${fmt(pk, 2)} dB near ${fmt(fpk, 3)} Hz${pm < 45 ? ' (ringing in the step response)' : ''}.` : 'No peaking: a well-damped response.'}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = H * 0.6;
    ctx.save();
    const ax = axes(ctx, W, split, col, { x: [1, 1e9], y: [-40, 120], xlog: true, ylabel: 'gain (dB)', t: 32, b: 22, fx: () => '' });
    title(ctx, 'Gain: open loop, 1/β and closed loop', col);
    ctx.save(); ax.clip();
    const op = [], cl = []; for (let e = 0; e <= 9; e += 0.02) { const f = 10 ** e; op.push([ax.X(f), ax.Y(20 * Math.log10(A(f)[0]))]); cl.push([ax.X(f), ax.Y(20 * Math.log10(closed(f)))]); }
    line(ctx, op, col.s[0], 2.2);
    line(ctx, [[ax.X(1), ax.Y(bdb)], [ax.X(1e9), ax.Y(bdb)]], col.muted, 1.3, [6, 4]);
    line(ctx, cl, col.s[4], 2.6);
    line(ctx, [[ax.X(1), ax.Y(0)], [ax.X(1e9), ax.Y(0)]], col.line, 1);
    const fc = crossing(); if (fc) dot(ctx, ax.X(fc), ax.Y(bdb), 5.5, col.ink, col.panel);
    ctx.restore();
    text(ctx, 'open loop |A|', ax.X(30), ax.Y(Math.min(115, A0db)) + 12, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'closed loop', ax.X(3), ax.Y(bdb) + 14, { color: col.s[4], size: 11, weight: 700, halo: col.panel });
    text(ctx, '1/β', ax.R - 6, ax.Y(bdb) - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    ctx.restore();
    ctx.save(); ctx.translate(0, split);
    const bx = axes(ctx, W, H - split, col, { x: [1, 1e9], y: [-270, 0], xlog: true, xlabel: 'frequency (Hz)', ylabel: 'loop phase (°)', t: 8, yt: [-270, -180, -90, 0] });
    ctx.save(); bx.clip();
    const ph = []; for (let e = 0; e <= 9; e += 0.02) ph.push([bx.X(10 ** e), bx.Y(A(10 ** e)[1] * 180 / Math.PI)]);
    line(ctx, ph, col.s[2], 2.2);
    line(ctx, [[bx.X(1), bx.Y(-180)], [bx.X(1e9), bx.Y(-180)]], col.bad || col.muted, 1.2, [4, 4]);
    if (fc) { const p = A(fc)[1] * 180 / Math.PI; line(ctx, [[bx.X(fc), bx.Y(-180)], [bx.X(fc), bx.Y(p)]], col.ink, 2); dot(ctx, bx.X(fc), bx.Y(p), 4.5, col.ink, col.panel); text(ctx, 'phase margin', bx.X(fc) + 6, bx.Y((p - 180) / 2), { color: col.ink, size: 10.5, halo: col.panel }); }
    ctx.restore(); ctx.restore();
  };
  re();
}
