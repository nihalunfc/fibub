// 3.5 Curved spacetime, the picture everyone uses: a stretched sheet dented by a mass, with a marble rolling
// round the dent. It is only a 2D cartoon of curved space (real spacetime curves time as well, and nothing
// "pulls down" on it), but it shows the key idea: mass curves the stage, and things move along the curves.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'A grid dented by a mass, with a marble orbiting in the dent' });
  let mass = 0.6, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  anim.button(ctl);
  slider(ctl, { label: 'Mass in the middle', min: 0, max: 1, step: 0.01, value: mass, fmt: (v) => (v < 0.02 ? 'none' : v < 0.4 ? 'small' : v < 0.75 ? 'star' : 'very dense'), oninput: (v) => { mass = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    out.innerHTML = mass < 0.02
      ? 'No mass: the grid is flat and a marble rolls in a straight line. That is Newton\'s first law, and also Einstein\'s "straightest path".'
      : `More mass makes a deeper dent. The marble is not pulled: it follows the straightest path it can on a curved surface, which is an orbit. ${mass > 0.75 ? 'Very dense masses make dents so steep that close in, no path climbs back out: a black hole (Lesson 3.7).' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.42, S = Math.min(w * 0.46, 230), tilt = 0.38, depth = 120 * mass;
    const z = (x, y) => -depth / (1 + (x * x + y * y) * 18);
    const P = (x, y) => [cx + x * S, cy + y * S * tilt - z(x, y)];
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const a = -1 + 2 * i / N, r1 = [], r2 = [];
      for (let j = 0; j <= 60; j++) { const b = -1 + 2 * j / 60; r1.push(P(a, b)); r2.push(P(b, a)); }
      line(ctx, r1, col.line, 1); line(ctx, r2, col.line, 1);
    }
    const [mx, my] = P(0, 0);
    if (mass > 0.02) dot(ctx, mx, my - 6, 6 + 10 * mass, col.s[3]);
    // marble orbit
    const r = 0.42, sp = 0.4 + 1.1 * Math.sqrt(mass);
    if (mass > 0.02) {
      const orb = []; for (let k = 0; k <= 60; k++) { const a = k / 60 * Math.PI * 2; orb.push(P(r * Math.cos(a), r * Math.sin(a))); }
      line(ctx, orb, col.s[0], 1.2, [4, 4]);
      const a = t * sp, [x, y] = P(r * Math.cos(a), r * Math.sin(a));
      dot(ctx, x, y - 5, 6, col.s[0]);
    } else {
      const u = ((t * 0.25) % 2) - 1, [x, y] = P(u, 0.42);
      line(ctx, [P(-1, 0.42), P(1, 0.42)], col.s[0], 1.2, [4, 4]);
      dot(ctx, x, y - 5, 6, col.s[0]);
    }
    text(ctx, 'A cartoon: the sheet stands for space, the dent for its curvature', w / 2, h - 10, { color: col.muted, size: 11, align: 'center' });
    title(ctx, 'Matter tells space how to curve; space tells matter how to move', col);
  };
  cv.redraw(); show();
}
