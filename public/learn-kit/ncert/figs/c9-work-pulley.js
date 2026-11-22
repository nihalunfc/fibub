// Class 9 Work and Energy, simple machines: pulley systems (a schematic). The load hangs from n supporting strands
// of rope, so each strand carries load/n: the effort is load/n (mechanical advantage n). But to lift the load by 1 m
// every strand must shorten by 1 m, so the hand pulls n metres of rope: effort x distance = load x height (ideal).
// n = 1 is a fixed pulley, which only changes the direction of the pull.
import { canvas, text, title, line, dot, row, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let n = 2, pull = 0, going = false;
  const load = 80;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A pulley system with n supporting rope strands lifting a load, showing effort and rope pulled' });
  const ctl = row(host);
  choice(ctl, 'Strands holding the load', [[1, '1 (fixed)'], [2, '2'], [3, '3'], [4, '4']], n, (v) => { n = v; pull = 0; upd(); });
  button(ctl, '▶ Pull the rope', () => { pull = 0; going = true; });
  const out = readout(host);
  function upd() { out.innerHTML = `${n} strand${n > 1 ? 's' : ''} share the ${load} N load: effort = ${load} ÷ ${n} = <b>${(load / n).toFixed(0)} N</b>. To lift the load 1 m you pull <b>${n} m</b> of rope. Work in: ${(load / n).toFixed(0)} × ${n} = ${load} J. Work out: ${load} × 1 = ${load} J. Equal (ideal, no friction).`; cv.redraw(); }
  loop(host, (dt) => { if (going) { pull += dt * 0.4; if (pull >= 1) { pull = 1; going = false; } cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, n === 1 ? 'Fixed pulley: only changes direction' : `${n} strands share the load`, col);
    const cx = w * 0.4, ceil = 44, hw = 24 + n * 14, rise = pull * (h * 0.26), blockTop = h * 0.5 - rise;
    line(ctx, [[cx - hw - 12, ceil], [cx + hw + 22, ceil]], col.ink, 6);
    for (let k = 0; k < 6; k++) line(ctx, [[cx - hw - 8 + k * (2 * hw + 28) / 5, ceil - 3], [cx - hw - 14 + k * (2 * hw + 28) / 5, ceil - 10]], col.muted, 1.5);
    const xs = []; for (let i = 0; i < n; i++) xs.push(n === 1 ? cx : cx - hw + (i * 2 * hw) / (n - 1));
    xs.forEach((x) => { line(ctx, [[x, ceil], [x, blockTop]], col.s[3], 2.5); dot(ctx, x, blockTop, 3.5, col.ink); });
    ctx.fillStyle = col.soft; ctx.fillRect(cx - hw - 6, blockTop, 2 * hw + 12, 12); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - hw - 6, blockTop, 2 * hw + 12, 12);
    line(ctx, [[cx, blockTop + 12], [cx, blockTop + 24]], col.ink, 2);
    ctx.fillStyle = col.s[1]; ctx.fillRect(cx - 24, blockTop + 24, 48, 32); ctx.strokeRect(cx - 24, blockTop + 24, 48, 32);
    text(ctx, `${load} N`, cx, blockTop + 40, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    // free end: from the top bar, over a pulley at the right, down to the hand
    const rx = cx + hw + 22, hand = h * 0.34 + pull * n * (h * 0.15);
    dot(ctx, rx - 4, ceil + 12, 9, col.soft, col.ink); line(ctx, [[rx + 5, ceil + 12], [rx + 5, hand]], col.s[3], 2.5); line(ctx, [[xs.at(-1), ceil], [xs.at(-1), ceil + 12], [rx - 4, ceil + 3]], col.s[3], 2.5);
    dot(ctx, rx + 5, hand + 5, 8, col.s[0]);
    text(ctx, `pull ${(load / n).toFixed(0)} N`, rx + 16, hand + 5, { color: col.s[0], size: 11.5, weight: 700 });
    text(ctx, `rope pulled ${(pull * n).toFixed(2)} m`, 10, h - 34, { color: col.s[0], size: 11.5, weight: 700 });
    text(ctx, `load raised ${pull.toFixed(2)} m`, 10, h - 16, { color: col.s[1], size: 11.5, weight: 700 });
  };
  upd();
}
