// Shared helper for the extra Reading Comprehension passages. Each file in this folder holds one original passage
// (written for fibub) and its questions; the rc-*.js topic files gather them. Folders starting with _ are not topics.
import { place } from '../_util.js';
const F = { section: 'rc', qtype: 'rc' };
/** rc('p2') gives an item maker for passage group p2. Options are written right answer first; place() spreads them. */
export const rc = (group) => (id, level, sub, q, options, sol, trap) => place({ id, type: 'mcq', marks: 1, level, exams: ['lsat'], sub, facets: F, format: 'passage', group, q: `<p>${q}</p>`, options, answer: 0, sol, trap });
