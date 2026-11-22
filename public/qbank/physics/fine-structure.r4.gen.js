// Round 4 extras for fine-structure: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round, fmt } from '../_util.js';
const R = String.raw;

const LT = 'SPDFGH';
const half = (j) => `${2 * j}/2`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (p, q) => { const g = gcd(p, q); p /= g; q /= g; return q === 1 ? `${p}` : R`\dfrac{${p}}{${q}}`; };
const KB = 1.380649e-23, U = 1.66053906660e-27, CL = 2.99792458e8;
/** Doppler FWHM (Hz) of a line of wavelength lam (nm) from atoms of mass m (u) at temperature T (K). */
const dopp = (lam, m, T) => (CL / (lam * 1e-9)) * Math.sqrt(8 * KB * T * Math.LN2 / (m * U * CL * CL));

export default {
  items: [
    { id: 'hfs-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'spin-orbit coupling',
      q: R`In the simplest picture, spin-orbit coupling in a one-electron atom arises because`,
      options: [R`the electron's spin interacts with the magnetic field of the nucleus's own spin`,
        R`in the electron's rest frame the charged nucleus moves around it, and the resulting magnetic field acts on the electron's spin magnetic moment`,
        R`the electron's orbital motion produces an electric field that acts back on its own charge`,
        R`the electron's mass grows with its speed`], answer: 1,
      sol: R`Seen from the electron, the nucleus (charge $+Ze$) circles it and is a current loop, so the electron sits in a magnetic field $\vec B\propto\vec E\times\vec v\propto\vec L$. Its spin moment $\vec\mu_s\propto-\vec S$ has energy $-\vec\mu_s\cdot\vec B\propto\vec L\cdot\vec S$. (Going back to the atom's frame brings in the Thomas factor $\tfrac12$.) The nucleus's own spin gives hyperfine structure, and the mass-speed effect is the separate relativistic kinetic correction.`,
      trap: R`The coupling to the nuclear spin is hyperfine structure, a thousand times smaller.` },
    { id: 'hfs-r4-02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'centre of gravity rule', unit: 'cm⁻¹',
      q: R`The $2p$ level of lithium is split by spin-orbit coupling into $2p_{3/2}$ (upper) and $2p_{1/2}$, $0.335$ cm$^{-1}$ apart. Assuming the shifts come only from $A\,\vec L\cdot\vec S$, the $2p_{1/2}$ level lies below the energy the $2p$ level would have without spin-orbit coupling by ______ cm$^{-1}$ (three decimal places).`,
      answer: 0.223, tol: 0.002, calc: () => 0.335 * 2 / 3,
      sol: R`$\langle\vec L\cdot\vec S\rangle = \tfrac12[j(j+1) - l(l+1) - \tfrac34]\hbar^2$. With $l = 1$: $j = \tfrac32$ gives $+\tfrac12$, $j = \tfrac12$ gives $-1$ (units of $A\hbar^2$). Splitting $= \tfrac32A = 0.335$ cm$^{-1}$, so $A = 0.2233$ cm$^{-1}$ and $2p_{1/2}$ sits $A = 0.223$ cm$^{-1}$ below the unsplit level ($2p_{3/2}$ sits $0.112$ above). Check: weighting by $2j + 1$, $4(+0.112) + 2(-0.223) = 0$; the centre of gravity does not move.`,
      trap: R`Splitting the doublet symmetrically (half above, half below) ignores the $2j + 1$ weights.` },
    { id: 'hfs-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'X-ray doublets',
      q: R`The characteristic $K\alpha$ X-ray line of a heavy element is a close doublet ($K\alpha_1$, $K\alpha_2$). The doublet arises because`,
      options: [R`the $1s$ (K-shell) vacancy is split by spin-orbit coupling`, R`the nucleus has a magnetic moment`,
        R`the $2p$ (L-shell) vacancy is split by spin-orbit coupling into $2p_{3/2}$ and $2p_{1/2}$`, R`the atom recoils in two different directions`], answer: 2,
      sol: R`$K\alpha$ is the jump of a $2p$ electron into a $1s$ hole. A $1s$ hole has $l = 0$, so only $j = \tfrac12$: no splitting. The $2p$ level has $j = \tfrac32$ and $\tfrac12$, separated by spin-orbit coupling that grows roughly as $Z_\text{eff}^4$, so in heavy atoms the two lines are tens of eV apart. Both $2p_{3/2}\to1s$ and $2p_{1/2}\to1s$ obey $\Delta l = 1$, $\Delta j = 0, \pm1$.`,
      trap: R`An $s$ level (or $s$ hole) can never be split by spin-orbit coupling.` },
    { id: 'hfs-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'X-ray doublets', unit: 'eV',
      q: R`Model a $2p$ vacancy in copper ($Z = 29$) as a hydrogen-like $2p$ level with effective charge $Z_\text{eff} = Z - 3.5$. Fine-structure splittings scale as $Z_\text{eff}^4$, and hydrogen's $2p_{3/2}$-$2p_{1/2}$ splitting is $45.3\ \mu$eV. The estimated energy gap between the $K\alpha_1$ and $K\alpha_2$ lines is ______ eV (one decimal place).`,
      answer: 19.2, tol: 0.2, calc: () => 45.3e-6 * 25.5 ** 4,
      sol: R`$Z_\text{eff} = 25.5$, $Z_\text{eff}^4 = 25.5^4 = 4.228\times10^5$. Gap $= 45.3\times10^{-6}\ \text{eV}\times4.228\times10^5 = 19.2$ eV. The two lines differ only in the upper level ($2p_{3/2}$ or $2p_{1/2}$), so their gap is exactly the $2p$ splitting. The measured copper value is close to 20 eV, so this crude screening works well.`,
      trap: R`Scaling with $Z^2$ (as for the gross energies) gives only about 30 meV.` },
    { id: 'hfs-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit coupling', format: 'not',
      q: R`For a hydrogen-like ion the spin-orbit term is $H_{so} = \xi(r)\,\vec L\cdot\vec S$ with $\xi(r) = \dfrac{1}{2m^2c^2}\dfrac{1}{r}\dfrac{dV}{dr}$, where $V(r) = -\dfrac{Ze^2}{4\pi\varepsilon_0r}$. Which statement is NOT correct?`,
      options: [R`$\xi(r)$ is positive everywhere`, R`$H_{so}$ commutes with $J^2$ and $J_z$`,
        R`For hydrogen, $\langle\xi\rangle$ is proportional to $\langle r^{-3}\rangle$`, R`On its own, $H_{so}$ pushes the $j = l + \tfrac12$ level below the $j = l - \tfrac12$ level`], answer: 3,
      sol: R`$dV/dr = +Ze^2/(4\pi\varepsilon_0r^2) > 0$, so $\xi = Ze^2/(8\pi\varepsilon_0m^2c^2r^3) > 0$ and $\langle\xi\rangle\propto\langle r^{-3}\rangle$. $\vec L\cdot\vec S = \tfrac12(J^2 - L^2 - S^2)$ commutes with $J^2$ and $J_z$. For $j = l + \tfrac12$, $\vec L\cdot\vec S = +\tfrac{l}{2}\hbar^2 > 0$, so with $\xi > 0$ that level goes UP, not down. (In hydrogen the full fine structure still pushes every level down, because of the relativistic kinetic term.)`,
      trap: R`Mixing up "spin-orbit alone" with "all of fine structure": the second lowers every level, the first raises $j = l + \tfrac12$.` },
    { id: 'hfs-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'alkali doublets', format: 'statements',
      q: R`Which statements about the alkali atoms are correct?`,
      options: [R`In sodium, $3s$ lies well below $3p$ mainly because the $s$ electron penetrates the closed-shell core more`,
        R`Along one series ($np$, $n = 3, 4, 5, \dots$) the doublet splitting shrinks roughly as $1/n^{*3}$, with $n^*$ the effective quantum number`,
        R`The sodium ground state $3s$ is a spin-orbit doublet`,
        R`From lithium to caesium, the splitting of the first excited $p$ doublet grows by more than a factor of 1000`], answer: [0, 1, 3],
      sol: R`Penetration lowers $s$ orbitals most (quantum defect $\approx1.37$ for Na $3s$, $0.88$ for $3p$). The splitting follows $\langle r^{-3}\rangle\propto1/n^{*3}$ in a series. An $s$ level has $l = 0$, only $j = \tfrac12$: one level. Li $2p$: $0.34$ cm$^{-1}$; Cs $6p$: $554$ cm$^{-1}$, a factor of about 1600.`,
      trap: R`Every alkali spectral line can be a doublet without the ground state being one: the doublet lives in the $p$ level.` },
    { id: 'hfs-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts', unit: 'meV',
      q: R`Using $E^{(1)}_{nj} = -\dfrac{R_\infty hc\,\alpha^2Z^4}{n^4}\left(\dfrac{n}{j + 1/2} - \dfrac34\right)$ with $R_\infty hc\,\alpha^2 = 0.7245$ meV, the fine-structure shift of the ground state of He$^+$ is ______ meV (two decimal places, with sign).`,
      answer: -2.9, tol: 0.02, calc: () => -0.7245 * 16 * 0.25,
      sol: R`$n = 1$, $j = \tfrac12$: bracket $= 1 - \tfrac34 = \tfrac14$. $Z^4 = 16$. $E^{(1)} = -0.7245\times16\times\tfrac14 = -2.90$ meV. For hydrogen it would be $-0.181$ meV.`,
      trap: R`Using $Z^2 = 4$ gives $-0.72$ meV; relativistic corrections go as $Z^4$.` },
    { id: 'hfs-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      q: R`For the $n = 3$ level of hydrogen, the magnitudes of the fine-structure shifts (from the Bohr energy) of the $j = \tfrac12$, $\tfrac32$ and $\tfrac52$ levels are in the ratio`,
      options: [R`$9:3:1$`, R`$3:2:1$`, R`$1:3:9$`, R`$5:3:1$`], answer: 0,
      sol: R`The shift is proportional to $\dfrac{n}{j + 1/2} - \dfrac34$. For $n = 3$: $j = \tfrac12$: $3 - 0.75 = 2.25$; $j = \tfrac32$: $1.5 - 0.75 = 0.75$; $j = \tfrac52$: $1 - 0.75 = 0.25$. Ratio $2.25 : 0.75 : 0.25 = 9 : 3 : 1$. The low-$j$ levels are pushed down most.`,
      trap: R`Using $1/(j + \tfrac12)$ alone gives $3:1.5:1$ and forgets the constant $-\tfrac34$.` },
    { id: 'hfs-r4-09', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Lamb shift',
      q: R`In hydrogen, $2s_{1/2}$ lies $1058$ MHz above $2p_{1/2}$ (the Lamb shift), and $2p_{3/2}$ lies $10\,969$ MHz above $2p_{1/2}$. The frequency of the $2s_{1/2}\to2p_{3/2}$ interval is`,
      options: [R`$12\,027$ MHz`, R`$10\,969$ MHz`, R`$9911$ MHz`, R`$1058$ MHz`], answer: 2,
      sol: R`Measure everything from $2p_{1/2}$: $2s_{1/2}$ at $+1058$ MHz, $2p_{3/2}$ at $+10\,969$ MHz. Their difference is $10\,969 - 1058 = 9911$ MHz, with $2p_{3/2}$ on top. Lamb and Retherford drove this kind of radio-frequency transition in their 1947 experiment.`,
      trap: R`Adding the two numbers assumes $2s_{1/2}$ is below $2p_{1/2}$; the Lamb shift pushes it up.` },
    { id: 'hfs-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Lamb shift',
      q: R`The $2s_{1/2}$-$2p_{1/2}$ Lamb shift of hydrogen is $1.058$ GHz. For $s$ states it scales roughly as $Z^4/n^3$ (times a slowly varying logarithm). For the He$^+$ ion ($Z = 2$) the same interval is expected to be closest to`,
      options: [R`$2.1$ GHz`, R`$17$ GHz (the measured value, 14 GHz, is a little lower because of the logarithm)`, R`$4.2$ GHz`, R`$270$ GHz`], answer: 1,
      sol: R`$Z^4 = 16$, so $16\times1.058\approx17$ GHz. The leading Lamb shift is $\propto\dfrac{\alpha(Z\alpha)^4mc^2}{n^3}\ln\dfrac{1}{(Z\alpha)^2}$; the logarithm falls from about 9.8 to 8.5 when $Z$ goes from 1 to 2, which (with smaller terms) brings the measured He$^+$ value down to about 14.0 GHz. $Z^2$ scaling (4.2 GHz) would treat it like a gross-structure energy.`,
      trap: R`QED shifts of $s$ states grow like the fine structure ($Z^4$), not like the Bohr energies ($Z^2$).` },
    { id: 'hfs-r4-11', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'perturbation theory', format: 'statements',
      q: R`For the $n = 2$ level of hydrogen, split into the relativistic kinetic term, spin-orbit coupling and the Darwin term, which statements are correct?`,
      options: [R`The $2p_{3/2}$-$2p_{1/2}$ splitting comes entirely from spin-orbit coupling`,
        R`$2s_{1/2}$ and $2p_{1/2}$ end up degenerate only when all three terms are added`,
        R`The relativistic kinetic correction is the same for $2s$ and $2p$`,
        R`The spin-orbit shift of $2p_{1/2}$ is twice as large as that of $2p_{3/2}$ and of opposite sign`], answer: [0, 1, 3],
      sol: R`In units of $R_\infty hc\,\alpha^2$: relativistic term $-\tfrac{1}{4n^4}\left(\tfrac{4n}{l + 1/2} - 3\right)$ gives $-\tfrac{13}{64}$ for $2s$ and $-\tfrac{7}{192}$ for both $2p$ levels (it depends on $l$, not $j$, so it cannot split the $2p$ doublet). Spin-orbit: $-\tfrac{1}{24}$ for $2p_{1/2}$, $+\tfrac{1}{48}$ for $2p_{3/2}$. Darwin: $+\tfrac18$ for $2s$ only. Totals: $2s_{1/2}$: $-\tfrac{13}{64} + \tfrac{8}{64} = -\tfrac{5}{64}$; $2p_{1/2}$: $-\tfrac{7}{192} - \tfrac{8}{192} = -\tfrac{5}{64}$; $2p_{3/2}$: $-\tfrac{1}{64}$.`,
      trap: R`The relativistic term depends on $l$: it differs between $2s$ and $2p$.` },
    { id: 'hfs-r4-12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'line widths', unit: 'cm⁻¹',
      q: R`Hydrogen atoms at $1000$ K emit the Balmer $H_\alpha$ line at $656.28$ nm. The Doppler full width at half maximum, $\Delta\nu = \nu_0\sqrt{8k_BT\ln2/(mc^2)}$, expressed in wavenumbers is ______ cm$^{-1}$ (three decimal places). Take $m = 1.6735\times10^{-27}$ kg.`,
      answer: 0.344, tol: 0.003, calc: () => (1e7 / 656.28) * Math.sqrt(8 * KB * 1000 * Math.LN2 / (1.6735e-27 * CL * CL)),
      sol: R`$\tilde\nu_0 = 10^7/656.28 = 15\,237$ cm$^{-1}$. $8k_BT\ln2 = 8\times1.381\times10^{-23}\times1000\times0.693 = 7.66\times10^{-20}$ J; $mc^2 = 1.504\times10^{-10}$ J; ratio $5.09\times10^{-10}$, square root $2.26\times10^{-5}$. Width $= 15\,237\times2.26\times10^{-5} = 0.344$ cm$^{-1}$. This is as large as the $n = 2$ fine structure ($0.365$ cm$^{-1}$), which is why optical spectra of hot hydrogen blur the fine structure and Lamb had to use radio waves.`,
      trap: R`Using the molecular mass of $\text{H}_2$ or forgetting the $\ln2$ changes the width by 30-40%.` },
  ],
  gens: [
    { id: 'hfs-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'centre of gravity rule',
      make(r) {
        const l = int(r, 1, 3), D = pick(r, 5, 600, 1), upper = r() < 0.5;
        const f = upper ? l / (2 * l + 1) : (l + 1) / (2 * l + 1);
        const ans = D * f;
        return { q: R`An alkali-like level with $l = ${l}$ is split by $A\,\vec L\cdot\vec S$ into $j = ${half(l + 0.5)}$ and $j = ${half(l - 0.5)}$, ${D} cm$^{-1}$ apart (the larger $j$ on top). The $j = ${half(upper ? l + 0.5 : l - 0.5)}$ level lies ${upper ? 'above' : 'below'} the position the level would have without spin-orbit coupling by ______ cm$^{-1}$ (two decimal places).`,
          answer: round(ans, 2), tol: Math.max(0.02, round(ans * 0.01, 2)), unit: 'cm⁻¹', l, D, upper,
          sol: R`$\langle\vec L\cdot\vec S\rangle/\hbar^2$ is $+\tfrac{l}{2} = ${l / 2}$ for $j = l + \tfrac12$ and $-\tfrac{l+1}{2} = ${-(l + 1) / 2}$ for $j = l - \tfrac12$. The splitting is $A(l + \tfrac12) = ${D}$ cm$^{-1}$, so $A = ${round(D / (l + 0.5), 3)}$ cm$^{-1}$. The ${upper ? 'upper' : 'lower'} level moves by $${upper ? R`\tfrac{l}{2l+1}` : R`\tfrac{l+1}{2l+1}`}\times${D} = ${round(ans, 2)}$ cm$^{-1}$. Weighted by $2j + 1$, the two shifts cancel.`,
          trap: 'The doublet is not split symmetrically about the old level: the level with more states moves less.' };
      },
      verify: (p) => p.D * (p.upper ? p.l : p.l + 1) / (2 * p.l + 1) },
    { id: 'hfs-r4g2', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      make(r) {
        const n = int(r, 2, 5), a = int(r, 1, n - 1), b = int(r, a + 1, n); // a = j1 + 1/2, b = j2 + 1/2
        const p = b * (4 * n - 3 * a), q = a * (4 * n - 3 * b);
        const show = (s) => `$${s}$`;
        const o = mcqOptions(r, frac(p, q), [frac(q, p), frac(b, a), frac(4 * n - 3 * a, 4 * n - 3 * b), frac(b * b, a * a), frac(p + q, q)], show);
        return { q: R`In hydrogen, the ratio of the fine-structure shift of the level $n = ${n}$, $j = ${a * 2 - 1}/2$ to that of the level $n = ${n}$, $j = ${b * 2 - 1}/2$ (both measured from the Bohr energy) is`, ...o,
          sol: R`$E^{(1)}_{nj}\propto-\left(\dfrac{n}{j + 1/2} - \dfrac34\right) = -\dfrac{4n - 3(j + \frac12)}{4(j + \frac12)}$. For $j + \tfrac12 = ${a}$: $\dfrac{${4 * n - 3 * a}}{${4 * a}}$; for $j + \tfrac12 = ${b}$: $\dfrac{${4 * n - 3 * b}}{${4 * b}}$. Ratio $= \dfrac{${b}\times${4 * n - 3 * a}}{${a}\times${4 * n - 3 * b}} = ${frac(p, q)}$.`,
          trap: R`Comparing only $1/(j + \tfrac12)$ leaves out the constant $\tfrac34$.` };
      } },
    { id: 'hfs-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'line widths',
      make(r) {
        const [line, lam] = choose(r, [[R`Lyman $\alpha$`, 121.57], [R`Balmer $H_\alpha$`, 656.28], [R`Balmer $H_\beta$`, 486.13]]);
        const [atom, m] = choose(r, [['hydrogen', 1.00783], ['deuterium', 2.01410]]);
        const T = choose(r, [300, 500, 1000, 2000, 5000, 10000]);
        const w = dopp(lam, m, T) / 1e9;
        return { q: R`The ${line} line of ${atom} ($\lambda = ${lam}$ nm, atomic mass $${m}$ u) is emitted by atoms at $${T}$ K. Its Doppler FWHM $\Delta\nu = \nu_0\sqrt{8k_BT\ln2/(mc^2)}$ is ______ GHz (three significant figures).`,
          answer: +w.toPrecision(3), tol: +(w * 0.01).toPrecision(2), unit: 'GHz', lam, m, T,
          sol: R`$\nu_0 = c/\lambda = ${+(CL / (lam * 1e-9) / 1e12).toPrecision(4)}\times10^{12}$ Hz. $\sqrt{8k_BT\ln2/(mc^2)} = ${fmt(w * 1e9 / (CL / (lam * 1e-9)))}$ with $m = ${m}\times1.6605\times10^{-27}$ kg. $\Delta\nu = ${+w.toPrecision(3)}$ GHz. Compare the $2p$ fine-structure splitting, $10.97$ GHz.`,
          trap: 'Doppler width grows as the square root of T/m and in proportion to the line frequency.' };
      },
      verify: (p) => dopp(p.lam, p.m, p.T) / 1e9 },
  ],
};
