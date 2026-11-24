// Figures for src/blog/discoveries/si-doped-algao3-film-degenerate-carrier-concentration-fermi-level.md,
// made with the maths of the Carrier concentration tool (src/lib/sci/carriers.ts).
// Run: node scripts/blog-figures/si-doped-algao3-film-degenerate-carrier-concentration-fermi-level.mjs
import fs from 'node:fs';
import { solve, sweep, effDos, varshni, fermiHalf, freezeOutTemperature, regime, KB } from '../../src/lib/sci/carriers.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/si-doped-algao3-film-degenerate-carrier-concentration-fermi-level.md', import.meta.url);

// From the paper (abstract only; the full text was not reachable from here): Hosaka S, Kanegae K, Miyake H,
// Nishinaka H (2025), AIP Advances 15(3): 035045, doi:10.1063/5.0257101 (CC BY 4.0). Best film: conductivity
// 971 S/cm, carrier concentration 6.21e20 cm-3, Hall mobility 9.8 cm2/Vs; a film of about 1.5e19 cm-3 at a silicon
// supply near 1e19 cm-3; Fe from the substrate below 1e18 cm-3; temperature-dependent Hall measurements.
const N_HI = 6.21e20, MU = 9.8, SIGMA = 971, N_LO = 1.5e19;
const E = 1.602176634e-19;

// Material: a beta-(AlxGa1-x)2O3 host, rounded. Eg0 5.2 eV and the Varshni terms are OUR assumption; the electron
// mass 0.28 m0 is the value usually quoted for beta-Ga2O3's nearly isotropic conduction band, and the hole mass
// 2.0 m0 stands for its very flat valence band (OUR assumption). Nothing below depends on the holes.
const M = { Eg0: 5.2, alpha: 5e-4, beta: 650, me: 0.28, mh: 2.0 };
const dop = (Nd) => ({ Nd, Ed: 0.03, gd: 2, Na: 0, Ea: 0.03, ga: 4 }); // shallow Si donors, 30 meV (our assumption)

const T0 = 300, Nc = effDos(M.me, T0), kT = KB * T0;
// Reduced Fermi level eta = (EF - Ec)/kT that gives an electron density n: bisection on n = Nc F1/2(eta).
function eta(n) { let lo = -40, hi = 400; for (let i = 0; i < 300; i++) { const m = (lo + hi) / 2; if (Nc * fermiHalf(m) < n) lo = m; else hi = m; } return (lo + hi) / 2; }

const films = [{ label: 'Best film', n: N_HI }, { label: 'Lightly doped film', n: N_LO }].map((f) => ({
  ...f, nOverNc: +(f.n / Nc).toPrecision(4),
  etaFD: +eta(f.n).toFixed(3), EfFD: +(eta(f.n) * kT).toFixed(4), F12: +fermiHalf(eta(f.n)).toPrecision(4),
  etaBoltz: +Math.log(f.n / Nc).toFixed(3), EfBoltz: +(Math.log(f.n / Nc) * kT).toFixed(4),
  bm: +(eta(f.n) * kT * (1 + M.me / M.mh)).toFixed(3),
}));
// What the hydrogenic donor model says if the measured density is typed in as a donor density.
const naive = solve(T0, M, dop(N_HI));
const out = {
  Eg300: +varshni(T0, M.Eg0, M.alpha, M.beta).toFixed(4), Nc: +Nc.toPrecision(4), kT: +kT.toFixed(5),
  sigmaFromNmu: +(N_HI * E * MU).toFixed(1), sigmaPaper: SIGMA, rhoPaper: +(1000 / SIGMA).toFixed(4), muForSigma: +(SIGMA / (N_HI * E)).toFixed(3),
  boltzN: +(Nc * Math.exp(eta(N_HI))).toPrecision(4),
  films,
  naive: { n: +naive.n.toPrecision(4), ionised: +(naive.NdIon / N_HI).toFixed(5), EFaboveEc: +(naive.EF - naive.Eg).toFixed(4), flag: naive.degenerate, regime: regime(naive, dop(N_HI)) },
  mott: +((0.26 / ((0.0529 * 10) / M.me)) ** 3 * 1e21).toPrecision(3), // cm-3: a0* in nm, (0.26/a0*)^3 nm-3 -> cm-3
  freeze: [1e16, 1e17, 1e18].map((Nd) => ({ Nd, T90: +freezeOutTemperature(M, dop(Nd)).toFixed(1), n300: +solve(T0, M, dop(Nd)).n.toPrecision(3) })),
  ni300: +solve(T0, M, dop(0)).ni.toPrecision(3),
};

