// Why entropy rises: particles in a box with a removable partition. With the partition out they wander, and the
// histogram counts the arrangements (microstates W) for each split between left and right. S = k ln W is largest for the
// even split because there are overwhelmingly more ways to get it. Try a small N, then a big one.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';

const lnC = (n, k) => { let s = 0; for (let i = 1; i <= k; i++) s += Math.log((n - k + i) / i); return s; };
export default function (host) {
  let N = 20, open = false, ps = [];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 310, label: 'Particles spreading between two halves of a box and a histogram of arrangements' });
  const c1 = row(host);
  slider(c1, { label: 'Particles N', min: 4, max: 100, step: 2, value: N, oninput: (v) => { N = v; build(); } });
  button(c1, 'Remove partition', () => { open = true; set(); });
  button(c1, 'Put them back (reset)', () => build());
  function build() { open = false; ps = Array.from({ length: N }, () => { const a = Math.random() * 6.283; return { x: Math.random() * 0.48, y: Math.random(), vx: Math.cos(a) * 0.4, vy: Math.sin(a) * 0.4 }; }); set(); }
  const out = readout(host);
  loop(host, (dt) => {
    const s = Math.min(dt, 0.03);
    for (const p of ps) {
      p.x += p.vx * s; p.y += p.vy * s;
      if (p.y < 0 || p.y > 1) { p.vy = -p.vy; p.y = Math.max(0, Math.min(1, p.y)); }
      const lim = open ? 1 : 0.5; if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); } if (p.x > lim) { p.x = lim; p.vx = -Math.abs(p.vx); }
    }
    cv.redraw(); show();
  });
  function left() { return ps.filter((p) => p.x < 0.5).length; }
  function set() { show(); cv.redraw(); }
  function show() {
    const k = left(), lnW = lnC(N, k), lnMax = lnC(N, Math.round(N / 2));
    out.innerHTML = `${k} on the left, ${N - k} on the right. Ways W = C(${N}, ${k}) = e<sup>${lnW.toFixed(1)}</sup>; S = k ln W = ${lnW.toFixed(1)} k (the even split has ${lnMax.toFixed(1)} k). Chance that all ${N} gather on one side: 1 in 2<sup>${N - 1}</sup>. ${open ? 'Entropy rises because the spread-out arrangements vastly outnumber the gathered ones.' : 'All on one side: W = 1, S = 0.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Free expansion: counting ways', col);
    const bx = 12, bw = w - 24, by = 36, bh = Math.min(120, h * 0.34);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    if (!open) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by + bh); ctx.stroke(); }
    else { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by + bh); ctx.stroke(); ctx.restore(); }
    ps.forEach((p) => { ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 3.2, 0, 7); ctx.fillStyle = p.x < 0.5 ? col.s[0] : col.s[1]; ctx.fill(); });
    // histogram of W for each k with current k marked
    const hy = by + bh + 38, hb = h - 38, hh = hb - hy, k0 = left(), lnMax = lnC(N, Math.floor(N / 2));
    text(ctx, 'ways for k on the left', bx, hy - 10, { color: col.muted, size: 10 });
    const bwid = Math.max(1, bw / (N + 1));
    for (let k = 0; k <= N; k++) {
      const f = Math.exp(lnC(N, k) - lnMax), x = bx + k * bwid;
      ctx.fillStyle = k === k0 ? col.s[1] : col.s[0]; ctx.globalAlpha = k === k0 ? 1 : 0.5; ctx.fillRect(x + 0.5, hb - f * hh, Math.max(1, bwid - 1), f * hh);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(bx, hb); ctx.lineTo(bx + bw, hb); ctx.stroke();
    text(ctx, 'k = 0', bx, hb + 12, { color: col.muted, size: 10 }); text(ctx, `k = ${N}`, bx + bw, hb + 12, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'orange bar: now', bx + bw, hy + 6, { color: col.s[1], size: 10, align: 'right' });
  };
  build();
}
