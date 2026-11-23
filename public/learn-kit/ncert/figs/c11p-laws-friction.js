// Class 11 Laws of Motion: static and kinetic friction. Push a block with a force F. While it stays at rest static friction exactly balances the push (f = F), up to the limit f_max = mu_s N.
// Beyond that the block slides and the friction drops to the kinetic value mu_k N (a little less), so a = (F - mu_k N)/m. Slide F up and watch the graph and the block.
import { canvas, text, title, axes, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let F = 20, ms = 0.5, mk = 0.35, m = 10, x = 0, v = 0; const g = 9.8;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 350, label: 'A block pushed on a rough floor with a graph of friction against applied force' });
  const ctl = row(host), out = readout(host);
  const N = () => m * g, fmax = () => ms * N(), fk = () => mk * N();
  const anim = loop(host, (d) => { if (F > fmax()) { const a = (F - fk()) / m; v += a * d; x += v * d; if (x > 3.2) { x = 0; v = 0; } } else { v = 0; x = 0; } cv.redraw(); });
  slider(ctl, { label: 'Push F (N)', min: 0, max: 100, step: 1, value: F, fmt: (q) => q + ' N', oninput: (q) => { F = q; x = 0; v = 0; say(); } });
  slider(ctl, { label: 'μ static', min: 0.2, max: 0.9, step: 0.05, value: ms, fmt: (q) => q.toFixed(2), oninput: (q) => { ms = q; mk = Math.min(mk, ms - 0.05); x = 0; v = 0; say(); } });
  slider(ctl, { label: 'μ kinetic', min: 0.1, max: 0.85, step: 0.05, value: mk, fmt: (q) => q.toFixed(2), oninput: (q) => { mk = Math.min(q, ms); x = 0; v = 0; say(); } });
  function say() { const sl = F > fmax(); out.innerHTML = sl ? `Normal reaction N = mg = ${N().toFixed(0)} N. F = ${F} N is more than the limit μ<sub>s</sub>N = ${fmax().toFixed(0)} N, so the block <b>slides</b>; friction is now μ<sub>k</sub>N = <b>${fk().toFixed(0)} N</b> and a = (F − μ<sub>k</sub>N)/m = <b>${((F - fk()) / m).toFixed(2)} m/s²</b>.` : `Normal reaction N = mg = ${N().toFixed(0)} N. The block is at <b>rest</b>: static friction = <b>${F} N</b>, equal to the push (limit μ<sub>s</sub>N = ${fmax().toFixed(0)} N). Increase F beyond the limit to start sliding.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Friction against the push', col);
    const gy = 78, bx = 30 + x * 30; line(ctx, [[10, gy + 4], [w - 10, gy + 4]], col.ink, 2);
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, gy - 32, 44, 32); text(ctx, `${m} kg`, bx + 22, gy - 16, { size: 11, weight: 700, color: col.panel, align: 'center' });
    const f = F > fmax() ? fk() : F; arrow(ctx, bx - 4 - Math.min(70, F * 0.7), gy - 16, bx - 4, gy - 16, col.s[2], 3, 8); arrow(ctx, bx + 48, gy - 16, bx + 48 - Math.min(70, f * 0.7), gy - 16, col.s[3], 3, 8);
    text(ctx, 'push F →', bx - 6, gy + 16, { size: 10.5, weight: 700, color: col.s[2], align: 'right' }); text(ctx, '← friction f', bx + 52, gy + 16, { size: 10.5, weight: 700, color: col.s[3] });
    const A = axes(ctx, w, h, col, { x: [0, 100], y: [0, 100], xlabel: 'applied force F (N)', ylabel: 'friction f (N)', l: 46, t: 126, b: 40 });
    const fm = Math.min(100, fmax()), kk = Math.min(100, fk());
    ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(0)], [A.X(fm), A.Y(fm)], [A.X(fm), A.Y(kk)], [A.X(100), A.Y(kk)]], col.s[0], 3); line(ctx, [[A.X(0), A.Y(0)], [A.X(100), A.Y(100)]], col.line, 1, [4, 4]); ctx.restore();
    dot(ctx, A.X(F), A.Y(f), 6, col.s[3], col.panel);
    text(ctx, 'static: f = F', A.X(fm * 0.5) - 6, A.Y(fm * 0.5) - 12, { size: 10.5, weight: 700, color: col.s[0], align: 'right' }); text(ctx, 'kinetic: f = μₖN', A.R - 6, A.Y(kk) - 10, { size: 10.5, weight: 700, color: col.s[0], align: 'right' }); text(ctx, 'limit μₛN', A.X(fm) + 6, A.Y(fm) + 4, { size: 10, color: col.muted });
  };
  say();
}
