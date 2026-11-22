// Round 4 extras for nuclear-properties: original questions, written 2026-11-22.
import { pick, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const HC = 197.327, MUN_H = 7.6226;   // MeV fm; mu_N/h in MHz per tesla
const sig3 = (x) => +x.toPrecision(3);
const fermiE = (count, A, mc2) => { const V = 4 / 3 * Math.PI * (1.2 * Math.cbrt(A)) ** 3, k = Math.cbrt(3 * Math.PI ** 2 * count / V); return (HC * k) ** 2 / (2 * mc2); };
const SPINS = [['0', 0], ['\\tfrac12', 0.5], ['1', 1], ['\\tfrac32', 1.5], ['2', 2], ['\\tfrac52', 2.5], ['3', 3], ['\\tfrac72', 3.5]];
const POLES = ['no static moment beyond the total charge', 'an electric quadrupole moment', 'an electric hexadecapole ($2^4$-pole) moment', 'an electric $2^6$-pole moment'];

export default {
  items: [
    { id: 'npr-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'nuclear size',
      q: R`With $R = 1.2A^{1/3}$ fm, the radius of the $^{27}$Al nucleus is about`,
      options: [R`$3.6$ fm`, R`$0.36$ fm`, R`$36$ fm`, R`$3.6$ Å`], answer: 0,
      sol: R`$27^{1/3} = 3$, so $R = 1.2\times3 = 3.6$ fm $= 3.6\times10^{-15}$ m. An ångström ($10^{-10}$ m) is the size of a whole atom, about $30\,000$ times larger.`,
      trap: R`Confusing femtometres with ångströms: the nucleus is tens of thousands of times smaller than the atom.` },
    { id: 'npr-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'spin',
      q: R`A nucleus with spin $I = \tfrac32$ and a non-zero magnetic moment is placed in a uniform magnetic field. Its ground state splits into how many energy levels?`,
      options: [R`$3$`, R`$4$`, R`$5$`, R`$2$`], answer: 1,
      sol: R`The energy is $-\mu B m_I/I$ with $m_I = -I, -I + 1, \dots, I$, so there are $2I + 1 = 4$ equally spaced levels ($m_I = \pm\tfrac32, \pm\tfrac12$). Magnetic dipole transitions ($\Delta m_I = \pm1$) between neighbours all have the same frequency, which is why a single NMR line is seen.`,
      trap: R`Counting $2I = 3$ levels, or $I + 1$.` },
    { id: 'npr-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'magnetic moments',
      q: R`Using $e = 1.602\times10^{-19}$ C, $\hbar = 1.0546\times10^{-34}$ J s and $m_p = 1.6726\times10^{-27}$ kg, the nuclear magneton $\mu_N = e\hbar/2m_p$, expressed in eV/T, is ______ $\times10^{-8}$ eV/T (two decimal places).`,
      answer: 3.15, tol: 0.01, unit: 'eV/T', calc: () => 1.0546e-34 / (2 * 1.6726e-27) * 1e8,
      sol: R`In joules per tesla $\mu_N = \dfrac{1.602\times10^{-19}\times1.0546\times10^{-34}}{2\times1.6726\times10^{-27}} = 5.05\times10^{-27}$ J/T. Dividing by $e$ to convert to eV removes the charge again: $\mu_N = \dfrac{\hbar}{2m_p} = \dfrac{1.0546\times10^{-34}}{3.3452\times10^{-27}} = 3.15\times10^{-8}$ eV/T. That is $1836$ times smaller than the Bohr magneton ($5.79\times10^{-5}$ eV/T), which is why nuclear Zeeman splittings are so small.`,
      trap: R`Using the electron mass, which gives the Bohr magneton.` },
    { id: 'npr-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetic moments',
      q: R`The deuteron has spin $I = 1$ and magnetic moment $\mu = 0.8574\,\mu_N$. With $\mu_N/h = 7.6226$ MHz/T, its NMR (Larmor) frequency in a $9.40$ T magnet is ______ MHz (one decimal place).`,
      answer: 61.4, tol: 0.2, unit: 'MHz', calc: () => 0.8574 / 1 * 7.6226 * 9.4,
      sol: R`Neighbouring levels differ by $\Delta E = \dfrac{\mu B}{I}$ (the levels are $-\mu Bm_I/I$). So $\nu = \dfrac{\mu}{I}\dfrac{B}{h} = \dfrac{0.8574}{1}\times7.6226\times9.40 = 61.4$ MHz. The same magnet gives $400$ MHz for protons ($\mu = 2.793\,\mu_N$ but $I = \tfrac12$), so the deuteron line is about $6.5$ times lower.`,
      trap: R`Using $\nu = 2\mu B/h$ as for a spin-$\tfrac12$ nucleus; the general rule divides by $I$, not multiplies by 2.` },
    { id: 'npr-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'electron scattering',
      q: R`In elastic electron scattering, nucleus X (mass number $A$) shows its first diffraction minimum at momentum transfer $q_1$. Assuming $R \propto A^{1/3}$ and the same shape of charge distribution, a nucleus with mass number $8A$ shows its first minimum at`,
      options: [R`$q_1/2$`, R`$q_1/8$`, R`$2q_1$`, R`$q_1/\sqrt8$`], answer: 0,
      sol: R`For a fixed shape the form factor depends on $qR$ only, so the minima occur at fixed values of $qR$ (for a uniform sphere, $qR = 4.49$). The radius grows by $8^{1/3} = 2$, so the minimum moves to $q_1/2$. Larger objects diffract to smaller angles, as in optics.`,
      trap: R`Scaling with $A$ instead of $A^{1/3}$.` },
    { id: 'npr-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'magnetic moments',
      q: R`Which of these nuclei have ZERO magnetic dipole moment in their ground state?`,
      options: [R`$^4$He`, R`$^{14}$N`, R`$^{16}$O`, R`$^2$H`], answer: [0, 2],
      sol: R`A magnetic dipole moment needs spin $I \ge \tfrac12$. Even-even nuclei ($^4$He, $^{16}$O) have $I = 0$, so no magnetic moment. $^{14}$N (odd-odd) has $I = 1$ and $\mu = 0.404\,\mu_N$; the deuteron has $I = 1$ and $\mu = 0.857\,\mu_N$.`,
      trap: R`Thinking odd-odd nuclei have no moment because the odd proton and neutron "cancel".` },
    { id: 'npr-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'quadrupole moments',
      q: R`In the single-particle picture, consider (a) one proton in an orbit with $j \ge \tfrac32$ outside a closed shell, and (b) one proton missing (a hole) from the same orbit of an otherwise closed shell. Their spectroscopic quadrupole moments are`,
      options: [R`both negative`, R`(a) positive, (b) negative`, R`both zero`, R`(a) negative (oblate charge), (b) positive (prolate)`], answer: 3,
      sol: R`In the state $m = j$ the single proton circulates near the equatorial plane, so its charge is spread out like a flattened (oblate) disc: $Q_{sp} \approx -\dfrac{2j - 1}{2(j + 1)}\langle r^2\rangle < 0$. A closed shell is spherical ($Q = 0$), so removing one proton leaves a distribution equal to "sphere minus oblate", which is prolate: the hole has the same magnitude with the opposite sign. Nuclei just below a magic proton number tend to show positive $Q$, those just above it negative $Q$.`,
      trap: R`Expecting a single orbiting proton to be elongated along the spin axis; a disc-like orbit is oblate.` },
    { id: 'npr-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi gas',
      q: R`Treat the $126$ neutrons of $^{208}$Pb as a free Fermi gas filling a sphere of radius $R = 1.2A^{1/3}$ fm ($\hbar c = 197.327$ MeV fm, $m_nc^2 = 939.565$ MeV). The neutron Fermi energy is ______ MeV (one decimal place).`,
      answer: 37.9, tol: 0.3, unit: 'MeV', calc: () => { const V = 4 / 3 * Math.PI * (1.2 * Math.cbrt(208)) ** 3, k = Math.cbrt(3 * Math.PI ** 2 * 126 / V); return (197.327 * k) ** 2 / (2 * 939.565); },
      sol: R`$R = 1.2\times208^{1/3} = 7.11$ fm, $V = \tfrac43\pi R^3 = 1506$ fm$^3$, so the neutron density is $n = 126/1506 = 0.0837$ fm$^{-3}$. For spin-$\tfrac12$ particles $k_F = (3\pi^2n)^{1/3} = 1.353$ fm$^{-1}$, and $E_F = \dfrac{(\hbar ck_F)^2}{2m_nc^2} = \dfrac{(267.0)^2}{1879.1} = 37.9$ MeV. The 82 protons give only $28.5$ MeV; in a real nucleus the Coulomb repulsion raises the proton well so that the two Fermi levels line up.`,
      trap: R`Using all 208 nucleons as one gas, or forgetting the factor 2 for spin ($k_F = (6\pi^2n)^{1/3}$ applies to spinless particles).` },
    { id: 'npr-r4-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'static moments',
      q: R`A nucleus in its ground state has spin $I = \tfrac32$ and definite parity. Which static multipole moments CAN be non-zero?`,
      options: [R`Magnetic dipole (M1)`, R`Electric quadrupole (E2)`, R`Magnetic octupole (M3)`, R`Electric hexadecapole (E4)`], answer: [0, 1, 2],
      sol: R`Two rules apply. (1) A static moment of order $2^L$ needs $L \le 2I$ (the Wigner-Eckart theorem with a vector of length $I$), so $I = \tfrac32$ allows $L \le 3$ and rules out E4. (2) Parity and time-reversal invariance allow only even-$L$ electric moments and odd-$L$ magnetic moments (no E1, M2, E3). What remains is E0 (the charge), M1, E2 and M3.`,
      trap: R`Allowing every $L$ up to $2I$ of both kinds, or capping it at $L \le I$.` },
    { id: 'npr-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'charge distribution',
      q: R`A uniform sphere of radius $c$ and a Fermi distribution $\rho_0/[1 + e^{(r - c)/a}]$ with the same half-density radius $c$ (and $a > 0$) are compared. Which has the larger rms radius?`,
      options: [R`The uniform sphere, since the Fermi shape loses charge near the surface`, R`Both are equal, since $c$ is the same`, R`The Fermi distribution: the charge pushed beyond $c$ by the diffuse surface counts with weight $r^2$`, R`It depends on the total charge only`], answer: 2,
      sol: R`Compared with a sharp edge at $c$, a diffuse surface moves some charge from just inside $c$ to just outside it, by equal amounts. The mean of $r^2$ weights the outer charge more, so the rms radius grows: approximately $\langle r^2\rangle \approx \tfrac35c^2 + \tfrac75\pi^2a^2$. With $c = 6.6$ fm and $a = 0.55$ fm the uniform value $5.11$ fm rises to about $5.50$ fm.`,
      trap: R`Treating the half-density radius as if it fixed the rms radius.` },
  ],
  gens: [
    { id: 'npr-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'magnetic moments',
      make(r) {
        const [nm, I, It, mu] = choose(r, [['^{1}\\text{H}', 0.5, '\\tfrac12', 2.7928], ['^{2}\\text{H}', 1, '1', 0.8574], ['^{7}\\text{Li}', 1.5, '\\tfrac32', 3.2564], ['^{13}\\text{C}', 0.5, '\\tfrac12', 0.7024],
          ['^{14}\\text{N}', 1, '1', 0.4038], ['^{23}\\text{Na}', 1.5, '\\tfrac32', 2.2175], ['^{27}\\text{Al}', 2.5, '\\tfrac52', 3.6415], ['^{31}\\text{P}', 0.5, '\\tfrac12', 1.1316]]);
        const B = choose(r, [1.5, 3, 7.05, 9.4, 11.7, 14.1]), ans = mu / I * MUN_H * B;
        return { q: R`The nucleus $${nm}$ has spin $I = ${It}$ and magnetic moment $\mu = ${mu}\,\mu_N$. With $\mu_N/h = 7.6226$ MHz/T, its NMR frequency in a field of $${B}$ T is ______ MHz (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.005), I, mu, B,
          sol: R`The $2I + 1$ levels $-\mu Bm_I/I$ are spaced by $\mu B/I$, so $\nu = \dfrac{\mu}{I}\dfrac{B}{h} = \dfrac{${mu}}{${I}}\times7.6226\times${B} = ${sig3(ans)}$ MHz.`,
          trap: R`Using $2\mu B/h$, which is right only for $I = \tfrac12$.` };
      },
      verify: (p) => p.mu / p.I * MUN_H * p.B },
    { id: 'npr-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fermi gas',
      make(r) {
        const [nm, Z, A] = choose(r, [['^{48}\\text{Ca}', 20, 48], ['^{90}\\text{Zr}', 40, 90], ['^{120}\\text{Sn}', 50, 120], ['^{208}\\text{Pb}', 82, 208], ['^{238}\\text{U}', 92, 238]]);
        const neu = choose(r, [true, false]), cnt = neu ? A - Z : Z, mc2 = neu ? 939.565 : 938.272, ans = fermiE(cnt, A, mc2), V = 4 / 3 * Math.PI * (1.2 * Math.cbrt(A)) ** 3;
        return { q: R`Treat the ${neu ? 'neutrons' : 'protons'} of $${nm}$ ($Z = ${Z}$) as a free Fermi gas in a sphere of radius $1.2A^{1/3}$ fm ($\hbar c = 197.327$ MeV fm, $mc^2 = ${mc2}$ MeV). Their Fermi energy is ______ MeV (one decimal place).`,
          answer: round(ans, 1), tol: round(Math.max(0.2, ans * 0.01), 1), cnt, A, mc2,
          sol: R`$V = \tfrac43\pi(1.2\times${A}^{1/3})^3 = ${round(V, 1)}$ fm$^3$, density $${cnt}/${round(V, 1)} = ${round(cnt / V, 4)}$ fm$^{-3}$, $k_F = (3\pi^2n)^{1/3} = ${round(Math.cbrt(3 * Math.PI ** 2 * cnt / V), 4)}$ fm$^{-1}$, $E_F = (\hbar ck_F)^2/2mc^2 = ${round(ans, 1)}$ MeV.`,
          trap: R`Counting all nucleons in one gas, or leaving out the spin degeneracy.` };
      },
      verify: (p) => fermiE(p.cnt, p.A, p.mc2) },
    { id: 'npr-r4g3', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'static moments',
      make(r) {
        const [It, I] = choose(r, SPINS), Lmax = Math.floor(2 * I / 2) * 2, k = Lmax / 2;
        const o = mcqOptions(r, POLES[k], POLES.filter((_, i) => i !== k), (v) => v);
        return { q: R`A nucleus in a state of definite parity has spin $I = ${It}$. The highest-order ELECTRIC static moment it can have is`, ...o, I,
          sol: R`A static $2^L$-pole needs $L \le 2I = ${2 * I}$, and parity with time reversal allow only even $L$ for electric moments. The largest even $L \le ${2 * I}$ is $${Lmax}$, so the answer is ${POLES[k]}.`,
          trap: R`Forgetting that odd-$L$ electric moments (such as a dipole) vanish for a state of definite parity.` };
      } },
  ],
};
