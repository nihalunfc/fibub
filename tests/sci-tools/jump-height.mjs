// #489 jump height from flight time (Bosco et al. 1983: h = g t²/8) and RSI. Reference numbers from hand
// Python with numpy (/tmp/claude-0/a9/jump.py).
import * as J from '../../src/lib/sci/jump.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('jump: 0.5 s flight -> 30.656 cm, 2.4525 m/s', near(J.heightFromFlight(0.5), 0.3065625) && near(J.takeoffVelocity(0.5), 2.4525));
  check('jump: 0.6 s flight -> 44.145 cm', near(J.heightFromFlight(0.6), 0.44145));
  check('jump: other g', near(J.heightFromFlight(0.5, 9.80665), 9.80665 / 32));
  check('jump: frames 100 -> 115 at 30 fps = 0.5 s', near(J.flightFromFrames(100, 115, 30), 0.5));
  { const [lo, hi] = J.frameRange(0.5, 30); check('jump: ± 1 frame range at 30 fps', near(lo, 0.26705) && near(hi, 0.3488)); }
  const js = J.parseJumps('flight_ms, contact_ms, label\n500, , CMJ 1\n520,,CMJ 2\n480\n440, 210, Drop jump 1\n430, 190, Drop jump 2\n', 'ms', 9.81, 240);
  check('jump: parse 5 jumps with header', js.length === 5 && js[0].label === 'CMJ 1' && js[2].label === 'Jump 3' && js[0].contact === null);
  check('jump: RSI and flight:contact ratio', near(js[3].rsi, 1.1304857142857143) && near(js[3].ratio, 2.0952380952380953) && near(js[4].rsi, 1.1933348684210525) && js[0].rsi === null);
  const s = J.meanSd(js.map((j) => j.h));
  check('jump: mean and SD (numpy ddof=1)', near(s.mean, 0.276960825) && near(s.sd, 0.04465971523780549, 1e-12));
  check('jump: seconds unit', near(J.parseJumps('0.5', 's')[0].h, 0.3065625));
  const err = (t, u) => { try { J.parseJumps(t, u); return ''; } catch (e) { return e.message; } };
  check('jump: bad inputs', err('abc\nx', 'ms').includes('Line 2') && err('500', 's').includes('unit') && err('', 'ms').includes('at least one') && err('500, -3', 'ms').includes('contact'));
};
