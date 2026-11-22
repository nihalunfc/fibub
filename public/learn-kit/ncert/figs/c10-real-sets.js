// Class 10 Real Numbers: where a number lives. Natural numbers N sit inside integers Z, inside rationals Q, inside the real numbers R;
// irrational numbers are the real numbers that are not rational. Choose a number and see its place.
import { canvas, text, title, dot, row, choice, readout } from '../../kit.js';

const ITEMS = [['7', '7', 'N'], ['0', '0', 'Z'], ['-4', '−4', 'Z'], ['3/4', '3/4', 'Q'], ['2.5', '2.5', 'Q'], ['1/3', '0.333…', 'Q'], ['r2', '√2', 'I'], ['pi', 'π', 'I'], ['r16', '√16', 'N']];
const WHY = { '7': 'a counting number', '0': 'an integer, but not a counting number', '-4': 'a negative integer', '3/4': 'a fraction of two integers', '2.5': '5/2, a terminating decimal', '1/3': 'a repeating decimal, so a fraction', 'r2': 'a non-terminating, non-repeating decimal', 'pi': 'a non-terminating, non-repeating decimal', 'r16': '√16 = 4, a counting number in disguise' };
const SETS = { N: 'natural, integer, rational and real', Z: 'an integer, rational and real (not natural)', Q: 'rational and real (not an integer)', I: 'irrational and real (not rational)' };
export default function (host) {
  let cur = '7';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Nested boxes for natural numbers, integers, rational numbers and real numbers with a chosen number placed inside' });
  const ctl = row(host);
  choice(ctl, 'Number', ITEMS.map(([k, t]) => [k, t]), cur, (v) => { cur = v; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Which set does it belong to?', col) + 6, B = h - 10, T = top + 4;
    const box = (x0, x1, y0, tone, label, fill) => { ctx.fillStyle = fill; ctx.fillRect(x0, y0, x1 - x0, B - y0); ctx.lineWidth = 2; ctx.strokeStyle = tone; ctx.strokeRect(x0, y0, x1 - x0, B - y0); text(ctx, label, x0 + 6, y0 + 11, { color: tone, size: 11, weight: 700 }); };
    const xN = w * 0.34, xZ = w * 0.5, xQ = w * 0.66;
    box(6, w - 6, T, col.s[3], 'Real numbers R', col.panel); box(14, xQ, T + 26, col.s[1], 'Rational Q', col.panel); box(22, xZ, T + 52, col.s[2], 'Integers Z', col.panel); box(30, xN, T + 78, col.s[0], 'N', col.panel);
    text(ctx, 'Irrational', (xQ + w - 6) / 2, T + 37, { color: col.s[6], size: 11, weight: 700, align: 'center' });
    const it = ITEMS.find((i) => i[0] === cur), mid = (B + T + 78) / 2;
    const zone = { N: [(30 + xN) / 2, mid + 6], Z: [(xN + xZ) / 2, mid], Q: [(xZ + xQ) / 2, mid - 10], I: [(xQ + w - 6) / 2, mid - 20] }[it[2]];
    dot(ctx, zone[0], zone[1], 16, col.soft, col.ink); text(ctx, it[1], zone[0], zone[1], { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  function upd() { const it = ITEMS.find((i) => i[0] === cur); out.innerHTML = `<b>${it[1]}</b> is ${WHY[cur]}: it is ${SETS[it[2]]}.`; cv.redraw(); }
  upd();
}
