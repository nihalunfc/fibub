// Figures and numbers for src/blog/discoveries/zinc-chromite-spinel-cell-from-lattice-fringe-saed.md, made with the
// maths of the Electron diffraction indexer (src/lib/sci/ediff.ts) and the XRD peak calculator (src/lib/sci/xrd.ts).
// Run: node scripts/blog-figures/zinc-chromite-spinel-cell-from-lattice-fringe-saed.mjs
import fs from 'node:fs';
import { electronWavelength, classicalWavelength, dFromR, dFromRExact, indexRings } from '../../src/lib/sci/ediff.ts';
import { dFromTwoTheta, twoThetaFromD, cubicLines } from '../../src/lib/sci/xrd.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/zinc-chromite-spinel-cell-from-lattice-fringe-saed.md', import.meta.url);

// Inputs from the paper: Thakur et al. (2026), Front. Mater. 13: 1924267, doi:10.3389/fmats.2026.1924267 (CC BY 4.0).
// ZnCr2O4 nanoparticles, cubic spinel; XRD peaks quoted from 2theta 18.64 to 87.58 deg with Cu Kalpha 1.5406 A,
// planes (111) (220) (311) (222) (400) (422) (511) (440) (531) (620) (533), strongest (311), crystallite 15.33 nm;
// HRTEM lattice fringe 0.17 nm assigned to (422); SAED rings assigned to 111, 220, 311, 400, 422, 440, 620.
const CU = 1.5406;
const TT_FIRST = 18.64, TT_LAST = 87.58;
const FRINGE_NM = 0.17, FRINGE_N = 24; // (422): h^2 + k^2 + l^2 = 24
const KV = 200; // the Talos F200x is normally run at 200 kV: OUR ASSUMPTION, the paper does not state the voltage.
const L_MM = 1000; // a round camera length for the worked radii: OUR CHOICE.
const SAED_N = [3, 8, 11, 16, 24, 32, 40]; // the rings the paper indexes: 111 220 311 400 422 440 620
const SAED_HKL = ['111', '220', '311', '400', '422', '440', '620'];
const XRD_EXTRA = [12, 27]; // (222) and (511), in the paper's XRD list but not among its rings

// Three routes to the cubic cell constant a.
const aFringe = FRINGE_NM * 10 * Math.sqrt(FRINGE_N);
const dFirst = dFromTwoTheta(TT_FIRST, CU), aFirstAs111 = dFirst * Math.sqrt(3);
const dLast = dFromTwoTheta(TT_LAST, CU);
const nLast = (a) => (a / dLast) ** 2;
const aFromLast = (N) => dLast * Math.sqrt(N);

const lam = electronWavelength(KV), lamL = lam * L_MM;
const rings = SAED_N.map((N, i) => {
  const d = aFringe / Math.sqrt(N);
  return { N, hkl: SAED_HKL[i], d, dnm: d / 10, inv: 10 / d, R: lamL / d, ratio: Math.sqrt(N / SAED_N[0]) };
});
const fitsReported = indexRings(rings.map((r) => r.d), 0.02);
const fullN = [...SAED_N, ...XRD_EXTRA].sort((a, b) => a - b);
const fitsFull = indexRings(fullN.map((N) => aFringe / Math.sqrt(N)), 0.02);

// Where the spinel lines fall in a powder pattern, for the two candidate cells.
const LINES = cubicLines('fcc', 60).filter((l) => Number.isFinite(twoThetaFromD(aFringe / Math.sqrt(l.N), CU)));
const ttFor = (a) => LINES.map((l) => ({ N: l.N, hkl: l.hkl[0], tt: twoThetaFromD(a / Math.sqrt(l.N), CU) })).filter((p) => Number.isFinite(p.tt) && p.tt < 95);
const setA = ttFor(aFringe), setB = ttFor(aFirstAs111);

