// 8.2 Testing numbers: dots are numbers that fit a statement, coloured by the answer they give.
import { canvas, row, choice, readout, text, title } from '../../kit.js';
const Q = {
  odd: { name: 'Is n odd?', s: [['n is prime', (n) => isP(n)], ['n is prime and n > 2', (n) => isP(n) && n > 2]], ask: (n) => n % 2 === 1, dom: [1, 40] },
  six: { name: 'Is n divisible by 6?', s: [['n is divisible by 3', (n) => n % 3 === 0], ['n is divisible by 12', (n) => n % 12 === 0]], ask: (n) => n % 6 === 0, dom: [1, 40] },
  pos: { name: 'Is x > 0?', s: [['x² = 16', (x) => x * x === 16], ['x³ = −8', (x) => x * x * x === -8]], ask: (x) => x > 0, dom: [-10, 10] },
};
function isP(n) { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; }
export default function (host) {
  let q = 'odd', si = 0;
  const cv = canvas(host, { aspect: 0.42, max: 220, min: 170, label: 'Numbers that fit the statement on a number line' });
  const ctl = row(host), out = readout(host); let sc;
  const go = () => { cv.redraw(); const Z = Q[q], [a, b] = Z.dom, fit = []; for (let n = a; n <= b; n++) if (Z.s[si][1](n)) fit.push(n);
    const ans = new Set(fit.map(Z.ask));
    out.innerHTML = `Numbers from ${a} to ${b} that fit "${Z.s[si][0]}": ${fit.join(', ')}. ` + (ans.size === 1 ? `All give <b>${[...ans][0] ? 'yes' : 'no'}</b>: sufficient.` : `Some give yes, some no: <b>not sufficient</b>.`); };
  cv.draw = (ctx, w, h, col) => {
    const Z = Q[q], [a, b] = Z.dom, x = (n) => 24 + (w - 48) * (n - a) / (b - a), y = h * 0.6;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(w - 18, y); ctx.stroke();
    for (let n = a; n <= b; n++) { const ok = Z.s[si][1](n); if ((b - a <= 20) || n % 5 === 0) text(ctx, String(n).replace('-', '−'), x(n), y + 16, { color: col.muted, size: 10, align: 'center' });
      if (ok) { ctx.fillStyle = Z.ask(n) ? col.good : col.bad; ctx.beginPath(); ctx.arc(x(n), y, 6, 0, 7); ctx.fill(); } }
    text(ctx, '● yes', w - 110, 40, { color: col.good, size: 12, weight: 700 }); text(ctx, '● no', w - 52, 40, { color: col.bad, size: 12, weight: 700 });
    title(ctx, `${Z.name}  Statement: ${Z.s[si][0]}`, col);
  };
  const mk = () => { ctl.innerHTML = ''; choice(ctl, 'Question', Object.entries(Q).map(([k, v]) => [k, v.name]), q, (v) => { q = v; si = 0; mk(); go(); });
    choice(ctl, 'Statement', Q[q].s.map((s, i) => [i, s[0]]), si, (v) => { si = v; go(); }); };
  mk(); go();
}
