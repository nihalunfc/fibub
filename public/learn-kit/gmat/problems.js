// Live problems for the GMAT course. They are the question generators of the shared bank
// (public/qbank/grad-quant/, also used by the GRE course and the practice sets), shown as typed-answer problems:
// <div class="problem" data-problem="<generator id>"></div>. The answer to type is the generator's `value`.
import { TOPICS } from '../../qbank/grad-quant/_all.js';

const out = {};
for (const T of TOPICS) for (const g of T.gens ?? []) {
  out[g.id] = {
    title: g.title ?? T.topic.replace(/-/g, ' '),
    make(r) {
      const p = g.make(r);
      return { ...p, answer: p.value, unit: p.unit ?? '', tol: p.tol ?? 0.002, abs: p.abs ?? 0.0005, hint: p.hint, solution: p.sol };
    },
    verify: g.check,
  };
}
export default out;
