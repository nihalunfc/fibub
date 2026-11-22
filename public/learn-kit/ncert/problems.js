// Live problems for the NCERT study courses (src/courses/ncert.ts). Each problem is { title, make(rand), verify? };
// make returns { q, answer, unit, tol (relative), abs?, hint, solution } as small HTML strings, and verify works the
// answer out another way for tests/ncert.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
// One file per chapter in problems/ (named <class>-<subject>-<chapter-slug>.js, ids prefixed to stay unique),
// listed in problems/index.js: run `node scripts/ncert-index.mjs` after adding files.
import CHAPTER_PROBLEMS from './problems/index.js';

export default { ...CHAPTER_PROBLEMS };
