// #334 tree height (clinometer) and basal area. Reference values from an independent NumPy calculation.
import { tangentHeight, sineHeight, basalArea, plot, prism, limitDistance, horizontal } from '../../src/lib/sci/treeheight.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const deg = (v) => ({ value: v, unit: 'deg' }), pct = (v) => ({ value: v, unit: 'pct' });
  check('tree height: tangent method, degrees', near(tangentHeight({ dist: 20, top: deg(52), base: deg(-4) }).H, 26.997368882731784));
  check('tree height: tangent method, percent', near(tangentHeight({ dist: 20, top: pct(128), base: pct(-7) }).H, 27.0));
  check('tree height: distance along a 15° slope', near(tangentHeight({ dist: 22, slope: deg(15), top: deg(52), base: deg(-4) }).H, 28.685201430251823));
  check('tree height: distance along a 25 % slope', near(tangentHeight({ dist: 22, slope: pct(25), top: pct(128), base: pct(-7) }).H, 28.813232254316357));
  check('tree height: level ground with eye height', near(tangentHeight({ dist: 20, top: deg(52), eye: 1.6 }).H, 27.19883264386158));
  check('tree height: sine method', near(sineHeight({ lTop: 33.5, top: deg(53), lBase: 20.1, base: deg(-5) }).H, 28.50612001581224));
  check('tree height: horizontal distance', near(horizontal(10, deg(60)), 5));
  check('basal area: 35 cm tree in m²', near(basalArea(35, 'metric'), 0.0962112750161874));
  check('basal area: 14 in tree in ft² (0.005454 × D²)', near(basalArea(14, 'imperial'), 1.0690141665, 1e-9));
  const p = plot([12.5, 18.2, 24.0, 31.7, 9.8, 15.1, 27.3, 40.2, 21.6, 13.4], 400, 'metric');
  check('basal area: plot per hectare', near(p.baPer, 10.602639586416533) && p.stems === 250 && near(p.qmd, 23.2376418769203));
  const s = prism([7, 9.5, 6, 11, 8], 2, 'metric');
  check('basal area: prism sweep BAF 2', near(s.ba, 16.6) && near(s.se, 1.7776388834631178));
  check('basal area: prism stems per ha from in-tree DBHs', near(prism([2, 1], 2, 'metric', [[20, 30], [25]]).stems, 66.34992738675459));
  check('basal area: limiting distance, metric and imperial (2.75 ft/in at BAF 10)', near(limitDistance(30, 2, 'metric'), 10.606601717798211) && near(limitDistance(10, 10, 'imperial'), 27.5, 1e-4));
  // New with the article on the UWB tree height device (Li et al. 2025, Forests): slant distance to the base along the
  // base sight line reproduces the paper's H = AB sin α + AB cos α tan β.
  const ab = 15.07, al = (5.71 * Math.PI) / 180, be = (41.99 * Math.PI) / 180;
  check('tree height: slant distance to the base = AB sin α + AB cos α tan β (14.9964 m)', near(tangentHeight({ dist: ab, slope: deg(-5.71), top: deg(41.99), base: deg(-5.71) }).H, ab * Math.sin(al) + ab * Math.cos(al) * Math.tan(be)) && near(tangentHeight({ dist: ab, slope: deg(-5.71), top: deg(41.99), base: deg(-5.71) }).H, 14.996389708716114));
  check('tree height: one degree high on the top reading adds 0.76 m at 5 m but 0.48 m at 15 m', Math.abs(tangentHeight({ dist: 5.22, slope: deg(-16.7), top: deg(70.68), base: deg(-16.7) }).H - 15.7613) < 1e-3 && Math.abs(tangentHeight({ dist: ab, slope: deg(-5.71), top: deg(42.99), base: deg(-5.71) }).H - 15.4777) < 1e-3);
};
