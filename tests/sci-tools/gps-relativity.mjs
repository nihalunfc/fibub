// #970 GPS relativity explainer. References: the exact rate ratio √(1 − 2GM/rc² − v²/c²) for satellite and ground
// clocks evaluated with mpmath at 30 digits, and closed forms.
import * as G from '../../src/lib/sci/phgps.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const ref = [[26560e3, 4.46855988228210205e-10], [29600e3, 4.72580161794033275e-10], [42164e3, 5.39550430477419450e-10], [6780e3, -2.83872690276833596e-10]];
  check('gps: first-order net rate matches the exact (mpmath) ratio for GPS, Galileo, GEO and LEO radii', ref.every(([a, v]) => near(G.shift(a).net, v, 1e-6)));
  const s = G.shift(26560e3);
  check('gps: GPS orbit +45.7 µs/day gravity, −7.11 µs/day motion, +38.6 µs/day net', near(s.usPerDay.grav, 45.71821278, 1e-8) && near(s.usPerDay.vel, -7.10985545, 1e-8) && near(s.usPerDay.net, 38.6083573829, 1e-8));
  check('gps: factory frequency 10.229 999 995 4 MHz', near(s.fFactory, 10229999.995428665, 1e-15) && s.fFactory < 10.23e6);
  check('gps: uncorrected ranging error about 11.6 km per day', near(s.kmPerDay, 11.574494, 1e-6));
  check('gps: receiver at 45° and 1000 m (mpmath 38.54706 µs/day)', near(G.shift(26560e3, 45, 1000).usPerDay.net, 38.547062462774908, 1e-6));
  check('gps: eccentricity term amplitude 22.9 ns for e = 0.01', near(G.eccAmp(26560e3, 0.01), 2.28966271974154339e-8, 1e-12));
  check('gps: effects cancel near 1.5 Earth radii', near(G.balanceRadius() / G.RE, 1.4974, 1e-3) && Math.abs(G.shift(G.balanceRadius()).net) < 1e-18);
  check('gps: orbital period of the GPS orbit about 11 h 58 min', near(G.satellite(26560e3).period / 3600, 11.967, 1e-3));
  check('gps: velocity term is half the gravity term in orbit (circular)', near(G.satellite(1e7).vel, G.satellite(1e7).grav / 2, 1e-15));
  check('gps: ground speed at the equator about 465 m/s, zero at the pole', near(G.ground(0, 0).v, 464.58, 1e-4) && G.ground(90, 0).v < 1e-10);
  // New with the blog article jason-2-laser-time-transfer-gravitational-redshift-clock-rate (EPJ C 86, 682, 2026):
  // Jason-2's orbit against a receiver at Grasse, France, and the eccentricity term for its almost circular orbit.
  const j = G.shift(7716.5e3, 43.75, 1320);
  check('gps: Jason-2 orbit +10.475 and −24.775 µs/day, net −14.300 µs/day (its clock loses time)', near(j.usPerDay.grav, 10.47492, 1e-5) && near(j.usPerDay.vel, -24.77487, 1e-5) && near(j.usPerDay.net, -14.29995, 1e-5) && j.net < 0);
  check('gps: Jason-2 period 112.43 min, speed 7.187 km/s, eccentricity term 1.234 ns at e = 0.001', near(G.satellite(7716.5e3).period / 60, 112.43209, 1e-6) && near(G.satellite(7716.5e3).v, 7187.183, 1e-6) && near(G.eccAmp(7716.5e3, 0.001), 1.234149e-9, 1e-6));
  check('gps: Jason-2 sits below the break-even radius for Grasse (about 9550 km)', G.balanceRadius(43.75, 1320) > 7716.5e3 && near(G.balanceRadius(43.75, 1320) / 1000, 9549.9, 1e-4));
};
