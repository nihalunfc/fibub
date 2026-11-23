// Class 12 Maths, Probability: the law of total probability and Bayes' theorem. Three machines E1, E2, E3 make all the items (the partition); A = "the item is defective".
// P(A) = sum of P(Ei) P(A | Ei) (the joint bars add up); then Bayes: P(Ei | A) = P(Ei) P(A | Ei) / P(A), the share of each bar in the total. Slide the shares and defect rates.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  const w3 = [5, 3, 2], d3 = [2, 3, 5];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Three machines with their share of output and defect rates, the total probability of a defect, and the Bayes posterior shares' });
  const ctl = row(host), ro = readout(host);
  ['E1', 'E2', 'E3'].forEach((n, i) => slider(ctl, { label: `share of output, machine ${n}`, min: 1, max: 10, step: 1, value: w3[i], fmt: (v) => String(v), oninput: (v) => { w3[i] = v; go(); } }));
  ['E1', 'E2', 'E3'].forEach((n, i) => slider(ctl, { label: `% defective, machine ${n}`, min: 0, max: 10, step: 0.5, value: d3[i], fmt: (v) => v + '%', oninput: (v) => { d3[i] = v; go(); } }));
  const calc = () => { const S = w3.reduce((a, b) => a + b, 0), pr = w3.map((v) => v / S), lk = d3.map((v) => v / 100), joint = pr.map((p, i) => p * lk[i]), PA = joint.reduce((a, b) => a + b, 0); return { pr, lk, joint, PA, post: joint.map((j) => (PA ? j / PA : 0)) }; };
  const go = () => {
    const c = calc(), f = (v) => v.toFixed(4);
    ro.textContent = `P(A) = ${c.pr.map((p, i) => `${p.toFixed(2)}×${c.lk[i].toFixed(3)}`).join(' + ')} = ${f(c.PA)}.  Given that an item is defective, the machines are responsible with probability ${c.post.map((p) => p.toFixed(3)).join(', ')} (these add to 1).`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const c = calc(), top = title(ctx, 'Total probability and Bayes', col) + 6, bx = 14, bw = w - 28, nm = ['E1', 'E2', 'E3'];
    text(ctx, 'Share of all items made by each machine, P(Ei)', bx, top + 4, { color: col.muted, size: 11 });
    let x = bx; c.pr.forEach((p, i) => { const ww = bw * p; ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.8; ctx.fillRect(x, top + 14, ww, 24); ctx.globalAlpha = 1; text(ctx, `${nm[i]} ${(p * 100).toFixed(0)}%`, x + ww / 2, top + 26, { color: col.panel, size: 11, weight: 700, align: 'center' }); x += ww; });
    const y2 = top + 72; text(ctx, 'Defective items: P(Ei)·P(A | Ei) (area); the total is P(A)', bx, y2 - 10, { color: col.muted, size: 11 });
    const mx = Math.max(...c.joint, 1e-9), hh = 70; x = bx;
    c.pr.forEach((p, i) => { const ww = bw * p, hgt = hh * c.lk[i] / Math.max(...c.lk, 1e-9); ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.25; ctx.fillRect(x, y2, ww, hh); ctx.globalAlpha = 0.9; ctx.fillRect(x, y2 + hh - hgt, ww, hgt); ctx.globalAlpha = 1; x += ww; });
    void mx;
    const y3 = y2 + hh + 38; text(ctx, `P(A) = ${c.PA.toFixed(4)}  →  who made a defective one? P(Ei | A)`, bx, y3 - 10, { color: col.muted, size: 11 });
    x = bx; c.post.forEach((p, i) => { const ww = bw * p; ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.85; ctx.fillRect(x, y3, ww, 26); ctx.globalAlpha = 1; if (ww > 40) text(ctx, `${nm[i]} ${(p * 100).toFixed(0)}%`, x + ww / 2, y3 + 13, { color: col.panel, size: 11, weight: 700, align: 'center' }); x += ww; });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, top + 14, bw, 24); ctx.strokeRect(bx, y3, bw, 26);
    line(ctx, [[bx, y2 + hh], [bx + bw, y2 + hh]], col.muted, 1);
    text(ctx, 'Tall bars = more defects per item (dark part); wide = more items.', bx, y3 + 46, { color: col.muted, size: 10.5 });
  };
  go();
}
