// Class 8 Science, Microscopic world: the naked eye can only see things bigger than about 0.1 mm (100 micrometres).
// A magnification M makes an object look M times bigger, so it becomes visible when size x M >= 100 micrometres.
// Sizes (typical): ant 3000, hair width 70, red blood cell 7, bacterium 2, virus 0.1 micrometre.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

const OB = [['Ant', 3000], ['Hair (width)', 70], ['Plant cell', 50], ['Red blood cell', 7], ['Bacterium', 2], ['Virus', 0.1]];
export default function (host) {
  let M = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Bars comparing sizes of an ant, a hair, cells, a bacterium and a virus against what the eye can see' });
  const ctl = row(host);
  slider(ctl, { label: 'Magnification', min: 1, max: 2000, value: 1, log: true, fmt: (v) => `${Math.round(v)}×`, oninput: (v) => { M = v; upd(); } });
  const out = readout(host);
  const vis = () => OB.filter(([, s]) => s * M >= 100).map(([n]) => n);
  function upd() { const v = vis(); out.innerHTML = `At <b>${Math.round(M)}×</b> you can see: <b>${v.length ? v.join(', ') : 'nothing at all'}</b>. A virus needs an electron microscope (hundreds of thousands of times).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'What can you see at this zoom?', col);
    const x0 = 100, W = w - x0 - 14, lg = (v) => (Math.log10(v) + 1) / 5.2, bh = 20, gy = 40;
    OB.forEach(([nm, s], i) => {
      const y = gy + i * 34, apparent = s * M, ok = apparent >= 100;
      text(ctx, nm, 10, y + bh / 2, { color: ok ? col.ink : col.muted, size: 10.5, weight: ok ? 700 : 400 });
      ctx.fillStyle = ok ? col.s[2] : col.soft; ctx.fillRect(x0, y, Math.max(3, W * lg(Math.min(apparent, 30000))), bh);
      text(ctx, apparent >= 1000 ? `${(apparent / 1000).toFixed(apparent >= 10000 ? 0 : 1)} mm` : `${apparent < 10 ? apparent.toFixed(1) : Math.round(apparent)} µm`, x0 + Math.max(3, W * lg(Math.min(apparent, 30000))) + 5, y + bh / 2, { color: col.ink, size: 10, align: 'left' });
    });
    const lx = x0 + W * lg(100); line(ctx, [[lx, gy - 6], [lx, gy + 6 * 34]], col.bad, 2, [5, 4]);
    text(ctx, 'eye limit 0.1 mm', lx - 4, gy + 6 * 34 + 10, { color: col.bad, size: 10.5, align: 'right' });
    text(ctx, 'bars: apparent size (log scale)', 10, h - 10, { color: col.muted, size: 10 });
  };
  upd();
}
