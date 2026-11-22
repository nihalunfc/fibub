// Extra question shapes for radioactive-decays (templates rdk-m31..m35). Imported by radioactive-decays.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

export default [
  { id: 'rdk-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'electron capture', format: 'statements',
    make(r) {
      const D = choose(r, [0.35, 0.6, 0.85, 1.3, 1.7, 2.4]), bp = D > 1.022, not = r() < 0.5;
      const m = msqOf(r, [
        [`with an atomic mass difference of ${D} MeV (parent above daughter), $\\beta^+$ decay is energetically possible`, bp, `$\\beta^+$ needs $\\Delta M c^2 \\gt 2m_ec^2 = 1.022$ MeV; here ${D} MeV is ${bp ? 'above' : 'below'} that.`],
        [`with an atomic mass difference of ${D} MeV (parent above daughter), electron capture is energetically possible`, true, 'Capture needs only $\\Delta Mc^2 \\gt 0$ (more exactly, above the electron binding energy).'],
        ['the beta spectrum is continuous because three bodies share the energy', true, 'The neutrino carries off a variable share.'],
        ['Fermi transitions have $\\Delta I = 0$ and no change of parity', true, 'The Fermi operator is the isospin raising/lowering operator, a scalar in space.'],
        ['$0^+ \\to 0^+$ beta transitions are pure Fermi', true, 'Gamow-Teller ($\\Delta I = 0, \\pm1$) forbids $0 \\to 0$.'],
        ['allowed transitions change the parity of the nucleus', false, 'Allowed transitions have $l = 0$ for the lepton pair, so no parity change.'],
        ['first-forbidden transitions involve a change of parity', true, 'The leptons carry $l = 1$.'],
        ['Gamow-Teller transitions can connect two $0^+$ states', false, 'GT needs $\\Delta I = 0, \\pm1$ with $0 \\to 0$ excluded.'],
      ], { not });
      return { q: `Which of the following statements about beta decay are ${nt(not)}?`, ...m,
        trap: 'With atomic masses, $\\beta^+$ needs a difference above $2m_ec^2$; electron capture needs only a positive difference.' };
    } },
  { id: 'rdk-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'alpha decay',
    make(r) {
      const A = choose(r, [210, 222, 226, 238, 240]), Q = choose(r, [4.27, 4.87, 5.59, 6.11, 7.83]), Ea = (Q * (A - 4)) / A, not = r() < 0.5;
      const m = oneOf(r, [
        [`for $Q = ${Q}$ MeV and parent $A = ${A}$, the alpha particle carries about ${Ea.toFixed(2)} MeV`, true, `Momentum balance gives $E_\\alpha = Q(A - 4)/A = ${Ea.toFixed(2)}$ MeV; the daughter recoils with the rest.`],
        [`for $Q = ${Q}$ MeV and parent $A = ${A}$, the alpha particle carries all ${Q} MeV`, false, `The daughter recoils: $E_\\alpha = Q(A - 4)/A = ${Ea.toFixed(2)}$ MeV.`],
        ['alpha energies from a given transition are discrete', true, 'Two-body decay fixes the energies.'],
        ['the alpha particle escapes by tunnelling through a Coulomb barrier higher than its energy', true, 'The barrier for heavy nuclei is about 25-30 MeV against $E_\\alpha$ of 4-9 MeV.'],
        ['a small increase of $Q$ shortens the half-life enormously', true, 'Geiger-Nuttall: $\\log t_{1/2}$ is linear in $Z/\\sqrt{Q}$; half-lives span over 20 orders of magnitude.'],
        ['emitting the alpha with orbital angular momentum $l \\gt 0$ makes the decay faster', false, 'The centrifugal barrier adds to the Coulomb barrier and slows it.'],
        ['alpha decay lowers $Z$ by 2 and $A$ by 2', false, 'The alpha carries 2 protons and 2 neutrons: $Z$ falls by 2 and $A$ by 4.'],
        ['alpha half-lives of heavy nuclei all lie within a factor of about 100 of each other', false, 'They span from microseconds to over $10^{17}$ years.'],
        ['heavy nuclei emit alphas rather than single protons mainly because ${}^4$He is so tightly bound', true, 'The large binding of the alpha makes $Q_\\alpha$ positive while $Q_p$ is negative.'],
      ], not);
      return { q: `Which statement about alpha decay is ${nt(not)}?`, ...m,
        trap: 'The alpha kinetic energy is a little less than $Q$: the daughter recoil takes $4Q/A$.' };
    } },
  { id: 'rdk-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'decay modes', format: 'match',
    make(r) {
      const L = { bm: '$\\beta^-$ decay', bp: '$\\beta^+$ decay or electron capture', a: 'alpha decay', it: 'isomeric transition (gamma emission or internal conversion)', sf: 'spontaneous fission', p: 'proton emission' };
      const cas = choose(r, [
        ['A nucleus lying well on the neutron-rich side of the valley of stability', 'bm', 'Converting a neutron into a proton moves it toward the valley.'],
        ['A nucleus lying on the proton-rich side of the valley of stability', 'bp', 'Converting a proton into a neutron moves it toward the valley.'],
        ['A heavy nucleus with $Z \\gt 82$ near the valley of stability', 'a', 'Heavy nuclei shed charge and mass most easily as a tightly bound alpha.'],
        ['A long-lived excited state of a nucleus that differs from the ground state by a large spin', 'it', 'It decays to the ground state of the same nucleus by a slow high-multipole gamma (or conversion electron).'],
        ['A very heavy nucleus such as ${}^{252}$Cf (large $Z^2/A$)', 'sf', 'Large $Z^2/A$ lowers the fission barrier; ${}^{252}$Cf has a 3% fission branch and is a neutron source.', ['a']],
        ['A nucleus beyond the proton drip line', 'p', 'The last proton is unbound and leaves by tunnelling through the Coulomb barrier.', ['bp']],
      ]);
      return { q: `${cas[0]} most typically decays by`, ...matchOne(r, L, cas),
        trap: 'Decay modes follow position on the chart: neutron-rich $\\beta^-$, proton-rich $\\beta^+$/EC, heavy alpha or fission.' };
    } },
  { id: 'rdk-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Kurie plot', format: 'graph in words',
    make(r) {
      const L = {
        line: 'a straight line meeting the energy axis at the endpoint',
        bend: 'straight over most of the range, but bending down to meet the axis slightly before the endpoint',
        curve: 'curved over the whole range unless a shape factor is included',
        lines: 'a set of sharp, discrete lines',
        enh: 'a continuous spectrum enhanced at low energies',
        sup: 'a continuous spectrum suppressed at low energies',
      };
      const cas = choose(r, [
        ['the Kurie plot of an allowed beta transition with a massless neutrino', 'line', 'For allowed decays $\\sqrt{N(p)/(p^2F)} \\propto (E_0 - E)$, linear in $E$ with intercept $E_0$.'],
        ['the Kurie plot of an allowed beta transition if the neutrino had a small mass', 'bend', 'Near the endpoint the factor $\\sqrt{(E_0 - E)^2 - m_\\nu^2c^4}$ replaces $(E_0 - E)$: the plot curls down and ends at $E_0 - m_\\nu c^2$.'],
        ['the Kurie plot of a unique first-forbidden transition', 'curve', 'The lepton $l = 1$ brings an energy-dependent shape factor; dividing it out restores the line.'],
        ['the energy spectrum of internal-conversion electrons', 'lines', 'Each electron gets $E_\\gamma - B_{\\text{shell}}$: one line per shell (K, L, M, ...).'],
        ['the energy spectrum of electrons in $\\beta^-$ decay of a heavy nucleus', 'enh', 'The Coulomb attraction of the daughter pulls electrons back, piling them up at low energy (Fermi function above 1).'],
        ['the energy spectrum of positrons in $\\beta^+$ decay of a heavy nucleus', 'sup', 'Coulomb repulsion pushes positrons out, emptying the low-energy end.'],
      ]);
      return { q: `Described in words, ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'A Kurie plot is straight only for allowed transitions with $m_\\nu = 0$; conversion electrons are lines, not a continuum.' };
    } },
  { id: 'rdk-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'activity', format: 'order of magnitude',
    make(r) {
      const [nm, A, T, tu] = choose(r, [['${}^{226}$Ra', 226, 1600, 'y'], ['${}^{60}$Co', 60, 5.27, 'y'], ['${}^{14}$C', 14, 5730, 'y'], ['${}^{238}$U', 238, 4.47e9, 'y'], ['${}^{137}$Cs', 137, 30.1, 'y'], ['${}^{131}$I', 131, 8.02, 'd']]);
      const m = choose(r, [1e-6, 1e-3, 1]), Ts = T * (tu === 'y' ? 3.156e7 : 86400);
      const N = (m / A) * 6.022e23, x = (Math.LN2 * N) / Ts, o = orderOpts(r, x, '\\text{Bq}');
      const mt = m === 1 ? '1 g' : m === 1e-3 ? '1 mg' : '1 µg';
      return { q: `The activity of ${mt} of ${nm} (half-life $${sci(T)}$${tu === 'y' ? 'years' : 'days'}) is about`, options: o.options, answer: o.answer,
        sol: `$N = (${sci(m)}/${A})(6.02\\times10^{23}) = ${sci(N)}$ nuclei; $T_{1/2} = ${sci(Ts)}$ s. Activity $= N\\ln2/T_{1/2} = ${sci(x)}$ Bq.`,
        trap: 'Convert the half-life to seconds before dividing; 1 year $\\approx 3.16\\times10^7$ s.' };
    } },
];
