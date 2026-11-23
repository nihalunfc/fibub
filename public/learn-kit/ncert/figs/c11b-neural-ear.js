// Class 11 Biology, Neural control (step player): the path of sound through the ear. Air waves are gathered by the pinna, shake the tympanic membrane, are passed and amplified by the three
// ear ossicles (malleus, incus, stapes) to the oval window, move the fluid of the cochlea, bend the hair cells of the organ of Corti on the basilar membrane, and the auditory nerve takes the signal to the brain.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'The path of sound through the outer, middle and inner ear drawn as a chain of stations' });
  const S = [['Pinna', 'collects sound waves', 'outer ear'], ['Ear canal and tympanic membrane', 'air waves make the eardrum vibrate', 'outer ear'], ['Malleus, incus, stapes', 'bones pass on and amplify the vibration', 'middle ear'], ['Oval window', 'stapes pushes it, setting the cochlear fluid moving', 'inner ear'], ['Cochlea: hair cells', 'basilar membrane moves; hair cells bend', 'inner ear'], ['Auditory nerve → brain', 'impulses reach the temporal lobe: we hear', 'to the brain']];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'The path of sound', col), bh = (h - t0 - 20) / 6, bw = w - 80;
    S.forEach(([a, b, z], i) => {
      const y = t0 + 8 + i * bh, on = i <= step, cur = i === step, x = 20 + (i % 2) * 40;
      ctx.globalAlpha = on ? 1 : 0.4; ctx.fillStyle = cur ? col.s[0] : col.soft; ctx.fillRect(x, y, bw, bh - 10); ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = cur ? 2.5 : 1.5; ctx.strokeRect(x, y, bw, bh - 10);
      text(ctx, a, x + 8, y + (bh - 10) / 2 - 7, { color: cur ? col.bg : col.ink, size: 11, weight: 700 }); text(ctx, b, x + 8, y + (bh - 10) / 2 + 8, { color: cur ? col.bg : col.muted, size: 10 });
      ctx.globalAlpha = 1; text(ctx, z, i % 2 ? x - 6 : x + bw + 6, y + (bh - 10) / 2, { color: col.muted, size: 9, align: i % 2 ? 'right' : 'left' });
      if (i < 5) arrow(ctx, x + bw / 2, y + bh - 10, 20 + ((i + 1) % 2) * 40 + bw / 2, y + bh, i < step ? col.s[0] : col.line, 2, 5);
    });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
