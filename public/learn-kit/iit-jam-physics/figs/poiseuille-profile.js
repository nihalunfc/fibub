// 2.8 Poiseuille flow. Laminar flow through a round pipe has a parabolic speed profile, zero at the wall and largest
// on the axis. Arrows show the speed across the pipe; dots drift with the flow. The readout gives the flow rate,
// which goes as the fourth power of the radius. Water at 20 °C (viscosity 1.0 mPa s), pipe 1 m long.
import { canvas, text, line, arrow, row, slider, readout, fmt, loop, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 230, label: 'Parabolic speed profile in a pipe with tracer dots' });
  let R = 1, dp = 40, t = 0; // radius in mm, pressure difference in Pa
  const eta = 1e-3, L = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Radius (mm)', min: 0.3, max: 2, step: 0.05, value: R, fmt: (x) => fmt(x, 3), oninput: (x) => { R = x; show(); cv.redraw(); } });
  slider(ctl, { label: 'Pressure difference (Pa)', min: 5, max: 100, step: 1, value: dp, fmt: (x) => fmt(x, 3), oninput: (x) => { dp = x; show(); cv.redraw(); } });
  const lp = loop(host, (dt) => { t += dt; cv.redraw(); });
  lp.button(ctl);
  const out = readout(host);
  const vmax = () => dp * (R * 1e-3) ** 2 / (4 * eta * L); // m/s
  const show = () => {
    const Q = Math.PI * dp * (R * 1e-3) ** 4 / (8 * eta * L);
    const Re = 1000 * (vmax() / 2) * (2 * R * 1e-3) / eta;
    out.innerHTML = `Speed on the axis <b>${fmt(vmax() * 1000, 3)} mm/s</b>, average ${fmt(vmax() * 500, 3)} mm/s (half). Flow rate Q = πΔp r⁴/8ηL = <b>${fmt(Q * 1e9, 3)} mm³/s</b>. Reynolds number ${fmt(Re, 2)}${Re > 2000 ? ' (too high: the flow would turn turbulent)' : ' (laminar)'}. Double the radius and Q grows 16 times.`;
  };
  const seeds = Array.from({ length: 36 }, (_, i) => ({ s: ((i * 0.6180339) % 1) * 2 - 1, x: (i * 0.37) % 1 }));
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Speed across a pipe in laminar flow', col);
    const cy = H / 2 + 8, hr = (H - 70) / 2 * Math.min(1, R / 2) + 8, x0 = 20, x1 = W - 20;
    ctx.fillStyle = col.line; ctx.fillRect(x0, cy - hr - 6, x1 - x0, 6); ctx.fillRect(x0, cy + hr, x1 - x0, 6);
    // profile arrows from a base line
    const base = x0 + 30, scale = Math.min(W * 0.45, 220) / 2.0; // px per (v/vmax at R = 2 mm, dp = 100)
    const vref = 100 * (2e-3) ** 2 / (4 * eta * L);
    const vm = vmax() / vref * scale * 2;
    line(ctx, [[base, cy - hr], [base, cy + hr]], col.muted, 1, [3, 3]);
    const prof = [];
    for (let k = -10; k <= 10; k++) {
      const s = k / 10, y = cy + s * hr, len = vm * (1 - s * s);
      if (k % 2 === 0 && len > 4) arrow(ctx, base, y, base + len, y, col.s[0], 1.6, 6);
      prof.push([base + len, y]);
    }
    line(ctx, prof, col.s[0], 2);
    // tracer dots drifting at the local speed
    for (const d of seeds) {
      const v = 1 - d.s * d.s, span = x1 - (base + vm + 20), start = base + vm + 20;
      if (span < 30) continue;
      const x = start + ((d.x * span + t * 60 * v * Math.min(2, vmax() / vref * 2)) % span);
      ctx.beginPath(); ctx.arc(x, cy + d.s * hr * 0.95, 2.6, 0, Math.PI * 2); ctx.fillStyle = col.s[1]; ctx.fill();
    }
    text(ctx, 'wall: speed 0', x1 - 4, cy - hr - 12, { color: col.muted, size: 10.5, align: 'right', base: 'bottom' });
    text(ctx, 'axis: fastest', base + vm + 6, cy, { color: col.ink, size: 10.5 });
  };
  cv.redraw(); show();
}
