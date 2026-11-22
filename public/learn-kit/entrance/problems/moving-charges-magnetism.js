// Live problems for Moving charges and magnetic fields.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const QE = 1.6e-19, MP = 1.67e-27, MU0 = 4 * Math.PI * 1e-7;
const PARTS = [['a proton', 1, 1], ['a deuteron', 2, 1], ['an alpha particle', 4, 2]];

export default {
  'mc-radius': {
    title: 'radius of a charged particle in a magnetic field',
    make(r) {
      const i = Math.floor(r() * 3), [name, A, Z] = PARTS[i], V = pick(r, 1, 20), B = pick(r, 0.1, 1, 0.1);
      const m = A * MP, q = Z * QE, v = Math.sqrt((2 * q * V * 1e3) / m), answer = ((m * v) / (q * B)) * 100;
      return { i, V, B,
        q: `<p>${name[0].toUpperCase() + name.slice(1)} starts from rest, is accelerated through ${V} kV and then enters a uniform magnetic field of ${B} T at right angles. What is the radius of its path, in cm? (m<sub>p</sub> = 1.67 × 10⁻²⁷ kg, e = 1.6 × 10⁻¹⁹ C; take its mass as ${A} m<sub>p</sub> and charge ${Z}e)</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'Energy gained qV = ½mv² gives v. The magnetic force supplies the centripetal force: qvB = mv²/r, so r = mv/(qB) = √(2mV/q)/B.',
        solution: steps(`v = √(2qV/m) = √(2 × ${Z} × 1.6 × 10⁻¹⁹ × ${V * 1e3} / (${A} × 1.67 × 10⁻²⁷)) = ${n(v)} m/s.`, `r = mv/(qB) = ${A} × 1.67 × 10⁻²⁷ × ${n(v)} / (${Z} × 1.6 × 10⁻¹⁹ × ${B}).`, `r = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { // r = v/ω with the cyclotron angular frequency ω = qB/m
      const [, A, Z] = PARTS[x.i], m = A * MP, q = Z * QE, v = Math.sqrt((2 * q * x.V * 1e3) / m);
      return (v / ((q * x.B) / m)) * 100;
    },
  },
  'mc-wires-force': {
    title: 'force between two parallel currents',
    make(r) {
      const I1 = pick(r, 1, 20), I2 = pick(r, 1, 20), d = pick(r, 1, 20), same = r() < 0.5;
      const answer = (MU0 * I1 * I2) / (2 * Math.PI * d * 1e-2) * 1e6;
      return { I1, I2, d,
        q: `<p>Two long straight parallel wires ${d} cm apart carry ${I1} A and ${I2} A in ${same ? 'the same direction' : 'opposite directions'}. What is the force on each metre of either wire, in µN? (μ₀ = 4π × 10⁻⁷ T m/A)</p>`,
        answer, unit: 'µN', tol: 0.005,
        hint: 'Force per metre F/L = μ₀I₁I₂/(2πd). Currents in the same direction attract; opposite currents repel.',
        solution: steps(`F/L = 2 × 10⁻⁷ × ${I1} × ${I2} / (${d} × 10⁻²).`, `F/L = <b>${n(answer)} µN per metre</b>, ${same ? 'attractive' : 'repulsive'}.`, 'Both wires feel the same size of force (Newton\'s third law), even if the currents differ.') };
    },
    verify: (x) => { const B = (MU0 * x.I1) / (2 * Math.PI * x.d * 1e-2); return B * x.I2 * 1 * 1e6; }, // field of wire 1, then F = BIL on wire 2
  },
  'mc-shunt': {
    title: 'shunt to turn a galvanometer into an ammeter',
    make(r) {
      const G = pick(r, 10, 100, 5), Ig = pick(r, 1, 10), I = pick(r, 1, 10);
      const answer = ((Ig * 1e-3 * G) / (I - Ig * 1e-3)) * 1e3;
      return { G, Ig, I,
        q: `<p>A galvanometer of resistance ${G} Ω gives full-scale deflection at ${Ig} mA. What shunt resistance, in mΩ, turns it into an ammeter reading up to ${I} A?</p>`,
        answer, unit: 'mΩ', tol: 0.005,
        hint: 'The shunt is in parallel, so the voltage across it equals the voltage across the galvanometer: I<sub>g</sub>G = (I − I<sub>g</sub>)S.',
        solution: steps(`Current through the shunt = ${I} − ${Ig / 1000} = ${n(I - Ig / 1000, 5)} A.`, `S = I<sub>g</sub>G/(I − I<sub>g</sub>) = ${Ig / 1000} × ${G} / ${n(I - Ig / 1000, 5)} = ${n(answer / 1000)} Ω.`, `S = <b>${n(answer)} mΩ</b>. The ammeter's resistance is then about S, very small, as an ammeter should be.`) };
    },
    verify: (x) => (x.G / (x.I / (x.Ig * 1e-3) - 1)) * 1e3,
  },
};
