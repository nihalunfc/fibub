// Class 10 Heredity: Mendel's dihybrid cross. Two traits are followed together: seed shape (round R is dominant to wrinkled r)
// and seed colour (yellow Y is dominant to green y). The F1 plants (RrYy) make four kinds of gametes RY, Ry, rY, ry in equal numbers
// because the two traits are inherited independently. Selfing gives 16 equally likely boxes and the ratio 9 : 3 : 3 : 1.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const G = ['RY', 'Ry', 'rY', 'ry'];
export default function (host) {
  let k = 16;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 310, label: 'A 4 by 4 Punnett square for a dihybrid cross of round yellow and wrinkled green peas' });
  const ctl = row(host);
  slider(ctl, { label: 'Boxes filled', min: 0, max: 16, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = Math.round(v); say(); } });
  const out = readout(host);
  const kind = (g) => (g.includes('R') ? 'round' : 'wrinkled') + ' ' + (g.includes('Y') ? 'yellow' : 'green');
  const cells = () => G.flatMap((a) => G.map((b) => { const gt = [0, 1].map((i) => [a[i], b[i]].sort((x, y) => (x < y ? -1 : 1)).join('')); return gt[0] + gt[1]; }));
  function say() { const c = cells().slice(0, k), n = (s) => c.filter((g) => kind(g) === s).length; out.textContent = `Round yellow ${n('round yellow')} : round green ${n('round green')} : wrinkled yellow ${n('wrinkled yellow')} : wrinkled green ${n('wrinkled green')}. With all 16 boxes: 9 : 3 : 3 : 1. New combinations (round green and wrinkled yellow) appear that neither parent had.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'RrYy × RrYy', col) + 10, cs = Math.min(64, (w - 50) / 4), gx = (w - 4 * cs) / 2 + 18, gy = top + 34;
    G.forEach((g, i) => { text(ctx, g, gx + cs * i + cs / 2, gy - 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, g, gx - 18, gy + cs * i + cs / 2, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    cells().forEach((g, i) => { const r = Math.floor(i / 4), c = i % 4, x = gx + c * cs, y = gy + r * cs; ctx.strokeStyle = col.line; ctx.lineWidth = 1.2; ctx.strokeRect(x, y, cs, cs); if (i >= k) return; const yel = g.includes('Y'), rnd = g.includes('R'); ctx.save(); ctx.globalAlpha = 0.32; ctx.fillStyle = yel ? col.s[3] : col.s[2]; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2); ctx.restore(); const cx = x + cs / 2, cy = y + cs * 0.4;
      ctx.beginPath(); if (rnd) ctx.arc(cx, cy, cs * 0.2, 0, 7); else { for (let a = 0; a < 12; a++) { const rr = cs * (a % 2 ? 0.14 : 0.21), an = a / 12 * 6.283; ctx.lineTo(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr); } ctx.closePath(); } ctx.fillStyle = yel ? col.s[3] : col.s[2]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.stroke();
      text(ctx, g, cx, y + cs * 0.82, { color: col.ink, size: Math.min(10.5, cs / 6), align: 'center' }); });
    const ly = gy + 4 * cs + 18; [['round yellow', col.s[3], 1], ['round green', col.s[2], 1], ['wrinkled yellow', col.s[3], 0], ['wrinkled green', col.s[2], 0]].forEach(([l, c, rnd], i) => { const x = 14 + (i % 2) * (w / 2), y = ly + Math.floor(i / 2) * 16; ctx.beginPath(); if (rnd) ctx.arc(x + 5, y, 5, 0, 7); else ctx.rect(x, y - 5, 10, 10); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); text(ctx, l, x + 16, y, { color: col.ink, size: 10.5 }); });
  };
  say();
}
