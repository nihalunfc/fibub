// Round 4 extras for superconductivity: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'], JG = ['jam', 'gate', 'net'];
const PHI0 = 2.0678e-15, MU0 = 1.2566e-6;

export default {
  items: [
    { id: 'scd-r4-01', type: 'mcq', level: 1, exams: JG, sub: 'superconducting elements',
      q: R`Which of these elements does NOT become superconducting at ordinary pressure, however far it is cooled?`,
      options: [R`Aluminium`, R`Lead`, R`Niobium`, R`Copper`], answer: 3,
      sol: R`Aluminium ($1.2$ K), lead ($7.2$ K) and niobium ($9.2$ K) are all superconductors. The best ordinary conductors, copper, silver and gold, have never been seen to superconduct: their electrons couple only weakly to the lattice vibrations, the same weak scattering that makes them good normal conductors.`,
      trap: R`Good normal conductivity does not mean a tendency to superconduct; often it is the opposite.` },
    { id: 'scd-r4-02', type: 'nat', level: 2, exams: JG, sub: 'critical field', unit: 'K',
      q: R`Lead has $T_c = 7.2$ K and a critical field following $B_c(T) = B_c(0)[1 - (T/T_c)^2]$. The temperature at which its critical field is half its value at absolute zero is ______ K (to two decimal places).`,
      answer: 5.09, tol: 0.02, calc: () => 7.2 / Math.SQRT2,
      sol: R`$1 - (T/T_c)^2 = \tfrac12$ gives $(T/T_c)^2 = \tfrac12$, so $T = T_c/\sqrt2 = 7.2/1.414 = 5.09$ K. The critical field falls slowly at first and fastest near $T_c$.`,
      trap: R`$T_c/2 = 3.6$ K would leave $B_c = \tfrac34B_c(0)$: the curve is a parabola, not a straight line.` },
    { id: 'scd-r4-03', type: 'nat', level: 3, exams: G, sub: 'tunnelling', unit: 'mV',
      q: R`A tunnel junction joins lead ($\Delta = 1.35$ meV) and aluminium ($\Delta = 0.18$ meV) through a thin oxide, at a temperature well below both $T_c$ values. As the bias voltage is raised from zero, the quasiparticle current rises sharply at ______ mV (to two decimal places).`,
      answer: 1.53, tol: 0.01, calc: () => 1.35 + 0.18,
      sol: R`At $T\approx0$ both sides have a gap around the Fermi level. A quasiparticle can tunnel only when the filled states below one gap line up with the empty states above the other: $eV = \Delta_1 + \Delta_2 = 1.35 + 0.18 = 1.53$ meV, so $V = 1.53$ mV. If one side were a normal metal, the threshold would be the other side's own gap, $\Delta/e$.`,
      trap: R`$\Delta_1 - \Delta_2$ gives a weak feature only at finite temperature, when some quasiparticles are already excited.` },
    { id: 'scd-r4-04', type: 'mcq', level: 3, exams: G, sub: 'type I and type II',
      q: R`A pure type-I superconductor is alloyed with a little of another metal, so that the electron mean free path $\ell$ becomes much shorter than the clean coherence length $\xi_0$. The most likely result is that`,
      options: [R`it becomes type II, because $\xi$ shrinks and $\lambda$ grows`, R`it stays type I, because alloying cannot change $\kappa$`, R`it stops being superconducting at all`, R`it becomes type I more strongly, because $\xi$ grows`], answer: 0,
      sol: R`In the dirty limit the coherence length falls to about $\sqrt{\xi_0\ell}$ and the penetration depth rises to about $\lambda_L\sqrt{\xi_0/\ell}$. Both push $\kappa = \lambda/\xi$ up, past $1/\sqrt2$, so the alloy becomes type II. This is why practical magnet wires are alloys or compounds (NbTi, Nb$_3$Sn). Non-magnetic impurities hardly change $T_c$ (Anderson's theorem).`,
      trap: R`Short mean free path makes the pairs' effective size smaller, which favours type II.` },
    { id: 'scd-r4-05', type: 'msq', level: 4, exams: G, sub: 'energy gap', format: 'statements',
      q: R`A conventional superconductor with energy gap $\Delta$ is held at $T\ll T_c$ and studied with electromagnetic radiation. Which statements are correct?`,
      options: [R`Photons with $h\nu < 2\Delta$ cannot break Cooper pairs, so they are not absorbed by pair breaking.`, R`Although its DC resistance is zero, its AC resistance at microwave frequencies is small but not zero when $T > 0$.`, R`An absorption edge near $h\nu = 2\Delta$ in the far infrared was early evidence for the gap.`, R`Above $h\nu = 2\Delta$ it reflects light even better than below.`], answer: [0, 1, 2],
      sol: R`Breaking a pair creates two quasiparticles, each costing at least $\Delta$, so absorption starts at $2\Delta$ (in the far infrared or millimetre range). At $T > 0$ there are thermally excited quasiparticles; an AC field accelerates them as well as the pairs, giving a small loss, which is why superconducting cavities have finite (if huge) Q. Above $2\Delta$ the material absorbs like a normal metal, so it reflects less, not more.`,
      trap: R`Zero DC resistance does not mean zero loss at every frequency.` },
    { id: 'scd-r4-06', type: 'nat', level: 4, exams: G, sub: 'kinetic inductance', unit: 'pH',
      q: R`A superconducting wire is $10\ \mu$m long with a cross-section of $100$ nm $\times$ $100$ nm, thinner than the penetration depth $\lambda = 200$ nm, so the supercurrent is uniform. Its kinetic inductance $L_k = \mu_0\lambda^2\ell/A$ is ______ pH (to one decimal place).`,
      answer: 50.3, tol: 0.2, calc: () => 1.2566e-6 * (200e-9) ** 2 * 10e-6 / (100e-9) ** 2 * 1e12,
      sol: R`$\mu_0\lambda^2 = 1.2566\times10^{-6}\times4\times10^{-14} = 5.03\times10^{-20}$ H m. $\ell/A = 10^{-5}/10^{-14} = 10^9$ m$^{-1}$. $L_k = 5.03\times10^{-11}$ H $= 50.3$ pH. It comes from the kinetic energy of the moving pairs ($\tfrac12L_kI^2$) and is the working principle of kinetic-inductance detectors.`,
      trap: R`Converting nm$^2$ to m$^2$: $100$ nm $\times$ $100$ nm $= 10^{-14}$ m$^2$, not $10^{-16}$.` },
    { id: 'scd-r4-07', type: 'mcq', level: 4, exams: G, sub: 'thermodynamics',
      q: R`Well below $T_c$ the thermal conductivity of a pure type-I superconducting metal (lead, say) is much lower than in its normal state at the same temperature (reached by applying a field above $B_c$). The main reason is that`,
      options: [R`the phonons are frozen out by the Meissner effect`, R`electrons in Cooper pairs carry no entropy, and the few thermally excited quasiparticles carry little heat`, R`the Cooper pairs scatter phonons far more strongly`, R`the lattice contracts at the transition`], answer: 1,
      sol: R`In the normal metal, heat is carried mainly by electrons. Below $T_c$ the condensate carries no entropy, so it transports no heat, and the quasiparticle density falls as $e^{-\Delta/k_BT}$. Switching the field on and off thus switches the conductivity by a large factor, which is used as a heat switch in low-temperature apparatus.`,
      trap: R`The supercurrent carries charge with no loss, but not heat.` },
    { id: 'scd-r4-08', type: 'nat', level: 5, exams: G, sub: 'type I and type II', unit: 'mT',
      q: R`A strongly type-II superconductor has penetration depth $\lambda = 200$ nm and Ginzburg-Landau parameter $\kappa = 50$. Using $B_{c1}\approx\dfrac{\Phi_0}{4\pi\lambda^2}\ln\kappa$ with $\Phi_0 = 2.068\times10^{-15}$ Wb, the lower critical field is ______ mT (to one decimal place).`,
      answer: 16.1, tol: 0.1, calc: () => 2.068e-15 / (4 * Math.PI * (200e-9) ** 2) * Math.log(50) * 1000,
      sol: R`$4\pi\lambda^2 = 4\pi\times4\times10^{-14} = 5.027\times10^{-13}$ m$^2$; $\Phi_0/4\pi\lambda^2 = 4.114\times10^{-3}$ T; $\ln50 = 3.912$. $B_{c1} = 4.114\times3.912 = 16.1$ mT. Above this the first vortices enter; $\xi = \lambda/\kappa = 4$ nm and $B_{c2} = \Phi_0/2\pi\xi^2\approx21$ T, about $1300$ times larger.`,
      trap: R`$\ln\kappa$ is the natural logarithm; $\log_{10}50 = 1.70$ gives a value $2.3$ times too small.` },
    { id: 'scd-r4-09', type: 'mcq', level: 4, exams: G, sub: 'Josephson effect',
      q: R`A Josephson junction has critical current $I_c = 1.0\ \mu$A. Its Josephson coupling energy $E_J = \hbar I_c/2e = \Phi_0I_c/2\pi$, expressed as a temperature $E_J/k_B$, is about ($\Phi_0 = 2.07\times10^{-15}$ Wb)`,
      options: [R`$0.024$ K`, R`$2.4$ K`, R`$24$ K`, R`$150$ K`], answer: 2,
      sol: R`$E_J = 2.07\times10^{-15}\times1.0\times10^{-6}/2\pi = 3.29\times10^{-22}$ J, and $E_J/k_B = 3.29\times10^{-22}/1.381\times10^{-23} = 24$ K. At $4.2$ K thermal energy is far smaller, so thermal noise barely disturbs the phase; much smaller junctions (nA) are needed before $E_J$ drops to the $k_BT$ scale.`,
      trap: R`Leaving out the $2\pi$ gives $150$ K.` },
    { id: 'scd-r4-10', type: 'msq', level: 2, exams: JG, sub: 'applications', format: 'statements',
      q: R`MRI and particle-accelerator magnets are wound from type-II superconductors such as NbTi. Which statements give correct reasons?`,
      options: [R`Type-II materials stay superconducting up to an upper critical field $B_{c2}$ that can exceed $10$ T.`, R`Pinning of vortices on defects lets the wire carry large currents in high fields without dissipation.`, R`The critical fields of type-I elements are typically below $0.2$ T, too low for strong magnets.`, R`Type-II magnets need no cooling once they are energised.`], answer: [0, 1, 2],
      sol: R`In type II the field enters as vortices from $B_{c1}$ up to $B_{c2}$, which is about $10$-$15$ T for NbTi and $25$-$30$ T for Nb$_3$Sn. Moving vortices would dissipate energy, so the wire is made with defects that pin them. Type-I elements lose superconductivity at their thermodynamic $B_c$ (lead about $0.08$ T). All these magnets must be kept below $T_c$, usually in liquid helium near $4$ K.`,
      trap: R`Persistent current needs no power supply, but the coil still has to be kept cold.` },
  ],
  gens: [
    { id: 'scd-r4g1', type: 'nat', level: 3, exams: G, sub: 'tunnelling', unit: 'mV',
      make(r) {
        const M = [['aluminium', 0.18], ['indium', 0.53], ['tin', 0.59], ['tantalum', 0.70], ['lead', 1.35], ['niobium', 1.55]];
        const i = int(r, 0, 5), j = (i + int(r, 1, 5)) % 6, nis = choose(r, [true, false]);
        const [n1, d1] = M[i], [n2, d2] = M[j], V = nis ? d1 : d1 + d2;
        return { q: nis ? `A tunnel junction joins a normal metal (copper) to superconducting ${n1} ($\\Delta = ${d1}$ meV) through a thin oxide, at $T\\approx0$. The quasiparticle current rises sharply at a bias of ______ mV (to two decimal places).` : `A tunnel junction joins superconducting ${n1} ($\\Delta = ${d1}$ meV) and ${n2} ($\\Delta = ${d2}$ meV) through a thin oxide, at $T\\approx0$. The quasiparticle current rises sharply at a bias of ______ mV (to two decimal places).`,
          answer: round(V, 2), tol: 0.01, d1, d2, nis,
          sol: nis ? `On the normal side states are filled right up to $E_F$; electrons can enter the superconductor only above its gap, so the onset is at $eV = \\Delta = ${d1}$ meV: $V = ${d1}$ mV.` : `Both sides have gaps, so filled states below one gap must line up with empty states above the other: $eV = \\Delta_1 + \\Delta_2 = ${d1} + ${d2} = ${round(V, 2)}$ meV.`,
          trap: nis ? 'With one side normal the onset is $\\Delta$, not $2\\Delta$.' : 'The onset is the sum of the two gaps, not twice one of them.' };
      },
      verify: (p) => (p.nis ? p.d1 : p.d1 + p.d2) },
    { id: 'scd-r4g2', type: 'nat', level: 4, exams: G, sub: 'kinetic inductance', unit: 'pH',
      make(r) {
        const lam = pick(r, 50, 500, 10), len = pick(r, 1, 100, 1), w = pick(r, 20, 200, 10), t = pick(r, 10, 50, 5);
        const L = MU0 * (lam * 1e-9) ** 2 * len * 1e-6 / (w * 1e-9 * t * 1e-9) * 1e12;
        return { q: `A thin superconducting strip is $${len}\\ \\mu$m long, $${w}$ nm wide and $${t}$ nm thick, with penetration depth $\\lambda = ${lam}$ nm; take the supercurrent as uniform. With $\\mu_0 = 1.2566\\times10^{-6}$ H/m, its kinetic inductance $L_k = \\mu_0\\lambda^2\\ell/A$ is ______ pH (to one decimal place).`,
          answer: round(L, 1), tol: Math.max(0.1, round(L * 0.003, 1)), lam, len, w, t,
          sol: `$A = ${w}\\times${t}$ nm$^2 = ${round(w * t * 1e-4, 4)}\\times10^{-14}$ m$^2$. $L_k = \\dfrac{1.2566\\times10^{-6}\\times(${lam}\\times10^{-9})^2\\times${len}\\times10^{-6}}{${round(w * t * 1e-4, 4)}\\times10^{-14}} = ${round(L, 1)}$ pH.`,
          trap: 'Keep every length in metres; nm$^2$ to m$^2$ is a factor $10^{-18}$.' };
      },
      verify: (p) => MU0 * (p.lam * 1e-9) ** 2 * p.len * 1e-6 / (p.w * 1e-9 * p.t * 1e-9) * 1e12 },
    { id: 'scd-r4g3', type: 'nat', level: 5, exams: G, sub: 'type I and type II', unit: 'mT',
      make(r) {
        const lam = pick(r, 50, 400, 10), kap = choose(r, [5, 10, 20, 30, 50, 80, 100]), B = PHI0 / (4 * Math.PI * (lam * 1e-9) ** 2) * Math.log(kap) * 1000;
        return { q: `A type-II superconductor has penetration depth $\\lambda = ${lam}$ nm and $\\kappa = ${kap}$. Using $B_{c1}\\approx\\dfrac{\\Phi_0}{4\\pi\\lambda^2}\\ln\\kappa$ with $\\Phi_0 = 2.068\\times10^{-15}$ Wb, the lower critical field is ______ mT (to one decimal place).`,
          answer: round(B, 1), tol: Math.max(0.1, round(B * 0.003, 1)), lam, kap,
          sol: `$\\Phi_0/4\\pi\\lambda^2 = 2.068\\times10^{-15}/(4\\pi\\times(${lam}\\times10^{-9})^2) = ${round(PHI0 / (4 * Math.PI * (lam * 1e-9) ** 2) * 1000, 3)}$ mT, and $\\ln${kap} = ${round(Math.log(kap), 4)}$, so $B_{c1} = ${round(B, 1)}$ mT.`,
          trap: 'Use the natural logarithm of $\\kappa$.' };
      },
      verify: (p) => PHI0 / (4 * Math.PI * (p.lam * 1e-9) ** 2) * Math.log(p.kap) * 1000 },
  ],
};
