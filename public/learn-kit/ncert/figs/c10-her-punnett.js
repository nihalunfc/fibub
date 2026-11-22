// Class 10 Heredity: a Punnett square for one trait (tall T, short t). Pick each parent's genotype; the four boxes show the
// possible children, because each parent gives one allele at random. Counts of genotypes and of the visible trait (phenotype)
// are shown beneath. Pure tall = TT, hybrid tall = Tt, short = tt.
import { canvas, text, title, line, dot, row, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let a = 'Tt', b = 'Tt', t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A Punnett square for a tall and short pea cross' });
  const ctl = row(host);
  choice(ctl, 'Parent 1', [['TT', 'TT'], ['Tt', 'Tt'], ['tt', 'tt']], a, (v) => { a = v; t = 0; say(); });
  choice(ctl, 'Parent 2', [['TT', 'TT'], ['Tt', 'Tt'], ['tt', 'tt']], b, (v) => { b = v; t = 0; say(); });
  button(ctl, 'Replay', () => { t = 0; });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const cells = () => [0, 1].flatMap((r) => [0, 1].map((c) => { const x = [b[c], a[r]].sort().join(''); return x === 'tT' ? 'Tt' : x; }));
  function say() {
    const cs = cells(), n = (g) => cs.filter((x) => x === g).length, tall = n('TT') + n('Tt'), short = n('tt');
    out.textContent = `${a} × ${b}: genotypes ${n('TT')} TT, ${n('Tt')} Tt, ${n('tt')} tt (out of 4). Tall : short = ${tall} : ${short}${short ? '' : ', so no short plants at all'}.` + (a === 'Tt' && b === 'Tt' ? ' This is the 3 : 1 of Mendel\'s F2.' : '');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${a} × ${b}`, col) + 10, cs = Math.min(70, (w - 120) / 2), gx = (w - 2 * cs) / 2 + 14, gy = top + 62;
    text(ctx, 'Parent 2 gametes', gx + cs, top + 6, { color: col.muted, size: 10, align: 'center' });
    [0, 1].forEach((c) => { dot(ctx, gx + cs * c + cs / 2, top + 36, 13, b[c] === 'T' ? col.s[0] : col.s[1], col.ink); text(ctx, b[c], gx + cs * c + cs / 2, top + 36, { color: col.panel, size: 13, weight: 700, align: 'center' }); });
    text(ctx, 'Parent 1', gx - 40, gy - 8, { color: col.muted, size: 10, align: 'center' });
    [0, 1].forEach((r) => { dot(ctx, gx - 20, gy + cs * r + cs / 2, 13, a[r] === 'T' ? col.s[0] : col.s[1], col.ink); text(ctx, a[r], gx - 20, gy + cs * r + cs / 2, { color: col.panel, size: 13, weight: 700, align: 'center' }); });
    const cl = cells();
    cl.forEach((g, i) => { const r = Math.floor(i / 2), c = i % 2, x = gx + c * cs, y = gy + r * cs, k = Math.min(1, Math.max(0, t * 1.4 - i * 0.35)); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.strokeRect(x, y, cs, cs); if (k > 0) { ctx.save(); ctx.globalAlpha = k; const tallp = g !== 'tt'; ctx.fillStyle = tallp ? col.s[2] : col.s[3]; ctx.globalAlpha = 0.25 * k; ctx.fillRect(x, y, cs, cs); ctx.globalAlpha = k; text(ctx, g, x + cs / 2, y + cs * 0.4, { color: col.ink, size: 17, weight: 700, align: 'center' }); text(ctx, tallp ? 'tall' : 'short', x + cs / 2, y + cs * 0.74, { color: col.muted, size: 10.5, align: 'center' }); ctx.restore(); } });
    const tall = cl.filter((g) => g !== 'tt').length;
    ctx.fillStyle = col.s[2]; ctx.fillRect(gx - 40, gy + 2 * cs + 20, ((2 * cs + 40) * tall) / 4, 14); ctx.fillStyle = col.s[3]; ctx.fillRect(gx - 40 + ((2 * cs + 40) * tall) / 4, gy + 2 * cs + 20, ((2 * cs + 40) * (4 - tall)) / 4, 14);
    text(ctx, `tall ${tall} : short ${4 - tall}`, w / 2, gy + 2 * cs + 42, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  say();
}
