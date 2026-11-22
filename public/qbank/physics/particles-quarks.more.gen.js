// Extra question shapes for particles-quarks (templates pqk-m31..m35). Imported by particles-quarks.js.
import { choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

export default [
  { id: 'pqk-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'classification', format: 'statements',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['leptons do not feel the strong interaction', true, 'They carry no colour.'],
        ['all mesons are bosons', true, 'A quark and an antiquark give integer spin.'],
        ['all baryons are fermions', true, 'Three quarks give half-integer spin.'],
        ['gluons carry colour charge', true, 'That is why gluons interact with each other.'],
        ['the photon carries electric charge', false, 'The photon is neutral; it couples to charge but has none.'],
        ['the top quark forms long-lived hadrons like the other quarks', false, 'It decays (in about $5\\times10^{-25}$ s) before it can hadronise.'],
        ['the tau lepton is heavier than the proton', true, '$m_\\tau = 1.777$ GeV against 0.938 GeV.'],
        ['neutrinos take part only in weak (and gravitational) interactions', true, 'They have no charge and no colour.'],
        ['the W boson has a mass of about 80 GeV', true, '$m_W = 80.4$ GeV, $m_Z = 91.2$ GeV.'],
        ['mesons are made of three quarks', false, 'Mesons are quark-antiquark; baryons have three quarks.'],
      ], { not });
      return { q: `Which of the following statements about elementary particles are ${nt(not)}?`, ...m,
        trap: 'Spin follows the number of quarks: odd number fermion, quark-antiquark boson.' };
    } },
  { id: 'pqk-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Standard Model',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the Higgs boson has a mass of about 125 GeV', true, 'Discovered at the LHC in 2012.'],
        ['there are eight gluons', true, 'They form the adjoint (octet) of colour SU(3).'],
        ['the weak force is short-ranged because its carriers are massive', true, 'Range $\\sim \\hbar/(m_Wc) \\approx 2.5\\times10^{-3}$ fm.'],
        ['neutral weak currents are carried by the Z boson', true, 'Discovered in 1973 in neutrino scattering.'],
        ['the strong coupling becomes weaker at short distances', true, 'Asymptotic freedom: $\\alpha_s$ falls as the momentum transfer grows.'],
        ['the strong coupling becomes weaker at large distances', false, 'It grows at large distances, which confines quarks.'],
        ['free quarks have been observed in isolation', false, 'Colour confinement: only colour-singlet hadrons are seen.'],
        ['gluons are massive, which makes the strong force short-ranged', false, 'Gluons are massless; the short range comes from confinement.'],
      ], not);
      return { q: `Which statement about the Standard Model is ${nt(not)}?`, ...m,
        trap: 'Weak: short range from heavy carriers. Strong: short range from confinement, with massless gluons.' };
    } },
  { id: 'pqk-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'evidence', format: 'match',
    make(r) {
      const L = {
        part: 'nucleons contain point-like charged constituents',
        col: 'quarks carry a three-valued colour quantum number',
        su3: 'hadrons fall into SU(3) flavour multiplets',
        glu: 'gluons exist',
        gen: 'there are three light neutrino species',
        charm: 'a fourth (charm) quark exists',
      };
      const cas = choose(r, [
        ['Scaling (Bjorken scaling) in deep inelastic electron-proton scattering', 'part', 'Structure functions depending only on $x$ mean scattering off point-like partons.'],
        ['The existence of the $\\Delta^{++}$ ($uuu$, spin 3/2, symmetric in space, spin and flavour)', 'col', 'An antisymmetric colour wavefunction rescues the Pauli principle.'],
        ['The ratio $R = \\sigma(e^+e^- \\to \\text{hadrons})/\\sigma(e^+e^- \\to \\mu^+\\mu^-)$ being three times $\\sum Q_q^2$', 'col', 'Each quark flavour comes in three colours.'],
        ['The discovery of the $\\Omega^-$ at the predicted mass', 'su3', 'Its mass completed the equal spacing of the baryon decuplet.'],
        ['Three-jet events in $e^+e^-$ annihilation', 'glu', 'The third jet is a hard gluon radiated by a quark.'],
        ['The total width of the Z boson', 'gen', 'Each light neutrino adds an invisible decay channel; the width fits $N_\\nu = 3$.'],
        ['The very narrow $J/\\psi$ resonance at 3.1 GeV', 'charm', 'A $c\\bar c$ state below the threshold for charmed mesons, narrow because of the OZI rule.'],
      ]);
      return { q: `Observation: ${cas[0]}. This is the classic evidence that`, ...matchOne(r, L, cas),
        trap: 'Colour has two classic pieces of evidence: the $\\Delta^{++}$ and the R ratio.' };
    } },
  { id: 'pqk-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'colour', format: 'limiting case',
    make(r) {
      const band = choose(r, [[1.5, 2.5, '2', 2, 'u, d, s'], [5, 9, '\\tfrac{10}{3}', 10 / 3, 'u, d, s, c'], [12, 40, '\\tfrac{11}{3}', 11 / 3, 'u, d, s, c, b']]);
      const rs = choose(r, [band[0], band[1], (band[0] + band[1]) / 2]).toFixed(1);
      const all = ['2', '\\tfrac{10}{3}', '\\tfrac{11}{3}', '5', '\\tfrac23', '\\tfrac{10}{9}', '\\tfrac{11}{9}'];
      const o = mcqOptions(r, `$${band[2]}$`, shuffle(r, all.filter((s) => s !== band[2])).map((s) => `$${s}$`));
      return { q: `Away from resonances, the quark-model value of $R = \\sigma(e^+e^- \\to \\text{hadrons})/\\sigma(e^+e^- \\to \\mu^+\\mu^-)$ at $\\sqrt s = ${rs}$ GeV (lowest order, no QCD corrections) is`,
        options: o.options, answer: o.answer,
        sol: `$R = N_c\\sum_q Q_q^2$ over quarks light enough to be pair-produced. At ${rs} GeV these are ${band[4]}: $R = 3(\\tfrac49 + \\tfrac19 + \\tfrac19${band[3] > 2 ? ' + \\tfrac49' : ''}${band[3] > 3.5 ? ' + \\tfrac19' : ''}) = ${band[2]}$.`,
        trap: 'Forgetting the factor 3 for colour gives a third of the measured value; forgetting a threshold misses a flavour.' };
    } },
  { id: 'pqk-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'widths and lifetimes', format: 'order of magnitude',
    make(r) {
      const [p, t, why] = choose(r, [
        ['$\\pi^0$', 8.5e-17, 'It decays electromagnetically to $\\gamma\\gamma$.'],
        ['$\\pi^+$', 2.6e-8, 'It decays weakly to $\\mu^+\\nu_\\mu$.'],
        ['$\\mu^-$', 2.2e-6, 'A weak decay with a small energy release ($m_\\mu^5$ scaling).'],
        ['$\\Delta^{++}(1232)$', 5.6e-24, 'A strong decay to $p\\pi^+$: width about 117 MeV.'],
        ['$\\Sigma^0$', 7.4e-20, 'An electromagnetic decay to $\\Lambda\\gamma$.'],
        ['$\\tau^-$', 2.9e-13, 'A weak decay with a large energy release.'],
        ['$K^+$', 1.24e-8, 'A weak, strangeness-changing decay.'],
        ['$\\Lambda$', 2.6e-10, 'A weak, strangeness-changing decay to $N\\pi$.'],
      ]);
      const o = orderOpts(r, t, '\\text{s}');
      return { q: `The mean lifetime of the ${p} is of order`, options: o.options, answer: o.answer,
        sol: `$\\tau \\approx ${sci(t)}$ s. ${why} Rough scales: strong decays $10^{-23}$ s, electromagnetic $10^{-20}$ to $10^{-16}$ s, weak $10^{-13}$ s and longer.`,
        trap: 'The interaction responsible sets the scale: strong, electromagnetic and weak lifetimes differ by many orders of magnitude.' };
    } },
];
