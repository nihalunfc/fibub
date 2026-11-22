// Cell: a tour of a plant or animal cell. Choose an organelle: it lights up in the drawing and the line under the
// figure gives its membranes, whether it has its own DNA and ribosomes, and its job (as in NCERT Class 11, ch. 8).
import { canvas, text, row, choice, readout } from '../../kit.js';

const ORG = {
  nucleus: { name: 'Nucleus', mem: 'double membrane (nuclear envelope with pores)', dna: 'yes, the cell\'s chromosomes', job: 'stores the genes and controls the cell; the nucleolus inside makes ribosomal RNA' },
  mito: { name: 'Mitochondrion', mem: 'double membrane (inner one folded into cristae)', dna: 'yes: circular DNA, 70S ribosomes', job: 'aerobic respiration: makes ATP (the "powerhouse")' },
  chloro: { name: 'Chloroplast', mem: 'double membrane, plus thylakoids stacked into grana', dna: 'yes: circular DNA, 70S ribosomes', job: 'photosynthesis; plants only', plant: true },
  er: { name: 'Endoplasmic reticulum', mem: 'single membrane', dna: 'no', job: 'rough ER (with ribosomes) makes and moves proteins; smooth ER makes lipids and steroids' },
  golgi: { name: 'Golgi apparatus', mem: 'single membrane (stacked cisternae, cis face to trans face)', dna: 'no', job: 'packages and modifies proteins (glycoproteins, glycolipids) and sends them on' },
  lyso: { name: 'Lysosome', mem: 'single membrane', dna: 'no', job: 'acid hydrolases digest carbohydrates, lipids, proteins and nucleic acids' },
  vacuole: { name: 'Vacuole', mem: 'single membrane (tonoplast)', dna: 'no', job: 'stores water, sap and wastes; in plants up to 90% of the cell volume' },
  ribo: { name: 'Ribosome', mem: 'no membrane', dna: 'no (made of rRNA and protein)', job: 'protein synthesis; 80S in the cytoplasm of eukaryotes, 70S in prokaryotes, mitochondria and chloroplasts' },
  centriole: { name: 'Centrosome', mem: 'no membrane', dna: 'no', job: 'two centrioles (9 triplet microtubules, cartwheel) organise the spindle; animal cells only', animal: true },
  wall: { name: 'Cell wall', mem: 'not a membrane: a non-living layer of cellulose (plants)', dna: 'no', job: 'shape and protection; plants, fungi and bacteria, not animals', plant: true },
};
export default function (host) {
  let kind = 'plant', cur = 'nucleus';
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'A labelled plant or animal cell with one organelle highlighted' });
  const ctl = row(host);
  choice(ctl, 'Cell', [['plant', 'Plant'], ['animal', 'Animal']], kind, (v) => { kind = v; if ((v === 'animal' && ORG[cur].plant) || (v === 'plant' && ORG[cur].animal)) cur = 'nucleus'; cv.redraw(); show(); });
  const ctl2 = row(host);
  choice(ctl2, 'Organelle', Object.entries(ORG).map(([k, o]) => [k, o.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const o = ORG[cur], absent = (kind === 'animal' && o.plant) || (kind === 'plant' && o.animal);
    out.innerHTML = `<b>${o.name}</b>${absent ? ` (not found in ${kind} cells)` : ''}: ${o.mem}. Own DNA: ${o.dna}. Job: ${o.job}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 6, rx = w * 0.42, ry = h * 0.4, plant = kind === 'plant';
    const hl = (k) => (k === cur ? col.s[1] : col.line), lw = (k) => (k === cur ? 3.5 : 1.5);
    ctx.lineWidth = lw('wall');
    if (plant) { ctx.strokeStyle = hl('wall'); ctx.strokeRect(cx - rx - 6, cy - ry - 6, 2 * rx + 12, 2 * ry + 12); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    if (plant) ctx.strokeRect(cx - rx, cy - ry, 2 * rx, 2 * ry); else { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.stroke(); }
    const ell = (k, x, y, a, b, fill) => { ctx.beginPath(); ctx.ellipse(x, y, a, b, 0, 0, 7); ctx.fillStyle = fill ?? col.soft; ctx.fill(); ctx.strokeStyle = hl(k) === col.line ? col.muted : hl(k); ctx.lineWidth = lw(k); ctx.stroke(); };
    if (plant) ell('vacuole', cx + rx * 0.25, cy, rx * 0.35, ry * 0.55);
    ell('nucleus', cx - rx * 0.45, cy - ry * 0.25, rx * 0.17, ry * 0.26);
    ell('mito', cx - rx * 0.5, cy + ry * 0.5, rx * 0.12, ry * 0.08);
    if (plant) ell('chloro', cx + rx * 0.72, cy - ry * 0.6, rx * 0.12, ry * 0.09, col.soft);
    ell('lyso', cx - rx * 0.05, cy - ry * 0.68, rx * 0.05, rx * 0.05);
    if (!plant) ell('centriole', cx + rx * 0.3, cy - ry * 0.45, rx * 0.04, ry * 0.07);
    // ER and Golgi as wavy lines
    const wavy = (k, x, y, n, len) => { ctx.strokeStyle = hl(k) === col.line ? col.muted : hl(k); ctx.lineWidth = lw(k); for (let i = 0; i < n; i++) { ctx.beginPath(); for (let t = 0; t <= len; t += 3) { const px = x + t, py = y + i * 7 + Math.sin(t / 6) * 3; t ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } };
    wavy('er', cx - rx * 0.25, cy - ry * 0.2, 3, rx * 0.3);
    wavy('golgi', cx - rx * 0.1, cy + ry * 0.35, 4, rx * 0.22);
    ctx.fillStyle = cur === 'ribo' ? col.s[1] : col.muted;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(cx - rx * 0.25 + i * rx * 0.035, cy - ry * 0.27 + (i % 2) * 7, cur === 'ribo' ? 3 : 2, 0, 7); ctx.fill(); }
    const lab = { nucleus: [cx - rx * 0.45, cy - ry * 0.6], mito: [cx - rx * 0.5, cy + ry * 0.75], vacuole: [cx + rx * 0.25, cy + ry * 0.68], chloro: [cx + rx * 0.72, cy - ry * 0.85], er: [cx - rx * 0.1, cy - ry * 0.02], golgi: [cx + rx * 0.0, cy + ry * 0.7], lyso: [cx - rx * 0.05, cy - ry * 0.88], centriole: [cx + rx * 0.3, cy - ry * 0.7], wall: [cx - rx + 30, cy - ry - 14], ribo: [cx - rx * 0.12, cy - ry * 0.42] };
    for (const [k, [x, y]] of Object.entries(lab)) {
      if ((k === 'chloro' || k === 'wall' || k === 'vacuole') && !plant) continue;
      if (k === 'centriole' && plant) continue;
      text(ctx, ORG[k].name.replace('Endoplasmic reticulum', 'ER').replace(' apparatus', ''), x, y, { color: k === cur ? col.ink : col.muted, size: 10, weight: k === cur ? 700 : 400, align: 'center' });
    }
  };
  cv.redraw(); show();
}
