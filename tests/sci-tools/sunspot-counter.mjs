// #T75 Sunspot counter: the disc, the spots, the grouping and the Wolf number R = k (10 g + s).
// New with the article on automatic sunspot grouping (Zhao et al. 2024, AJ 167: 51, doi:10.3847/1538-3881/ad11e2,
// CC BY 4.0), whose worked example of 14 January 2022 has 15 spots in 9 groups, so R = 105, and K = 1.03 for HMI.
// The image below is OURS, built to that make-up; the paper publishes no spot positions.
import { findDisc, findSpots, groupSpots, wolfNumber, spotCount } from '../../src/lib/sci/sunspots.ts';

const GROUPS = [
  [[-0.55, 0.30], [-0.45, 0.32], [-0.65, 0.33]],
  [[-0.18, 0.47], [-0.14, 0.46]],
  [[0.17, 0.56], [0.21, 0.55]],
  [[0.50, 0.33], [0.545, 0.345]],
  [[-0.62, -0.26], [-0.575, -0.25]],
  [[-0.18, -0.17]], [[0.26, -0.52]], [[0.62, -0.14]], [[0.05, 0.05]],
];
function syntheticSun(w = 700, h = 700, seed = 14) {
  let st = seed; const rnd = () => { st = (st * 16807) % 2147483647; return st / 2147483647; };
  const cx = w / 2, cy = h / 2, R = 0.45 * Math.min(w, h), d = new Float32Array(w * h);
  const spots = GROUPS.flat().map(([x, y]) => [x, y, 0.013, 0.030]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const rx = (x - cx) / R, ry = (y - cy) / R, rr = Math.hypot(rx, ry);
    let v = 8;
    if (rr < 1) {
      const mu = Math.sqrt(1 - rr * rr); v = 200 * (1 - 0.6 * (1 - mu));
      let f = 1;
      for (const [sx, sy, u, p] of spots) { const dd = Math.hypot(rx - sx, ry - sy); if (dd < p) f = Math.min(f, dd < u ? 0.3 : 0.75); }
      v *= f;
      if (rr > 1 - 1 / R) v *= (1 - rr) * R;
    }
    d[y * w + x] = Math.max(0, v + 3 * (rnd() - 0.5));
  }
  return { d, w, h };
}

export default async (check) => {
  const img = syntheticSun();
  const disc = findDisc(img.d, img.w, img.h);
  check(`sunspots: the disc of our 700 px synthetic Sun is found at (350, 350) with r = 315 within 1 px (${disc.cx.toFixed(1)}, ${disc.cy.toFixed(1)}, r ${disc.r.toFixed(1)})`,
    Math.abs(disc.cx - 350) < 1 && Math.abs(disc.cy - 350) < 1 && Math.abs(disc.r - 315) < 1);
  const found = findSpots(img.d, img.w, img.h, disc, { pen: 0.86 });
  const umbrae = found.reduce((t, s) => t + spotCount(s), 0);
  check(`sunspots: 11 dark regions holding 15 umbrae, the paper's 14 January 2022 make-up (${found.length} regions, ${umbrae} umbrae)`,
    found.length === 11 && umbrae === 15);
  const link = (deg) => 2 * Math.sin((deg * Math.PI) / 360); // the tool page's degrees-on-the-Sun to a chord in disc radii
  const at = (deg, k = 1) => wolfNumber(groupSpots(found, disc, link(deg)), k);
  const w10 = at(10);
  check(`sunspots: at the page's default 10° the count is g = 9, s = 15, R = 105, the paper's number (g ${w10.g}, s ${w10.s}, R ${w10.R})`,
    w10.g === 9 && w10.s === 15 && w10.R === 105);
  check(`sunspots: the paper's HMI factor K = 1.03 gives R = 108.15 (${at(10, 1.03).R.toFixed(2)})`, Math.abs(at(10, 1.03).R - 108.15) < 1e-9);
  check(`sunspots: the same image gives R = 125 at 4°, 125 at 6°, 105 at 15°, 85 at 20° and 65 at 25° (${[4, 6, 15, 20, 25].map((d) => at(d).R).join(', ')})`,
    at(4).R === 125 && at(6).R === 125 && at(15).R === 105 && at(20).R === 85 && at(25).R === 65);
  const plateau = [];
  for (let d = 2; d <= 30; d += 0.5) if (at(d).R === 105) plateau.push(d);
  check(`sunspots: R = 105 only for grouping distances 8.5° to 18° (${plateau[0]}° to ${plateau.at(-1)}°)`, plateau[0] === 8.5 && plateau.at(-1) === 18);
  check('sunspots: one group miscounted moves R by 10 k, one spot by 1 k', (() => {
    const fake = (g, s) => Array.from({ length: g }, (_, i) => ({ id: i + 1, x: 0, y: 0, area: 1, spots: Array.from({ length: i === 0 ? s - (g - 1) : 1 }, () => ({ id: 0, x: 0, y: 0, area: 1, umbrae: 1, depth: 0.5, mu: 1 })) }));
    return wolfNumber(fake(10, 15), 1).R === 115 && wolfNumber(fake(8, 15), 1).R === 95 && wolfNumber(fake(9, 16), 1).R === 106 && Math.abs(wolfNumber(fake(9, 15), 0.6).R - 63) < 1e-9;
  })());
};
