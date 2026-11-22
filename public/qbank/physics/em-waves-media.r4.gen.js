// Round 4 extras for em-waves-media: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const fpOf = (n) => Math.sqrt(n * C.e ** 2 / (C.eps0 * C.me)) / (2 * Math.PI); // Hz, n in m^-3

export default {
  items: [
    { id: 'emm-r4-01', type: 'mcq', level: 1, exams: A, sub: 'dielectrics',
      q: R`A light wave travels through a non-magnetic, lossless medium with relative permittivity $\epsilon_r = 4$. Its speed is`,
      options: [R`$c/4$`, R`$c/2$`, R`$2c$`, R`$c/\sqrt2$`],
      answer: 1,
      sol: R`$v = \dfrac1{\sqrt{\mu\epsilon}} = \dfrac{c}{\sqrt{\mu_r\epsilon_r}} = \dfrac{c}{\sqrt4} = \dfrac c2$. The refractive index is $n = \sqrt{\epsilon_r} = 2$.`,
      trap: R`Dividing by $\epsilon_r$ instead of $\sqrt{\epsilon_r}$ gives $c/4$.` },
    { id: 'emm-r4-02', type: 'nat', level: 2, exams: A, sub: 'dielectrics', unit: 'cm',
      q: R`A $600$ MHz radio wave travels through a large block of lossless, non-magnetic plastic with $\epsilon_r = 2.25$. Its wavelength inside the plastic is ______ cm (to one decimal place).`,
      answer: 33.3, tol: 0.2, calc: () => C.c / (600e6 * 1.5) * 100,
      sol: R`The frequency stays $600$ MHz; the speed drops to $c/n$ with $n = \sqrt{2.25} = 1.5$. $\lambda = \dfrac{c}{nf} = \dfrac{3.00\times10^8}{1.5\times6.00\times10^8} = 0.333$ m $= 33.3$ cm, against $50.0$ cm in air.`,
      trap: R`Changing the frequency instead of the wavelength: frequency is fixed by the source.` },
    { id: 'emm-r4-03', type: 'mcq', level: 2, exams: A, sub: 'energy',
      q: R`For a plane wave in a lossless, linear, non-magnetic dielectric of refractive index $n$, the ratio of the electric to the magnetic energy density, $u_E/u_B$, is`,
      options: [R`$n^2$`, R`$1/n^2$`, R`$n$`, R`$1$`],
      answer: 3,
      sol: R`$u_E = \tfrac12\epsilon E^2$ and $u_B = \dfrac{B^2}{2\mu}$. In the wave $B = E/v$ with $v = 1/\sqrt{\mu\epsilon}$, so $u_B = \dfrac{E^2}{2\mu v^2} = \tfrac12\epsilon E^2 = u_E$. The energy is shared equally, as in vacuum; the medium changes $B/E$ to $n/c$ in exactly the way needed.`,
      trap: R`Noticing that $\epsilon = n^2\epsilon_0$ raises $u_E$, but forgetting that $B = nE/c$ raises $u_B$ by the same factor.` },
    { id: 'emm-r4-04', type: 'nat', level: 3, exams: A, sub: 'energy', unit: 'V/m',
      q: R`A beam of intensity $1.0$ kW/m$^2$ travels through glass of refractive index $1.5$ (non-magnetic, lossless). The amplitude of its electric field inside the glass is ______ V/m (to the nearest whole number).`,
      answer: 709, tol: 5, calc: () => Math.sqrt(2000 / (1.5 * C.eps0 * C.c)),
      sol: R`In a medium the time-averaged intensity is $I = \tfrac12\epsilon vE_0^2 = \tfrac12n\epsilon_0cE_0^2$ (since $\epsilon v = n^2\epsilon_0\cdot c/n$). So $E_0 = \sqrt{\dfrac{2I}{n\epsilon_0c}} = \sqrt{\dfrac{2000}{1.5\times8.854\times10^{-12}\times3.00\times10^8}} = 709$ V/m, against $868$ V/m in air for the same intensity.`,
      trap: R`Using the vacuum formula $I = \tfrac12\epsilon_0cE_0^2$ gives $868$ V/m; using $\epsilon = n^2\epsilon_0$ with speed $c$ gives $579$ V/m.` },
    { id: 'emm-r4-05', type: 'msq', level: 3, exams: G, sub: 'complex permittivity', format: 'statements',
      q: R`A linear medium has complex permittivity $\epsilon = \epsilon' + i\epsilon''$ for fields varying as $e^{-i\omega t}$. Which statements are correct?`,
      options: [R`For a passive medium (one that only absorbs), $\epsilon'' > 0$ at every frequency $\omega > 0$.`, R`A conductivity $\sigma$ can be included by adding $\sigma/\omega$ to $\epsilon''$.`, R`The loss tangent is $\epsilon'/\epsilon''$.`, R`A larger loss tangent makes the wave travel faster than in the same medium without loss.`],
      answer: [0, 1],
      sol: R`The time-averaged power absorbed per volume is $\tfrac12\omega\epsilon''|E|^2$, which must be positive in a passive medium. Ampère-Maxwell with $\vec J = \sigma\vec E$ gives $-i\omega\epsilon\vec E + \sigma\vec E = -i\omega(\epsilon + i\sigma/\omega)\vec E$, so $\sigma/\omega$ adds to $\epsilon''$. The loss tangent is $\epsilon''/\epsilon'$ (loss over storage). Loss raises the real part of the wave number ($k = \omega\sqrt{\mu\epsilon}$ grows in size), so the phase velocity falls, not rises.`,
      trap: R`The sign of $\epsilon''$ depends on the time convention: with $e^{+j\omega t}$ (engineering) one writes $\epsilon' - j\epsilon''$ with $\epsilon'' > 0$.` },
    { id: 'emm-r4-06', type: 'mcq', level: 3, exams: G, sub: 'dispersion models',
      q: R`A polar liquid follows the Debye relaxation model, $\epsilon(\omega) = \epsilon_\infty + \dfrac{\epsilon_s - \epsilon_\infty}{1 - i\omega\tau}$. Its dielectric loss $\epsilon''(\omega)$ is largest at`,
      options: [R`$\omega = 1/\tau$`, R`$\omega = 0$`, R`very high frequency, $\omega\tau\to\infty$`, R`$\omega = \epsilon_s/(\epsilon_\infty\tau)$`],
      answer: 0,
      sol: R`Multiply top and bottom by $1 + i\omega\tau$: $\epsilon'' = (\epsilon_s - \epsilon_\infty)\dfrac{\omega\tau}{1 + \omega^2\tau^2}$. The function $x/(1 + x^2)$ peaks at $x = 1$, so the loss is largest at $\omega = 1/\tau$, where it equals $\tfrac12(\epsilon_s - \epsilon_\infty)$. Below that the dipoles follow the field (little loss); far above they cannot turn at all (little loss again). For water near room temperature this peak lies near 20 GHz, which is why microwave ovens (2.45 GHz) heat on its rising side.`,
      trap: R`Expecting the loss to grow without limit with frequency, as for a conductor: relaxation loss falls again once the molecules can no longer follow.` },
    { id: 'emm-r4-07', type: 'nat', level: 4, exams: G, sub: 'plasma', unit: 'MHz',
      q: R`An ionospheric layer (treat it as flat, with no magnetic field and no collisions) has a peak plasma frequency of $9.0$ MHz. A radio wave meets the layer at an angle of incidence of $60^\circ$ from the vertical. The highest frequency that the layer can still turn back to the ground is ______ MHz (to one decimal place).`,
      answer: 18.0, tol: 0.1, calc: () => 9.0 / Math.cos(Math.PI / 3),
      sol: R`In a flat layered medium Snell's law keeps $n\sin\theta$ fixed: $n(z)\sin\theta(z) = \sin\theta_0$. The ray turns back where it travels horizontally, $n = \sin\theta_0$. With $n^2 = 1 - f_p^2/f^2$: $1 - f_p^2/f^2 = \sin^2\theta_0$, so $f = f_p/\cos\theta_0$. The highest frequency that turns back is set by the peak $f_p$: $f = 9.0/\cos60^\circ = 18.0$ MHz (the "secant law"). Oblique paths reflect higher frequencies than vertical ones.`,
      trap: R`Using the vertical condition $f < f_p$ (9.0 MHz) for an oblique ray, or dividing by $\sin\theta_0$.` },
    { id: 'emm-r4-08', type: 'mcq', level: 4, exams: G, sub: 'conductors',
      q: R`For a plane wave inside a good conductor ($\sigma \gg \omega\epsilon$), the ratio of the time-averaged magnetic to electric energy density, $u_B/u_E$, is`,
      options: [R`$1$`, R`$\sqrt{\sigma/\omega\epsilon}$`, R`$\sigma/\omega\epsilon$`, R`$\omega\epsilon/\sigma$`],
      answer: 2,
      sol: R`In a good conductor $|H|/|E| = \sqrt{\sigma/\omega\mu}$. So $\dfrac{u_B}{u_E} = \dfrac{\mu|H|^2}{\epsilon|E|^2} = \dfrac{\mu}{\epsilon}\cdot\dfrac{\sigma}{\omega\mu} = \dfrac{\sigma}{\omega\epsilon} \gg 1$. Almost all the energy is magnetic; for copper at 1 GHz the ratio is about $10^9$.`,
      trap: R`Taking the square root (the ratio of field amplitudes, suitably scaled) instead of the ratio of energies.` },
    { id: 'emm-r4-09', type: 'msq', level: 4, exams: G, sub: 'plasma', format: 'statements',
      q: R`Electromagnetic waves travel along a steady magnetic field $\vec B_0$ through a cold electron plasma (plasma frequency $\omega_p$, electron cyclotron frequency $\omega_c$). Which statements are correct?`,
      options: [R`Without $\vec B_0$ the two circular polarisations travel at the same speed.`, R`Faraday rotation happens because the two circular polarisations have different phase speeds.`, R`The Faraday rotation angle over a fixed path does not depend on the wave frequency.`, R`For $\omega < \omega_c$ the circularly polarised wave that turns with the electrons (the whistler) can travel even when $\omega < \omega_p$.`],
      answer: [0, 1, 3],
      sol: R`Along $\vec B_0$ the circular modes have $n^2 = 1 - \dfrac{\omega_p^2}{\omega(\omega\mp\omega_c)}$. For the mode turning with the electrons and $\omega < \omega_c$, the denominator is negative, so $n^2 > 1$: it propagates whatever $\omega_p$ is. With $\omega_c = 0$ both modes share $n^2 = 1 - \omega_p^2/\omega^2$. A linear wave is the sum of the two circular ones; their different phase speeds rotate its plane. For $\omega \gg \omega_p, \omega_c$ the rotation angle is proportional to $\omega_p^2\omega_c/\omega^2$, i.e. to $\lambda^2$ (the rotation-measure law used in radio astronomy).`,
      trap: R`Assuming the plasma cut-off $\omega_p$ blocks every wave below it: a steady field opens the whistler branch.` },
    { id: 'emm-r4-10', type: 'nat', level: 5, exams: G, sub: 'plasma', unit: '%',
      q: R`Model a metal's conduction electrons as a collisionless free-electron gas, $\epsilon(\omega)/\epsilon_0 = 1 - \omega_p^2/\omega^2$. Light of frequency $\omega = 2\omega_p$ falls normally on its flat surface from vacuum. The percentage of the power reflected is ______ (to two decimal places).`,
      answer: 0.52, tol: 0.01, calc: () => { const n = Math.sqrt(0.75); return 100 * ((1 - n) / (1 + n)) ** 2; },
      sol: R`Above $\omega_p$ the metal is a transparent dielectric with $n = \sqrt{1 - \omega_p^2/\omega^2} = \sqrt{1 - \tfrac14} = 0.866$, a real index below 1. At normal incidence $R = \left(\dfrac{1 - n}{1 + n}\right)^2 = \left(\dfrac{0.134}{1.866}\right)^2 = 5.15\times10^{-3}$, i.e. $0.52\%$. Below $\omega_p$, $n$ is imaginary and $R = 1$: this is why alkali metals turn transparent in the ultraviolet.`,
      trap: R`Expecting a metal to reflect at every frequency: above the plasma frequency the electrons cannot keep up and the metal transmits almost everything.` },
  ],
  gens: [
    { id: 'emm-r4g1', type: 'nat', level: 2, exams: A, sub: 'energy',
      make(r) {
        const I = choose(r, [0.2, 0.5, 1, 1.4, 2, 5, 10]), n = choose(r, [1.33, 1.46, 1.5, 1.7, 2.0, 2.4]);
        const E0 = Math.sqrt(2 * I * 1e3 / (n * C.eps0 * C.c));
        return { q: R`A light beam of intensity $${I}$ kW/m$^2$ travels through a lossless, non-magnetic medium of refractive index $${n}$. The amplitude of its electric field there is ______ V/m (to the nearest whole number).`,
          answer: Math.round(E0), tol: Math.max(1, Math.round(E0 * 0.01)), unit: 'V/m', I, n,
          sol: R`$I = \tfrac12n\epsilon_0cE_0^2$, so $E_0 = \sqrt{\dfrac{2I}{n\epsilon_0c}} = \sqrt{\dfrac{2\times${I * 1e3}}{${n}\times8.854\times10^{-12}\times3.00\times10^8}} = ${Math.round(E0)}$ V/m.`,
          trap: 'In a medium the intensity carries a factor n: the same intensity needs a smaller E.' };
      },
      verify: (p) => Math.sqrt(2 * p.I * 1e3 / (p.n * C.eps0 * C.c)) },
    { id: 'emm-r4g2', type: 'nat', level: 4, exams: G, sub: 'plasma',
      make(r) {
        const m = choose(r, [0.5, 1, 1.5, 2, 3, 5, 8]), th = choose(r, [30, 45, 50, 60, 70, 75]);
        const n = m * 1e11, fp = fpOf(n) / 1e6, f = fp / Math.cos(th * Math.PI / 180);
        return { q: R`An ionospheric layer (flat, no magnetic field, no collisions) has peak electron density $${m}\times10^{11}$ m$^{-3}$. A radio wave meets it at $${th}^\circ$ from the vertical. The highest frequency it can turn back is ______ MHz (to two decimal places).`,
          answer: round(f, 2), tol: Math.max(0.01, round(f * 0.005, 2)), unit: 'MHz', n, th,
          sol: R`$f_p = \dfrac1{2\pi}\sqrt{\dfrac{N_ee^2}{\epsilon_0m_e}} = 8.98\sqrt{N_e}$ Hz $= ${round(fp, 3)}$ MHz. Snell's law in the layered medium turns the ray back where the refractive index falls to $\sin\theta_0$, which gives $f = f_p/\cos\theta_0 = ${round(fp, 3)}/\cos${th}^\circ = ${round(f, 2)}$ MHz.`,
          trap: 'Oblique rays turn back at higher frequencies than vertical ones (secant law).' };
      },
      verify: (p) => fpOf(p.n) / 1e6 / Math.cos(p.th * Math.PI / 180) },
    { id: 'emm-r4g3', type: 'nat', level: 5, exams: G, sub: 'plasma',
      make(r) {
        const k = choose(r, [1.1, 1.2, 1.25, 1.5, 2, 3, 4]);
        const n = Math.sqrt(1 - 1 / (k * k)), Rf = 100 * ((1 - n) / (1 + n)) ** 2;
        return { q: R`A collisionless free-electron metal has $\epsilon/\epsilon_0 = 1 - \omega_p^2/\omega^2$. Light with $\omega = ${k}\,\omega_p$ falls normally on it from vacuum. The percentage of power reflected is ______ (to three decimal places).`,
          answer: round(Rf, 3), tol: Math.max(0.001, round(Rf * 0.01, 3)), unit: '%', k,
          sol: R`$n = \sqrt{1 - 1/${k}^2} = ${round(n, 4)}$. $R = \left(\dfrac{1 - n}{1 + n}\right)^2 = \left(\dfrac{${round(1 - n, 4)}}{${round(1 + n, 4)}}\right)^2 = ${round(Rf / 100, 5)}$, i.e. $${round(Rf, 3)}\%$.`,
          trap: 'Above the plasma frequency the index is real and below 1; the reflection falls fast as ω rises.' };
      },
      verify: (p) => { const n = Math.sqrt(1 - 1 / (p.k * p.k)); return 100 * ((1 - n) / (1 + n)) ** 2; } },
  ],
};
