// #196 Autoclave F0 value calculator. The F0 totals (trapezoids and held readings), running totals, time at or
// above the hold temperature, peak, z = 8 lethality and the equivalent time at 134 °C were checked against an
// independent NumPy script on the made-up example log and three random logs with random Tref and z; the D-value,
// log reduction, SAL and time-at-temperature arithmetic against hand working, and a straight-line ramp against
// its exact integral z / (b ln 10) · (L1 − L0).
import { lethalRate, cumulativeF, totalF, timeAbove, analyse, equivalentTime, dAt, organismKill, neededLR, timeFor, survivors, parseLog, clockMinutes, fToC, EXAMPLE_CSV } from '../../src/lib/sci/f0.ts';
import { num, parseTable } from '../../src/lib/sci/num.ts';

const RAND = [{"t": [0.0, 1.208391397318752, 1.701160744306521, 2.291376914691114, 3.6269963937062544, 3.8338412896415015, 5.101438233539098, 6.337628490916758, 7.145943929613595, 7.7398860844787025, 8.301839380209707, 8.833169844160068, 9.61176904180751, 10.46768177845285, 11.38722833614969, 12.881378704614402, 14.111839199592279, 15.12067219786579, 16.60632038985224, 17.086221697558518, 17.494497341573716, 18.490798827128657, 18.747923437478455, 18.99430779988413, 19.863663266236912, 20.669731099159787, 22.062049204310494, 23.080043335148808, 23.948396275728175, 24.794331741739732, 25.316101140375263, 25.53143337358052, 25.98155616076142, 27.08119791790781, 27.541986659090906, 28.222383862873773, 28.42723837754147, 29.70630042628374, 30.10709983166361, 30.654978927596535, 31.999410727771615, 32.86213878060057, 34.163434100876195, 35.19506641790148, 36.3593686494719, 36.67831293605386, 37.58179990384329, 38.44190381103375, 39.774645000734495, 40.4442882774529, 41.421927564822276, 41.69895469987143, 42.40287604131537, 43.02282329145104, 43.41808293924263, 44.67932247420743, 45.372602497222836], "T": [100.33, 102.81, 102.6, 104.05, 105.98, 106.62, 108.05, 110.33, 111.77, 113.21, 114.16, 113.69, 115.04, 116.9, 116.74, 119.23, 120.67, 122.28, 123.16, 122.98, 123.22, 123.83, 124.84, 123.97, 124.37, 124.93, 124.92, 124.89, 124.35, 124.73, 124.36, 125.1, 124.68, 123.84, 123.93, 123.02, 123.58, 122.1, 122.06, 120.64, 120.15, 118.2, 116.5, 116.04, 114.16, 114.24, 113.96, 111.13, 109.14, 108.47, 107.0, 106.2, 105.0, 104.4, 103.63, 100.68, 99.96], "tref": 122.5, "z": 12.5, "trap": 27.36036103635361, "left": 27.372156723133266}, {"t": [0.0, 0.7445747461871407, 2.0044079075807, 2.2229604541706935, 3.2399609863968717, 4.470891741924316, 5.337796399593187, 6.4814006463096, 6.975751173815888, 7.433828666206362, 8.10589370192182, 8.539121537759112, 9.189001408605334, 10.621562688439393, 11.566895221333851, 12.208983708980943, 12.761965714732364, 14.199617052652142, 14.97743872519339, 16.451951901338155, 17.322131371176308, 18.1996473389104, 19.5651500197412, 20.73074766342075, 21.68559638642942, 22.440240741416556, 23.78188495866032, 24.517024953539277, 25.916612402558286, 26.205942360316705, 26.964938280788218, 27.840307546629436, 29.27652720088584, 29.802826221550028, 31.05067711299077, 32.13008967298894, 33.262301348554395, 34.28081018624666, 35.743839107246714, 36.376325004221435, 37.09408323180462, 37.55786850968219, 37.823783781536136, 38.30056443500408, 39.69066815126516], "T": [99.47, 101.64, 104.65, 103.65, 106.24, 108.35, 109.37, 112.64, 113.1, 113.91, 114.59, 115.87, 116.35, 118.56, 119.27, 119.96, 121.84, 122.29, 123.31, 124.09, 124.28, 124.53, 125.31, 124.79, 124.66, 124.49, 124.38, 123.65, 122.36, 121.62, 120.44, 120.63, 118.84, 117.56, 116.07, 114.47, 112.59, 110.84, 107.46, 107.24, 104.48, 104.63, 103.93, 103.18, 100.94], "tref": 123.5, "z": 6.4, "trap": 18.70861437836321, "left": 18.65564575731509}, {"t": [0.0, 0.346532089239731, 1.3611274543662883, 2.5978230823425217, 3.205660995945439, 4.527313001339794, 5.763577988039763, 6.131457311956384, 7.328374215715987, 8.675781151588481, 9.132248492369751, 10.07798202571783, 11.108356981546564, 12.100491516286944, 12.425610897203399, 13.485159796522833, 14.506700938606208, 15.777752074308825, 17.02231858317825, 17.647637253490704, 18.786298786295223, 20.113754190139286, 21.474586275787313, 21.884552300818413, 22.119265355930583, 23.165315032379482, 23.644394186946375, 24.577216828493565, 26.00546271724246, 26.698578228770796, 27.227185144270393, 28.020648209220823, 29.075065296472776, 29.40649395468383, 30.10125414723454, 30.475091692724618, 31.536271780823146, 32.81599007276528, 33.505899988596695, 34.18914112720344, 35.09051928383511, 35.57009439736463, 36.09172686646643], "T": [99.66, 100.49, 103.62, 105.63, 106.3, 109.13, 112.59, 112.8, 114.91, 117.11, 117.86, 119.63, 120.85, 121.83, 121.55, 123.31, 123.48, 125.06, 124.27, 124.92, 124.94, 123.93, 124.76, 124.35, 123.21, 122.94, 122.28, 119.76, 119.36, 118.21, 117.47, 115.62, 114.2, 113.65, 113.05, 111.91, 109.65, 107.8, 105.3, 103.93, 101.27, 101.92, 100.48], "tref": 123.4, "z": 12.2, "trap": 18.32071786216423, "left": 18.088422135971292}];
const NP = {
  chamber: { trap: 27.652372653723774, left: 27.652371534424713, cum10: 1.4398894868244738, cum32: 27.00165863529819, above: 21.12921, first: 10.91667, last: 32.04587, z8: 28.338847850303637, t134: 1.4181834109833729 },
  load: { trap: 22.102164221639885, left: 22.102158986058665, cum10: 0.25735397896960105, cum32: 21.343448738970604, above: 15.45064, first: 16.6, last: 32.05063, z8: 21.884249144766713, t134: 1.1335346531914645 },
};

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  // By hand.
  check('f0: lethal rate 1 at Tref, 10 at Tref + z, 0.1 at Tref − z', near(lethalRate(121.1, 121.1, 10), 1) && near(lethalRate(131.1, 121.1, 10), 10) && near(lethalRate(111.1, 121.1, 10), 0.1));
  check('f0: 15 min held at 121.1 °C is F0 = 15', near(totalF([0, 5, 15], [121.1, 121.1, 121.1], { tref: 121.1, z: 10 }), 15));
  check('f0: 1 min at 131.1 °C is F0 = 10; held readings use the first one', near(totalF([0, 1], [131.1, 131.1], { tref: 121.1, z: 10 }), 10) && near(totalF([0, 2], [131.1, 121.1], { tref: 121.1, z: 10, method: 'left' }), 20) && near(totalF([0, 2], [131.1, 121.1], { tref: 121.1, z: 10 }), 11));
  check('f0: equivalent time, 10 min at 121.1 is 1 min at 131.1', near(equivalentTime(10, 121.1, 10, 131.1), 1) && near(equivalentTime(10, 121.1, 10, 121.1), 10));
  const ramp = Array.from({ length: 3001 }, (_, i) => i / 100);
  check('f0: straight ramp 100 → 130 °C over 30 min near its exact integral 33.678', near(totalF(ramp, ramp.map((x) => 100 + x), { tref: 121.1, z: 10 }), 10 / Math.LN10 * (lethalRate(130, 121.1, 10) - lethalRate(100, 121.1, 10)), 1e-5));
  // D-values and kill.
  check('f0: D moves with z (1.5 min at 121.1 → 0.15 at 131.1, 15 at 111.1)', near(dAt(1.5, 121.1, 10, 131.1), 0.15) && near(dAt(1.5, 121.1, 10, 111.1), 15));
  check('f0: 10⁶ per item to SAL 10⁻⁶ needs 12 logs; 18 min at 121.1, 0.9227 min at 134', near(neededLR(1e6, 1e-6), 12) && near(timeFor(12, 1.5, 121.1, 10, 121.1), 18) && near(timeFor(12, 1.5, 121.1, 10, 134), 18 * 10 ** -1.29) && near(survivors(1e6, 12), 1e-6));
  // The example against NumPy.
  const log = parseLog(parseTable(EXAMPLE_CSV), num);
  check('f0: example log reads 46 readings and two named probes', log.t.length === 46 && log.names.join('|') === 'Chamber|Load centre' && log.errors.length === 0 && log.t[45] === 45 && !log.clock);
  const r = analyse(log, { tref: 121.1, z: 10 }, 121);
  const [ch, ld] = r.probes;
  check('f0: example F0 27.65 (chamber), 22.10 (load centre) (NumPy)', near(ch.f0, NP.chamber.trap) && near(ld.f0, NP.load.trap) && r.cold === 1);
  check('f0: example running totals at 10 and 32 min (NumPy)', near(ch.cum[10], NP.chamber.cum10) && near(ch.cum[32], NP.chamber.cum32) && near(ld.cum[10], NP.load.cum10) && near(ld.cum[32], NP.load.cum32));
  check('f0: example time at or above 121 °C, first and last (NumPy on a fine grid)', near(ch.above, NP.chamber.above, 1e-5) && near(ld.above, NP.load.above, 1e-5) && near(ch.firstAbove, NP.chamber.first, 1e-5) && near(ld.firstAbove, NP.load.first, 1e-5) && near(ch.lastAbove, NP.chamber.last, 1e-5) && near(ld.lastAbove, NP.load.last, 1e-5));
  check('f0: example peaks 122.1 °C at 16 min and 121.6 °C at 25 min', ch.peak === 122.1 && ch.peakAt === 16 && ld.peak === 121.6 && ld.peakAt === 25 && r.dtMedian === 1 && r.warn.length === 0);
  check('f0: F0 while at or above 121 °C, 24.81 and 16.58 (NumPy with the crossings put in)', near(ch.f0Above, 24.8124275253743) && near(ld.f0Above, 16.58457893194364));
  const left = analyse(log, { tref: 121.1, z: 10, method: 'left' }, 121);
  check('f0: example held readings (NumPy)', near(left.probes[0].f0, NP.chamber.left) && near(left.probes[1].f0, NP.load.left));
  check('f0: example equivalent minutes at 134 °C (NumPy)', near(equivalentTime(ch.f0, 121.1, 10, 134), NP.chamber.t134) && near(equivalentTime(ld.f0, 121.1, 10, 134), NP.load.t134));
  const k8 = organismKill(log.t, log.temps[1], 1.5, 121.1, 8);
  check('f0: organism with z = 8 °C on the load centre (NumPy) and D = 1.5 min', near(k8.F, NP.load.z8) && near(k8.lr, NP.load.z8 / 1.5));
  check('f0: organism with z = 10 equals F0 ÷ D', near(organismKill(log.t, log.temps[1], 1.5, 121.1, 10).lr, ld.f0 / 1.5));
  RAND.forEach((c, i) => {
    check(`f0: random log ${i + 1} (${c.t.length} readings, Tref ${c.tref}, z ${c.z}) matches NumPy`, near(totalF(c.t, c.T, { tref: c.tref, z: c.z }), c.trap) && near(totalF(c.t, c.T, { tref: c.tref, z: c.z, method: 'left' }), c.left));
  });
  // Time above with crossings by hand: 120 → 122 over 2 min crosses 121 at 1 min.
  { const a = timeAbove([0, 2, 4], [120, 122, 120], 121); check('f0: time above with two crossings', near(a.above, 2) && near(a.first, 1) && near(a.last, 3)); }
  // Reading logs.
  check('f0: clock times and date-times', clockMinutes('10:15') === 615 && near(clockMinutes('10:15:30'), 615.5) && clockMinutes('2026-11-09 00:01') - clockMinutes('2026-11-08 23:59') === 2 && Number.isNaN(clockMinutes('25:00')) && Number.isNaN(clockMinutes('abc')));
  { const l = parseLog(parseTable('time;temp\n23:58:00;120\n23:59:00;121\n00:00:30;122'), num); check('f0: clock log over midnight', l.clock && near(l.t[1], 1) && near(l.t[2], 2.5) && l.names[0] === 'temp'); }
  { const l = parseLog(parseTable('0\t250\n30\t260\n60\t250'), num, 's', true); check('f0: seconds and °F', near(l.t[2], 1) && near(l.temps[0][1], fToC(260)) && near(fToC(250), 121.1111111) && l.names[0] === 'Probe'); }
  { const l = parseLog(parseTable('t,a,b\n0,100,101\nx,1,2\n2,110\n3,120,121'), num); check('f0: bad lines are left out with their line numbers', l.t.length === 2 && l.errors.length === 2 && l.errors[0].startsWith('Line 3') && l.errors[1].startsWith('Line 4')); }
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('f0: error messages', /two readings/.test(thrown(() => analyse({ t: [0], names: ['a'], temps: [[121]] }, { tref: 121.1, z: 10 }, 121)))
    && /go up/.test(thrown(() => analyse({ t: [0, 2, 1], names: ['a'], temps: [[1, 2, 3]] }, { tref: 121.1, z: 10 }, 121)))
    && /z-value/.test(thrown(() => analyse(log, { tref: 121.1, z: 0 }, 121)))
    && /D-value/.test(thrown(() => organismKill([0, 1], [1, 2], 0, 121.1, 10)))
    && /assurance/.test(thrown(() => neededLR(1e6, 0))));
  { const g = analyse({ t: [0, 1, 2, 12, 13], names: ['a'], temps: [[100, 110, 115, 120, 100]] }, { tref: 121.1, z: 10 }, 121); check('f0: gap and never-reached warnings', g.warn.some((w) => /gap of 10 minutes/.test(w)) && g.warn.some((w) => /never reached 121/.test(w))); }
};
