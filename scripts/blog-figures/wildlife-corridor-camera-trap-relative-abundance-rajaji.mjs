// Figures for src/blog/discoveries/wildlife-corridor-camera-trap-relative-abundance-rajaji.md, made with the maths of
// the Camera-trap tagger (src/lib/sci/camtrap.ts: independent detections, RAI, naive occupancy).
// Run: node scripts/blog-figures/wildlife-corridor-camera-trap-relative-abundance-rajaji.mjs
import fs from 'node:fs';
import { detections, summarise } from '../../src/lib/sci/camtrap.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/wildlife-corridor-camera-trap-relative-abundance-rajaji.md', import.meta.url);

// Inputs from the paper: Verma, Badola and Mondol (2025), Journal of Threatened Taxa 17(4): 26780-26788,
// doi:10.11609/jott.9621.17.4.26780-26788 (CC BY 4.0). Table 1 gives cameras and trap nights per unit; Table 2 gives
// the Relative Abundance Index per 1000 trap nights for each species in each unit. Detection counts are NOT published.
const SPECIES = ['Barking Deer', 'Chital', 'Sambar', 'Nilgai', 'Asiatic Elephant', 'Wild Boar', 'Rhesus Macaque', 'Central Indian Langur', 'Indian Hare', 'Indian Crested Porcupine', 'Indian Peafowl', 'Indian Pangolin', 'Leopard', 'Tiger', 'Striped Hyena', 'Golden Jackal', 'Small Indian Civet', 'Livestock', 'Human'];
const RAI1000 = {
  Laltappar: [0.6, 50.12, 99.64, null, 19.93, 13.89, 1.81, null, null, null, null, null, 12.08, null, null, null, null, 397.34, 752.42],
  Teenpani: [null, null, 123.31, null, 2.53, 227.2, null, 0.84, null, 3.38, null, null, 15.2, null, null, null, null, 333.61, 26094.59],
  'Chilla-Motichur': [0.22, 8.03, 7.8, null, 0.89, 22.07, 1.34, null, null, null, null, null, 4.01, null, null, null, null, 108.58, 2360.98],
  'Forest beats': [12.9, 1363.44, 993.55, 15.05, 172.04, 223.66, 43.01, 25.81, 49.46, 49.46, 329.03, 4.3, 215.05, 4.3, 21.51, 4.3, 17.2, 531.18, 206.45],
};
const PAPER_NIGHTS = { Laltappar: 1656, Teenpani: 1184, 'Chilla-Motichur': 4485, 'Forest beats': 873 }; // Table 1
const UNITS = Object.keys(RAI1000);

// How far the implied detection counts are from whole numbers, for an assumed effort N (per column).
const worst = (unit, N) => Math.max(...RAI1000[unit].filter((v) => v !== null).map((v) => { const n = (v * N) / 1000; return Math.abs(n - Math.round(n)); }));
// The paper prints its index to two decimals, so a true whole count can land this far from a whole number.
const tol = (N) => (0.005 * N) / 1000 + 1e-9;
const ratio = (unit, N) => worst(unit, N) / tol(N);
// The smallest effort (whole trap nights) that makes every value in a column a whole count.
const bestN = (unit, hi = 6000) => { let b = null; for (let N = 1; N <= hi; N++) if (ratio(unit, N) <= 1) { b = N; break; } return b; };
const FIT = Object.fromEntries(UNITS.map((u) => [u, bestN(u)]));
const NIGHTS = { ...PAPER_NIGHTS, 'Forest beats': FIT['Forest beats'] };
const COUNT = Object.fromEntries(UNITS.map((u) => [u, RAI1000[u].map((v) => (v === null ? 0 : Math.round((v * NIGHTS[u]) / 1000)))]));

// Rebuild a photo set that carries exactly those detection counts: each detection is a burst of 2 photos 20 s apart,
// bursts an hour apart, so the tool's 30-minute independence rule finds one detection per burst.
const T0 = Date.UTC(2022, 3, 12, 18, 0, 0);
const recs = [];
UNITS.forEach((u, ui) => SPECIES.forEach((sp, si) => {
  for (let k = 0; k < COUNT[u][si]; k++) {
    const t = T0 + ui * 864e5 * 3 + si * 36e5 + k * 36e5 * SPECIES.length;
    recs.push({ station: u, t, species: sp, count: 1 }, { station: u, t: t + 20000, species: sp, count: 1 });
  }
}));
const dets = detections(recs, 30);
const all = summarise(dets, NIGHTS);
const per = Object.fromEntries(UNITS.map((u) => [u, summarise(dets.filter((d) => d.station === u), { [u]: NIGHTS[u] })]));
const rai = (u, sp) => { const r = per[u].species.find((x) => x.species === sp); return r ? r.rai : 0; };
const sum = (u, list) => list.reduce((s, sp) => s + (COUNT[u][SPECIES.indexOf(sp)] || 0), 0);
const WILD = SPECIES.slice(0, 17);
const corrWild = ['Laltappar', 'Teenpani', 'Chilla-Motichur'].reduce((s, u) => s + sum(u, WILD), 0);
const corrNights = ['Laltappar', 'Teenpani', 'Chilla-Motichur'].reduce((s, u) => s + NIGHTS[u], 0);

