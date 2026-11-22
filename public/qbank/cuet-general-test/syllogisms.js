// CUET General Test: syllogisms. Original questions for fibub.
// Every answer is worked out by a small checker (all possible Venn diagrams), so none can be wrong by hand.
import { pick, int, choose, fmt, shuffleOpts, steps } from './_cuet.js';

const T = { exams: ['cuet'], format: 'statements' };

// ---- checker -------------------------------------------------------------------------------------
// A statement is [kind, x, y] with kind: all | no | some | somenot, x and y term numbers.
// A "model" says which of the 2^n regions of an n-set Venn diagram are occupied. Every term is non-empty.
const holds = (n, model, [k, x, y]) => {
  let has = false, bad = false;
  for (let r = 0; r < 1 << n; r++) {
    if (!((model >> r) & 1)) continue;
    const inx = (r >> x) & 1, iny = (r >> y) & 1;
    if (k === 'all' && inx && !iny) bad = true;
    if (k === 'no' && inx && iny) bad = true;
    if (k === 'some' && inx && iny) has = true;
    if (k === 'somenot' && inx && !iny) has = true;
  }
  return k === 'all' || k === 'no' ? !bad : has;
};
const termsUsed = (n, model) => { for (let t = 0; t < n; t++) { let ok = false; for (let r = 0; r < 1 << n; r++) if (((model >> r) & 1) && ((r >> t) & 1)) ok = true; if (!ok) return false; } return true; };
export function verdict(n, premises, c1, c2) {
  let f1 = true, f2 = true, either = true;
  const total = 1 << (1 << n);
  for (let m = 1; m < total; m++) {
    if (!termsUsed(n, m) || !premises.every((p) => holds(n, m, p))) continue;
    const a = holds(n, m, c1), b = holds(n, m, c2);
    if (!a) f1 = false; if (!b) f2 = false; if (!a && !b) either = false;
  }
  return f1 && f2 ? 'both' : f1 ? 'I' : f2 ? 'II' : either ? 'either' : 'neither';
}
const text = ([k, x, y], nn) => k === 'all' ? `All ${nn[x]} are ${nn[y]}.` : k === 'no' ? `No ${nn[x]} are ${nn[y]}.` : k === 'some' ? `Some ${nn[x]} are ${nn[y]}.` : `Some ${nn[x]} are not ${nn[y]}.`;
const BASE = ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither I nor II follows'];
const LABEL = { I: 'only I follows', II: 'only II follows', both: 'both I and II follow', either: 'either I or II follows', neither: 'neither I nor II follows' };
const place = (label, r) => {
  const base = BASE.slice(); if (label === 'either') base[2] = 'Either I or II follows';
  const idx = { I: 0, II: 1, both: 2, either: 2, neither: 3 }[label];
  const options = base.map((_, i) => base[(i + 4 - r) % 4]);   // rotate so the right answer moves
  return { options, answer: (idx + r) % 4 };
};
const stem = (nn, ps, c1, c2) => `<b>Statements:</b><br>${ps.map((p, i) => `${i + 1}. ${text(p, nn)}`).join('<br>')}<br><b>Conclusions:</b><br>I. ${text(c1, nn).replace(/\.$/, '')}.<br>II. ${text(c2, nn).replace(/\.$/, '')}.`;

const syl = (id, level, sub, nn, ps, c1, c2, why, trap) => {
  const v = verdict(nn.length, ps, c1, c2), { options, answer } = place(v, parseInt(id.slice(-3), 10) % 4);
  return { id, type: 'mcq', level, sub, q: stem(nn, ps, c1, c2), options, answer, sol: `${why} So <b>${LABEL[v]}</b>.`, ...(trap ? { trap } : {}), ...T };
};

