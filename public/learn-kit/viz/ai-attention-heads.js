// Attention weights as a heat map for "The cat sat on the mat because it was tired". Each row is a word asking
// "which words should I look at?"; each cell is how much (rows add to 100%). Pick a head (different heads learn
// different jobs), turn the causal mask on (a text generator may only look at earlier words) and tap a row.
import { canvas, text, row, choice, readout, title } from '../kit.js';
import { softmax, pointer } from './_ai.js';

const TOK = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
const PAIRS = { link: { 1: [0], 2: [1], 3: [5], 5: [3, 4], 6: [2], 7: [1], 8: [7], 9: [7, 1], 4: [5] } };
const HEADS = {
  prev: ['Previous word', (q, k) => (k === Math.max(0, q - 1) ? 5 : k === q ? 1 : 0)],
  same: ['Same word', (q, k) => (TOK[q].toLowerCase() === TOK[k].toLowerCase() ? 4 : 0) + (q === k ? 1.5 : 0)],
  link: ['Meaning link', (q, k) => (PAIRS.link[q]?.includes(k) ? (q === 7 ? 5.5 : 4) : 0) + (q === k ? 1 : 0)],
  broad: ['Broad', (q, k) => 1 + 0.3 * Math.sin(q * 1.7 + k * 2.3)],
};
export default function (host) {
  let head = 'link', mask = true, sel = 7;
  const cv = canvas(host, { aspect: 1.0, max: 400, min: 300, label: 'A heat map of how much each word attends to each other word' });
  const ctl = row(host);
  choice(ctl, 'Head', Object.entries(HEADS).map(([k, v]) => [k, v[0]]), head, (v) => { head = v; show(); });
  choice(ctl, 'Mask', [[true, 'Causal (look left only)'], [false, 'Full (look anywhere)']], mask, (v) => { mask = v; show(); });
  const out = readout(host);
  const geo = { x0: 0, y0: 0, c: 0 };
  const M = () => TOK.map((_, q) => softmax(TOK.map((_, k) => (mask && k > q ? -1e9 : HEADS[head][1](q, k)))));
  pointer(cv, (x, y, k) => { if (k !== 'down') return; const r = Math.floor((y - geo.y0) / geo.c); if (r >= 0 && r < TOK.length) { sel = r; show(); } });
  function show() {
    const m = M()[sel], top = m.map((v, i) => [i, v]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    out.innerHTML = `"<b>${TOK[sel]}</b>" attends most to ${top.map(([i, v]) => `<b>${TOK[i]}</b> (${(v * 100).toFixed(0)}%)`).join(', ')}. ${mask ? 'The mask hides every word to the right (empty triangle): a text generator has not written those yet.' : 'With no mask, words can look at the whole sentence (as in a reader model).'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Rows ask, columns answer. Tap a row.', col);
    const lab = 52, top = 76, c = Math.floor(Math.min((w - lab - 10) / TOK.length, (h - top - 10) / TOK.length));
    geo.x0 = lab; geo.y0 = top; geo.c = c; const m = M();
    TOK.forEach((t, k) => { ctx.save(); ctx.translate(lab + k * c + c / 2 + 3, top - 6); ctx.rotate(-Math.PI / 3); text(ctx, t, 0, 0, { color: col.muted, size: 10.5, fit: false }); ctx.restore(); });
    TOK.forEach((t, q) => {
      text(ctx, t, lab - 6, top + q * c + c / 2, { color: q === sel ? col.ink : col.muted, size: 11, align: 'right', weight: q === sel ? 700 : 400, fit: false });
      TOK.forEach((_, k) => {
        const x = lab + k * c, y = top + q * c, masked = mask && k > q;
        ctx.fillStyle = col.soft; ctx.fillRect(x, y, c - 1, c - 1);
        if (!masked) { ctx.save(); ctx.globalAlpha = Math.min(1, m[q][k] * 1.15); ctx.fillStyle = col.s[0]; ctx.fillRect(x, y, c - 1, c - 1); ctx.restore(); if (m[q][k] > 0.2) text(ctx, Math.round(m[q][k] * 100) + '', x + c / 2, y + c / 2, { color: m[q][k] > 0.5 ? col.panel : col.ink, size: 9.5, align: 'center', fit: false }); }
      });
    });
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(lab - 1, top + sel * c - 1, c * TOK.length + 1, c);
  };
  show();
}
