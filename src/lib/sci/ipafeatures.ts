// Distinctive features for IPA segments, derived by rule from each segment's phonetic description (place,
// manner and voicing; vowel height, backness and rounding) in ipa.ts. The rules follow a common textbook
// framework in broad outline (SPE-style binary features with Hayes-style place features); other frameworks
// differ on details such as [continuant] for laterals, [sonorant] for h and ʔ, or whether palatals are coronal. Plain TypeScript, no DOM.
import { SEGMENTS, type Segment, type Consonant } from './ipa.ts';

export const FEATURES = ['syllabic', 'consonantal', 'sonorant', 'continuant', 'delayed release', 'approximant', 'tap', 'trill', 'nasal', 'voice', 'spread glottis', 'constricted glottis', 'labial', 'round', 'labiodental', 'coronal', 'anterior', 'distributed', 'strident', 'lateral', 'dorsal', 'high', 'low', 'front', 'back', 'tense', 'long'] as const;
export type Feature = typeof FEATURES[number];
export type Value = '+' | '-' | '0';
export type Bundle = Record<Feature, Value>;
export type Parsed = { text: string; base: Segment; marks: string[]; f: Bundle; ignored: string[] };

const b = (x: boolean): Value => (x ? '+' : '-');
const OBSTRUENT = new Set(['plosive', 'fricative', 'lateral fricative', 'affricate', 'implosive', 'ejective', 'ejective fricative', 'click', 'lateral click']);
const STOP = new Set(['plosive', 'nasal', 'implosive', 'ejective', 'click', 'lateral click']);
const CENTRAL_APPROX = new Set(['approximant']);

/** The feature bundle of a plain segment (no diacritics), by rule. */
export function features(s: Segment): Bundle {
  const f = Object.fromEntries(FEATURES.map((k) => [k, '0'])) as Bundle;
  if (s.kind === 'V') {
    const high = s.height === 'close' || s.height === 'near-close', low = s.height === 'open' || s.height === 'near-open';
    const front = s.back === 'front' || s.back === 'near-front', back = s.back === 'back' || s.back === 'near-back';
    Object.assign(f, {
      syllabic: '+', consonantal: '-', sonorant: '+', continuant: '+', 'delayed release': '0', approximant: '+', tap: '-', trill: '-', nasal: '-', voice: '+',
      'spread glottis': '-', 'constricted glottis': '-', labial: b(s.round), round: s.round ? '+' : '0', labiodental: s.round ? '-' : '0',
      coronal: '-', lateral: '-', dorsal: '+', high: b(high), low: b(low), front: b(front), back: b(back),
      // Tense: the peripheral close and close-mid vowels; near-close, mid, open-mid and open vowels are lax.
      tense: b(s.height === 'close' || s.height === 'close-mid'), long: '-',
    } as Partial<Bundle>);
    return f;
  }
  const c = s as Consonant, m = c.manner as string, p = c.place as string;
  const glottal = p === 'glottal';
  const obstruent = OBSTRUENT.has(m);
  const lateral = /lateral/.test(m) || c.release === 'lateral fricative';
  f.syllabic = '-';
  f.consonantal = b(!glottal && !CENTRAL_APPROX.has(m));
  f.sonorant = b(!obstruent);
  f.continuant = b(!STOP.has(m) && m !== 'affricate');
  f['delayed release'] = m === 'affricate' ? '+' : STOP.has(m) ? '-' : '0';
  f.approximant = b(['approximant', 'lateral approximant', 'trill', 'tap', 'lateral tap'].includes(m));
  f.tap = b(m === 'tap' || m === 'lateral tap');
  f.trill = b(m === 'trill');
  f.nasal = b(m === 'nasal');
  f.voice = b(c.voice);
  f['spread glottis'] = b(c.ch === 'h' || c.ch === 'ɦ');
  f['constricted glottis'] = b(c.ch === 'ʔ' || /ejective/.test(m) || m === 'implosive');
  const labial = ['bilabial', 'labiodental', 'labial-velar', 'labial-palatal'].includes(p);
  f.labial = b(labial);
  f.round = labial ? b(p === 'labial-velar' && m === 'approximant' || p === 'labial-palatal') : '0';
  f.labiodental = labial ? b(p === 'labiodental') : '0';
  // Palatals count as dorsal only (like the vowel i); some frameworks make them coronal too.
  const coronal = ['dental', 'alveolar', 'postalveolar', 'retroflex', 'alveolo-palatal'].includes(p);
  f.coronal = b(coronal);
  if (coronal) {
    f.anterior = b(p === 'dental' || p === 'alveolar');
    f.distributed = b(p === 'dental' || p === 'postalveolar' || p === 'alveolo-palatal');
  }
  // Strident: noisy fricatives and affricates (labiodental and sibilant); other fricatives are not.
  const fric = /fricative/.test(m) || m === 'affricate';
  if (fric) f.strident = b(['labiodental', 'alveolar', 'postalveolar', 'retroflex', 'alveolo-palatal'].includes(p) && !/lateral/.test(m) && c.release !== 'lateral fricative');
  f.lateral = b(lateral);
  const dorsal = ['palatal', 'velar', 'uvular', 'labial-velar', 'labial-palatal', 'palato-alveolar-velar'].includes(p) || c.ch === 'ɫ';
  f.dorsal = b(dorsal);
  if (dorsal) {
    f.high = b(p !== 'uvular');
    f.low = '-';
    f.front = b(p === 'palatal' || p === 'labial-palatal');
    f.back = b(p === 'velar' || p === 'uvular' || p === 'labial-velar' || c.ch === 'ɫ');
  }
  f.long = '-';
  return f;
}

