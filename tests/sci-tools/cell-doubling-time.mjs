// #189 Cell doubling time and passage planner. The log-linear fits (slope, doubling time, its 95 % interval, R²,
// generations) were checked against an independent NumPy least-squares script with its own Student-t quantile, on
// the example and four random series; the two-count formula and the planner against hand working and the same script.
import { twoPoint, fitGrowth, predict, planPassage, schedule, confluenceCurve, growthFactor, doublings, toHours, parseCounts, EXAMPLE, VESSELS } from '../../src/lib/sci/doubling.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';

const RAND = [{"t": [0.7897956848362087, 33.781078498588776, 45.02494273668381, 116.35285353677902, 119.56041431280694, 123.18426275741494, 131.0330168094393, 134.58207014543632], "n": [10742.954830486708, 27340.755755575854, 36823.11317817581, 257466.47184773016, 308932.84624570975, 368575.9983447237, 376565.1027746052, 455625.13735549763], "r": 0.027953664311981465, "td": 24.796290490719294, "tdLo": 23.839210399706193, "tdHi": 25.833433258437427, "r2": 0.9983874004866027, "lnN0": 9.263652095840461, "gen": 5.395656842731199}, {"t": [6.591301194207505, 24.031805078676683, 32.296304735339845, 91.88094064095462, 93.3268844161744, 148.34402215228275], "n": [10582.611070521592, 10232.056978153816, 13705.161271255229, 28436.624456816317, 29381.993063777285, 46746.06030149804], "r": 0.011503104732450262, "td": 60.25739977873772, "tdLo": 48.988093350616495, "tdHi": 78.26060608714137, "r2": 0.9732742234393202, "lnN0": 9.126863580081096, "gen": 2.352453333177077}, {"t": [1.769103831375879, 28.860321597796595, 30.091008598049278, 55.43044659033101, 103.80481813227588], "n": [11122.603270944672, 12643.447828425025, 13420.986900953396, 17746.98427358801, 28861.73716684035], "r": 0.009779377797141291, "td": 70.87845412440925, "tdLo": 56.718210299270446, "tdHi": 94.46172831493264, "r2": 0.9818719797620342, "lnN0": 9.233883404744212, "gen": 1.4395871857165798}, {"t": [13.72434075945685, 95.95757504137893, 111.26564210427857, 127.0725369548804], "n": [15624.459317380497, 195407.62432553034, 413109.11495256255, 601915.5561791351], "r": 0.03249063051153862, "td": 21.333755905838245, "tdLo": 17.900122978818438, "tdHi": 26.397339848660785, "r2": 0.9960405930243903, "lnN0": 9.192845768688358, "gen": 5.313091454487131}];

