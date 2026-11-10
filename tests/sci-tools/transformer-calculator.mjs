// #1417 Transformer calculator. Checked against Python: 1000/50 turns, 230 V, 10 Ω, 90%: V_s 11.5 V, I_s 1.15 A,
// P_out 13.225 W, P_in 14.69444 W, I_p 0.0638889 A. 10 MW through 5 Ω: 11 kV 909.09 A, 4132231.4 W (41.32%);
// 220 kV 45.4545 A, 10330.58 W; 400 kV 25 A, 3125 W.
import * as T from '../../src/lib/sci/transformer-calculator.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-12;

export default async (check) => {
  const t = T.transformer(1000, 50, 230, 10, 0.9);
  check('transformer: secondary side', near(t.Vs, 11.5) && near(t.Is, 1.15) && near(t.Ps, 13.225) && t.kind === 'step-down');
  check('transformer: primary side with 90% efficiency', near(t.Pp, 14.694444444444443) && near(t.Ip, 0.06388888888888888) && near(t.loss, 1.4694444444444432, 1e-6));
  const ideal = T.transformer(100, 2000, 230, 50, 1);
  check('transformer: ideal step-up conserves power', ideal.kind === 'step-up' && near(230 * ideal.Ip, ideal.Vs * ideal.Is));
  const a = T.line(1e7, 11e3, 5), b = T.line(1e7, 220e3, 5), c = T.line(1e7, 400e3, 5);
  check('transformer: line losses', near(a.I, 909.0909090909091) && near(a.loss, 4132231.4049586784) && near(b.loss, 10330.578512396694) && near(c.loss, 3125));
  check('transformer: 20 × voltage, 1/400 of the loss', near(a.loss / b.loss, 400));
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of T.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('transformer: 60 seeded question sets check out', okq);
};
