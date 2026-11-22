// Round 4 extras for dielectrics: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'die-r4-01', type: 'nat', level: 3, exams: ['jam'], sub: 'energy',
      q: R`A plastic film has dielectric constant $3.0$ and breaks down at a field of $20$ MV/m. The largest electrical energy it can store per unit volume is about ______ kJ/m³ (two decimal places).`,
      answer: 5.31, tol: 0.03, unit: 'kJ/m³', calc: () => 0.5 * C.eps0 * 3 * (2e7) ** 2 / 1e3,
      sol: R`The energy density in a linear dielectric is $u = \frac12\vec D\cdot\vec E = \frac12\kappa\varepsilon_0E^2$. At the breakdown field: $u = \frac12\times3.0\times8.854\times10^{-12}\times(2.0\times10^7)^2 = 5.31\times10^3$ J/m³.`,
      trap: R`Leaving out $\kappa$ (the vacuum formula $\frac12\varepsilon_0E^2$) gives a third of the answer.` },
    { id: 'die-r4-02', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'polarisability',
      q: R`An atom's polarisability $\alpha$ is defined by $\vec p = \alpha\vec E$. The quantity $\alpha/(4\pi\varepsilon_0)$ has the dimensions of`,
      options: [R`area`, R`volume`, R`length`, R`nothing: it is a pure number`], answer: 1,
      sol: R`$\alpha = p/E$ has units $\frac{\text{C m}}{\text{V/m}} = \text{C m}^2\text{/V}$. $4\pi\varepsilon_0$ has units C/(V m). Dividing: $\frac{\text{C m}^2/\text{V}}{\text{C/(V m)}} = \text{m}^3$. This "polarisability volume" is of the order of the atom's size cubed (about $0.67\times10^{-30}$ m³ for hydrogen).`,
      trap: R`Treating $\alpha$ itself as a volume; only after dividing by $4\pi\varepsilon_0$ is it one.` },
    { id: 'die-r4-03', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'polarisability',
      q: R`Model an atom as a point nucleus $+e$ inside a uniform spherical electron cloud of radius $0.50\times10^{-10}$ m and charge $-e$. In a field of $1.0\times10^6$ V/m, the nucleus shifts from the centre of the cloud by about ______ fm (three significant figures; $1$ fm $= 10^{-15}$ m).`,
      answer: 0.0868, tol: 0.0009, unit: 'fm', calc: () => 4 * Math.PI * C.eps0 * (0.5e-10) ** 3 * 1e6 / C.e * 1e15,
      sol: R`Inside a uniform ball of charge, the field at distance $d$ from the centre is $\frac{ed}{4\pi\varepsilon_0a^3}$ (Gauss's law). Equilibrium with the applied field: $\frac{ed}{4\pi\varepsilon_0a^3} = E$, so $d = \frac{4\pi\varepsilon_0a^3E}{e} = \frac{1.113\times10^{-10}\times1.25\times10^{-31}\times10^6}{1.602\times10^{-19}} = 8.68\times10^{-17}$ m $= 0.0868$ fm, about a millionth of the atom's size. The model gives $\alpha = 4\pi\varepsilon_0a^3$.`,
      trap: R`Using the field of a point charge, $e/(4\pi\varepsilon_0d^2)$; inside the cloud only the charge within radius $d$ pulls back.` },
    { id: 'die-r4-04', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'frequency dependence',
      q: R`Water has a static relative permittivity of about $80$, yet its refractive index for visible light is $1.33$ (so $\varepsilon_r = n^2\approx1.8$ at those frequencies). The best explanation is`,
      options: [R`light is too short in wavelength to enter water molecules`, R`the refractive index and permittivity are unrelated quantities`, R`water has no electronic polarisation`, R`the permanent molecular dipoles cannot turn fast enough to follow a field oscillating at optical frequencies, so only electronic polarisation remains`], answer: 3,
      sol: R`The static value includes orientational polarisation: water's permanent dipoles line up with a slow field. Rotating a molecule takes about $10^{-11}$ s, far longer than one optical cycle ($\sim10^{-15}$ s), so at optical frequencies that contribution vanishes. Only the fast electronic response is left, giving $\varepsilon_r = n^2\approx1.8$. This is dielectric dispersion.`,
      trap: R`Expecting $n = \sqrt{\varepsilon_r}$ to use the static value; $\varepsilon_r$ depends on frequency.` },
    { id: 'die-r4-05', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'bound charge', format: 'statements',
      q: R`A short cylinder of electret has a permanent uniform polarisation $\vec P$ along its axis, and there is no free charge anywhere. Which statements are true?`,
      options: [R`Its flat end faces carry bound charge $\pm P$ per unit area`, R`Its curved side carries bound charge $P$ per unit area`, R`The bound volume charge density is zero`, R`At its centre the electric field points opposite to $\vec P$`],
      answer: [0, 2, 3],
      sol: R`Bound surface charge is $\sigma_b = \vec P\cdot\hat n$: $+P$ on the face $\vec P$ points out of, $-P$ on the other, and zero on the curved side where $\hat n\perp\vec P$. Bound volume charge is $\rho_b = -\nabla\cdot\vec P = 0$ for uniform $\vec P$. The two charged faces act like a parallel-plate pair whose field runs from the $+$ face to the $-$ face, opposite to $\vec P$ (a "depolarising" field).`,
      trap: R`Expecting $\vec E$ to point along $\vec P$; inside a polarised body without free charge the field points back against it.` },
    { id: 'die-r4-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'capacitors',
      q: R`A spherical capacitor has radii $5.0$ cm and $10$ cm. The lower half of the space between them (a hemispherical shell) is filled with a dielectric of constant $3.0$; the upper half is air. Its capacitance is ______ pF (one decimal place).`,
      answer: 22.3, tol: 0.2, unit: 'pF', calc: () => 4 * Math.PI * C.eps0 * 0.05 * 0.1 / 0.05 * (1 + 3) / 2 * 1e12,
      sol: R`The field stays radial: tangential $\vec E$ is continuous across the flat boundary between the halves, and a radial field $\frac{A}{r^2}$ in both halves fits that (with different free charge densities on each half). So the two halves are capacitors in parallel, each with half the solid angle: $C = \frac{C_0}{2} + \frac{\kappa C_0}{2} = \frac{1 + \kappa}{2}C_0$. With $C_0 = 4\pi\varepsilon_0\frac{ab}{b - a} = 11.1$ pF, $C = 2\times11.1 = 22.3$ pF.`,
      trap: R`Treating the halves as being in series; they share the same potential difference, so they are in parallel.` },
    { id: 'die-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'clausius mossotti',
      q: R`In a dense non-polar medium, $\dfrac{N\alpha}{3\varepsilon_0} = 0.25$. Using the Clausius-Mossotti relation, its relative permittivity is ______ (two decimal places).`,
      answer: 2, tol: 0.01, calc: () => (1 + 2 * 0.25) / (1 - 0.25),
      sol: R`Clausius-Mossotti: $\frac{\varepsilon_r - 1}{\varepsilon_r + 2} = \frac{N\alpha}{3\varepsilon_0} = x$, so $\varepsilon_r = \frac{1 + 2x}{1 - x} = \frac{1.5}{0.75} = 2.00$. The local field $\vec E + \vec P/3\varepsilon_0$ felt by each molecule is larger than the average field, which raises $\varepsilon_r$ above the dilute-gas estimate $1 + N\alpha/\varepsilon_0 = 1.75$.`,
      trap: R`Using the dilute formula $\varepsilon_r = 1 + 3x$ (1.75), which ignores the local-field correction.` },
    { id: 'die-r4-08', type: 'mcq', level: 2, exams: ['jam'], sub: 'displacement',
      q: R`Which of these holds in every material, whether or not it is linear?`,
      options: [R`$\vec D = \varepsilon\vec E$`, R`$\nabla\times\vec D = 0$`, R`$\nabla\cdot\vec D = \rho_{\rm free}$`, R`$\vec P = \varepsilon_0\chi_e\vec E$`], answer: 2,
      sol: R`$\vec D$ is defined as $\varepsilon_0\vec E + \vec P$; Gauss's law $\nabla\cdot(\varepsilon_0\vec E) = \rho_{\rm free} + \rho_b$ with $\rho_b = -\nabla\cdot\vec P$ gives $\nabla\cdot\vec D = \rho_{\rm free}$ always. $\vec D = \varepsilon\vec E$ and $\vec P = \varepsilon_0\chi_e\vec E$ hold only for linear media. $\nabla\times\vec D = \nabla\times\vec P$, which is non-zero for example at the edges of a uniformly polarised bar.`,
      trap: R`Assuming $\vec D$ behaves like $\vec E$ and has zero curl; it generally does not.` },
    { id: 'die-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'energy',
      q: R`For free charges placed in a linear dielectric, the work needed to assemble them is given by`,
      options: [R`$\frac12\int\vec D\cdot\vec E\,d\tau$`, R`$\frac{\varepsilon_0}{2}\int E^2\,d\tau$`, R`$\frac12\int\rho_bV\,d\tau$`, R`$\int\vec P\cdot\vec E\,d\tau$`], answer: 0,
      sol: R`Bringing in free charge $\delta\rho_f$ costs $\int V\,\delta\rho_f\,d\tau = \int V\nabla\cdot(\delta\vec D)\,d\tau = \int\vec E\cdot\delta\vec D\,d\tau$. For a linear medium $\vec E\cdot\delta\vec D = \frac12\delta(\vec D\cdot\vec E)$, so $W = \frac12\int\vec D\cdot\vec E\,d\tau$. This includes the energy stored in stretching the molecular "springs"; $\frac{\varepsilon_0}{2}\int E^2$ counts only the field and would be the work to assemble all charges, bound ones included.`,
      trap: R`Using the vacuum formula; it leaves out the energy that goes into polarising the material.` },
    { id: 'die-r4-10', type: 'nat', level: 2, exams: ['jam'], sub: 'capacitors',
      q: R`An air capacitor of $0.50\ \mu$F has its gap filled with mica (dielectric constant $6.0$) and is then connected in series with an air capacitor of $1.0\ \mu$F. The combined capacitance is ______ $\mu$F.`,
      answer: 0.75, tol: 0.005, unit: 'μF', calc: () => (3 * 1) / (3 + 1),
      sol: R`Filling the gap multiplies the capacitance by $\kappa$: $0.50\times6.0 = 3.0\ \mu$F. In series with $1.0\ \mu$F: $\frac{3.0\times1.0}{3.0 + 1.0} = 0.75\ \mu$F.`,
      trap: R`Adding series capacitances directly.` },
    { id: 'die-r4-11', type: 'mcq', level: 3, exams: ['jam'], sub: 'capacitors',
      q: R`A slab of thickness $t$ and dielectric constant $\kappa$ lies inside a parallel-plate capacitor of gap $d$ and area $A$, parallel to the plates, so $C = \dfrac{\varepsilon_0A}{d - t + t/\kappa}$. Which statement is NOT correct?`,
      options: [R`With $\kappa = 1$ it reduces to the air value $\varepsilon_0A/d$`, R`As $\kappa\to\infty$ the slab acts like a metal sheet of the same thickness`, R`With $t = d$ it gives $\kappa\varepsilon_0A/d$`, R`$C$ depends on how far the slab is from the lower plate`], answer: 3,
      sol: R`The formula has no term for the slab's position: the air layers above and below it add up to $d - t$ wherever it sits, because they are in series with the slab and the field in air is the same in both. The three limits check: $\kappa = 1$ gives $\varepsilon_0A/d$; $\kappa\to\infty$ gives $\varepsilon_0A/(d - t)$, the metal-sheet result; $t = d$ gives the full dielectric.`,
      trap: R`Expecting a slab near one plate to act differently from one in the middle.` },
    { id: 'die-r4-12', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'polarisation mechanisms', format: 'statements',
      q: R`A gas of polar molecules (permanent dipole moment $p_0$, polarisability $\alpha$, number density $N$) is studied at different temperatures $T$. Which statements are true?`,
      options: [R`The orientational part of its susceptibility falls roughly as $1/T$`, R`The electronic (induced) part hardly depends on temperature`, R`Its susceptibility is about $\dfrac{N}{\varepsilon_0}\left(\alpha + \dfrac{p_0^2}{3k_BT}\right)$`, R`Non-polar molecules cannot be polarised by a field`],
      answer: [0, 1, 2],
      sol: R`Thermal agitation fights the lining up of permanent dipoles; for weak fields the average dipole along $\vec E$ is $\frac{p_0^2E}{3k_BT}$ (Langevin-Debye), so that part falls as $1/T$. The induced moment $\alpha E$ comes from distorting the electron clouds and barely depends on $T$. Adding the two gives the Debye formula. Every atom or molecule, polar or not, has an induced moment.`,
      trap: R`Thinking non-polar means non-polarisable; non-polar only means no permanent moment.` },
  ],
  gens: [
    { id: 'die-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'clausius mossotti',
      make(r) {
        const x = int(r, 2, 30) / 100, inverse = r() < 0.5;
        const er = (1 + 2 * x) / (1 - x);
        if (inverse) {
          const e = round(er, 2), xx = (e - 1) / (e + 2);
          return { q: `A dense non-polar liquid has relative permittivity $${e}$. Using the Clausius-Mossotti relation, $N\\alpha/(3\\varepsilon_0)$ is ______ (three decimal places).`,
            answer: round(xx, 3), tol: 0.002, e, inverse,
            sol: `$\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = \\frac{N\\alpha}{3\\varepsilon_0}$, so $\\frac{N\\alpha}{3\\varepsilon_0} = \\frac{${round(e - 1, 2)}}{${round(e + 2, 2)}} = ${round(xx, 3)}$.`,
            trap: 'The denominator is $\\varepsilon_r + 2$, from the Lorentz local field.' };
        }
        return { q: `In a dense non-polar medium, $N\\alpha/(3\\varepsilon_0) = ${x}$. By the Clausius-Mossotti relation its relative permittivity is ______ (three decimal places).`,
          answer: round(er, 3), tol: 0.002, x, inverse,
          sol: `$\\frac{\\varepsilon_r - 1}{\\varepsilon_r + 2} = x$ gives $\\varepsilon_r = \\frac{1 + 2x}{1 - x} = \\frac{${round(1 + 2 * x, 2)}}{${round(1 - x, 2)}} = ${round(er, 3)}$ (the dilute-gas estimate $1 + 3x$ would give $${round(1 + 3 * x, 2)}$).`,
          trap: 'Do not use the dilute formula $1 + 3x$; the local field is larger than the average field.' };
      },
      verify: (p) => (p.inverse ? (p.e - 1) / (p.e + 2) : (1 + 2 * p.x) / (1 - p.x)) },
    { id: 'die-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'energy',
      make(r) {
        const kap = choose(r, [2.1, 2.5, 3, 3.5, 4.5, 6, 10]), Ebd = choose(r, [10, 15, 20, 30, 50, 60]), mode = r() < 0.5;
        const u = 0.5 * kap * C.eps0 * (Ebd * 1e6) ** 2 / 1e3, s = kap * C.eps0 * Ebd * 1e6 * 1e6;
        if (mode) return { q: `A dielectric with constant $${kap}$ breaks down at $${Ebd}$ MV/m. The largest energy it can store per unit volume is ______ kJ/m³ (three significant figures).`,
          answer: +u.toPrecision(3), tol: +(u * 0.005).toPrecision(2), unit: 'kJ/m³', kap, Ebd, mode,
          sol: `$u = \\frac12\\kappa\\varepsilon_0E^2 = \\frac12\\times${kap}\\times8.854\\times10^{-12}\\times(${Ebd}\\times10^6)^2 = ${+u.toPrecision(3)}$ kJ/m³.`,
          trap: 'Include $\\kappa$ in the energy density.' };
        return { q: `A parallel-plate capacitor is filled with a dielectric of constant $${kap}$ that breaks down at $${Ebd}$ MV/m. The largest free charge per unit area its plates can hold is ______ $\\mu$C/m² (three significant figures).`,
          answer: +s.toPrecision(3), tol: +(s * 0.005).toPrecision(2), unit: 'μC/m²', kap, Ebd, mode,
          sol: `In the dielectric $D = \\sigma_f$ and $E = \\frac{D}{\\kappa\\varepsilon_0}$, so $\\sigma_{\\max} = \\kappa\\varepsilon_0E_{\\rm bd} = ${kap}\\times8.854\\times10^{-12}\\times${Ebd}\\times10^6 = ${+s.toPrecision(3)}\\ \\mu$C/m².`,
          trap: 'The free charge is $\\kappa$ times what the same field would need in air.' };
      },
      verify: (p) => (p.mode ? 0.5 * p.kap * C.eps0 * (p.Ebd * 1e6) ** 2 / 1e3 : p.kap * C.eps0 * p.Ebd * 1e12) },
    { id: 'die-r4g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'capacitors',
      make(r) {
        const a = int(r, 2, 8), b = a + int(r, 2, 8), kap = choose(r, [2, 3, 4, 5, 6]), [f, ftex] = choose(r, [[0.25, 'a quarter'], [0.5, 'half'], [0.75, 'three quarters']]);
        const C0 = 4 * Math.PI * C.eps0 * (a / 100) * (b / 100) / ((b - a) / 100) * 1e12, Cc = C0 * (1 + (kap - 1) * f);
        return { q: `A spherical capacitor has radii $${a}$ cm and $${b}$ cm. A wedge-shaped region filling ${ftex} of the space between them (a fraction ${f} of the full solid angle, bounded by flat planes through the centre) is filled with a dielectric of constant $${kap}$; the rest is air. Its capacitance is ______ pF (two decimal places).`,
          answer: round(Cc, 2), tol: Math.max(0.01, round(Cc * 0.004, 2)), unit: 'pF', a, b, kap, f,
          sol: `The field stays radial (tangential $E$ is continuous across the flat boundaries), so the parts are in parallel and each contributes in proportion to its solid angle: $C = C_0[(1 - f) + \\kappa f]$. Here $C_0 = 4\\pi\\varepsilon_0\\frac{ab}{b - a} = ${round(C0, 3)}$ pF and $C = ${round(C0, 3)}\\times${round(1 + (kap - 1) * f, 3)} = ${round(Cc, 2)}$ pF.`,
          trap: 'Regions side by side between the same two conductors are in parallel, not series.' };
      },
      verify: (p) => 4 * Math.PI * C.eps0 * (p.a / 100) * (p.b / 100) / ((p.b - p.a) / 100) * 1e12 * (1 + (p.kap - 1) * p.f) },
  ],
};
