// #1448 Geological time. Calendar dates checked against Python's datetime (1 Jan + elapsed share × 365 days),
// clock times by hand, and the eon/era/period lookup against the rounded ICS boundaries.
import * as G from '../../src/lib/sci/geotime.ts';
const PY = [[538, '18 November', '17:55'], [233, '13 December', '06:25'], [66, '26 December', '16:39'], [0.3, '31 December', '23:25'], [3700, '9 March', '12:47'], [4540, '1 January', '00:00'], [1800, '9 August', '06:52']];
export default async (check) => {
  check('geotime: calendar dates equal Python datetime', PY.every(([ma, d, t]) => { const c = G.onCalendar(ma); return c.date === d && c.time === t; }));
  check('geotime: days before midnight', Math.abs(G.onCalendar(66).daysBefore - 5.3061674008810575) < 1e-12);
  check('geotime: one-day clock', G.onClock(0.3).time === '23:59:54' && G.onClock(66).time === '23:39:03' && Math.abs(G.onClock(0.3).secondsBefore - 5.709251101321586) < 1e-9);
  const p = (ma) => Object.values(G.placeOf(ma)).join('/');
  check('geotime: placeOf', p(150) === 'Phanerozoic/Mesozoic/Jurassic' && p(66) === 'Phanerozoic/Mesozoic/Cretaceous' && p(0.3) === 'Phanerozoic/Cenozoic/Quaternary' && p(3000) === 'Archean//' && p(4540) === 'Hadean//' && p(538) === 'Phanerozoic/Paleozoic/Cambrian' && p(252) === 'Phanerozoic/Paleozoic/Permian');
  check('geotime: spans tile the time scale', ['eon', 'era', 'period'].every((r) => { const s = G.SPANS.filter((x) => x.rank === r); return s.every((x, i) => i === 0 || s[i - 1].to === x.from) && s.at(-1).to === 0; }));
  check('geotime: events in order and inside Earth history', G.EVENTS.every((e, i) => e.ma <= G.EARTH_AGE && (i === 0 || G.EVENTS[i - 1].ma > e.ma)));
  check('geotime: elapsed share', Math.abs(G.elapsed(538) - 0.8814977973568282) < 1e-12);
  let bad = 0; for (const f of [() => G.placeOf(-1), () => G.placeOf(5000)]) { try { f(); } catch { bad++; } }
  check('geotime: bad input refused', bad === 2);
};
