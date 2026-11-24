// #T67 Interferometer uv-coverage: one 800 m baseline (the Irbene RT-32/RT-16 pair of Shmeld et al. 2025,
// Galaxies 13(6): 126) at latitude 57.55 on the 6.7 GHz methanol maser in NGC 7538 (dec +61.47).
import { uvTracks, elevation, scales, baselines, dirtyBeam, beamWidth } from '../../src/lib/sci/uvcover.ts';

export default async (check) => {
  const near = (got, want, tol) => Number.isFinite(got) && Math.abs(got - want) <= tol;
  const ANTS = [{ e: 0, n: 0 }, { e: 800, n: 0 }], LAT = 57.55, DEC = 61.47;
  const sc = scales(6.7e9, 800, 800, 32);
  check('uvcover: 6.7 GHz is 4.475 cm, and 800 m is 17.88 kilowavelengths', near(sc.lam * 100, 4.475, 0.001) && near(800 / sc.lam / 1000, 17.88, 0.01));
  check('uvcover: an 800 m baseline at 6.7 GHz gives 11.54 arcsec, and 14.07 with the 1.22 convention', near(sc.resolution, 11.537, 0.01) && near(1.22 * sc.resolution, 14.07, 0.01));
  check('uvcover: one baseline has no imaging window: the largest scale 6.92 arcsec is below the resolution', near(sc.largest, 6.922, 0.01) && sc.largest < sc.resolution);
  check('uvcover: the RT-32 primary beam is 5.43 arcmin and the RT-16 one 10.86', near(sc.primaryBeam / 60, 5.432, 0.005) && near(scales(6.7e9, 800, 800, 16).primaryBeam / 60, 10.864, 0.005));
  check('uvcover: the maser is circumpolar from Irbene, 29.0 to 86.1 degrees up', near(elevation(LAT, DEC, 12), 29.0, 0.05) && near(elevation(LAT, DEC, 0), 86.08, 0.05));
  const tr = uvTracks(ANTS, LAT, DEC, 6.7e9, -12, 12, 289, 15);
  check('uvcover: a day of 5-minute samples on one baseline is 289 uv points, none lost to the horizon', tr.u.length === 289 && baselines(ANTS).length === 1);
  check('uvcover: the track reaches 17.88 kilowavelengths in u and 15.71 in v', near(Math.max(...tr.u.map(Math.abs)) / 1000, 17.88, 0.01) && near(Math.max(...tr.v.map(Math.abs)) / 1000, 15.71, 0.02));
  const bw = beamWidth(dirtyBeam(tr.u, tr.v, 256));
  check('uvcover: the fringe pattern that coverage makes measures about 5.45 by 6.39 arcsec', near(bw.ew, 5.45, 0.1) && near(bw.ns, 6.39, 0.1));
};