/** What each diacritic or modifier letter does to the bundle; others are noted and left out. */
const MODS: Record<string, (f: Bundle) => void> = {
  '̥': (f) => { f.voice = '-'; }, '̊': (f) => { f.voice = '-'; }, '̬': (f) => { f.voice = '+'; },
  'ʰ': (f) => { f['spread glottis'] = '+'; }, '̤': (f) => { f['spread glottis'] = '+'; f.voice = '+'; },
  '̰': (f) => { f['constricted glottis'] = '+'; }, 'ʼ': (f) => { f['constricted glottis'] = '+'; },
  '̃': (f) => { f.nasal = '+'; },
  'ʷ': (f) => { f.labial = '+'; f.round = '+'; if (f.labiodental === '0') f.labiodental = '-'; },
  'ʲ': (f) => { f.dorsal = '+'; f.high = '+'; f.low = '-'; f.front = '+'; f.back = '-'; },
  'ˠ': (f) => { f.dorsal = '+'; f.high = '+'; f.low = '-'; f.front = '-'; f.back = '+'; },
  'ˤ': (f) => { f.dorsal = '+'; f.high = '-'; f.low = '+'; f.front = '-'; f.back = '+'; },
  '̩': (f) => { f.syllabic = '+'; }, '̯': (f) => { f.syllabic = '-'; },
  '̪': (f) => { if (f.coronal === '+') { f.anterior = '+'; f.distributed = '+'; } },
  '̺': (f) => { if (f.coronal === '+') f.distributed = '-'; }, '̻': (f) => { if (f.coronal === '+') f.distributed = '+'; },
  'ː': (f) => { f.long = '+'; },
};
const MARK_CHARS = /[\p{M}ʰʷʲˠˤʼːˑⁿˡ˞]/u;

const BASES = [...SEGMENTS].sort((a, b) => b.ch.length - a.ch.length);
const ALIASES: Record<string, string> = { g: 'ɡ', 'ʧ': 't͡ʃ', 'ʤ': 'd͡ʒ', 'ʦ': 't͡s', 'ʣ': 'd͡z', 't͜ʃ': 't͡ʃ', 'd͜ʒ': 'd͡ʒ', 't͜s': 't͡s', 'd͜z': 'd͡z' };

/**
 * Read a list of segments: separated by spaces or commas, or run together (each symbol then takes the
 * diacritics after it). Affricates need a tie bar (t͡ʃ) or a ligature (ʧ); "tʃ" is read as t then ʃ.
 */
export function parseSegments(text: string): { segs: Parsed[]; unknown: string[] } {
  const segs: Parsed[] = [], unknown: string[] = [];
  // Decompose so that ẽ is e + tilde, but keep ç as one letter.
  let s = text.normalize('NFD').replace(/c\u0327/g, 'ç');
  for (const [k, v] of Object.entries(ALIASES)) s = s.split(k).join(v);
  for (const word of s.split(/[\s,;/[\]]+/).filter(Boolean)) {
    let i = 0;
    while (i < word.length) {
      const hit = BASES.find((x) => word.startsWith(x.ch, i));
      if (!hit) {
        let j = i + [...word.slice(i)][0].length; while (j < word.length && MARK_CHARS.test(word[j])) j++;
        unknown.push(word.slice(i, j)); i = j; continue;
      }
      let j = i + hit.ch.length;
      const marks: string[] = [];
      while (j < word.length) { const ch = [...word.slice(j)][0]; if (!MARK_CHARS.test(ch) || BASES.some((x) => x.ch.length > 1 && word.startsWith(x.ch, j))) break; marks.push(ch); j += ch.length; }
      const f = features(hit), ignored: string[] = [];
      for (const mk of marks) { if (MODS[mk]) MODS[mk](f); else ignored.push(mk); }
      if (hit.kind === 'V' && f.nasal === '+') f.sonorant = '+';
      segs.push({ text: word.slice(i, j).normalize('NFC'), base: hit, marks, f, ignored });
      i = j;
    }
  }
  return { segs, unknown };
}

/** Features with the same non-zero value in every one of the bundles. */
export function shared(bundles: Bundle[]): [Feature, Value][] {
  if (!bundles.length) return [];
  return FEATURES.filter((k) => bundles[0][k] !== '0' && bundles.every((x) => x[k] === bundles[0][k])).map((k) => [k, bundles[0][k]] as [Feature, Value]);
}

