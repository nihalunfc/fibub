// Checks for the pure maths in src/lib/everyday/ (body.ts, cycle.ts). Run with `node tests/everyday.mjs` (Node 22+).
import * as B from '../src/lib/everyday/body.ts';
import * as C from '../src/lib/everyday/cycle.ts';
let bad = 0;
const near = (a, b, tol, msg) => { if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', msg, a, 'expected', b); } };
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', msg, JSON.stringify(a), 'expected', JSON.stringify(b)); } };
const iso = (t) => new Date(t).toISOString().slice(0, 10);

// calorie
near(B.bmrMifflin(80, 180, 30, 'm'), 1780, 0.01, 'mifflin male');
near(B.bmrMifflin(60, 165, 30, 'f'), 1320.25, 0.01, 'mifflin female');
near(B.bmrHarris(80, 180, 30, 'm'), 1853.632, 0.001, 'harris male');
near(B.bmrHarris(60, 165, 30, 'f'), 1383.683, 0.001, 'harris female');
near(B.bmrKatch(80, 20), 1752.4, 0.001, 'katch');
near(B.weeksToGoal(80, 72, -0.5), 16, 1e-9, 'weeks to goal');
eq(Number.isNaN(B.weeksToGoal(80, 72, 0.5)), true, 'wrong direction');
eq(B.weeksToGoal(80, 80, 0), 0, 'already there');
eq(B.mealSplit(2000, [25, 30, 30, 15]), [500, 600, 600, 300], 'meal split');
// water
eq(B.drinkTimes(4, 420, 1320), [420, 645, 870, 1095], 'drink times');
eq(B.drinkTimes(0, 420, 1320), [], 'no drinks');
near(B.waterByWeight(70, 30), 2.1, 1e-9, 'water by weight');
// steps
eq(B.parseFeetInches("5'7"), 67, 'feet inches'); eq(B.parseFeetInches('5 ft 7'), 67, 'ft word'); eq(B.parseFeetInches('66.9'), 66.9, 'plain inches'); eq(B.parseFeetInches('5-7'), 67, 'dash'); eq(Number.isNaN(B.parseFeetInches('abc')), true, 'junk');
{ const r = B.stepRow(10000, 70.4, 5, 3.5, 70); near(r.km, 7.04, 1e-9, 'step km'); near(r.minutes, 84.48, 1e-9, 'step minutes'); near(r.kcal, 344.96, 1e-6, 'step kcal'); }
// pace
near(B.cumTime(5, 10, 300, 5), 1525, 1e-9, 'neg split first half'); near(B.cumTime(10, 10, 300, 5), 3000, 1e-9, 'split keeps total'); near(B.cumTime(10, 10, 300, -5), 3000, 1e-9, 'pos split keeps total');
near(B.riegel(3000, 10, 21.0975), 6618.7, 1, 'riegel half');
// one-rep max
near(B.epley(100, 5), 116.667, 0.001, 'epley'); near(B.brzycki(100, 5), 112.5, 1e-9, 'brzycki');
near(B.lombardi(100, 5), 117.46, 0.01, 'lombardi'); near(B.oconnor(100, 5), 112.5, 1e-9, "o'connor");
near(B.wathan(100, 5), 116.58, 0.01, 'wathan'); near(B.mayhew(100, 5), 119.01, 0.01, 'mayhew'); near(B.lander(100, 5), 113.71, 0.01, 'lander');
near(B.weightForReps(116.667, 8), 92.105, 0.001, 'weight for reps');
eq(B.platesPerSide(100, 20, [25, 20, 15, 10, 5, 2.5, 1.25]), { plates: [[25, 1], [15, 1]], left: 0 }, 'plates 100');
eq(B.platesPerSide(102.5, 20, [25, 20, 15, 10, 5, 2.5, 1.25]), { plates: [[25, 1], [15, 1], [1.25, 1]], left: 0 }, 'plates 102.5');
eq(B.platesPerSide(225, 45, [45, 35, 25, 10, 5, 2.5]).plates, [[45, 2]], 'plates 225 lb');
eq(Number.isNaN(B.platesPerSide(10, 20, [5]).left), true, 'lighter than bar');
// sleep
eq(C.sleepTime(420, 5, 90, 15, true), 1395, 'sleep back 5 cycles'); eq(C.sleepTime(1380, 5, 90, 15, false), 405, 'sleep forward 5 cycles from 23:00');
eq(C.cyclesFor(7, 9, 90), [6, 5], 'cycles adult'); eq(C.cyclesFor(12, 16, 90), [10, 9, 8], 'cycles infant'); eq(C.cyclesFor(7, 7.2, 90), [6, 5, 4], 'fallback');
// due date
const D = Date.UTC(2026, 0, 1);
eq(iso(C.dueDate('lmp', D)), '2026-10-08', 'lmp'); eq(iso(C.dueDate('lmp', D, 35)), '2026-10-15', 'lmp 35 day cycle');
eq(iso(C.dueDate('con', Date.UTC(2026, 0, 15))), '2026-10-08', 'conception'); eq(iso(C.dueDate('d5', Date.UTC(2026, 0, 15))), '2026-10-03', 'd5');
eq(iso(C.dueDate('scan', Date.UTC(2026, 2, 1), 28, 56)), '2026-10-11', 'scan 8w0d on 1 March');
{ const due = C.dueDate('lmp', D); eq(C.gaDays(due, Date.UTC(2026, 2, 1)), 59, 'ga days'); near(C.progressPct(140), 50, 1e-9, 'progress'); eq(C.progressPct(-3), 0, 'progress floor'); eq(C.progressPct(400), 100, 'progress cap'); }
// ovulation
eq(iso(C.ovulationDay(Date.UTC(2026, 10, 1), 28)), '2026-11-15', 'ovulation 28'); eq(iso(C.ovulationDay(Date.UTC(2026, 10, 1), 28, 12)), '2026-11-17', 'luteal 12');
{ const [a, b] = C.calendarRange(Date.UTC(2026, 10, 1), 26, 32); eq([iso(a), iso(b)], ['2026-11-08', '2026-11-21'], 'calendar range days 8 to 21'); }
eq(C.cycleDay([Date.UTC(2026, 10, 1), Date.UTC(2026, 10, 29)], Date.UTC(2026, 10, 10)), 10, 'cycle day'); eq(C.cycleDay([Date.UTC(2026, 10, 1)], Date.UTC(2026, 9, 1)), 0, 'before first');
console.log(bad ? `${bad} everyday check(s) failed` : 'everyday maths: all checks passed');
process.exit(bad ? 1 : 0);
