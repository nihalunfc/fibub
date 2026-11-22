// Class 12 Human Health and Disease (step player): the adaptive immune response. A macrophage engulfs a pathogen and shows a piece (antigen) to a helper T cell; the helper T cell
// activates B cells, which become plasma cells (making antibodies: humoral immunity) and memory cells; killer (cytotoxic) T cells destroy infected body cells (cell-mediated immunity).
import { canvas, text, title, arrow, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Steps of the adaptive immune response with macrophage, helper T cell, B cell, plasma cell, killer T cell and memory cells' });
  const T = ['A pathogen gets in', 'Macrophage presents the antigen', 'Helper T cell is activated', 'B cells make antibodies (humoral)', 'Killer T cells attack (cell-mediated)', 'Memory cells stay behind'];
  const NOTE = ['A bacterium or virus passes the first barriers. Its surface proteins are antigens.', 'The macrophage engulfs it and shows a piece of the antigen on its surface. It is an antigen-presenting cell.', 'The helper T cell (TH, CD4) recognises the antigen and sends out chemical signals (cytokines) that switch on B cells and killer T cells.', 'An activated B cell multiplies into plasma cells that release antibodies, which stick to the pathogen and mark it for destruction. Some become memory B cells.', 'Cytotoxic T cells find body cells infected by a virus (or transplanted or cancer cells) and kill them. This is the cell-mediated response, also the cause of graft rejection.', 'Memory B and T cells stay for years. A second meeting with the same antigen gives a faster, stronger response: this is why vaccines work.'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), y1 = t0 + 44, y2 = t0 + 118, y3 = t0 + 190;
    const cell = (x, y, r, c, lab, on, ring) => { ctx.globalAlpha = on ? 1 : 0.25; dot(ctx, x, y, r, c, ring ? col.ink : col.bg); ctx.globalAlpha = 1; text(ctx, lab, x, y + r + 11, { color: on ? col.ink : col.muted, size: 10, weight: on ? 700 : 400, align: 'center' }); };
    const xs = [w * 0.14, w * 0.38, w * 0.62, w * 0.86];
    // pathogen
    ctx.globalAlpha = step === 0 ? 1 : step === 1 ? 0.5 : 0.15; ctx.fillStyle = col.s[3]; ctx.fillRect(xs[0] - 9, y1 - 9, 18, 18); ctx.globalAlpha = 1; text(ctx, 'pathogen', xs[0], y1 + 22, { color: col.ink, size: 10, align: 'center' });
    cell(xs[1], y1, 16, col.s[0], 'macrophage', step >= 1, step === 1); if (step === 1) { ctx.fillStyle = col.s[3]; ctx.fillRect(xs[1] - 4, y1 - 24, 8, 8); text(ctx, 'antigen shown', xs[1], y1 - 32, { color: col.s[3], size: 10, weight: 700, align: 'center' }); }
    cell(xs[2], y1, 14, col.s[2], 'helper T', step >= 2, step === 2);
    if (step >= 1) arrow(ctx, xs[0] + 14, y1, xs[1] - 20, y1, col.muted, 1.5, 6); if (step >= 2) arrow(ctx, xs[1] + 20, y1, xs[2] - 18, y1, col.muted, 1.5, 6);
    // B cell branch
    cell(xs[0], y2 + 20, 13, col.s[1], 'B cell', step >= 3, step === 3); cell(xs[1], y2 + 20, 14, col.s[1], 'plasma cell', step >= 3, step === 3);
    if (step >= 2) arrow(ctx, xs[2] - 8, y1 + 18, xs[0] + 10, y2 + 8, col.muted, 1.5, 6);
    if (step >= 3) { arrow(ctx, xs[0] + 16, y2 + 20, xs[1] - 18, y2 + 20, col.muted, 1.5, 6); for (let k = 0; k < 4; k++) text(ctx, 'Y', xs[1] + 22 + k * 11, y2 + 14 + (k % 2) * 8, { color: col.s[1], size: 13, weight: 700 }); text(ctx, 'antibodies', xs[1] + 40, y2 + 38, { color: col.s[1], size: 10, align: 'center' }); }
    // killer T branch
    cell(xs[2], y2 + 20, 13, col.s[4], 'killer T', step >= 4, step === 4); if (step >= 2) arrow(ctx, xs[2], y1 + 18, xs[2], y2 + 4, col.muted, 1.5, 6);
    cell(xs[3], y2 + 20, 14, col.line, 'infected cell', step >= 4, false); if (step >= 4) { arrow(ctx, xs[2] + 16, y2 + 20, xs[3] - 18, y2 + 20, col.bad, 2, 7); text(ctx, '×', xs[3], y2 + 20, { color: col.bad, size: 20, weight: 700, align: 'center', base: 'middle' }); }
    // memory
    if (step === 5) { cell(xs[1], y3 + 6, 12, col.s[5] || col.s[1], 'memory B', true, true); cell(xs[2], y3 + 6, 12, col.s[5] || col.s[4], 'memory T', true, true); }
    wrap(ctx, NOTE[step], 12, h - 66, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
