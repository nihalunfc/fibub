// Class 9 Reproduction: four more ways of asexual reproduction, animated. Budding: a small outgrowth (bud) grows on the
// parent (yeast, Hydra) and breaks off. Fragmentation: a body breaks into pieces and each grows into a new individual
// (Spirogyra). Spores: a fungus such as Rhizopus (bread mould) releases tiny light spores that grow into new fungus where
// they land. Regeneration: a flatworm like Planaria cut in two can regrow the missing parts. One parent only: no gametes.
import { canvas, text, title, dot, line, row, choice, loop, readout, ease } from '../../kit.js';

const INFO = {
  bud: 'Budding (yeast, Hydra): a bud grows out of the parent, gets its own nucleus, then breaks off as a new individual.',
  frag: 'Fragmentation (Spirogyra): the filament breaks into pieces, and each piece grows into a new filament by cell division.',
  spore: 'Spores (Rhizopus, bread mould): thousands of tiny, light spores in a sporangium are blown away and grow where there is moist food.',
  regen: 'Regeneration (Planaria, Hydra): cut pieces regrow the missing parts and become complete new worms.',
};
export default function (host) {
  let mode = 'bud', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 400, min: 280, label: 'Animations of budding, fragmentation, spore formation and regeneration' });
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(row(host));
  const ctl = row(host);
  choice(ctl, 'Mode', [['bud', 'Budding'], ['frag', 'Fragmentation'], ['spore', 'Spores'], ['regen', 'Regeneration']], mode, (v) => { mode = v; t = 0; upd(); });
  const out = readout(host);
  function upd() { out.textContent = INFO[mode]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, { bud: 'Budding in yeast', frag: 'Fragmentation in Spirogyra', spore: 'Spores of bread mould', regen: 'Regeneration in Planaria' }[mode], col);
    const P = (t % 6) / 6, cy = h * 0.5;
    if (mode === 'bud') {
      const R = Math.min(w * 0.14, 44), cx = w * 0.4;
      const g = ease(Math.min(1, P / 0.55)), sep = ease(Math.max(0, (P - 0.7) / 0.3));
      const br = R * 0.6 * g, bx = cx + (R * 0.85 + br * 0.4) * 0.8 + sep * 70, by = cy - (R * 0.55 + br * 0.3) * 0.8 - sep * 18 + sep * 30;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); dot(ctx, cx, cy, R * 0.3, col.s[1]);
      if (g > 0.02) { ctx.beginPath(); ctx.arc(bx, by, Math.max(2, br), 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke(); if (g > 0.6) dot(ctx, bx, by, br * 0.3, col.s[1]); }
      text(ctx, 'parent', cx, cy + R + 14, { color: col.ink, size: 11, align: 'center' });
      text(ctx, sep > 0.5 ? 'new yeast cell' : 'bud', bx, by + br + 14, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    }
    if (mode === 'frag') {
      const n = 9, cw = Math.min(26, (w - 40) / n), sep = ease(Math.max(0, (P - 0.3) / 0.35)), grow = ease(Math.max(0, (P - 0.65) / 0.35));
      const pieces = [[0, 3], [3, 6], [6, 9]];
      pieces.forEach(([a, b], k) => {
        const dy = (k - 1) * 46 * sep, extra = Math.round(grow * 2);
        const x0 = w / 2 - (n * cw) / 2 + (k - 1) * 14 * sep;
        for (let i = a; i < b + extra; i++) { const isNew = i >= b; ctx.fillStyle = isNew ? col.s[2] : col.soft; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.6; ctx.fillRect(x0 + i * cw, cy - 11 + dy, cw - 2, 22); ctx.strokeRect(x0 + i * cw, cy - 11 + dy, cw - 2, 22); }
      });
      if (sep > 0.2 && sep < 0.9) { text(ctx, 'filament breaks', w / 2, cy - 82, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
      if (grow > 0.2) text(ctx, 'each piece grows (new cells, dark)', w / 2, cy + 90, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    }
    if (mode === 'spore') {
      const gx = w * 0.3, gy = h * 0.78, burst = ease(Math.max(0, (P - 0.25) / 0.3));
      line(ctx, [[8, gy], [w - 8, gy]], col.muted, 2);
      text(ctx, 'moist bread', 12, gy + 14, { color: col.muted, size: 10 });
      line(ctx, [[gx, gy], [gx, gy - 74]], col.s[2], 3);
      if (burst < 0.05) { ctx.beginPath(); ctx.arc(gx, gy - 86, 16, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(gx, gy - 86, 16, Math.PI * 0.95, Math.PI * 2.05); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke(); }
      text(ctx, 'sporangium', gx - 24, gy - 112, { color: col.s[1], size: 10.5, weight: 700 });
      for (let k = 0; k < 14; k++) {
        const a = k * 2.4, ex = gx + 40 + (k % 7) * 22, land = ease(Math.max(0, (P - 0.5) / 0.3));
        const x = gx + (ex - gx) * burst * (0.3 + 0.7 * land) + Math.sin(a + t) * 4 * (1 - land), y = gy - 86 + (gy - 3 - (gy - 86)) * land + (1 - land) * (-30 * burst * Math.sin(a * 1.3 + 0.5));
        if (burst > 0.02) dot(ctx, x, y, 2.4, col.ink);
        if (land > 0.95 && P > 0.8 && k % 3 === 0) { const gr = ease((P - 0.8) / 0.2); line(ctx, [[ex, gy], [ex + 8 * gr, gy - 16 * gr], [ex + 2 * gr, gy - 24 * gr]], col.s[2], 2); }
      }
      text(ctx, 'spores land and grow', w - 12, gy - 24, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    }
    if (mode === 'regen') {
      const wl = Math.min(130, w * 0.4), cut = ease(Math.max(0, (P - 0.25) / 0.2)), reg = ease(Math.max(0, (P - 0.5) / 0.45));
      const worm = (x, y, len, c, alpha = 1) => { ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x, y - 11, len, 22, 11); ctx.fill(); ctx.restore(); };
      const x0 = w / 2 - wl / 2;
      if (cut < 0.02) { worm(x0, cy, wl, col.s[2]); dot(ctx, x0 + 12, cy - 4, 2.5, '#fff'); dot(ctx, x0 + 12, cy + 4, 2.5, '#fff'); }
      else {
        const sep = cut * 22, head = wl * 0.5, tail = wl * 0.5;
        worm(x0 - sep, cy - sep * 0.8, head, col.s[2]); dot(ctx, x0 - sep + 12, cy - sep * 0.8 - 4, 2.5, '#fff'); dot(ctx, x0 - sep + 12, cy - sep * 0.8 + 4, 2.5, '#fff');
        worm(x0 + head + sep, cy + sep * 0.8, tail, col.s[2]);
        worm(x0 - sep + head, cy - sep * 0.8, tail * reg, col.s[3], 1); worm(x0 + sep + head - head * reg, cy + sep * 0.8, head * reg, col.s[3], 1);
        if (reg > 0.3) text(ctx, 'regrown parts', w / 2, cy + 70, { color: col.s[3], size: 11, weight: 700, align: 'center' });
        line(ctx, [[x0 + head, cy - 20], [x0 + head, cy + 20]], col.bad, 2, [3, 3]);
      }
      text(ctx, cut < 0.02 ? 'one worm' : reg > 0.9 ? 'two complete worms' : 'cut in two', w / 2, cy - 70, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    }
  };
  upd();
}
