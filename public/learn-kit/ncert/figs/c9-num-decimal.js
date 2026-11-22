// Class 9 Numbers: the decimal form of p/q. Divide with long division and the remainders must repeat or reach 0.
// A fraction in lowest terms terminates only when the denominator has no prime factors except 2 and 5; otherwise the digits recur.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function expand(p, q) {
  const seen = new Map(), digs = []; let r = p % q, ip = Math.floor(p / q);
  while (r && !seen.has(r) && digs.length < 40) { seen.set(r, digs.length); r *= 10; digs.push(Math.floor(r / q)); r %= q; }
  return { ip, digs, start: r ? seen.get(r) : -1, term: r === 0 };
}
export default function (host) {
  let p = 1, q = 7;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 250, label: 'The decimal expansion of a fraction with the repeating block underlined' });
  const ctl = row(host);
  slider(ctl, { label: 'Numerator p', min: 1, max: 20, step: 1, value: p, oninput: (v) => { p = v; upd(); } });
  slider(ctl, { label: 'Denominator q', min: 2, max: 20, step: 1, value: q, oninput: (v) => { q = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, p + '/' + q + ' as a decimal', col), e = expand(p, q), g = gcd(p, q);
    const per = e.term ? 0 : e.digs.length - e.start, show = e.digs.slice(0, Math.min(e.digs.length, 22));
    let x = 12, y = t + 36; const cw = Math.min(17, (w - 36) / (show.length + 3));
    ctx.save(); ctx.font = '700 ' + Math.round(cw * 1.2) + 'px system-ui'; ctx.textBaseline = 'middle'; ctx.fillStyle = col.ink;
    const head = e.ip + '.'; ctx.fillText(head, x, y); x += ctx.measureText(head).width;
    show.forEach((d, i) => { const rep = !e.term && i >= e.start && i < e.start + per; ctx.fillStyle = rep ? col.s[3] : col.ink; ctx.fillText(d, x, y); if (rep) { ctx.fillRect(x, y + cw * 0.75, cw * 0.62, 3); } x += cw * 0.72 + (i === show.length - 1 ? 0 : 0); });
    ctx.fillStyle = col.ink; if (!e.term && e.digs.length > show.length - 1) ctx.fillText('…', x, y);
    ctx.restore();
    text(ctx, e.term ? 'Terminating: the division ends with remainder 0.' : 'Recurring: block of ' + per + ' digit' + (per > 1 ? 's' : '') + ' repeats (underlined).', 12, y + 38, { color: e.term ? col.s[2] : col.s[3], size: 13, weight: 700 });
    const qq = q / g; let f = qq; const fs = []; for (const pr of [2, 3, 5, 7, 11, 13, 17, 19]) while (f % pr === 0) { fs.push(pr); f /= pr; }
    text(ctx, 'Lowest terms: ' + (p / g) + '/' + qq + '. Denominator = ' + (fs.length ? fs.join(' × ') : '1'), 12, y + 62, { color: col.ink, size: 12 });
    text(ctx, qq === 1 ? 'A whole number.' : fs.every((a) => a === 2 || a === 5) ? 'Only 2s and 5s: it must terminate.' : 'Has another prime factor: it must recur.', 12, y + 82, { color: col.muted, size: 12 });
  };
  function upd() { const e = expand(p, q), g = gcd(p, q); out.innerHTML = `${p}/${q} = <b>${e.ip}.${e.digs.slice(0, 14).join('')}${e.term ? '' : '…'}</b>` + (e.term ? ' (terminating).' : ` (the block <b>${e.digs.slice(e.start, e.digs.length).join('')}</b> repeats).`) + (g > 1 ? ` Note ${p}/${q} reduces to ${p / g}/${q / g}.` : ''); cv.redraw(); }
  upd();
}
