// Class 11 Chemistry, Classification of Elements: successive ionisation enthalpies of Na, Mg and Al (kJ/mol, NIST). Each electron is harder to remove than the last,
// but the jump after the valence electrons is enormous because the next electron comes from an inner shell, closer to the nucleus. The jump shows the group number.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const D = { Na: [496, 4562, 6910, 9543, 13354, 16613, 20117, 25496, 28932, 141362, 159076], Mg: [738, 1451, 7733, 10543, 13630, 17995, 21703, 25656, 31642, 35461, 169988], Al: [578, 1817, 2745, 11577, 14842, 18379, 23326, 27465, 31853, 38473, 42647] };
const VAL = { Na: 1, Mg: 2, Al: 3 };
export default function (host) {
  let k = 'Na', sel = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'Bars of successive ionisation enthalpies with a large jump after the valence electrons' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'element', [['Na', 'Na (Z=11)'], ['Mg', 'Mg (Z=12)'], ['Al', 'Al (Z=13)']], k, (v) => { k = v; go(); });
  const go = () => { const d = D[k], v = VAL[k]; ro.textContent = `${k}: IE${v} = ${d[v - 1]} kJ/mol but IE${v + 1} = ${d[v]} kJ/mol, a jump of ${(d[v] / d[v - 1]).toFixed(1)} times. The next electron must come from the 2p inner shell, so ${k} has ${v} valence electron${v > 1 ? 's' : ''}: group ${10 + v === 11 ? 1 : v === 2 ? 2 : 13}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `successive ionisation enthalpies of ${k}`, col) + 10, d = D[k], v = VAL[k], L = 36, B = h - 40, T = t0 + 6, W = w - L - 8, bw = W / d.length, lg = (x) => Math.log10(x), lo = 2, hi = 5.4;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(L + W, B); ctx.stroke();
    [100, 1000, 10000, 100000].forEach((y) => { const yy = B - (B - T) * (lg(y) - lo) / (hi - lo); ctx.strokeStyle = col.line; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(L + W, yy); ctx.stroke(); ctx.setLineDash([]); text(ctx, y >= 1000 ? y / 1000 + 'k' : String(y), L - 3, yy, { color: col.muted, size: 9.5, align: 'right' }); });
    d.forEach((val, i) => { const x = L + i * bw, hh = (B - T) * (lg(val) - lo) / (hi - lo); ctx.fillStyle = i < v ? col.s[0] : i === v ? col.s[3] : col.s[1]; ctx.globalAlpha = 0.85; ctx.fillRect(x + 2, B - hh, bw - 4, hh); ctx.globalAlpha = 1; text(ctx, String(i + 1), x + bw / 2, B + 11, { color: col.muted, size: 10, align: 'center' }); });
    text(ctx, 'IE number (log scale of kJ/mol)', L + W / 2, B + 28, { color: col.muted, size: 10.5, align: 'center' });
    const jx = L + v * bw; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(jx, T); ctx.lineTo(jx, B); ctx.stroke(); text(ctx, `${v} valence e⁻ | inner shell`, jx + (v < 3 ? 4 : -4), T + 10, { color: col.s[3], size: 10.5, weight: 700, align: v < 3 ? 'left' : 'right' });
  };
  go();
}
