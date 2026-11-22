// Class 10 Control and Coordination: the five plant hormones. Auxin (shoot tip): cell elongation, bending toward light.
// Gibberellin: stem growth and seed germination. Cytokinin: cell division, in fruits and seeds, and delays leaf ageing.
// Abscisic acid: stops growth, wilting of leaves, closing of stomata, seed dormancy. Ethylene: ripens fruits.
// Toggle a hormone on or off and see the plant: the drawing changes stem height, cell count, fruit colour and leaf droop.
import { canvas, text, title, line, dot, row, choice, readout, loop, lerp } from '../../kit.js';

const H = {
  aux: { n: 'Auxin', note: 'Made at the shoot tip. Makes cells on the shaded side elongate, so shoots bend toward light, and helps roots grow.' },
  gib: { n: 'Gibberellin', note: 'Helps the stem grow longer (with auxin) and breaks the dormancy of seeds so they germinate. Used by farmers to grow bigger grapes and tall sugarcane.' },
  cyt: { n: 'Cytokinin', note: 'Promotes cell division, so it is present in fruits and seeds, where division is quick. It delays the yellowing and falling of leaves.' },
  aba: { n: 'Abscisic acid', note: 'A growth inhibitor: it closes stomata in a drought, makes leaves wilt and fall, and keeps seeds dormant in dry weather.' },
  eth: { n: 'Ethylene', note: 'A gas that ripens fruit. A ripe banana in a bag speeds up the ripening of green mangoes next to it. Fruit sellers use it.' },
};
export default function (host) {
  let k = 'aux', on = 0, goal = 0, t = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'A plant showing the effect of each plant hormone when it is switched on' });
  const ctl = row(host);
  choice(ctl, 'Hormone', Object.entries(H).map(([v, o]) => [v, o.n]), k, (v) => { k = v; on = 0; say(); });
  choice(ctl, 'Level', [['off', 'Normal'], ['on', 'High']], 'off', (v) => { goal = v === 'on' ? 1 : 0; });
  loop(host, (dt) => { on += (goal - on) * Math.min(1, dt * 2.5); t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${H[k].n}.</b> ${H[k].note}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, H[k].n + (goal ? ': high' : ': normal'), col) + 6, cx = w * 0.4, by = h - 40;
    ctx.fillStyle = col.s[6]; ctx.globalAlpha = 0.25; ctx.fillRect(0, by, w, 30); ctx.globalAlpha = 1;
    let sh = 0.5, cells = 1, fruit = 0, droop = 0, stom = 1, leaf = 1;
    if (k === 'aux') sh = 0.5 + 0.15 * on; if (k === 'gib') sh = 0.5 + 0.38 * on; if (k === 'cyt') { cells = 1 + 1.6 * on; leaf = 1 + 0.3 * on; } if (k === 'aba') { droop = on; stom = 1 - on; sh = 0.5 - 0.1 * on; leaf = 1 - 0.4 * on; } if (k === 'eth') fruit = on;
    const stemH = (by - top - 30) * sh * 1.2, x = cx, y1 = by - stemH;
    line(ctx, [[x, by], [x, y1]], col.s[3], 8);
    // cells (small rectangles along stem)
    const nc = Math.round(5 * cells); for (let i = 0; i < nc; i++) { const yy = by - (i + 0.5) * stemH / nc; ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(x - 4, yy - stemH / nc / 2 + 1, 8, stemH / nc - 2); }
    // leaves
    [[-1, 0.4], [1, 0.62], [-1, 0.8]].forEach(([s, f]) => { const ly = by - f * stemH, ang = -0.35 * s + droop * s * 1.2; ctx.save(); ctx.translate(x, ly); ctx.rotate(ang * -1 + (s < 0 ? Math.PI : 0) * 0); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.75 - 0.35 * droop + (k === 'aba' ? 0 : 0); ctx.beginPath(); ctx.ellipse(s * 28 * leaf, droop * 14, 28 * leaf, 9 * (1 - droop * 0.3), s * 0.3 + droop * s * 0.6, 0, 7); ctx.fill(); ctx.restore(); });
    dot(ctx, x, y1, 7, col.s[3], col.ink); text(ctx, 'shoot tip', x + 14, y1, { color: col.muted, size: 10 });
    // fruit
    const fx = w * 0.72, fy = by - 40; const r = lerp(150, 235, fruit), g = lerp(190, 120, fruit), b = lerp(80, 40, fruit);
    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`; ctx.beginPath(); ctx.arc(fx, fy, 24, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); text(ctx, fruit > 0.5 ? 'ripe' : 'unripe', fx, fy, { color: '#111', size: 11, weight: 700, align: 'center' });
    // stomata gap + ethylene gas
    const sy = by - 70; text(ctx, 'stomata: ' + (stom > 0.5 ? 'open' : 'closed'), fx, top + 20, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    const gap = 2 + 10 * stom; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(fx + s * (gap + 6), top + 46, 9, 0, 7); ctx.stroke(); });
    if (k === 'eth' && fruit > 0.1) for (let i = 0; i < 4; i++) { text(ctx, 'C₂H₄', fx - 20 + i * 14, fy - 34 - ((t * 20 + i * 10) % 40), { color: col.s[7], size: 10, weight: 700, align: 'center' }); }
    text(ctx, 'stem height: ' + Math.round(sh * 40) + ' cm · cells in view: ' + nc, 10, h - 8, { color: col.muted, size: 10 });
  };
  say();
}
