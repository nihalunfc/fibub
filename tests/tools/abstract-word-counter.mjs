// #806 abstract word counter
export const path = '/science/abstract-word-counter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/abstract-word-counter/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.awc .aw-big'), status = () => page.textContent('.awc .aw-status');
  check((await big()) === '112 of 250 words' && (await status()) === '138 left.', `abstract: example count (${await big()})`);
  { const f = await page.textContent('.awc .aw-facts'); check(f.includes('Sentences6') && f.includes('Words per sentence18.7') && f.includes('Paragraphs1'), 'abstract: sentences and facts'); }
  check(!(await page.textContent('.awc .aw-view')).includes('citep') && (await page.textContent('.awc .aw-view')).includes('[math]'), 'abstract: LaTeX removed in the counted text');
  check((await page.textContent('.awc .aw-top')).startsWith('discs ×3'), 'abstract: most used words');
  { const k = await page.textContent('.awc .aw-kws'); check(k.startsWith('3 of 6 keywords') && k.includes('star formation: in the abstract') && k.includes('galaxy discs: not in the abstract'), 'abstract: keywords'); }
  await page.uncheck('.awc .aw-tex'); await page.waitForTimeout(100);
  check((await big()) === '119 of 250 words', 'abstract: raw LaTeX counted');
  await page.check('.awc .aw-tex');
  await page.click('.awc .aw-presets button:first-child'); await page.waitForTimeout(100);
  check((await big()) === '112 of 150 words' && (await page.inputValue('.awc .aw-lim')) === '150', 'abstract: example preset');
  await page.fill('.awc .aw-lim', '100'); await page.waitForTimeout(100);
  check((await status()).startsWith('Over the limit by 12') && (await page.textContent('.awc .aw-view mark')).startsWith('of star formation in galaxy outskirts') && (await page.getAttribute('.awc .aw-bar', 'class')).includes('over'), 'abstract: overflow marked');
  await page.click('.awc .aw-presets button:nth-child(4)'); await page.waitForTimeout(100);
  check((await big()).endsWith('of 1,500 characters') && (await status()).endsWith('left.'), 'abstract: character preset');
  await page.selectOption('.awc .aw-unit', 'charsNoSpace'); await page.fill('.awc .aw-lim', '500'); await page.waitForTimeout(100);
  check((await big()).endsWith('of 500 characters (no spaces)') && (await status()).startsWith('Over the limit by'), 'abstract: characters without spaces');
  await page.selectOption('.awc .aw-unit', 'words'); await page.fill('.awc .aw-lim', '250');
  await page.fill('.awc .aw-kw', 'a, b, c, d, e, f, g'); await page.waitForTimeout(100);
  check((await page.textContent('.awc .aw-kws')).startsWith('7 of 6 keywords, 1 too many'), 'abstract: too many keywords');
  await page.fill('.awc .aw-in', 'One two three. Four five?'); await page.waitForTimeout(100);
  check((await big()) === '5 of 250 words' && (await page.textContent('.awc .aw-facts')).includes('Sentences2'), 'abstract: typed text');
  await page.fill('.awc .aw-lim', ''); await page.waitForTimeout(100);
  check((await status()) === 'Set a limit to compare with.', 'abstract: no limit message');
  await page.click('.awc .aw-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.awc .aw-out'), 'abstract: clear');
  await page.setInputFiles('.awc .aw-file', { name: 'a.tex', mimeType: 'text/plain', buffer: Buffer.from('\\begin{abstract}\nWe study $x$ here \\cite{a}.\n\\end{abstract}') }); await page.waitForTimeout(300);
  check((await big()) === '4 words' && (await page.textContent('.awc .aw-view')) === 'We study [math] here.', 'abstract: open a .tex file');
  await page.setInputFiles('.awc .aw-file', { name: 'a.docx', mimeType: 'application/octet-stream', buffer: Buffer.from([0x50, 0x4b, 0, 0]) }); await page.waitForTimeout(300);
  check((await page.textContent('.awc .aw-ferr')).includes('not a text file'), 'abstract: binary file refused');
  await page.click('.awc .aw-ex'); await page.waitForTimeout(100);
};
