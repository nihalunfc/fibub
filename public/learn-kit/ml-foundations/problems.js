// Live problems for "From a straight line to an LLM" (ML foundations). Each one makes fresh numbers with
// make(rand) and returns { q, answer, unit, tol (relative), abs?, hint, solution } as small HTML strings; `verify`
// recomputes the answer another way for tests/ml-kit.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
// The problems are split by module group so several writers can work at once: a = Modules 1-3, b = 4-6, c = 7-9, d = 10-11.
import a from './problems/a.js';
import b from './problems/b.js';
import c from './problems/c.js';
import d from './problems/d.js';
export default { ...a, ...b, ...c, ...d };
