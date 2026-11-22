// Partnership accounts three ways. "Share profit": set the profit, each partner's capital, interest on capital rate and
// a salary and see the split (interest and salary come first, the rest goes in the ratio). "New partner": the old
// ratio and the new partner's share give the sacrificing ratio. "Retirement": the gaining ratio when a partner leaves.
import { canvas, row, slider, choice, readout, text, title } from '../kit.js';

const rs = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
const NAMES = ['Asha', 'Bilal', 'Chitra'];
export default function (host) {
  let mode = host.dataset.mode || 'share', profit = 120000, ir = 10, sal = 12000, ratio = [3, 2, 1], newShare = 0.2, sacr = [0.5, 0.3, 0.2];
  const cap = [200000, 150000, 100000];
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 310, label: 'Partnership profit shares' });
  const c0 = row(host); choice(c0, 'Show', [['share', 'Share profit'], ['admit', 'New partner'], ['retire', 'Retirement']], mode, (v) => { mode = v; build(); cv.redraw(); show(); });
  const c = row(host); let cr = null;
  const build = () => { c.innerHTML = '';
    if (mode === 'share') {
      slider(c, { label: 'Profit', min: 20000, max: 300000, step: 5000, value: profit, fmt: rs, oninput: (v) => { profit = v; cv.redraw(); show(); } });
      slider(c, { label: 'Interest on capital', min: 0, max: 15, step: 1, value: ir, fmt: (v) => v + '%', oninput: (v) => { ir = v; cv.redraw(); show(); } });
      slider(c, { label: 'Asha\'s salary', min: 0, max: 30000, step: 1000, value: sal, fmt: rs, oninput: (v) => { sal = v; cv.redraw(); show(); } });
      slider(c, { label: 'Asha\'s part of ratio', min: 1, max: 6, step: 1, value: ratio[0], fmt: (v) => v + ':' + ratio[1] + ':' + ratio[2], oninput: (v) => { ratio[0] = v; cv.redraw(); show(); } });
    } else {
      if (mode === 'admit') slider(c, { label: 'New partner takes', min: 0.1, max: 0.4, step: 0.05, value: newShare, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { newShare = v; cv.redraw(); show(); } });
      if (mode === 'retire') slider(c, { label: 'Chitra (20%) retires; Asha gets', min: 0, max: 1, step: 0.1, value: 0.5, fmt: (v) => Math.round(v * 100) + '% of her share', oninput: (v) => { cr = v; cv.redraw(); show(); } });
    } };
  const out = readout(host);
  const split = () => { const tot = ratio.reduce((a, b) => a + b, 0), int = cap.map((k) => k * ir / 100), s = [sal, 0, 0];
    const rest = profit - int.reduce((a, b) => a + b, 0) - sal; return { int, s, rest, ratioPart: ratio.map((r) => rest * r / tot) }; };
  const admit = () => { const old = [0.5, 0.3, 0.2], take = old.map((o) => o * newShare), nw = old.map((o, i) => o - take[i]); return { old, nw, take }; };
  const ret = () => { const old = [0.5, 0.3, 0.2], a = cr ?? 0.5, gain = [old[2] * a, old[2] * (1 - a)], nw = [old[0] + gain[0], old[1] + gain[1]]; return { old, gain, nw }; };
  const show = () => {
    if (mode === 'share') { const s = split(); out.innerHTML = `Interest on capital ${s.int.map(rs).join(' / ')}; Asha's salary ${rs(sal)}; what is left ${rs(s.rest)} is shared ${ratio.join(':')}. ${s.rest < 0 ? 'The profit is too small: a loss is shared in the ratio, but interest and salary are paid only out of profit.' : 'Totals: ' + NAMES.map((n, i) => n + ' ' + rs(s.int[i] + s.s[i] + s.ratioPart[i])).join(', ') + '.'}`; }
    else if (mode === 'admit') { const a = admit(); out.innerHTML = `Old ratio 5:3:2. The new partner takes ${Math.round(newShare * 100)}%, from each in the old ratio. New shares: ${a.nw.map((v) => Math.round(v * 1000) / 10 + '%').join(', ')}. Sacrifice: ${a.take.map((v) => Math.round(v * 1000) / 10 + '%').join(', ')} (the sacrificing ratio is the old share minus the new share).`; }
    else { const r = ret(); out.innerHTML = `Chitra retires with 20%. Asha gains ${Math.round(r.gain[0] * 1000) / 10}% and Bilal ${Math.round(r.gain[1] * 1000) / 10}%. New ratio ${r.nw.map((v) => Math.round(v * 1000) / 10 + '%').join(' : ')}. Gaining ratio = new share minus old share.`; }
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'share' ? `Splitting a profit of ${rs(profit)}` : mode === 'admit' ? 'A new partner is admitted' : 'A partner retires', col);
    const bar = (y, label, parts, names, colours) => { const L = 10, W = w - 20; text(ctx, label, L, y - 10, { color: col.muted, size: 11, weight: 700 }); let x = L; const tot = parts.reduce((a, b) => a + Math.max(0, b), 0) || 1;
      parts.forEach((v, i) => { const pw = Math.max(0, v) / tot * W; ctx.fillStyle = colours[i]; ctx.globalAlpha = 0.8; ctx.fillRect(x, y, pw, 34); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.strokeRect(x, y, pw, 34); if (pw > 34) text(ctx, names[i], x + pw / 2, y + 17, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); x += pw; }); };
    const cs = [col.s[0], col.s[1], col.s[2], col.s[3]];
    if (mode === 'share') { const s = split(), t = NAMES.map((n, i) => s.int[i] + s.s[i] + s.ratioPart[i]);
      bar(60, 'Interest on capital', s.int, NAMES.map((n, i) => n + ' ' + rs(s.int[i])), cs);
      bar(112, 'Salary (Asha only)', [sal || 0.001], ['Asha ' + rs(sal)], [cs[0]]);
      bar(164, 'Rest, in the ratio ' + ratio.join(':'), s.ratioPart.map((v) => Math.max(0, v)), NAMES.map((n, i) => n + ' ' + rs(s.ratioPart[i])), cs);
      bar(222, 'Each partner\'s total', t.map((v) => Math.max(0, v)), NAMES.map((n, i) => n + ' ' + rs(t[i])), cs); }
    else if (mode === 'admit') { const a = admit(); bar(70, 'Old ratio', a.old, NAMES.map((n, i) => n + ' ' + [50, 30, 20][i] + '%'), cs);
      bar(135, 'Given up to the new partner (sacrifice)', [...a.take, newShare], [...NAMES.map((n, i) => n[0] + ' ' + Math.round(a.take[i] * 1000) / 10 + '%'), 'New'], [cs[0], cs[1], cs[2], col.s[4]]);
      bar(200, 'New ratio', [...a.nw, newShare], [...NAMES.map((n, i) => n[0] + ' ' + Math.round(a.nw[i] * 1000) / 10 + '%'), 'New ' + Math.round(newShare * 100) + '%'], [cs[0], cs[1], cs[2], col.s[4]]); }
    else { const r = ret(); bar(70, 'Old ratio', r.old, NAMES.map((n, i) => n + ' ' + [50, 30, 20][i] + '%'), cs);
      bar(135, 'Chitra\'s 20% goes to', [r.gain[0], r.gain[1]], ['Asha +' + Math.round(r.gain[0] * 1000) / 10 + '%', 'Bilal +' + Math.round(r.gain[1] * 1000) / 10 + '%'], [cs[0], cs[1]]);
      bar(200, 'New ratio (two partners)', r.nw, ['Asha ' + Math.round(r.nw[0] * 1000) / 10 + '%', 'Bilal ' + Math.round(r.nw[1] * 1000) / 10 + '%'], [cs[0], cs[1]]); }
  };
  build(); show();
}
