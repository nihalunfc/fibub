// Live problems for Gravitation.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const RE = 6400; // km, as exams round it

export default {
  'grav-g-height-depth': {
    title: 'g at a height or a depth',
    make(r) {
      const deep = r() < 0.5, x = deep ? pick(r, 400, 3200, 200) : pick(r, 400, 6400, 400), g0 = 9.8;
      const answer = deep ? g0 * (1 - x / RE) : g0 / (1 + x / RE) ** 2;
      return { deep, x, g0,
        q: `<p>Take g = 9.8 m/s² at the Earth's surface and the Earth's radius as 6400 km (a uniform sphere). What is g at a ${deep ? 'depth' : 'height'} of ${x} km ${deep ? 'below' : 'above'} the surface?</p>`,
        answer, unit: 'm/s²', tol: 0.01,
        hint: deep ? 'Inside a uniform Earth only the mass closer to the centre pulls, and g falls in a straight line: g(d) = g(1 − d/R).' : 'Outside, g falls as 1/r²: g(h) = g R²/(R + h)². Do not use 1 − 2h/R unless h is tiny.',
        solution: deep ? steps(`d/R = ${x}/6400 = ${n(x / RE)}.`, `g(d) = 9.8 × (1 − ${n(x / RE)}) = <b>${n(answer)} m/s²</b>.`)
          : steps(`r = R + h = ${RE + x} km, so R/r = ${n(RE / (RE + x), 4)}.`, `g(h) = 9.8 × ${n(RE / (RE + x), 4)}² = <b>${n(answer)} m/s²</b>.`) };
    },
    verify: (x) => { // from g = GM r / R³ inside and GM/r² outside, with GM = g0 R²
      const GM = x.g0 * RE * RE, r = x.deep ? RE - x.x : RE + x.x; return x.deep ? (GM * r) / RE ** 3 : GM / (r * r);
    },
  },
  'grav-escape-planet': {
    title: 'escape speed from another planet',
    make(r) {
      const fm = pick(r, 2, 12), fr = pick(r, 1.5, 4, 0.5), ve = 11.2;
      const answer = ve * Math.sqrt(fm / fr);
      return { fm, fr, ve,
        q: `<p>A planet has ${fm} times the Earth's mass and ${fr} times its radius. The escape speed from the Earth is 11.2 km/s. What is the escape speed from the planet?</p>`,
        answer, unit: 'km/s', tol: 0.01,
        hint: 'v_e = √(2GM/R), so v_e grows as √(M/R).',
        solution: steps(`v_e ∝ √(M/R), so v_planet/v_Earth = √(${fm}/${fr}) = ${n(Math.sqrt(fm / fr))}.`, `v_planet = 11.2 × ${n(Math.sqrt(fm / fr))} = <b>${n(answer)} km/s</b>.`) };
    },
    verify: (x) => { // via surface gravity: v_e = √(2 g R), with g ∝ M/R²
      const g = x.fm / x.fr ** 2, R = x.fr; return x.ve * Math.sqrt(g * R);
    },
  },
  'grav-satellite-period': {
    title: 'period of a satellite from Kepler\'s third law',
    make(r) {
      const k = pick(r, 2, 7, 0.5), T0 = 84.6; // minutes for an orbit skimming the surface
      const answer = T0 * k ** 1.5 / 60;
      return { k, T0,
        q: `<p>A satellite skimming the Earth's surface would take about 84.6 minutes per orbit. How long, in hours, does a satellite take whose orbit radius is ${k} times the Earth's radius?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Kepler\'s third law: T² ∝ r³, so T grows as r^(3/2).',
        solution: steps(`T/T₀ = (r/R)<sup>3/2</sup> = ${k}<sup>3/2</sup> = ${n(k ** 1.5)}.`, `T = 84.6 × ${n(k ** 1.5)} = ${n(T0 * k ** 1.5)} min = <b>${n(answer)} h</b>.`, k === 6.5 ? 'Close to 24 h: this is about where geostationary satellites sit (r ≈ 6.6 R).' : 'Geostationary satellites (24 h) sit at about 6.6 Earth radii.') };
    },
    verify: (x) => { // T = 2π r / v with v = √(GM/r); use units where GM and R make T0 come out right
      const R = 1, GM = (2 * Math.PI / x.T0) ** 2, r = x.k * R; return (2 * Math.PI * r) / Math.sqrt(GM / r) / 60;
    },
  },
};
