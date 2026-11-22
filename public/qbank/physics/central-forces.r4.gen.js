// Round 4 extras for central-forces: original questions, written 2026-11-22.
import { pick, int, choose, round, C } from '../_util.js';
const R = String.raw;
const hohmann = (GM, r1, r2) => {
  const a = (r1 + r2) / 2, vp = Math.sqrt(GM * (2 / r1 - 1 / a)), va = vp * r1 / r2;
  return (vp - Math.sqrt(GM / r1)) + (Math.sqrt(GM / r2) - va);
};

export default {
  items: [
    { id: 'cfo-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'kepler laws',
      q: R`A particle of mass $m$ moves under a central force with angular momentum $L$ about the centre. The area swept out per unit time by the line from the centre to the particle is`,
      options: [R`$\dfrac{L}{m}$`, R`$\dfrac{2L}{m}$`, R`$\dfrac{mL}{2}$`, R`$\dfrac{L}{2m}$`], answer: 3,
      sol: R`In time $dt$ the radius line sweeps a thin triangle of area $\tfrac12|\vec r\times d\vec r| = \tfrac12|\vec r\times\vec v|\,dt$. Since $L = m|\vec r\times\vec v|$, $\dfrac{dA}{dt} = \dfrac{L}{2m}$, constant because $L$ is conserved (Kepler's second law).`,
      trap: R`The triangle's area has a factor $\tfrac12$; $L/m$ is the parallelogram.` },
    { id: 'cfo-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'satellites',
      q: R`A moon moves on a circle of radius $1.0\times10^8$ m around a planet with $GM = 4.0\times10^{16}$ m³/s². Its orbital speed is ______ km/s.`,
      answer: 20, tol: 0.05, unit: 'km/s', calc: () => Math.sqrt(4e16 / 1e8) / 1000,
      sol: R`Gravity supplies the centripetal force: $\dfrac{GMm}{r^2} = \dfrac{mv^2}{r}$, so $v = \sqrt{GM/r} = \sqrt{4.0\times10^{16}/1.0\times10^8} = \sqrt{4\times10^8} = 2.0\times10^4$ m/s $= 20$ km/s. The moon's own mass does not matter.`,
      trap: R`$\sqrt{2GM/r}$ is the escape speed, larger by $\sqrt2$.` },
    { id: 'cfo-r4-03', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'effective potential',
      q: R`A particle moves on a circular orbit in the attractive potential $U = kr^2$ ($k > 0$). The ratio of its kinetic energy to its potential energy, $K/U$, is`,
      options: [R`$-\tfrac12$`, R`$1$`, R`$2$`, R`$-2$`], answer: 1,
      sol: R`The force is $-2kr$, so on a circle $\dfrac{mv^2}{r} = 2kr$ and $K = \tfrac12mv^2 = kr^2 = U$. In general, for $U \propto r^n$ on a circular orbit (and on average for any bounded orbit, by the virial theorem), $2K = nU$; $n = 2$ gives $K = U$, and gravity, $n = -1$, gives $K = -U/2$.`,
      trap: R`$K = -U/2$ is special to the inverse-square force.` },
    { id: 'cfo-r4-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'satellites', format: 'statements',
      q: R`Suppose an attractive central force fell off as $F = k/r$ (not $1/r^2$). For circular orbits around the centre, which statements would be true?`,
      options: ['All circular orbits have the same speed', 'The period is proportional to the radius', 'The angular momentum is proportional to the radius', 'The kinetic energy falls as $1/r$'], answer: [0, 1, 2],
      sol: R`$\dfrac{mv^2}{r} = \dfrac kr$ gives $v^2 = k/m$, the same at every radius. Then $T = 2\pi r/v \propto r$ and $L = mvr \propto r$, while $K = \tfrac12mv^2 = k/2$ is the same everywhere. Flat rotation curves like this are what is seen in the outer parts of spiral galaxies.`,
      trap: R`Kepler's $T^2 \propto r^3$ belongs to the inverse-square law only.` },
    { id: 'cfo-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'kepler laws',
      q: R`If the Sun had four times its actual mass and the Earth moved on a circular orbit of the same radius as now, the length of the year would be`,
      options: ['6 months', '3 months', '2 years', '1 year'], answer: 0,
      sol: R`For a circular orbit $\dfrac{GM}{r^2} = \omega^2r$, so $T = 2\pi\sqrt{r^3/GM} \propto M^{-1/2}$ at fixed $r$. Four times the mass halves the period: 6 months. The Earth would also move twice as fast.`,
      trap: R`The period scales as the inverse square root of the mass, not inversely.` },
    { id: 'cfo-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'orbits',
      q: R`A comet's orbit has perihelion distance 1.0 AU and eccentricity 0.8. When the comet has moved $90^\circ$ round the Sun from perihelion, its distance from the Sun is ______ AU.`,
      answer: 1.8, tol: 0.01, unit: 'AU', calc: () => 1.0 * (1 + 0.8),
      sol: R`The orbit is $r = \dfrac{p}{1 + e\cos\theta}$ with $\theta$ measured from perihelion. At $\theta = 0$, $r_p = \dfrac{p}{1 + e}$, so $p = r_p(1 + e) = 1.8$ AU. At $\theta = 90^\circ$, $\cos\theta = 0$ and $r = p = 1.8$ AU (the semi-latus rectum).`,
      trap: R`$90^\circ$ from perihelion is not the end of the minor axis; that point is at distance $a$.` },
    { id: 'cfo-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'shells and spheres',
      q: R`A probe orbits just above the surface of an airless spherical planet with a period of 90 minutes. The planet's mean density is ______ kg/m³ (to the nearest 10; $G = 6.674\times10^{-11}$ SI).`,
      answer: 4843, tol: 10, unit: 'kg/m³', calc: () => 3 * Math.PI / (6.674e-11 * 5400 ** 2),
      sol: R`For an orbit of radius $R$: $\omega^2R = \dfrac{GM}{R^2}$ with $M = \tfrac43\pi R^3\rho$, so $\dfrac{4\pi^2}{T^2} = \dfrac43\pi G\rho$ and $\rho = \dfrac{3\pi}{GT^2}$. The radius cancels. With $T = 5400$ s: $\rho = \dfrac{9.425}{6.674\times10^{-11}\times2.916\times10^7} = 4.84\times10^3$ kg/m³, a rocky planet.`,
      trap: R`The radius drops out; a skimming orbit's period measures only the density.` },
    { id: 'cfo-r4-08', type: 'mcq', level: 4, exams: ['gate'], sub: 'orbits',
      q: R`For a particle of mass $m$ in $U = -k/r$, the Laplace-Runge-Lenz vector $\vec A = \vec p\times\vec L - mk\,\hat r$ is conserved. On an elliptical orbit of eccentricity $e$, $\vec A$`,
      options: ['points along the minor axis, with size $mke$', 'rotates with the particle, with size $mk$', 'points from the centre towards the perihelion, with size $mke$', 'points towards the aphelion, with size $mk/e$'], answer: 2,
      sol: R`Being conserved, $\vec A$ is fixed in space; it lies in the orbital plane. At perihelion $\vec p\times\vec L$ points radially outward with size $pL = L^2/r_p$, so $\vec A = (L^2/r_p - mk)\hat r_p$. Using $L^2 = mkr_p(1 + e)$, this is $mke\,\hat r_p$: towards the perihelion, of size $mke$. It exists because the inverse-square force gives closed, non-precessing orbits.`,
      trap: R`$\vec A$ vanishes on a circle ($e = 0$), so its size must contain $e$.` },
    { id: 'cfo-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'orbits', format: 'statements',
      q: R`A satellite on a circular orbit of radius $r$ fires its engine briefly forward, along its velocity, increasing its speed a little. Which statements about the new orbit are true?`,
      options: ['Its total energy is lower than before', 'Its closest point to the planet is at distance $r$', 'Its period is longer than before', 'At its farthest point it moves slower than it did on the old circle'], answer: [1, 2, 3],
      sol: R`The push adds kinetic energy and leaves the potential energy unchanged, so the total energy rises (less negative) and the semi-major axis grows, lengthening the period ($T \propto a^{3/2}$). The velocity is still perpendicular to the radius at the burn point, so that point is an apsis; with extra speed it is the perigee, at distance $r$. At apogee the satellite is farther out and slowest: $v_a = v_p\,r/r_a < v_p$, and in fact below the old circular speed (that is why a second burn is needed to circularise there).`,
      trap: R`Speeding up raises the far side of the orbit, not the side where the burn happened.` },
    { id: 'cfo-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'satellites',
      q: R`A satellite is moved from a circular orbit of radius 7000 km to one of radius 42000 km by a Hohmann transfer: one tangential burn to enter an ellipse touching both circles, and one at the far end to circularise. With $GM = 4.0\times10^{14}$ m³/s², the total speed change (sum of the two burns) is ______ km/s (two decimal places).`,
      answer: 3.77, tol: 0.02, unit: 'km/s', calc: () => hohmann(4e14, 7e6, 4.2e7) / 1000,
      sol: R`Circular speeds: $v_1 = \sqrt{GM/r_1} = 7.559$ km/s, $v_2 = \sqrt{GM/r_2} = 3.086$ km/s. The transfer ellipse has $a = 24500$ km. Vis-viva at perigee: $v_p = \sqrt{GM\left(\dfrac2{r_1} - \dfrac1a\right)} = 9.897$ km/s; at apogee $v_a = v_pr_1/r_2 = 1.650$ km/s. Burns: $9.897 - 7.559 = 2.338$ km/s and $3.086 - 1.650 = 1.436$ km/s, total $3.77$ km/s.`,
      trap: R`At apogee the satellite is slower than the outer circular speed, so the second burn also speeds it up.` },
  ],
  gens: [
    { id: 'cfo-r4g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'shells and spheres',
      make(r) {
        const Tmin = int(r, 80, 300), T = Tmin * 60, answer = round(3 * Math.PI / (C.G * T * T), 0);
        return { q: R`A probe orbits just above the surface of an airless spherical body with a period of ${Tmin} minutes. Find the body's mean density in kg/m³ ($G = 6.674\times10^{-11}$ SI).`,
          answer, tol: Math.max(2, answer * 0.003), unit: 'kg/m³', T,
          sol: R`$\omega^2R = GM/R^2$ with $M = \tfrac43\pi R^3\rho$ gives $\rho = \dfrac{3\pi}{GT^2} = \dfrac{3\pi}{6.674\times10^{-11}\times(${T})^2} = ${answer}$ kg/m³. The radius cancels.`,
          trap: 'Convert the period to seconds; the size of the body is not needed.' };
      },
      verify: (p) => 3 * Math.PI / (C.G * p.T * p.T) },
    { id: 'cfo-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'satellites',
      make(r) {
        const r1 = int(r, 66, 120) * 100, ratio = pick(r, 1.5, 7, 0.5), r2 = round(r1 * ratio, 0), GM = 3.986e14;
        const answer = round(hohmann(GM, r1 * 1e3, r2 * 1e3) / 1000, 3);
        return { q: R`A satellite moves from a circular orbit of radius ${r1} km to a circular orbit of radius ${r2} km by a two-burn Hohmann transfer. With $GM = 3.986\times10^{14}$ m³/s² for the Earth, find the total speed change in km/s (three decimal places).`,
          answer, tol: Math.max(0.005, answer * 0.003), unit: 'km/s', r1, r2,
          sol: R`Transfer ellipse $a = (r_1 + r_2)/2 = ${round((r1 + r2) / 2, 1)}$ km. Vis-viva: $v_p = \sqrt{GM(2/r_1 - 1/a)}$ and $v_a = v_pr_1/r_2$; circular speeds $\sqrt{GM/r}$. Total $\Delta v = (v_p - v_1) + (v_2 - v_a) = ${answer}$ km/s.`,
          trap: 'Both burns are speed increases; the satellite arrives at apogee slower than the outer circular speed.' };
      },
      verify: (p) => hohmann(3.986e14, p.r1 * 1e3, p.r2 * 1e3) / 1000 },
    { id: 'cfo-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'orbits',
      make(r) {
        const rp = pick(r, 0.3, 3, 0.1), e = pick(r, 0.1, 0.9, 0.05), th = choose(r, [30, 45, 60, 90, 120, 135, 150]);
        const answer = round(rp * (1 + e) / (1 + e * Math.cos(th * Math.PI / 180)), 3);
        return { q: R`A comet's orbit has perihelion distance ${rp} AU and eccentricity ${e}. Find its distance from the Sun (AU) when it has moved ${th}° round the Sun from perihelion.`,
          answer, tol: Math.max(0.002, answer * 0.002), unit: 'AU', rp, e, th,
          sol: R`$r = \dfrac{p}{1 + e\cos\theta}$ with $p = r_p(1 + e) = ${round(rp * (1 + e), 4)}$ AU. At $\theta = ${th}^\circ$: $r = \dfrac{${round(rp * (1 + e), 4)}}{1 + ${e}\times${round(Math.cos(th * Math.PI / 180), 4)}} = ${answer}$ AU.`,
          trap: 'Find the semi-latus rectum from the perihelion first: $p = r_p(1 + e)$.' };
      },
      verify: (p) => p.rp * (1 + p.e) / (1 + p.e * Math.cos(p.th * Math.PI / 180)) },
  ],
};
