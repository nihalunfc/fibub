// Class 11 Biology, Chemical coordination: the endocrine glands of the human body and the hormones each one makes. Tap a gland (or press Next gland) to see its hormones and what they do.
// Glands are ductless: they release hormones straight into the blood, which carries them to target organs.
import { canvas, text, title, line, row, button, readout } from '../../kit.js';

export default function (host) {
  let k = 0;
  const G = [
    ['Hypothalamus', 0.5, 0.1, 'releasing and inhibiting hormones that control the pituitary (e.g. TRH, GnRH, somatostatin); makes ADH and oxytocin'],
    ['Pituitary', 0.5, 0.17, 'master gland: GH, prolactin, TSH, ACTH, LH, FSH (front); stores oxytocin and ADH (back)'],
    ['Pineal', 0.4, 0.07, 'melatonin: body clock, sleep and waking, skin colour'],
    ['Thyroid', 0.5, 0.3, 'thyroxine (T4, T3): metabolic rate, growth; calcitonin lowers blood calcium'],
    ['Parathyroids', 0.6, 0.3, 'parathyroid hormone (PTH): raises blood calcium'],
    ['Thymus', 0.5, 0.4, 'thymosins: make T lymphocytes (immunity); shrinks with age'],
    ['Adrenals', 0.35, 0.56, 'medulla: adrenaline, noradrenaline (emergency); cortex: cortisol, aldosterone, sex hormones'],
    ['Pancreas', 0.55, 0.57, 'islets: insulin lowers and glucagon raises blood sugar'],
    ['Gonads', 0.5, 0.74, 'testes: testosterone; ovaries: oestrogen and progesterone'],
  ];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'An outline of a human body with nine endocrine glands marked; tap a gland to read its hormones' });
  const ctl = row(host), ro = readout(host);
  button(ctl, 'Next gland', () => { k = (k + 1) % G.length; go(); });
  const go = () => { ro.textContent = `${G[k][0]}: ${G[k][3]}.`; cv.redraw(); };
  let box = null;
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, G[k][0], col), cx = w * 0.5, top = t0 + 6, H = h - top - 6; box = { cx, top, H };
    ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.fillStyle = col.soft;
    ctx.beginPath(); ctx.ellipse(cx, top + H * 0.1, H * 0.075, H * 0.095, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(cx - H * 0.15, top + H * 0.2, H * 0.3, H * 0.62, 18); ctx.fill(); ctx.stroke();
    line(ctx, [[cx - H * 0.15, top + H * 0.24], [cx - H * 0.3, top + H * 0.56]], col.line, 10); line(ctx, [[cx + H * 0.15, top + H * 0.24], [cx + H * 0.3, top + H * 0.56]], col.line, 10);
    G.forEach(([n, u, v], i) => {
      const x = cx + (u - 0.5) * H * 0.55 * (u === 0.4 ? 1.0 : 1), y = top + v * H * 1.0; ctx.beginPath(); ctx.arc(x, y, i === k ? 9 : 6, 0, 7); ctx.fillStyle = i === k ? col.s[3] : col.s[0]; ctx.fill(); if (i === k) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); }
      const left = ['Pineal','Thyroid','Adrenals','Hypothalamus'].includes(n); text(ctx, n, left ? x - 14 : x + 14, y, { color: i === k ? col.ink : col.muted, size: 10, weight: i === k ? 700 : 400, align: left ? 'right' : 'left', halo: col.bg });
    });
  };
  cv.el = cv.el ?? null;
  const c = host.querySelector('canvas');
  c && c.addEventListener('click', (e) => { const b = c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; if (!box) return; let best = -1, bd = 26; G.forEach(([n, u, v], i) => { const gx = box.cx + (u - 0.5) * box.H * 0.55, gy = box.top + v * box.H, d = Math.hypot(gx - x, gy - y); if (d < bd) { bd = d; best = i; } }); if (best >= 0) { k = best; go(); } });
  go();
}
