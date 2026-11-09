// Readability of English text: sentences, words and syllables counted by rules (no dictionary), then the
// Flesch Reading Ease, Flesch-Kincaid grade, Gunning Fog, SMOG, Coleman-Liau and Automated Readability Index,
// plus long sentences, passive-voice hints, long words and plainer-word suggestions. No DOM.

// ---------- syllables ----------
// Words whose rule-based count is wrong often enough to list. General English, written by fibub.
const SYL_EXCEPT: Record<string, number> = {
  the: 1, every: 2, everyone: 3, everything: 3, everybody: 4, everyday: 3, any: 2, many: 2, argue: 2, react: 2, reaction: 3, reactions: 3, ideal: 2, naked: 2, pier: 1,  business: 2, businesses: 3, different: 3, evening: 2, family: 3,
  interest: 3, interesting: 4, several: 3, general: 3, generally: 4, camera: 3, chocolate: 3, vegetable: 4,
  people: 2, area: 3, areas: 3, idea: 3, ideas: 3, real: 1, really: 2, create: 2, created: 3, creates: 2, creating: 3, creation: 3,
  science: 2, scientist: 3, scientists: 3, scientific: 4, quiet: 2, diet: 2, client: 2, clients: 2, being: 2, doing: 2, going: 2, seeing: 2,
  poem: 2, poet: 2, lion: 2, ion: 2, ions: 2, video: 3, radio: 3, ratio: 3, period: 3, periods: 3, serious: 3, previous: 3, various: 3,
  experience: 4, experiences: 5, variable: 4, variables: 4, iodine: 3, piano: 3, cereal: 3, theory: 3, theories: 3, theatre: 3,
  theater: 3, usual: 3, usually: 4, actual: 3, actually: 4, gradual: 3, gradually: 4, individual: 5, individuals: 5, annual: 3, manual: 3,
  visual: 3, mutual: 3, situation: 4, evaluate: 4, evaluation: 5, graduate: 3, February: 4, january: 4, library: 3, naive: 2, maybe: 2,
  someone: 2, something: 2, sometimes: 2, somewhere: 2, anyone: 3, everywhere: 3, whatever: 3, however: 3, forever: 3, beautiful: 3,
  useful: 2, careful: 2, lifetime: 2, likely: 2, lonely: 2, safety: 2, homework: 2, statement: 2, movement: 2, management: 3, therefore: 2,
  hour: 1, hours: 1, our: 1, fire: 1, tired: 1, higher: 2, choir: 1, aisle: 1, isle: 1, mayor: 2, layer: 2, prayer: 1, player: 2,
  recipe: 3, simile: 3, apostrophe: 4, epitome: 4, coyote: 3, acne: 2, catastrophe: 4, anemone: 4, karate: 3, adobe: 3,
  data: 2, via: 2, media: 3, criteria: 4, bacteria: 4, trial: 2, trials: 2, dial: 2, denial: 3, social: 2, special: 2, official: 3,
  potential: 3, essential: 3, initial: 3, financial: 3, crucial: 2, partial: 2, commercial: 3, material: 4, materials: 4,
  qualified: 3, quiz: 1, queue: 1, ok: 2, wednesday: 2, colonel: 2, cooperate: 4, cooperation: 5, coordinate: 4,
  reenter: 3, preexisting: 4, reuse: 2, reused: 2, reusing: 3, identity: 4, identify: 4, identified: 4,
};
const COMPOUND = /(by|of|over|going|marks?|holders?|keeping|writers?|ground|pieces?|lines?|lengths?|ways?|craft|water|books?|times?|stones?|where|casts?|ments?|ly|ful|fully|less|ness|work|side)$/;
/** Syllables in one word, by rules: vowel groups, silent final e, -le, -ed, -es, compounds and suffixes after a
 * silent e, and a short list of exceptions. Letters-only abbreviations (ppm, DNA) count a syllable per letter. */
