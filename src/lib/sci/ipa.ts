// IPA symbols with their phonetic descriptions, organised as the IPA chart is (consonants by place and
// manner, vowels by height and backness, diacritics, suprasegmentals and tones), plus X-SAMPA to IPA
// conversion. Characters are Unicode code points; the descriptions are standard phonetic terms.
// Plain TypeScript, no DOM. The feature matrix tool (ipafeatures.ts) builds on these descriptions.

export const PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'] as const;
export type Place = typeof PLACES[number] | 'labial-velar' | 'labial-palatal' | 'alveolo-palatal' | 'epiglottal' | 'palato-alveolar-velar';
export const MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral fricative', 'approximant', 'lateral approximant'] as const;
export type Manner = typeof MANNERS[number] | 'lateral tap' | 'click' | 'implosive' | 'ejective' | 'affricate' | 'lateral click' | 'ejective fricative';
export const HEIGHTS = ['close', 'near-close', 'close-mid', 'mid', 'open-mid', 'near-open', 'open'] as const;
export const BACKS = ['front', 'near-front', 'central', 'near-back', 'back'] as const;
export type Height = typeof HEIGHTS[number];
export type Back = typeof BACKS[number];

export type Consonant = { kind: 'C'; ch: string; voice: boolean; place: Place; manner: Manner; release?: Manner };
export type Vowel = { kind: 'V'; ch: string; height: Height; back: Back; round: boolean; rhotic?: boolean };
export type Segment = Consonant | Vowel;

const C = (ch: string, voice: boolean, place: Place, manner: Manner): Consonant => ({ kind: 'C', ch, voice, place, manner });
const V = (ch: string, height: Height, back: Back, round: boolean): Vowel => ({ kind: 'V', ch, height, back, round });

/** Pulmonic consonants, in chart order (voiceless first in each cell). */
export const PULMONIC: Consonant[] = [
  C('p', false, 'bilabial', 'plosive'), C('b', true, 'bilabial', 'plosive'), C('t', false, 'alveolar', 'plosive'), C('d', true, 'alveolar', 'plosive'),
  C('ʈ', false, 'retroflex', 'plosive'), C('ɖ', true, 'retroflex', 'plosive'), C('c', false, 'palatal', 'plosive'), C('ɟ', true, 'palatal', 'plosive'),
  C('k', false, 'velar', 'plosive'), C('ɡ', true, 'velar', 'plosive'), C('q', false, 'uvular', 'plosive'), C('ɢ', true, 'uvular', 'plosive'), C('ʔ', false, 'glottal', 'plosive'),
  C('m', true, 'bilabial', 'nasal'), C('ɱ', true, 'labiodental', 'nasal'), C('n', true, 'alveolar', 'nasal'), C('ɳ', true, 'retroflex', 'nasal'), C('ɲ', true, 'palatal', 'nasal'), C('ŋ', true, 'velar', 'nasal'), C('ɴ', true, 'uvular', 'nasal'),
  C('ʙ', true, 'bilabial', 'trill'), C('r', true, 'alveolar', 'trill'), C('ʀ', true, 'uvular', 'trill'),
  C('ⱱ', true, 'labiodental', 'tap'), C('ɾ', true, 'alveolar', 'tap'), C('ɽ', true, 'retroflex', 'tap'),
  C('ɸ', false, 'bilabial', 'fricative'), C('β', true, 'bilabial', 'fricative'), C('f', false, 'labiodental', 'fricative'), C('v', true, 'labiodental', 'fricative'),
  C('θ', false, 'dental', 'fricative'), C('ð', true, 'dental', 'fricative'), C('s', false, 'alveolar', 'fricative'), C('z', true, 'alveolar', 'fricative'),
  C('ʃ', false, 'postalveolar', 'fricative'), C('ʒ', true, 'postalveolar', 'fricative'), C('ʂ', false, 'retroflex', 'fricative'), C('ʐ', true, 'retroflex', 'fricative'),
  C('ç', false, 'palatal', 'fricative'), C('ʝ', true, 'palatal', 'fricative'), C('x', false, 'velar', 'fricative'), C('ɣ', true, 'velar', 'fricative'),
  C('χ', false, 'uvular', 'fricative'), C('ʁ', true, 'uvular', 'fricative'), C('ħ', false, 'pharyngeal', 'fricative'), C('ʕ', true, 'pharyngeal', 'fricative'),
  C('h', false, 'glottal', 'fricative'), C('ɦ', true, 'glottal', 'fricative'),
  C('ɬ', false, 'alveolar', 'lateral fricative'), C('ɮ', true, 'alveolar', 'lateral fricative'),
  C('ʋ', true, 'labiodental', 'approximant'), C('ɹ', true, 'alveolar', 'approximant'), C('ɻ', true, 'retroflex', 'approximant'), C('j', true, 'palatal', 'approximant'), C('ɰ', true, 'velar', 'approximant'),
  C('l', true, 'alveolar', 'lateral approximant'), C('ɭ', true, 'retroflex', 'lateral approximant'), C('ʎ', true, 'palatal', 'lateral approximant'), C('ʟ', true, 'velar', 'lateral approximant'),
];

