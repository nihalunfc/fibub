// Gravitation: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const r = String.raw;
const EX = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const G = 6.67e-11; const g0 = 9.8; const RE = 6.4e6; // Earth's radius 6400 km; GM = g0 RE^2
let k = 0; let c = 0;
const nid = () => `gr-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: EX[level], sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
// numeric answer worked out in code (fn), rounded to dp places; tol 0 means a whole number
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const CONST = r`Unless stated, take $g = 9.8\ \mathrm{m\,s^{-2}}$ and the radius of the Earth $R = 6400$ km.`;

const items = [
  // ---------- Level 1 ----------
  mcq(1, 'Newton\'s law of gravitation', r`The distance between two masses is doubled. The gravitational force between them becomes`, 'one-fourth', ['one-half', 'double', 'four times'],
    r`$F = Gm_1m_2/r^2$ varies as $1/r^2$. Doubling $r$ divides $F$ by $2^2 = 4$.`),
  mcq(1, 'units', r`The SI unit of the universal gravitational constant $G$ is`, r`$\mathrm{N\,m^{2}\,kg^{-2}}$`, [r`$\mathrm{N\,m\,kg^{-1}}$`, r`$\mathrm{N\,kg^{2}\,m^{-2}}$`, r`$\mathrm{N\,m^{-2}\,kg^{2}}$`],
    r`$G = Fr^2/(m_1m_2)$, so the unit is $\mathrm{N\,m^2/kg^2}$. Its value is $6.67\times10^{-11}$ in these units.`),
  nat(1, 'weight', r`Find the weight of a 20 kg body at the Earth's surface (in N, $g = 9.8\ \mathrm{m\,s^{-2}}$).`, () => 20 * 9.8, 0.01, 1,
    r`$W = mg = 20\times9.8 = 196$ N.`, { unit: 'N' }),
  mcq(1, 'acceleration due to gravity', r`The acceleration due to gravity on the surface of the Moon is nearly`, r`$\tfrac16$ of that on the Earth`, [r`the same as on the Earth`, r`$\tfrac12$ of that on the Earth`, r`6 times that on the Earth`],
    r`The Moon's surface gravity is $1.62\ \mathrm{m\,s^{-2}}$, compared with $9.8\ \mathrm{m\,s^{-2}}$ on the Earth: about one-sixth. (Its mass is $\tfrac1{81}$ and its radius $\tfrac{11}{40}$ of the Earth's, which gives the same ratio.)`),
  mcq(1, 'Kepler\'s laws', r`Kepler's second law (equal areas in equal times) is a consequence of`, 'conservation of angular momentum', ['conservation of energy', 'conservation of linear momentum', 'the inverse-square nature of the force alone'],
    r`The gravitational force on a planet is central, so its torque about the Sun is zero and angular momentum is constant. The areal speed $dA/dt = L/2m$ is then constant. It would hold for any central force, not only an inverse-square force.`),
  mcq(1, 'Kepler\'s laws', r`According to Kepler's third law, for planets around the Sun,`, r`$T^2\propto a^3$`, [r`$T\propto a^2$`, r`$T^3\propto a^2$`, r`$T\propto a$`],
    r`The square of the period is proportional to the cube of the semi-major axis: $T^2\propto a^3$.`),
  mcq(1, 'satellites', r`A geostationary satellite has a period of`, '24 hours, and moves from west to east in the equatorial plane', ['12 hours, over the poles', '24 hours, from east to west', '90 minutes, near the surface'],
    r`To stay above one point, it must turn once in 24 h in the same sense as the Earth's rotation (west to east) and lie above the equator.`),
  mcq(1, 'weightlessness', r`An astronaut inside a spacecraft orbiting the Earth feels weightless because`, 'both she and the spacecraft are in free fall with the same acceleration', ['there is no gravity at that height', 'the spacecraft is outside the Earth\'s atmosphere', 'the Moon cancels the Earth\'s pull'],
    r`At a height of a few hundred km gravity is still about 90 % of its surface value. The astronaut and craft fall together around the Earth, so there is no contact force between them and she feels no weight.`, { trap: 'Weightless does not mean "no gravity".' }),
  nat(1, 'orbital speed', r`Find the orbital speed of a satellite orbiting very close to the Earth's surface (in km/s, $g = 9.8\ \mathrm{m\,s^{-2}}$, $R = 6400$ km, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6) / 1000, 0.02, 2,
    r`Near the surface, $mg = mv^2/R$, so $v = \sqrt{gR} = \sqrt{9.8\times6.4\times10^6} = 7.92\times10^3\ \mathrm{m\,s^{-1}} = 7.92$ km/s.`, { unit: 'km/s' }),
  mcq(1, 'gravitational force', r`The gravitational force between two masses is`, 'always attractive', ['sometimes repulsive', 'attractive only for large masses', 'zero inside matter'],
    r`There is no negative mass, so the gravitational force between any two masses is attractive. It acts along the line joining them and is a conservative, central force.`),
  mcq(1, 'acceleration due to gravity', r`Treating the Earth as a uniform sphere, the acceleration due to gravity at the centre of the Earth is`, 'zero', ['maximum', 'equal to its surface value', 'infinite'],
    r`Inside a uniform sphere $g = g_0\,r/R$, which is zero at the centre. (The pulls from all sides cancel.)`),
  nat(1, 'escape speed', r`Find the escape speed from the Earth using $g = 10\ \mathrm{m\,s^{-2}}$ and $R = 6.4\times10^6$ m (in km/s, 2 decimals).`, () => Math.sqrt(2 * 10 * 6.4e6) / 1000, 0.02, 2,
    r`$v_e = \sqrt{2gR} = \sqrt{2\times10\times6.4\times10^6} = \sqrt{1.28\times10^8} = 1.131\times10^4\ \mathrm{m\,s^{-1}} = 11.31$ km/s.`, { unit: 'km/s' }),
  mcq(1, 'dimensions', r`The dimensional formula of the gravitational constant $G$ is`, r`$\mathrm{M^{-1}L^{3}T^{-2}}$`, [r`$\mathrm{M^{-1}L^{2}T^{-2}}$`, r`$\mathrm{ML^{3}T^{-2}}$`, r`$\mathrm{M^{-1}L^{3}T^{-1}}$`],
    r`$G = Fr^2/m^2 = \dfrac{\mathrm{MLT^{-2}}\cdot\mathrm{L^2}}{\mathrm{M^2}} = \mathrm{M^{-1}L^3T^{-2}}$.`),
  mcq(1, 'field and potential', r`Of gravitational field strength and gravitational potential, the one that is a vector is`, 'the field strength', ['the potential', 'both', 'neither'],
    r`The field $\vec g = -GM\hat r/r^2$ has a direction (towards the mass). The potential $V = -GM/r$ is a scalar.`),

  // ---------- Level 2 ----------
  nat(2, 'Newton\'s law of gravitation', r`Two 10 kg masses are 1 m apart. Find the gravitational force between them (in units of $10^{-9}$ N, 2 decimals; $G = 6.67\times10^{-11}$ SI).`, () => G * 10 * 10 / 1 / 1e-9, 0.01, 2,
    r`$F = \dfrac{Gm_1m_2}{r^2} = \dfrac{6.67\times10^{-11}\times100}{1} = 6.67\times10^{-9}$ N.`, { unit: '×10⁻⁹ N' }),
  nat(2, 'variation of g with height', r`Find the acceleration due to gravity at a height equal to the Earth's radius above the surface (in $\mathrm{m\,s^{-2}}$, $g = 9.8$ at the surface).`, () => 9.8 / 4, 0.01, 2,
    r`At height $h$, $g' = g\left(\dfrac{R}{R + h}\right)^2$. With $h = R$: $g' = g/4 = 2.45\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'The distance from the centre is $2R$, not $R$.' }),
  nat(2, 'variation of g with depth', r`Find $g$ at a depth equal to half the Earth's radius (in $\mathrm{m\,s^{-2}}$, $g = 9.8$ at the surface, uniform Earth).`, () => 9.8 * 0.5, 0.01, 2,
    r`Inside a uniform sphere $g' = g\left(1 - \dfrac dR\right)$. With $d = R/2$: $g' = g/2 = 4.9\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Do not use the "height" formula for depth.' }),
  nat(2, 'surface gravity of planets', r`A planet has 8 times the Earth's mass and twice its radius. Find the weight of a 60 kg person there (in N, $g_{Earth} = 9.8$).`, () => 60 * 9.8 * 8 / 4, 0.5, 0,
    r`$g'/g = \dfrac{M'}{M}\left(\dfrac R{R'}\right)^2 = 8\times\dfrac14 = 2$, so $g' = 19.6\ \mathrm{m\,s^{-2}}$. Weight $= 60\times19.6 = 1176$ N.`, { unit: 'N' }),
  nat(2, 'escape speed', r`A planet has twice the mass and half the radius of the Earth. If the escape speed from the Earth is 11.2 km/s, find that from the planet (in km/s).`, () => 11.2 * Math.sqrt(2 / 0.5), 0.05, 1,
    r`$v_e = \sqrt{2GM/R}$, so $v_e'/v_e = \sqrt{\dfrac{M'}{M}\cdot\dfrac R{R'}} = \sqrt{2\times2} = 2$. So $v_e' = 22.4$ km/s.`, { unit: 'km/s' }),
  nat(2, 'Kepler\'s third law', r`Two satellites orbit the same planet. The second orbit has 4 times the radius of the first. The first has a period of 2 h. Find the period of the second (in hours).`, () => 2 * Math.pow(4, 1.5), 0, 0,
    r`$T^2\propto r^3$, so $T\propto r^{3/2}$. $T_2 = 2\times4^{3/2} = 2\times8 = 16$ h.`, { unit: 'h' }),
  nat(2, 'gravitational potential energy', r`Find the gravitational potential energy of a 2 kg mass at the Earth's surface (in MJ; take the zero at infinity, $g = 9.8$, $R = 6400$ km).`, () => -2 * 9.8 * 6.4e6 / 1e6, 0.05, 2,
    r`$U = -\dfrac{GMm}{R} = -mgR$ (since $GM = gR^2$) $= -2\times9.8\times6.4\times10^6 = -1.254\times10^8$ J $= -125.44$ MJ.`, { unit: 'MJ' }),
  nat(2, 'Kepler\'s third law', r`A planet orbits the Sun at 4 times the Earth's distance. Find its period (in years).`, () => Math.pow(4, 1.5), 0, 0,
    r`$T^2\propto r^3$ with $T_E = 1$ year: $T = 4^{3/2} = 8$ years.`, { unit: 'years' }),
  mcq(2, 'satellites', r`The ratio of the escape speed to the orbital speed (close to the surface) of a satellite is`, r`$\sqrt2$`, [r`$2$`, r`$\tfrac1{\sqrt2}$`, r`$1$`],
    r`$v_e = \sqrt{2GM/R}$ and $v_o = \sqrt{GM/R}$, so $v_e/v_o = \sqrt2$. A satellite in a circular orbit needs a boost of $(\sqrt2 - 1)v_o$ to escape.`),
  nat(2, 'satellite energy', r`A 100 kg satellite moves in a circular orbit of radius $2R$ about the Earth. Find its total energy (in MJ, $g = 9.8$, $R = 6400$ km).`, () => -9.8 * 6.4e6 * 100 / 4 / 1e6, 0.5, 0,
    r`$E = -\dfrac{GMm}{2r} = -\dfrac{gR^2m}{2(2R)} = -\dfrac{gRm}4 = -\dfrac{9.8\times6.4\times10^6\times100}{4} = -1.568\times10^9$ J $= -1568$ MJ.`, { unit: 'MJ', trap: 'The total energy is negative, and half the potential energy.' }),
  mcq(2, 'variation of g with latitude', r`The value of $g$ at sea level is least at the equator and greatest at the poles. The main reason is`, 'the rotation of the Earth (and the equatorial bulge)', ['the Earth\'s atmosphere is thicker at the equator', 'the Sun\'s pull is greatest at the equator', 'the Earth is a perfect sphere'],
    r`At the equator the centrifugal effect is $\omega^2R$ (about $0.034\ \mathrm{m\,s^{-2}}$), which reduces the effective $g$. At the poles it is zero. The Earth is also slightly flattened, so poles are nearer the centre.`),
  nat(2, 'satellites', r`Find the period of a satellite orbiting just above the Earth's surface (in minutes, $g = 9.8$, $R = 6400$ km, 1 decimal).`, () => 2 * Math.PI * Math.sqrt(6.4e6 / 9.8) / 60, 0.1, 1,
    r`$T = 2\pi\sqrt{R/g} = 2\pi\sqrt{6.4\times10^6/9.8} = 2\pi\times808.1 = 5077$ s $= 84.6$ min.`, { unit: 'min' }),
  mcq(2, 'escape speed', r`The escape speed of a body from the Earth does NOT depend on`, 'the mass of the body', ['the mass of the Earth', 'the radius of the Earth', 'the value of $G$'],
    r`$v_e = \sqrt{2GM/R}$ has $M$, $R$ and $G$ but no mass of the projectile. A rocket and a pebble have the same escape speed (the pebble needs less energy, though).`),
  nat(2, 'escape speed', r`Find the escape speed from the Moon (in km/s, $g_{Moon} = 1.6\ \mathrm{m\,s^{-2}}$, $R_{Moon} = 1.74\times10^6$ m, 2 decimals).`, () => Math.sqrt(2 * 1.6 * 1.74e6) / 1000, 0.02, 2,
    r`$v_e = \sqrt{2g_mR_m} = \sqrt{2\times1.6\times1.74\times10^6} = \sqrt{5.568\times10^6} = 2360\ \mathrm{m\,s^{-1}} = 2.36$ km/s. This is why the Moon cannot hold an atmosphere.`, { unit: 'km/s' }),
  nat(2, 'gravitational potential energy', r`Find the work needed to take a 1 kg mass from the Earth's surface to infinity (in MJ, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => 9.8 * 6.4e6 / 1e6, 0.05, 2,
    r`Work $= 0 - U_{surface} = +\dfrac{GMm}R = gRm = 9.8\times6.4\times10^6\times1 = 6.272\times10^7$ J $= 62.72$ MJ.`, { unit: 'MJ' }),
  mcq(2, 'surface gravity of planets', r`A planet has the same average density as the Earth but twice the radius. Its surface $g$ is`, r`twice that of the Earth`, [r`the same`, r`four times`, r`eight times`],
    r`$g = \dfrac{GM}{R^2} = \dfrac43\pi G\rho R$. For the same $\rho$, $g\propto R$, so it is $2g$. (The mass is 8 times as large, but $R^2$ is 4 times as large.)`),
  nat(2, 'variation of g with height', r`Find $g$ at a height of 1600 km above the Earth's surface (in $\mathrm{m\,s^{-2}}$, $g = 9.8$ at the surface, $R = 6400$ km, 2 decimals).`, () => 9.8 * Math.pow(6400 / 8000, 2), 0.01, 2,
    r`$g' = g\left(\dfrac R{R + h}\right)^2 = 9.8\times\left(\dfrac{6400}{8000}\right)^2 = 9.8\times0.64 = 6.27\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Add the height to the radius before taking the ratio.' }),
  nat(2, 'gravitational potential', r`Find the gravitational potential at the Earth's surface (in MJ/kg, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => -9.8 * 6.4e6 / 1e6, 0.05, 2,
    r`$V = -\dfrac{GM}R = -gR = -9.8\times6.4\times10^6 = -6.272\times10^7\ \mathrm{J\,kg^{-1}} = -62.72\ \mathrm{MJ\,kg^{-1}}$. Potential is energy per unit mass, so there is no $m$ in it.`, { unit: 'MJ/kg' }),
  nat(2, 'satellites', r`Two satellites orbit the Earth in circles of radii $r$ and $4r$. Find the ratio of the orbital speed of the first to that of the second.`, () => Math.sqrt(4), 0, 0,
    r`$v = \sqrt{GM/r}$, so $v_1/v_2 = \sqrt{4r/r} = 2$. A satellite in a smaller orbit moves faster.`),
  mcq(2, 'satellites', r`Which statement about a satellite in a circular orbit is NOT correct?`, 'Its orbital speed increases when its mass increases', ['Its orbital speed decreases when the orbit becomes larger', 'Its period increases when the orbit becomes larger', 'Its total energy is negative'],
    r`$v = \sqrt{GM/r}$ has no mass of the satellite in it: a heavier satellite in the same orbit has the same speed. The other three are correct.`, { trap: 'The satellite\'s mass cancels.' }),
  stm(2, 'gravitational field', r`The gravitational field of a point mass is a vector pointing towards the mass.`, r`The gravitational potential of a point mass is a vector pointing towards the mass.`, 2,
    r`I is true: $\vec g = -GM\hat r/r^2$. II is false: the potential $-GM/r$ is a scalar.`),
  nat(2, 'Kepler\'s second law', r`A planet moves in an ellipse. At its closest point to the Sun, its speed is 30 km/s and its distance is $1.5\times10^{11}$ m. Find its speed when it is at $3.0\times10^{11}$ m from the Sun at the farthest point (in km/s).`, () => 30 * 1.5 / 3.0, 0.1, 1,
    r`At the extreme points the velocity is perpendicular to the radius, so $L = mvr$ is conserved: $v_1r_1 = v_2r_2$. $v_2 = 30\times\dfrac{1.5}{3.0} = 15$ km/s.`, { unit: 'km/s' }),

  // ---------- Level 3 ----------
  nat(2, 'variation of g with height', r`At what height above the Earth's surface is $g$ one-ninth of its surface value (in km, $R = 6400$ km)?`, () => 2 * 6400, 0, 0,
    r`$g' = g\left(\dfrac R{R + h}\right)^2 = \dfrac g9$ gives $\dfrac R{R + h} = \dfrac13$, so $R + h = 3R$ and $h = 2R = 12\,800$ km.`, { unit: 'km', trap: 'The distance from the centre is $3R$, so the height is $2R$.' }),
  nat(2, 'variation of g with depth', r`At what depth below the surface of a uniform Earth is $g$ one-quarter of its surface value (in km, $R = 6400$ km)?`, () => 0.75 * 6400, 0, 0,
    r`$g' = g(1 - d/R) = g/4$ gives $d = \tfrac34R = 4800$ km.`, { unit: 'km' }),
  nat(3, 'variation of g with latitude', r`The angular speed of the Earth's rotation is $7.27\times10^{-5}\ \mathrm{rad\,s^{-1}}$. Find the reduction in $g$ at the equator due to rotation (in units of $10^{-2}\ \mathrm{m\,s^{-2}}$, $R = 6400$ km, 2 decimals).`, () => (7.27e-5) ** 2 * 6.4e6 / 1e-2, 0.02, 2,
    r`Reduction $= \omega^2R = (7.27\times10^{-5})^2\times6.4\times10^6 = 5.285\times10^{-9}\times6.4\times10^6 = 3.38\times10^{-2}\ \mathrm{m\,s^{-2}}$.`, { unit: '×10⁻² m/s²' }),
  nat(3, 'variation of g with latitude', r`How long should the Earth's day be so that a body at the equator is just weightless (in hours, $g = 9.8$, $R = 6400$ km, 2 decimals)?`, () => 2 * Math.PI * Math.sqrt(6.4e6 / 9.8) / 3600, 0.01, 2,
    r`Weightless means $g - \omega^2R = 0$, so $\omega = \sqrt{g/R}$ and $T = 2\pi\sqrt{R/g} = 5077$ s $= 1.41$ h. The Earth would have to spin 17 times faster.`, { unit: 'h' }),
  nat(3, 'orbital speed', r`Find the orbital speed of a satellite whose orbit has radius $3R$ about the Earth (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6 / 3) / 1000, 0.02, 2,
    r`$v = \sqrt{\dfrac{GM}{r}} = \sqrt{\dfrac{gR^2}{3R}} = \sqrt{\dfrac{gR}3} = \sqrt{2.09\times10^7} = 4572\ \mathrm{m\,s^{-1}} = 4.57$ km/s.`, { unit: 'km/s' }),
  nat(3, 'escape speed', r`Find the escape speed of a rocket from a point at a height equal to the Earth's radius above the surface (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6) / 1000, 0.02, 2,
    r`Here the distance from the centre is $2R$: $v_e = \sqrt{\dfrac{2GM}{2R}} = \sqrt{gR} = 7.92$ km/s.`, { unit: 'km/s', trap: 'The distance in the formula is from the centre.' }),
  nat(3, 'satellite energy', r`How much energy must be supplied to put a 500 kg satellite into a circular orbit at a height equal to the Earth's radius, starting from rest on the surface (in GJ, ignoring the Earth's rotation, $g = 9.8$, $R = 6400$ km, 2 decimals)?`, () => 0.75 * 9.8 * 6.4e6 * 500 / 1e9, 0.05, 2,
    r`On the surface: $E_i = -\dfrac{GMm}R = -gRm$. In orbit of radius $2R$: $E_f = -\dfrac{GMm}{4R} = -\dfrac{gRm}4$. $\Delta E = \tfrac34gRm = 0.75\times9.8\times6.4\times10^6\times500 = 2.35\times10^{10}$ J $= 23.52$ GJ.`, { unit: 'GJ', trap: 'The satellite also needs kinetic energy in orbit; $mgh$ alone is not enough.' }),
  nat(3, 'binary stars', r`Two stars, each of mass $2\times10^{30}$ kg, orbit their common centre of mass, $1.5\times10^{11}$ m apart. Find their orbital period (in days, 1 decimal, $G = 6.67\times10^{-11}$ SI).`, () => 2 * Math.PI * Math.sqrt(Math.pow(1.5e11, 3) / (2 * 6.67e-11 * 2e30)) / 86400, 1, 0,
    r`Each moves on a circle of radius $d/2$. Gravity gives the centripetal force: $\dfrac{GM^2}{d^2} = M\omega^2\dfrac d2$, so $\omega^2 = \dfrac{2GM}{d^3}$. $T = 2\pi\sqrt{\dfrac{d^3}{2GM}} = 2\pi\sqrt{\dfrac{3.375\times10^{33}}{2.668\times10^{20}}} = 2.235\times10^7$ s $= 258.6$ days.`, { unit: 'days', trap: 'Use $d/2$ for the radius but $d$ for the separation in the force.' }),
  nat(2, 'Kepler\'s second law', r`A comet's speed at its closest point to the Sun is 30 km/s. At its farthest point, the distance from the Sun is 4 times as large. Find its speed there (in km/s).`, () => 30 / 4, 0.01, 2,
    r`Angular momentum $mvr$ is conserved at the two extreme points: $v_{far} = v_{near}\,r_{near}/r_{far} = 30/4 = 7.5$ km/s.`, { unit: 'km/s' }),
  mcq(3, 'satellite energy', r`A satellite is moved from a circular orbit to a higher circular orbit. Which is correct?`, 'Its kinetic energy decreases and its total energy increases', ['Its kinetic energy increases and its total energy decreases', 'Its kinetic energy and its potential energy both increase', 'Its kinetic energy and its total energy both increase'],
    r`In a circular orbit $K = GMm/2r$, $U = -GMm/r$ and $E = -GMm/2r$. As $r$ grows, $K$ falls, $U$ rises (less negative) and $E$ rises (less negative). Speed falls even though energy was added.`, { trap: 'Adding energy lowers the speed in a bigger circular orbit.' }),
  nat(3, 'satellite energy', r`A 1000 kg satellite is moved from a circular orbit of radius $2R$ to one of radius $4R$. Find the extra energy needed (in GJ, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => 9.8 * 6.4e6 * 1000 / 8 / 1e9, 0.01, 2,
    r`$\Delta E = \dfrac{GMm}{2}\left(\dfrac1{2R} - \dfrac1{4R}\right) = \dfrac{gR^2m}{2}\cdot\dfrac1{4R} = \dfrac{gRm}8 = \dfrac{9.8\times6.4\times10^6\times1000}{8} = 7.84\times10^9$ J.`, { unit: 'GJ' }),
  nat(3, 'gravitational field of a solid sphere', r`A uniform solid sphere has mass 90 kg and radius 1 m. Find the gravitational field at 0.5 m from its centre (in units of $10^{-9}\ \mathrm{N\,kg^{-1}}$, 2 decimals, $G = 6.67\times10^{-11}$).`, () => 6.67e-11 * 90 * 0.5 / 1 / 1e-9, 0.02, 2,
    r`Inside a uniform solid sphere $g = \dfrac{GMr}{R^3} = \dfrac{6.67\times10^{-11}\times90\times0.5}{1} = 3.0\times10^{-9}\ \mathrm{N\,kg^{-1}}$. Using $GM/r^2$ would give four times this.`, { unit: '×10⁻⁹ N/kg', trap: 'Inside the sphere only the mass within radius $r$ counts, and the field is proportional to $r$.' }),
  nat(3, 'gravitational potential energy', r`Three 1 kg masses sit at the corners of an equilateral triangle of side 1 m. Find the total gravitational potential energy of the system (in units of $10^{-10}$ J, 2 decimals, $G = 6.67\times10^{-11}$).`, () => -3 * 6.67e-11 / 1e-10, 0.01, 2,
    r`There are three pairs, each with $-Gm^2/a = -6.67\times10^{-11}$ J. Total $= -2.0\times10^{-10}$ J.`, { unit: '×10⁻¹⁰ J', trap: 'Count each pair once.' }),
  mcq(3, 'satellites', r`A satellite orbiting the Earth slowly loses energy to air resistance. Its orbit shrinks and its speed`, 'increases', ['decreases', 'stays the same', 'first increases then decreases'],
    r`In a circular orbit $E = -K$. Losing energy makes $E$ more negative, so $K$ (and the speed) increases. The drag acts backward, but the pull of gravity along the path, as the orbit spirals in, speeds the satellite up.`, { trap: 'Drag speeds the satellite up as the orbit shrinks.' }),
  nat(3, 'mixed', r`A pendulum clock beats seconds at the Earth's surface (period 2 s). It is taken to a height equal to the Earth's radius. Find the new period (in s).`, () => 2 * 2, 0, 0,
    r`$T = 2\pi\sqrt{l/g'}$, and $g' = g/4$ at height $R$, so $T' = T\sqrt{g/g'} = 2\times2 = 4$ s. The clock runs slow.`, { unit: 's' }),
  nat(3, 'variation of g with latitude', r`Find the reduction in $g$ at latitude $60^\circ$ due to the Earth's rotation (in units of $10^{-3}\ \mathrm{m\,s^{-2}}$, $\omega = 7.27\times10^{-5}$ rad/s, $R = 6400$ km, 2 decimals).`, () => (7.27e-5) ** 2 * 6.4e6 * 0.25 / 1e-3, 0.05, 2,
    r`The effective $g' = g - \omega^2R\cos^2\lambda$. The reduction is $\omega^2R\cos^260^\circ = 3.38\times10^{-2}\times\tfrac14 = 8.46\times10^{-3}\ \mathrm{m\,s^{-2}}$.`, { unit: '×10⁻³ m/s²', trap: 'The factor is $\\cos^2\\lambda$, not $\\cos\\lambda$.' }),
  nat(3, 'satellites', r`Find the radius of the orbit of a geostationary satellite (in $10^3$ km, 1 decimal; $g = 9.8$, $R = 6400$ km, period 24 h).`, () => Math.cbrt(9.8 * 6.4e6 * 6.4e6 * 86400 ** 2 / (4 * Math.PI ** 2)) / 1e6, 0.1, 1,
    r`$\dfrac{GMm}{r^2} = m\omega^2r$ gives $r^3 = \dfrac{GMT^2}{4\pi^2} = \dfrac{gR^2T^2}{4\pi^2}$. $r^3 = \dfrac{9.8\times(6.4\times10^6)^2\times(86400)^2}{39.48} = 7.59\times10^{22}$, so $r = 4.23\times10^7$ m $= 42.3\times10^3$ km (about 5.6$R$; height about 36 000 km).`, { unit: '×10³ km', trap: 'This is the radius from the centre, not the height above the surface.' }),
  nat(3, 'escape speed', r`A rocket is fired from the equator, due east, to escape. The Earth's surface speed there is 0.465 km/s and the escape speed (non-rotating) is 11.2 km/s. Find the least launch speed relative to the ground (in km/s, 3 decimals).`, () => 11.2 - 0.465, 0.01, 3,
    r`The rocket already has 0.465 km/s eastward from the Earth's spin, so relative to the ground it needs $11.2 - 0.465 = 10.735$ km/s.`, { unit: 'km/s' }),
  nat(3, 'projectile', r`A body is projected upward from the Earth's surface with a speed equal to half the escape speed. Find the greatest height it reaches (in km, $R = 6400$ km).`, () => 6400 / 3, 1, 0,
    r`Energy: $\tfrac12mv^2 - \dfrac{GMm}R = -\dfrac{GMm}{R + h}$. With $v^2 = \tfrac14\cdot\dfrac{2GM}R = \dfrac{GM}{2R}$: $\dfrac{GM}{4R} - \dfrac{GM}R = -\dfrac{GM}{R + h}$, so $\dfrac34R^{-1} = (R + h)^{-1}$, $R + h = \dfrac43R$ and $h = \dfrac R3 = 2133$ km.`, { unit: 'km', trap: 'The constant-$g$ formula is wrong at large heights; use energy with $-GMm/r$.' }),
  mcq(3, 'gravitational potential', r`Inside a thin uniform spherical shell of mass $M$ and radius $R$, the gravitational potential is`, r`constant, equal to $-GM/R$`, [r`zero`, r`$-GM/r$, where $r$ is the distance from the centre`, r`infinite at the centre`],
    r`The field inside is zero, so the potential does not change with position: it equals the value at the surface, $-GM/R$. It is not zero (zero field does not mean zero potential).`, { trap: 'Zero field means constant potential, not zero potential.' }),
  nat(3, 'gravitational potential', r`Find the ratio of the potential at the centre of a uniform solid sphere to the potential at its surface.`, () => 1.5, 0.01, 2,
    r`Inside: $V(r) = -\dfrac{GM}{2R^3}(3R^2 - r^2)$. At the centre $V = -\dfrac{3GM}{2R}$. At the surface $V = -\dfrac{GM}R$. Ratio $= 1.5$.`),
  nat(2, 'mass of the Earth', r`Find the mass of the Earth from $g = 9.8\ \mathrm{m\,s^{-2}}$ and $R = 6.4\times10^6$ m (in units of $10^{24}$ kg, $G = 6.67\times10^{-11}$, 2 decimals).`, () => 9.8 * 6.4e6 ** 2 / 6.67e-11 / 1e24, 0.02, 2,
    r`$g = GM/R^2$, so $M = \dfrac{gR^2}G = \dfrac{9.8\times4.096\times10^{13}}{6.67\times10^{-11}} = 6.02\times10^{24}$ kg.`, { unit: '×10²⁴ kg' }),
  nat(3, 'satellites', r`The Moon orbits the Earth at a distance of $3.84\times10^8$ m. Taking $GM_{Earth} = 3.986\times10^{14}\ \mathrm{m^3\,s^{-2}}$, find its orbital speed (in m/s).`, () => Math.sqrt(3.986e14 / 3.84e8), 2, 0,
    r`$v = \sqrt{GM/r} = \sqrt{3.986\times10^{14}/3.84\times10^8} = \sqrt{1.038\times10^6} = 1019\ \mathrm{m\,s^{-1}}$. (Check: $2\pi r/T$ with $T = 27.3$ days gives $1.02$ km/s.)`, { unit: 'm/s' }),
  nat(3, 'gravitational potential energy', r`How much work is done against gravity in raising a 1 kg mass from the Earth's surface to a height $R/2$ (in MJ, $g = 9.8$, $R = 6400$ km, 2 decimals)?`, () => 9.8 * 6.4e6 / 3 / 1e6, 0.05, 2,
    r`$\Delta U = GMm\left(\dfrac1R - \dfrac1{1.5R}\right) = \dfrac{GMm}{3R} = \dfrac{gRm}3 = 2.09\times10^7$ J $= 20.91$ MJ. The formula $mgh$ would give $9.8\times3.2\times10^6 = 31.4$ MJ, which is too large because $g$ falls with height.`, { unit: 'MJ', trap: '$mgh$ overestimates the work at large heights.' }),
  nat(3, 'falling from a height', r`A body is released from rest at a height $3R$ above the Earth's surface and falls freely (no air). Find its speed on reaching the surface (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => Math.sqrt(1.5 * 9.8 * 6.4e6) / 1000, 0.02, 2,
    r`Distance from the centre at the start: $4R$. Energy: $\tfrac12v^2 = GM\left(\dfrac1R - \dfrac1{4R}\right) = \dfrac34gR$, so $v^2 = \tfrac32gR$ and $v = \sqrt{1.5\times9.8\times6.4\times10^6} = 9.70$ km/s. The value $\sqrt{2g(3R)} = 20$ km/s from the constant-$g$ formula is far too high.`, { unit: 'km/s' }),

  // ---------- Level 4 ----------
  nat(4, 'tunnel through the Earth', r`A narrow tunnel is dug through the centre of a uniform Earth and a stone is dropped from the surface. Find its speed at the centre (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6) / 1000, 0.02, 2,
    r`The potential is $-GM/R$ at the surface and $-\tfrac32GM/R$ at the centre. Energy: $\tfrac12v^2 = \tfrac12GM/R$, so $v^2 = GM/R = gR$ and $v = 7.92$ km/s.`, { unit: 'km/s', trap: 'Inside the Earth $g$ changes with depth, so $\\sqrt{2gR}$ is wrong.' }),
  nat(4, 'binary stars', r`Two identical stars, each of mass $4\times10^{30}$ kg, are released from rest $1.0\times10^{12}$ m apart. Find the speed of each when they are $5.0\times10^{11}$ m apart (in km/s, 1 decimal, $G = 6.67\times10^{-11}$).`, () => Math.sqrt(6.67e-11 * 4e30 / 1e12) / 1000, 0.1, 1,
    r`Energy: loss in potential energy $= GM^2\left(\dfrac1{d/2} - \dfrac1d\right) = \dfrac{GM^2}d = 2\times\tfrac12Mv^2$. So $v = \sqrt{GM/d} = \sqrt{6.67\times10^{-11}\times4\times10^{30}/10^{12}} = 1.63\times10^4\ \mathrm{m\,s^{-1}} = 16.3$ km/s.`, { unit: 'km/s' }),
  nat(4, 'satellites', r`A satellite is in a circular orbit of radius $2R$. By what additional speed must it be boosted, along its motion, to escape (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals)?`, () => (Math.SQRT2 - 1) * Math.sqrt(9.8 * 6.4e6 / 2) / 1000, 0.02, 2,
    r`Orbital speed at $2R$: $v_o = \sqrt{GM/2R} = \sqrt{gR/2} = 5.60$ km/s. Escape speed there: $\sqrt2v_o$. Extra $= (\sqrt2 - 1)v_o = 0.414\times5.60 = 2.32$ km/s.`, { unit: 'km/s' }),
  nat(4, 'elliptical orbits', r`A satellite moves in an ellipse about the Earth with perigee radius 7000 km and apogee radius 21 000 km. Taking $GM = 4.0\times10^{14}\ \mathrm{m^3\,s^{-2}}$, find its speed at perigee (in km/s, 2 decimals).`, () => Math.sqrt(2 * 4e14 * 21e6 / (7e6 * 28e6)) / 1000, 0.02, 2,
    r`Conservation of angular momentum: $v_pr_p = v_ar_a$. Energy: $\tfrac12v_p^2 - \dfrac{GM}{r_p} = \tfrac12v_a^2 - \dfrac{GM}{r_a}$. Solving: $v_p^2 = \dfrac{2GMr_a}{r_p(r_a + r_p)} = \dfrac{2\times4\times10^{14}\times2.1\times10^7}{7\times10^6\times2.8\times10^7} = 8.57\times10^7$, so $v_p = 9.26$ km/s.`, { unit: 'km/s' }),
  nat(4, 'binary stars', r`Two stars of masses $M$ and $2M$ orbit their common centre of mass. Find the ratio of the kinetic energy of the lighter star to that of the heavier one.`, () => 2, 0, 0,
    r`The centre of mass is fixed, so $Mv_1 = 2Mv_2$ and $v_1 = 2v_2$. $K_1/K_2 = \dfrac{\tfrac12Mv_1^2}{\tfrac12(2M)v_2^2} = \dfrac{4}{2} = 2$. The lighter star moves faster and has more energy.`),
  nat(4, 'gravitational field of a solid sphere', r`A uniform planet of radius 1000 km has a surface gravity of $12\ \mathrm{m\,s^{-2}}$. It has a spherical cavity whose centre is 400 km from the planet's centre. Find the gravitational field inside the cavity (in $\mathrm{m\,s^{-2}}$, 2 decimals).`, () => 12 * 0.4, 0.01, 2,
    r`Treat the cavity as a full sphere (field $\propto\vec r$) plus a negative sphere of the same density in the cavity. The field is $\vec g = -\dfrac{GM}{R^3}\vec r + \dfrac{GM}{R^3}\vec r'$, i.e. $\vec g = -\dfrac{GM}{R^3}\vec d$ where $\vec d$ is the vector from the planet's centre to the cavity's centre. The field is uniform with magnitude $\dfrac{GM}{R^3}d = g_s\dfrac dR = 12\times0.4 = 4.8\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²', trap: 'Inside a cavity the field is uniform, and does not depend on the cavity\'s size.' }),
  nat(4, 'elliptical orbits', r`A satellite at distance $r_0$ from the Earth's centre, moving at half the circular-orbit speed for that distance, is moving at right angles to the radius. Find $r_0/r_{min}$, where $r_{min}$ is its closest approach.`, () => 7, 0, 0,
    r`At $r_0$ the speed is $v = \tfrac12\sqrt{GM/r_0}$. Let the closest distance be $r_p$ with $x = r_0/r_p$. Angular momentum: $v_p = vx$. Energy: $\tfrac12v^2 - \dfrac{GM}{r_0} = \tfrac12v^2x^2 - \dfrac{GM}{r_p}$. With $v^2 = \dfrac{GM}{4r_0}$: $\dfrac1{8} - 1 = \dfrac{x^2}8 - x$, so $x^2 - 8x + 7 = 0$, giving $x = 7$ or $1$. The root $x = 1$ is the starting point itself, so $r_0/r_p = 7$.`, { trap: 'One root of the quadratic is the point you started from.' }),
  nat(4, 'ring', r`A particle is released from rest on the axis of a thin ring of mass $1.5\times10^{10}$ kg and radius 10 m, at a distance of $10\sqrt3$ m from its centre. Find its speed on passing through the centre (in $\mathrm{m\,s^{-1}}$, 3 decimals; $G = 6.67\times10^{-11}$).`, () => Math.sqrt(6.67e-11 * 1.5e10 / 10), 0.002, 3,
    r`Potential on the axis at distance $x$: $V = -\dfrac{GM}{\sqrt{a^2 + x^2}}$. Start: $x = \sqrt3a$, so $V = -\dfrac{GM}{2a}$. Centre: $V = -\dfrac{GM}a$. $\tfrac12v^2 = \dfrac{GM}{a} - \dfrac{GM}{2a} = \dfrac{GM}{2a}$, so $v = \sqrt{GM/a} = \sqrt{6.67\times10^{-11}\times1.5\times10^{10}/10} = 0.316\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'satellites', r`Find the orbital speed of a geostationary satellite (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, () => 2 * Math.PI * Math.cbrt(9.8 * 6.4e6 ** 2 * 86400 ** 2 / (4 * Math.PI ** 2)) / 86400 / 1000, 0.02, 2,
    r`The orbit radius is $r = \left(\dfrac{gR^2T^2}{4\pi^2}\right)^{1/3} = 4.23\times10^7$ m. $v = \dfrac{2\pi r}T = \dfrac{2\pi\times4.234\times10^7}{86400} = 3.08\times10^3\ \mathrm{m\,s^{-1}} = 3.08$ km/s. This is less than the 7.9 km/s of a low orbit, as a higher orbit is slower.`, { unit: 'km/s' }),
  nat(4, 'variation of g with latitude', r`By what percentage is the weight of a body at the equator less than at the pole, due only to the Earth's rotation ($\omega = 7.27\times10^{-5}$ rad/s, $R = 6400$ km, $g = 9.8$, 2 decimals)?`, () => (7.27e-5) ** 2 * 6.4e6 / 9.8 * 100, 0.01, 2,
    r`$\dfrac{\omega^2R}{g} = \dfrac{3.38\times10^{-2}}{9.8} = 3.45\times10^{-3}$, i.e. 0.35 %.`, { unit: '%' }),
  nat(4, 'gravitational field', r`The Earth's mass is 81 times that of the Moon, and their centres are $3.84\times10^8$ m apart. Find the distance from the Earth's centre of the point on the line joining them where the net gravitational field is zero (in units of $10^8$ m, 2 decimals).`, () => 3.84 * 9 / 10, 0.01, 2,
    r`Let the point be $x$ from the Earth. $\dfrac{GM_E}{x^2} = \dfrac{GM_E/81}{(d - x)^2}$ gives $\dfrac{d - x}x = \dfrac19$, so $x = 0.9d = 3.456\times10^8$ m.`, { unit: '×10⁸ m', trap: 'Take the square root of the mass ratio.' }),
  nat(4, 'satellites', r`Two satellites of the same mass orbit the Earth in circles of radii $r$ and $2r$. Find the ratio of the angular momentum of the farther one to that of the nearer one (2 decimals).`, () => Math.SQRT2, 0.01, 2,
    r`$L = mvr = m\sqrt{GMr}$, so $L\propto\sqrt r$. The ratio is $\sqrt2 = 1.41$.`),
  nat(4, 'elliptical orbits', r`A satellite is in a circular orbit of radius $r$ and is given a sudden forward boost that raises its speed by a factor 1.2. Find the farthest distance it reaches, as a multiple of $r$ (2 decimals).`, () => 2 / (2 - 1.44) - 1, 0.01, 2,
    r`At the boost point, $v_p = 1.2v_c$ with $v_c^2 = GM/r$. Then $\dfrac{v_p^2}{v_c^2} = 1.44$. The orbit's semi-major axis comes from $E = -\dfrac{GM}{2a}$: $\tfrac12(1.44)v_c^2 - v_c^2 = -\dfrac{v_c^2r}{2a}$, so $\dfrac r{2a} = 0.28$, $2a = 3.571r$, and the apogee is $r_a = 2a - r = 2.57r$.`, { trap: 'A forward boost at a circle makes that point the perigee of the new ellipse.' }),
  nat(4, 'gravitational field', r`A thin uniform rod of mass 6 kg and length 2 m lies along the $x$-axis from $x = 1$ m to $x = 3$ m. Find the gravitational force on a 1 kg mass at the origin (in units of $10^{-10}$ N, 2 decimals, $G = 6.67\times10^{-11}$).`, () => 6.67e-11 * 6 * 1 / (1 * 3) / 1e-10, 0.01, 2,
    r`Take a strip $dx$ at $x$ with mass $\dfrac M L\,dx$. $F = \int_1^3\dfrac{G(M/L)m}{x^2}dx = \dfrac{GMm}{L}\left(\dfrac1{x_1} - \dfrac1{x_2}\right) = \dfrac{GMm}{x_1x_2}$. $F = \dfrac{6.67\times10^{-11}\times6}{1\times3} = 1.33\times10^{-10}$ N.`, { unit: '×10⁻¹⁰ N', trap: 'Do not treat the rod as a point mass at its centre; integrate along it.' }),
  nat(4, 'binary stars', r`Two identical stars, each of mass $2\times10^{30}$ kg, move around their common centre, $2\times10^{11}$ m apart. Find the orbital speed of each (in km/s, 2 decimals, $G = 6.67\times10^{-11}$).`, () => Math.sqrt(6.67e-11 * 2e30 / (2 * 2e11)) / 1000, 0.05, 2,
    r`Radius of each orbit $= d/2$. $\dfrac{GM^2}{d^2} = \dfrac{Mv^2}{d/2}$, so $v = \sqrt{\dfrac{GM}{2d}} = \sqrt{\dfrac{6.67\times10^{-11}\times2\times10^{30}}{4\times10^{11}}} = 1.83\times10^4\ \mathrm{m\,s^{-1}} = 18.26$ km/s.`, { unit: 'km/s' }),
  nat(4, 'satellite energy', r`Air drag brings a 200 kg satellite from a circular orbit of radius $3R$ to one of radius $2R$. Find the energy dissipated (in MJ, $g = 9.8$, $R = 6400$ km, nearest MJ).`, () => 9.8 * 6.4e6 * 200 / 12 / 1e6, 1, 0,
    r`$E = -\dfrac{GMm}{2r}$. $E_{3R} = -\dfrac{gRm}6$ and $E_{2R} = -\dfrac{gRm}4$. Energy lost $= \dfrac{gRm}{12} = \dfrac{9.8\times6.4\times10^6\times200}{12} = 1.045\times10^9$ J $= 1045$ MJ. (Half of the potential energy released speeds the satellite up; the rest is dissipated.)`, { unit: 'MJ' }),

  // ---------- Level 5 ----------
  nat(5, 'orbit change', r`A satellite in a circular orbit of radius $2R$ is to be moved to a circular orbit of radius $4R$ by a two-burn transfer ellipse (perigee $2R$, apogee $4R$). Find the speed increase needed at the first burn (in m/s, $g = 9.8$, $R = 6400$ km, nearest m/s).`, () => (Math.sqrt(2 / 3) - Math.sqrt(0.5)) * Math.sqrt(9.8 * 6.4e6), 2, 0,
    r`Circular speed at $2R$: $v_c = \sqrt{GM/2R}$. Speed at perigee of the ellipse: $v_p^2 = \dfrac{2GMr_a}{r_p(r_a + r_p)} = \dfrac{2GM\times4R}{2R\times6R} = \dfrac{2GM}{3R}$. So $\Delta v = \left(\sqrt{\tfrac23} - \sqrt{\tfrac12}\right)\sqrt{\dfrac{GM}R} = (0.8165 - 0.7071)\times7920 = 866\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The orbital speeds are in terms of $\\sqrt{GM/R}$, and the speed at perigee is for the ellipse.' }),
  nat(5, 'binary stars', r`A binary star system has an orbital period of 1 year. The two stars move in circles about their common centre at speeds of 30 km/s and 10 km/s. Find the mass of the heavier star (in units of $10^{30}$ kg, 2 decimals; $G = 6.67\times10^{-11}$, 1 year $= 3.156\times10^7$ s).`, () => 0.75 * Math.pow(4e4, 3) * 3.156e7 / (2 * Math.PI * 6.67e-11) / 1e30, 0.03, 2,
    r`The orbit radii are $r_i = v_iT/2\pi$ and the separation is $d = r_1 + r_2 = (v_1 + v_2)T/2\pi$. Kepler's law: $M_1 + M_2 = \dfrac{4\pi^2d^3}{GT^2} = \dfrac{(v_1 + v_2)^3T}{2\pi G} = 4.82\times10^{30}$ kg. The centre of mass gives $M_1v_1 = M_2v_2$: the faster star is lighter. $M_{heavy} = \dfrac{v_1}{v_1 + v_2}\times M_{total}$ with $v_1 = 30$ for the lighter, i.e. $\tfrac34\times4.82\times10^{30} = 3.61\times10^{30}$ kg.`, { unit: '×10³⁰ kg', trap: 'The heavier star is the slower one, and the sum of the speeds gives the separation.' }),
  nat(5, 'mixed', r`A smooth straight tunnel is bored between two points on the surface of a uniform Earth (not through the centre). A ball is dropped into one end. Find the time taken to reach the other end (in minutes, 1 decimal, $g = 9.8$, $R = 6400$ km).`, () => Math.PI * Math.sqrt(6.4e6 / 9.8) / 60, 0.1, 1,
    r`Inside the Earth the pull is $mgr/R$ toward the centre. The component along a chord is proportional to the distance from the chord's midpoint, so the ball performs SHM with $\omega^2 = g/R$ for any chord. The journey is half a period: $t = \pi\sqrt{R/g} = \pi\times808.1 = 2539$ s $= 42.3$ min. It is the same for every chord, including the diameter.`, { unit: 'min', trap: 'The time does not depend on the chord length.' }),
  nat(5, 'gravitational self-energy', r`Find the energy needed to scatter a uniform solid sphere (mass $6\times10^{24}$ kg, radius $6.4\times10^6$ m) into dust far apart, in units of $10^{32}$ J (2 decimals; $G = 6.67\times10^{-11}$).`, () => 3 * 6.67e-11 * (6e24) ** 2 / (5 * 6.4e6) / 1e32, 0.02, 2,
    r`Build the sphere shell by shell. When the radius is $r$ the mass is $m(r) = \tfrac43\pi\rho r^3$, and bringing a shell $dm = 4\pi\rho r^2dr$ from infinity needs $dU = -\dfrac{Gm(r)dm}r$. $U = -\dfrac{16\pi^2G\rho^2}{3}\int_0^Rr^4dr = -\dfrac{16\pi^2G\rho^2R^5}{15}$. With $M = \tfrac43\pi\rho R^3$: $U = -\dfrac{3GM^2}{5R}$. The energy to disperse it is $+\dfrac{3GM^2}{5R} = \dfrac{3\times6.67\times10^{-11}\times3.6\times10^{49}}{5\times6.4\times10^6} = 2.25\times10^{32}$ J.`, { unit: '×10³² J', trap: 'It is $\\tfrac35$ of $GM^2/R$, not $GM^2/R$ itself.' }),
  nat(5, 'plumb line', r`At latitude $45^\circ$, a plumb bob hangs along the effective gravity direction, which differs from the direction to the Earth's centre. Find the angle between them (in degrees, 3 decimals; $\omega = 7.27\times10^{-5}$ rad/s, $R = 6400$ km, $g = 9.8$).`, () => Math.asin(0.5 * (7.27e-5) ** 2 * 6.4e6 / 9.8) * 180 / Math.PI, 0.002, 3,
    r`The centrifugal acceleration $\omega^2R\cos\lambda$ is horizontal (to the axis). Its component perpendicular to the radius is $\omega^2R\cos\lambda\sin\lambda$. For small angles, $\tan\delta\approx\delta = \dfrac{\omega^2R\sin\lambda\cos\lambda}g = \dfrac{3.38\times10^{-2}\times0.5}{9.8} = 1.73\times10^{-3}$ rad $= 0.099^\circ$.`, { unit: 'degrees', trap: 'The plumb line points away from the Earth\'s centre only slightly, and not at all at the poles or the equator.' }),
  msq(4, 'satellites', r`A satellite is moved from one circular orbit to a larger circular orbit. Which of these increase?`,
    ['Its orbital period', 'Its total energy', 'Its kinetic energy', 'Its gravitational potential energy'], [0, 1, 3],
    r`$T\propto r^{3/2}$ rises. $E = -GMm/2r$ rises towards zero. $U = -GMm/r$ rises. $K = GMm/2r$ falls.`),
  msq(4, 'elliptical orbits', r`A satellite moves in an elliptical orbit about the Earth. Which are correct?`,
    ['Its angular momentum about the Earth\'s centre is constant', 'Its speed is greatest at perigee', 'Its total mechanical energy is constant', 'Its kinetic energy is constant'], [0, 1, 2],
    r`Gravity is central, so $L$ is constant. Energy is conserved. The speed changes ($v_pr_p = v_ar_a$ with $r_p<r_a$), so the kinetic energy changes. Total energy $= -GMm/2a$ depends only on the semi-major axis.`),
  msq(3, 'gravitational potential', r`For a thin uniform spherical shell of mass $M$ and radius $R$, which are correct?`,
    ['The field is zero at every point inside', 'The potential is the same at every point inside', r`The potential at the centre is zero`, r`Outside, the field is the same as for a point mass $M$ at the centre`], [0, 1, 3],
    r`The shell theorem gives (a), (b) and (d). The potential inside equals $-GM/R$, not zero (c).`),
  msq(4, 'weightlessness', r`In which of the following is an astronaut (or object) effectively weightless?`,
    ['In a spacecraft orbiting the Earth', 'In a lift whose cable has broken and the lift is in free fall', 'At the centre of the Earth (if one could be there, uniform Earth)', 'On the surface of the Moon'], [0, 1, 2],
    r`Weightless means no contact force from a support. Orbiting and freely falling cases have $a = g$. At the centre of a uniform Earth, $g = 0$. On the Moon's surface the astronaut is supported by the ground and has weight $mg_m$.`),
  msq(3, 'escape speed', r`The escape speed of a body from the surface of a planet depends on which of the following?`,
    ['The mass of the planet', 'The radius of the planet', 'The mass of the body', 'The direction in which the body is thrown (air resistance ignored)'], [0, 1],
    r`$v_e = \sqrt{2GM/R}$ depends on $M$ and $R$ only. It does not depend on the body's mass or on the direction (the only conditions: the path must not hit the planet).`),
  msq(5, 'ring', r`A thin uniform ring of mass $M$ and radius $a$ has its axis along $x$. Which are correct?`,
    ['The field at the centre is zero', r`The potential at the centre is $-GM/a$`, r`The field on the axis is greatest at $x = a/\sqrt2$`, r`For $x\gg a$ the field is nearly $GM/x^2$`], [0, 1, 2, 3],
    r`(a) By symmetry. (b) Every part is at distance $a$. (c) $g = \dfrac{GMx}{(a^2 + x^2)^{3/2}}$; set $dg/dx = 0$: $a^2 - 2x^2 = 0$, $x = a/\sqrt2$. (d) For large $x$ the ring looks like a point mass.`),
  msq(4, 'binary stars', r`Two stars of unequal masses $M_1 > M_2$ orbit their common centre of mass under their mutual gravity. Which are correct?`,
    ['They have the same period', 'The heavier star moves on the smaller circle', 'The two orbital speeds are in the ratio $M_2 : M_1$ (heavier is slower)', 'Their kinetic energies are equal'], [0, 1, 2],
    r`The line joining them rotates as a rigid rod, so the periods are equal. $M_1r_1 = M_2r_2$ gives a smaller radius for the heavier star, and $v = \omega r$ makes it slower. The energies $\tfrac12Mv^2\propto M\cdot\dfrac1{M^2} = \dfrac1M$ differ: the lighter star has the larger energy.`),
  msq(3, 'variation of g', r`Which of the following make the weight of a body smaller than at the poles at sea level?`,
    ['Moving to the equator', 'Going to a height of 10 km', 'Going down a mine 2 km deep (uniform Earth)', 'Increasing the Earth\'s rotation rate while staying at the pole'], [0, 1, 2],
    r`The equator has the rotation effect and the bulge. Height reduces $g$ ($\propto R^2/(R + h)^2$). Depth reduces $g$ ($\propto 1 - d/R$) for a uniform Earth. At the pole the rotation has no centrifugal effect, so (d) leaves the weight unchanged.`),

  // extra top-level items
  nat(5, 'gravitational field', r`A uniform solid sphere of mass $M$ and radius $R$ has a spherical cavity of radius $R/2$, whose centre is at a distance $R/2$ from the sphere's centre. A small mass $m$ lies on the line through both centres, at a distance $2R$ from the sphere's centre, on the same side as the cavity. Find the force on $m$ in units of $GMm/R^2$ (3 decimals), where $M$ is the mass of the <b>complete</b> sphere.`, () => 1 / 4 - (1 / 8) / (1.5 * 1.5), 0.001, 3,
    r`Use superposition: the sphere with the cavity filled, minus a sphere of the cavity's size. The full sphere gives $\dfrac{GMm}{(2R)^2} = \dfrac{GMm}{4R^2}$. The cavity sphere has mass $M\left(\dfrac12\right)^3 = \dfrac M8$ and its centre is at $2R - \dfrac R2 = 1.5R$ from $m$: $\dfrac{G(M/8)m}{(1.5R)^2} = \dfrac{GMm}{18R^2}$. Net $= \dfrac{GMm}{R^2}\left(\dfrac14 - \dfrac1{18}\right) = \dfrac{7}{36}\dfrac{GMm}{R^2} = 0.194\,\dfrac{GMm}{R^2}$.`, { trap: 'The cavity\'s mass is $M/8$ (volume ratio), not $M/4$.' }),
  nat(5, 'elliptical orbits', r`A satellite is in a circular orbit at a height $2R$ above the Earth's surface ($r_0 = 3R$). A burst of thrust suddenly cuts its speed to 0.6 times the circular speed, keeping the direction. Find its least distance from the Earth's centre afterwards (in km, $R = 6400$ km, nearest km). Does it hit the Earth (radius 6400 km)?`, () => 19200 * 0.36 / (2 - 0.36), 2, 0,
    r`With $k = 0.6$ at $r_0$: $v^2 = k^2GM/r_0$. Angular momentum and energy give the closest distance $r_p$ with $x = r_0/r_p$ satisfying $\dfrac{k^2}2x^2 - x - \left(\dfrac{k^2}2 - 1\right) = 0$. One root is $x = 1$ (the start), the other is $x = \dfrac{2 - k^2}{k^2} = \dfrac{1.64}{0.36} = 4.556$. So $r_p = \dfrac{19\,200}{4.556} = 4215$ km, which is less than 6400 km: the satellite would hit the Earth.`, { unit: 'km', trap: 'Compare the least distance with the Earth\'s radius.' }),
  nat(5, 'orbit change', r`The transfer ellipse of a satellite has perigee $2R$ and apogee $4R$. At apogee a second burn puts the satellite into the circular orbit of radius $4R$. Find the speed increase needed at this second burn (in m/s, $g = 9.8$, $R = 6400$ km, nearest m/s).`, () => Math.sqrt(9.8 * 6.4e6 / 4) - Math.sqrt(2 / 3 * 9.8 * 6.4e6) / 2, 2, 0,
    r`At perigee on the ellipse $v_p^2 = \dfrac{2GM}{3R}$, so $v_p = 0.8165\sqrt{GM/R} = 6466\ \mathrm{m\,s^{-1}}$. At apogee $v_a = v_p\times\dfrac{2R}{4R} = 3233\ \mathrm{m\,s^{-1}}$. The circular speed at $4R$ is $\sqrt{GM/4R} = \tfrac12\sqrt{gR} = 3960\ \mathrm{m\,s^{-1}}$. $\Delta v = 3960 - 3233 = 727\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'Kepler\'s third law', r`Halley's comet comes within 0.586 AU of the Sun at perihelion and goes out to 35.0 AU at aphelion. Using Kepler's third law with the Earth's year and AU, find its period (in years, 1 decimal).`, () => Math.pow((0.586 + 35.0) / 2, 1.5), 0.3, 1,
    r`The semi-major axis is $a = \dfrac{0.586 + 35.0}2 = 17.79$ AU. $T^2 = a^3$ in years and AU: $T = 17.79^{3/2} = 75.1$ years.`, { unit: 'years', trap: 'Use the semi-major axis (half the sum), not the aphelion.' }),
  nat(4, 'gravitational field', r`Two fixed stars of mass $1.0\times10^{11}$ kg each lie at $(\pm10\ \mathrm{m}, 0)$. A small mass is released from rest at $(0, 10\sqrt3\ \mathrm{m})$ and moves along the $y$-axis. Find its speed at the origin (in $\mathrm{m\,s^{-1}}$, 3 decimals; $G = 6.67\times10^{-11}$).`, () => Math.sqrt(2 * 6.67e-11 * 1e11 / 10), 0.005, 3,
    r`Potential on the $y$-axis: $V = -\dfrac{2GM}{\sqrt{a^2 + y^2}}$. Start ($y = \sqrt3a$): $-\dfrac{GM}a$. Origin: $-\dfrac{2GM}a$. $\tfrac12v^2 = \dfrac{GM}a$, so $v = \sqrt{2GM/a} = \sqrt{2\times6.67\times10^{-11}\times10^{11}/10} = 1.155\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),

  // ---------- Assertion / Reason ----------
  asrt(2, 'weightlessness', r`An astronaut in a spacecraft orbiting the Earth at 400 km height feels weightless.`, r`The gravitational pull of the Earth on the astronaut is zero at that height.`, 2,
    r`A is true. R is false: at 400 km, $g$ is still about $8.7\ \mathrm{m\,s^{-2}}$. She feels weightless because she and the craft are in free fall together.`),
  asrt(3, 'escape speed', r`The escape speed of a body from the Earth does not depend on the mass of the body.`, r`The escape speed is given by $\sqrt{2GM/R}$, in which the mass of the body does not appear.`, 0,
    r`The kinetic energy needed is $GMm/R$ and the kinetic energy given is $\tfrac12mv^2$; $m$ cancels. R gives the reason for A.`),
  asrt(3, 'satellites', r`A geostationary satellite must orbit in the equatorial plane.`, r`The orbit of every satellite is in a plane passing through the Earth's centre.`, 1,
    r`Both statements are true. R is not the explanation: it holds for all satellites (e.g. polar ones). Only an equatorial orbit stays above a fixed point on the Earth's surface, because only then does the satellite's plane turn with the Earth's spin.`),
  asrt(4, 'satellites', r`When a satellite in a circular orbit loses energy to air drag, its speed increases.`, r`The total energy of a satellite in a circular orbit equals minus its kinetic energy.`, 0,
    r`$E = -K$. If $E$ falls (becomes more negative), $K$ rises. R explains A.`),
  asrt(3, 'gravitational potential energy', r`The gravitational potential energy of two point masses is negative.`, r`The gravitational force is attractive and the potential energy is taken to be zero at infinite separation.`, 0,
    r`Work must be done against the attraction to separate the masses to infinity, so $U<0$ for a bound pair with the zero at infinity. R explains A.`),
  asrt(4, 'satellites', r`The total energy of a satellite orbiting the Earth in a circular orbit is positive.`, r`A satellite in a bound orbit has negative total energy.`, 3,
    r`A is false: $E = -GMm/2r<0$. R is true: negative total energy means bound.`, { trap: 'The sign of the total energy tells whether the orbit is bound.' }),
  asrt(3, 'gravitational potential', r`Inside a thin hollow spherical shell the gravitational potential is zero.`, r`The gravitational field inside a thin shell is zero.`, 3,
    r`A is false: the potential is constant, equal to $-GM/R$. R is true. Zero field means a constant potential, not a zero one.`, { trap: 'Mixing up zero field and zero potential.' }),
  asrt(4, 'satellites', r`The Moon is continuously falling towards the Earth.`, r`The Moon's speed in its (nearly circular) orbit is almost constant.`, 1,
    r`A is true: gravity gives the Moon its centripetal acceleration, so it falls round the Earth. R is also true, but does not explain A (a body in a circle falls whatever the speed).`),
  asrt(5, 'satellites', r`The orbital speed of a satellite doubles if its mass is doubled.`, r`The orbital speed of a satellite in a circular orbit does not depend on its mass.`, 3,
    r`A is false and R is true: $v = \sqrt{GM/r}$ has no mass of the satellite in it.`),

  // ---------- Statements ----------
  stm(3, 'escape speed', r`The escape speed from the Earth is the same in every direction of launch (ignoring air).`, r`The escape speed depends on the mass of the projectile.`, 2,
    r`I is true: only the energy matters and it is a scalar. II is false: $v_e = \sqrt{2GM/R}$.`),
  stm(3, 'Kepler\'s third law', r`For satellites of the Earth, $T^2/r^3$ has the same value as for planets of the Sun.`, r`The constant in $T^2 = (4\pi^2/GM)r^3$ depends on the mass of the central body.`, 3,
    r`I is false: the constant is $4\pi^2/GM$, with $M$ the mass of the body at the centre (Earth or Sun), so the values differ. II is true.`),
  stm(3, 'satellite energy', r`For a satellite in a circular orbit, the kinetic energy equals the magnitude of the total energy.`, r`The potential energy of a satellite in a circular orbit is twice its total energy.`, 0,
    r`$K = GMm/2r$, $E = -GMm/2r$, $U = -GMm/r = 2E$. Both are true.`),
  stm(3, 'variation of g', r`Just above the surface, $g$ decreases with height by about $2h/R$ of its value.`, r`Below the surface of a uniform Earth, $g$ decreases with depth by $d/R$ of its value.`, 0,
    r`$g(1 + h/R)^{-2}\approx g(1 - 2h/R)$ and $g(1 - d/R)$. Both are true, and the fall is twice as fast above as below.`),
  stm(3, 'gravitational force', r`The gravitational force between two masses depends on the medium between them.`, r`The gravitational force is a central and conservative force.`, 3,
    r`I is false: unlike electric force, gravity does not depend on the medium (it cannot be shielded). II is true.`),
  stm(4, 'variation of g', r`The weight of a body is greater at the poles than at the equator.`, r`The rotation of the Earth has no effect on the weight of a body at the poles.`, 0,
    r`At the poles there is no centrifugal term, and the polar radius is smaller. Both true.`),
  stm(4, 'satellites', r`The period of a satellite in a circular orbit depends on its mass.`, r`The total energy of a bound satellite is positive.`, 1,
    r`I is false: $T = 2\pi\sqrt{r^3/GM}$ has no satellite mass. II is false: bound means $E<0$. Both false.`),
  mcq(4, 'concepts', r`How many are correct? (a) $G$ is the same everywhere in the universe. (b) $g$ is the same everywhere on the Earth. (c) The weight of a body can change but its mass cannot (in these situations). (d) The force of gravity can be shielded. (e) $g$ is zero at the centre of a uniform Earth.`, '3', ['2', '4', '1'],
    r`(a) true. (b) false: it varies with latitude and height. (c) true. (d) false. (e) true. Three are correct.`, { format: 'statements' }),
  mcq(5, 'concepts', r`Consider a satellite in a circular orbit. How many are true? (i) A larger orbit needs a smaller speed. (ii) Two satellites of different masses in the same orbit have the same period. (iii) The kinetic energy is half the magnitude of the potential energy. (iv) The angular momentum increases with the orbit radius. (v) The total energy is positive.`, '4', ['3', '5', '2'],
    r`(i) true. (ii) true. (iii) true: $K = \tfrac12|U|$. (iv) true ($L\propto\sqrt r$). (v) false. Four are true.`, { format: 'statements' }),

  // ---------- Matches ----------
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'satellites', group: 'm1',
    q: r`A satellite of mass $m$ moves in a circle of radius $r$ about a planet of mass $M$. Match each quantity in List I with its expression in List II.`,
    options: ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-r, B-p, C-s, D-q'], answer: 0,
    sol: r`Orbital speed: $\sqrt{GM/r}$ (r). Escape speed from that distance: $\sqrt{2GM/r}$ (s). Total energy: $-GMm/2r$ (p). Period: $2\pi\sqrt{r^3/GM}$ (q).` },
  { id: nid(), type: 'mcq', level: 2, format: 'match', exams: EX[2], sub: 'variation of g', group: 'm2',
    q: r`The surface value of $g$ is $g_0$ for a uniform Earth of radius $R$. Match each place with the value of $g$.`,
    options: ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-p, C-q, D-s'], answer: 0,
    sol: r`At height $R$ the distance is $2R$: $g_0/4$ (r). At depth $R/2$: $g_0(1 - \tfrac12) = g_0/2$ (q). At the centre: 0 (p). At height $2R$ the distance is $3R$: $g_0/9$ (s).` },
  { id: nid(), type: 'mcq', level: 4, format: 'match', exams: EX[4], sub: 'satellites', group: 'm3',
    q: r`For circular orbits of radius $r$ about the same planet, match each quantity with how it varies with $r$.`,
    options: ['A-q, B-s, C-r, D-p', 'A-p, B-s, C-r, D-q', 'A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p'], answer: 0,
    sol: r`$v = \sqrt{GM/r}\propto r^{-1/2}$ (q). $T = 2\pi\sqrt{r^3/GM}\propto r^{3/2}$ (s). $K = GMm/2r\propto r^{-1}$ (r). $L = m\sqrt{GMr}\propto r^{1/2}$ (p).` },
  { id: nid(), type: 'mcq', level: 3, format: 'match', exams: EX[3], sub: 'Kepler\'s laws', group: 'm4',
    q: 'Match each statement in List I with the law or principle in List II.',
    options: ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-q, B-p, C-r, D-s'], answer: 0,
    sol: r`Planets move in ellipses with the Sun at one focus: first law (q). A line from the Sun to a planet sweeps equal areas in equal times: second law (r). $T^2\propto a^3$: third law (p). The Sun's force on a planet has zero torque about the Sun, so $L$ is conserved (s).` },
];
// vary the position of the correct code in match items
items.filter((x) => x.format === 'match').forEach((it, i) => {
  const pos = [2, 0, 3, 1][i]; const a = it.answer; [it.options[a], it.options[pos]] = [it.options[pos], it.options[a]]; it.answer = pos;
});

