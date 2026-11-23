// Class 8 Power Play: powers of 10 from the size of a proton to the size of the universe. Slide the exponent (or press play)
// and see which real thing is about 10^k metres across. Each step to the right is ten times bigger.
import { canvas, text, title, row, slider, loop, readout } from '../../kit.js';

const T = [[-15, 'a proton'], [-10, 'an atom'], [-8, 'a virus'], [-5, 'a skin cell'], [-4, 'a hair’s width'], [-2, 'an ant'], [0, 'a cricket bat'], [2, 'a cricket ground'], [4, 'Mount Everest'], [7, 'the Earth'], [9, 'the Sun'], [11, 'Earth to Sun'], [16, 'one light-year'], [21, 'the Milky Way'], [26, 'the visible universe']];
export default function (host) {
  let k = -15;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A scale of powers of ten from a proton to the universe' });
  const out = readout(host); const ctl = row(host);
  const sl = slider(ctl, { label: 'Exponent k', min: -15, max: 26, step: 1, value: k, fmt: (v) => Math.round(v), oninput: (v) => { k = Math.round(v); anim.pause(); sync(); } });
  const anim = loop(host, (dt) => { k += dt * 3; if (k > 26) k = -15; sl.set(Math.round(k)); sync(); }, { autoplay: false });
  anim.button(ctl);
  const near = () => { let b = T[0]; T.forEach((t) => { if (Math.abs(t[0] - k) < Math.abs(b[0] - k)) b = t; }); return b; };
  function sync() { const r = Math.round(k), t = near(); out.innerHTML = `10<sup>${r}</sup> m = ${r >= 0 && r < 7 ? (10 ** r).toLocaleString('en-IN') + ' m' : r < 0 && r > -5 ? (10 ** r).toFixed(-r) + ' m' : '1 followed by ' + Math.abs(r) + ' zeros' + (r < 0 ? ' after the point' : '')}. Closest thing: <b>${t[1]}</b> (10<sup>${t[0]}</sup> m).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Powers of 10: size in metres', col), x0 = 14, x1 = w - 14, y = top + 70, X = (e) => x0 + ((e + 15) / 41) * (x1 - x0), r = Math.round(k);
    ctx.strokeStyle = col.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    for (let e = -15; e <= 26; e++) { ctx.fillStyle = e === 0 ? col.s[0] : col.muted; ctx.fillRect(X(e) - 0.5, y - (e % 5 === 0 ? 8 : 4), 1, e % 5 === 0 ? 16 : 8); if (e % 5 === 0) text(ctx, '10^' + e, X(e), y + 22, { color: col.muted, size: 9.5, align: 'center' }); }
    T.forEach((t, i) => { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(X(t[0]), y, 3.5, 0, 7); ctx.fill(); });
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(X(r), y, 8, 0, 7); ctx.fill();
    const t = near(), rad = 10 + 34 * ((r + 15) / 41);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(w / 2, y + 95 + 20, rad * 1.0, 0, 7); ctx.stroke();
    text(ctx, t[1], w / 2, y + 95 + 20, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, Math.abs(t[0] - r) === 0 ? 'exactly about this size' : 'nearest known size', w / 2, y + 150, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'smaller', x0, top + 14, { color: col.muted, size: 10.5 }); text(ctx, 'bigger', x1, top + 14, { color: col.muted, size: 10.5, align: 'right' });
  };
  sync();
}
