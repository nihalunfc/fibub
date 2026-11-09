// #821 readability checker. The formulas were checked by feeding the same counts through textstat 0.7.13's own
// formula code (identical; textstat's Coleman-Liau uses 0.058 where the published formula has 0.0588). Syllable
// rules agree with the CMU Pronouncing Dictionary on 98.5 % of 5278 words from fibub's guides and 95.4 % of 6972
// held-out words (97.6 % of running text).
import { syllables, splitSentences, analyse, scores, freBand, passiveHints, words, EXAMPLE_TEXT } from '../../src/lib/sci/readability.ts';
export default async (check) => {
  const near = (a, b, t = 0.005) => Math.abs(a - b) <= t;
  const want = { cat: 1, the: 1, make: 1, makes: 1, table: 2, tables: 2, walked: 1, wanted: 2, boxes: 2, pages: 2, happy: 2, beyond: 2, player: 2, eye: 1,
    readability: 5, participate: 4, information: 4, university: 5, anonymised: 4, completely: 3, measurement: 3, baseline: 2, centre: 2, hundred: 2,
    studying: 3, doing: 2, saying: 2, organism: 4, catalogue: 3, unique: 2, million: 2, ratio: 3, video: 3, society: 4, client: 2, ppm: 3, DNA: 3, 'long-term': 2, "don't": 1, handled: 2, filled: 1, ago: 2, any: 2 };
  const bad = Object.entries(want).filter(([w, n]) => syllables(w) !== n);
  check(`readability: syllables of ${Object.keys(want).length} words (match the CMU dictionary) ${bad.map(([w]) => `${w}=${syllables(w)}`).join(' ')}`, bad.length === 0);
  // Scores from fixed counts: values from textstat's formula code with these counts.
  const c = { sentences: 8, words: 112, syllables: 196, letters: 558, poly: 23, complex: 22, longWords: 30 }, s = scores(c);
  check('readability: Flesch Reading Ease 44.58 and Flesch-Kincaid 10.52', near(s.fre, 44.575, 1e-9) && near(s.fk, 10.52, 1e-9));
  check('readability: Gunning Fog 13.457, SMOG 12.816', near(s.fog, 13.457143, 1e-5) && near(s.smog, 12.815533, 1e-5));
  check('readability: Coleman-Liau 11.38 (0.0588 x L), ARI 9.035', near(s.cli, 0.0588 * 498.214 - 0.296 * 7.142857 - 15.8, 1e-3) && near(s.ari, 4.71 * 558 / 112 + 0.5 * 14 - 21.43, 1e-9));
  check('readability: Flesch bands', freBand(95) === 'very easy' && freBand(65) === 'plain English' && freBand(44.6) === 'difficult' && freBand(10) === 'very difficult');
  const t = 'Dr. Smith gave e.g. 3.5 mg. The U.S. team met J. Smith at 10 a.m. today! Was it good? Yes.\nList item one\n- bullet two\nwrapped\nline';
  const sp = (o) => splitSentences(t, o).map((x) => t.slice(x.start, x.end));
  check('readability: sentences skip abbreviations, initials and decimals', JSON.stringify(sp(false)) === JSON.stringify(['Dr. Smith gave e.g. 3.5 mg.', 'The U.S. team met J. Smith at 10 a.m. today!', 'Was it good?', 'Yes.', 'List item one', '- bullet two\nwrapped\nline']));
  check('readability: each line a sentence when asked', sp(true).length === 8 && splitSentences('One two.\n\nThree four', false).length === 2);
  const a = analyse(EXAMPLE_TEXT);
  check('readability: example counts 8 sentences, 112 words, 196 syllables, 23 polysyllables, 22 complex', a.counts.sentences === 8 && a.counts.words === 112 && a.counts.syllables === 196 && a.counts.poly === 23 && a.counts.complex === 22 && a.counts.letters === 558);
  check('readability: example passive hints', a.passive.map((p) => p.text).join('|') === 'are invited|be asked|be stored|be anonymised');
  check('readability: example long sentence and plainer words', a.longSentences.length === 1 && a.longSentences[0].words === 29 && a.plain.map((p) => p.plain).join('|') === 'take part|taking part|stop|before|get');
  const p2 = 'The samples were carefully collected. It is red. They were given forms. She was tired, and he is seen.';
  const ws = words(p2, splitSentences(p2));
  check('readability: passive with an -ly word, irregular participles, no false hit on "is red"', passiveHints(p2, ws).map((h) => h.text).join('|') === 'were carefully collected|were given|was tired|is seen');
  check('readability: no words gives null; jargon list is matched case-insensitively', analyse('  -- ') === null && analyse('The Cohort was big. A cohort.', { jargon: ['cohort'] }).jargon.length === 2);
  check('readability: names and -ed/-ing/-es words are not Gunning complex words', analyse('We met Alexander there. Creating it was fine.').counts.complex === 0 && analyse('We met Alexander there. Creating it was fine.').counts.poly === 2);
};
