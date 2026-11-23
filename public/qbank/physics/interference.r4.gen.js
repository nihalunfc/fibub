// Round 4 extras for interference: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const deg = (x) => (x * 180) / Math.PI;

export default {
  items: [
    { id: 'ifr-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'young double slit',
      q: R`In a Young's double-slit experiment, one of the two slits is covered with an opaque card. On the screen you now see`,
      options: ['the same fringes, half as bright', 'no light at all', 'a broad patch of light from single-slit diffraction, with no two-slit fringes', 'the same fringes, twice as far apart'], answer: 2,
      sol: R`The fine, evenly spaced fringes come from the overlap of light from two slits. With one slit, there is nothing to interfere with, so they disappear. The light from the open slit still spreads out by diffraction, giving a wide central patch (with faint side bands if the slit is narrow).`,
      trap: R`Halving the light does not keep the fringes: they need two coherent sources.` },
    { id: 'ifr-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'young double slit',
      q: R`In a Young's experiment with light of 550 nm, slits 0.40 mm apart and a screen 1.2 m away, the 4th dark fringe (counting outwards from the central bright fringe) is ______ mm from the centre (two decimal places).`,
      answer: 5.78, tol: 0.02, unit: 'mm', calc: () => (3.5 * 550e-9 * 1.2) / 4e-4 * 1000,
      sol: R`The fringe width is $\beta = \lambda D/d = 550\times10^{-9}\times1.2/4\times10^{-4} = 1.65$ mm. Dark fringes sit at path differences $(n - \tfrac12)\lambda$, so the $n$th is at $(n - \tfrac12)\beta$ from the centre. For $n = 4$: $3.5\times1.65 = 5.78$ mm.`,
      trap: R`$4\beta = 6.60$ mm is the 4th bright fringe; the first dark fringe is only half a fringe out.` },
    { id: 'ifr-r4-03', type: 'msq', level: 2, exams: ['jam'], sub: 'thin films', format: 'statements',
      q: R`A thin soap film shows bright colours in daylight, but an ordinary 4 mm window pane does not. Which statements help explain this?`,
      options: ['The coherence length of daylight (a few micrometres) is much shorter than the extra path through the pane', 'Even for a single colour, the fringes from a thick plate lie so close together that the eye and the varying angles wash them out', 'Glass does not reflect light at its back surface', 'With a laser, interference fringes from a window pane can be seen'], answer: [0, 1, 3],
      sol: R`The two reflections from a plate interfere only if the path difference $2nt\cos r$ is shorter than the coherence length. For white light that is a few μm: fine for a film of 0.3 μm, hopeless for 4 mm (path difference about 12 mm). The phase also changes very fast with angle and wavelength for a thick plate, so any fringes are far too fine to see. A laser has a coherence length of centimetres to metres, and fringes from a window are then easy to see. Both faces of the glass do reflect (about 4% each).`,
      trap: R`Thickness matters not because of "too much glass" but because of coherence.` },
    { id: 'ifr-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'thin films',
      q: R`A soap film ($n = 1.33$) in air is viewed in reflected light at $45^\circ$ incidence. The smallest thickness for which it strongly reflects light of wavelength 600 nm is ______ nm (to the nearest nm).`,
      answer: 133, tol: 1, unit: 'nm', calc: () => 600 / (4 * 1.33 * Math.cos(Math.asin(Math.sin(Math.PI / 4) / 1.33))),
      sol: R`Inside the film, $\sin r = \sin45^\circ/1.33 = 0.532$, so $\cos r = 0.847$. The path difference is $2nt\cos r$, and the reflection at the top (air to film) adds a half-wave shift that the bottom one lacks. Bright reflection: $2nt\cos r = \tfrac{\lambda}{2}$ for the thinnest film, $t = \dfrac{600}{4\times1.33\times0.847} = 133$ nm.`,
      trap: R`Using $\cos45^\circ$ (the angle in air) instead of the refraction angle inside the film gives 160 nm.` },
    { id: 'ifr-r4-05', type: 'msq', level: 3, exams: ['jam'], sub: 'newtons rings', format: 'statements',
      q: R`Newton's rings are formed with white light, in reflection, with an air film between a convex lens and a flat glass plate. Which statements are correct?`,
      options: ['The centre, where lens and plate touch, is dark', 'Only a few coloured rings can be seen before the colours wash out', 'Going outwards, the rings get closer together', 'They are fringes of equal inclination, like the rings of a Michelson interferometer'], answer: [0, 1, 2],
      sol: R`At the contact point the film thickness is zero, and the half-wave shift at the lower (air to glass) reflection makes it dark for every colour. Further out the conditions for different colours drift apart, so after a few rings the colours overlap into white. The film thickness grows as $r^2/(2R)$, so ring radii grow as $\sqrt n$ and the rings crowd together outwards. They are fringes of equal thickness (each ring traces a fixed air gap), not of equal inclination.`,
      trap: R`Rings do not always mean equal inclination: here each ring is a contour of equal film thickness.` },
    { id: 'ifr-r4-06', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'two-source interference',
      q: R`Two radio masts 400 m apart broadcast in phase at wavelength 100 m. A receiver is carried round a very large circle centred on the midpoint between them, in the plane of the ground. The number of points on the circle where the signal is a maximum is ______.`,
      answer: 16, tol: 0, calc: () => 4 * (400 / 100),
      sol: R`Far away in direction $\theta$ (from the line joining the masts), the path difference is $d\cos\theta = 400\cos\theta$ m. Maxima need $400\cos\theta = m\times100$, i.e. $\cos\theta = m/4$ with $m = -4, \dots, 4$. For $|m| < 4$ each value gives two points (above and below the line): $7\times2 = 14$. For $m = \pm4$, $\theta = 0$ or $180^\circ$: one point each. Total 16 $= 4d/\lambda$.`,
      trap: R`Counting 9 orders, or 18 points, double-counts the two points on the line through the masts.` },
    { id: 'ifr-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'two-beam interference',
      q: R`Two coherent plane waves of wavelength $\lambda$ cross with an angle $2\alpha$ between their directions. On a screen perpendicular to the line bisecting that angle, the bright fringes are spaced by`,
      options: [R`$\lambda/\sin\alpha$`, R`$\lambda/(2\sin\alpha)$`, R`$\lambda/(2\tan\alpha)$`, R`$2\lambda\sin\alpha$`], answer: 1,
      sol: R`Take the bisector as $z$. The waves have $k_x = \pm k\sin\alpha$, so their phase difference across the screen is $2k\sin\alpha\,x$. Bright fringes repeat when this grows by $2\pi$: $\Delta x = \dfrac{2\pi}{2k\sin\alpha} = \dfrac{\lambda}{2\sin\alpha}$. This is how holographic gratings are made: the wider the angle, the finer the fringes, down to $\lambda/2$.`,
      trap: R`$\lambda/\sin\alpha$ is the spacing for one tilted wave against an untilted one (angle $\alpha$ in total).` },
    { id: 'ifr-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'multiple-beam interference',
      q: R`A Fabry–Pérot etalon has two parallel mirrors, each of reflectance 0.90 (no absorption). Its finesse (the spacing of the transmission peaks divided by their full width at half maximum) is ______ (one decimal place).`,
      answer: 29.8, tol: 0.1, calc: () => (Math.PI * Math.sqrt(0.9)) / 0.1,
      sol: R`The transmitted intensity is $\dfrac{1}{1 + F\sin^2(\delta/2)}$ with coefficient of finesse $F = \dfrac{4R}{(1 - R)^2} = \dfrac{3.6}{0.01} = 360$. The half maximum falls at $\sin(\delta/2) = 1/\sqrt F$, so the full width is $4/\sqrt F$ in $\delta$, while peaks are $2\pi$ apart. Finesse $= \dfrac{2\pi}{4/\sqrt F} = \dfrac{\pi\sqrt F}{2} = \dfrac{\pi\sqrt R}{1 - R} = 29.8$.`,
      trap: R`The coefficient of finesse $F = 360$ and the finesse 29.8 are different quantities.` },
    { id: 'ifr-r4-09', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'young double slit',
      q: R`In a double-slit set-up, the light from slit 1 leads the light from slit 2 by a phase of $\pi/2$ (an electro-optic cell in front of slit 1 advances its phase). With fringe width $\beta$, the central bright fringe`,
      options: ['stays at the centre of the screen', R`shifts by $\beta/4$ towards slit 2`, R`shifts by $\beta/2$ towards slit 1`, R`shifts by $\beta/4$ towards slit 1`], answer: 1,
      sol: R`At a point P the phases are $\phi_0 + \pi/2 - kr_1$ and $\phi_0 - kr_2$. They match when $k(r_1 - r_2) = \pi/2$, i.e. $r_1 - r_2 = \lambda/4$: P must be farther from slit 1 (the leading one), so the extra path from slit 1 uses up its head start. Since $r_1 - r_2 = dy/D$ with $y$ measured towards slit 2, $y = \dfrac{\lambda D}{4d} = \dfrac\beta4$ towards slit 2. (A glass plate over slit 1 does the opposite: it delays that light and pulls the pattern towards slit 1.)`,
      trap: R`A phase lead acts like a shorter path for that slit's light, so the zero-order fringe moves away from it, towards the other slit.` },
    { id: 'ifr-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'michelson',
      q: R`A Michelson interferometer is set up with an effective air gap $d = 0.50$ mm between one mirror and the image of the other, and lit by an extended source of wavelength 500 nm. The centre of the circular fringe pattern is bright. The angular radius of the 5th bright ring out from the centre is ______ degrees (two decimal places).`,
      answer: 4.05, tol: 0.02, unit: '°', calc: () => deg(Math.acos(1995 / 2000)),
      sol: R`Bright fringes satisfy $2d\cos\theta = m\lambda$. At the centre $m_0 = 2d/\lambda = 2\times0.5\times10^{-3}/500\times10^{-9} = 2000$ (bright, as stated). Going outwards $\cos\theta$ falls, so the order falls: the 5th ring has $m = 1995$, $\cos\theta = 1995/2000 = 0.9975$, $\theta = 4.05^\circ$. (For small angles $\theta \approx \sqrt{2\times5/2000}$ rad.)`,
      trap: R`The order is highest at the centre and falls outwards, unlike Newton's rings.` },
  ],
  gens: [
    { id: 'ifr-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'thin films',
      make(r) {
        const n = choose(r, [1.25, 1.33, 1.38, 1.45, 1.5]), i = choose(r, [0, 20, 30, 40, 45, 50, 60]), lam = pick(r, 420, 680, 10), bright = r() < 0.5;
        const cr = Math.cos(Math.asin(Math.sin((i * Math.PI) / 180) / n)), answer = round(lam / ((bright ? 4 : 2) * n * cr), 1);
        return { q: R`A thin film of index ${n} in air is viewed in reflected light at ${i}° incidence. Find the smallest non-zero thickness (nm) for which light of ${lam} nm is ${bright ? 'strongly reflected' : 'not reflected at all'}.`,
          answer, tol: Math.max(0.5, answer * 0.005), unit: 'nm', n, i, lam, br: bright ? 1 : 0,
          sol: R`$\cos r = ${round(cr, 4)}$ inside the film. One reflection (air to film) adds a half-wave shift, so ${bright ? R`bright needs $2nt\cos r = \lambda/2$` : R`dark needs $2nt\cos r = \lambda$`}: $t = ${answer}$ nm.`,
          trap: 'Use the refraction angle inside the film, and remember the extra half wave from the top reflection.' };
      },
      verify: (p) => p.lam / ((p.br ? 4 : 2) * p.n * Math.cos(Math.asin(Math.sin((p.i * Math.PI) / 180) / p.n))) },
    { id: 'ifr-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'two-source interference',
      make(r) {
        const lam = pick(r, 20, 200, 10), k = int(r, 1, 8), half = r() < 0.4, d = lam * (k + (half ? 0.5 : 0));
        const answer = half ? 4 * k + 2 : 4 * k;
        return { q: R`Two antennas ${d} m apart radiate in phase at wavelength ${lam} m. Walking round a very large circle centred on them (in their plane), how many points of maximum signal do you pass?`,
          answer, tol: 0, d, lam,
          sol: R`Maxima need $d\cos\theta = m\lambda$, so $|m| \le d/\lambda = ${round(d / lam, 2)}$. ${half ? R`No order lies exactly on the line through the antennas, so each $m$ from $-${k}$ to $${k}$ gives two points: $2(2\times${k} + 1) = ${answer}$.` : R`Each $|m| < ${k}$ gives two points and $m = \pm${k}$ one each (on the line through the antennas): $2(2\times${k} - 1) + 2 = ${answer}$.`}`,
          trap: 'Orders with |m| exactly equal to d/λ touch the circle only once.' };
      },
      verify: (p) => { const x = p.d / p.lam, k = Math.floor(x + 1e-9); return Math.abs(x - k) < 1e-9 ? 4 * k : 2 * (2 * k + 1); } },
    { id: 'ifr-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'michelson',
      make(r) {
        const lam = choose(r, [450, 500, 546, 600, 633]), m0 = int(r, 800, 4000), p = int(r, 2, 12);
        const d = (m0 * lam) / 2 / 1e6, answer = round(deg(Math.acos((m0 - p) / m0)), 3);
        return { q: R`A Michelson interferometer has an effective air gap of ${round(d, 6)} mm and is lit by an extended source of wavelength ${lam} nm; the centre of the ring pattern is bright. Find the angular radius (degrees) of the ${p}th bright ring out from the centre.`,
          answer, tol: Math.max(0.005, answer * 0.003), unit: '°', lam, m0, p,
          sol: R`$m_0 = 2d/\lambda = ${m0}$ at the centre. The ${p}th ring has order ${m0 - p}: $\cos\theta = ${m0 - p}/${m0}$, $\theta = ${answer}^\circ$.`,
          trap: 'In equal-inclination rings the order falls going outwards.' };
      },
      verify: (p) => deg(Math.acos((p.m0 - p.p) / p.m0)) },
  ],
};
