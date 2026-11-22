// Live problems for Electromagnetic induction.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'emi-terminal': {
    title: 'terminal speed of a rod pulled on rails',
    make(r) {
      const F = pick(r, 0.2, 2, 0.1), B = pick(r, 0.2, 1.5, 0.1), l = pick(r, 0.2, 1, 0.1), R = pick(r, 0.5, 5, 0.5), m = pick(r, 0.05, 0.5, 0.05);
      const answer = (F * R) / (B * B * l * l);
      return { F, B, l, R, m,
        q: `<p>A rod of mass ${m} kg slides without friction on two horizontal rails ${l} m apart, joined at one end by a ${R} Ω resistor. A uniform vertical field of ${B} T fills the region. A constant force of ${F} N pulls the rod. What speed does it finally reach, in m/s?</p>`,
        answer, unit: 'm/s', tol: 0.005,
        hint: 'emf = Blv, current = Blv/R, opposing force = BIl = B²l²v/R. At the terminal speed this equals F. The mass only decides how long it takes.',
        solution: steps(`At terminal speed: F = B²l²v/R.`, `v = FR/(B²l²) = ${F} × ${R} / (${B}² × ${l}²).`, `v = <b>${n(answer)} m/s</b>. Check by power: F·v = (Blv)²/R.`) };
    },
    verify: (x) => { // integrate m dv/dt = F − B²l²v/R for many time constants
      const k = (x.B * x.B * x.l * x.l) / x.R, tau = x.m / k, dt = tau / 200; let v = 0;
      for (let i = 0; i < 4000; i++) v += ((x.F - k * v) / x.m) * dt;
      return v;
    },
  },
  'emi-lr': {
    title: 'current in an LR circuit after switching on',
    make(r) {
      const E = pick(r, 6, 24, 2), R = pick(r, 2, 20, 2), L = pick(r, 0.1, 2, 0.1), t = pick(r, 0.01, 0.3, 0.01);
      const answer = (E / R) * (1 - Math.exp((-R * t) / L));
      return { E, R, L, t,
        q: `<p>A ${L} H inductor and a ${R} Ω resistor are joined in series to a ${E} V battery with negligible internal resistance. What is the current ${t} s after the switch is closed, in A?</p>`,
        answer, unit: 'A', tol: 0.005,
        hint: 'The current grows as I = (E/R)(1 − e^(−t/τ)) with time constant τ = L/R.',
        solution: steps(`Final current E/R = ${E}/${R} = ${n(E / R, 4)} A; τ = L/R = ${L}/${R} = ${n(L / R, 4)} s.`, `I = ${n(E / R, 4)} × (1 − e^(−${t}/${n(L / R, 4)})).`, `I = <b>${n(answer)} A</b>.`) };
    },
    verify: (x) => { // step L dI/dt = E − IR
      const N = 20000, dt = x.t / N; let I = 0;
      for (let i = 0; i < N; i++) { const k1 = (x.E - I * x.R) / x.L, k2 = (x.E - (I + k1 * dt) * x.R) / x.L; I += 0.5 * (k1 + k2) * dt; }
      return I;
    },
  },
  'emi-charge': {
    title: 'charge that flows when a coil is flipped',
    make(r) {
      const N = pick(r, 10, 200, 10), A = pick(r, 10, 100, 10), B = pick(r, 0.1, 1, 0.1), R = pick(r, 5, 50, 5), flip = r() < 0.5;
      const dPhi = N * B * A * 1e-4 * (flip ? 2 : 1), answer = (dPhi / R) * 1e6;
      return { N, A, B, R, flip,
        q: `<p>A coil of ${N} turns and area ${A} cm² lies with its plane perpendicular to a ${B} T field. Its total resistance is ${R} Ω. It is ${flip ? 'turned over through 180°' : 'pulled right out of the field'}. How much charge flows round it, in µC?</p>`,
        answer, unit: 'µC', tol: 0.005,
        hint: 'Charge = (change in flux linkage)/R, whatever the speed. Turning over reverses the flux, so the change is 2NBA.',
        solution: steps(`Change in flux linkage = ${flip ? '2' : '1'} × ${N} × ${B} × ${A} × 10⁻⁴ = ${n(dPhi)} Wb.`, `q = ΔΦ/R = ${n(dPhi)}/${R}.`, `q = <b>${n(answer)} µC</b>. A slower movement gives a smaller current for longer, and the same charge.`) };
    },
    verify: (x) => { // flip at steady rate: emf(t) = N B A ω sin ωt over half a turn (or a linear fall), integrate I dt
      const NBA = x.N * x.B * x.A * 1e-4, steps2 = 5000; let q = 0;
      for (let i = 0; i < steps2; i++) { const th = ((i + 0.5) / steps2) * Math.PI; q += x.flip ? (NBA * Math.sin(th) * (Math.PI / steps2)) / x.R : NBA / steps2 / x.R; }
      return q * 1e6;
    },
  },
};
