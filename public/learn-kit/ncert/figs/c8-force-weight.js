// Class 8 Forces: mass and weight. Mass (kg) is the amount of matter and never changes. Weight is the gravitational
// pull, W = m x g, so it changes with the place. g (m/s^2): Earth 9.8, Moon 1.6, Mars 3.7, Jupiter 24.8 (NASA planetary
// fact sheets, rounded). A spring scale shows the weight; the mass label stays the same.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

const P = { earth: ['Earth', 9.8], moon: ['Moon', 1.6], mars: ['Mars', 3.7], jup: ['Jupiter', 24.8] };
export default function (host) {
  let m = 50, pl = 'earth';
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'A spring scale showing weight on Earth, Moon, Mars or Jupiter for the same mass' });
  const ctl = row(host);
  choice(ctl, 'Place', [['earth', 'Earth'], ['moon', 'Moon'], ['mars', 'Mars'], ['jup', 'Jupiter']], pl, (v) => { pl = v; upd(); });
  slider(ctl, { label: 'Mass', min: 10, max: 80, step: 5, value: m, fmt: (z) => `${z} kg`, oninput: (z) => { m = z; upd(); } });
  const out = readout(host);
  function upd() { const g = P[pl][1]; out.innerHTML = `Weight = mass × g = ${m} × ${g} = <b>${(m * g).toFixed(0)} N</b> on ${P[pl][0]}. The mass is still <b>${m} kg</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Same child, different place: ${P[pl][0]}`, col);
    const g = P[pl][1], W = m * g, sx = w * 0.3, top = 46, maxExt = h * 0.42, ext = Math.min(1, W / 2000) * maxExt + 8;
    line(ctx, [[sx - 30, top], [sx + 30, top]], col.ink, 4);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, top);
    const n = 12, y1 = top + 24 + ext; for (let i = 1; i <= n; i++) ctx.lineTo(sx + (i % 2 ? 10 : -10), top + (y1 - top) * i / n); ctx.lineTo(sx, y1); ctx.stroke();
    ctx.fillStyle = col.s[0]; const bw = 34 + m * 0.4; ctx.fillRect(sx - bw / 2, y1, bw, 26 + m * 0.3);
    text(ctx, `${m} kg`, sx, y1 + 13 + m * 0.15, { color: '#fff', size: 11, weight: 700, align: 'center' });
    arrow(ctx, sx + bw / 2 + 12, y1 + 10, sx + bw / 2 + 12, y1 + 10 + Math.min(70, 8 + W / 25), col.s[3], 4, 9);
    const bx = w * 0.58, bw2 = w * 0.36;
    text(ctx, 'Weight (N)', bx, 60, { color: col.ink, size: 11, weight: 700 });
    text(ctx, 'Mass (kg)', bx, 130, { color: col.ink, size: 11, weight: 700 });
    ctx.fillStyle = col.soft; ctx.fillRect(bx, 72, bw2, 18); ctx.fillRect(bx, 142, bw2, 18);
    ctx.fillStyle = col.s[3]; ctx.fillRect(bx, 72, Math.min(bw2, bw2 * W / 2000), 18);
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, 142, bw2 * m / 80, 18);
    text(ctx, `${W.toFixed(0)} N`, bx, 102, { color: col.s[3], size: 12, weight: 700 }); text(ctx, `${m} kg`, bx, 172, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, `g = ${g} m/s²`, bx, h - 40, { color: col.muted, size: 11 });
  };
  upd();
}
