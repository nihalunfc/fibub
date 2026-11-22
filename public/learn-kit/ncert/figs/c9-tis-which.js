// Class 9 Tissues: "which tissue am I?" A clue describes the structure or job of a tissue; choose the tissue. 16 clues
// cover plant and animal tissues. It checks the answer, shows why, and keeps a score. Clues are shuffled by a seeded
// random generator that changes each press of Next.
import { canvas, text, title, row, button, readout, rng } from '../../kit.js';

const Q = [
  ['I am dead, hollow and carry water up a plant.', 'Xylem', 'Xylem vessels are dead tubes with lignin rings that carry water and minerals upward.'],
  ['I carry sugar made in the leaves to the roots and fruits.', 'Phloem', 'Phloem sieve tubes are living and move food both up and down.'],
  ['My cells divide all the time at the root tip.', 'Meristem', 'Meristematic cells are small with big nuclei and keep dividing.'],
  ['My walls are thick at the corners; I let a leaf stalk bend without snapping.', 'Collenchyma', 'Collenchyma is flexible support with corner thickening.'],
  ['I am the hard shell of a coconut, made of dead fibres with lignin.', 'Sclerenchyma', 'Sclerenchyma gives rigid strength.'],
  ['I am thin-walled, store food and, in leaves, do photosynthesis.', 'Parenchyma', 'Parenchyma is the packing and storage tissue of a plant.'],
  ['I am tightly packed flat cells covered with wax on a leaf.', 'Epidermis', 'The epidermis protects the plant and has stomata.'],
  ['I am one flat layer lining the air sacs of the lungs.', 'Squamous epithelium', 'Thin flat cells let gases cross quickly.'],
  ['I have hair-like cilia and sweep mucus out of the windpipe.', 'Ciliated epithelium', 'Ciliated columnar cells clear dust and germs.'],
  ['I join muscle to bone with very strong fibres.', 'Tendon', 'Tendons are dense connective tissue.'],
  ['I carry oxygen with haemoglobin and have no nucleus in my cells.', 'Blood', 'Red blood cells in the plasma carry oxygen.'],
  ['My cells are full of fat and I keep the body warm.', 'Adipose tissue', 'Adipose tissue stores energy and insulates.'],
  ['I am long, striped and voluntary: I move your arm.', 'Skeletal muscle', 'Skeletal muscle is striated, multinucleate and voluntary.'],
  ['I have spindle-shaped cells, no stripes, and move food along the gut.', 'Smooth muscle', 'Smooth muscle is involuntary and slow.'],
  ['I am branched and striped, and never tire in the heart.', 'Cardiac muscle', 'Cardiac cells are joined by intercalated discs.'],
  ['I carry impulses to the muscle that pulls your hand from a hot pan.', 'Nervous tissue', 'Neurons carry electrical impulses.'],
];
const ALL = [...new Set(Q.map((q) => q[1]))];
export default function (host) {
  let R = rng(21), cur = 0, picked = null, score = 0, tries = 0, opts = [];
  const cv = canvas(host, { aspect: 0.4, max: 440, min: 300, label: 'A clue about a tissue with answer buttons' });
  const ctl = row(host);
  const out = readout(host);
  const draw = () => cv.redraw();
  function next() { cur = Math.floor(R() * Q.length); picked = null; const wrong = ALL.filter((x) => x !== Q[cur][1]).sort(() => R() - 0.5).slice(0, 3); opts = [...wrong, Q[cur][1]].sort(() => R() - 0.5); ctl.innerHTML = ''; opts.forEach((o) => button(ctl, o, () => pick(o))); out.innerHTML = 'Choose the tissue.'; draw(); }
  function pick(o) { if (picked) return; picked = o; tries++; if (o === Q[cur][1]) score++; out.innerHTML = (o === Q[cur][1] ? '<b>Correct.</b> ' : '<b>Not quite:</b> it is ' + Q[cur][1] + '. ') + Q[cur][2] + ` Score: ${score} of ${tries}.`; const nb = button(ctl, 'Next clue', next); nb.focus(); draw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Which tissue am I?', col);
    const L = []; let c = ''; ctx.font = '13px system-ui'; Q[cur][0].split(' ').forEach((wd) => { if (ctx.measureText((c + ' ' + wd).trim()).width > w - 28 && c) { L.push(c); c = wd; } else c = (c + ' ' + wd).trim(); }); L.push(c);
    L.forEach((l, i) => text(ctx, l, w / 2, 70 + i * 20, { color: col.ink, size: 13, align: 'center' }));
    if (picked) text(ctx, (picked === Q[cur][1] ? '✓ Right: ' : '✗ It was: ') + Q[cur][1], w / 2, h - 16, { color: picked === Q[cur][1] ? col.good : col.bad, size: 13, weight: 700, align: 'center' });
  };
  next();
}
