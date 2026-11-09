// #197 Gram stain and biochemical test key. The tree builder, candidates and ranking were checked against an
// independent Python version (written from the rules) on the example and 60 random keys with 5 result sets each:
// 732 comparisons, 0 differences. The small key below is worked by hand.
import { parseKey, keyToCsv, keyToJson, readVal, candidates, split, nextTest, buildTree, keyLines, paths, rank, expectedLeft, EXAMPLE_KEY, EXAMPLE_RESULTS } from '../../src/lib/sci/gramkey.ts';

export default async (check) => {
  const { key, errors } = parseKey(EXAMPLE_KEY);
  check('gram key: example reads (15 tests, 19 groups, no errors, labels and notes)', errors.length === 0 && key.tests.length === 15 && key.groups.length === 19 && key.tests[0].yes === 'Gram-positive (purple)' && key.tests[1].no === 'Rods' && key.groups[0].note === 'Clusters; golden colonies');
  const T = (n) => key.tests.findIndex((t) => t.name === n), G = (n) => key.groups.findIndex((g) => g.name === n);
  const order = buildTree(key, 'order'), best = buildTree(key, 'best');
  const lo = keyLines(key, order.tree), lb = keyLines(key, best.tree);
  check('gram key: lab-order key has 20 couplets, fewest-steps key 19 (same as Python)', order.couplets === 20 && best.couplets === 19 && lo.length === 40 && lb.length === 38 && !order.cut);
  check('gram key: lab order starts Gram stain, then shape, then catalase', lo[0] === '1a. Gram stain: Gram-positive (purple) ... go to 2' && lo[2] === '2a. Shape: Cocci (round) ... go to 3' && lo[4] === '3a. Catalase: Bubbles ... go to 4');
  check('gram key: coagulase separates the staphylococci', lo[6] === '4a. Coagulase: Clots plasma ... Staphylococcus aureus' && lo[7] === '4b. Coagulase: No clot ... Coagulase-negative staphylococci');
  check('gram key: fewest steps puts catalase before shape for Gram-positives', lb[2] === '2a. Catalase: Bubbles ... go to 3');
  // Every group can be reached on its own at the end of some path in both keys.
  for (const [m, b] of [['lab order', order], ['fewest steps', best]]) {
    const ends = paths(key, b.tree);
    const alone = new Set(ends.filter((p) => p.leaf.length === 1).map((p) => p.leaf[0]));
    check(`gram key: ${m}: all 19 groups end alone on some path, and no path ends empty`, alone.size === 19 && ends.every((p) => p.leaf.length >= 1));
  }
  // E. coli by hand: Gram -, rods, oxidase -, lactose +, motile +, indole + leaves only E. coli.
  const ans = new Map([[T('Gram stain'), '-'], [T('Shape'), '-'], [T('Oxidase'), '-'], [T('Lactose (MacConkey)'), '+']]);
  const c4 = candidates(key, ans).map((g) => key.groups[g].name);
  check('gram key: Gram-negative, rod, oxidase-negative, lactose-positive leaves E. coli, Klebsiella, Enterobacter', c4.join('|') === 'Escherichia coli|Klebsiella|Enterobacter');
  check('gram key: lab order asks motility next (catalase and endospores are all the same here)', nextTest(key, candidates(key, ans), new Set(ans.keys()), 'order') === T('Motility'));
  ans.set(T('Motility'), '+'); ans.set(T('Indole'), '+');
  check('gram key: then motile and indole-positive leaves E. coli', candidates(key, ans).join() === String(G('Escherichia coli')));
  // Variable and blank results never rule a group out.
  const v = new Map([[T('Gram stain'), '-'], [T('Shape'), '-'], [T('Oxidase'), '+'], [T('Lactose (MacConkey)'), '+']]);
  check('gram key: variable lactose keeps Vibrio in; Pseudomonas (lactose -) is out', candidates(key, v).join() === String(G('Vibrio')));
  // Ranking the example results.
  const res = new Map(EXAMPLE_RESULTS.map(([n, a]) => [T(n), a]));
  const r = rank(key, res);
  check('gram key: example results rank Salmonella first (7 of 7 agree, 100 %)', r[0].group === G('Salmonella') && r[0].agree === 7 && r[0].conflict === 0 && r[0].score === 100);
  check('gram key: Proteus second, 6 agree and 1 conflict on urease (6/7 = 85.71 %)', r[1].group === G('Proteus') && r[1].conflict === 1 && r[1].conflicts[0] === T('Urease') && Math.abs(r[1].score - 600 / 7) < 1e-12);
  check('gram key: Bacillus counts unused tests apart (2 agree, 1 conflict, 4 not used)', (() => { const b = r.find((f) => f.group === G('Bacillus')); return b.agree === 2 && b.conflict === 1 && b.unused === 4 && Math.abs(b.score - 200 / 3) < 1e-12; })());
  check('gram key: Clostridium variable motility scores half (1 + 0.5) / 3 = 50 %', (() => { const c = r.find((f) => f.group === G('Clostridium')); return c.variable === 1 && c.score === 50; })());
  check('gram key: ranking is sorted by conflicts, then score', r.every((f, i) => i === 0 || r[i - 1].conflict < f.conflict || (r[i - 1].conflict === f.conflict && r[i - 1].score >= f.score)));
  check('gram key: no results ranks everyone 0 % in table order', rank(key, new Map()).every((f, i) => f.group === i && f.score === 0));

  // A small key worked by hand: A (+,+), B (+,-), C (-,v), D (-,-).
  const s = parseKey('Group,P,Q\nA,+,+\nB,+,-\nC,-,v\nD,-,-\n').key;
  const sp = split(s, [0, 1, 2, 3], 1);
  check('gram key: hand key: Q sends A, C to + and B, C, D to - (C both ways)', sp.pos.join() === '0,2' && sp.neg.join() === '1,2,3' && sp.useful);
  check('gram key: expected groups left: P (2,2) = 2, Q (2,3) = 13/5 = 2.6', expectedLeft(2, 2) === 2 && Math.abs(expectedLeft(2, 3) - 2.6) < 1e-12);
  check('gram key: fewest steps picks P (2 < 2.6); lab order also P', nextTest(s, [0, 1, 2, 3], new Set(), 'best') === 0 && nextTest(s, [0, 1, 2, 3], new Set(), 'order') === 0);
  check('gram key: hand key printed', keyLines(s, buildTree(s, 'best').tree).join('\n') === '1a. P: Positive ... go to 2\n1b. P: Negative ... go to 3\n2a. Q: Positive ... A\n2b. Q: Negative ... B\n3a. Q: Positive ... C\n3b. Q: Negative ... C or D (not told apart by these tests)');
  const s2 = parseKey('Group,P,Q\nA,+,v\nB,+,v\n').key;
  check('gram key: groups no test can split end together', keyLines(s2, buildTree(s2, 'order').tree)[0] === 'No test tells these groups apart: A or B (not told apart by these tests)' && !split(s2, [0, 1], 0).useful);

  // Reading and writing keys.
  check('gram key: result words (pos, Negative, variable, ±, n/a, ?)', readVal('pos') === '+' && readVal('Negative') === '-' && readVal('−') === '-' && readVal('variable') === 'v' && readVal('±') === 'v' && readVal('n/a') === '' && readVal('?') === '' && readVal('maybe') === null);
  const back = parseKey(keyToCsv(key));
  check('gram key: CSV round trip keeps every test, label, result and note', back.errors.length === 0 && keyToCsv(back.key) === keyToCsv(key) && back.key.tests[5].yes === 'Clots plasma');
  const bj = parseKey(keyToJson(key));
  check('gram key: JSON round trip', bj.errors.length === 0 && keyToJson(bj.key) === keyToJson(key) && JSON.parse(keyToJson(key)).groups[0].results['Gram stain'] === '+');
  check('gram key: tab and semicolon tables, quoted cells with commas', parseKey('Group\tA\tB\nX\t+\t-\nY\t-\t+').key.groups[1].vals.join('') === '-+' && parseKey('Group;A\n+ means;"yes, clearly"\nX;+\nY;-').key.tests[0].yes === 'yes, clearly' && parseKey('Group,"A, b"\nX,+\nY,-').key.tests[0].name === 'A, b');
  { const p = parseKey('Group,A\nX,+\nY,maybe\n,+\nX,-'); check('gram key: bad cells, missing names and repeats are reported', p.key.groups.length === 3 && p.errors.length === 3 && p.errors[0].includes('"maybe"') && p.errors[1].includes('no group name') && p.errors[2].includes('listed twice')); }
  check('gram key: JSON with results as a list, and plain test names', parseKey('{"tests":["A","B"],"groups":[{"name":"X","results":["+","-"]},{"name":"Y","results":["-","v"]}]}').key.groups[1].vals.join('') === '-v');
  check('gram key: empty, one group, bad JSON and no tests are refused', parseKey('').key === null && parseKey('Group,A\nX,+').key === null && parseKey('{"tests":').key === null && parseKey('Group\nX\nY').key === null);
};
