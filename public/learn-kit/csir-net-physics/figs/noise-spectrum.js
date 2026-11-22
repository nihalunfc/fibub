// 7.4 A noise spectrum and why we chop. Voltage noise density of an amplifier: white floor e_w with 1/f noise below
// the corner f_c, so S(f) = e_w^2 (1 + f_c/f). A DC measurement collects noise from about 0.01 Hz upwards; a lock-in
// at the chopping frequency f_r with bandwidth B collects only the shaded band. The readout compares the rms noise.
import { canvas, axes, line, row, slider, readout, title, text, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Noise spectral density with a 1/f corner and the narrow band seen by a lock-in amplifier' });
  let fc = 100, fr = 1000, B = 1;
  const ew = 5;   // nV/√Hz
  const ctl = row(host);
  slider(ctl, { label: '1/f corner (Hz)', min: 1, max: 10000, value: fc, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { fc = v; redo(); } });
  slider(ctl, { label: 'Chopping frequency (Hz)', min: 3, max: 30000, value: fr, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { fr = v; redo(); } });
  slider(ctl, { label: 'Lock-in bandwidth (Hz)', min: 0.01, max: 10, value: B, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { B = v; redo(); } });
  const out = readout(host);
  const S = (f) => ew * ew * (1 + fc / f);                 // nV²/Hz
  const band = (f1, f2) => ew * ew * ((f2 - f1) + fc * Math.log(f2 / f1));   // ∫S df
  const show = () => {
    const dc = Math.sqrt(band(0.01, 0.01 + B)), lo = Math.max(0.01, fr - B / 2), li = Math.sqrt(band(lo, lo + B));
    out.innerHTML = `Noise density at ${fmt(fr, 3)} Hz: <b>${fmt(Math.sqrt(S(fr)), 3)} nV/√Hz</b> (white floor ${ew}). Measuring at DC with the same ${fmt(B, 2)} Hz bandwidth (from 0.01 Hz, a 100 s record, up to ${fmt(0.01 + B, 2)} Hz) collects about <b>${fmt(dc, 3)} nV</b> rms; the lock-in band around ${fmt(fr, 3)} Hz collects <b>${fmt(li, 3)} nV</b>, ${fmt(dc / li, 3)} times less. Chop above the corner, then narrow the bandwidth: the noise falls as √B.`;
  };
  const redo = () => { cv.redraw(); show(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Noise density: 1/f below the corner, white above', col);
    const a = axes(ctx, w, h, col, { x: [0.1, 1e5], y: [1, 1e3], xlog: true, ylog: true, xlabel: 'frequency (Hz)', ylabel: 'noise density (nV/√Hz)', t: top + 6 });
    ctx.save(); a.clip();
    const lo = Math.max(0.1, fr - B / 2), hi = fr + B / 2;
    const xl = a.X(lo), xh = Math.max(a.X(hi), xl + 3);
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(xl, a.T, xh - xl, a.B - a.T); ctx.globalAlpha = 1;
    const pts = []; for (let i = 0; i <= 300; i++) { const f = 10 ** (-1 + 6 * i / 300); pts.push([a.X(f), a.Y(Math.sqrt(S(f)))]); }
    line(ctx, pts, col.s[0], 2.4);
    line(ctx, [[a.L, a.Y(ew)], [a.R, a.Y(ew)]], col.muted, 1, [4, 4]);
    line(ctx, [[a.X(fc), a.T], [a.X(fc), a.B]], col.s[3], 1.2, [3, 3]);
    line(ctx, [[a.X(fr), a.T], [a.X(fr), a.B]], col.s[2], 1.5);
    ctx.restore();
    text(ctx, 'corner', a.X(fc) + 4, a.T + 12, { color: col.s[3], size: 11, halo: col.panel });
    text(ctx, 'lock-in band', a.X(fr) + 4, a.T + 28, { color: col.s[2], size: 11, halo: col.panel });
    text(ctx, 'white floor', a.R - 6, a.Y(ew) - 9, { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  redo();
}
