// 11.1 The horizon problem on a map where light always travels at 45° (comoving distance across, conformal
// time up; in these units the particle horizon is just the conformal time). Our past light cone meets the
// last-scattering surface at two opposite points A and B. Each of their own past light cones reaches back to the
// Big Bang (η = 0) with half-width η_rec. Planck 2018 values: η_rec ≈ 281 Mpc, η₀ ≈ 14,170 Mpc, so a patch spans
// η_rec/(η₀ − η_rec) ≈ 0.020 rad ≈ 1.2° of sky and the sky holds 4/θ² ≈ 10⁴ such patches. The strip before
// the CMB is drawn 6 times taller than true scale so the cones can be seen. Step 4: inflation adds a long stretch
// of conformal time before the hot Big Bang; the cones then reach far enough back to overlap.
import { canvas, text, title, line, dot, readout, loop, lerp, calm } from '../../kit.js';
import { E, simpson, hubbleDistMpc, PLANCK18 as P, DEG } from '../phys.js';

const etaMpc = (z) => { const a1 = 1 / (1 + z); return simpson((u) => { const a = u * u; return a === 0 ? 0 : (2 * u) / (a * a * E(1 / a - 1, P)); }, 0, Math.sqrt(a1), 6000) * hubbleDistMpc(P.H0); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 330, label: 'Light cones of two opposite points on the CMB sky, without and with inflation' });
  const e0 = etaMpc(0), eR = etaMpc(1090);
  const theta = eR / (e0 - eR), patches = 4 / theta ** 2;
  const er = 0.12; // drawn height of the strip before the CMB (true scale would be 0.02)
  let step = 0, yMin = -0.06, yTarget = -0.06;
  const anim = loop(host, (dt) => { yMin = lerp(yMin, yTarget, Math.min(1, dt * 2.5)); if (Math.abs(yMin - yTarget) < 1e-3) { yMin = yTarget; anim.pause(); } cv.redraw(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Our past light cone reaches the CMB', 'A and B never met', 'The CMB sky: thousands of strangers', 'With inflation, the cones overlap'][step], col);
    const L = 12, R = w - 12, T = top + 18, B = h - 22;
    const X = (x) => (L + R) / 2 + (x / 1.12) * (R - L) / 2;
    const Y = (y) => B - ((y - yMin) / (1.02 - yMin)) * (B - T);
    const xA = 1 - er;
    // the Big Bang line (or end of inflation)
    ctx.save();
    ctx.fillStyle = col.soft; ctx.fillRect(L, Y(0), R - L, B - Y(0) + 22);
    ctx.restore();
    line(ctx, [[L, Y(0)], [R, Y(0)]], col.muted, 1.5);
    text(ctx, step === 3 ? 'end of inflation, start of the hot Big Bang' : 'the Big Bang: no earlier time', (L + R) / 2, Y(0) + 11, { color: col.muted, size: 11, align: 'center', halo: col.soft });
    // the CMB line
    line(ctx, [[L, Y(er)], [R, Y(er)]], col.line, 1.2, [4, 4]);
    text(ctx, 'CMB released', X(0), Y(er) - 9, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    // our past light cone
    line(ctx, [[X(-1), Y(0)], [X(0), Y(1)], [X(1), Y(0)]], col.s[0], 2.5);
    dot(ctx, X(0), Y(1), 6, col.ink, col.panel);
    text(ctx, 'us, today', X(0) + 10, Y(1) + 2, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    // cones of A and B, down to the bottom of the plot
    const yb = step === 3 ? yMin : 0;
    const cone = (x0, c) => {
      const d = er - yb;
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(X(x0), Y(er)); ctx.lineTo(X(x0 - d), Y(yb)); ctx.lineTo(X(x0 + d), Y(yb)); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, [[X(x0 - d), Y(yb)], [X(x0), Y(er)], [X(x0 + d), Y(yb)]], c, 2);
    };
    if (step >= 1) { cone(-xA, col.s[1]); cone(xA, col.s[2]); }
    if (step === 2) for (let k = -3; k <= 3; k++) { const x0 = k * 2 * er; if (Math.abs(Math.abs(x0) - xA) > 0.05) cone(x0, col.muted); }
    if (step === 3 && -yMin > xA - er - 0.02) {
      const yo = er - xA; // where the two cones first touch (x = 0)
      dot(ctx, X(0), Y(yo), 5, col.s[3], col.panel);
      text(ctx, 'shared past', X(0), Y(yo) + 14, { color: col.s[3], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    }
    if (step === 3 && yMin < -0.5) text(ctx, 'inflation', L + 6, Y(yMin * 0.75), { color: col.ink, size: 12, weight: 700, halo: col.soft });
    for (const [x, lab, c] of [[-xA, 'A', col.s[1]], [xA, 'B', col.s[2]]]) {
      dot(ctx, X(x), Y(er), 5, c, col.panel);
      text(ctx, lab, X(x), Y(er) - 14, { color: c, size: 13, weight: 700, align: 'center', halo: col.panel });
    }
    text(ctx, 'distance (stretching map) →   light moves at 45°', (L + R) / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  const out = readout(host);
  const show = () => {
    out.innerHTML = [
      'A and B lie in opposite directions on our sky. Their light set out when the CMB was released and reaches us today along our past light cone.',
      `Anything that ever affected A sits inside A's own past light cone (shaded). Those of A and B never overlap: <b>nothing could have evened out their temperatures</b>, yet they agree to 1 part in 100,000.`,
      `Each cone covers about <b>${(theta / DEG).toFixed(1)}°</b> of our sky (horizon at the CMB ${eR.toFixed(0)} Mpc, distance to the CMB ${(e0 - eR).toFixed(0)} Mpc, on the stretching map). The sky splits into about <b>${(Math.round(patches / 1000) * 1000).toLocaleString('en-CA')}</b> patches that could never have exchanged a signal. (The strip before the CMB is drawn 6 times too tall.)`,
      'Inflation gives the cones a long stretch of extra time before the hot Big Bang. Traced back far enough, A and B grew from the <b>same tiny region</b>, which had time to even itself out.',
    ][step];
  };
  cv.redraw(); show();
  return {
    step(i) {
      step = Math.min(3, i); yTarget = step === 3 ? -1.05 : -0.06;
      if (calm()) yMin = yTarget;
      show(); cv.redraw(); anim.play();
    },
  };
}
