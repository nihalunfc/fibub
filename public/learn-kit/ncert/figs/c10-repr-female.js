// Class 10 How do Organisms Reproduce?: the human female reproductive system (schematic, front view). Ovaries make eggs
// (one released about every month) and the hormones oestrogen and progesterone. The egg is swept into the oviduct
// (fallopian tube), where fertilisation usually happens. The uterus holds the developing baby; the cervix and vagina form
// the birth canal.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

const P = {
  all: ['Female reproductive system', 'Choose a part to see its job. The egg is released from an ovary, travels along an oviduct and, if fertilised, settles in the uterus.'],
  ovary: ['Ovaries', 'Two ovaries make the egg cells (female gametes) and the hormones oestrogen and progesterone. From puberty, one egg is released about once a month.'],
  oviduct: ['Oviducts (fallopian tubes)', 'The funnel-shaped end catches the egg. Fertilisation usually happens in the oviduct, and tiny hair-like cilia and muscle waves move the egg towards the uterus.'],
  uterus: ['Uterus (womb)', 'A muscular, pear-shaped organ. Its lining thickens every month to receive a fertilised egg, and the baby grows here until birth.'],
  vagina: ['Cervix and vagina', 'The cervix is the narrow neck of the uterus. Together with the vagina it forms the birth canal, and sperm enter through it.'],
};
export default function (host) {
  let part = 'all', t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'Schematic of the human female reproductive system with parts you can choose' });
  const ctl = row(host);
  choice(ctl, 'Part', [['all', 'All'], ['ovary', 'Ovary'], ['oviduct', 'Oviduct'], ['uterus', 'Uterus'], ['vagina', 'Cervix, vagina']], part, (v) => { part = v; say(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function say() { out.innerHTML = `<b>${P[part][0]}.</b> ${P[part][1]}`; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, f, s, lw = 1.8, al = 1) => { ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, P[part][0], col) + 12, cx = w * 0.5, H = h - top - 26, Y = (f) => top + f * H, S = Math.min(1, w / 400);
    const on = (p) => part === 'all' || part === p, al = (p) => (on(p) ? 1 : 0.2), lw = (p) => (part === p ? 3.4 : 2), ink = (p) => (on(p) ? col.ink : col.muted);
    // uterus (inverted pear)
    ctx.save(); ctx.globalAlpha = al('uterus'); ctx.beginPath(); ctx.moveTo(cx - 52 * S, Y(0.22)); ctx.quadraticCurveTo(cx - 20 * S, Y(0.18), cx, Y(0.2)); ctx.quadraticCurveTo(cx + 20 * S, Y(0.18), cx + 52 * S, Y(0.22)); ctx.quadraticCurveTo(cx + 50 * S, Y(0.5), cx + 10 * S, Y(0.62)); ctx.lineTo(cx - 10 * S, Y(0.62)); ctx.quadraticCurveTo(cx - 50 * S, Y(0.5), cx - 52 * S, Y(0.22)); ctx.closePath(); ctx.fillStyle = col.s[4]; ctx.globalAlpha = al('uterus') * 0.35; ctx.fill(); ctx.globalAlpha = al('uterus'); ctx.strokeStyle = ink('uterus'); ctx.lineWidth = lw('uterus'); ctx.stroke(); ctx.restore();
    ell(ctx, cx, Y(0.34), 22 * S, 22 * S, col.panel, null, 1, al('uterus') * 0.6);
    // cervix + vagina
    ctx.save(); ctx.globalAlpha = al('vagina'); ctx.fillStyle = col.s[2]; ctx.globalAlpha = al('vagina') * 0.35; ctx.fillRect(cx - 10 * S, Y(0.62), 20 * S, Y(0.98) - Y(0.62)); ctx.globalAlpha = al('vagina'); ctx.strokeStyle = ink('vagina'); ctx.lineWidth = lw('vagina'); ctx.strokeRect(cx - 10 * S, Y(0.62), 20 * S, Y(0.98) - Y(0.62)); line(ctx, [[cx - 11 * S, Y(0.7)], [cx + 11 * S, Y(0.7)]], ink('vagina'), 1.5, [3, 2]); ctx.restore();
    // oviducts and ovaries
    [-1, 1].forEach((d, k) => {
      const pts = [[cx + d * 50 * S, Y(0.22)], [cx + d * 85 * S, Y(0.16)], [cx + d * 120 * S, Y(0.2)], [cx + d * 122 * S, Y(0.3)]];
      ctx.save(); ctx.globalAlpha = al('oviduct'); line(ctx, pts, ink('oviduct'), lw('oviduct') + 1); ctx.restore();
      ell(ctx, cx + d * 122 * S, Y(0.34), 10 * S, 7 * S, col.s[4], ink('oviduct'), 1.5, al('oviduct'));
      ell(ctx, cx + d * 118 * S, Y(0.46), 26 * S, 17 * S, col.s[1], ink('ovary'), lw('ovary'), al('ovary'));
      ell(ctx, cx + d * 118 * S, Y(0.46), 7 * S, 6 * S, col.panel, ink('ovary'), 1.2, al('ovary'));
      if (part === 'all' || part === 'ovary' || part === 'oviduct') { const f = ((t * 0.12 + k * 0.5) % 1); if (k === 0) { const px = [[cx + d * 118 * S, Y(0.46)], [cx + d * 122 * S, Y(0.33)], [cx + d * 120 * S, Y(0.2)], [cx + d * 85 * S, Y(0.16)], [cx + d * 50 * S, Y(0.22)]], seg = f * 4, a = Math.min(3, Math.floor(seg)), u = seg - a; dot(ctx, px[a][0] + (px[a + 1][0] - px[a][0]) * u, px[a][1] + (px[a + 1][1] - px[a][1]) * u, 4, col.s[7], col.ink); } }
    });
    const lab = (s, x, y, p, al_ = 'left') => { if (on(p)) text(ctx, s, x, y, { color: col.ink, size: 10.5, weight: part === p ? 700 : 400, align: al_ }); };
    lab('ovary', 10, Y(0.58), 'ovary'); lab('oviduct (fallopian tube)', 10, Y(0.07), 'oviduct'); lab('uterus', cx, Y(0.34), 'uterus', 'center'); lab('cervix', cx + 18 * S, Y(0.64), 'vagina'); lab('vagina', cx + 18 * S, Y(0.84), 'vagina');
    if (part === 'all' || part === 'ovary') text(ctx, 'egg released (animated dot travels along the oviduct)', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
