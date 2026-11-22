// 5.9 Horizons, drawn on a map of the universe that expands with it (comoving distance across, time up).
// The light reaching us today set out along the curved "past light cone". The farthest place it can have come
// from since the start is the particle horizon: 46 billion light-years away today. The Hubble distance, where
// galaxies recede at the speed of light, is 14 billion light-years. The event horizon, 16.6 billion light-years:
// light sent from beyond it today will never reach us, because dark energy speeds the expansion up.
// Model: Planck 2018 densities, rounded, computed in phys.js.
import { canvas, axes, text, title, line, dot, readout } from '../../kit.js';
import { E, ageGyr, simpson, hubbleDistMpc, particleHorizonMpc, eventHorizonMpc, PLANCK18 as P, MPC, LY } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 320, label: 'Our past light cone and the horizons on a map of comoving distance against time' });
  let step = 0;
  const G = (mpc) => (mpc * MPC) / LY / 1e9;
  const T0 = ageGyr(0, P);
  // past light cone: comoving distance of the source we see at time t (from redshift)
  const cone = [];
  for (let i = 0; i <= 120; i++) {
    const z = 10 ** (-3 + (i / 120) * 6.5); // up to z ~ 3e3
    const dc = simpson((x) => 1 / E(x, P), 0, z, 400) * hubbleDistMpc(P.H0);
    cone.push([G(dc), ageGyr(z, P)]);
  }
  const PH = G(particleHorizonMpc(P)), EH = G(eventHorizonMpc(P)), HD = G(hubbleDistMpc(P.H0));
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-50, 50], y: [0, 14], t: 40, xlabel: 'Distance from us today (billion light-years)', ylabel: 'Time since the start (billion years)' });
    ctx.save(); A.clip();
    if (step >= 0) {
      line(ctx, cone.map(([x, t]) => [A.X(x), A.Y(t)]), col.s[0], 2.5);
      line(ctx, cone.map(([x, t]) => [A.X(-x), A.Y(t)]), col.s[0], 2.5);
    }
    if (step >= 1) for (const s of [-1, 1]) line(ctx, [[A.X(s * PH), A.B], [A.X(s * PH), A.T]], col.s[3], 2, [6, 4]);
    if (step >= 2) for (const s of [-1, 1]) line(ctx, [[A.X(s * HD), A.B], [A.X(s * HD), A.T]], col.s[1], 1.5, [3, 3]);
    if (step >= 3) for (const s of [-1, 1]) line(ctx, [[A.X(s * EH), A.B], [A.X(s * EH), A.T]], col.s[2], 2, [8, 3]);
    ctx.restore();
    dot(ctx, A.X(0), A.Y(T0), 6, col.ink, col.panel);
    text(ctx, 'us, today', A.X(0), A.Y(T0) - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    const tags = [[PH, col.s[3], PH.toFixed(0)], [HD, col.s[1], HD.toFixed(1)], [EH, col.s[2], EH.toFixed(1)]].slice(0, step);
    tags.forEach(([x, c, s]) => text(ctx, s, A.X(x) + 4, A.T + 10, { color: c, size: 11.5, weight: 700, halo: col.panel }));
    title(ctx, ['The light we see today', 'How far can we see?', 'Where galaxies recede faster than light', 'What we can never reach'][step], col);
  };
  const out = readout(host);
  const show = () => {
    const rows = [
      [col0(0), 'past light cone: the path of the light reaching us now'],
      [col0(3), `particle horizon: ${PH.toFixed(0)} billion light-years away today (edge of what we can see)`],
      [col0(1), `Hubble distance: ${HD.toFixed(1)} billion light-years (galaxies recede at light speed)`],
      [col0(2), `event horizon: ${EH.toFixed(1)} billion light-years (light sent now never gets there)`],
    ].slice(0, step + 1);
    out.innerHTML = rows.map(([c, t]) => `<span style="color:${c};font-weight:700">—</span> ${t}`).join('<br>');
  };
  const col0 = (i) => getComputedStyle(document.body).getPropertyValue('--s' + (i + 1)).trim();
  cv.redraw(); show();
  return { step(i) { step = i; cv.redraw(); show(); } };
}
