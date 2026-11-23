// Class 11 Biology, Chemical coordination: the hypothalamus and the pituitary. The anterior lobe is controlled by releasing hormones from the hypothalamus that travel down a tiny blood portal vessel;
// the posterior lobe is not a gland of its own: it stores and releases oxytocin and vasopressin (ADH) made by hypothalamic neurons whose axons run down into it.
import { canvas, text, title, line, row, choice, readout, arrow } from '../../kit.js';

export default function (host) {
  let k = 'ant';
  const D = { ant: ['Anterior pituitary', 'GH (growth), prolactin (milk), TSH (thyroid), ACTH (adrenal cortex), LH and FSH (gonads). Controlled by releasing hormones sent through the portal blood vessels.'], post: ['Posterior pituitary', 'Stores and releases oxytocin (uterus contraction, milk ejection) and vasopressin or ADH (water balance), both made in the hypothalamus and sent down nerve fibres.'] };
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'The hypothalamus above the two lobes of the pituitary; blood vessels lead to the front lobe and nerve fibres to the back lobe' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Lobe', [['ant', 'Anterior (front)'], ['post', 'Posterior (back)']], k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${D[k][0]}: ${D[k][1]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col), cx = w / 2, hy = t0 + 16;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.roundRect(cx - 100, hy, 200, 50, 14); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'HYPOTHALAMUS', cx, hy + 25, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const py = hy + 130, a = k === 'ant';
    ctx.fillStyle = a ? col.s[3] : col.soft; ctx.beginPath(); ctx.ellipse(cx - 38, py, 36, 28, 0, 0, 7); ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = !a ? col.s[3] : col.soft; ctx.beginPath(); ctx.ellipse(cx + 38, py, 30, 24, 0, 0, 7); ctx.fill(); ctx.stroke();
    text(ctx, 'anterior', cx - 38, py, { color: a ? col.bg : col.ink, size: 10, weight: 700, align: 'center' }); text(ctx, 'posterior', cx + 38, py, { color: !a ? col.bg : col.ink, size: 10, weight: 700, align: 'center' });
    line(ctx, [[cx - 38, hy + 50], [cx - 38, py - 28]], a ? col.s[3] : col.line, 5); text(ctx, 'portal vessel: releasing hormones', cx - 44, hy + 82, { color: col.muted, size: 9.5, align: 'right' });
    line(ctx, [[cx + 38, hy + 50], [cx + 38, py - 24]], !a ? col.s[3] : col.line, 3, [3, 2]); text(ctx, 'nerve fibres: ADH, oxytocin', cx + 44, hy + 82, { color: col.muted, size: 9.5 });
    const outs = a ? ['GH', 'PRL', 'TSH', 'ACTH', 'LH', 'FSH'] : ['oxytocin', 'ADH'];
    outs.forEach((n, i) => { const x = cx + (i - (outs.length - 1) / 2) * (a ? 46 : 70) + (a ? -38 : 38) * (a ? 0.3 : 0.3); arrow(ctx, cx + (a ? -38 : 38) + (i - (outs.length - 1) / 2) * 6, py + 30, x, py + 62, col.s[3], 1.5, 5); text(ctx, n, x, py + 74, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    text(ctx, a ? 'six hormones made here' : 'made in hypothalamus, stored here', cx, py + 100, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
