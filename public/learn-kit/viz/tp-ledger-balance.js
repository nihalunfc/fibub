// Double entry, one transaction at a time: every entry has a debit and a credit of the same amount, so assets always equal
// liabilities plus capital and the trial balance agrees. Press "Next entry" and watch the two accounts change; the left
// stack (assets) and right stack (liabilities and capital) stay the same height. The figures are made-up rupees.
import { canvas, row, button, readout, text, loop, title, ease, clamp } from '../kit.js';

const ACC = { cash: ['Cash', 'A'], stock: ['Stock', 'A'], furn: ['Furniture', 'A'], cred: ['Creditors', 'L'], loan: ['Bank loan', 'L'], cap: ['Capital', 'E'] };
const TX = [
  ['Owner puts in cash', 'cash', 'cap', 50000], ['Buys furniture for cash', 'furn', 'cash', 10000],
  ['Buys stock on credit', 'stock', 'cred', 8000], ['Takes a bank loan', 'cash', 'loan', 20000],
  ['Pays creditors in cash', 'cred', 'cash', 5000], ['Buys stock for cash', 'stock', 'cash', 6000],
];
const rs = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

export default function (host) {
  let n = 0, p = 1;
  const bal = (k) => { const b = Object.fromEntries(Object.keys(ACC).map((a) => [a, 0])); for (let i = 0; i < k; i++) { const [, d, c, v] = TX[i]; for (const [a, s] of [[d, 1], [c, -1]]) b[a] += (ACC[a][1] === 'A' ? s : -s) * v; } return b; };
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 330, label: 'Accounts changing after each double entry' });
  const c = row(host);
  button(c, 'Next entry ▶', () => { if (n < TX.length) { n++; p = 0; go.play(); } });
  button(c, 'Reset', () => { n = 0; p = 1; cv.redraw(); show(); });
  const out = readout(host);
  const go = loop(host, (dt) => { if (p < 1) { p = clamp(p + dt / 0.9, 0, 1); cv.redraw(); if (p >= 1) go.pause(); } }, { autoplay: false });
  const show = () => {
    const b = bal(n), A = b.cash + b.stock + b.furn, R = b.cred + b.loan + b.cap;
    out.innerHTML = n ? `<b>${TX[n - 1][0]}</b>: debit ${ACC[TX[n - 1][1]][0]} ${rs(TX[n - 1][3])}, credit ${ACC[TX[n - 1][2]][0]} ${rs(TX[n - 1][3])}. Assets ${rs(A)} = Liabilities + Capital ${rs(R)}.` : 'Press Next entry. Rule: an asset goes up on the debit side; a liability or capital goes up on the credit side.';
  };
  const tick = go.play;
  cv.draw = (ctx, w, h, col) => {
    title(ctx, n ? `Entry ${n} of ${TX.length}: ${TX[n - 1][0]}` : 'Start: nothing yet', col);
    const prev = bal(Math.max(0, n - 1)), cur = bal(n), e = ease(p);
    const v = (k) => prev[k] + (cur[k] - prev[k]) * e;
    const top = 70, bot = h - 52, mx = Math.max(90000, ...Object.keys(ACC).map(() => 0));
    const A = ['cash', 'stock', 'furn'].reduce((s, k) => s + v(k), 0), R = ['cred', 'loan', 'cap'].reduce((s, k) => s + v(k), 0);
    const sc = (bot - top) / Math.max(mx, A, R), bw = Math.min(110, (w - 60) / 2.4);
    const stack = (keys, x, colr) => { let y = bot; keys.forEach((k, i) => { const hh = v(k) * sc; ctx.fillStyle = col.s[colr[i]]; ctx.globalAlpha = 0.8; ctx.fillRect(x, y - hh, bw, hh); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.strokeRect(x, y - hh, bw, hh);
      const hit = n && !(p >= 1) ? false : false; if (hh > 15) text(ctx, `${ACC[k][0]} ${rs(v(k))}`, x + bw / 2, y - hh / 2, { color: col.ink, size: 10.5, weight: 600, align: 'center', halo: col.panel }); y -= hh; }); return y; };
    const x1 = w / 2 - bw - 18, x2 = w / 2 + 18;
    const y1 = stack(['cash', 'stock', 'furn'], x1, [0, 1, 2]), y2 = stack(['cred', 'loan', 'cap'], x2, [3, 4, 5]);
    ctx.strokeStyle = col.ink; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x1 - 8, y1); ctx.lineTo(x2 + bw + 8, y1); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'ASSETS', x1 + bw / 2, bot + 12, { color: col.muted, size: 11, weight: 700, align: 'center' });
    text(ctx, 'LIABILITIES + CAPITAL', x2 + bw / 2, bot + 12, { color: col.muted, size: 11, weight: 700, align: 'center' });
    text(ctx, '=', w / 2, (top + bot) / 2, { color: col.ink, size: 22, weight: 700, align: 'center' });
    if (n) { const [, d, cr] = TX[n - 1]; text(ctx, `Dr ${ACC[d][0]}   |   Cr ${ACC[cr][0]}`, w / 2, bot + 34, { color: p < 1 ? col.warn : col.good, size: 12, weight: 700, align: 'center' }); }
    else text(ctx, 'Dr = left side of the ledger, Cr = right side', w / 2, bot + 34, { color: col.muted, size: 11, align: 'center' });
  };
  show();
}
