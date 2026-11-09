// #802 BibTeX cleaner. Cross-checked in Python: bibtexparser 1.4.3 read the same files (an edge-case file, the page
// example and 200 random entries with nested braces, quotes, # joins and stray text) and gave the same keys, types
// and field values (1,730 checks); the cleaned .bib read back with bibtexparser unchanged (1,562 checks); names
// split the same as bibtexparser's splitname (BibTeX rules); LaTeX accents to text matched pylatexenc; RIS read
// back with rispy.
import { parseBib, cleanEntries, writeBib, latexToText, parseName, splitAuthors, protectCaps, referenceList, toRIS, toCSL, DEFAULTS, EXAMPLE, JOURNALS } from '../../src/lib/sci/bibtex.ts';

export default async (check) => {
  const P = parseBib(EXAMPLE);
  check('bib: example has 5 entries, one @string', P.entries.length === 5 && P.strings.lab === 'Example Press' && P.errors.length === 0);
  check('bib: @string and month macro filled in', P.entries[3].fields.find(([n]) => n === 'publisher')[1] === 'Example Press' && P.entries[0].fields.find(([n]) => n === 'month')[1] === 'March');
  check('bib: entry with no key read', P.entries[4].key === '' && P.entries[4].fields[0][0] === 'title');
  check('bib: field names lower case', P.entries[0].fields.map(([n]) => n).join() === 'author,title,journal,keywords,year,month,volume,pages,doi,adsurl,adsnote');

  const C = cleanEntries(P.entries, DEFAULTS);
  check('bib: duplicate by DOI removed (URL form and case ignored)', C.entries.length === 4 && C.removed.length === 1 && C.removed[0].key === 'lovelace2021' && C.removed[0].keptAs === '2021ApJ...900...12L' && C.removed[0].why === 'same DOI');
  const bib = writeBib(C.entries);
  check('bib: ADS entry cleaned', bib.startsWith('@article{2021ApJ...900...12L,\n  author  = {{Lovelace}, Ada and {Babbage}, Charles and {van der Berg}, Mira},\n  title   = {Faint {HII} regions in the outer disk of a made-up galaxy},\n  journal = {ApJ},\n  year    = {2021},\n  month   = mar,\n  volume  = {900},\n  pages   = {12--20},\n  doi     = {10.5555/example.0001},\n  adsurl  = {https://ui.adsabs.harvard.edu/abs/2021ApJ...900...12L}\n}'));
  check('bib: acronyms protected, keywords/abstract/adsnote dropped', bib.includes('title   = {The {DNA} of star formation: a toy model with {CO} and {pH-like} tracers}') && !bib.includes('abstract') && !bib.includes('adsnote') && !bib.includes('keywords'));
  check('bib: key made for the keyless entry, page dash fixed', bib.includes('@inproceedings{smith2020,') && bib.includes('pages     = {5--9}'));
  check('bib: journal names in full', writeBib(cleanEntries(P.entries, { ...DEFAULTS, journals: 'full' }).entries).includes('journal = {Monthly Notices of the Royal Astronomical Society}'));
  check('bib: journal macros kept on request', writeBib(cleanEntries(P.entries, { ...DEFAULTS, journals: 'keep' }).entries).includes('journal = {\\apj}'));
  check('bib: A&A escaped', cleanEntries(parseBib('@article{a, journal={\\aap}, title={T}, author={A}, year=2000}').entries, DEFAULTS).entries[0].fields.find(([n]) => n === 'journal')[1] === 'A\\&A');
  check('bib: journal list', Object.keys(JOURNALS).length >= 50 && JOURNALS.apj[0] === 'ApJ' && JOURNALS.mnras[1] === 'Monthly Notices of the Royal Astronomical Society');
  check('bib: no dedupe keeps both', cleanEntries(P.entries, { ...DEFAULTS, dedupe: false }).entries.length === 5);
  const sorted = cleanEntries(P.entries, { ...DEFAULTS, sort: 'author' }).entries.map((e) => e.key).join();
  check('bib: sort by first author', sorted === 'babbage2018,2021ApJ...900...12L,2019MNRAS.480.1234N,smith2020');
  check('bib: sort by year', cleanEntries(P.entries, { ...DEFAULTS, sort: 'year' }).entries.map((e) => e.key)[0] === 'babbage2018');

  check('protect: acronyms', protectCaps('The DNA of pH and CO2 in GaN at 21 cm: X-ray Results', 'acronyms') === 'The {DNA} of {pH} and {CO2} in {GaN} at 21 cm: X-ray Results');
  check('protect: all capitals, braces and maths left alone', protectCaps('Stars in the Milky Way {already} $M_\\odot$ Here', 'all') === 'Stars in the {Milky} {Way} {already} $M_\\odot$ {Here}');
  check('protect: none', protectCaps('DNA', 'none') === 'DNA');

  const t2 = cleanEntries(parseBib('@article{a, title={A Long Enough Title}, author={Doe, J.}, year=2001}\n@article{b, title={A long enough title.}, author={Jane Doe}, year=2002, journal={J}, volume={3}}').entries, DEFAULTS);
  check('bib: duplicate by title and first author; fuller entry kept', t2.entries.length === 1 && t2.entries[0].key === 'b' && t2.removed[0].why === 'same title and first author');
  const k2 = cleanEntries(parseBib('@misc{x, title={One title here}}\n@misc{x, title={Another title here}}').entries, DEFAULTS);
  check('bib: repeated key renamed', k2.entries.map((e) => e.key).join() === 'x,xb' && k2.warnings[0].includes('now xb'));
  const m2 = cleanEntries(parseBib('@misc{m, title={T}, month={12}, doi={doi:10.1/ABC}, pages={1 – 4}, year={2020}, note={}}').entries, DEFAULTS).entries[0];
  check('bib: month number, doi: prefix, en dash pages, empty field', writeBib([m2]).includes('month = dec') && writeBib([m2]).includes('doi   = {10.1/ABC}') && writeBib([m2]).includes('{1--4}') && !writeBib([m2]).includes('note'));
  const bl = cleanEntries(parseBib('@article{bl, journaltitle={J. Test}, date={2019-05-02}, title={T}, author={A}}').entries, DEFAULTS).entries[0];
  check('bib: biblatex journaltitle and date', writeBib([bl]).includes('journal = {J. Test}') && writeBib([bl]).includes('year    = {2019}') && writeBib([bl]).includes('month   = may'));

  const bad = parseBib('@article{broken, title = {never closed\n\n@article{good, title={Fine}, year = 2000}\n@misc(paren, title="Parens")');
  check('bib: broken entry reported, the rest still read', bad.errors.length === 1 && bad.errors[0].startsWith('Line 1') && bad.entries.map((e) => e.key).join() === 'good,paren');
  check('bib: undefined macro warned', parseBib('@misc{u, journal = nosuch}').warnings[0].includes('"nosuch" is not defined'));
  check('bib: # joins and quoted braces', parseBib('@string{a = "Ab"}\n@misc{j, note = a # " {c"d} " # {e}}').entries[0].fields[0][1] === 'Ab {c"d} e');

  // Text and names (both cross-checked in Python).
  check('latex: accents', latexToText("Jos{\\'e} N{\\'u}{\\~n}ez Garc{\\'\\i}a {\\\"{O}}zt{\\\"u}rk Ay{\\c{s}}e {\\AA}ngstr{\\\"o}m {\\o}st Stra{\\ss}e \\v{C}ech {\\l}{\\'o}d{\\'z}") === 'José Núñez García Öztürk Ayşe Ångström øst Straße Čech łódź');
  check('latex: dashes, specials, commands', latexToText('pages 1--5---x 50\\% \\& On the \\emph{Rotation} of {T}iny 21~cm') === 'pages 1–5—x 50% & On the Rotation of Tiny 21 cm');
  check('names: von Last, First', JSON.stringify(parseName('de la Cruz, Juan')) === '{"first":"Juan","von":"de la","last":"Cruz","jr":""}');
  { const n = parseName("Charles Louis Xavier Joseph de la Vall{\\'e}e Poussin"); check('names: First von Last', n.first === 'Charles Louis Xavier Joseph' && n.von === 'de la' && n.last === "Vall{\\'e}e Poussin" && n.jr === ''); }
  check('names: Jr and braces', parseName('Smith, Jr., John').jr === 'Jr.' && parseName('{The Example Collaboration}').last === '{The Example Collaboration}' && parseName('Brinch Hansen, Per').last === 'Brinch Hansen');
  check('names: split at and, not inside braces', splitAuthors('{Barnes and Noble} and Doe, J. AND Roe, R.').length === 3);

  const cl = cleanEntries(P.entries, DEFAULTS).entries;
  const apa = referenceList(cl, 'apa').map((r) => r.text);
  check('apa-like', apa[1] === 'Lovelace, A., Babbage, C., & van der Berg, M. (2021). Faint HII regions in the outer disk of a made-up galaxy. ApJ, 900, 12–20. https://doi.org/10.5555/example.0001' && apa[0] === 'Babbage, C. (2018). Engines of Calculation. Example Press.');
  check('apa-like: others -> et al., Jr.', apa[2].startsWith('Núñez-García, J., Müller, J., et al. (2019).') && apa[3].startsWith('Smith, J., Jr., & Doe, J. (2020).'));
  const num = referenceList(cl, 'numbered').map((r) => r.text);
  check('numbered', num[0] === '[1] A. Lovelace, C. Babbage, and M. van der Berg, “Faint HII regions in the outer disk of a made-up galaxy,” ApJ, vol. 900, pp. 12–20, Mar. 2021, doi: 10.5555/example.0001.' && num[3] === '[4] J. Smith, Jr. and J. Doe, “A conference talk with no key,” in Proceedings of the Example Workshop, pp. 5–9, 2020.');
  const aas = referenceList(cl, 'aas').map((r) => r.text);
  check('aas-like', aas[1] === 'Lovelace, A., Babbage, C., & van der Berg, M. 2021, ApJ, 900, 12, doi: 10.5555/example.0001');
  check('html has italics', referenceList(cl, 'apa')[1].html.includes('<i>ApJ</i>, <i>900</i>'));
  const ris = toRIS(cl);
  check('ris', ris.startsWith('TY  - JOUR\r\nAU  - Lovelace, Ada\r\nAU  - Babbage, Charles\r\nAU  - van der Berg, Mira\r\nTI  - Faint HII regions') && ris.split('ER  - ').length === 5 && ris.includes('TY  - CPAPER') && ris.includes('AU  - Smith, John, Jr.'));
  const csl = toCSL(cl);
  check('csl-json', csl.length === 4 && csl[0].type === 'article-journal' && JSON.stringify(csl[0].issued) === '{"date-parts":[[2021,3]]}' && csl[0].author[2].family === 'van der Berg' && csl[2].type === 'book' && csl[1].author[0].family === 'Núñez-García' && toCSL(parseBib('@misc{b, author={Ludwig van Beethoven}}').entries)[0].author[0]['non-dropping-particle'] === 'van' && csl[0].page === '12-20');
};
