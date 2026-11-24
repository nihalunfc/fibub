// Figures and numbers for src/blog/discoveries/coal-phase-out-regional-output-multipliers-leontief-inverse.md,
// made with the maths of the Input-output multipliers tool (src/lib/sci/leontief.ts).
// Run: node scripts/blog-figures/coal-phase-out-regional-output-multipliers-leontief-inverse.mjs
import fs from 'node:fs';
import { model, impact, satellite, productive } from '../../src/lib/sci/leontief.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/coal-phase-out-regional-output-multipliers-leontief-inverse.md', import.meta.url);

// Every input below is from Table 2 of Kizilkaya, Acar and Ozenc (2026), Front. Sustain. 7, doi:10.3389/frsus.2026.1811466
// (CC BY 4.0). Money in TRY thousand, jobs in persons, emissions in tCO2-eq. Nothing here is assumed.
const S = [
  { id: 'Coal mining', short: 'Coal mining', fd: 263780, own: 264083, oth: 4363, tot: 268446, vaOwn: 258589, vaOth: 2808, vaTot: 261397, jOwn: 392, jOth: 9, jTot: 401, ghg: 891, mult: 1.02 },
  { id: 'Coal-fired electricity', short: 'Coal power', fd: 629922, own: 798413, oth: 608238, tot: 1406651, vaOwn: 266736, vaOth: 365596, vaTot: 632331, jOwn: 1322, jOth: 630, jTot: 1952, ghg: 4748, mult: 2.23 },
  { id: 'Renewable electricity', short: 'Renewables', fd: 893702, own: 1026032, oth: 969656, tot: 1995688, vaOwn: 342779, vaOth: 554342, vaTot: 897121, jOwn: 86, jOth: 1278, jTot: 1364, ghg: 0, mult: 2.23 },
];

// ---- Step 1: read the Leontief inverse column and the satellite coefficients straight off the table.
const R = S.map((s) => {
  const Ljj = s.own / s.fd, Lrj = s.oth / s.fd, col = s.tot / s.fd;
  const vj = s.vaOwn / s.own, vr = s.vaOth / s.oth;             // value added per unit of output
  const ej = s.jOwn / s.own, er = s.jOth / s.oth;               // jobs per unit of output
  return {
    ...s, Ljj, Lrj, col, vj, vr, ej, er,
    vaIdentity: vj * Ljj + vr * Lrj,                            // must be exactly 1 in a consistent table
    jobsFd: (ej * Ljj + er * Lrj) * 1000,                       // jobs per million TRY of final demand
    jobsFdPaper: (s.jTot / s.fd) * 1000,
    jobsDirectFd: (s.jOwn / s.fd) * 1000,
    typeIown: s.jTot / s.jOwn,
    vjModel: (1 - vr * Lrj) / Ljj,                              // what a consistent model forces vj to be
  };
});

// ---- Step 2: rebuild a two-sector table (the sector and "the rest of the economy") from those numbers and
// let the tool's own model() reproduce the paper's column. a12 (what the rest of the economy buys from the
// sector per unit of its own output) is free: it changes no result below. 0.10 is OUR choice.
// a11 = 1 - (1 + a12*Lrj)/Ljj, so a12 must stay below (Ljj - 1)/Lrj for the flows to be positive.
const F_REST = 3_000_000;
const a12max = (r) => (r.Ljj - 1) / r.Lrj;
function rebuild(r, a12 = r.a12pick, fRest = F_REST) {
  const a22 = 1 - r.vr - a12;
  const D = (1 - a22) / r.Ljj;                                  // determinant of I - A
  const a21 = r.Lrj * D;
  const a11 = 1 - (D + a12 * a21) / (1 - a22);
  const A = [[a11, a12], [a21, a22]];
  const d = (1 - a11) * (1 - a22) - a12 * a21;
  const f = [r.fd, fRest];
  const x = [((1 - a22) * f[0] + a12 * f[1]) / d, (a21 * f[0] + (1 - a11) * f[1]) / d];
  const Z = A.map((row, i) => row.map((a, j) => Math.round(a * x[j])));
  const fd = x.map((xi, i) => Math.round(xi) - Z[i].reduce((s, v) => s + v, 0));
  const io = model(Z, fd);
  const dx = impact(io, [r.fd, 0]);
  const jobsTot = [Math.round(r.ej * x[0]), Math.round(r.er * x[1])];
  const jobs = satellite(io, jobsTot);
  return {
    a11, a12, a21, a22, Z, fd, x: io.x, io, dx, jobsTot, jobs,
    jobsEffect: dx.reduce((s, v, i) => s + v * jobs.coef[i], 0),
    vaEffect: dx.map((v, i) => v * (io.valueAdded[i] / io.x[i])),
    ok: productive(io).ok,
  };
}
R.forEach((r, i) => { r.a12max = a12max(r); r.a12pick = [0.03, 0.10, 0.05][i]; });
const B = R.map((r) => rebuild(r));
const SENS = [0, 0.05, 0.1, 0.2, 0.27].map((a12) => ({ a12, ...rebuild(R[1], a12) }));

