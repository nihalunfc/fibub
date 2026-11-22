// Class 12 Chemistry, Haloalkanes and Haloarenes: SN1 against SN2 rate laws. SN2 needs the nucleophile and the haloalkane to meet in one step, so rate = k[RX][Nu-] (second order).
// SN1 has a slow first step in which RX alone ionises, so rate = k[RX], whatever the nucleophile concentration (first order). Particles move at random; each reaction event makes a flash.
// The measured events per second (last 4 s) track the theory bar.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let mech = 'sn2', cr = 1, cn = 1, evs = [], flashes = [];
  const rnd = rng(11);
  const mk = (n, s) => Array.from({ length: n }, () => ({ x: rnd(), y: rnd(), vx: (rnd() - 0.5) * s, vy: (rnd() - 0.5) * s }));
  let RX = mk(16, 0.22), NU = mk(16, 0.55);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Haloalkane and nucleophile particles with reaction events, for SN1 and SN2' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'mechanism', [['sn2', 'SN2'], ['sn1', 'SN1']], mech, (v) => { mech = v; evs = []; go(); });
  slider(ctl, { label: '[RX]', min: 1, max: 4, step: 1, value: cr, fmt: (v) => v + 'x', oninput: (v) => { cr = v; evs = []; go(); } });
  slider(ctl, { label: '[Nu⁻]', min: 1, max: 4, step: 1, value: cn, fmt: (v) => v + 'x', oninput: (v) => { cn = v; evs = []; go(); } });
  const theory = () => (mech === 'sn2' ? cr * cn : cr);
  loop(host, (dt, t) => {
    const nR = cr * 4, nN = cn * 4;
    for (const p of [...RX.slice(0, nR), ...NU.slice(0, nN)]) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < 0.03 || p.x > 0.97) p.vx *= -1; if (p.y < 0.03 || p.y > 0.97) p.vy *= -1; }
    if (mech === 'sn2') { for (const a of RX.slice(0, nR)) for (const b of NU.slice(0, nN)) if (Math.hypot(a.x - b.x, a.y - b.y) < 0.06 && rnd() < 0.08) { evs.push(t); flashes.push({ x: a.x, y: a.y, t }); } }
    else for (const a of RX.slice(0, nR)) if (rnd() < 0.25 * dt) { evs.push(t); flashes.push({ x: a.x, y: a.y, t }); }
    evs = evs.filter((e) => t - e < 4); flashes = flashes.filter((f) => t - f.t < 0.4);
    cv._rate = evs.length / 4; cv._t = t; cv.redraw();
  });
  const go = () => { ro.textContent = mech === 'sn2' ? `SN2: rate = k[RX][Nu⁻]. Now ${cr} × ${cn} = ${theory()} units. Double either concentration and the rate doubles.` : `SN1: rate = k[RX]. Now ${theory()} unit${theory() > 1 ? 's' : ''}. Change [Nu⁻] and nothing happens to the rate.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mech === 'sn2' ? 'SN2: second order' : 'SN1: first order', col), bx = 14, by = top + 4, bw = w - 28, bh = (h - top) * 0.62;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    RX.slice(0, cr * 4).forEach((p) => { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 7, 0, 7); ctx.fill(); });
    NU.slice(0, cn * 4).forEach((p) => { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 4, 0, 7); ctx.fill(); });
    flashes.forEach((f) => { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(bx + f.x * bw, by + f.y * bh, 10 + (cv._t - f.t) * 30, 0, 7); ctx.stroke(); });
    text(ctx, 'RX (large, green)   Nu⁻ (small, blue)', bx + 4, by + bh + 12, { color: col.muted, size: 10.5 });
    const y = by + bh + 34, max = 16, th = theory(), me = cv._rate || 0;
    ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, 12); ctx.fillStyle = col.s[0]; ctx.fillRect(bx, y, bw * th / max, 12); text(ctx, `theory ∝ ${th}`, bx, y + 24, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.line; ctx.fillRect(bx, y + 34, bw, 12); ctx.fillStyle = col.s[2]; ctx.fillRect(bx, y + 34, Math.min(bw, bw * me / max), 12); text(ctx, `measured: ${me.toFixed(1)} events per second`, bx, y + 58, { color: col.muted, size: 10.5 });
  };
  go();
}