export function syllables(word: string): number {
  const raw = word.replace(/[’'.]/g, '');
  if (/^\p{Lu}{2,3}$/u.test(raw) && !/^[AEIOU][A-Z]*$/.test(raw) && raw !== 'ID') return [...raw].reduce((a, ch) => a + (ch === 'W' ? 3 : 1), 0);
  const w = raw.toLowerCase().replace(/[^a-z\-]/g, '');
  if (!w) return /\p{N}/u.test(word) ? 1 : 0;
  if (w.includes('-')) return w.split('-').filter(Boolean).reduce((a, p) => a + syllables(p), 0);
  if (SYL_EXCEPT[w] != null) return SYL_EXCEPT[w];
  if (!/[aeiouy]/.test(w)) return [...w].reduce((a, ch) => a + (ch === 'w' ? 3 : 1), 0);
  // Plural or third-person -s on a listed word.
  if (w.length > 3 && w.endsWith('s') && SYL_EXCEPT[w.slice(0, -1)] != null) return SYL_EXCEPT[w.slice(0, -1)] + (/(s|x|z|ch|sh|ce|ge|se|ze)$/.test(w.slice(0, -1)) ? 1 : 0);
  // A suffix or second word after a silent e (completely, baseline, measurement): count the parts.
  const cm = COMPOUND.exec(w);
  if (cm) { const stem = w.slice(0, -cm[1].length); if (stem.length >= 4 && /[aeiouy][^aeiouy]+e$/.test(stem) && !/[^aeiouy]le$/.test(stem)) return syllables(stem) + syllables(cm[1]); }
  // y before a vowel is a consonant (yes, beyond, player).
  const v = w.replace(/y(?=[aeiou])/g, 'j');
  let n = (v.match(/[aeiouy]+/g) ?? []).length;
  const syllabicRe = /[^aeiouyr]r(e|es|ed)$/.test(w); // centre, acres, hundred
  // Silent final e (make, home), but not -le after a consonant (table), -re after a consonant (centre), -ee or -ye.
  if (/[^aeiouy]e$/.test(v) && !/[^aeiouy]le$/.test(w) && !syllabicRe && n > 1) n--;
  // -es after most consonants is silent (makes, homes), but not after s, x, z, ch, sh, c, g (boxes, pages).
  else if (/[^aeiouy]es$/.test(v) && !/([sxz]|ch|sh|[cg])es$/.test(w) && !/[^aeiouy]les$/.test(w) && !syllabicRe && n > 1) n--;
  // -ed is silent unless after t or d (walked vs wanted) or -led after a consonant (handled).
  else if (/[^aeiouy]ed$/.test(v) && !/[td]ed$/.test(w) && !/[^aeiouyl]led$/.test(w) && !syllabicRe && n > 1) n--;
  // -gue and -que at the end are silent (league, unique, catalogue).
  if (/[gq]ues?$/.test(w) && n > 1) n--;
  // Vowel pairs that are usually two syllables.
  let add = (w.match(/(?:ia|io|iu|ua|uo|eo|ii|coe|[aeo]ic$|(?<![cstx])ien(?=t|ce)|(?<!q)uen|(?<=^c?r)ea(?=ct|tor|tiv|lis|lit)|(?<=nu)cle(?=[aiou])|(?<=in)ea(?=r)|(?<=[cr])ie(?=ty)|[^aeiou]i(?=ers?$|est$))/g) ?? []).length;
  // ...but not in -tion, -sion, -cian, -cial, -tial, -gion, -cious, -lion, -nion, after qu, or in -gua.
  add -= (w.match(/(?:[tscx]i(?:on|an|al|ous|ent|ence|a$)|gi(?:on|ous)|[ln]i(?:on|ar|or|ant)|shi(?:on)|qu[aeio]|gua)/g) ?? []).length;
  n += Math.max(0, add);
  // -ism and -thm (organism, rhythm) end with an extra syllable.
  if (/(?:[^aeiou]isms?|thms?)$/.test(w)) n++;
  // -ying, -eing, -oing (studying, seeing, doing): the -ing is its own syllable after a vowel.
  if (/[aeou]ing$/.test(w) || /[^aeiou]ying$/.test(w)) n++;
  // -ically is said -ic-ly (automatically).
  if (/ically$/.test(w)) n--;
  // re- and pre- before a vowel (reuse, reorder, preamble).
  if (/^(re[iou]|pre[aiou])/.test(w) && !/^(reign|preach|reu?se?$)/.test(w)) n++;
  return Math.max(1, n);
}

// ---------- splitting ----------
export type Span = { start: number; end: number };
export type Word = Span & { text: string; syl: number; sentence: number };
export type Sentence = Span & { words: number };
const ABBR = new Set(['e.g', 'i.e', 'etc', 'vs', 'dr', 'mr', 'mrs', 'ms', 'prof', 'st', 'no', 'fig', 'figs', 'approx', 'dept', 'univ', 'jr', 'sr', 'inc', 'ltd', 'co', 'cf', 'al', 'ca', 'min', 'max', 'eq', 'vol', 'p', 'pp', 'ed', 'eds', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec']);
const WORD_RE = /[\p{L}\p{N}]+(?:['’.\-][\p{L}\p{N}]+)*/gu;

/** Sentence spans. A sentence ends at . ! ? (not after a known abbreviation or inside a number), at a blank line,
 * and, when linesEnd is true, at every line break. */
export function splitSentences(text: string, linesEnd = true): Sentence[] {
  const out: Sentence[] = [];
  let start = 0;
  const push = (end: number) => {
    const piece = text.slice(start, end);
    const words = (piece.match(WORD_RE) ?? []).length;
    if (words) { const lead = piece.length - piece.trimStart().length; out.push({ start: start + lead, end: start + piece.trimEnd().length, words }); }
    start = end;
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\n') {
      if (linesEnd || /\n[ \t]*$/.test(text.slice(start, i)) || /^\n[ \t]*\n/.test(text.slice(i))) { push(i); start = i + 1; continue; }
      // A line that starts with a bullet or number begins a new sentence too.
      if (/^\n[ \t]*([-*•–]|\d+[.)])\s/.test(text.slice(i, i + 8))) { push(i); start = i + 1; continue; }
      continue;
    }
    if (c === '.' || c === '!' || c === '?') {
      let j = i; while (j + 1 < text.length && /[.!?"”’')\]]/.test(text[j + 1])) j++;
      const next = text[j + 1];
      if (next !== undefined && !/\s/.test(next)) { i = j; continue; }
      if (c === '.') {
        const before = /([\p{L}.]+)$/u.exec(text.slice(Math.max(start, i - 12), i));
        const tok = before ? before[1].toLowerCase() : '';
        if (ABBR.has(tok) || /^(\p{L}\.)+\p{L}$/u.test(tok)) { i = j; continue; }
        // A single capital initial (J. Smith) does not end a sentence.
        if (/^\p{Lu}$/u.test(before?.[1] ?? '') ) { i = j; continue; }
      }
      push(j + 1); i = j;
    }
  }
  push(text.length);
  return out;
}

export function words(text: string, sentences: Sentence[]): Word[] {
  const out: Word[] = [];
  let s = 0;
  for (const m of text.matchAll(WORD_RE)) {
    const start = m.index!, end = start + m[0].length;
    while (s < sentences.length - 1 && start >= sentences[s].end) s++;
    // A word made of a number with dots (3.5) or letters with dots (e.g) stays one word.
    out.push({ start, end, text: m[0], syl: syllables(m[0].replace(/\./g, '')), sentence: s });
  }
  return out;
}

// ---------- the scores ----------
export type Counts = { sentences: number; words: number; syllables: number; letters: number; poly: number; complex: number; longWords: number };
export type Scores = { fre: number; fk: number; fog: number; smog: number; cli: number; ari: number };

export function scores(c: Counts): Scores {
  const wps = c.words / c.sentences, spw = c.syllables / c.words;
  return {
    fre: 206.835 - 1.015 * wps - 84.6 * spw,
    fk: 0.39 * wps + 11.8 * spw - 15.59,
    fog: 0.4 * (wps + (100 * c.complex) / c.words),
    smog: 1.043 * Math.sqrt((c.poly * 30) / c.sentences) + 3.1291,
    cli: 0.0588 * ((100 * c.letters) / c.words) - 0.296 * ((100 * c.sentences) / c.words) - 15.8,
    ari: 4.71 * (c.letters / c.words) + 0.5 * wps - 21.43,
  };
}

/** Flesch's own bands for the Reading Ease score. */
export function freBand(f: number): string {
  return f >= 90 ? 'very easy' : f >= 80 ? 'easy' : f >= 70 ? 'fairly easy' : f >= 60 ? 'plain English' : f >= 50 ? 'fairly difficult' : f >= 30 ? 'difficult' : 'very difficult';
}

// ---------- hints ----------
const BE = new Set(['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', "isn't", "aren't", "wasn't", "weren't", 'get', 'gets', 'got', 'gotten']);
const IRREGULAR = new Set(('arisen awoken borne born beaten become begun bent bet bid bitten bled blown broken bred brought built burnt bought caught chosen ' +
  'come cost crept cut dealt dug done drawn dreamt drunk driven eaten fallen fed felt fought found fled flown forbidden forgotten forgiven frozen ' +
  'given gone ground grown hung had heard hidden hit held hurt kept knelt known laid led leant learnt left lent let lain lit lost made meant met ' +
  'paid put quit read rid ridden rung risen run said seen sought sold sent set shaken shed shone shot shown shrunk shut sung sunk sat slain slept ' +
  'slid spoken spent spun split spread sprung stood stolen stuck stung struck sworn swept swum swung taken taught torn told thought thrown ' +
  'understood undertaken upset woken worn woven wept won wound written withdrawn overseen overtaken rewritten').split(' '));
export type Hint = Span & { text: string };
/** "was given", "are kept", "will be stored", "has been closely checked": a form of be (or get) then an optional
 * -ly word then a past participle. These are hints: some are adjectives ("is tired"). */
export function passiveHints(text: string, ws: Word[]): Hint[] {
  const out: Hint[] = [];
  for (let i = 0; i < ws.length - 1; i++) {
    const a = ws[i].text.toLowerCase().replace('’', "'");
    if (!BE.has(a)) continue;
    let j = i + 1;
    if (j < ws.length - 1 && /ly$/i.test(ws[j].text) && ws[j].sentence === ws[i].sentence) j++;
    const p = ws[j];
    if (p.sentence !== ws[i].sentence) continue;
    const t = p.text.toLowerCase();
    if ((/[a-z]{2,}ed$/.test(t) && !['need', 'feed', 'seed', 'bed', 'red', 'shed', 'speed', 'indeed', 'hundred'].includes(t)) || IRREGULAR.has(t)) {
      if (/[^ \t\n]/.test(text.slice(ws[i].end, p.start).replace(/[\s]+/g, '').replace(/[\p{L}]+/gu, ''))) continue;
      out.push({ start: ws[i].start, end: p.end, text: text.slice(ws[i].start, p.end) });
      i = j;
    }
  }
  return out;
}

/** Plainer words for some long or formal ones. Written by fibub; a suggestion, not a rule. */
export const PLAIN: Record<string, string> = {
  utilise: 'use', utilize: 'use', utilisation: 'use', utilization: 'use', commence: 'start', commences: 'starts', terminate: 'end', terminated: 'ended',
  approximately: 'about', sufficient: 'enough', assist: 'help', assistance: 'help', obtain: 'get', obtained: 'got', purchase: 'buy',
  subsequently: 'later', prior: 'before', numerous: 'many', demonstrate: 'show', facilitate: 'help', endeavour: 'try', endeavor: 'try',
  regarding: 'about', additional: 'more', individuals: 'people', initiate: 'start', modify: 'change', require: 'need', requires: 'needs',
  ascertain: 'find out', remuneration: 'payment', participate: 'take part', participation: 'taking part', discontinue: 'stop', withdraw: 'stop, leave',
  adverse: 'harmful', anticipate: 'expect', inform: 'tell', indicate: 'show', methodology: 'method', perform: 'do', provide: 'give',
  receive: 'get', reside: 'live', sufficiently: 'enough', consequently: 'so', nevertheless: 'still', therefore: 'so', whilst: 'while',
  commencement: 'start', comprehend: 'understand', confidential: 'private', disseminate: 'share', disseminated: 'shared', accordance: 'line',
};

export type Analysis = {
  counts: Counts; scores: Scores; sentences: Sentence[]; words: Word[];
  longSentences: Sentence[]; passive: Hint[]; hard: Word[]; jargon: Word[]; plain: { word: Word; plain: string }[];
};
export type Options = { linesEnd?: boolean; longSentence?: number; hardSyllables?: number; jargon?: string[] };
const SUFFIX3 = /(?:ed|es|ing)$/;
export function analyse(text: string, o: Options = {}): Analysis | null {
  const linesEnd = o.linesEnd ?? true, longS = o.longSentence ?? 25, hardS = o.hardSyllables ?? 3;
  const sents = splitSentences(text, linesEnd), ws = words(text, sents);
  if (!ws.length || !sents.length) return null;
  const starts = new Set(sents.map((s) => ws.findIndex((w) => w.start >= s.start)));
  let syl = 0, letters = 0, poly = 0, complex = 0, longWords = 0;
  ws.forEach((w, i) => {
    syl += w.syl;
    letters += (w.text.match(/[\p{L}\p{N}]/gu) ?? []).length;
    if (w.syl >= 3) {
      poly++;
      // Gunning's complex words: 3+ syllables, but not names (a capital not at the start of a sentence), hyphenated
      // compounds, or words that reach 3 only through -ed, -es or -ing.
      const name = /^\p{Lu}/u.test(w.text) && !starts.has(i);
      const suffix = SUFFIX3.test(w.text.toLowerCase()) && syllables(w.text.toLowerCase().replace(SUFFIX3, '')) < 3 && syllables(w.text.toLowerCase().replace(/(?:es|s)$/, '').replace(/(?:ed|ing)$/, (m) => m === 'ed' ? 'e' : '')) < 3;
      if (!name && !w.text.includes('-') && !suffix) complex++;
    }
    if (w.text.replace(/[^\p{L}]/gu, '').length >= 7) longWords++;
  });
  const counts: Counts = { sentences: sents.length, words: ws.length, syllables: syl, letters, poly, complex, longWords };
  const jargon = new Set((o.jargon ?? []).map((j) => j.trim().toLowerCase()).filter(Boolean));
  return {
    counts, scores: scores(counts), sentences: sents, words: ws,
    longSentences: sents.filter((s) => s.words > longS),
    passive: passiveHints(text, ws),
    hard: ws.filter((w) => w.syl >= hardS && !/^\p{N}/u.test(w.text)),
    jargon: ws.filter((w) => jargon.has(w.text.toLowerCase())),
    plain: ws.filter((w) => PLAIN[w.text.toLowerCase()]).map((w) => ({ word: w, plain: PLAIN[w.text.toLowerCase()] })),
  };
}

/** A made-up consent paragraph for the example. */
export const EXAMPLE_TEXT = `You are invited to participate in a research study investigating the relationship between sleep duration and academic performance among undergraduate students. Participation is entirely voluntary, and you may discontinue your involvement at any time without penalty.

If you agree to take part, you will be asked to wear a small wrist monitor for two weeks and to fill in a short online diary each morning. The diary takes about five minutes.

Your data will be stored securely on university servers and will be anonymised prior to analysis. Only the research team will have access to identifiable information.

There are no known risks. You will receive a gift card as a thank you.`;
