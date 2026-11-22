// Class 10 Metals and Non-metals: how metals react with cold water, hot water, steam and dilute acid. The more
// reactive the metal, the faster the hydrogen bubbles form. Order of reactivity seen here: Na > Ca > Mg > Al > Zn > Fe > Cu.
// Copper never reacts with water or dilute acid. Bubble rate is drawn in proportion to how vigorous the reaction is.
import { canvas, text, title, row, choice, readout, loop, rng } from '../../kit.js';

const METALS = ['Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Cu'];
const R = {
  cold: { name: 'Cold water', r: [1, 0.5, 0.03, 0, 0, 0, 0], eq: 'Na, Ca react with cold water: 2Na + 2H₂O → 2NaOH + H₂ (sodium is stored under kerosene and the heat of the reaction may ignite the hydrogen). Calcium bubbles and floats. Mg reacts only very slowly.' },
  hot: { name: 'Hot water', r: [1, 0.6, 0.35, 0, 0, 0, 0], eq: 'Mg + 2H₂O → Mg(OH)₂ + H₂ with hot water. Al, Zn and Fe still do not react with hot water.' },
  steam: { name: 'Steam', r: [1, 0.8, 0.8, 0.5, 0.35, 0.2, 0], eq: 'Metals that do not react with water often react with steam to give the metal oxide and hydrogen: 2Al + 3H₂O → Al₂O₃ + 3H₂; 3Fe + 4H₂O → Fe₃O₄ + 4H₂. Copper does not react even with steam.' },
  acid: { name: 'Dilute HCl', r: [1, 0.9, 0.85, 0.55, 0.4, 0.2, 0], eq: 'Metal + dilute acid → salt + H₂. Mg + 2HCl → MgCl₂ + H₂ is fast; Zn is moderate; Fe is slow; Cu does not react at all. (Na and Ca would be violent: never try it.)' },
};
export default function (host) {
  let k = 'acid', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'Seven test tubes with metals in water, steam or acid, bubbling at different rates' });
  const ctl = row(host);
  choice(ctl, 'Add', Object.entries(R).map(([v, o]) => [v, o.name]), k, (v) => { k = v; say(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { out.innerHTML = R[k].eq; cv.redraw(); }
  const rg = rng(2), sd = Array.from({ length: 7 }, () => Array.from({ length: 8 }, () => [rg(), rg()]));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Metals in ${R[k].name}: bubbles of hydrogen`, col) + 10, tw = w / 7, ty = top + 24, th = h - ty - 50;
    METALS.forEach((mt, i) => {
      const cx = tw * (i + 0.5), x0 = cx - 15, rate = R[k].r[i];
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(x0, ty + th - 10); ctx.quadraticCurveTo(x0, ty + th, cx, ty + th); ctx.quadraticCurveTo(x0 + 30, ty + th, x0 + 30, ty + th - 10); ctx.lineTo(x0 + 30, ty); ctx.stroke();
      ctx.fillStyle = k === 'steam' ? col.soft : col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(x0 + 1, ty + th * 0.3, 28, th * 0.7 - 2); ctx.globalAlpha = 1;
      ctx.fillStyle = mt === 'Cu' ? '#c8773a' : mt === 'Fe' ? '#6d6d70' : mt === 'Zn' ? '#9aa0a8' : '#c8ccd0'; ctx.fillRect(cx - 7, ty + th - 22, 14, 10);
      const n = Math.round(8 * rate);
      for (let j = 0; j < n; j++) { const [a, b] = sd[i][j], y = ((t * (0.15 + rate * 0.7) + b) % 1); dot2(ctx, cx - 9 + a * 18 + Math.sin(t * 3 + j) * 2, ty + th - 24 - y * (th * 0.72), 1.8 + a * 1.8, col); }
      if (mt === 'Na' && k !== 'acid' && (t % 1) < 0.5) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(cx, ty + th * 0.28, 8, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      text(ctx, mt, cx, ty + th + 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
      const lab = rate === 0 ? 'none' : rate < 0.1 ? 'v. slow' : rate < 0.45 ? 'slow' : rate < 0.8 ? 'steady' : 'fast';
      text(ctx, lab, cx, ty + th + 28, { color: rate === 0 ? col.muted : col.s[2], size: 9.5, align: 'center' });
    });
    text(ctx, 'more reactive →  ← less reactive', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
function dot2(ctx, x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = col.bg || '#fff'; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); }
