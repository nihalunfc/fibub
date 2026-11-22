// Live problems for the data-modelling course. Each one makes fresh numbers with make(rand) and returns
// { q, answer, unit, tol (relative), abs?, hint, solution } as small HTML strings; verify recomputes the answer
// another way for tests/data-kit.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
// Split by module group (a, b, c, d) so writers never edit the same file.
import a from './problems/a.js';
import b from './problems/b.js';
import c from './problems/c.js';
import d from './problems/d.js';
export default { ...a, ...b, ...c, ...d };
