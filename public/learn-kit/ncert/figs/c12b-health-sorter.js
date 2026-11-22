// Class 12 Human Health and Disease: which kind of pathogen causes it? A card game with ten common diseases: choose virus, bacterium, protozoan, helminth (worm) or fungus.
// After each answer the card shows the pathogen, how it spreads and the organ affected. Antibiotics work on bacteria only, which is why a cold (virus) does not need them.
import { canvas, text, title, row, button, readout, rng } from '../../kit.js';

const D = [
  ['Typhoid', 'bacterium', 'Salmonella typhi', 'contaminated food and water', 'intestine, then blood'],
  ['Pneumonia', 'bacterium', 'Streptococcus pneumoniae, Haemophilus influenzae', 'droplets, shared utensils', 'alveoli of the lungs'],
  ['Common cold', 'virus', 'rhinoviruses', 'droplets from coughs and sneezes', 'nose and throat'],
  ['Dengue', 'virus', 'dengue virus', 'bite of Aedes mosquito', 'blood (platelets fall)'],
  ['AIDS', 'virus', 'HIV', 'body fluids, mother to child', 'helper T cells'],
  ['Malaria', 'protozoan', 'Plasmodium', 'bite of female Anopheles', 'liver and red blood cells'],
  ['Amoebiasis', 'protozoan', 'Entamoeba histolytica', 'contaminated food and water', 'large intestine'],
  ['Filariasis', 'helminth', 'Wuchereria', 'bite of Culex mosquito', 'lymphatic vessels'],
  ['Ascariasis', 'helminth', 'Ascaris', 'soil and water with eggs', 'small intestine'],
  ['Ringworm', 'fungus', 'Microsporum, Trichophyton', 'contact, towels, damp clothes', 'skin, nails, scalp'],
];
const TYPES = ['virus', 'bacterium', 'protozoan', 'helminth', 'fungus'];
export default function (host) {
  const r = rng(5), order = D.map((_, i) => i).sort(() => r() - 0.5);
  let k = 0, score = 0, tried = 0, picked = null;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A card naming a disease; choose the type of pathogen that causes it' });
  const ctl = row(host), ctl2 = row(host), ro = readout(host);
  const g = document.createElement('div'); g.className = 'lk-choice'; const gl = document.createElement('span'); gl.textContent = 'Caused by a'; g.appendChild(gl); ctl.appendChild(g);
  const bs = TYPES.map((t) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => { if (picked) return; picked = t; tried++; if (t === D[order[k]][1]) score++; b.setAttribute('aria-pressed', 'true'); go(); }); g.appendChild(b); return b; });
  button(ctl2, 'Next disease', () => { k = (k + 1) % D.length; picked = null; bs.forEach((b) => b.setAttribute('aria-pressed', 'false')); go(); });
  const go = () => { ro.textContent = `Score: ${score} right out of ${tried}. ` + (picked ? (picked === D[order[k]][1] ? 'Correct!' : `Not quite: it is a ${D[order[k]][1]}.`) + ' Press Next disease.' : 'Pick a type.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Disease ${k + 1} of ${D.length}`, col), d = D[order[k]];
    ctx.fillStyle = col.soft; ctx.fillRect(16, t0 + 8, w - 32, h - t0 - 24);
    text(ctx, d[0], w / 2, t0 + 44, { color: col.ink, size: 24, weight: 700, align: 'center' });
    if (!picked) { text(ctx, 'What kind of organism causes this?', w / 2, t0 + 84, { color: col.muted, size: 12, align: 'center' }); return; }
    const ok = picked === d[1], rows = [['Pathogen type', d[1]], ['Pathogen', d[2]], ['Spreads by', d[3]], ['Affects', d[4]]];
    text(ctx, ok ? 'Correct' : 'Not this one', w / 2, t0 + 76, { color: ok ? col.good : col.bad, size: 13, weight: 700, align: 'center' });
    rows.forEach(([a, b], i) => { text(ctx, a, 28, t0 + 106 + i * 36, { color: col.muted, size: 10.5, weight: 700 }); text(ctx, b, 28, t0 + 122 + i * 36, { color: col.ink, size: 12.5, weight: i === 0 ? 700 : 400 }); });
  };
  go();
}
