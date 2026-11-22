// Round 5 extras for fields-in-matter: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;
const k = 8.9875517923e9;
const deg = Math.PI / 180;

export default {
  items: [
    { id: 'fim-r5-01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bound currents',
      q: R`A very long iron rod is uniformly magnetised along its length with $M = 8.0\times10^5$ A/m, and carries no free current. The magnetic field $B$ deep inside it, far from the ends, is ______ T (two decimal places).`,
      answer: 1.01, tol: 0.01, unit: 'T', calc: () => 1.25663706212e-6 * 8e5,
      sol: R`Uniform $\vec M$ gives no volume current ($\nabla\times\vec M = 0$) and a surface current $K_b = M$ circling the curved surface, like a long solenoid with $nI = M$. Inside, $B = \mu_0K_b = \mu_0M = 4\pi\times10^{-7}\times8.0\times10^5 = 1.01$ T. Then $H = B/\mu_0 - M = 0$ inside a long rod.`,
      trap: R`Using the sphere result $\tfrac23\mu_0M$; the shape matters, and a long rod behaves like a solenoid.` },
    { id: 'fim-r5-02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bound currents',
      q: R`A short cylinder is uniformly magnetised along its axis. Its bound currents are`,
      options: [R`a volume current along the axis only`, R`surface currents on the flat ends only`, R`a surface current around the curved side only`, R`both a volume current and surface currents on every face`], answer: 2,
      sol: R`$\vec J_b = \nabla\times\vec M = 0$ for uniform $\vec M$. $\vec K_b = \vec M\times\hat n$: on the flat ends $\hat n\parallel\vec M$, so $\vec K_b = 0$; on the curved side $\hat n\perp\vec M$, giving $K_b = M$ circling the axis.`,
      trap: R`Copying the electric picture (bound charge on the end faces) over to bound currents.` },
    { id: 'fim-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'frozen polarisation', format: 'statements',
      q: R`A very large flat slab carries a frozen-in uniform polarisation $\vec P$ perpendicular to its faces, and there is no free charge anywhere. Which statements are true?`,
      options: [R`$\vec D = 0$ inside the slab`, R`$\vec E = -\vec P/\varepsilon_0$ inside the slab`, R`The faces carry bound charge densities $\pm P$`, R`Outside the slab $E = P/\varepsilon_0$`],
      answer: [0, 1, 2],
      sol: R`The faces carry $\sigma_b = \vec P\cdot\hat n = \pm P$, like a parallel-plate capacitor, so the field is $P/\varepsilon_0$ between the "plates" (opposite to $\vec P$) and zero outside. Then $\vec D = \varepsilon_0\vec E + \vec P = 0$ inside, consistent with $D_\perp$ being continuous and zero outside.`,
      trap: R`Expecting a field outside; the two sheets of bound charge cancel there.` },
    { id: 'fim-r5-04', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'linear dielectrics',
      q: R`A metal sphere of radius $5.0$ cm carrying $2.0$ nC is coated with a dielectric shell ($\varepsilon_r = 4$) out to radius $10$ cm. The potential of the sphere (relative to infinity) is ______ V ($\frac{1}{4\pi\varepsilon_0} = 9.0\times10^9$ N m² C⁻²).`,
      answer: 225, tol: 1, unit: 'V', calc: () => 9e9 * 2e-9 * (1 / 0.1 + (1 / 4) * (1 / 0.05 - 1 / 0.1)),
      sol: R`$D = \frac{Q}{4\pi r^2}$ everywhere outside the metal. In the shell $E = \frac{Q}{4\pi\varepsilon_0\varepsilon_rr^2}$; outside, $E = \frac{Q}{4\pi\varepsilon_0r^2}$. Integrate in from infinity: $V = \frac{Q}{4\pi\varepsilon_0}\left[\frac1b + \frac1{\varepsilon_r}\left(\frac1a - \frac1b\right)\right] = 18\times[10 + 0.25\times10] = 225$ V.`,
      trap: R`Dividing the whole potential by $\varepsilon_r$; outside the shell the field is the vacuum one.` },
    { id: 'fim-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions',
      q: R`A field line in air meets the flat surface of a dielectric ($\varepsilon_r = 3$) at $45^\circ$ to the normal. There is no free surface charge. Inside the dielectric the line makes an angle with the normal of about`,
      options: [R`$18.4^\circ$`, R`$45^\circ$`, R`$60^\circ$`, R`$71.6^\circ$`], answer: 3,
      sol: R`$E_\parallel$ is continuous and $D_\perp$ is continuous, so $\varepsilon_1E_1\cos\theta_1 = \varepsilon_2E_2\cos\theta_2$ and $E_1\sin\theta_1 = E_2\sin\theta_2$. Dividing: $\frac{\tan\theta_2}{\tan\theta_1} = \frac{\varepsilon_2}{\varepsilon_1} = 3$. So $\tan\theta_2 = 3$, $\theta_2 = 71.6^\circ$: the line bends away from the normal.`,
      trap: R`Treating it like light refraction (bending towards the normal in the denser medium).` },
    { id: 'fim-r5-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'magnetic circuits',
      q: R`An iron toroid ($\mu_r = 2000$) has a mean length of $0.50$ m with a $2.0$ mm air gap cut in it, and $1000$ ampere-turns of winding. The field in the gap is ______ T (three decimal places; ignore fringing).`,
      answer: 0.559, tol: 0.003, unit: 'T', calc: () => 1.25663706212e-6 * 1000 / (0.498 / 2000 + 0.002),
      sol: R`$B$ is the same in iron and gap (continuous normal component). Ampère for $H$: $\frac{B}{\mu_0\mu_r}l_{\rm iron} + \frac{B}{\mu_0}g = NI$. So $B = \frac{\mu_0NI}{l_{\rm iron}/\mu_r + g} = \frac{1.257\times10^{-6}\times1000}{0.498/2000 + 0.002} = \frac{1.257\times10^{-3}}{2.249\times10^{-3}} = 0.559$ T. The tiny gap dominates: it has eight times the iron's "reluctance".`,
      trap: R`Ignoring the gap and getting $\mu_0\mu_rNI/l = 5.0$ T.` },
    { id: 'fim-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'bound currents',
      q: R`Free current density $\vec J_f$ flows through a uniform linear magnetic material of susceptibility $\chi_m$. The bound volume current density inside is`,
      options: [R`$\chi_m\vec J_f$`, R`$-\chi_m\vec J_f$`, R`$(1 + \chi_m)\vec J_f$`, R`zero, because the material is uniform`], answer: 0,
      sol: R`$\vec M = \chi_m\vec H$, so $\vec J_b = \nabla\times\vec M = \chi_m\nabla\times\vec H = \chi_m\vec J_f$. The total current is $(1 + \chi_m)\vec J_f$, which is why $B = \mu\,H$ scales with $1 + \chi_m$. Uniformity removes bound currents only where no free current flows.`,
      trap: R`Assuming a uniform material never has bound volume current.` },
    { id: 'fim-r5-08', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'energy',
      q: R`A linear dielectric with $\varepsilon_r = 5.0$ carries a uniform field $E = 1.0\times10^6$ V/m. The electrostatic energy stored per unit volume is ______ J/m³ (one decimal place; $\varepsilon_0 = 8.85\times10^{-12}$ F/m).`,
      answer: 22.1, tol: 0.1, unit: 'J/m³', calc: () => 0.5 * 5 * 8.85e-12 * 1e12,
      sol: R`In a linear medium $u = \frac12\vec D\cdot\vec E = \frac12\varepsilon_r\varepsilon_0E^2 = 0.5\times5.0\times8.85\times10^{-12}\times10^{12} = 22.1$ J/m³. This counts the energy stored in polarising the material as well as in the field.`,
      trap: R`Using $\frac12\varepsilon_0E^2$ ($4.4$ J/m³), which leaves out the energy in the polarised material.` },
    { id: 'fim-r5-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'magnetic sphere', format: 'limiting case',
      q: R`A sphere of linear magnetic material ($\mu_r$) is placed in a uniform field $B_0$; inside, $B = \dfrac{3\mu_r}{\mu_r + 2}B_0$. As $\mu_r\to\infty$, the field inside tends to`,
      options: [R`$B_0$`, R`$3B_0$`, R`$0$`, R`infinity`], answer: 1,
      sol: R`$\frac{3\mu_r}{\mu_r + 2}\to3$ as $\mu_r\to\infty$, so $B\to3B_0$: a finite limit, because the sphere's own magnetisation creates a demagnetising $H$ that opposes the applied one. (For $\mu_r = 1$ the formula gives $B_0$, and $\mu_r\to0$ gives $0$, the superconductor limit.)`,
      trap: R`Expecting $B = \mu_rB_0$ to blow up; the shape caps the enhancement at 3 for a sphere.` },
    { id: 'fim-r5-10', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'constitutive relations', format: 'statements',
      q: R`Which statements are true?`,
      options: [R`In a linear isotropic dielectric, $\vec P$ is parallel to $\vec E$`, R`$\vec D = \varepsilon_0\vec E + \vec P$ holds in every material`, R`$\vec H = \vec B/\mu_0 - \vec M$ holds only in linear materials`, R`In a diamagnetic material, $\vec M$ points opposite to $\vec H$`],
      answer: [0, 1, 3],
      sol: R`Linear isotropic means $\vec P = \varepsilon_0\chi_e\vec E$ with a scalar $\chi_e$. $\vec D = \varepsilon_0\vec E + \vec P$ and $\vec H = \vec B/\mu_0 - \vec M$ are definitions, valid everywhere (iron, electrets, anything). A diamagnet has $\chi_m < 0$, so $\vec M = \chi_m\vec H$ is opposite to $\vec H$.`,
      trap: R`Treating the definitions of $\vec D$ and $\vec H$ as if they were the linear constitutive laws.` },
  ],
  gens: [
    { id: 'fim-r5g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'linear dielectrics',
      make(r) {
        const a = int(r, 2, 8), b = a + int(r, 1, 10), er = choose(r, [2, 3, 4, 5, 6, 8]), Q = choose(r, [1, 2, 3, 5, 10]);
        const V = k * Q * 1e-9 * (1 / (b / 100) + (1 / er) * (1 / (a / 100) - 1 / (b / 100)));
        return { q: `A metal sphere of radius $${a}$ cm carrying $${Q}$ nC is coated with a dielectric shell ($\\varepsilon_r = ${er}$) out to radius $${b}$ cm. The sphere's potential relative to infinity is ______ V (one decimal place).`,
          answer: round(V, 1), tol: Math.max(0.1, round(V * 0.002, 1)), unit: 'V', a, b, er, Q,
          sol: `$V = \\frac{Q}{4\\pi\\varepsilon_0}\\left[\\frac1b + \\frac{1}{\\varepsilon_r}\\left(\\frac1a - \\frac1b\\right)\\right] = 8.988\\times10^9\\times${Q}\\times10^{-9}\\left[\\frac{1}{${b / 100}} + \\frac{1}{${er}}\\left(\\frac{1}{${a / 100}} - \\frac{1}{${b / 100}}\\right)\\right] = ${round(V, 1)}$ V.`,
          trap: 'Only the shell region has its field reduced by $\\varepsilon_r$.' };
      },
      verify: (p) => k * p.Q * 1e-9 * (1 / (p.b / 100) + (1 / p.er) * (1 / (p.a / 100) - 1 / (p.b / 100))) },
    { id: 'fim-r5g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'magnetic circuits',
      make(r) {
        const L = choose(r, [0.2, 0.3, 0.5, 0.8, 1]), mur = choose(r, [500, 1000, 2000, 4000, 5000]), g = choose(r, [0.5, 1, 2, 3, 5]), NI = choose(r, [200, 500, 1000, 2000]);
        const B = C.mu0 * NI / ((L - g / 1000) / mur + g / 1000);
        return { q: `An iron ring ($\\mu_r = ${mur}$) of mean length $${L}$ m has an air gap of $${g}$ mm and a winding of $${NI}$ ampere-turns. The field in the gap is ______ T (three decimal places; ignore fringing).`,
          answer: round(B, 3), tol: Math.max(0.001, round(B * 0.003, 3)), unit: 'T', L, mur, g, NI,
          sol: `$B = \\frac{\\mu_0NI}{l_{\\rm iron}/\\mu_r + g} = \\frac{1.2566\\times10^{-6}\\times${NI}}{${round(L - g / 1000, 4)}/${mur} + ${g / 1000}} = ${round(B, 3)}$ T.`,
          trap: 'The air gap usually dominates the denominator.' };
      },
      verify: (p) => C.mu0 * p.NI / ((p.L - p.g / 1000) / p.mur + p.g / 1000) },
    { id: 'fim-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'boundary conditions',
      make(r) {
        const e1 = choose(r, [1, 2, 3]), e2 = choose(r, [4, 5, 6, 8, 10]), t1 = choose(r, [10, 20, 30, 40, 50, 60]), into = r() < 0.5;
        const [ea, eb] = into ? [e1, e2] : [e2, e1], t2 = Math.atan(Math.tan(t1 * deg) * eb / ea) / deg;
        return { q: `An electric field line in a medium with $\\varepsilon_r = ${ea}$ meets a flat boundary with a medium of $\\varepsilon_r = ${eb}$ at $${t1}^\\circ$ to the normal. With no free surface charge, it leaves the boundary at ______ degrees to the normal (two decimal places).`,
          answer: round(t2, 2), tol: 0.02, unit: '°', ea, eb, t1,
          sol: `$E_\\parallel$ and $D_\\perp$ are continuous, so $\\frac{\\tan\\theta_2}{\\tan\\theta_1} = \\frac{\\varepsilon_2}{\\varepsilon_1}$: $\\tan\\theta_2 = ${round(Math.tan(t1 * deg), 4)}\\times\\frac{${eb}}{${ea}} = ${round(Math.tan(t2 * deg), 4)}$, so $\\theta_2 = ${round(t2, 2)}^\\circ$.`,
          trap: 'Field lines bend away from the normal on entering the higher-permittivity side.' };
      },
      verify: (p) => Math.atan(Math.tan(p.t1 * deg) * p.eb / p.ea) / deg },
  ],
};
