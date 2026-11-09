// LaTeX maths to MathML and MathML back to LaTeX, for a solid everyday subset: fractions, sub- and superscripts,
// roots, Greek letters, operators and relations, sums and integrals with limits, matrices and cases, \left \right,
// accents, fonts (\mathbf, \mathbb ...) and \text. Written by fibub; no outside libraries. Plain TypeScript, no DOM:
// the MathML side has its own small XML reader so the same code runs in the page and in the tests.

/** A MathML element (or, for the converter, the tree it builds). Private flags start with an underscore. */
export type El = { tag: string; attrs: Record<string, string>; kids: El[]; text?: string; pos?: number; _lim?: boolean; _fn?: boolean; _brace?: 'over' | 'under' };

/** An error with the character position (0-based) where it was found. */
export class MathError extends Error {
  pos: number;
  constructor(message: string, pos: number) { super(message); this.pos = pos; this.name = 'MathError'; }
}

/** Line and column (both 1-based) of a 0-based position, and the line with a caret under it. */
export function where(src: string, pos: number): { line: number; col: number; text: string; caret: string } {
  const p = Math.max(0, Math.min(pos, src.length));
  const before = src.slice(0, p), line = before.split('\n').length, start = before.lastIndexOf('\n') + 1;
  let end = src.indexOf('\n', p); if (end < 0) end = src.length;
  let text = src.slice(start, end), col = p - start;
  // Long lines: show 30 characters either side of the spot.
  let off = 0;
  if (text.length > 70) { off = Math.max(0, col - 30); text = (off ? '…' : '') + text.slice(off, off + 60) + (off + 60 < text.length ? '…' : ''); }
  const caret = ' '.repeat(col - off + (off ? 1 : 0)) + '^';
  return { line, col: col + 1, text, caret };
}
/** "line 2, character 5" or "character 12" for a one-line input. */
export function placeText(src: string, pos: number) {
  const w = where(src, pos);
  return src.includes('\n') ? `line ${w.line}, character ${w.col}` : `character ${w.col}`;
}

// ---------------------------------------------------------------- symbol tables

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ',
  iota: 'ι', kappa: 'κ', varkappa: 'ϰ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', varpi: 'ϖ', rho: 'ρ', varrho: 'ϱ',
  sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};
/** Letter-like symbols that are identifiers (<mi>). */
const IDENT: Record<string, string> = {
  infty: '∞', partial: '∂', nabla: '∇', hbar: 'ℏ', hslash: 'ℏ', ell: 'ℓ', emptyset: '∅', varnothing: '∅', aleph: 'ℵ', beth: 'ℶ',
  Re: 'ℜ', Im: 'ℑ', wp: '℘', imath: 'ı', jmath: 'ȷ', top: '⊤', bot: '⊥', angle: '∠', triangle: '△', square: '□', Box: '□',
  complement: '∁', mho: '℧', eth: 'ð', backprime: '‵', clubsuit: '♣', diamondsuit: '♢', heartsuit: '♡', spadesuit: '♠', checkmark: '✓', ddagger: '‡',
};
/** Operators, relations, arrows and punctuation (<mo>). The first name for a character is the one written back. */
const OPS: [string, string][] = [
  ['pm', '±'], ['mp', '∓'], ['times', '×'], ['div', '÷'], ['cdot', '⋅'], ['ast', '∗'], ['star', '⋆'], ['circ', '∘'], ['bullet', '∙'],
  ['oplus', '⊕'], ['ominus', '⊖'], ['otimes', '⊗'], ['oslash', '⊘'], ['odot', '⊙'], ['cup', '∪'], ['cap', '∩'], ['sqcup', '⊔'], ['sqcap', '⊓'], ['uplus', '⊎'],
  ['setminus', '∖'], ['wedge', '∧'], ['land', '∧'], ['vee', '∨'], ['lor', '∨'], ['neg', '¬'], ['lnot', '¬'], ['dagger', '†'], ['amalg', '⨿'], ['wr', '≀'],
  ['leq', '≤'], ['le', '≤'], ['geq', '≥'], ['ge', '≥'], ['leqslant', '⩽'], ['geqslant', '⩾'], ['neq', '≠'], ['ne', '≠'], ['approx', '≈'], ['equiv', '≡'],
  ['sim', '∼'], ['simeq', '≃'], ['cong', '≅'], ['asymp', '≍'], ['propto', '∝'], ['ll', '≪'], ['gg', '≫'], ['lesssim', '≲'], ['gtrsim', '≳'], ['doteq', '≐'], ['triangleq', '≜'],
  ['prec', '≺'], ['succ', '≻'], ['preceq', '⪯'], ['succeq', '⪰'],
  ['in', '∈'], ['notin', '∉'], ['ni', '∋'], ['subset', '⊂'], ['supset', '⊃'], ['subseteq', '⊆'], ['supseteq', '⊇'], ['subsetneq', '⊊'], ['supsetneq', '⊋'],
  ['sqsubseteq', '⊑'], ['sqsupseteq', '⊒'], ['perp', '⊥'], ['parallel', '∥'], ['mid', '∣'], ['nmid', '∤'], ['vdash', '⊢'], ['dashv', '⊣'], ['models', '⊨'],
  ['to', '→'], ['rightarrow', '→'], ['leftarrow', '←'], ['gets', '←'], ['leftrightarrow', '↔'], ['Rightarrow', '⇒'], ['Leftarrow', '⇐'], ['Leftrightarrow', '⇔'],
  ['implies', '⟹'], ['impliedby', '⟸'], ['iff', '⟺'], ['mapsto', '↦'], ['longrightarrow', '⟶'], ['longleftarrow', '⟵'], ['longleftrightarrow', '⟷'],
  ['Longrightarrow', '⟹'], ['Longleftarrow', '⟸'], ['Longleftrightarrow', '⟺'], ['longmapsto', '⟼'], ['hookrightarrow', '↪'], ['hookleftarrow', '↩'],
  ['uparrow', '↑'], ['downarrow', '↓'], ['updownarrow', '↕'], ['Uparrow', '⇑'], ['Downarrow', '⇓'], ['nearrow', '↗'], ['searrow', '↘'], ['swarrow', '↙'], ['nwarrow', '↖'],
  ['rightleftharpoons', '⇌'], ['leftrightharpoons', '⇋'], ['rightharpoonup', '⇀'], ['leftharpoonup', '↼'], ['xrightarrow', '→'],
  ['forall', '∀'], ['exists', '∃'], ['nexists', '∄'], ['therefore', '∴'], ['because', '∵'],
  ['ldots', '…'], ['dots', '…'], ['dotsc', '…'], ['dotso', '…'], ['cdots', '⋯'], ['dotsb', '⋯'], ['dotsm', '⋯'], ['vdots', '⋮'], ['ddots', '⋱'],
  ['colon', ':'], ['prime', '′'], ['langle', '⟨'], ['rangle', '⟩'], ['lfloor', '⌊'], ['rfloor', '⌋'], ['lceil', '⌈'], ['rceil', '⌉'],
  ['lbrace', '{'], ['rbrace', '}'], ['vert', '|'], ['lvert', '|'], ['rvert', '|'], ['Vert', '‖'], ['lVert', '‖'], ['rVert', '‖'], ['|', '‖'],
  ['{', '{'], ['}', '}'], ['backslash', '\\'], ['%', '%'], ['$', '$'], ['&', '&'], ['#', '#'], ['_', '_'],
  ['lbrack', '['], ['rbrack', ']'], ['diamond', '⋄'], ['bigtriangleup', '△'], ['bigtriangledown', '▽'], ['triangleleft', '◃'], ['triangleright', '▹'], ['smallsetminus', '∖'],
];
const OP = new Map(OPS);
/** Large operators: [name, character, takes limits above and below in display maths]. */
const BIG: [string, string, boolean][] = [
  ['sum', '∑', true], ['prod', '∏', true], ['coprod', '∐', true], ['bigcup', '⋃', true], ['bigcap', '⋂', true], ['bigoplus', '⨁', true], ['bigotimes', '⨂', true],
  ['bigodot', '⨀', true], ['bigvee', '⋁', true], ['bigwedge', '⋀', true], ['bigsqcup', '⨆', true], ['biguplus', '⨄', true],
  ['int', '∫', false], ['iint', '∬', false], ['iiint', '∭', false], ['iiiint', '⨌', false], ['oint', '∮', false], ['oiint', '∯', false], ['oiiint', '∰', false],
];
const BIGM = new Map(BIG.map(([n, c, l]) => [n, { c, l }]));
/** Function names written upright; the second group takes limits like \lim. */
const FUNCS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'coth', 'log', 'ln', 'lg', 'exp', 'dim', 'ker', 'deg', 'arg', 'hom'];
const LIMFUNCS = ['lim', 'limsup', 'liminf', 'max', 'min', 'sup', 'inf', 'det', 'gcd', 'Pr', 'argmax', 'argmin'];
const LIMTEXT: Record<string, string> = { limsup: 'lim sup', liminf: 'lim inf', argmax: 'arg max', argmin: 'arg min' };
const SPACES: Record<string, string> = { ',': '0.167em', thinspace: '0.167em', ':': '0.222em', '>': '0.222em', medspace: '0.222em', ';': '0.278em', thickspace: '0.278em', '!': '-0.167em', negthinspace: '-0.167em', quad: '1em', qquad: '2em', enspace: '0.5em' };
/** Accents: [character, stretches across the base]. */
const ACCENTS: Record<string, [string, boolean]> = {
  hat: ['^', false], widehat: ['^', true], check: ['ˇ', false], widecheck: ['ˇ', true], tilde: ['~', false], widetilde: ['~', true],
  acute: ['´', false], grave: ['`', false], dot: ['˙', false], ddot: ['¨', false], dddot: ['⃛', false], breve: ['˘', false], bar: ['¯', false], vec: ['→', false], mathring: ['˚', false],
  overline: ['‾', true], overrightarrow: ['→', true], overleftarrow: ['←', true], overleftrightarrow: ['↔', true], overbrace: ['⏞', true],
};
const UNDERS: Record<string, [string, boolean]> = { underline: ['_', true], underbrace: ['⏟', true], underrightarrow: ['→', true], underleftarrow: ['←', true] };
const FONTS: Record<string, string> = {
  mathrm: 'normal', mathup: 'normal', mathit: 'italic', mathbf: 'bold', boldsymbol: 'bold-italic', bm: 'bold-italic', mathbb: 'double-struck', mathcal: 'script', mathscr: 'script',
  mathfrak: 'fraktur', mathsf: 'sans-serif', mathtt: 'monospace', mathbfit: 'bold-italic', mathsfbf: 'bold-sans-serif',
};
const TEXTS: Record<string, string> = { text: '', textrm: '', textnormal: '', mbox: '', textup: '', textit: 'italic', textbf: 'bold', textsf: 'sans-serif', texttt: 'monospace', emph: 'italic' };
/** Delimiter sizes for \big ... \Bigg, as the font size multiple MathJax uses. */
const BIGSIZE: Record<string, string> = { big: '1.2em', Big: '1.623em', bigg: '2.047em', Bigg: '2.470em' };
/** Matrix-like environments: fences and column alignment. */
const ENVS: Record<string, { open: string; close: string; align?: string }> = {
  matrix: { open: '', close: '' }, pmatrix: { open: '(', close: ')' }, bmatrix: { open: '[', close: ']' }, Bmatrix: { open: '{', close: '}' },
  vmatrix: { open: '|', close: '|' }, Vmatrix: { open: '‖', close: '‖' }, smallmatrix: { open: '', close: '' }, cases: { open: '{', close: '', align: 'left left' },
  aligned: { open: '', close: '', align: 'aligned' }, align: { open: '', close: '', align: 'aligned' }, 'align*': { open: '', close: '', align: 'aligned' },
  split: { open: '', close: '', align: 'aligned' }, gathered: { open: '', close: '' }, gather: { open: '', close: '' }, 'gather*': { open: '', close: '' }, array: { open: '', close: '' },
};
const NOT: Record<string, string> = { '=': '≠', '<': '≮', '>': '≯', '∈': '∉', '≡': '≢', '⊂': '⊄', '⊃': '⊅', '⊆': '⊈', '⊇': '⊉', '≤': '≰', '≥': '≱', '∼': '≁', '≈': '≉', '≅': '≇', '∣': '∤', '∃': '∄', '∋': '∌' };
const DELIM_CMDS = new Set(['{', '}', '|', 'langle', 'rangle', 'lfloor', 'rfloor', 'lceil', 'rceil', 'vert', 'Vert', 'lvert', 'rvert', 'lVert', 'rVert', 'backslash', 'uparrow', 'downarrow', 'updownarrow', 'Uparrow', 'Downarrow', 'lbrace', 'rbrace', 'lbrack', 'rbrack']);
const FENCE_CHARS = new Set(['(', ')', '[', ']', '{', '}', '|', '‖', '⟨', '⟩', '⌊', '⌋', '⌈', '⌉']);
// Characters typed straight in maths mode that are operators.
const ASCII_OPS = '+-=<>,;:!?./*|()[]@\'"';

