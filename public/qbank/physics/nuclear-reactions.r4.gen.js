// Round 4 extras for nuclear-reactions: original questions, written 2026-11-22.
import { choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;
const U = 931.494; // MeV per u
const M = { n: 1.008665, H1: 1.007825, H2: 2.014102, H3: 3.016049, He3: 3.016029, He4: 4.002603, Li6: 6.015122, Li7: 7.016003, B10: 10.012937, B11: 11.009305 };
const sum = (ks) => ks.reduce((s, k) => s + M[k], 0);
const qv = (a, b) => (sum(a) - sum(b)) * U;
const sig3 = (x) => +x.toPrecision(3);
const xi = (A) => { if (A === 1) return 1; const a = ((A - 1) / (A + 1)) ** 2; return 1 + a * Math.log(a) / (1 - a); };

export default {
  items: [
    { id: 'nrx-r4-01', type: 'mcq', level: 2, exams: ['jam'], sub: 'chain reaction',
      q: R`On average, how many neutrons are released when a uranium-235 nucleus undergoes fission after absorbing a slow neutron?`,
      options: [R`about 1`, R`about 2.4`, R`exactly 3`, R`about 10`], answer: 1,
      sol: R`Each fission releases two or three prompt neutrons (sometimes fewer or more), averaging about $2.4$ for U-235 with thermal neutrons, plus a small delayed fraction. A chain reaction needs one of them, on average, to cause another fission ($k = 1$); the rest are lost to leakage and capture.`,
      trap: R`Counting the neutrons in a single written equation (often 3) as the average.` },
    { id: 'nrx-r4-02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Q-value',
      q: R`In the fusion reaction $ {}^2\text{H} + {}^2\text{H} \to {}^3\text{He} + n$ (atomic masses $2.014102$, $3.016029$ and $1.008665$ u; $1$ u $= 931.494$ MeV$/c^2$), take the initial kinetic energy as negligible. The neutron's kinetic energy is ______ MeV (two decimal places).`,
      answer: 2.45, tol: 0.02, unit: 'MeV', calc: () => qv(['H2', 'H2'], ['He3', 'n']) * M.He3 / (M.He3 + M.n),
      sol: R`$Q = (2\times2.014102 - 3.016029 - 1.008665)\times931.494 = 0.003510\times931.494 = 3.27$ MeV. With zero total momentum the two products move apart with equal and opposite momenta, so the kinetic energies split inversely to the masses: $K_n = Q\dfrac{m_{\rm He}}{m_{\rm He} + m_n} = 3.27\times\dfrac{3.016}{4.025} = 2.45$ MeV. These 2.45 MeV neutrons are the signature of D-D fusion in plasma experiments.`,
      trap: R`Giving the neutron the whole $Q$, or splitting it equally.` },
    { id: 'nrx-r4-03', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'fusion',
      q: R`A D-T fusion plasma reaches ignition roughly when $n\tau_ET \ge 3\times10^{21}$ keV s m$^{-3}$. At $T = 15$ keV and ion density $n = 1.0\times10^{20}$ m$^{-3}$, the energy confinement time must be at least ______ s.`,
      answer: 2.0, tol: 0.02, unit: 's', calc: () => 3e21 / (1e20 * 15),
      sol: R`$\tau_E = \dfrac{3\times10^{21}}{nT} = \dfrac{3\times10^{21}}{10^{20}\times15} = 2.0$ s. Ignition means the alpha particles alone keep the plasma hot against losses; magnetic confinement aims for seconds at modest density, while inertial fusion uses enormous densities for nanoseconds.`,
      trap: R`Using $T$ in kelvin with a criterion written in keV.` },
    { id: 'nrx-r4-04', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'fission',
      q: R`In the liquid-drop model a nucleus becomes unstable against fission even without any barrier (it would fission instantly) when roughly`,
      options: [R`$Z/A \approx 0.5$`, R`$A \approx 238$`, R`$Z \approx 92$`, R`$Z^2/A \approx 50$`], answer: 3,
      sol: R`For a small deformation, the surface energy rises by $\tfrac25\epsilon^2E_S$ and the Coulomb energy falls by $\tfrac15\epsilon^2E_C$. The sphere becomes unstable when $E_C > 2E_S$, i.e. $\dfrac{a_cZ^2}{A^{1/3}} > 2a_sA^{2/3}$, so $\dfrac{Z^2}{A} > \dfrac{2a_s}{a_c} \approx \dfrac{2\times17.8}{0.71} \approx 50$. Uranium-238 has $Z^2/A = 35.6$, so it still has a barrier of about 6 MeV, and spontaneous fission is slow.`,
      trap: R`Treating uranium as the limit; it is the largest natural nucleus but well below the fissility limit.` },
    { id: 'nrx-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'cross-section',
      q: R`A nucleus has a capture cross-section of $680$ b for thermal neutrons ($0.0253$ eV) and follows the $1/v$ law. At $1.0$ eV (away from resonances) its capture cross-section is about`,
      options: [R`108 b`, R`17 b`, R`680 b`, R`4300 b`], answer: 0,
      sol: R`$\sigma \propto 1/v \propto 1/\sqrt E$, so $\sigma(1\text{ eV}) = 680\sqrt{0.0253/1.0} = 680\times0.159 = 108$ b. The $1/v$ law means the capture rate per nucleus, $n\sigma v$, is independent of speed: a slow neutron simply spends longer near the nucleus.`,
      trap: R`Scaling with $1/E$ gives 17 b; the law is in speed, not energy.` },
    { id: 'nrx-r4-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'kinematics',
      q: R`A thermal neutron is captured by a proton at rest, $n + p \to d + \gamma$, with the gamma ray carrying $2.2246$ MeV. The recoil kinetic energy of the deuteron ($M_dc^2 = 1875.6$ MeV) is ______ keV (two decimal places).`,
      answer: 1.32, tol: 0.02, unit: 'keV', calc: () => 2.2246 ** 2 / (2 * 1875.6) * 1000,
      sol: R`Momentum: the deuteron recoils with $p = E_\gamma/c$. Its kinetic energy is $\dfrac{p^2}{2M_d} = \dfrac{E_\gamma^2}{2M_dc^2} = \dfrac{2.2246^2}{2\times1875.6}$ MeV $= 1.32\times10^{-3}$ MeV $= 1.32$ keV. So the binding energy of the deuteron is $E_\gamma + E_R = 2.2246 + 0.0013 = 2.2259$ MeV (less the tiny neutron kinetic energy).`,
      trap: R`Ignoring the recoil makes the deduced binding energy too small by about 1.3 keV, a real error at keV-precision gamma spectroscopy.` },
    { id: 'nrx-r4-07', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'fusion', format: 'statements',
      q: R`About the CNO cycle in stars, which statements are correct?`,
      options: [R`Carbon, nitrogen and oxygen act as catalysts and are not used up`, R`It dominates over the proton-proton chain in stars more massive than about $1.3$ solar masses`, R`Its net result is $4p \to {}^4\text{He} + 2e^+ + 2\nu_e$`, R`It releases far more energy per helium nucleus than the proton-proton chain`], answer: [0, 1, 2],
      sol: R`The cycle passes $^{12}$C through N and O isotopes and returns it, turning four protons into a helium-4 nucleus, two positrons and two neutrinos. The energy released per helium nucleus is fixed by the masses, about 26.7 MeV, the same as in the pp chain (only the share carried off by neutrinos differs). Its steep temperature dependence ($\sim T^{17}$ versus $T^4$) makes it win in hotter, heavier stars.`,
      trap: R`The mass defect of $4p \to {}^4$He fixes the energy whatever the route.` },
    { id: 'nrx-r4-08', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'cross-section',
      q: R`Some nuclei have thermal-neutron absorption cross-sections of millions of barns, while their geometric size $\pi R^2$ is only about $1$ b. This is possible because`,
      options: [R`the nucleus swells when a slow neutron approaches`, R`the strong force has an infinite range for slow neutrons`, R`for slow neutrons the limit on an $s$-wave reaction cross-section is $\pi(\lambda/2\pi)^2$, which far exceeds $\pi R^2$, and resonances near zero energy approach it`, R`slow neutrons are absorbed by the atomic electrons`], answer: 2,
      sol: R`Unitarity limits the $s$-wave reaction cross-section to $\pi/k^2 = \pi(\lambda/2\pi)^2$. A $0.0253$ eV neutron has $\lambda = 0.18$ nm, so $\lambda/2\pi = 2.9\times10^4$ fm and $\pi(\lambda/2\pi)^2 \approx 2.6\times10^9$ fm$^2 \approx 2.6\times10^7$ b. A resonance close to thermal energy (as in $^{135}$Xe, about $2.6\times10^6$ b) gets near this wave limit. The neutron has no charge to interact with electrons appreciably.`,
      trap: R`Treating the nucleus as a classical target; at low energy the neutron's wavelength, not the nuclear size, sets the scale.` },
  ],
  gens: [
    { id: 'nrx-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Q-value',
      make(r) {
        const rx = choose(r, [
          { t: R`{}^2\text{H} + {}^2\text{H} \to {}^3\text{He} + n`, a: ['H2', 'H2'], b: ['He3', 'n'], light: 'n', heavy: 'He3', ln: 'neutron' },
          { t: R`{}^2\text{H} + {}^2\text{H} \to {}^3\text{H} + p`, a: ['H2', 'H2'], b: ['H3', 'H1'], light: 'H1', heavy: 'H3', ln: 'proton' },
          { t: R`{}^2\text{H} + {}^3\text{He} \to {}^4\text{He} + p`, a: ['H2', 'He3'], b: ['He4', 'H1'], light: 'H1', heavy: 'He4', ln: 'proton' },
          { t: R`n + {}^6\text{Li} \to {}^3\text{H} + {}^4\text{He}`, a: ['n', 'Li6'], b: ['H3', 'He4'], light: 'H3', heavy: 'He4', ln: 'triton' },
          { t: R`n + {}^{10}\text{B} \to {}^7\text{Li} + {}^4\text{He}`, a: ['n', 'B10'], b: ['Li7', 'He4'], light: 'He4', heavy: 'Li7', ln: 'alpha particle' },
          { t: R`p + {}^{11}\text{B} \to 3\,{}^4\text{He}`, a: ['H1', 'B11'], b: ['He4', 'He4', 'He4'] },
        ]);
        const Q = qv(rx.a, rx.b), ask = rx.light ? choose(r, ['Q', 'K']) : 'Q';
        const ans = ask === 'Q' ? Q : Q * M[rx.heavy] / (M[rx.heavy] + M[rx.light]);
        const masses = [...new Set([...rx.a, ...rx.b])].map((k) => `${M[k]}`).join(', ');
        return { q: R`For $${rx.t}$ (products in their ground states), the atomic masses involved are ${masses} u (in order of appearance), with $1$ u $= 931.494$ MeV$/c^2$. ${ask === 'Q' ? 'The Q-value is' : `Neglecting the initial kinetic energy, the ${rx.ln}'s kinetic energy is`} ______ MeV (three significant figures).`,
          answer: sig3(ans), tol: sig3(Math.max(ans * 0.005, 0.005)), rx: rx.t, ask, Qv: Q, ansv: ans,
          sol: R`$Q = [\sum m_{\rm in} - \sum m_{\rm out}]\times931.494 = (${round(sum(rx.a), 6)} - ${round(sum(rx.b), 6)})\times931.494 = ${round(Q, 3)}$ MeV (atomic masses: the electrons balance).${ask === 'K' ? ` With zero total momentum the light product takes the fraction $m_{\\rm heavy}/(m_{\\rm heavy} + m_{\\rm light}) = ${round(M[rx.heavy] / (M[rx.heavy] + M[rx.light]), 4)}$ of $Q$: $${sig3(ans)}$ MeV.` : ''}`,
          trap: R`Mixing nuclear and atomic masses unevenly (electron masses must cancel).` };
      },
      verify: (p) => p.ansv },
    { id: 'nrx-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'cross-section',
      make(r) {
        const [nm, s0] = choose(r, [['hydrogen-1', 0.332], ['boron-10', 3840], ['uranium-235 (capture plus fission)', 680], ['cobalt-59', 37.2], ['lithium-6', 940]]);
        const E = choose(r, [0.001, 0.005, 0.1, 0.5, 1, 10]), ans = s0 * Math.sqrt(0.0253 / E);
        return { q: R`The thermal ($0.0253$ eV) absorption cross-section of ${nm} is $${s0}$ b. Assuming the $1/v$ law holds, its value at $${E}$ eV is ______ b (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), s0, E,
          sol: R`$\sigma \propto 1/v \propto E^{-1/2}$: $\sigma = ${s0}\sqrt{0.0253/${E}} = ${sig3(ans)}$ b.`,
          trap: R`Scaling with $1/E$ instead of $1/\sqrt E$.` };
      },
      verify: (p) => p.s0 * Math.sqrt(0.0253 / p.E) },
    { id: 'nrx-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'fusion',
      make(r) {
        const T = choose(r, [10, 12, 15, 20, 25]), n = choose(r, [0.5, 1, 2, 5]), tau = choose(r, [0.5, 1, 2, 3, 5]), ask = choose(r, ['tau', 'n']);
        const ans = ask === 'tau' ? 3e21 / (n * 1e20 * T) : 3e21 / (tau * T) / 1e20;
        return { q: R`Take the D-T ignition condition as $n\tau_ET \ge 3\times10^{21}$ keV s m$^{-3}$. At $T = ${T}$ keV, ${ask === 'tau' ? `with $n = ${n}\\times10^{20}$ m$^{-3}$, the minimum confinement time is ______ s` : `with $\\tau_E = ${tau}$ s, the minimum ion density is ______ $\\times10^{20}$ m$^{-3}$`} (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), T, n, tau, ask,
          sol: ask === 'tau' ? R`$\tau_E = \dfrac{3\times10^{21}}{${n}\times10^{20}\times${T}} = ${sig3(ans)}$ s.` : R`$n = \dfrac{3\times10^{21}}{${tau}\times${T}} = ${sig3(ans)}\times10^{20}$ m$^{-3}$.`,
          trap: R`Forgetting the factor $10^{20}$ in the density.` };
      },
      verify: (p) => (p.ask === 'tau' ? 3e21 / (p.n * 1e20 * p.T) : 3e21 / (p.tau * p.T) / 1e20) },
    { id: 'nrx-r4g4', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'kinematics',
      make(r) {
        const [rxn, Eg, A] = choose(r, [[R`n + {}^1\text{H} \to {}^2\text{H} + \gamma`, 2.2246, 2], [R`n + {}^{12}\text{C} \to {}^{13}\text{C} + \gamma`, 4.946, 13], [R`n + {}^{27}\text{Al} \to {}^{28}\text{Al} + \gamma`, 7.725, 28], [R`n + {}^{56}\text{Fe} \to {}^{57}\text{Fe} + \gamma`, 7.646, 57]]);
        const Mc2 = A * 931.5, ans = Eg ** 2 / (2 * Mc2) * 1e6;
        return { q: R`In the capture $${rxn}$ by a nucleus at rest, the gamma ray carries $${Eg}$ MeV. Taking the product's rest energy as $${A}\times931.5$ MeV, its recoil kinetic energy is ______ eV (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), Eg, A,
          sol: R`The nucleus recoils with momentum $E_\gamma/c$, so $E_R = \dfrac{E_\gamma^2}{2Mc^2} = \dfrac{${Eg}^2}{2\times${round(Mc2, 1)}}$ MeV $= ${sig3(ans)}$ eV. Heavier nuclei recoil less; this recoil is also why free nuclei cannot resonantly reabsorb their own gamma rays (the Mössbauer effect avoids it by fixing the nucleus in a crystal).`,
          trap: R`Using $E_\gamma/2Mc^2$ (not squared) or forgetting to convert MeV to eV.` };
      },
      verify: (p) => p.Eg ** 2 / (2 * p.A * 931.5) * 1e6 },
    { id: 'nrx-r4g5', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'balancing reactions',
      make(r) {
        const [t, x] = choose(r, [
          [R`{}^{9}\text{Be} + \alpha \to {}^{12}\text{C} + X`, 'n'], [R`{}^{27}\text{Al} + \alpha \to {}^{30}\text{P} + X`, 'n'], [R`{}^{14}\text{N} + n \to {}^{14}\text{C} + X`, 'p'],
          [R`{}^{6}\text{Li} + n \to {}^{4}\text{He} + X`, 't'], [R`{}^{10}\text{B} + n \to {}^{7}\text{Li} + X`, 'a'], [R`{}^{7}\text{Li} + p \to {}^{7}\text{Be} + X`, 'n'],
          [R`{}^{3}\text{He} + n \to {}^{3}\text{H} + X`, 'p'], [R`{}^{59}\text{Co} + n \to {}^{60}\text{Co} + X`, 'g'], [R`{}^{2}\text{H} + \gamma \to p + X`, 'n'],
          [R`{}^{11}\text{B} + p \to {}^{11}\text{C} + X`, 'n'], [R`{}^{12}\text{C} + d \to {}^{13}\text{C} + X`, 'p'], [R`{}^{16}\text{O} + n \to {}^{13}\text{C} + X`, 'a'],
          [R`{}^{9}\text{Be} + d \to {}^{10}\text{B} + X`, 'n'], [R`{}^{235}\text{U} + n \to {}^{141}\text{Ba} + {}^{92}\text{Kr} + X`, '3n'],
        ]);
        const tex = { n: '$n$', p: '$p$', a: '$\\alpha$', g: '$\\gamma$', d: '$d$', t: '$ {}^3\\text{H}$', '2n': '$2n$', '3n': '$3n$' };
        const o = mcqOptions(r, tex[x], shuffle(r, Object.keys(tex).filter((k) => k !== x)).map((k) => tex[k]), (v) => v);
        return { q: R`Identify $X$ in the nuclear reaction $${t}$.`, ...o,
          sol: R`Balance the mass number (total nucleons) and the charge (total $Z$) on both sides, remembering $n = {}^1_0n$, $p = {}^1_1\text{H}$, $d = {}^2_1\text{H}$, $\alpha = {}^4_2\text{He}$, $\gamma$ with $A = Z = 0$. The missing $A$ and $Z$ identify $X$ as ${tex[x]}.`,
          trap: R`Balancing only the mass numbers and forgetting the charges (a proton and a neutron have the same $A$).` };
      } },
    { id: 'nrx-r4g6', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'moderators',
      make(r) {
        const [nm, A] = choose(r, [['hydrogen', 1], ['deuterium', 2], ['helium-4', 4], ['beryllium-9', 9], ['carbon-12', 12]]);
        const E1 = choose(r, [1, 2, 5]), [E2, E2t] = choose(r, [[0.025, '0.025 eV'], [1, '1 eV']]);
        const L = Math.log(E1 * 1e6 / E2), x = xi(A), ans = L / x;
        return { q: R`Neutrons slow down in ${nm} ($A = ${A}$). The mean logarithmic energy loss per elastic collision is $\xi = 1 + \dfrac{\alpha\ln\alpha}{1 - \alpha}$ with $\alpha = \left(\dfrac{A - 1}{A + 1}\right)^2$ ($\xi = 1$ for $A = 1$). The average number of collisions to go from $${E1}$ MeV to ${E2t}$ is ______ (one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.2, round(ans * 0.01, 1)), A, E1, E2,
          sol: R`$\xi = ${round(x, 4)}$. The number of collisions is $\dfrac{\ln(E_1/E_2)}{\xi} = \dfrac{\ln(${E1}\times10^6/${E2})}{${round(x, 4)}} = \dfrac{${round(L, 3)}}{${round(x, 4)}} = ${round(ans, 1)}$. Light nuclei take the most energy per collision, which is why water and heavy water are such good moderators.`,
          trap: R`Dividing the energies instead of taking the logarithm: the loss is a fixed fraction per collision, not a fixed amount.` };
      },
      verify: (p) => Math.log(p.E1 * 1e6 / p.E2) / xi(p.A) },
  ],
};
