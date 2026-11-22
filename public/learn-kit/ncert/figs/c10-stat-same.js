// Class 10 Statistics: the three methods for the mean always agree. Choose the assumed mean a and the step h: the
// mean on the number line does not move, but the numbers you have to write (the size of the product column) shrink
// from the direct method to the assumed-mean method to the step-deviation method.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const F = [5, 9, 14, 8, 4], X = [10, 30, 50, 70, 90];

export default function (host) {
  let a = 50, hh = 20;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Three methods for the mean of grouped data giving one answer with different amounts of work' });
  const ctl = row(host);
  choice(ctl, 'Assumed mean a', [[10, '10'], [30, '30'], [50, '50'], [70, '70'], [90, '90']], a, (v) => { a = v; go(); });
  choice(ctl, 'Step h', [[10, '10'], [20, '20']], hh, (v) => { hh = v; go(); });
  const out = readout(host);
  const calc = () => {
    const n = 40, sfx = F.reduce((s, f, i) => s + f * X[i], 0), sfd = F.reduce((s, f, i) => s + f * (X[i] - a), 0), sfu = F.reduce((s, f, i) => s + f * (X[i] - a) / hh, 0);
    const big = [F.reduce((s, f, i) => s + Math.abs(f * X[i]), 0), F.reduce((s, f, i) => s + Math.abs(f * (X[i] - a)), 0), F.reduce((s, f, i) => s + Math.abs(f * (X[i] - a) / hh), 0)];
    return { n, sfx, sfd, sfu, m: [sfx / n, a + sfd / n, a + hh * sfu / n], big };
  };
  function go() {
    const c = calc();
    out.innerHTML = `Direct: ${c.sfx} ÷ 40 = <b>${c.m[0].toFixed(2)}</b>. Assumed mean: ${a} + (${c.sfd}) ÷ 40 = <b>${c.m[1].toFixed(2)}</b>. Step deviation: ${a} + ${hh} × (${c.sfu}) ÷ 40 = <b>${c.m[2].toFixed(2)}</b>. Same mean, smaller numbers.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const c = calc(), top = title(ctx, 'Same data, three methods, one mean', col);
    const L = 18, R = w - 18, X0 = (v) => L + (v / 100) * (R - L), ny = top + 46;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, ny); ctx.lineTo(R, ny); ctx.stroke();
    for (let v = 0; v <= 100; v += 20) { ctx.beginPath(); ctx.moveTo(X0(v), ny - 4); ctx.lineTo(X0(v), ny + 4); ctx.stroke(); text(ctx, String(v), X0(v), ny + 16, { color: col.muted, size: 10, align: 'center' }); }
    c.m.forEach((m, i) => { ctx.fillStyle = col.s[[0, 1, 3][i]]; ctx.beginPath(); ctx.arc(X0(m), ny, 7 - i * 1.6, 0, 7); ctx.fill(); });
    text(ctx, 'x̄ = ' + c.m[0].toFixed(1), X0(c.m[0]), ny - 20, { color: col.ink, size: 12, weight: 700, align: 'center' });
    ctx.strokeStyle = col.s[2]; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X0(a), ny - 8); ctx.lineTo(X0(a), ny + 26); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'a = ' + a, X0(a), ny + 38, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    text(ctx, 'How big are the numbers you add up? (sum of |product column|)', w / 2, ny + 66, { color: col.muted, size: 10.5, align: 'center' });
    const names = ['Direct  f·x', 'Assumed  f·d', 'Step dev  f·u'], by = ny + 84, bh = Math.min(30, (h - by - 14) / 3.4);
    c.big.forEach((v, i) => {
      const y = by + i * (bh + 8), bw = Math.max(3, (v / c.big[0]) * (R - L - 100));
      ctx.fillStyle = col.s[[0, 1, 3][i]]; ctx.globalAlpha = 0.85; ctx.fillRect(L + 96, y, bw, bh); ctx.globalAlpha = 1;
      text(ctx, names[i], L, y + bh / 2, { color: col.ink, size: 11, weight: 600 });
      text(ctx, String(Math.round(v * 10) / 10), L + 96 + bw + 4 > R - 30 ? L + 100 : L + 96 + bw + 4, y + bh / 2, { color: L + 96 + bw + 4 > R - 30 ? col.panel : col.ink, size: 11, weight: 700 });
    });
  };
  go();
}
