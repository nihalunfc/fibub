// Round 4 extras for plasma-dispersion: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'netpl-r4-01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'magnetised plasma',
      q: R`In the Earth's field of about $50\ \mu$T, the electron cyclotron frequency $f_c = eB/(2\pi m_e)$ is ______ MHz (two decimal places).`,
      answer: 1.4, tol: 0.01, unit: 'MHz', calc: () => C.e * 50e-6 / (2 * Math.PI * C.me) / 1e6,
      sol: R`$f_c = \frac{eB}{2\pi m_e} = \frac{1.602\times10^{-19}\times5.0\times10^{-5}}{2\pi\times9.109\times10^{-31}} = 1.40\times10^6$ Hz (about $28$ GHz per tesla). It lies in the same range as ionospheric plasma frequencies, which is why the Earth's field matters for radio propagation.`,
      trap: R`Giving the angular frequency $eB/m$ ($8.8\times10^6$ rad/s) instead of $f$.` },
    { id: 'netpl-r4-02', type: 'nat', level: 5, exams: ['net'], sub: 'whistlers',
      q: R`In the magnetosphere, take $f_p = 1.0$ MHz and $f_c = 500$ kHz. For whistler waves ($f\ll f_c$, $f_p^2\gg ff_c$) the refractive index is $n^2\approx\dfrac{f_p^2}{ff_c}$. The group velocity of a $5.0$ kHz whistler is ______ $\times10^7$ m/s (two decimal places).`,
      answer: 3, tol: 0.03, unit: '×10⁷ m/s', calc: () => 2 * C.c * Math.sqrt(5e3 * 5e5) / 1e6 / 1e7,
      sol: R`$k = \frac{\omega n}{c} = \frac{\omega_p}{c}\sqrt{\frac{\omega}{\omega_c}}$. Then $\frac{dk}{d\omega} = \frac{\omega_p}{2c\sqrt{\omega\omega_c}}$ and $v_g = \frac{2c\sqrt{\omega\omega_c}}{\omega_p} = \frac{2c\sqrt{ff_c}}{f_p} = \frac{2\times3.00\times10^8\times\sqrt{5\times10^3\times5\times10^5}}{10^6} = 3.00\times10^7$ m/s. Because $v_g\propto\sqrt f$, higher tones arrive first: the falling whistle heard after lightning.`,
      trap: R`Using the phase velocity $c/n$, which is half the group velocity here.` },
    { id: 'netpl-r4-03', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dielectric function',
      q: R`In the Lorentz oscillator model of a dielectric, $n^2 = 1 + \dfrac{\omega_p^2}{\omega_0^2 - \omega^2}$ (no damping). If $\omega_p = \omega_0$, the refractive index at $\omega = \omega_0/2$ is ______ (three decimal places).`,
      answer: 1.528, tol: 0.002, calc: () => Math.sqrt(1 + 1 / (1 - 0.25)),
      sol: R`$n^2 = 1 + \frac{\omega_0^2}{\omega_0^2 - \omega_0^2/4} = 1 + \frac43 = \frac73$, so $n = 1.528$. Below the resonance $n > 1$ and rises with $\omega$ (normal dispersion). Far above it, $n^2\to1 - \omega_p^2/\omega^2$: the bound electrons respond like a free-electron plasma.`,
      trap: R`Forgetting the square root: $\frac73$ is $n^2$.` },
    { id: 'netpl-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'drude model',
      q: R`Copper has $8.5\times10^{28}$ free electrons per m³ and a collision time of $2.5\times10^{-14}$ s. The Drude DC conductivity $\sigma_0 = ne^2\tau/m_e$ is ______ $\times10^7$ S/m (two decimal places).`,
      answer: 5.99, tol: 0.03, unit: '×10⁷ S/m', calc: () => 8.5e28 * C.e ** 2 * 2.5e-14 / C.me / 1e7,
      sol: R`$\sigma_0 = \frac{8.5\times10^{28}\times(1.602\times10^{-19})^2\times2.5\times10^{-14}}{9.109\times10^{-31}} = 5.99\times10^7$ S/m, close to the measured $5.96\times10^7$ S/m. In the plasma language, $\sigma_0 = \varepsilon_0\omega_p^2\tau$.`,
      trap: R`Using $e$ instead of $e^2$; the charge enters once in the force and once in the current.` },
    { id: 'netpl-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phase and group velocity',
      q: R`A transverse wave in a cold plasma has phase velocity $1.25c$. Its frequency is ______ times the plasma frequency (three decimal places).`,
      answer: 1.667, tol: 0.002, calc: () => 1 / Math.sqrt(1 - 0.64),
      sol: R`$n = c/v_p = 0.8$ and $n^2 = 1 - \frac{\omega_p^2}{\omega^2}$, so $\frac{\omega_p^2}{\omega^2} = 1 - 0.64 = 0.36$ and $\frac{\omega}{\omega_p} = \frac{1}{0.6} = 1.667$. (Its group velocity is $c^2/v_p = 0.8c$.)`,
      trap: R`Setting $n = 1.25$; the phase velocity exceeds $c$, so $n < 1$.` },
    { id: 'netpl-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'metals',
      q: R`Surface plasmons can travel along a flat boundary between a free-electron metal ($\varepsilon_r = 1 - \omega_p^2/\omega^2$) and vacuum. At short wavelengths their frequency approaches`,
      options: [R`$\omega_p$`, R`$\omega_p/\sqrt2$`, R`$\omega_p/\sqrt3$`, R`$\sqrt2\,\omega_p$`], answer: 1,
      sol: R`A wave bound to a flat surface between media $\varepsilon_1$ and $\varepsilon_2$ has $k^2 = \frac{\omega^2}{c^2}\frac{\varepsilon_1\varepsilon_2}{\varepsilon_1 + \varepsilon_2}$; $k\to\infty$ where $\varepsilon_{\rm metal} = -1$. Then $1 - \frac{\omega_p^2}{\omega^2} = -1$, i.e. $\omega = \frac{\omega_p}{\sqrt2}$. (A small sphere instead needs $\varepsilon = -2$, giving $\omega_p/\sqrt3$.)`,
      trap: R`Confusing the flat-surface condition ($\varepsilon = -1$) with the bulk ($\varepsilon = 0$) or sphere ($\varepsilon = -2$) conditions.` },
    { id: 'netpl-r4-07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'debye screening',
      q: R`A plasma's temperature is doubled while its electron density is made four times larger. Its Debye length`,
      options: [R`doubles`, R`stays the same`, R`becomes $1/\sqrt2$ of its old value`, R`halves`], answer: 2,
      sol: R`$\lambda_D = \sqrt{\frac{\varepsilon_0k_BT}{ne^2}}\propto\sqrt{\frac Tn}$. The ratio $T/n$ becomes $\frac{2}{4} = \frac12$ of its old value, so $\lambda_D$ is multiplied by $\frac{1}{\sqrt2}$.`,
      trap: R`Forgetting the square root (giving "halves").` },
    { id: 'netpl-r4-08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dielectric function',
      q: R`Near an absorption line of a dielectric, in the region of anomalous dispersion,`,
      options: [R`the refractive index rises with frequency and absorption is negligible`, R`the group velocity always equals the phase velocity`, R`there is no absorption at all`, R`the refractive index falls as the frequency rises, and absorption is strong`], answer: 3,
      sol: R`In the Lorentz model with damping, the real part of $n$ rises with $\omega$ away from the resonance (normal dispersion) but falls across the narrow band around $\omega_0$, which is exactly where the imaginary part, and so the absorption, peaks. There the group velocity can even exceed $c$ or turn negative; the pulse is strongly absorbed and reshaped, so no signal outruns light.`,
      trap: R`Expecting $n$ to rise with frequency everywhere.` },
    { id: 'netpl-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dielectric function',
      q: R`For X-rays (frequency far above every electronic resonance), the refractive index of glass is`,
      options: [R`slightly less than 1`, R`slightly greater than 1`, R`about 1.5, as for visible light`, R`exactly zero`], answer: 0,
      sol: R`Far above all resonances the electrons respond as if free: $n^2\approx1 - \frac{\omega_p^2}{\omega^2}$, so $n\approx1 - \frac{\omega_p^2}{2\omega^2}$, smaller than 1 by about $10^{-6}$ for hard X-rays. That is why X-rays can be totally reflected from glass at grazing incidence (coming from vacuum), and why X-ray lenses must be concave to focus.`,
      trap: R`Assuming every transparent material has $n > 1$ at every frequency.` },
    { id: 'netpl-r4-10', type: 'mcq', level: 5, exams: ['net'], sub: 'dielectric function',
      q: R`The Kramers-Kronig relations, which tie the real part of $\varepsilon(\omega)$ to an integral over its imaginary part (absorption), follow from`,
      options: [R`energy conservation`, R`causality: the polarisation cannot respond before the field is applied`, R`time-reversal symmetry`, R`the medium being isotropic`], answer: 1,
      sol: R`If the response $P(t) = \varepsilon_0\int_0^\infty\chi(\tau)E(t - \tau)d\tau$ depends only on past fields, $\chi(\omega)$ is analytic in the upper half of the complex $\omega$ plane (and falls off at large $|\omega|$). Cauchy's theorem then links its real and imaginary parts. Any medium that disperses must therefore absorb somewhere, and vice versa.`,
      trap: R`Attributing them to energy conservation; they hold for any causal linear response, lossy or not.` },
    { id: 'netpl-r4-11', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'phase and group velocity', format: 'statements',
      q: R`Which statements about phase and group velocity are true?`,
      options: [R`$v_g = v_p - \lambda\dfrac{dv_p}{d\lambda}$`, R`For transverse waves in a cold plasma, $v_g < c < v_p$`, R`In a region of anomalous dispersion, $v_g$ can exceed $c$ without breaking causality`, R`For every kind of wave, $v_g\le v_p$`],
      answer: [0, 1, 2],
      sol: R`With $\omega = kv_p$ and $k = 2\pi/\lambda$: $v_g = \frac{d\omega}{dk} = v_p + k\frac{dv_p}{dk} = v_p - \lambda\frac{dv_p}{d\lambda}$. In a plasma $v_pv_g = c^2$ with $v_p > c$. Near absorption lines $v_g$ loses its meaning as a signal speed (the front still travels at $c$). And $v_g > v_p$ is common: capillary ripples have $v_g = \frac32v_p$.`,
      trap: R`Generalising "group slower than phase" from light in glass to all waves.` },
    { id: 'netpl-r4-12', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'ionosphere', format: 'statements',
      q: R`Which statements about the ionosphere and radio waves are true?`,
      options: [R`In daytime, collisions in the lower (D) layer absorb medium-wave signals, which is one reason distant AM stations fade by day`, R`Short-wave signals below the maximum usable frequency can hop beyond the horizon by reflection`, R`Satellite links use GHz frequencies, far above the ionosphere's plasma frequency, so the signals pass through`, R`The ionosphere reflects visible light from the ground back down`],
      answer: [0, 1, 2],
      sol: R`The D layer is dense with neutral gas, so electrons driven by the wave collide often and turn its energy into heat; it largely vanishes at night. Waves are reflected where $f\le f_p\sec\theta$, which lets HF signals skip around the globe. Ionospheric $f_p$ is at most about 10 to 15 MHz, so GHz and visible light (about $5\times10^{14}$ Hz) go straight through; it only slightly delays GHz signals.`,
      trap: R`Thinking the ionosphere reflects everything; only frequencies below the (angle-corrected) plasma frequency come back.` },
  ],
  gens: [
    { id: 'netpl-r4g1', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'magnetised plasma',
      make(r) {
        const ion = r() < 0.4, B = ion ? choose(r, [0.5, 1, 2, 3, 5]) : choose(r, [1e-5, 3e-5, 5e-5, 0.01, 0.05, 0.1, 0.875]);
        const m = ion ? C.mp : C.me, f = C.e * B / (2 * Math.PI * m) / 1e6;
        const Btex = B < 0.001 ? `${round(B * 1e6, 2)}\\ \\mu\\text{T}` : `${B}\\ \\text{T}`;
        return { q: `The ${ion ? 'proton' : 'electron'} cyclotron frequency in a field of $${Btex}$ is ______ MHz (three significant figures).`,
          answer: +f.toPrecision(3), tol: +(f * 0.005).toPrecision(2), unit: 'MHz', B, ion,
          sol: `$f_c = \\frac{eB}{2\\pi m} = \\frac{1.602\\times10^{-19}\\times${B}}{2\\pi\\times${ion ? '1.673\\times10^{-27}' : '9.109\\times10^{-31}'}} = ${+f.toPrecision(3)}$ MHz.`,
          trap: ion ? 'Use the proton mass; ion cyclotron frequencies are 1836 times lower than electron ones.' : 'Divide by $2\\pi$ to get $f$ from $\\omega$.' };
      },
      verify: (p) => C.e * p.B / (2 * Math.PI * (p.ion ? C.mp : C.me)) / 1e6 },
    { id: 'netpl-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dielectric function',
      make(r) {
        const a = choose(r, [0.5, 0.8, 1, 1.2, 1.5]), x = choose(r, [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
        const n = Math.sqrt(1 + a * a / (1 - x * x));
        return { q: `In the undamped Lorentz model, $n^2 = 1 + \\dfrac{\\omega_p^2}{\\omega_0^2 - \\omega^2}$. With $\\omega_p = ${a}\\,\\omega_0$, the refractive index at $\\omega = ${x}\\,\\omega_0$ is ______ (three decimal places).`,
          answer: round(n, 3), tol: 0.002, a, x,
          sol: `$n^2 = 1 + \\frac{${a}^2}{1 - ${x}^2} = 1 + \\frac{${round(a * a, 4)}}{${round(1 - x * x, 4)}} = ${round(n * n, 4)}$, so $n = ${round(n, 3)}$.`,
          trap: 'Work in units of $\\omega_0$ and take the square root at the end.' };
      },
      verify: (p) => Math.sqrt(1 + p.a * p.a / (1 - p.x * p.x)) },
    { id: 'netpl-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'drude model',
      make(r) {
        const [metal, n28] = choose(r, [['copper', 8.5], ['silver', 5.86], ['gold', 5.9], ['aluminium', 18.1], ['sodium', 2.65]]);
        const tau = choose(r, [0.5, 1, 2, 2.5, 4]) * 1e-14, inv = r() < 0.5;
        const n = n28 * 1e28, s = n * C.e ** 2 * tau / C.me;
        if (inv) {
          const s7 = round(s / 1e7, 2), t = s7 * 1e7 * C.me / (n * C.e ** 2) * 1e14;
          return { q: `${metal[0].toUpperCase() + metal.slice(1)} has $${n28}\\times10^{28}$ free electrons per m³ and conductivity $${s7}\\times10^7$ S/m. In the Drude model its collision time is ______ $\\times10^{-14}$ s (three significant figures).`,
            answer: +t.toPrecision(3), tol: +(t * 0.006).toPrecision(2), unit: '×10⁻¹⁴ s', n28, s7, inv,
            sol: `$\\tau = \\frac{m_e\\sigma_0}{ne^2} = \\frac{9.109\\times10^{-31}\\times${s7}\\times10^7}{${n28}\\times10^{28}\\times(1.602\\times10^{-19})^2} = ${+t.toPrecision(3)}\\times10^{-14}$ s.`,
            trap: 'The charge appears squared in $\\sigma_0 = ne^2\\tau/m$.' };
        }
        return { q: `${metal[0].toUpperCase() + metal.slice(1)} has $${n28}\\times10^{28}$ free electrons per m³; take a collision time of $${tau * 1e14}\\times10^{-14}$ s. Its Drude DC conductivity is ______ $\\times10^7$ S/m (three significant figures).`,
          answer: +(s / 1e7).toPrecision(3), tol: +(s / 1e7 * 0.006).toPrecision(2), unit: '×10⁷ S/m', n28, tau, inv,
          sol: `$\\sigma_0 = \\frac{ne^2\\tau}{m_e} = \\frac{${n28}\\times10^{28}\\times(1.602\\times10^{-19})^2\\times${tau * 1e14}\\times10^{-14}}{9.109\\times10^{-31}} = ${+(s / 1e7).toPrecision(3)}\\times10^7$ S/m.`,
          trap: 'The charge appears squared in $\\sigma_0 = ne^2\\tau/m$.' };
      },
      verify: (p) => (p.inv ? p.s7 * 1e7 * C.me / (p.n28 * 1e28 * C.e ** 2) * 1e14 : p.n28 * 1e28 * C.e ** 2 * p.tau / C.me / 1e7) },
  ],
};