// Figure 1: the Fermi level against electron density, exact and with the Boltzmann shortcut.
const ns = Array.from({ length: 161 }, (_, i) => 10 ** (16 + (i * 5) / 160));
const fig1 = chart({
  title: 'Where the Fermi level sits at 300 K', xLabel: 'Electrons n (cm⁻³, log scale)', yLabel: 'EF − Ec (eV)',
  series: [
    { name: 'Fermi-Dirac (exact)', kind: 'line', x: ns.map((n) => Math.log10(n)), y: ns.map((n) => eta(n) * kT) },
    { name: 'Boltzmann shortcut', kind: 'line', dash: '5 4', x: ns.map((n) => Math.log10(n)), y: ns.map((n) => Math.log(n / Nc) * kT) },
  ],
  xDomain: [16, 21], yDomain: [-0.25, 1.1], xTicks: [16, 17, 18, 19, 20, 21], xFmt: (t) => `1e+${t}`,
  hlines: [{ y: 0, text: 'conduction band edge' }],
  vlines: [{ x: Math.log10(N_LO), text: '1.5e19', left: true, dy: 44 }, { x: Math.log10(N_HI), text: '6.21e20', left: true, dy: 14 }],
  desc: `Fermi level measured from the conduction band edge against electron density at 300 K. The exact Fermi-Dirac curve reaches ${films[0].EfFD} eV above the edge at 6.21e20 cm-3, while the Boltzmann shortcut gives only ${films[0].EfBoltz} eV.`,
  height: 290,
});

// Figure 2: freeze-out in the regime where the donor model does apply, with the Mott density and the two films.
const sw = [1e16, 1e17, 1e18].map((Nd) => sweep(M, dop(Nd), 20, 600, 110));
const fig2 = chart({
  title: 'Freeze-out happens only well below the Mott density', xLabel: 'Temperature (K)', yLabel: 'Electrons n (cm⁻³, log scale)',
  series: sw.map((s, i) => ({ name: ['10¹⁶ donors', '10¹⁷ donors', '10¹⁸ donors'][i], kind: 'line', x: s.map((p) => p.T), y: s.map((p) => Math.log10(p.n)) })),
  xDomain: [20, 600], yDomain: [12, 21.4], yTicks: [12, 14, 16, 18, 20], yFmt: (t) => `1e+${t}`,
  hlines: [{ y: Math.log10(out.mott), text: `Mott density ${out.mott.toExponential(1)} cm⁻³` }, { y: Math.log10(N_HI), text: 'the paper\'s best film, 6.21e20' }],
  desc: 'Electron density against temperature for donor densities of 1e16, 1e17 and 1e18 cm-3 with 30 meV donors. All three lose carriers as the temperature falls. The paper\'s films sit far above the Mott density, where donor levels have merged with the band and freeze-out cannot happen.',
  height: 290,
});

console.log(JSON.stringify(out, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ef', figure(fig1, 'Figure 1. The Fermi level at 300 K against electron density, worked out exactly with the Fermi-Dirac integral F½ and with the Boltzmann shortcut, for an electron mass of 0.28 m₀. The dashed marks are the paper\'s two films; at the higher one the shortcut is wrong by more than 0.8 eV.'));
  md = inject(md, 'nt', figure(fig2, 'Figure 2. Electron density against temperature from charge neutrality with partly ionised 30 meV donors, in our β-(AlxGa1−x)2O3-like material. Freeze-out is a lightly doped phenomenon: the paper\'s films are hundreds of times above the Mott density, so their carrier density is flat and a temperature-dependent Hall measurement on them reads scattering, not activation.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
