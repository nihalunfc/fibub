// Round 5 extras for dielectrics: original questions, written 2026-11-22.
import { pick, int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'die-r5-01', type: 'mcq', level: 2, exams: ['jam'], sub: 'capacitor with dielectric',
      q: R`A parallel-plate capacitor stays connected to a battery while a slab of dielectric constant $\kappa$ is slid in to fill the gap completely. Compared with before,`,
      options: [R`the charge is unchanged and the field falls to $1/\kappa$`, R`the charge and the field both rise $\kappa$ times`, R`the charge rises $\kappa$ times and the field is unchanged`, R`the charge falls to $1/\kappa$ and the field is unchanged`], answer: 2,
      sol: R`The battery fixes $V$, and the gap $d$ is fixed, so $E = V/d$ cannot change. The capacitance becomes $\kappa C$, so $Q = \kappa CV$ rises $\kappa$ times: the battery pushes extra free charge on to cancel the bound charge of the slab.`,
      trap: R`Applying "the field drops by $\kappa$", which holds when the charge is fixed (battery removed).` },
    { id: 'die-r5-02', type: 'nat', level: 3, exams: ['jam'], sub: 'bound charge',
      q: R`The plates of a capacitor carry free charge $\pm5.0\ \mu$C/m², and the gap is filled with a linear dielectric of $\kappa = 4$. The bound surface charge density on the face of the dielectric next to the positive plate has magnitude ______ $\mu$C/m² (two decimal places).`,
      answer: 3.75, tol: 0.01, unit: 'μC/m²', calc: () => 5 * (1 - 1 / 4),
      sol: R`$D = \sigma_f$. Inside, $E = \frac{\sigma_f}{\kappa\varepsilon_0}$ and $P = D - \varepsilon_0E = \sigma_f\left(1 - \frac1\kappa\right)$. The bound charge on the face is $|\sigma_b| = P = 5.0\times\frac34 = 3.75\ \mu$C/m² (negative, next to the positive plate). The net charge $5.0 - 3.75 = 1.25 = 5.0/\kappa$ sets the reduced field.`,
      trap: R`Writing $\sigma_b = \sigma_f/\kappa$; that is the net charge left over, not the bound charge.` },
    { id: 'die-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'mixed dielectrics', format: 'statements',
      q: R`A parallel-plate capacitor (plate area $A$, gap $d$) is filled with two dielectrics, $\kappa_1$ and $\kappa_2$, in one of two ways. Which statements are true?`,
      options: [R`Side by side, each covering half the plate area: $C = \dfrac{\varepsilon_0A(\kappa_1 + \kappa_2)}{2d}$`, R`In two layers, each of thickness $d/2$: $C = \dfrac{2\varepsilon_0A\kappa_1\kappa_2}{d(\kappa_1 + \kappa_2)}$`, R`In the layered case, $D$ is the same in both layers`, R`In the side-by-side case, $D$ is the same in both dielectrics`],
      answer: [0, 1, 2],
      sol: R`Side by side the two halves are capacitors in parallel, $\frac{\kappa_1\varepsilon_0A}{2d} + \frac{\kappa_2\varepsilon_0A}{2d}$; both have the same $V$ over the same gap, so $E$ is equal and $D = \kappa\varepsilon_0E$ differs. Layered, they are in series, each $\frac{2\kappa_i\varepsilon_0A}{d}$, giving the second formula; the normal component of $D$ is continuous across the boundary (no free charge there), so $D$ is equal in both layers.`,
      trap: R`Swapping which of $E$ and $D$ is shared in the two arrangements.` },
    { id: 'die-r5-04', type: 'nat', level: 4, exams: ['jam'], sub: 'partly filled capacitor',
      q: R`A parallel-plate capacitor has plates of area $0.020$ m², $4.0$ mm apart. A $3.0$ mm thick slab with $\kappa = 3$ lies flat on one plate, leaving $1.0$ mm of air. The capacitance is ______ pF (one decimal place; $\varepsilon_0 = 8.85\times10^{-12}$ F/m).`,
      answer: 88.5, tol: 0.3, unit: 'pF', calc: () => 8.85e-12 * 0.02 / (3e-3 / 3 + 1e-3) * 1e12,
      sol: R`The slab and air gap are in series: $C = \frac{\varepsilon_0A}{t/\kappa + (d - t)} = \frac{8.85\times10^{-12}\times0.020}{1.0\times10^{-3} + 1.0\times10^{-3}} = 8.85\times10^{-11}$ F $= 88.5$ pF. The slab acts like $t/\kappa = 1$ mm of air.`,
      trap: R`Multiplying the whole air capacitance by $\kappa$ when only part of the gap is filled.` },
    { id: 'die-r5-05', type: 'mcq', level: 4, exams: ['jam'], sub: 'forces on dielectrics',
      q: R`A dielectric slab is partly pushed between the plates of a parallel-plate capacitor kept at fixed voltage by a battery (edge effects drive the force). As the slab goes further in, the force pulling it in`,
      options: [R`grows in proportion to how far it is in`, R`falls in proportion to how far it is in`, R`reverses once it is half-way in`, R`stays the same`], answer: 3,
      sol: R`With $x$ the length inside and $w$ the plate width, $C(x) = \frac{\varepsilon_0w}{d}[\kappa x + (L - x)]$. At fixed $V$, $F = \frac12V^2\frac{dC}{dx} = \frac{\varepsilon_0(\kappa - 1)wV^2}{2d}$, which does not depend on $x$.`,
      trap: R`Using $F = -dU/dx$ at fixed voltage; the battery also does work, and the force is $+\frac12V^2\,dC/dx$.` },
    { id: 'die-r5-06', type: 'nat', level: 3, exams: ['jam'], sub: 'bound charge',
      q: R`A point charge of $+4.0$ nC is embedded in a very large block of linear dielectric with $\kappa = 5$. The total bound charge gathered on the dielectric right around the point charge is ______ nC (one decimal place, with sign).`,
      answer: -3.2, tol: 0.01, unit: 'nC', calc: () => -4 * (1 - 1 / 5),
      sol: R`Gauss's law for $D$ gives $D = \frac{q}{4\pi r^2}$, so $E = \frac{q}{4\pi\kappa\varepsilon_0r^2}$: the field of a reduced charge $q/\kappa$. The difference is the bound charge hugging the point charge: $q_b = \frac{q}{\kappa} - q = -q\left(1 - \frac1\kappa\right) = -3.2$ nC.`,
      trap: R`Answering $q/\kappa = 0.8$ nC, which is the net (free plus bound) charge.` },
    { id: 'die-r5-07', type: 'mcq', level: 4, exams: ['jam'], sub: 'partly filled capacitor', format: 'limiting case',
      q: R`A slab of thickness $t$ and dielectric constant $\kappa$ fills part of the gap $d$ of a parallel-plate capacitor, so $C = \dfrac{\varepsilon_0A}{d - t + t/\kappa}$. In the limit $\kappa\to\infty$, the capacitor behaves as if`,
      options: [R`a metal plate of thickness $t$ were in the gap`, R`the slab were removed`, R`the gap were shorted, so $C\to\infty$`, R`the gap were doubled`], answer: 0,
      sol: R`As $\kappa\to\infty$, $t/\kappa\to0$ and $C\to\frac{\varepsilon_0A}{d - t}$: exactly the result for an uncharged metal slab of thickness $t$, which has no field inside. $C$ only becomes infinite if $t = d$ as well.`,
      trap: R`Thinking an infinite dielectric constant shorts the capacitor; it only removes the field inside the slab.` },
    { id: 'die-r5-08', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'polar molecules', format: 'graph in words',
      q: R`For two gases, $\varepsilon_r - 1$ is measured at several temperatures (at fixed number density) and plotted against $1/T$. Gas X gives a horizontal line; gas Y gives a rising straight line that does not pass through the origin. What can be concluded?`,
      options: [R`X has permanent dipoles; Y does not`, R`Y has permanent dipoles and is also polarisable; X is only polarisable`, R`Neither has permanent dipoles; Y is ionised`, R`Both have permanent dipoles, but Y's are larger`], answer: 1,
      sol: R`For a dilute gas, $\varepsilon_r - 1 = \frac{N}{\varepsilon_0}\left(\alpha + \frac{p_0^2}{3k_BT}\right)$. A slope with $1/T$ comes only from the orientation term, so Y has a permanent dipole $p_0$; its intercept gives the induced polarisability $\alpha$. X shows no $1/T$ term: no permanent dipole, only induced polarisation.`,
      trap: R`Reading the non-zero intercept as a dipole effect; the intercept is the temperature-independent induced part.` },
    { id: 'die-r5-09', type: 'nat', level: 3, exams: ['jam'], sub: 'energy',
      q: R`A $2.0\ \mu$F air capacitor is charged to $100$ V and disconnected. A slab with $\kappa = 4$ is then slid in to fill the gap. The stored energy falls by ______ mJ (two decimal places).`,
      answer: 7.5, tol: 0.01, unit: 'mJ', calc: () => 0.5 * 2e-6 * 100 ** 2 * (1 - 1 / 4) * 1e3,
      sol: R`At first $U_1 = \frac12CV^2 = \frac12(2\times10^{-6})(100)^2 = 10.0$ mJ. The charge stays fixed and $C$ becomes $4C$, so $U_2 = \frac{Q^2}{2\kappa C} = U_1/4 = 2.5$ mJ. The fall is $7.5$ mJ: the field does work pulling the slab in.`,
      trap: R`Using $\frac12CV^2$ with the old voltage after inserting the slab; with $Q$ fixed, $V$ drops.` },
    { id: 'die-r5-10', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'bound charge', format: 'statements',
      q: R`Which statements about polarisation $\vec P$ and bound charge are true?`,
      options: [R`Inside a uniform linear dielectric that holds no free charge, the bound volume charge is zero`, R`The bound surface charge is $\sigma_b = \vec P\cdot\hat n$`, R`$\nabla\times\vec P = 0$ in every dielectric`, R`At the boundary between two dielectrics with no free surface charge, the normal component of $\vec D$ is continuous`],
      answer: [0, 1, 3],
      sol: R`In a uniform linear medium $\vec P = \varepsilon_0\chi_e\vec E$ and $\nabla\cdot\vec D = 0$ give $\nabla\cdot\vec P = \frac{\chi_e}{1 + \chi_e}\nabla\cdot\vec D = 0$, so $\rho_b = 0$. $\sigma_b = \vec P\cdot\hat n$ is the standard result. $\nabla\times\vec P$ need not vanish (for instance at the edge of a finite polarised body), which is why $\vec D$ is not fixed by free charge alone. With no free surface charge, Gauss's law for $\vec D$ makes $D_\perp$ continuous.`,
      trap: R`Assuming $\nabla\times\vec P = 0$ like $\nabla\times\vec E$; it fails in general.` },
  ],
  gens: [
    { id: 'die-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'bound charge',
      make(r) {
        const s = int(r, 2, 20), k = choose(r, [1.5, 2, 2.5, 3, 4, 5, 6, 8]), sb = s * (1 - 1 / k);
        return { q: `A capacitor's plates carry free charge $\\pm${s}\\ \\mu$C/m², and a linear dielectric with $\\kappa = ${k}$ fills the gap. The magnitude of the bound surface charge density on the dielectric is ______ $\\mu$C/m² (two decimal places).`,
          answer: round(sb, 2), tol: 0.01, unit: 'μC/m²', s, k,
          sol: `$|\\sigma_b| = P = \\sigma_f\\left(1 - \\frac1\\kappa\\right) = ${s}\\times\\left(1 - \\frac{1}{${k}}\\right) = ${round(sb, 2)}\\ \\mu$C/m².`,
          trap: '$\\sigma_f/\\kappa$ is the net charge, not the bound charge.' };
      },
      verify: (p) => p.s * (1 - 1 / p.k) },
    { id: 'die-r5g2', type: 'nat', level: 3, exams: ['jam'], sub: 'partly filled capacitor',
      make(r) {
        const d = int(r, 3, 10), t = int(r, 1, d - 1), k = choose(r, [2, 3, 4, 5, 6, 10]), A = choose(r, [50, 100, 200, 400]);
        const Cp = C.eps0 * A * 1e-4 / ((d - t + t / k) * 1e-3) * 1e12;
        return { q: `A parallel-plate capacitor has plates of area $${A}$ cm² and a gap of $${d}$ mm. A $${t}$ mm slab with $\\kappa = ${k}$ lies on one plate. The capacitance is ______ pF (two decimal places).`,
          answer: round(Cp, 2), tol: Math.max(0.01, round(Cp * 0.005, 2)), unit: 'pF', d, t, k, A,
          sol: `$C = \\frac{\\varepsilon_0A}{(d - t) + t/\\kappa} = \\frac{8.854\\times10^{-12}\\times${A}\\times10^{-4}}{(${d - t} + ${round(t / k, 4)})\\times10^{-3}} = ${round(Cp, 2)}$ pF.`,
          trap: 'The slab counts as an air layer $t/\\kappa$ thick, in series with the rest of the gap.' };
      },
      verify: (p) => C.eps0 * p.A * 1e-4 / ((p.d - p.t + p.t / p.k) * 1e-3) * 1e12 },
    { id: 'die-r5g3', type: 'nat', level: 4, exams: ['jam'], sub: 'energy',
      make(r) {
        const Cu = choose(r, [1, 2, 5, 10]), V = choose(r, [50, 100, 200]), k = choose(r, [2, 3, 4, 5]), batt = r() < 0.5;
        const U = 0.5 * Cu * 1e-6 * V * V * 1e3, dU = batt ? (k - 1) * U : -(1 - 1 / k) * U;
        return { q: `A $${Cu}\\ \\mu$F air capacitor is charged to $${V}$ V${batt ? ' and left connected to the battery' : ' and then disconnected'}. A slab with $\\kappa = ${k}$ is slid in to fill the gap. The change in stored energy (positive for an increase) is ______ mJ (two decimal places).`,
          answer: round(dU, 2), tol: Math.max(0.01, round(Math.abs(dU) * 0.002, 2)), unit: 'mJ', Cu, V, k, batt,
          sol: `First $U = \\frac12CV^2 = ${round(U, 3)}$ mJ. ${batt ? `With $V$ fixed, $U' = \\kappa U$, so $\\Delta U = (\\kappa - 1)U = ${round(dU, 2)}$ mJ (the battery supplies twice this; half pulls the slab in).` : `With $Q$ fixed, $U' = U/\\kappa$, so $\\Delta U = -(1 - 1/\\kappa)U = ${round(dU, 2)}$ mJ.`}`,
          trap: 'Decide first what is held fixed: $V$ (battery on) or $Q$ (battery off).' };
      },
      verify: (p) => { const U = 0.5 * p.Cu * 1e-6 * p.V * p.V * 1e3; return p.batt ? (p.k - 1) * U : -(1 - 1 / p.k) * U; } },
  ],
};
