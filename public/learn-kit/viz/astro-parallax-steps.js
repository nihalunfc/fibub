// Parallax step by step: look at a nearby star from two sides of Earth's orbit, six months apart, and it shifts against the
// far background. Half the shift is the parallax angle p; the distance is then d = 1/p parsecs. Use the steps, then slide the
// star's distance: a farther star shifts less, which is why only close stars can be measured. (Not to scale.)
import { canvas, text, row, slider, readout, title, dot, arrow, button } from '../kit.js';

export default function (host) {
  let stage = 3, d = 4; // parsecs
  const cv = canvas(host, { aspect: 0.9, max: 430, min: 310, label: 'Earth at two sides of its orbit seeing a nearby star shift against distant stars' });
  const c1 = row(host);
  const sl = slider(c1, { label: 'Distance to the star', min: 1.3, max: 100, value: d, log: true, fmt: (v) => `${v < 10 ? v.toFixed(1) : Math.round(v)} pc`, oninput: (v) => { d = v; show(); } });
  [['Proxima', 1.3], ['Sirius', 2.64], ['Vega', 7.7], ['Betelgeuse', 150]].forEach(([n, v]) => button(c1, n, () => { d = Math.min(100, v); sl.set(d); show(); }));
  const out = readout(host);
  function show() {
    const p = 1 / d;
    out.innerHTML = `Parallax <b>p = 1/d = ${p >= 0.1 ? p.toFixed(2) : p.toFixed(3)}″</b>; the star shifts <b>2p = ${(2 * p).toFixed(3)}″</b> between January and July. A telescope that can measure 0.001″ (Gaia does better) reaches ${(1 / 0.001).toFixed(0)} pc; the naked eye can notice about 60″, so no star seems to move. ${stage < 3 ? 'Use the next step to add the details.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Seeing a star from two sides of the orbit', col);
    const cx = w / 2, sy = h * 0.76, R = Math.min(w * 0.22, 80), sx = cx, starY = 100 + 28 * Math.log10(d), bgY = 50;
    // background wall
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(10, bgY); ctx.lineTo(w - 10, bgY); ctx.stroke();
    text(ctx, 'very distant stars (do not shift)', 12, bgY - 8, { color: col.muted, size: 10.5 });
    for (let i = 0; i < 9; i++) dot(ctx, 30 + i * (w - 60) / 8, bgY, 2.2, col.muted);
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.ellipse(cx, sy, R, R * 0.55, 0, 0, 7); ctx.stroke();
    dot(ctx, sx, sy, 7, col.s[1]); text(ctx, 'Sun', sx, sy + 20, { color: col.muted, size: 10.5, align: 'center' });
    dot(ctx, cx, starY, 5, col.s[0]); text(ctx, 'nearby star', cx + 9, starY, { color: col.s[0], size: 11, weight: 700 });
    const E1 = [cx - R, sy], E2 = [cx + R, sy];
    const show1 = true, show2 = stage >= 1;
    const sight = (E, c, name) => {
      // line from Earth through the star to the background wall
      const k = (bgY - E[1]) / (starY - E[1]), bx = E[0] + (cx - E[0]) * k;
      ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(E[0], E[1]); ctx.lineTo(bx, bgY); ctx.stroke();
      dot(ctx, E[0], E[1], 5.5, c); text(ctx, name, E[0], E[1] + 17, { color: c, size: 11, weight: 700, align: 'center' });
      return bx;
    };
    const b1 = show1 ? sight(E1, col.s[2], 'January') : 0, b2 = show2 ? sight(E2, col.s[5], 'July') : 0;
    if (show2) { dot(ctx, b1, bgY, 4, col.s[2]); dot(ctx, b2, bgY, 4, col.s[5]); }
    if (stage >= 2) { arrow(ctx, b1, bgY + 14, b2, bgY + 14, col.ink, 1.5, 6); text(ctx, 'apparent shift = 2p', (b1 + b2) / 2, bgY + 28, { color: col.ink, size: 11, align: 'center', weight: 600 }); }
    if (stage >= 3) {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(cx, starY); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'p', cx + 6, starY + 34, { color: col.ink, size: 13, weight: 700 }); text(ctx, '1 AU', cx, sy - 8, { color: col.muted, size: 10, align: 'center' });
      text(ctx, 'd = 1 AU ÷ tan p ≈ 1/p parsecs', w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
  };
  show();
  return { step(i) { stage = Math.min(3, i); show(); } };
}
