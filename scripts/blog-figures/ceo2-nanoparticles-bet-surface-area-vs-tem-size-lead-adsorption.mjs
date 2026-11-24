// Figures for src/blog/discoveries/ceo2-nanoparticles-bet-surface-area-vs-tem-size-lead-adsorption.md, made with the
// maths of the Nanoparticle calculator (src/lib/sci/nano.ts: specific surface area, BET-equivalent diameter, atoms per
// particle and surface share) and the XRD peak calculator (src/lib/sci/xrd.ts: d from 2θ, cubic indexing).
// Run: node scripts/blog-figures/ceo2-nanoparticles-bet-surface-area-vs-tem-size-lead-adsorption.mjs
import fs from 'node:fs';
import { specificSurface, betDiameter, sphereAtoms, atomVolume, NA } from '../../src/lib/sci/nano.ts';
import { indexCubic, dFromTwoTheta } from '../../src/lib/sci/xrd.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ceo2-nanoparticles-bet-surface-area-vs-tem-size-lead-adsorption.md', import.meta.url);

// Inputs from the paper: Mustafa and Mohammed (2026), Separations 13(2): 61, doi:10.3390/separations13020061 (CC BY).
const SSA = 118.96;        // BET surface area, m²/g
const TEM = 100;           // average particle size from the TEM/SEM histogram, nm (about)
const VP = 0.3962;         // total pore volume, cm³/g (BET section)
const QMAX_EXP = 192;      // highest measured Pb2+ uptake, mg/g
const QM_LANG = 714.28;    // Langmuir monolayer capacity, mg/g
const TT = [28, 32.5, 47, 56, 59, 69]; // XRD peak positions, ° 2θ (Cu Kα, 1.5406 Å), as rounded in the paper
// Our assumptions: bulk CeO2 density 7.22 g/cm³ (handbook) and molar mass 172.11 g/mol (IUPAC weights);
// reference fluorite lattice parameter 5.411 Å.
const RHO = 7.22, M = 172.11, A_REF = 5.411, LAM = 1.5406, M_PB = 207.2;

const dB = betDiameter(SSA, RHO);
const ssaTem = specificSurface(TEM, RHO);
const dLow = betDiameter(SSA, 6.5); // if the nanoparticles were 10 % less dense than bulk
const at7 = sphereAtoms(dB, RHO, M), at100 = sphereAtoms(TEM, RHO, M), av = atomVolume(RHO, M);
const crystallitesPerParticle = (TEM / dB) ** 3; // volume ratio, before allowing for pores
const poreD = (4 * VP * 1e-6) / (SSA) * 1e9; // 4V/S cylinder-pore diameter, nm
const porosity = (VP * RHO) / (1 + VP * RHO);
const perNm2 = (q) => ((q / 1000 / M_PB) * NA) / (SSA * 1e18);
const pbExp = perNm2(QMAX_EXP), pbLang = perNm2(QM_LANG);
const ceSurf111 = 4 / ((Math.sqrt(3) / 2) * (A_REF / Math.SQRT2 * 1e-1) ** 2 * 4); // Ce per nm² on (111): one per (a/√2)²·√3/2
const massBalance = (45 * 0.8 * 0.05) / 0.01; // mg/g if 80 % of 45 mg/L in 50 mL went onto 0.01 g

// XRD: index the rounded peak list as face-centred cubic (sin²θ values), tolerance 2 % of d.
const s = TT.map((t) => Math.sin(((t / 2) * Math.PI) / 180) ** 2);
const fit = indexCubic(s, 'fcc', 0.02);
const aFit = (LAM / 2) * fit.a; // indexCubic on sin²θ gives a in units of λ/2
const ds = TT.map((t) => dFromTwoTheta(t, LAM));

