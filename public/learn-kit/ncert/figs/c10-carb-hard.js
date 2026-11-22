// Class 10 Carbon: soap and hard water. Hard water contains calcium (Ca2+) and magnesium (Mg2+) ions. Each Ca2+ grabs
// two soap anions and forms an insoluble grey scum (calcium stearate), using the soap up before it can lather. A detergent
// (usually a sulphonate or sulphate salt) makes soluble calcium salts, so it keeps lathering. Slide the hardness, switch
// cleaner. Free cleaner = 24 - 2 x Ca (soap) or 24 (detergent); lather follows free cleaner.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, rng, clamp } from '../../kit.js';

export default function (host) {
  let ca = 6, mode = 'soap', t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Soap and detergent in hard water: calcium ions form scum, detergent keeps lathering' });
  const ctl = row(host);
  slider(ctl, { label: 'Hardness (Ca²⁺ ions)', min: 0, max: 12, step: 1, value: ca, fmt: (v) => (v === 0 ? 'soft water' : v + ' ions'), oninput: (v) => { ca = v; say(); } });
  choice(ctl, 'Cleaner', [['soap', 'Soap'], ['det', 'Detergent']], mode, (v) => { mode = v; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const free = () => (mode === 'soap' ? Math.max(0, 24 - 2 * ca) : 24);
  function say() { const f = free(); out.innerHTML = mode === 'soap' ? (ca === 0 ? 'Soft water: all 24 soap molecules are free, so the lather is rich and no scum forms.' : `${ca} Ca²⁺ ions grab ${Math.min(24, 2 * ca)} soap molecules into scum, leaving <b>${f}</b> free. ${f === 0 ? 'No lather at all until all the calcium is used up: wasteful.' : 'Lather only starts once the calcium is used up.'}`) : `Detergent makes soluble salts with calcium, so all <b>24</b> molecules stay free: a good lather in hard water too.`; cv.redraw(); }
  const R = rng(11), P = Array.from({ length: 24 }, () => [R(), R(), R() * 6.28, 0.5 + R()]), Q = Array.from({ length: 12 }, () => [R(), R(), R() * 6.28]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, (mode === 'soap' ? 'Soap' : 'Detergent') + (ca ? ' in hard water' : ' in soft water'), col) + 6, ph = h - top - 50, f = free();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.fillRect(8, top + 14, w - 16, ph - 14); ctx.globalAlpha = 1;
    // lather foam at the top
    const nb = Math.round(f / 24 * 16);
    for (let i = 0; i < nb; i++) { const x = 16 + (i + 0.5) * (w - 32) / 16, y = top + 12 + (i % 3) * 3; ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(x, y, 8 + (i % 4), 0, 7); ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); }
    const bound = mode === 'soap' ? Math.min(24, 2 * ca) : 0;
    P.forEach(([a, b, ph2, s], i) => {
      const isBound = i < bound, x0 = 20 + a * (w - 40), y0 = top + 30 + b * (ph - 80);
      if (isBound) { const k = i, bx = w / 2 + ((k % 8) - 3.5) * 18, by = top + ph - 10 - Math.floor(k / 8) * 11; ctx.fillStyle = col.muted; ctx.beginPath(); ctx.arc(bx, by, 6, 0, 7); ctx.fill(); }
      else { const x = x0 + Math.sin(t * s + ph2) * 8, y = y0 + Math.cos(t * s * 0.8 + ph2) * 6; line(ctx, [[x, y], [x + 11 * Math.cos(ph2 + t * 0.4), y + 11 * Math.sin(ph2 + t * 0.4)]], col.s[1], 2); dot(ctx, x, y, 3.8, col.s[2]); }
    });
    Q.forEach(([a, b, ph2], i) => { if (i >= ca) return; const x = (i < bound / 2 ? w / 2 + ((i * 2 % 8) - 3.5) * 18 + 9 : 20 + a * (w - 40)) + (mode === 'soap' ? 0 : Math.sin(t + ph2) * 8), y = mode === 'soap' ? top + ph - 22 - (i % 2) * 11 : top + 40 + b * (ph - 100); dot(ctx, x, y, 6, col.s[0], col.ink); text(ctx, '2+', x, y, { color: col.panel, size: 8, weight: 700, align: 'center', fit: false }); });
    if (mode === 'soap' && bound) text(ctx, 'grey scum (insoluble)', w / 2, top + ph + 8, { color: col.muted, size: 10.5, weight: 700, align: 'center' });
    else text(ctx, mode === 'det' && ca ? 'soluble calcium salt: no scum' : 'no scum', w / 2, top + ph + 8, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    // lather bar
    ctx.fillStyle = col.soft; ctx.fillRect(10, h - 30, w - 20, 8); ctx.fillStyle = col.s[3]; ctx.fillRect(10, h - 30, (w - 20) * f / 24, 8);
    text(ctx, `free cleaner: ${f} of 24 (lather)`, w / 2, h - 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  say();
}
