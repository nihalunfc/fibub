// Class 8 Science, Chapter 11 Keeping Time with the Skies: live problems (original fibub questions). Ids start with c8s-sky-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-sky-timediff': {
    title: 'time difference between two places',
    make(r) {
      const d = pick(r, 2, 24, 2), answer = d * 4;
      return { d, q: `<p>Two towns are on the same side of the equator, ${d}° of longitude apart. The Earth turns 360° in 24 hours. By how many minutes does the Sun reach noon earlier at the eastern town?</p>`, answer, unit: 'min', tol: 0.01,
        hint: 'The Earth turns 15° every hour, so each degree takes 4 minutes.', solution: steps(`24 h = 1440 min, so 360° takes 1440 min and 1° takes 4 min.`, `${d}° × 4 = <b>${answer} min</b>.`) };
    },
    verify: (x) => (x.d / 15) * 60,
  },
  'c8s-sky-lunar': {
    title: 'a lunar year falls short of a solar year',
    make(r) {
      const m = choose(r, [11, 12]), answer = 365.25 - m * 29.53;
      return { m, q: `<p>A lunar month is 29.53 days. A calendar of ${m} lunar months is how many days shorter than a solar year of 365.25 days?</p>`, answer, unit: 'days', tol: 0.01,
        hint: 'Multiply 29.53 by the number of months and subtract from 365.25.', solution: steps(`${m} × 29.53 = ${n(m * 29.53, 6)} days.`, `365.25 − ${n(m * 29.53, 6)} = <b>${n(answer, 4)} days</b>.`) };
    },
    verify: (x) => 365.25 - (x.m * 29 + x.m * 0.53),
  },
  'c8s-sky-shadow': {
    title: 'shadow of a stick',
    make(r) {
      const H = choose(r, [1, 1.5, 2, 3]), alt = choose(r, [30, 45, 60]), answer = H / Math.tan(alt * Math.PI / 180);
      return { H, alt, q: `<p>A vertical stick ${H} m tall is in sunlight when the Sun is ${alt}° above the horizon. How long is its shadow? (tan 30° = 0.577, tan 45° = 1, tan 60° = 1.732)</p>`, answer, unit: 'm', tol: 0.02,
        hint: 'Shadow length = height ÷ tan(Sun angle). At 45° the shadow equals the height.', solution: steps(`tan ${alt}° = ${alt === 30 ? 0.577 : alt === 45 ? 1 : 1.732}.`, `Shadow = ${H} ÷ ${alt === 30 ? 0.577 : alt === 45 ? 1 : 1.732} = <b>${n(answer, 3)} m</b>.`) };
    },
    verify: (x) => x.H * Math.cos(x.alt * Math.PI / 180) / Math.sin(x.alt * Math.PI / 180),
  },
  'c8s-sky-drift': {
    title: 'how far a 365-day calendar drifts',
    make(r) {
      const y = pick(r, 50, 500, 50), answer = y * 0.2422;
      return { y, q: `<p>The Earth takes 365.2422 days to go round the Sun, but a calendar of exactly 365 days ignores the extra 0.2422 day each year. By how many days would the seasons drift in ${y} years?</p>`, answer, unit: 'days', tol: 0.01,
        hint: 'Drift = years × 0.2422 days.', solution: steps(`Each year the calendar falls behind by 365.2422 − 365 = 0.2422 days.`, `${y} × 0.2422 = <b>${n(answer, 4)} days</b>.`) };
    },
    verify: (x) => x.y * (365.2422 - 365),
  },
  'c8s-sky-trail': {
    title: 'angle turned by the stars',
    make(r) {
      const t = pick(r, 1, 11, 1) + choose(r, [0, 0.5]), answer = 15 * t;
      return { t, q: `<p>A camera takes a long-exposure photograph of the night sky for ${t} hours. Through what angle has each star's trail turned around the pole star?</p>`, answer, unit: '°', tol: 0.01,
        hint: 'The sky turns 360° in 24 hours.', solution: steps(`The sky turns 360° ÷ 24 = 15° each hour.`, `${t} h × 15° = <b>${answer}°</b>.`) };
    },
    verify: (x) => (360 / 24) * x.t,
  },
};