export default {
  topic: 'syllogisms',
  items: [
    syl('sy-001', 1, 'all-all', ['pens', 'books', 'bags'], [['all', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['some', 2, 1], 'Pens sit inside books, and books inside bags, so every pen is a bag (I). Books are non-empty and inside bags, so some bags are books (II).'),
    syl('sy-002', 1, 'some-all', ['doctors', 'teachers', 'singers'], [['some', 0, 1], ['all', 1, 2]], ['some', 0, 2], ['all', 2, 1], 'The doctors who are teachers are also singers, so some doctors are singers (I). Nothing says all singers are teachers (II).'),
    syl('sy-003', 2, 'no-all', ['cats', 'dogs', 'animals'], [['no', 0, 1], ['all', 1, 2]], ['no', 0, 2], ['somenot', 2, 0], 'Dogs are animals but are not cats, so some animals are not cats (II). Cats may still be animals, so I does not follow.', 'The two statements do not say whether cats are animals.'),
    syl('sy-004', 2, 'all-some', ['roses', 'flowers', 'red things'], [['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['all', 0, 2], 'The red flowers may not be roses at all. Roses sit inside flowers, but "some flowers are red" does not say which flowers.', 'Two statements with one "some" cannot join the first and last term.'),
    syl('sy-005', 2, 'some-some', ['pens', 'books', 'bags'], [['some', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 0], 'Two "some" statements never give a conclusion. The pens that are books may be different books from those that are bags.', 'Two particular statements give no sure link.'),
    syl('sy-006', 2, 'all-no', ['fruits', 'sweet things', 'bitter things'], [['all', 0, 1], ['no', 1, 2]], ['no', 0, 2], ['some', 2, 0], 'Fruits lie inside sweet things, and sweet things have nothing to do with bitter things, so no fruit is bitter (I). II says the opposite.'),
    syl('sy-007', 3, 'either-or', ['shirts', 'cloth items', 'red things'], [['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['no', 0, 2], 'The red cloth items may or may not be shirts, so neither I nor II alone is certain. But I and II are a pair: "some" and "no" about the same two things. Exactly one of them is true.', 'Look for "some X are Y" paired with "No X is Y": that is the "either or" case.'),
    syl('sy-008', 1, 'all-all', ['mangoes', 'fruits', 'tasty things'], [['all', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['some', 2, 0], 'Mangoes inside fruits inside tasty things, so all mangoes are tasty (I) and some tasty things are mangoes (II).'),
    syl('sy-009', 2, 'some-all', ['bats', 'balls', 'round things'], [['some', 0, 1], ['all', 1, 2]], ['some', 0, 2], ['all', 2, 1], 'Those bats that are balls are round things (I). The converse "all round things are balls" is not given (II).'),
    syl('sy-010', 3, 'no-some', ['trees', 'stones', 'hard things'], [['no', 0, 1], ['some', 1, 2]], ['somenot', 2, 0], ['no', 2, 0], 'The hard stones are not trees, so some hard things are not trees (I). Hard things other than stones might be trees, so II is not certain.'),
    syl('sy-011', 2, 'all-no', ['lions', 'cats', 'birds'], [['all', 0, 1], ['no', 1, 2]], ['no', 0, 2], ['no', 2, 0], 'Lions are inside cats, and cats have no bird in them, so no lion is a bird (I). "No A is B" can always be turned round to "No B is A" (II).'),
    syl('sy-012', 3, 'either-or', ['girls', 'singers', 'dancers'], [['some', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['no', 0, 2], 'Two "some" statements give no sure link, so I alone is not certain and II alone is not certain. But I and II are opposite statements about the same two things, so one of them must be true.'),
    syl('sy-013', 1, 'all-all', ['teachers', 'educated people', 'honest people'], [['all', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['some', 2, 0], 'Teachers inside educated people inside honest people: all teachers are honest (I), and some honest people are teachers (II).'),
    syl('sy-014', 2, 'some-no', ['pencils', 'pens', 'books'], [['some', 0, 1], ['no', 1, 2]], ['somenot', 0, 2], ['no', 0, 2], 'The pencils that are pens cannot be books, so some pencils are not books (I). Other pencils might be books, so II does not follow.'),
    syl('sy-015', 2, 'all-some', ['trains', 'buses', 'cars'], [['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 1], '"Some buses are cars" can be turned round to "some cars are buses" (II). Trains may not meet the cars at all (I).'),
    syl('sy-016', 2, 'some-all', ['metals', 'hard things', 'heavy things'], [['some', 0, 1], ['all', 1, 2]], ['some', 0, 2], ['some', 2, 1], 'The hard metals are heavy (I). All hard things are heavy, so some heavy things are hard (II).'),
    syl('sy-017', 3, 'no-all', ['rivers', 'mountains', 'high places'], [['no', 0, 1], ['all', 1, 2]], ['no', 0, 2], ['some', 2, 1], 'All mountains are high places, so some high places are mountains (II). Rivers might still be high places, so I does not follow.', 'Rivers and mountains do not overlap, but nothing stops rivers from being high.'),
    syl('sy-018', 2, 'all-some', ['bankers', 'rich people', 'generous people'], [['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 1], 'Turning round the second statement gives "some generous people are rich" (II). I would need the generous rich people to be bankers.'),
    syl('sy-019', 3, 'no-all', ['saints', 'greedy people', 'fools'], [['no', 0, 1], ['all', 1, 2]], ['no', 0, 2], ['some', 2, 1], 'All greedy people are fools, so some fools are greedy (II). Saints are not greedy but could still be fools, so I fails.'),
    syl('sy-020', 2, 'all-no', ['clocks', 'watches', 'bells'], [['all', 0, 1], ['no', 1, 2]], ['no', 0, 2], ['no', 2, 0], 'Clocks lie inside watches, and watches contain no bells, so no clock is a bell (I) and no bell is a clock (II).'),
    syl('sy-021', 3, 'some-not', ['pens', 'books', 'paper items'], [['somenot', 0, 1], ['all', 1, 2]], ['somenot', 0, 2], ['some', 2, 1], 'All books are paper items, so some paper items are books (II). The pens that are not books might still be paper, so I is not certain.', 'A "some are not" statement does not carry over through "all": the leftover pens may be paper.'),
    syl('sy-022', 2, 'all-some', ['students', 'learners', 'athletes'], [['all', 0, 1], ['some', 0, 2]], ['some', 1, 2], ['some', 2, 1], 'The students who are athletes are also learners, so some learners are athletes (I), and by turning round some athletes are learners (II).'),
    syl('sy-023', 2, 'some-all', ['farmers', 'workers', 'labourers'], [['some', 0, 1], ['all', 2, 1]], ['some', 0, 2], ['some', 2, 0], 'Farmers and labourers both link to workers, but the farmers who are workers need not be labourers. Neither conclusion is certain.', 'Both groups touch "workers", which tempts you to join them. It does not.'),
    syl('sy-024', 3, 'three statements', ['students', 'readers', 'thinkers', 'learners'], [['some', 0, 1], ['all', 1, 2], ['all', 2, 3]], ['some', 0, 3], ['some', 3, 0], 'Follow the chain: the students who are readers are thinkers and so learners, so some students are learners (I) and some learners are students (II).'),
    syl('sy-025', 3, 'three statements', ['bats', 'balls', 'nets', 'stumps'], [['all', 0, 1], ['no', 1, 2], ['some', 2, 3]], ['somenot', 3, 0], ['somenot', 3, 1], 'The stumps that are nets cannot be balls, and bats are inside balls, so those stumps are not bats (I) and not balls (II).'),
    syl('sy-026', 3, 'three statements', ['poets', 'writers', 'readers', 'critics'], [['some', 0, 1], ['all', 1, 2], ['no', 2, 3]], ['somenot', 0, 3], ['no', 0, 3], 'The poets who are writers are readers, and readers are not critics, so some poets are not critics (I). The other poets are unknown, so II fails.'),
    syl('sy-027', 3, 'three statements', ['cars', 'vehicles', 'machines', 'tools'], [['all', 0, 1], ['some', 1, 2], ['all', 2, 3]], ['some', 1, 3], ['some', 0, 3], 'The vehicles that are machines are tools, so some vehicles are tools (I). Cars need not be the vehicles that are machines, so II is not certain.'),
    syl('sy-028', 3, 'either-or', ['apples', 'fruits', 'sour things'], [['all', 0, 1], ['somenot', 1, 2]], ['somenot', 0, 2], ['all', 0, 2], 'The fruits that are not sour may or may not be apples, so neither conclusion is certain alone. But I and II are opposites ("some are not" against "all are"), so one is true.'),
    syl('sy-029', 3, 'either-or', ['trees', 'plants', 'tall things'], [['all', 0, 1], ['some', 1, 2]], ['all', 0, 2], ['somenot', 0, 2], 'The tall plants may or may not be trees, so neither alone is certain. But "all trees are tall" and "some trees are not tall" cannot both be false.'),
    syl('sy-030', 3, 'either-or', ['writers', 'speakers', 'artists'], [['some', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['somenot', 0, 2], 'The writers who are speakers are artists, but we know nothing about the other writers. So neither alone is certain; as an opposite pair, one of them must be true.'),
    syl('sy-031', 2, 'some-all', ['Indians', 'Asians', 'farmers'], [['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 1], 'Some farmers are Asians follows by turning round "some Asians are farmers" (II). The farmers who are Asians may not be Indians (I).'),
    syl('sy-032', 3, 'no-some', ['politicians', 'saints', 'teachers'], [['no', 0, 1], ['some', 1, 2]], ['somenot', 2, 0], ['no', 2, 0], 'The teachers who are saints are not politicians, so some teachers are not politicians (I). Other teachers could be politicians, so II does not follow.'),
  ],
  gens: [
    { id: 'sy-g01', type: 'mcq', level: 2, sub: 'all-all', ...T,
      make(rng) { return gen(rng, [
        [[['all', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['some', 2, 0], 'both'],
        [[['all', 0, 1], ['all', 1, 2]], ['all', 2, 0], ['some', 0, 2], 'II'],
        [[['all', 0, 1], ['all', 2, 1]], ['all', 0, 2], ['some', 2, 0], 'neither'] ], 'Draw the circles: "All X are Y" puts X inside Y. Conclusions need the circles to be forced to overlap or nest.'); },
      verify: (p) => p.check() },
    { id: 'sy-g02', type: 'mcq', level: 2, sub: 'some', ...T,
      make(rng) { return gen(rng, [
        [[['some', 0, 1], ['all', 1, 2]], ['some', 0, 2], ['all', 2, 1], 'I'],
        [[['some', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 1], 'II'],
        [[['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['some', 2, 1], 'II'] ], 'A "some" can be turned round; two "some" statements never join.'); },
      verify: (p) => p.check() },
    { id: 'sy-g03', type: 'mcq', level: 3, sub: 'no', ...T,
      make(rng) { return gen(rng, [
        [[['no', 0, 1], ['all', 2, 1]], ['no', 2, 0], ['some', 0, 2], 'I'],
        [[['all', 0, 1], ['no', 1, 2]], ['no', 0, 2], ['no', 2, 0], 'both'],
        [[['some', 0, 1], ['no', 1, 2]], ['somenot', 0, 2], ['no', 0, 2], 'I'] ], 'A "no" statement keeps two groups apart; follow which groups are forced to be apart.'); },
      verify: (p) => p.check() },
    { id: 'sy-g04', type: 'mcq', level: 3, sub: 'either-or', ...T,
      make(rng) { return gen(rng, [
        [[['all', 0, 1], ['some', 1, 2]], ['some', 0, 2], ['no', 0, 2], 'either'],
        [[['all', 0, 1], ['some', 1, 2]], ['all', 0, 2], ['somenot', 0, 2], 'either'],
        [[['some', 0, 1], ['all', 1, 2]], ['all', 0, 2], ['somenot', 0, 2], 'either'] ], 'The two conclusions are opposites about the same two groups. Neither is forced alone, but one must be true.'); },
      verify: (p) => p.check() },
  ],
};

const NOUNS = ['pens', 'books', 'bags', 'chairs', 'tables', 'desks', 'birds', 'fish', 'insects', 'cars', 'buses', 'trucks', 'flowers', 'trees', 'plants', 'shirts', 'shoes', 'caps', 'doctors', 'lawyers', 'farmers', 'singers', 'poets', 'cooks'];
function gen(rng, forms, hint) {
  const nn = []; while (nn.length < 3) { const w = choose(rng, NOUNS); if (!nn.includes(w)) nn.push(w); }
  const [ps, c1, c2, label] = choose(rng, forms);
  const r = int(rng, 0, 3), { options, answer } = place(label, r);
  const why = { both: 'Both conclusions are certain in every possible drawing.', I: 'Only I holds in every possible drawing; II can be false.', II: 'Only II holds in every possible drawing; I can be false.', neither: 'In some drawing I is false, and in some drawing II is false.', either: 'Neither alone is certain, but they are opposites, so one of them is true.' }[label];
  return { q: stem(nn, ps, c1, c2), options, answer, n: 3, ps, c1, c2, label, r,
    sol: `${hint}<br>${why} So <b>${LABEL[label]}</b>.`,
    check() { const v = verdict(3, ps, c1, c2), a = place(v, r); return a.answer === answer && a.options.join('|') === options.join('|') ? answer : -1; } };
}
