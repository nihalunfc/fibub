// IPA keyboard: X-SAMPA conversion (Wells 1995 table) and the symbol data. Every symbol's identity was
// checked against Python's unicodedata names (e.g. ɓ = LATIN SMALL LETTER B WITH HOOK, a voiced bilabial implosive).
import * as I from '../../src/lib/sci/ipa.ts';

export default async (check) => {
  const cases = [['D@ k{t', 'ðə kæt'], ['t_hIN', 'tʰɪŋ'], ['"fA:D@`', 'ˈfɑːðɚ'], ['t_S', 't\u0361ʃ'], ['n_d', 'n\u032A'], ['a_H', 'a\u0301'], ['b_<', 'ɓ'],
    ['r\\`', 'ɻ'], ['r\\', 'ɹ'], ['|\\|\\', 'ǁ'], ['J\\_<', 'ʄ'], ['e~', 'e\u0303'], ['n=', 'n\u0329'], ['p_>', 'pʼ'], ['<R>', '↗'], ['?\\', 'ʕ'], ['%', 'ˌ'], ['a:\\', 'aˑ'], ['g', 'ɡ'], ['M\\', 'ɰ'], ['4', 'ɾ'], ['s\\', 'ɕ']];
  const bad = cases.filter(([x, i]) => I.xsampaToIpa(x) !== i);
  check(`ipa: X-SAMPA to IPA (${bad.map((b) => b[0]).join(' ')})`, !bad.length);
  const back = cases.filter(([x, i]) => I.xsampaToIpa(I.ipaToXsampa(i)) !== i);
  check(`ipa: IPA to X-SAMPA and back (${back.map((b) => b[0]).join(' ')})`, !back.length);
  check('ipa: plain text passes through', I.xsampaToIpa('hello, world') === 'hello, world');
  check('ipa: 59 pulmonic consonants, 28 chart vowels, no symbol twice', I.PULMONIC.length === 59 && I.VOWELS.filter((v) => !v.rhotic).length === 28 && new Set(I.SEGMENTS.map((s) => s.ch)).size === I.SEGMENTS.length);
  check('ipa: descriptions', I.describe(I.SEGMENTS.find((s) => s.ch === 'ʂ')) === 'voiceless retroflex fricative' && I.describe(I.SEGMENTS.find((s) => s.ch === 'ɶ')) === 'open front rounded vowel' && I.describe(I.SEGMENTS.find((s) => s.ch === 'ǁ')) === 'alveolar lateral click');
  check('ipa: every diacritic marked combining or spacing correctly', I.DIACRITICS.every((d) => I.isCombining(d.ch) === /^[\u0300-\u036F\u1DC0-\u1DFF]$/.test(d.ch)));
  const inv = I.inventory('ˈtʰæ̃ŋk g!');
  check('ipa: transcription inventory with code points and names', inv.length === 9 && inv.find((r) => r.ch === '\u0303').name === 'nasalised' && inv.find((r) => r.ch === 'ʰ').code === 'U+02B0' && /U\+0261/.test(inv.find((r) => r.ch === 'g').name) && inv.find((r) => r.ch === '!').name === 'not an IPA symbol');
};
