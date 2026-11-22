// Round 4 extras for free-electron-model: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const EFof = (n) => C.hbar ** 2 * (3 * Math.PI ** 2 * n) ** (2 / 3) / (2 * C.me); // joules
const kB_e = C.kB / C.e; // V/K

export default {
  items: [
    { id: 'fem-r4-01', type: 'mcq', level: 1, exams: A, sub: 'Fermi energy',
      q: R`Two pieces of the same pure metal at the same temperature have volumes $V$ and $2V$. In the free electron model, their Fermi energies are related by`,
      options: [R`$E_F$ of the larger piece is $2^{2/3}$ times higher`, R`$E_F$ of the larger piece is half as large`, R`the two Fermi energies are equal`, R`$E_F$ of the larger piece is $2^{1/3}$ times lower`], answer: 2,
      sol: R`$E_F = \dfrac{\hbar^2}{2m}(3\pi^2n)^{2/3}$ depends only on the electron density $n = N/V$. Doubling the piece doubles both $N$ and $V$, so $n$ and $E_F$ are unchanged: the Fermi energy is an intensive property of the material.`,
      trap: R`Using the number of electrons instead of their density.` },
    { id: 'fem-r4-02', type: 'mcq', level: 2, exams: A, sub: 'work function',
      q: R`In the free electron model of a metal, the conduction electrons sit in a potential well. If the Fermi energy (measured from the bottom of the well) is $7.0$ eV and the work function is $4.5$ eV, the bottom of the well lies below the vacuum level by`,
      options: [R`$11.5$ eV`, R`$4.5$ eV`, R`$7.0$ eV`, R`$2.5$ eV`], answer: 0,
      sol: R`The most energetic electrons, at $E_F$, need the work function $W$ to escape, so the vacuum level is $W$ above $E_F$. The well bottom lies a further $E_F$ below the Fermi level: depth $= E_F + W = 7.0 + 4.5 = 11.5$ eV.`,
      trap: R`The work function is measured from the Fermi level, not from the bottom of the band.` },
    { id: 'fem-r4-03', type: 'nat', level: 3, exams: G, sub: 'AC conductivity',
      q: R`In the Drude model, $\sigma(\omega) = \sigma_0/(1 - i\omega\tau)$. At a frequency where $\omega\tau = 2.5$, the real (dissipative) part of the conductivity is ______ times its DC value (to three decimal places).`,
      answer: 0.138, tol: 0.002, calc: () => 1 / (1 + 2.5 ** 2),
      sol: R`$\dfrac{1}{1 - i\omega\tau} = \dfrac{1 + i\omega\tau}{1 + \omega^2\tau^2}$, so $\text{Re}\,\sigma = \sigma_0/(1 + \omega^2\tau^2) = 1/(1 + 6.25) = 0.138\,\sigma_0$. Above $\omega\tau\approx1$ the electrons cannot follow the field in phase, absorption falls and the response becomes mostly reactive.`,
      trap: R`Using the magnitude $1/\sqrt{1 + \omega^2\tau^2} = 0.371$ instead of the real part.` },
    { id: 'fem-r4-04', type: 'nat', level: 4, exams: G, sub: 'screening',
      q: R`In the Thomas-Fermi model the screening wave vector satisfies $k_{TF}^2 = 3ne^2/(2\varepsilon_0E_F)$. For copper ($n = 8.47\times10^{28}$ m$^{-3}$, $E_F = 7.0$ eV), the screening length $1/k_{TF}$ is ______ pm (to one decimal place).`,
      answer: 55.2, tol: 0.3, calc: () => 1 / Math.sqrt(3 * 8.47e28 * C.e ** 2 / (2 * C.eps0 * 7.0 * C.e)) * 1e12,
      sol: R`$k_{TF}^2 = \dfrac{3\times8.47\times10^{28}\times(1.602\times10^{-19})^2}{2\times8.854\times10^{-12}\times7.0\times1.602\times10^{-19}} = \dfrac{6.52\times10^{-9}}{1.99\times10^{-29}} = 3.28\times10^{20}$ m$^{-2}$, so $1/k_{TF} = 5.52\times10^{-11}$ m $= 55.2$ pm. A charge in a metal is screened within less than one interatomic spacing, which is why the electrons barely feel individual ions.`,
      trap: R`Leaving $E_F$ in eV while $e$ is in coulombs mixes units by $1.6\times10^{-19}$.` },
    { id: 'fem-r4-05', type: 'mcq', level: 4, exams: G, sub: 'thermoelectricity',
      q: R`The Sommerfeld model gives the thermopower of a free electron metal as $S = -\dfrac{\pi^2}{2}\dfrac{k_B}{e}\dfrac{T}{T_F}$. For $T_F = 8.0\times10^4$ K at $300$ K, $S$ is about`,
      options: [R`$+1.6\ \mu$V/K`, R`$-130\ \mu$V/K`, R`$-0.43$ mV/K`, R`$-1.6\ \mu$V/K`], answer: 3,
      sol: R`$k_B/e = 86.2\ \mu$V/K. $S = -4.93\times86.2\times(300/8.0\times10^4) = -425\times3.75\times10^{-3} = -1.6\ \mu$V/K. A classical electron gas would give a value of order $k_B/e$ (about $-130\ \mu$V/K); only electrons within $k_BT$ of $E_F$ carry entropy, which cuts it by $T/T_F$. Real metals have small thermopowers of either sign.`,
      trap: R`The classical estimate ($-\tfrac32k_B/e$) is about 80 times too big.` },
    { id: 'fem-r4-06', type: 'mcq', level: 3, exams: G, sub: 'conduction',
      q: R`In copper ($k_F = 1.36\times10^{10}$ m$^{-1}$, relaxation time $2.5\times10^{-14}$ s) a field of $1$ V/m drives a steady current. The Fermi sphere is displaced by $\delta k = eE\tau/\hbar$. The ratio $\delta k/k_F$ is about`,
      options: [R`$3\times10^{-3}$`, R`$3\times10^{-9}$`, R`$3\times10^{-15}$`, R`$0.3$`], answer: 1,
      sol: R`$\delta k = 1.602\times10^{-19}\times1\times2.5\times10^{-14}/1.055\times10^{-34} = 38$ m$^{-1}$, and $38/1.36\times10^{10} = 2.8\times10^{-9}$. The current comes from a tiny shift of the whole sphere: only electrons near the Fermi surface find empty states to move into, but they move at $v_F\sim10^6$ m/s.`,
      trap: R`A tiny shift does not mean a tiny current: it is multiplied by the huge Fermi velocity of the electrons at the surface.` },
    { id: 'fem-r4-07', type: 'msq', level: 3, exams: A, sub: 'resistivity', format: 'statements',
      q: R`Which statements about the resistivity of metals are correct?`,
      options: [R`When scattering mechanisms act independently their rates add, so their resistivities add (Matthiessen's rule).`, R`The residual resistivity at the lowest temperatures comes from impurities and defects and hardly depends on temperature.`, R`A larger residual resistance ratio $\rho(300\text{ K})/\rho(4\text{ K})$ indicates a purer, more perfect sample.`, R`The phonon-limited resistivity is constant at high temperatures.`], answer: [0, 1, 2],
      sol: R`$1/\tau = 1/\tau_{imp} + 1/\tau_{ph}(T)$ gives $\rho = \rho_0 + \rho_{ph}(T)$. Impurity scattering is elastic and temperature-independent; the phonon part vanishes at low $T$ (as $T^5$) and grows linearly with $T$ above the Debye temperature because the number of phonons does. Fewer impurities mean a smaller $\rho_0$ and a larger ratio; very pure copper reaches thousands.`,
      trap: R`Above the Debye temperature the phonon population grows as $T$, and so does the resistivity.` },
    { id: 'fem-r4-08', type: 'msq', level: 4, exams: G, sub: 'heat capacity', format: 'statements',
      q: R`The low-temperature electronic heat capacity of a metal is $C_{el} = \gamma T$. Which statements are correct?`,
      options: [R`$\gamma$ is proportional to the density of states at the Fermi level, so the ratio $\gamma_{exp}/\gamma_{free}$ measures a thermal effective mass $m^*/m$.`, R`In the free electron model, at fixed valence and atomic density, $\gamma\propto m n^{1/3}$.`, R`The Pauli spin susceptibility, like $\gamma$, is proportional to the density of states at the Fermi level.`, R`At room temperature the electronic heat capacity of a typical metal is larger than the lattice heat capacity.`], answer: [0, 1, 2],
      sol: R`$\gamma = \tfrac{\pi^2}{3}k_B^2g(E_F)$, and for free electrons $g(E_F) = 3n/2E_F\propto mn^{1/3}$ (since $E_F\propto n^{2/3}/m$). Any band or interaction effect that changes $g(E_F)$ shows up as an effective mass. $\chi_P = \mu_0\mu_B^2g(E_F)$ uses the same density of states. At 300 K, $C_{el}/C_{lattice}\sim(\pi^2/2)(T/T_F)/3$, below 1%: the lattice wins easily.`,
      trap: R`The electronic term is linear in $T$ and wins only at a few kelvin, where the lattice term ($\propto T^3$) has died away.` },
    { id: 'fem-r4-09', type: 'nat', level: 5, exams: G, sub: 'resistivity',
      q: R`A copper sample has $n = 8.5\times10^{28}$ m$^{-3}$, $v_F = 1.57\times10^6$ m/s, resistivity $1.70\times10^{-8}\ \Omega$ m at $300$ K and residual resistance ratio $\rho(300\text{ K})/\rho(4\text{ K}) = 500$. Taking the free electron mass, its electron mean free path at $4$ K is ______ $\mu$m (to one decimal place).`,
      answer: 19.3, tol: 0.1, calc: () => 1.57e6 * C.me / (8.5e28 * C.e ** 2 * 1.70e-8) * 500 * 1e6,
      sol: R`At 300 K, $\tau = m/(ne^2\rho) = 9.11\times10^{-31}/(8.5\times10^{28}\times2.57\times10^{-38}\times1.70\times10^{-8}) = 2.46\times10^{-14}$ s, so $\ell = v_F\tau = 38.6$ nm. At 4 K the resistivity is 500 times smaller, so $\tau$ and $\ell$ are 500 times longer: $\ell = 19.3\ \mu$m. Thin films and wires of that size start to show size effects at low temperature.`,
      trap: R`Using a thermal speed $\sqrt{3k_BT/m}$ instead of $v_F$: only electrons at the Fermi surface carry the current.` },
    { id: 'fem-r4-10', type: 'nat', level: 2, exams: A, sub: 'conduction',
      q: R`A copper wire ($8.5\times10^{28}$ free electrons per m$^3$) carries a current density of $1.0\times10^6$ A/m$^2$. The electrons' drift speed is ______ mm/s (to three decimal places).`,
      answer: 0.073, tol: 0.001, calc: () => 1e6 / (8.5e28 * C.e) * 1e3,
      sol: R`$v_d = J/(ne) = 10^6/(8.5\times10^{28}\times1.602\times10^{-19}) = 7.34\times10^{-5}$ m/s $= 0.073$ mm/s. That is about $10^{-10}$ of the Fermi velocity; signals travel fast because the field, not the electrons, moves along the wire.`,
      trap: R`Mixing m/s with mm/s; the drift is far slower than walking pace.` },
    { id: 'fem-r4-11', type: 'mcq', level: 5, exams: G, sub: 'scattering',
      q: R`In a metal at low temperature, the rate at which conduction electrons at the Fermi level scatter off one another (electron-electron scattering) varies with temperature as`,
      options: [R`$T^2$`, R`$T$`, R`$T^5$`, R`independent of $T$`], answer: 0,
      sol: R`By the Pauli principle an electron at $E_F$ can only scatter with a partner within about $k_BT$ of $E_F$, and both must end in empty states within about $k_BT$: phase space gives a rate $\propto(k_BT/E_F)^2$. This is why electrons in a metal behave as nearly independent particles despite their strong Coulomb repulsion. $T^5$ is the low-temperature phonon resistivity (Bloch-Grüneisen) and $T$ the high-temperature phonon one.`,
      trap: R`$T^5$ belongs to phonon scattering at low temperature, not to electron-electron collisions.` },
    { id: 'fem-r4-12', type: 'mcq', level: 2, exams: A, sub: 'Fermi energy',
      q: R`Sodium has $2.65\times10^{28}$ and aluminium $18.1\times10^{28}$ conduction electrons per m$^3$. The ratio of aluminium's free-electron Fermi energy to sodium's is about`,
      options: [R`$6.83$`, R`$3.60$`, R`$2.61$`, R`$46.7$`], answer: 1,
      sol: R`$E_F\propto n^{2/3}$, so the ratio is $(18.1/2.65)^{2/3} = 6.83^{2/3} = 3.60$. (Measured values: about $11.7$ eV against $3.24$ eV.)`,
      trap: R`$E_F$ grows as $n^{2/3}$, not as $n$ ($6.83$) or $n^{1/2}$ ($2.61$).` },
  ],
  gens: [
    { id: 'fem-r4g1', type: 'nat', level: 4, exams: G, sub: 'screening',
      make(r) {
        const n28 = pick(r, 1, 20, 0.5), n = n28 * 1e28, EF = EFof(n);
        const L = 1 / Math.sqrt(3 * n * C.e ** 2 / (2 * C.eps0 * EF)) * 1e12;
        return { q: `A free-electron metal has $${n28}\\times10^{28}$ conduction electrons per m$^3$. Using $E_F = \\dfrac{\\hbar^2}{2m}(3\\pi^2n)^{2/3}$ and $k_{TF}^2 = 3ne^2/(2\\varepsilon_0E_F)$, its Thomas-Fermi screening length $1/k_{TF}$ is ______ pm (to one decimal place).`,
          answer: round(L, 1), tol: Math.max(0.1, round(L * 0.003, 1)), n28,
          sol: `$E_F = ${round(EF / C.e, 3)}$ eV. $k_{TF}^2 = 3\\times${n28}\\times10^{28}\\times(1.602\\times10^{-19})^2/(2\\times8.854\\times10^{-12}\\times${round(EF / C.e, 3)}\\times1.602\\times10^{-19}) = ${(3 * n * C.e ** 2 / (2 * C.eps0 * EF)).toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ m$^{-2}$, so $1/k_{TF} = ${round(L, 1)}$ pm. Since $E_F\\propto n^{2/3}$, the length goes as $n^{-1/6}$: very weakly.`,
          trap: 'Mixing eV and joules for $E_F$.' };
      },
      verify: (p) => { const n = p.n28 * 1e28; return 1 / Math.sqrt(3 * n * C.e ** 2 / (2 * C.eps0 * EFof(n))) * 1e12; } },
    { id: 'fem-r4g2', type: 'nat', level: 3, exams: G, sub: 'thermoelectricity',
      make(r) {
        const EFeV = pick(r, 2, 12, 0.1), T = choose(r, [77, 150, 200, 300, 400, 600]);
        const TF = EFeV * C.e / C.kB, S = Math.PI ** 2 / 2 * kB_e * T / TF * 1e6;
        return { q: `For a free electron metal with $E_F = ${EFeV}$ eV, the Sommerfeld thermopower is $S = -\\dfrac{\\pi^2}{2}\\dfrac{k_B}{e}\\dfrac{T}{T_F}$. At $${T}$ K its magnitude is ______ $\\mu$V/K (to three decimal places).`,
          answer: round(S, 3), tol: Math.max(0.001, round(S * 0.003, 3)), EFeV, T,
          sol: `$T_F = E_F/k_B = ${round(TF, 0)}$ K. $|S| = 4.935\\times86.17\\ \\mu\\text{V/K}\\times${T}/${round(TF, 0)} = ${round(S, 3)}\\ \\mu$V/K. The small ratio $T/T_F$ is what makes it tiny.`,
          trap: 'Using the classical value of order $k_B/e$, which ignores the Pauli principle.' };
      },
      verify: (p) => Math.PI ** 2 / 2 * kB_e * p.T / (p.EFeV * C.e / C.kB) * 1e6 },
    { id: 'fem-r4g3', type: 'mcq', level: 2, exams: A, sub: 'scaling',
      make(r) {
        const n1 = pick(r, 1, 6, 0.5), n2 = round(n1 * pick(r, 1.5, 8, 0.5), 2), ask = choose(r, ['EF', 'kF', 'vF', 'lF']);
        const x = n2 / n1, p = ask === 'EF' ? 2 / 3 : ask === 'lF' ? -1 / 3 : 1 / 3;
        const val = x ** p, others = [1, 1 / 3, 2 / 3, 1 / 2, -1 / 3, -2 / 3].filter((e) => e !== p).map((e) => round(x ** e, 3));
        const o = mcqOptions(r, round(val, 3), others, (v) => `$${v.toFixed(3)}$`);
        const what = ask === 'EF' ? 'Fermi energy' : ask === 'kF' ? 'Fermi wave vector' : ask === 'vF' ? 'Fermi velocity' : 'Fermi wavelength';
        return { q: `Metal B has $${n2}\\times10^{28}$ and metal A $${n1}\\times10^{28}$ conduction electrons per m$^3$. In the free electron model, the ratio of B's ${what} to A's is`, ...o,
          sol: `$k_F = (3\\pi^2n)^{1/3}$, so $k_F$ and $v_F = \\hbar k_F/m$ go as $n^{1/3}$, the wavelength $2\\pi/k_F$ as $n^{-1/3}$, and $E_F = \\hbar^2k_F^2/2m$ as $n^{2/3}$. Here $n_B/n_A = ${round(x, 4)}$, giving $${round(x, 4)}^{${ask === 'EF' ? '2/3' : ask === 'lF' ? '-1/3' : '1/3'}} = ${round(val, 3)}$.`,
          trap: 'Mixing up the powers: $E_F\\propto n^{2/3}$ but $k_F, v_F\\propto n^{1/3}$.' };
      } },
  ],
};
