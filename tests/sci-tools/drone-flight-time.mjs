// #671 drone flight time. Checked against an independent SciPy script: Glauert's induced velocity by brentq, the
// speeds for the longest flight and range by minimize_scalar; hover against the momentum-theory closed form.
import { powerAt, hover, bestSpeeds, batteryWh, glauert, timeFromCurrent } from '../../src/lib/sci/eng-drone.ts';
import { hoverPower } from '../../src/lib/sci/eng-prop.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a / b - 1) < t;
  const d = { mass: 1.2, rotors: 4, propD: 0.2286, FM: 0.6, eff: 0.75, avionics: 5, wh: 74, usable: 0.8, rho: 1.225, CdA: 0.03, maxThrust: 9.80665, volts: 14.8 };
  const h = hover(d);
  check('drone: hover induced velocity, power, time (SciPy)', rel(h.vi, 5.408997194979322) && rel(h.Pel, 146.45104624571727) && rel(h.t, 1455.2303002494416));
  check('drone: hover shaft power = momentum closed form', rel(h.Pshaft, hoverPower(1.2 * 9.80665, 1.225, 4 * Math.PI * 0.2286 ** 2 / 4, 0.6), 1e-12) && rel((h.Pel - 5) * 0.75, h.Pshaft, 1e-12));
  check('drone: hover current, thrust-to-weight', rel(h.amps, 146.45104624571727 / 14.8) && rel(h.tw, 10 / 3));
  const c = powerAt(d, 10);
  check('drone: cruise 10 m/s induced velocity, power, time, range (SciPy)', rel(c.vi, 2.7489281208362906) && rel(c.Pel, 102.25846721874329) && rel(c.t, 2084.130593744481) && rel(c.range, 20841.30593744481));
  const b = bestSpeeds(d);
  check('drone: best endurance speed 9.3495 m/s, 2094.81 s (SciPy)', Math.abs(b.endurance.V - 9.3494994) < 1e-5 && rel(b.endurance.t, 2094.807186044503, 1e-9));
  check('drone: best range speed 12.9512 m/s, 23.3932 km (SciPy)', Math.abs(b.range.V - 12.951176) < 1e-5 && rel(b.range.range, 23393.198021825487, 1e-9));
  check('drone: Glauert reduces to hover at V = 0 and to vh²/V at high speed', rel(glauert(10, 1.225, 0.1, 0, 0), Math.sqrt(10 / 0.245), 1e-12) && rel(glauert(10, 1.225, 0.1, 200, 0), (10 / 0.245) / 200, 1e-3));
  check('drone: battery energy and time from current', rel(batteryWh(4, 5000), 74, 1e-12) && rel(timeFromCurrent({ wh: 74, usable: 0.8 }, 10, 14.8), 1440, 1e-12));
};
