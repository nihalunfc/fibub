// Class 12 Evolution: human evolution as brain size. Approximate cranial capacities (cm3): Australopithecus about 450, Homo habilis 650-800 (about 700), Homo erectus about 900,
// Neanderthal about 1400, Homo sapiens about 1350. Slide through the species: the brain roughly tripled in about 3 million years while the face and jaws became smaller and the posture upright.
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

const SP = [
  ['Australopithecus', 3.5, 450, 'Upright walking on two legs (about 3.5 million years ago, East Africa), small brain, projecting face.'],
  ['Homo habilis', 2.0, 700, 'The "handy man": made simple stone tools; brain about 650 to 800 cm³; probably omnivorous.'],
  ['Homo erectus', 1.5, 900, 'Brain about 900 cm³, fully upright, used fire and made better tools; the first to spread out of Africa; probably ate meat.'],
  ['Neanderthal', 0.1, 1400, 'Brain about 1400 cm³, lived in Europe and western Asia, used tools, buried their dead, disappeared about 30,000 years ago.'],
  ['Homo sapiens', 0.3, 1350, 'Modern humans, arose in Africa about 300,000 years ago; brain about 1350 cm³; language, art and culture.'],
];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Cranial capacity of human ancestors against how long ago they lived, with one species highlighted' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Species (oldest to newest)', min: 0, max: SP.length - 1, step: 1, value: k, fmt: (v) => SP[v][0], oninput: (v) => { k = v; go(); } });
  const go = () => { const s = SP[k]; ro.textContent = `${s[0]}: brain about ${s[2]} cm³, lived from about ${s[1]} million years ago. ${s[3]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Brain size through human evolution', col);
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, 1600], xlabel: 'million years ago (older to the left)', ylabel: 'cranial capacity (cm³)', l: 62, t: t0 + 6, b: 40, xt: [0, 1, 2, 3, 4], fx: (v) => String(4 - v), yt: [0, 400, 800, 1200, 1600] });
    const X = (m) => A.X(4 - m);
    const pts = SP.map((s) => [X(s[1]), A.Y(s[2])]);
    line(ctx, [...pts].sort((a, b) => a[0] - b[0]), col.line, 2, [4, 3]);
    line(ctx, [[A.L, A.Y(400)], [A.R, A.Y(400)]], col.muted, 1, [4, 3]); text(ctx, 'chimpanzee brain about 400 (living ape, for comparison)', A.R - 4, A.Y(400) + 12, { color: col.muted, size: 10, align: 'right' });
    SP.forEach((s, i) => { const x = X(s[1]); dot(ctx, x, A.Y(s[2]), i === k ? 8 : 5, i === k ? col.s[3] : col.s[0], col.bg); });
    ctx.save(); A.clip(); ctx.restore();
    const s = SP[k], tx = X(s[1]), al = tx > w * 0.55 ? 'right' : 'left';
    text(ctx, s[0], tx + (al === 'right' ? -11 : 11), A.Y(s[2]) - 12, { color: col.ink, size: 11, weight: 700, align: al });
  };
  go();
}
