// Round 4 extras for radioactive-decays: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const U = 931.494;
const sig3 = (x) => +x.toPrecision(3);
const ALPHA = [['^{241}\\text{Am}', 241, 5.638, [0.0595, 0.1030]], ['^{226}\\text{Ra}', 226, 4.871, [0.186, 0.4485]], ['^{228}\\text{Th}', 228, 5.520, [0.0841, 0.2508]], ['^{239}\\text{Pu}', 239, 5.245, [0.0516, 0.0131]], ['^{210}\\text{Po}', 210, 5.407, [0.803]]];
const BETA = [['{}^{3}\\text{H}', '{}^{3}\\text{He}', 3.01604928, 3.01602932], ['{}^{14}\\text{C}', '{}^{14}\\text{N}', 14.00324199, 14.00307400], ['{}^{35}\\text{S}', '{}^{35}\\text{Cl}', 34.96903231, 34.96885268],
  ['{}^{63}\\text{Ni}', '{}^{63}\\text{Cu}', 62.92966963, 62.92959772], ['{}^{32}\\text{P}', '{}^{32}\\text{S}', 31.97390764, 31.97207117]];

export default {
  items: [
    { id: 'rdk-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'beta decay',
      q: R`In $\beta^+$ decay of a nucleus, the particles emitted are`,
      options: [R`an electron and an antineutrino`, R`a positron and an antineutrino`, R`a positron and an electron neutrino`, R`only a positron`], answer: 2,
      sol: R`Inside the nucleus $p \to n + e^+ + \nu_e$. Charge balances ($+1 = 0 + 1 + 0$) and so does electron lepton number: $0 = (-1) + (+1)$, with the positron counting $-1$ and the neutrino $+1$. An antineutrino accompanies $\beta^-$ decay, where an electron ($L_e = +1$) is created.`,
      trap: R`Pairing the positron with an antineutrino because both are "anti" particles; lepton number needs one of each sign.` },
    { id: 'rdk-r4-02', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      q: R`Which of these allowed beta transitions are PURE Gamow-Teller (no Fermi part)?`,
      options: [R`$0^+ \to 1^+$`, R`$0^+ \to 0^+$`, R`$\tfrac12^+ \to \tfrac12^+$ (mirror decay)`, R`$3^+ \to 2^+$`], answer: [0, 3],
      sol: R`In allowed decays the leptons carry no orbital angular momentum. A Fermi transition (leptons in a spin singlet) needs $\Delta J = 0$; a Gamow-Teller one (spin triplet) allows $\Delta J = 0, \pm1$ except $0 \to 0$. So $0^+\to1^+$ and $3^+\to2^+$ ($\Delta J = 1$) are pure GT, $0^+\to0^+$ is pure Fermi, and the mirror $\tfrac12\to\tfrac12$ decay is mixed.`,
      trap: R`Calling every $\Delta J = 0$ transition pure Fermi; for $J \ne 0$ the Gamow-Teller operator also connects the states.` },
    { id: 'rdk-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'beta decay',
      q: R`Atomic masses: $^3$H $3.01604928$ u, $^3$He $3.01602932$ u; $1$ u $= 931.494$ MeV$/c^2$. The maximum kinetic energy of the electrons from tritium $\beta^-$ decay is ______ keV (one decimal place).`,
      answer: 18.6, tol: 0.1, unit: 'keV', calc: () => (3.01604928 - 3.01602932) * 931.494e3,
      sol: R`For $\beta^-$ decay with atomic masses, $Q = [M(^3\text{H}) - M(^3\text{He})]c^2$, since the extra electron of helium is the emitted one. $\Delta M = 1.996\times10^{-5}$ u, so $Q = 1.996\times10^{-5}\times931\,494$ keV $= 18.6$ keV. The electron reaches this endpoint when the neutrino gets (almost) nothing; the recoil of the helium ion is only a few eV.`,
      trap: R`Subtracting an extra electron mass, which belongs only to $\beta^+$ decay with atomic masses.` },
    { id: 'rdk-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'beta spectra',
      q: R`Compared with the shape the phase space alone would give, the low-energy end of a beta spectrum from a heavy nucleus is`,
      options: [R`unchanged for both $\beta^-$ and $\beta^+$`, R`suppressed for $\beta^-$ and enhanced for $\beta^+$`, R`raised to its maximum value at zero energy for both`, R`enhanced for $\beta^-$ (electrons attracted by the nucleus) and suppressed for $\beta^+$ (positrons repelled)`], answer: 3,
      sol: R`The Fermi function $F(Z, E)$ corrects the phase space for the Coulomb field of the daughter. A slow electron is pulled back and spends longer near the nucleus, so its emission probability rises at low energy; a slow positron is pushed away and the barrier suppresses it. Hence $\beta^-$ spectra pile up at low energies and $\beta^+$ spectra are shifted towards higher energies.`,
      trap: R`Thinking the Coulomb field only shifts the endpoint; the endpoint is fixed by $Q$, the shape is what changes.` },
    { id: 'rdk-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sargent rule',
      q: R`Two allowed beta decays have similar nuclear matrix elements and endpoint energies of $2.0$ MeV and $3.0$ MeV (both well above $m_ec^2$). By Sargent's rule ($\lambda\propto E_0^5$), the half-life of the $2.0$ MeV decay is ______ times that of the $3.0$ MeV decay (two decimal places).`,
      answer: 7.59, tol: 0.02, calc: () => 1.5 ** 5,
      sol: R`At high endpoint energies the integrated phase space grows as $E_0^5$, so $\lambda \propto E_0^5$ and $T_{1/2}\propto E_0^{-5}$. The ratio is $(3.0/2.0)^5 = 1.5^5 = 7.59$: the lower-energy decay lives about 7.6 times longer.`,
      trap: R`Inverting the ratio, or using a linear dependence on $E_0$.` },
    { id: 'rdk-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'decay spectra',
      q: R`For a decay between two definite nuclear states (atomic effects ignored), which emitted particles have a single, sharp kinetic energy?`,
      options: [R`The alpha particle in alpha decay`, R`The neutrino in electron capture`, R`The electron in $\beta^-$ decay`, R`The electron in internal conversion from a given atomic shell`], answer: [0, 1, 3],
      sol: R`A two-body final state fixes the energies by momentum conservation. Alpha decay (alpha + daughter) and electron capture (neutrino + daughter atom) are two-body; so is internal conversion, where the electron leaves with $E_\gamma - B_{\rm shell}$. In $\beta^-$ decay three bodies (electron, antineutrino, daughter) share the energy, so the electron spectrum is continuous.`,
      trap: R`Assuming every electron from a nucleus comes from beta decay; conversion electrons form sharp lines.` },
    { id: 'rdk-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'gamma decay',
      q: R`The $2^+ \to 0^+$ gamma transition of a nucleus is measured to be about $200$ times faster than the single-particle (Weisskopf) E2 estimate. This most strongly suggests that`,
      options: [R`many nucleons move together: the state is collective, as in a deformed rotor or a vibrator`, R`the transition is really M1`, R`the Weisskopf estimate is wrong by a constant factor for all nuclei`, R`the nucleus is doubly magic`], answer: 0,
      sol: R`The Weisskopf estimate assumes one nucleon changes its orbit. A rate hundreds of times larger (a $B(E2)$ of hundreds of Weisskopf units) means many nucleons contribute coherently, as in the rotation of a deformed nucleus. A $2^+ \to 0^+$ transition cannot be M1 ($\Delta J = 2$), and doubly magic nuclei show only modest enhancements.`,
      trap: R`Treating a large enhancement as a failure of the estimate; it is the very signature of collectivity.` },
    { id: 'rdk-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'alpha decay',
      q: R`$^{241}$Am alpha decays with $Q = 5.638$ MeV for the transition to the ground state of $^{237}$Np. The strongest branch goes to the $^{237}$Np level at $59.5$ keV. Using mass numbers for masses, the alpha energy in that branch is ______ MeV (three decimal places).`,
      answer: 5.486, tol: 0.003, unit: 'MeV', calc: () => (5.638 - 0.0595) * 237 / 241,
      sol: R`Feeding a level at $E^*$ leaves $Q - E^* = 5.638 - 0.0595 = 5.5785$ MeV as kinetic energy. Momentum balance shares it in inverse ratio to the masses: $K_\alpha = (Q - E^*)\dfrac{A - 4}{A} = 5.5785\times\dfrac{237}{241} = 5.486$ MeV. The excited $^{237}$Np then emits the well-known $59.5$ keV gamma ray of americium sources.`,
      trap: R`Giving the alpha the full $Q - E^*$, ignoring recoil, or subtracting $E^*$ after taking the alpha's share.` },
    { id: 'rdk-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'forbidden decays',
      q: R`$^{40}$K ($4^-$) beta decays to the $0^+$ ground state of $^{40}$Ca. This transition is classified as`,
      options: [R`first-forbidden unique`, R`third-forbidden unique`, R`allowed Gamow-Teller`, R`second-forbidden non-unique`], answer: 1,
      sol: R`$\Delta J = 4$ with a change of parity. An $L$-th forbidden transition has parity change $(-1)^L$ and reaches $\Delta J = L + 1$ at most (the unique case). Odd $L$ is needed for the parity change, and $L + 1 \ge 4$ needs $L \ge 3$: so $L = 3$ with $\Delta J = L + 1$, third-forbidden unique. This high forbiddenness is why $^{40}$K lives $1.25\times10^9$ years despite a $1.31$ MeV endpoint.`,
      trap: R`Counting forbiddenness as $\Delta J$ itself (fourth) or ignoring the parity change.` },
    { id: 'rdk-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'neutrino mass',
      q: R`Direct laboratory searches for the neutrino mass study the shape of a beta spectrum near its endpoint, and tritium is the favourite source. The main physics reason is that`,
      options: [R`tritium decay emits no neutrino`, R`tritium has the longest half-life of all beta emitters`, R`tritium electrons are relativistic, so the mass effect is larger`, R`its endpoint ($18.6$ keV) is very low, so a much larger fraction of all decays falls in the last few eV where a neutrino mass changes the shape`], answer: 3,
      sol: R`Near the endpoint the spectrum vanishes like $(E_0 - E)^2$, so the fraction of decays in the last $\delta E$ scales as $(\delta E/E_0)^3$. A small $E_0$ makes this fraction as large as possible. Tritium also has a simple, superallowed decay with well-understood atomic final states and a convenient $12.3$ year half-life. A neutrino mass $m_\nu$ bends the spectrum and moves the endpoint down by $m_\nu c^2$.`,
      trap: R`Thinking a fast electron reveals the neutrino mass better; the effect is confined to the last few eV, whatever the endpoint.` },
  ],
  gens: [
    { id: 'rdk-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Sargent rule',
      make(r) {
        const E1 = choose(r, [1.0, 1.5, 2.0, 2.5]), E2 = round(E1 * choose(r, [1.2, 1.4, 1.6, 2.0]), 2), ans = (E2 / E1) ** 5;
        return { q: R`Two allowed beta decays with similar matrix elements have endpoints $${E1}$ MeV and $${E2}$ MeV (both well above $m_ec^2$). Using Sargent's rule $\lambda\propto E_0^5$, the half-life of the $${E1}$ MeV decay is ______ times that of the other (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), E1, E2,
          sol: R`$T_{1/2}\propto E_0^{-5}$, so the ratio is $(${E2}/${E1})^5 = ${round(E2 / E1, 4)}^5 = ${sig3(ans)}$.`,
          trap: R`Inverting the ratio: the LOWER endpoint gives the LONGER half-life.` };
      },
      verify: (p) => (p.E2 / p.E1) ** 5 },
    { id: 'rdk-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'alpha decay',
      make(r) {
        const [nm, A, Q, lv] = choose(r, ALPHA), E = choose(r, [0, ...lv]), ans = (Q - E) * (A - 4) / A;
        return { q: R`$${nm}$ alpha decays with $Q = ${Q}$ MeV for the ground-state-to-ground-state transition. Using mass numbers for masses, the kinetic energy of the alpha particles that leave the daughter ${E ? `in its level at $${round(E * 1000, 1)}$ keV` : 'in its ground state'} is ______ MeV (three decimal places).`,
          answer: round(ans, 3), tol: 0.003, A, Q, E,
          sol: R`Available energy $Q - E^* = ${Q} - ${E} = ${round(Q - E, 4)}$ MeV, shared in inverse proportion to the masses: $K_\alpha = (Q - E^*)\dfrac{A - 4}{A} = ${round(Q - E, 4)}\times\dfrac{${A - 4}}{${A}} = ${round(ans, 3)}$ MeV.`,
          trap: R`Forgetting the recoil share of the daughter, or the excitation energy left in it.` };
      },
      verify: (p) => (p.Q - p.E) * (p.A - 4) / p.A },
    { id: 'rdk-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'beta decay',
      make(r) {
        const [p, d, Mp, Md] = choose(r, BETA), ans = (Mp - Md) * U * 1000;
        return { q: R`Atomic masses: $${p}$ $${Mp}$ u, $${d}$ $${Md}$ u; $1$ u $= 931.494$ MeV$/c^2$. The endpoint (maximum electron kinetic energy) of the $\beta^-$ decay $${p} \to ${d}$ is ______ keV (three significant figures).`,
          answer: sig3(ans), tol: sig3(Math.max(ans * 0.005, 0.05)), Mp, Md,
          sol: R`With atomic masses the electron count balances automatically for $\beta^-$ decay: $Q = (M_P - M_D)c^2 = ${round(Mp - Md, 8)}\times931\,494$ keV $= ${sig3(ans)}$ keV. Neglecting the tiny recoil, this is the endpoint.`,
          trap: R`Subtracting an electron mass (or two), which belongs to $\beta^+$ decay.` };
      },
      verify: (p) => (p.Mp - p.Md) * U * 1000 },
  ],
};
