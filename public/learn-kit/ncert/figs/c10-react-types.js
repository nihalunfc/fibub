// Class 10 Chemical Reactions: the four patterns of reaction, drawn with lettered "atoms" and bonds.
// Combination A + B -> AB; decomposition AB -> A + B; displacement A + BC -> AC + B (A is more reactive than B);
// double displacement AB + CD -> AD + CB. Bonds fade out and in as the pieces move to their new partners.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, ease, lerp, clamp } from '../../kit.js';

const T = {
  comb: { name: 'Combination', eq: 'A + B → AB', ex: 'CaO + H₂O → Ca(OH)₂ (quicklime and water, the whitewash reaction). Two or more substances make one.',
    at: { A: [.22, .5], B: [.78, .5] }, to: { A: [.42, .5], B: [.58, .5] }, b0: [], b1: [['A', 'B']] },
  deco: { name: 'Decomposition', eq: 'AB → A + B', ex: 'CaCO₃ → CaO + CO₂ on heating limestone. One substance breaks into two or more.',
    at: { A: [.42, .5], B: [.58, .5] }, to: { A: [.2, .5], B: [.8, .5] }, b0: [['A', 'B']], b1: [] },
  disp: { name: 'Displacement', eq: 'A + BC → AC + B', ex: 'Fe + CuSO₄ → FeSO₄ + Cu. A more reactive element (A) pushes a less reactive one (B) out of its compound.',
    at: { A: [.15, .72], B: [.5, .45], C: [.75, .45] }, to: { A: [.5, .45], B: [.22, .22], C: [.75, .45] }, b0: [['B', 'C']], b1: [['A', 'C']] },
  dbl: { name: 'Double displacement', eq: 'AB + CD → AD + CB', ex: 'Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl. The partners swap places, often making a precipitate.',
    at: { A: [.15, .28], B: [.4, .28], C: [.6, .72], D: [.85, .72] }, to: { A: [.15, .5], D: [.4, .5], C: [.6, .5], B: [.85, .5] }, b0: [['A', 'B'], ['C', 'D']], b1: [['A', 'D'], ['C', 'B']] },
};
const COL = { A: 0, B: 1, C: 2, D: 3 };
export default function (host) {
  let k = 'comb', p = 0, manual = false, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'Lettered atoms combining, splitting and swapping partners' });
  const ctl = row(host);
  choice(ctl, 'Type', Object.entries(T).map(([v, o]) => [v, o.name]), k, (v) => { k = v; t = 0; say(); });
  const sl = slider(ctl, { label: 'Progress', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { manual = true; anim.pause(); p = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { t += dt; if (!manual) { const c = (t % 5) / 5; p = c < 0.2 ? 0 : c < 0.6 ? (c - 0.2) / 0.4 : c < 0.8 ? 1 : 1 - (c - 0.8) / 0.2 * 0; sl.set(p); cv.redraw(); } });
  anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = `<b>${T[k].name}</b>: ${T[k].eq}. ${T[k].ex}`; manual = false; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${T[k].name}: ${T[k].eq}`, col) + 6;
    const o = T[k], e = ease(clamp(p, 0, 1)), H = h - top - 10;
    const pos = {};
    for (const id of Object.keys(o.at)) pos[id] = [lerp(o.at[id][0], o.to[id][0], e) * w, top + 6 + lerp(o.at[id][1], o.to[id][1], e) * H];
    ctx.save(); ctx.globalAlpha = 1 - e; for (const [a, b] of o.b0) line(ctx, [pos[a], pos[b]], col.ink, 4); ctx.globalAlpha = e; for (const [a, b] of o.b1) line(ctx, [pos[a], pos[b]], col.ink, 4); ctx.restore();
    for (const id of Object.keys(pos)) { dot(ctx, pos[id][0], pos[id][1], 15, col.s[COL[id]]); text(ctx, id, pos[id][0], pos[id][1], { color: col.bg || '#fff', size: 14, weight: 700, align: 'center' }); }
    text(ctx, e < 0.05 ? 'before' : e > 0.95 ? 'after' : 'reacting...', w - 10, h - 10, { color: col.muted, size: 11, align: 'right' });
  };
  say();
}