export const matches = (f: Bundle, spec: [Feature, Value][]) => spec.every(([k, v]) => f[k] === v);

/**
 * The smallest sets of features (from those the chosen segments share) that pick out exactly the chosen
 * segments within the inventory. Searches every combination of 1, 2, 3, … features and returns all the
 * sets of the smallest size (up to `limit`). If even all the shared features let in other segments,
 * the chosen set is not a natural class in this inventory and `extra` lists the intruders.
 */
export function minimalSets(inv: Bundle[], chosen: number[], limit = 6): { sets: [Feature, Value][][]; natural: boolean; extra: number[]; shared: [Feature, Value][] } {
  const sh = shared(chosen.map((i) => inv[i])), want = new Set(chosen);
  const picks = (spec: [Feature, Value][]) => inv.map((f, i) => (matches(f, spec) ? i : -1)).filter((i) => i >= 0);
  const all = picks(sh);
  if (!chosen.length) return { sets: [], natural: false, extra: [], shared: sh };
  if (all.length !== want.size) return { sets: [], natural: false, extra: all.filter((i) => !want.has(i)), shared: sh };
  // Only features that rule something out are worth trying.
  const useful = sh.filter(([k, v]) => inv.some((f) => f[k] !== v));
  const others = inv.map((_, i) => i).filter((i) => !want.has(i));
  if (!others.length) return { sets: [[]], natural: true, extra: [], shared: sh };
  const sets: [Feature, Value][][] = [];
  const n = useful.length, idx: number[] = [];
  for (let k = 1; k <= n && !sets.length; k++) {
    const rec = (start: number) => {
      if (sets.length >= limit) return;
      if (idx.length === k) { const spec = idx.map((i) => useful[i]); if (others.every((o) => !matches(inv[o], spec))) sets.push(spec); return; }
      for (let i = start; i <= n - (k - idx.length); i++) { idx.push(i); rec(i + 1); idx.pop(); }
    };
    rec(0);
  }
  return { sets, natural: true, extra: [], shared: sh };
}

/** Parse "+voice −sonorant, -cont" into a feature specification (names may be shortened). */
export function parseSpec(text: string): [Feature, Value][] {
  const out: [Feature, Value][] = [];
  const re = /([+\-−±0])\s*([a-z][a-z .]*?)(?=\s*[,;]|\s+[+\-−±0]|\s*$)/gi;
  const short: Record<string, Feature> = { syl: 'syllabic', cons: 'consonantal', son: 'sonorant', cont: 'continuant', 'del rel': 'delayed release', dr: 'delayed release', 'del. rel.': 'delayed release', approx: 'approximant', nas: 'nasal', vce: 'voice', voi: 'voice', sg: 'spread glottis', 'spread gl': 'spread glottis', cg: 'constricted glottis', 'constr gl': 'constricted glottis', lab: 'labial', rd: 'round', cor: 'coronal', ant: 'anterior', dist: 'distributed', strid: 'strident', lat: 'lateral', dors: 'dorsal', hi: 'high', lo: 'low', bk: 'back', fr: 'front', tns: 'tense' };
  let m: RegExpExecArray | null; let used = 0;
  while ((m = re.exec(text))) {
    const name = m[2].trim().toLowerCase().replace(/\s+/g, ' ');
    const f = (FEATURES as readonly string[]).includes(name) ? name as Feature : short[name] ?? FEATURES.find((x) => x.startsWith(name) && name.length >= 3);
    if (!f) throw new Error(`"${m[2].trim()}" is not a feature name.`);
    out.push([f, (m[1] === '−' ? '-' : m[1]) as Value]); used++;
  }
  if (text.trim() && !used) throw new Error('Write features as +name or −name, for example "+voice −sonorant".');
  return out;
}

export const show = (v: Value) => (v === '-' ? '−' : v);
export const specText = (spec: [Feature, Value][]) => '[' + spec.map(([k, v]) => `${show(v)}${k}`).join(', ') + ']';

/** A LaTeX tabular: features down, segments across. Compile with XeLaTeX or LuaLaTeX and an IPA font. */
export function toLatex(segs: { text: string; f: Bundle }[], feats: readonly Feature[] = FEATURES): string {
  const esc = (s: string) => s.replace(/([\\{}$&#^_%~])/g, '\\$1');
  const cell = (v: Value) => (v === '+' ? '$+$' : v === '-' ? '$-$' : '0');
  const lines = [`\\begin{tabular}{l|${'c'.repeat(segs.length)}}`, ` & ${segs.map((s) => esc(s.text)).join(' & ')} \\\\`, '\\hline'];
  for (const k of feats) lines.push(`${esc(k)} & ${segs.map((s) => cell(s.f[k])).join(' & ')} \\\\`);
  lines.push('\\end{tabular}');
  return lines.join('\n') + '\n';
}
