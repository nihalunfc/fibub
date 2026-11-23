// Class 11 Chemistry, Some Basic Concepts: significant figures. Non-zero digits and zeros between them always count;
// leading zeros never count; trailing zeros count only after a decimal point (or when marked). The figure colours each digit.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const EX = [['0.00420', 'leading zeros are place-holders'], ['4.200', 'trailing zeros after the point count'], ['5004', 'zeros between digits count'], ['1200', 'trailing zeros with no point are unclear'], ['1.20×10³', 'scientific notation makes 3 figures clear'], ['0.0100', '1 then two trailing zeros: 3 figures']];
const sf = (s) => { const m = s.split('×')[0].replace('.', ''); const hasDot = s.split('×')[0].includes('.') || s.includes('×'); let d = m.replace(/^0+/, ''); if (!hasDot) d = d.replace(/0+$/, ''); return d.length; };
export default function (host) {
  let i = 0;
  const cv = canvas(host, { aspect: 0.42, max: 440, min: 300, label: 'Digits of a number coloured as significant or not significant' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'number', EX.map((e, j) => [j, e[0]]), 0, (v) => { i = v; go(); });
  const go = () => { ro.textContent = `${EX[i][0]} has ${sf(EX[i][0])} significant figure${sf(EX[i][0]) > 1 ? 's' : ''}: ${EX[i][1]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = EX[i][0], t0 = title(ctx, 'which digits count?', col) + 20, base = s.split('×')[0], hasDot = base.includes('.') || s.includes('×');
    const digs = [...base]; let first = digs.findIndex((c) => c >= '1' && c <= '9'); let last = digs.length - 1;
    if (!hasDot) while (last > first && digs[last] === '0') last--;
    const sz = Math.min(44, (w - 40) / (s.length * 0.65)); ctx.font = `700 ${sz}px system-ui`; ctx.textBaseline = 'middle';
    const cw = sz * 0.62; let x = (w - cw * s.length) / 2;
    [...s].forEach((c, j) => { const sig = j < digs.length && c !== '.' && j >= first && j <= last; ctx.fillStyle = c === '.' || j >= digs.length ? col.muted : sig ? col.s[2] : col.line; if (sig) { ctx.globalAlpha = 0.2; ctx.fillRect(x - 1, t0 - sz / 2, cw + 2, sz); ctx.globalAlpha = 1; ctx.fillStyle = col.s[2]; } else ctx.fillStyle = c === '.' || j >= digs.length ? col.muted : col.muted; ctx.fillText(c, x, t0); x += cw; });
    text(ctx, `${sf(s)} significant figures`, w / 2, t0 + sz / 2 + 28, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, 'coloured = counts, grey = does not', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
