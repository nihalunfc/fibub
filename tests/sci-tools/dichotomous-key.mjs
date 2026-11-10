// #1269 Dichotomous key explorer. The ready-made key names all eight animals once and leads each to itself; routes,
// following with answers, and building a key by splitting groups.
import { ORGS, KEY, check as keyOk, route, follow, split, addQuestion, nextGroup, questionsUsed, depth } from '../../src/lib/sci/school-dkey.ts';

export default async (check) => {
  check('ready-made key is complete and correct', keyOk(KEY));
  check('snake takes 5 questions, pigeon 2, worm 2', route(KEY, 'snake').length === 5 && route(KEY, 'pigeon').length === 2 && route(KEY, 'worm').length === 2 && depth(KEY) === 5);
  check('following the snake route ends at the snake', follow(KEY, route(KEY, 'snake').map((r) => r.a)).node.org === 'snake');
  check('no two animals share every trait', new Set(ORGS.map((o) => JSON.stringify(o.traits))).size === ORGS.length);
  check('split refuses a question with one answer', split(['fish', 'snake'], 'legs') === null && split(['fish', 'snake'], 'fins').yes[0] === 'fish');
  // Build greedily with the first question that splits each group: always finishes with 7 questions for 8 animals.
  let ok = true;
  for (let trial = 0; trial < 50; trial++) {
    let b = { group: ORGS.map((o) => o.id).sort(() => Math.random() - 0.5) };
    const qs = ['backbone', 'legs', 'wings', 'feathers', 'fur', 'fins', 'scales', 'six', 'eight', 'moist'].sort(() => Math.random() - 0.5);
    for (let guard = 0; nextGroup(b) && guard < 50; guard++) for (const q of qs) { const r = addQuestion(b, q); if (typeof r !== 'string') { b = r; break; } }
    const toNode = (n) => ('group' in n ? { org: n.group[0] } : { q: n.q, yes: toNode(n.yes), no: toNode(n.no) });
    if (nextGroup(b) !== null || questionsUsed(b) !== 7 || !keyOk(toNode(b))) ok = false;
  }
  check('50 random built keys: always finish with 7 questions and name everyone correctly', ok);
};
