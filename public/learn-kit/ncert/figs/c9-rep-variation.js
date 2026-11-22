// Class 9 Reproduction: why have two kinds of reproduction? Asexual reproduction makes identical copies (clones) of
// one parent, which is fast and needs no partner. Sexual reproduction mixes two parents, so offspring differ from each
// other (variation). If a disease or a change in climate strikes something that harms one kind of individual, a
// uniform population can be wiped out, while a varied one keeps survivors. 24 offspring each; colours stand for
// different inherited traits. The disease harms only one trait (red).
import { canvas, text, title, dot, row, choice, button, readout, rng } from '../../kit.js';

export default function (host) {
  let mode = 'asex', hit = false;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 300, label: 'Identical clones versus varied offspring when a disease strikes' });
  const ctl = row(host);
  choice(ctl, 'Offspring made by', [['asex', 'One parent (asexual)'], ['sex', 'Two parents (sexual)']], mode, (v) => { mode = v; upd(); });
  button(ctl, '☣ Disease strikes', () => { hit = !hit; upd(); });
  const out = readout(host);
  const N = 24, r = rng(7), traits = Array.from({ length: N }, () => Math.floor(r() * 5));
  const trait = (i) => (mode === 'asex' ? 0 : traits[i]);
  const alive = (i) => !(hit && trait(i) === 0);
  function upd() {
    const s = Array.from({ length: N }, (_, i) => alive(i)).filter(Boolean).length;
    out.innerHTML = (mode === 'asex' ? 'All 24 offspring are clones of the parent, so they all share the same weakness.' : 'The 24 offspring are all a little different, because each mixes traits from two parents.') + (hit ? ` The disease hits the red trait: <b>${s} of 24 survive</b>.` : ' Press the disease button to see what happens.'); cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'asex' ? 'Asexual: identical offspring' : 'Sexual: varied offspring', col);
    const parentsY = 56;
    const C = [col.bad, col.s[2], col.s[3], col.s[4], col.s[5] || col.s[0]];
    if (mode === 'asex') { dot(ctx, w / 2, parentsY, 13, C[0]); text(ctx, 'one parent', w / 2 + 22, parentsY, { color: col.ink, size: 10.5 }); }
    else { dot(ctx, w / 2 - 36, parentsY, 13, C[0]); dot(ctx, w / 2 + 36, parentsY, 13, C[2]); text(ctx, '+', w / 2, parentsY, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, 'two parents', w / 2, parentsY + 24, { color: col.ink, size: 10.5, align: 'center' }); }
    const cols = 6, gx = (w - 40) / cols, top = 106, gy = Math.min(40, (h - top - 40) / 4);
    for (let i = 0; i < N; i++) {
      const x = 20 + gx * (i % cols) + gx / 2, y = top + gy * Math.floor(i / cols), a = alive(i);
      ctx.save(); ctx.globalAlpha = a ? 1 : 0.25; dot(ctx, x, y, Math.min(13, gx * 0.34), C[trait(i)]); ctx.restore();
      if (!a) { text(ctx, '✕', x, y, { color: col.ink, size: 14, weight: 700, align: 'center' }); }
    }
    const s = Array.from({ length: N }, (_, i) => alive(i)).filter(Boolean).length;
    text(ctx, hit ? `${s} of 24 survive` : '24 offspring', w / 2, h - 14, { color: hit && s < 12 ? col.bad : col.ink, size: 12, weight: 700, align: 'center' });
  };
  upd();
}
