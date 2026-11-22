// Class 12 Biology, Biotechnology and its Applications (step player): gene therapy for adenosine deaminase (ADA) deficiency, first tried in 1990
// on a four-year-old girl. Lymphocytes are removed, grown, given a working ADA gene by a retroviral vector and returned. They are not immortal,
// so treatment must be repeated unless the gene is put into early embryonic (marrow) cells.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Gene therapy for ADA deficiency: blood cells are taken out, given the ADA gene and returned' });
  const TITLES = ['1. ADA deficiency', '2. Take out lymphocytes', '3. Add the ADA gene', '4. Return the cells', '5. Why it is not a cure yet'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 8, cx = w / 2, S = (s, x, y, c = col.ink, al = 'center', sz = 11, wt = 400) => text(ctx, s, x, y, { color: c, size: sz, weight: wt, align: al });
    const person = (x, y, c) => { dot(ctx, x, y - 20, 9, c); line(ctx, [[x, y - 11], [x, y + 22]], c, 4); line(ctx, [[x - 14, y]], c, 4); line(ctx, [[x - 14, y - 2], [x + 14, y - 2]], c, 4); line(ctx, [[x, y + 22], [x - 10, y + 44]], c, 4); line(ctx, [[x, y + 22], [x + 10, y + 44]], c, 4); };
    const cell = (x, y, ok, r = 8) => { dot(ctx, x, y, r, ok ? col.s[3] : col.muted, col.ink); dot(ctx, x, y, r * 0.4, col.panel); };
    const py = top + 60;
    person(w * 0.2, py, col.ink);
    if (st === 0) { for (let i = 0; i < 5; i++) cell(w * 0.42 + (i % 3) * 22, py - 14 + Math.floor(i / 3) * 24, false); S('lymphocytes without a working ADA enzyme', w * 0.64, py + 40, col.bad, 'center', 10.5, 700); S('Without ADA, toxic by-products', cx, py + 90, col.ink); S('kill the T cells. The child has a severely weak immune system (SCID).', cx, py + 106, col.ink); S('Old treatments: bone marrow transplant or enzyme injections.', cx, py + 126, col.muted, 'center', 10.5); }
    if (st === 1) { arrow(ctx, w * 0.3, py, w * 0.5, py, col.ink, 2.5); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(w * 0.55, py - 24, 70, 50); for (let i = 0; i < 4; i++) cell(w * 0.55 + 14 + (i % 2) * 24, py - 8 + Math.floor(i / 2) * 20, false); S('culture flask', w * 0.55 + 35, py + 40, col.muted, 'center', 10); S('Blood is drawn. The lymphocytes are grown outside the body.', cx, py + 90, col.ink); }
    if (st === 2) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(w * 0.36, py - 24, 70, 50); for (let i = 0; i < 4; i++) cell(w * 0.36 + 14 + (i % 2) * 24, py - 8 + Math.floor(i / 2) * 20, true); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(w * 0.68, py - 8, 70, 18, 9) : ctx.rect(w * 0.68, py - 8, 70, 18); ctx.fill(); S('retrovirus + ADA gene', w * 0.68 + 35, py + 24, col.s[2], 'center', 10, 700); arrow(ctx, w * 0.68 - 2, py + 1, w * 0.36 + 76, py + 1, col.s[2], 2, 7); S('A disarmed retroviral vector carries a working', cx, py + 96, col.ink); S('ADA cDNA into the lymphocytes. Their DNA now includes the gene.', cx, py + 112, col.ink); }
    if (st === 3) { for (let i = 0; i < 4; i++) cell(w * 0.55 + (i % 2) * 22, py - 14 + Math.floor(i / 2) * 22, true); arrow(ctx, w * 0.54, py, w * 0.3, py, col.good, 2.5); S('treated cells', w * 0.64, py + 40, col.s[3], 'center', 10.5, 700); S('The modified cells go back into the patient’s blood.', cx, py + 90, col.ink); S('They make ADA and the immune system partly recovers.', cx, py + 106, col.ink); }
    if (st === 4) { S('The lymphocytes live only for a limited time,', cx, py + 4, col.ink); S('so the patient needs periodic infusions.', cx, py + 20, col.ink); S('A permanent cure needs the gene in bone-marrow cells', cx, py + 46, col.good, 'center', 11, 700); S('that keep dividing and make new lymphocytes for life', cx, py + 62, col.good, 'center', 11, 700); S('(first treatment: 1990, a 4-year-old girl).', cx, py + 90, col.muted, 'center', 10.5); }
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
