// #1370 compound angle. The picture's lengths checked against the identities with Python's math module
// (sin, cos of A + B for A, B from 0° to 80° in 5° steps), and the exact values against sympy.
import * as C from '../../src/lib/sci/school-compound.ts';
const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
export default async (check) => {
  let ok = true, okc = true, okP = true;
  for (let A = 0; A <= 80; A += 5) for (let B = 0; B <= 80; B += 5) {
    const p = C.proof(A, B), S = C.rad(A + B);
    ok &&= near(p.RQ + p.NP, Math.sin(S)) && near(p.P.y, Math.sin(S));
    okc &&= near(p.OR - p.NQ, Math.cos(S)) && near(p.P.x, Math.cos(S));
    okP &&= near(Math.hypot(p.P.x, p.P.y), 1) && near(Math.hypot(p.Q.x, p.Q.y), Math.cos(C.rad(B))) && near(Math.hypot(p.P.x - p.Q.x, p.P.y - p.Q.y), Math.sin(C.rad(B)));
  }
  check('compound: MP = RQ + NP = sin(A + B) for 289 angle pairs', ok);
  check('compound: OM = OR − NQ = cos(A + B) for 289 angle pairs', okc);
  check('compound: OP = 1, OQ = cos B, QP = sin B', okP);
  const rows = C.formulas(37, 22);
  check('compound: all 9 formulas agree at A = 37°, B = 22°', rows.length === 9 && rows.every((r) => near(r.left, r.right, 1e-12)));
  check('compound: sin 75° = (√6 + √2)/4 (sympy)', near(C.formulas(30, 45)[0].left, (Math.sqrt(6) + Math.sqrt(2)) / 4));
  check('compound: cos 15° = (√6 + √2)/4 (sympy)', near(C.formulas(45, 30)[3].left, (Math.sqrt(6) + Math.sqrt(2)) / 4));
  check('compound: sin 2A at 30° = √3/2', near(C.formulas(30, 0)[6].right, Math.sqrt(3) / 2));
};
