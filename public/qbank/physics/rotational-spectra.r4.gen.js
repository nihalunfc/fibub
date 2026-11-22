// Round 4 extras for rotational-spectra: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
const R = String.raw;

const K = 16.858; // I (u Å^2) = K / B (cm^-1)
/** Diatomics: name, reduced mass (u), bond length (pm). */
const DIA = [['HF', 0.9571, 91.7], ['H$^{35}$Cl', 0.9796, 127.5], ['HBr', 0.9953, 141.4], ['HI', 0.9997, 160.9], ['LiH', 0.8812, 159.5],
  ['OH', 0.9481, 97.0], ['CO', 6.8562, 112.8], ['NO', 7.4664, 115.1], ['NaCl', 13.871, 236.1], ['KCl', 18.43, 266.7]];
const Bof = (mu, rpm) => K / (mu * (rpm / 100) ** 2);
/** Symmetric linear X=Y=X molecules: name, outer atom, outer mass (u), bond length (pm). */
const TRI = [['CO$_2$', 'O', 15.9949, 116.2], ['CS$_2$', 'S', 31.9721, 155.3], ['XeF$_2$', 'F', 18.9984, 197.7], ['$^{12}$C$^{18}$O$_2$', '$^{18}$O', 17.9992, 116.2]];

export default {
  items: [
    { id: 'rots-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'units',
      q: R`A diatomic molecule has rotational constant $B = 0.500$ cm$^{-1}$. Expressed as a frequency, $B$ is`,
      options: [R`$0.500$ GHz`, R`$14.99$ GHz`, R`$29.98$ GHz`, R`$0.0167$ GHz`], answer: 1,
      sol: R`Frequency $= c\times$ wavenumber $= (2.998\times10^{10}\ \text{cm/s})(0.500\ \text{cm}^{-1}) = 1.499\times10^{10}$ Hz $= 14.99$ GHz. (1 cm$^{-1}$ corresponds to 29.98 GHz.) The first rotational line, at $2B$, would then be at $29.98$ GHz.`,
      trap: R`$29.98$ GHz is the $J = 0\to1$ line ($2B$), not $B$ itself.` },
    { id: 'rots-r4-02', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'isotope effect',
      q: R`$^{12}$C$^{16}$O ($\mu = 6.8562$ u) is replaced by $^{12}$C$^{18}$O, with the same bond length. The ratio $B(^{12}\text{C}^{18}\text{O})/B(^{12}\text{C}^{16}\text{O})$ is closest to (mass of $^{18}$O $= 17.9992$ u)`,
      options: [R`$0.889$`, R`$1.050$`, R`$0.952$`, R`$0.976$`], answer: 2,
      sol: R`$\mu(^{12}\text{C}^{18}\text{O}) = \dfrac{12\times17.9992}{29.9992} = 7.1998$ u. At fixed $r$, $B\propto1/\mu$: ratio $= 6.8562/7.1998 = 0.952$. Every rotational line of the heavier isotopologue moves down by about 5%.`,
      trap: R`$16/18 = 0.889$ uses the oxygen masses instead of the reduced masses; $0.976$ is the square root, which is the vibrational ratio.` },
    { id: 'rots-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rigid rotor',
      q: R`For a rigid rotor, the energy of the level $J = 2$ divided by the energy of the level $J = 1$ (both measured from $J = 0$) is`,
      options: [R`$2$`, R`$4$`, R`$\tfrac32$`, R`$3$`], answer: 3,
      sol: R`$F(J) = BJ(J+1)$: $F(1) = 2B$, $F(2) = 6B$, ratio $3$. The levels spread out as $J^2$, which is why the line spacing ($2B$) stays constant while the levels do not.`,
      trap: R`$E\propto J^2$ gives 4; the correct factor is $J(J+1)$.` },
    { id: 'rots-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'bond length', unit: 'pm',
      q: R`For $^1$H$^{19}$F, $B = 20.56$ cm$^{-1}$. With atomic masses $1.00783$ u and $18.9984$ u, and $I\,(\text{u Å}^2) = 16.858/B\,(\text{cm}^{-1})$, the bond length is ______ pm (one decimal place).`,
      answer: 92.6, tol: 0.3, calc: () => Math.sqrt(K / 20.56 / (1.00783 * 18.9984 / 20.00623)) * 100,
      sol: R`$\mu = \dfrac{1.00783\times18.9984}{20.0062} = 0.95706$ u. $I = 16.858/20.56 = 0.81994$ u Å$^2$. $r = \sqrt{I/\mu} = \sqrt{0.85673} = 0.9256$ Å $= 92.6$ pm.`,
      trap: R`Using the hydrogen mass alone (1.008 u) for $\mu$ gives 90.2 pm; the reduced mass is a little smaller.` },
    { id: 'rots-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'populations',
      q: R`For a diatomic gas, the most populated rotational level is $J_\text{max}\approx\sqrt{kT/2hcB} - \tfrac12$. If the temperature is raised from 100 K to 400 K (with $kT\gg hcB$), $J_\text{max}$`,
      options: [R`is unchanged`, R`roughly quadruples`, R`halves`, R`roughly doubles`], answer: 3,
      sol: R`Maximising $(2J + 1)e^{-hcBJ(J+1)/kT}$ gives $J_\text{max}\approx\sqrt{kT/2hcB} - \tfrac12$. When $kT\gg hcB$ the square root dominates, and a fourfold temperature makes it twice as large. The intensity maximum of the absorption spectrum moves out in the same way.`,
      trap: R`Populations are not linear in $T$: the peak $J$ grows as $\sqrt T$.` },
    { id: 'rots-r4-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'linear polyatomics', unit: 'pm',
      q: R`CO$_2$ is linear and symmetric (O=C=O). Its rotational constant, found from its Raman and infrared spectra, is $B = 0.3902$ cm$^{-1}$. With $m(^{16}\text{O}) = 15.9949$ u and $I\,(\text{u Å}^2) = 16.858/B$, the C=O bond length is ______ pm (one decimal place).`,
      answer: 116.2, tol: 0.3, calc: () => Math.sqrt(K / (0.3902 * 2 * 15.9949)) * 100,
      sol: R`The carbon atom sits on the centre of mass, so it adds nothing: $I = 2m_\text{O}r^2$. $I = 16.858/0.3902 = 43.203$ u Å$^2$. $r^2 = 43.203/(2\times15.9949) = 1.3505$ Å$^2$, $r = 1.1621$ Å $= 116.2$ pm.`,
      trap: R`Using a diatomic reduced mass, or putting the carbon mass in $I$, gives a wrong length; the central atom is on the axis of rotation.` },
    { id: 'rots-r4-07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'rotational constant', format: 'statements',
      q: R`For rigid diatomic molecules, which statements are correct?`,
      options: [R`Doubling the reduced mass at fixed bond length halves $B$`,
        R`A molecule with larger total mass always has the smaller $B$`,
        R`Doubling the bond length at fixed reduced mass divides $B$ by 4`,
        R`$B$ of a rigid molecule does not depend on temperature`], answer: [0, 2, 3],
      sol: R`$B = h/(8\pi^2cI)$ with $I = \mu r^2$. So $B\propto1/\mu$ and $B\propto1/r^2$. Temperature changes the populations, not the levels. Total mass is not what counts: HI (128 u) has $B\approx6.4$ cm$^{-1}$, far larger than CO (28 u, $B\approx1.9$ cm$^{-1}$), because the reduced mass of HI is only about 1 u.`,
      trap: R`For a hydride the light H atom does all the rotating; the reduced mass is close to 1 u however heavy the partner.` },
    { id: 'rots-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'centrifugal distortion', unit: 'cm⁻¹',
      q: R`For $^{12}$C$^{16}$O, $B = 1.9313$ cm$^{-1}$ and the centrifugal distortion constant is $D = 6.12\times10^{-6}$ cm$^{-1}$. Using $D = 4B^3/\tilde\omega^2$, the vibrational wavenumber is ______ cm$^{-1}$ (nearest whole number).`,
      answer: 2170, tol: 3, calc: () => Math.sqrt(4 * 1.9313 ** 3 / 6.12e-6),
      sol: R`$\tilde\omega = \sqrt{4B^3/D}$. $B^3 = 7.2036$ cm$^{-3}$, $4B^3 = 28.814$, divided by $6.12\times10^{-6}$ gives $4.708\times10^6$; square root $2170$ cm$^{-1}$. This matches the CO stretch seen in the infrared: a stiffer bond stretches less as the molecule spins.`,
      trap: R`$\tilde\omega = 4B^3/D$ without the square root gives an absurd $5\times10^6$ cm$^{-1}$.` },
    { id: 'rots-r4-09', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'microwave activity',
      q: R`Radio astronomers map cold molecular hydrogen in galaxies mainly by observing the $J = 1\to0$ line of CO at 115 GHz. Why not the rotational lines of H$_2$ itself?`,
      options: [R`H$_2$ does not rotate at low temperature`, R`H$_2$ has no permanent electric dipole moment, so its pure rotational dipole transitions are forbidden`,
        R`H$_2$ rotational lines fall in the radio band and are absorbed by the atmosphere`, R`H$_2$ is too rare in molecular clouds`], answer: 1,
      sol: R`A pure rotational dipole transition needs a permanent dipole moment, and the symmetric H$_2$ has none. Its only rotational lines are very weak electric-quadrupole lines ($\Delta J = 2$), and its light mass puts even the lowest of them (at about 510 K above ground) far from what cold gas emits. CO is polar, abundant and easy to excite at 5.5 K, so it is used as a tracer.`,
      trap: R`H$_2$ is by far the most abundant molecule; the problem is its symmetry, not its abundance.` },
    { id: 'rots-r4-10', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'line positions', unit: 'GHz',
      q: R`The $J = 1\to0$ line of $^{12}$C$^{16}$O is at $115.271$ GHz. In the rigid-rotor model, the $J = 3\to2$ line is at ______ GHz (two decimal places).`,
      answer: 345.81, tol: 0.03, calc: () => 3 * 115.271,
      sol: R`Lines are at $2B(J+1)$ for $J\to J+1$, i.e. $2B$, $4B$, $6B$, ... The $J = 1\to0$ line is $2B = 115.271$ GHz, so $J = 3\to2$ is $6B = 3\times115.271 = 345.81$ GHz. (The real line is at 345.796 GHz; centrifugal distortion pulls it down by about 15 MHz.)`,
      trap: R`Using $J(J+1)$ ratios ($12/2 = 6$) gives the level energy, not the line.` },
    { id: 'rots-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      q: R`HCl has $B = 10.59$ cm$^{-1}$ and $D = 5.3\times10^{-4}$ cm$^{-1}$. Taken literally, $\tilde\nu = 2B(J+1) - 4D(J+1)^3$ predicts that the spacing between adjacent lines falls to zero near`,
      options: [R`$J + 1\approx58$`, R`$J + 1\approx100$`, R`$J + 1\approx33$`, R`$J + 1\approx3300$`], answer: 0,
      sol: R`The spacing is $d\tilde\nu/dJ = 2B - 12D(J+1)^2$, zero when $(J+1)^2 = B/(6D) = 10.59/(3.18\times10^{-3}) = 3330$, so $J + 1\approx57.7$. Long before this the two-term series is useless (higher terms $H(J+1)^5$... matter, and the molecule is spinning near dissociation). The point of the exercise: centrifugal corrections grow as $(J+1)^3$ and dominate at high $J$.`,
      trap: R`$J + 1\approx100$ comes from $J(J+1) = B/2D$, where the level energy, not the line spacing, would peak.` },
    { id: 'rots-r4-12', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'symmetric tops', format: 'statements',
      q: R`For a prolate symmetric top such as CH$_3$F, the pure rotational lines including centrifugal distortion are $\tilde\nu = 2B(J+1) - 4D_J(J+1)^3 - 2D_{JK}(J+1)K^2$. Which statements are correct?`,
      options: [R`The $J = 3\to4$ line splits into four components`, R`The selection rule $\Delta K = 0$ holds because the dipole lies along the symmetry axis`,
        R`The constant $A$ can be read off from the pure rotational spectrum`, R`Without distortion, all $K$ components of a line coincide at $2B(J+1)$`], answer: [0, 1, 3],
      sol: R`The dipole along the figure axis cannot exert a torque about that axis, so $K$ does not change: $\Delta J = +1$, $\Delta K = 0$. Since only $K^2$ enters, $\pm K$ coincide, and for lower level $J = 3$, $K = 0, 1, 2, 3$: four components, separated only through $D_{JK}$. Because $K$ never changes, the term $(A - B)K^2$ cancels in every line, so $A$ cannot be found from this spectrum (it needs, e.g., perpendicular infrared bands).`,
      trap: R`$K$ runs up to the lower level's $J$, not the upper's; $K = 4$ does not exist in $J = 3$.` },
  ],
  gens: [
    { id: 'rots-r4g1', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'comparing molecules',
      make(r) {
        const four = shuffle(r, DIA).slice(0, 4);
        const big = r() < 0.5;
        const Bs = four.map(([, mu, rp]) => Bof(mu, rp));
        const best = Bs.indexOf(big ? Math.max(...Bs) : Math.min(...Bs));
        const o = mcqOptions(r, four[best][0], four.filter((_, i) => i !== best).map((m) => m[0]));
        return { q: R`Using the data (reduced mass $\mu$, bond length $r$): ${four.map(([n, mu, rp]) => `${n}: $\\mu = ${mu}$ u, $r = ${rp}$ pm`).join('; ')}. Which molecule has the ${big ? 'widest' : 'narrowest'} spacing between its pure rotational lines?`, ...o,
          sol: R`Line spacing $= 2B$ with $B = 16.858/(\mu r^2)$ cm$^{-1}$ ($\mu$ in u, $r$ in Å). ${four.map(([n, mu, rp], i) => `${n}: $I = ${round(mu * (rp / 100) ** 2, 3)}$ u Å$^2$, $B = ${round(Bs[i], 3)}$ cm$^{-1}$`).join('; ')}. The ${big ? 'largest' : 'smallest'} $B$ belongs to ${four[best][0]}.`,
          trap: 'Compare mu r^2, not the total mass: hydrides have mu close to 1 u.' };
      } },
    { id: 'rots-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linear polyatomics',
      make(r) {
        const [name, X, m, r0] = choose(r, TRI);
        const rp = round(r0 + pick(r, -2, 2, 0.1), 1);
        const B = K / (2 * m * (rp / 100) ** 2);
        const toB = r() < 0.5;
        const Bq = +B.toPrecision(4);
        const rAns = Math.sqrt(K / (2 * m * Bq)) * 100;
        return { q: toB
          ? R`The linear symmetric molecule ${name} has bond length $${rp}$ pm (each ${X} atom of mass $${m}$ u). Using $I\,(\text{u Å}^2) = 16.858/B\,(\text{cm}^{-1})$, its rotational constant is ______ cm$^{-1}$ (four significant figures).`
          : R`The linear symmetric molecule ${name} (each ${X} atom of mass $${m}$ u) has $B = ${Bq}$ cm$^{-1}$. Using $I\,(\text{u Å}^2) = 16.858/B\,(\text{cm}^{-1})$, its bond length is ______ pm (one decimal place).`,
          answer: toB ? Bq : round(rAns, 1), tol: toB ? +(Bq * 0.005).toPrecision(2) : 0.3, unit: toB ? 'cm⁻¹' : 'pm', m, rp, Bq, toB,
          sol: toB
            ? R`The central atom lies on the axis through the centre of mass, so $I = 2m_\text{outer}r^2 = 2\times${m}\times${round(rp / 100, 4)}^2 = ${round(2 * m * (rp / 100) ** 2, 3)}$ u Å$^2$. $B = 16.858/${round(2 * m * (rp / 100) ** 2, 3)} = ${Bq}$ cm$^{-1}$.`
            : R`$I = 16.858/${Bq} = ${round(K / Bq, 3)}$ u Å$^2$ $= 2m_\text{outer}r^2$, so $r^2 = ${round(K / Bq / (2 * m), 4)}$ Å$^2$ and $r = ${round(rAns, 1)}$ pm. The central atom's mass does not enter.`,
          trap: 'The central atom sits at the centre of mass and contributes nothing to I.' };
      },
      verify: (p) => (p.toB ? K / (2 * p.m * (p.rp / 100) ** 2) : Math.sqrt(K / (2 * p.m * p.Bq)) * 100) },
    { id: 'rots-r4g3', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'line positions',
      make(r) {
        const B = pick(r, 0.8, 12, 0.01);
        const ks = shuffle(r, [1, 2, 3, 4, 5, 6, 7, 8]);
        const nTrue = int(r, 1, 3);
        const vals = [];
        for (let i = 0; i < nTrue; i++) vals.push([round(2 * B * ks[i], 2), true]);
        const fakes = shuffle(r, [round(B * (2 * ks[3] + 1), 2), round(B * (2 * ks[4] + 1), 2), round(B * (2 * ks[5] + 0.5), 2), round(B * (2 * ks[6] - 1), 2)]);
        for (const f of fakes) if (vals.length < 4 && !vals.some((v) => v[0] === f)) vals.push([f, false]);
        vals.sort((a, b) => a[0] - b[0]);
        return { q: R`A rigid diatomic molecule has $B = ${B}$ cm$^{-1}$. Which of these wavenumbers (cm$^{-1}$) are lines of its pure rotational absorption spectrum?`,
          options: vals.map((v) => `$${v[0]}$`), answer: vals.map((v, i) => (v[1] ? i : -1)).filter((i) => i >= 0),
          sol: R`Lines sit at $2B(J+1) = ${round(2 * B, 2)}\,k$ cm$^{-1}$ for $k = 1, 2, 3, \dots$: every line is a whole multiple of $2B$. ${vals.map((v) => `$${v[0]}/${round(2 * B, 2)} = ${round(v[0] / (2 * B), 2)}$`).join(', ')}; only whole numbers are lines.`,
          trap: 'Odd multiples of B are never lines: the spacing and the first line are both 2B.' };
      } },
  ],
};
