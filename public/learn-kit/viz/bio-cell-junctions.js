// Cell junctions in epithelium. Release dye into the space outside the cells and watch what gets through: tight junctions
// seal the gap (nothing leaks between cells), adhering junctions glue cells but leave a gap, and gap junctions are tiny
// channels that let ions and small molecules pass from one cell's cytoplasm into the next.
import { canvas, loop, row, choice, readout, text, title } from '../kit.js';

const J = {
  tight: { n: 'Tight junction', t: 'Proteins stitch the membranes together all round the cell: the gap is sealed, so substances cannot leak between cells (blocks the lumen from the tissue fluid).' },
  adhering: { n: 'Adhering junction', t: 'Cadherin links tied to the cytoskeleton glue neighbouring cells and give strength, but fluid can still pass through the narrow gap.' },
  gap: { n: 'Gap junction', t: 'Connexin channels join the cytoplasm of neighbours so ions, sugars and small molecules (and signals) pass quickly from cell to cell, for example in cardiac muscle.' },
};
export default function (host) {
  let type = 'tight', t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 360, min: 290, label: 'Dye passing or blocked at three kinds of junction between cells' });
  const c = row(host);
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(c);
  choice(c, 'Junction', Object.entries(J).map(([k, v]) => [k, v.n]), type, (v) => { type = v; show(); });
  const out = readout(host);
  function show() { out.innerHTML = `<b>${J[type].n}.</b> ${J[type].t}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, J[type].n + ': dye test', col);
    const top = 70, bot = h - 40, gx = w / 2, gap = 8;
    // two cells side by side
    [[10, gx - gap / 2 - 10], [gx + gap / 2, w - 10]].forEach(([x0, x1], i) => { ctx.beginPath(); ctx.roundRect(x0, top, x1 - x0, bot - top, 14); ctx.fillStyle = col.s[i ? 3 : 0]; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[i ? 3 : 0]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'cell ' + (i + 1), (x0 + x1) / 2, bot - 14, { color: col.muted, size: 10.5, align: 'center' }); });
    // junction drawing at the middle height
    const jy = (top + bot) / 2;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3;
    if (type === 'tight') [top + 8, top + 26].forEach((y) => { ctx.beginPath(); ctx.moveTo(gx - gap / 2 - 10, y); ctx.lineTo(gx + gap / 2 + 0, y); ctx.stroke(); });
    if (type === 'adhering') [jy - 20, jy, jy + 20].forEach((y) => { ctx.beginPath(); ctx.moveTo(gx - gap / 2 - 10, y); ctx.lineTo(gx - gap / 2, y); ctx.moveTo(gx + gap / 2, y); ctx.lineTo(gx + gap / 2 + 10, y); ctx.stroke(); ctx.beginPath(); ctx.arc(gx - gap / 2 - 10, y, 3, 0, 7); ctx.arc(gx + gap / 2 + 10, y, 3, 0, 7); ctx.fillStyle = col.ink; ctx.fill(); });
    if (type === 'gap') [jy - 14, jy + 14].forEach((y) => { ctx.fillStyle = col.s[2]; ctx.fillRect(gx - gap / 2 - 10, y - 5, 2 * 10 + gap, 10); });
    // dye drifts down the gap from the top (the "lumen" side)
    ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.25; ctx.fillRect(10, 40, w - 20, 24); ctx.globalAlpha = 1; text(ctx, 'dye outside (top)', 14, 52, { color: col.s[5], size: 10.5, weight: 700 });
    for (let i = 0; i < 8; i++) {
      const f = (t * 0.35 + i / 8) % 1; let y = 62 + f * (bot - 62), x = gx + Math.sin(f * 12 + i) * 1.5;
      if (type === 'tight' && y > top + 6) { y = top + 2 - 0 + (f * 30) % 4; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(gx + (i - 4) * 4, y + 4, 2.4, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); ctx.globalAlpha = 1; continue; }
      if (type === 'adhering') { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); }
      if (type === 'gap') { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); }
    }
    if (type === 'gap') for (let i = 0; i < 4; i++) { const f = (t * 0.5 + i / 4) % 1, y = jy + (i % 2 ? 14 : -14); ctx.beginPath(); ctx.arc(gx - 30 + f * 60, y, 3.2, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
    text(ctx, type === 'tight' ? 'dye stops at the seal' : type === 'adhering' ? 'dye slips down the gap' : 'small molecules cross through the channels (orange)', w / 2, h - 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
  };
  show();
}
