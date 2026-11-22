// Round 4 extras for binding-energy-semf: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const U = 931.494, DH = 7.2890, DN = 8.0713, MHE = 4.00260325;   // MeV per u; mass excesses of 1H and n (MeV); 4He mass (u)
const curv = (A) => 8 * 23.2 / A + 2 * 0.714 / Math.cbrt(A);       // d^2M/dZ^2 in MeV (Z^2 Coulomb term)
const fisQ = (Z, A, x) => { const ES = 18.3 * A ** (2 / 3), EC = 0.714 * Z * Z / Math.cbrt(A);
  return ES + EC - ES * (x ** (2 / 3) + (1 - x) ** (2 / 3)) - EC * (x ** (5 / 3) + (1 - x) ** (5 / 3)); };

export default {
  items: [
    { id: 'bse-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'liquid-drop terms',
      q: R`For which of these nuclei is the asymmetry term $a_a(N - Z)^2/A$ of the mass formula exactly zero?`,
      options: [R`$^{40}$Ca`, R`$^{48}$Ca`, R`$^{208}$Pb`, R`$^{56}$Fe`], answer: 0,
      sol: R`The asymmetry term vanishes only when $N = Z$. $^{40}$Ca has $Z = 20$, $N = 20$. The others have extra neutrons: $^{48}$Ca ($N - Z = 8$), $^{208}$Pb ($N - Z = 44$) and $^{56}$Fe ($N - Z = 4$).`,
      trap: R`Picking a doubly magic nucleus such as $^{48}$Ca or $^{208}$Pb: being magic has nothing to do with the asymmetry term.` },
    { id: 'bse-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'mass excess',
      q: R`The mass excess is $\Delta = (M - A\,\text{u})c^2$, with $M$ the atomic mass. Which of these has a NEGATIVE mass excess?`,
      options: [R`$^1$H`, R`the free neutron`, R`$^4$He`, R`$^{16}$O`], answer: 3,
      sol: R`Since $^{12}$C defines the unit, $\Delta(^{12}\text{C}) = 0$. A nucleon on its own weighs more than $1$ u ($\Delta = 7.29$ MeV for $^1$H and $8.07$ MeV for the neutron), because $1$ u is one twelfth of a BOUND carbon atom. $^4$He is less tightly bound per nucleon than $^{12}$C and still has $\Delta = +2.42$ MeV. $^{16}$O is more tightly bound per nucleon than carbon, so its mass is below $16$ u: $\Delta = -4.74$ MeV. Nuclides from oxygen up to the lead region have negative mass excesses, which turn positive again for the heaviest nuclei.`,
      trap: R`Thinking a mass excess must be positive because nuclei have a mass "defect"; the sign compares with $^{12}$C, not with free nucleons.` },
    { id: 'bse-r4-03', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'separation energies',
      q: R`For EVERY nucleus that is stable (in its ground state), which of these quantities must be positive?`,
      options: [R`The neutron separation energy $S_n$`, R`The proton separation energy $S_p$`, R`The mass excess $\Delta$`, R`The total binding energy $B$`], answer: [0, 1, 3],
      sol: R`If $S_n$ or $S_p$ were negative, the nucleus could emit a neutron or a proton spontaneously and would not be stable (it would sit beyond a drip line). $B > 0$ for any bound nucleus, otherwise it would fall apart into free nucleons. The mass excess compares the atomic mass with $A$ atomic mass units, which is a bookkeeping choice: many stable nuclides (for example $^{16}$O, $^{56}$Fe, $^{208}$Pb) have negative $\Delta$ while light and very heavy ones have positive $\Delta$.`,
      trap: R`Treating the mass excess as a kind of binding energy; its sign carries no information about stability.` },
    { id: 'bse-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'cluster break-up',
      q: R`Atomic masses: $^4$He $4.002603$ u, $^{12}$C $12.000000$ u, with $1$ u $= 931.494$ MeV$/c^2$. The minimum energy needed to break a $^{12}$C nucleus into three alpha particles is ______ MeV (two decimal places).`,
      answer: 7.27, tol: 0.02, unit: 'MeV', calc: () => (3 * 4.002603 - 12) * 931.494,
      sol: R`The energy needed is the rest-energy gain: $E = [3M(^4\text{He}) - M(^{12}\text{C})]c^2 = (12.007809 - 12.000000)\times931.494 = 0.007809\times931.494 = 7.27$ MeV. Atomic masses are fine here because both sides carry six electrons. This is far less than the $92$ MeV total binding energy of $^{12}$C, because each alpha particle keeps its own $28.3$ MeV: $92.16 - 3\times28.30 = 7.27$ MeV.`,
      trap: R`Answering with the total binding energy of carbon-12, which is the cost of breaking it into twelve free nucleons, not into three alphas.` },
    { id: 'bse-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'liquid-drop terms',
      q: R`With $a_s = 18.3$ MeV, by how much does the surface term lower the binding energy PER NUCLEON of a nucleus with $A = 8$ more than that of a nucleus with $A = 64$? Answer in MeV (two decimal places).`,
      answer: 4.58, tol: 0.02, unit: 'MeV', calc: () => 18.3 * (8 ** (-1 / 3) - 64 ** (-1 / 3)),
      sol: R`Per nucleon the surface term is $-a_sA^{2/3}/A = -a_sA^{-1/3}$. For $A = 8$: $18.3/2 = 9.150$ MeV. For $A = 64$: $18.3/4 = 4.575$ MeV. The difference is $9.150 - 4.575 = 4.58$ MeV. In light nuclei a large share of the nucleons sit at the surface with fewer neighbours, which is the main reason $B/A$ rises steeply at small $A$.`,
      trap: R`Using the whole term $a_sA^{2/3}$ instead of the per-nucleon value $a_sA^{-1/3}$.` },
    { id: 'bse-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'binding curve',
      q: R`Imagine a world where the surface term of the mass formula were absent, every other term unchanged. Which statement would then be true?`,
      options: [R`The binding energy per nucleon would still peak near iron`, R`$B/A$ would be largest for the lightest nuclei and fall steadily with $A$, so fusing light nuclei would absorb energy while fission would release energy for every nucleus`, R`Fusion of hydrogen into helium would release more energy than it does now`, R`All nuclei would be unstable against alpha decay`], answer: 1,
      sol: R`The peak of $B/A$ comes from a competition: the surface term ($-a_sA^{-1/3}$ per nucleon) favours large $A$, the Coulomb term (growing like $Z^2/A^{4/3} \sim A^{2/3}$ per nucleon) favours small $A$. Without the surface term only the Coulomb and asymmetry terms reduce $B/A$ from $a_v$, and both grow (or stay non-negative) with $A$. So $B/A$ would start near $a_v \approx 16$ MeV for the lightest nuclei and decrease steadily: joining two nuclei would lower the total binding energy (fusion would cost energy), and splitting any nucleus would release energy.`,
      trap: R`Assuming the iron peak is a fixed fact of nature; it is the balance point of two terms, and removing one moves it to the end of the curve.` },
    { id: 'bse-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'mass parabolas',
      q: R`For odd $A$ the atomic mass, as a function of $Z$, is a parabola with second derivative $\dfrac{d^2M c^2}{dZ^2} = \dfrac{8a_a}{A} + \dfrac{2a_c}{A^{1/3}}$ (Coulomb term with $Z^2$). Take $A = 125$, $a_a = 23.2$ MeV, $a_c = 0.714$ MeV, and suppose the minimum of the parabola falls exactly at an integer $Z_0$. The $Q$ value for $\beta^-$ decay of the isobar with $Z = Z_0 - 2$ (to $Z_0 - 1$) is ______ MeV (two decimal places).`,
      answer: 2.66, tol: 0.02, unit: 'MeV', calc: () => 1.5 * (8 * 23.2 / 125 + 2 * 0.714 / 5),
      sol: R`Write $Mc^2 = \text{const} + \tfrac12k(Z - Z_0)^2$ with $k = \dfrac{8\times23.2}{125} + \dfrac{2\times0.714}{5} = 1.4848 + 0.2856 = 1.7704$ MeV. With atomic masses, $Q_{\beta^-} = [M(Z) - M(Z + 1)]c^2 = \tfrac12k\left[(Z - Z_0)^2 - (Z + 1 - Z_0)^2\right]$. For $Z - Z_0 = -2$: $\tfrac12k(4 - 1) = 1.5k = 2.66$ MeV. The decay one step further, $Z_0 - 1 \to Z_0$, has only $0.5k = 0.89$ MeV: $Q$ values shrink as the chain nears the valley floor.`,
      trap: R`Using the mass difference $\tfrac12k\times2^2 = 2k$ between $Z_0 - 2$ and the stable isobar: the decay goes one step at a time.` },
    { id: 'bse-r4-08', type: 'msq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'decay Q values', format: 'statements',
      q: R`Mass excesses: $^{14}$C $3.0199$ MeV, $^{14}$N $2.8634$ MeV, $^{14}$O $8.0075$ MeV (from ATOMIC masses; $m_ec^2 = 0.511$ MeV). Which statements are correct?`,
      options: [R`$^{14}$C decays by $\beta^-$ with $Q = 0.156$ MeV`, R`$^{14}$O decays by $\beta^+$ with $Q = 4.12$ MeV`, R`Electron capture of $^{14}$O to $^{14}$N also has $Q = 4.12$ MeV`, R`$^{14}$N is stable against decay to either of its isobars listed`], answer: [0, 1, 3],
      sol: R`With atomic masses: $Q_{\beta^-} = \Delta_P - \Delta_D$, $Q_{\beta^+} = \Delta_P - \Delta_D - 2m_ec^2$ and $Q_{EC} = \Delta_P - \Delta_D$ (neglecting electron binding). $^{14}$C $\to$ $^{14}$N: $3.0199 - 2.8634 = 0.156$ MeV. $^{14}$O $\to$ $^{14}$N by $\beta^+$: $8.0075 - 2.8634 - 1.022 = 4.12$ MeV; by electron capture the full $5.14$ MeV is available, so the third statement is wrong. $^{14}$N has the lowest mass of the three, so it cannot decay to either.`,
      trap: R`Subtracting $2m_ec^2$ for electron capture as well; that term belongs only to $\beta^+$ decay with atomic masses.` },
    { id: 'bse-r4-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'fission',
      q: R`Keep only the surface and Coulomb terms, $E = a_sA^{2/3} + a_cZ^2/A^{1/3}$ with $a_s = 18.3$ MeV and $a_c = 0.714$ MeV. A nucleus with $Z = 92$, $A = 236$ splits into two fragments with mass numbers in the ratio $1 : 2$ (both with the same $Z/A$ as the parent). The energy released is ______ MeV (nearest whole number).`,
      answer: 153, tol: 2, unit: 'MeV', calc: () => { const A = 236, Z = 92, ES = 18.3 * A ** (2 / 3), EC = 0.714 * Z * Z / Math.cbrt(A), x = 1 / 3; return ES + EC - ES * (x ** (2 / 3) + (1 - x) ** (2 / 3)) - EC * (x ** (5 / 3) + (1 - x) ** (5 / 3)); },
      sol: R`Parent: $E_S = 18.3\times236^{2/3} = 698.9$ MeV and $E_C = 0.714\times92^2/236^{1/3} = 977.9$ MeV. A fragment with a fraction $x$ of the nucleons (and of the charge) has $E_S x^{2/3}$ and $E_C x^{5/3}$. With $x = \tfrac13$ and $\tfrac23$: $x^{2/3}$ sum $= 0.4807 + 0.7631 = 1.2438$ and $x^{5/3}$ sum $= 0.1602 + 0.5087 = 0.6690$. Released energy $= 698.9(1 - 1.2438) + 977.9(1 - 0.6690) = -170.4 + 323.7 = 153$ MeV. The symmetric split gives about $180$ MeV in the same model, so the liquid drop alone cannot explain why uranium prefers to split asymmetrically: that comes from shell effects in the fragments.`,
      trap: R`Scaling the Coulomb energy of a fragment with its charge squared only ($x^2$); its radius shrinks too, giving $x^2/x^{1/3} = x^{5/3}$.` },
    { id: 'bse-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'asymmetry energy',
      q: R`Treating the nucleus as two Fermi gases (Fermi energy about $37$ MeV), the KINETIC energy alone gives an asymmetry coefficient of about`,
      options: [R`$37$ MeV, larger than the fitted $a_a \approx 23$ MeV, because the interaction reduces it`, R`$23$ MeV, the whole of the fitted value`, R`$E_F/3 \approx 12$ MeV, about half of the fitted value; the rest comes from the isospin dependence of the nucleon-nucleon interaction`, R`zero, because protons and neutrons have nearly equal masses`], answer: 2,
      sol: R`Expanding the Fermi-gas kinetic energy $\tfrac35E_F\,[N^{5/3} + Z^{5/3}]/(A/2)^{2/3}$ about $N = Z$ gives $\tfrac13E_F\,(N - Z)^2/A$, so the kinetic part is $a_a^{\rm kin} \approx E_F/3 \approx 12$ MeV. The fitted $a_a$ is about twice this. The remainder is a potential-energy effect: the neutron-proton attraction is stronger on average than the like-nucleon one (more $T = 0$ pairs are possible when $N = Z$), so moving away from $N = Z$ also costs interaction energy.`,
      trap: R`Equating $a_a$ with the Fermi energy itself, or thinking the kinetic picture explains the whole term.` },
  ],
  gens: [
    { id: 'bse-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'mass excess',
      make(r) {
        const [nm, Z, A, D] = choose(r, [['^{4}\\text{He}', 2, 4, 2.4249], ['^{16}\\text{O}', 8, 16, -4.7370], ['^{20}\\text{Ne}', 10, 20, -7.0419], ['^{27}\\text{Al}', 13, 27, -17.1968],
          ['^{40}\\text{Ca}', 20, 40, -34.8463], ['^{56}\\text{Fe}', 26, 56, -60.6071], ['^{208}\\text{Pb}', 82, 208, -21.7485], ['^{238}\\text{U}', 92, 238, 47.3074]]);
        const per = choose(r, [true, false]), B = Z * DH + (A - Z) * DN - D, ans = per ? B / A : B, dp = per ? 3 : 2;
        return { q: R`The mass excess of $${nm}$ ($Z = ${Z}$, $A = ${A}$) is $${D}$ MeV. Using mass excesses $7.2890$ MeV for $^1$H and $8.0713$ MeV for the neutron, its ${per ? 'binding energy per nucleon' : 'total binding energy'} is ______ MeV (${dp} decimal places).`,
          answer: round(ans, dp), tol: per ? 0.002 : 0.02, Z, A, D, per,
          sol: R`Since $M = A\,\text{u} + \Delta/c^2$ for every atom, the $A$ atomic mass units cancel in $B = [Zm_H + Nm_n - M]c^2$, leaving $B = Z\Delta_H + N\Delta_n - \Delta = ${Z}\times7.2890 + ${A - Z}\times8.0713 - (${D}) = ${round(B, 2)}$ MeV${per ? R`, so $B/A = ${round(B, 2)}/${A} = ${round(ans, 3)}$ MeV` : ''}.`,
          trap: R`Dropping the minus sign of a negative mass excess, or subtracting $\Delta$ with the wrong sign.` };
      },
      verify: (p) => { const B = p.Z * DH + (p.A - p.Z) * DN - p.D; return p.per ? B / p.A : B; } },
    { id: 'bse-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'mass parabolas',
      make(r) {
        const A = choose(r, [75, 101, 125, 151, 181, 211]), n = int(r, 1, 3), k = curv(A), ans = k / 2 * (2 * n - 1);
        return { q: R`For odd $A = ${A}$ the atomic masses of the isobars lie on a parabola in $Z$ with curvature $\dfrac{d^2Mc^2}{dZ^2} = \dfrac{8a_a}{A} + \dfrac{2a_c}{A^{1/3}}$, $a_a = 23.2$ MeV, $a_c = 0.714$ MeV. If the minimum lies exactly at an integer $Z_0$, the $\beta^-$ decay $Q$ value of the isobar with $Z = Z_0 - ${n}$ is ______ MeV (two decimal places).`,
          answer: round(ans, 2), tol: 0.02, A, n,
          sol: R`$k = \dfrac{8\times23.2}{${A}} + \dfrac{2\times0.714}{${A}^{1/3}} = ${round(k, 4)}$ MeV. With $Mc^2 = \text{const} + \tfrac12k(Z - Z_0)^2$, the decay $Z \to Z + 1$ has $Q = \tfrac12k[(Z - Z_0)^2 - (Z + 1 - Z_0)^2] = \tfrac12k(2n - 1)$ for $Z = Z_0 - n$: $Q = ${round(k / 2, 4)}\times${2 * n - 1} = ${round(ans, 2)}$ MeV.`,
          trap: R`Taking the whole drop to the bottom of the parabola, $\tfrac12kn^2$, instead of one step.` };
      },
      verify: (p) => curv(p.A) / 2 * (2 * p.n - 1) },
    { id: 'bse-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'cluster break-up',
      make(r) {
        const [s, n, M] = choose(r, [['^{12}\\text{C}', 3, 12], ['^{16}\\text{O}', 4, 15.99491462], ['^{20}\\text{Ne}', 5, 19.99244018], ['^{24}\\text{Mg}', 6, 23.98504170],
          ['^{28}\\text{Si}', 7, 27.97692653], ['^{32}\\text{S}', 8, 31.97207117], ['^{40}\\text{Ca}', 10, 39.96259085]]);
        const ans = (n * MHE - M) * U;
        return { q: R`Atomic masses: $^4$He $4.00260325$ u, $${s}$ $${M}$ u; $1$ u $= 931.494$ MeV$/c^2$. The minimum energy needed to break $${s}$ completely into ${n} alpha particles is ______ MeV (two decimal places).`,
          answer: round(ans, 2), tol: 0.02, n, M,
          sol: R`$E = [${n}M(^4\text{He}) - M]c^2 = (${round(n * MHE, 8)} - ${M})\times931.494 = ${round(ans, 2)}$ MeV. The electron numbers match on both sides, so atomic masses can be used directly.`,
          trap: R`Using the total binding energy of the nucleus; each alpha particle keeps its own 28.3 MeV of binding.` };
      },
      verify: (p) => (p.n * MHE - p.M) * U },
  ],
};
