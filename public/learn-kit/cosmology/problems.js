// Live problems for Cosmology A to Z. Each one makes fresh numbers with make(rand) and returns
// { q, answer, unit, tol (relative), hint, solution } as small HTML strings; `verify` recomputes the answer
// another way for tests/cosmo.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
import * as P from './phys.js';

/** A random value from min to max in steps of `step`. */
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
/** Friendly number text. */
const n = (v, d = 3) => {
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a)), m = v / 10 ** e;
    return `${+m.toPrecision(d)} × 10<sup>${e}</sup>`;
  }
  return (+v.toPrecision(d)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
};
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---------- Module 1 ----------
  'cosmic-calendar': {
    title: 'squeeze the universe into one year',
    make(r) {
      const life = pick(r, 60, 100, 5);
      const answer = (life / 13.8e9) * P.YEAR;
      return {
        q: `<p>Squeeze the 13.8 billion years since the Big Bang into one calendar year. A person lives ${life} years. How many <b>seconds</b> of the cosmic calendar is that?</p>`,
        answer, unit: 'seconds', tol: 0.03,
        hint: 'Work out what fraction of 13.8 billion years one life is, then take that fraction of one year in seconds (365.25 × 24 × 3600 ≈ 31.6 million s).',
        solution: steps(
          `Fraction of cosmic time: ${life} ÷ 13,800,000,000 = ${n(life / 13.8e9)}.`,
          `One year has 365.25 × 24 × 3600 = 31,557,600 seconds.`,
          `${n(life / 13.8e9)} × 31,557,600 s = <b>${n(answer)} s</b>. A whole human life is less than a blink on the cosmic calendar.`),
        life,
      };
    },
    verify: (p) => (p.life * 31557600) / 13.8e9,
  },
  'eratosthenes': {
    title: 'measure the Earth like Eratosthenes',
    make(r) {
      const ang = pick(r, 5, 9, 0.2), dist = pick(r, 600, 1000, 50);
      const answer = P.eratosthenes(ang, dist);
      return {
        q: `<p>At noon on the same day, the Sun is straight overhead in one town, but in a second town ${dist} km due north a stick casts a shadow that shows the Sun is ${ang}° away from overhead. How big around is the Earth, in km?</p>`,
        answer, unit: 'km', tol: 0.01,
        hint: 'The shadow angle is the same as the angle between the two towns measured at the centre of the Earth. A full circle is 360°.',
        solution: steps(
          `The towns are ${ang}° apart around the Earth's centre.`,
          `${ang}° is ${n(ang / 360)} of a full 360° circle, so ${dist} km is that fraction of the circumference.`,
          `Circumference = (360 ÷ ${ang}) × ${dist} km = <b>${n(answer, 4)} km</b>. (The real value is about 40,000 km.)`),
        ang, dist,
      };
    },
    verify: (p) => (360 / p.ang) * p.dist,
  },
  'aristarchus': {
    title: 'how much farther is the Sun than the Moon?',
    make(r) {
      const ang = pick(r, 85, 89.5, 0.5);
      const answer = P.aristarchusRatio(ang);
      return {
        q: `<p>At exactly half moon, the angle between the Moon and the Sun, seen from Earth, is ${ang}°. Using Aristarchus's right-angled triangle, how many times farther away is the Sun than the Moon?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'At half moon the angle at the Moon is 90°. In the right-angled triangle, Earth-Moon is next to your angle and Earth-Sun is the long side: cos(angle) = Earth-Moon ÷ Earth-Sun.',
        solution: steps(
          'At half moon, the Sun lights exactly half the face we see, so the Earth-Moon-Sun angle is 90°.',
          `cos(${ang}°) = Earth-Moon ÷ Earth-Sun = ${n(Math.cos(ang * P.DEG), 4)}.`,
          `Earth-Sun ÷ Earth-Moon = 1 ÷ ${n(Math.cos(ang * P.DEG), 4)} = <b>${n(answer)}</b>. Aristarchus measured 87° and got about 19; the true angle is 89.85°, which gives about 390. Tiny angle errors matter hugely here.`),
        ang,
      };
    },
    verify: (p) => 1 / Math.cos((p.ang * Math.PI) / 180),
  },
  'olbers-shell': {
    title: 'every shell of stars shines the same',
    make(r) {
      const k = pick(r, 2, 10, 1);
      return {
        q: `<p>Stars are spread evenly through space. A thin shell of stars ${k} times farther away than a nearby shell (same thickness) has ${k}² = ${k * k} times as many stars, but each looks fainter. How many times brighter or fainter is the whole far shell compared with the near shell? (Answer 1 if they are equal.)</p>`,
        answer: 1, unit: 'times as bright', tol: 0, abs: 0.01,
        hint: 'Each star\'s light spreads over a sphere, so at k times the distance each star looks 1/k² as bright.',
        solution: steps(
          `Number of stars: ${k}² = ${k * k} times more (the shell's area grows as distance²).`,
          `Brightness of each: 1/${k}² = 1/${k * k} as much (the inverse square law).`,
          `Total: ${k * k} × 1/${k * k} = <b>1</b>. Every shell adds the same light, so endless shells would make the whole sky blaze. Yet the night is dark: that is Olbers' paradox.`),
        k,
      };
    },
    verify: () => 1,
  },
  'andromeda-angle': {
    title: 'how far is Andromeda if it is a galaxy?',
    make(r) {
      const size = pick(r, 100, 220, 10), ang = pick(r, 3, 5, 0.5);
      const answer = size / (ang * P.DEG) / 1000; // million light-years
      return {
        q: `<p>Suppose the Andromeda nebula is a galaxy ${size},000 light-years across, and it spans ${ang}° of the sky in long-exposure photographs. How far away is it, in <b>millions</b> of light-years?</p>`,
        answer, unit: 'million light-years', tol: 0.01,
        hint: 'For small angles, size = distance × angle, with the angle in radians (1° = π/180 radians).',
        solution: steps(
          `${ang}° in radians: ${ang} × π ÷ 180 = ${n(ang * P.DEG, 4)}.`,
          `distance = size ÷ angle = ${size},000 ly ÷ ${n(ang * P.DEG, 4)} = ${n(answer * 1e6, 4)} ly.`,
          `That is about <b>${n(answer)} million light-years</b>, far outside the Milky Way. (The measured distance is about 2.5 million light-years.)`),
        size, ang,
      };
    },
    verify: (p) => (p.size * 1000) / ((p.ang * Math.PI) / 180) / 1e6,
  },
  'light-travel': {
    title: 'how old is the light you see?',
    make(r) {
      const list = [['the Moon', 3.844e8], ['the Sun', P.AU], ['Jupiter (at its closest)', 5.88e11], ['Neptune', 4.5e12]];
      const [name, d] = list[Math.floor(r() * list.length * 0.9999)];
      const answer = d / P.C / 60;
      return {
        q: `<p>Light travels at 299,792 km/s. ${name[0].toUpperCase() + name.slice(1)} is about ${n(d / 1000)} km away. How many <b>minutes</b> old is the light you see from it?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'time = distance ÷ speed. Keep both in km, then divide seconds by 60.',
        solution: steps(
          `time = ${n(d / 1000)} km ÷ 299,792 km/s = ${n(d / P.C)} s.`,
          `${n(d / P.C)} s ÷ 60 = <b>${n(answer)} minutes</b>.`,
          'You always see things as they were, never as they are. The farther you look, the further back in time you see.'),
        d,
      };
    },
    verify: (p) => p.d / P.C / 60,
  },
  // ---------- Module 2 ----------
  'moon-fall': {
    title: 'Newton\'s Moon test',
    make(r) {
      const k = pick(r, 20, 100, 5);
      const answer = (4.9 / (k * k)) * 1000;
      return {
        q: `<p>Near the ground, a dropped stone falls 4.9 m in its first second. Suppose a moon circled a planet like ours at ${k} times the planet's radius. If gravity weakens as 1/distance², how far does that moon fall towards the planet in one second, in <b>millimetres</b>?</p>`,
        answer, unit: 'mm', tol: 0.01,
        hint: 'At k times the distance, gravity is 1/k² as strong, so the fall in the first second is 1/k² as big.',
        solution: steps(
          `Gravity there is 1/${k}² = 1/${k * k} of its strength at the ground.`,
          `Fall in one second: 4.9 m ÷ ${k * k} = ${n(4.9 / (k * k))} m = <b>${n(answer)} mm</b>.`,
          'For our Moon (k = 60) this gives 1.36 mm, exactly what its curved path needs. That match convinced Newton that one law rules the sky and the ground.'),
        k,
      };
    },
    verify: (p) => (4.9 / (p.k * p.k)) * 1000,
  },
  'free-fall-time': {
    title: 'how fast would a still universe collapse?',
    make(r) {
      const rho = pick(r, 1, 9, 1);
      const dens = rho * 1e-21; // kg/m³
      const answer = Math.sqrt((3 * Math.PI) / (32 * P.G * dens)) / P.YEAR / 1e6;
      return {
        q: `<p>A huge, still cloud of stars has an average density of ${rho} × 10<sup>−21</sup> kg/m³ (about a galaxy's worth). Starting at rest, gravity pulls it together in the free-fall time t = √(3π ÷ (32 G ρ)). How long is that, in <b>millions of years</b>? (G = 6.674 × 10<sup>−11</sup>, 1 year = 3.156 × 10<sup>7</sup> s.)</p>`,
        answer, unit: 'million years', tol: 0.01,
        hint: 'Put ρ in kg/m³, work out 32 G ρ, divide 3π by it, take the square root (seconds), then divide by seconds per year and by a million.',
        solution: steps(
          `32 G ρ = 32 × 6.674 × 10<sup>−11</sup> × ${rho} × 10<sup>−21</sup> = ${n(32 * P.G * dens)} s<sup>−2</sup>.`,
          `t = √(9.425 ÷ ${n(32 * P.G * dens)}) = ${n(answer * 1e6 * P.YEAR)} s.`,
          `That is <b>${n(answer)} million years</b>: short next to the age of the universe. Without something holding it up, a still universe falls in on itself.`),
        dens,
      };
    },
    verify: (p) => Math.sqrt((3 * Math.PI) / (32 * 6.6743e-11 * p.dens)) / (365.25 * 86400) / 1e6,
  },
  'light-year-km': {
    title: 'how far is a light-year?',
    make(r) {
      const ly = pick(r, 2, 40, 1) / 10;
      const answer = ly * P.LY / 1000;
      return {
        q: `<p>A star is ${ly} light-years away. How far is that in kilometres? Light travels 299,792 km every second, and a year has 365.25 days.</p>`,
        answer, unit: 'km', tol: 0.01,
        hint: 'One light-year is the distance light covers in one year: 299,792 km/s × seconds in a year.',
        solution: steps(
          'Seconds in a year: 365.25 × 24 × 3600 = 31,557,600 s.',
          'One light-year: 299,792 km/s × 31,557,600 s = 9.461 × 10<sup>12</sup> km.',
          `${ly} light-years = ${ly} × 9.461 × 10<sup>12</sup> = <b>${n(answer)} km</b>. Its light left ${ly} years ago.`),
        ly,
      };
    },
    verify: (p) => p.ly * 9.4607e12,
  },
  'distance-modulus': {
    title: 'distance from the magnitude difference',
    make(r) {
      const mu = pick(r, 5, 30, 0.5);
      const answer = P.distFromModulus(mu);
      return {
        q: `<p>A star's true brightness is M and how bright it looks is m (both in magnitudes; bigger numbers are fainter). For one object m − M = ${mu}. How far away is it, in parsecs? Use d = 10<sup>(m − M + 5)/5</sup>.</p>`,
        answer, unit: 'parsecs', tol: 0.01,
        hint: `Work out (${mu} + 5) ÷ 5 first, then raise 10 to that power.`,
        solution: steps(
          `(m − M + 5) ÷ 5 = (${mu} + 5) ÷ 5 = ${n((mu + 5) / 5, 4)}.`,
          `d = 10<sup>${n((mu + 5) / 5, 4)}</sup> = <b>${n(answer)} pc</b> (× 3.26 = ${n(answer * 3.2616)} light-years).`,
          'Every 5 magnitudes fainter means 100 times dimmer, which means 10 times farther.'),
        mu,
      };
    },
    verify: (p) => 10 ** ((p.mu + 5) / 5),
  },
  'cepheid-distance': {
    title: 'distance to a galaxy from one Cepheid',
    make(r) {
      const Pd = pick(r, 10, 60, 1), m = pick(r, 18, 26, 0.1);
      const M = -2.4 * (Math.log10(Pd) - 1) - 4.1;
      const answer = P.distFromModulus(m - M) / 1e6;
      return {
        q: `<p>A Cepheid in a distant galaxy pulses every ${Pd} days and looks, on average, magnitude m = ${m}. Use the period-luminosity rule M = −2.4 (log₁₀P − 1) − 4.1 for its true brightness. How far away is the galaxy, in <b>millions of parsecs</b> (Mpc)?</p>`,
        answer, unit: 'Mpc', tol: 0.015,
        hint: 'Find M from the period, then m − M, then d = 10^((m − M + 5)/5) in parsecs. Divide by a million at the end.',
        solution: steps(
          `log₁₀ ${Pd} = ${n(Math.log10(Pd), 4)}, so M = −2.4 × (${n(Math.log10(Pd), 4)} − 1) − 4.1 = ${n(M, 4)}.`,
          `m − M = ${m} − (${n(M, 4)}) = ${n(m - M, 4)}.`,
          `d = 10<sup>(${n(m - M, 4)} + 5)/5</sup> = ${n(answer * 1e6)} pc = <b>${n(answer)} Mpc</b>.`,
          'Real measurements also correct for dust, which makes stars look fainter and so farther than they are.'),
        Pd, m,
      };
    },
    verify: (p) => 10 ** ((p.m - (-2.4 * (Math.log10(p.Pd) - 1) - 4.1) + 5) / 5) / 1e6,
  },
  'sn-distance': {
    title: 'distance from a Type Ia supernova',
    make(r) {
      const m = pick(r, 14, 24, 0.1);
      const answer = P.distFromModulus(m + 19.3) / 1e6;
      return {
        q: `<p>After correcting for how fast it fades, a Type Ia supernova peaks at true brightness M = −19.3. It is seen at peak magnitude m = ${m}. How far away is it, in Mpc? (Ignore the expansion of space; that comes in Module 5.)</p>`,
        answer, unit: 'Mpc', tol: 0.01,
        hint: 'm − M = m + 19.3. Then d = 10^((m − M + 5)/5) parsecs.',
        solution: steps(
          `m − M = ${m} − (−19.3) = ${n(m + 19.3, 4)}.`,
          `d = 10<sup>(${n(m + 19.3, 4)} + 5)/5</sup> pc = <b>${n(answer)} Mpc</b> = ${n(answer * 3.2616)} million light-years.`),
        m,
      };
    },
    verify: (p) => 10 ** ((p.m + 19.3 + 5) / 5) / 1e6,
  },
  'tully-fisher': {
    title: 'brightness from spin',
    make(r) {
      const v = pick(r, 80, 320, 10);
      const answer = (v / 220) ** 4;
      return {
        q: `<p>The Tully-Fisher rule says a spiral galaxy's light grows about as its rotation speed to the 4th power. The Milky Way spins at about 220 km/s. A galaxy spins at ${v} km/s. How many times the Milky Way's light does it give out?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Light ratio = (speed ratio)⁴.',
        solution: steps(
          `Speed ratio: ${v} ÷ 220 = ${n(v / 220, 4)}.`,
          `Light ratio: ${n(v / 220, 4)}⁴ = <b>${n(answer)}</b>.`,
          'Compare that true light with how bright the galaxy looks, and the inverse square law gives its distance.'),
        v,
      };
    },
    verify: (p) => (p.v / 220) ** 4,
  },
  'ladder-error': {
    title: 'how errors stack up the ladder',
    make(r) {
      const a = pick(r, 0.5, 3, 0.5), b = pick(r, 1, 4, 0.5), c = pick(r, 1, 5, 0.5);
      const answer = Math.sqrt(a * a + b * b + c * c);
      return {
        q: `<p>Three rungs of the distance ladder have independent errors of ${a}%, ${b}% and ${c}%. Independent errors add "in quadrature": total = √(a² + b² + c²). What is the total error, in %?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Square each, add them, take the square root.',
        solution: steps(
          `${a}² + ${b}² + ${c}² = ${n(a * a)} + ${n(b * b)} + ${n(c * c)} = ${n(a * a + b * b + c * c)}.`,
          `√${n(a * a + b * b + c * c)} = <b>${n(answer)}%</b>.`,
          'The total is less than the plain sum, because independent errors partly cancel. The biggest one dominates, so it pays to improve the worst rung first.'),
        a, b, c,
      };
    },
    verify: (p) => Math.hypot(p.a, p.b, p.c),
  },
  'doppler-speed': {
    title: 'how fast is that galaxy moving?',
    make(r) {
      const obs = pick(r, 657.0, 680.0, 0.5);
      const z = obs / 656.3 - 1, answer = z * 299792;
      return {
        q: `<p>The hydrogen line that a lab measures at 656.3 nm shows up at ${obs} nm in the light of a galaxy. How fast is the galaxy moving away from us, in km/s? (Use the low-speed rule v = cz.)</p>`,
        answer, unit: 'km/s', tol: 0.01,
        hint: 'First find the redshift z = (observed − lab) ÷ lab. Then multiply by the speed of light, 299,792 km/s.',
        solution: steps(
          `z = (${obs} − 656.3) ÷ 656.3 = ${n(z, 4)}.`,
          `v = c z = 299,792 km/s × ${n(z, 4)} = <b>${n(answer, 4)} km/s</b>.`,
          'The line moved to longer (redder) wavelengths, so the galaxy is moving away.'),
        obs,
      };
    },
    verify: (p) => (p.obs / 656.3 - 1) * 299792,
  },
  'candle-distance': {
    title: 'distance from brightness',
    make(r) {
      const Lx = pick(r, 2, 50, 1), Fx = pick(r, 1, 9, 1);
      const L = Lx * P.L_SUN, F = Fx * 1e-9;
      const answer = P.distFromFlux(L, F) / P.LY;
      return {
        q: `<p>A star gives out ${Lx} times the Sun's power (the Sun: 3.83 × 10<sup>26</sup> W). Your telescope receives ${Fx} × 10<sup>−9</sup> W/m² from it. How far away is it, in light-years? (1 ly = 9.461 × 10<sup>15</sup> m.)</p>`,
        answer, unit: 'light-years', tol: 0.01,
        hint: 'Flux F = L ÷ (4πd²), so d = √(L ÷ (4πF)). Work in metres, then divide by one light-year.',
        solution: steps(
          `L = ${Lx} × 3.828 × 10<sup>26</sup> = ${n(L)} W.`,
          `d = √(${n(L)} ÷ (4π × ${Fx} × 10<sup>−9</sup>)) = ${n(answer * P.LY)} m.`,
          `d = ${n(answer * P.LY)} ÷ 9.461 × 10<sup>15</sup> = <b>${n(answer)} light-years</b>.`),
        L, F,
      };
    },
    verify: (p) => Math.sqrt(p.L / (4 * Math.PI * p.F)) / P.LY,
  },
  'scale-zoom': {
    title: 'how many Earths across the Sun?',
    make(r) {
      const list = [['Earths across the Sun', P.R_SUN * 2, P.R_EARTH * 2, 'the Sun (1.39 million km across)', 'the Earth (12,742 km across)'], ['Suns between the Sun and Earth', P.AU, P.R_SUN * 2, 'the Earth-Sun distance (149.6 million km)', 'the Sun (1.39 million km across)'], ['Earth-Moon distances to the Sun', P.AU, 3.844e8, 'the Earth-Sun distance (149.6 million km)', 'the Earth-Moon distance (384,400 km)']];
      const [what, big, small, bigT, smallT] = list[Math.floor(r() * list.length * 0.9999)];
      const answer = big / small;
      return {
        q: `<p>How many ${what}? Compare ${bigT} with ${smallT}.</p>`,
        answer, unit: 'times', tol: 0.02,
        hint: 'Divide the big length by the small one, in the same units.',
        solution: steps(`${n(big / 1000)} km ÷ ${n(small / 1000)} km = <b>${n(answer)}</b>.`),
        big, small,
      };
    },
    verify: (p) => p.big / p.small,
  },
};
