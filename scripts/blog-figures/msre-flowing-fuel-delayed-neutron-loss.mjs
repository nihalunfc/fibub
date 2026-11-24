// Figures for src/blog/discoveries/msre-flowing-fuel-delayed-neutron-loss.md, made with the maths of the
// Point kinetics tool (src/lib/sci/eng-pointkinetics.ts: six-group point kinetics, inhour equation, prompt jump).
// Run: node scripts/blog-figures/msre-flowing-fuel-delayed-neutron-loss.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { simulate, inhourRoots, promptJump, betaTotal } from '../../src/lib/sci/eng-pointkinetics.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/msre-flowing-fuel-delayed-neutron-loss.md', import.meta.url);

// Six-group delayed-neutron data from the paper (Pfahl et al. 2025, Front. Nucl. Eng. 4: 1617048, CC BY 4.0,
// Table 4): group betas in pcm and decay constants in 1/s, for the MSRE's U-235 and U-233 fuel loadings.
const U235 = { beta: [22.84, 118.08, 112.78, 252.81, 103.84, 43.47], lam: [0.013336, 0.032739, 0.12078, 0.30278, 0.84949, 2.853] };
const U233 = { beta: [25.45, 68.22, 53.12, 104.95, 34.21, 12.28], lam: [0.012911, 0.034738, 0.11928, 0.28617, 0.7877, 2.4417] };
const LAMBDA = 4e-4; // prompt neutron generation time, OUR assumption (the paper does not report one)
const TAU_CORE = 9.4, TAU_LOOP = 25.2; // seconds in the core and round the whole fuel loop (MSRE design figures)

/**
 * Fraction of group-i delayed neutrons still emitted inside the core when the fuel circulates: plug flow,
 * production spread evenly over the core pass, steady state after many laps. Our own arithmetic, not the tool's.
 */
function retained(lam, tc = TAU_CORE, tL = TAU_LOOP) {
  const te = tL - tc, x = 1 - Math.exp(-lam * tc), y = Math.exp(-lam * te), z = 1 - Math.exp(-lam * tL);
  return 1 - (1 - (x * y) / z) * (x / (lam * tc));
}
const sum = (a) => a.reduce((s, v) => s + v, 0);
const kin = (betaPcm, lam) => ({ betas: betaPcm.map((b) => b * 1e-5), lambdas: lam, Lambda: LAMBDA });
const flowing = (f) => f.beta.map((b, i) => b * retained(f.lam[i]));

const SETS = [
  { name: 'U-235, fuel at rest', k: kin(U235.beta, U235.lam) },
  { name: 'U-235, fuel flowing', k: kin(flowing(U235), U235.lam) },
  { name: 'U-233, fuel at rest', k: kin(U233.beta, U233.lam) },
  { name: 'U-233, fuel flowing', k: kin(flowing(U233), U233.lam) },
];
// Same total as the paper's flowing U-235 value, but every group cut by the same fraction: the wrong way to do it.
const UNIFORM = kin(U235.beta.map((b) => (b * 431) / sum(U235.beta)), U235.lam);
// The per-group shape, renormalised to the paper's 431 pcm, to separate "how much" from "which groups".
const SHAPED431 = kin(flowing(U235).map((b) => (b * 431) / sum(flowing(U235))), U235.lam);

const RHO = 50e-5; // a 50 pcm step, small enough to be a routine control movement in any of these cores
const T_END = 40;
const times = Array.from({ length: 81 }, (_, i) => (i * T_END) / 80);
const run = (k) => { const s = simulate(k, { kind: 'step', rho: RHO }, T_END, { out: 80 }); return s; };

const fig1 = chart({
  title: 'Power after the same 50 pcm step', xLabel: 'Time after the step (s)', yLabel: 'Power (× the starting power)',
  series: SETS.map((s, i) => { const r = run(s.k); return { name: s.name, kind: 'line', x: r.t.map((t) => +t.toFixed(2)), y: r.n.map((n) => +Math.log10(n).toFixed(4)), colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][i] }; }),
  xDomain: [0, T_END], yDomain: [-0.02, 1.45], yTicks: [0, Math.log10(2), Math.log10(5), 1, Math.log10(20)], yFmt: (v) => String(+Math.pow(10, v).toPrecision(2)),
  desc: 'Power against time for the same 50 pcm reactivity step in four cases: U-235 and U-233 fuel, with the fuel salt still and circulating. The flowing U-233 core climbs about twenty times faster.', height: 290,
});

