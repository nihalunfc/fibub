// #1061 sound-wave-visualiser: checked against Python (math) with v = √(γRT/M).
import { airSpeed, airDensity, wavelength, period, displacement, pressureShape, pressureAmp, intensity, decibels, echoTime, echoDistance, minEchoDistance } from '../../src/lib/sci/learnsound.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('sound: v(0 °C) = 331.32 m/s', near(airSpeed(0), 331.31965117863075));
  check('sound: v(20 °C) = 343.23 m/s', near(airSpeed(20), 343.2349805813274));
  check('sound: v(−10 °C) = 325.20 m/s', near(airSpeed(-10), 325.19831017144327));
  check('sound: air density 20 °C = 1.2041 kg/m³', near(airDensity(20), 1.2040972472143983));
  check('sound: λ at 500 Hz = 0.68647 m', near(wavelength(airSpeed(20), 500), 0.6864699611626548));
  check('sound: period 500 Hz = 2 ms', near(period(500), 0.002));
  const dp = pressureAmp(airDensity(20), airSpeed(20), 500, 0.5e-6);
  check('sound: Δp0 = 0.6492 Pa', near(dp, 0.6491917361106293));
  check('sound: I = 5.0987e-4 W/m²', near(intensity(dp, airDensity(20), airSpeed(20)), 0.0005098739972340891));
  check('sound: 87.07 dB', near(decibels(0.0005098739972340891), 87.07462864201827));
  check('sound: 10⁻¹² W/m² is 0 dB', near(decibels(1e-12), 0));
  check('sound: echo 17 m at 340 m/s = 0.1 s', near(echoTime(340, 17), 0.1));
  check('sound: SONAR 4 s at 1500 m/s = 3000 m', near(echoDistance(1500, 4), 3000));
  check('sound: separate echo needs 17.2 m at 344 m/s', near(minEchoDistance(344), 17.2));
  // Compression where the pressure shape peaks: there ds/dx is most negative.
  const lam = 1, f = 1, x = 0.5, h = 1e-6;
  const dsdx = (displacement(x + h, 0, 1, lam, f) - displacement(x - h, 0, 1, lam, f)) / (2 * h);
  check('sound: pressure = −ds/dx shape', near(pressureShape(x, 0, lam, f), -dsdx / (2 * Math.PI), 1e-6));
};
