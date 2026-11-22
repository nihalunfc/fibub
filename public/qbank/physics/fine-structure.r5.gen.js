// Round 5 extras for fine-structure: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const RA2 = 13.605693 * (1 / 137.035999) ** 2; // R_inf hc alpha^2 in eV
const half = (j2) => `${j2}/2`;

export default {
  items: [
    { id: 'hfs-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'fine-structure constant',
      q: R`In the Bohr model the ground-state electron of a hydrogen-like ion moves at $v = Z\alpha c$. The smallest nuclear charge $Z$ for which this speed reaches half the speed of light is`,
      options: [R`$69$`, R`$137$`, R`$35$`, R`$92$`], answer: 0,
      sol: R`$Z\alpha \ge \tfrac12$ means $Z \ge \tfrac12\times137.04 = 68.5$, so $Z = 69$ (thulium). Near this charge the inner electrons are strongly relativistic, which is why fine structure (of relative size $(Z\alpha)^2$) is no longer a small correction for heavy atoms.`,
      trap: R`$137$ is where $Z\alpha = 1$ (the full speed of light), not half of it.` },
    { id: 'hfs-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'fine-structure shifts',
      q: R`For the hydrogen ground state, the fine-structure shift is $-\tfrac14\alpha^2$ times the binding energy $13.6$ eV. Expressed as a fraction of the Bohr energy, the shift has magnitude $k\times10^{-5}$ with $k = $ ______ (two decimal places; $\alpha = 1/137.036$).`,
      answer: 1.33, tol: 0.01, calc: () => 0.25 / 137.036 ** 2 * 1e5,
      sol: R`The ratio is $\alpha^2/4 = (1/137.036)^2/4 = 5.325\times10^{-5}/4 = 1.33\times10^{-5}$. In energy this is $13.6\ \text{eV}\times1.33\times10^{-5} = 0.181$ meV, a shift you cannot see in one line on its own, only as a splitting between levels.`,
      trap: R`Forgetting the factor $\tfrac14$ gives $5.33$.` },
    { id: 'hfs-r5-03', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Z scaling', unit: 'cm⁻¹',
      q: R`The $2p_{3/2}$-$2p_{1/2}$ splitting of hydrogen is $0.365$ cm$^{-1}$. Ignoring reduced-mass and QED corrections, the same splitting in the ion Li$^{2+}$ ($Z = 3$) is ______ cm$^{-1}$ (one decimal place).`,
      answer: 29.6, tol: 0.2, calc: () => 0.365 * 81,
      sol: R`Fine-structure intervals of a one-electron ion go as $Z^4$ (one power $Z^2$ from the energy scale, another $Z^2$ from $\alpha\to Z\alpha$). $3^4 = 81$, so the splitting is $0.365\times81 = 29.6$ cm$^{-1}$.`,
      trap: R`Scaling as $Z^2$ (like the Bohr energies) gives only $3.3$ cm$^{-1}$.` },
    { id: 'hfs-r5-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Darwin term', format: 'not',
      q: R`Which statement about the Darwin term in the hydrogen atom is NOT correct?`,
      options: [R`It is proportional to $|\psi(0)|^2$, so only $s$ states are shifted`,
        R`It can be pictured as the electron's position jittering over about a Compton wavelength, smearing the Coulomb potential`,
        R`On its own it lifts the degeneracy of $2s_{1/2}$ and $2p_{1/2}$ that the Dirac equation predicts`,
        R`It raises the energy of the states it affects`], answer: 2,
      sol: R`$H_D = \dfrac{\pi\hbar^2}{2m^2c^2}\dfrac{Ze^2}{4\pi\varepsilon_0}\delta^3(\vec r)$, so its shift is positive and $\propto|\psi(0)|^2$, nonzero only for $l = 0$. The smearing picture (zitterbewegung over $\hbar/mc$) is the usual explanation. The Darwin term is one of the three pieces whose SUM makes $2s_{1/2}$ and $2p_{1/2}$ degenerate; the degeneracy is lifted only by the Lamb shift (QED), which lies outside the Dirac equation.`,
      trap: R`The Darwin term is part of the Dirac result; it cannot break a degeneracy that the Dirac equation itself predicts.` },
    { id: 'hfs-r5-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts', unit: 'GHz',
      q: R`Using $E^{(1)}_{nj} = -\dfrac{R_\infty hc\,\alpha^2}{n^4}\left(\dfrac{n}{j + 1/2} - \dfrac34\right)$ with $R_\infty hc\,\alpha^2 = 0.7245$ meV, the frequency of the $3p_{3/2}$-$3p_{1/2}$ interval in hydrogen is ______ GHz (two decimal places; $h = 4.1357\times10^{-15}$ eV s).`,
      answer: 3.24, tol: 0.03, calc: () => 0.7245e-3 * 1.5 / 81 / 4.1357e-15 / 1e9,
      sol: R`For $n = 3$: $j = \tfrac12$ gives a bracket $3 - 0.75 = 2.25$; $j = \tfrac32$ gives $1.5 - 0.75 = 0.75$. The difference is $1.5$, so $\Delta E = 0.7245\ \text{meV}\times1.5/81 = 1.342\times10^{-5}$ eV, and $\nu = \Delta E/h = 1.342\times10^{-5}/4.1357\times10^{-15} = 3.24\times10^9$ Hz. This is $(2/3)^3$ of the $n = 2$ interval ($10.97$ GHz), as the $1/n^3$ rule says.`,
      trap: R`Dividing by $n^3$ instead of $n^4$ after taking the bracket difference gives three times the right answer.` },
    { id: 'hfs-r5-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Dirac degeneracy', format: 'statements',
      q: R`Consider the $n = 4$ shell of hydrogen in the Dirac theory (no Lamb shift, no hyperfine structure). Which statements are correct?`,
      options: [R`The shell splits into exactly four distinct energies`,
        R`The $j = \tfrac32$ energy holds 8 states (from $4p_{3/2}$ and $4d_{3/2}$)`,
        R`The total number of states, counting spin, is still 32`,
        R`The $j = \tfrac72$ level is the lowest of the four`], answer: [0, 1, 2],
      sol: R`Dirac energies depend only on $n$ and $j$; for $n = 4$, $j = \tfrac12, \tfrac32, \tfrac52, \tfrac72$: four energies. $j = \tfrac32$ comes from $l = 1$ and $l = 2$, each with $2j + 1 = 4$ states: 8. Splitting never changes the count: $2n^2 = 32$. The shift $\propto-(n/(j + \tfrac12) - \tfrac34)$ is most negative for the smallest $j$, so $j = \tfrac72$ is the HIGHEST level.`,
      trap: R`In hydrogen, larger $j$ means higher energy (less pulled down), the opposite of what "more binding" intuition suggests.` },
    { id: 'hfs-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      q: R`In hydrogen the total fine-structure spread of a shell (from its lowest $j = \tfrac12$ level to its highest $j = n - \tfrac12$ level) is compared for $n = 2$ and $n = 3$. The ratio (spread for $n = 2$)/(spread for $n = 3$) is`,
      options: [R`$\dfrac{27}{8}$`, R`$\dfrac{81}{32}$`, R`$\dfrac{81}{16}$`, R`$\dfrac94$`], answer: 1,
      sol: R`The shift is $\propto-\dfrac{1}{n^4}\left(\dfrac{n}{j + 1/2} - \dfrac34\right)$. Between $j + \tfrac12 = 1$ and $j + \tfrac12 = n$ the bracket changes by $n - 1$, so the spread is $\propto(n - 1)/n^4$. $n = 2$: $1/16$. $n = 3$: $2/81$. Ratio $= \dfrac{1/16}{2/81} = \dfrac{81}{32}\approx2.53$.`,
      trap: R`Assuming a pure $1/n^3$ law gives $27/8$; the spread also grows with the number of $j$ levels, $(n - 1)$.` },
    { id: 'hfs-r5-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit coupling',
      q: R`For hydrogen, $\left\langle r^{-3}\right\rangle_{nl} = \dfrac{1}{a_0^3\,n^3\,l(l + \tfrac12)(l + 1)}$. The ratio $\langle r^{-3}\rangle_{2p}/\langle r^{-3}\rangle_{3d}$ is ______ (two decimal places).`,
      answer: 16.88, tol: 0.03, calc: () => (27 * 2 * 2.5 * 3) / (8 * 1 * 1.5 * 2),
      sol: R`$2p$: $n^3l(l + \tfrac12)(l + 1) = 8\times1\times1.5\times2 = 24$. $3d$: $27\times2\times2.5\times3 = 405$. Ratio $= 405/24 = 16.875$. Because the spin-orbit strength follows $\langle r^{-3}\rangle$, a $3d$ electron feels a spin-orbit coupling about 17 times weaker than a $2p$ electron: high-$l$ electrons stay away from the nucleus.`,
      trap: R`Using only $1/n^3$ gives $27/8 = 3.4$; the $l$ factors matter more here.` },
    { id: 'hfs-r5-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'selection rules',
      q: R`The He$^+$ line $n = 4\to n = 3$ ($468.6$ nm) is studied with a spectrometer that resolves fine structure but not the Lamb shift. Using the Dirac energies (which depend only on $n$ and $j$) and electric-dipole rules ($\Delta l = \pm1$; $\Delta j = 0, \pm1$), the number of distinct line frequencies is ______.`,
      answer: 8, tol: 0,
      sol: R`Upper levels: $j_4 = \tfrac12, \tfrac32, \tfrac52, \tfrac72$; lower: $j_3 = \tfrac12, \tfrac32, \tfrac52$. A frequency is fixed by the pair $(j_4, j_3)$; check that some allowed $l$ change exists for each pair with $|\Delta j|\le1$: $(\tfrac12,\tfrac12)$ $4s\to3p$; $(\tfrac12,\tfrac32)$ $4s\to3p_{3/2}$; $(\tfrac32,\tfrac12)$ $4p_{3/2}\to3s$; $(\tfrac32,\tfrac32)$ $4p_{3/2}\to3d_{3/2}$; $(\tfrac32,\tfrac52)$ $4p_{3/2}\to3d_{5/2}$; $(\tfrac52,\tfrac32)$ $4d_{5/2}\to3p_{3/2}$; $(\tfrac52,\tfrac52)$ $4f_{5/2}\to3d_{5/2}$; $(\tfrac72,\tfrac52)$ $4f_{7/2}\to3d_{5/2}$. $(\tfrac12,\tfrac52)$ and $(\tfrac72,\tfrac12)$, $(\tfrac72,\tfrac32)$ break $|\Delta j|\le1$. Total: 8.`,
      trap: R`Counting $(l, j)$ transitions instead of distinct $(j_4, j_3)$ pairs overcounts, because different $l$ with the same $j$ are degenerate.` },
    { id: 'hfs-r5-10', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'spin-orbit coupling',
      q: R`An electron has $l = 3$. With spin-orbit coupling $A\,\vec L\cdot\vec S$ ($A > 0$), the energy gap between its two $j$ levels is`,
      options: [R`$3A\hbar^2$`, R`$\tfrac72A\hbar^2$`, R`$4A\hbar^2$`, R`$\tfrac52A\hbar^2$`], answer: 1,
      sol: R`$\langle\vec L\cdot\vec S\rangle = \tfrac{\hbar^2}{2}[j(j + 1) - l(l + 1) - \tfrac34]$. For $j = \tfrac72$: $\tfrac12(15.75 - 12 - 0.75) = \tfrac32$; for $j = \tfrac52$: $\tfrac12(8.75 - 12.75) = -2$. Gap $= \tfrac72A\hbar^2 = (l + \tfrac12)A\hbar^2$, the Landé interval rule with the larger $j$.`,
      trap: R`The gap is $A$ times the LARGER $j$, $l + \tfrac12$, not $l$.` },
  ],
  gens: [
    { id: 'hfs-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Z scaling',
      make(r) {
        const Z = int(r, 1, 6), n = int(r, 2, 5), l = int(r, 1, n - 1);
        const ion = ['H', 'He$^+$', 'Li$^{2+}$', 'Be$^{3+}$', 'B$^{4+}$', 'C$^{5+}$'][Z - 1];
        const ans = RA2 * Z ** 4 / (n ** 3 * l * (l + 1)) * 1e6;
        const v = +ans.toPrecision(3);
        return { q: R`For the hydrogen-like ${ion} ($Z = ${Z}$), the fine-structure shift is $E^{(1)}_{nj} = -\dfrac{R_\infty hc\,\alpha^2Z^4}{n^4}\left(\dfrac{n}{j + 1/2} - \dfrac34\right)$ with $R_\infty hc\,\alpha^2 = 724.5\ \mu$eV. The splitting between the $n = ${n}$, $l = ${l}$ levels $j = ${half(2 * l + 1)}$ and $j = ${half(2 * l - 1)}$ is ______ $\mu$eV (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: 'μeV', Z, n, l,
          sol: R`With $j + \tfrac12 = l$ and $l + 1$ the brackets differ by $n\left(\dfrac1l - \dfrac1{l + 1}\right) = \dfrac{n}{l(l + 1)}$, so $\Delta E = \dfrac{R_\infty hc\,\alpha^2Z^4}{n^3\,l(l + 1)} = \dfrac{724.5\times${Z ** 4}}{${n ** 3}\times${l * (l + 1)}} = ${v}\ \mu$eV.`,
          trap: R`Remember the $Z^4$: fine structure grows much faster with nuclear charge than the Bohr energies.` };
      },
      verify: (p) => RA2 * p.Z ** 4 / (p.n ** 3 * p.l * (p.l + 1)) * 1e6 },
    { id: 'hfs-r5g2', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac degeneracy',
      make(r) {
        const n = int(r, 2, 6), j2 = 2 * int(r, 0, n - 1) + 1; // j = j2/2
        const top = j2 === 2 * n - 1;
        const ans = top ? j2 + 1 : 2 * (j2 + 1);
        const o = mcqOptions(r, ans, [top ? 2 * (j2 + 1) : j2 + 1, 2 * n * n, n * n, 2 * j2 + 1, ans + 2], (v) => `$${v}$`);
        return { q: R`In the Dirac theory of hydrogen (no Lamb shift, no hyperfine structure), the number of states that share the energy of the level $n = ${n}$, $j = ${half(j2)}$ is`, ...o,
          sol: R`States with the same $n$ and $j$ are degenerate. $j = ${half(j2)}$ comes from $l = j \pm \tfrac12$ whenever that $l$ is allowed ($l \le n - 1 = ${n - 1}$). ${top ? R`Here $j = n - \tfrac12$, so only $l = ${n - 1}$ exists: $2j + 1 = ${ans}$ states.` : R`Here both $l = ${(j2 - 1) / 2}$ and $l = ${(j2 + 1) / 2}$ are allowed, each giving $2j + 1 = ${j2 + 1}$ states: ${ans} in all.`}`,
          trap: R`Pairs like $2s_{1/2}$ and $2p_{1/2}$ share an energy in Dirac theory; only the top $j$ of a shell has a single $l$.` };
      } },
    { id: 'hfs-r5g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'fine-structure shifts',
      make(r) {
        const Z = int(r, 1, 10), n = int(r, 1, 4), j2 = 2 * int(r, 0, n - 1) + 1;
        const ratio = (Z / 137.036) ** 2 / n ** 2 * (n / ((j2 + 1) / 2) - 0.75) * 1e5;
        const v = +ratio.toPrecision(3);
        return { q: R`For a hydrogen-like ion with $Z = ${Z}$, the fine-structure shift of a level is $E^{(1)} = E_n\dfrac{(Z\alpha)^2}{n^2}\left(\dfrac{n}{j + 1/2} - \dfrac34\right)$, where $E_n$ is the Bohr energy. For $n = ${n}$, $j = ${half(j2)}$ the ratio $E^{(1)}/E_n$ is $k\times10^{-5}$ with $k = $ ______ (three significant figures; $\alpha = 1/137.036$).`,
          answer: v, tol: +(Math.abs(v) * 0.01).toPrecision(2), Z, n, j2,
          sol: R`$(Z\alpha)^2 = ${+((Z / 137.036) ** 2).toPrecision(4)}$; divide by $n^2 = ${n * n}$ and multiply by $\dfrac{${n}}{${(j2 + 1) / 2}} - \dfrac34 = ${round(n / ((j2 + 1) / 2) - 0.75, 4)}$: the ratio is $${v}\times10^{-5}$. It is positive, so the shift has the same sign as $E_n$ (downward).`,
          trap: R`The relative size grows as $Z^2$ ($\alpha\to Z\alpha$), even though the absolute shift grows as $Z^4$.` };
      },
      verify: (p) => (p.Z / 137.036) ** 2 / p.n ** 2 * (p.n / ((p.j2 + 1) / 2) - 0.75) * 1e5 },
  ],
};