const fig1 = chart({
  title: 'Spinel lines for two candidate cells (Cu Kα)', xLabel: 'h² + k² + l²', yLabel: '2θ (degrees)',
  series: [
    { name: `a = ${aFringe.toFixed(3)} Å (HRTEM fringe)`, kind: 'dots', x: setA.map((p) => p.N), y: setA.map((p) => +p.tt.toFixed(2)), size: 3.2 },
    { name: `a = ${aFirstAs111.toFixed(3)} Å (first peak as 111)`, kind: 'dots', x: setB.map((p) => p.N), y: setB.map((p) => +p.tt.toFixed(2)), size: 3.2 },
  ],
  xDomain: [0, 60], yDomain: [10, 95],
  hlines: [{ y: TT_FIRST, text: `paper: first peak ${TT_FIRST}°` }, { y: TT_LAST, text: `last peak ${TT_LAST}°` }],
  desc: `Positions of the allowed face-centred cubic lines for a = ${aFringe.toFixed(3)} and ${aFirstAs111.toFixed(3)} angstrom, against the quoted first and last peak of the paper's pattern.`,
  height: 300,
});
const fullRatios = fullN.map((N) => Math.sqrt(N / fullN[0]));
const fig2 = chart({
  title: 'Ring-radius ladder: what settles the lattice', xLabel: 'Ring number, innermost first', yLabel: 'Radius ÷ first radius',
  series: [
    { name: 'The 7 rings the paper indexes', kind: 'dots', x: rings.map((_, i) => i + 1), y: rings.map((r) => +r.ratio.toFixed(4)), size: 3.6 },
    { name: 'With (222) and (511) added', kind: 'dots', x: fullN.map((_, i) => i + 1), y: fullRatios.map((v) => +v.toFixed(4)), size: 2.4, colour: 'var(--c-tools)' },
  ],
  xDomain: [0.5, 9.5], xTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9], yDomain: [0.8, 4.2],
  desc: 'Ratios of ring radii to the innermost ring, for the seven rings the paper indexes and for the nine rings its own powder pattern shows. The extra two rungs are what tell a spinel from a diamond-cubic lattice.',
  height: 280,
});

console.log(JSON.stringify({
  cell: {
    aFringe: +aFringe.toFixed(4), dFirst: +dFirst.toFixed(4), aFirstAs111: +aFirstAs111.toFixed(4),
    gapPct: +((aFirstAs111 / aFringe - 1) * 100).toFixed(2),
    tt111_fringeCell: +twoThetaFromD(aFringe / Math.sqrt(3), CU).toFixed(2),
    dLast: +dLast.toFixed(4), nLast_fringeCell: +nLast(aFringe).toFixed(2), nLast_firstCell: +nLast(aFirstAs111).toFixed(2),
    a_if_last_is_642: +aFromLast(56).toFixed(4), tt642_fringeCell: +twoThetaFromD(aFringe / Math.sqrt(56), CU).toFixed(2),
    tt533_fringeCell: +twoThetaFromD(aFringe / Math.sqrt(43), CU).toFixed(2),
  },
  electron: { lambda: +lam.toFixed(5), classical: +classicalWavelength(KV).toFixed(5), lamL: +lamL.toFixed(3) },
  rings: rings.map((r) => ({ hkl: r.hkl, N: r.N, d: +r.d.toFixed(4), dnm: +r.dnm.toFixed(4), inv: +r.inv.toFixed(3), R_mm: +r.R.toFixed(2), ratio: +r.ratio.toFixed(4) })),
  smallAngle: { d_small: +dFromR(rings[0].R, lamL).toFixed(5), d_exact: +dFromRExact(rings[0].R, lam, L_MM).toFixed(5) },
  indexReported: fitsReported.map((f) => ({ lattice: f.lattice, a: +f.a.toFixed(4), missing: f.missing, unindexed: f.unindexed })),
  indexFull: fitsFull.map((f) => ({ lattice: f.lattice, a: +f.a.toFixed(4), missing: f.missing, unindexed: f.unindexed })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lines', figure(fig1, `Figure 1. Where the allowed face-centred cubic lines fall for the two cell constants the paper's own numbers imply, worked out with the XRD peak calculator's maths. The cell from the lattice fringe (${aFringe.toFixed(3)} Å) puts a line at 87.62°, next to the quoted end of the pattern; the cell from reading the first peak as (111) does not.`));
  md = inject(md, 'ladder', figure(fig2, 'Figure 2. The ring-radius ratios an indexer actually works from. With seven rings the ladder fits a diamond-cubic lattice as well as a spinel; the two extra rungs from (222) and (511) break the tie.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
