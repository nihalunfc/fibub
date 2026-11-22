// Live problems for Pipeline to Dashboard. Each makes fresh numbers with make(rand) and returns { q, answer, unit, tol, abs?, hint, solution };
// `verify` recomputes the answer another way (tests/course-kit.mjs). Split by module group so writers can work at once.
import a from './problems/a.js';
import b from './problems/b.js';
import c from './problems/c.js';
import d from './problems/d.js';
export default { ...a, ...b, ...c, ...d };
