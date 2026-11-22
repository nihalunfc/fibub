// Class 10 Statistics: the mean is the balance point. Each stack of blocks sits at a class mark and its height is the
// frequency. Slide the fulcrum along the beam: the beam tips towards the heavier side (sum of f × distance), and sits
// level exactly at the mean, because the pulls on both sides cancel: sum of f(x - mean) = 0.
import { canvas, text, title, row, slider, choice, readout, loop, clamp } from '../../kit.js';

const DS = {
  runs: { name: 'Runs of 40 batters', lo: 0, w: 20, f: [5, 9, 14, 8, 4] },
  skew: { name: 'A long tail to the right', lo: 0, w: 20, f: [12, 16, 8, 3, 1] },
  left: { name: 'A long tail to the left', lo: 0, w: 20, f: [1, 3, 8, 16, 12] },
};

export default function (host) {
  let key = 'runs', p = 30, tilt = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A beam with blocks at class marks balancing on a movable fulcrum at the mean' });
  const ctl = row(host);
  choice(ctl, 'Data', [['runs', 'Runs'], ['skew', 'Tail right'], ['left', 'Tail left']], key, (v) => { key = v; sync(); });
  const sl = slider(ctl, { label: 'Fulcrum', min: 0, max: 100, step: 0.5, value: p, fmt: (v) => v.toFixed(1), oninput: (v) => { p = v; sync(); } });
  const info = () => { const d = DS[key]; let n = 0, s = 0, t = 0; d.f.forEach((f, i) => { const x = d.lo + d.w * (i + 0.5); n += f; s += f * x; t += f * (x - p); }); return { n, mean: s / n, t }; };
  const out = readout(host);
  function sync() {
    const { n, mean, t } = info();
    out.innerHTML = `Mean x̄ = ${mean.toFixed(2)}. Net pull about the fulcrum = Σ f(x − ${p.toFixed(1)}) = <b>${t.toFixed(0)}</b>. ` + (Math.abs(t) < n * 0.4 ? '<b>Balanced!</b> The fulcrum is at the mean.' : t > 0 ? 'The right side is heavier: move the fulcrum right.' : 'The left side is heavier: move the fulcrum left.');
  }
  loop(host, () => { const { t, n } = info(), target = clamp(t / (n * 60), -0.28, 0.28); if (Math.abs(target - tilt) > 0.0005) { tilt += (target - tilt) * 0.12; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const d = DS[key], top = title(ctx, d.name + ': where does it balance?', col), nC = d.f.length;
    const L = 22, R = w - 22, X = (v) => L + (v / 100) * (R - L), by = h * 0.68;
    ctx.save(); ctx.translate(X(p), by); ctx.rotate(tilt); ctx.translate(-X(p), -by);
    ctx.fillStyle = col.ink; ctx.fillRect(L - 8, by, R - L + 16, 7);
    const s = Math.min(9, (by - top - 18) / 15);
    d.f.forEach((f, i) => {
      const x = X(d.lo + d.w * (i + 0.5));
      for (let j = 0; j < f; j++) { ctx.fillStyle = col.s[i % 2 ? 1 : 0]; ctx.globalAlpha = 0.85; ctx.fillRect(x - s * 1.6, by - (j + 1) * s, s * 3.2, s - 1); ctx.globalAlpha = 1; }
      text(ctx, String(d.lo + d.w * (i + 0.5)), x, by + 18, { color: col.muted, size: 10, align: 'center' });
    });
    ctx.restore();
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(X(p), by + 7); ctx.lineTo(X(p) - 14, by + 36); ctx.lineTo(X(p) + 14, by + 36); ctx.closePath(); ctx.fill();
    const m = info().mean;
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(m), by + 40); ctx.lineTo(X(m), h - 26); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'mean ' + m.toFixed(1), X(m), h - 14, { color: col.s[2], size: 11, weight: 700, align: 'center' });
  };
  sync(); cv.redraw();
}
