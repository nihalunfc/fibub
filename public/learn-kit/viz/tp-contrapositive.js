// Conditional logic machine. Pick an "if P then Q" statement and tell the machine one fact. The picture shows where the thing
// could be (P sits inside Q), and the answer says what must follow. Only two facts give an answer: P is true (so Q is) and
// Q is false (so P is false: the contrapositive). The other two forms, the converse and the inverse, do not follow.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const ST = [
  ['it rains', 'the ground is wet'], ['you live in Kerala', 'you live in India'], ['a number is divisible by 6', 'the number is even'], ['the student scores 90%', 'the student passes'],
];
const FACTS = [['p', 'P is true'], ['np', 'P is false'], ['q', 'Q is true'], ['nq', 'Q is false']];
export default function (host) {
  let s = 1, f = 'p';
  const cv = canvas(host, { aspect: 1.15, max: 470, min: 400, label: 'P drawn inside Q with the region left open by a fact' });
  const c = row(host); choice(c, 'Statement', ['Rain', 'Kerala', 'Divisible by 6', 'Scores 90%'].map((x, i) => [i, x]), s, (v) => { s = v; cv.redraw(); show(); });
  const c2 = row(host); choice(c2, 'We learn', FACTS, f, (v) => { f = v; cv.redraw(); show(); });
  const out = readout(host);
  const P = () => ST[s][0], Q = () => ST[s][1];
  const ans = () => ({ p: [true, `Q is true: ${Q()}. (Modus ponens: P is sufficient for Q.)`], nq: [true, `P is false: not "${P()}". (The contrapositive: if not Q then not P.)`], np: [false, `Nothing follows. Not P leaves Q open (this is the inverse mistake).`], q: [false, `Nothing follows. Q true leaves P open (this is the converse mistake).`] })[f];
  const show = () => { const a = ans(); out.innerHTML = `Rule: <b>If ${P()}, then ${Q()}.</b> Fact: ${FACTS.find((x) => x[0] === f)[1]}. <b>${a[0] ? 'Follows' : 'No conclusion'}:</b> ${a[1]}`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Where could we be?', col);
    const cx = w / 2, cy = h * 0.42, R = Math.min(w * 0.36, h * 0.3), r = R * 0.5, ax = cx - R * 0.2, ay = cy + R * 0.15;
    const regions = { p: 'A', np: 'notA', q: 'B', nq: 'notB' }[f];
    ctx.save(); ctx.beginPath();
    const big = () => ctx.arc(cx, cy, R, 0, 7), small = () => { ctx.moveTo(ax + r, ay); ctx.arc(ax, ay, r, 0, 7); }, frame = () => ctx.rect(4, 30, w - 8, cy + R + 14 - 30);
    if (regions === 'A') { small(); } else if (regions === 'B') { big(); } else if (regions === 'notA') { big(); small(); } else { frame(); ctx.moveTo(cx + R, cy); ctx.arc(cx, cy, R, 0, 7); }
    ctx.clip('evenodd'); ctx.fillStyle = col.good; ctx.globalAlpha = 0.35; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.lineWidth = 2; ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(ax, ay, r, 0, 7); ctx.stroke();
    text(ctx, 'P', ax, ay, { color: col.s[0], size: 14, weight: 800, align: 'center' }); text(ctx, 'Q only', cx + R * 0.45, cy - R * 0.2, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'neither', 30, cy + R, { color: col.muted, size: 10.5 });
    text(ctx, 'green = where we could be', 10, cy + R + 28, { color: col.good, size: 11, weight: 700 });
    const forms = [['If P then Q', true], ['If Q then P (converse)', false], ['If not P then not Q (inverse)', false], ['If not Q then not P (contrapositive)', true]], y0 = cy + R + 44;
    forms.forEach(([t, ok], i) => text(ctx, `${ok ? '✓ follows' : '✗ does not follow'}: ${t}`, 10, y0 + i * 16, { color: ok ? col.good : col.bad, size: 11, weight: 600 }));
  };
  show();
}
