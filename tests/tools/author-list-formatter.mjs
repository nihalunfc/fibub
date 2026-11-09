// #801 author list and affiliation formatter
export const path = '/science/author-list-formatter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/author-list-formatter/`); await page.waitForTimeout(500);
  const res = () => page.inputValue('.alf .alf-res');
  check((await page.textContent('.alf .alf-facts')).includes('Authors4') && (await page.textContent('.alf .alf-facts')).includes('Affiliations3') && (await page.textContent('.alf .alf-facts')).includes('CorrespondingAda Lovelace'), 'authors: example has 4 authors and 3 merged affiliations');
  check((await res()).startsWith('\\author[0000-0002-1825-0097]{Ada Lovelace}\n\\affiliation{Department of Physics and Astronomy'), 'authors: AASTeX by default');
  await page.selectOption('.alf .alf-style', 'mnras'); await page.waitForTimeout(100);
  check((await res()).startsWith('\\author[A. Lovelace et al.]{\nAda Lovelace,$^{1,2}$\\thanks{E-mail: ada@example.org}\nCharles Babbage,$^{2}$\nJosé Núñez-García$^{1}$\nand Mira van der Berg$^{3}$'), 'authors: MNRAS');
  await page.check('.alf .alf-acc'); await page.waitForTimeout(100);
  check((await res()).includes("Jos{\\'e} N{\\'u}{\\~n}ez-Garc{\\'\\i}a$^{1}$"), 'authors: accents as LaTeX commands');
  await page.uncheck('.alf .alf-acc'); await page.check('.alf .alf-orc'); await page.waitForTimeout(100);
  check((await res()).includes('Ada Lovelace\\orcidlink{0000-0002-1825-0097},$^{1,2}$') && (await res()).includes('usepackage{orcidlink}'), 'authors: orcidlink option');
  await page.uncheck('.alf .alf-orc');
  await page.selectOption('.alf .alf-style', 'aa'); await page.waitForTimeout(100);
  check((await res()).startsWith('\\author{Ada Lovelace\\inst{1,2}\\fnmsep\\thanks{Corresponding author: \\email{ada@example.org}}'), 'authors: A&A');
  await page.selectOption('.alf .alf-style', 'revtex'); await page.waitForTimeout(100);
  check((await res()).includes('\\author{Charles Babbage}\n\\affiliation{Institute for Made-up Studies, Sampleville, Country}'), 'authors: REVTeX');
  await page.selectOption('.alf .alf-style', 'els'); await page.waitForTimeout(100);
  check((await res()).includes('\\author[1,2]{Ada Lovelace\\corref{cor1}}') && (await res()).includes('\\affiliation[2]{organization={Institute'), 'authors: elsarticle');
  await page.selectOption('.alf .alf-style', 'plain'); await page.waitForTimeout(100);
  check((await res()).startsWith('Ada Lovelace¹,²,*, Charles Babbage²'), 'authors: plain text superscripts');
  await page.selectOption('.alf .alf-style', 'jats'); await page.waitForTimeout(100);
  check((await res()).includes('<surname>van der Berg</surname><given-names>Mira</given-names>'), 'authors: JATS');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.alf .alf-dl')]); const f = OUT + 'authors.xml'; await d.saveAs(f); check(d.suggestedFilename() === 'authors-jats.xml' && readFileSync(f, 'utf8').startsWith('<contrib-group>'), 'authors: download XML'); }
  await page.selectOption('.alf .alf-style', 'word'); await page.waitForTimeout(100);
  check(await page.isVisible('.alf .alf-prev') && (await page.innerHTML('.alf .alf-prev')).includes('Ada Lovelace<sup>1,2,*</sup>') && await page.isVisible('.alf .alf-word'), 'authors: Word preview with superscripts');
  await page.click('.alf .alf-word'); await page.waitForTimeout(200);
  check((await page.textContent('.alf .alf-msg')).startsWith('Copied'), 'authors: copy for Word');
  await page.click('.alf .alf-copy'); await page.waitForTimeout(200);
  check((await page.textContent('.alf .alf-msg')) === 'Copied.', 'authors: copy');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.alf .alf-dl')]); const f = OUT + 'authors.html'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('<sup>1,2,*</sup>'), 'authors: download HTML'); }
  // Messages.
  await page.fill('.alf .alf-in', '1 = Lab A\nAda Lovelace; 1, 2'); await page.waitForTimeout(200);
  check((await page.textContent('.alf .alf-err')).includes('affiliation 2 is not defined') && await page.isHidden('.alf .alf-out'), 'authors: undefined affiliation message');
  await page.fill('.alf .alf-in', 'Ada Lovelace; Lab A; 0000-0002-1825-0098; *'); await page.waitForTimeout(200);
  { const w = await page.textContent('.alf .alf-warn'); check(w.includes('fails its check digit') && w.includes('no email'), 'authors: ORCID typo and missing email warned'); }
  await page.click('.alf .alf-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.alf .alf-out') && await page.isHidden('.alf .alf-err'), 'authors: clear');
  await page.setInputFiles('.alf .alf-file', { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('Ada Lovelace; Lab A, Town; *; ada@x.org\nBob Smith; Lab A, Town.') }); await page.waitForTimeout(300);
  check((await page.textContent('.alf .alf-facts')).includes('Authors2') && (await page.textContent('.alf .alf-facts')).includes('Affiliations1'), 'authors: open a text file');
  await page.setInputFiles('.alf .alf-file', { name: 'b.bin', mimeType: 'application/octet-stream', buffer: Buffer.from([0, 1, 2, 0, 65]) }); await page.waitForTimeout(300);
  check((await page.textContent('.alf .alf-ferr')).includes('not a text file'), 'authors: binary file refused');
  await page.click('.alf .alf-ex'); await page.waitForTimeout(100);
};
