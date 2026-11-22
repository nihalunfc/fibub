// Tides from above the north pole: the sea bulges towards the Moon and away from it, and the Earth turns under the bulges, so
// you get two high tides a day. The Sun adds a smaller pair of bulges (about 46% of the Moon's). Slide the Moon's age: at new and
// full Moon the pairs line up (spring tides, biggest range); at the quarters they cross (neap tides). Bulges drawn far too big.
import { canvas, text, row, slider, button, readout, loop, axes, line, dot, title, arrow } from '../kit.js';

const AS = 0.46;
export default function (host) {
  let age = 0, hr = 0;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'Earth with ocean bulges towards and away from the Moon and Sun, and a tide height curve over two days' });
  const c1 = row(host), c2 = row(host);
  const sa = slider(c1, { label: 'Moon age', min: 0, max: 29.5, step: 0.1, value: age, fmt: (v) => `${v.toFixed(1)} days`, oninput: (v) => { age = v; show(); } });
  [['New (spring)', 0], ['First quarter (neap)', 7.4], ['Full (spring)', 14.8], ['Last quarter (neap)', 22.1]].forEach(([n, d]) => button(c2, n, () => { age = d; sa.set(d); show(); }));
  const anim = loop(host, (dt) => { hr = (hr + dt * 2.5) % 48; show(); });
  anim.button(c2);
  const out = readout(host);
  const phi = () => (age / 29.53) * 2 * Math.PI;
  const height = (hour, th) => Math.cos(2 * (th - phi())) + AS * Math.cos(2 * th) + 0; // th = observer angle from the Sun side
  function show() {
    const ph = phi(), spring = Math.abs(Math.cos(ph)), r = Math.abs(1 + AS * Math.cos(2 * ph));
    out.innerHTML = `Biggest tide this phase ≈ <b>${(Math.hypot(1 + AS * Math.cos(2 * ph), AS * Math.sin(2 * ph)) * 100 / 1.46).toFixed(0)}%</b> of a spring tide (new Moon and full Moon: 100%; quarters: ${((1 - AS) * 100 / 1.46).toFixed(0)}%). The Moon raises about 2.2 times the Sun's tide because it is so much closer: tidal force ∝ M/d³. The same side of Earth faces the bulge again after 24 h 50 min, so high tides come about 50 minutes later each day.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Earth from above the pole, Sun on the right', col);
    const top = h * 0.55, cx = w / 2, cy = 30 + top / 2, R = Math.min(top * 0.3, w * 0.2), ph = phi(), spin = (hr / 24) * 2 * Math.PI;
    // sunlight
    arrow(ctx, w - 8, cy, w - 44, cy, col.s[1], 2, 7); text(ctx, 'Sun', w - 10, cy - 12, { color: col.s[1], size: 10.5, align: 'right', weight: 600 });
    // water shape: r = R (1 + k(cos 2(th - ph) + AS cos 2th))
    ctx.beginPath(); for (let i = 0; i <= 120; i++) { const t = (i / 120) * 2 * Math.PI, rr = R * (1 + 0.2 * (Math.cos(2 * (t - ph)) + AS * Math.cos(2 * t)) / 1.46 * 1.4); const x = cx + rr * Math.cos(t), y = cy - rr * Math.sin(t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
    const mx = cx + Math.min(w * 0.4, R * 2.3) * Math.cos(ph), my = cy - Math.min(w * 0.4, R * 2.3) * Math.sin(ph);
    dot(ctx, mx, my, 8, col.bg, col.ink); text(ctx, 'Moon', mx, my - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // observer: angle th measured from the Sun direction, turning with the Earth
    const th = spin, ox = cx + R * Math.cos(th), oy = cy - R * Math.sin(th); dot(ctx, ox, oy, 5, col.s[2]); text(ctx, 'you', ox + 8, oy - 6, { color: col.s[2], size: 11, weight: 700 });
    arrow(ctx, cx + R * 0.5, cy - 18, cx + R * 0.5, cy - 18, col.muted, 1);
    // tide height over 48 h for this observer
    const A = axes(ctx, w, h, col, { x: [0, 48], y: [-1.7, 1.7], t: 30 + top, l: 40, b: 36, xlabel: 'hours', yt: [-1, 0, 1], fy: (v) => (v > 0 ? 'high' : v < 0 ? 'low' : ''), xt: [0, 12, 24, 36, 48], fx: (v) => v });
    const pts = []; for (let i = 0; i <= 200; i++) { const t = (i / 200) * 48, thh = (t / 24) * 2 * Math.PI; pts.push([A.X(t), A.Y(height(t, thh))]); }
    line(ctx, pts, col.s[0], 2.2);
    dot(ctx, A.X(hr), A.Y(height(hr, th)), 5.5, col.s[5], col.panel);
  };
  show();
}