export const NON_PULMONIC: Consonant[] = [
  C('ʘ', false, 'bilabial', 'click'), C('ǀ', false, 'dental', 'click'), C('ǃ', false, 'postalveolar', 'click'), C('ǂ', false, 'palatal', 'click'), C('ǁ', false, 'alveolar', 'lateral click'),
  C('ɓ', true, 'bilabial', 'implosive'), C('ɗ', true, 'alveolar', 'implosive'), C('ʄ', true, 'palatal', 'implosive'), C('ɠ', true, 'velar', 'implosive'), C('ʛ', true, 'uvular', 'implosive'),
  C('pʼ', false, 'bilabial', 'ejective'), C('tʼ', false, 'alveolar', 'ejective'), C('kʼ', false, 'velar', 'ejective'), C('sʼ', false, 'alveolar', 'ejective fricative'),
];

export const OTHER: Consonant[] = [
  C('ʍ', false, 'labial-velar', 'approximant'), C('w', true, 'labial-velar', 'approximant'), C('ɥ', true, 'labial-palatal', 'approximant'),
  C('ʜ', false, 'epiglottal', 'fricative'), C('ʢ', true, 'epiglottal', 'fricative'), C('ʡ', false, 'epiglottal', 'plosive'),
  C('ɕ', false, 'alveolo-palatal', 'fricative'), C('ʑ', true, 'alveolo-palatal', 'fricative'), C('ɺ', true, 'alveolar', 'lateral tap'), C('ɧ', false, 'palato-alveolar-velar', 'fricative'),
  { ...C('t͡s', false, 'alveolar', 'affricate'), release: 'fricative' }, { ...C('d͡z', true, 'alveolar', 'affricate'), release: 'fricative' },
  { ...C('t͡ʃ', false, 'postalveolar', 'affricate'), release: 'fricative' }, { ...C('d͡ʒ', true, 'postalveolar', 'affricate'), release: 'fricative' },
  { ...C('t͡ɬ', false, 'alveolar', 'affricate'), release: 'lateral fricative' }, { ...C('p͡f', false, 'labiodental', 'affricate'), release: 'fricative' },
  C('k͡p', false, 'labial-velar', 'plosive'), C('ɡ͡b', true, 'labial-velar', 'plosive'), C('ŋ͡m', true, 'labial-velar', 'nasal'), C('ɫ', true, 'alveolar', 'lateral approximant'),
];

