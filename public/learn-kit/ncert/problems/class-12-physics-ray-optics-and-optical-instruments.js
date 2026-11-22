// Class 12 Physics, Chapter 9 Ray Optics and Optical Instruments: live problems (original fibub questions). Ids start with c12p-ray-.
import { pick, choose, n, steps } from './_util.js';

const D = (x) => (x * 180) / Math.PI, Rd = (x) => (x * Math.PI) / 180;
export default {
  'c12p-ray-mirror': {
    title: 'image distance for a concave mirror',
    make(r) {
      const f = choose(r, [10, 12, 15, 20]), u = choose(r, [25, 30, 40, 50, 60]);
      const inv = 1 / -f - 1 / -u, vv = 1 / inv; // 1/v + 1/u = 1/f with f = -f, u = -u
      const vcm = Math.abs(vv);
      return { f, u, q: `<p>An object is placed ${u} cm in front of a concave mirror of focal length ${f} cm. How far from the mirror is the image? (Give the distance as a positive number.)</p>`, answer: vcm, unit: 'cm', tol: 0.01,
        hint: 'New Cartesian signs: u = −' + u + ' cm, f = −' + f + ' cm. Use 1/v + 1/u = 1/f.',
        solution: steps(`1/v = 1/f − 1/u = 1/(−${f}) − 1/(−${u}) = ${n(inv, 4)} cm⁻¹.`, `v = ${n(vv)} cm: the image is real, <b>${n(vcm)} cm</b> in front of the mirror.`) };
    },
    verify: (x) => (x.u * x.f) / (x.u - x.f),
  },
  'c12p-ray-lens': {
    title: 'image from a thin lens',
    make(r) {
      const kind = choose(r, ['convex', 'concave']), F = choose(r, [10, 15, 20, 25]), u = choose(r, [30, 40, 50, 60]), f = kind === 'convex' ? F : -F;
      const v = 1 / (1 / f + 1 / -u);
      return { kind, F, u, q: `<p>An object is ${u} cm from a ${kind} lens of focal length ${F} cm. Find the image distance (with sign, in the New Cartesian convention: positive means on the far side of the lens).</p>`, answer: v, unit: 'cm', tol: 0.01, abs: 0.01,
        hint: `f = ${f > 0 ? '+' : '−'}${F} cm, u = −${u} cm. Lens formula 1/v − 1/u = 1/f.`,
        solution: steps(`1/v = 1/f + 1/u = 1/(${f}) + 1/(−${u}) = ${n(1 / v, 4)} cm⁻¹.`, `v = <b>${n(v)} cm</b> (${v > 0 ? 'real image on the far side' : 'virtual image on the object side'}).`) };
    },
    verify: (x) => { const f = x.kind === 'convex' ? x.F : -x.F, u = -x.u; return (u * f) / (u + f); },
  },
  'c12p-ray-snell': {
    title: 'refractive index from Snell’s law',
    make(r) {
      const i = choose(r, [30, 40, 45, 50, 60]), nn = choose(r, [1.33, 1.5, 1.6, 1.7]), rr = D(Math.asin(Math.sin(Rd(i)) / nn));
      return { i, nn, rr: Math.round(rr * 100) / 100, q: `<p>A ray in air strikes a glass plate at an angle of incidence of ${i}°. The angle of refraction is ${n(Math.round(rr * 100) / 100, 4)}°. Find the refractive index of the glass.</p>`, answer: Math.sin(Rd(i)) / Math.sin(Rd(Math.round(rr * 100) / 100)), unit: '', tol: 0.01, hint: 'n = sin i / sin r.',
        solution: steps(`n = sin ${i}° / sin ${n(Math.round(rr * 100) / 100, 4)}°.`, `n = <b>${n(Math.sin(Rd(i)) / Math.sin(Rd(Math.round(rr * 100) / 100)))}</b>.`) };
    },
    verify: (x) => x.nn,
  },
  'c12p-ray-critical': {
    title: 'critical angle',
    make(r) {
      const nn = choose(r, [1.33, 1.5, 1.6, 1.8, 2.42]), ang = D(Math.asin(1 / nn));
      return { nn, q: `<p>Light travels from a medium of refractive index ${nn} into air. Find the critical angle for total internal reflection.</p>`, answer: ang, unit: '°', tol: 0.01, hint: 'sin θ<sub>c</sub> = 1/n.',
        solution: steps(`sin θ<sub>c</sub> = 1/${nn} = ${n(1 / nn, 4)}.`, `θ<sub>c</sub> = <b>${n(ang)}°</b>.`) };
    },
    verify: (x) => D(Math.atan(1 / Math.sqrt(x.nn * x.nn - 1))),
  },
  'c12p-ray-depth': {
    title: 'apparent depth',
    make(r) {
      const d = choose(r, [0.6, 1.2, 1.5, 2, 3, 4]), nn = choose(r, [1.33, 1.5]), a = d / nn;
      return { d, nn, q: `<p>A swimming pool is ${d} m deep (water, n = ${nn}). How deep does the bottom look when viewed from directly above?</p>`, answer: a, unit: 'm', tol: 0.01, hint: 'Apparent depth = real depth / n.',
        solution: steps(`Apparent depth = ${d} ÷ ${nn}.`, `= <b>${n(a)} m</b>.`) };
    },
    verify: (x) => x.d * (1 / x.nn),
  },
  'c12p-ray-lensmaker': {
    title: 'focal length from the lens maker’s formula',
    make(r) {
      const nn = choose(r, [1.5, 1.52, 1.6, 1.7]), R = choose(r, [10, 15, 20, 30]), f = 1 / ((nn - 1) * (2 / R));
      return { nn, R, q: `<p>A biconvex lens is made of glass of refractive index ${nn}, and both faces have a radius of curvature of ${R} cm. Find its focal length in air.</p>`, answer: f, unit: 'cm', tol: 0.01, hint: '1/f = (n − 1)(1/R₁ − 1/R₂) with R₁ = +R and R₂ = −R.',
        solution: steps(`1/f = (${nn} − 1)(1/${R} + 1/${R}) = ${n(nn - 1)} × ${n(2 / R, 4)}.`, `f = <b>${n(f)} cm</b>.`) };
    },
    verify: (x) => x.R / (2 * (x.nn - 1)),
  },
  'c12p-ray-prism': {
    title: 'refractive index from minimum deviation',
    make(r) {
      const A = choose(r, [50, 60, 60, 70]), nn = choose(r, [1.5, 1.52, 1.6, 1.66]);
      const Dm = Math.round((2 * D(Math.asin(nn * Math.sin(Rd(A / 2)))) - A) * 10) / 10, ans = Math.sin(Rd((A + Dm) / 2)) / Math.sin(Rd(A / 2));
      return { A, Dm, q: `<p>A prism of angle ${A}° gives a minimum deviation of ${n(Dm, 4)}°. Find the refractive index of its glass.</p>`, answer: ans, unit: '', tol: 0.01, hint: 'n = sin((A + D<sub>m</sub>)/2) / sin(A/2).',
        solution: steps(`(A + D<sub>m</sub>)/2 = (${A} + ${n(Dm, 4)})/2 = ${n((A + Dm) / 2, 4)}°.`, `n = sin ${n((A + Dm) / 2, 4)}° / sin ${A / 2}° = <b>${n(ans)}</b>.`) };
    },
    verify: (x) => Math.cos(Rd(x.Dm / 2)) + Math.sin(Rd(x.Dm / 2)) / Math.tan(Rd(x.A / 2)),
  },
  'c12p-ray-power': {
    title: 'two thin lenses in contact',
    make(r) {
      const f1 = choose(r, [10, 20, 25, 50]), f2 = choose(r, [-20, -25, -50, 15, 30]), P = 100 / f1 + 100 / f2;
      return { f1, f2, q: `<p>Two thin lenses of focal lengths ${f1} cm and ${f2} cm are placed in contact. Find the power of the combination in dioptres.</p>`, answer: P, unit: 'D', tol: 0.01, abs: 0.01, hint: 'Powers add: P = P₁ + P₂, with P = 1/f (f in metres).',
        solution: steps(`P₁ = 100/${f1} = ${n(100 / f1)} D, P₂ = 100/(${f2}) = ${n(100 / f2)} D.`, `P = P₁ + P₂ = <b>${n(P)} D</b>.`) };
    },
    verify: (x) => 100 / ((x.f1 * x.f2) / (x.f1 + x.f2)),
  },
  'c12p-ray-telescope': {
    title: 'astronomical telescope',
    make(r) {
      const fo = choose(r, [80, 100, 120, 150]), fe = choose(r, [2, 4, 5, 10]), ask = choose(r, ['m', 'L']);
      if (ask === 'm') return { fo, fe, ask, q: `<p>A refracting telescope has an objective of focal length ${fo} cm and an eyepiece of focal length ${fe} cm. What is its angular magnification in normal adjustment?</p>`, answer: fo / fe, unit: '', tol: 0.01, hint: 'm = f<sub>o</sub>/f<sub>e</sub>.', solution: steps(`m = ${fo}/${fe}.`, `m = <b>${n(fo / fe)}</b>.`) };
      return { fo, fe, ask, q: `<p>A refracting telescope has an objective of focal length ${fo} cm and an eyepiece of focal length ${fe} cm. What is the distance between the lenses in normal adjustment?</p>`, answer: fo + fe, unit: 'cm', tol: 0.01, hint: 'The image of the star sits at the common focus: length = f<sub>o</sub> + f<sub>e</sub>.', solution: steps(`L = f<sub>o</sub> + f<sub>e</sub> = ${fo} + ${fe}.`, `L = <b>${fo + fe} cm</b>.`) };
    },
    verify: (x) => (x.ask === 'm' ? x.fo * (1 / x.fe) : x.fe + x.fo),
  },
  'c12p-ray-microscope': {
    title: 'compound microscope magnification',
    make(r) {
      const vo = choose(r, [10, 12, 15]), uo = choose(r, [1.2, 1.5, 2]), fe = choose(r, [2.5, 4, 5]), M = (vo / uo) * (1 + 25 / fe);
      return { vo, uo, fe, q: `<p>In a compound microscope the objective forms an image ${vo} cm from it of an object ${uo} cm from it. The eyepiece has focal length ${fe} cm and the final image is at the near point (25 cm). Find the total magnification.</p>`, answer: M, unit: '', tol: 0.01, hint: 'M = m<sub>o</sub> × m<sub>e</sub> = (v<sub>o</sub>/u<sub>o</sub>)(1 + D/f<sub>e</sub>).',
        solution: steps(`m<sub>o</sub> = v<sub>o</sub>/u<sub>o</sub> = ${vo}/${uo} = ${n(vo / uo)}.`, `m<sub>e</sub> = 1 + 25/${fe} = ${n(1 + 25 / fe)}.`, `M = <b>${n(M)}</b>.`) };
    },
    verify: (x) => (x.vo / x.uo) * (x.fe + 25) / x.fe,
  },
};
