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
  // ---------- Module 3: Einstein ----------
  'michelson-arm': {
    title: 'time light down an arm and back',
    make(r) {
      const L = pick(r, 3, 30, 1);
      const answer = 2 * L / P.C * 1e9;
      return {
        q: `<p>In a Michelson-style experiment, light runs along an arm ${L} m long, hits a mirror and comes back. How long does the round trip take, in <b>nanoseconds</b> (billionths of a second)? Use c = 3.00 × 10<sup>8</sup> m/s.</p>`,
        answer, unit: 'ns', tol: 0.01,
        hint: 'Time = distance ÷ speed. The light goes there and back, so the distance is 2 × the arm.',
        solution: steps(
          `Distance: 2 × ${L} m = ${2 * L} m.`,
          `Time: ${2 * L} ÷ 299,792,458 = ${n(2 * L / P.C)} s = <b>${n(answer)} ns</b>.`,
          'Michelson and Morley compared two such arms at right angles, to a tiny fraction of a wavelength. Turning the apparatus never changed the timing: light\'s speed did not depend on Earth\'s motion.'),
        L,
      };
    },
    verify: (p) => 2 * p.L / 299792458 * 1e9,
  },
  'twin-clock': {
    title: 'how much does the traveller age?',
    make(r) {
      const b = pick(r, 0.5, 0.99, 0.01), T = pick(r, 5, 40, 1);
      const g = P.gamma(b), answer = T / g;
      return {
        q: `<p>A spaceship travels at ${b} times the speed of light. On Earth, ${T} years pass during the trip. How many years pass on the ship's clock?</p>`,
        answer, unit: 'years', tol: 0.01,
        hint: 'Work out γ = 1 ÷ √(1 − v²/c²), then divide Earth\'s time by γ.',
        solution: steps(
          `v/c = ${b}, so v²/c² = ${n(b * b, 4)} and 1 − v²/c² = ${n(1 - b * b, 4)}.`,
          `γ = 1 ÷ √${n(1 - b * b, 4)} = ${n(g, 4)}.`,
          `Ship time = ${T} ÷ ${n(g, 4)} = <b>${n(answer)} years</b>. The traveller comes home younger than those who stayed.`),
        b, T,
      };
    },
    verify: (p) => p.T * Math.sqrt(1 - p.b * p.b),
  },
  'mc2-energy': {
    title: 'energy locked in a little mass',
    make(r) {
      const g = pick(r, 0.1, 5, 0.1);
      const answer = (g / 1000) * P.C * P.C;
      return {
        q: `<p>If ${g} grams of mass were turned completely into energy, how many joules would that be? (For scale, a 100-watt bulb uses 100 joules each second.)</p>`,
        answer, unit: 'J', tol: 0.01,
        hint: 'E = mc², with m in kilograms and c = 3.00 × 10⁸ m/s.',
        solution: steps(
          `m = ${g} g = ${n(g / 1000)} kg.`,
          `c² = (2.998 × 10<sup>8</sup>)² ≈ 8.99 × 10<sup>16</sup> m²/s².`,
          `E = ${n(g / 1000)} × 8.99 × 10<sup>16</sup> = <b>${n(answer)} J</b>: enough to run a 100-watt bulb for about ${n(answer / 100 / P.YEAR)} years.`),
        g,
      };
    },
    verify: (p) => p.g * 1e-3 * 299792458 ** 2,
  },
  'lift-light-drop': {
    title: 'how far does light fall across a lift?',
    make(r) {
      const L = pick(r, 2, 6, 0.5);
      const t = L / P.C, answer = 0.5 * 9.81 * t * t;
      return {
        q: `<p>A beam of light crosses a lift ${L} m wide while the lift accelerates upwards at 9.81 m/s² (like gravity). By the equivalence principle, light "falls" like a ball. How far does it drop while crossing, in metres?</p>`,
        answer, unit: 'm', tol: 0.02,
        hint: 'Time to cross: t = width ÷ c. Distance fallen: ½ g t².',
        solution: steps(
          `t = ${L} ÷ 2.998 × 10<sup>8</sup> = ${n(t)} s.`,
          `drop = ½ × 9.81 × (${n(t)})² = <b>${n(answer)} m</b>.`,
          'That is far smaller than an atomic nucleus, which is why nobody sees light bend in a lift. Near the Sun, over millions of kilometres, the bend is big enough to measure.'),
        L,
      };
    },
    verify: (p) => 4.905 * (p.L / 299792458) ** 2,
  },
  'tower-clock': {
    title: 'clocks run faster upstairs',
    make(r) {
      const h = pick(r, 10, 800, 10);
      const answer = P.gravShift(h) * P.YEAR * 1e9;
      return {
        q: `<p>One clock sits on the ground and an identical clock sits ${h} m higher, at the top of a tower. Near Earth, the higher clock runs faster by a fraction g h / c². How many <b>nanoseconds</b> does it gain in one year? (g = 9.81 m/s², one year = 3.156 × 10<sup>7</sup> s.)</p>`,
        answer, unit: 'ns', tol: 0.02,
        hint: 'Fraction = 9.81 × height ÷ c². Multiply by the seconds in a year, then by 10⁹ for nanoseconds.',
        solution: steps(
          `g h / c² = 9.81 × ${h} ÷ 8.988 × 10<sup>16</sup> = ${n(P.gravShift(h))}.`,
          `Gain per year: ${n(P.gravShift(h))} × 3.156 × 10<sup>7</sup> s = ${n(P.gravShift(h) * P.YEAR)} s = <b>${n(answer)} ns</b>.`,
          'Tiny, but modern atomic clocks can see the difference when one is lifted by just 30 centimetres.'),
        h,
      };
    },
    verify: (p) => 9.81 * p.h / 299792458 ** 2 * 365.25 * 86400 * 1e9,
  },
  'gps-error': {
    title: 'what if GPS ignored Einstein?',
    make(r) {
      const us = pick(r, 30, 45, 1);
      const answer = P.C * us * 1e-6 / 1000;
      return {
        q: `<p>Satellite clocks in GPS gain about ${us} microseconds a day compared with clocks on the ground (mostly because they are higher up, minus a little because they are moving). Your phone works out distance from light travel time. If nobody corrected this, how many <b>kilometres</b> of error would build up in one day?</p>`,
        answer, unit: 'km', tol: 0.01,
        hint: 'Distance error = speed of light × time error. 1 microsecond = 10⁻⁶ s.',
        solution: steps(
          `Time error: ${us} µs = ${n(us * 1e-6)} s.`,
          `Distance error: 2.998 × 10<sup>8</sup> m/s × ${n(us * 1e-6)} s = ${n(P.C * us * 1e-6)} m = <b>${n(answer)} km</b>.`,
          'Maps would drift by kilometres every day. GPS satellite clocks are tuned slightly slow before launch to cancel it.'),
        us,
      };
    },
    verify: (p) => 299792.458 * p.us * 1e-6,
  },
  'schwarzschild': {
    title: 'how big is a black hole?',
    make(r) {
      const opts = [[1, 'the Sun (if it were squeezed)'], [10, 'a typical stellar black hole'], [36, 'one of the first pair LIGO heard'], [4.3e6, 'Sagittarius A*, at the centre of the Milky Way'], [6.5e9, 'M87*, the first black hole imaged']];
      const [m, name] = opts[Math.floor(r() * opts.length)];
      const answer = P.schwarzschild(m * P.M_SUN) / 1000;
      return {
        q: `<p>The event horizon of a non-spinning black hole has radius r = 2GM / c². What is r, in <b>kilometres</b>, for ${name}, with a mass of ${n(m)} Suns? (One Sun = 1.989 × 10<sup>30</sup> kg, G = 6.674 × 10<sup>−11</sup>.)</p>`,
        answer, unit: 'km', tol: 0.01,
        hint: 'For one Sun, r ≈ 2.95 km. The radius grows in proportion to the mass.',
        solution: steps(
          `M = ${n(m)} × 1.989 × 10<sup>30</sup> = ${n(m * P.M_SUN)} kg.`,
          `r = 2 × 6.674 × 10<sup>−11</sup> × ${n(m * P.M_SUN)} ÷ (2.998 × 10<sup>8</sup>)² = ${n(answer * 1000)} m.`,
          `So r ≈ <b>${n(answer)} km</b>. Shortcut: about 2.95 km per Sun of mass.`),
        m,
      };
    },
    verify: (p) => 2.953 * p.m,
  },
  'light-bend': {
    title: 'how much does a star bend light?',
    make(r) {
      const m = pick(r, 0.5, 10, 0.5), R = pick(r, 0.5, 8, 0.5);
      const answer = P.deflectionArcsec(m * P.M_SUN, R * P.R_SUN);
      return {
        q: `<p>Light grazing the edge of the Sun is bent by 1.75 arcseconds. The bend is 4GM / (c² b): it grows with the mass M and shrinks with the distance b of closest approach. A star has ${m} times the Sun's mass and ${R} times its radius. How many arcseconds is light grazing its edge bent?</p>`,
        answer, unit: 'arcsec', tol: 0.01,
        hint: 'Scale the Sun\'s 1.75″ by (mass ratio) ÷ (radius ratio).',
        solution: steps(
          `Mass ratio ÷ radius ratio = ${m} ÷ ${R} = ${n(m / R, 4)}.`,
          `Bend ≈ 1.75″ × ${n(m / R, 4)} = <b>${n(answer)}″</b>.`,
          'Even for a heavy star the bend is tiny. A whole galaxy or cluster bends light enough to make arcs and rings.'),
        m, R,
      };
    },
    verify: (p) => 1.7512 * p.m / p.R,
  },
  'ligo-strain': {
    title: 'how much does LIGO\'s arm stretch?',
    make(r) {
      const k = pick(r, 0.5, 5, 0.5);
      const h = k * 1e-21, answer = h * 4000;
      return {
        q: `<p>A gravitational wave with strain h = ${k} × 10<sup>−21</sup> passes through LIGO. Strain is the fractional change in length. LIGO's arms are 4 km long. By how many metres does an arm change?</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'Change in length = strain × length, with the length in metres.',
        solution: steps(
          `Length: 4 km = 4,000 m.`,
          `Change: ${k} × 10<sup>−21</sup> × 4,000 = <b>${n(answer)} m</b>.`,
          `A proton is about 1.7 × 10<sup>−15</sup> m across, so this is about ${n(1.7e-15 / answer)} times smaller than a proton.`),
        k,
      };
    },
    verify: (p) => p.k * 4e-18,
  },
  // ---------- Module 4 ----------
  'slipher-speed': {
    title: 'how fast is the galaxy moving?',
    make(r) {
      const lines = [[656.3, 'hydrogen (Hα)'], [589.3, 'sodium'], [393.4, 'calcium (K)']];
      const [lab, name] = lines[Math.floor(r() * lines.length)];
      const v = pick(r, 300, 1800, 50) * (r() < 0.15 ? -1 : 1);
      const obs = +(lab * (1 + v / 299792.458)).toFixed(2);
      const answer = 299792.458 * (obs - lab) / lab;
      return {
        q: `<p>In the lab, the ${name} line is at ${lab} nm. In a galaxy's spectrum the same line is at ${obs} nm. How fast is the galaxy moving along our line of sight, in km/s? (Use a minus sign if it is coming towards us. Light: 299,792 km/s.)</p>`,
        answer, unit: 'km/s', tol: 0.02,
        hint: 'Redshift z = (observed − lab) ÷ lab. For small speeds, speed = z × the speed of light.',
        solution: steps(
          `Shift: ${obs} − ${lab} = ${n(obs - lab, 3)} nm.`,
          `z = ${n(obs - lab, 3)} ÷ ${lab} = ${n((obs - lab) / lab, 3)}.`,
          `Speed = z × 299,792 km/s = <b>${n(answer)} km/s</b>${answer < 0 ? ': it is coming towards us, like Andromeda' : ': moving away'}.`),
        lab, obs,
      };
    },
    verify: (p) => 299792.458 * (p.obs / p.lab - 1),
  },
  'hubble-distance': {
    title: 'distance from speed',
    make(r) {
      const v = pick(r, 1500, 30000, 500), H0 = pick(r, 67, 73, 1);
      const answer = v / H0;
      return {
        q: `<p>A galaxy is moving away at ${v.toLocaleString('en-CA')} km/s. Take the Hubble constant as H₀ = ${H0} km/s per megaparsec. How far away is it, in megaparsecs (Mpc)?</p>`,
        answer, unit: 'Mpc', tol: 0.01,
        hint: 'Hubble\'s law is v = H₀ × d, so d = v ÷ H₀.',
        solution: steps(
          `d = v ÷ H₀ = ${v.toLocaleString('en-CA')} ÷ ${H0}.`,
          `d = <b>${n(answer)} Mpc</b>.`,
          `One Mpc is 3.26 million light-years, so that is about ${n(answer * 3.2616)} million light-years.`),
        v, H0,
      };
    },
    verify: (p) => p.v / p.H0,
  },
  'raisin-speeds': {
    title: 'raisins in rising dough',
    make(r) {
      const T = pick(r, 1, 3, 0.5), d = pick(r, 1, 6, 1);
      const answer = d / T;
      return {
        q: `<p>A loaf's dough doubles every distance in ${T} hour${T === 1 ? '' : 's'} as it rises evenly. A raisin starts ${d} cm from the raisin you sit on. At what average speed, in cm per hour, does it move away from you while the dough doubles?</p>`,
        answer, unit: 'cm/h', tol: 0.01,
        hint: 'Doubling turns a gap of d into 2d, so the raisin moves d further in that time.',
        solution: steps(
          `Its distance grows from ${d} cm to ${2 * d} cm: it moves ${d} cm further.`,
          `Speed = ${d} cm ÷ ${T} h = <b>${n(answer)} cm/h</b>.`,
          `A raisin twice as far away moves twice as fast. Speed in proportion to distance is Hubble's law.`),
        T, d,
      };
    },
    verify: (p) => p.d / p.T,
  },
  'balloon-dots': {
    title: 'dots on a growing balloon',
    make(r) {
      const R1 = pick(r, 5, 10, 1), f = pick(r, 1.5, 4, 0.5), s = pick(r, 2, 8, 1);
      const R2 = R1 * f, answer = s * f;
      return {
        q: `<p>Two ink dots are ${s} cm apart, measured along the rubber, on a balloon of radius ${R1} cm. You blow it up to radius ${n(R2)} cm. How far apart are the dots now, along the rubber, in cm?</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'Every distance on the surface grows by the same factor as the radius.',
        solution: steps(
          `The radius grew by ${n(R2)} ÷ ${R1} = ${f} times.`,
          `So every gap grew ${f} times: ${s} × ${f} = <b>${n(answer)} cm</b>.`,
          'The dots did not crawl over the rubber. The rubber between them stretched, just as space stretches between galaxies.'),
        s, f,
      };
    },
    verify: (p) => p.s * p.f,
  },
  'stretch-factor': {
    title: 'how much smaller was the universe?',
    make(r) {
      const z = pick(r, 1, 10, 0.5), obs = +(121.6 * (1 + z)).toFixed(1);
      const answer = obs / 121.6;
      return {
        q: `<p>Hydrogen gives out ultraviolet light at 121.6 nm. In a distant galaxy this line is seen at ${obs} nm. How many times bigger is the universe now than when this light set out?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'The wavelength stretches by exactly as much as space did: 1 + z = observed ÷ emitted.',
        solution: steps(
          `Stretch: ${obs} ÷ 121.6 = ${n(answer, 4)}.`,
          `So 1 + z = ${n(answer, 4)} (z ≈ ${n(answer - 1, 3)}): the universe is <b>${n(answer)} times</b> bigger now.`,
          `When the light left, every distance between galaxies was 1/${n(answer, 3)} of today's.`),
        obs,
      };
    },
    verify: (p) => p.obs / 121.6,
  },
  'rewind-time': {
    title: 'run the film backwards',
    make(r) {
      const d = pick(r, 10, 200, 10), H = pick(r, 60, 80, 1);
      const v = d * H, answer = (d * 3.0857e19) / v / 3.15576e16;
      return {
        q: `<p>A galaxy is ${d} Mpc away and moving away at ${v.toLocaleString('en-CA')} km/s. If it had always moved at this speed, how many <b>billion years</b> ago were we together? (1 Mpc = 3.086 × 10<sup>19</sup> km; 1 billion years = 3.156 × 10<sup>16</sup> s.)</p>`,
        answer, unit: 'billion years', tol: 0.01,
        hint: 'Time = distance ÷ speed. Put the distance in km so the units match km/s.',
        solution: steps(
          `Distance: ${d} × 3.086 × 10<sup>19</sup> = ${n(d * 3.0857e19)} km.`,
          `Time = ${n(d * 3.0857e19)} ÷ ${v.toLocaleString('en-CA')} = ${n(answer * 3.15576e16)} s.`,
          `÷ 3.156 × 10<sup>16</sup> = <b>${n(answer)} billion years</b>. Try another galaxy: the answer is the same for every one, because speed is proportional to distance.`),
        H,
      };
    },
    verify: (p) => 977.79 / p.H,
  },
  'hubble-time': {
    title: 'the age of a matter-only universe',
    make(r) {
      const H0 = pick(r, 50, 90, 1);
      const tH = 977.79 / H0, answer = (2 / 3) * tH;
      return {
        q: `<p>The Hubble time is 1/H₀, which works out as 977.8 ÷ H₀ billion years when H₀ is in km/s/Mpc. A universe of matter alone, slowed by its own gravity, is 2/3 of its Hubble time old. With H₀ = ${H0}, how old is such a universe, in billion years?</p>`,
        answer, unit: 'billion years', tol: 0.01,
        hint: 'First the Hubble time, 977.8 ÷ H₀, then take two-thirds of it.',
        solution: steps(
          `Hubble time: 977.8 ÷ ${H0} = ${n(tH)} billion years.`,
          `Two-thirds of it: <b>${n(answer)} billion years</b>.`,
          `${answer < 12.5 ? 'That is younger than the oldest stars, about 12 to 13 billion years old: the "age problem" of the 1990s, solved by dark energy.' : 'Older than the oldest stars, but only because H₀ is set low here; measured values (67 to 73) give 9 to 10 billion years.'}`),
        H0,
      };
    },
    verify: (p) => (2 / 3) * P.hubbleTimeGyr(p.H0),
  },
  'box-scatter': {
    title: 'how smooth is a random scatter?',
    make(r) {
      const N = [25, 100, 400, 2500, 10000, 40000][Math.floor(r() * 6)];
      const answer = 100 / Math.sqrt(N);
      return {
        q: `<p>Galaxies scattered at random fill boxes with ${N.toLocaleString('en-CA')} galaxies each on average. By chance alone, a typical box differs from the average by about √N galaxies. What percentage of the average is that?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Work out √N, then divide by N and multiply by 100.',
        solution: steps(
          `√${N.toLocaleString('en-CA')} = ${n(Math.sqrt(N))} galaxies.`,
          `${n(Math.sqrt(N))} ÷ ${N.toLocaleString('en-CA')} × 100 = <b>${n(answer)}%</b>.`,
          'Bigger boxes hold more galaxies, so they come out more alike. Real galaxies clump, so they need even bigger boxes (hundreds of millions of light-years) to look smooth.'),
        N,
      };
    },
    verify: (p) => 100 / Math.sqrt(p.N),
  },
};
