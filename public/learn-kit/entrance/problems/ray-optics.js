// Live problems for Ray optics and optical instruments.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const D = Math.PI / 180;

export default {
  'ro-lens-image': {
    title: 'image distance for a convex lens',
    make(r) {
      const f = pick(r, 10, 30, 5), u = pick(r, f + 5, f + 60, 5);
      const answer = (u * f) / (u - f);
      return { f, u,
        q: `<p>An object stands ${u} cm in front of a convex lens of focal length ${f} cm. How far behind the lens is the image, in cm?</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'Lens formula with signs: 1/v − 1/u = 1/f, with u = −' + u + ' cm and f = +' + f + ' cm.',
        solution: steps(`1/v = 1/f + 1/u = 1/${f} − 1/${u}.`, `v = ${u} × ${f}/(${u} − ${f}) = <b>${n(answer)} cm</b> (positive: a real image on the far side).`, `Magnification m = v/u = −${n(answer / u)}: inverted.`) };
    },
    verify: (x) => x.f + (x.f * x.f) / (x.u - x.f), // Newton's form: (u − f)(v − f) = f²
  },
  'ro-apparent-depth': {
    title: 'how much a coin in water seems to rise',
    make(r) {
      const d = pick(r, 10, 100, 5), mu = [1.33, 1.5, 1.6, 1.25, 2.42][Math.floor(r() * 5)];
      const answer = d * (1 - 1 / mu);
      return { d, mu,
        q: `<p>A coin lies at the bottom of a tank filled to ${d} cm with a liquid of refractive index ${mu}. Looking straight down, by how much does the coin appear to be raised, in cm?</p>`,
        answer, unit: 'cm', tol: 0.005,
        hint: 'For near-normal viewing, apparent depth = real depth/μ. The shift is the difference.',
        solution: steps(`Apparent depth = ${d}/${mu} = ${n(d / mu, 4)} cm.`, `Shift = ${d} − ${n(d / mu, 4)} = d(1 − 1/μ) = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { // trace a ray close to the normal and extend the refracted ray back to the vertical
      const i = 0.001, rr = Math.asin(x.mu * Math.sin(i)), along = x.d * Math.tan(i); return x.d - along / Math.tan(rr);
    },
  },
  'ro-prism': {
    title: 'refractive index of a prism from minimum deviation',
    make(r) {
      const A = [30, 45, 60][Math.floor(r() * 3)], dm = pick(r, Math.round(A * 0.5), Math.round(A * 0.8));
      const answer = Math.sin(((A + dm) / 2) * D) / Math.sin((A / 2) * D);
      return { A, dm,
        q: `<p>A prism with refracting angle ${A}° gives a minimum deviation of ${dm}°. What is its refractive index?</p>`,
        answer, unit: '', tol: 0.003,
        hint: 'At minimum deviation the ray passes symmetrically: r = A/2 and i = (A + δ<sub>m</sub>)/2. Then μ = sin i / sin r.',
        solution: steps(`i = (${A} + ${dm})/2 = ${(A + dm) / 2}°, r = ${A / 2}°.`, `μ = sin ${(A + dm) / 2}° / sin ${A / 2}° = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // find μ whose deviation curve has its minimum at δm (scan incidence angles, bisect on μ)
      const minDev = (mu) => { let best = 1e9; for (let i = 1; i < 90; i += 0.05) { const r1 = Math.asin(Math.sin(i * D) / mu), r2 = x.A * D - r1; const s = mu * Math.sin(r2); if (Math.abs(s) >= 1) continue; const dev = i * D + Math.asin(s) - x.A * D; if (dev < best) best = dev; } return best / D; };
      let lo = 1.0001, hi = 3; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; minDev(mid) < x.dm ? (lo = mid) : (hi = mid); }
      return (lo + hi) / 2;
    },
  },
};