// ---- Figures.
const xs = [1, 2, 3], names = R.map((r) => r.short);
const fig1 = chart({
  title: 'Output needed per 1 lira of final demand', xLabel: '', yLabel: 'Output (TRY per TRY)',
  series: [
    { name: 'The sector itself', kind: 'dots', x: xs, y: R.map((r) => +r.Ljj.toFixed(4)), size: 5 },
    { name: 'The rest of the economy', kind: 'dots', x: xs, y: R.map((r) => +r.Lrj.toFixed(4)), size: 5 },
    { name: 'Total (output multiplier)', kind: 'dots', x: xs, y: R.map((r) => +r.col.toFixed(4)), size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0.6, 3.4], yDomain: [0, 2.5], xTicks: xs, xFmt: (t) => names[t - 1],
  desc: 'Output per lira of final demand for the three sectors, split into the sector itself and the rest of the economy. Coal mining 1.001 and 0.017; coal power 1.267 and 0.966; renewables 1.148 and 1.085.',
  height: 260,
});
const fig2 = chart({
  title: 'Jobs per million lira of final demand', xLabel: '', yLabel: 'Jobs per TRY 1 million',
  series: [
    { name: 'In the sector itself', kind: 'dots', x: xs, y: R.map((r) => +r.jobsDirectFd.toFixed(3)), size: 5 },
    { name: 'All sectors together', kind: 'dots', x: xs, y: R.map((r) => +r.jobsFd.toFixed(3)), size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0.6, 3.4], yDomain: [0, 3.5], xTicks: xs, xFmt: (t) => names[t - 1],
  desc: 'Jobs per million lira of final demand. Coal mining 1.49 in the sector and 1.52 in all; coal power 2.10 and 3.10; renewable electricity 0.10 and 1.53.',
  height: 260,
});

const out = R.map((r, i) => ({
  id: r.id,
  Ljj: +r.Ljj.toFixed(5), Lrj: +r.Lrj.toFixed(5), colSum: +r.col.toFixed(5), multPaper: r.mult,
  a12max: +r.a12max.toFixed(4), a12pick: r.a12pick,
  vj: +r.vj.toFixed(5), vr: +r.vr.toFixed(5), vjModel: +r.vjModel.toFixed(5),
  vaIdentity: +r.vaIdentity.toFixed(5), vaOverFd: +(r.vaTot / r.fd).toFixed(5),
  jobsDirectFd: +r.jobsDirectFd.toFixed(3), jobsFd: +r.jobsFd.toFixed(3), jobsFdPaper: +r.jobsFdPaper.toFixed(3),
  typeIown: +r.typeIown.toFixed(3), typeI: +B[i].jobs.typeI[0].toFixed(3),
  rebuilt: { A: [B[i].a11, B[i].a12, B[i].a21, B[i].a22].map((v) => +v.toFixed(4)), Z: B[i].Z, fd: B[i].fd, x: B[i].x.map(Math.round), jobsRow: B[i].jobsTot,
    Lcol: B[i].io.L.map((row) => +row[0].toFixed(5)), mult: +B[i].io.multipliers[0].toFixed(5),
    dx: B[i].dx.map((v) => Math.round(v)), dxTotal: Math.round(B[i].dx[0] + B[i].dx[1]),
    jobs: +B[i].jobsEffect.toFixed(1), va: B[i].vaEffect.map((v) => Math.round(v)), vaTotal: Math.round(B[i].vaEffect[0] + B[i].vaEffect[1]), ok: B[i].ok },
}));
console.log(JSON.stringify(out, null, 1));
console.log('sensitivity', JSON.stringify(SENS.map((s) => ({ a12: s.a12, a11: +s.a11.toFixed(4), a21: +s.a21.toFixed(4), a22: +s.a22.toFixed(4), own: Math.round(s.dx[0]), oth: Math.round(s.dx[1]), jobs: +s.jobsEffect.toFixed(1) }))));
console.log('net jobs of the swap', R[2].jTot - R[0].jTot - R[1].jTot, 'lost', R[0].jTot + R[1].jTot, 'GHG avoided', R[0].ghg + R[1].ghg);
console.log('column-sum equality', +(R[2].col / R[1].col).toFixed(6), 'output ratio', +(R[2].tot / R[1].tot).toFixed(6), 'demand ratio', +(R[2].fd / R[1].fd).toFixed(6));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'inverse', figure(fig1, "Figure 1. The first column of the Leontief inverse for each sector, read straight off the paper's Table 2 by dividing its output effects by its final-demand shock. The black dots are the output multipliers the paper prints as 1.02, 2.23 and 2.23."));
  md = inject(md, 'jobs', figure(fig2, "Figure 2. Jobs per million lira of final demand, from the paper's employment effects. Coal mining and renewable electricity support almost the same number of jobs per lira of demand, but renewables put only one job in twenty inside the sector itself."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
