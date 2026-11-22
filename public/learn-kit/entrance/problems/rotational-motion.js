// Live problems for Rotational motion.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;
const SHAPES = [['solid sphere', 2 / 5, '2/5'], ['solid cylinder', 1 / 2, '1/2'], ['hollow sphere', 2 / 3, '2/3'], ['ring', 1, '1']];

export default {
  'rot-parallel-axis': {
    title: 'moment of inertia about a parallel axis',
    make(r) {
      const M = pick(r, 1, 6, 0.5), R = pick(r, 10, 50, 5), which = Math.floor(r() * 2);
      const Rm = R / 100, Icm = which ? 0.5 * M * Rm * Rm : M * Rm * Rm, answer = Icm + M * Rm * Rm;
      const nm = which ? 'uniform disc' : 'thin ring';
      return { M, R, which,
        q: `<p>A ${nm} of mass ${M} kg and radius ${R} cm turns about an axis perpendicular to its plane through a point on its rim. What is its moment of inertia about that axis?</p>`,
        answer, unit: 'kg m²', tol: 0.01,
        hint: `Parallel axis theorem: I = I<sub>cm</sub> + Md², with d = R. For a ${nm} about its centre, I<sub>cm</sub> = ${which ? '½MR²' : 'MR²'}.`,
        solution: steps(`I<sub>cm</sub> = ${which ? '½' : ''}MR² = ${which ? '0.5 × ' : ''}${M} × ${Rm}² = ${n(Icm)} kg m².`, `Md² = ${M} × ${Rm}² = ${n(M * Rm * Rm)} kg m².`, `I = <b>${n(answer)} kg m²</b> (${which ? '3/2' : '2'} MR²).`) };
    },
    verify: (x) => (x.which ? 1.5 : 2) * x.M * (x.R / 100) ** 2,
  },
  'rot-rolling-speed': {
    title: 'speed at the bottom of a slope when rolling',
    make(r) {
      const i = Math.floor(r() * 4), [name, k2, k2s] = SHAPES[i], h = pick(r, 0.5, 5, 0.5);
      const answer = Math.sqrt((2 * G * h) / (1 + k2));
      return { i, h,
        q: `<p>A ${name} rolls without slipping from rest down a slope, dropping through a height of ${h} m. What is its speed at the bottom? (g = 9.8 m/s²)</p>`,
        answer, unit: 'm/s', tol: 0.01,
        hint: `Energy: mgh = ½mv² + ½Iω² with v = Rω. For a ${name}, I = ${k2s} MR², so mgh = ½mv²(1 + ${k2s}).`,
        solution: steps(`Rolling: ½Iω² = ½(${k2s})mv², so the total kinetic energy is ½mv²(1 + k²/R²) = ½mv² × ${n(1 + k2)}.`, `mgh = ½mv² × ${n(1 + k2)} gives v² = 2gh/${n(1 + k2)} = ${n((2 * G * h) / (1 + k2))}.`, `v = <b>${n(answer)} m/s</b> (sliding without friction would give ${n(Math.sqrt(2 * G * h))} m/s).`) };
    },
    verify: (x) => { // kinematics: a = g sin θ /(1 + k²), slope length h/sin θ, any θ
      const k2 = SHAPES[x.i][1], th = 0.5, a = (G * Math.sin(th)) / (1 + k2), s = x.h / Math.sin(th); return Math.sqrt(2 * a * s);
    },
  },
  'rot-ang-mom': {
    title: 'angular speed after a change in moment of inertia',
    make(r) {
      const I = pick(r, 2, 10, 0.5), w0 = pick(r, 1, 6, 0.5), m = pick(r, 0.5, 3, 0.5), R = pick(r, 0.5, 2, 0.25);
      const answer = (I * w0) / (I + m * R * R);
      return { I, w0, m, R,
        q: `<p>A turntable with moment of inertia ${I} kg m² spins freely at ${w0} rad/s. A ${m} kg lump of clay is dropped gently onto it and sticks at ${R} m from the axis. What is the new angular speed?</p>`,
        answer, unit: 'rad/s', tol: 0.01,
        hint: 'No outside torque about the axis, so angular momentum Iω is the same before and after. The clay adds mR² to the moment of inertia.',
        solution: steps(`Before: L = ${I} × ${w0} = ${n(I * w0)} kg m²/s.`, `After: I' = ${I} + ${m} × ${R}² = ${n(I + m * R * R)} kg m².`, `ω' = L/I' = <b>${n(answer)} rad/s</b>. (Kinetic energy is lost: the clay slides before it sticks.)`) };
    },
    verify: (x) => x.w0 / (1 + (x.m * x.R * x.R) / x.I),
  },
};
