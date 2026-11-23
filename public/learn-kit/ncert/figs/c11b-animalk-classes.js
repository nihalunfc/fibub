// Class 11 Biology, Animal Kingdom: seven classes of vertebrates. Heart chambers rise from two in fishes, to three in amphibians and most reptiles, to four in birds and mammals (full separation of oxygenated and deoxygenated blood).
// Pick a class to see its heart beating and its main features: body temperature, skin, breathing, and development.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

const C = {
  cyc: ['Cyclostomata', 2, 'cold-blooded', 'smooth, slimy skin, no scales; sucking mouth with no jaws', 'gills in pouches', 'Lamprey, hagfish (marine; migrate to fresh water to breed)'],
  chon: ['Chondrichthyes', 2, 'cold-blooded', 'placoid scales; skeleton of cartilage', 'gills, no operculum', 'Shark, ray; mostly viviparous (live birth)'],
  osteo: ['Osteichthyes', 2, 'cold-blooded', 'cycloid or ctenoid scales; bony skeleton', 'gills with an operculum; air bladder', 'Rohu, catla, seahorse; external fertilisation'],
  amph: ['Amphibia', 3, 'cold-blooded', 'moist skin without scales', 'gills, lungs and skin', 'Frog, toad, salamander; eggs in water, external fertilisation'],
  rept: ['Reptilia', 3, 'cold-blooded', 'dry skin with scales; crocodiles have a 4-chambered heart', 'lungs', 'Lizard, snake, turtle, crocodile; internal fertilisation, eggs on land'],
  aves: ['Aves', 4, 'warm-blooded', 'feathers; forelimbs are wings; bones with air cavities', 'lungs with air sacs', 'Crow, pigeon, peacock; lay eggs'],
  mam: ['Mammalia', 4, 'warm-blooded', 'hair or fur; sweat and oil glands; mammary glands', 'lungs; diaphragm', 'Human, whale, bat, cow; mostly viviparous, feed milk'],
};
export default function (host) {
  let k = 'amph', t = 0;
  const cv = canvas(host, { aspect: 1.15, max: 470, min: 345, label: 'Heart chambers and main features of the seven vertebrate classes' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Class', Object.entries(C).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; go(); });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const go = () => { ro.textContent = C[k][5]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const a = C[k], y0 = title(ctx, `${a[0]}: heart with ${a[1]} chambers`, col), cx = w / 2, hy = y0 + 14, hw = Math.min(w - 120, 190), hh = 100, x0 = cx - hw / 2;
    const beat = (Math.sin(t * 5) + 1) / 2, sq = 0.06 * beat;
    const chamber = (x, y, ww, hh2, c, label, deox) => { rr(ctx, x + ww * sq, y + hh2 * sq, ww * (1 - 2 * sq), hh2 * (1 - 2 * sq), 12, c, col.ink, 1.8); text(ctx, label, x + ww / 2, y + hh2 / 2, { color: col.panel, size: 10.5, weight: 700, align: 'center' }); };
    const O = col.s[3], D = col.s[0];
    if (a[1] === 2) { chamber(x0 + hw * 0.2, hy, hw * 0.6, 40, D, 'atrium', 1); chamber(x0 + hw * 0.2, hy + 48, hw * 0.6, 52, D, 'ventricle', 1); text(ctx, 'deoxygenated blood only; goes to gills then body', cx, hy + 114, { color: col.muted, size: 10, align: 'center' }); }
    if (a[1] === 3) { chamber(x0, hy, hw * 0.48, 40, O, 'left atrium', 0); chamber(x0 + hw * 0.52, hy, hw * 0.48, 40, D, 'right atrium', 1); chamber(x0, hy + 48, hw, 52, k === 'rept' ? col.s[4] : col.s[2], 'one ventricle (mixed blood)', 2); text(ctx, k === 'rept' ? 'ventricle partly divided; blood slightly mixed' : 'oxygenated and deoxygenated blood mix', cx, hy + 114, { color: col.muted, size: 10, align: 'center' }); }
    if (a[1] === 4) { chamber(x0, hy, hw * 0.48, 40, O, 'left atrium', 0); chamber(x0 + hw * 0.52, hy, hw * 0.48, 40, D, 'right atrium', 1); chamber(x0, hy + 48, hw * 0.48, 52, O, 'left ventricle', 0); chamber(x0 + hw * 0.52, hy + 48, hw * 0.48, 52, D, 'right ventricle', 1); text(ctx, 'complete division: no mixing of the two bloods', cx, hy + 114, { color: col.muted, size: 10, align: 'center' }); }
    const lg = y0 + 150; rr(ctx, 14, lg - 6, 10, 10, 2, col.s[3], null); text(ctx, 'oxygenated', 28, lg - 1, { color: col.ink, size: 10 }); rr(ctx, 110, lg - 6, 10, 10, 2, col.s[0], null); text(ctx, 'deoxygenated', 124, lg - 1, { color: col.ink, size: 10 }); rr(ctx, 222, lg - 6, 10, 10, 2, col.s[2], null); text(ctx, 'mixed', 236, lg - 1, { color: col.ink, size: 10 });
    [['Body temperature', a[2]], ['Skin / cover', a[3]], ['Breathing', a[4]]].forEach(([n, b], i) => { const y = lg + 18 + i * 46; rr(ctx, 10, y, w - 20, 40, 7, col.soft, col.line); text(ctx, n, 18, y + 11, { color: col.muted, size: 10, weight: 700 }); note(ctx, b, 18, y + 25, w - 36, col, { size: 10.5, lh: 11 }); });
  };
  go();
}
