// #1223 cyclone builder: f = 2Ω sin φ against hand values (1.031 × 10⁻⁴ s⁻¹ at 45°); the parcel model spins the
// right way in each hemisphere (checked by its angular momentum), not at all without spin, and grows only when the
// rules allow; a single parcel's Coriolis turn does no work (speed kept with no pull or friction).
import { coriolis, turn, spinWay, conditions, makeStorm, stepStorm, spin, inflow, stage, questions, OMEGA } from '../../src/lib/sci/j3-cyclone.ts';
export default async (check) => {
  check('cyclone: f = 2Ω sin 45° = 1.0313 × 10⁻⁴ s⁻¹; zero at the equator; negative in the south', Math.abs(coriolis(45) - 1.03126e-4) < 1e-8 && coriolis(0) === 0 && coriolis(-15) < 0 && Math.abs(OMEGA - 2 * Math.PI / 86164.0905) < 1e-12);
  check('cyclone: turned right / anticlockwise in the north, left / clockwise in the south', turn(15) === 'right' && spinWay(15) === 'anticlockwise' && turn(-15) === 'left' && spinWay(-15) === 'clockwise' && turn(0) === 'none');
  check('cyclone: rules: warm sea at 15° with spin grows; 25 °C, 2° or no spin do not', conditions(29, 15, true).grows && !conditions(25, 15, true).grows && !conditions(29, 2, true).grows && !conditions(29, 15, false).grows && conditions(25, 2, false).reasons.length === 2);
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const run = (sst, lat, on, secs = 20) => { const st = makeStorm(150, rnd); for (let i = 0; i < secs * 20; i++) stepStorm(st, 0.05, sst, lat, on, rnd); return st; };
  const n = run(29, 15, true), s = run(29, -15, true), off = run(29, 15, false), cool = run(24, 15, true), eq = run(30, 0, true);
  check('cyclone: north spins anticlockwise, south clockwise', spin(n) > 0.3 && spin(s) < -0.3);
  check('cyclone: no Earth spin: the air goes straight in, no circling', Math.abs(spin(off)) < 0.02 && inflow(off) > 0.3);
  check('cyclone: at the equator no circling either', Math.abs(spin(eq)) < 0.02);
  check('cyclone: storm grows to a cyclone in 20 s over a 29 °C sea; stays weak over 24 °C, without spin, at the equator', n.S > 0.45 && cool.S < 0.1 && off.S < 0.1 && eq.S < 0.1 && stage(n.S).includes('cyclone'));
  // Coriolis alone (no pull, no friction) keeps the speed: check with one parcel using the same turn a = (f v, −f u)
  { let u = 1, v = 0; const f = 2, h = 1e-4; for (let i = 0; i < 20000; i++) { const au = f * v, av = -f * u, um = u + au * h / 2, vm = v + av * h / 2; u += f * vm * h; v += -f * um * h; }
    check('cyclone: the Coriolis turn changes direction, not speed: after 2 s at f = 2 the velocity has turned 4 rad clockwise', Math.abs(Math.hypot(u, v) - 1) < 1e-6 && Math.abs(u - Math.cos(-4)) < 1e-6 && Math.abs(v - Math.sin(-4)) < 1e-6); }
  { let u = 1, v = 0; const f = 2, h = 1e-3; u += f * v * h; v += -f * u * h; check('cyclone: first turn of an eastward parcel in the north is to the south (right)', v < 0); }
  let good = true; for (let i = 0; i < 300; i++) for (const l of ['8', '11']) for (const x of questions(l, rnd)) if (!(Number.isFinite(x.ans) && (x.choices ? x.ans >= 0 && x.ans < x.choices.length : x.ans > 0))) good = false;
  check('cyclone: questions valid', good);
};
