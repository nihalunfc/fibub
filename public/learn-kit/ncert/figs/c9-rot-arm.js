// Class 9 Rotation: a rotating arm. The angle is how much the arm has turned from the starting line (the 3 o'clock
// direction), measured anticlockwise. A full turn is 360 degrees, so a fraction of a turn is that fraction of 360.
import { canvas, text, title, row, slider, button, readout, loop, arrow, dot } from '../../kit.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default function (host) {
  let a = 45;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'A rotating arm with the angle in degrees and as a fraction of a full turn' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle', min: 0, max: 720, step: 1, value: a, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = v; sync(); } });
  const anim = loop(host, (dt) => { a = (a + 36 * dt) % 720; sl.set(a); sync(); }, { autoplay: false });
  anim.button(ctl);
  const c2 = row(host);
  [['¼ turn', 90], ['½ turn', 180], ['¾ turn', 270], ['1 turn', 360], ['2 turns', 720]].forEach(([l, v]) => button(c2, l, () => { anim.pause(); a = v; sl.set(v); sync(); }));
  const out = readout(host);
  function sync() {
    const n = Math.round(a), g = gcd(n, 360), full = Math.floor(n / 360), rem = n - full * 360;
    const frac = n === 0 ? '0' : n % 360 === 0 ? `${n / 360}` : `${n / g}/${360 / g}`;
    out.innerHTML = `The arm has turned <b>${n}°</b> = <b>${frac}</b> of a turn` + (full >= 1 && rem ? ` (${full} full turn${full > 1 ? 's' : ''} and ${rem}° more)` : '') + `. Check: ${n} ÷ 360 = ${(n / 360).toFixed(3)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle = how far the arm has turned', col), cx = w / 2, cy = top + (h - top) / 2 - 4, R = Math.min(w / 2 - 26, (h - top) / 2 - 24);
    const th = (a * Math.PI) / 180, part = a % 360 || (a > 0 ? 360 : 0);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 0.8, 0, -(part * Math.PI) / 180, true); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let d = 0; d < 360; d += 30) {
      const r = (d * Math.PI) / 180, big = d % 90 === 0;
      ctx.strokeStyle = big ? col.ink : col.muted; ctx.lineWidth = big ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(r) * (R - (big ? 9 : 5)), cy - Math.sin(r) * (R - (big ? 9 : 5))); ctx.lineTo(cx + Math.cos(r) * R, cy - Math.sin(r) * R); ctx.stroke();
      if (big) text(ctx, d + '°', cx + Math.cos(r) * (R + 14), cy - Math.sin(r) * (R + 14), { color: col.muted, size: 10, align: 'center' });
    }
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R, cy); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, 0, -(part * Math.PI) / 180, true); ctx.stroke();
    arrow(ctx, cx, cy, cx + Math.cos(th) * R, cy - Math.sin(th) * R, col.s[2], 4, 10);
    dot(ctx, cx, cy, 5, col.ink);
    text(ctx, Math.round(a) + '°', cx, cy + R * 0.42, { color: col.s[0], size: 15, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'start line', cx + R * 0.5, cy + 12, { color: col.muted, size: 10, align: 'center' });
  };
  sync();
}
