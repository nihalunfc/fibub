// Class 11 Units and Measurement: significant figures. Every digit that was actually measured counts, plus the first doubtful one. Rules: non-zero digits always count;
// zeros between digits count; leading zeros never count; trailing zeros count only after a decimal point (or when written in scientific form). Pick a number to see
// its counted digits; slide "round to" to see rounding to n significant figures and the scientific form.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const NUMS = ['4.560', '0.00305', '2500', '2500.', '1.20e5', '0.0070', '100.05', '6.022e23'];
function sig(s) {
  const mant = s.split('e')[0], hasDot = mant.includes('.');
  const chars = [...mant].filter((c) => c !== '.');
  const first = chars.findIndex((c) => c !== '0');
  const flags = chars.map((c, k) => first >= 0 && k >= first && (c !== '0' || hasDot || chars.slice(k + 1).some((q) => q !== '0')));
  return { chars, flags, n: flags.filter(Boolean).length, mant };
}
export default function (host) {
  let k = 0, rd = 3;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 250, label: 'A measured number with its significant digits highlighted' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Number', NUMS.map((s, i) => [i, s.replace('e', '×10^')]), 0, (v) => { k = v; go(); });
  slider(ctl, { label: 'Round to (figures)', min: 1, max: 6, step: 1, value: rd, fmt: (v) => String(v), oninput: (v) => { rd = v; go(); } });
  function go() {
    const s = NUMS[k], p = sig(s), x = +s, r = +x.toPrecision(rd);
    const why = ['non-zero digits always count', 'zeros between digits count', 'leading zeros only show the decimal place', 'trailing zeros count only after a decimal point'];
    out.innerHTML = `<b>${p.n}</b> significant figures in ${s.replace('e', ' × 10<sup>') + (s.includes('e') ? '</sup>' : '')}. Rounded to ${rd}: <b>${r.toExponential(Math.max(0, rd - 1)).replace('e', ' × 10<sup>').replace('+', '') + '</sup>'}</b>${Math.abs(x) < 1e6 && Math.abs(x) >= 1e-3 ? ' (= ' + r.toString() + ')' : ''}. Rules: ${why.join('; ')}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Which digits count?', col);
    const s = NUMS[k], p = sig(s), size = Math.min(44, (w - 30) / (p.chars.length + 1.5) * 1.5), step = size * 0.62;
    let x = (w - (p.mant.length * step + (s.includes('e') ? size * 1.6 : 0))) / 2; const y = h * 0.45;
    let ci = 0;
    for (const c of p.mant) {
      if (c === '.') { text(ctx, '.', x + step * 0.2, y, { size, weight: 700, color: col.ink, align: 'center' }); x += step * 0.45; continue; }
      const on = p.flags[ci++];
      if (on) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(x - 2, y - size * 0.6, step + 4, size * 1.2); ctx.globalAlpha = 1; }
      text(ctx, c, x + step / 2, y, { size, weight: 700, color: on ? col.s[2] : col.muted, align: 'center' }); x += step;
    }
    if (s.includes('e')) text(ctx, '×10' + s.split('e')[1].replace(/./g, (d) => ({ 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' })[d]), x + 4, y, { size: size * 0.6, weight: 700, color: col.ink });
    text(ctx, `${p.n} significant figures`, w / 2, h * 0.72, { size: 15, weight: 700, color: col.s[2], align: 'center' });
    text(ctx, 'green digits count, grey digits do not', w / 2, h * 0.84, { size: 11, color: col.muted, align: 'center' });
  };
  go();
}