// Figure 1: specific surface area against diameter for smooth CeO2 spheres (log axis).
const xs = Array.from({ length: 121 }, (_, i) => 0 + (i * 2.5) / 120); // log10 d from 1 to ~316 nm
const fig1 = chart({
  title: 'CeO₂ spheres: surface per gram against size', xLabel: 'Particle diameter (nm, log scale)', yLabel: 'Specific surface (m²/g)',
  series: [
    { name: 'Smooth solid spheres, ρ = 7.22 g/cm³', kind: 'line', x: xs, y: xs.map((l) => +specificSurface(10 ** l, RHO).toFixed(2)) },
    { name: 'Paper: BET and TEM', kind: 'dots', x: [Math.log10(dB), Math.log10(TEM)], y: [SSA, +ssaTem.toFixed(2)], size: 4, colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 2.5], yDomain: [0, 400], xTicks: [0, 0.5, 1, 1.5, 2, 2.5], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: SSA, text: `BET ${SSA} m²/g` }],
  vlines: [{ x: Math.log10(dB), text: `${dB.toFixed(1)} nm`, dy: 30 }, { x: Math.log10(TEM), text: `TEM ~${TEM} nm: ${ssaTem.toFixed(1)} m²/g`, left: true, dy: 60 }],
  desc: `Specific surface area of smooth CeO2 spheres falls as 6/(ρd). The measured ${SSA} m2/g matches spheres of ${dB.toFixed(1)} nm, while separate 100 nm spheres would give only ${ssaTem.toFixed(1)} m2/g.`, height: 280,
});

// Figure 2: share of formula units within one unit diameter of the surface.
const ds2 = Array.from({ length: 121 }, (_, i) => (i * 2.5) / 120 + 0);
const fig2 = chart({
  title: 'CeO₂: share of units at the surface', xLabel: 'Particle diameter (nm, log scale)', yLabel: 'At the surface (%)',
  series: [{ name: 'Sphere model', kind: 'line', x: ds2, y: ds2.map((l) => +(100 * sphereAtoms(10 ** l, RHO, M).fraction).toFixed(2)) }],
  xDomain: [0, 2.5], yDomain: [0, 100], xTicks: [0, 0.5, 1, 1.5, 2, 2.5], xFmt: (t) => String(+(10 ** t).toPrecision(2)),
  vlines: [{ x: Math.log10(dB), text: `${dB.toFixed(1)} nm: ${(100 * at7.fraction).toFixed(0)} %`, dy: 0 }, { x: Math.log10(TEM), text: `100 nm: ${(100 * at100.fraction).toFixed(1)} %`, left: true, dy: 40 }],
  desc: `In the sphere model, ${(100 * at7.fraction).toFixed(0)} % of CeO2 formula units sit within one unit diameter of the surface of a ${dB.toFixed(1)} nm particle, against ${(100 * at100.fraction).toFixed(1)} % for a 100 nm particle.`, height: 260,
});

const out = {
  dBET: +dB.toFixed(3), dBET_rho65: +dLow.toFixed(2), ssaAt100nm: +ssaTem.toFixed(2), ratioTEMoverBET: +(TEM / dB).toFixed(1),
  unitsIn7nm: Math.round(at7.N), surf7: +(100 * at7.fraction).toFixed(1), unitsIn100nm: +at100.N.toPrecision(3), surf100: +(100 * at100.fraction).toFixed(2),
  unitDiam: +av.da.toFixed(4), crystallitesPerParticle: Math.round(crystallitesPerParticle), poreD: +poreD.toFixed(2), poreR: +(poreD / 2).toFixed(2), porosity: +(100 * porosity).toFixed(1),
  pbPerNm2Exp: +pbExp.toFixed(2), pbPerNm2Lang: +pbLang.toFixed(1), ce111PerNm2: +ceSurf111.toFixed(2), massBalance,
  xrd: { a: +aFit.toFixed(3), aRef: A_REF, diffPct: +(100 * (aFit / A_REF - 1)).toFixed(2), lines: fit.lines.map((l) => l.hkl), d: ds.map((d) => +d.toFixed(3)), unindexed: fit.unindexed },
  ssa7: +specificSurface(7, RHO).toFixed(2),
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ssa', figure(fig1, `Figure 1. Specific surface area of smooth, solid CeO₂ spheres against diameter (6/(ρd), the Nanoparticle calculator's maths, bulk density 7.22 g/cm³ as our assumption). The paper's BET value sits on the curve at ${dB.toFixed(1)} nm; separate 100 nm particles would sit at ${ssaTem.toFixed(1)} m²/g.`));
  md = inject(md, 'surface', figure(fig2, 'Figure 2. Share of CeO₂ formula units within one unit diameter of the surface, sphere model of the Nanoparticle calculator. Smaller grains put far more of the oxide where lead ions can reach it.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
