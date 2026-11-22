// 8.1 Zwicky's missing mass, as a toy. Forty galaxies move through a cluster at the speeds we measure. Their
// pull on each other comes from the cluster's total mass, spread out like a ball (a Plummer sphere). With only
// the mass of the stars, the galaxies are far faster than the escape speed and the cluster flies apart. Add the
// hot gas found later in X-rays (about 6 times the stars) and it still flies apart. Only with roughly 50 times
// the mass of the stars, most of it dark, do the measured speeds keep the cluster together.
// A galaxy has escaped when its energy (motion + gravity) is above zero, which is exact for a fixed pull.
import { canvas, text, title, dot, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 430, min: 300, label: 'Galaxies moving through a cluster, held together or flying apart depending on the cluster mass' });
  const NEED = 50, B = 0.3, N = 40; // the toy cluster is in balance with 50 × the star mass; core size 0.3
  let mult = 1, gals = [], t = 0;
  const r0 = rng(7);
  const start = [];
  for (let i = 0; i < N; i++) {
    const r = 0.12 + 0.8 * Math.sqrt(r0()), th = r0() * Math.PI * 2;
    const vc = Math.sqrt(r * r / Math.pow(r * r + B * B, 1.5)); // circular speed when GM = 1 (the balanced mass)
    const sp = vc * (0.75 + 0.35 * r0()), dir = th + Math.PI / 2 + (r0() - 0.5) * 1.2 * (r0() < 0.5 ? 1 : -1);
    start.push({ x: r * Math.cos(th), y: r * Math.sin(th), vx: sp * Math.cos(dir), vy: sp * Math.sin(dir) });
  }
  const GM = () => mult / NEED;
  const reset = () => { gals = start.map((g) => ({ ...g, trail: [] })); t = 0; };
  const energy = (g) => 0.5 * (g.vx * g.vx + g.vy * g.vy) - GM() / Math.sqrt(g.x * g.x + g.y * g.y + B * B);
  const escaped = () => gals.filter((g) => energy(g) > 0).length;
  const stepSim = (dt) => {
    const k = GM(), sub = 8, h = dt / sub;
    for (const g of gals) {
      for (let s = 0; s < sub; s++) {
        const r2 = g.x * g.x + g.y * g.y + B * B, f = -k / Math.pow(r2, 1.5);
        g.vx += f * g.x * h; g.vy += f * g.y * h; g.x += g.vx * h; g.y += g.vy * h;
      }
      g.trail.push([g.x, g.y]); if (g.trail.length > 14) g.trail.shift();
    }
    t += dt;
  };
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Total mass ÷ mass of the stars', min: 1, max: 300, log: true, value: 1, fmt: (v) => `${v < 10 ? v.toFixed(1) : Math.round(v)}×`, oninput: (v) => { mult = v; reset(); cv.redraw(); show(); } });
  const set = (v) => { mult = v; sl.set(v); reset(); cv.redraw(); show(); };
  button(ctl, 'Stars only', () => set(1));
  button(ctl, '+ hot gas (7×)', () => set(7));
  button(ctl, '+ dark matter (50×)', () => set(50));
  const lp = loop(host, (dt) => { stepSim(dt * 0.7); cv.redraw(); if (Math.round(t * 10) % 5 === 0) show(); });
  lp.button(ctl);
  const out = readout(host);
  const show = () => {
    const e = escaped();
    const verdict = e > N * 0.5 ? 'The cluster is flying apart: these speeds are far too fast for this little mass.'
      : e > 2 ? 'Nearly there: a few galaxies still escape.'
      : mult > NEED * 2.5 ? 'Everything is held, but with this much mass the galaxies would soon fall inwards and speed up beyond the speeds we measure.'
      : 'The measured speeds now fit: the cluster holds together.';
    out.innerHTML = `Mass: <b>${mult < 10 ? mult.toFixed(1) : Math.round(mult)}×</b> the stars. Galaxies moving fast enough to escape: <b>${e} of ${N}</b>. ${verdict}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h * 0.54, R = Math.min(w, h) * 0.36;
    // the cluster's mass as a soft glow, stronger when there is more of it
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.25);
    const a = Math.min(0.32, 0.05 + 0.27 * Math.log10(mult) / Math.log10(300));
    glow.addColorStop(0, `rgba(98,80,214,${a})`); glow.addColorStop(1, 'rgba(98,80,214,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
    for (const g of gals) {
      const esc = energy(g) > 0, c = esc ? col.s[7] : col.s[0];
      ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.beginPath();
      g.trail.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * R, cy + y * R) : ctx.moveTo(cx + x * R, cy + y * R))); ctx.stroke(); ctx.restore();
      dot(ctx, cx + g.x * R, cy + g.y * R, 3.6, c);
    }
    text(ctx, '● held by gravity', 10, h - 30, { color: col.s[0], size: 11, weight: 600, halo: col.panel });
    text(ctx, '● fast enough to escape', 10, h - 14, { color: col.s[7], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'a cluster, millions of light-years across', cx, cy - R - 9, { color: col.muted, size: 10.5, align: 'center', halo: col.panel });
    title(ctx, 'Same measured speeds, different total mass', col);
  };
  reset(); cv.redraw(); show();
}