const groups = {
  m1: { title: 'A satellite in a circular orbit',
    list1: ['A. Orbital speed', 'B. Escape speed from that distance', 'C. Total energy', 'D. Period'],
    list2: [r`p. $-\dfrac{GMm}{2r}$`, r`q. $2\pi\sqrt{\dfrac{r^3}{GM}}$`, r`r. $\sqrt{\dfrac{GM}{r}}$`, r`s. $\sqrt{\dfrac{2GM}{r}}$`] },
  m2: { title: 'Gravity at various places',
    list1: ['A. At a height $R$ above the surface', 'B. At a depth $R/2$ below the surface', 'C. At the centre of the Earth', 'D. At a height $2R$ above the surface'],
    list2: ['p. $0$', 'q. $g_0/2$', 'r. $g_0/4$', 's. $g_0/9$'] },
  m3: { title: 'How satellite quantities change with orbit radius',
    list1: ['A. Orbital speed', 'B. Period', 'C. Kinetic energy', 'D. Angular momentum'],
    list2: [r`p. $\propto r^{1/2}$`, r`q. $\propto r^{-1/2}$`, r`r. $\propto r^{-1}$`, r`s. $\propto r^{3/2}$`] },
  m4: { title: 'Kepler and angular momentum',
    list1: ['A. Planets move in ellipses with the Sun at a focus', 'B. A planet sweeps out equal areas in equal times', 'C. The square of the period is proportional to the cube of the semi-major axis', 'D. The force on a planet gives no torque about the Sun'],
    list2: [r`p. Third law`, r`q. First law`, r`r. Second law`, r`s. Conservation of angular momentum`] },
  p1: { title: 'A satellite at twice the Earth\'s radius',
    passage: r`<p>A 400 kg satellite moves in a circular orbit of radius $2R$ about the Earth, where $R = 6400$ km is the Earth's radius. Take $g = 9.8\ \mathrm{m\,s^{-2}}$ at the surface.</p>` },
  p2: { title: 'A heavy planet',
    passage: r`<p>A planet has 8 times the mass of the Earth and twice its radius. For the Earth, $g = 9.8\ \mathrm{m\,s^{-2}}$ and the escape speed is 11.2 km/s.</p>` },
  p3: { title: 'An elliptical orbit',
    passage: r`<p>A satellite moves in an elliptical orbit about the Earth with perigee radius 7000 km and apogee radius 21 000 km. Its speed at perigee is 9.26 km/s. Take $GM = 4.0\times10^{14}\ \mathrm{m^3\,s^{-2}}$ for the Earth.</p>` },
};

