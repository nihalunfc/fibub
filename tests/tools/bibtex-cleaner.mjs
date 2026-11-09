// #802 BibTeX cleaner and reference formatter
export const path = '/science/bibtex-cleaner/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/bibtex-cleaner/`); await page.waitForTimeout(500);
  const res = () => page.inputValue('.bbc .bc-res');
  const facts = () => page.textContent('.bbc .bc-facts');
  check((await facts()) === 'Entries read5Duplicates merged1Entries out4Entries changed3', `bibtex: example counts (${await facts()})`);
  check((await page.textContent('.bbc .bc-msgs')).includes('Removed lovelace2021: same DOI as 2021ApJ...900...12L'), 'bibtex: duplicate reported');
  check((await res()).includes('journal = {ApJ}') && (await res()).includes('title   = {Faint {HII} regions in the outer disk of a made-up galaxy}') && (await res()).includes('@inproceedings{smith2020,'), 'bibtex: cleaned .bib');
  await page.click('.bbc .bc-det summary');
  check((await page.textContent('.bbc .bc-chg')).includes('2021ApJ...900...12L: keywords removed; adsnote removed; journal \\apj → ApJ'), 'bibtex: what changed');
  await page.selectOption('.bbc .bc-jr', 'full'); await page.waitForTimeout(100);
  check((await res()).includes('journal = {The Astrophysical Journal}'), 'bibtex: full journal names');
  await page.selectOption('.bbc .bc-jr', 'keep'); await page.waitForTimeout(100);
  check((await res()).includes('journal = {\\apj}'), 'bibtex: keep macros');
  await page.selectOption('.bbc .bc-jr', 'abbrev');
  await page.selectOption('.bbc .bc-pr', 'all'); await page.waitForTimeout(100);
  check((await res()).includes('{Calculation}'), 'bibtex: protect every capital');
  await page.selectOption('.bbc .bc-pr', 'none'); await page.uncheck('.bbc .bc-uw'); await page.waitForTimeout(100);
  check((await res()).includes('title   = {{Faint HII regions'), 'bibtex: no protection, keep whole-title braces');
  await page.selectOption('.bbc .bc-pr', 'acronyms'); await page.check('.bbc .bc-uw');
  await page.uncheck('.bbc .bc-dd'); await page.waitForTimeout(100);
  check((await facts()).includes('Entries out5') && (await res()).includes('doi     = {10.5555/EXAMPLE.0001}'), 'bibtex: duplicates kept, bare DOI');
  await page.uncheck('.bbc .bc-doi'); await page.uncheck('.bbc .bc-pg'); await page.waitForTimeout(100);
  check((await res()).includes('https://doi.org/10.5555/EXAMPLE.0001') && (await res()).includes('{12-20}'), 'bibtex: DOI and page options off');
  await page.check('.bbc .bc-dd'); await page.check('.bbc .bc-doi'); await page.check('.bbc .bc-pg');
  await page.fill('.bbc .bc-drop', 'adsurl'); await page.waitForTimeout(100);
  check(!(await res()).includes('adsurl') && (await res()).includes('keywords') && (await res()).includes('abstract'), 'bibtex: fields to remove');
  await page.fill('.bbc .bc-drop', 'abstract, file, keywords, adsnote');
  await page.selectOption('.bbc .bc-sort', 'author'); await page.waitForTimeout(100);
  check((await res()).startsWith('@book{babbage2018,'), 'bibtex: sort by author');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bbc .bc-dl')]); const f = OUT + 'clean.bib'; await d.saveAs(f); check(d.suggestedFilename() === 'references-clean.bib' && readFileSync(f, 'utf8').startsWith('@book{babbage2018,'), 'bibtex: download .bib'); }
  await page.selectOption('.bbc .bc-sort', 'none');
  await page.selectOption('.bbc .bc-show', 'apa'); await page.waitForTimeout(100);
  check(await page.isVisible('.bbc .bc-prev') && (await page.innerHTML('.bbc .bc-prev')).includes('<i>ApJ</i>, <i>900</i>') && (await page.textContent('.bbc .bc-prev li')) === 'Babbage, C. (2018). Engines of Calculation. Example Press.', 'bibtex: APA-like list');
  await page.click('.bbc .bc-word'); await page.waitForTimeout(150);
  check((await page.textContent('.bbc .bc-msg')).startsWith('Copied'), 'bibtex: copy for Word');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bbc .bc-dls [data-f="docx"]')]); check(d.suggestedFilename() === 'references-apa.docx', 'bibtex: Word download of the list'); }
  await page.selectOption('.bbc .bc-show', 'numbered'); await page.waitForTimeout(100);
  check((await page.textContent('.bbc .bc-prev li')).startsWith('[1] A. Lovelace, C. Babbage, and M. van der Berg, “Faint HII'), 'bibtex: numbered list');
  await page.selectOption('.bbc .bc-show', 'aas'); await page.waitForTimeout(100);
  check((await page.textContent('.bbc .bc-prev')).includes('Lovelace, A., Babbage, C., & van der Berg, M. 2021, ApJ, 900, 12, doi: 10.5555/example.0001'), 'bibtex: AAS-like list');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bbc .bc-dl')]); const f = OUT + 'aas.txt'; await d.saveAs(f); check(readFileSync(f, 'utf8').split('\n').filter(Boolean).length === 4, 'bibtex: download list'); }
  await page.selectOption('.bbc .bc-show', 'ris'); await page.waitForTimeout(100);
  check((await res()).startsWith('TY  - JOUR') && await page.isHidden('.bbc .bc-prev'), 'bibtex: RIS');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.bbc .bc-dl')]); check(d.suggestedFilename() === 'references.ris', 'bibtex: download RIS'); }
  await page.selectOption('.bbc .bc-show', 'csl'); await page.waitForTimeout(100);
  check(JSON.parse(await res()).length === 4, 'bibtex: CSL-JSON');
  await page.click('.bbc .bc-copy'); await page.waitForTimeout(150);
  check((await page.textContent('.bbc .bc-msg')) === 'Copied.', 'bibtex: copy');
  await page.selectOption('.bbc .bc-show', 'bib');
  // Messages.
  await page.fill('.bbc .bc-in', '@article{broken, title = {never closed\n\n@article{good, title={Fine}, year = 2000}'); await page.waitForTimeout(300);
  check((await page.textContent('.bbc .bc-msgs')).includes('Line 1: @article entry could not be read') && (await facts()).startsWith('Entries read1'), 'bibtex: broken entry reported');
  await page.fill('.bbc .bc-in', 'just some text'); await page.waitForTimeout(300);
  check((await page.textContent('.bbc .bc-err')).startsWith('No BibTeX entries found') && await page.isHidden('.bbc .bc-out'), 'bibtex: no entries message');
  writeFileSync(OUT + 'refs.bib', '@misc{a, title={A Title Long Enough}, author={Doe, J.}}\n@misc{b, title={A title long enough}, author={Jane Doe}, year=2002}\n');
  await page.setInputFiles('.bbc .bc-file', OUT + 'refs.bib'); await page.waitForTimeout(300);
  check((await facts()).includes('Duplicates merged1') && (await page.textContent('.bbc .bc-msgs')).includes('same title and first author'), 'bibtex: open a .bib file, title duplicate');
  await page.setInputFiles('.bbc .bc-file', { name: 'x.bib', mimeType: 'application/octet-stream', buffer: Buffer.from([0, 0, 1, 2]) }); await page.waitForTimeout(300);
  check((await page.textContent('.bbc .bc-ferr')).includes('not a text file'), 'bibtex: binary file refused');
  await page.click('.bbc .bc-ex'); await page.waitForTimeout(100);
};
