// Class 9 Propositions: a counterexample hunter. A claim about every number is tested on 1 to 48. Moving the slider tests
// one number at a time; the grid turns green when the claim holds for that number and red when it fails. One red tile
// (a counterexample) is enough to prove the claim false; many green tiles can never prove it true.
import { canvas, text, title, row, slider, button, choice, readout } from '../../kit.js';

const prime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const C = {
  odd: { t: 'Every prime number is odd', f: (n) => !prime(n) || n % 2 === 1, test: (n) => (prime(n) ? n + ' is prime' + (n % 2 ? ' and odd' : ' but even') : n + ' is not prime, so the claim says nothing about it') },
  sq: { t: 'n² is bigger than n', f: (n) => n * n > n, test: (n) => n + '² = ' + n * n + (n * n > n ? ' > ' : ' is not > ') + n },
  euler: { t: 'n² + n + 41 is prime', f: (n) => prime(n * n + n + 41), test: (n) => n + '² + ' + n + ' + 41 = ' + (n * n + n + 41) + (prime(n * n + n + 41) ? ', prime' : ', not prime') },
  mult: { t: 'If n is a multiple of 4, it is a multiple of 8', f: (n) => n % 4 !== 0 || n % 8 === 0, test: (n) => n % 4 ? n + ' is not a multiple of 4: nothing to check' : n + ' is a multiple of 4' + (n % 8 ? ' but not of 8' : ' and of 8') },
  two: { t: '2n + 1 is prime', f: (n) => prime(2 * n + 1), test: (n) => '2(' + n + ') + 1 = ' + (2 * n + 1) + (prime(2 * n + 1) ? ', prime' : ', not prime') },
};
export default function (host) {
  let k = 'odd', n = 1, seen = new Set(), reveal = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A grid of the numbers 1 to 48 coloured by whether a claim holds' });
  const c1 = row(host); choice(c1, 'Claim', Object.entries(C).map(([v, o]) => [v, v === 'odd' ? 'primes odd' : v === 'sq' ? 'n² > n' : v === 'euler' ? 'n²+n+41' : v === 'mult' ? '×4 → ×8' : '2n+1']), k, (v) => { k = v; seen = new Set([n]); reveal = false; upd(); });
  const c2 = row(host); const sl = slider(c2, { label: 'Test n', min: 1, max: 48, step: 1, value: 1, oninput: (v) => { n = v; seen.add(v); upd(); } });
  const c3 = row(host); button(c3, 'Reveal all', () => { reveal = true; upd(); }); button(c3, 'Start again', () => { seen = new Set([n]); reveal = false; upd(); });
  const out = readout(host);
  seen.add(1);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, C[k].t, col), cols = 8, rows = 6, g = 4, cw = (w - 28 - g * (cols - 1)) / cols, ch = Math.min(cw, (h - t - 60) / rows - g);
    for (let v = 1; v <= 48; v++) {
      const c = (v - 1) % cols, r = Math.floor((v - 1) / cols), x = 14 + c * (cw + g), y = t + 12 + r * (ch + g), known = reveal || seen.has(v), ok = C[k].f(v);
      ctx.save(); ctx.fillStyle = known ? (ok ? col.s[2] : col.s[6]) : col.line; ctx.globalAlpha = known ? 0.6 : 0.45; ctx.fillRect(x, y, cw, ch); ctx.restore();
      if (v === n) { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, cw, ch); ctx.restore(); }
      text(ctx, String(v), x + cw / 2, y + ch / 2, { color: col.ink, size: 11, weight: 700, align: 'center' });
    }
    const bad = [...Array(48).keys()].map((i) => i + 1).filter((v) => (reveal || seen.has(v)) && !C[k].f(v));
    text(ctx, bad.length ? 'Counterexample found: ' + bad.slice(0, 4).join(', ') + (bad.length > 4 ? '…' : '') + '. The claim is FALSE.' : 'No counterexample found yet', w / 2, h - 14, { color: bad.length ? col.s[6] : col.muted, size: 13, weight: 700, align: 'center' });
  };
  function upd() { const ok = C[k].f(n); out.innerHTML = `<b>n = ${n}:</b> ${C[k].test(n)}. ${ok ? 'The claim holds here (green): but that proves nothing about the other numbers.' : 'The claim <b>fails</b> here (red). One failure is enough: it is false.'}`; cv.redraw(); }
  upd();
}
