// Round 4 extras for deuteron-nuclear-force: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const HC = 197.327;
const sig3 = (x) => +x.toPrecision(3);
const MESONS = [['pion', R`\pi`, 139.57], ['eta meson', R`\eta`, 547.86], ['rho meson', R`\rho`, 775.26], ['omega meson', R`\omega`, 782.66]];
const yuk = (m, r1, r2) => { const a = HC / m; return (r1 / r2) * Math.exp(-(r2 - r1) / a); };
const MODS = [['water ($\\text{H}_2\\text{O}$)', 1.0, 18.02, 2], ['polyethylene ($\\text{CH}_2$ units)', 0.94, 14.03, 2], ['paraffin wax ($\\text{C}_{25}\\text{H}_{52}$)', 0.90, 352.7, 52]];
const capT = (rho, M, nH, v) => 1e6 / (rho / M * 6.022e23 * nH * 0.332e-24 * v * 100);
const SYS = [['neutron-proton singlet ($^1S_0$)', -23.74, 469.46], ['neutron-neutron', -18.9, 469.78], ['proton-proton (nuclear part)', -17.3, 469.14]];

export default {
  items: [
    { id: 'deut-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'binding energy',
      q: R`The deuteron's binding energy per nucleon is about`,
      options: [R`$1.11$ MeV`, R`$2.22$ MeV`, R`$7.07$ MeV`, R`$8.8$ MeV`], answer: 0,
      sol: R`The total binding energy is $2.22$ MeV shared by two nucleons, so $B/A = 1.11$ MeV, far below the $7$ to $9$ MeV of heavier nuclei ($7.07$ MeV is $^4$He, $8.8$ MeV is near iron). The deuteron is a very loosely bound system.`,
      trap: R`Quoting the total binding energy, $2.22$ MeV, as the per-nucleon value.` },
    { id: 'deut-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'spin',
      q: R`In the deuteron ground state the spins of the neutron and the proton are`,
      options: [R`antiparallel, total spin $S = 0$`, R`not in any definite total-spin state`, R`always opposite to the orbital angular momentum`, R`parallel, total spin $S = 1$ (mainly with $L = 0$)`], answer: 3,
      sol: R`The deuteron has $J = 1$ and even parity, so $L = 0$ or $2$ with $S = 1$ (a $^3S_1$ state with a few per cent $^3D_1$). The spin-singlet $^1S_0$ np state is not bound: the nuclear force is spin dependent and more attractive when the spins are parallel.`,
      trap: R`Pairing the spins to zero as in even-even nuclei; for the np system the bound state is the triplet.` },
    { id: 'deut-r4-03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Yukawa potential',
      q: R`A one-pion-exchange potential falls off as $V(r)\propto\dfrac{e^{-r/a}}{r}$ with $a = \hbar/m_\pi c = 1.414$ fm. The ratio $V(2.0\text{ fm})/V(1.0\text{ fm})$ is ______ (three decimal places).`,
      answer: 0.246, tol: 0.002, calc: () => 0.5 * Math.exp(-1 / 1.414),
      sol: R`$\dfrac{V(2)}{V(1)} = \dfrac{1}{2}\,e^{-(2 - 1)/1.414} = 0.5\times e^{-0.707} = 0.5\times0.493 = 0.246$. Compared with a Coulomb-like $1/r$ (which would give $0.5$), the exponential cuts the force off beyond about $1.4$ fm.`,
      trap: R`Dropping the $1/r$ factor and keeping only the exponential.` },
    { id: 'deut-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'np scattering',
      q: R`At very low energy the np cross-section is $\sigma = \pi\left(3a_t^2 + a_s^2\right)$ with $a_t = 5.4$ fm and $a_s = -23.7$ fm. Although only one in four collisions is in the spin singlet, the singlet part dominates because`,
      options: [R`$|a_s|$ is much larger than $a_t$, since a virtual singlet state lies just above zero energy`, R`the triplet interaction is repulsive`, R`the triplet state is forbidden by the Pauli principle`, R`the singlet scattering length is negative`], answer: 0,
      sol: R`The singlet term is $a_s^2 = 562$ fm$^2$ against $3a_t^2 = 87$ fm$^2$: about $87\%$ of the zero-energy cross-section. A scattering length much larger than the force range signals a state very close to zero energy; in the singlet case it is unbound by only about $70$ keV, which makes $|a_s|$ huge. The sign only tells us it is not bound; it is the size that counts in $a^2$.`,
      trap: R`Blaming the sign of $a_s$; the cross-section depends on $a^2$.` },
    { id: 'deut-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Pauli principle',
      q: R`Which two-nucleon states are allowed for two PROTONS?`,
      options: [R`$^1S_0$`, R`$^3S_1$`, R`$^3P_0$`, R`$^1P_1$`], answer: [0, 2],
      sol: R`Two protons have isospin $T = 1$ (symmetric), so space times spin must be antisymmetric: $(-1)^{L + S + 1} = -1$, i.e. $L + S$ even. $^1S_0$ ($L = 0$, $S = 0$) and $^3P_0$ ($L = 1$, $S = 1$) qualify; $^3S_1$ ($L + S = 1$) and $^1P_1$ ($L + S = 1$) need $T = 0$, possible only for np.`,
      trap: R`Forgetting the isospin part and applying the rule for the deuteron ($T = 0$).` },
    { id: 'deut-r4-06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'neutron capture',
      q: R`Thermal neutrons ($v = 2200$ m/s) in water are captured mainly by protons, $n + p \to d + \gamma$, with cross-section $0.332$ b. With water density $1.00$ g cm$^{-3}$ (molar mass $18.0$ g/mol, $N_A = 6.022\times10^{23}$), the mean time before a thermal neutron is captured is ______ $\mu$s (nearest whole number).`,
      answer: 205, tol: 3, unit: 'μs', calc: () => 1e6 / (2 / 18 * 6.022e23 * 0.332e-24 * 2.2e5),
      sol: R`Hydrogen nuclei per cm$^3$: $2\times\dfrac{1.00}{18.0}\times6.022\times10^{23} = 6.69\times10^{22}$. Capture rate $n\sigma v = 6.69\times10^{22}\times0.332\times10^{-24}\times2.2\times10^5$ s$^{-1}$ $= 4.89\times10^3$ s$^{-1}$, so the mean life is $1/4890$ s $= 205\ \mu$s. Each capture releases the familiar $2.22$ MeV gamma ray.`,
      trap: R`Mixing m/s with cm$^{-3}$ (use $v = 2.2\times10^5$ cm/s), or counting one proton per molecule.` },
    { id: 'deut-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'meson exchange',
      q: R`In meson-exchange models of the nucleon-nucleon force, the attraction at intermediate distances (about $0.8$ to $1.5$ fm) is attributed mainly to`,
      options: [R`one-pion exchange`, R`$\omega$ exchange`, R`$\rho$ exchange`, R`two-pion exchange (often modelled as a scalar "$\sigma$" meson of $400$ to $600$ MeV)`], answer: 3,
      sol: R`The range of an exchange scales as $\hbar/mc$. One-pion exchange ($1.4$ fm) dominates the long-range tail and gives the tensor force. Correlated two-pion exchange, with range about $\hbar/2m_\pi c\approx0.7$ fm, provides the central intermediate-range attraction. Vector-meson ($\omega$) exchange gives the short-range repulsion; $\rho$ exchange mainly modifies the tensor and spin-orbit parts.`,
      trap: R`Crediting single-pion exchange with all the attraction; its central part averages out in many channels.` },
    { id: 'deut-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'scattering length',
      q: R`In the zero-range approximation a two-body state near zero energy has $|E| = \dfrac{\hbar^2}{2\mu a^2}$. For the np singlet scattering length $a_s = -23.7$ fm (a virtual, unbound state) with $\mu c^2 = 469.46$ MeV and $\hbar c = 197.327$ MeV fm, $|E| = $ ______ keV (one decimal place).`,
      answer: 73.8, tol: 0.5, unit: 'keV', calc: () => (197.327 / 23.7) ** 2 / (2 * 469.46) * 1000,
      sol: R`$\dfrac{\hbar c}{|a_s|} = \dfrac{197.327}{23.7} = 8.326$ MeV, so $|E| = \dfrac{8.326^2}{2\times469.46} = \dfrac{69.32}{938.92}$ MeV $= 73.8$ keV. A negative scattering length means this pole is a virtual state: the singlet np system misses being bound by less than $0.1$ MeV. The effective-range correction moves the estimate to about $66$ keV.`,
      trap: R`Treating the negative sign as meaning a bound state with this binding energy.` },
    { id: 'deut-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'one-pion exchange', format: 'statements',
      q: R`About the one-pion-exchange potential (OPEP) between two nucleons, which statements are correct?`,
      options: [R`Its range is about $\hbar/m_\pi c\approx1.4$ fm`, R`It contains a tensor term proportional to $S_{12}$`, R`Its central part is proportional to $(\vec\tau_1\cdot\vec\tau_2)(\vec\sigma_1\cdot\vec\sigma_2)$`, R`It explains the strong repulsion below $0.5$ fm`], answer: [0, 1, 2],
      sol: R`The pion is the lightest meson, so OPEP sets the longest range, $197.3/139.6 = 1.41$ fm. Because the pion is pseudoscalar and couples to the nucleon spin, OPEP has a spin-spin central part and a tensor part, both multiplied by $\vec\tau_1\cdot\vec\tau_2$ (isovector pion). The short-range repulsion comes from heavier exchanges ($\omega$) and quark-level effects, not from the pion.`,
      trap: R`Attributing every feature of the force, including the repulsive core, to the pion.` },
    { id: 'deut-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'deuteron structure',
      q: R`Different realistic nucleon-nucleon potentials fit the same scattering data and deuteron properties, yet give deuteron D-state probabilities ranging from about $4\%$ to $7\%$. The best interpretation is that`,
      options: [R`$P_D$ is not an observable: it depends on the short-distance form of the potential, which unitary transformations can change without changing any measured quantity`, R`at most one of the potentials can be correct, and better quadrupole data will decide`, R`the magnetic moment fixes $P_D$ exactly, so the potentials must contain errors`, R`the D state exists only in some of the potentials`], answer: 0,
      sol: R`Measured quantities (binding energy, quadrupole moment, asymptotic D/S ratio, scattering phase shifts) are fixed by the wavefunction at large distances and by on-shell amplitudes. The probability of the D wave depends on the wavefunction at short distances, which can be reshuffled by transformations that leave all observables unchanged (and by meson-exchange currents that shift the moment). So $P_D$ is model dependent; the magnetic moment only gives a rough estimate once those corrections are ignored.`,
      trap: R`Reading $P_D$ off the magnetic-moment formula as if relativistic and exchange-current corrections did not exist.` },
  ],
  gens: [
    { id: 'deut-r4g1', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Yukawa potential',
      make(r) {
        const [nm, sym, m] = choose(r, MESONS), r1 = choose(r, [0.5, 1.0, 1.5]), r2 = r1 + choose(r, [0.5, 1.0, 1.5]), a = HC / m, ans = yuk(m, r1, r2);
        return { q: R`A force carried by the ${nm} ($m_{${sym}}c^2 = ${m}$ MeV, $\hbar c = 197.327$ MeV fm) has a Yukawa potential $V\propto e^{-r/a}/r$ with $a = \hbar/mc$. The ratio $V(${r2}\text{ fm})/V(${r1}\text{ fm})$ is ______ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), m, r1, r2,
          sol: R`$a = 197.327/${m} = ${round(a, 4)}$ fm. $\dfrac{V(r_2)}{V(r_1)} = \dfrac{r_1}{r_2}e^{-(r_2 - r_1)/a} = \dfrac{${r1}}{${r2}}e^{-${round((r2 - r1) / a, 4)}} = ${sig3(ans)}$. Heavier mesons give shorter ranges and steeper fall-offs.`,
          trap: R`Leaving out the $1/r$ factor.` };
      },
      verify: (p) => yuk(p.m, p.r1, p.r2) },
    { id: 'deut-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'neutron capture',
      make(r) {
        const [nm, rho, M, nH] = choose(r, MODS), v = choose(r, [2200, 1500, 3000]), ans = capT(rho, M, nH, v);
        return { q: R`Slow neutrons of speed $${v}$ m/s move in ${nm}, density $${rho}$ g cm$^{-3}$ (molar mass $${M}$ g/mol, ${nH} hydrogen atoms per molecule). Taking capture by hydrogen only, with $\sigma = 0.332$ b at this speed, and $N_A = 6.022\times10^{23}$ mol$^{-1}$, the mean time to capture is ______ $\mu$s (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), rho, M, nH, v,
          sol: R`$n_H = ${nH}\times\dfrac{${rho}}{${M}}\times6.022\times10^{23} = ${sig3(rho / M * 6.022e23 * nH / 1e22)}\times10^{22}$ cm$^{-3}$. Rate $n_H\sigma v$ with $v = ${v * 100}$ cm/s gives $${sig3(1e6 / ans)}$ s$^{-1}$, so the mean time is $${sig3(ans)}\ \mu$s.`,
          trap: R`Using the speed in m/s with a density in cm$^{-3}$.` };
      },
      verify: (p) => capT(p.rho, p.M, p.nH, p.v) },
    { id: 'deut-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'scattering length',
      make(r) {
        const [nm, a, mu] = choose(r, SYS), ans = (HC / a) ** 2 / (2 * mu) * 1000;
        return { q: R`In the zero-range approximation the virtual-state energy is $|E| = \hbar^2/2\mu a^2$. For the ${nm} system, $a = ${a}$ fm and $\mu c^2 = ${mu}$ MeV ($\hbar c = 197.327$ MeV fm). Then $|E| = $ ______ keV (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), a, mu,
          sol: R`$\hbar c/|a| = ${round(HC / Math.abs(a), 4)}$ MeV, so $|E| = \dfrac{${round(HC / Math.abs(a), 4)}^2}{2\times${mu}}$ MeV $= ${sig3(ans)}$ keV. The negative scattering length means this state is unbound (virtual), just missing binding.`,
          trap: R`Reading a negative scattering length as a bound state.` };
      },
      verify: (p) => (HC / p.a) ** 2 / (2 * p.mu) * 1000 },
  ],
};
