// Class 12 Molecular Basis of Inheritance (step player): the Hershey-Chase experiment (1952). One batch of bacteriophages has radioactive phosphorus (32P, in DNA),
// the other radioactive sulphur (35S, in protein). After infection and blending, the 32P is found inside the bacteria and the 35S outside: the DNA enters, so DNA is the genetic material.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Steps of the Hershey-Chase experiment with two batches of viruses, one labelled in DNA and one in protein' });
  const T = ['Label two batches of virus', 'Let the viruses infect bacteria', 'Blend to shake the coats off', 'Spin in a centrifuge', 'Measure the radioactivity'];
  const phage = (ctx, x, y, s, col, dna, coat) => {
    ctx.fillStyle = coat; ctx.fillRect(x - s * 0.5, y - s * 0.6, s, s * 1.0); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x - s * 0.5, y - s * 0.6, s, s * 1.0);
    ctx.fillStyle = dna; ctx.fillRect(x - s * 0.28, y - s * 0.42, s * 0.56, s * 0.62);
    line(ctx, [[x, y + s * 0.4], [x, y + s * 0.9]], col.ink, 1.5); line(ctx, [[x - s * 0.3, y + s * 1.05], [x, y + s * 0.9], [x + s * 0.3, y + s * 1.05]], col.ink, 1.2);
  };
  const cell = (ctx, x, y, col, tint) => { ctx.beginPath(); ctx.ellipse(x, y, 30, 15, 0, 0, 7); ctx.fillStyle = tint || col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke(); };
  const tube = (ctx, x, y, w, h, col, pellet, sup) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y + h - w / 2); ctx.arc(x, y + h - w / 2, w / 2, Math.PI, 0, true); ctx.lineTo(x + w / 2, y); ctx.stroke(); ctx.fillStyle = sup; ctx.globalAlpha = 0.45; ctx.fillRect(x - w / 2 + 1, y + 8, w - 2, h - w - 6); ctx.globalAlpha = 1; ctx.fillStyle = pellet; ctx.beginPath(); ctx.arc(x, y + h - w / 2, w / 2 - 2, 0, Math.PI); ctx.fill(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), L = w * 0.25, R = w * 0.75, y0 = t0 + 22, red = col.s[3], blu = col.s[0], faint = col.line;
    text(ctx, 'Batch A: DNA labelled (32P)', L, y0, { color: red, size: 11, weight: 700, align: 'center' }); text(ctx, 'Batch B: coat labelled (35S)', R, y0, { color: blu, size: 11, weight: 700, align: 'center' });
    const ym = y0 + 70;
    if (step === 0) {
      phage(ctx, L, ym, 44, col, red, faint); phage(ctx, R, ym, 44, col, faint, blu);
      text(ctx, 'Labelled DNA inside,', L, ym + 70, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'plain protein coat', L, ym + 84, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'Plain DNA inside,', R, ym + 70, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'labelled protein coat', R, ym + 84, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'DNA contains phosphorus but no sulphur.', w / 2, h - 46, { color: col.ink, size: 11, align: 'center' }); text(ctx, 'Protein contains sulphur but almost no phosphorus.', w / 2, h - 30, { color: col.ink, size: 11, align: 'center' });
    } else if (step === 1 || step === 2) {
      [[L, red, faint], [R, faint, blu]].forEach(([x, d, c], i) => {
        cell(ctx, x, ym + 40, col);
        phage(ctx, x - 14, ym - 4, 20, col, d, c); phage(ctx, x + 14, ym - 4, 20, col, d, c);
        if (step === 1) { if (i === 0) { ctx.fillStyle = red; ctx.fillRect(x - 12, ym + 36, 24, 5); } }
      });
      if (step === 2) { [[L, faint, 1], [R, blu, 1]].forEach(([x, c]) => { for (let k = 0; k < 4; k++) { ctx.fillStyle = c; ctx.fillRect(x - 46 + k * 24, ym + 90 + (k % 2) * 10, 10, 10); } }); text(ctx, 'empty coats float free', w / 2, h - 36, { color: col.ink, size: 11, align: 'center' }); }
      else text(ctx, 'Viruses stick to the cells and inject something inside.', w / 2, h - 36, { color: col.ink, size: 11, align: 'center' });
      if (step === 1) text(ctx, 'Labelled DNA enters the cell', L, ym + 76, { color: red, size: 11, align: 'center' });
    } else if (step === 3) {
      tube(ctx, L, ym - 14, 44, 130, col, red, faint); tube(ctx, R, ym - 14, 44, 130, col, faint, blu);
      text(ctx, 'bacteria', L + 42, ym + 108, { color: col.muted, size: 10.5 }); text(ctx, 'coats', L + 42, ym + 40, { color: col.muted, size: 10.5 });
      text(ctx, 'Heavy bacteria sink into the pellet; light coats stay in the liquid above.', w / 2, h - 36, { color: col.ink, size: 11, align: 'center' });
    } else {
      [[L, 'DNA label: 32P', red, 92, 8], [R, 'Protein label: 35S', blu, 8, 92]].forEach(([x, lab, c, pel, sup]) => {
        text(ctx, lab, x, ym - 2, { color: c, size: 11, weight: 700, align: 'center' });
        const bar = (yy, v, n) => { ctx.fillStyle = faint; ctx.fillRect(x - 55, yy, 110, 14); ctx.fillStyle = c; ctx.fillRect(x - 55, yy, 110 * v / 100, 14); text(ctx, `${n}: ${v} %`, x - 55, yy - 9, { color: col.ink, size: 11 }); };
        bar(ym + 24, pel, 'in bacteria (pellet)'); bar(ym + 64, sup, 'outside (liquid)');
      });
      text(ctx, 'Only DNA (32P) went into the cells.', w / 2, h - 52, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'So DNA, not protein, is the genetic material.', w / 2, h - 34, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
