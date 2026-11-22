// Effective nuclear charge by Slater's rules for Z = 3 to 20: inner electrons shield the valence electron, so Z* = Z − S
// grows slowly across a period but drops sharply at a new shell. Drag Z (or press Play): the sketch shows the shells,
// the bars show Z* and the atom size (proportional to n*²/Z*). This is why radius falls across a period and jumps at Na and K.
import { canvas, text, row, slider, readout, loop, title } from '../kit.js';

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' ');
function info(Z) { // electrons per shell and Slater screening for the outermost electron
  const sh = [Math.min(Z, 2), Math.max(0, Math.min(Z - 2, 8)), Math.max(0, Math.min(Z - 10, 8)), Math.max(0, Z - 18)];
  const n = sh.findLastIndex((v) => v > 0) + 1, same = sh[n - 1] - 1;
  const S = n === 1 ? 0.3 * same : 0.35 * same + 0.85 * (sh[n - 2] || 0) + (n > 2 ? sh.slice(0, n - 2).reduce((a, b) => a + b, 0) : 0);
  const ns = [1, 2, 3, 3.7][n - 1];
  return { sh, n, same, S, zs: Z - S, r: ns * ns / (Z - S) };
}
export default function (host) {
  let Z = 11;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Shells of an atom and bars of effective nuclear charge and size for Z 3 to 20' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Element', min: 3, max: 20, step: 1, value: Z, fmt: (v) => `${v} ${SYM[v - 1]}`, oninput: (v) => { Z = Math.round(v); set(); } });
  const an = loop(host, (dt, t) => { if (t - (an.l || 0) > 0.8) { an.l = t; Z = Z >= 20 ? 3 : Z + 1; sl.set(Z); set(); } }, { autoplay: false });
  an.button(ctl);
  const out = readout(host);
  function set() {
    const q = info(Z), nn = ['1', '2', '3', '4'][q.n - 1];
    out.innerHTML = `<b>${SYM[Z - 1]}</b>: valence electron in shell ${nn}. Shielding S = ${q.S.toFixed(2)} (same shell 0.35 each, shell below 0.85 each, deeper shells 1.00 each). Z* = ${Z} − ${q.S.toFixed(2)} = <b>${q.zs.toFixed(2)}</b>. Relative size ∝ n*²/Z* = ${q.r.toFixed(2)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Why ${SYM[Z - 1]} feels a charge of only ${info(Z).zs.toFixed(2)}`, col);
    const q = info(Z), cx = w * 0.28, cy = 100, R0 = 14;
    ctx.beginPath(); ctx.arc(cx, cy, R0 * 0.55, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
    text(ctx, '+' + Z, cx, cy, { color: col.bg, size: 9, weight: 700, align: 'center', fit: false });
    q.sh.forEach((c, i) => {
      if (!c) return;
      const r = 16 + i * 20 + (i ? 4 : 0); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
      for (let k = 0; k < c; k++) {
        const a = (k / c) * 6.283 + i; const val = i === q.n - 1;
        ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 3.3, 0, 7); ctx.fillStyle = val ? col.s[1] : col.s[0]; ctx.fill();
      }
    });
    text(ctx, 'orange = valence, blue = shielding core', 10, 192, { color: col.muted, size: 10 });
    // bars
    const x0 = 34, x1 = w - 12, y0 = h - 28, y1 = 212, bw = (x1 - x0) / 18;
    const zs = Array.from({ length: 18 }, (_, i) => info(i + 3)), zmax = 8.5, rmax = Math.max(...zs.map((o) => o.r));
    text(ctx, 'Z* (bars) and size (line)', x0, y1 - 8, { color: col.muted, size: 10 });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    zs.forEach((o, i) => {
      const x = x0 + i * bw, bh = (o.zs / zmax) * (y0 - y1);
      ctx.fillStyle = i + 3 === Z ? col.s[1] : col.s[0]; ctx.globalAlpha = i + 3 === Z ? 1 : 0.55; ctx.fillRect(x + 1, y0 - bh, bw - 2, bh); ctx.globalAlpha = 1;
      text(ctx, SYM[i + 2], x + bw / 2, y0 + 10, { color: i + 3 === Z ? col.ink : col.muted, size: bw < 18 ? 8 : 9, weight: i + 3 === Z ? 700 : 400, align: 'center', fit: false });
    });
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath();
    zs.forEach((o, i) => { const x = x0 + (i + 0.5) * bw, y = y0 - (o.r / rmax) * (y0 - y1) * 0.95; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    text(ctx, 'size', x1 - 30, y1 + 4, { color: col.s[2], size: 10, weight: 700 });
  };
  set();
}
