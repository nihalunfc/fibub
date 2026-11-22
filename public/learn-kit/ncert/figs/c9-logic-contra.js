// Class 9 Propositions (step player): proof by contradiction that "if n² is even, then n is even". Suppose n is odd. Then n = 2k + 1
// and n² = 2(2k² + 2k) + 1 is odd, which clashes with "n² is even". So the supposition fails. A grid of n by n dots shows it:
// pair the dots up and an odd n leaves one dot with no partner.
import { canvas, text, title, row, slider } from '../../kit.js';

const T = [
  ['Claim: if n² is even, then n is even', 'We want to prove this. Direct steps are awkward, so we try another way.'],
  ['Suppose the opposite: n² is even but n is odd', 'Proof by contradiction: assume the claim is false and see what goes wrong.'],
  ['An odd number is n = 2k + 1', 'Here n = 7, so k = 3. Look at the n × n grid of dots below.'],
  ['n² = (2k + 1)² = 4k² + 4k + 1 = 2(2k² + 2k) + 1', 'Pair up the dots: all pair off except one. n² is odd.'],
  ['So n² is odd, but we said n² is even: a contradiction', 'Something we assumed must be wrong. The algebra was right.'],
  ['So n cannot be odd: n is even. The claim is proved', 'The only thing we assumed was “n is odd”, so that is what must be false.'],
];
export default function (host) {
  let s = 0, n = 7;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A square grid of dots paired up to show that an odd number squared is odd' });
  const c = row(host); slider(c, { label: 'n', min: 1, max: 9, step: 1, value: n, oninput: (v) => { n = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Proof by contradiction', col);
    const [a, b] = T[s];
    text(ctx, a, w / 2, t + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, b, w / 2, t + 36, { color: col.muted, size: 10.5, align: 'center' });
    if (s < 2) { text(ctx, s === 0 ? 'n² even ⟹ n even' : 'n² even AND n odd', w / 2, h / 2 + 30, { color: s ? col.s[6] : col.s[2], size: 18, weight: 700, align: 'center' }); return; }
    const top = t + 54, g = Math.min((w - 30) / n, (h - top - 40) / n, 34), ox = (w - g * n) / 2;
    for (let i = 0; i < n * n; i++) {
      const r = Math.floor(i / n), cc = i % n, x = ox + cc * g + g / 2, y = top + r * g + g / 2, pair = Math.floor(i / 2), left = i === n * n - 1 && n * n % 2 === 1;
      ctx.save(); ctx.fillStyle = left ? col.s[6] : col.s[pair % 2 ? 0 : 3]; ctx.beginPath(); ctx.arc(x, y, Math.max(3, g * 0.3), 0, 7); ctx.fill(); ctx.restore();
    }
    text(ctx, 'n² = ' + n * n + (n % 2 ? ' is odd: one dot (red) has no partner' : ' is even: every dot has a partner'), w / 2, h - 14, { color: n % 2 ? col.s[6] : col.s[2], size: 12, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