export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // Two counts by hand: 1e5 to 4e5 in 48 h is two doublings, Td = 24 h.
  check('doubling: two counts, 4-fold in 48 h is 24 h', near(twoPoint(0, 1e5, 48, 4e5), 24) && near(doublings(1e5, 4e5), 2));
  check('doubling: 2e5 to 1.2e6 over 3 days is 27.85 h', near(twoPoint(0, 2e5, 72, 1.2e6), 72 * Math.LN2 / Math.log(6)) && near(twoPoint(0, 2e5, 72, 1.2e6), 27.853, 1e-4));
  const two = fitGrowth([{ t: 0, n: 1e5 }, { t: 48, n: 4e5 }]);
  check('doubling: two-point fit has no interval, 2 generations', two.method === 'two' && near(two.td, 24) && near(two.generations, 2) && near(two.fold, 4) && Number.isNaN(two.tdLo) && near(predict(two, 24), 2e5));
  // The example (ticked counts) against NumPy.
  const ex = fitGrowth(EXAMPLE);
  check('doubling: example Td 23.558 h (NumPy)', near(ex.td, 23.55798852129006) && near(ex.r, 0.029423020557698607));
  check('doubling: example 95 % interval 21.77 to 25.67 h (NumPy)', near(ex.tdLo, 21.766783517791715, 1e-5) && near(ex.tdHi, 25.67042731156077, 1e-5));
  check('doubling: example R², intercept, generations', near(ex.r2, 0.9979981529431634) && near(ex.lnN0, 11.475719781225166) && near(ex.generations, 4.075050801270318) && ex.used.length === 5 && ex.warn.length === 0);
  check('doubling: example neighbour steps (24 → 21.2 h …)', ex.steps.length === 5 && near(ex.steps[0].td, 24 * Math.LN2 / Math.log(1.8)) && near(ex.steps[4].td, 24 * Math.LN2 / Math.log(1.9 / 1.6)));
  const all = fitGrowth(EXAMPLE.map((p) => ({ ...p, use: true })));
  check('doubling: all six counts: Td 26.50 h, plateau warnings (NumPy)', near(all.td, 26.502062066761333) && near(all.tdHi, 33.4278729554265, 1e-5) && near(all.r2, 0.978210959558646) && all.warn.some((w) => /slows down/.test(w)));
  RAND.forEach((c, i) => {
    const g = fitGrowth(c.t.map((t, j) => ({ t, n: c.n[j] })));
    check(`doubling: random series ${i + 1} (${c.t.length} counts) matches NumPy`, near(g.td, c.td) && near(g.tdLo, c.tdLo, 1e-5) && near(g.tdHi, c.tdHi, 1e-5) && near(g.r2, c.r2) && near(g.lnN0, c.lnN0) && near(g.generations, c.gen));
  });
  // Order does not matter; days convert to hours.
  check('doubling: unsorted input and days', near(fitGrowth([...EXAMPLE].reverse()).td, ex.td) && toHours(1.5, 'd') === 36 && toHours(5, 'h') === 5);
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('doubling: errors for one count, same times, zero count, falling counts', /at least two/.test(thrown(() => fitGrowth([{ t: 0, n: 1 }, { t: 1, n: 2, use: false }]))) && /different times/.test(thrown(() => fitGrowth([{ t: 5, n: 1 }, { t: 5, n: 2 }]))) && /above 0/.test(thrown(() => fitGrowth([{ t: 0, n: 0 }, { t: 1, n: 2 }]))) && /do not go up/.test(thrown(() => fitGrowth([{ t: 0, n: 4 }, { t: 1, n: 2 }, { t: 2, n: 1 }]))));
  check('doubling: poor straight line warns', fitGrowth([{ t: 0, n: 1e5 }, { t: 24, n: 1.1e5 }, { t: 48, n: 6e5 }, { t: 72, n: 7e5 }]).warn.some((w) => /R²/.test(w)));
  // Planner: the example (80 % T75, Td from the fit, 80 % again in 3 days in two T75s) against the script.
  const T75 = VESSELS.find((v) => v.id === 't75');
  const p = { td: ex.td, lag: 0, full: 1e5, haveCells: 0.8 * 1e5 * 75, haveArea: 75, resuspendMl: 5, targetPct: 80, hours: 72, area: T75.area, medium: T75.medium, vessels: 2 };
  const pl = planPassage(p);
  check('passage: example growth ×8.318, seed 721,302 cells (9.617 %), split 1 : 8.318', near(pl.growth, 8.318296449100236) && near(pl.seedCells, 721301.5353220551) && near(pl.seedPct, 9.617353804294067) && near(pl.split, 8.318296449100238));
  check('passage: example 0.601 mL suspension + 14.40 mL medium, enough for 8', near(pl.suspMl, 0.6010846127683792) && near(pl.topUpMl, 14.398915387231622) && near(pl.needCells, 1442603.0706441102) && pl.maxVessels === 8 && pl.warn.length === 0 && near(pl.havePct, 80));
  const p2 = { td: 30, lag: 12, full: 2e5, haveCells: 3.2e6, haveArea: 25, resuspendMl: 2, targetPct: 70, hours: 96, area: 10, medium: 2, vessels: 6 };
  const pl2 = planPassage(p2);
  check('passage: with a 12 h lag (script)', near(pl2.growth, 6.964404506368992) && near(pl2.seedCells, 201022.21212448116) && near(pl2.split, 6.367455548680221) && near(pl2.suspMl, 0.12563888257780073) && pl2.maxVessels === 15);
  check('passage: by hand: 2 doublings in 48 h at Td 24 → seed a quarter', near(growthFactor(24, 48), 4) && near(growthFactor(24, 60, 12), 4) && growthFactor(24, 10, 12) === 1);
  check('passage: warnings (not enough cells, too sparse, over 90 %, inside the lag, suspension too big)',
    planPassage({ ...p, vessels: 20 }).warn.some((w) => /enough for 8/.test(w)) &&
    planPassage({ ...p, hours: 240 }).warn.some((w) => /very sparse/.test(w)) &&
    planPassage({ ...p, targetPct: 95 }).warn.some((w) => /above 90 %/.test(w)) &&
    planPassage({ ...p, lag: 80 }).warn.some((w) => /within the lag/.test(w)) &&
    planPassage({ ...p, resuspendMl: 200 }).warn.some((w) => /spin the cells down/.test(w)));
  check('passage: bad input errors', /doubling time/.test(thrown(() => planPassage({ ...p, td: 0 }))) && /between 1 and 100/.test(thrown(() => planPassage({ ...p, targetPct: 120 }))) && /whole number/.test(thrown(() => planPassage({ ...p, vessels: 1.5 }))) && /resuspend/.test(thrown(() => planPassage({ ...p, resuspendMl: NaN }))));
  const s = schedule(p, pl, 12, 6);
  check('passage: schedule rows, doublings and cells if all kept', s.length === 6 && s[0].passage === 12 && s[5].passage === 17 && s[3].hours === 216 && near(s[3].doublings, 3 * Math.log2(pl.growth)) && near(s[2].totalIfKept, 6e6 * pl.growth ** 2) && near(s[1].harvestCells, 6e6) && near(s[1].split, pl.growth));
  const c = confluenceCurve(p, pl, 3, 10);
  check('passage: sawtooth starts at the seed and peaks at the target', c.x.length === 33 && near(c.y[0], pl.seedPct) && near(c.y[10], 80) && near(c.y[11], pl.seedPct) && near(c.x[32], 216));
  const parsed = parseCounts(parseTable('time,cells\n0,1e5\n24,1.8e5\n48,4.1e5,no'), num);
  check('doubling: pasted CSV with a header and a skipped row', parsed.points.length === 3 && parsed.points[2].use === false && parsed.points[0].use === true && parsed.errors.length === 0);
  const parsed2 = parseCounts(parseTable('0\t1e5\n24\t1.8e5\t\n48\t4.1e5\tno\nabc\t5'), num);
  check('doubling: pasted tab table, use column and an error line', parsed2.points.length === 3 && parsed2.points[1].use === true && parsed2.points[2].use === false && parsed2.errors.length === 1 && parsed2.errors[0].includes('Line 4'));
};
