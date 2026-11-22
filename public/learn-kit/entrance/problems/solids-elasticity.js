// Live problems for Elasticity of solids.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;

export default {
  'se-wire-extension': {
    title: 'extension of a loaded steel wire',
    make(r) {
      const m = pick(r, 5, 40, 5), L = pick(r, 1, 4, 0.5), dmm = pick(r, 0.5, 2, 0.25), Y = 2e11;
      const A = Math.PI * (dmm / 2000) ** 2, answer = ((m * G * L) / (A * Y)) * 1000;
      return { m, L, dmm, Y,
        q: `<p>A steel wire ${L} m long and ${dmm} mm in diameter hangs from a ceiling with a ${m} kg mass at its lower end. Young's modulus of steel is 2 × 10¹¹ Pa. By how many millimetres does the wire stretch? (g = 9.8 m/s²; ignore the wire's own weight)</p>`,
        answer, unit: 'mm', tol: 0.01,
        hint: 'ΔL = FL/(AY). Use the radius, not the diameter, in A = πr², and convert mm to m first.',
        solution: steps(`F = mg = ${m} × 9.8 = ${n(m * G)} N.`, `r = ${dmm / 2} mm = ${n(dmm / 2000)} m, A = πr² = ${n(A)} m².`, `ΔL = FL/(AY) = ${n(m * G)} × ${L} / (${n(A)} × 2 × 10¹¹) = ${n(answer / 1000)} m = <b>${n(answer)} mm</b>.`) };
    },
    verify: (x) => { // via stress and strain
      const stress = (x.m * G) / (Math.PI * (x.dmm / 2000) ** 2), strain = stress / x.Y; return strain * x.L * 1000;
    },
  },
  'se-thermal-stress': {
    title: 'force from a heated rod held between walls',
    make(r) {
      const Acm = pick(r, 1, 5, 0.5), dT = pick(r, 20, 100, 10), mat = r() < 0.5 ? ['steel', 2e11, 1.2e-5, '1.2 × 10⁻⁵', '2 × 10¹¹'] : ['copper', 1.1e11, 1.7e-5, '1.7 × 10⁻⁵', '1.1 × 10¹¹'];
      const [name, Y, a, as, Ys] = mat, answer = (Y * a * dT * Acm * 1e-4) / 1000;
      return { Acm, dT, Y, a,
        q: `<p>A ${name} rod of cross-section ${Acm} cm² is fixed between two rigid walls at room temperature and then heated by ${dT} °C. Young's modulus is ${Ys} Pa and the coefficient of linear expansion is ${as} per °C. What force, in kN, does the rod push on each wall?</p>`,
        answer, unit: 'kN', tol: 0.01,
        hint: 'The walls squeeze back the expansion the rod would have had: strain = αΔT. Stress = Y × strain; force = stress × area. The length cancels.',
        solution: steps(`Strain the walls stop: αΔT = ${as} × ${dT} = ${n(a * dT)}.`, `Stress = Y αΔT = ${n(Y * a * dT)} Pa.`, `F = stress × A = ${n(Y * a * dT)} × ${Acm} × 10⁻⁴ = ${n(answer * 1000)} N = <b>${n(answer)} kN</b>.`) };
    },
    verify: (x) => { // free expansion of a 1 m rod, then the force to squeeze it back: F = Y A ΔL / L
      const L = 1, dL = x.a * x.dT * L; return (x.Y * x.Acm * 1e-4 * dL) / L / 1000;
    },
  },
  'se-elastic-energy': {
    title: 'energy stored in a stretched wire',
    make(r) {
      const F = pick(r, 100, 1000, 50), dL = pick(r, 0.5, 4, 0.5);
      const answer = 0.5 * F * dL / 1000;
      return { F, dL,
        q: `<p>A wire within its elastic limit stretches by ${dL} mm when the load on it is slowly increased from zero to ${F} N. How much elastic energy is stored in the wire, in joules?</p>`,
        answer, unit: 'J', tol: 0.01,
        hint: 'The force grows from 0 to F as the wire stretches, so the work is the area of the triangle under the force-extension line: ½FΔL.',
        solution: steps(`Average force while stretching = F/2 = ${F / 2} N.`, `U = ½ F ΔL = ½ × ${F} × ${dL} × 10⁻³ m = <b>${n(answer)} J</b>.`, 'If the full load were hung on suddenly, the wire would first stretch twice as far, and F ΔL would be the loss in gravitational energy: half stored, half lost as heat after oscillation.') };
    },
    verify: (x) => { const k = x.F / (x.dL / 1000); return 0.5 * k * (x.dL / 1000) ** 2; },
  },
};
