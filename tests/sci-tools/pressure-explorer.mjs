// #1219 pressure explorer: P = F/A checked by hand-worked examples and an independent unit conversion.
import { THINGS, pressure, weight, effect, showP, showA, nice, sliderToArea, areaToSlider, questions } from '../../src/lib/sci/j3-pressure.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const A = (id) => THINGS.find((t) => t.id === id).area;
  check('pressure-explorer: 100 N on a needle (0.01 mm²) = 1e10 Pa = 10 GPa', near(pressure(100, A('needle')), 1e10) && showP(1e10) === '10 GPa');
  check('pressure-explorer: 100 N on a palm (100 cm²) = 10 kPa', near(pressure(100, A('palm')), 1e4) && showP(pressure(100, A('palm'))) === '10 kPa');
  check('pressure-explorer: 2 kg brick flat (200 cm²) 980 Pa, on end (50 cm²) 3,920 Pa', near(pressure(weight(2), A('brick-flat')), 980) && near(pressure(weight(2), A('brick-end')), 3920) && showP(980) === '980 Pa' && showP(3920) === '3,920 Pa');
  // the area notes agree with the stored areas (independent unit conversion)
  const conv = { 'mm²': 1e-6, 'cm²': 1e-4, 'm²': 1 };
  let ok = true; for (const t of THINGS) { const m = t.note.match(/([\d,.]+) (mm²|cm²|m²)(?!.*(mm²|cm²|m²))/); if (!m || !near(Number(m[1].replace(/,/g, '')) * conv[m[2]], t.area, 1e-12)) ok = false; }
  check('pressure-explorer: every object note matches its area in m²', ok);
  check('pressure-explorer: clay effects: 1 kPa none, 10 kPa dent, 1 MPa pierce', effect(1e3) === 'none' && effect(1e4) === 'dent' && effect(1e6) === 'pierce');
  check('pressure-explorer: units shown: 0.01 mm², 1 cm², 0.1 m² as 1,000 cm²', showA(1e-8) === '0.01 mm²' && showA(1e-4) === '1 cm²' && showA(0.1) === '1,000 cm²' && showA(1) === '1 m²');
  check('pressure-explorer: nice() 3 s.f. with commas', nice(1e6) === '1,000,000' && nice(0.0123456) === '0.0123' && nice(-2.5) === '−2.5');
  check('pressure-explorer: area slider round trip', areaToSlider(sliderToArea(400)) === 400 && near(sliderToArea(400), 1e-4));
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let good = true;
  for (let i = 0; i < 300; i++) for (const l of ['8', '11']) for (const x of questions(l, rnd)) {
    if (!Number.isFinite(x.ans) || (x.choices ? !(x.ans >= 0 && x.ans < x.choices.length) : x.ans <= 0)) good = false;
    const m = x.q.match(/^A force of (\d+) N presses on an area of (\d+) cm²/); if (m && !near(x.ans, Number(m[1]) / (Number(m[2]) / 1e4))) good = false;
  }
  check('pressure-explorer: questions have valid answers (force ÷ area recomputed)', good);
};
