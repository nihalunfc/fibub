// Round 4 extras for diffraction: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const sinc2 = (b) => (b === 0 ? 1 : (Math.sin(b) / b) ** 2);

export default {
  items: [
    { id: 'dfr-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'basics',
      q: R`You can hear someone talking round the corner of a doorway but cannot see them. The main reason is that`,
      options: ['sound wavelengths (about a metre) are comparable to the doorway, while light wavelengths are far smaller', 'sound travels more slowly than light', 'light is a transverse wave and sound is longitudinal', 'sound reflects off walls but light does not'], answer: 0,
      sol: R`A wave spreads appreciably after passing an opening of width $a$ when $\lambda/a$ is not tiny: the spreading angle is about $\lambda/a$. Speech has $\lambda$ of tens of centimetres to metres, similar to a doorway, so it bends round strongly. Light has $\lambda \approx 0.5$ μm, so its spreading angle at a doorway is about $10^{-6}$ rad.`,
      trap: R`Reflection off walls helps a little, but the key is the ratio of wavelength to opening.` },
    { id: 'dfr-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'single slit',
      q: R`A single-slit Fraunhofer experiment (slit, lenses and screen) is moved from air into water ($n = 1.33$), with the same light source. The central bright band`,
      options: ['gets wider by a factor 1.33', 'is unchanged, since the slit is the same', 'disappears', 'gets narrower by a factor 1.33'], answer: 3,
      sol: R`In water the wavelength is $\lambda/n$ (the frequency stays the same). The first minima are at $\sin\theta = \lambda'/a = \lambda/(na)$, so all angles shrink by about $1/n$ and the central band narrows by the factor 1.33.`,
      trap: R`The frequency is set by the source; it is the wavelength that changes in a medium.` },
    { id: 'dfr-r4-03', type: 'nat', level: 3, exams: ['jam'], sub: 'circular aperture',
      q: R`A radar dish 2.0 m across sends out microwaves of wavelength 3.0 cm. Taking the beam's edge at the first dark ring of the Airy pattern, the diameter of the beam 10 km away is about ______ m (to the nearest metre).`,
      answer: 366, tol: 2, unit: 'm', calc: () => 2 * 1e4 * ((1.22 * 0.03) / 2),
      sol: R`For a circular aperture of diameter $D$ the first dark ring is at $\theta = 1.22\lambda/D = 1.22\times0.03/2 = 0.0183$ rad. At 10 km the beam's radius is $10^4\times0.0183 = 183$ m, so its diameter is about 366 m. To make a narrower beam you need a bigger dish or a shorter wavelength.`,
      trap: R`$1.22\lambda/D$ is the angle to the edge (a radius); the diameter is twice the radius.` },
    { id: 'dfr-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'grating', format: 'statements',
      q: R`White light is spread into a spectrum (a) by a plane transmission grating and (b) by a glass prism. Which statements are correct?`,
      options: ['In the grating spectrum, red is turned through a larger angle than violet', 'In the prism spectrum, violet is turned through a larger angle than red', 'The grating gives several spectra (orders) on each side, the prism only one', 'The grating spreads the colours by the same angle in every order'], answer: [0, 1, 2],
      sol: R`Grating: $d\sin\theta = m\lambda$, so longer wavelengths go out at larger angles. Prism: glass has a larger index for violet (normal dispersion), so violet is bent more. A grating gives orders $m = \pm1, \pm2, \dots$; a prism gives a single spectrum. The angular dispersion $\dfrac{d\theta}{d\lambda} = \dfrac{m}{d\cos\theta}$ grows with the order.`,
      trap: R`Grating and prism spectra run in opposite colour orders.` },
    { id: 'dfr-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'resolving power',
      q: R`A plane grating of total ruled width $W$ is used at normal incidence. Whatever its line spacing and whatever order is used, its resolving power $\lambda/\Delta\lambda$ at wavelength $\lambda$ can never exceed`,
      options: [R`$\lambda/W$`, R`$N$, the number of lines`, R`$W/\lambda$`, R`$2W/\lambda$`], answer: 2,
      sol: R`$\lambda/\Delta\lambda = mN$. The order is limited by $\sin\theta = m\lambda/d \le 1$, so $m \le d/\lambda$. Hence $mN \le Nd/\lambda = W/\lambda$. A 5 cm grating at 500 nm can never beat $10^5$, however it is ruled; at grazing incidence and grazing emergence the limit would be $2W/\lambda$, but not at normal incidence.`,
      trap: R`$N$ alone is the first-order value; higher orders do better, up to $W/\lambda$.` },
    { id: 'dfr-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'resolving power',
      q: R`The red Balmer line of hydrogen is at 656.28 nm and that of deuterium at 656.10 nm. To resolve them in the first order of a grating, the grating must have at least ______ illuminated lines (to the nearest line).`,
      answer: 3646, tol: 2, calc: () => ((656.28 + 656.1) / 2) / (656.28 - 656.1),
      sol: R`Resolving power needed: $\dfrac{\lambda}{\Delta\lambda} = \dfrac{656.19}{0.18} = 3646$. In first order $\lambda/\Delta\lambda = N$, so at least about 3646 lines must be lit (half that in the second order). This is how deuterium was first identified, in 1931.`,
      trap: R`Use the line separation (0.18 nm), not either wavelength alone, in the denominator.` },
    { id: 'dfr-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'double slit',
      q: R`A double slit has slits 0.10 mm wide with centres 0.50 mm apart. The intensity of the second-order interference maximum, as a fraction of the central maximum, is ______ (three decimal places).`,
      answer: 0.573, tol: 0.002, calc: () => sinc2((2 * Math.PI * 0.1) / 0.5),
      sol: R`$I = I_0\cos^2\alpha\left(\dfrac{\sin\beta}{\beta}\right)^2$ with $\alpha = \pi d\sin\theta/\lambda$ and $\beta = \pi a\sin\theta/\lambda$. At the second order $d\sin\theta = 2\lambda$, so $\cos^2\alpha = 1$ and $\beta = 2\pi a/d = 2\pi/5 = 1.257$. $\left(\dfrac{\sin1.257}{1.257}\right)^2 = (0.951/1.257)^2 = 0.573$.`,
      trap: R`All interference maxima would be equally bright without the single-slit envelope; the envelope cuts the second order to 57%.` },
    { id: 'dfr-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'single slit',
      q: R`A slit of width $a$ is lit normally by a plane wave. A thin transparent plate covers exactly one half of the slit (one side of its centre line) and delays the light there by half a wavelength. The Fraunhofer pattern now has`,
      options: ['the usual pattern, with the central maximum unchanged', 'zero intensity straight ahead, with two equal bright lobes on either side', 'a central maximum twice as bright as before', 'the pattern of a single slit of width $a/2$'], answer: 1,
      sol: R`Straight ahead, the two halves send equal amplitudes, now in antiphase: they cancel exactly, so $\theta = 0$ is dark. At angle $\theta$ the field is $\propto\int_{-a/2}^0e^{ikx\sin\theta}dx - \int_0^{a/2}e^{ikx\sin\theta}dx$, which is odd in $\sin\theta$ and gives intensity $\propto\dfrac{\sin^4(\beta/2)}{(\beta/2)^2}$ with $\beta = \pi a\sin\theta/\lambda$: two equal lobes, peaking near $\beta \approx 2.3$.`,
      trap: R`A phase change can turn the brightest point into a dark one even though no light is blocked.` },
    { id: 'dfr-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'zone plate', format: 'statements',
      q: R`Compare a Fresnel zone plate with a glass lens. Which statements about the zone plate are correct?`,
      options: ['It has several foci on the axis, not just one', 'Its focal length depends strongly on wavelength', 'It focuses by diffraction, not refraction', 'Its focal length increases with wavelength, so red focuses farther away than blue'], answer: [0, 1, 2],
      sol: R`Zone radii obey $r_n^2 = n\lambda f$, so $f = r_1^2/\lambda$: strongly wavelength dependent, and larger for shorter wavelengths (blue focuses farther than red, the opposite of a simple glass lens). Besides the main focus at $f$ there are weaker foci at $f/3$, $f/5$, ..., because a zone plate tuned for $f$ also groups zones in threes, fives and so on. It works by blocking alternate zones so that the rest add in phase: diffraction.`,
      trap: R`$f = r_1^2/\lambda$ falls as $\lambda$ grows.` },
    { id: 'dfr-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'fresnel zones',
      q: R`A plane wave of wavelength 500 nm falls normally on an opaque screen with a circular hole of radius 0.50 mm. On the axis, 1.0 m behind the screen, the intensity is ______ times what it would be with no screen (two decimal places).`,
      answer: 2, tol: 0.01, calc: () => 4 * Math.sin((Math.PI * 0.5e-3 ** 2) / (500e-9 * 1) / 2) ** 2,
      sol: R`The hole spans a phase (relative to the centre) of $\phi = \dfrac{\pi r^2}{\lambda b} = \dfrac{\pi\times2.5\times10^{-7}}{5\times10^{-7}} = \dfrac\pi2$: half of the first Fresnel zone. Adding the wavelets as a spiral (vibration curve), the on-axis amplitude is $|1 - e^{i\phi}|$ times the unobstructed amplitude, so $I/I_0 = 4\sin^2(\phi/2) = 4\times\tfrac12 = 2.00$. (A full first zone, $\phi = \pi$, would give 4.)`,
      trap: R`The light through a hole does not grow in step with its area: opening two whole zones would make the centre almost dark.` },
  ],
  gens: [
    { id: 'dfr-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'double slit',
      make(r) {
        const ratio = choose(r, [2.5, 3.5, 4.5, 5, 6, 7]), a = choose(r, [0.02, 0.04, 0.05, 0.1]), m = int(r, 1, 3);
        const d = round(a * ratio, 4), answer = round(sinc2((Math.PI * m * a) / d), 4);
        return { q: R`A double slit has slits ${a} mm wide with centres ${d} mm apart. Find the intensity of the order-${m} interference maximum as a fraction of the central maximum.`,
          answer, tol: Math.max(0.001, answer * 0.005), a, d, m,
          sol: R`At order ${m}, $d\sin\theta = ${m}\lambda$, so $\beta = \pi a\sin\theta/\lambda = ${m}\pi a/d = ${round((Math.PI * m * a) / d, 4)}$ and $I/I_0 = (\sin\beta/\beta)^2 = ${answer}$.`,
          trap: 'The single-slit envelope sets the brightness of each interference order.' };
      },
      verify: (p) => sinc2((Math.PI * p.m * p.a) / p.d) },
    { id: 'dfr-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'fresnel zones',
      make(r) {
        const lam = choose(r, [400, 450, 500, 550, 600]), b = pick(r, 0.5, 2, 0.25), rr = pick(r, 0.3, 1.5, 0.1);
        const phi = (Math.PI * (rr * 1e-3) ** 2) / (lam * 1e-9 * b), answer = round(4 * Math.sin(phi / 2) ** 2, 3);
        return { q: R`A plane wave of wavelength ${lam} nm falls normally on an opaque screen with a circular hole of radius ${rr} mm. Find the on-axis intensity ${b} m behind the screen, as a multiple of the intensity with no screen.`,
          answer, tol: Math.max(0.005, answer * 0.005), lam, b, rr,
          sol: R`$\phi = \pi r^2/(\lambda b) = ${round(phi, 4)}$ rad (${round(phi / Math.PI, 3)} Fresnel zones). $I/I_0 = |1 - e^{i\phi}|^2 = 4\sin^2(\phi/2) = ${answer}$.`,
          trap: 'Odd numbers of zones give bright centres, even numbers dark ones; in between, use the vibration curve.' };
      },
      verify: (p) => 4 * Math.sin((Math.PI * (p.rr * 1e-3) ** 2) / (p.lam * 1e-9 * p.b) / 2) ** 2 },
    { id: 'dfr-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'circular aperture',
      make(r) {
        const [what, lam, unit] = choose(r, [['radar dish', 3, 'cm'], ['radar dish', 1, 'cm'], ['microwave dish', 5, 'cm'], ['laser telescope', 0.0000532, 'cm']]), D = what === 'laser telescope' ? pick(r, 0.5, 2, 0.25) : pick(r, 1, 6, 0.5), L = what === 'laser telescope' ? 384000 : pick(r, 2, 50, 2);
        const answer = round(2 * L * 1000 * ((1.22 * lam) / 100 / D), 1);
        const lamText = what === 'laser telescope' ? '532 nm' : `${lam} ${unit}`;
        return { q: R`A ${what} ${D} m across sends out a beam of wavelength ${lamText}. Taking the edge of the beam at the first dark ring of the Airy pattern, find the beam's diameter (m) at a distance of ${L} km.`,
          answer, tol: Math.max(0.5, answer * 0.005), unit: 'm', lam, D, L,
          sol: R`$\theta = 1.22\lambda/D = ${round((1.22 * lam) / 100 / D, 7)}$ rad. Diameter $= 2L\theta = ${answer}$ m.`,
          trap: 'The Airy angle is a half-angle: double it for the diameter.' };
      },
      verify: (p) => 2 * p.L * 1000 * ((1.22 * p.lam) / 100 / p.D) },
  ],
};
