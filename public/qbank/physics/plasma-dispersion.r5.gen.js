// Round 5 extras for plasma-dispersion: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;
const sci = (x) => x.toExponential().replace(/e\+?(-?\d+)/, '\\times10^{$1}').replace(/^1\\times/, '');
const fpOf =(n) => Math.sqrt(n * C.e * C.e / (C.eps0 * C.me)) / (2 * Math.PI);

export default {
  items: [
    { id: 'netpl-r5-01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency',
      q: R`A laboratory plasma has $1.0\times10^{18}$ free electrons per m³. Its electron plasma frequency $f_p = \omega_p/2\pi$ is ______ GHz (two decimal places).`,
      answer: 8.98, tol: 0.03, unit: 'GHz', calc: () => fpOf(1e18) / 1e9,
      sol: R`$\omega_p = \sqrt{\frac{ne^2}{\varepsilon_0m_e}} = \sqrt{\frac{10^{18}\times(1.602\times10^{-19})^2}{8.854\times10^{-12}\times9.109\times10^{-31}}} = 5.64\times10^{10}$ rad/s. So $f_p = 8.98\times10^9$ Hz (the handy rule $f_p\approx8.98\sqrt{n}$ Hz with $n$ in m⁻³).`,
      trap: R`Quoting $\omega_p$ in GHz (56.4) without dividing by $2\pi$.` },
    { id: 'netpl-r5-02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      q: R`A transverse wave travels through a cold, unmagnetised plasma at angular frequency $\omega = 2\omega_p$. Its group velocity is`,
      options: [R`$0.50c$`, R`$0.87c$`, R`$1.15c$`, R`$c$`], answer: 1,
      sol: R`$\omega^2 = \omega_p^2 + c^2k^2$ gives $v_g = \frac{d\omega}{dk} = \frac{c^2k}{\omega} = c\sqrt{1 - \omega_p^2/\omega^2} = c\sqrt{1 - \tfrac14} = 0.866c$. The phase velocity is $c^2/v_g = 1.15c$.`,
      trap: R`Giving the phase velocity ($1.15c$), which exceeds $c$.` },
    { id: 'netpl-r5-03', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'debye shielding', format: 'statements',
      q: R`Which statements about the Debye length $\lambda_D$ of an electron plasma are true?`,
      options: [R`$\lambda_D = \sqrt{\dfrac{\varepsilon_0k_BT}{ne^2}}$`, R`It grows as the electron temperature rises`, R`An ionised gas behaves as a plasma only if many electrons lie within a sphere of radius $\lambda_D$`, R`It shrinks as the gas becomes more dilute`],
      answer: [0, 1, 2],
      sol: R`Balancing thermal energy against electrostatic screening gives $\lambda_D = \sqrt{\varepsilon_0k_BT/ne^2}$. Hotter electrons resist being bunched, so screening reaches further: $\lambda_D\propto\sqrt T$. Fewer electrons screen less well, so $\lambda_D\propto1/\sqrt n$ grows as the gas becomes dilute. Collective (plasma) behaviour needs $n\lambda_D^3\gg1$.`,
      trap: R`Reversing the density dependence; dilute plasmas have long Debye lengths.` },
    { id: 'netpl-r5-04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'debye shielding',
      q: R`A plasma has electron temperature $1.0\times10^4$ K and density $1.0\times10^{16}$ m⁻³. Its Debye length is ______ $\mu$m (one decimal place).`,
      answer: 69, tol: 0.5, unit: 'μm', calc: () => Math.sqrt(C.eps0 * C.kB * 1e4 / (1e16 * C.e * C.e)) * 1e6,
      sol: R`$\lambda_D = \sqrt{\frac{\varepsilon_0k_BT}{ne^2}} = \sqrt{\frac{8.854\times10^{-12}\times1.381\times10^{-23}\times10^4}{10^{16}\times(1.602\times10^{-19})^2}} = \sqrt{\frac{1.223\times10^{-30}}{2.566\times10^{-22}}} = 6.90\times10^{-5}$ m.`,
      trap: R`Leaving out $k_B$ or putting the temperature in eV without converting.` },
    { id: 'netpl-r5-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'evanescent waves', format: 'limiting case',
      q: R`A wave of frequency $\omega$ well below $\omega_p$ hits a collisionless plasma. Inside, its field decays as $e^{-x/\delta}$. In the limit $\omega\ll\omega_p$, $\delta$ tends to`,
      options: [R`zero`, R`$c/\omega$`, R`$\sqrt{2/\mu_0\sigma\omega}$, the ordinary skin depth`, R`$c/\omega_p$`], answer: 3,
      sol: R`From $c^2k^2 = \omega^2 - \omega_p^2 < 0$, $k = i\kappa$ with $\kappa = \frac{\sqrt{\omega_p^2 - \omega^2}}{c}$. So $\delta = \frac{c}{\sqrt{\omega_p^2 - \omega^2}}\to\frac{c}{\omega_p}$, independent of frequency (the collisionless skin depth). The formula with $\sigma$ applies to a collision-dominated conductor.`,
      trap: R`Using the ohmic skin depth for a collisionless plasma.` },
    { id: 'netpl-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pulsar dispersion',
      q: R`Radio pulses from a pulsar cross interstellar plasma with dispersion measure $50$ pc cm⁻³. The arrival delay at frequency $f$ is $\Delta t = 4.15\ {\rm ms}\times{\rm DM}/f_{\rm GHz}^2$ (DM in pc cm⁻³). The $0.40$ GHz pulse arrives later than the $0.80$ GHz pulse by ______ ms (nearest whole number).`,
      answer: 973, tol: 2, unit: 'ms', calc: () => 4.15 * 50 * (1 / 0.16 - 1 / 0.64),
      sol: R`For $\omega\gg\omega_p$, $v_g\approx c\left(1 - \frac{\omega_p^2}{2\omega^2}\right)$, so the extra travel time grows as $1/f^2$. Difference: $4.15\times50\times\left(\frac1{0.40^2} - \frac1{0.80^2}\right) = 207.5\times(6.25 - 1.5625) = 973$ ms. Lower frequencies arrive later.`,
      trap: R`Using $1/f$ instead of $1/f^2$.` },
    { id: 'netpl-r5-07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'plasma oscillations',
      q: R`When the electron temperature is included, longitudinal electron plasma waves obey (with $v_{th}^2 = k_BT_e/m_e$)`,
      options: [R`$\omega^2 = \omega_p^2 + 3k^2v_{th}^2$`, R`$\omega = \omega_p$ for every $k$`, R`$\omega^2 = \omega_p^2 + c^2k^2$`, R`$\omega = kv_{th}$`], answer: 0,
      sol: R`In a cold plasma the oscillation frequency is $\omega_p$ for every wavelength, so nothing propagates. Pressure adds a restoring term: the Bohm-Gross relation $\omega^2 = \omega_p^2 + 3k^2v_{th}^2$ (the 3 is $\gamma$ for one-dimensional compressions). $\omega^2 = \omega_p^2 + c^2k^2$ is for transverse electromagnetic waves.`,
      trap: R`Confusing the longitudinal Bohm-Gross relation with the transverse light-wave relation.` },
    { id: 'netpl-r5-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cutoff',
      q: R`$2.45$ GHz microwaves are used to drive a plasma. They are reflected once the electron density reaches the cutoff density, which is ______ $\times10^{16}$ m⁻³ (two decimal places).`,
      answer: 7.45, tol: 0.03, unit: '10¹⁶ m⁻³', calc: () => C.eps0 * C.me * (2 * Math.PI * 2.45e9) ** 2 / (C.e * C.e) / 1e16,
      sol: R`Cutoff is where $\omega_p = \omega$: $n_c = \frac{\varepsilon_0m_e\omega^2}{e^2} = \frac{8.854\times10^{-12}\times9.109\times10^{-31}\times(1.539\times10^{10})^2}{(1.602\times10^{-19})^2} = 7.45\times10^{16}$ m⁻³.`,
      trap: R`Using $f$ instead of $\omega = 2\pi f$, which is $4\pi^2$ times too small.` },
    { id: 'netpl-r5-09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase and group velocity', format: 'which is NOT',
      q: R`For electromagnetic waves above the plasma frequency in a cold plasma, which statement is NOT true?`,
      options: [R`The refractive index is less than 1`, R`The phase velocity exceeds $c$`, R`A signal (a pulse) travels at the phase velocity`, R`The product of phase and group velocities is $c^2$`], answer: 2,
      sol: R`$n = \sqrt{1 - \omega_p^2/\omega^2} < 1$, so $v_p = c/n > c$. From $\omega^2 = \omega_p^2 + c^2k^2$, $v_pv_g = \frac\omega k\cdot\frac{c^2k}{\omega} = c^2$, so $v_g < c$. Energy and information travel at the group velocity, not the phase velocity.`,
      trap: R`Worrying that $v_p > c$ breaks relativity; no signal moves at $v_p$.` },
    { id: 'netpl-r5-10', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'drude model', format: 'statements',
      q: R`In the Drude model of a metal (time dependence $e^{-i\omega t}$, collision time $\tau$), which statements are true?`,
      options: [R`The plasma frequency is inversely proportional to the electron mass`, R`The ac conductivity is $\sigma(\omega) = \dfrac{\sigma_0}{1 - i\omega\tau}$`, R`For $\omega\tau\ll1$ the metal responds like a dc conductor with $\sigma\approx\sigma_0$`, R`Alkali metals become transparent to ultraviolet light above their plasma frequency`],
      answer: [1, 2, 3],
      sol: R`$m\dot v = -eE - mv/\tau$ with $E\propto e^{-i\omega t}$ gives $v = \frac{-e\tau E/m}{1 - i\omega\tau}$, so $\sigma = \frac{ne^2\tau/m}{1 - i\omega\tau}$, reducing to $\sigma_0$ when $\omega\tau\ll1$. Above $\omega_p$ the permittivity is positive and waves propagate, which is why alkali metals pass UV. $\omega_p = \sqrt{ne^2/\varepsilon_0m}$ goes as $1/\sqrt m$, not $1/m$.`,
      trap: R`Dropping the square root in $\omega_p\propto m^{-1/2}$.` },
  ],
  gens: [
    { id: 'netpl-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency',
      make(r) {
        const m = int(r, 1, 9), e = int(r, 10, 20), n = m * 10 ** e, f = fpOf(n) / 1e6;
        return { q: `A plasma has $${m}\\times10^{${e}}$ free electrons per m³. Its plasma frequency $f_p$ is ______ MHz (three significant figures).`,
          answer: +f.toPrecision(3), tol: +(f * 0.005).toPrecision(2), unit: 'MHz', m, e,
          sol: `$f_p = \\frac{1}{2\\pi}\\sqrt{\\frac{ne^2}{\\varepsilon_0m_e}}\\approx8.98\\sqrt{n}$ Hz $= 8.98\\times\\sqrt{${m}\\times10^{${e}}}$ Hz $= ${+f.toPrecision(3)}$ MHz.`,
          trap: 'Divide $\\omega_p$ by $2\\pi$ to get $f_p$.' };
      },
      verify: (p) => fpOf(p.m * 10 ** p.e) / 1e6 },
    { id: 'netpl-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'debye shielding',
      make(r) {
        const [name, T, ne] = choose(r, [['a glow discharge', 2e4, 1e16], ['the solar wind', 1e5, 5e6], ['the ionosphere', 1e3, 1e12], ['a fusion plasma', 1e8, 1e20], ['a flame', 2500, 1e14]]);
        const tf = choose(r, [0.5, 1, 2]), Tx = T * tf, L = Math.sqrt(C.eps0 * C.kB * Tx / (ne * C.e * C.e));
        const [unit, sc] = L < 1e-3 ? ['μm', 1e6] : ['m', 1];
        const ans = L * sc;
        return { q: `Model ${name} as electrons at $${sci(Tx)}$ K with density $${sci(ne)}$ m⁻³. Its Debye length is ______ ${unit} (three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.005).toPrecision(2), unit, Tx, ne, sc,
          sol: `$\\lambda_D = \\sqrt{\\frac{\\varepsilon_0k_BT}{ne^2}} = \\sqrt{\\frac{8.854\\times10^{-12}\\times1.381\\times10^{-23}\\times${sci(Tx)}}{${sci(ne)}\\times(1.602\\times10^{-19})^2}} = ${+ans.toPrecision(3)}$ ${unit}.`,
          trap: '$\\lambda_D$ grows with temperature and falls with density, both as square roots.' };
      },
      verify: (p) => Math.sqrt(C.eps0 * C.kB * p.Tx / (p.ne * C.e * C.e)) * p.sc },
    { id: 'netpl-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'group velocity',
      make(r) {
        const fp = choose(r, [1, 2, 3, 5, 6, 9]), ratio = choose(r, [1.2, 1.5, 2, 2.5, 3, 4]), f = fp * ratio, ph = r() < 0.5;
        const vg = Math.sqrt(1 - 1 / (ratio * ratio)), ans = ph ? 1 / vg : vg;
        return { q: `Waves of frequency $${round(f, 2)}$ MHz travel through a cold, unmagnetised plasma with $f_p = ${fp}$ MHz. Their ${ph ? 'phase' : 'group'} velocity is ______ $c$ (three decimal places).`,
          answer: round(ans, 3), tol: 0.002, ratio, ph,
          sol: `$v_g = c\\sqrt{1 - f_p^2/f^2} = c\\sqrt{1 - 1/${ratio}^2} = ${round(vg, 4)}c$${ph ? ` and $v_p = c^2/v_g = ${round(1 / vg, 3)}c$` : ''}.`,
          trap: 'Phase velocity exceeds $c$, group velocity is below it; their product is $c^2$.' };
      },
      verify: (p) => { const vg = Math.sqrt(1 - 1 / (p.ratio * p.ratio)); return p.ph ? 1 / vg : vg; } },
  ],
};
