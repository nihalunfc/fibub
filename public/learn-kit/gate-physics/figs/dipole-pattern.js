// 3.9 Radiation patterns as polar plots in a plane containing the axis (axis drawn vertical for antennas,
// horizontal for a moving charge): short dipole sin²θ, half-wave dipole [cos(π/2 cosθ)/sinθ]², and a charge
// accelerated along its velocity, dP/dΩ ∝ sin²θ/(1 − β cosθ)^5, which tips forward as β grows.
import { canvas, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const PAT = {
  short: { name: 'Short dipole', f: (t) => Math.sin(t) ** 2 },
  half: { name: 'Half-wave dipole', f: (t) => { const s = Math.sin(t); return Math.abs(s) < 1e-6 ? 0 : (Math.cos((Math.PI / 2) * Math.cos(t)) / s) ** 2; } },
  brems: { name: 'Charge, a ∥ v', f: (t, b) => Math.sin(t) ** 2 / (1 - b * Math.cos(t)) ** 5 },
};
const directivity = (f, b) => { let s = 0, mx = 0; const N = 2000; for (let i = 0; i < N; i++) { const t = (Math.PI * (i + 0.5)) / N, v = f(t, b); s += v * Math.sin(t); mx = Math.max(mx, v); } return mx / ((s * Math.PI) / N / 2); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'Polar plot of the radiated intensity against direction' });
  let key = 'short', beta = 0.5;
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Source', Object.entries(PAT).map(([k, v]) => [k, v.name]), key, (v) => { key = v; upd(); });
  slider(ctl2, { label: 'Speed β (for the charge)', min: 0, max: 0.95, step: 0.01, value: beta, fmt: (v) => fmt(v, 2), oninput: (v) => { beta = v; upd(); } });
  const out = readout(host);
  const upd = () => {
    const P = PAT[key], Dv = directivity(P.f, beta);
    let peak = 90; if (key === 'brems') { let mx = 0; for (let t = 0.1; t < 180; t += 0.1) { const v = P.f(t * Math.PI / 180, beta); if (v > mx) { mx = v; peak = t; } } }
    out.innerHTML = `${P.name}: directivity (peak over average) <b>${fmt(Dv, 3)}</b>, peak at <b>${fmt(peak, 3)}°</b> from the axis${key === 'brems' ? ` (for β → 1 it tends to 1/(2γ); γ = ${fmt(1 / Math.sqrt(1 - beta * beta), 3)})` : ''}. Zero exactly along the axis in every case.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const P = PAT[key], horiz = key === 'brems';
    title(ctx, horiz ? 'Charge accelerated along its velocity (→)' : 'Antenna along the vertical axis', col);
    const cx = w / 2, cy = h / 2 + 12, R = Math.min(w * 0.42, h * 0.4);
    let mx = 0; for (let t = 0; t <= Math.PI; t += 0.002) mx = Math.max(mx, P.f(t, beta));
    for (const rr of [0.25, 0.5, 0.75, 1]) { const ring = []; for (let k = 0; k <= 90; k++) { const a = (k / 90) * 2 * Math.PI; ring.push([cx + R * rr * Math.cos(a), cy + R * rr * Math.sin(a)]); } line(ctx, ring, col.line, 1); }
    const axisPts = horiz ? [[cx - R - 10, cy], [cx + R + 10, cy]] : [[cx, cy - R - 10], [cx, cy + R + 10]];
    line(ctx, axisPts, col.muted, 1.5, [5, 4]);
    const curve = [];
    for (let k = 0; k <= 720; k++) {
      const t = (k / 720) * 2 * Math.PI, th = t <= Math.PI ? t : 2 * Math.PI - t, r = (P.f(th, beta) / mx) * R;
      const x = horiz ? r * Math.cos(th) : r * Math.sin(th) * (t <= Math.PI ? 1 : -1), y = horiz ? r * Math.sin(th) * (t <= Math.PI ? -1 : 1) : -r * Math.cos(th);
      curve.push([cx + x, cy + y]);
    }
    line(ctx, curve, col.s[0], 3);
    if (!horiz) { line(ctx, [[cx, cy - 18], [cx, cy + 18]], col.ink, 4); text(ctx, 'antenna', cx + 8, cy + 24, { color: col.ink, size: 11, halo: col.panel }); }
    else text(ctx, 'v, a →', cx + R * 0.55, cy + 16, { color: col.ink, size: 11, halo: col.panel });
    text(ctx, 'rings: 25, 50, 75, 100% of peak', 10, h - 10, { color: col.muted, size: 10 });
  };
  upd();
}
