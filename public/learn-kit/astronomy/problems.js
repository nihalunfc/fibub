// Live problems for Astronomy. Each makes fresh numbers with make(rand) and returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as small HTML strings; `verify` recomputes the answer another way for tests/astro-kit.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Split by module: a = Modules 1-2, b = 3-5.
import a from './problems/a.js';
import b from './problems/b.js';
export default { ...a, ...b };