// ---------------------------------------------------------------- Unicode mathematical letters (bold, double-struck ...)

const LATIN_BASE: Record<string, number> = { bold: 0x1d400, italic: 0x1d434, 'bold-italic': 0x1d468, script: 0x1d49c, 'bold-script': 0x1d4d0, fraktur: 0x1d504, 'double-struck': 0x1d538, 'bold-fraktur': 0x1d56c, 'sans-serif': 0x1d5a0, 'bold-sans-serif': 0x1d5d4, 'sans-serif-italic': 0x1d608, monospace: 0x1d670 };
const DIGIT_BASE: Record<string, number> = { bold: 0x1d7ce, 'double-struck': 0x1d7d8, 'sans-serif': 0x1d7e2, 'bold-sans-serif': 0x1d7ec, monospace: 0x1d7f6 };
const GREEK_BASE: Record<string, number> = { bold: 0x1d6a8, italic: 0x1d6e2, 'bold-italic': 0x1d71c, 'bold-sans-serif': 0x1d756 };
// Letters that live in the older Letterlike Symbols block instead of the gaps in the maths alphabets.
const HOLES: Record<number, string> = { 0x1d455: 'ℎ', 0x1d49d: 'ℬ', 0x1d4a0: 'ℰ', 0x1d4a1: 'ℱ', 0x1d4a3: 'ℋ', 0x1d4a4: 'ℐ', 0x1d4a7: 'ℒ', 0x1d4a8: 'ℳ', 0x1d4ad: 'ℛ', 0x1d4ba: 'ℯ', 0x1d4bc: 'ℊ', 0x1d4c4: 'ℴ', 0x1d506: 'ℭ', 0x1d50b: 'ℌ', 0x1d50c: 'ℑ', 0x1d515: 'ℜ', 0x1d51d: 'ℨ', 0x1d53a: 'ℂ', 0x1d53f: 'ℍ', 0x1d545: 'ℕ', 0x1d547: 'ℙ', 0x1d548: 'ℚ', 0x1d549: 'ℝ', 0x1d551: 'ℤ' };
const GREEK_ORDER = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡϴΣΤΥΦΧΨΩ∇αβγδεζηθικλμνξοπρςστυφχψω∂ϵϑϰϕϱϖ';

/** A letter or digit in a maths font as its Unicode character, or null when Unicode has none (the caller then uses mathvariant). */
export function styled(ch: string, variant: string): string | null {
  const c = ch.codePointAt(0)!;
  let cp = -1;
  if (/[A-Z]/.test(ch) && LATIN_BASE[variant] != null) cp = LATIN_BASE[variant] + c - 65;
  else if (/[a-z]/.test(ch) && LATIN_BASE[variant] != null) cp = LATIN_BASE[variant] + 26 + c - 97;
  else if (/[0-9]/.test(ch) && DIGIT_BASE[variant] != null) cp = DIGIT_BASE[variant] + c - 48;
  else if (GREEK_BASE[variant] != null) { const i = GREEK_ORDER.indexOf(ch); if (i >= 0 && ch !== 'ϴ') cp = GREEK_BASE[variant] + i; }
  if (cp < 0) return null;
  return HOLES[cp] ?? String.fromCodePoint(cp);
}
let UNSTYLE: Map<string, [string, string]> | null = null;
/** The plain letter and the variant of a Unicode maths letter, or null. */
export function unstyled(ch: string): [string, string] | null {
  if (!UNSTYLE) {
    UNSTYLE = new Map();
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + GREEK_ORDER;
    for (const v of Object.keys(LATIN_BASE).concat(Object.keys(GREEK_BASE))) for (const l of letters) { const s = styled(l, v); if (s && !UNSTYLE.has(s) && s !== l) UNSTYLE.set(s, [l, v]); }
  }
  return UNSTYLE.get(ch) ?? null;
}

// ---------------------------------------------------------------- element helpers

const el = (tag: string, kids: El[] = [], attrs: Record<string, string> = {}, pos?: number): El => ({ tag, attrs, kids, pos });
const tok = (tag: string, text: string, attrs: Record<string, string> = {}, pos?: number): El => ({ tag, attrs, kids: [], text, pos });
/** One element for a list: itself when there is one, an <mrow> otherwise. */
const row = (kids: El[], pos?: number): El => (kids.length === 1 ? kids[0] : el('mrow', kids, {}, pos));

// ---------------------------------------------------------------- LaTeX to MathML

export type ToMathOptions = { display?: boolean; annotate?: boolean; pretty?: boolean };

/** Take off $...$, $$...$$, \(...\), \[...\] and equation environments around the maths, keeping positions. */
function unwrap(src: string): { body: string; offset: number } {
  const pats: [RegExp, RegExp][] = [[/^\s*\$\$/, /\$\$\s*$/], [/^\s*\$/, /\$\s*$/], [/^\s*\\\[/, /\\\]\s*$/], [/^\s*\\\(/, /\\\)\s*$/],
    [/^\s*\\begin\{(equation\*?|displaymath|math)\}/, /\\end\{(equation\*?|displaymath|math)\}\s*$/]];
  for (const [a, b] of pats) {
    const m = src.match(a), n = src.match(b);
    if (m && n && m[0].length <= src.length - n[0].length) return { body: src.slice(m[0].length, src.length - n[0].length), offset: m[0].length };
  }
  return { body: src, offset: 0 };
}

class TexParser {
  s: string; i = 0; off: number; font: string | null = null;
  constructor(s: string, off: number) { this.s = s; this.off = off; }
  err(msg: string, at = this.i): never { throw new MathError(msg, at + this.off); }

