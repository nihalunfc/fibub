// Ray optics: images formed by a thin lens or a spherical mirror. Move the object and change the focal length; two
// rays from the object's tip (one parallel to the axis, one through the centre or pole) locate the image.
// Cartesian sign convention: light travels left to right, distances measured from the lens or mirror.
import { canvas, row, slider, choice, readout, line, arrow, text, dot, fmt } from '../../kit.js';

const KINDS = { convex: 'Convex lens', concave: 'Concave lens', cmirror: 'Concave mirror', vmirror: 'Convex mirror' };
export default function (host) {
  let kind = 'convex', U = 30, F = 15;
  const cv = canvas(host, { aspect: 0.56, max: 340, min: 230, label: 'Ray diagram for a lens or mirror' });
  const ctl = row(host);
  choice(ctl, 'Element', Object.entries(KINDS), kind, (v) => { kind = v; upd(); });
  slider(ctl, { label: 'Object distance', min: 4, max: 60, step: 1, value: U, fmt: (v) => `${v} cm`, oninput: (v) => { U = v; upd(); } });
  slider(ctl, { label: 'Focal length', min: 8, max: 25, step: 1, value: F, fmt: (v) => `${v} cm`, oninput: (v) => { F = v; upd(); } });
  const out = readout(host);
  const solve = () => {
    const mirror = kind.endsWith('mirror'), u = -U;
    const f = kind === 'convex' ? F : kind === 'concave' ? -F : kind === 'cmirror' ? -F : F;
    const den = mirror ? 1 / f - 1 / u : 1 / f + 1 / u;
    if (Math.abs(den) < 1e-9) return { mirror, f, inf: true };
    const v = 1 / den, m = mirror ? -v / u : v / u;
    return { mirror, f, v, m, real: mirror ? v < 0 : v > 0 };
  };
  const upd = () => {
    cv.redraw();
    const s = solve();
    if (s.inf) { out.innerHTML = 'Object at the focus: the rays leave parallel and the image is at infinity.'; return; }
    out.innerHTML = `u = −${U} cm, f = ${s.f > 0 ? '+' : ''}${s.f} cm → v = <b>${fmt(s.v, 3)} cm</b>, magnification m = <b>${fmt(s.m, 3)}</b>: ${s.real ? 'real' : 'virtual'}, ${s.m < 0 ? 'inverted' : 'upright'}, ${Math.abs(s.m) > 1.02 ? 'magnified' : Math.abs(s.m) < 0.98 ? 'diminished' : 'same size'}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = solve(), S = w / 140, y0 = h / 2, X = (x) => w / 2 + x * S, Y = (y) => y0 - y * S, ho = 7;
    line(ctx, [[0, y0], [w, y0]], col.muted, 1);
    // element
    const eh = h * 0.42;
    if (s.mirror) {
      const bow = kind === 'cmirror' ? 10 : -10;
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0) + bow, y0 - eh); ctx.quadraticCurveTo(X(0) - bow, y0, X(0) + bow, y0 + eh); ctx.stroke(); ctx.restore();
    } else {
      line(ctx, [[X(0), y0 - eh], [X(0), y0 + eh]], col.s[0], 3);
      const tip = kind === 'convex' ? 1 : -1;
      [[y0 - eh, 1], [y0 + eh, -1]].forEach(([yy, sg]) => { line(ctx, [[X(0) - 8, yy + sg * 8 * tip], [X(0), yy], [X(0) + 8, yy + sg * 8 * tip]], col.s[0], 2); });
    }
    [s.f, s.mirror ? null : -s.f].forEach((fx) => { if (fx === null) return; dot(ctx, X(fx), y0, 3.5, col.ink); text(ctx, 'F', X(fx), y0 + 14, { color: col.ink, size: 11, align: 'center' }); });
    if (s.mirror) { dot(ctx, X(2 * s.f), y0, 3, col.muted); text(ctx, 'C', X(2 * s.f), y0 + 14, { color: col.muted, size: 11, align: 'center' }); }
    // object
    arrow(ctx, X(-U), y0, X(-U), Y(ho), col.s[3], 3, 8);
    const O = [X(-U), Y(ho)], ray = col.s[1];
    const go = (P, dir, lenPx = w * 2) => { const m = Math.hypot(dir[0], dir[1]) || 1; return [P[0] + (dir[0] / m) * lenPx, P[1] + (dir[1] / m) * lenPx]; };
    const P1 = [X(0), Y(ho)], P2 = [X(0), y0];
    line(ctx, [O, P1], ray, 1.6); line(ctx, [O, P2], ray, 1.6);
    if (s.inf) {
      const d = s.mirror ? [-(P2[0] - O[0]), P2[1] - O[1]] : [P2[0] - O[0], P2[1] - O[1]];
      line(ctx, [P1, go(P1, d)], ray, 1.6); line(ctx, [P2, go(P2, d)], ray, 1.6);
      return;
    }
    const I = [X(s.v), Y(s.m * ho)];
    for (const P of [P1, P2]) {
      const d = s.real ? [I[0] - P[0], I[1] - P[1]] : [P[0] - I[0], P[1] - I[1]];
      line(ctx, [P, go(P, d)], ray, 1.6);
      if (!s.real) line(ctx, [P, I], ray, 1.2, [5, 5]);
    }
    if (Math.abs(I[0] - w / 2) < w && Math.abs(I[1] - y0) < h * 2) {
      line(ctx, [[I[0], y0], I], s.real ? col.s[2] : col.muted, 3, s.real ? undefined : [5, 4]);
      text(ctx, s.real ? 'real image' : 'virtual image', I[0], (I[1] < y0 ? I[1] - 10 : I[1] + 12), { color: s.real ? col.s[2] : col.muted, size: 11, align: 'center', halo: col.panel });
    }
    text(ctx, 'object', X(-U), Y(ho) - 12, { color: col.s[3], size: 11, align: 'center', halo: col.panel });
  };
  upd();
}
