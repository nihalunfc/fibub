// #1265 Echo and SONAR depth finder. Checked against Python: 331.3 m/s at 0 °C, 343.2146 at 20 °C, 344.3834 at 22 °C;
// echo time for 100 m at 22 °C 0.58075 s; minimum echo distance at 22 °C 17.2192 m; 4 s at 1500 m/s → 3000 m.
import { airSpeed, echoTime, distance, minEcho, SEA } from '../../src/lib/sci/echo-sonar.ts';

export default async (check) => {
  const near = (x, y, t = 1e-6) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('speed of sound 0, 20, 22 °C', airSpeed(0) === 331.3 && near(airSpeed(20), 343.21462268256795) && near(airSpeed(22), 344.38341415557636));
  check('echo time 100 m at 22 °C', near(echoTime(100, airSpeed(22)), 0.5807480609668656));
  check('minimum echo distance at 22 °C', near(minEcho(airSpeed(22)), 17.21917070777882));
  check('SONAR 4 s → 3000 m', distance(4, SEA) === 3000 && echoTime(3000, SEA) === 4);
  check('distance and time are inverses', [1, 7.5, 333].every((d) => near(distance(echoTime(d, 340), 340), d, 1e-12)));
};