const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: EX[level], sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
items.push(
  pas(3, 'satellites', 'p1', r`Find the orbital speed (in km/s, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6 / 2) / 1000, 0.01, 2,
    r`$v = \sqrt{GM/r} = \sqrt{gR^2/2R} = \sqrt{gR/2} = \sqrt{3.136\times10^7} = 5600\ \mathrm{m\,s^{-1}} = 5.60$ km/s.`, { unit: 'km/s' }),
  pas(3, 'satellites', 'p1', r`Find the period of revolution (in hours, 2 decimals).`, () => 2 * Math.PI * 1.28e7 / 5600 / 3600, 0.02, 2,
    r`$T = \dfrac{2\pi r}v = \dfrac{2\pi\times1.28\times10^7}{5600} = 1.436\times10^4$ s $= 3.99$ h.`, { unit: 'h' }),
  pas(3, 'satellite energy', 'p1', r`Find the total energy of the satellite (in GJ, 2 decimals, negative).`, () => -9.8 * 6.4e6 * 400 / 4 / 1e9, 0.01, 2,
    r`$E = -\dfrac{GMm}{2r} = -\dfrac{gRm}4 = -\dfrac{9.8\times6.4\times10^6\times400}{4} = -6.27\times10^9$ J $= -6.27$ GJ.`, { unit: 'GJ' }),
  pas(2, 'surface gravity of planets', 'p2', r`Find the acceleration due to gravity on the surface of the planet (in $\mathrm{m\,s^{-2}}$).`, () => 9.8 * 8 / 4, 0.01, 2,
    r`$g' = g\dfrac{M'}{M}\left(\dfrac R{R'}\right)^2 = 9.8\times8\times\dfrac14 = 19.6\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pas(3, 'escape speed', 'p2', r`Find the escape speed from the planet (in km/s, 1 decimal).`, () => 11.2 * Math.sqrt(8 / 2), 0.05, 1,
    r`$v_e\propto\sqrt{M/R}$, so $v_e' = 11.2\times\sqrt{8/2} = 22.4$ km/s.`, { unit: 'km/s' }),
  pas(3, 'orbital speed', 'p2', r`Find the speed of a satellite in a circular orbit very close to the planet's surface (in km/s, 2 decimals).`, () => 11.2 * 2 / Math.SQRT2, 0.03, 2,
    r`Close to the surface $v_o = v_e/\sqrt2 = 22.4/1.414 = 15.84$ km/s.`, { unit: 'km/s' }),
  pas(3, 'Kepler\'s second law', 'p3', r`Find the speed of the satellite at apogee (in km/s, 2 decimals).`, () => 9.26 * 7 / 21, 0.01, 2,
    r`$v_pr_p = v_ar_a$, so $v_a = 9.26\times\dfrac{7000}{21\,000} = 3.09$ km/s.`, { unit: 'km/s' }),
  pas(4, 'elliptical orbits', 'p3', r`Find the period of the orbit (in hours, 2 decimals).`, () => 2 * Math.PI * Math.sqrt(Math.pow(14e6, 3) / 4e14) / 3600, 0.02, 2,
    r`Semi-major axis $a = (7000 + 21\,000)/2 = 14\,000$ km. $T = 2\pi\sqrt{a^3/GM} = 2\pi\sqrt{\dfrac{(1.4\times10^7)^3}{4\times10^{14}}} = 1.646\times10^4$ s $= 4.57$ h.`, { unit: 'h', trap: 'Use the semi-major axis, not the perigee or the apogee.' }),
  pas(4, 'elliptical orbits', 'p3', r`Find the total mechanical energy per unit mass of the satellite (in MJ/kg, 2 decimals, negative).`, () => -4e14 / (2 * 14e6) / 1e6, 0.02, 2,
    r`$E/m = -\dfrac{GM}{2a} = -\dfrac{4\times10^{14}}{2.8\times10^7} = -1.43\times10^7\ \mathrm{J\,kg^{-1}} = -14.29\ \mathrm{MJ\,kg^{-1}}$. Check at perigee: $\tfrac12(9260)^2 - \dfrac{4\times10^{14}}{7\times10^6} = 4.29\times10^7 - 5.71\times10^7 = -1.43\times10^7$.`, { unit: 'MJ/kg' }),
);

const gens = [
  { id: 'gr-g01', type: 'nat', level: 2, exams: EX[2], sub: 'Newton\'s law of gravitation',
    make(rng) {
      const m1 = pick(rng, 10, 100, 10); const m2 = pick(rng, 10, 100, 10); const d = pick(rng, 0.5, 4, 0.5);
      const F = G * m1 * m2 / (d * d) / 1e-9;
      return { m1, m2, d, q: `Two masses of ${m1} kg and ${m2} kg are ${d} m apart. Find the gravitational force between them (in units of $10^{-9}$ N, 2 decimals; $G = 6.67\\times10^{-11}$ SI).`, answer: +F.toFixed(2), tol: 0.02, unit: '×10⁻⁹ N',
        sol: `$F = \\dfrac{Gm_1m_2}{r^2} = \\dfrac{6.67\\times10^{-11}\\times${m1}\\times${m2}}{${d}^2} = ${F.toFixed(2)}\\times10^{-9}$ N.`, trap: 'Square the distance.' };
    },
    verify: (p) => 6.67e-11 * p.m1 * p.m2 / (p.d ** 2) * 1e9 },
  { id: 'gr-g02', type: 'nat', level: 2, exams: EX[2], sub: 'variation of g with height',
    make(rng) {
      const n = choose(rng, [0.25, 0.5, 1, 1.5, 2, 3]); const g1 = 9.8 / (1 + n) ** 2;
      return { n, q: `Find $g$ at a height of ${n}$R$ above the Earth's surface (in $\\mathrm{m\\,s^{-2}}$, $g = 9.8$ at the surface, 2 decimals).`, answer: +g1.toFixed(2), tol: 0.01, unit: 'm/s²',
        sol: `$g' = g\\left(\\dfrac{R}{R + h}\\right)^2 = \\dfrac{9.8}{(1 + ${n})^2} = \\dfrac{9.8}{${(1 + n) ** 2}} = ${g1.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'The distance from the centre is $R + h$.' };
    },
    verify: (p) => { const GM = 9.8 * 6.4e6 ** 2; return GM / ((1 + p.n) * 6.4e6) ** 2; } },
  { id: 'gr-g03', type: 'nat', level: 2, exams: EX[2], sub: 'variation of g with depth',
    make(rng) {
      const f = pick(rng, 0.1, 0.9, 0.1); const g1 = 9.8 * (1 - f);
      return { f, q: `Find $g$ at a depth of ${+f.toFixed(1)}$R$ below the surface of a uniform Earth (in $\\mathrm{m\\,s^{-2}}$, $g = 9.8$ at the surface, 2 decimals).`, answer: +g1.toFixed(2), tol: 0.01, unit: 'm/s²',
        sol: `Inside a uniform sphere $g' = g\\,r/R$ where $r = R - d = ${+(1 - f).toFixed(1)}R$. $g' = 9.8\\times${+(1 - f).toFixed(1)} = ${g1.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'At depth $d$ the factor is $1 - d/R$.' };
    },
    verify: (p) => { const rho = 9.8 / (6.4e6 * (4 / 3) * Math.PI * G); const r1 = (1 - p.f) * 6.4e6; const Min = (4 / 3) * Math.PI * r1 ** 3 * rho; return G * Min / r1 ** 2; } },
  { id: 'gr-g04', type: 'nat', level: 3, exams: EX[3], sub: 'escape speed',
    make(rng) {
      const mr = choose(rng, [2, 4, 8, 9, 0.5, 0.25]); const rr = choose(rng, [2, 3, 0.5, 4, 1.5]); const ve = 11.2 * Math.sqrt(mr / rr);
      return { mr, rr, q: `A planet has ${mr} times the Earth's mass and ${rr} times its radius. The escape speed from the Earth is 11.2 km/s. Find the escape speed from the planet (in km/s, 2 decimals).`, answer: +ve.toFixed(2), tol: 0.03, unit: 'km/s',
        sol: `$v_e = \\sqrt{2GM/R}$, so $v_e'/v_e = \\sqrt{\\dfrac{M'}{M}\\cdot\\dfrac{R}{R'}} = \\sqrt{\\dfrac{${mr}}{${rr}}} = ${Math.sqrt(mr / rr).toFixed(3)}$. $v_e' = ${ve.toFixed(2)}$ km/s.`, trap: 'It is the square root of the ratio of $M/R$, not of $M/R^2$.' };
    },
    verify: (p) => Math.sqrt(2 * (9.8 * p.mr / p.rr ** 2) * (6.4e6 * p.rr)) / 1000 },
  { id: 'gr-g05', type: 'nat', level: 3, exams: EX[3], sub: 'orbital speed',
    make(rng) {
      const n = choose(rng, [0.5, 1, 2, 3, 4, 5]); const v = Math.sqrt(9.8 * 6.4e6 / (1 + n)) / 1000;
      return { n, q: `A satellite orbits at a height of ${n}$R$ above the Earth's surface. Find its orbital speed (in km/s, $g = 9.8$, $R = 6400$ km, 2 decimals).`, answer: +v.toFixed(2), tol: 0.02, unit: 'km/s',
        sol: `The orbit radius is $r = (1 + ${n})R = ${1 + n}R$. $v = \\sqrt{GM/r} = \\sqrt{gR/${1 + n}} = \\sqrt{${(9.8 * 6.4e6 / (1 + n)).toExponential(3)}} = ${v.toFixed(2)}$ km/s.`, trap: 'Use the orbit radius from the centre.' };
    },
    verify: (p) => { const r1 = (1 + p.n) * 6.4e6; const GM = 9.8 * 6.4e6 ** 2; const T = 2 * Math.PI * Math.sqrt(r1 ** 3 / GM); return 2 * Math.PI * r1 / T / 1000; } },
  { id: 'gr-g06', type: 'nat', level: 3, exams: EX[3], sub: 'Kepler\'s third law',
    make(rng) {
      const n = choose(rng, [4, 9, 16, 25]); const T1 = pick(rng, 1, 5, 1); const T2 = T1 * Math.pow(n, 1.5);
      return { n, T1, q: `Two satellites orbit the same planet. The second orbit's radius is ${n} times the first's. The period of the first is ${T1} h. Find the period of the second (in hours).`, answer: T2, tol: 0.01, unit: 'h',
        sol: `$T\\propto r^{3/2}$. $T_2 = ${T1}\\times${n}^{3/2} = ${T1}\\times${Math.pow(n, 1.5)} = ${T2}$ h.`, trap: 'The exponent is $3/2$, not $2$ or $3$.' };
    },
    verify: (p) => Math.sqrt(p.T1 ** 2 * p.n ** 3) },
  { id: 'gr-g07', type: 'nat', level: 3, exams: EX[3], sub: 'satellite energy',
    make(rng) {
      const m = pick(rng, 100, 1000, 100); const n = choose(rng, [1, 2, 3, 5]); const E = -9.8 * 6.4e6 * m / (2 * (1 + n)) / 1e6;
      return { m, n, q: `A ${m} kg satellite orbits at a height of ${n}$R$ above the Earth's surface. Find its total energy (in MJ, $g = 9.8$, $R = 6400$ km, 1 decimal).`, answer: +E.toFixed(1), tol: 0.2, unit: 'MJ',
        sol: `$r = ${1 + n}R$. $E = -\\dfrac{GMm}{2r} = -\\dfrac{gRm}{2\\times${1 + n}} = -\\dfrac{9.8\\times6.4\\times10^6\\times${m}}{${2 * (1 + n)}} = ${E.toFixed(1)}$ MJ.`, trap: 'The total energy is negative.' };
    },
    verify: (p) => { const GM = 9.8 * 6.4e6 ** 2; const r1 = (1 + p.n) * 6.4e6; const v = Math.sqrt(GM / r1); return -(0.5 * p.m * v * v) / 1e6; } },
  { id: 'gr-g08', type: 'nat', level: 4, exams: EX[4], sub: 'satellite energy',
    make(rng) {
      const m = pick(rng, 100, 1000, 100); const a = choose(rng, [1.5, 2, 3]); const b = choose(rng, [4, 5, 6]); const dE = 9.8 * 6.4e6 * m / 2 * (1 / a - 1 / b) / 1e6;
      return { m, a, b, q: `A ${m} kg satellite is moved from a circular orbit of radius ${a}$R$ to one of radius ${b}$R$ about the Earth. Find the extra energy needed (in MJ, $g = 9.8$, $R = 6400$ km, nearest MJ).`, answer: Math.round(dE), tol: 1, unit: 'MJ',
        sol: `$\\Delta E = E_2 - E_1 = \\dfrac{GMm}{2}\\left(\\dfrac1{r_1} - \\dfrac1{r_2}\\right) = \\dfrac{gRm}{2}\\left(\\dfrac1{${a}} - \\dfrac1{${b}}\\right) = \\dfrac{9.8\\times6.4\\times10^6\\times${m}}2\\times${(1 / a - 1 / b).toFixed(4)} = ${dE.toFixed(0)}$ MJ.`, trap: 'Use the difference of total energies $-GMm/2r$, not of $-GMm/r$.' };
    },
    verify: (p) => { const GM = 9.8 * 6.4e6 ** 2; const E = (r1) => -GM * p.m / (2 * r1); return Math.round((E(p.b * 6.4e6) - E(p.a * 6.4e6)) / 1e6); } },
  { id: 'gr-g09', type: 'nat', level: 3, exams: EX[3], sub: 'binary stars',
    make(rng) {
      const M = pick(rng, 1, 4, 1); const d = pick(rng, 1, 3, 0.5); const T = 2 * Math.PI * Math.sqrt((d * 1e11) ** 3 / (2 * G * M * 1e30)) / 86400;
      return { M, d, q: `Two stars, each of mass ${M}$\\times10^{30}$ kg, orbit their common centre of mass, ${d}$\\times10^{11}$ m apart. Find the orbital period (in days, nearest day; $G = 6.67\\times10^{-11}$).`, answer: Math.round(T), tol: 1, unit: 'days',
        sol: `$\\dfrac{GM^2}{d^2} = M\\omega^2\\dfrac d2$ gives $\\omega^2 = \\dfrac{2GM}{d^3}$. $T = 2\\pi\\sqrt{\\dfrac{d^3}{2GM}} = 2\\pi\\sqrt{\\dfrac{(${d}\\times10^{11})^3}{2\\times6.67\\times10^{-11}\\times${M}\\times10^{30}}} = ${(T * 86400).toExponential(3)}$ s $= ${Math.round(T)}$ days.`, trap: 'Each star circles at radius $d/2$.' };
    },
    verify: (p) => { const w = Math.sqrt(2 * G * p.M * 1e30 / (p.d * 1e11) ** 3); return Math.round(2 * Math.PI / w / 86400); } },
  { id: 'gr-g10', type: 'nat', level: 3, exams: EX[3], sub: 'projectile',
    make(rng) {
      const f = choose(rng, [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]); const h = 6400 * f * f / (1 - f * f);
      return { f, q: `A body is projected vertically upward from the Earth's surface with a speed ${f} times the escape speed. Find the greatest height it reaches (in km, $R = 6400$ km, nearest km).`, answer: Math.round(h), tol: 2, unit: 'km',
        sol: `Energy: $\\tfrac12mv^2 - \\dfrac{GMm}R = -\\dfrac{GMm}{R + h}$ with $v^2 = ${f}^2\\times\\dfrac{2GM}R$. This gives $\\dfrac1{R + h} = \\dfrac{1 - ${f}^2}{R}$, so $h = R\\dfrac{${f}^2}{1 - ${f}^2} = 6400\\times${(f * f / (1 - f * f)).toFixed(4)} = ${Math.round(h)}$ km.`, trap: 'Do not use $v^2/2g$; $g$ falls with height.' };
    },
    verify: (p) => { const GM = 9.8 * 6.4e6 ** 2; const ve = Math.sqrt(2 * GM / 6.4e6); const v = p.f * ve; const E = 0.5 * v * v - GM / 6.4e6; return Math.round((-GM / E - 6.4e6) / 1000); } },
  { id: 'gr-g11', type: 'nat', level: 3, exams: EX[3], sub: 'Kepler\'s second law',
    make(rng) {
      const vp = pick(rng, 20, 60, 5); const k = pick(rng, 2, 6, 1); const va = vp / k;
      return { vp, k, q: `A comet's speed at perihelion is ${vp} km/s. Its distance from the Sun at aphelion is ${k} times that at perihelion. Find its speed at aphelion (in km/s, 2 decimals).`, answer: +va.toFixed(2), tol: 0.01, unit: 'km/s',
        sol: `At perihelion and aphelion the velocity is perpendicular to the radius. $mv_pr_p = mv_ar_a$, so $v_a = v_p/${k} = ${va.toFixed(2)}$ km/s.`, trap: 'Speed is smaller where the distance is larger.' };
    },
    verify: (p) => { const rp = 1; const ra = p.k; const L = p.vp * rp; return L / ra; } },
  { id: 'gr-g12', type: 'nat', level: 3, exams: EX[3], sub: 'variation of g with latitude',
    make(rng) {
      const lat = choose(rng, [30, 37, 45, 53, 60]); const w = 7.27e-5; const d = w * w * 6.4e6 * Math.cos(lat * Math.PI / 180) ** 2 / 1e-3;
      return { lat, q: `Find the reduction in $g$ at latitude ${lat}° due to the Earth's rotation (in units of $10^{-3}\\ \\mathrm{m\\,s^{-2}}$, $\\omega = 7.27\\times10^{-5}$ rad/s, $R = 6400$ km, 2 decimals).`, answer: +d.toFixed(2), tol: 0.05, unit: '×10⁻³ m/s²',
        sol: `Reduction $= \\omega^2R\\cos^2\\lambda = 5.285\\times10^{-9}\\times6.4\\times10^6\\times\\cos^2${lat}^\\circ = 3.382\\times10^{-2}\\times${(Math.cos(lat * Math.PI / 180) ** 2).toFixed(4)} = ${d.toFixed(2)}\\times10^{-3}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'The factor is $\\cos^2\\lambda$.' };
    },
    verify: (p) => { const w = 7.27e-5; const a = w * w * 6.4e6 * Math.cos(p.lat * Math.PI / 180); return a * Math.cos(p.lat * Math.PI / 180) / 1e-3; } },
  { id: 'gr-g13', type: 'mcq', level: 2, exams: EX[2], sub: 'surface gravity of planets',
    make(rng) {
      const mr = choose(rng, [2, 3, 4, 8, 9, 16]); const rr = choose(rng, [2, 3, 4]); const gr = mr / (rr * rr);
      const o = numOpts(rng, gr, [mr / rr, mr * rr * rr, rr * rr / mr], '', 3);
      return { mr, rr, q: `A planet has ${mr} times the mass and ${rr} times the radius of the Earth. The ratio of its surface $g$ to the Earth's is`, ...o,
        sol: `$g = GM/R^2$, so $g'/g = \\dfrac{M'}{M}\\left(\\dfrac{R}{R'}\\right)^2 = \\dfrac{${mr}}{${rr * rr}} = ${fmt(gr, 3)}$. The other options use $M/R$ (forgetting the square), the inverse or the wrong power.`, trap: 'Gravity depends on $1/R^2$.' };
    },
    verify: (p) => p.options.findIndex((o) => o === fmt(p.mr / (p.rr * p.rr), 3)) },
  { id: 'gr-g14', type: 'nat', level: 3, exams: EX[3], sub: 'gravitational field of a solid sphere',
    make(rng) {
      const g0 = pick(rng, 4, 20, 2); const f = choose(rng, [0.25, 0.5, 0.75, 1.5, 2, 3]); const gg = f < 1 ? g0 * f : g0 / (f * f);
      return { g0, f, q: `A uniform planet has surface gravity ${g0} m/s². Find the gravitational field at a distance ${f}$R$ from its centre, where $R$ is the planet's radius (in $\\mathrm{m\\,s^{-2}}$, 2 decimals).`, answer: +gg.toFixed(2), tol: 0.01, unit: 'm/s²',
        sol: f < 1 ? `Inside, $g = g_0\\,r/R = ${g0}\\times${f} = ${gg.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$ (only the mass inside radius $r$ attracts).` : `Outside, $g = g_0(R/r)^2 = ${g0}/${f}^2 = ${gg.toFixed(2)}\\ \\mathrm{m\\,s^{-2}}$.`, trap: 'The field rises linearly inside and falls as $1/r^2$ outside.' };
    },
    verify: (p) => { const GM = p.g0 * 1; const Rr = 1; const rr = p.f; const Min = rr < 1 ? GM * rr ** 3 : GM; return Min / (rr * rr); } },
  { id: 'gr-g15', type: 'nat', level: 4, exams: EX[4], sub: 'binary stars',
    make(rng) {
      const M = pick(rng, 1, 5, 1); const d = pick(rng, 5, 20, 5); const v = Math.sqrt(G * M * 1e30 / (d * 1e11)) / 1000;
      return { M, d, q: `Two identical stars of mass ${M}$\\times10^{30}$ kg each are released from rest ${d}$\\times10^{11}$ m apart. Find the speed of each when their separation has halved (in km/s, 1 decimal; $G = 6.67\\times10^{-11}$).`, answer: +v.toFixed(1), tol: 0.1, unit: 'km/s',
        sol: `By symmetry both have the same speed $v$. Loss of potential energy $= GM^2\\left(\\dfrac{2}{d} - \\dfrac1d\\right) = \\dfrac{GM^2}d = 2\\times\\tfrac12Mv^2$. $v = \\sqrt{GM/d} = \\sqrt{\\dfrac{6.67\\times10^{-11}\\times${M}\\times10^{30}}{${d}\\times10^{11}}} = ${v.toFixed(1)}$ km/s.`, trap: 'The energy released is shared by two stars.' };
    },
    verify: (p) => { const Mm = p.M * 1e30; const dd = p.d * 1e11; const dU = G * Mm * Mm * (2 / dd - 1 / dd); return Math.sqrt(dU / Mm) / 1000; } },
];

{ // ===== extension block (added 2026-11-22): harder items, new formats and templates =====
const r = String.raw;
const CUET = false; const PFX = 'gr'; const GN = 15;
const F = (x, s = 3) => String(+Number(x).toPrecision(s));
const XEB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xe = (l, type) => (CUET && type === 'mcq' && l <= 3 ? [...XEB[l], 'cuet'] : XEB[l]);
let xk = 0; let xc = 0;
const xb = (l, sub, o) => ({ id: `${PFX}-x${String(++xk).padStart(3, '0')}`, level: l, sub, ...o, exams: xe(l, o.type) });
const m = (l, sub, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o }); };
const n = (l, sub, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o }); };
const s = (l, sub, q, options, answer, sol, o = {}) => xb(l, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const a = (l, sub, A, R, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AO, answer, sol, ...o });
const SO = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const t = (l, sub, I, II, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SO, answer, sol, ...o });
// "how many of these are correct": list = 4 statements, k = how many are correct (1-4)
const cn = (l, sub, q, list, k, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x}`).join('<br>')}`, options: ['Only one', 'Only two', 'Only three', 'All four'], answer: k - 1, sol, ...o });
// match item: letters = correct List II letter for A, B, C, D, e.g. ['q','r','p','s']
const mt = (l, sub, group, letters, sol, o = {}) => {
  const code = (L) => L.map((x, i) => `${'ABCD'[i]}-${x}`).join(', ');
  const right = code(letters); const wr = [];
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [0, 3], [0, 2], [1, 3]]) { const L = [...letters]; [L[i], L[j]] = [L[j], L[i]]; const c = code(L); if (c !== right && !wr.includes(c)) wr.push(c); }
  const pos = (xc++ * 3 + 2) % 4; const options = wr.slice(0, 3); options.splice(pos, 0, right);
  return xb(l, sub, { type: 'mcq', format: 'match', q: 'Match the entries of List I with List II and choose the correct code.', group, options, answer: pos, sol, ...o });
};
const pn = (l, sub, group, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o }); };
const pm = (l, sub, group, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'passage', group, q, options, answer: pos, sol, ...o }); };
let xg = GN;
const gx = (l, type, sub, make, verify) => ({ id: `${PFX}-g${String(++xg).padStart(2, '0')}`, type, level: l, exams: xe(l, type), sub, make, verify });
const NG = {};
const Gc = 6.67e-11; const gE = 9.8; const RE_ = 6.4e6;
Object.assign(groups, {
  xg1: { title: 'Planets compared with the Earth ($g$ = surface gravity of the Earth)',
    list1: [r`A. Mass $4M$, radius $2R$`, r`B. Mass $M$, radius $2R$`, r`C. Mass $M/2$, radius $R$`, r`D. Mass $16M$, radius $2R$`],
    list2: [r`p. $g/4$`, r`q. $g$`, r`r. $2g$`, r`s. $4g$`, r`t. $g/2$`] },
  xg2: { title: 'Time periods of circular orbits around the Earth',
    list1: ['A. Orbit just above the Earth\'s surface', 'B. Geostationary orbit', 'C. Orbit of radius $4R$ ($R$ = Earth\'s radius)', 'D. The Moon\'s orbit'],
    list2: ['p. About 1.4 hours', 'q. 24 hours', 'r. About 27 days', 's. About 11 hours'] },
  xg3: { title: 'A thin uniform spherical shell of mass $M$ and radius $R$',
    list1: ['A. Field at a point inside', 'B. Field at a distance $r > R$', 'C. Potential at a point inside', 'D. Potential at a distance $r > R$'],
    list2: [r`p. $0$`, r`q. $-\dfrac{GM}{R}$`, r`r. $\dfrac{GM}{r^2}$`, r`s. $-\dfrac{GM}{r}$`] },
  xg4: { title: 'Two stars of mass $M$ each, a distance $d$ apart, orbiting their common centre',
    list1: ['A. Orbital speed of each star', 'B. Period', 'C. Total energy of the pair', 'D. Angular speed'],
    list2: [r`p. $-\dfrac{GM^2}{2d}$`, r`q. $\sqrt{\dfrac{2GM}{d^3}}$`, r`r. $\sqrt{\dfrac{GM}{2d}}$`, r`s. $2\pi\sqrt{\dfrac{d^3}{2GM}}$`] },
  xg5: { title: 'A satellite of mass $m$ in a circular orbit of radius $r$ about a planet of mass $M$',
    list1: ['A. Kinetic energy', 'B. Potential energy', 'C. Total energy', 'D. Energy needed to move it to a circular orbit of radius $2r$'],
    list2: [r`p. $-\dfrac{GMm}{r}$`, r`q. $\dfrac{GMm}{4r}$`, r`r. $\dfrac{GMm}{2r}$`, r`s. $-\dfrac{GMm}{2r}$`] },
  xg6: { title: 'Free fall and launching (Earth, $R = 6400$ km, $g = 9.8\\ \\mathrm{m\\,s^{-2}}$, no air)',
    list1: ['A. Speed on reaching the surface when dropped from a very great distance', 'B. Speed on reaching the surface when dropped from rest at height $R$', 'C. Speed on reaching the surface when dropped from rest at height $3R$', 'D. Height reached above the surface by a body fired up at $\\sqrt{gR}$'],
    list2: ['p. 7.9 km/s', 'q. 9.7 km/s', 'r. 11.2 km/s', 's. 6400 km'] },
  xg7: { title: 'Speeds near the Earth ($R = 6400$ km, $g = 9.8\\ \\mathrm{m\\,s^{-2}}$)',
    list1: ['A. Escape speed from the surface', 'B. Orbital speed just above the surface', 'C. Orbital speed at a height $R$ above the surface', 'D. Orbital speed at a height $3R$ above the surface'],
    list2: ['p. 3.96 km/s', 'q. 5.60 km/s', 'r. 7.92 km/s', 's. 11.2 km/s'] },
  xg8: { title: 'An elliptical orbit whose aphelion distance is three times the perihelion distance $r_p$',
    list1: ['A. Speed at perihelion divided by speed at aphelion', 'B. Semi-major axis', 'C. Eccentricity', 'D. Kinetic energy at perihelion divided by that at aphelion'],
    list2: ['p. 9', 'q. 3', r`r. $2r_p$`, r`s. $\tfrac12$`] },
  xgp1: { title: 'A close pair of stars',
    passage: r`<p>Two identical stars, each of mass $4\times10^{30}$ kg, move in circles about their common centre of mass. The distance between them is always $1.0\times10^{11}$ m. Take $G = 6.67\times10^{-11}\ \mathrm{N\,m^2\,kg^{-2}}$.</p>` },
  xgp2: { title: 'A tunnel through the Earth',
    passage: r`<p>A narrow, smooth tunnel is bored along a diameter of the Earth, which is taken as a uniform sphere of radius 6400 km with $g = 9.8\ \mathrm{m\,s^{-2}}$ at the surface. A ball is dropped into it from rest at one end. Ignore air and rotation.</p>` },
});

