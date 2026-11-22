// Round 4 extras for central-force-scattering: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'cfs-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'conservation laws',
      q: R`A body of reduced mass $\mu$ moves under a central force with angular momentum $\ell$. The area swept out per unit time by the line from the centre to the body is`,
      options: [R`$\ell/\mu$`, R`$\ell/2\mu$`, R`$\ell^2/2\mu$`, R`$2\ell/\mu$`], answer: 1,
      sol: R`In a short time $dt$ the radius sweeps a thin triangle of area $dA = \tfrac12r\cdot r\,d\theta$, so $\dfrac{dA}{dt} = \tfrac12r^2\dot\theta = \dfrac{\ell}{2\mu}$, since $\ell = \mu r^2\dot\theta$. It is constant for every central force (Kepler's second law is angular momentum conservation).`,
      trap: R`The triangle's area has a factor $\tfrac12$; dropping it gives $\ell/\mu$.` },
    { id: 'cfs-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'orbits',
      q: R`A particle moves in the isotropic oscillator potential $U = \tfrac12\kappa r^2$. Its orbits are`,
      options: ['ellipses with the centre of force at one focus', 'ellipses, parabolas or hyperbolas, depending on the energy', 'ellipses with the centre of force at their centre', 'circles only'], answer: 2,
      sol: R`The force $-\kappa\mathbf r$ separates: $\ddot x = -\omega^2x$ and $\ddot y = -\omega^2y$ with the same $\omega = \sqrt{\kappa/\mu}$. So $x = A\cos(\omega t + \alpha)$, $y = B\cos(\omega t + \beta)$, which traces an ellipse centred on the origin (a circle or a line segment in special cases). Since $U \to \infty$ as $r \to \infty$, every orbit is bound; there are no parabolas or hyperbolas.`,
      trap: R`The focus belongs to the inverse-square law; for the linear force the centre of force is the centre of the ellipse.` },
    { id: 'cfs-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Rutherford scattering',
      q: R`In a Rutherford experiment the alpha-particle kinetic energy is doubled and the target foil is changed to an element with half the atomic number (same detector angle, same number of nuclei per area). The differential cross-section at that angle becomes`,
      options: ['4 times larger', '1/4 of its value', '1/8 of its value', '1/16 of its value'], answer: 3,
      sol: R`$\dfrac{d\sigma}{d\Omega} = \left(\dfrac{zZe^2}{16\pi\varepsilon_0E}\right)^2\dfrac{1}{\sin^4(\Theta/2)} \propto \left(\dfrac ZE\right)^2$. Here $Z/E$ falls by $\tfrac12\times\tfrac12 = \tfrac14$, so the cross-section falls by $\left(\tfrac14\right)^2 = \tfrac1{16}$.`,
      trap: R`The cross-section goes as the square of $Z/E$; forgetting the square gives $\tfrac14$.` },
    { id: 'cfs-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'orbits',
      q: R`A comet moves on a parabolic orbit around the Sun (total energy exactly zero). At distance $r$ from the Sun its speed is`,
      options: [R`$\sqrt2$ times the speed of a circular orbit of radius $r$`, R`equal to the speed of a circular orbit of radius $r$`, R`twice the speed of a circular orbit of radius $r$`, R`not fixed by $r$ alone; it depends on the perihelion distance as well`], answer: 0,
      sol: R`$E = \tfrac12mv^2 - \dfrac{GMm}{r} = 0$ gives $v = \sqrt{2GM/r}$. A circular orbit at $r$ has $v_c = \sqrt{GM/r}$. So $v = \sqrt2\,v_c$ at every point of the orbit, whatever the perihelion distance (that only fixes the direction of the velocity).`,
      trap: R`Energy fixes the speed at each $r$; the angular momentum only fixes how the velocity is tilted.` },
    { id: 'cfs-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'two-body problem',
      q: R`Two stars of masses $m_1$ and $m_2$ move on circles about their common centre of mass, always a distance $a$ apart. The square of their orbital period is`,
      options: [R`$\dfrac{4\pi^2a^3}{Gm_1}$`, R`$\dfrac{4\pi^2a^3}{G\mu}$, with $\mu$ the reduced mass`, R`$\dfrac{4\pi^2a^3}{G(m_1 + m_2)}$`, R`$\dfrac{4\pi^2a^3}{Gm_1m_2}$`], answer: 2,
      sol: R`The relative coordinate obeys $\mu\ddot{\mathbf r} = -\dfrac{Gm_1m_2}{r^2}\hat r$. For a circle of radius $a$: $\mu\omega^2a = \dfrac{Gm_1m_2}{a^2}$, and since $m_1m_2/\mu = m_1 + m_2$, $\omega^2 = \dfrac{G(m_1 + m_2)}{a^3}$. So $T^2 = \dfrac{4\pi^2a^3}{G(m_1 + m_2)}$: Kepler's third law with the total mass.`,
      trap: R`Using only one mass is right only when the other is negligible; the reduced mass belongs on the left side, not in the force constant.` },
    { id: 'cfs-r4-06', type: 'mcq', level: 4, exams: ['jam', 'gate', 'net'], sub: 'orbits',
      q: R`A satellite in a nearly circular orbit loses energy slowly to atmospheric drag, staying nearly circular. As it spirals down, its speed`,
      options: ['decreases, because drag removes energy', 'increases', 'stays the same', 'increases only if the satellite is lighter than the air it meets'], answer: 1,
      sol: R`For a circular orbit $E = -\dfrac{GMm}{2r}$ and the kinetic energy is $K = \dfrac{GMm}{2r} = -E$. Drag makes $E$ more negative, so $r$ shrinks and $K = -E$ grows: the satellite speeds up. Gravity does work $2|\Delta E|$ as it falls, twice what drag removes, so the net kinetic energy rises.`,
      trap: R`The drag force slows the satellite locally, but the lower orbit needs (and gravity supplies) a higher speed.` },
    { id: 'cfs-r4-07', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Kepler problem', format: 'statements',
      q: R`For bound orbits in $U = -k/r$ (reduced mass $\mu$), which quantities are fixed by the energy $E$ alone, whatever the angular momentum?`,
      options: [R`The semi-major axis $a$`, R`The eccentricity $e$`, R`The period $T$`, R`The time average of the potential energy, $\langle U\rangle$`], answer: [0, 2, 3],
      sol: R`$a = -k/2E$ depends only on $E$, and so does $T = 2\pi\sqrt{\mu a^3/k}$. The eccentricity $e = \sqrt{1 + 2E\ell^2/\mu k^2}$ needs $\ell$ too (a circle and a long thin ellipse can share $E$). The virial theorem for $U \propto r^{-1}$ gives $\langle K\rangle = -\tfrac12\langle U\rangle$, so $E = \tfrac12\langle U\rangle$ and $\langle U\rangle = 2E$.`,
      trap: R`Shape (eccentricity) depends on $\ell$, but size and period depend only on $E$.` },
    { id: 'cfs-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: "Bertrand's theorem", format: 'statements',
      q: R`For which of these attractive central potentials is every bound orbit closed?`,
      options: [R`$U = -k/r$`, R`$U = \tfrac12kr^2$`, R`$U = kr^4$`, R`$U = -k/\sqrt r$`], answer: [0, 1],
      sol: R`Bertrand's theorem: only the inverse-square and the linear (Hooke) forces give closed orbits for every bound motion. A quick check uses nearly circular orbits in $U \propto r^{n}$ (with the right sign): the apsidal angle is $\pi/\sqrt{n + 2}$. $n = -1$: $\pi$ (closed after one turn). $n = 2$: $\pi/2$ (closed). $n = 4$: $\pi/\sqrt6$ and $n = -\tfrac12$: $\pi/\sqrt{1.5}$, irrational fractions of $2\pi$, so the orbits precess and never close.`,
      trap: R`A power-law potential is not enough; only the exponents $-1$ and $2$ give closed orbits.` },
    { id: 'cfs-r4-09', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'orbits', format: 'numeric',
      q: R`A satellite passes its closest point to the Earth at 7000 km from the centre, moving at 8.50 km/s. Take $GM_E = 3.986\times10^5$ km³/s². Its farthest distance from the Earth's centre is ______ km (to the nearest 10 km).`,
      answer: 12147, tol: 15, calc: () => 2 / (2 / 7000 - 8.5 * 8.5 / 3.986e5) - 7000, unit: 'km',
      sol: R`Vis-viva: $v^2 = GM\left(\dfrac2r - \dfrac1a\right)$, so $\dfrac1a = \dfrac{2}{7000} - \dfrac{72.25}{3.986\times10^5} = 2.857\times10^{-4} - 1.813\times10^{-4} = 1.045\times10^{-4}$ km⁻¹, $a = 9574$ km. Then $r_{\max} = 2a - r_{\min} = 19147 - 7000 \approx 12150$ km.`,
      trap: R`Using $r_{\max} = a$ forgets that perigee and apogee are at opposite ends of the major axis, $r_{\min} + r_{\max} = 2a$.` },
    { id: 'cfs-r4-10', type: 'nat', level: 4, exams: ['jam', 'gate', 'net'], sub: 'Kepler problem', format: 'numeric',
      q: R`If the Earth were suddenly stopped in its (circular) orbit, it would fall straight into the Sun. Treating both as points and the Sun as fixed, with a year of 365.25 days, the time to fall is ______ days (to one decimal place).`,
      answer: 64.6, tol: 0.3, calc: () => 365.25 / (4 * Math.SQRT2), unit: 'days',
      sol: R`A straight fall is the limit of a very thin Kepler ellipse ($e \to 1$) whose far end is the starting point and whose near end is the Sun, so its major axis is $R$ and $a = R/2$. By Kepler's third law its period is $T(a/R)^{3/2} = T/2^{3/2}$. The fall is half of that period: $t = \dfrac{T}{2\times2^{3/2}} = \dfrac{T}{4\sqrt2} = \dfrac{365.25}{5.657} = 64.6$ days.`,
      trap: R`The semi-major axis of the degenerate ellipse is $R/2$, not $R$; using $R$ gives a quarter year.` },
    { id: 'cfs-r4-11', type: 'nat', level: 5, exams: ['jam', 'gate', 'net'], sub: 'orbits', format: 'numeric',
      q: R`A spacecraft moves from a circular orbit of radius $r_1$ to one of radius $4r_1$ by a two-burn Hohmann transfer (two quick tangential burns along an ellipse that touches both circles). With $v_1$ the speed on the inner circle, the total speed change $(\Delta v_1 + \Delta v_2)/v_1$ is ______ (to three decimal places).`,
      answer: 0.449, tol: 0.003, calc: () => Math.sqrt(8 / 5) - 1 + 0.5 * (1 - Math.sqrt(2 / 5)),
      sol: R`Transfer ellipse: $a = (r_1 + 4r_1)/2 = 2.5r_1$. Vis-viva at $r_1$: $v_p = v_1\sqrt{2 - r_1/a} = v_1\sqrt{1.6} = 1.2649v_1$, so $\Delta v_1 = 0.2649v_1$. At $4r_1$: $v_a = v_p\,r_1/4r_1 = 0.3162v_1$, while the outer circle needs $v_2 = v_1/\sqrt4 = 0.5v_1$, so $\Delta v_2 = 0.1838v_1$. Total $0.449v_1$.`,
      trap: R`The second burn is needed: at apogee the craft moves slower than the outer circular speed.` },
    { id: 'cfs-r4-12', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'collisions', format: 'numeric',
      q: R`A neutron (mass 1 u) hits a carbon-12 nucleus (12 u) at rest head-on and bounces back elastically. The fraction of the neutron's kinetic energy given to the carbon nucleus is ______ (to three decimal places).`,
      answer: 0.284, tol: 0.003, calc: () => 4 * 12 / 169,
      sol: R`In a head-on elastic collision the target moves off at $v_2 = \dfrac{2m_1}{m_1 + m_2}u$, so the fraction of energy transferred is $\dfrac{m_2v_2^2}{m_1u^2} = \dfrac{4m_1m_2}{(m_1 + m_2)^2} = \dfrac{4\times12}{13^2} = 0.284$. (This is why light nuclei make good moderators.)`,
      trap: R`Head-on gives the largest transfer; equal masses would give 1, very unequal masses almost 0.` },
  ],
  gens: [
    { id: 'cfs-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'orbits',
      make(r) {
        const GM = 3.986e5, rp = choose(r, [6600, 6800, 7000, 7200, 7500, 8000]), f = choose(r, [1.03, 1.06, 1.1, 1.15, 1.2, 1.25, 1.3]);
        const v = round(f * Math.sqrt(GM / rp), 2), a = 1 / (2 / rp - v * v / GM), answer = round(2 * a - rp, 0);
        return { q: R`A satellite is at its closest point to the Earth, ${rp} km from the centre, moving at ${v} km/s. With $GM_E = 3.986\times10^5$ km³/s², find its farthest distance from the Earth's centre (km).`,
          answer, tol: Math.max(10, answer * 0.003), unit: 'km', rp, v,
          sol: R`Vis-viva: $\dfrac1a = \dfrac2r - \dfrac{v^2}{GM} = \dfrac{2}{${rp}} - \dfrac{${v}^2}{3.986\times10^5}$, so $a = ${round(a, 0)}$ km. Then $r_{\max} = 2a - r_{\min} = ${answer}$ km.`,
          trap: 'Perigee and apogee together span the major axis: $r_{\\min} + r_{\\max} = 2a$.' };
      },
      verify: (p) => 2 / (2 / p.rp - p.v * p.v / 3.986e5) - p.rp },
    { id: 'cfs-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate', 'net'], sub: 'orbits',
      make(r) {
        const n = choose(r, [1.5, 2, 3, 4, 6, 8, 10]);
        const vp = Math.sqrt(2 * n / (1 + n)), dv1 = vp - 1, dv2 = 1 / Math.sqrt(n) - vp / n, answer = round(dv1 + dv2, 3);
        return { q: R`A Hohmann transfer takes a spacecraft from a circular orbit of radius $r_1$ to one of radius ${n}$r_1$ with two quick tangential burns. With $v_1$ the speed on the inner circle, find $(\Delta v_1 + \Delta v_2)/v_1$.`,
          answer, tol: Math.max(0.003, answer * 0.01), n,
          sol: R`Transfer ellipse $a = (1 + ${n})r_1/2$. At perigee $v_p = v_1\sqrt{2n/(1 + n)} = ${round(vp, 4)}v_1$, so $\Delta v_1 = ${round(dv1, 4)}v_1$. At apogee $v_a = v_p/n = ${round(vp / n, 4)}v_1$, and the outer circle needs $v_1/\sqrt n = ${round(1 / Math.sqrt(n), 4)}v_1$, so $\Delta v_2 = ${round(dv2, 4)}v_1$. Total $= ${answer}v_1$.`,
          trap: 'Both burns speed the craft up; at apogee it is slower than the outer circular speed.' };
      },
      verify: (p) => { const vp = Math.sqrt(2 * p.n / (1 + p.n)); return vp - 1 + 1 / Math.sqrt(p.n) - vp / p.n; } },
    { id: 'cfs-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'collisions',
      make(r) {
        const [name, M] = choose(r, [['deuterium', 2], ['helium-4', 4], ['lithium-7', 7], ['beryllium-9', 9], ['carbon-12', 12], ['oxygen-16', 16], ['uranium-238', 238]]);
        const m = choose(r, [1, 1, 4]), pn = m === 1 ? 'A neutron (1 u)' : 'An alpha particle (4 u)', art = /^[aeiou]/.test(name) ? 'an' : 'a';
        const answer = round(4 * m * M / (m + M) ** 2, 3);
        return { q: `${pn} hits ${art} ${name} nucleus (${M} u) at rest head-on in an elastic collision. What fraction of its kinetic energy goes to the ${name} nucleus?`,
          answer, tol: Math.max(0.002, answer * 0.01), m, M,
          sol: R`Head-on elastic: the target leaves at $\dfrac{2m}{m + M}u$, so the fraction is $\dfrac{4mM}{(m + M)^2} = \dfrac{4\times${m}\times${M}}{${m + M}^2} = ${answer}$.`,
          trap: 'The transfer is largest for equal masses (fraction 1) and small when the masses are very different.' };
      },
      verify: (p) => 4 * p.m * p.M / (p.m + p.M) ** 2 },
  ],
};
