// 3.4 Phase and group velocity. Two waves with nearby wavenumbers k ± dk and frequencies from a chosen dispersion
// relation add to make groups. The red dot rides a crest (moves at the phase velocity), the blue dot rides the peak of
// the envelope (moves at the group velocity). Pick: no dispersion, deep water (v_g = v_p/2), ripples (v_g = 1.5 v_p).
import { canvas, axes, line, dot, text, title, row, choice, readout, loop, fmt } from '../../kit.js';

const LAWS = {
  none: { name: 'ω = ck (no dispersion)', w: (k) => k, ratio: 1 },
  deep: { name: 'ω² = gk (deep water)', w: (k) => Math.sqrt(k * 2 * Math.PI), ratio: 0.5 },
  ripple: { name: 'ω² ∝ k³ (ripples)', w: (k) => Math.pow(k / (2 * Math.PI), 1.5) * 2 * Math.PI, ratio: 1.5 },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 220, label: 'Two waves adding to wave groups: crest speed and group speed' });
  let law = 'deep', t = 0;
  const k0 = 2 * Math.PI, dk = 2 * Math.PI / 8; // carrier wavelength 1, groups 8 wavelengths long
  const ctl = row(host);
  choice(ctl, 'Medium', [['none', 'No dispersion'], ['deep', 'Deep water'], ['ripple', 'Ripples']], law, (v) => { law = v; t = 0; cv.redraw(); show(); });
  const out = readout(host);
  const vel = () => { const L = LAWS[law]; const wa = L.w(k0 - dk / 2), wb = L.w(k0 + dk / 2); return { vp: (wa + wb) / 2 / k0, vg: (wb - wa) / dk, wa, wb }; };
  const show = () => { const { vp, vg } = vel(); out.innerHTML = `${LAWS[law].name}: phase velocity ω/k = <b>${fmt(vp, 3)}</b>, group velocity dω/dk ≈ <b>${fmt(vg, 3)}</b> (ratio ${fmt(vg / vp, 2)}). ${vg < vp * 0.95 ? 'Crests are born at the back of each group, run through it and die at the front.' : vg > vp * 1.05 ? 'Crests appear at the front and drift backwards through the group.' : 'Crests and groups move together.'}`; };
  cv.draw = (ctx, W, h, col) => {
    title(ctx, 'Red rides a crest, blue rides a group', col);
    const ax = axes(ctx, W, h, col, { x: [0, 16], y: [-2.3, 2.3], t: 36, xlabel: 'position (carrier wavelengths)', ylabel: 'y', yt: [-2, 0, 2] });
    const { vp, vg, wa, wb } = vel();
    ctx.save(); ax.clip();
    const pts = [], env = [], env2 = [];
    for (let i = 0; i <= 900; i++) {
      const x = (16 * i) / 900, y = Math.cos((k0 - dk / 2) * x - wa * t) + Math.cos((k0 + dk / 2) * x - wb * t);
      const e = 2 * Math.cos((dk / 2) * x - ((wb - wa) / 2) * t);
      pts.push([ax.X(x), ax.Y(y)]); env.push([ax.X(x), ax.Y(Math.abs(e))]); env2.push([ax.X(x), ax.Y(-Math.abs(e))]);
    }
    line(ctx, env, col.muted, 1, [4, 4]); line(ctx, env2, col.muted, 1, [4, 4]);
    line(ctx, pts, col.s[0], 1.8);
    const gx = ((vg * t) % 16 + 16) % 16, px = ((vp * t + 4) % 16 + 16) % 16;
    dot(ctx, ax.X(gx), ax.Y(2), 6, col.s[1]);
    dot(ctx, ax.X(px), ax.Y(Math.cos((k0 - dk / 2) * px - wa * t) + Math.cos((k0 + dk / 2) * px - wb * t)), 5, col.s[3]);
    ctx.restore();
  };
  const anim = loop(host, (dt) => { t += dt * 0.6; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
