// #413 Stylometry: Burrows' Delta. Reference values from an independent Python (numpy + scipy) implementation.
import { tokenize, authorOf, splitTexts, burrowsDelta, upgma, attribute, EXAMPLE } from '../../src/lib/sci/stylometry.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  check('stylometry: tokens are lower-case words with inner apostrophes, numbers dropped', JSON.stringify(tokenize("It’s 1820: Don't STOP, o'clock — café!")) === JSON.stringify(["it's", "don't", 'stop', "o'clock", 'café']));
  check('stylometry: author is the part before "_" or " - "', authorOf('Austen_Emma.txt') === 'Austen' && authorOf('Twain - Letters') === 'Twain' && authorOf('Anon') === 'Anon');
  const t = splitTexts(EXAMPLE);
  check('stylometry: example splits into 7 texts at ### lines', t.length === 7 && t[6].name === 'Unsigned_note');
  check('stylometry: text before the first ### is kept as Text 1', splitTexts('one two\n### B\nthree')[0].name === 'Text 1' && splitTexts('one two\n### B\nthree').length === 2);
  const r = burrowsDelta(t, 100, 6);
  check('stylometry: 100 MFW, 2 with zero spread left out, 98 used', r.words.length === 98 && r.flat.length === 2 && r.words[0] === 'the');
  const py = [1.194151, 1.259809, 0.764307, 0.804177, 1.241278, 1.265349, 0];
  check('stylometry: Delta from the disputed text matches numpy to 1e-6', r.dist[6].every((v, i) => near(v, py[i])));
  check('stylometry: Delta is symmetric with a zero diagonal', r.dist.every((row, a) => row.every((v, b) => v === r.dist[b][a])) && r.dist.every((row, a) => row[a] === 0));
  const zr = r.ref.map((i) => r.z[i][0]);
  check('stylometry: reference z-scores have mean 0 and sd 1', near(zr.reduce((a, b) => a + b, 0), 0, 1e-9) && near(zr.reduce((a, b) => a + b * b, 0) / (zr.length - 1), 1, 1e-9));
  const u = upgma(r.dist), sh = [0.548223, 0.764307, 0.866957, 0.875644, 0.986572, 1.183048];
  check('stylometry: average-linkage heights match scipy linkage(average)', u.merges.every((m, k) => near(m.height, sh[k])) && u.order.length === 7 && new Set(u.order).size === 7);
  const at = attribute(r, 6);
  check('stylometry: disputed note is nearest Brennan (mean Delta 0.784)', at.authors[0].author === 'Brennan' && near(at.authors[0].delta, (0.764307 + 0.804177) / 2) && at.texts[0].name === 'Brennan_diary-one');
  const all = burrowsDelta(t, 50, -1);
  check('stylometry: without a disputed text all 7 texts set the means', all.ref.length === 7 && all.words.length === 50);
  check('stylometry: upgma of 3 points', JSON.stringify(upgma([[0, 1, 4], [1, 0, 6], [4, 6, 0]]).merges.map((m) => [m.a, m.b, m.height])) === '[[0,1,1],[2,3,5]]');
};
