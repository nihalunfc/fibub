// 10.8 A survey "cone" (wedge) map: we sit at the bottom point; each dot is a galaxy placed by its direction on
// the sky and its distance from its redshift. The galaxies are drawn from a toy cosmic web (Zel'dovich, as in the
// 10.4 figure, 600 Mpc box repeated), thinned the way a real survey thins them: fainter far away. Depths and
// sizes follow the real surveys (CfA slice: de Lapparent, Geller and Huchra 1986; 2dFGRS: Colless et al. 2001;
// SDSS and BOSS; DESI), but the dots are not their data. Distances are comoving, for the Planck-like model.
import { canvas, text, title, dot, row, choice, readout, rng } from '../../kit.js';
import { comovingMpc, PLANCK18 } from '../phys.js';
import { randomField, displacement } from './cosmic-web-field.js';

const n = 128, BOX = 600;
const SURVEYS = {
  cfa: { name: 'CfA slice (1986)', zmax: 0.05, half: 55, show: 1100, fall: 0.6, ticks: [0.01, 0.02, 0.03, 0.04],
    note: 'About 1,100 galaxies in a thin slice of sky, out to 15,000 km/s (z ≈ 0.05). The first map showed galaxies on the walls of bubbles, with a "stick man" in the middle (the Coma cluster is his body).' },
  '2df': { name: '2dFGRS (1997-2002)', zmax: 0.25, half: 38, show: 3200, fall: 0.45, ticks: [0.05, 0.1, 0.15, 0.2],
    note: '221,414 galaxy redshifts, mostly within z ≈ 0.25, measured 400 at a time with optical fibres on the 3.9 m Anglo-Australian Telescope.' },
  sdss: { name: 'SDSS and BOSS (2000-2014)', zmax: 0.75, half: 40, show: 3800, fall: 0.55, ticks: [0.1, 0.2, 0.4, 0.6],
    note: 'The Sloan telescope (2.5 m) measured nearly a million nearby galaxies, then BOSS another 1.5 million bright red galaxies out to z ≈ 0.7.' },
  desi: { name: 'DESI (2021-)', zmax: 3.5, half: 40, show: 4500, fall: 0, ticks: [0.5, 1, 2, 3],
    note: 'DESI takes 5,000 spectra at a time with robot-positioned fibres on the 4 m Mayall telescope, planned to measure about 40 million galaxies and quasars. Colours: bright galaxies, red galaxies, star-forming galaxies, quasars.' },
};
const tracer = (z) => (z < 0.4 ? 0 : z < 1.1 ? 1 : z < 1.6 ? 2 : 3);

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 360, label: 'A wedge-shaped map of galaxies by distance, as a redshift survey sees them' });
  const F = displacement(randomField(n, 11, { slope: -1.4, kc: 0.7 }), n);
  const jr = rng(2), base = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const i = y * n + x;
    base.push([((x + jr() - 0.5 + 1.3 * F.px[i]) / n * BOX + BOX) % BOX, ((y + jr() - 0.5 + 1.3 * F.py[i]) / n * BOX + BOX) % BOX]);
  }
  // redshift ↔ comoving distance
  const zt = [], dt = []; for (let i = 0; i <= 200; i++) { const z = 3.6 * (i / 200) ** 2; zt.push(z); dt.push(comovingMpc(z, PLANCK18)); }
  const dOf = (z) => { for (let i = 1; i < zt.length; i++) if (z <= zt[i]) return dt[i - 1] + (dt[i] - dt[i - 1]) * (z - zt[i - 1]) / (zt[i] - zt[i - 1]); return dt[dt.length - 1]; };
  const zOf = (d) => { for (let i = 1; i < dt.length; i++) if (d <= dt[i]) return zt[i - 1] + (zt[i] - zt[i - 1]) * (d - dt[i - 1]) / (dt[i] - dt[i - 1]); return zt[zt.length - 1]; };
  let key = 'cfa', gal = [];
  const build = () => {
    const s = SURVEYS[key], D = dOf(s.zmax), th = (s.half * Math.PI) / 180, r = rng(5), cand = [];
    const ox = 123, oy = 457, nt = Math.ceil(D / BOX) + 1;
    for (let ty = -1; ty <= nt; ty++) for (let tx = -nt; tx <= nt; tx++) {
      if (Math.hypot(Math.max(0, Math.abs(tx) - 1), Math.max(0, ty - 1)) * BOX > D) continue;
      const sym = Math.floor(r() * 8), J = BOX / n; // each copy of the box turned or flipped, so repeats do not line up
      for (const [x0, y0] of base) {
        let x = sym & 1 ? BOX - x0 : x0, y = sym & 2 ? BOX - y0 : y0;
        if (sym & 4) { const q = x; x = y; y = q; }
        const X = x + (r() - 0.5) * J + tx * BOX - ox, Y = y + (r() - 0.5) * J + ty * BOX - oy, d = Math.hypot(X, Y);
        if (d > D || d < 1 || Y <= 0) continue;
        const ph = Math.atan2(X, Y);
        if (Math.abs(ph) > th) continue;
        const sel = s.fall ? Math.exp(-((d / (s.fall * D)) ** 2)) : 1;
        if (r() < sel) cand.push([d, ph]);
      }
    }
    // thin to the number shown
    const keep = Math.min(1, s.show / Math.max(1, cand.length));
    gal = cand.filter(() => r() < keep).map(([d, ph]) => ({ d, ph, t: tracer(zOf(d)) }));
  };
  build();
  const ctl = row(host);
  choice(ctl, 'Survey', Object.entries(SURVEYS).map(([k, v]) => [k, v.name.replace(/ \(.*/, '')]), key, (v) => { key = v; build(); cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `<b>${SURVEYS[key].name}.</b> ${SURVEYS[key].note}`; };
  cv.draw = (ctx, w, h, col) => {
    const s = SURVEYS[key], D = dOf(s.zmax), th = (s.half * Math.PI) / 180;
    const top = title(ctx, `${s.name}: ${s.zmax < 0.1 ? 'our neighbourhood' : s.zmax < 1 ? 'deeper' : 'far back in time'}`, col) + 6;
    const cx = w / 2, by = h - 22;
    const Rpx = Math.min(by - top - 8, (w / 2 - 12) / Math.sin(Math.min(th, Math.PI / 2))), sc = Rpx / D;
    ctx.beginPath(); ctx.moveTo(cx, by); ctx.arc(cx, by, Rpx, -Math.PI / 2 - th, -Math.PI / 2 + th); ctx.closePath();
    ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke();
    for (const z of s.ticks) {
      const rr = dOf(z) * sc;
      ctx.beginPath(); ctx.arc(cx, by, rr, -Math.PI / 2 - th, -Math.PI / 2 + th); ctx.strokeStyle = col.line; ctx.stroke();
      const lx = cx + rr * Math.sin(th) + 3, ly = by - rr * Math.cos(th);
      text(ctx, 'z ' + z, lx, ly, { color: col.muted, size: 10.5, align: th > 1.2 ? 'center' : 'left', halo: col.panel });
    }
    const cs = [col.s[0], col.s[3], col.s[2], col.s[5]];
    const rad = gal.length > 3500 ? 1.1 : gal.length < 1500 ? 2 : 1.4;
    for (const g of gal) {
      ctx.fillStyle = key === 'desi' ? cs[g.t] : col.ink;
      ctx.fillRect(cx + g.d * sc * Math.sin(g.ph) - rad / 2, by - g.d * sc * Math.cos(g.ph) - rad / 2, rad, rad);
    }
    dot(ctx, cx, by, 4, col.s[3]);
    text(ctx, 'us', cx, by + 11, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, `${Math.round(D).toLocaleString('en-CA')} Mpc to the edge`, w - 10, by + 11, { color: col.muted, size: 10.5, align: 'right' });
  };
  cv.redraw(); show();
}
