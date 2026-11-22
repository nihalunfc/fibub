// 2.4 Type Ia supernovae are "standardisable" candles. Raw peak brightnesses scatter, but brighter explosions
// fade more slowly (the Phillips relation, 1993). Stretch each light curve to a common width and correct its
// peak, and they line up to within about 10% in distance. The curves here are made up with that pattern.
import { canvas, text, line, axes, row, button, readout, ease, loop, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Several supernova light curves before and after correcting for how fast they fade' });
  const r = rng(9);
  const SN = Array.from({ length: 7 }, () => { const s = 0.8 + r() * 0.4; return { s, M: -19.3 - 1.4 * (s - 1) + (r() - 0.5) * 0.12 }; });
  const shape = (x) => x < 0 ? Math.min(3, 0.04 * x * x) : 1.6 * (1 - Math.exp(-x / 18)) + 0.02 * x; // magnitudes below peak
  let fixedK = 0, target = 0;
  const ctl = row(host);
  const b = button(ctl, 'Correct for fade speed', () => { target = target ? 0 : 1; b.textContent = target ? 'Show raw curves' : 'Correct for fade speed'; anim.play(); });
  const out = readout(host);
  const anim = loop(host, (dt) => { if (fixedK !== target) { fixedK += Math.sign(target - fixedK) * Math.min(Math.abs(target - fixedK), dt); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(fixedK);
    const a = axes(ctx, w, h, col, { x: [-15, 50], y: [-17, -20.2], xlabel: 'days from peak', ylabel: 'true brightness (magnitude)', t: 34, fy: (v) => v.toFixed(1) });
    a.clip && ctx.save(); a.clip();
    SN.forEach((sn, i) => {
      const peak = sn.M + e * (1.4 * (sn.s - 1)), st = 1 + e * (1 / sn.s - 1);
      const pts = []; for (let t = -15; t <= 50; t += 1) pts.push([a.X(t), a.Y(peak + shape((t * st) / sn.s))]);
      line(ctx, pts, col.s[i % 8], 2);
    });
    ctx.restore();
    text(ctx, e > 0.5 ? 'After correction: nearly one curve' : 'Raw: bright ones fade slowly, faint ones fast', 10, 16, { color: col.ink, size: 12, weight: 600 });
    const peaks = SN.map((sn) => sn.M + e * 1.4 * (sn.s - 1)), mean = peaks.reduce((q, v) => q + v, 0) / peaks.length;
    const sd = Math.sqrt(peaks.reduce((q, v) => q + (v - mean) ** 2, 0) / peaks.length);
    out.innerHTML = `Spread in peak brightness: <b>${sd.toFixed(2)} magnitudes</b>, which means distances good to about <b>${Math.round((Math.pow(10, sd / 5) - 1) * 100)}%</b>.`;
  };
  cv.redraw();
}
