// Live problems for Fluids: pressure, flow, viscosity and surface tension.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;

export default {
  'fl-floating': {
    title: 'fraction of a floating block above the surface',
    make(r) {
      const rb = pick(r, 300, 900, 50), liq = r() < 0.5 ? ['water', 1000] : ['sea water', 1025];
      const answer = (1 - rb / liq[1]) * 100;
      return { rb, rl: liq[1],
        q: `<p>A block of density ${rb} kg/m³ floats in ${liq[0]} of density ${liq[1]} kg/m³. What percentage of its volume is above the surface?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Floating: weight = buoyant force, so ρ_block V g = ρ_liquid V_under g. The fraction under is ρ_block/ρ_liquid.',
        solution: steps(`Fraction under = ${rb}/${liq[1]} = ${n(rb / liq[1], 4)}.`, `Fraction above = 1 − ${n(rb / liq[1], 4)} = <b>${n(answer)}%</b>.`) };
    },
    verify: (x) => { // a 1 m³ block: mass, then volume of liquid it must push aside
      const m = x.rb, Vunder = m / x.rl; return (1 - Vunder) * 100;
    },
  },
  'fl-terminal': {
    title: 'terminal speed of a small sphere (Stokes\' law)',
    make(r) {
      const rmm = pick(r, 0.5, 2, 0.25), rs = pick(r, 2500, 8000, 500), eta = pick(r, 0.5, 2, 0.1), rl = 1260;
      const a = rmm / 1000, answer = ((2 * a * a * (rs - rl) * G) / (9 * eta)) * 100;
      return { rmm, rs, eta, rl,
        q: `<p>A metal ball of radius ${rmm} mm and density ${rs} kg/m³ falls through glycerine (density ${rl} kg/m³, viscosity ${eta} Pa s). What is its terminal speed in cm/s? (g = 9.8 m/s²)</p>`,
        answer, unit: 'cm/s', tol: 0.01,
        hint: 'At terminal speed, weight = buoyancy + viscous drag 6πηrv. This gives v = 2r²(ρ − σ)g/(9η), with ρ the ball density and σ the liquid density.',
        solution: steps(`r = ${a} m, ρ − σ = ${rs - rl} kg/m³.`, `v = 2 × ${a}² × ${rs - rl} × 9.8 / (9 × ${eta}) = ${n(answer / 100)} m/s.`, `v = <b>${n(answer)} cm/s</b>.`) };
    },
    verify: (x) => { // balance the forces directly
      const a = x.rmm / 1000, V = (4 / 3) * Math.PI * a ** 3, net = V * (x.rs - x.rl) * G; return (net / (6 * Math.PI * x.eta * a)) * 100;
    },
  },
  'fl-capillary': {
    title: 'height of water in a capillary tube',
    make(r) {
      const dmm = pick(r, 0.2, 2, 0.1), T = 0.072;
      const answer = ((4 * T) / (1000 * G * (dmm / 1000))) * 100;
      return { dmm, T,
        q: `<p>A clean glass tube of internal diameter ${dmm} mm is dipped in water (surface tension 0.072 N/m, contact angle 0°, density 1000 kg/m³). How high does the water rise, in cm? (g = 9.8 m/s²)</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'h = 2T cos θ/(ρ g r). Use the radius, which is half the diameter.',
        solution: steps(`r = ${dmm / 2} mm = ${n(dmm / 2000)} m; cos 0° = 1.`, `h = 2 × 0.072 / (1000 × 9.8 × ${n(dmm / 2000)}) = ${n(answer / 100)} m.`, `h = <b>${n(answer)} cm</b>. Halve the diameter and the rise doubles (h ∝ 1/r).`) };
    },
    verify: (x) => { // surface tension pull around the rim = weight of the column
      const rr = x.dmm / 2000, up = x.T * 2 * Math.PI * rr; return (up / (1000 * G * Math.PI * rr * rr)) * 100;
    },
  },
};
