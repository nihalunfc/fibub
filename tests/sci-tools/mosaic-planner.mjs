// #T49 Mosaic planner: the panel count, what a grid really covers, and the panel centres.
// New with the article on the M3D MUSE mosaic of M33 (Feltre et al. 2026, A&A 706: A367,
// doi:10.1051/0004-6361/202557122, CC BY 4.0): 24 pointings of 1 x 1 arcmin in strips of 3, 2" overlap,
// at a position angle of 22 degrees east of north, over a region the paper calls 3 x 8 arcmin^2.
import { fovArcmin, framesAlong, mosaic } from '../../src/lib/sci/mosaic.ts';

export default async (check) => {
  check(`mosaic: 1 mm of sensor at 3438 mm focal length is one arcminute, the way to type a field of view in (${fovArcmin(1, 3438).toFixed(5)}′)`,
    Math.abs(fovArcmin(1, 3438) - 1) < 1e-4);
  const ov = 2 / 60; // the paper's 2" overlap on a 1' field: 3.3333 % of the field
  check(`mosaic: the paper's 2″ overlap is 3.3333 % of a 1′ field (${(ov * 100).toFixed(4)} %)`, Math.abs(ov * 100 - 3.33333) < 1e-4);
  const covers = (n) => n - (n - 1) * ov;
  check(`mosaic: 3 panels cover 2.9333′ and 8 panels 7.7667′, not 3′ and 8′ (${covers(3).toFixed(4)}, ${covers(8).toFixed(4)})`,
    Math.abs(covers(3) - 2.93333) < 1e-4 && Math.abs(covers(8) - 7.76667) < 1e-4);
  check(`mosaic: covering exactly what 24 panels give needs 3 and 8 panels (${framesAlong(covers(3), 1, ov)}, ${framesAlong(covers(8), 1, ov)})`,
    framesAlong(covers(3), 1, ov) === 3 && framesAlong(covers(8), 1, ov) === 8);
  check(`mosaic: covering a full 3′ × 8′ at the same overlap needs 4 × 9 = 36 panels (${framesAlong(3, 1, ov)} × ${framesAlong(8, 1, ov)})`,
    framesAlong(3, 1, ov) === 4 && framesAlong(8, 1, ov) === 9);
  check(`mosaic: 22.78 arcmin² is covered where 24 arcmin² is quoted, 5.1 % less (${(covers(3) * covers(8)).toFixed(3)})`,
    Math.abs(covers(3) * covers(8) - 22.782) < 0.002 && Math.abs(100 * (1 - (covers(3) * covers(8)) / 24) - 5.1) < 0.05);
  // M33's centre from the OpenNGC catalogue built into the tools (CC BY-SA 4.0).
  const lay = mosaic({ ra: 23.46204, dec: 30.66022, tw: covers(8), th: covers(3), fw: 1, fh: 1, overlap: ov, pa: 22 });
  check(`mosaic: the paper's grid comes back as 8 × 3 = 24 panels covering 7.7667′ × 2.9333′ (${lay.cols} × ${lay.rows}, ${lay.coverW.toFixed(4)} × ${lay.coverH.toFixed(4)})`,
    lay.cols === 8 && lay.rows === 3 && lay.panels.length === 24 && Math.abs(lay.coverW - 7.76667) < 1e-4 && Math.abs(lay.coverH - 2.93333) < 1e-4);
  const raSpan = (Math.max(...lay.panels.map((p) => p.ra)) - Math.min(...lay.panels.map((p) => p.ra))) * 60 * Math.cos((30.66022 * Math.PI) / 180);
  check(`mosaic: at 22° east of north the 24 centres span 4.33′ on the sky in RA (${raSpan.toFixed(3)}′)`, Math.abs(raSpan - 4.327) < 0.01);
  check('mosaic: every panel centre lies inside a 9′ box around M33’s catalogue centre, and the grid is symmetric about it',
    lay.panels.every((p) => Math.hypot(p.xi, p.eta) < 4.5) && Math.abs(lay.panels.reduce((t, p) => t + p.xi, 0)) < 1e-9 && Math.abs(lay.panels.reduce((t, p) => t + p.eta, 0)) < 1e-9);
  check(`mosaic: a whole-disc map of M33 (62.09′) at the same overlap needs 65 × 65 panels (${framesAlong(62.09, 1, ov)})`, framesAlong(62.09, 1, ov) === 65);
};