items.push(
  // ---------- Level 2 ----------
  m(2, 'variation of g with height', r`A 80 kg man would weigh how much at a height equal to the Earth's radius above its surface ($g = 9.8\ \mathrm{m\,s^{-2}}$ at the surface)?`, '196 N', ['392 N', '98 N', '784 N'],
    r`At height $h = R$ the distance from the centre is $2R$, so $g' = g/4$. Weight $= 80\times9.8/4 = 196$ N. The mass stays 80 kg.`),
  n(2, 'satellites', r`Find the time period (in minutes, 1 decimal) of a satellite orbiting just above the Earth's surface ($R = 6400$ km, $g = 9.8\ \mathrm{m\,s^{-2}}$).`, () => 2 * Math.PI * Math.sqrt(6.4e6 / 9.8) / 60, 0.2, 1,
    r`Near the surface, $\dfrac{mv^2}{R} = mg$, so $v = \sqrt{gR}$ and $T = \dfrac{2\pi R}{v} = 2\pi\sqrt{\dfrac Rg} = 2\pi\sqrt{\dfrac{6.4\times10^6}{9.8}} = 5077$ s $= 84.6$ min.`, { unit: 'min' }),
  m(2, 'Kepler\'s third law', r`A planet orbits a star at 4 times the distance of another planet. Its period is`, '8 times as long', ['4 times as long', '16 times as long', '2 times as long'],
    r`$T^2\propto r^3$, so $T\propto r^{3/2} = 4^{3/2} = 8$.`),
  n(2, 'variation of g with depth', r`Find $g$ (in $\mathrm{m\,s^{-2}}$, 2 decimals) at a depth of one-quarter of the Earth's radius, taking the Earth as uniform with $g = 9.8$ at the surface.`, () => 9.8 * 0.75, 0.01, 2,
    r`Inside a uniform sphere $g' = g\left(1 - \dfrac dR\right) = 9.8\times\tfrac34 = 7.35\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  m(2, 'escape speed', r`The escape speed of a rocket from the Earth's surface does NOT depend on`, 'the mass of the rocket', ['the mass of the Earth', 'the radius of the Earth', r`the value of $G$`],
    r`$v_e = \sqrt{2GM/R}$ contains $G$, $M$ and $R$ of the Earth. The rocket's mass cancels: both its kinetic energy and its potential energy are proportional to it.`),
  m(2, 'gravitational field', r`A uniform thin ring has mass $M$. The gravitational force on a small mass placed at its centre is`, 'zero', [r`$GMm/a^2$ towards the centre, where $a$ is the radius`, r`$GMm/a^2$ away from the centre`, r`$GMm/2a^2$`],
    r`Each small element of the ring is balanced by the diametrically opposite element, so the pulls cancel. The field is zero at the centre.`),
  n(2, 'mass of the Earth', r`Find the mass of the Earth (in units of $10^{24}$ kg, 2 decimals) from $g = 9.8$, $R = 6.4\times10^6$ m and $G = 6.67\times10^{-11}$ SI.`, () => 9.8 * 6.4e6 ** 2 / 6.67e-11 / 1e24, 0.02, 2,
    r`$g = GM/R^2 \Rightarrow M = gR^2/G = \dfrac{9.8\times(6.4\times10^6)^2}{6.67\times10^{-11}} = 6.02\times10^{24}$ kg.`, { unit: '10²⁴ kg' }),
  n(2, 'weightlessness', r`A body of mass 160 kg is taken to a height $3R$ above the Earth's surface. What is its weight there in kgf (kilogram-weight)?`, () => 160 / 16, 0, 0,
    r`Distance from the centre is $4R$, so $g' = g/16$. Weight $= 160/16 = 10$ kgf.`, { unit: 'kgf' }),
  n(2, 'escape speed', r`How many times is the kinetic energy needed to escape from the surface greater than the kinetic energy of a satellite orbiting just above the surface?`, () => 2, 0, 0,
    r`$v_e^2 = 2gR$ and $v_o^2 = gR$, so $\tfrac12mv_e^2\big/\tfrac12mv_o^2 = 2$.`),
  // ---------- Level 3 ----------
  m(3, 'variation of g with latitude', r`If the Earth spun faster until an object at the equator became weightless, the length of the day would be nearly ($R = 6400$ km, $g = 9.8$)`, '1.4 h', ['4.0 h', '6.0 h', '12 h'],
    r`Weightless means $\omega^2R = g$, so $\omega = \sqrt{g/R}$ and $T = 2\pi\sqrt{R/g} = 5077$ s $= 1.41$ h. This equals the period of a satellite just above the surface.`),
  n(3, 'gravitational field', r`Two point masses of 4 kg and 9 kg are 1 m apart. At what distance (in m) from the 4 kg mass, on the line joining them, is the gravitational field zero?`, () => 2 / 5, 0.005, 3,
    r`Let the point be $x$ from the 4 kg mass: $\dfrac{4}{x^2} = \dfrac{9}{(1-x)^2} \Rightarrow \dfrac{1-x}{x} = \dfrac32 \Rightarrow x = 0.4$ m.`, { unit: 'm', trap: 'The point is nearer the smaller mass.' }),
  m(3, 'gravitational self-energy', r`Three equal masses $m$ sit at the corners of an equilateral triangle of side $a$. Their gravitational potential energy is`, r`$-\dfrac{3Gm^2}{a}$`, [r`$-\dfrac{Gm^2}{a}$`, r`$-\dfrac{3Gm^2}{2a}$`, r`$-\dfrac{6Gm^2}{a}$`],
    r`There are three pairs, each at distance $a$: $U = 3\times\left(-\dfrac{Gm^2}{a}\right) = -\dfrac{3Gm^2}{a}$. Counting each pair twice would give $-6Gm^2/a$.`),
  m(3, 'satellite energy', r`A satellite in a low circular orbit loses energy slowly through air drag. It`, 'moves to a lower orbit and its speed increases', ['moves to a lower orbit and its speed decreases', 'stays at the same radius with a lower speed', 'moves to a higher orbit'],
    r`$E = -\dfrac{GMm}{2r}$ falls (becomes more negative), so $r$ decreases. $v = \sqrt{GM/r}$ then increases. Gravity does positive work as the satellite spirals in, which more than makes up for the loss to drag.`, { trap: 'Losing energy speeds it up.' }),
  n(3, 'surface gravity of planets', r`A planet has a density 0.8 times that of the Earth and a radius 1.5 times the Earth's. Find $g$ on it (in $\mathrm{m\,s^{-2}}$, 2 decimals; Earth's $g = 9.8$).`, () => 9.8 * 0.8 * 1.5, 0.01, 2,
    r`$g = \dfrac{GM}{R^2} = \dfrac{4}{3}\pi G\rho R\propto\rho R$. $g' = 9.8\times0.8\times1.5 = 11.76\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  n(3, 'satellites', r`Find the orbital radius (in thousands of km, 1 decimal) of a satellite that has a period of 24 h, using $g = 9.8$ and $R = 6400$ km.`, () => Math.cbrt(9.8 * 6.4e6 ** 2 * 86400 ** 2 / (4 * Math.PI ** 2)) / 1e6, 0.1, 1,
    r`$\dfrac{GMm}{r^2} = m\omega^2r$ with $GM = gR^2$: $r^3 = \dfrac{gR^2T^2}{4\pi^2} = \dfrac{9.8\times(6.4\times10^6)^2\times(86400)^2}{4\pi^2} = 7.59\times10^{22}$ m$^3$. $r = 4.23\times10^7$ m $= 42.3$ thousand km.`, { unit: '10³ km' }),
  n(3, 'gravitational potential', r`Find the gravitational potential at the Earth's surface (in MJ/kg, 2 decimals; value negative; $g = 9.8$, $R = 6400$ km).`, () => -9.8 * 6.4e6 / 1e6, 0.05, 2,
    r`$V = -\dfrac{GM}{R} = -gR = -9.8\times6.4\times10^6 = -6.27\times10^7\ \mathrm{J\,kg^{-1}} = -62.72$ MJ/kg.`, { unit: 'MJ/kg' }),
  n(3, 'gravitational potential energy', r`How much work (in GJ, 2 decimals) is needed to raise a 100 kg satellite from the Earth's surface to a height $R$ above it? ($g=9.8$, $R=6400$ km)`, () => 100 * 9.8 * 6.4e6 / 2 / 1e9, 0.01, 2,
    r`$\Delta U = GMm\left(\dfrac1R - \dfrac1{2R}\right) = \dfrac{GMm}{2R} = \dfrac{mgR}{2} = \dfrac{100\times9.8\times6.4\times10^6}2 = 3.14\times10^9$ J.`, { unit: 'GJ', trap: '$mgh$ would give twice this value.' }),
  n(3, 'orbital speed', r`Find the orbital speed (in km/s, 2 decimals) of a satellite at a height $3R$ above the Earth's surface ($g=9.8$, $R=6400$ km).`, () => Math.sqrt(9.8 * 6.4e6 / 4) / 1000, 0.01, 2,
    r`The orbit radius is $4R$. $v = \sqrt{GM/4R} = \tfrac12\sqrt{gR} = \tfrac12\times7.92 = 3.96$ km/s.`, { unit: 'km/s' }),
  n(3, 'Kepler\'s third law', r`An asteroid orbits the Sun with a mean distance of 4 AU. What is its period in Earth years?`, () => Math.pow(4, 1.5), 0, 0,
    r`$T^2\propto a^3$ with $T$ in years and $a$ in AU: $T = 4^{3/2} = 8$ years.`, { unit: 'years' }),
  n(3, 'Kepler\'s third law', r`A body takes 125 years to go round the Sun. Find its mean distance from the Sun (in AU).`, () => Math.pow(125, 2 / 3), 0, 0,
    r`$a^3 = T^2 = 15625$, so $a = 25$ AU.`, { unit: 'AU' }),
  n(3, 'orbital speed', r`Two satellites orbit the Earth at radii in the ratio $1:4$. Find the ratio of their speeds $v_1/v_2$.`, () => Math.sqrt(4), 0, 0,
    r`$v\propto r^{-1/2}$, so $v_1/v_2 = \sqrt{r_2/r_1} = \sqrt4 = 2$.`),
  n(3, 'satellites', r`A satellite around a planet has a period 27 times that of a satellite orbiting just above the planet's surface. How many planet radii from the centre is its orbit?`, () => Math.pow(27, 2 / 3), 0, 0,
    r`$T^2\propto r^3$, so $r = R\times27^{2/3} = 9R$.`, { unit: 'R' }),
  n(3, 'variation of g with depth', r`At what depth (in km) below the Earth's surface is $g$ equal to 60% of its surface value? Take a uniform Earth with $R = 6400$ km.`, () => 0.4 * 6400, 0, 0,
    r`$g' = g(1 - d/R) = 0.6g \Rightarrow d = 0.4R = 2560$ km.`, { unit: 'km' }),
  n(3, 'mixed: projectile', r`A ball is thrown vertically up at $10\ \mathrm{m\,s^{-1}}$ on the Moon, where $g = 1.62\ \mathrm{m\,s^{-2}}$. How long (in s, 2 decimals) is it in the air?`, () => 2 * 10 / 1.62, 0.01, 2,
    r`$t = 2u/g = 20/1.62 = 12.35$ s. (On the Earth the same throw would take about 2.04 s.)`, { unit: 's' }),
  m(3, 'tunnel through the Earth', r`A ball is dropped into a smooth tunnel through the centre of the Earth, taken as uniform. The time for one full oscillation is nearly`, '84.6 minutes', ['42.3 minutes', '169 minutes', '24 hours'],
    r`Inside, $a = -\dfrac gRx$ gives SHM with $T = 2\pi\sqrt{R/g} = 84.6$ min, the same as the period of a satellite just above the surface. The ball takes half of that, 42.3 min, to cross to the other end.`, { trap: 'One crossing is half a period.' }),
  t(3, 'variation of g with latitude', 'A body weighs slightly less at the equator than at the poles.', 'The Earth\'s rotation reduces the effective $g$ at the equator, and the equatorial radius is larger.', 0,
    r`Both are true. At the equator $g_{eff} = g - \omega^2R$, and the larger equatorial radius also makes the true pull a little smaller. Both effects point the same way.`),
  t(3, 'Kepler\'s second law', 'A planet moves fastest when it is nearest the Sun.', 'At that point the area swept out per second is the largest.', 2,
    r`I is true: $L = mvr$ is constant, so $v$ is greatest where $r$ is least. II is false: the area swept per second, $\dfrac L{2m}$, is the same everywhere.`),
  cn(3, 'concepts', 'How many of the following are correct?', ['The total energy of a satellite in a bound orbit is negative.', 'A planet in a circular orbit has a constant speed.', 'The escape speed from the Earth depends on the mass of the projectile.', 'The gravitational field inside a thin hollow spherical shell is zero.'], 3,
    r`(i) True: $E = -GMm/2r$. (ii) True: with the Sun's pull perpendicular to the velocity the speed does not change. (iii) False: the projectile's mass cancels. (iv) True. Three are correct.`),
  a(3, 'weightlessness', 'An astronaut in a satellite orbiting the Earth feels weightless.', 'There is no gravity at the height of the satellite.', 2,
    r`A is true: both the astronaut and the satellite are in free fall, so there is no contact force. R is false: gravity at that height is still large (about 90% of $g$ at 400 km).`, { trap: 'Weightlessness is free fall, not absence of gravity.' }),
  mt(3, 'surface gravity of planets', 'xg1', ['q', 'p', 't', 's'], r`$g\propto M/R^2$. A: $4/4 = 1\to g$ (q). B: $1/4\to g/4$ (p). C: $\tfrac12/1\to g/2$ (t). D: $16/4 = 4\to 4g$ (s). The entry $2g$ is not used.`),
  mt(3, 'satellites', 'xg2', ['p', 'q', 's', 'r'], r`Near the surface $T = 2\pi\sqrt{R/g}\approx1.4$ h (p). Geostationary: 24 h (q). Radius $4R$: $T = 1.4\text{ h}\times4^{3/2} = 11.3$ h (s). The Moon: 27.3 days (r).`),
  mt(3, 'gravitational field of a shell', 'xg3', ['p', 'r', 'q', 's'], r`Inside a shell the field is 0 (p) and the potential is constant, equal to its surface value $-GM/R$ (q). Outside, the shell acts as if all its mass were at the centre: field $GM/r^2$ (r), potential $-GM/r$ (s).`),
  mt(3, 'orbital speed', 'xg7', ['s', 'r', 'q', 'p'], r`$v_e = \sqrt{2gR} = 11.2$ km/s (s). $v_o = \sqrt{gR} = 7.92$ km/s (r). At $r = 2R$: $\sqrt{gR/2} = 5.60$ (q). At $r = 4R$: $\sqrt{gR/4} = 3.96$ (p).`),
  // ---------- Level 4 ----------
  n(4, 'field in a cavity', r`A uniform planet of radius $R$ has surface gravity $12\ \mathrm{m\,s^{-2}}$. A spherical cavity inside has its centre $0.4R$ from the planet's centre. Find the gravitational field (in $\mathrm{m\,s^{-2}}$) at any point inside the cavity.`, () => 12 * 0.4, 0.01, 2,
    r`Superposition: a full sphere minus a sphere of the same density filling the cavity. Inside a uniform sphere $\vec g = -\tfrac43\pi G\rho\,\vec r$. The difference of the two fields is $-\tfrac43\pi G\rho(\vec r - \vec r') = -\tfrac43\pi G\rho\,\vec d$, which has the constant size $\tfrac43\pi G\rho d = g\dfrac dR = 12\times0.4 = 4.8\ \mathrm{m\,s^{-2}}$ and does not depend on where in the cavity you are.`, { unit: 'm/s²', trap: 'The field in the cavity is uniform and depends only on the offset $d$.' }),
  n(4, 'gravitational self-energy', r`Four masses of 2 kg each sit at the corners of a square of side 0.5 m. Find their gravitational potential energy (in units of $10^{-9}$ J, 2 decimals, negative). $G = 6.67\times10^{-11}$.`, () => -(6.67e-11 * 4 / 0.5) * (4 + Math.SQRT2) / 1e-9, 0.01, 2,
    r`Four sides at distance $a$ and two diagonals at $a\sqrt2$: $U = -\dfrac{Gm^2}{a}\left(4 + \dfrac{2}{\sqrt2}\right) = -\dfrac{Gm^2}{a}(4+\sqrt2)$. With $\dfrac{Gm^2}{a} = \dfrac{6.67\times10^{-11}\times4}{0.5} = 5.336\times10^{-10}$: $U = -2.89\times10^{-9}$ J.`, { trap: 'Do not forget the two diagonal pairs.' }),
  n(4, 'field of a ring', r`The gravitational field of a uniform ring of radius $a = 0.5$ m, on its axis at distance $x$ from the centre, is largest at what $x$ (in m, 3 decimals)?`, () => 0.5 / Math.SQRT2, 0.001, 3,
    r`$g(x)\propto\dfrac{x}{(a^2+x^2)^{3/2}}$. Setting the derivative to zero: $(a^2+x^2) - 3x^2 = 0$, so $x = \dfrac a{\sqrt2} = 0.354$ m.`, { unit: 'm' }),
  n(4, 'satellite energy', r`How much energy (in GJ, 2 decimals) is needed to move a 100 kg satellite from a circular orbit of radius $2R$ to one of radius $4R$ (about the Earth, $g=9.8$, $R=6400$ km)?`, () => 100 * 9.8 * 6.4e6 / 8 / 1e9, 0.01, 2,
    r`$E = -\dfrac{GMm}{2r} = -\dfrac{mgR^2}{2r}$. $\Delta E = \dfrac{mgR^2}2\left(\dfrac1{2R}-\dfrac1{4R}\right) = \dfrac{mgR}{8} = \dfrac{100\times9.8\times6.4\times10^6}{8} = 7.84\times10^8$ J.`, { unit: 'GJ' }),
  n(4, 'projectile', r`A rocket is fired vertically from the Earth's surface at $6\ \mathrm{km\,s^{-1}}$ with engines off after launch. Find the greatest height (in km) above the surface. Take $g = 9.8$, $R = 6400$ km, and allow for the change of $g$ with height.`, () => (6.4e6 / (1 - 6000 ** 2 / (2 * 9.8 * 6.4e6)) - 6.4e6) / 1e3, 5, 0,
    r`Energy: $\tfrac12v^2 - \dfrac{GM}{R} = -\dfrac{GM}{r}$ with $GM = gR^2$. $\dfrac1r = \dfrac1R\left(1 - \dfrac{v^2}{2gR}\right) = \dfrac1R(1 - 0.287)$. $r = 8.98\times10^6$ m, so $h = r - R = 2576$ km. (The constant-$g$ answer $v^2/2g = 1837$ km is much too small.)`, { unit: 'km', trap: 'At this height $g$ is no longer constant.' }),
  n(4, 'satellite energy', r`Two stars of masses $M$ and $4M$ move in circles about their centre of mass. Find the ratio of the speed of the lighter to that of the heavier.`, () => 4, 0, 0,
    r`The same gravitational force acts on each and no external force acts, so the centre of mass stays fixed and $Mv_1 = 4Mv_2$. $v_1/v_2 = 4$. (Equivalently the radii are in the ratio $4:1$ and they share the same $\omega$.)`),
  n(4, 'satellites', r`A satellite's orbit just above a planet of mean density $5500\ \mathrm{kg\,m^{-3}}$ has what period (in minutes, 1 decimal)? $G = 6.67\times10^{-11}$.`, () => Math.sqrt(3 * Math.PI / (6.67e-11 * 5500)) / 60, 0.3, 1,
    r`$\dfrac{GM}{R^2} = \dfrac{4\pi^2R}{T^2}$ with $M = \tfrac43\pi R^3\rho$ gives $T = \sqrt{\dfrac{3\pi}{G\rho}} = \sqrt{\dfrac{9.425}{6.67\times10^{-11}\times5500}} = 5069$ s $= 84.5$ min. It depends only on the density, not on the planet's size.`, { unit: 'min' }),
  n(4, 'mixed: circular motion', r`Because of the Earth's rotation ($\omega = 7.27\times10^{-5}\ \mathrm{rad\,s^{-1}}$), by what percentage (3 decimals) is the apparent weight of a body at the equator less than its true weight? ($g=9.8$, $R=6400$ km)`, () => (7.27e-5 ** 2 * 6.4e6 / 9.8) * 100, 0.005, 3,
    r`Apparent weight $= m(g - \omega^2R)$. $\omega^2R = (7.27\times10^{-5})^2\times6.4\times10^6 = 0.0338\ \mathrm{m\,s^{-2}}$, and $0.0338/9.8 = 0.345\%$.`, { unit: '%' }),
  m(4, 'tunnel through the Earth', r`A ball is released from rest at the Earth's surface into a smooth tunnel along a diameter (uniform Earth, no air). Which statement is correct?`, r`It passes the centre at $\sqrt{gR}$ and its acceleration there is zero.`, [r`It passes the centre at $\sqrt{2gR}$ and its acceleration there is $g$.`, r`It passes the centre at $\sqrt{gR}$ and its acceleration there is $g/2$.`, r`It stops at the centre because gravity vanishes there.`],
    r`The force $F = -\dfrac{mg}{R}x$ gives SHM with amplitude $R$ and $\omega = \sqrt{g/R}$. At the centre the speed is the maximum, $\omega R = \sqrt{gR}$, and $a = 0$. Energy check: $\tfrac12v^2 = \tfrac12gR$ since the potential rises from $-\tfrac32gR$ at the centre to $-gR$ at the surface. The ball does not stop; it overshoots.`),
  m(4, 'non-uniform sphere', r`A sphere of radius $R$ has density $\rho = \rho_0\left(1 - \dfrac rR\right)$. Inside it, the gravitational field is greatest at $r$ equal to`, r`$\dfrac{2R}{3}$`, [r`$\dfrac R2$`, r`$R$`, r`$\dfrac{3R}{4}$`],
    r`$M(r) = 4\pi\rho_0\left(\dfrac{r^3}{3} - \dfrac{r^4}{4R}\right)$, so $g(r) = \dfrac{GM(r)}{r^2} = 4\pi G\rho_0\left(\dfrac r3 - \dfrac{r^2}{4R}\right)$. $\dfrac{dg}{dr} = 0$: $\dfrac13 - \dfrac{r}{2R} = 0 \Rightarrow r = \dfrac{2R}{3}$.`, { trap: 'For a uniform sphere the maximum is at the surface; here the density drops outward.' }),
  s(4, 'satellite energy', r`For a satellite in a circular orbit about a planet, which of the following are correct?`,
    ['Its total energy is positive.', 'Its kinetic energy equals the magnitude of its total energy.', 'Its potential energy is twice its total energy.', r`Its speed varies as $r^{-1/2}$.`], [1, 2, 3],
    r`$K = \dfrac{GMm}{2r}$, $U = -\dfrac{GMm}{r}$, $E = -\dfrac{GMm}{2r}$. So E is negative (A false), $K = |E|$ (B true), $U = 2E$ (C true), and $v = \sqrt{GM/r}$ (D true).`),
  s(4, 'Kepler\'s laws', r`A planet moves in an elliptical orbit about the Sun. Which statements are correct?`,
    ['Its speed is greatest at perihelion.', 'The area swept out per unit time is constant.', 'Its total energy is larger at perihelion than at aphelion.', 'Its angular momentum about the Sun is constant.'], [0, 1, 3],
    r`Speed is greatest at the nearest point (A true). Areal speed $= L/2m$ is constant (B true). The total energy $-GMm/2a$ is the same at every point (C false); at perihelion the kinetic energy is larger but the potential energy is lower by the same amount. $L$ is conserved because gravity is central (D true).`),
  s(4, 'variation of g with latitude', r`Considering the Earth's rotation, which statements are correct?`,
    ['The effective $g$ is least at the equator.', 'The effective $g$ is greatest at the poles.', 'At the poles the rotation has no effect on the weight.', r`At the equator the effective $g$ is $g + \omega^2R$.`], [0, 1, 2],
    r`At latitude $\lambda$, $g' \approx g - \omega^2R\cos^2\lambda$. At the equator ($\lambda=0$) this is $g - \omega^2R$, the least value (A true, D false). At the poles $\cos\lambda = 0$, so no reduction (B and C true).`),
  s(4, 'weightlessness', r`Inside a satellite orbiting the Earth, which of these are true?`,
    ['A pendulum clock stops working.', 'A spring balance reads zero when a body is hung from it.', 'The satellite and its contents feel no gravitational pull.', 'There is no buoyant force on an object placed in water.'], [0, 1, 3],
    r`All objects are in free fall, so the effective gravity is zero: a pendulum has no restoring force (A true); a hanging body does not stretch the spring (B true); buoyancy needs a pressure increase with depth, which needs weight (D true). Gravity does still act (C false): it is what keeps them in orbit.`),
  s(4, 'gravitational potential', r`For a uniform solid sphere of mass $M$ and radius $R$, which are correct?`,
    ['The potential at its centre is zero.', r`The potential at its centre is $-\dfrac{3GM}{2R}$.`, 'The field at its centre is zero.', r`Inside, the field is proportional to the distance from the centre.`], [1, 2, 3],
    r`Inside, $g = \dfrac{GMr}{R^3}$ (D true), zero at the centre (C true). The potential is $V = -\dfrac{GM}{2R^3}(3R^2 - r^2)$, which is $-\dfrac{3GM}{2R}$ at the centre (B true, A false).`),
  a(4, 'orbital speed', 'The orbital speed of a satellite does not depend on the satellite\'s own mass.', r`In $v = \sqrt{GM/r}$, $M$ is the mass of the planet, and the satellite's mass cancels from the equation of motion.`, 0,
    r`$\dfrac{mv^2}{r} = \dfrac{GMm}{r^2}$: $m$ cancels. So A is true and R explains it.`),
  a(4, 'escape speed', 'The escape speed from the Moon is much smaller than from the Earth.', r`The escape speed varies as $\sqrt{M/R}$, and the Moon's $M/R$ is much smaller than the Earth's.`, 0,
    r`$M_m/M_e = 1/81$ and $R_m/R_e\approx0.27$, so $M/R$ is about $0.045$ of the Earth's, and $v_e = 11.2\times\sqrt{0.045}\approx2.4$ km/s. Both true, and R explains A.`),
  a(4, 'gravitational potential', 'The gravitational potential at every point inside a thin uniform spherical shell is zero.', 'The gravitational field inside a thin uniform spherical shell is zero.', 3,
    r`A is false: the field being zero means the potential is constant, equal to its surface value $-GM/R$, not zero. R is true.`, { trap: 'Zero field does not mean zero potential.' }),
  t(4, 'satellites', 'A geostationary satellite can be placed above any city.', 'A geostationary orbit must lie in the equatorial plane.', 3,
    r`I is false: only points on the equator can be directly below it (the orbit's plane must contain the Earth's centre, and a stationary orbit needs the same sense and period as the Earth's rotation, which forces the equatorial plane). II is true.`),
  cn(4, 'Kepler\'s laws', 'How many of the following are correct?', ['The second law holds for any central force.', 'The third law ($T^2\\propto a^3$) holds for any central force.', 'The Moon\'s acceleration towards the Earth is about $g/3600$.', 'The weight of a 5 kg body at the centre of the Earth is $5g$.'], 2,
    r`(i) True: it needs only constant angular momentum. (ii) False: $T^2\propto a^3$ needs an inverse-square force. (iii) True: the Moon is 60 Earth radii away, and $1/60^2 = 1/3600$. (iv) False: at the centre $g = 0$. Two are correct.`),
  mt(4, 'binary stars', 'xg4', ['r', 's', 'p', 'q'], r`Each moves on a circle of radius $d/2$: $\dfrac{GM^2}{d^2} = \dfrac{Mv^2}{d/2}$, so $v = \sqrt{GM/2d}$ (r). $T = \dfrac{2\pi(d/2)}{v} = 2\pi\sqrt{\dfrac{d^3}{2GM}}$ (s). Total energy: kinetic $= 2\cdot\tfrac12Mv^2 = \dfrac{GM^2}{2d}$, potential $-\dfrac{GM^2}{d}$; sum $-\dfrac{GM^2}{2d}$ (p). $\omega = v/(d/2) = \sqrt{2GM/d^3}$ (q).`),
  mt(4, 'satellite energy', 'xg5', ['r', 'p', 's', 'q'], r`$K = \dfrac{GMm}{2r}$ (r). $U = -\dfrac{GMm}{r}$ (p). $E = -\dfrac{GMm}{2r}$ (s). At $2r$: $E' = -\dfrac{GMm}{4r}$. Required $E' - E = \dfrac{GMm}{4r}$ (q).`),
  mt(4, 'elliptical orbits', 'xg8', ['q', 'r', 's', 'p'], r`$v_pr_p = v_ar_a$ with $r_a = 3r_p$: $v_p/v_a = 3$ (q). $a = \dfrac{r_p+3r_p}2 = 2r_p$ (r). $e = \dfrac{r_a-r_p}{r_a+r_p} = \tfrac12$ (s). KE ratio $= (v_p/v_a)^2 = 9$ (p).`),
  // ---------- Level 5 ----------
  n(5, 'orbit change', r`A satellite is in a circular orbit of radius 7000 km. A short burn along its motion raises its speed to 1.2 times the circular speed. The new orbit is an ellipse with the burn point at perigee. Find the apogee distance from the Earth's centre (in km).`, () => 7000 * 1.44 / (2 - 1.44), 5, 0,
    r`At perigee $v_p = 1.2v_0$ with $v_0^2 = GM/r_0$. Let $x = r_a/r_0$. Angular momentum: $v_a = 1.2v_0/x$. Energy: $\tfrac12(1.44)v_0^2 - v_0^2 = \tfrac12\dfrac{1.44v_0^2}{x^2} - \dfrac{v_0^2}{x}$. This reduces to $0.28x^2 - x + 0.72 = 0$, whose roots are $x = 1$ (the burn point) and $x = 0.72/0.28 = 2.571$. $r_a = 2.571\times7000 = 18\,000$ km.`, { unit: 'km', trap: 'One root is the starting point itself.' }),
  n(5, 'gravitational self-energy', r`Two particles of mass 2 kg each are released from rest 2 m apart in empty space. What is the speed of each (in micrometres per second, 2 decimals) when they are 1 m apart? $G = 6.67\times10^{-11}$.`, () => Math.sqrt(6.67e-11 * 2 * 0.5) * 1e6, 0.02, 2,
    r`Energy: $2\times\tfrac12mv^2 = Gm^2\left(\dfrac11 - \dfrac12\right) \Rightarrow v^2 = \dfrac{Gm}{2} = 6.67\times10^{-11}$. $v = 8.17\times10^{-6}\ \mathrm{m\,s^{-1}} = 8.17\ \mu\mathrm{m\,s^{-1}}$.`, { unit: 'μm/s' }),
  n(5, 'non-uniform sphere', r`A sphere of radius $R$ has density $\rho = \rho_0(1 - r/R)$. Find the ratio $g(R/2)/g(R)$ of the gravitational field at half the radius to that at the surface (2 decimals).`, () => (1 / 6 - 1 / 16) / (1 / 3 - 1 / 4), 0.01, 2,
    r`$g(r) = 4\pi G\rho_0\left(\dfrac r3 - \dfrac{r^2}{4R}\right)$. At $r = R/2$: $R\left(\dfrac16 - \dfrac1{16}\right) = \dfrac{5R}{48}$. At $r = R$: $R\left(\dfrac13-\dfrac14\right) = \dfrac R{12}$. Ratio $= \dfrac{5/48}{1/12} = \dfrac54 = 1.25$.`, { trap: 'A uniform sphere would give $\\tfrac12$; the field is larger inside here.' }),
  n(5, 'binary stars', r`Two stars of masses $m_1 = 2M$ and $m_2 = M$ are held at rest a distance $d$ apart, then released. Find the ratio $v_1/v_2$ of their speeds when they have approached to $d/2$.`, () => 0.5, 0.001, 3,
    r`Linear momentum is conserved: $2Mv_1 = Mv_2$, so $v_1/v_2 = \tfrac12$ (this does not depend on the separation).`, { trap: 'The question needs only momentum, not energy.' }),
  m(5, 'orbit change', r`A satellite in a circular orbit has its speed suddenly increased by a small amount along its direction of motion. Its new orbit is`, 'an ellipse with the point of the burn as the perigee', ['a circle of larger radius', 'an ellipse with the point of the burn as the apogee', 'a circle of the same radius, but with a longer period'],
    r`At the burn point the satellite's speed exceeds the circular speed for that radius, and its velocity is perpendicular to the radius. That is the nearest point of the new ellipse (perigee), the speed is the greatest there. The orbit rises on the other side of the Earth. A circle needs a different speed at every radius, so a speed change at one point cannot give a larger circle.`, { trap: 'Speeding up does not mean it moves to a faster, lower orbit.' }),
  s(5, 'binary stars', r`Two stars of unequal masses move in circular orbits about their common centre of mass, under their mutual gravity only. Which statements are correct?`,
    ['Both stars have the same angular velocity.', 'The lighter star moves in the larger circle.', 'Both stars have the same orbital speed.', 'The ratio of their kinetic energies is the inverse of the ratio of their masses.'], [0, 1, 3],
    r`The line joining them turns as one, so $\omega$ is equal (A true). $m_1r_1 = m_2r_2$, so the lighter star has the larger $r$ (B true) and hence the larger speed $v = \omega r$ (C false). $K = \tfrac12m\omega^2r^2\propto m\cdot\dfrac1{m^2} = \dfrac1m$ (D true).`),
  s(5, 'escape speed', r`Which statements about escape from the Earth's surface are correct (ignore air and rotation)?`,
    ['The escape speed is the same for every direction of launch (that does not hit the ground).', 'The escape speed is larger for a heavier body.', 'The escape speed from a height is smaller than from the surface.', 'A body launched at the escape speed follows a parabolic path.'], [0, 2, 3],
    r`Energy conservation gives $\tfrac12mv^2 = GMm/r$ whatever the direction (A true). The mass cancels (B false). A larger $r$ means a smaller required speed (C true). With $E = 0$ the path is a parabola (D true).`),
  s(5, 'orbit change', r`A satellite in a circular orbit is given a small forward kick along its velocity by a thruster. Which statements are correct?`,
    ['Its total energy decreases.', 'The new orbit is an ellipse with the kick point as perigee.', 'At the new apogee its speed is greater than the original circular speed.', 'Its period increases.'], [1, 3],
    r`The kick adds kinetic energy, so the total energy increases (A false). The burn point becomes the perigee (B true). The semi-major axis is larger than before, so by $T^2\\propto a^3$ the period increases (D true). At the new apogee the satellite is farther out and slower than it was at the burn point, so its speed is below the original circular speed (C false).`),
  s(5, 'tunnel through the Earth', r`A ball is dropped into a smooth tunnel along a diameter of a uniform Earth. Which of these are correct?`,
    ['The motion is simple harmonic.', r`Its speed at the centre is $\sqrt{gR}$.`, r`Its acceleration at the centre is $g/2$.`, 'It takes about 42 minutes to reach the other end.'], [0, 1, 3],
    r`$a = -\dfrac gRx$ gives SHM (A true) with $\omega = \sqrt{g/R}$, so $v_{max} = \omega R = \sqrt{gR}$ (B true). At the centre $a = 0$ (C false). The crossing takes $T/2 = \pi\sqrt{R/g} = 42.3$ min (D true).`),
  s(5, 'gravitational field', r`For a uniform solid sphere of mass $M$ and radius $R$, which of these are correct?`,
    ['The field is greatest at the centre.', r`The field at a distance $r < R$ is $\dfrac{GMr}{R^3}$.`, r`The potential energy of a mass $m$ at $r<R$ is $-\dfrac{GMm(3R^2 - r^2)}{2R^3}$.`, 'The field is greatest at the surface.'], [1, 2, 3],
    r`$g(r) = \dfrac{GMr}{R^3}$ inside, rising from zero at the centre to $GM/R^2$ at the surface, and then falling as $1/r^2$, so the maximum is at the surface (A false, D true). The potential energy follows by integrating the field (C true).`),
  a(5, 'satellite energy', 'The total energy of a satellite in a bound circular orbit is negative.', 'The kinetic energy of the satellite is half the magnitude of its potential energy.', 0,
    r`$K = \dfrac{GMm}{2r}$ and $|U| = \dfrac{GMm}{r}$, so $K = \tfrac12|U|$ and $E = K + U = -K$. R is true and it directly gives the negative sign of $E$.`),
  cn(5, 'concepts', 'How many of the following are correct?', ['A satellite near the Earth\'s surface has $T = 2\\pi\\sqrt{R/g}$.', 'The time to cross the Earth along a tunnel through its centre equals half that period.', 'A planet\'s areal speed is the same at all points of its orbit.', 'The kinetic energy of a satellite in a circular orbit is double the magnitude of its total energy.'], 3,
    r`(i) True. (ii) True: SHM with the same $T$, crossing takes $T/2$. (iii) True: $L/2m$. (iv) False: the kinetic energy equals the magnitude of the total energy. Three are correct.`),
  mt(5, 'free fall', 'xg6', ['r', 'p', 'q', 's'], r`From infinity: $\tfrac12v^2 = gR \Rightarrow v = \sqrt{2gR} = 11.2$ km/s (r). From $r = 2R$: $\tfrac12v^2 = gR^2\left(\dfrac1R - \dfrac1{2R}\right) = \tfrac12gR$, $v = \sqrt{gR} = 7.92$ (p). From $r = 4R$: $\tfrac12v^2 = gR\left(1 - \tfrac14\right)$, $v = \sqrt{1.5\,gR} = 9.70$ (q). Fired at $\sqrt{gR}$: $\tfrac12gR = gR^2\left(\dfrac1R - \dfrac1r\right) \Rightarrow r = 2R$, height $R = 6400$ km (s).`),
);

