// #736 Lexical diversity and readability. Reference values from an independent Python script written for this
// tool (naive window slicing for MATTR and MTLD, scipy.stats.hypergeom for HD-D, Counter for Yule's K, and the
// readability formulas with the same heuristic syllable rules) on the made-up example text: all 23 values agree.
import * as D from '../../src/lib/sci/lexdiv.ts';

const TEXT = "Our school garden started as a bare patch of clay behind the sports hall. In the first spring, a group of students dug four beds, mixed in compost from the kitchen and planted beans, potatoes and marigolds. Nothing grew well. The clay held water after every storm, and the roots rotted.\nThe next year we tried again with raised beds. A retired carpenter showed us how to build frames from old pallets, and the science teacher helped us measure the soil every week. We recorded temperature, moisture and the height of each plant in a shared notebook.\nBy midsummer the difference was obvious. The beans climbed past the fence, the potatoes produced a generous harvest, and visitors stopped to ask questions. Younger pupils now help with watering, and the canteen serves our vegetables twice a month. What began as an unpromising corner has become an outdoor classroom where measurement, patience and teamwork matter more than any test score.\n";
const PY = { N: 158, V: 116, ttr: 0.7341772151898734, rttr: 9.228464496438468, logttr: 0.9389631523152177, mattr: 0.8372477064220183, mtld: 147.02102564102566, hdd: 0.8579262417763405, yuleK: 122.5765101746515, words: 158, sentences: 11, syllables: 228, polysyllables: 17, complex: 15, fre: 70.17489643268127, fkgl: 7.039666283084006, fog: 9.542922899884926, smog: 10.230975488527342, cli: 10.46, ari: 8.437324510932108 };

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
  const t = D.tokens(TEXT), d = D.diversity(t), r = D.readability(TEXT);
  for (const k of ['N', 'V', 'ttr', 'rttr', 'logttr', 'mattr', 'mtld', 'hdd', 'yuleK']) check(`lexdiv: ${k} = ${PY[k]} (Python)`, near(d[k], PY[k]));
  for (const k of ['words', 'sentences', 'syllables', 'polysyllables', 'complex', 'fre', 'fkgl', 'fog', 'smog', 'cli', 'ari']) check(`lexdiv: ${k} = ${PY[k]} (Python)`, near(r[k], PY[k]));
  check('lexdiv: MATTR window 20 = 0.919784 (Python)', near(D.mattr(t, 20).value, 0.9197841726618705));
  check('lexdiv: MTLD threshold 0.8 = 74.511364 (Python)', near(D.mtld(t, 0.8).value, 74.51136363636363));
  check('lexdiv: HD-D sample 30 = 0.884345 (scipy hypergeom)', near(D.hdd(t, 30), 0.8843445370177071));
  // Hand checks
  check('lexdiv: Yule K of a b a b = 10⁴·(8−4)/16 = 2500', near(D.yuleK(['a', 'b', 'a', 'b']), 2500));
  check('lexdiv: MATTR of a b a b, window 2 = 1', near(D.mattr(['a', 'b', 'a', 'b'], 2).value, 1));
  check('lexdiv: MATTR needs at least a window of tokens', Number.isNaN(D.mattr(['a', 'b'], 50).value));
  check('lexdiv: MTLD of all-different words is N/((1−1)/0.28) → Infinity', D.mtld(['a', 'b', 'c']).value === Infinity);
  check('lexdiv: MTLD factor: a a a a (TTR 0.5 at 2nd) = 2 full factors', near(D.mtldFactors(['a', 'a', 'a', 'a']), 2));
  check('lexdiv: HD-D of one repeated word = 1/42', near(D.hdd(Array(50).fill('x')), 1 / 42));
  const syl = { beautiful: 3, table: 2, jumped: 1, wanted: 2, make: 1, the: 1, generous: 3, yesterday: 3, cat: 1, reading: 2, education: 4 };
  check('lexdiv: syllable rules on common words', Object.entries(syl).every(([w, n]) => D.syllables(w) === n));
  check('lexdiv: sentences split at . ! ? before a capital', D.sentences('It rained. Did it? Yes! e.g. not here. 3 more.').length === 4);
  check('lexdiv: fog skips -ed/-ing endings and compounds', D.complexWord('interested') && !D.complexWord('well-organised') && !D.complexWord('agreeing') && D.complexWord('generous'));
  check('lexdiv: Flesch ease band', D.easeBand(70.17) === 'fairly easy' && D.easeBand(25) === 'very difficult');
  // Pinned by the blog article on ChatGPT and student essays (Fredrick and Craven 2025, Front. Educ. 10:
  // 1616935): the 111-word passage written for that article, with the tool's default settings.
  const P = 'A measure of lexical diversity puts a number on repetition. The oldest one divides the different words by all the words, which punishes a long text for its length alone. A moving window of fifty words avoids that, and so does a measure that asks how far you can read before the ratio drops. A third kind works out what a random sample of a fixed size would show. All of them agree on big differences and quarrel over small ones, so a study that reports a wide gap on one scale and a narrow gap on another is not catching a contradiction. It is reading one difference off two rulers.';
  const pd = D.diversity(D.tokens(P)), pr = D.readability(P);
  check('lexdiv: article passage diversity (111 words, 78 types)', pd.N === 111 && pd.V === 78 && near(pd.ttr, 0.70270270, 1e-7) && near(pd.mattr, 0.81580645, 1e-7) && near(pd.mtld, 79.26510721, 1e-7) && near(pd.hdd, 0.81650276, 1e-7) && Math.abs(pd.yuleK - 163.947732) < 1e-5);
  check('lexdiv: article passage readability (Flesch 69.92, grade 8.10)', pr.sentences === 6 && Math.abs(pr.fre - 69.922365) < 1e-5 && Math.abs(pr.fkgl - 8.102477) < 1e-5 && Math.abs(pr.fog - 10.282883) < 1e-5);
};
