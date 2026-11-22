// Class 10 Metals and Non-metals: metal oxides are basic (they react with acids), non-metal oxides are acidic (they react
// with bases), and a few oxides such as Al2O3 and ZnO are amphoteric: they react with BOTH an acid and a base. Some, like
// CO, are neutral. Two test tubes show whether the solid oxide dissolves (reacts) in dilute HCl and in NaOH solution.
import { canvas, text, title, row, choice, readout, loop, clamp } from '../../kit.js';

const O = {
  na2o: ['Na₂O', 'basic', 'Na₂O + 2HCl → 2NaCl + H₂O', '#e8e8e0'], mgo: ['MgO', 'basic', 'MgO + 2HCl → MgCl₂ + H₂O', '#f2f2f2'],
  al2o3: ['Al₂O₃', 'amphoteric', 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O and Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O', '#f4f4f0'], zno: ['ZnO', 'amphoteric', 'ZnO + 2HCl → ZnCl₂ + H₂O and ZnO + 2NaOH → Na₂ZnO₂ + H₂O', '#f2eed8'],
  co2: ['CO₂', 'acidic', '2NaOH + CO₂ → Na₂CO₃ + H₂O', '#dfe8f2'], so2: ['SO₂', 'acidic', '2NaOH + SO₂ → Na₂SO₃ + H₂O', '#e8f0e0'], co: ['CO', 'neutral', 'CO does not react with acid or base', '#d0d0d4'],
};
export default function (host) {
  let k = 'al2o3', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'An oxide tested with dilute acid and with sodium hydroxide solution' });
  const ctl = row(host);
  choice(ctl, 'Oxide', Object.entries(O).map(([v, o]) => [v, o[0]]), k, (v) => { k = v; t = 0; say(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  const rA = () => ['basic', 'amphoteric'].includes(O[k][1]), rB = () => ['acidic', 'amphoteric'].includes(O[k][1]);
  function say() {
    out.innerHTML = `<b>${O[k][0]} is ${O[k][1]}.</b> ${O[k][1] === 'amphoteric' ? 'It reacts with <b>both</b> acid and base. ' : ''}${O[k][2]}.${O[k][1] === 'basic' ? ' Metal oxides are usually basic; those of Na and K also dissolve in water to give alkalis.' : O[k][1] === 'acidic' ? ' Non-metal oxides are acidic: dissolved in water they make acids (CO₂ + H₂O → H₂CO₃).' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${O[k][0]}: ${O[k][1]}`, col) + 10, c = clamp((t % 8) / 5, 0, 1);
    [[w * 0.27, 'dilute HCl (acid)', rA(), col.s[1]], [w * 0.73, 'NaOH (base)', rB(), col.s[0]]].forEach(([cx, lab, reacts, cc]) => {
      const bw = Math.min(110, w * 0.3), bx = cx - bw / 2, by = top + 30, bh = h - by - 60;
      ctx.fillStyle = cc; ctx.globalAlpha = 0.2; ctx.fillRect(bx, by + bh * 0.25, bw, bh * 0.75); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
      const amount = reacts ? 1 - c : 1, pw = bw * 0.55 * amount + 2;
      if (amount > 0.02) { ctx.fillStyle = O[k][3]; ctx.fillRect(cx - pw / 2, by + bh - 6 - 22 * amount, pw, 6 + 22 * amount); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(cx - pw / 2, by + bh - 6 - 22 * amount, pw, 6 + 22 * amount); }
      text(ctx, 'oxide', cx, by + bh - 34 - 22 * amount, { color: col.muted, size: 9.5, align: 'center' });
      text(ctx, lab, cx, by + bh + 13, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      text(ctx, reacts ? (c > 0.95 ? 'dissolved: reacted' : 'reacting...') : 'no reaction', cx, by + bh + 28, { color: reacts ? col.s[2] : col.bad, size: 11, weight: 700, align: 'center' });
    });
    text(ctx, 'basic: acid only   amphoteric: both   acidic: base only', w / 2, h - 8, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
