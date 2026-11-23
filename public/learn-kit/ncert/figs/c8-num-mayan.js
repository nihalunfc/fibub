// Class 8 A Story of Numbers: Mayan numbers are written in base 20, top to bottom. A dot is 1, a bar is 5 and a shell is 0.
// Slide the number from 0 to 399: the lower level counts ones (0 to 19), the upper level counts twenties.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 87;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'A Mayan numeral with a twenties level and a ones level made of dots and bars' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Number', min: 0, max: 399, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); sync(); } });
  function sync() { const a = Math.floor(n / 20), b = n % 20; out.innerHTML = `<b>${n}</b> = ${a} × 20 + ${b}. Upper level shows ${a}, lower level shows ${b}. (Base 20, written downwards.)`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mayan numbers (base 20)', col), a = Math.floor(n / 20), b = n % 20, cx = w / 2, lvH = (h - top - 30) / 2;
    const glyph = (v, y, c) => {
      if (v === 0) { ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(cx, y, 28, 13, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 14, y); ctx.lineTo(cx + 14, y); ctx.stroke(); return; }
      const bars = Math.floor(v / 5), dots = v % 5; let yy = y + (bars * 14 + (dots ? 18 : 0)) / 2 - 7;
      for (let i = 0; i < bars; i++) { ctx.fillStyle = c; ctx.fillRect(cx - 44, yy - 6, 88, 11); yy -= 14; }
      if (dots) { yy = y - (bars * 14 + 18) / 2 + 2; for (let i = 0; i < dots; i++) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx - (dots - 1) * 14 + i * 28, yy - (bars * 0) + 0, 7, 0, 7); ctx.fill(); } }
    };
    const y1 = top + lvH * 0.5 + 4, y2 = top + lvH * 1.5 + 8;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(14, top + lvH + 6); ctx.lineTo(w - 14, top + lvH + 6); ctx.stroke();
    text(ctx, '× 20', 14, y1, { color: col.muted, size: 11 }); text(ctx, '× 1', 14, y2, { color: col.muted, size: 11 });
    text(ctx, String(a), w - 14, y1, { color: col.muted, size: 12, align: 'right' }); text(ctx, String(b), w - 14, y2, { color: col.muted, size: 12, align: 'right' });
    if (a > 0) glyph(a, y1, col.s[0]); else text(ctx, '(empty: no twenties)', cx, y1, { color: col.muted, size: 11, align: 'center' });
    glyph(b, y2, col.s[3]);
  };
  sync();
}
