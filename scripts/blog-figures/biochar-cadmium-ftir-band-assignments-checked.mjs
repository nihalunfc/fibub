// Figures for src/blog/discoveries/biochar-cadmium-ftir-band-assignments-checked.md, made with the maths and band
// table of the IR band finder (src/lib/sci/irbands.ts: bandsAt, assign, parseIR and the unit conversions).
// Run: node scripts/blog-figures/biochar-cadmium-ftir-band-assignments-checked.mjs   (rewrites the article's charts)
import fs from 'node:fs';
import * as IR from '../../src/lib/sci/irbands.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/biochar-cadmium-ftir-band-assignments-checked.md', import.meta.url);

// Inputs from the paper: Lalhruaitluanga et al. (2026), Front. Carbon 5: 1720673, doi:10.3389/frcrb.2026.1720673
// (CC BY). The peak positions it reports for pristine (MPB) and KOH-activated (MAB) bamboo biochar, before and
// after Cd(II) uptake, with the assignment the authors give in their own words.
const PEAKS = [
  { x: 3395, broad: true, says: 'O–H (and N–H) stretching' },
  { x: 2359, says: 'atmospheric carbon dioxide, not a surface group' },
  { x: 1685, says: 'carboxyl C=O stretching (unloaded)' },
  { x: 1687, says: 'carboxyl C=O, Cd-loaded MPB (+2 cm⁻¹)' },
  { x: 1684, says: 'carboxyl C=O, Cd-loaded MAB (−1 cm⁻¹)' },
  { x: 1572, says: 'C=O stretching (unloaded)' },
  { x: 1583, says: 'C=O stretching, Cd-loaded MPB (+11 cm⁻¹)' },
  { x: 1589, says: 'C=O stretching, Cd-loaded MAB (+17 cm⁻¹)' },
  { x: 1016, says: 'C–H bending and C–O stretching' },
  { x: 1114, says: 'C–H bending and C–O stretching' },
];
const TOL = 10; // the tool's default tolerance, ± cm⁻¹

const res = IR.assign(PEAKS.map((p) => ({ x: p.x, broad: p.broad })), TOL);
const perPeak = res.perPeak.map((p, i) => ({ ...p, says: PEAKS[i].says, bands: p.bands.map((b) => ({ id: b.id, bond: b.bond, lo: b.lo, hi: b.hi, group: b.group })) }));
// Is any C=O band within tolerance of each peak?
const isCO = (b) => b.bond.includes('C=O');
const coWindows = IR.BANDS.filter(isCO).map((b) => `${b.bond} ${b.group} ${b.lo}-${b.hi}`);

// Figure 1: the tool's band windows that matter here, with the paper's peaks as dashed lines.
const SHOW = ['OH-alc', 'NH-amine', 'CO2', 'CO-acid', 'CO-conj', 'CO-amide', 'CC-arom1', 'CH-bend', 'CO-ether', 'CO-alc'];
const shown = SHOW.map((id) => IR.BANDS.find((b) => b.id === id));
const SHORT = { 'OH-alc': 'O–H H-bonded', 'NH-amine': 'N–H', CO2: 'CO₂ in the beam', 'CO-acid': 'acid C=O', 'CO-conj': 'conjugated C=O', 'CO-amide': 'amide I C=O', 'CC-arom1': 'ring C=C', 'CH-bend': 'C–H bend', 'CO-ether': 'C–O–C ether', 'CO-alc': 'C–O alcohol' };
const fig1 = chart({
  title: 'The paper\'s peaks against the band finder\'s windows',
  xLabel: 'Wavenumber (cm⁻¹)', yLabel: '',
  series: shown.map((b, i) => ({
    name: '', noLegend: true, kind: 'line', x: [b.lo, b.hi], y: [i, i],
    colour: i < 3 ? 'var(--muted)' : 'var(--c-blog)',
    label: { text: SHORT[b.id], at: [(b.lo + b.hi) / 2, i], dx: 0, dy: -7, anchor: 'middle' },
  })),
  xDomain: [900, 3700], yDomain: [-0.7, shown.length - 0.1], yTicks: [],
  xTicks: [1000, 1500, 2000, 2500, 3000, 3500],
  vlines: [...new Set(PEAKS.map((p) => p.x))].map((x, i) => ({ x, text: i % 2 || x > 2000 ? String(x) : '', dy: (i % 3) * 13 })),
  desc: 'Each dashed line is a peak position the paper reports; each bar is the range the IR band finder holds for one kind of bond. The peaks near 1572 to 1589 fall in the aromatic ring window and outside every C=O window.',
  height: 300,
});

// Figure 2: the carbonyl region close up, with the shifts the paper measures on Cd uptake.
const fig2 = chart({
  title: 'The carbonyl region: what shifts when cadmium binds',
  xLabel: 'Wavenumber (cm⁻¹)', yLabel: '',
  series: [
    { name: 'Before Cd(II)', kind: 'dots', x: [1685, 1572], y: [1, 0], size: 5 },
    { name: 'After Cd(II), MPB', kind: 'dots', x: [1687, 1583], y: [1.18, 0.18], size: 5 },
    { name: 'After Cd(II), MAB', kind: 'dots', x: [1684, 1589], y: [1.36, 0.36], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [1540, 1740], yDomain: [-0.4, 1.9], yTicks: [],
  bands: [
    { x0: 1700, x1: 1725, text: 'acid C=O' },
    { x0: 1660, x1: 1700, text: 'conjugated C=O' },
    { x0: 1580, x1: 1620, text: 'ring C=C' },
  ],
  desc: 'The two peaks the paper tracks on cadmium uptake, before and after, for both biochars. The upper pair sits in the conjugated C=O window; the lower pair starts just below the aromatic ring C=C window and moves into it.',
  height: 250,
});

console.log(JSON.stringify({
  perPeak: perPeak.map((p) => ({ peak: p.peak, broad: p.broad, says: p.says, tool: p.bands.map((b) => `${b.bond} ${b.lo}-${b.hi} (${b.group})`) })),
  groups: res.groups.map((g) => `${g.name} ${g.met}/${g.total}${g.likely ? ' LIKELY' : ''}${g.blocked ? ' blocked' : ''}`),
  coWindows, lowestCO: Math.min(...IR.BANDS.filter(isCO).map((b) => b.lo)),
  chBendWindows: IR.BANDS.filter((b) => b.bond.includes('C–H bend')).map((b) => `${b.bond} ${b.lo}-${b.hi}`),
  parsed: IR.parseIR('3395 (br), 2359, 1685, 1572, 1016–1114'),
  micron: { at3395: +IR.toMicron(3395).toFixed(3), at1685: +IR.toMicron(1685).toFixed(3) },
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'windows', figure(fig1, 'Figure 1. The peak positions the paper reports (dashed lines) against the IR band finder\'s ranges for the bonds in question. Infrared spectra are usually drawn with the wavenumber falling to the right; here it rises, so the O–H end is on the right.'));
  md = inject(md, 'carbonyl', figure(fig2, 'Figure 2. The two bands the paper follows through cadmium uptake, shown against three band windows from the tool. Rows are offset only so the points do not overlap.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
