// #733 Corpus concordancer: tokens, KWIC, frequencies, n-grams and collocation statistics.
// Reference values from an independent Python script (re tokeniser, collections.Counter, and
// scipy.stats.power_divergence(lambda_='log-likelihood') for G²) on the same made-up text.
import * as K from '../../src/lib/sci/kwic.ts';

const TEXT = `The river town wakes early. By six the tea stalls are open and the ferry is loading crates of fresh fish. People say the strong tea at the corner stall is the best in town, and the old ferry man drinks two cups before his first crossing.
In the dry season the river runs low and the ferry waits for the tide. Children walk along the bank and count the boats. When the tide turns, the ferry crosses again and the market fills with noise. Strong tea, hot bread and fresh fish are sold until noon.
Visitors often ask why the town never built a bridge. The answer is simple: the ferry is part of the town. A bridge would be faster, but the ferry is where people meet, share news and drink strong tea together.
`;
const B = 'The ferry is late today. Strong winds, strong tea, and a ferry full of fish.';

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
  const c = K.buildCorpus([{ name: 'a', text: TEXT }, { name: 'b', text: B }]);
  check('kwic: 151 tokens, 87 types (Python)', c.N === 151 && K.frequencies(c).length === 87);
  const f = K.frequencies(c);
  check('kwic: top words the 22, and 8, ferry 8', f[0].w === 'the' && f[0].n === 22 && f[1].w === 'and' && f[1].n === 8 && f[2].w === 'ferry' && f[2].n === 8);
  check('kwic: "the" is in both files', f[0].docs === 2);
  check('kwic: tokeniser keeps don\'t and well-known whole', K.tokenize("Don't stop, well-known 3.5 café").map((t) => t.w).join('|') === "Don't|stop|well-known|3|5|café");
  const b2 = K.ngrams(c, 2);
  check('kwic: bigrams the ferry 6, and the 4, ferry is 4, strong tea 4', b2[0].w === 'the ferry' && b2[0].n === 6 && b2[1].w === 'and the' && b2[2].w === 'ferry is' && b2[3].w === 'strong tea' && b2[3].n === 4);
  check('kwic: trigram the ferry is 4', K.ngrams(c, 3)[0].w === 'the ferry is' && K.ngrams(c, 3)[0].n === 4);
  const a = K.buildCorpus([{ name: 'a', text: TEXT }]), st3 = K.ngrams(a, 3, false, true);
  check('kwic: trigrams stopping at . ! ? ; : : 111 types, 114 tokens (Python re.split)', st3.length === 111 && st3.reduce((s, r) => s + r.n, 0) === 114 && st3[2].w === 'a bridge would');
  check('kwic: without stopping, "a bridge the" is counted', K.ngrams(a, 3).some((r) => r.w === 'a bridge the'));
  check('kwic: n-grams never cross files', !K.ngrams(c, 2).some((r) => r.w === 'together the'));

  const hits = K.findHits(c, K.compileQuery('ferry'));
  check('kwic: 8 hits for ferry', hits.length === 8);
  const r = K.collocates(c, hits, 3, 3);
  const and = r.rows.find((x) => x.w === 'and');
  check('kwic: ferry window 3+3: W 46 (union, node words left out)', r.W === 46);
  check('kwic: ferry/and O 5, E 2.437086, MI 1.036771, t 1.146170, G² 3.700616', and.O === 5 && near(and.E, 2.437086092715232) && near(and.MI, 1.0367708781554286) && near(and.T, 1.146169943433667) && near(and.G2, 3.70061602291384));
  const t = K.collocates(c, K.findHits(c, K.compileQuery('tea')), 2, 0), st = t.rows.find((x) => x.w === 'strong');
  check('kwic: tea left-only window: strong O 4, MI 3.594549, G² 18.560354', t.W === 10 && st.O === 4 && st.left === 4 && st.right === 0 && near(st.MI, 3.594548549550354) && near(st.G2, 18.56035395870856));
  check('kwic: G² of independent table is 0', near(K.g2(10, 20, 30, 60), 0, 1e-12));

  check('kwic: wildcard fer* finds ferry', K.findHits(c, K.compileQuery('fer*')).length === 8);
  check('kwic: phrase "strong tea" 4 hits', K.findHits(c, K.compileQuery('strong tea')).length === 4);
  check('kwic: match case: "Strong" 2 hits', K.findHits(c, K.compileQuery('Strong', { cs: true })).length === 2);
  check('kwic: regex t(ea|ide) 7 hits', K.findHits(c, K.compileQuery('t(ea|ide)', { regex: true })).length === 7);
  let msg = ''; try { K.compileQuery('t(ea', { regex: true }); } catch (e) { msg = e.message; }
  check('kwic: bad regex gives a plain message', /not a valid regular expression/.test(msg));
  const lines = K.kwic(c, hits, 3);
  check('kwic: first line context', lines[0].left === 'open and the ' && lines[0].node === 'ferry' && lines[0].right === ' is loading crates');
  const byR1 = K.kwic(c, hits, 3, 'R1').map((l) => l.R[0]);
  check('kwic: sort by R1 is alphabetical', byR1.join(',') === [...byR1].sort().join(','));
  const byL1 = K.kwic(c, hits, 3, 'L1').map((l) => l.L[0] ?? '');
  check('kwic: sort by L1 is alphabetical', byL1.join(',') === [...byL1].sort().join(','));
};
