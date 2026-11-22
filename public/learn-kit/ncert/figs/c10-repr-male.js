// Class 10 How do Organisms Reproduce?: the human male reproductive system (school-level, schematic, front view).
// Testes (in the scrotum) make sperm and the hormone testosterone; the scrotum keeps them slightly cooler than the body;
// sperm travel through the vas deferens; seminal vesicle and prostate add fluid; the urethra in the penis carries semen out.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

const P = {
  all: ['Male reproductive system', 'Choose a part to see its job. Sperm made in the testes travel up through the vas deferens, mix with fluid from glands, and leave through the urethra.'],
  testis: ['Testes (in the scrotum)', 'Make sperm (the male gametes) and the hormone testosterone, which brings changes at puberty. The scrotum hangs outside the body because sperm need a temperature slightly lower than body temperature.'],
  vas: ['Vas deferens', 'A tube that carries sperm from each testis up and over the bladder to join the urethra.'],
  gland: ['Seminal vesicle and prostate', 'They add fluid that nourishes the sperm and makes it easier for them to swim. Sperm plus this fluid is called semen.'],
  urethra: ['Urethra and penis', 'The urethra is a common path for semen and urine (not at the same time). The penis carries it out of the body.'],
};
export default function (host) {
  let part = 'all', t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'Schematic of the human male reproductive system with parts you can choose' });
  const ctl = row(host);
  choice(ctl, 'Part', [['all', 'All'], ['testis', 'Testis'], ['vas', 'Vas deferens'], ['gland', 'Glands'], ['urethra', 'Urethra']], part, (v) => { part = v; say(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function say() { out.innerHTML = `<b>${P[part][0]}.</b> ${P[part][1]}`; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, f, s, lw = 1.8, al = 1) => { ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, P[part][0], col) + 10, cx = w * 0.5, H = h - top - 22, Y = (f) => top + f * H;
    const on = (p) => part === 'all' || part === p, al = (p) => (on(p) ? 1 : 0.2), lw = (p) => (part === p ? 3.4 : 2);
    // bladder
    ell(ctx, cx, Y(0.1), 36, 24, col.s[0], col.muted, 1.4, 0.25); text(ctx, 'bladder', cx, Y(0.1), { color: col.muted, size: 10, align: 'center' });
    // urethra and penis
    const ur = [[cx, Y(0.2)], [cx, Y(0.4)], [cx, Y(0.95)]];
    ctx.save(); ctx.globalAlpha = al('urethra'); ctx.lineCap = 'round'; line(ctx, ur, col.s[3], 18); line(ctx, ur, col.panel, 8); ctx.restore(); ctx.save(); ctx.globalAlpha = al('urethra'); line(ctx, ur, col.ink, 1); ctx.restore();
    // glands
    ell(ctx, cx, Y(0.36), 22, 14, col.s[2], on('gland') ? col.ink : col.muted, lw('gland'), al('gland'));
    ell(ctx, cx - 44, Y(0.3), 16, 11, col.s[2], on('gland') ? col.ink : col.muted, lw('gland') * 0.6, al('gland')); ell(ctx, cx + 44, Y(0.3), 16, 11, col.s[2], on('gland') ? col.ink : col.muted, lw('gland') * 0.6, al('gland'));
    // vas deferens: from testis up and over to near prostate
    [-1, 1].forEach((d) => { const pts = [[cx + d * 40, Y(0.62)], [cx + d * 70, Y(0.5)], [cx + d * 78, Y(0.26)], [cx + d * 52, Y(0.16)], [cx + d * 40, Y(0.3)], [cx + d * 12, Y(0.36)]]; ctx.save(); ctx.globalAlpha = al('vas'); line(ctx, pts, on('vas') ? col.s[4] : col.muted, lw('vas')); ctx.restore(); });
    // testes
    [-1, 1].forEach((d) => { ell(ctx, cx + d * 40, Y(0.76), 22, 31, col.s[1], on('testis') ? col.ink : col.muted, lw('testis'), al('testis')); });
    ctx.save(); ctx.globalAlpha = al('testis') * 0.8; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.ellipse(cx, Y(0.76), 70, 44, 0, 0, 7); ctx.stroke(); ctx.restore();
    text(ctx, 'scrotum', cx + 74, Y(0.9), { color: col.muted, size: 10 });
    // sperm moving along the vas when relevant
    if (part === 'all' || part === 'vas') { [-1, 1].forEach((d, k) => { for (let i = 0; i < 3; i++) { const f = ((t * 0.12 + i / 3 + k * 0.3) % 1), pts = [[cx + d * 40, Y(0.62)], [cx + d * 70, Y(0.5)], [cx + d * 78, Y(0.26)], [cx + d * 52, Y(0.16)], [cx + d * 40, Y(0.3)], [cx + d * 12, Y(0.36)]], seg = f * (pts.length - 1), a = Math.floor(seg), u = seg - a; dot(ctx, pts[a][0] + (pts[a + 1][0] - pts[a][0]) * u, pts[a][1] + (pts[a + 1][1] - pts[a][1]) * u, 2.6, col.s[7]); } }); }
    const lab = (s, x, y, p) => { if (on(p)) text(ctx, s, x, y, { color: col.ink, size: 10.5, weight: part === p ? 700 : 400, align: 'left' }); };
    lab('testis', 12, Y(0.76), 'testis'); lab('vas deferens', 12, Y(0.42), 'vas'); lab('seminal vesicle', 12, Y(0.24), 'gland'); lab('prostate', cx + 28, Y(0.4), 'gland'); lab('urethra', cx + 14, Y(0.56), 'urethra'); lab('penis', cx + 14, Y(0.96), 'urethra');
  };
  say();
}
