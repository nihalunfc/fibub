// IPA feature matrix: feature values derived by rule, checked against the standard phonetic descriptions;
// the minimal-feature search checked against a brute-force search with Python itertools on 64 sets.
import * as F from '../../src/lib/sci/ipafeatures.ts';

export default async (check) => {
  const INV = 'p t k b d ɡ f θ s ʃ v ð z ʒ t͡ʃ d͡ʒ m n ŋ l ɹ j w h i ɪ e ɛ æ ɑ ɔ o ʊ u ə ʌ';
  const { segs, unknown } = F.parseSegments(INV);
  check('features: example inventory read', segs.length === 36 && !unknown.length);
  const f = (ch) => segs.find((s) => s.text === ch).f;
  const has = (ch, spec) => F.matches(f(ch), F.parseSpec(spec));
  check('features: s is a voiceless anterior strident coronal fricative', has('s', '+cons −son +cont −voice +coronal +anterior −distributed +strident −lateral'));
  check('features: θ is a non-strident distributed dental', has('θ', '+coronal +anterior +distributed −strident +cont'));
  check('features: t͡ʃ is an affricate (−continuant, +delayed release)', has('t͡ʃ', '−cont +delayed release +strident −anterior'));
  check('features: nasals are sonorant stops', has('m', '+nasal +son −cont +labial') && has('ŋ', '+nasal +dorsal +high +back'));
  check('features: glides are −consonantal sonorants', has('j', '−cons +son +dorsal +high +front −back') && has('w', '−cons +labial +round +dorsal +back'));
  check('features: vowels by height, backness, rounding and tenseness', has('i', '+syl +high −low −back +tense') && has('ɪ', '+high −tense') && has('æ', '+low +front') && has('u', '+round +back +high') && has('ə', '−high −low −front −back'));
  check('features: place features undefined (0) where they do not apply', f('p').anterior === '0' && f('t').high === '0' && f('k').round === '0' && f('m').strident === '0');
  const d = F.parseSegments('kʷʰ aː ẽ n̩ tʼ ʧ t̪ s̬').segs;
  check('features: diacritics change the bundle', d.length === 8 && d[0].f.round === '+' && d[0].f['spread glottis'] === '+' && d[1].f.long === '+' && d[2].f.nasal === '+' && d[3].f.syllabic === '+' && d[4].f['constricted glottis'] === '+' && d[5].text === 't͡ʃ' && d[6].f.distributed === '+' && d[7].f.voice === '+');
  check('features: unknown symbols reported', F.parseSegments('p ☺ q').unknown.join() === '☺');
  const inv = segs.map((s) => s.f), idx = (l) => l.split(' ').map((c) => segs.findIndex((s) => s.text === c));
  const mt = (l) => F.minimalSets(inv, idx(l), 100);
  const txt = (r) => r.sets.map(F.specText).join(' | ');
  // Expected minimal sets from the Python brute-force search over every combination of shared features.
  check('features: [+nasal] picks out m n ŋ', txt(mt('m n ŋ')) === '[+nasal]');
  check('features: p t k need two features', txt(mt('p t k')) === '[−delayed release, −voice]');
  check('features: sibilants', txt(mt('s z ʃ ʒ t͡ʃ d͡ʒ')) === '[−labial, +strident] | [+coronal, +strident]');
  check('features: high vowels and tense', txt(mt('i u')) === '[+high, +tense]');
  const nn = mt('p z');
  check('features: p and z are not a natural class here', !nn.natural && nn.extra.length > 0);
  check('features: shared features of b d ɡ', F.specText(F.shared(idx('b d ɡ').map((i) => inv[i]))).includes('+voice') && F.specText(F.shared(idx('b d ɡ').map((i) => inv[i]))).includes('−continuant'));
  check('features: feature specs with short names', JSON.stringify(F.parseSpec('+voice −son, -cont')) === JSON.stringify([['voice', '+'], ['sonorant', '-'], ['continuant', '-']]));
  let msg = ''; try { F.parseSpec('+wobbly'); } catch (e) { msg = e.message; }
  check('features: unknown feature name explained', /not a feature/.test(msg));
  check('features: LaTeX tabular', F.toLatex(segs.slice(0, 2), ['voice', 'nasal']) === '\\begin{tabular}{l|cc}\n & p & t \\\\\n\\hline\nvoice & $-$ & $-$ \\\\\nnasal & $-$ & $-$ \\\\\n\\end{tabular}\n');
};