const rhos = Array.from({ length: 60 }, (_, i) => 10 + i * 2.5); // pcm
const periodOf = (k, pcm) => 1 / inhourRoots(k, pcm * 1e-5)[0];
const fig2 = chart({
  title: 'Stable period against reactivity', xLabel: 'Reactivity step (pcm)', yLabel: 'Stable period (s)',
  series: [
    { name: 'U-235 at rest (654 pcm)', kind: 'line', x: rhos, y: rhos.map((r) => +Math.log10(periodOf(SETS[0].k, r)).toFixed(4)) },
    { name: 'U-235 flowing (409 pcm)', kind: 'line', x: rhos, y: rhos.map((r) => +Math.log10(periodOf(SETS[1].k, r)).toFixed(4)) },
    { name: 'Cut evenly to 431 pcm', kind: 'line', x: rhos, y: rhos.map((r) => +Math.log10(periodOf(UNIFORM, r)).toFixed(4)), dash: '5 4', colour: 'var(--ink)' },
    { name: 'U-233 flowing (171 pcm)', kind: 'line', x: rhos, y: rhos.map((r) => +Math.log10(periodOf(SETS[3].k, r)).toFixed(4)), colour: 'var(--muted)' },
  ],
  xDomain: [10, 150], yDomain: [0.6, 2.9], yTicks: [1, Math.log10(20), Math.log10(50), 2, Math.log10(200), Math.log10(500)], yFmt: (v) => String(Math.round(Math.pow(10, v))),
  desc: 'The stable period from the inhour equation against the size of a reactivity step, for the four delayed-neutron sets. Losing delayed neutrons to the pump loop shortens the period several times over.', height: 300,
});

const report = {
  totals: { u235: +sum(U235.beta).toFixed(2), u233: +sum(U233.beta).toFixed(2), u235flow: +sum(flowing(U235)).toFixed(1), u233flow: +sum(flowing(U233)).toFixed(1) },
  retained: U235.lam.map((l) => +retained(l).toFixed(3)),
  flowGroups: flowing(U235).map((b) => +b.toFixed(1)),
  loss: { u235: +(100 * (1 - sum(flowing(U235)) / sum(U235.beta))).toFixed(1), u233: +(100 * (1 - sum(flowing(U233)) / sum(U233.beta))).toFixed(1) },
  cases: [...SETS, { name: 'cut evenly to 431 pcm', k: UNIFORM }, { name: 'per-group shape at 431 pcm', k: SHAPED431 }].map((s) => {
    const beta = betaTotal(s.k), r = run(s.k);
    return { name: s.name, betaPcm: +(beta * 1e5).toFixed(1), dollars: +(RHO / beta).toFixed(3), period: +periodOf(s.k, 50).toFixed(1), jump: +promptJump(beta, RHO).toFixed(3), n40: +r.n[r.n.length - 1].toFixed(2) };
  }),
  lambdaCheck: [2e-4, 4e-4, 8e-4].map((L) => +(1 / inhourRoots({ ...SETS[0].k, Lambda: L }, RHO)[0]).toFixed(2)),
  tauForPaper: (() => { let lo = 1, hi = 24; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; sum(U235.beta.map((b, i2) => b * retained(U235.lam[i2], m))) < 431 ? (lo = m) : (hi = m); } return +((lo + hi) / 2).toFixed(2); })(),
};
console.log(JSON.stringify(report, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. The Point kinetics tool’s six-group solver run with the paper’s own delayed-neutron data, for a 50 pcm step from critical. Height is a logarithmic scale. Nothing here feeds back: a real core would heat up and push back.'));
  md = inject(md, 'period', figure(fig2, 'Figure 2. Stable period from the inhour equation. The dashed line cuts every group by the same fraction to reach 431 pcm; the solid blue line loses the right amount from each group. Same total, different reactor.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
