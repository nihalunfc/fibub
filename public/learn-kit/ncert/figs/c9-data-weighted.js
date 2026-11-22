// Class 9 Data: combining two groups. The combined mean is NOT the simple average of the two means unless the groups are the same size:
// (nA*mA + nB*mB) / (nA + nB). Each mean counts in proportion to how many students stand behind it, like weights on a see-saw.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let nA = 20, mA = 40, nB = 40, mB = 70;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Two groups of different sizes and averages on a see-saw, with their combined average' });
  const c = row(host);
  slider(c, { label: 'Class A: students', min: 5, max: 60, step: 1, value: nA, oninput: (v) => { nA = v; upd(); } });
  slider(c, { label: 'Class A average', min: 30, max: 90, step: 1, value: mA, oninput: (v) => { mA = v; upd(); } });
  slider(c, { label: 'Class B: students', min: 5, max: 60, step: 1, value: nB, oninput: (v) => { nB = v; upd(); } });
  slider(c, { label: 'Class B average', min: 30, max: 90, step: 1, value: mB, oninput: (v) => { mB = v; upd(); } });
  const out = readout(host), comb = () => (nA * mA + nB * mB) / (nA + nB);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Combined average of two classes', col), L = 26, R = w - 26, X = (v) => L + ((v - 30) / 60) * (R - L), by = t + (h - t) * 0.58, cm = comb(), simple = (mA + mB) / 2;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(L - 6, by); ctx.lineTo(R + 6, by); ctx.stroke(); ctx.restore();
    for (let v = 30; v <= 90; v += 10) text(ctx, String(v), X(v), by + 12, { color: col.muted, size: 10.5, align: 'center' });
    const ball = (x, n, c, lab) => { const r = 6 + Math.sqrt(n) * 2.1; ctx.save(); ctx.fillStyle = c; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(x, by - r - 2, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); text(ctx, lab, x, by - r - 2, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); };
    ball(X(mA), nA, col.s[0], 'A: ' + nA); ball(X(mB), nB, col.s[3], 'B: ' + nB);
    ctx.save(); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(X(cm), by + 3); ctx.lineTo(X(cm) - 10, by + 30); ctx.lineTo(X(cm) + 10, by + 30); ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'combined ' + cm.toFixed(1), X(cm), by + 44, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    ctx.save(); ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(simple), by - 12); ctx.lineTo(X(simple), by + 10); ctx.stroke(); ctx.restore();
    text(ctx, 'simple average ' + simple, X(simple), t + 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  function upd() { const cm = comb(); out.innerHTML = `Total marks: ${nA} × ${mA} + ${nB} × ${mB} = ${nA * mA + nB * mB}. Students: ${nA + nB}. Combined mean = ${nA * mA + nB * mB} ÷ ${nA + nB} = <b>${cm.toFixed(2)}</b>. The simple average of the two means is ${(mA + mB) / 2}: ` + (nA === nB ? 'the same, because the classes are equal in size.' : 'different, because the bigger class counts for more.'); cv.redraw(); }
  upd();
}
