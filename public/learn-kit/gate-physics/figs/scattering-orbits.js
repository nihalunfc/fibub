// 2.4 Scattering orbits. Particles come in from the left with the same speed at evenly spaced impact parameters
// and are integrated (RK4) past a fixed centre: repulsive or attractive Coulomb (U = ±k/r), or a hard sphere.
// Units: mass 1, incoming speed 1 (E = 1/2); the slider sets k/2E (Coulomb) or the sphere radius.
import { canvas, line, dot, text, title, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'Trajectories of particles scattered by a fixed centre at different impact parameters' });
  let kind = 'rep', a = 0.5, pick = 4;
  const ctl = row(host);
  choice(ctl, 'Force', [['rep', 'Repulsive k/r'], ['att', 'Attractive −k/r'], ['hard', 'Hard sphere']], kind, (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'k/2E or sphere radius', min: 0.1, max: 1.2, step: 0.01, value: a, fmt: (x) => fmt(x, 3), oninput: (x) => { a = x; cv.redraw(); } });
  slider(ctl, { label: 'Highlighted orbit', min: 1, max: 8, step: 1, value: pick, fmt: (x) => 'b = ' + fmt(0.25 * x, 3), oninput: (x) => { pick = Math.round(x); cv.redraw(); } });
  const out = readout(host);
  const orbit = (b) => {
    const pts = [];
    if (kind === 'hard') {
      if (b >= a) return { pts: [[-4, b], [4, b]], th: 0 };
      const xc = -Math.sqrt(a * a - b * b), ang = Math.PI - 2 * Math.asin(b / a); // deflection
      const dir = [Math.cos(ang), Math.sin(ang)];
      return { pts: [[-4, b], [xc, b], [xc + 6 * dir[0], b + 6 * dir[1]]], th: ang };
    }
    const k = a * (kind === 'rep' ? 1 : -1); // k = (k/2E) * 2E with 2E = mv² = 1
    let x = -4, y = b, vx = 1, vy = 0;
    const acc = (x, y) => { const r = Math.hypot(x, y), f = k / (r * r * r); return [f * x, f * y]; };
    pts.push([x, y]);
    for (let i = 0; i < 6000; i++) {
      const r = Math.hypot(x, y), h = Math.min(0.01, 0.02 * r * r);
      const [ax1, ay1] = acc(x, y);
      const [ax2, ay2] = acc(x + h / 2 * vx, y + h / 2 * vy);
      const vx2 = vx + h / 2 * ax1, vy2 = vy + h / 2 * ay1;
      const [ax3, ay3] = acc(x + h / 2 * vx2, y + h / 2 * vy2);
      const vx3 = vx + h / 2 * ax2, vy3 = vy + h / 2 * ay2;
      const [ax4, ay4] = acc(x + h * vx3, y + h * vy3);
      const vx4 = vx + h * ax3, vy4 = vy + h * ay3;
      x += h / 6 * (vx + 2 * vx2 + 2 * vx3 + vx4); y += h / 6 * (vy + 2 * vy2 + 2 * vy3 + vy4);
      vx += h / 6 * (ax1 + 2 * ax2 + 2 * ax3 + ax4); vy += h / 6 * (ay1 + 2 * ay2 + 2 * ay3 + ay4);
      if (i % 3 === 0) pts.push([x, y]);
      if (Math.hypot(x, y) > 6) break;
    }
    return { pts, th: Math.atan2(vy, vx) };
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Scattering at different impact parameters', col);
    const S = Math.min(W / 8.4, H / 5.2), cx = W * 0.5, cy = H * 0.55;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 26, W, H - 26); ctx.clip();
    line(ctx, [[X(-4.2), Y(0)], [X(4.2), Y(0)]], col.line, 1, [4, 4]);
    if (kind === 'hard') { ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(X(0), Y(0), a * S, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); ctx.restore(); }
    let hi = null;
    for (let i = 1; i <= 8; i++) {
      const b = 0.25 * i, o = orbit(b);
      if (i === pick) hi = { b, ...o };
      else line(ctx, o.pts.map(([x, y]) => [X(x), Y(y)]), col.muted, 1.2);
    }
    if (hi) line(ctx, hi.pts.map(([x, y]) => [X(x), Y(y)]), col.s[0], 2.5);
    dot(ctx, X(0), Y(0), 4, col.ink);
    ctx.restore();
    text(ctx, 'incoming beam →', 8, H - 10, { color: col.muted, size: 11 });
    const deg = Math.abs(hi.th) * 180 / Math.PI;
    if (kind === 'hard') {
      out.innerHTML = `Impact parameter b = ${fmt(hi.b, 3)}: deflection <b>${fmt(deg, 3)}°</b>${hi.b < a ? ` (b = a cos(Θ/2) gives ${fmt(2 * Math.acos(hi.b / a) * 180 / Math.PI, 3)}°)` : ' (it misses the sphere)'}. Every direction gets the same share of particles: dσ/dΩ = a²/4.`;
    } else {
      const theory = 2 * Math.atan(a / hi.b) * 180 / Math.PI;
      out.innerHTML = `Impact parameter b = ${fmt(hi.b, 3)}: deflection <b>${fmt(deg, 3)}°</b>, matching Rutherford's cot(Θ/2) = 2Eb/k, which gives ${fmt(theory, 3)}°. ${kind === 'att' ? 'The attractive orbits swing round the centre, but the angles (and the cross-section) are the same.' : 'Smaller b, closer approach, bigger deflection.'}`;
    }
  };
  cv.redraw();
}
