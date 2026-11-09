// Author list and affiliation formatter: reads a simple line format (one author per line, affiliations by number
// or written out), merges repeated affiliations, numbers them in order of first use and writes the author block for
// common journal LaTeX classes (AASTeX, MNRAS, A&A, REVTeX, elsarticle), a superscript list for Word or HTML, and
// JATS-style XML. Plain TypeScript, no DOM.

export type Author = { name: string; given: string; family: string; affs: number[]; orcid: string; email: string; corresponding: boolean };
export type AuthorList = { authors: Author[]; affs: string[]; warnings: string[]; errors: string[] };
export type TexOptions = { latexAccents?: boolean; orcidLink?: boolean };

const ORCID_RE = /^(?:https?:\/\/(?:www\.)?orcid\.org\/|orcid[:\s]*)?(\d{4}-\d{4}-\d{4}-\d{3}[\dXx])$/i;
const EMAIL_RE = /^(?:e-?mail[:\s]*)?([^\s@;|,<>]+@[^\s@;|,<>]+\.[^\s@;|,<>]+)$/i;

/** ORCID check digit (ISO 7064 MOD 11-2) over the first 15 digits. */
export function orcidValid(id: string): boolean {
  const d = id.replace(/-/g, '').toUpperCase();
  if (!/^\d{15}[\dX]$/.test(d)) return false;
  let t = 0;
  for (let i = 0; i < 15; i++) t = (t + Number(d[i])) * 2;
  const r = (12 - (t % 11)) % 11;
  return d[15] === (r === 10 ? 'X' : String(r));
}

/** A key for spotting the same affiliation written twice: case, spacing and end punctuation ignored. */
export const affKey = (s: string) => s.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/[\s.,;]+$/, '').trim();
const tidy = (s: string) => s.normalize('NFC').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/[\s,;]+$/, '').trim();

/** Split a name into given names and family name. "Family, Given" keeps a several-word family name together. */
export function splitName(raw: string): { name: string; given: string; family: string } {
  const s = tidy(raw);
  const c = s.indexOf(',');
  if (c > 0) {
    const family = s.slice(0, c).trim(), given = s.slice(c + 1).trim();
    return { name: given ? `${given} ${family}` : family, given, family };
  }
  const w = s.split(' ');
  const family = w.pop() ?? '';
  return { name: s, given: w.join(' '), family };
}

/** Initials of the given names: "Ada Mary" -> "A. M.", "Jean-Paul" -> "J.-P.". Words already ending in "." stay. */
export function initials(given: string): string {
  return given.split(/\s+/).filter(Boolean).map((w) => (/^\p{Lu}\.$/u.test(w) ? w : w.split('-').map((p) => (p ? [...p][0].toUpperCase() + '.' : '')).join('-'))).join(' ');
}

