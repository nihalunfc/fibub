// #806 Abstract word counter. Sentence counts matched pysbd (a rule-based sentence splitter) on eight made-up
// abstracts with decimals, et al., Fig., e.g., i.e., U.S., initials, quotes and questions; word counts matched
// Python's split-and-keep-tokens-with-a-letter-or-digit and `wc -w` (wc also counts a lone ± as a word; we do
// not, as word processors do not count a symbol on its own); character counts matched Python len().
import { count, sentences, stripLatex, overflowAt, topWords, keywords, wordSpans, PRESETS, EXAMPLE } from '../../src/lib/sci/wordcount.ts';

export default async (check) => {
  const c1 = count('We measured 3.5 mg of NaCl. The yield was 92%! Is that high? Yes, it is.');
  check('wc: words, sentences, characters', c1.words === 16 && c1.sentences === 4 && c1.chars === 72 && c1.charsNoSpace === 57);
  check('wc: abbreviations do not end sentences', sentences('Smith et al. (2020) showed this in Fig. 2. We confirm it, i.e. the trend is real. Dr. Jones agreed.').length === 3);
  check('wc: initials and U.S.', sentences('A. B. Smith wrote the code. The U.S. data were used. Then we stopped.').length === 3);
  check('wc: structured abstract', count('Background: Hypertension is common. Methods: We surveyed 1,000 adults. Results: 30% had high blood pressure. Conclusions: Screening helps.').sentences === 4);
  check('wc: symbols alone are not words; hyphenated and decimals are one', count('15 ± 3 cm, two-component 2.5-m — and/or').words === 6);
  check('wc: paragraphs', count('One para.\n\nTwo para.\n\n\nThree.').paragraphs === 3);
  check('wc: empty', count('').words === 0 && count('').sentences === 0);

  check('latex: citations, refs, labels, comments go; maths is one word', stripLatex('We use $E=mc^2$ \\citep[see][]{a,b} and Eq.~\\eqref{e1}\\label{x}. 50\\% % hidden\nDone \\cite{z}.') === 'We use [math] and Eq. [ref]. 50% Done.');
  check('latex: formatting kept, accents to letters', stripLatex('\\textit{In situ} and \\emph{very} \\textbf{bold} caf\\\'e na\\"ive') === 'In situ and very bold café naïve');
  check('latex: display maths and environments', count(stripLatex('Before \\begin{equation} a = b \\end{equation} after \\[ x \\] end.')).words === 5);
  const ex = stripLatex(EXAMPLE);
  const ce = count(ex);
  check('example: 112 words, 6 sentences after LaTeX removal', ce.words === 112 && ce.sentences === 6 && !ex.includes('citep') && !ex.includes('comment'));
  check('example: raw LaTeX counts more words', count(EXAMPLE).words === 119);

  check('overflow: words', overflowAt('one two three four', 2, 'words') === 8 && overflowAt('one two', 2, 'words') === -1);
  check('overflow: characters with and without spaces', overflowAt('ab cd', 3, 'chars') === 3 && overflowAt('ab cd', 3, 'charsNoSpace') === 4 && overflowAt('ab cd', 4, 'charsNoSpace') === -1);
  check('overflow: example over 100 words starts at word 101', ex.slice(overflowAt(ex, 100, 'words')).startsWith(ex.slice(wordSpans(ex)[100][0])));
  check('top words', JSON.stringify(topWords(ex).slice(0, 2)) === '[["discs",3],["formation",2]]' && !topWords(ex).some(([w]) => w === 'math'));
  const k = keywords('galaxies; star formation, dark matter\n', ex);
  check('keywords', k.length === 3 && k[0].inText && k[1].inText && !k[2].inText);
  check('presets are examples with units', PRESETS.length === 4 && PRESETS.every((p) => p.limit > 0 && ['words', 'chars', 'charsNoSpace'].includes(p.unit)));
};