items.push(
  pn(4, 'binary stars', 'xgp1', r`Find the orbital speed of each star (in km/s, 2 decimals).`, () => Math.sqrt(6.67e-11 * 4e30 / (2 * 1e11)) / 1000, 0.05, 2,
    r`Each moves on a circle of radius $d/2 = 5\times10^{10}$ m. $\dfrac{GM^2}{d^2} = \dfrac{Mv^2}{d/2} \Rightarrow v = \sqrt{\dfrac{GM}{2d}} = \sqrt{\dfrac{6.67\times10^{-11}\times4\times10^{30}}{2\times10^{11}}} = 3.65\times10^4\ \mathrm{m\,s^{-1}}$.`, { unit: 'km/s' }),
  pn(4, 'binary stars', 'xgp1', r`Find the period of revolution (in days, 1 decimal).`, () => Math.PI * 1e11 / Math.sqrt(6.67e-11 * 4e30 / 2e11) / 86400, 0.2, 1,
    r`$T = \dfrac{2\pi(d/2)}{v} = \dfrac{\pi\times10^{11}}{3.652\times10^4} = 8.60\times10^6$ s $= 99.6$ days.`, { unit: 'days' }),
  pn(5, 'binary stars', 'xgp1', r`Find the total mechanical energy of the pair (in units of $10^{39}$ J, 2 decimals, negative).`, () => -6.67e-11 * 16e60 / 2e11 / 1e39, 0.01, 2,
    r`$E = -\dfrac{GM^2}{2d} = -\dfrac{6.67\times10^{-11}\times(4\times10^{30})^2}{2\times10^{11}} = -5.34\times10^{39}$ J.`, { unit: '10³⁹ J' }),
  pn(3, 'tunnel through the Earth', 'xgp2', r`Find the acceleration of the ball when it is halfway to the centre, at $R/2$ from it (in $\mathrm{m\,s^{-2}}$, 1 decimal).`, () => 9.8 / 2, 0.05, 2,
    r`Inside a uniform sphere $g(r) = g\dfrac rR$. At $r = R/2$: $4.9\ \mathrm{m\,s^{-2}}$.`, { unit: 'm/s²' }),
  pn(4, 'tunnel through the Earth', 'xgp2', r`Find the speed of the ball as it passes the centre (in km/s, 2 decimals).`, () => Math.sqrt(9.8 * 6.4e6) / 1000, 0.01, 2,
    r`Energy: the potential at the centre is $-\tfrac32gR$ and at the surface $-gR$. $\tfrac12v^2 = \tfrac12gR$, $v = \sqrt{gR} = \sqrt{6.272\times10^7} = 7.92$ km/s.`, { unit: 'km/s' }),
  pn(4, 'tunnel through the Earth', 'xgp2', r`How long (in minutes, 1 decimal) does the ball take to reach the other end?`, () => Math.PI * Math.sqrt(6.4e6 / 9.8) / 60, 0.1, 1,
    r`SHM with $\omega = \sqrt{g/R}$. A trip across is half a period: $t = \pi\sqrt{R/g} = \pi\times808.1 = 2539$ s $= 42.3$ min.`, { unit: 'min' }),
);