  skip() { // spaces and % comments
    for (;;) {
      const c = this.s[this.i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') this.i++;
      else if (c === '%') { while (this.i < this.s.length && this.s[this.i] !== '\n') this.i++; }
      else return;
    }
  }
  /** The command name at i (after the backslash) without moving, or null. */
  cmdAt(i = this.i): string | null {
    if (this.s[i] !== '\\') return null;
    const m = /^[a-zA-Z]+\*?/.exec(this.s.slice(i + 1, i + 40));
    if (m) { const name = m[0]; return name.endsWith('*') && !/^(operatorname|align|gather|equation)\*$/.test(name) ? name.slice(0, -1) : name; }
    return this.s[i + 1] ?? '';
  }
  readCmd(): string { const c = this.cmdAt()!; this.i += 1 + c.length; return c; }

  parseAll(): El[] {
    const kids = this.parseList(new Set());
    this.skip();
    if (this.i < this.s.length) {
      const c = this.cmdAt();
      if (this.s[this.i] === '}') this.err('There is a } here with no { to match it.');
      if (c === 'right') this.err('\\right here has no \\left before it.');
      if (c === 'end') this.err('\\end here has no \\begin before it.');
      if (c === '\\') this.err('\\\\ (a new line) only works inside a matrix, cases or aligned environment.');
      if (this.s[this.i] === '&') this.err('& (next column) only works inside a matrix, cases or aligned environment.');
      if (c === 'middle') this.err('\\middle only works between \\left and \\right.');
      this.err('Unexpected text here.');
    }
    return kids;
  }

  /** Atoms with their scripts until a closing brace, \right, \end, &, \\ or one of the stop characters. */
  parseList(stops: Set<string>): El[] {
    const out: El[] = [];
    for (;;) {
      this.skip();
      if (this.i >= this.s.length) return out;
      const c = this.s[this.i], cmd = this.cmdAt();
      if (c === '}' || c === '&' || stops.has(c) || cmd === 'right' || cmd === 'end' || cmd === '\\' || cmd === 'middle' || cmd === 'cr') return out;
      if (cmd === 'displaystyle' || cmd === 'textstyle' || cmd === 'scriptstyle') {
        this.readCmd();
        const rest = this.parseList(stops);
        out.push(el('mstyle', rest, cmd === 'displaystyle' ? { displaystyle: 'true', scriptlevel: '0' } : cmd === 'textstyle' ? { displaystyle: 'false', scriptlevel: '0' } : { displaystyle: 'false', scriptlevel: '1' }));
        return out;
      }
      if (cmd === 'over' || cmd === 'atop' || cmd === 'choose') this.err(`\\${cmd} is not supported. Write \\frac{a}{b} or \\binom{n}{k} instead.`);
      if (cmd === 'label' || cmd === 'tag') { this.readCmd(); this.skip(); this.rawGroup(cmd); continue; }
      if (cmd === 'nonumber' || cmd === 'notag') { this.readCmd(); continue; }
      const atoms = this.parseAtom();
      for (const a of atoms) out.push(a);
    }
  }

  /** One atom (possibly empty when a script follows), its scripts, and a function's invisible "apply" sign. */
  parseAtom(): El[] {
    const start = this.i;
    let base: El | null;
    const c = this.s[this.i];
    if (c === '^' || c === '_') base = el('mrow', [], {}, start);
    else if (c === "'") base = el('mrow', [], {}, start);
    else base = this.atom();
    if (base == null) return [];
    const fn = base._fn;
    let sub: El | null = null, sup: El | null = null, subPos = -1, supPos = -1, primes = '';
    for (;;) {
      this.skip();
      const ch = this.s[this.i], cmd = this.cmdAt();
      if (cmd === 'limits' || cmd === 'nolimits') {
        if (!(base.tag === 'mo' || base._lim != null)) this.err(`\\${cmd} only works right after a large operator such as \\sum, \\int or \\lim.`);
        this.readCmd(); base._lim = cmd === 'limits'; continue;
      }
      if (ch === "'") {
        if (sup) this.err('A prime (\') cannot come after a superscript. Write the prime first, as f\'^2.');
        while (this.s[this.i] === "'") { primes += '′'; this.i++; }
        continue;
      }
      if (ch === '^') {
        if (sup) this.err('Double superscript: this ^ follows another one. Put both in one pair of braces, as x^{ab}.');
        supPos = this.i; this.i++; sup = this.arg('^'); continue;
      }
      if (ch === '_') {
        if (sub) this.err('Double subscript: this _ follows another one. Put both in one pair of braces, as x_{ab}.');
        subPos = this.i; this.i++; sub = this.arg('_'); continue;
      }
      break;
    }
    void subPos; void supPos;
    if (primes) {
      const p = tok('mo', primes.length === 2 ? '″' : primes.length === 3 ? '‴' : primes);
      sup = sup ? el('mrow', [p, ...(sup.tag === 'mrow' ? sup.kids : [sup])]) : p;
    }
    let out: El = base;
    if (sub || sup) {
      if (base._brace === 'over' && sup && !sub) out = el('mover', [base, sup]);
      else if (base._brace === 'under' && sub && !sup) out = el('munder', [base, sub]);
      else if (base._lim) {
        out = sub && sup ? el('munderover', [base, sub, sup]) : sub ? el('munder', [base, sub]) : el('mover', [base, sup!]);
      } else out = sub && sup ? el('msubsup', [base, sub, sup]) : sub ? el('msub', [base, sub]) : el('msup', [base, sup!]);
      out.pos = start;
    }
    return fn ? [out, tok('mo', '\u2061')] : [out];
  }

  /** The argument of ^, _ or a command: a {group}, one command, or one character. */
  arg(of: string, missing = ''): El {
    this.skip();
    const at = this.i, c = this.s[at];
    if (at >= this.s.length || c === '}' || c === '&' || (c === '\\' && ['right', 'end', '\\', 'middle'].includes(this.cmdAt() ?? ''))) {
      this.err(of === '^' || of === '_' ? `${of === '^' ? 'Superscript ^' : 'Subscript _'} needs something after it, such as x${of}2 or x${of}{10}.` : missing || `${of} needs an argument here, in braces: ${of}{...}.`);
    }
    if (c === '^' || c === '_') this.err(`${of} cannot be followed straight away by ${c}. Use braces, as {}${c}{...}.`);
    if (c === '{') return this.group();
    if (/[0-9]/.test(c)) { this.i++; return this.mk('mn', c, at); }
    const a = this.atom(true);
    if (!a) this.err(missing || `${of} needs an argument here, in braces: ${of}{...}.`);
    return a;
  }

  /** { ... } as one element. */
  group(): El {
    const open = this.i; this.i++;
    const kids = this.parseList(new Set());
    this.skip();
    if (this.s[this.i] !== '}') {
      const cmd = this.cmdAt();
      if (this.i >= this.s.length) this.err('This { is never closed. Add a } to match it.', open);
      if (cmd === 'right') this.err('\\right here closes a \\left that is outside this { } group. Keep \\left and \\right inside the same braces.');
      if (cmd === 'end') this.err('\\end here comes before the } that closes the { at ' + placeText(this.s, open + this.off) + '.');
      this.err(cmd === '\\' ? '\\\\ (a new line) only works inside a matrix, cases or aligned environment.' : '& (next column) only works inside a matrix, cases or aligned environment.');
    }
    this.i++;
    return kids.length === 1 ? kids[0] : el('mrow', kids, {}, open);
  }

  /** The text of a {group} without parsing it (for \text, \operatorname, \begin names). */
  rawGroup(of: string): { text: string; at: number } {
    this.skip();
    if (this.s[this.i] !== '{') this.err(`\\${of} needs its text in braces, as \\${of}{...}.`);
    const at = this.i + 1;
    let depth = 0, j = this.i;
    for (; j < this.s.length; j++) {
      const ch = this.s[j];
      if (ch === '\\') { j++; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) break; }
    }
    if (j >= this.s.length) this.err('This { is never closed. Add a } to match it.', this.i);
    this.i = j + 1;
    return { text: this.s.slice(at, j), at };
  }

  /** A token in the current font (\mathbf etc.). */
  mk(tag: string, text: string, at: number): El {
    const f = this.font;
    if (f && f !== 'normal' && f !== 'italic' || f === 'italic' && tag !== 'mi') {
      const out = [...text].map((ch) => styled(ch, f!) ?? null);
      if (out.every((x) => x != null)) return tok(tag, out.join(''), {}, at);
      return tok(tag, text, { mathvariant: f! }, at);
    }
    if (f === 'normal' && tag === 'mi' && [...text].length === 1) return tok(tag, text, { mathvariant: 'normal' }, at);
    if (f === 'italic' && tag === 'mi' && [...text].length > 1) return tok(tag, text, { mathvariant: 'italic' }, at);
    return tok(tag, text, {}, at);
  }

  /** A delimiter after \left, \right, \middle or \big: a character, a delimiter command, or "." for none. */
  delim(of: string): string {
    this.skip();
    const at = this.i, c = this.s[at];
    if (c === '\\') {
      const cmd = this.cmdAt()!;
      if (DELIM_CMDS.has(cmd) || cmd === '|') { this.readCmd(); return cmd === '|' ? '‖' : cmd === 'backslash' ? '\\' : OP.get(cmd)!; }
      this.err(`\\${of} must be followed by a delimiter such as ( [ \\{ | or a full stop for none; \\${cmd} is not one.`);
    }
    if (c && '()[]|/.<>'.includes(c)) { this.i++; return c === '.' ? '' : c === '<' ? '⟨' : c === '>' ? '⟩' : c; }
    if (c && FENCE_CHARS.has(c)) { this.i++; return c; }
    this.err(`\\${of} must be followed by a delimiter such as ( [ \\{ | or a full stop for none.`);
  }

  /** One atom without its scripts, or null at the end. */
  atom(single = false): El | null {
    this.skip();
    const at = this.i, c = this.s[at];
    if (at >= this.s.length) return null;
    if (c === '{') return this.group();
    if (c === '}') this.err('There is a } here with no { to match it.');
    if (c === '\\') return this.command(at);
    if (/[0-9.]/.test(c)) {
      if (single) { this.i++; return this.mk(c === '.' ? 'mo' : 'mn', c, at); }
      const m = /^(\d+(\.\d+)?|\.\d+)/.exec(this.s.slice(at));
      if (m) { this.i += m[0].length; return this.mk('mn', m[0], at); }
      this.i++; return tok('mo', '.', {}, at);
    }
    if (/[a-zA-Z]/.test(c)) { this.i++; return this.mk('mi', c, at); }
    if (c === '~') { this.i++; return tok('mtext', '\u00a0', {}, at); }
    if (c === '#') this.err('# cannot be used in maths. Write \\# for a hash sign.');
    if (c === '$') this.err('A $ sign here would end the maths. Leave out the $ signs inside the box, or write \\$ for a dollar sign.');
    if (c === '^' || c === '_') { return el('mrow', [], {}, at); }
    if (ASCII_OPS.includes(c)) {
      this.i++;
      if (c === "'") return tok('mo', '′', {}, at);
      const ch = c === '-' ? '−' : c === '*' ? '∗' : c;
      return tok('mo', ch, FENCE_CHARS.has(ch) ? { stretchy: 'false' } : {}, at);
    }
    // Any other character typed directly: Greek and other letters are identifiers, the rest operators.
    const cp = this.s.codePointAt(at)!, ch = String.fromCodePoint(cp);
    this.i += ch.length;
    if (ch === '−') return tok('mo', '−', {}, at);
    if (unstyled(ch)) return tok('mi', ch, {}, at);
    if (/\p{L}/u.test(ch)) return this.mk('mi', ch, at);
    if (/\p{N}/u.test(ch)) return tok('mn', ch, {}, at);
    return tok('mo', ch, FENCE_CHARS.has(ch) ? { stretchy: 'false' } : {}, at);
  }