export const VOWELS: Vowel[] = [
  V('i', 'close', 'front', false), V('y', 'close', 'front', true), V('ɨ', 'close', 'central', false), V('ʉ', 'close', 'central', true), V('ɯ', 'close', 'back', false), V('u', 'close', 'back', true),
  V('ɪ', 'near-close', 'near-front', false), V('ʏ', 'near-close', 'near-front', true), V('ʊ', 'near-close', 'near-back', true),
  V('e', 'close-mid', 'front', false), V('ø', 'close-mid', 'front', true), V('ɘ', 'close-mid', 'central', false), V('ɵ', 'close-mid', 'central', true), V('ɤ', 'close-mid', 'back', false), V('o', 'close-mid', 'back', true),
  V('ə', 'mid', 'central', false),
  V('ɛ', 'open-mid', 'front', false), V('œ', 'open-mid', 'front', true), V('ɜ', 'open-mid', 'central', false), V('ɞ', 'open-mid', 'central', true), V('ʌ', 'open-mid', 'back', false), V('ɔ', 'open-mid', 'back', true),
  V('æ', 'near-open', 'front', false), V('ɐ', 'near-open', 'central', false),
  V('a', 'open', 'front', false), V('ɶ', 'open', 'front', true), V('ɑ', 'open', 'back', false), V('ɒ', 'open', 'back', true),
  { ...V('ɚ', 'mid', 'central', false), rhotic: true }, { ...V('ɝ', 'open-mid', 'central', false), rhotic: true },
];

export const SEGMENTS: Segment[] = [...PULMONIC, ...NON_PULMONIC, ...OTHER, ...VOWELS];

/** A plain description such as "voiceless bilabial plosive" or "close front unrounded vowel". */
export function describe(s: Segment): string {
  if (s.kind === 'V') return `${s.height} ${s.back} ${s.round ? 'rounded' : 'unrounded'}${s.rhotic ? ' rhotacised' : ''} vowel`;
  if (s.manner === 'click' || s.manner === 'lateral click') return `${s.place}${s.manner === 'lateral click' ? ' lateral' : ''} click`;
  return `${s.voice ? 'voiced' : 'voiceless'} ${s.ch === 'ɫ' ? 'velarised ' : ''}${s.place} ${s.manner}`;
}

export type Mark = { ch: string; name: string; xs?: string };
/** Combining diacritics (shown on ◌) and spacing modifier letters. */
export const DIACRITICS: Mark[] = [
  { ch: '̥', name: 'voiceless', xs: '_0' }, { ch: '̊', name: 'voiceless (above, for letters with descenders)' }, { ch: '̬', name: 'voiced', xs: '_v' }, { ch: 'ʰ', name: 'aspirated', xs: '_h' },
  { ch: '̹', name: 'more rounded', xs: '_O' }, { ch: '̜', name: 'less rounded', xs: '_c' }, { ch: '̟', name: 'advanced', xs: '_+' }, { ch: '̠', name: 'retracted', xs: '_-' },
  { ch: '̈', name: 'centralised', xs: '_"' }, { ch: '̽', name: 'mid-centralised', xs: '_x' }, { ch: '̩', name: 'syllabic', xs: '=' }, { ch: '̯', name: 'non-syllabic', xs: '_^' },
  { ch: '˞', name: 'rhoticity', xs: '`' }, { ch: '̤', name: 'breathy voiced', xs: '_t' }, { ch: '̰', name: 'creaky voiced', xs: '_k' }, { ch: '̼', name: 'linguolabial', xs: '_N' },
  { ch: 'ʷ', name: 'labialised', xs: '_w' }, { ch: 'ʲ', name: 'palatalised', xs: '_j' }, { ch: 'ˠ', name: 'velarised', xs: '_G' }, { ch: 'ˤ', name: 'pharyngealised', xs: '_?\\' },
  { ch: '̴', name: 'velarised or pharyngealised', xs: '_e' }, { ch: '̝', name: 'raised', xs: '_r' }, { ch: '̞', name: 'lowered', xs: '_o' }, { ch: '̘', name: 'advanced tongue root', xs: '_A' },
  { ch: '̙', name: 'retracted tongue root', xs: '_q' }, { ch: '̪', name: 'dental', xs: '_d' }, { ch: '̺', name: 'apical', xs: '_a' }, { ch: '̻', name: 'laminal', xs: '_m' },
  { ch: '̃', name: 'nasalised', xs: '~' }, { ch: 'ⁿ', name: 'nasal release', xs: '_n' }, { ch: 'ˡ', name: 'lateral release', xs: '_l' }, { ch: '̚', name: 'no audible release', xs: '_}' },
  { ch: 'ʼ', name: 'ejective', xs: '_>' }, { ch: '͡', name: 'tie bar above (affricates, double articulations)', xs: '_' }, { ch: '͜', name: 'tie bar below' },
];
export const SUPRA: Mark[] = [
  { ch: 'ˈ', name: 'primary stress', xs: '"' }, { ch: 'ˌ', name: 'secondary stress', xs: '%' }, { ch: 'ː', name: 'long', xs: ':' }, { ch: 'ˑ', name: 'half-long', xs: ':\\' },
  { ch: '̆', name: 'extra-short', xs: '_X' }, { ch: '|', name: 'minor (foot) group', xs: '|' }, { ch: '‖', name: 'major (intonation) group', xs: '||' }, { ch: '.', name: 'syllable break', xs: '.' }, { ch: '‿', name: 'linking (absence of a break)', xs: '-\\' },
];
export const TONES: Mark[] = [
  { ch: '̋', name: 'extra high tone', xs: '_T' }, { ch: '́', name: 'high tone', xs: '_H' }, { ch: '̄', name: 'mid tone', xs: '_M' }, { ch: '̀', name: 'low tone', xs: '_L' }, { ch: '̏', name: 'extra low tone', xs: '_B' },
  { ch: '˥', name: 'extra high tone letter' }, { ch: '˦', name: 'high tone letter' }, { ch: '˧', name: 'mid tone letter' }, { ch: '˨', name: 'low tone letter' }, { ch: '˩', name: 'extra low tone letter' },
  { ch: '̌', name: 'rising tone', xs: '_R' }, { ch: '̂', name: 'falling tone', xs: '_F' }, { ch: '᷄', name: 'high rising tone', xs: '_H_T' }, { ch: '᷅', name: 'low rising tone', xs: '_B_L' }, { ch: '᷈', name: 'rising-falling tone', xs: '_R_F' },
  { ch: 'ꜜ', name: 'downstep', xs: '!' }, { ch: 'ꜛ', name: 'upstep', xs: '^' }, { ch: '↗', name: 'global rise', xs: '<R>' }, { ch: '↘', name: 'global fall', xs: '<F>' },
];