// Figure 1: RAI per 100 trap nights, corridors together against the forest beats (log scale).
const shown = WILD.filter((sp) => sum('Forest beats', [sp]) + corrWild > 0 && (sum('Forest beats', [sp]) > 0 || ['Laltappar', 'Teenpani', 'Chilla-Motichur'].some((u) => sum(u, [sp]) > 0)));
const corrRai = shown.map((sp) => (100 * ['Laltappar', 'Teenpani', 'Chilla-Motichur'].reduce((s, u) => s + sum(u, [sp]), 0)) / corrNights);
const forRai = shown.map((sp) => rai('Forest beats', sp));
const lg = (v) => (v > 0 ? Math.log10(v) : NaN);
const SHORT = { 'Barking Deer': 'Barking deer', Chital: 'Chital', Sambar: 'Sambar', Nilgai: 'Nilgai', 'Asiatic Elephant': 'Elephant', 'Wild Boar': 'Wild boar', 'Rhesus Macaque': 'Macaque', 'Central Indian Langur': 'Langur', 'Indian Hare': 'Hare', 'Indian Crested Porcupine': 'Porcupine', 'Indian Peafowl': 'Peafowl', 'Indian Pangolin': 'Pangolin', Leopard: 'Leopard', Tiger: 'Tiger', 'Striped Hyena': 'Hyena', 'Golden Jackal': 'Jackal', 'Small Indian Civet': 'Civet' };
const fig1 = chart({
  title: 'Detections per 100 trap nights, rebuilt from the paper', xLabel: 'Species (in the paper’s order)', yLabel: 'RAI (per 100 trap nights)',
  series: [
    { name: 'Forest beats', kind: 'dots', x: shown.map((_, i) => i), y: forRai.map(lg), size: 4 },
    { name: 'Three corridors together', kind: 'dots', x: shown.map((_, i) => i), y: corrRai.map(lg), size: 4 },
  ],
  xDomain: [-0.6, shown.length - 0.4], yDomain: [-1.3, 2.4], xTicks: shown.map((_, i) => i), xFmt: () => '',
  yTicks: [-1, 0, 1, 2], yFmt: (t) => (t < 0 ? '0.1' : t === 0 ? '1' : t === 1 ? '10' : '100'),
  hlines: shown.map((sp, i) => ({ y: 0, text: '' })).slice(0, 1),
  desc: `Relative abundance index for ${shown.length} wild species, in the forest beats and in the three corridors together, on a log scale. The forest values are far higher for every species.`, height: 260,
});
// Figure 2: which effort makes the published RAI column a whole number of detections?
const Ns = Array.from({ length: 191 }, (_, i) => 200 + i * 5);
const fig2 = chart({
  title: 'Which effort fits the published index?', xLabel: 'Assumed trap nights for the forest column', yLabel: 'Worst miss ÷ rounding limit',
  series: [{ name: '', noLegend: true, kind: 'line', x: Ns, y: Ns.map((N) => Math.min(12, +ratio('Forest beats', N).toFixed(3))) }],
  xDomain: [200, 1150], yDomain: [0, 12.5],
  hlines: [{ y: 1, text: 'whole counts possible below here' }],
  vlines: [{ x: FIT['Forest beats'], text: `${FIT['Forest beats']} fits` }, { x: PAPER_NIGHTS['Forest beats'], text: `${PAPER_NIGHTS['Forest beats']} stated`, left: true }],
  desc: `The worst distance from a whole number of detections for the forest column of the paper's Table 2, divided by the rounding limit, against the assumed trap nights. It drops under 1 at ${FIT['Forest beats']} and its multiples, not at the stated ${PAPER_NIGHTS['Forest beats']}.`, height: 250,
});

const back = Object.fromEntries(UNITS.map((u) => [u, SPECIES.map((sp, i) => (COUNT[u][i] ? +(rai(u, sp) * 10).toFixed(2) : null))]));
const maxBackErr = Math.max(...UNITS.flatMap((u) => RAI1000[u].map((v, i) => (v === null ? 0 : Math.abs(v - back[u][i])))));
console.log(JSON.stringify({
  fit: FIT, nights: NIGHTS, worstAtStated: Object.fromEntries(UNITS.map((u) => [u, +worst(u, PAPER_NIGHTS[u]).toFixed(3)])),
  counts: COUNT, totals: Object.fromEntries(UNITS.map((u) => [u, { wild: sum(u, WILD), livestock: sum(u, ['Livestock']), human: sum(u, ['Human']), species: COUNT[u].slice(0, 17).filter((x) => x > 0).length, wildRai100: +((100 * sum(u, WILD)) / NIGHTS[u]).toFixed(2) }])),
  corridors: { wild: corrWild, nights: corrNights, rai100: +((100 * corrWild) / corrNights).toFixed(2) },
  forest: { rai100: +((100 * sum('Forest beats', WILD)) / NIGHTS['Forest beats']).toFixed(2) },
  overall: { nights: all.totalNights, stations: all.stations, top: all.species.slice(0, 4).map((s) => [s.species, s.detections, +s.rai.toFixed(2), +s.naiveOcc.toFixed(2)]) },
  backRaiMaxError: +maxBackErr.toFixed(3),
  sizes: [fig1.length, fig2.length],
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rai', figure(fig1, 'Figure 1. Relative abundance index per 100 trap nights for every wild species in the paper’s Table 2, worked out by the Camera-trap tagger’s maths from detection counts rebuilt from that table. Left to right: barking deer, chital, sambar, nilgai, elephant, wild boar, macaque, langur, hare, porcupine, peafowl, pangolin, leopard, tiger, hyena, jackal, civet. Log scale.'));
  md = inject(md, 'fit', figure(fig2, 'Figure 2. How far the forest column of the paper’s index table is from whole detection counts, for each assumed survey effort. Zero means every one of the 19 published values is exactly a whole number of detections per 1000 trap nights.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
