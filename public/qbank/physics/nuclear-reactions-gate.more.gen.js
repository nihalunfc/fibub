// Extra question shapes for nuclear-reactions-gate (templates nrg-m31..m35). Imported by nuclear-reactions-gate.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'nrg-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'compound nucleus', format: 'statements',
    make(r) {
      const G = choose(r, [0.1, 1, 10, 100]), tau = 6.582e-16 / G, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a compound-nucleus resonance of width ${G} eV has a lifetime of about $${sci(tau)}$ s`, `a compound-nucleus resonance of width ${G} eV has a lifetime of about $${sci(tau * 1e6)}$ s`, `$\\tau = \\hbar/\\Gamma = 6.58\\times10^{-16}\\text{ eV s}/${G}\\text{ eV} = ${sci(tau)}$ s.`),
        ['the decay of a compound nucleus is roughly independent of how it was formed', true, 'Bohr\'s independence hypothesis: the energy is shared among many nucleons long before anything escapes.'],
        ['compound-nucleus angular distributions are symmetric about $90^\\circ$ in the centre-of-mass frame', true, 'With the memory of the beam direction lost (apart from angular momentum), forward and backward are alike.'],
        ['direct reactions take about the time a nucleon needs to cross the nucleus, $\\sim 10^{-22}$ s', true, '$2R/v \\approx 10^{-14}\\text{ m}/10^{7}\\text{ m/s}$.'],
        ['direct reactions give angular distributions peaked in the forward direction', true, 'A single quick interaction transfers little momentum, and the pattern shows diffraction structure.'],
        ['compound-nucleus angular distributions are strongly forward peaked', false, 'They are nearly isotropic, symmetric about $90^\\circ$.'],
        ['the spectrum of particles evaporated from a compound nucleus looks roughly Maxwellian', true, 'The excited nucleus behaves like a hot drop with a nuclear temperature of about 1 MeV.'],
        ['a direct reaction involves many collisions among all the nucleons', false, 'That describes the compound nucleus; a direct reaction touches only a few nucleons.'],
      ], { not });
      return { q: `Which of the following statements about reaction mechanisms are ${nt(not)}?`, ...m,
        trap: 'Narrow resonances mean long lifetimes: $\\tau = \\hbar/\\Gamma$.' };
    } },
  { id: 'nrg-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Q equation',
    make(r) {
      const Q = choose(r, [-1.2, -2.8, -4.1, -5.6]), [pa, ma] = choose(r, [['proton', 1], ['alpha particle', 4], ['deuteron', 2]]), MA = choose(r, [7, 12, 14, 16]);
      const Th = -Q * (1 + ma / MA), not = r() < 0.5;
      const m = oneOf(r, [
        [`a ${pa} on a target of mass number ${MA} needs at least ${Th.toFixed(2)} MeV of lab kinetic energy for a reaction with $Q = ${Q}$ MeV`, true, `Non-relativistic threshold $T_{th} = -Q(1 + m_a/m_A) = ${-Q}(1 + ${ma}/${MA}) = ${Th.toFixed(2)}$ MeV.`],
        [`a ${pa} on a target of mass number ${MA} needs exactly ${-Q} MeV of lab kinetic energy for a reaction with $Q = ${Q}$ MeV`, false, `Part of the lab energy goes into centre-of-mass motion: $T_{th} = -Q(1 + m_a/m_A) = ${Th.toFixed(2)}$ MeV.`],
        ['an exothermic reaction induced by neutrons has no threshold', true, 'Neutrons feel no Coulomb barrier and $Q \\gt 0$ needs no extra energy.'],
        ['an exothermic reaction between charged nuclei can still be strongly suppressed at low energy', true, 'The Coulomb barrier must be tunnelled through.'],
        ['in the centre-of-mass frame all the kinetic energy is available for the reaction', true, 'The total momentum is zero there, so no energy is locked in overall motion.'],
        ['the fraction of the lab kinetic energy available in the CM frame is $m_A/(m_a + m_A)$', true, 'For a target at rest, $T_{cm} = T_{lab}m_A/(m_a + m_A)$ non-relativistically.'],
        ['the fraction of the lab kinetic energy available in the CM frame is $m_a/(m_a + m_A)$', false, 'It is $m_A/(m_a + m_A)$: a heavy target leaves most energy available.'],
        ['for a given negative $Q$, a heavier projectile on the same target has a lower lab threshold', false, 'The threshold $-Q(1 + m_a/m_A)$ grows with the projectile mass.'],
        ['an exothermic reaction between two charged nuclei proceeds readily at any bombarding energy', false, 'Below the Coulomb barrier it needs tunnelling and the rate falls steeply.'],
      ], not);
      return { q: `Which statement about reaction energetics is ${nt(not)}?`, ...m,
        trap: 'Threshold exceeds $|Q|$ because momentum conservation keeps some energy in centre-of-mass motion.' };
    } },
  { id: 'nrg-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cross-sections', format: 'graph in words',
    make(r) {
      const L = {
        v: 'falls as $1/v$, that is as $E^{-1/2}$',
        bw: 'shows a sharp Lorentzian peak of width $\\Gamma$ around one energy',
        gam: 'rises extremely steeply with energy, roughly as $e^{-b/\\sqrt E}$',
        bd: 'levels off at a constant value of about $2\\pi R^2$',
        th: 'is zero below a threshold and then rises as $\\sqrt{E - E_{th}}$',
      };
      const cas = choose(r, [
        ['slow-neutron capture (far from resonances)', 'v', 'The capture probability is proportional to the time the neutron spends near the nucleus, $\\propto 1/v$.'],
        ['an isolated neutron resonance', 'bw', 'Breit-Wigner: $\\sigma \\propto \\Gamma^2/[(E - E_R)^2 + \\Gamma^2/4]$.'],
        ['a charged-particle reaction well below the Coulomb barrier', 'gam', 'The tunnelling (Gamow) factor $e^{-2\\pi\\eta}$ with $\\eta \\propto 1/v$ dominates.'],
        ['very high-energy neutrons on a heavy nucleus (total cross-section)', 'bd', 'A black disc absorbs $\\pi R^2$ and diffracts (shadow scattering) another $\\pi R^2$.'],
        ['an endothermic neutron-induced reaction with outgoing neutrons, just above threshold', 'th', 'The outgoing s-wave phase space grows as the outgoing momentum, $\\propto \\sqrt{E - E_{th}}$.'],
      ]);
      return { q: `As a function of bombarding energy, the cross-section for ${cas[0]}`, ...matchOne(r, L, cas),
        trap: 'Neutral and charged projectiles behave oppositely at low energy: $1/v$ growth against Coulomb suppression.' };
    } },
  { id: 'nrg-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cross-sections', format: 'limiting case',
    make(r) {
      const A = choose(r, [27, 64, 125, 208, 238]), R = 1.2 * Math.cbrt(A), s = (2 * Math.PI * R * R) / 100;
      const f = (x) => `${x.toFixed(2)} b`;
      const o = mcqOptions(r, s, [s / 2, 2 * s, s / 4, 4 * s], f);
      return { q: `In the high-energy limit (wavelength much smaller than the nucleus), treat a nucleus with $A = ${A}$ as a black disc of radius $R = 1.2A^{1/3}$ fm. Its total cross-section for neutrons is about`,
        options: o.options, answer: o.answer,
        sol: `$R = 1.2(${A})^{1/3} = ${R.toFixed(2)}$ fm. Absorption $\\pi R^2$ plus an equal amount of diffraction (shadow) scattering gives $\\sigma_{tot} = 2\\pi R^2 = ${(2 * Math.PI * R * R).toFixed(0)}\\text{ fm}^2 = ${s.toFixed(2)}$ b (1 b = 100 fm$^2$).`,
        trap: 'The black disc has total cross-section $2\\pi R^2$, twice its geometric area: the shadow needs elastic scattering.' };
    } },
  { id: 'nrg-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'reaction rates', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const phi = choose(r, [1e10, 1e12, 1e14]), sg = choose(r, [0.3, 2.7, 37, 98]), [m, A, nm] = choose(r, [[1, 59, 'cobalt-59'], [0.1, 197, 'gold-197'], [10, 23, 'sodium-23']]);
        const N = (m / A) * 6.022e23; x = phi * sg * 1e-28 * N; unit = '\\text{s}^{-1}';
        q = `${m} g of ${nm} (capture cross-section ${sg} b) sits in a thermal neutron flux of $${sci(phi)}\\text{ cm}^{-2}\\text{s}^{-1}$. The number of captures per second is about`;
        sol = `$N = (${m}/${A})(6.02\\times10^{23}) = ${sci(N)}$; rate $= \\phi\\sigma N = ${sci(phi * 1e4)}\\text{ m}^{-2}\\text{s}^{-1}\\times${sg}\\times10^{-28}\\text{ m}^2\\times${sci(N)} = ${sci(x)}$ s$^{-1}$.`;
      } else {
        const sg = choose(r, [0.1, 1, 5, 20]), n = choose(r, [[8.5e28, 'copper'], [6.0e28, 'aluminium'], [3.3e28, 'lead']]);
        x = 1 / (n[0] * sg * 1e-28); unit = '\\text{m}';
        q = `Neutrons with total cross-section ${sg} b per atom move through ${n[1]} ($n = ${sci(n[0])}$ atoms/m$^3$). Their mean free path is about`;
        sol = `$\\lambda = 1/(n\\sigma) = 1/(${sci(n[0])}\\times${sg}\\times10^{-28}) = ${sci(x)}$ m.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: '1 barn = $10^{-28}$ m$^2$ = $10^{-24}$ cm$^2$; keep flux and area in the same units.' };
    } },
];
