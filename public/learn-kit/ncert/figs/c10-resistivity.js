// Class 10 Electricity: what a wire's resistance depends on. R = ρL/A: a longer wire is harder to push charge
// through (more collisions on the way), a thicker one easier (more lanes side by side), and the material sets ρ.
// The wire is drawn to scale for length and thickness; the bar compares its resistance with a reference wire.
import { canvas, text, title, line, row, slider, readout, choice, loop } from '../../kit.js';

const MAT = { cu: ['Copper', 1.62e-8], al: ['Aluminium', 2.63e-8], fe: ['Iron', 10e-8], ni: ['Nichrome', 100e-8] };
export default function (host) {
  let m = 'cu', L = 1, d = 0.5, t = 0; // length in m, diameter in mm
  const cv = canvas(host, { aspect: 0.5, max: 400, min: 240, label: 'A wire whose length, thickness and material change, with its resistance shown' });
  const ctl = row(host);
  choice(ctl, 'Material', Object.entries(MAT).map(([k, v]) => [k, v[0]]), m, (v) => { m = v; say(); });
  slider(ctl, { label: 'Length L', min: 0.5, max: 4, step: 0.5, value: L, fmt: (v) => `${v} m`, oninput: (v) => { L = v; say(); } });
  slider(ctl, { label: 'Diameter', min: 0.2, max: 1.2, step: 0.1, value: d, fmt: (v) => `${v.toFixed(1)} mm`, oninput: (v) => { d = v; say(); } });
  const out = readout(host);
  const area = () => Math.PI * (d / 2000) ** 2, R = () => (MAT[m][1] * L) / area();
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function say() {
    out.innerHTML = `A = π(d/2)² = ${(area() * 1e6).toFixed(3)} mm², ρ = ${MAT[m][1].toExponential(2).replace('e-', ' × 10<sup>−') + '</sup>'} Ω m, so R = ρL/A = <b>${R() < 1 ? R().toFixed(3) : R().toFixed(2)} Ω</b>. Double L → R doubles. Double the diameter → A is 4 times, R is a quarter.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'R = ρ L / A', col) + 10;
    const x0 = 20, maxLen = w - 40, len = Math.max(40, (L / 4) * maxLen), th = 6 + (d / 1.2) * 34, cy = top + (h - 46 - top) / 2 - 6;
    ctx.fillStyle = m === 'cu' ? '#c8773a' : m === 'al' ? '#a9b0b8' : m === 'fe' ? '#6d6d6d' : '#8a7f6a';
    ctx.fillRect(x0, cy - th / 2, len, th);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x0, cy - th / 2, len, th);
    // electrons bumping through: speed falls as R rises
    const n = Math.max(4, Math.round(th / 6)), sp = 60 / Math.sqrt(Math.max(0.02, R()));
    for (let k = 0; k < n * 6; k++) {
      const lane = k % n, x = x0 + ((t * Math.min(120, sp) + k * 37) % len), y = cy - th / 2 + ((lane + 0.5) / n) * th + Math.sin(t * 9 + k) * 1.5;
      ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill();
    }
    text(ctx, `${L} m`, x0 + len / 2, cy + th / 2 + 12, { color: col.muted, size: 11, align: 'center' });
    // comparison bar against 1 m of 0.5 mm copper
    const ref = (1.62e-8 * 1) / (Math.PI * 0.00025 ** 2), ratio = R() / ref;
    const by = h - 46, bw = w - 40, f = Math.min(1, Math.log10(1 + ratio) / Math.log10(1 + 800));
    text(ctx, `Resistance: ${ratio < 10 ? ratio.toFixed(2) : Math.round(ratio)} × that of 1 m of 0.5 mm copper wire`, x0, by - 10, { color: col.ink, size: 11.5, weight: 600 });
    ctx.fillStyle = col.soft; ctx.fillRect(x0, by, bw, 14); ctx.fillStyle = col.s[1]; ctx.fillRect(x0, by, Math.max(2, bw * f), 14);
    text(ctx, 'scale is logarithmic', x0, by + 26, { color: col.muted, size: 10 });
  };
  say();
}