items.push(
  n(4, 'satellite energy', r`A satellite is moved to a new circular orbit in which its kinetic energy is one-ninth of its original value. The new orbital radius is $n$ times the original. Find $n$.`, () => 9, 0, 0,
    r`$K = \dfrac{GMm}{2r}\propto\dfrac1r$. For $K$ to fall to $\tfrac19$, $r$ must grow 9 times: $n = 9$.`),
  n(3, 'satellite energy', r`The energy needed to take a satellite in a circular orbit of radius $r$ to infinity is $E$. If its orbital radius were 3 times larger, the energy needed would be $E/k$. Find $k$.`, () => 3, 0, 0,
    r`The energy needed is $|E_{total}| = \dfrac{GMm}{2r}\propto\dfrac1r$. With $r\to3r$ it becomes $E/3$, so $k = 3$.`),
  n(3, 'orbital speed', r`A satellite's speed is $1/\sqrt5$ of the speed of a satellite orbiting just above the Earth's surface. Its orbital radius is how many Earth radii?`, () => 5, 0, 0,
    r`$v\propto r^{-1/2}$, so $r = 5R$.`, { unit: 'R' }),
  n(5, 'non-uniform sphere', r`A sphere of radius $R$ has density $\rho_0(1 - r/R)$. Its mass is $1/n$ of the mass of a uniform sphere of the same radius and density $\rho_0$. Find $n$.`, () => 1 / ((1 / 3 - 1 / 4) * 3), 0, 0,
    r`$M = \int_0^R4\pi r^2\rho_0\left(1-\dfrac rR\right)dr = 4\pi\rho_0\left(\dfrac{R^3}3 - \dfrac{R^3}4\right) = \dfrac{\pi\rho_0R^3}{3}$. A uniform sphere has $\dfrac{4\pi\rho_0R^3}3$. The ratio is $\tfrac14$, so $n = 4$.`),
);

