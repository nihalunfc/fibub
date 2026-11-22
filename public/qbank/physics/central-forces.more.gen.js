// Extra question shapes for central-forces (templates cfo-t21..t26). Imported by central-forces.js.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, bisect } from './_more.js';

const GM = 3.986e14, g = 9.8, R = 6.4e6;

export default [
  { id: 'cfo-t21', type: 'mcq', level: 4, exams: ['gate', 'net', 'jam'], sub: 'stability',
    make(r) {
      const askStable = r() < 0.6;
      const good = [-2, -1, 0, 1, 2], bad = [-3, -4, -5, -6];
      const right = askStable ? choose(r, good) : choose(r, bad.slice(1));
      const wrongs = shuffle(r, askStable ? bad : good).slice(0, 3);
      const o = mcqOptions(r, right, wrongs, (n) => `$n = ${n}$`);
      return { q: `A particle moves under an attractive central force $F = -kr^n$ ($k > 0$). For which value of $n$ are circular orbits ${askStable ? 'stable' : '<b>unstable</b>'}?`, ...o,
        sol: `Use $U_\\text{eff} = \\dfrac{L^2}{2mr^2} + U(r)$ with $U' = kr^n$. A circular orbit sits where $U_\\text{eff}' = 0$, that is $L^2/(mr^3) = kr^n$. It is stable when $U_\\text{eff}'' > 0$ there: $\\dfrac{3L^2}{mr^4} + nkr^{n-1} > 0$, which with the circular-orbit condition becomes $(3 + n)kr^{n-1} > 0$, so $n > -3$. Here $n = ${right}$ is ${right > -3 ? 'stable' : 'unstable'}. ($n = -3$ is the borderline: neutral, and small pushes make the particle spiral.)`,
        trap: 'The inverse-cube force ($n = -3$) is the borderline case, not a stable one.' };
    } },
  { id: 'cfo-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'kepler laws',
    make(r) {
      const a = choose(r, [1.5, 2, 4, 5.2, 9, 16]), e = choose(r, [0.1, 0.2, 0.25, 0.5]), T = a ** 1.5, ratio = (1 + e) / (1 - e), not = r() < 0.35;
      const res = msqOf(r, [
        [`Its period is $${round(T, 2)}$ years`, true, `Kepler's third law in solar units: $T^2 = a^3$, so $T = ${a}^{1.5} = ${round(T, 2)}$ years.`],
        [`Its period is $${round(a * a, 2)}$ years`, false, `$T^2 = a^3$, not $T = a^2$: $T = ${round(T, 2)}$ years.`],
        ['Its angular momentum about the star stays constant', true, 'Gravity points at the star, so it exerts no torque about it.'],
        ['Its speed stays constant along the orbit', false, `Only for a circle; with $e = ${e}$ it speeds up near the star.`],
        [`Its speed at closest approach is $${round(ratio, 3)}$ times its speed at the farthest point`, true, `$r_pv_p = r_av_a$ with $r_p = a(1 - e)$, $r_a = a(1 + e)$: $v_p/v_a = (1 + e)/(1 - e) = ${round(ratio, 3)}$.`],
        ['The star sits at the centre of the ellipse', false, 'It sits at one focus.'],
        ['Its total energy is $-GMm/(2a)$, the same as for a circular orbit of radius $a$', true, 'The energy depends only on the semi-major axis.'],
      ], { not });
      return { q: `A planet orbits a star of one solar mass on an ellipse with semi-major axis ${a} AU and eccentricity ${e}. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Angular momentum is constant; speed is not. The star is at a focus.' };
    } },
  { id: 'cfo-t23', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'orbits', unit: 'km',
    make(r) {
      const rk = pick(r, 6800, 8000, 100), vc = Math.sqrt(GM / (rk * 1e3)), v = round((vc * pick(r, 1.02, 1.3, 0.02)) / 1e3, 3);
      const vv = v * 1e3, rr = rk * 1e3, aa = 1 / (2 / rr - (vv * vv) / GM), ra = (2 * aa - rr) / 1e3;
      return { q: `A satellite is moving at ${v} km/s, perpendicular to the line to the Earth's centre, at ${rk} km from the centre. Taking $GM = 3.986\\times10^{14}$ m³/s², its greatest distance from the Earth's centre in the orbit that follows is ______ km (round to the nearest 10 km).`,
        answer: round(ra, 0), tol: Math.max(10, round(ra * 0.003, 0)), unit: 'km', v, rk,
        sol: `Vis-viva: $v^2 = GM\\left(\\dfrac2r - \\dfrac1a\\right)$, so $\\dfrac1a = \\dfrac2r - \\dfrac{v^2}{GM} = \\dfrac{2}{${rr}} - \\dfrac{(${vv})^2}{3.986\\times10^{14}}$, giving $a = ${round(aa / 1e3, 0)}$ km. The velocity is perpendicular to the radius, so this point is the perigee and the apogee is $2a - r = ${round(ra, 0)}$ km.`,
        trap: 'A sideways launch faster than circular speed puts the satellite at perigee; the far point is $2a - r$.' };
    },
    verify: (p) => { const rr = p.rk * 1e3, vv = p.v * 1e3, h = rr * vv, E = (vv * vv) / 2 - GM / rr; const ra = (-GM - Math.sqrt(GM * GM + 2 * E * h * h)) / (2 * E); return ra / 1e3; } },
  { id: 'cfo-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'escape speed', unit: 'km/s',
    make(r) {
      const h = choose(r, [200, 400, 600, 1000, 2000, 6400, 20000, 35800]), rr = R + h * 1e3, vc = Math.sqrt((g * R * R) / rr), dv = (Math.SQRT2 - 1) * vc / 1e3;
      return { q: `A spacecraft is in a circular orbit ${h} km above the Earth ($R = 6400$ km, $g = 9.8$ m/s² at the surface). The least extra speed it needs, applied along its motion, to escape the Earth completely is ______ km/s (three decimal places).`,
        answer: round(dv, 3), tol: Math.max(0.002, round(dv * 0.002, 3)), unit: 'km/s', h,
        sol: `$GM = gR^2$. At $r = ${round(rr / 1e3, 0)}$ km the circular speed is $v_c = \\sqrt{gR^2/r} = ${round(vc / 1e3, 3)}$ km/s and the escape speed is $\\sqrt2\\,v_c$. Fired along the motion, the boost needed is $(\\sqrt2 - 1)v_c = ${round(dv, 3)}$ km/s.`,
        trap: 'Using the escape speed from the surface (11.2 km/s) instead of from the orbit, or forgetting the orbital speed it already has.' };
    },
    verify: (p) => { const rr = R + p.h * 1e3; return (Math.sqrt((2 * g * R * R) / rr) - Math.sqrt((g * R * R) / rr)) / 1e3; } },
  { id: 'cfo-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'effective potential', format: 'graph in words',
    make(r) {
      const U0 = int(r, 2, 9) * 10;
      const L = { circ: 'a circle', ell: 'an ellipse (bound, not circular)', para: 'a parabola (it just escapes)', hyp: 'a hyperbola', none: 'impossible: the energy is below the lowest point of $U_\\text{eff}$' };
      const [E, k, why] = choose(r, [
        [-U0, 'circ', 'The energy equals the minimum of $U_\\text{eff}$, so $r$ cannot change: the radius is fixed at the minimum.'],
        [-U0 / 2, 'ell', 'The energy lies between the minimum and zero, so $r$ swings between two turning points: a bound ellipse.'],
        [-U0 / 4, 'ell', 'The energy lies between the minimum and zero, so $r$ swings between two turning points: a bound ellipse.'],
        [0, 'para', 'Zero energy is exactly the escape condition for an inverse-square force: a parabola.'],
        [U0 / 2, 'hyp', 'Positive energy: there is only an inner turning point and the body escapes with speed to spare, a hyperbola.'],
        [-2 * U0, 'none', 'Kinetic energy of radial motion would have to be negative, so no motion is possible at this energy.'],
      ]);
      const o = mcqOptions(r, L[k], shuffle(r, Object.keys(L).filter((x) => x !== k)).map((x) => L[x]));
      return { q: `A body moves under an inverse-square attraction. Its effective potential $U_\\text{eff}(r)$ falls from very large values at small $r$ to a minimum of $${-U0}$ J and then rises towards $0$ at large $r$. If its total energy is $${E + 0}$ J, its orbit is`, ...o,
        sol: `${why} (Radial motion is allowed where $E \\ge U_\\text{eff}(r)$.)`,
        trap: 'Zero total energy is not "at rest": it is the boundary between bound and unbound orbits.' };
    } },
  { id: 'cfo-t26', type: 'msq', level: 3, exams: ['jam'], sub: 'shells and spheres',
    make(r) {
      const not = r() < 0.5;
      const res = msqOf(r, [
        ['The gravitational field inside a thin uniform spherical shell is zero', true, 'By Gauss\'s law for gravity, no mass is enclosed by a sphere inside the shell, and symmetry makes the field radial.'],
        ['The gravitational potential inside a thin uniform spherical shell is zero', false, 'It is constant, equal to its surface value $-GM/R$, not zero.'],
        ['Inside a uniform solid sphere the field grows in proportion to the distance from the centre', true, 'Only the mass inside radius $r$ counts: $g = GMr/R^3$.'],
        ['Outside any spherically symmetric body the field is as if all its mass were at the centre', true, 'Shell theorem: $g = GM/r^2$ outside.'],
        ['The potential at the centre of a uniform solid sphere is $-GM/R$', false, 'It is $-\\tfrac32GM/R$: lower than at the surface, since you must still climb out to the surface.'],
        ['The field just outside a thin shell is larger than just inside it', true, 'It jumps from $0$ to $GM/R^2$ across the shell.'],
        ['The potential is continuous across the surface of a thin shell', true, 'Only the field (its slope) jumps; the potential itself is continuous.'],
        ['A uniform solid sphere has its greatest field strength at its centre', false, 'The field is zero at the centre and greatest at the surface.'],
      ], { not });
      return { q: `About gravity of uniform shells and spheres (mass $M$, radius $R$), which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Zero field does not mean zero potential: inside a shell the potential is constant but negative.' };
    } },
];
