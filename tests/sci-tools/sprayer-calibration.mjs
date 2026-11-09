// #387 sprayer calibration: SI formula checked against the US 5940 form and a Python sum done from first
// principles (flow ÷ area swept per minute), numpy for the catch test.
import { rateLHa, flowFor, speedFor, flowAt, pressureFor, speedFromRun, gpa, course128, catchTest, tanks, GPA_PER_LHA, L_PER_GAL, M_PER_MI, M_PER_IN } from '../../src/lib/sci/sprayer.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('sprayer: 1.2 L/min at 8 km/h and 50 cm spacing is 180 L/ha', near(rateLHa(1.2, 8, 0.5), 180));
  check('sprayer: flow and speed for 180 L/ha go back to 1.2 L/min and 8 km/h', near(flowFor(180, 8, 0.5), 1.2) && near(speedFor(180, 1.2, 0.5), 8));
  { const si = rateLHa(0.3 * L_PER_GAL, (6 * M_PER_MI) / 1000, 20 * M_PER_IN);
    check('sprayer: 0.3 gal/min, 6 mph, 20 in = 138.906 L/ha (Python) = 14.85 gal/ac (5940 rule)', near(si, 138.90624999999997) && near(si * GPA_PER_LHA, 14.85) && near(gpa(0.3, 6, 20), 14.85)); }
  check('sprayer: 1 L/ha = 0.1069066 gal/ac', near(GPA_PER_LHA, 0.10690664, 1e-7));
  check('sprayer: 0.8 L/min at 3 bar needs 4.6875 bar for 1.0 L/min; flow at 4 bar is 0.9238', near(pressureFor(1, 0.8, 3), 4.6875) && near(flowAt(4, 0.8, 3), 0.9237604307));
  check('sprayer: 100 m in 45 s is 8 km/h', near(speedFromRun(100, 45), 8));
  check('sprayer: 1/128 acre course at 20 in spacing is 204.19 ft; at 30 in 136.13 ft', near(course128(20), 204.1875) && near(course128(30), 136.125));
  { const c = catchTest([1200, 1180, 1250, 1050, 1210, 1195], 60, 10);
    check('sprayer: catch test mean 1.18083 L/min, nozzle 4 is 11.08 % low, CV 5.784 % (numpy)', near(c.mean, 1.1808333333333334) && near(c.dev[3], -11.07974594, 1e-8) && near(c.cv, 5.783602359525557) && c.bad.join() === '3');
    check('sprayer: catch over 30 s doubles the flow', near(catchTest([500], 30, 10).flows[0], 1)); }
  { const t = tanks(3000, 150, 47, 1.5);
    check('sprayer: 3,000 L tank at 150 L/ha covers 20 ha; 47 ha is 2 full tanks + 7 ha (1,050 L)', near(t.areaPerTank, 20) && t.fullTanks === 2 && near(t.lastArea, 7) && near(t.lastWater, 1050) && t.tanks === 3);
    check('sprayer: label rate 1.5 per ha gives 30 per tank, 10.5 in the last, 70.5 in all', near(t.productPerTank, 30) && near(t.productLast, 10.5) && near(t.productTotal, 70.5)); }
  { const t = tanks(3000, 150, 40, null); check('sprayer: an exact number of tanks has no part tank; no label rate, no product', t.fullTanks === 2 && t.lastArea === 0 && t.tanks === 2 && t.productPerTank === null); }
};
