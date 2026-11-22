// Class 9 Tissues: epithelial tissue gallery. Epithelium covers the body and lines cavities; cells sit tightly on a thin
// basement layer with very little gap. Shape fits job: flat squamous (thin, quick exchange: air sacs, blood vessel
// lining), cuboidal (cube, secretion and absorption: kidney tubes, glands), columnar (tall, absorb and secrete: gut
// lining), ciliated (columnar with hair-like cilia that sweep: windpipe), stratified squamous (many layers: skin, mouth).
import { canvas, text, title, dot, line, row, choice, loop } from '../../kit.js';

const E = [
  ['Squamous', 'Lining of blood vessels, air sacs of lungs, mouth lining', 'Very thin and flat: things pass through it fast (diffusion of oxygen, nutrients).'],
  ['Cuboidal', 'Kidney tubes, ducts of glands, thyroid', 'Cube shaped: absorbs and secretes, and gives some support.'],
  ['Columnar', 'Lining of the stomach and intestine', 'Tall and narrow: absorbs food and secretes mucus; goblet cells make the mucus.'],
  ['Ciliated', 'Windpipe, nose passages', 'Columnar cells with tiny hairs (cilia) that beat and sweep mucus and dust out of the lungs.'],
  ['Stratified', 'Skin (outer layer), lining of mouth', 'Many layers of squamous cells; worn-out cells are replaced from below. Protects against rubbing and germs.'],
];
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Types of epithelial tissue with where they are found and why their shape suits the job' });
  const ctl = row(host);
  choice(ctl, 'Epithelium', E.map((e, i) => [i, e[0]]), 0, (v) => { k = v; cv.redraw(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const wrap = (ctx, s, w) => { ctx.font = '11px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, E[k][0] + ' epithelium', col);
    const X = 14, W = w - 28, base = 40 + h * 0.4;
    ctx.fillStyle = col.soft; ctx.fillRect(X, 40, W, h * 0.4); text(ctx, 'free surface (air or fluid)', X + 6, 52, { color: col.muted, size: 10 });
    line(ctx, [[X, base], [X + W, base]], col.s[3], 4); text(ctx, 'basement membrane', X + W - 4, base + 12, { color: col.s[3], size: 10, align: 'right' });
    const n = k === 4 ? 6 : 7, cw = W / n;
    for (let i = 0; i < n; i++) {
      const x = X + i * cw;
      if (k === 4 && i === n - 1) continue;
      if (k === 0) { ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x + 1, base - 12, cw - 2, 12, 6); ctx.fill(); ctx.stroke(); dot(ctx, x + cw / 2, base - 6, 2.5, col.s[0]); }
      else if (k === 1) { ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.fillRect(x + 1, base - cw + 2, cw - 2, cw - 2); ctx.strokeRect(x + 1, base - cw + 2, cw - 2, cw - 2); dot(ctx, x + cw / 2, base - cw / 2, cw * 0.17, col.s[0]); }
      else if (k === 2 || k === 3) { const hh = h * 0.2; ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.fillRect(x + 1, base - hh, cw - 2, hh); ctx.strokeRect(x + 1, base - hh, cw - 2, hh); dot(ctx, x + cw / 2, base - hh * 0.25, cw * 0.14, col.s[0]);
        if (k === 3) for (let c = 0; c < 4; c++) { const cx = x + 4 + c * ((cw - 8) / 3), sw = Math.sin(t * 8 - i * 0.7 + c) * 4; line(ctx, [[cx, base - hh], [cx + sw, base - hh - 14]], col.s[1], 1.6); }
        if (k === 2 && i % 3 === 1) { ctx.beginPath(); ctx.ellipse(x + cw / 2, base - hh * 0.6, cw * 0.28, hh * 0.28, 0, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); } }
      else { for (let L = 0; L < 4; L++) { const yy = base - (L + 1) * 11, wd = cw - 2 - (3 - L) * 0 ; ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.2; const off = L % 2 ? cw / 2 : 0; if (L % 2 && i === n - 1) continue; ctx.beginPath(); ctx.roundRect(x + off - (L % 2 ? 0 : 0) + 1, yy, wd - (L === 3 ? 0 : 0), 11, L === 3 ? 3 : 5 + L); ctx.fill(); ctx.stroke(); if (L < 3) dot(ctx, x + off + cw / 2, yy + 5.5, 2, col.s[0]); } }
    }
    let y = 40 + h * 0.4 + 22;
    text(ctx, 'Found in: ' + E[k][1], X, y, { color: col.s[0], size: 11, weight: 700 });
    wrap(ctx, E[k][2], W).forEach((l) => { y += 15; text(ctx, l, X, y, { color: col.ink, size: 11 }); });
    wrap(ctx, k === 4 ? 'Layers on top get rubbed off and replaced from below.' : 'One layer thick: fits tight together with little space between cells.', W).forEach((l) => { y += 15; text(ctx, l, X, y, { color: col.muted, size: 10.5 }); });
  };
  cv.redraw();
}
