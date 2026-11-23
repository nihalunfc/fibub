// Class 8 Matter: the family tree of matter. Matter is either a pure substance (one kind of substance: an element or a
// compound) or a mixture (homogeneous: uniform throughout, like salt water; heterogeneous: parts visible, like sand in
// water). Tap a type to see how to spot it and some examples.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

const INFO = {
  matter: 'Matter is anything that has mass and takes up space. Ask: is it one substance or several?',
  pure: 'A <b>pure substance</b> has only one kind of substance in it, with fixed properties: it melts and boils at fixed temperatures.',
  element: 'An <b>element</b> has only one kind of atom and cannot be broken into simpler substances by ordinary chemical methods. Examples: iron, oxygen, gold.',
  compound: 'A <b>compound</b> has two or more elements joined chemically in a fixed ratio, with properties different from its elements. Examples: water, salt, carbon dioxide.',
  mixture: 'A <b>mixture</b> has two or more substances mixed in any amounts, and each keeps its own properties. Examples: air, sea water, soil.',
  homo: 'A <b>homogeneous mixture</b> looks the same throughout (you cannot see the parts): sugar solution, air, brass.',
  hetero: 'A <b>heterogeneous mixture</b> has parts you can see or separate by hand: sand and iron filings, muddy water, a salad.',
};
export default function (host) {
  let sel = 'matter';
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'A family tree of matter: pure substances and mixtures' });
  const ctl = row(host);
  choice(ctl, 'Tap a box', [['matter', 'Matter'], ['pure', 'Pure'], ['element', 'Element'], ['compound', 'Compound'], ['mixture', 'Mixture'], ['homo', 'Same all through'], ['hetero', 'Parts visible']], sel, (v) => { sel = v; upd(); });
  const out = readout(host);
  function upd() { out.innerHTML = INFO[sel]; cv.redraw(); }
  const N = { matter: [0.5, 0.14, 'Matter'], pure: [0.25, 0.42, 'Pure substance'], mixture: [0.75, 0.42, 'Mixture'], element: [0.12, 0.76, 'Element'], compound: [0.38, 0.76, 'Compound'], homo: [0.62, 0.76, 'Same all through'], hetero: [0.88, 0.76, 'Parts visible'] };
  const E = [['matter', 'pure'], ['matter', 'mixture'], ['pure', 'element'], ['pure', 'compound'], ['mixture', 'homo'], ['mixture', 'hetero']];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Classifying matter', col);
    const P = (k) => [N[k][0] * w, N[k][1] * h + 10];
    E.forEach(([a, b]) => line(ctx, [P(a), P(b)], col.line, 2));
    Object.keys(N).forEach((k) => { const [x, y] = P(k), bw = k === 'homo' || k === 'hetero' || k === 'compound' ? w * 0.22 : w * 0.2, bh = 38, on = k === sel; ctx.fillStyle = on ? col.s[2] : col.soft; ctx.fillRect(x - bw / 2, y - bh / 2, bw, bh); ctx.strokeStyle = on ? col.s[2] : col.line; ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
      const words = N[k][2].split(' '); const lines = words.length > 1 && N[k][2].length > 10 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [N[k][2]];
      lines.forEach((l, i) => text(ctx, l, x, y + (i - (lines.length - 1) / 2) * 13, { color: on ? '#fff' : col.ink, size: 10.5, weight: 700, align: 'center', fit: false })); });
  };
  upd();
}
