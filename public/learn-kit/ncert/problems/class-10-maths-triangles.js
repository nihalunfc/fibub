// Class 10 Maths, Triangles: live problems (original fibub questions). Ids start with c10m-tri-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

export default tidyProblems({
  'c10m-tri-bpt': {
    title: 'use the basic proportionality theorem',
    make(r) {
      const p = pick(r, 1, 5), q = pick(r, 1, 5), a = pick(r, 1, 4, 0.5), b = pick(r, 1, 5, 0.5);
      const AD = p * a, DB = q * a, AE = p * b, EC = q * b;
      return { AD, DB, AE, q: `<p>In triangle ABC, D is on AB and E is on AC with DE parallel to BC. AD = ${n(AD)} cm, DB = ${n(DB)} cm and AE = ${n(AE)} cm. Find EC in cm.</p>`, answer: EC, unit: 'cm', tol: 0.001,
        hint: 'Because DE ∥ BC, AD/DB = AE/EC. Put in the three known lengths and solve for EC.',
        solution: steps(`DE ∥ BC, so AD/DB = AE/EC.`, `${n(AD)}/${n(DB)} = ${n(AE)}/EC, so EC = ${n(AE)} × ${n(DB)} ÷ ${n(AD)}.`, `EC = <b>${n(EC)} cm</b>.`) };
    },
    verify: (x) => (x.AE * x.DB) / x.AD,
  },
  'c10m-tri-parallel': {
    title: 'find x so that DE is parallel to BC',
    make(r) {
      const x = pick(r, 1, 6), p = pick(r, 1, 3), b = pick(r, 1, 6), a = p * x, c = a + b + p * b;
      return { a, b, c, q: `<p>In triangle ABC, D is on AB and E is on AC. AD = x cm, DB = (x + ${a}) cm, AE = (x + ${b}) cm and EC = (x + ${c}) cm. For what value of x is DE parallel to BC?</p>`, answer: x, unit: 'cm', tol: 0.001,
        hint: 'DE ∥ BC exactly when AD/DB = AE/EC. Cross multiply and the x² terms cancel.',
        solution: steps(`AD/DB = AE/EC gives x/(x + ${a}) = (x + ${b})/(x + ${c}).`, `Cross multiply: x(x + ${c}) = (x + ${a})(x + ${b}), so x² + ${c}x = x² + ${a + b}x + ${a * b}.`, `${c - a - b === 1 ? '' : `${c - a - b}x = ${a * b}, so `}x = <b>${x}</b>.`) };
    },
    verify: (p) => (p.a * p.b) / (p.c - p.a - p.b),
  },
  'c10m-tri-side': {
    title: 'a missing side in similar triangles',
    make(r) {
      const AB = pick(r, 3, 9), BC = pick(r, 4, 12), AC = pick(r, 5, 11), k = choose(r, [1.5, 2, 2.5, 3, 4]);
      const PQ = AB * k, QR = BC * k;
      return { AB, BC, PQ, q: `<p>Triangle ABC is similar to triangle PQR (A↔P, B↔Q, C↔R). AB = ${n(AB)} cm, BC = ${n(BC)} cm and AC = ${n(AC)} cm. In triangle PQR, PQ = ${n(PQ)} cm. Find QR in cm.</p>`, answer: QR, unit: 'cm', tol: 0.001,
        hint: 'Matching sides are in the same ratio: PQ/AB = QR/BC.',
        solution: steps(`The scale factor is PQ/AB = ${n(PQ)}/${n(AB)} = ${n(k)}.`, `QR = BC × ${n(k)} = ${n(BC)} × ${n(k)}.`, `QR = <b>${n(QR)} cm</b>. (AC is not needed.)`) };
    },
    verify: (x) => (x.PQ * x.BC) / x.AB,
  },
  'c10m-tri-sss': {
    title: 'the third side from SSS similarity',
    make(r) {
      const a = pick(r, 3, 8), b = pick(r, 4, 9), c = pick(r, 5, 10), k = choose(r, [1.5, 2, 2.5, 3]);
      return { a, b, c, k, q: `<p>Triangle ABC has sides ${a} cm, ${b} cm and ${c} cm. Triangle PQR is similar to it (by SSS) and its two shorter sides are ${n(a * k)} cm and ${n(b * k)} cm. Find its third side.</p>`, answer: c * k, unit: 'cm', tol: 0.001,
        hint: `The sides are in the same ratio. Find the scale factor from the two sides you know: ${n(a * k)} ÷ ${a}.`,
        solution: steps(`Scale factor = ${n(a * k)}/${a} = ${n(k)}; check with the other side: ${n(b * k)}/${b} = ${n(k)}.`, `Third side = ${c} × ${n(k)}.`, `= <b>${n(c * k)} cm</b>.`) };
    },
    verify: (x) => (x.c * x.a * x.k) / x.a,
  },
  'c10m-tri-shadow': {
    title: 'measure a height from shadows',
    make(r) {
      const hp = choose(r, [1.5, 1.6, 1.2, 1.8]), s = choose(r, [0.8, 1, 1.2, 1.5, 2]), m = pick(r, 4, 14), S = s * m;
      return { hp, s, S, q: `<p>A girl ${hp} m tall casts a shadow ${n(s)} m long. At the same time a coconut tree casts a shadow ${n(S)} m long. How tall is the tree, in metres?</p>`, answer: hp * m, unit: 'm', tol: 0.005,
        hint: 'The sun makes similar triangles with the girl and the tree: height/shadow is the same for both.',
        solution: steps(`The two right triangles are similar (same sun angle), so tree/girl = tree shadow/girl shadow.`, `Tree = ${hp} × ${n(S)} ÷ ${n(s)}.`, `Tree = <b>${n(hp * m)} m</b>.`) };
    },
    verify: (x) => x.hp / (x.s / x.S),
  },
  'c10m-tri-photo': {
    title: 'enlarging a photo',
    make(r) {
      const w = pick(r, 6, 14), h = pick(r, 4, 10), k = choose(r, [1.5, 2, 2.5, 3]);
      return { w, h, k, q: `<p>A photograph is ${w} cm long and ${h} cm wide. It is enlarged without changing its shape so that its length becomes ${n(w * k)} cm. What is the new width, in cm?</p>`, answer: h * k, unit: 'cm', tol: 0.001,
        hint: 'An enlargement keeps the shape, so the two rectangles are similar: new length/old length = new width/old width.',
        solution: steps(`Scale factor = ${n(w * k)}/${w} = ${n(k)}.`, `New width = ${h} × ${n(k)}.`, `= <b>${n(h * k)} cm</b>.`) };
    },
    verify: (x) => (x.h * (x.w * x.k)) / x.w,
  },
  'c10m-tri-sides-bpt': {
    title: 'find a whole side with the theorem',
    make(r) {
      const p = pick(r, 2, 5), q = pick(r, 1, 4), a = pick(r, 1, 4), AD = p * a, DB = q * a, AE = pick(r, 2, 8) * p, AC = AE * (p + q) / p;
      return { AD, DB, AE, q: `<p>DE is parallel to BC in triangle ABC, with D on AB and E on AC. AD = ${AD} cm, DB = ${DB} cm and AE = ${n(AE)} cm. Find the length of AC in cm.</p>`, answer: AC, unit: 'cm', tol: 0.001,
        hint: 'First find EC from AD/DB = AE/EC, then add: AC = AE + EC. A shortcut: AE/AC = AD/AB.',
        solution: steps(`AD/DB = AE/EC gives EC = ${n(AE)} × ${DB} ÷ ${AD} = ${n(AE * DB / AD)} cm.`, `AC = AE + EC = ${n(AE)} + ${n(AE * DB / AD)}.`, `AC = <b>${n(AC)} cm</b>.`) };
    },
    verify: (x) => x.AE / (x.AD / (x.AD + x.DB)),
  },
}, ['c10m-tri-parallel']);
