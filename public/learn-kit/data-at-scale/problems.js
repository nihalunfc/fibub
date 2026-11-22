// Live problems for Data at Scale. Each makes fresh numbers with make(rand) and returns { q, answer, unit, tol, abs?, hint, solution };
// `verify` recomputes the answer another way (tests/course-kit.mjs). Split by module group so two writers can work at once.
import a from './problems/a.js';
import b from './problems/b.js';
export default { ...a, ...b };
