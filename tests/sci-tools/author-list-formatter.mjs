// #801 Author list and affiliation formatter. Outputs were cross-checked in Python: pylatexenc parsed every LaTeX
// block (balanced braces) and turned it back into the same names, emails and affiliations, including the accent
// commands; ElementTree read the JATS XML back; the ORCID check digit matched an independent ISO 7064 11,2 version.
import { parseAuthors, orcidValid, tex, initials, splitName, toAAS, toMNRAS, toAandA, toRevtex, toElsarticle, toPlain, toHTML, toJATS, shortAuthors, EXAMPLE } from '../../src/lib/sci/authors.ts';

export default async (check) => {
  // ORCID's own documented example and two more valid iDs; one changed digit fails.
  check('orcid: 0000-0002-1825-0097 valid', orcidValid('0000-0002-1825-0097'));
  check('orcid: 0000-0001-5109-3700 valid', orcidValid('0000-0001-5109-3700'));
  check('orcid: X check digit valid', orcidValid('0000-0002-1694-233X'));
  check('orcid: typo fails', !orcidValid('0000-0002-1825-0098'));

  check('names: "Family, Given" kept together', splitName('van der Berg, Mira').family === 'van der Berg' && splitName('van der Berg, Mira').name === 'Mira van der Berg');
  check('names: last word is the family name', splitName('Ada  Mary Lovelace').family === 'Lovelace' && splitName('Ada  Mary Lovelace').given === 'Ada Mary');
  check('initials', initials('Ada Mary') === 'A. M.' && initials('Jean-Paul') === 'J.-P.' && initials('K. T.') === 'K. T.');

  check('tex: specials escaped', tex('50% & #2 A_b {x} ~^\\') === '50\\% \\& \\#2 A\\_b \\{x\\} \\textasciitilde{}\\textasciicircum{}\\textbackslash{}');
  check('tex: accents kept as UTF-8 by default', tex('José') === 'José');
  check('tex: accents as commands', tex('José Núñez-García', true) === "Jos{\\'e} N{\\'u}{\\~n}ez-Garc{\\'\\i}a");
  check('tex: letters and cedilla', tex('Søren Łukasz Çanakkale Żółć Ångström', true) === "S{\\o}ren {\\L}ukasz {\\c{C}}anakkale {\\.Z}{\\'o}{\\l}{\\'c} {\\AA}ngstr{\\\"o}m");

  const L = parseAuthors(EXAMPLE);
  check('example: four authors, three affiliations (one written twice, merged)', L.authors.length === 4 && L.affs.length === 3 && L.errors.length === 0 && L.warnings.length === 0);
  check('example: affiliation numbers', JSON.stringify(L.authors.map((a) => a.affs)) === '[[1,2],[2],[1],[3]]');
  check('example: ORCID, email and corresponding author', L.authors[0].orcid === '0000-0002-1825-0097' && L.authors[0].email === 'ada@example.org' && L.authors[0].corresponding && !L.authors[1].corresponding);
  check('example: short author list', shortAuthors(L) === 'A. Lovelace et al.');

  check('aas', toAAS(L).startsWith('\\author[0000-0002-1825-0097]{Ada Lovelace}\n\\affiliation{Department of Physics and Astronomy, Example University, Exampletown, Country}\n\\affiliation{Institute for Made-up Studies, Sampleville, Country}\n\\correspondingauthor{Ada Lovelace}\n\\email{ada@example.org}\n\n\\author{Charles Babbage}'));
  const m = toMNRAS(L);
  check('mnras', m.startsWith('\\author[A. Lovelace et al.]{\nAda Lovelace,$^{1,2}$\\thanks{E-mail: ada@example.org}\nCharles Babbage,$^{2}$\nJosé Núñez-García$^{1}$\nand Mira van der Berg$^{3}$\n\\\\\n% List of institutions\n$^{1}$Department') && m.includes('Country\\\\\n$^{3}$Hill Top Observatory, 3 Ridge Road, Testburg, Country\n}'));
  check('mnras: ORCID as a comment, or with orcidlink', m.includes('%   Ada Lovelace: https://orcid.org/0000-0002-1825-0097') && toMNRAS(L, { orcidLink: true }).includes('Ada Lovelace\\orcidlink{0000-0002-1825-0097},$^{1,2}$'));
  const aa = toAandA(L);
  check('a&a', aa.startsWith('\\author{Ada Lovelace\\inst{1,2}\\fnmsep\\thanks{Corresponding author: \\email{ada@example.org}}\n     \\and Charles Babbage\\inst{2}') && aa.includes('\\institute{Department of Physics and Astronomy, Example University, Exampletown, Country\n     \\and Institute'));
  check('revtex', toRevtex(L).includes('\\author{Ada Lovelace}\n\\email{ada@example.org}\n\\thanks{Corresponding author}\n\\affiliation{Department'));
  const el = toElsarticle(L);
  check('elsarticle', el.includes('\\author[1,2]{Ada Lovelace\\corref{cor1}}\n\\ead{ada@example.org}\n\\author[2]{Charles Babbage}') && el.includes('\\cortext[cor1]{Corresponding author}') && el.includes('\\affiliation[3]{organization={Hill Top Observatory, 3 Ridge Road, Testburg, Country}}'));
  check('plain', toPlain(L).startsWith('Ada Lovelace¹,²,*, Charles Babbage², José Núñez-García¹ and Mira van der Berg³\n\n1 Department'));
  check('html', toHTML(L).startsWith('<p>Ada Lovelace<sup>1,2,*</sup>, Charles Babbage<sup>2</sup>'));
  const j = toJATS(L);
  check('jats', j.includes('<contrib contrib-type="author" corresp="yes">\n    <contrib-id contrib-id-type="orcid">https://orcid.org/0000-0002-1825-0097</contrib-id>\n    <name><surname>Lovelace</surname><given-names>Ada</given-names></name>') && j.includes('<surname>van der Berg</surname>') && j.includes('<aff id="aff3"><label>3</label>Hill Top'));

  // Messages.
  const bad = parseAuthors('1 = Lab A\nAda Lovelace; 1, 2\nBob; 1; 0000-0002-1825-0098; corresponding');
  check('undefined affiliation number is an error', bad.errors.some((e) => e.includes('affiliation 2 is not defined')));
  check('bad ORCID and missing email warned', bad.warnings.some((w) => w.includes('fails its check digit')) && bad.warnings.some((w) => w.includes('no email')));
  const w2 = parseAuthors('a = Lab A\nb = Lab B\nAda; a');
  check('unused affiliation and missing corresponding author warned', w2.warnings.some((w) => w.includes('b is not used')) && w2.warnings.some((w) => w.includes('No corresponding author')));
  check('empty input', parseAuthors('# nothing').errors[0].startsWith('No authors'));
  check('pipes work as separators', parseAuthors('Ada Lovelace | Lab, Town | ada@x.org | *').authors[0].email === 'ada@x.org');
  check('one and two authors short list', shortAuthors(parseAuthors('Ada Lovelace; X')) === 'A. Lovelace' && shortAuthors(parseAuthors('Ada Lovelace; X\nCharles Babbage; X')) === 'A. Lovelace \\& C. Babbage');
};
