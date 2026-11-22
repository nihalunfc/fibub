// 3.2 A point charge q outside a conducting sphere of radius R. Grounded: one image q' = -qR/d at b = R^2/d.
// Isolated and neutral: add +qR/d at the centre. Field lines are traced from q with the field of q and its images and
// stop on the sphere (where they meet it at right angles). Dashed: the lines continued to the fictitious images.
// Readout: image charge and position, force, and the share of field lines that reach the sphere.
import { canvas, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'A point charge near a conducting sphere with its field lines and image charges' });
  let d = 2, mode = 'grounded', ghost = 'no';
  const ctl = row(host);
  slider(ctl, { label: 'Distance d', min: 1.2, max: 4, step: 0.05, value: d, fmt: (v) => fmt(v, 3) + ' R', oninput: (v) => { d = v; cv.redraw(); say(); } });
  choice(ctl, 'Sphere', [['grounded', 'Grounded'], ['neutral', 'Neutral']], mode, (v) => { mode = v; cv.redraw(); say(); });
  choice(ctl, 'Images', [['no', 'Hide'], ['yes', 'Show']], ghost, (v) => { ghost = v; cv.redraw(); });
  const out = readout(host);
  const imgs = () => { const q1 = -1 / d, b = 1 / d, list = [[b, q1]]; if (mode === 'neutral') list.push([0, 1 / d]); return list; };
  const say = () => {
    const b = 1 / d;
    const Fg = d / (d * d - 1) ** 2, Fn = Fg - 1 / (d * d * d);
    out.innerHTML = `Image: <b>q′ = −q/${fmt(d, 3)} = ${fmt(-1 / d, 3)} q</b> at ${fmt(b, 3)} R from the centre${mode === 'neutral' ? `, plus <b>+${fmt(1 / d, 3)} q</b> at the centre (keeps the sphere neutral)` : ''}. Pull on q: <b>${fmt(mode === 'grounded' ? Fg : Fn, 3)}</b> kq²/R²${mode === 'neutral' ? ` (grounded would be ${fmt(Fg, 3)})` : ''}. Induced charge on the sphere: ${mode === 'grounded' ? fmt(-1 / d, 3) + ' q' : '0 in total'}.`;
  };
  const field = (x, y) => {
    let ex = 0, ey = 0;
    const add = (px, q) => { const dx = x - px, dy = y, r3 = Math.pow(dx * dx + dy * dy, 1.5) || 1e-9; ex += q * dx / r3; ey += q * dy / r3; };
    add(d, 1); for (const [p, q] of imgs()) add(p, q);
    return [ex, ey];
  };
  cv.draw = (ctx, w, h, col) => {
    const S = Math.min(w / 7, h / 4.6), cx = w * 0.3, cy = h / 2;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, S, 0, 2 * Math.PI); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    text(ctx, mode === 'grounded' ? 'V = 0' : 'Q = 0', cx, cy + S * 0.55, { color: col.muted, size: 11, align: 'center' });
    const N = 22;
    for (let i = 0; i < N; i++) {
      const a = (i + 0.5) * 2 * Math.PI / N;
      let x = d + 0.06 * Math.cos(a), y = 0.06 * Math.sin(a);
      const pts = [], dash = [];
      let inside = false;
      for (let k = 0; k < 2500; k++) {
        (inside ? dash : pts).push([X(x), Y(y)]);
        const [ex, ey] = field(x, y), m = Math.hypot(ex, ey);
        if (m < 1e-9) break;
        x += 0.018 * ex / m; y += 0.018 * ey / m;
        if (!inside && x * x + y * y < 1) { pts.push([X(x), Y(y)]); inside = true; if (ghost === 'no') break; }
        if (inside && imgs().some(([p]) => Math.hypot(x - p, y) < 0.04)) break;
        if (Math.abs(x) > 6 || Math.abs(y) > 3) break;
      }
      line(ctx, pts, col.s[0], 1.5);
      if (dash.length) line(ctx, dash, col.s[0], 1, [3, 4]);
    }
    dot(ctx, X(d), Y(0), 7, col.s[1]);
    text(ctx, '+q', X(d) + 10, Y(0) - 12, { color: col.ink, size: 13, weight: 700 });
    if (ghost === 'yes') for (const [p, q] of imgs()) {
      dot(ctx, X(p), Y(0), 3 + 4 * Math.min(1, Math.abs(q)), col.panel, q < 0 ? col.s[3] : col.s[1]);
      text(ctx, (q < 0 ? '−' : '+') + fmt(Math.abs(q), 2) + 'q', X(p), Y(0) + 16, { color: q < 0 ? col.s[3] : col.s[1], size: 11, weight: 700, align: 'center' });
    }
  };
  cv.redraw(); say();
}
