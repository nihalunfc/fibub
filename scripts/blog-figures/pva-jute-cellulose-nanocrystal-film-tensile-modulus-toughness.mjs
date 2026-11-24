// Figures for src/blog/discoveries/pva-jute-cellulose-nanocrystal-film-tensile-modulus-toughness.md, made with the
// maths of the Stress-strain curve analyser (src/lib/sci/tensile.ts: analyse and trapz).
// Run: node scripts/blog-figures/pva-jute-cellulose-nanocrystal-film-tensile-modulus-toughness.mjs
import fs from 'node:fs';
import { analyse, trapz } from '../../src/lib/sci/tensile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pva-jute-cellulose-nanocrystal-film-tensile-modulus-toughness.md', import.meta.url);

// From the paper: Sheikh, Hirogaki and Nakane (2025), Advances in Polymer Technology 2025,
// doi:10.1155/adv/7757433 (CC BY 4.0). The 1 wt% jute-cellulose-nanocrystal film: tensile strength 102.93 MPa
// (+70.85 % on neat PVA) and Young's modulus 3254.18 MPa (+56.41 %); elongation at break stayed 6-7 % up to 3 wt%.
const FILMS = [
  { name: 'Neat PVA', uts: 102.93 / 1.7085, E: 3254.18 / 1.5641 },
  { name: 'PVA + 1 wt% jute CNC', uts: 102.93, E: 3254.18 },
];
const EB = 0.065;        // 6.5 % elongation at break: the middle of the paper's 6-7 %. OUR assumption.
const EP_HALF = 0.0005;  // plastic strain already present at half the tensile strength. OUR assumption.

// A Ramberg-Osgood curve: total strain = σ/E + εp(σ), with εp = a·σ^n fixed by two points, so that the curve
// passes through (EB, uts) and is still almost elastic at half the strength.
function curve(f, steps = 80) {
  const epMax = EB - f.uts / f.E;
  const n = Math.log(epMax / EP_HALF) / Math.log(2);
  const ep = (s) => epMax * (s / f.uts) ** n;
  const stress = [], strain = [];
  for (let i = 0; i <= steps; i++) { const s = (f.uts * i) / steps; stress.push(s); strain.push(s / f.E + ep(s)); }
  return { ...f, n, epMax, stress, strain, yieldStrain: f.uts / f.E };
}

const res = FILMS.map((f) => {
  const c = curve(f);
  const r = analyse(c.strain, c.stress, { lo: 0.1, hi: 0.4, offset: 0.002, toe: false });
  // Energy absorbed up to each strain (MJ/m³ = MPa), the running area under the curve.
  const energy = c.strain.map((_, i) => trapz(c.strain.slice(0, i + 1), c.stress.slice(0, i + 1)));
  return { ...c, r, energy };
});

// A short, rounded version of the composite's curve, for readers to paste into the tool.
const paste = (() => {
  const c = res[1], out = [];
  for (const i of [0, 8, 16, 24, 32, 40, 48, 56, 62, 68, 72, 76, 78, 80]) out.push([+(100 * c.strain[i]).toFixed(3), +c.stress[i].toFixed(2)]);
  return out;
})();
const pasted = analyse(paste.map((p) => p[0] / 100), paste.map((p) => p[1]), { lo: 0.1, hi: 0.4, offset: 0.002, toe: false });

const fx = (r) => ({ E: +r.E.toFixed(0), r2: +r.r2.toFixed(5), nFit: r.nFit, yield: +r.yield.s.toFixed(2), yieldStrain: +(100 * r.yield.e).toFixed(3), uts: +r.uts.toFixed(2), eUts: +(100 * r.eUts).toFixed(2), toughness: +r.toughness.toFixed(2), resilience: +r.resilience.toFixed(3), hollomonN: +r.hollomon.n.toFixed(4), hollomonK: +r.hollomon.K.toFixed(0) });
const facts = {
  films: res.map((x) => ({ name: x.name, utsUsed: +x.uts.toFixed(2), Eused: +x.E.toFixed(1), elasticStrainAtUts: +(100 * x.yieldStrain).toFixed(2), roExponent: +x.n.toFixed(2), tool: fx(x.r) })),
  toughnessGain: +((100 * (res[1].r.toughness - res[0].r.toughness)) / res[0].r.toughness).toFixed(1),
  resilienceGain: +((100 * (res[1].r.resilience - res[0].r.resilience)) / res[0].r.resilience).toFixed(1),
  pasteRows: paste, pastedTool: fx(pasted),
  narrowWindow: res.map((x) => ({ name: x.name, E: +analyse(x.strain, x.stress, { lo: 0.05, hi: 0.2, offset: 0.002, toe: false }).E.toFixed(0) })),
};

const fig1 = chart({
  title: 'Two films, rebuilt from their published numbers',
  xLabel: 'Strain (%)', yLabel: 'Stress (MPa)',
  series: [
    ...res.map((x) => ({ name: x.name, kind: 'line', x: x.strain.map((e) => +(100 * e).toFixed(4)), y: x.stress.map((s) => +s.toFixed(3)) })),
    ...res.map((x, k) => ({ name: '', noLegend: true, kind: 'dots', size: 4, x: [100 * x.r.yield.e], y: [x.r.yield.s], colour: k ? 'var(--c-tools)' : 'var(--c-blog)' })),
  ],
  xDomain: [0, 7], yDomain: [0, 110],
  desc: 'Simulated tensile curves for neat polyvinyl alcohol and a film with 1 weight per cent jute cellulose nanocrystals, built so that each one has the published modulus, tensile strength and 6.5 per cent elongation at break. The dots mark the 0.2 per cent offset yield points the analyser finds.',
  height: 290,
});

const fig2 = chart({
  title: 'Energy soaked up on the way to breaking',
  xLabel: 'Strain (%)', yLabel: 'Energy per volume (MJ/m³)',
  series: res.map((x) => ({ name: x.name, kind: 'line', x: x.strain.map((e) => +(100 * e).toFixed(4)), y: x.energy.map((v) => +v.toFixed(4)) })),
  xDomain: [0, 7], yDomain: [0, 5],
  desc: 'The running area under each curve, which is the toughness. The reinforced film reaches about 4.3 megajoules per cubic metre against 2.6 for neat polyvinyl alcohol, at the same elongation at break.',
  height: 275,
});

console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. Tensile curves we simulated from the paper’s three published numbers per film (modulus, tensile strength and elongation at break), with the 0.2 % offset yield points the Stress-strain curve analyser reads off them. Not the paper’s measured curves.'));
  md = inject(md, 'energy', figure(fig2, 'Figure 2. Toughness as it builds up: the area under each simulated curve, worked out with the analyser’s own trapezoid rule. The paper does not report toughness, and this is the number a packaging film is judged on.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
