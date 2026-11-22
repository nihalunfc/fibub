// 1.4 Galileo's test (1610): the phases of Venus. In Ptolemy's picture Venus always sits between us and the
// Sun, so we should only ever see a crescent. In the Sun-centred picture Venus goes behind the Sun, so it
// shows every phase, and looks small when full (far away) and big when a crescent (close). Galileo saw the
// full set of phases.
import { canvas, text, line, dot, row, choice, loop } from '../../kit.js';

const D = Math.PI / 180;
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 420, min: 290, label: 'Venus around the Sun, and what its phase looks like from Earth' });
  let mode = 'sun', t = 0;
  const ctl = row(host);
  const anim = loop(host, (dt) => { t += dt * 0.25; cv.redraw(); });
  anim.button(ctl);
  choice(ctl, 'Picture', [['sun', 'Sun-centred'], ['earth', 'Ptolemy']], mode, (v) => { mode = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const L = w * 0.58, cx = L / 2, cy = h / 2 + 6, s = Math.min(L, h) * 0.36;
    let E, S, V;
    if (mode === 'sun') {
      S = [0, 0]; E = [Math.cos(t * 2 * Math.PI / 1.6), Math.sin(t * 2 * Math.PI / 1.6)];
      // Venus period 0.615 yr; time scaled
      const v = t * 2 * Math.PI / (1.6 * 0.615);
      V = [0.723 * Math.cos(v), 0.723 * Math.sin(v)];
      // draw in a frame centred on the Sun
    } else {
      E = [0, 0]; const ya = t * 2 * Math.PI / 1.6; S = [Math.cos(ya), Math.sin(ya)];
      const c = [S[0] * 0.62, S[1] * 0.62], va = t * 2 * Math.PI / (1.6 * 0.6);
      V = [c[0] + 0.62 * Math.sin(46 * D) * Math.cos(va), c[1] + 0.62 * Math.sin(46 * D) * Math.sin(va)];
    }
    const off = mode === 'sun' ? S : E;
    const P = (q) => [cx + (q[0] - off[0]) * s, cy - (q[1] - off[1]) * s];
    if (mode === 'sun') { for (const r of [0.723, 1]) { ctx.beginPath(); ctx.arc(cx, cy, r * s, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.stroke(); } }
    else {
      ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.stroke();
      const c = P([S[0] * 0.62, S[1] * 0.62]);
      ctx.beginPath(); ctx.arc(c[0], c[1], 0.62 * Math.sin(46 * D) * s, 0, Math.PI * 2); ctx.strokeStyle = col.s[1]; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      line(ctx, [P(E), P(S)], col.line, 1);
    }
    const pe = P(E), ps = P(S), pv = P(V);
    dot(ctx, ps[0], ps[1], 8, col.s[3]); dot(ctx, pe[0], pe[1], 5, col.s[0]); dot(ctx, pv[0], pv[1], 4, col.s[1]);
    text(ctx, 'Sun', ps[0] + 10, ps[1], { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'Earth', pe[0] + 8, pe[1] + 10, { color: col.ink, size: 11, weight: 600, halo: col.panel });
    text(ctx, 'Venus', pv[0] + 7, pv[1] - 9, { color: col.ink, size: 11, weight: 600, halo: col.panel });
    // what we see: phase from the Sun-Venus-Earth angle, size from distance
    const ve = [E[0] - V[0], E[1] - V[1]], vs = [S[0] - V[0], S[1] - V[1]];
    const dEV = Math.hypot(...ve), cosA = (ve[0] * vs[0] + ve[1] * vs[1]) / (dEV * Math.hypot(...vs));
    const lit = (1 + cosA) / 2;
    const bx = L + (w - L) / 2, by = h / 2 + 6, r = Math.min((w - L) * 0.4, (h * 0.22) / dEV);
    text(ctx, 'Venus in a telescope', bx, by - r - 14, { color: col.ink, size: 12, weight: 600, align: 'center' });
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fillStyle = col.line; ctx.fill();
    // lit part: right half plus an ellipse that grows with lit fraction
    ctx.beginPath(); ctx.arc(bx, by, r, -Math.PI / 2, Math.PI / 2);
    const kx = (2 * lit - 1) * r;
    ctx.ellipse(bx, by, Math.abs(kx), r, 0, Math.PI / 2, -Math.PI / 2, kx < 0);
    ctx.fillStyle = col.s[3]; ctx.fill();
    text(ctx, `${Math.round(lit * 100)}% lit`, bx, by + r + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, mode === 'sun' ? 'All phases; small when full' : 'Only crescents, never full', bx, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw();
}
