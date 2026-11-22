// Class 12 Biology, Principles of Inheritance and Variation: chromosomal sex determination. Human and many animals: XX female, XY male (the sperm decides the sex).
// Grasshopper: XX female, XO male (no Y). Birds: ZW female, ZZ male (the egg decides). Each cell of the Punnett square is one equally likely child, so about half are
// each sex, but a real family of a few children can differ. Press the button to have more children at random.
import { canvas, text, title, row, choice, button, readout, rng } from '../../kit.js';

export default function (host) {
  let mode = 'human', n = [0, 0], R = rng(11);
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A Punnett square of sex chromosomes for the chosen species with a tally of random children' });
  const ctl = row(host), ro = readout(host);
  const M = {
    human: { name: 'Human: XX–XY', mom: ['X', 'X'], dad: ['X', 'Y'], f: (m, d) => (d === 'Y' ? 'male' : 'female'), note: 'The egg always carries X. A sperm with X gives a girl (XX), a sperm with Y gives a boy (XY), so the father’s sperm decides the sex of the child.' },
    hopper: { name: 'Grasshopper: XX–XO', mom: ['X', 'X'], dad: ['X', 'O'], f: (m, d) => (d === 'O' ? 'male' : 'female'), note: 'A male grasshopper has only one X and no Y (XO), so half of his sperm carry X and half carry no sex chromosome. Females are XX.' },
    bird: { name: 'Birds: ZW–ZZ', mom: ['Z', 'W'], dad: ['Z', 'Z'], f: (m) => (m === 'W' ? 'female' : 'male'), note: 'In birds the female has two different chromosomes (ZW) and the male two alike (ZZ). So the egg decides the sex of the chick.' },
  };
  choice(ctl, 'Species', [['human', 'Human'], ['hopper', 'Grasshopper'], ['bird', 'Bird']], 'human', (v) => { mode = v; n = [0, 0]; go(); });
  button(ctl, 'Add 10 children', () => { const d = M[mode]; for (let i = 0; i < 10; i++) { const m = d.mom[R() < 0.5 ? 0 : 1], f = d.dad[R() < 0.5 ? 0 : 1]; n[d.f(m, f) === 'male' ? 1 : 0]++; } go(); });
  const go = () => { const t = n[0] + n[1]; ro.textContent = M[mode].note + (t ? ` Tally: ${n[0]} female, ${n[1]} male (${Math.round(100 * n[1] / t)} % male) out of ${t}.` : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const d = M[mode], top = title(ctx, d.name, col) + 6, S = Math.min(80, (w - 120) / 2), x0 = w / 2 - S, y0 = top + 40;
    const dadLabel = mode === 'bird' ? 'male' : 'father (sperm)', momLabel = mode === 'bird' ? 'female (eggs)' : 'mother (eggs)';
    text(ctx, mode === 'bird' ? 'male ZZ: sperm' : 'father: sperm', w / 2, top + 6, { color: col.muted, size: 10, align: 'center' });
    d.dad.forEach((g, i) => text(ctx, g, x0 + S * i + S / 2, y0 - 8, { color: col.s[0], size: 14, weight: 700, align: 'center' }));
    d.mom.forEach((g, j) => text(ctx, g, x0 - 14, y0 + S * j + S / 2, { color: col.s[3], size: 14, weight: 700, align: 'center' }));
    text(ctx, mode === 'bird' ? 'female ZW: eggs' : 'mother: eggs', x0 - 34, y0 + S * 2 + 12, { color: col.muted, size: 10, align: 'left' });
    d.mom.forEach((m, j) => d.dad.forEach((f, i) => { const x = x0 + i * S, y = y0 + j * S, sx = d.f(m, f), fem = sx === 'female'; ctx.fillStyle = fem ? col.s[5] : col.s[0]; ctx.globalAlpha = 0.55; ctx.fillRect(x, y, S, S); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, S, S); const g = mode === 'bird' ? [f, m].join('') : [m, f].join(''); text(ctx, g === 'XO' || g === 'OX' ? 'XO' : mode === 'bird' ? (g === 'WZ' ? 'ZW' : g) : g === 'XY' || g === 'YX' ? 'XY' : g, x + S / 2, y + S / 2 - 8, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, fem ? 'female' : 'male', x + S / 2, y + S / 2 + 12, { color: col.ink, size: 11, align: 'center' }); }));
    const t = n[0] + n[1], by = y0 + S * 2 + 38, bw = w - 60; if (t) { ctx.fillStyle = col.s[5]; ctx.fillRect(30, by, bw * n[0] / t, 16); ctx.fillStyle = col.s[0]; ctx.fillRect(30 + bw * n[0] / t, by, bw * n[1] / t, 16); text(ctx, `${n[0]} female`, 34, by + 8, { color: col.ink, size: 10, weight: 700 }); text(ctx, `${n[1]} male`, w - 34, by + 8, { color: col.panel, size: 10, weight: 700, align: 'right' }); } else text(ctx, 'press the button for random children', w / 2, by + 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
