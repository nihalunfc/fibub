// #943 Doppler and beats: checked against NumPy/SymPy, and the pass-by curve against an independent numerical
// solution (SciPy brentq for the emission time, then f = f0 · dte/dt by finite differences).
import { soundDoppler, echoDoppler, echoSpeed, sourceSpeed, lightDoppler, lightSpeed, redshiftOf, passBy, heardAt, mach, beats, airSpeed, C_LIGHT } from '../../src/lib/sci/phdoppler.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-12) => Math.abs(a - b) <= rel * Math.abs(b);
  const c = airSpeed(20);
  check('speed of sound 343.21 m/s at 20 °C', near(c, 343.21462268256795));
  check('siren 700 Hz approaching at 25 m/s: 754.99 Hz (NumPy)', near(soundDoppler(700, c, 25, 0), 754.9943300922943));
  check('siren receding: 652.47 Hz (NumPy)', near(soundDoppler(700, c, -25, 0), 652.4733703607244));
  check('wind 10 m/s and listener 3 m/s towards: 759.72 Hz (NumPy)', near(soundDoppler(700, c, 25, 3, 10), 759.7170224769543));
  check('listener moving, source still: f (c + vo)/c', near(soundDoppler(500, 340, 0, 34), 550));
  check('source at the speed of sound: no answer', Number.isNaN(soundDoppler(700, c, c, 0)));
  check('source speed back from the heard frequency', near(sourceSpeed(700, 754.9943300922943, c), 25, 1e-12) && near(sourceSpeed(700, 652.4733703607244, c), -25, 1e-12));
  check('bat echo 40 kHz from a moth closing at 2 m/s: 40468.9 Hz (NumPy)', near(echoDoppler(40000, c, 2), 40468.913080987295));
  check('echo speed round-trips', near(echoSpeed(40000, 40468.913080987295, c), 2, 1e-12));
  check('radar 10.5 GHz, car at 30 m/s: +2101 Hz (NumPy)', Math.abs(echoDoppler(10.5e9, C_LIGHT, 30) - 10500002101.45401) < 1e-3);
  check('light at 0.3 c approaching: ratio √(1.3/0.7) = 1.36277 (SymPy)', near(lightDoppler(1, 0.3 * C_LIGHT), 1.3627702877384937));
  check('light speed round-trips', near(lightSpeed(1.3627702877384937), 0.3 * C_LIGHT, 1e-12) && near(lightSpeed(1 / 1.3627702877384937), -0.3 * C_LIGHT, 1e-12));
  check('redshift z = f/f′ − 1', near(redshiftOf(1, 1 / 1.3627702877384937), 0.3627702877384937));
  for (const [t, fRef] of [[-2.0, 751.1475512034237], [-0.5, 728.5621236696737], [0.0, 700.0000000001338], [0.3, 682.7359502026287], [1.5, 658.1066553157377]])
    check(`pass-by at t = ${t} s: ${fRef.toFixed(2)} Hz (SciPy emission-time solve)`, Math.abs(heardAt(700, c, 25, 20, t) - fRef) < 1e-5);
  { const pb = passBy(700, c, 25, 20, 4); check('pass-by samples lie on the exact curve', pb.every((p) => Math.abs(heardAt(700, c, 25, 20, p.t) - p.f) < 1e-8)); }
  check('Mach 2: cone half-angle 30°', near(mach(2 * c, c).angle, 30, 1e-12) && Number.isNaN(mach(100, c).angle));
  check('beats: 440 and 443 Hz beat 3 times a second', beats(440, 443).fb === 3 && near(beats(440, 443).period, 1 / 3) && beats(440, 443).mean === 441.5);
};
