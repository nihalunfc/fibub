// 2.5 The Tully-Fisher rule (1977). A spiral galaxy's gas spins; one side comes towards us (blueshift), the
// other goes away (redshift), so its hydrogen line is smeared out. The faster it spins, the more mass and
// the more stars it has, roughly L ∝ v⁴. Measure the spin, get the true power, compare with how bright
// it looks: a distance.
import { canvas, text, line, dot, row, slider, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.52, max: 360, min: 250, label: 'A spinning galaxy and its smeared hydrogen line' });
  let v = 220, ang = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Rotation speed', min: 60, max: 350, step: 5, value: v, fmt: (x) => `${x} km/s`, oninput: (x) => { v = x; show(); cv.redraw(); } });
  const out = readout(host);
  loop(host, (dt) => { ang += dt * v / 220; cv.redraw(); });
  const show = () => { out.innerHTML = `Spinning at ${v} km/s, the galaxy gives out about <b>${fmt((v / 220) ** 4)}×</b> the Milky Way's light (the Milky Way spins at about 220 km/s). The hydrogen line is about <b>${2 * v} km/s</b> wide.`; };
  cv.draw = (ctx, w, h, col) => {
    const gx = w * 0.28, gy = h * 0.5, R = Math.min(w * 0.22, h * 0.38);
    const size = R * (0.55 + 0.45 * (v / 350));
    // tilted disc with spiral dots
    for (let i = 0; i < 160; i++) {
      const rr = Math.sqrt((i + 1) / 160) * size, th = i * 2.4 + ang * (60 / (rr + 20));
      const x = gx + rr * Math.cos(th), y = gy + rr * Math.sin(th) * 0.35;
      const c = Math.cos(th) > 0.3 ? col.s[7] : Math.cos(th) < -0.3 ? col.s[0] : col.muted;
      dot(ctx, x, y, 1.8, Math.sin(th) > 0 ? c : col.muted);
    }
    text(ctx, 'blue side: coming towards us', 10, gy + size * 0.35 + 18, { color: col.s[0], size: 11, weight: 600 });
    text(ctx, 'red side: going away', 10, gy + size * 0.35 + 34, { color: col.s[7], size: 11, weight: 600 });
    // the line profile: a double-horned shape
    const L = w * 0.58, Rr = w - 16, base = h - 40, X = (u) => L + ((u + 400) / 800) * (Rr - L);
    line(ctx, [[L, base], [Rr, base]], col.muted, 1);
    const pts = [];
    for (let u = -400; u <= 400; u += 4) {
      const inside = Math.abs(u) < v;
      const y = inside ? 0.5 + 0.5 / Math.sqrt(Math.max(0.05, 1 - (u / v) ** 2)) * 0.6 : Math.exp(-(((Math.abs(u) - v) / 18) ** 2)) * 1.1;
      pts.push([X(u), base - Math.min(1.6, y) * (h * 0.32)]);
    }
    line(ctx, pts, col.s[2], 2);
    text(ctx, 'Hydrogen line (21 cm)', L, 30, { color: col.ink, size: 12, weight: 600 });
    text(ctx, '← blueshift', L, base + 14, { color: col.muted, size: 10.5 });
    text(ctx, 'redshift →', Rr, base + 14, { color: col.muted, size: 10.5, align: 'right' });
    line(ctx, [[X(-v), base + 24], [X(v), base + 24]], col.ink, 1.5);
    text(ctx, `width ≈ 2 × ${v} km/s`, (X(-v) + X(v)) / 2, base + 34, { color: col.ink, size: 11, weight: 600, align: 'center' });
  };
  cv.redraw(); show();
}
