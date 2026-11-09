// #650 rebar quantity and weight. Checked against an independent Python calculation (mass per metre from
// 7850 kg/m³, a counting loop for bars at a spacing, a greedy lap split and a separate first-fit-decreasing
// packer). The example slab is made up.
import * as RB from '../../src/lib/sci/eng-rebar.ts';
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
export default async (check) => {
  check('rebar: mass per metre 10, 12, 16, 25, 32 mm (Python)', [[10, 0.616537558266997], [12, 0.8878140839044756], [16, 1.578336149163512], [25, 3.8533597391687313], [32, 6.313344596654048]].every(([d, m]) => near(RB.massPerM(d), m, 1e-12)));
  check('rebar: d²/162.2 rule of thumb within 0.1 %', near(RB.massPerM(20) / (400 / 162.2), 1, 1e-3));
  check('rebar: count at spacing (4420 / 150 → 31; 3000 / 150 → 21; 0 → 1)', RB.barCount(4420, 150) === 31 && RB.barCount(3000, 150) === 21 && RB.barCount(0, 150) === 1);
  check('rebar: split 30 m with 12 m stock and 600 lap → 12, 12, 7.2 m (Python)', JSON.stringify(RB.splitBar(30000, 12000, 600)) === '[12000,12000,7200]');
  check('rebar: no split when the bar fits a stock length', JSON.stringify(RB.splitBar(5920, 12000, 600)) === '[5920]');
  check('rebar: exact fit with one lap (23.4 m → two 12 m bars)', JSON.stringify(RB.splitBar(23400, 12000, 600)) === '[12000,12000]');
  const a = RB.meshDirection({ d: 12, spacing: 150, along: 6000, across: 4500, cover: 40, hook: 0 }, 12000, 600, 2, 1);
  const b = RB.meshDirection({ d: 10, spacing: 200, along: 4500, across: 6000, cover: 40, hook: 0 }, 12000, 600, 2, 1);
  check('rebar: example slab 62 bars each way (Python)', a.count === 62 && b.count === 62 && a.length === 5920 && b.length === 4420);
  check('rebar: example weights 325.863 and 168.956 kg (Python)', near(a.mass, 325.8632813562987, 1e-9) && near(b.mass, 168.95595246748783, 1e-9));
  const h = RB.meshDirection({ d: 16, spacing: 200, along: 30000, across: 1000, cover: 50, hook: 100 }, 12000, 800, 1, 3);
  check('rebar: long footing bars with hooks, laps and 3 copies', h.length === 30100 && h.laps === 2 && h.count === 6 * 3 && near(h.total, 18 * (30100 + 1600) / 1000, 1e-9));
  const s1 = RB.stockBars([...Array(62).fill(5920), ...Array(62).fill(4420)], 12000);
  check('rebar: stock bars by first fit decreasing (Python 62, offcut 102.92 m)', s1.bars === 62 && near(s1.waste, 102920, 1e-6));
  const s2 = RB.stockBars([7200, 7200, 3500, 3500, 3500, 9000, 2000, 2000, 1000], 12000);
  check('rebar: mixed pieces (Python 4 bars, offcut 9.1 m)', s2.bars === 4 && near(s2.waste, 9100, 1e-6));
};