gens.push(
  gx(2, 'nat', 'variation of g with height', (rng) => {
    const k = pick(rng, 0.25, 3, 0.25); const w = pick(rng, 40, 90, 5);
    const W = w * 9.8 / (1 + k) ** 2;
    return { k, w, q: `A ${w} kg body is raised to a height of ${k} Earth radii above the surface. What is its weight there (in N, 1 decimal, $g=9.8$ at the surface)?`, answer: +W.toFixed(1), tol: 0.2, unit: 'N',
      sol: `Distance from the centre $= (1+${k})R$, so $g' = \\dfrac{g}{(1+${k})^2}$. $W = ${w}\\times9.8/${+((1 + k) ** 2).toFixed(4)} = ${W.toFixed(1)}$ N.` };
  }, (p) => { const GM = 9.8 * 6.4e6 ** 2; const r = 6.4e6 * (1 + p.k); return p.w * GM / (r * r); }),
  gx(3, 'nat', 'escape speed', (rng) => {
    const mr = pick(rng, 0.5, 8, 0.5); const rr = pick(rng, 0.5, 2, 0.5);
    const v = 11.2 * Math.sqrt(mr / rr);
    return { mr, rr, q: `A planet has ${mr} times the Earth's mass and ${rr} times its radius. Find its escape speed (in km/s, 1 decimal; Earth's is 11.2 km/s).`, answer: +v.toFixed(1), tol: 0.1, unit: 'km/s',
      sol: `$v_e = \\sqrt{2GM/R}\\propto\\sqrt{M/R}$. $v_e = 11.2\\times\\sqrt{${mr}/${rr}} = ${v.toFixed(1)}$ km/s.` };
  }, (p) => { const gp = 9.8 * p.mr / p.rr ** 2; const Rp = 6.4e6 * p.rr; return Math.sqrt(2 * gp * Rp) / 1000 * (11.2 / (Math.sqrt(2 * 9.8 * 6.4e6) / 1000)); }),
  gx(3, 'mcq', 'orbital speed', (rng) => {
    const k = choose(rng, [4, 9, 16, 25]); const root = Math.sqrt(k);
    const ans = `${'its speed becomes 1/' + root + ' of the original, and the period becomes ' + (k * root) + ' times'}`;
    const o = shuffleOpts(rng, ans, [`its speed becomes 1/${k} of the original, and the period becomes ${k} times`, `its speed becomes ${root} times the original, and the period becomes ${root} times`, `its speed becomes 1/${root} of the original, and the period becomes ${k} times`]);
    return { k, opts: o.options, ans, q: `A satellite's orbital radius is made ${k} times larger. Choose the correct statement.`, options: o.options, answer: o.answer,
      sol: `$v\\propto r^{-1/2}$ gives $v\\to v/\\sqrt{${k}} = v/${root}$. $T\\propto r^{3/2}$ gives $T\\to${k}^{3/2}T = ${k * root}T$.`, trap: 'Check the powers: $-1/2$ for speed, $3/2$ for period.' };
  }, (p) => p.opts.indexOf(p.ans)),
  gx(4, 'nat', 'satellite energy', (rng) => {
    const m1 = pick(rng, 50, 500, 50); const a = int(rng, 1, 3) + 1; const b = a + int(rng, 1, 3);
    const E = m1 * 9.8 * 6.4e6 / 2 * (1 / a - 1 / b) / 1e9;
    return { m1, a, b, q: `How much energy (in GJ, 3 decimals) must be given to a ${m1} kg satellite to move it from a circular orbit of radius ${a}R to one of radius ${b}R about the Earth ($g=9.8$, $R=6400$ km)?`, answer: +E.toFixed(3), tol: 0.005, unit: 'GJ',
      sol: `$E = -\\dfrac{GMm}{2r}$ with $GM = gR^2$. $\\Delta E = \\dfrac{mgR}{2}\\left(\\dfrac1{${a}} - \\dfrac1{${b}}\\right) = ${E.toFixed(3)}$ GJ.` };
  }, (p) => { const GM = 9.8 * 6.4e6 ** 2; const e = (r) => -GM * p.m1 / (2 * r); return (e(p.b * 6.4e6) - e(p.a * 6.4e6)) / 1e9; }),
  gx(4, 'nat', 'Kepler\'s third law', (rng) => {
    const T1 = pick(rng, 2, 12, 1); const r1 = pick(rng, 4, 10, 1) * 1000; const k = choose(rng, [2, 3, 4, 5]);
    const T2 = T1 * Math.pow(k, 1.5);
    return { T1, r1, k, q: `A moon orbits its planet in ${T1} days at a mean distance of ${r1} km. A second moon is ${k} times farther. Find its period (in days, 1 decimal).`, answer: +T2.toFixed(1), tol: 0.1, unit: 'days',
      sol: `$T^2\\propto r^3$, so $T_2 = T_1\\,${k}^{3/2} = ${T1}\\times${+Math.pow(k, 1.5).toFixed(3)} = ${T2.toFixed(1)}$ days.` };
  }, (p) => Math.sqrt(p.T1 ** 2 * (p.k * p.r1) ** 3 / p.r1 ** 3)),
  gx(4, 'nat', 'projectile', (rng) => {
    const v = pick(rng, 3, 9, 0.5) * 1000;
    const h = (6.4e6 / (1 - v * v / (2 * 9.8 * 6.4e6)) - 6.4e6) / 1e3;
    return { v, q: `A projectile is fired vertically from the Earth's surface at ${v / 1000} km/s. Find the greatest height it reaches (in km, nearest 10), allowing for the change of $g$ ($g=9.8$, $R=6400$ km).`, answer: Math.round(h / 10) * 10, tol: 10, unit: 'km',
      sol: `$\\dfrac1r = \\dfrac1R\\left(1 - \\dfrac{v^2}{2gR}\\right)$. With $v^2/2gR = ${(v * v / (2 * 9.8 * 6.4e6)).toFixed(4)}$: $r = ${(6.4e6 / (1 - v * v / (2 * 9.8 * 6.4e6)) / 1e3).toFixed(0)}$ km. $h = r - R \\approx ${h.toFixed(0)}$ km.` };
  }, (p) => { const GM = 9.8 * 6.4e6 ** 2; const E = 0.5 * p.v ** 2 - GM / 6.4e6; return Math.round((-GM / E - 6.4e6) / 1e4) * 10; }),
  gx(3, 'nat', 'gravitational field', (rng) => {
    const a = pick(rng, 1, 9, 1); const b = pick(rng, 1, 9, 1); const d = pick(rng, 1, 5, 1);
    const x = d * Math.sqrt(a) / (Math.sqrt(a) + Math.sqrt(b));
    return { a, b, d, q: `Two point masses of ${a} kg and ${b} kg are ${d} m apart. At what distance from the ${a} kg mass, on the line between them, is the gravitational field zero (in m, 3 decimals)?`, answer: +x.toFixed(3), tol: 0.002, unit: 'm',
      sol: `$\\dfrac{${a}}{x^2} = \\dfrac{${b}}{(${d}-x)^2} \\Rightarrow \\dfrac{${d}-x}{x} = \\sqrt{${b}/${a}}$. $x = ${d}\\sqrt{${a}}/(\\sqrt{${a}}+\\sqrt{${b}}) = ${x.toFixed(3)}$ m.` };
  }, (p) => { let lo = 0; let hi = p.d; for (let i = 0; i < 80; i++) { const x = (lo + hi) / 2; if (p.a / (x * x) > p.b / ((p.d - x) ** 2)) lo = x; else hi = x; } return (lo + hi) / 2; }),
  gx(5, 'nat', 'orbit change', (rng) => {
    const f = pick(rng, 1.05, 1.35, 0.05); const r0 = pick(rng, 6600, 9000, 200);
    const ra = r0 * f * f / (2 - f * f);
    return { f, r0, q: `A satellite in a circular orbit of radius ${r0} km gets a short burn along its motion that raises its speed to ${f} times the circular speed. Find the apogee distance from the Earth's centre (in km, nearest km).`, answer: Math.round(ra), tol: 1, unit: 'km',
      sol: `With $x = r_a/r_0$: $L$ gives $v_a = fv_0/x$ and energy gives $\\dfrac{f^2}{2} - 1 = \\dfrac{f^2}{2x^2} - \\dfrac1x$. The non-trivial root is $x = \\dfrac{f^2}{2-f^2} = ${(f * f / (2 - f * f)).toFixed(4)}$. $r_a = ${Math.round(ra)}$ km.` };
  }, (p) => { const GM = 1; const v0 = Math.sqrt(GM / p.r0); const vp = p.f * v0; const E = 0.5 * vp * vp - GM / p.r0; const L = vp * p.r0; let lo = p.r0 * 1.0001; let hi = p.r0 * 1000; const fn = (r) => 0.5 * (L / r) ** 2 - GM / r - E; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (fn(mid) < 0) lo = mid; else hi = mid; } return Math.round((lo + hi) / 2); }),
  gx(4, 'nat', 'binary stars', (rng) => {
    const M1 = pick(rng, 1, 6, 1); const M2 = pick(rng, 1, 6, 1); const d = pick(rng, 1, 5, 1);
    const T = 2 * Math.PI * Math.sqrt((d * 1e11) ** 3 / (6.67e-11 * (M1 + M2) * 1e30)) / 86400;
    return { M1, M2, d, q: `Two stars of masses ${M1} and ${M2} (in units of $10^{30}$ kg) are always ${d} × 10<sup>11</sup> m apart and move in circles about their centre of mass. Find the period (in days, 1 decimal; $G = 6.67\\times10^{-11}$).`, answer: +T.toFixed(1), tol: 0.2, unit: 'days',
      sol: `$T = 2\\pi\\sqrt{\\dfrac{d^3}{G(M_1+M_2)}} = 2\\pi\\sqrt{\\dfrac{(${d}\\times10^{11})^3}{6.67\\times10^{-11}\\times${M1 + M2}\\times10^{30}}} = ${T.toFixed(1)}$ days.` };
  }, (p) => { const G = 6.67e-11; const m1 = p.M1 * 1e30; const m2 = p.M2 * 1e30; const d = p.d * 1e11; const r1 = d * m2 / (m1 + m2); const w2 = G * m2 / (d * d * r1); return 2 * Math.PI / Math.sqrt(w2) / 86400; }),
  gx(3, 'mcq', 'variation of g', (rng) => {
    const kind = choose(rng, ['height', 'depth']); const f = choose(rng, [1, 2, 3]);
    const fr = (u, v) => (u === 1 ? `g/${v}` : `${u}g/${v}`);
    let right; let wrong; let q;
    if (kind === 'height') { right = [1, (1 + f) ** 2]; wrong = [[1, 1 + f], [f, f + 1], [1, f], [1, 2 * (1 + f)]]; q = `At a height of ${f}R above the Earth's surface, the acceleration due to gravity is`; } else { right = [f + 1 - 1, f + 1]; wrong = [[1, (f + 1) ** 2], [1, f + 1], [f + 2, f + 1 + 1], [1, f + 2]]; q = `At a depth of R/${f + 1} below the surface (uniform Earth), the acceleration due to gravity is`; }
    const val = right[0] / right[1];
    const w2 = wrong.filter((x) => Math.abs(x[0] / x[1] - val) > 1e-9 && x[0] / x[1] < 1).filter((x, i, a) => a.findIndex((y) => Math.abs(y[0] / y[1] - x[0] / x[1]) < 1e-9) === i);
    while (w2.length < 3) w2.push([1, 7 + w2.length]);
    const o = shuffleOpts(rng, fr(...right), w2.slice(0, 3).map((x) => fr(...x)));
    return { val, opts: o.options, q, options: o.options, answer: o.answer,
      sol: kind === 'height' ? `$g' = g\\dfrac{R^2}{(R+h)^2} = \\dfrac{g}{${(1 + f) ** 2}}$.` : `$g' = g\\left(1-\\dfrac dR\\right) = g\\left(1-\\dfrac1{${f + 1}}\\right) = ${fr(...right)}$.`, trap: 'Height uses the square law; depth is linear.' };
  }, (p) => { const ev = (t) => { const m2 = t.match(/^(\d+)?g\/(\d+)$/); return (m2[1] ? +m2[1] : 1) / +m2[2]; }; return p.opts.findIndex((x) => Math.abs(ev(x) - p.val) < 1e-9); }),
);

}

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'gravitation', groups, items, gens }, ['gr-g22', 'gr-g25'], [], ['gr-g25']);
