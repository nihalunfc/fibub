// Class 8 Power Play: standard (scientific) form. Move the decimal point until exactly one non-zero digit sits before it;
// the number of places moved is the power of 10. Big numbers move the point left (positive power), tiny ones right (negative).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const DATA = [['Earth to Sun (km)', '149600000'], ['People in India (about)', '1450000000'], ['Light speed (m/s)', '299792458'], ['Width of a hair (m)', '0.00007'], ['Size of a virus (m)', '0.0000001'], ['Hydrogen atom mass (g)', '0.0000000000000000000000017']];
export default function (host) {
  let ix = 0, shift = 0;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 200, label: 'Digits of a number with a decimal point that moves, and the power of ten that results' });
  const out = readout(host); const ctl = row(host);
  choice(ctl, 'Number', DATA.map((d, i) => [i, d[0].split(' (')[0]]), ix, (v) => { ix = v; shift = 0; sh.set(0); sync(); });
  const sh = slider(ctl, { label: 'Places moved', min: 0, max: 30, step: 1, value: 0, fmt: (v) => Math.round(v), oninput: (v) => { shift = Math.round(v); sync(); } });
  const info = () => {
    const s = DATA[ix][1], d = s.replace('.', ''), p0 = s.includes('.') ? s.indexOf('.') : s.length, first = d.search(/[1-9]/), t = first + 1, need = Math.abs(p0 - t);
    const sig = d.replace(/^0+/, '').replace(/0+$/, '') || '0';
    return { d, p0, t, need, big: p0 > t, sig };
  };
  function sync() {
    const q = info(), k = Math.min(shift, q.need), m = q.sig.length > 1 ? q.sig[0] + '.' + q.sig.slice(1) : q.sig;
    out.innerHTML = `${DATA[ix][0]}: the point moved <b>${k}</b> place${k === 1 ? '' : 's'} ${q.big ? 'left' : 'right'}. ${k === q.need ? `Standard form: <b>${m} × 10<sup>${q.big ? k : -k}</sup></b>` : `Keep moving: ${q.need - k} more.`}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Move the decimal point', col), q = info(), k = Math.min(shift, q.need), n = q.d.length, sz = Math.min(26, (w - 20) / (n + 1)), x0 = (w - n * sz) / 2, y = top + 50;
    const p = q.big ? q.p0 - k : q.p0 + k, first = q.d.search(/[1-9]/);
    for (let i = 0; i < n; i++) text(ctx, q.d[i], x0 + i * sz + sz / 2, y, { color: i < first ? col.muted : col.ink, size: Math.max(11, sz * 0.85), weight: 700, align: 'center' });
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(x0 + p * sz, y + sz * 0.4, 4, 0, 7); ctx.fill();
    text(ctx, 'point', x0 + p * sz, y + sz * 0.4 + 16, { color: col.s[3], size: 10.5, align: 'center' });
    text(ctx, `${k} place${k === 1 ? '' : 's'} moved ${q.big ? 'to the left' : 'to the right'}`, w / 2, y + 62, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, k === q.need ? 'Exactly one non-zero digit before the point: done' : 'Aim: one non-zero digit before the point', w / 2, y + 88, { color: k === q.need ? col.s[2] : col.muted, size: 12, weight: k === q.need ? 700 : 400, align: 'center' });
  };
  sync();
}
