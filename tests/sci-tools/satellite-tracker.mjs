// #T66 Satellite tracker: the Sentinel-1-like reference orbit of Zakharov et al. (2025), Remote Sensing
// 17(22): 3761 - 693 km circular, 98.18 degrees, quoted as a 98.6 minute period with a 12-day repeat.
import { fromHeights, orbitInfo, ssoInclination, footprint, groundTrack } from '../../src/lib/sci/satorbit.ts';

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  const EPOCH = Date.UTC(2026, 0, 1);
  const info = orbitInfo(fromHeights('ref', 693, 693, 98.18, 0, 0, 0, EPOCH));
  check('satorbit: 693 km circular gives the paper’s 98.6 minute period (98.63) and 7.51 km/s', near(info.periodMin, 98.63, 0.01) && near(info.vPerigee, 7.508, 0.005));
  check('satorbit: half a period is the paper’s 49.3 minute phasing for a satellite 180 degrees away', near(info.periodMin / 2, 49.31, 0.01));
  check('satorbit: coherent offsets of 1, 2 and 3 revolutions are 98.63, 197.26 and 295.89 minutes', near(info.periodMin * 2, 197.26, 0.02) && near(info.periodMin * 3, 295.89, 0.03));
  check('satorbit: sun-synchronous inclination at 693 km is 98.16, against the paper’s 98.18', near(ssoInclination(693, 693), 98.16, 0.01));
  check('satorbit: 98.18 degrees turns the plane +0.988 a day, just above the 0.9856 the Sun needs', near(info.raanRate, 0.9881, 0.001) && info.raanRate > 360 / 365.2422);
  check('satorbit: 12 days hold 175.21 revolutions, so an exact 175-revolution repeat needs 98.74 minutes', near((12 * 1440) / info.periodMin, 175.21, 0.01) && near((12 * 1440) / 175, 98.74, 0.01));
  check('satorbit: the height for that period is 698.6 km', near(orbitInfo(fromHeights('r', 698.6, 698.6, 98.18, 0, 0, 0, EPOCH)).periodMin, 98.74, 0.01));
  check('satorbit: it sees 1928 km around the point below at 10 degrees elevation', near((footprint(693, 10) * Math.PI) / 180 * 6371, 1928, 1.5));
  const pts = groundTrack(fromHeights('ref', 693, 693, 98.18, 0, 0, 0, EPOCH), EPOCH, EPOCH + 864e5, 8640);
  const maxLat = Math.max(...pts.map((p) => p.lat));
  check('satorbit: a retrograde 98.18 degree orbit reaches 81.8 degrees north', near(maxLat, 81.82, 0.1) && pts.length === 8641);
};
