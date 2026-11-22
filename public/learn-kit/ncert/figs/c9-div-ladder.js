// Class 9 Diversity: the classification hierarchy. Living things are placed in nested groups: kingdom, phylum, class,
// order, family, genus, species (taxonomic ranks). Each step down is a smaller group of more closely related
// organisms. Example: the Bengal tiger, Panthera tigris, shown with the other living things that share each rank.
// The slider zooms out one rank at a time. Mnemonic: King Philip Came Over For Good Soup.
import { canvas, text, title, row, slider, readout, ease, lerp } from '../../kit.js';

const RANKS = [
  ['Species', 'Panthera tigris', 'the tiger'],
  ['Genus', 'Panthera', 'tiger, lion, leopard, jaguar'],
  ['Family', 'Felidae', 'the cat family: the big cats plus cheetah, puma and the house cat'],
  ['Order', 'Carnivora', 'cats, dogs, bears, seals, mongooses'],
  ['Class', 'Mammalia', 'all mammals: carnivores, cows, elephants, bats, whales, humans'],
  ['Phylum', 'Chordata', 'animals with a notochord: mammals, birds, reptiles, amphibians, fishes'],
  ['Kingdom', 'Animalia', 'all animals, including insects, worms, sponges and snails'],
];
export default function (host) {
  let lvl = 0, shown = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Nested groups from species up to kingdom for the tiger' });
  const ctl = row(host);
  slider(ctl, { label: 'Zoom out', min: 0, max: 6, step: 1, value: 0, fmt: (v) => RANKS[v][0], oninput: (v) => { lvl = v; go(); } });
  const out = readout(host);
  let raf = 0;
  function go() { out.innerHTML = `<b>${RANKS[lvl][0]}: ${RANKS[lvl][1]}</b>. Includes: ${RANKS[lvl][2]}.` + (lvl === 0 ? ' The species is the basic unit: living things that can breed and have fertile young.' : ''); cancelAnimationFrame(raf); const tick = () => { shown = lerp(shown, lvl, 0.15); cv.redraw(); if (Math.abs(shown - lvl) > 0.01) raf = requestAnimationFrame(tick); else { shown = lvl; cv.redraw(); } }; tick(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'From tiger to kingdom', col);
    const cx = w / 2, bottom = h - 18, top = 40, H = bottom - top, n = 7;
    for (let i = n - 1; i >= 0; i--) {
      if (i > shown + 0.5) continue;
      const wd = lerp(176, w - 20, i / (n - 1)), ht = lerp(46, H, i / (n - 1)), cur = i === lvl;
      ctx.beginPath(); ctx.roundRect(cx - wd / 2, bottom - ht, wd, ht, 12);
      ctx.save(); ctx.globalAlpha = cur ? 0.22 : 1; ctx.fillStyle = cur ? col.s[1] : col.soft; ctx.fill(); ctx.restore();
      ctx.strokeStyle = cur ? col.s[1] : col.s[4]; ctx.lineWidth = cur ? 2.5 : 1.5; ctx.stroke();
      text(ctx, RANKS[i][0], cx - wd / 2 + 10, bottom - ht + 12, { color: cur ? col.s[1] : col.muted, size: 10.5, weight: 700 });
      text(ctx, RANKS[i][1], cx + wd / 2 - 10, bottom - ht + 12, { color: col.ink, size: 10.5, weight: cur ? 700 : 400, align: 'right' });
    }
    text(ctx, 'Bengal tiger', cx, bottom - 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
  };
  go();
}
