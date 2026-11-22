// Live problems for the pandas course. Each one makes fresh numbers with make(rand) and returns
// { q, answer, unit, tol (relative), abs?, hint, solution } as small HTML strings; verify recomputes the answer
// another way for tests/analyst-kit.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
// Split by module group: a = Modules 1-3, b = 4-6, c = 7-9.
import a from './problems/a.js';
import b from './problems/b.js';
import c from './problems/c.js';
export default { ...a, ...b, ...c };