/** Is this character a combining mark (drawn on the previous letter)? */
export const isCombining = (ch: string) => /^\p{M}+$/u.test(ch);
export const codePoints = (s: string) => [...s].map((c) => 'U+' + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')).join(' ');

/** X-SAMPA (Wells 1995) to IPA, longest match first. */
const XS: [string, string][] = [
  ['A', 'ɑ'], ['B', 'β'], ['C', 'ç'], ['D', 'ð'], ['E', 'ɛ'], ['F', 'ɱ'], ['G', 'ɣ'], ['H', 'ɥ'], ['I', 'ɪ'], ['J', 'ɲ'], ['K', 'ɬ'], ['L', 'ʎ'], ['M', 'ɯ'], ['N', 'ŋ'],
  ['O', 'ɔ'], ['P', 'ʋ'], ['Q', 'ɒ'], ['R', 'ʁ'], ['S', 'ʃ'], ['T', 'θ'], ['U', 'ʊ'], ['V', 'ʌ'], ['W', 'ʍ'], ['X', 'χ'], ['Y', 'ʏ'], ['Z', 'ʒ'], ['g', 'ɡ'],
  ['@', 'ə'], ['@\\', 'ɘ'], ['@`', 'ɚ'], ['{', 'æ'], ['}', 'ʉ'], ['1', 'ɨ'], ['2', 'ø'], ['3', 'ɜ'], ['3\\', 'ɞ'], ['3`', 'ɝ'], ['4', 'ɾ'], ['5', 'ɫ'], ['6', 'ɐ'], ['7', 'ɤ'], ['8', 'ɵ'], ['9', 'œ'], ['&', 'ɶ'],
  ['?', 'ʔ'], ['?\\', 'ʕ'], ['<\\', 'ʢ'], ['>\\', 'ʡ'], ['!\\', 'ǃ'], ['|\\', 'ǀ'], ['|\\|\\', 'ǁ'], ['=\\', 'ǂ'], ['O\\', 'ʘ'],
  ['B\\', 'ʙ'], ['G\\', 'ɢ'], ['G\\_<', 'ʛ'], ['H\\', 'ʜ'], ['I\\', 'ᵻ'], ['J\\', 'ɟ'], ['J\\_<', 'ʄ'], ['K\\', 'ɮ'], ['L\\', 'ʟ'], ['M\\', 'ɰ'], ['N\\', 'ɴ'], ['R\\', 'ʀ'], ['U\\', 'ᵿ'], ['X\\', 'ħ'],
  ['b_<', 'ɓ'], ['d_<', 'ɗ'], ['g_<', 'ɠ'], ['d`', 'ɖ'], ['l`', 'ɭ'], ['n`', 'ɳ'], ['r`', 'ɽ'], ['s`', 'ʂ'], ['t`', 'ʈ'], ['z`', 'ʐ'],
  ['h\\', 'ɦ'], ['j\\', 'ʝ'], ['l\\', 'ɺ'], ['p\\', 'ɸ'], ['r\\', 'ɹ'], ['r\\`', 'ɻ'], ['s\\', 'ɕ'], ['x\\', 'ɧ'], ['z\\', 'ʑ'], ['v\\', 'ʋ'], ['4\\', 'ⱱ'],
  ["'", 'ʲ'], ['`', '˞'], ['=', '̩'], ['~', '̃'], ['-', ''],
  ...[...DIACRITICS, ...SUPRA, ...TONES].filter((d) => d.xs && !['=', '~', '`', '.', '|', '"', '%', ':', '!', '^'].includes(d.xs)).map((d) => [d.xs!, d.ch] as [string, string]),
  ['"', 'ˈ'], ['%', 'ˌ'], [':', 'ː'], ['!', 'ꜜ'], ['^', 'ꜛ'], ['_~', '̃'], ['_=', '̩'],
];
const XS_SORTED = [...new Map(XS).entries()].sort((a, b) => b[0].length - a[0].length);

/** Convert X-SAMPA text to IPA. Anything not in the table (spaces, lowercase letters that are the same in IPA) is kept. */
export function xsampaToIpa(s: string): string {
  let out = '';
  for (let i = 0; i < s.length;) {
    const hit = XS_SORTED.find(([k]) => s.startsWith(k, i));
    if (hit) { out += hit[1]; i += hit[0].length; } else { out += s[i]; i++; }
  }
  return out;
}

const IPA_TO_XS = (() => {
  const m = new Map<string, string>();
  for (const [k, v] of XS) if (v && !m.has(v) && !k.startsWith('_~') && !k.startsWith('_=')) m.set(v, k);
  m.set('ɡ', 'g'); m.set('ʲ', '_j');
  return [...m.entries()].sort((a, b) => b[0].length - a[0].length);
})();
/** IPA back to X-SAMPA (characters with no X-SAMPA code are kept). */
export function ipaToXsampa(s: string): string {
  let out = '';
  for (let i = 0; i < s.length;) {
    const hit = IPA_TO_XS.find(([k]) => s.startsWith(k, i));
    if (hit) { out += hit[1]; i += hit[0].length; } else { out += s[i]; i++; }
  }
  return out;
}

/** Name of one IPA character or symbol, if known. */
export function nameOf(ch: string): string | null {
  const seg = SEGMENTS.find((s) => s.ch === ch);
  if (seg) return describe(seg);
  const mk = [...DIACRITICS, ...SUPRA, ...TONES].find((d) => d.ch === ch);
  if (mk) return mk.name;
  if (ch === 'ᵻ') return 'near-close central unrounded vowel (non-IPA convenience symbol)';
  if (ch === 'ᵿ') return 'near-close central rounded vowel (non-IPA convenience symbol)';
  if (ch === 'g') return 'g typed from the keyboard (the IPA letter is ɡ, U+0261)';
  return null;
}

/** Split a transcription into characters with their code points and names. */
export function inventory(s: string): { ch: string; code: string; name: string; count: number }[] {
  const m = new Map<string, number>();
  for (const c of s) if (!/\s/.test(c)) m.set(c, (m.get(c) ?? 0) + 1);
  return [...m.entries()].map(([ch, count]) => ({ ch, code: codePoints(ch), name: nameOf(ch) ?? (/[a-z]/i.test(ch) ? 'letter (not an IPA symbol on its own)' : 'not an IPA symbol'), count }));
}