  command(at: number): El | null {
    const cmd = this.readCmd();
    if (cmd === '') this.err('A backslash at the end needs a command name after it.', at);
    if (GREEK[cmd]) { const ch = GREEK[cmd]; const e = this.mk('mi', ch, at); if (/[A-Z]/.test(cmd[0]) && this.font == null) e.attrs.mathvariant = 'normal'; return e; }
    if (IDENT[cmd]) return tok('mi', IDENT[cmd], {}, at);
    if (BIGM.has(cmd)) { const b = BIGM.get(cmd)!; const e = tok('mo', b.c, {}, at); e._lim = b.l; if (b.l) e.attrs.movablelimits = 'true'; return e; }
    if (SPACES[cmd]) return tok('mspace', '', { width: SPACES[cmd] }, at);
    if (cmd === ' ' || cmd === '\n' || cmd === '\t') return tok('mtext', '\u00a0', {}, at);
    if (cmd === 'not') {
      const next = this.atom(true);
      if (!next || next.tag !== 'mo' && next.tag !== 'mi') this.err('\\not must be followed by a relation such as = or \\in.', at);
      return tok('mo', NOT[next.text!] ?? next.text + '\u0338', {}, at);
    }
    if (cmd === 'bmod') return tok('mo', 'mod', {}, at);
    if (FUNCS.includes(cmd)) { const e = tok('mi', cmd, {}, at); e._fn = true; return e; }
    if (LIMFUNCS.includes(cmd)) { const e = tok('mo', LIMTEXT[cmd] ?? cmd, { movablelimits: 'true' }, at); e._lim = true; e._fn = true; return e; }
    if (cmd === 'operatorname' || cmd === 'operatorname*') {
      const { text } = this.rawGroup('operatorname');
      const name = text.replace(/\\,|\\ |~/g, ' ').replace(/\s+/g, ' ').trim();
      if (!/^[A-Za-z][A-Za-z0-9 -]*$/.test(name)) this.err('\\operatorname takes a plain name of letters, as \\operatorname{erf}.', at);
      const e = cmd === 'operatorname*' ? tok('mo', name, { movablelimits: 'true' }, at) : tok('mi', name, {}, at);
      e._fn = true; if (cmd === 'operatorname*') e._lim = true; else if (name.length === 1) e.attrs.mathvariant = 'normal';
      return e;
    }
    if (OP.has(cmd)) {
      const ch = OP.get(cmd)!;
      if (/^(xrightarrow)$/.test(cmd)) this.err(`\\${cmd} is not supported. Write \\overset{text}{\\rightarrow} instead.`, at);
      return tok('mo', ch, FENCE_CHARS.has(ch) ? { stretchy: 'false' } : {}, at);
    }
    if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac' || cmd === 'cfrac') {
      const n = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{numerator}{denominator}; the numerator is missing.`), d = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{numerator}{denominator}; the denominator is missing here.`);
      const f = el('mfrac', [n, d], {}, at);
      if (cmd === 'dfrac' || cmd === 'cfrac') return el('mstyle', [f], { displaystyle: 'true', scriptlevel: '0' }, at);
      if (cmd === 'tfrac') return el('mstyle', [f], { displaystyle: 'false', scriptlevel: '0' }, at);
      return f;
    }
    if (cmd === 'binom' || cmd === 'dbinom' || cmd === 'tbinom') {
      const n = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{n}{k}.`), k = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{n}{k}; the second is missing here.`);
      const b = el('mrow', [tok('mo', '('), el('mfrac', [n, k], { linethickness: '0' }), tok('mo', ')')], {}, at);
      return cmd === 'binom' ? b : el('mstyle', [b], { displaystyle: cmd === 'dbinom' ? 'true' : 'false', scriptlevel: '0' }, at);
    }
    if (cmd === 'sqrt') {
      this.skip();
      let index: El | null = null;
      if (this.s[this.i] === '[') {
        const open = this.i; this.i++;
        const kids = this.parseList(new Set([']']));
        this.skip();
        if (this.s[this.i] !== ']') this.err('The [ for the root index is never closed. Add a ] to match it.', open);
        this.i++; index = row(kids, open);
      }
      const b = this.arg('\\sqrt');
      return index ? el('mroot', [b, index], {}, at) : el('msqrt', b.tag === 'mrow' ? b.kids : [b], {}, at);
    }
    if (ACCENTS[cmd]) {
      const b = this.arg(`\\${cmd}`), [ch, wide] = ACCENTS[cmd];
      const e = el('mover', [b, tok('mo', ch, { stretchy: wide ? 'true' : 'false' })], { accent: cmd === 'overbrace' ? 'false' : 'true' }, at);
      if (cmd === 'overbrace') e._brace = 'over';
      return e;
    }
    if (UNDERS[cmd]) {
      const b = this.arg(`\\${cmd}`), [ch] = UNDERS[cmd];
      const e = el('munder', [b, tok('mo', ch, { stretchy: 'true' })], { accentunder: cmd === 'underbrace' ? 'false' : 'true' }, at);
      if (cmd === 'underbrace') e._brace = 'under';
      return e;
    }
    if (cmd === 'overset' || cmd === 'stackrel' || cmd === 'underset') {
      const a = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{${cmd === 'underset' ? 'below' : 'above'}}{main}.`), b = this.arg(`\\${cmd}`, `\\${cmd} needs two arguments, \\${cmd}{${cmd === 'underset' ? 'below' : 'above'}}{main}; the main part is missing here.`);
      const e = el(cmd === 'underset' ? 'munder' : 'mover', [b, a], {}, at);
      return e;
    }
    if (FONTS[cmd] != null) {
      const prev = this.font; this.font = FONTS[cmd];
      try { return this.arg(`\\${cmd}`); } finally { this.font = prev; }
    }
    if (TEXTS[cmd] != null) {
      const { text, at: tAt } = this.rawGroup(cmd);
      return this.text(text, tAt, TEXTS[cmd]);
    }
    if (cmd === 'phantom') return el('mphantom', [this.arg('\\phantom')], {}, at);
    if (cmd === 'boxed') return el('menclose', [this.arg('\\boxed')], { notation: 'box' }, at);
    if (cmd === 'left') {
      const open = this.delim('left');
      const kids: El[] = [tok('mo', open, { fence: 'true', stretchy: 'true', form: 'prefix' })];
      for (;;) {
        kids.push(...this.parseList(new Set()));
        this.skip();
        const c2 = this.cmdAt();
        if (c2 === 'middle') { this.readCmd(); kids.push(tok('mo', this.delim('middle'), { fence: 'true', stretchy: 'true', form: 'infix' })); continue; }
        if (c2 === 'right') { this.readCmd(); kids.push(tok('mo', this.delim('right'), { fence: 'true', stretchy: 'true', form: 'postfix' })); break; }
        if (this.i >= this.s.length) this.err('This \\left has no \\right to close it. Add \\right) (or \\right. for nothing).', at);
        if (this.s[this.i] === '}') this.err('This } closes a group that started before the \\left at ' + placeText(this.s, at + this.off) + '. Add the \\right first.');
        if (c2 === 'end') this.err('\\end here comes before the \\right for the \\left at ' + placeText(this.s, at + this.off) + '.');
        this.err(c2 === '\\' ? '\\\\ (a new line) cannot go between \\left and \\right.' : '& (next column) cannot go between \\left and \\right.');
      }
      return el('mrow', kids, {}, at);
    }
    if (cmd === 'right') this.err('\\right here has no \\left before it.', at);
    if (cmd === 'middle') this.err('\\middle only works between \\left and \\right.', at);
    if (/^(big|Big|bigg|Bigg)(l|r|m)?$/.test(cmd)) {
      const size = BIGSIZE[cmd.replace(/[lrm]$/, '')];
      const d = this.delim(cmd);
      return tok('mo', d, { minsize: size, maxsize: size, stretchy: 'true', ...(/[lr]$/.test(cmd) ? { fence: 'true', form: cmd.endsWith('l') ? 'prefix' : 'postfix' } : {}) }, at);
    }
    if (cmd === 'begin') return this.env(at);
    if (cmd === 'end') this.err('\\end here has no \\begin before it.', at);
    if (cmd === 'hline' || cmd === 'cline') this.err(`\\${cmd} (lines in a table) is not supported. Leave it out; the MathML has no lines.`, at);
    if (cmd === '\\') this.err('\\\\ (a new line) only works inside a matrix, cases or aligned environment.', at);
    if (cmd === 'color' || cmd === 'textcolor') this.err(`\\${cmd} is not supported. Leave the colour out; Word and LibreOffice can colour the equation afterwards.`, at);
    if (cmd === 'limits' || cmd === 'nolimits') this.err(`\\${cmd} only works right after a large operator such as \\sum, \\int or \\lim.`, at);
    this.err(`Unknown command \\${cmd}. Check the spelling, or see the list of supported commands below.`, at);
  }

  /** Text inside \text{...}: escapes and ~ handled; spaces at the ends kept as no-break spaces. */
  text(raw: string, at: number, variant: string): El {
    let out = '';
    for (let j = 0; j < raw.length; j++) {
      const ch = raw[j];
      if (ch === '\\') {
        const m = /^([a-zA-Z]+|.)/.exec(raw.slice(j + 1));
        const name = m ? m[1] : '';
        const map: Record<string, string> = { '%': '%', '&': '&', $: '$', '#': '#', _: '_', '{': '{', '}': '}', ' ': ' ', ',': '\u2009', textbackslash: '\\', textasciicircum: '^', textasciitilde: '~', textendash: '–', textemdash: '—', textdegree: '°', textmu: 'µ' };
        if (map[name] == null) throw new MathError(`\\${name} cannot be used inside \\text. Close the \\text{...} first and write the maths after it.`, at + j + this.off);
        out += map[name]; j += name.length;
        if (/^[a-zA-Z]/.test(name) && raw[j + 1] === '{' && raw[j + 2] === '}') j += 2;
        else if (/^[a-zA-Z]/.test(name) && raw[j + 1] === ' ') j += 1;
      } else if (ch === '$') throw new MathError('Maths inside \\text{...} ($...$) is not supported. Close the \\text first and write the maths after it.', at + j + this.off);
      else if (ch === '{' || ch === '}') continue;
      else if (ch === '~') out += '\u00a0';
      else if (ch === '\n' || ch === '\t') out += ' ';
      else out += ch;
    }
    out = out.replace(/ {2,}/g, ' ').replace(/^ /, '\u00a0').replace(/ $/, '\u00a0');
    return tok('mtext', out, variant ? { mathvariant: variant } : {}, at);
  }

  /** \begin{env} ... \end{env}: rows split by \\, cells by &. */
  env(at: number): El {
    const { text: name } = this.rawGroup('begin');
    const spec = ENVS[name];
    if (!spec) {
      if (/^(equation|displaymath|math)\*?$/.test(name)) this.err(`\\begin{${name}} is only allowed around the whole equation.`, at);
      this.err(`The environment {${name}} is not supported. Use matrix, pmatrix, bmatrix, Bmatrix, vmatrix, Vmatrix, cases, aligned, gathered or array.`, at);
    }
    let colAlign: string[] | null = null;
    if (name === 'array') {
      const { text, at: sAt } = this.rawGroup('begin{array}');
      const cols = text.replace(/[|\s]/g, '');
      if (!/^[lcr]+$/.test(cols)) this.err('The array column letters must be l, c or r (lines | are left out), as \\begin{array}{lcr}.', sAt);
      colAlign = [...cols].map((x) => (x === 'l' ? 'left' : x === 'r' ? 'right' : 'center'));
    }
    const rows: El[][] = [];
    let cells: El[] = [];
    for (;;) {
      const cellAt = this.i;
      const kids = this.parseList(new Set());
      cells.push(el('mtd', kids.length === 1 && kids[0].tag === 'mrow' ? kids[0].kids : kids, {}, cellAt));
      this.skip();
      if (this.s[this.i] === '&') { this.i++; continue; }
      const c = this.cmdAt();
      if (c === '\\' || c === 'cr') {
        this.readCmd(); this.skip();
        if (this.s[this.i] === '[') { const m = /^\[[^\]]*\]/.exec(this.s.slice(this.i)); if (m) this.i += m[0].length; }
        rows.push(cells); cells = []; continue;
      }
      if (c === 'end') {
        const endAt = this.i; this.readCmd();
        const { text: endName } = this.rawGroup('end');
        if (endName !== name) this.err(`\\begin{${name}} at ${placeText(this.s, at + this.off)} is closed by \\end{${endName}}.`, endAt);
        // A \\ before \end leaves an empty last row: drop it.
        if (!(cells.length === 1 && cells[0].kids.length === 0 && rows.length)) rows.push(cells);
        break;
      }
      if (this.i >= this.s.length) this.err(`\\begin{${name}} has no \\end{${name}}.`, at);
      if (this.s[this.i] === '}') this.err(`There is a } here with no { to match it inside {${name}}.`);
      if (c === 'right') this.err(`\\right here is inside {${name}}; close the environment first.`);
      this.err('Unexpected text here.');
    }
    const width = Math.max(...rows.map((r) => r.length));
    if (colAlign && width > colAlign.length) this.err(`The array has ${colAlign.length} column letter${colAlign.length === 1 ? '' : 's'} but a row with ${width} cells.`, at);
    const attrs: Record<string, string> = {};
    if (spec.align === 'aligned') {
      attrs.columnalign = Array.from({ length: width }, (_, j) => (j % 2 ? 'left' : 'right')).join(' ');
      attrs.columnspacing = Array.from({ length: Math.max(1, width - 1) }, (_, j) => (j % 2 ? '2em' : '0em')).join(' ');
      attrs.displaystyle = 'true';
    } else if (spec.align) attrs.columnalign = spec.align;
    else if (colAlign) attrs.columnalign = colAlign.join(' ');
    if (name === 'smallmatrix') attrs.displaystyle = 'false';
    if (name === 'gathered' || name.startsWith('gather')) attrs.displaystyle = 'true';
    const table = el('mtable', rows.map((r) => el('mtr', r)), attrs, at);
    if (!spec.open && !spec.close) return table;
    const k: El[] = [];
    if (spec.open) k.push(tok('mo', spec.open, { fence: 'true', stretchy: 'true', form: 'prefix' }));
    k.push(table);
    if (spec.close) k.push(tok('mo', spec.close, { fence: 'true', stretchy: 'true', form: 'postfix' }));
    return el('mrow', k, {}, at);
  }
}

/** The MathML tree for LaTeX maths. Throws MathError (with the position in src) for anything it cannot read. */
export function texToTree(src: string): El {
  if (src.length > 50000) throw new MathError('That is very long. Convert one equation (up to 50,000 characters) at a time.', 0);
  const { body, offset } = unwrap(src);
  const p = new TexParser(body, offset);
  const kids = p.parseAll();
  return el('mrow', kids);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\u2061/g, '&#x2061;').replace(/\u2062/g, '&#x2062;').replace(/\u00a0/g, '&#xA0;');
const escAttr = (s: string) => esc(s).replace(/"/g, '&quot;');
const TOKENS = new Set(['mi', 'mn', 'mo', 'mtext', 'ms', 'mspace', 'annotation']);

/** Write an element as MathML text, on one line or indented. */
export function serialize(e: El, pretty = false, depth = 0): string {
  const attrs = Object.entries(e.attrs).map(([k, v]) => ` ${k}="${escAttr(v)}"`).join('');
  const pad = pretty ? '\n' + '  '.repeat(depth) : '';
  if (TOKENS.has(e.tag)) return e.tag === 'mspace' ? `${pad}<mspace${attrs}/>` : `${pad}<${e.tag}${attrs}>${esc(e.text ?? '')}</${e.tag}>`;
  if (!e.kids.length) return `${pad}<${e.tag}${attrs}/>`;
  return `${pad}<${e.tag}${attrs}>${e.kids.map((k) => serialize(k, pretty, depth + 1)).join('')}${pad}</${e.tag}>`;
}

/** LaTeX maths as MathML text, ready to paste into Word or LibreOffice. */
export function texToMathML(src: string, opt: ToMathOptions = {}): string {
  const tree = texToTree(src);
  let body: El = tree.kids.length === 1 ? tree.kids[0] : tree;
  if (body.tag !== 'mrow') body = el('mrow', [body]);
  if (opt.annotate) body = el('semantics', [body, tok('annotation', unwrap(src).body.trim(), { encoding: 'application/x-tex' })]);
  const math = el('math', [body], { xmlns: 'http://www.w3.org/1998/Math/MathML', display: opt.display ? 'block' : 'inline' });
  return serialize(math, !!opt.pretty).trim();
}

// ---------------------------------------------------------------- MathML reading (a small XML parser)

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', NonBreakingSpace: '\u00a0', InvisibleTimes: '\u2062', it: '\u2062', ApplyFunction: '\u2061', af: '\u2061',
  InvisibleComma: '\u2063', ic: '\u2063', PlusMinus: '±', pm: '±', MinusPlus: '∓', times: '×', div: '÷', minus: '−', middot: '·', centerdot: '·', sdot: '⋅', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠',
  approx: '≈', equiv: '≡', infin: '∞', infty: '∞', part: '∂', PartialD: '∂', nabla: '∇', Del: '∇', sum: '∑', Sum: '∑', prod: '∏', Product: '∏', int: '∫', Integral: '∫', rarr: '→', rightarrow: '→',
  RightArrow: '→', larr: '←', harr: '↔', rArr: '⇒', lArr: '⇐', hArr: '⇔', isin: '∈', in: '∈', notin: '∉', sub: '⊂', sup: '⊃', sube: '⊆', supe: '⊇', cup: '∪', cap: '∩', forall: '∀', exist: '∃',
  prop: '∝', sim: '∼', cong: '≅', perp: '⊥', lang: '⟨', rang: '⟩', langle: '⟨', rangle: '⟩', LeftAngleBracket: '⟨', RightAngleBracket: '⟩', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋',
  hellip: '…', ctdot: '⋯', vellip: '⋮', dtdot: '⋱', prime: '′', Prime: '″', deg: '°', micro: 'µ', hbar: 'ℏ', planckh: 'ℎ', ell: 'ℓ', emptyset: '∅', empty: '∅', DifferentialD: 'ⅆ', dd: 'ⅆ', ExponentialE: 'ⅇ', ee: 'ⅇ', ImaginaryI: 'ⅈ', ii: 'ⅈ',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsi: 'ϵ', epsilon: 'ϵ', epsiv: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', thetav: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ',
  pi: 'π', piv: 'ϖ', rho: 'ρ', sigma: 'σ', sigmav: 'ς', tau: 'τ', upsi: 'υ', phi: 'ϕ', phiv: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
  Sigma: 'Σ', Upsi: 'ϒ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω', OverBar: '¯', UnderBar: '_', Hat: '^', tilde: '˜', dot: '˙', die: '¨', uml: '¨', macr: '¯', ThinSpace: '\u2009', thinsp: '\u2009',
  verbar: '|', vert: '|', Verbar: '‖', Vert: '‖', lbrace: '{', rbrace: '}', lcub: '{', rcub: '}', lpar: '(', rpar: ')', lsqb: '[', rsqb: ']', lbrack: '[', rbrack: ']', ast: '∗', compfn: '∘', cdot: '⋅',
};

/** Read MathML (or any small XML) into elements. Namespace prefixes (mml:) are dropped. Throws MathError with the position. */
export function parseXml(src: string): El {
  let i = 0;
  const err = (m: string, at = i): never => { throw new MathError(m, at); };
  const decode = (s: string, at: number) => s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g, (_, n: string) => {
    if (n[0] === '#') { const cp = n[1] === 'x' ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10); return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : '\ufffd'; }
    if (ENTITIES[n] != null) return ENTITIES[n];
    return err(`Unknown entity &${n}; in the MathML. Use the character itself or a number such as &#x3B1;.`, at);
  });
  const stack: El[] = [], root: El = el('#root');
  const top = () => stack[stack.length - 1] ?? root;
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    const textEnd = lt < 0 ? src.length : lt;
    if (textEnd > i) {
      const raw = src.slice(i, textEnd);
      if (raw.trim()) {
        if (!stack.length) err('There is text outside the <math> element. Paste only the MathML, starting with <math.', i + raw.search(/\S/));
        const t = top(); t.text = (t.text ?? '') + decode(raw, i);
      }
      i = textEnd;
    }
    if (lt < 0) break;
    if (src.startsWith('<!--', i)) { const e = src.indexOf('-->', i); if (e < 0) err('A comment <!-- is never closed with -->.'); i = e + 3; continue; }
    if (src.startsWith('<![CDATA[', i)) { const e = src.indexOf(']]>', i); if (e < 0) err('A <![CDATA[ section is never closed.'); const t = top(); t.text = (t.text ?? '') + src.slice(i + 9, e); i = e + 3; continue; }
    if (src.startsWith('<?', i)) { const e = src.indexOf('?>', i); if (e < 0) err('<? is never closed with ?>.'); i = e + 2; continue; }
    if (src.startsWith('<!', i)) { const e = src.indexOf('>', i); if (e < 0) err('<! is never closed.'); i = e + 1; continue; }
    const m = /^<(\/?)([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(src.slice(i));
    if (!m) err('A < here does not start a tag. In MathML text, write &lt; for a less-than sign.');
    const at = i, close = m![1] === '/', name = m![3];
    i += m![0].length;
    const attrs: Record<string, string> = {};
    for (;;) {
      const ws = /^\s*/.exec(src.slice(i))![0]; i += ws.length;
      if (src[i] === '>' ) { i++; break; }
      if (src.startsWith('/>', i)) { i += 2; if (close) err(`</${name}/> is not a valid tag.`, at); const e = el(name, [], attrs, at); top().kids.push(e); break; }
      const a = /^([A-Za-z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/.exec(src.slice(i));
      if (!a) err(i >= src.length ? `The tag <${name}> is never finished with >.` : `Cannot read the attribute here in <${name}>. Attributes look like name="value".`);
      if (close) err(`A closing tag </${name}> cannot have attributes.`, at);
      const key = a![1].replace(/^[\w.-]+:(?!$)/, (p) => (p === 'xmlns:' ? p : '')); attrs[key] = decode(a![3] ?? a![4], i); i += a![0].length;
      continue;
    }
    if (src[i - 2] === '/' && src[i - 1] === '>') continue;
    if (close) {
      const open = stack.pop();
      if (!open) err(`</${name}> here has no opening <${name}>.`, at);
      if (open!.tag !== name) err(`<${open!.tag}> (opened at character ${open!.pos! + 1}) is closed here by </${name}>.`, at);
    } else {
      const e = el(name, [], attrs, at); top().kids.push(e); stack.push(e);
    }
  }
  if (stack.length) err(`<${stack[stack.length - 1].tag}> is never closed. Add </${stack[stack.length - 1].tag}>.`, stack[stack.length - 1].pos);
  const maths = root.kids;
  if (!maths.length) err('No MathML found. Paste MathML that starts with <math.', 0);
  if (maths.length > 1) err('There is more than one top-level element. Paste one <math> element at a time.', maths[1].pos);
  return maths[0];
}

// ---------------------------------------------------------------- MathML to LaTeX

const OP_BACK = new Map<string, string>();
for (const [n, c] of OPS) if (!OP_BACK.has(c)) OP_BACK.set(c, n.length === 1 ? '\\' + n : '\\' + n);
for (const [n, c] of BIG) OP_BACK.set(c, '\\' + n);
for (const [n, c] of Object.entries(IDENT)) if (!OP_BACK.has(c)) OP_BACK.set(c, '\\' + n);
OP_BACK.set('|', '|'); OP_BACK.set('{', '\\{'); OP_BACK.set('}', '\\}'); OP_BACK.set('[', '['); OP_BACK.set(']', ']'); OP_BACK.set(':', ':');
OP_BACK.set('−', '-'); OP_BACK.set('-', '-'); OP_BACK.set('∗', '*'); OP_BACK.set('·', '\\cdot'); OP_BACK.set('~', '\\sim'); OP_BACK.set('^', '\\text{\\textasciicircum}');
OP_BACK.set('′', "'"); OP_BACK.set('″', "''"); OP_BACK.set('‴', "'''"); OP_BACK.set('…', '\\ldots'); OP_BACK.set('‖', '\\|'); OP_BACK.set('ⅆ', '\\mathrm{d}');
OP_BACK.set('∣', '\\mid'); OP_BACK.set('/', '/'); OP_BACK.set('\\', '\\backslash');
const GREEK_BACK = new Map<string, string>();
for (const [n, c] of Object.entries(GREEK)) if (!GREEK_BACK.has(c)) GREEK_BACK.set(c, '\\' + n);
GREEK_BACK.set('ϒ', '\\Upsilon');
const FONT_BACK: Record<string, string> = { normal: 'mathrm', italic: 'mathit', bold: 'mathbf', 'bold-italic': 'boldsymbol', 'double-struck': 'mathbb', script: 'mathcal', fraktur: 'mathfrak', 'sans-serif': 'mathsf', monospace: 'mathtt', 'bold-sans-serif': 'mathsfbf', 'bold-script': 'mathcal', 'bold-fraktur': 'mathfrak', 'sans-serif-italic': 'mathsf' };
const NOT_BACK = new Map(Object.entries(NOT).map(([a, b]) => [b, a]));
const ACCENT_BACK: Record<string, [string, string]> = { // character: [narrow, wide]
  '^': ['hat', 'widehat'], 'ˆ': ['hat', 'widehat'], '̂': ['hat', 'widehat'], 'ˇ': ['check', 'widecheck'], '~': ['tilde', 'widetilde'], '˜': ['tilde', 'widetilde'], '̃': ['tilde', 'widetilde'],
  '´': ['acute', 'acute'], '`': ['grave', 'grave'], '˙': ['dot', 'dot'], '̇': ['dot', 'dot'], '¨': ['ddot', 'ddot'], '̈': ['ddot', 'ddot'], '⃛': ['dddot', 'dddot'], '˘': ['breve', 'breve'], '˚': ['mathring', 'mathring'],
  '¯': ['bar', 'overline'], '‾': ['overline', 'overline'], '―': ['overline', 'overline'], '̅': ['bar', 'overline'], '_': ['overline', 'overline'],
  '→': ['vec', 'overrightarrow'], '⃗': ['vec', 'overrightarrow'], '←': ['overleftarrow', 'overleftarrow'], '↔': ['overleftrightarrow', 'overleftrightarrow'], '⏞': ['overbrace', 'overbrace'], '︷': ['overbrace', 'overbrace'],
};
const UNDER_BACK: Record<string, string> = { '_': 'underline', '‾': 'underline', '¯': 'underline', '̲': 'underline', '―': 'underline', '⏟': 'underbrace', '︸': 'underbrace', '→': 'underrightarrow', '←': 'underleftarrow' };
const FENCE_ENV: Record<string, string> = { '()': 'pmatrix', '[]': 'bmatrix', '{}': 'Bmatrix', '||': 'vmatrix', '‖‖': 'Vmatrix', '∣∣': 'vmatrix', '{': 'cases' };
const LIMOPS = new Set(['lim', 'max', 'min', 'sup', 'inf', 'det', 'gcd', 'Pr', 'lim sup', 'lim inf', 'limsup', 'liminf', 'arg max', 'arg min', 'argmax', 'argmin']);

const CHILD_COUNT: Record<string, number> = { mfrac: 2, mroot: 2, msub: 2, msup: 2, msubsup: 3, munder: 2, mover: 2, munderover: 3 };
const KNOWN = new Set(['math', 'mrow', 'mi', 'mn', 'mo', 'mtext', 'ms', 'mspace', 'mfrac', 'msqrt', 'mroot', 'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover', 'mtable', 'mtr', 'mlabeledtr', 'mtd',
  'mstyle', 'mpadded', 'mphantom', 'semantics', 'annotation', 'annotation-xml', 'mfenced', 'menclose', 'none', 'mprescripts', 'mmultiscripts', 'merror', 'maction']);

/** Text of a token element with its surrounding white space trimmed (as MathML renders it). */
const tt = (e: El) => (e.text ?? '').replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
const isMo = (e: El | undefined, ch?: string) => !!e && e.tag === 'mo' && (ch == null || tt(e) === ch);
/** Relations and binary operators get a space each side in the LaTeX, for reading. */
const SPACED = new Set([...'=<>+−±∓×÷⋅≤≥≠≈≡∼≃≅∝≪≫∈∉∋⊂⊃⊆⊇→←↔⇒⇐⇔⟹⟸⟺↦∪∩∧∨⊕⊗', '-']);
const truthy = (v: string | undefined) => v === 'true';

class TexWriter {
  need(e: El) {
    if (!KNOWN.has(e.tag)) throw new MathError(`The MathML element <${e.tag}> is not supported.`, e.pos ?? 0);
    const n = CHILD_COUNT[e.tag];
    if (n != null && e.kids.length !== n) throw new MathError(`<${e.tag}> must have exactly ${n} child elements; this one has ${e.kids.length}.`, e.pos ?? 0);
  }

  /** LaTeX for one element. */
  w(e: El): string {
    this.need(e);
    switch (e.tag) {
      case 'math': case 'mrow': case 'mpadded': case 'mtd': return this.seq(e.kids);
      case 'semantics': return e.kids.length ? this.w(e.kids[0]) : '';
      case 'annotation': case 'annotation-xml': return '';
      case 'mstyle': return this.style(e);
      case 'mphantom': return `\\phantom{${this.seq(e.kids)}}`;
      case 'menclose': if ((e.attrs.notation ?? 'longdiv').split(/\s+/).includes('box')) return `\\boxed{${this.seq(e.kids)}}`; return this.seq(e.kids);
      case 'merror': throw new MathError('The MathML contains an <merror> (an error from the program that made it).', e.pos ?? 0);
      case 'maction': return e.kids.length ? this.w(e.kids[0]) : '';
      case 'mi': return this.mi(e);
      case 'mn': return this.mn(e);
      case 'mo': return this.mo(e);
      case 'mtext': case 'ms': return this.mtext(e);
      case 'mspace': return this.space(e);
      case 'mfrac': return this.frac(e);
      case 'msqrt': return `\\sqrt{${this.seq(e.kids)}}`;
      case 'mroot': return `\\sqrt[${this.w(e.kids[1])}]{${this.w(e.kids[0])}}`;
      case 'msub': case 'msup': case 'msubsup': return this.scripts(e);
      case 'munder': case 'mover': case 'munderover': return this.underover(e);
      case 'mtable': return this.table(e, null);
      case 'mfenced': return this.fenced(e);
      case 'mmultiscripts': return this.multi(e);
      default: throw new MathError(`<${e.tag}> cannot be used here.`, e.pos ?? 0);
    }
  }

  /** A sequence of elements, with patterns spotted: \left...\right, binomials, matrices with fences, the invisible operators. */
  seq(kids: El[]): string {
    // A function name followed by the invisible "apply function" sign is written with \operatorname.
    kids.forEach((k, j) => { const nx = kids[j + 1]; if (nx && nx.tag === 'mo' && tt(nx) === '\u2061') { const b = /^m(sub|sup|subsup|under|over|underover)$/.test(k.tag) ? k.kids[0] : k; if (b) b._fn = true; } });
    kids = kids.filter((k) => !(k.tag === 'mo' && /^[\u2061\u2062\u2063\u2064]$/.test(tt(k))));
    const n = kids.length;
    if (n >= 2 && isMo(kids[0]) && isMo(kids[n - 1])) {
      const a = tt(kids[0]), b = tt(kids[n - 1]), inner = kids.slice(1, -1);
      // Matrices: ( mtable ), [ mtable ] ...
      if (inner.length === 1 && inner[0].tag === 'mtable' && FENCE_ENV[a + b]) return this.table(inner[0], FENCE_ENV[a + b]);
      // Binomial: ( mfrac with no line ).
      if (inner.length === 1 && inner[0].tag === 'mfrac' && /^0(\.0*)?([a-z]+)?$/.test(inner[0].attrs.linethickness ?? '') && a === '(' && b === ')') return `\\binom{${this.w(inner[0].kids[0])}}{${this.w(inner[0].kids[1])}}`;
      const stretch = (m: El, form: string) => truthy(m.attrs.stretchy) || truthy(m.attrs.fence) && m.attrs.stretchy !== 'false' && m.attrs.form === form;
      if (stretch(kids[0], 'prefix') && stretch(kids[n - 1], 'postfix') && !kids[0].attrs.minsize) {
        const mid = inner.map((k) => (k.tag === 'mo' && truthy(k.attrs.stretchy) && !k.attrs.minsize && FENCE_CHARS.has(tt(k)) ? `\\middle${this.delimTex(tt(k))}` : this.w(k)));
        return `\\left${this.delimTex(a)} ${this.join(mid)} \\right${this.delimTex(b)}`;
      }
    }
    if (n === 2 && isMo(kids[0], '{') && kids[1].tag === 'mtable') return this.table(kids[1], 'cases');
    const parts: string[] = [];
    for (let j = 0; j < n; j++) {
      const k = kids[j];
      // An empty <mi/> or <mo/> placeholder.
      if ((k.tag === 'mi' || k.tag === 'mo' || k.tag === 'mn') && tt(k) === '') continue;
      const p = this.w(k);
      const unary = /^[-+−±∓]$/.test(tt(k)) && (!parts.length || kids[j - 1]?.tag === 'mo');
      parts.push(k.tag === 'mo' && parts.length && SPACED.has(tt(k)) && !k.attrs.minsize && !unary ? ` ${p} ` : p);
    }
    return this.join(parts);
  }

  /** Join pieces of LaTeX, with a space where a command name would run into a letter, and around relations. */
  join(parts: string[]): string {
    let out = '';
    for (const p of parts) {
      if (!p) continue;
      if (out && (/\\[a-zA-Z]+$/.test(out) || /[_^][a-zA-Z0-9]$/.test(out)) && /^[a-zA-Z0-9]/.test(p)) out += ' ';
      out += p;
    }
    return out;
  }

  /** Braces when the LaTeX is more than one token. */
  br(s: string): string {
    if (/^([a-zA-Z0-9]|\\[a-zA-Z]+|\\.|[^\\{}\s^_'&%#~$])$/u.test(s)) return s;
    return `{${s}}`;
  }

  delimTex(c: string): string {
    if (c === '') return '.';
    if ('()[]|/'.includes(c)) return c;
    if (c === '{') return '\\{'; if (c === '}') return '\\}';
    if (c === '‖' || c === '‖') return '\\|';
    if (c === '∣') return '|';
    const back = OP_BACK.get(c);
    if (back && DELIM_CMDS.has(back.slice(1))) return back;
    if (c === '<') return '\\langle'; if (c === '>') return '\\rangle';
    throw new MathError(`"${c}" cannot be used as a stretchy bracket in LaTeX.`, 0);
  }

  mi(e: El): string {
    const t = tt(e), v = e.attrs.mathvariant;
    if (!t) return '';
    const chars = [...t];
    if (chars.length > 1) {
      if (FUNCS.includes(t) || LIMFUNCS.includes(t)) return '\\' + t;
      if (LIMOPS.has(t)) return '\\' + t.replace(' ', '');
      if (e._fn && /^[A-Za-z][A-Za-z0-9 -]*$/.test(t)) return `\\operatorname{${t}}`;
      if (v && v !== 'italic' && FONT_BACK[v]) return `\\${FONT_BACK[v]}{${chars.map((c) => this.letter(c)).join('')}}`;
      if (/^[A-Za-z][A-Za-z0-9]*$/.test(t)) return `\\mathrm{${t}}`;
      return this.join(chars.map((c) => this.letter(c, v)));
    }
    if (e._fn && /^[A-Za-z]$/.test(t)) return `\\operatorname{${t}}`;
    return this.letter(t, v);
  }

  /** One letter (Greek, a maths alphabet letter, or plain) with its font. */
  letter(c: string, v?: string): string {
    const u = unstyled(c);
    if (u) return u[1] === 'italic' ? this.letter(u[0]) : `\\${FONT_BACK[u[1]]}{${this.letter(u[0])}}`;
    let base = GREEK_BACK.get(c) ?? OP_BACK.get(c) ?? (/[a-zA-Z0-9]/.test(c) ? c : c === ' ' || c === '\u00a0' ? '\\ ' : c);
    if (c === '∞' || c === '∂' || c === '∇') base = OP_BACK.get(c)!;
    if (v && v !== 'italic' && FONT_BACK[v]) {
      if (v === 'normal' && (/[Α-Ω]/.test(c) || !GREEK_BACK.has(c) && /[^a-zA-Z0-9]/.test(c))) return base; // upright Greek capitals are the LaTeX default
      return `\\${FONT_BACK[v]}{${base}}`;
    }
    if (v === 'italic' && /^[A-ZΑ-Ω]$/.test(c) && GREEK_BACK.has(c)) return `\\mathit{${base}}`;
    return base;
  }

  mn(e: El): string {
    const t = tt(e), v = e.attrs.mathvariant;
    const plain = [...t].map((c) => { const u = unstyled(c); return u ? u : [c, '']; });
    const font = plain.find((p) => p[1])?.[1] ?? (v && v !== 'normal' ? v : '');
    const s = plain.map((p) => (/[0-9.,]/.test(p[0]) ? p[0] : this.letter(p[0]))).join('');
    return font && FONT_BACK[font] ? `\\${FONT_BACK[font]}{${s}}` : s;
  }

  mo(e: El): string {
    const t = tt(e);
    if (!t) return '';
    if (e.attrs.minsize || e.attrs.maxsize) {
      const size = parseFloat(e.attrs.minsize || e.attrs.maxsize || '0');
      const nm = size >= 2.3 ? 'Bigg' : size >= 1.85 ? 'bigg' : size >= 1.4 ? 'Big' : 'big';
      const lr = e.attrs.form === 'prefix' ? 'l' : e.attrs.form === 'postfix' ? 'r' : '';
      if (FENCE_CHARS.has(t) || t === '/' || t === '\\') return `\\${nm}${lr}${this.delimTex(t)}`;
    }
    if (LIMOPS.has(t) || FUNCS.includes(t)) return '\\' + t.replace(' ', '');
    if (t === 'mod') return '\\bmod';
    if (NOT_BACK.has(t) && !OP_BACK.has(t)) { const b = NOT_BACK.get(t)!; const nb = OP_BACK.get(b) ?? b; return `\\not${/^\\[a-zA-Z]/.test(nb) ? nb : nb}`; }
    if (t.length === 2 && t[1] === '\u0338') return `\\not${OP_BACK.get(t[0]) ?? t[0]}`;
    const chars = [...t];
    if (chars.length > 1) {
      if (/^[A-Za-z][A-Za-z ]*$/.test(t)) return `\\operatorname{${t}}`;
      if (/^′+$/.test(t)) return "'".repeat(chars.length);
      return this.join(chars.map((c) => this.moChar(c)));
    }
    return this.moChar(t);
  }
  moChar(c: string): string {
    const back = OP_BACK.get(c);
    if (back) return back === '\\{' || back === '\\}' ? back : back;
    if (c === '-') return '-';
    if (c === '<' || c === '>' || c === '=' || c === '+' || c === ',' || c === ';' || c === '!' || c === '?' || c === '.' || c === '(' || c === ')' || c === '@') return c;
    if (c === '%' || c === '&' || c === '#' || c === '$' || c === '_') return '\\' + c;
    return c;
  }

  mtext(e: El): string {
    const raw = e.text ?? '';
    const t = raw.replace(/[ \t\r\n]+/g, ' ');
    const trimmed = t.replace(/^ +| +$/g, '');
    if (!trimmed) return t.includes('\u00a0') || raw.length ? '\\ ' : '';
    if (/^\u00a0+$/.test(trimmed)) return trimmed.split('').map(() => '\\ ').join('');
    const body = trimmed.replace(/[\\{}%&$#_^~]/g, (c) => ({ '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '%': '\\%', '&': '\\&', $: '\\$', '#': '\\#', _: '\\_', '^': '\\textasciicircum{}', '~': '\\textasciitilde{}' } as Record<string, string>)[c]).replace(/\u00a0/g, ' ');
    const v = e.attrs.mathvariant;
    const cmd = v === 'bold' ? 'textbf' : v === 'italic' ? 'textit' : v === 'sans-serif' ? 'textsf' : v === 'monospace' ? 'texttt' : 'text';
    return `\\${cmd}{${body}}`;
  }

  space(e: El): string {
    const w = e.attrs.width ?? '0';
    const m = /^(-?[\d.]+)\s*(em|ex|mu|pt|px)?$/.exec(w.trim());
    let em = 0;
    if (m) { const x = Number(m[1]); em = m[2] === 'ex' ? x * 0.43 : m[2] === 'mu' ? x / 18 : m[2] === 'pt' ? x / 10 : m[2] === 'px' ? x / 16 : x; }
    else if (/thinmathspace/.test(w)) em = 0.167; else if (/mediummathspace/.test(w)) em = 0.222; else if (/thickmathspace/.test(w)) em = 0.278;
    if (em < -0.01) return '\\!';
    if (em < 0.05) return '';
    const opts: [number, string][] = [[0.167, '\\,'], [0.222, '\\:'], [0.278, '\\;'], [0.333, '\\ '], [1, '\\quad'], [2, '\\qquad']];
    return opts.reduce((a, b) => (Math.abs(Math.log(b[0] / em)) < Math.abs(Math.log(a[0] / em)) ? b : a))[1];
  }

  frac(e: El): string {
    const lt = e.attrs.linethickness ?? '';
    if (/^0(\.0*)?([a-z]+)?$/.test(lt)) throw new MathError('A fraction with no line (linethickness 0) is only supported as a binomial, inside ( ).', e.pos ?? 0);
    return `\\frac{${this.w(e.kids[0])}}{${this.w(e.kids[1])}}`;
  }

  style(e: El): string {
    const d = e.attrs.displaystyle;
    if (e.kids.length === 1 && e.kids[0].tag === 'mfrac' && (d === 'true' || d === 'false') && !/^0/.test(e.kids[0].attrs.linethickness ?? '')) {
      const f = e.kids[0];
      return `\\${d === 'true' ? 'dfrac' : 'tfrac'}{${this.w(f.kids[0])}}{${this.w(f.kids[1])}}`;
    }
    if (e.kids.length === 1 && e.kids[0].tag === 'mrow' && (d === 'true' || d === 'false')) {
      const r = e.kids[0].kids;
      if (r.length === 3 && isMo(r[0], '(') && isMo(r[2], ')') && r[1].tag === 'mfrac' && /^0/.test(r[1].attrs.linethickness ?? '')) return `\\${d === 'true' ? 'dbinom' : 'tbinom'}{${this.w(r[1].kids[0])}}{${this.w(r[1].kids[1])}}`;
    }
    const v = e.attrs.mathvariant;
    let inner = this.seq(e.kids);
    if (v && v !== 'normal' && FONT_BACK[v]) inner = `\\${FONT_BACK[v]}{${inner}}`;
    if (d === 'true') return `{\\displaystyle ${inner}}`;
    if (d === 'false' && e.attrs.scriptlevel !== '1') return `{\\textstyle ${inner}}`;
    return inner;
  }

  /** A base that needs braces before ^ or _ (anything but one token). */
  base(e: El): string {
    if ((e.tag === 'mrow' || e.tag === 'mpadded') && e.kids.length === 1) return this.base(e.kids[0]);
    const s = this.w(e);
    if (e.tag === 'mrow' && e.kids.length === 0) return '{}';
    if (e.tag === 'mrow' || e.tag === 'mstyle') {
      // \left( ... \right) and fenced matrices are single groups already.
      if (/^\\left/.test(s) && /\\right(\\?.)$/.test(s) || /^\\begin\{/.test(s) && /\\end\{[a-zA-Z]+\}$/.test(s) || /^\\binom/.test(s)) return s;
      return `{${s}}`;
    }
    if (e.tag === 'msub' || e.tag === 'msup' || e.tag === 'msubsup' || /^m(under|over|underover)$/.test(e.tag) && /[_^]/.test(s.replace(/\{[^{}]*\}/g, '')) ) return `{${s}}`;
    if (e.tag === 'mo' && s === "'") return '{}' + s;
    return s;
  }

  isBig(e: El): boolean { const t = tt(e); return e.tag === 'mo' && (BIG.some(([, c]) => c === t) || LIMOPS.has(t)) || e.tag === 'mi' && LIMOPS.has(t); }

  /** ^{...}: primes written as '. */
  sup(e: El): string {
    const t = e.tag === 'mo' || e.tag === 'mi' ? tt(e) : '';
    if (/^[′″‴]+$/.test(t)) return t.replace(/′/g, "'").replace(/″/g, "''").replace(/‴/g, "'''");
    if (e.tag === 'mrow' && e.kids.length > 1 && (e.kids[0].tag === 'mo' || e.kids[0].tag === 'mi') && /^[′″‴]+$/.test(tt(e.kids[0]))) {
      const p = tt(e.kids[0]).replace(/′/g, "'").replace(/″/g, "''").replace(/‴/g, "'''");
      return p + '^' + this.br(this.seq(e.kids.slice(1)));
    }
    return '^' + this.br(this.w(e));
  }

  scripts(e: El): string {
    const [b, x, y] = e.kids;
    const base = this.base(b);
    const big = this.isBig(b) && b.tag === 'mo' && BIG.some(([, c, l]) => c === tt(b) && l) || LIMOPS.has(tt(b));
    const nl = big ? '\\nolimits' : '';
    if (e.tag === 'msub') return `${base}${nl}_${this.br(this.w(x))}`;
    if (e.tag === 'msup') return `${base}${nl}${this.sup(x)}`;
    const sp = this.sup(y);
    return /^'/.test(sp) ? `${base}${nl}${sp}_${this.br(this.w(x))}` : `${base}${nl}_${this.br(this.w(x))}${sp}`;
  }

  underover(e: El): string {
    const [b, x, y] = e.kids;
    // \overbrace{...}^{label} and \underbrace{...}_{label}.
    if (e.tag === 'mover' && b.tag === 'mover' && isMo(b.kids[1]) && /^[⏞︷]$/.test(tt(b.kids[1]))) return `\\overbrace{${this.w(b.kids[0])}}^${this.br(this.w(x))}`;
    if (e.tag === 'munder' && b.tag === 'munder' && isMo(b.kids[1]) && /^[⏟︸]$/.test(tt(b.kids[1]))) return `\\underbrace{${this.w(b.kids[0])}}_${this.br(this.w(x))}`;
    // Accents and braces.
    if (e.tag === 'mover' && x.tag === 'mo' && ACCENT_BACK[tt(x)] && !this.isBig(b)) {
      const arrow = /^[→←↔⃗]$/.test(tt(x));
      const isAccent = truthy(e.attrs.accent) || truthy(x.attrs.accent) || e.attrs.accent == null && (!arrow || truthy(x.attrs.stretchy));
      if (isAccent || /^[⏞︷]$/.test(tt(x))) {
        const [narrow, wide] = ACCENT_BACK[tt(x)];
        const stretchy = x.attrs.stretchy === 'true' || (x.attrs.stretchy == null && ['‾', '―', '_', '⏞', '︷', '←', '↔'].includes(tt(x)));
        const name = stretchy ? wide : narrow;
        return `\\${name}{${this.w(b)}}`;
      }
    }
    if (e.tag === 'munder' && x.tag === 'mo' && UNDER_BACK[tt(x)] && !this.isBig(b) && (e.attrs.accentunder !== 'false' || /^[⏟︸]$/.test(tt(x)))) return `\\${UNDER_BACK[tt(x)]}{${this.w(b)}}`;
    // Limits on a large operator or lim.
    if (this.isBig(b) || (b.tag === 'mo' && truthy(b.attrs.movablelimits))) {
      const base = this.w(b);
      const sumlike = BIG.some(([, c, l]) => c === tt(b) && l) || LIMOPS.has(tt(b)) || b.tag === 'mo' && truthy(b.attrs.movablelimits) && !BIG.some(([, c]) => c === tt(b));
      const lim = sumlike ? '' : '\\limits';
      if (e.tag === 'munder') return `${base}${lim}_${this.br(this.w(x))}`;
      if (e.tag === 'mover') return `${base}${lim}^${this.br(this.w(x))}`;
      return `${base}${lim}_${this.br(this.w(x))}^${this.br(this.w(y))}`;
    }
    if (e.tag === 'munder') return `\\underset{${this.w(x)}}{${this.w(b)}}`;
    if (e.tag === 'mover') return `\\overset{${this.w(x)}}{${this.w(b)}}`;
    return `\\underset{${this.w(x)}}{\\overset{${this.w(y)}}{${this.w(b)}}}`;
  }

  table(e: El, env: string | null): string {
    const rows = e.kids.filter((r) => r.tag === 'mtr' || r.tag === 'mlabeledtr');
    for (const r of e.kids) if (r.tag !== 'mtr' && r.tag !== 'mlabeledtr') throw new MathError(`<mtable> may only hold <mtr> rows; found <${r.tag}>.`, r.pos ?? 0);
    const align = (e.attrs.columnalign ?? '').trim().split(/\s+/).filter(Boolean);
    if (!env) {
      if (align[0] === 'right' && align[1] === 'left' && (/^0/.test(e.attrs.columnspacing ?? '') || e.attrs.displaystyle === 'true')) env = 'aligned';
      else if (!align.length && e.attrs.displaystyle === 'true') env = 'gathered';
      else if (!align.length && e.attrs.displaystyle === 'false') env = 'smallmatrix';
      else if (align.some((a) => a !== 'center')) {
        const width = Math.max(...rows.map((r) => r.kids.length - (r.tag === 'mlabeledtr' ? 1 : 0)));
        const spec = Array.from({ length: width }, (_, j) => (align[Math.min(j, align.length - 1)] ?? 'center')[0]).join('');
        return `\\begin{array}{${spec}}${this.rowsTex(rows)}\\end{array}`;
      } else env = 'matrix';
    }
    return `\\begin{${env}}${this.rowsTex(rows)}\\end{${env}}`;
  }
  rowsTex(rows: El[]): string {
    return ' ' + rows.map((r) => {
      const cells = r.tag === 'mlabeledtr' ? r.kids.slice(1) : r.kids;
      return cells.map((c) => { if (c.tag !== 'mtd') throw new MathError(`<mtr> may only hold <mtd> cells; found <${c.tag}>.`, c.pos ?? 0); return this.seq(c.kids); }).join(' & ');
    }).join(' \\\\ ') + ' ';
  }

  fenced(e: El): string {
    const open = e.attrs.open ?? '(', close = e.attrs.close ?? ')';
    const seps = (e.attrs.separators ?? ',').replace(/\s/g, '');
    const parts: string[] = [];
    e.kids.forEach((k, j) => { if (j) parts.push(seps ? this.moChar(seps[Math.min(j - 1, seps.length - 1)]) : ''); parts.push(this.w(k)); });
    if (e.kids.length === 1 && e.kids[0].tag === 'mtable' && FENCE_ENV[open + close]) return this.table(e.kids[0], FENCE_ENV[open + close]);
    return `\\left${this.delimTex(open)} ${this.join(parts)} \\right${this.delimTex(close)}`;
  }

  multi(e: El): string {
    const k = e.kids, at = k.findIndex((x) => x.tag === 'mprescripts');
    const post = at < 0 ? k.slice(1) : k.slice(1, at), pre = at < 0 ? [] : k.slice(at + 1);
    const pair = (a: El[]) => { let s = ''; for (let j = 0; j + 1 < a.length + 1; j += 2) { const sb = a[j], sp = a[j + 1]; if (sb && sb.tag !== 'none') s += '_' + this.br(this.w(sb)); if (sp && sp.tag !== 'none') s += '^' + this.br(this.w(sp)); } return s; };
    return (pre.length ? `{}${pair(pre)}` : '') + this.base(k[0]) + pair(post);
  }
}

/** MathML to LaTeX. Throws MathError (with a position in the MathML) for anything it cannot read. */
export function mathmlToTex(src: string): string {
  if (src.length > 200000) throw new MathError('That is very long. Convert one equation (up to 200,000 characters of MathML) at a time.', 0);
  if (!src.trim()) throw new MathError('Paste some MathML first.', 0);
  const m = parseXml(src);
  if (m.tag !== 'math' && !KNOWN.has(m.tag)) throw new MathError(`<${m.tag}> is not MathML. Paste MathML that starts with <math.`, m.pos ?? 0);
  return new TexWriter().w(m).replace(/\s+/g, ' ').trim();
}

/** The LaTeX commands this converter knows, by group, for the help list on the page. */
export const SUPPORTED = {
  greek: Object.keys(GREEK),
  symbols: Object.keys(IDENT),
  operators: OPS.map(([n]) => n).filter((n) => /^[a-zA-Z]+$/.test(n)),
  large: BIG.map(([n]) => n),
  functions: FUNCS.concat(LIMFUNCS),
  accents: Object.keys(ACCENTS).concat(Object.keys(UNDERS)),
  fonts: Object.keys(FONTS),
  text: Object.keys(TEXTS),
  environments: Object.keys(ENVS),
  structures: ['frac', 'dfrac', 'tfrac', 'cfrac', 'binom', 'dbinom', 'tbinom', 'sqrt', 'overset', 'underset', 'stackrel', 'left', 'middle', 'right', 'big', 'Big', 'bigg', 'Bigg', 'not', 'operatorname', 'phantom', 'boxed', 'limits', 'nolimits', 'displaystyle', 'textstyle'],
  spaces: [',', ':', ';', '!', 'quad', 'qquad'],
};
