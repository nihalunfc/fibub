// Class 12 Biology, Sexual Reproduction in Flowering Plants: pollen germination and the growth of the pollen tube down the style to the ovule.
// A compatible grain germinates on the stigma, the tube grows through the style (guided by chemicals from the pistil and then from the synergids),
// enters the micropyle and releases two male gametes. An incompatible grain is stopped by the pistil (self-incompatibility).
import { canvas, text, title, line, dot, row, slider, choice, button, readout, loop, clamp } from '../../kit.js';

export default function (host) {
  let p = 0, ok = true;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A pollen tube growing from the stigma down the style into the ovule, with a slider for time' });
  const ctl = row(host), ro = readout(host);
  const anim = loop(host, (dt) => { if (anim.playing) { p += dt * 0.12; if (p >= 1) { p = 1; anim.pause(); } sl.set(p); go(); } }, { autoplay: false });
  const sl = slider(ctl, { label: 'time', min: 0, max: 1, step: 0.005, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { p = v; anim.pause(); go(); } });
  choice(ctl, 'Pollen', [[true, 'Compatible'], [false, 'Incompatible']], true, (v) => { ok = v; go(); });
  button(ctl, '▶ Grow', () => { if (p >= 1) p = 0; anim.play(); });
  const eff = () => (ok ? p : Math.min(p, 0.3));
  const go = () => {
    const e = eff();
    ro.textContent = e < 0.02 ? 'Pollen lands on the stigma (the pistil checks whether it is the right kind of pollen).' : !ok && p > 0.3 ? 'Incompatible pollen: the pistil rejects it and the tube stops growing in the style. This stops self-pollination in some species.' : e < 0.72 ? 'The pollen grain germinates and the tube grows down through the style, taking the two male gametes and the tube nucleus with it.' : e < 0.9 ? 'The tube reaches the ovule and enters through the micropyle.' : 'The tube enters a synergid and releases the two male gametes: ready for double fertilisation.';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pollen tube growth', col) + 4, cx = w * 0.4, sy = top + 22, oy = h - 118, e = eff();
    // pistil: stigma, style (channel), ovary, ovule
    ctx.beginPath(); ctx.ellipse(cx, sy, 40, 12, 0, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 14, sy + 8); ctx.lineTo(cx - 14, oy - 8); ctx.lineTo(cx + 14, oy - 8); ctx.lineTo(cx + 14, sy + 8); ctx.fillStyle = col.soft; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, oy + 50, 84, 66, 0, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.stroke();
    // ovule + embryo sac
    ctx.beginPath(); ctx.ellipse(cx, oy + 52, 34, 46, 0, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, oy + 52, 19, 32, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 1; ctx.stroke();
    dot(ctx, cx, oy + 28, 4, col.s[3]); dot(ctx, cx - 7, oy + 33, 3, col.s[0]); dot(ctx, cx + 7, oy + 33, 3, col.s[0]); dot(ctx, cx - 3, oy + 52, 3.5, col.s[1]); dot(ctx, cx + 3, oy + 56, 3.5, col.s[1]);
    // pollen grain and tube path
    const px = cx - 10, path = [[px, sy - 14], [px, sy + 4], [cx - 6, sy + (oy - sy) * 0.3], [cx + 4, sy + (oy - sy) * 0.6], [cx + 2, oy - 4], [cx, oy + 20]];
    const len = []; let tot = 0; for (let i = 1; i < path.length; i++) { tot += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); len.push(tot); }
    const D = clamp(e / 0.92, 0, 1) * tot, pts = [path[0]];
    for (let i = 1; i < path.length; i++) { const prev = i > 1 ? len[i - 2] : 0; if (D >= len[i - 1]) pts.push(path[i]); else { const f = (D - prev) / (len[i - 1] - prev); if (f > 0) pts.push([path[i - 1][0] + f * (path[i][0] - path[i - 1][0]), path[i - 1][1] + f * (path[i][1] - path[i - 1][1])]); break; } }
    if (e > 0.02) line(ctx, pts, ok ? col.s[3] : col.bad, 4);
    dot(ctx, px, sy - 16, 10, col.s[4], col.ink);
    const tip = pts[pts.length - 1]; if (e > 0.02) { dot(ctx, tip[0], tip[1], 4, ok ? col.s[1] : col.bad); if (ok && e > 0.1) { const b = (e / 0.92); for (let k = 0; k < 2; k++) { const q = clamp(D - 10 - k * 9, 0, tot), idx = pts[Math.max(0, Math.round(pts.length * clamp(q / Math.max(D, 1), 0, 1)) - 1)]; if (e < 0.9) dot(ctx, idx[0], idx[1], 2.8, col.s[3], col.ink); } } }
    if (ok && e >= 0.9) { dot(ctx, cx - 4, oy + 30, 3.5, col.s[3], col.ink); dot(ctx, cx + 6, oy + 30, 3.5, col.s[3], col.ink); }
    if (!ok && p > 0.3) text(ctx, '✕ stopped', cx + 22, sy + (oy - sy) * 0.3 + 4, { color: col.bad, size: 11, weight: 700 });
    const lab = (s, x, y, c = col.muted, al = 'left') => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: al, halo: col.panel });
    lab('pollen grain', px - 16, sy - 20, col.ink, 'right'); lab('stigma', cx + 44, sy, col.ink); lab('style', cx + 20, sy + (oy - sy) * 0.5, col.ink); lab('ovary', cx + 88, oy + 20, col.ink); lab('micropyle', cx + 22, oy + 1, col.ink); lab('embryo sac', cx + 40, oy + 62, col.ink);
    lab('tube (grows by tip)', w - 6, sy + 36, col.s[3], 'right'); lab('chemical signals', w - 6, sy + 62, col.muted, 'right'); lab('guide the tube', w - 6, sy + 76, col.muted, 'right');
    if (ok && e > 0.45 && e < 0.9) { for (let k = 0; k < 3; k++) { const y = sy + (oy - sy) * (0.4 + k * 0.17); line(ctx, [[cx + 40, y], [cx + 20, y]], col.s[0], 1, [3, 3]); } }
  };
  go();
}
