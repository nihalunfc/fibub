// #T61 Sun position calculator: the Sun's altitude, azimuth and day at a place, and how fast it slides along its
// diurnal path. New with the article on SunSketcher's 8 April 2024 eclipse timings (Emslie et al. 2026,
// Front. Astron. Space Sci. 12: 1724714, doi:10.3389/fspas.2025.1724714, CC BY): the paper's two published
// observer records must give back its "up to one degree (two solar diameters)" drift during totality.
import { sunAltAz, sunDay } from '../../src/lib/astro/sun.ts';
import { separation } from '../../src/lib/sci/airmass.ts';

const OBS = [
  { id: 1024, t: '2024-04-08T18:42:33.127Z', lat: 32.865406, lon: -96.937767, elev: 23.7, alt: 64.556, az: 187.62 },
  { id: 1033, t: '2024-04-08T19:08:10.652Z', lat: 39.657185, lon: -85.960335, elev: 207.7, alt: 52.989, az: 215.54 },
];
const place = (o) => ({ name: `Observer ${o.id}`, lat: o.lat, lon: o.lon, elev: o.elev, tz: 'UTC' });
const drift = (o, dur) => { const p = place(o), t = Date.parse(o.t); const a = sunAltAz(p, new Date(t - dur * 500)), b = sunAltAz(p, new Date(t + dur * 500)); return separation(a.az, a.alt, b.az, b.alt); };

export default async (check) => {
  for (const o of OBS) {
    const s = sunAltAz(place(o), new Date(o.t));
    check(`sun: observer ${o.id}'s own GPS fix and time give altitude ${o.alt}° and azimuth ${o.az}° (${s.alt.toFixed(3)}, ${s.az.toFixed(2)})`,
      Math.abs(s.alt - o.alt) < 0.002 && Math.abs(s.az - o.az) < 0.01);
  }
  const s0 = sunAltAz(place(OBS[0]), new Date(OBS[0].t));
  const diam = (2 * Math.atan(695700 / (s0.dist * 1.495978707e8)) * 180) / Math.PI;
  check(`sun: the Sun was 31.93′ across on 8 April 2024, at 1.00147 AU (${(diam * 60).toFixed(2)}′, ${s0.dist.toFixed(5)} AU)`,
    Math.abs(diam * 60 - 31.93) < 0.01 && Math.abs(s0.dist - 1.00147) < 1e-5);
  check(`sun: the paper's one-degree drift: 1.0077° over 244 s of totality and 1.0944° over the longest 265 s (${drift(OBS[0], 244).toFixed(4)}, ${drift(OBS[0], 265).toFixed(4)})`,
    Math.abs(drift(OBS[0], 244) - 1.0077) < 5e-4 && Math.abs(drift(OBS[0], 265) - 1.0944) < 5e-4);
  check(`sun: 265 s of totality is 2.06 solar diameters of drift, the paper's "two solar diameters" (${(drift(OBS[0], 265) / diam).toFixed(2)})`,
    Math.abs(drift(OBS[0], 265) / diam - 2.06) < 0.01);
  check(`sun: 200 s in eastern Maine is 0.826° (${drift(OBS[1], 200).toFixed(4)})`, Math.abs(drift(OBS[1], 200) - 0.826) < 5e-4);
  const rate = OBS.map((o) => (drift(o, 244) / 244) * 60), kepler = (15 * Math.cos((s0.dec * Math.PI) / 180)) / 60;
  check(`sun: the drift rate is 0.2478°/min at both sites and equals 15 cos(declination) (${rate.map((r) => r.toFixed(4)).join(', ')} against ${kepler.toFixed(4)})`,
    rate.every((r) => Math.abs(r - 0.2478) < 5e-5) && Math.abs(rate[0] - rate[1]) < 5e-5 && Math.abs(rate[0] - kepler) < 5e-5);
  const day = sunDay(place(OBS[0]), '2024-04-08');
  check(`sun: solar noon at observer 1024 was 18:29 UT, 64.74° high, with the day 12.790 h long, so totality came 13.2 min later and 0.18° lower (${day.noon.toISOString().slice(11, 16)}, ${day.noonAlt.toFixed(2)}°, ${day.dayH.toFixed(3)} h)`,
    day.noon.toISOString().slice(11, 16) === '18:29' && Math.abs(day.noonAlt - 64.74) < 0.01 && Math.abs(day.dayH - 12.790) < 0.001 && Math.abs(day.noonAlt - OBS[0].alt - 0.181) < 0.003);
  const sep = separation(OBS[0].lon, OBS[0].lat, OBS[1].lon, OBS[1].lat), dt = (Date.parse(OBS[1].t) - Date.parse(OBS[0].t)) / 1000;
  const speed = ((sep * Math.PI * 6371e3) / 180) / dt;
  check(`sun: the two fixes are 11.142° (1239 km) apart and 1537.5 s apart, so the umbra averaged 805.8 m/s (${sep.toFixed(3)}°, ${speed.toFixed(1)} m/s)`,
    Math.abs(sep - 11.1423) < 1e-3 && Math.abs(dt - 1537.525) < 1e-3 && Math.abs(speed - 805.8) < 0.2);
};
