// #336 forest inventory plot summary. Reference values from an independent pandas/SciPy calculation (7 plots of
// 400 m², the made-up example tally plus one empty plot).
import { inventory } from '../../src/lib/sci/inventory.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const rows = '1,Birch,12.9,9.7|1,Pine,21.1,12.9|1,Birch,12.0,9.2|1,Pine,30.5,15.6|1,Pine,27.8,14.9|1,Birch,12.2,|1,Birch,7.5,6.8|1,Spruce,21.6,13.1|1,Spruce,7.5,|2,Spruce,20.7,12.8|2,Pine,29.0,15.3|2,Spruce,26.4,14.6|2,Pine,34.2,16.5|2,Pine,28.8,15.2|2,Birch,14.3,|2,Pine,34.0,16.4|2,Birch,22.0,13.2|3,Pine,32.0,16.0|3,Birch,13.7,|3,Spruce,15.9,|3,Spruce,20.8,12.8|3,Pine,26.6,14.6|4,Birch,8.7,|4,Pine,14.1,|4,Pine,36.8,|4,Birch,12.5,9.5|4,Pine,25.0,14.2|5,Birch,13.2,9.8|5,Pine,24.9,14.1|5,Pine,27.8,14.9|5,Spruce,26.3,|5,Pine,19.0,12.2|6,Pine,13.8,|6,Pine,29.1,|6,Pine,23.6,|6,Pine,26.8,|6,Birch,16.1,|'.split('|').filter(Boolean).map((l) => l.split(','));
  const trees = rows.map(([p, s, d, h]) => ({ plot: p, species: s, dbh: +d, h: h === '' ? undefined : +h }));
  const r = inventory(trees, 400, 'metric', 5, 7);
  check('inventory: stems/ha mean, SE and 95 % lower limit', near(r.stems.mean, 132.14285714285714) && near(r.stems.se, 27.1209184521298) && near(r.stems.lo, 65.7803603684042));
  check('inventory: basal area/ha mean, SD, SE', near(r.ba.mean, 5.386361584343566) && near(r.ba.sd, 3.33428396733512) && near(r.ba.se, 1.260240882576934) && near(r.ba.lo, 2.3026632334686594));
  check('inventory: quadratic mean diameter', near(r.qmd, 22.781429136766498));
  check("inventory: Lorey's height from 23 measured trees", near(r.lorey, 14.558494538500913) && r.heights === 23);
  const pine = r.species.find((s) => s.species === 'Pine');
  check('inventory: by species (Pine)', near(pine.stems.mean, 67.85714285714286) && near(pine.ba.mean, 3.9607320830854844) && near(pine.ba.se, 0.8710823071609486) && near(pine.qmd, 27.261202429363546) && near(pine.shareBA, 0.7353260677110999));
  const ref = { 5: 10.714285714285714, 10: 32.142857142857146, 15: 10.714285714285714, 20: 25, 25: 35.714285714285715, 30: 14.285714285714286, 35: 3.5714285714285716 };
  check('inventory: 5 cm diameter classes, stems/ha', r.classes.length === 7 && r.classes.every((c) => near(c.total, ref[c.lo])));
};
