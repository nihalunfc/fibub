// #T54 Transit planner. Timing uncertainty σ = √(σT0² + (n·σP)²), pinned to the 3σ "by 2030" values that Thygesen et al.
// (2023, AJ, doi:10.3847/1538-3881/acaf03) give for K2 planets: K2-237 b 3.2 h (discovery ephemeris) and 5 min (K2 + TESS),
// K2-260 b 14 min and K2-182 b 10 min (discovery ephemerides). Taken at the first transit after 2030 January 1.
import { transitWindows } from '../../src/lib/astro/transits.ts';

export default async (check) => {
  const place = { name: 'Any', lat: -30.2, lon: -70.7, elev: 0, tz: 'UTC' }, t = Date.UTC(2030, 0, 1);
  const s3 = (p) => 3 * transitWindows(p, place, t, t + (p.period + 0.1) * 864e5, 0, 90, 0)[0].sigmaMin;
  const k237 = { ra: 253.7688479, dec: -28.7105836, durH: 2.93 };
  const a = s3({ ...k237, t0: 2457684.8101, period: 2.18056, t0Err: 0.0001, pErr: 0.00002 });
  const b = s3({ ...k237, t0: 2457706.61618, period: 2.18053332, t0Err: 0.00003, pErr: 0.00000054 });
  const c = s3({ ra: 78, dec: 16.9, durH: 2, t0: 2457820.738135, period: 2.6266657, t0Err: 0.00009, pErr: 0.0000018 });
  const d = s3({ ra: 130, dec: 15, durH: 2, t0: 2457719.11517, period: 4.7369683, t0Err: 0.00028, pErr: 0.0000023 });
  check('transit-planner: K2-237 b discovery ephemeris 3σ in 2030 is 3.2 h', Math.abs(a / 60 - 3.2) < 0.05);
  check('transit-planner: K2-237 b updated ephemeris 3σ in 2030 is 5 min', Math.abs(b - 5) < 0.5);
  check('transit-planner: K2-260 b discovery ephemeris 3σ in 2030 is 14 min', Math.abs(c - 14) < 0.5);
  check('transit-planner: K2-182 b discovery ephemeris 3σ in 2030 is 10 min', Math.abs(d - 10) < 0.5);
};