/** Read the line format. Affiliation lines: `key = text`. Author lines: `Name; affiliations; ORCID; email; *`. */
export function parseAuthors(text: string): AuthorList {
  const warnings: string[] = [], errors: string[] = [];
  const defs = new Map<string, string>();
  const lines = text.split(/\r?\n/).map((l, i) => ({ l: l.trim(), n: i + 1 })).filter((x) => x.l && !/^[#%]/.test(x.l));
  const authorLines: typeof lines = [];
  for (const x of lines) {
    const m = x.l.match(/^\[?([\p{L}\p{N}]{1,8})\]?\s*=\s*(.+)$/u);
    if (m) { if (defs.has(m[1])) warnings.push(`Line ${x.n}: affiliation ${m[1]} is defined twice; the later text is used.`); defs.set(m[1], tidy(m[2])); }
    else authorLines.push(x);
  }
  // Affiliations are numbered in order of first use, with repeats merged.
  const affs: string[] = [], index = new Map<string, number>();
  const affNo = (t: string) => { const k = affKey(t); if (!index.has(k)) { affs.push(tidy(t)); index.set(k, affs.length); } return index.get(k)!; };
  const authors: Author[] = [];
  const usedDefs = new Set<string>();
  for (const { l, n } of authorLines) {
    const parts = (l.includes('|') ? l.split('|') : l.split(';')).map((p) => p.trim());
    const nm = splitName(parts[0]);
    if (!nm.family) { errors.push(`Line ${n}: no name before the first ";".`); continue; }
    const a: Author = { ...nm, affs: [], orcid: '', email: '', corresponding: false };
    for (let p of parts.slice(1)) {
      if (!p) continue;
      const cm = p.match(/^(\*|corr(?:esponding)?(?:\s+author)?\b)\s*:?\s*/i);
      if (cm) { a.corresponding = true; p = p.slice(cm[0].length).trim(); if (!p) continue; }
      const om = p.match(ORCID_RE);
      if (om) { a.orcid = om[1].toUpperCase(); if (!orcidValid(a.orcid)) warnings.push(`Line ${n}: the ORCID ${a.orcid} for ${a.name} fails its check digit; check for a typo.`); continue; }
      if (/\d{4}-\d{4}-\d{4}-\d{3}/.test(p) && /orcid/i.test(p)) { warnings.push(`Line ${n}: could not read the ORCID in "${p}".`); continue; }
      const em = p.match(EMAIL_RE);
      if (em) { a.email = em[1]; continue; }
      const toks = p.split(',').map((t) => t.trim()).filter(Boolean);
      if (toks.length && toks.every((t) => defs.has(t))) { for (const t of toks) { usedDefs.add(t); a.affs.push(affNo(defs.get(t)!)); } continue; }
      if (toks.length && toks.every((t) => /^\p{N}{1,3}$/u.test(t))) { errors.push(`Line ${n}: affiliation ${toks.filter((t) => !defs.has(t)).join(', ')} is not defined. Add a line such as "${toks.find((t) => !defs.has(t))} = Department, University, City, Country".`); continue; }
      a.affs.push(affNo(p));
    }
    a.affs = [...new Set(a.affs)].sort((x, y) => x - y);
    if (!a.affs.length) warnings.push(`Line ${n}: ${a.name} has no affiliation.`);
    if (a.corresponding && !a.email) warnings.push(`Line ${n}: ${a.name} is the corresponding author but has no email.`);
    authors.push(a);
  }
  for (const k of defs.keys()) if (!usedDefs.has(k)) warnings.push(`Affiliation ${k} is not used by any author, so it is left out.`);
  if (!authors.length && !errors.length) errors.push('No authors found. Write one author per line, such as "Ada Lovelace; 1, 2".');
  if (authors.length && !authors.some((a) => a.corresponding)) warnings.push('No corresponding author is marked. Add "*" and an email to one author line.');
  return { authors, affs, warnings, errors };
}

// ---------- LaTeX ----------
const SPECIAL: Record<string, string> = { '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_', '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' };
const MARKS: Record<string, string> = { '́': "'", '̀': '`', '̂': '^', '̈': '"', '̃': '~', '̄': '=', '̇': '.', '̧': 'c', '̌': 'v', '̆': 'u', '̊': 'r', '̋': 'H', '̨': 'k' };
const LETTERS: Record<string, string> = { ø: '{\\o}', Ø: '{\\O}', ß: '{\\ss}', æ: '{\\ae}', Æ: '{\\AE}', œ: '{\\oe}', Œ: '{\\OE}', å: '{\\aa}', Å: '{\\AA}', ł: '{\\l}', Ł: '{\\L}', ı: '{\\i}', đ: '{\\dj}', Đ: '{\\DJ}' };

/** One accented letter as a LaTeX command, such as é -> {\'e}, ç -> {\c{c}}, í -> {\'\i}. */
function accent(ch: string): string | null {
  if (LETTERS[ch]) return LETTERS[ch];
  const d = ch.normalize('NFD');
  if (d.length < 2) return null;
  let base = d[0];
  const marks = [...d.slice(1)];
  if (!/[A-Za-z]/.test(base) || marks.some((m) => !MARKS[m])) return null;
  if (base === 'i' || base === 'j') base = '\\' + base;
  let out = base;
  for (const m of marks) { const c = MARKS[m]; out = /[a-zA-Z]/.test(c) ? `\\${c}{${out}}` : `\\${c}${out.length > 1 && out !== '\\i' && out !== '\\j' ? `{${out}}` : out}`; }
  return `{${out}}`;
}

/** Text safe for LaTeX: special characters escaped; accented letters as commands when asked. */
export function tex(s: string, latexAccents = false): string {
  let out = '';
  for (const ch of s.normalize('NFC')) {
    if (SPECIAL[ch]) out += SPECIAL[ch];
    else if (latexAccents && /[^\x00-\x7f]/.test(ch)) out += accent(ch) ?? ch;
    else out += ch;
  }
  return out;
}

const orcidTail = (a: Author, o: TexOptions) => (a.orcid && o.orcidLink ? `\\orcidlink{${a.orcid}}` : '');
const orcidComments = (L: AuthorList, o: TexOptions) => (o.orcidLink || !L.authors.some((a) => a.orcid) ? [] : ['% ORCID iDs (this class has no ORCID command; add them as the journal asks):', ...L.authors.filter((a) => a.orcid).map((a) => `%   ${a.name}: https://orcid.org/${a.orcid}`)]);
const orcidPackage = (L: AuthorList, o: TexOptions) => (o.orcidLink && L.authors.some((a) => a.orcid) ? ['% Needs \\usepackage{orcidlink} in the preamble.'] : []);

/** AASTeX (6.3 style): \author[ORCID]{Name}, one \affiliation per line, \correspondingauthor and \email. */
export function toAAS(L: AuthorList, o: TexOptions = {}): string {
  const t = (s: string) => tex(s, o.latexAccents);
  const out: string[] = [];
  for (const a of L.authors) {
    out.push(`\\author${a.orcid ? `[${a.orcid}]` : ''}{${t(a.name)}}`);
    for (const n of a.affs) out.push(`\\affiliation{${t(L.affs[n - 1])}}`);
    if (a.corresponding) out.push(`\\correspondingauthor{${t(a.name)}}`);
    if (a.email) out.push(`\\email{${t(a.email)}}`);
    out.push('');
  }
  return out.join('\n').trim() + '\n';
}

/** The short author list for a running head: "A. Lovelace", "A. Lovelace & C. Babbage" or "A. Lovelace et al.". */
export function shortAuthors(L: AuthorList, amp = '\\&', o: TexOptions = {}): string {
  const s = (a: Author) => tex(`${initials(a.given)} ${a.family}`.trim(), o.latexAccents);
  if (L.authors.length === 1) return s(L.authors[0]);
  if (L.authors.length === 2) return `${s(L.authors[0])} ${amp} ${s(L.authors[1])}`;
  return `${s(L.authors[0])} et al.`;
}

/** MNRAS (mnras.cls): \author[short]{Name,$^{1}$\thanks{E-mail: ...} ... and Last$^{2}$ \\ $^{1}$Institution\\ ...}. */
export function toMNRAS(L: AuthorList, o: TexOptions = {}): string {
  const t = (s: string) => tex(s, o.latexAccents);
  const n = L.authors.length;
  const lines = L.authors.map((a, i) => {
    const sup = a.affs.length ? `$^{${a.affs.join(',')}}$` : '';
    const comma = i < n - 2 ? ',' : '';
    const thanks = a.corresponding && a.email ? `\\thanks{E-mail: ${t(a.email)}}` : '';
    return `${i === n - 1 && n > 1 ? 'and ' : ''}${t(a.name)}${orcidTail(a, o)}${comma}${sup}${thanks}`;
  });
  const insts = L.affs.map((f, i) => `$^{${i + 1}}$${t(f)}${i < L.affs.length - 1 ? '\\\\' : ''}`);
  return [...orcidPackage(L, o), `\\author[${shortAuthors(L, '\\&', o)}]{`, ...lines, '\\\\', '% List of institutions', ...insts, '}', ...orcidComments(L, o)].join('\n') + '\n';
}

/** A&A (aa.cls): \author{Name\inst{1,2}\fnmsep\thanks{...} \and ...} and \institute{... \and ...}. */
export function toAandA(L: AuthorList, o: TexOptions = {}): string {
  const t = (s: string) => tex(s, o.latexAccents);
  const lines = L.authors.map((a, i) => {
    const inst = a.affs.length ? `\\inst{${a.affs.join(',')}}` : '';
    const thanks = a.corresponding && a.email ? `${inst ? '\\fnmsep' : ''}\\thanks{Corresponding author: \\email{${t(a.email)}}}` : '';
    return `${i ? '     \\and ' : '\\author{'}${t(a.name)}${orcidTail(a, o)}${inst}${thanks}`;
  });
  const insts = L.affs.map((f, i) => `${i ? '     \\and ' : '\\institute{'}${t(f)}`);
  return [...orcidPackage(L, o), ...lines.slice(0, -1), lines[lines.length - 1] + '}', '', ...insts.slice(0, -1), (insts[insts.length - 1] ?? '\\institute{') + '}', ...orcidComments(L, o)].join('\n') + '\n';
}

/** REVTeX 4.2: \author{Name} \email{} \affiliation{} per author (use the superscriptaddress class option). */
export function toRevtex(L: AuthorList, o: TexOptions = {}): string {
  const t = (s: string) => tex(s, o.latexAccents);
  const out = ['% \\documentclass[aps,superscriptaddress]{revtex4-2} numbers the affiliations.', ...orcidPackage(L, o)];
  for (const a of L.authors) {
    out.push(`\\author{${t(a.name)}${orcidTail(a, o)}}`);
    if (a.email) out.push(`\\email{${t(a.email)}}`);
    if (a.corresponding) out.push('\\thanks{Corresponding author}');
    for (const n of a.affs) out.push(`\\affiliation{${t(L.affs[n - 1])}}`);
  }
  return [...out, ...orcidComments(L, o)].join('\n') + '\n';
}

/** elsarticle: \author[1,2]{Name\corref{cor1}}, \ead{}, \cortext[cor1]{} and \affiliation[1]{organization={...}}. */
export function toElsarticle(L: AuthorList, o: TexOptions = {}): string {
  const t = (s: string) => tex(s, o.latexAccents);
  const out = ['% elsarticle 3.x. Older versions write \\address[1]{...} instead of \\affiliation[1]{organization={...}}.', ...orcidPackage(L, o)];
  for (const a of L.authors) {
    out.push(`\\author${a.affs.length ? `[${a.affs.join(',')}]` : ''}{${t(a.name)}${orcidTail(a, o)}${a.corresponding ? '\\corref{cor1}' : ''}}`);
    if (a.email) out.push(`\\ead{${t(a.email)}}`);
  }
  if (L.authors.some((a) => a.corresponding)) out.push('\\cortext[cor1]{Corresponding author}');
  out.push('');
  L.affs.forEach((f, i) => out.push(`\\affiliation[${i + 1}]{organization={${t(f)}}}`));
  return [...out, ...orcidComments(L, o)].join('\n') + '\n';
}

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', ',': ',', '*': '*' };
const joinNames = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const marks = (a: Author) => [a.affs.join(','), a.corresponding ? '*' : ''].filter(Boolean).join(',');

/** Plain text with Unicode superscript numbers, for email or a plain editor. */
export function toPlain(L: AuthorList): string {
  const names = L.authors.map((a) => a.name + [...marks(a)].map((c) => SUP[c] ?? c).join(''));
  const out = [joinNames(names), '', ...L.affs.map((f, i) => `${i + 1} ${f}`)];
  const corr = L.authors.filter((a) => a.corresponding);
  if (corr.length) out.push('', `* Corresponding author${corr.length > 1 ? 's' : ''}: ${corr.map((a) => (a.email ? `${a.name} (${a.email})` : a.name)).join('; ')}`);
  const orc = L.authors.filter((a) => a.orcid);
  if (orc.length) out.push('', 'ORCID iDs: ' + orc.map((a) => `${a.name} https://orcid.org/${a.orcid}`).join('; '));
  return out.join('\n') + '\n';
}

/** HTML with <sup> numbers; pastes into Word or Google Docs with the superscripts kept. */
export function toHTML(L: AuthorList): string {
  const names = L.authors.map((a) => `${xml(a.name)}${marks(a) ? `<sup>${marks(a)}</sup>` : ''}`);
  const out = [`<p>${joinNames(names)}</p>`, '<p>' + L.affs.map((f, i) => `<sup>${i + 1}</sup>${xml(f)}`).join('<br>\n') + '</p>'];
  const corr = L.authors.filter((a) => a.corresponding);
  if (corr.length) out.push(`<p><sup>*</sup>Corresponding author${corr.length > 1 ? 's' : ''}: ${corr.map((a) => (a.email ? `${xml(a.name)} (${xml(a.email)})` : xml(a.name))).join('; ')}</p>`);
  const orc = L.authors.filter((a) => a.orcid);
  if (orc.length) out.push('<p>ORCID iDs: ' + orc.map((a) => `${xml(a.name)} https://orcid.org/${a.orcid}`).join('; ') + '</p>');
  return out.join('\n') + '\n';
}

/** JATS-style XML: <contrib-group> with names, ORCID, affiliation links and emails, then <aff> elements. */
export function toJATS(L: AuthorList): string {
  const out = ['<contrib-group>'];
  for (const a of L.authors) {
    out.push(`  <contrib contrib-type="author"${a.corresponding ? ' corresp="yes"' : ''}>`);
    if (a.orcid) out.push(`    <contrib-id contrib-id-type="orcid">https://orcid.org/${a.orcid}</contrib-id>`);
    out.push(`    <name><surname>${xml(a.family)}</surname>${a.given ? `<given-names>${xml(a.given)}</given-names>` : ''}</name>`);
    for (const n of a.affs) out.push(`    <xref ref-type="aff" rid="aff${n}">${n}</xref>`);
    if (a.email) out.push(`    <email>${xml(a.email)}</email>`);
    out.push('  </contrib>');
  }
  out.push(...L.affs.map((f, i) => `  <aff id="aff${i + 1}"><label>${i + 1}</label>${xml(f)}</aff>`));
  out.push('</contrib-group>');
  return out.join('\n') + '\n';
}

export const STYLES = [
  { id: 'aas', name: 'AASTeX (AAS journals)', ext: 'tex', run: toAAS },
  { id: 'mnras', name: 'MNRAS (mnras.cls)', ext: 'tex', run: toMNRAS },
  { id: 'aa', name: 'A&A (aa.cls)', ext: 'tex', run: toAandA },
  { id: 'revtex', name: 'REVTeX 4.2 (APS, AIP)', ext: 'tex', run: toRevtex },
  { id: 'els', name: 'elsarticle (Elsevier)', ext: 'tex', run: toElsarticle },
  { id: 'word', name: 'Superscript list (Word, HTML)', ext: 'html', run: (L: AuthorList) => toHTML(L) },
  { id: 'plain', name: 'Plain text (superscript digits)', ext: 'txt', run: (L: AuthorList) => toPlain(L) },
  { id: 'jats', name: 'JATS-style XML', ext: 'xml', run: (L: AuthorList) => toJATS(L) },
] as const;

export const EXAMPLE = `# Affiliations: a short key, "=", then the full text
1 = Department of Physics and Astronomy, Example University, Exampletown, Country
2 = Institute for Made-up Studies, Sampleville, Country

# Authors: name; affiliation keys or full text; ORCID; email; * for corresponding
Ada Lovelace; 1, 2; 0000-0002-1825-0097; ada@example.org; *
Charles Babbage; 2
José Núñez-García; Department of Physics and Astronomy,Example University, Exampletown, Country.
van der Berg, Mira; Hill Top Observatory, 3 Ridge Road, Testburg, Country
`;
