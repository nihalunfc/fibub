// Class 9 Data: how the class width changes a histogram. Forty students' heights (cm). Narrow classes look lumpy, very wide classes hide the
// shape. Choose a class width; the bars always touch because the classes join on the number line.
import { canvas, text, title, row, choice, readout, rng } from '../../kit.js';

const r = rng(11), H = Array.from({ length: 40 }, () => Math.round(145 + (r() + r() + r() + r()) * 7.5));
export default function (host) {
  let wd = 5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A histogram of forty heights whose class width you can change' });
  const c = row(host); choice(c, 'Class width (cm)', [[2, '2'], [5, '5'], [10, '10'], [20, '20']], wd, (v) => { wd = v; upd(); });
  const out = readout(host), lo = 140, hi = 180;
  const bins = () => { const n = Math.ceil((hi - lo) / wd); return Array.from({ length: n }, (_, i) => H.filter((x) => x >= lo + i * wd && x < lo + (i + 1) * wd).length); };
  cv.draw = (ctx, w, h, col) => {
    const f = bins(), t = title(ctx, 'Heights of 40 students, width ' + wd + ' cm', col), L = 34, B = h - 30, Tp = t + 14, mx = Math.max(...f) + 1, bw = (w - L - 14) / f.length, Y = (v) => B - (v / mx) * (B - Tp);
    for (let y = 0; y <= mx; y += Math.ceil(mx / 5)) { ctx.save(); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(w - 10, Y(y)); ctx.stroke(); ctx.restore(); text(ctx, String(y), L - 5, Y(y), { color: col.muted, size: 10.5, align: 'right' }); }
    const top = Math.max(...f);
    f.forEach((v, i) => { const x = L + i * bw; ctx.save(); ctx.fillStyle = v === top ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.65; ctx.fillRect(x, Y(v), bw, B - Y(v)); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(x, Y(v), bw, B - Y(v)); ctx.restore(); if (bw > 14) text(ctx, String(v), x + bw / 2, Y(v) - 7, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    for (let v = lo; v <= hi; v += wd >= 10 ? wd : 10) text(ctx, String(v), L + ((v - lo) / wd) * bw, B + 11, { color: col.ink, size: 10.5, align: 'center' });
    text(ctx, 'height (cm)', (L + w) / 2, h - 6, { color: col.muted, size: 10.5, align: 'center' });
  };
  function upd() { const f = bins(), top = Math.max(...f), i = f.indexOf(top); out.innerHTML = `Width ${wd} cm gives <b>${f.length}</b> classes. The tallest bar (modal class) is ${140 + i * wd} to ${140 + (i + 1) * wd} cm with ${top} students. ` + (wd <= 2 ? 'Too narrow: the picture is lumpy and hard to read.' : wd >= 20 ? 'Too wide: two big bars hide the bell shape.' : 'A good width shows the shape of the data clearly.'); cv.redraw(); }
  upd();
}
