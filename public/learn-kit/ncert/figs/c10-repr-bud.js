// Class 10 How do Organisms Reproduce?: budding. A bud grows out of the parent (yeast: an outgrowth of the cell;
// Hydra: a small outgrowth with regenerating cells), takes a copy of the nucleus, becomes a small copy of the parent and
// finally breaks off. Slide the growth, or play.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let org = 'yeast', u = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A yeast cell or a Hydra producing a bud' });
  const ctl = row(host);
  choice(ctl, 'Organism', [['yeast', 'Yeast'], ['hydra', 'Hydra']], org, (v) => { org = v; u = 0; sl.set(0); say(); });
  const sl = slider(ctl, { label: 'Growth', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { u = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) u = 0; } else { u += dt * 0.14; if (u >= 1) { u = 1; hold = 1.2; } } sl.set(u); cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() { out.textContent = org === 'yeast' ? 'Yeast is a single cell. The bud receives a copy of the nucleus, grows, and separates. Warm sugar solution makes yeast bud quickly (that is how dough rises).' : 'Hydra buds from one spot on its body, where cells divide a lot. The bud grows its own mouth and tentacles, then drops off as a new Hydra.'; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, f, s, lw = 2) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  const hydra = (ctx, x, y, s, col) => { const bh = 90 * s, bw = 16 * s; ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[1]; ctx.fillRect(x - bw / 2, y - bh, bw, bh); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.strokeRect(x - bw / 2, y - bh, bw, bh); for (let i = -2; i <= 2; i++) line(ctx, [[x + i * bw * 0.22, y - bh], [x + i * bw * 0.9, y - bh - 26 * s]], col.ink, 1.6); ell(ctx, x, y + 2 * s, bw * 0.9, 3 * s, col.s[1], col.ink, 1.5); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, org === 'yeast' ? 'Budding in yeast' : 'Budding in Hydra', col) + 6, cy = top + (h - top - 30) / 2;
    if (org === 'yeast') {
      const r = Math.min(w * 0.17, 56), br = r * 0.7 * Math.min(1, u * 1.1), off = u < 0.88 ? r * 0.55 + br * 0.9 : r + br + (u - 0.88) * 120 * 0.6, ang = -0.5, cx = w / 2 - r * 0.6, cyy = cy + r * 0.4;
      const bx = cx + Math.cos(ang) * off, by = cyy + Math.sin(ang) * off;
      ctx.save(); ctx.globalAlpha = 0.3; ell(ctx, cx, cyy, r, r * 0.9, col.s[2]); if (br > 1) ell(ctx, bx, by, br, br * 0.9, col.s[2]); ctx.restore();
      ell(ctx, cx, cyy, r, r * 0.9, null, col.ink); if (br > 1) ell(ctx, bx, by, br, br * 0.9, null, col.ink);
      ell(ctx, cx, cyy, r * 0.3, r * 0.3, col.s[0], col.ink, 1.3); if (u > 0.35) ell(ctx, bx, by, br * 0.38, br * 0.34, col.s[0], col.ink, 1.2);
      text(ctx, 'parent cell', cx, cyy + r * 1.1 + 10, { color: col.muted, size: 10.5, align: 'center' }); if (br > 6) text(ctx, u > 0.9 ? 'new yeast cell' : 'bud', bx, by - br - 10, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    } else {
      const base = cy + 54, px = w * 0.4; hydra(ctx, px, base, 1, col);
      const s = 0.55 * Math.min(1, u * 1.05), detach = u > 0.9 ? (u - 0.9) * 10 : 0, bxx = px + 8 + (u > 0.9 ? detach * 34 : 0), byy = base - 40 + detach * 22;
      if (s > 0.03) { hydra(ctx, bxx + 26 * s, byy + 90 * s * 0 + 0, s, col); }
      text(ctx, 'parent', px, base + 18, { color: col.muted, size: 10.5, align: 'center' }); if (s > 0.3) text(ctx, u > 0.9 ? 'new Hydra' : 'bud', bxx + 26 * s + 6, byy + 26, { color: col.ink, size: 10.5, weight: 700, align: 'left' });
      line(ctx, [[10, base + 4], [w - 10, base + 4]], col.line, 1.5, [4, 4]);
    }
    text(ctx, u < 0.15 ? 'no bud yet' : u < 0.9 ? 'the bud grows' : 'the bud separates', w / 2, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  say();
}
