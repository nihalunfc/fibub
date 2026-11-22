// A planet crosses its star and the starlight dips. Slide the planet's size, how close to the star's middle it crosses (impact
// parameter) and the orbital period: the dip depth is about (Rp/Rs)², the dip is rounded by limb darkening, and a longer
// period or a grazing path changes the length. Press a preset: Jupiter dims a Sun-like star by 1%, Earth by 0.008%.
import { canvas, text, row, slider, button, readout, loop, axes, line, dot, title } from '../kit.js';

const U = 0.6, RJ = 0.10045, RE = 0.009168; // limb-darkening coefficient; planet radius in solar radii
export default function (host) {
  let rp = 1.0, b = 0.3, per = 3.5, x = -1.6;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A planet crossing a limb-darkened star above the light curve it produces' });
  const c1 = row(host), c2 = row(host);
  const sr = slider(c1, { label: 'Planet radius', min: 0.05, max: 2, step: 0.01, value: rp, log: false, fmt: (v) => `${v.toFixed(2)} R♃ (${(v * 11.2).toFixed(1)} R⊕)`, oninput: (v) => { rp = v; curve(); } });
  slider(c1, { label: 'Impact parameter b', min: 0, max: 1, step: 0.01, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = v; curve(); } });
  slider(c1, { label: 'Period', min: 1, max: 30, step: 0.5, value: per, fmt: (v) => `${v} days`, oninput: (v) => { per = v; curve(); } });
  [['Jupiter', 1], ['Neptune', 0.35], ['Earth', 0.0892]].forEach(([n, v]) => button(c2, n, () => { rp = v; sr.set(v); curve(); }));
  const anim = loop(host, (dt) => { x += dt * 0.7; if (x > 1.7) x = -1.7; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  let C = [];
  const flux = (px) => {
    const k = rp * RJ, N = 70; let tot = 0, bl = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const sx = -1 + (2 * (i + 0.5)) / N, sy = -1 + (2 * (j + 0.5)) / N, r2 = sx * sx + sy * sy; if (r2 > 1) continue;
      const I = 1 - U * (1 - Math.sqrt(1 - r2)); tot += I; if ((sx - px) ** 2 + (sy - b) ** 2 < k * k) bl += I;
    }
    return 1 - bl / tot;
  };
  function curve() {
    C = []; for (let i = 0; i <= 120; i++) { const px = -1.7 + (3.4 * i) / 120; C.push([px, flux(px)]); }
    const k = rp * RJ, depth = 1 - Math.min(...C.map((q) => q[1])), aRs = 215 * Math.pow(per / 365.25, 2 / 3), arg = Math.sqrt(Math.max(0, (1 + k) ** 2 - b * b)) / aRs;
    const dur = arg <= 0 ? 0 : (per * 24 / Math.PI) * Math.asin(Math.min(1, arg));
    out.innerHTML = `Radius ratio Rp/Rs = <b>${k.toFixed(3)}</b>. Depth <b>${(depth * 100).toFixed(depth < 0.001 ? 4 : 2)}%</b> (simple estimate (Rp/Rs)² = ${(k * k * 100).toFixed(depth < 0.001 ? 4 : 2)}%; limb darkening makes a central transit a little deeper). Orbit a/R<sub>s</sub> ≈ ${aRs.toFixed(1)}, transit lasts about <b>${dur.toFixed(1)} h</b>${b > 0.9 ? ' (a grazing path: short and shallow)' : ''}. A planet crosses only if the orbit is edge-on enough: about 1 in ${Math.round(aRs)} orbits are lined up.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A transit (star radius = 1)', col);
    const top = h * 0.4, cx = w / 2, cy = 30 + top / 2, R = Math.min(top / 2 - 8, w * 0.22), k = rp * RJ;
    // star with limb darkening as radial gradient
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); [0, 0.5, 0.8, 0.95, 1].forEach((t) => { const mu = Math.sqrt(1 - t * t), I = 1 - U * (1 - mu), a = 90 + Math.round(165 * I); g.addColorStop(t, `rgb(${a},${Math.round(a * 0.82)},${Math.round(a * 0.25)})`); });
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = g; ctx.fill();
    const px = cx + x * R, py = cy + b * R; ctx.beginPath(); ctx.arc(px, py, Math.max(1.5, k * R), 0, 7); ctx.fillStyle = '#0a0a10'; ctx.fill();
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx - R * 1.7, py); ctx.lineTo(cx + R * 1.7, py); ctx.stroke(); ctx.restore();
    // light curve
    const ax = axes(ctx, w, h, col, { x: [-1.7, 1.7], y: [0.97, 1.003], t: 36 + top, l: 56, b: 30, xt: [-1, 0, 1], fx: () => '', yt: [0.97, 0.98, 0.99, 1], fy: (v) => `${(v * 100).toFixed(0)}%`, ylabel: 'brightness' });
    const pts = C.map(([qx, f]) => [ax.X(qx), ax.Y(Math.max(0.97, f))]); line(ctx, pts, col.s[0], 2.4);
    const fi = flux(x); dot(ctx, ax.X(x), ax.Y(Math.max(0.97, fi)), 5, col.s[5], col.panel);
    if (1 - Math.min(...C.map((q) => q[1])) > 0.03) text(ctx, 'dip deeper than the axis: reading goes off the bottom', ax.L + 6, ax.B - 10, { color: col.muted, size: 10 });
  };
  curve();
}
