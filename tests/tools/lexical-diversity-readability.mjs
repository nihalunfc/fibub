// #736 Lexical diversity and readability: browser checks.
export const path = '/science/lexical-diversity-readability/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  page.setDefaultTimeout(120000); // slow shared test machines
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForFunction(() => document.querySelector('.ld-fig')?.width > 300);
  const val = (sel, name) => page.$$eval(sel + ' tbody tr', (trs, name) => trs.find((tr) => tr.cells[0].textContent.startsWith(name))?.cells[1].textContent, name);
  const fact = (k) => page.$$eval('.ld-counts div', (ds, k) => ds.find((d) => d.querySelector('dt').textContent === k)?.querySelector('dd').textContent, k);
  const setv = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(1200); };

  check((await val('.ld-div', 'Tokens')) === '158' && (await val('.ld-div', 'Types')) === '116', 'ld: 158 tokens, 116 types');
  check((await val('.ld-div', 'Type-token')) === '0.734' && (await val('.ld-div', 'Root TTR')) === '9.228' && (await val('.ld-div', 'Log TTR')) === '0.939', 'ld: TTR, root TTR, log TTR');
  check((await val('.ld-div', 'MATTR')) === '0.837' && (await val('.ld-div', 'MTLD')) === '147.0' && (await val('.ld-div', 'HD-D')) === '0.858' && (await val('.ld-div', "Yule's K")) === '122.6', 'ld: MATTR 0.837, MTLD 147.0, HD-D 0.858, K 122.6');
  check((await page.textContent('.ld-big')) === 'MTLD 147.0 · MATTR 0.837', 'ld: headline');
  check((await val('.ld-read', 'Flesch reading')) === '70.2' && (await val('.ld-read', 'Flesch-Kincaid')) === '7.0' && (await val('.ld-read', 'Gunning')) === '9.5' && (await val('.ld-read', 'SMOG')) === '10.2' && (await val('.ld-read', 'Coleman')) === '10.5' && (await val('.ld-read', 'Automated')) === '8.4', 'ld: six readability scores');
  check((await fact('Sentences')) === '11' && (await fact('Syllables')) === '228', 'ld: 11 sentences, 228 syllables');
  check(/fairly easy/.test(await page.textContent('.ld-read')) && /SMOG wants 30\+/.test(await page.textContent('.ld-read')), 'ld: ease band and SMOG warning');
  check(await page.locator('.ld-fig').isVisible() && (await page.$eval('.ld-fig', (c) => c.width)) > 300, 'ld: MATTR chart drawn');
  check(/measurement 4/.test(await page.textContent('.ld-syl')), 'ld: syllable list shows counts');

  await setv('.ld-win', 20); check((await val('.ld-div', 'MATTR')) === '0.920', 'ld: MATTR window 20 = 0.920');
  await setv('.ld-thr', 0.8); check((await val('.ld-div', 'MTLD')) === '74.5', 'ld: MTLD threshold 0.8 = 74.5');
  await setv('.ld-s', 30); check((await val('.ld-div', 'HD-D')) === '0.884', 'ld: HD-D sample 30 = 0.884');
  await setv('.ld-win', 500); check(/MATTR needs at least 500 words/.test(await val('.ld-div', 'MATTR')) && await page.locator('.ld-fig').isHidden(), 'ld: window longer than text');
  await setv('.ld-thr', 2); check(await page.locator('.ld-err').isVisible() && /threshold/.test(await page.textContent('.ld-err')), 'ld: bad threshold message');
  await setv('.ld-win', 50); await setv('.ld-thr', 0.72); await setv('.ld-s', 42);
  await page.locator('.ld-cs').check(); await page.waitForTimeout(200);
  check(Number(await val('.ld-div', 'Types')) > 116, 'ld: match case gives more types');
  await page.locator('.ld-cs').uncheck(); await page.waitForTimeout(200);

  const [c] = await Promise.all([page.waitForEvent('download'), page.click('.ld-csv')]);
  const text = readFileSync(await c.path(), 'utf8');
  check(c.suggestedFilename() === 'lexical-diversity-readability.csv' && text.includes('Flesch reading ease,70.2') && text.includes('Tokens (running words),158'), 'ld: CSV download');
  const [p] = await Promise.all([page.waitForEvent('download'), page.click('.dl [data-f="pdf"]')]);
  check(p.suggestedFilename() === 'lexical-diversity-readability.pdf', 'ld: PDF report');

  await page.setInputFiles('.ld-file', { name: 'essay.txt', mimeType: 'text/plain', buffer: Buffer.from('The cat sat. The cat ran away from the big dog. It was fast. The dog was slow and old.') });
  await page.waitForTimeout(1000);
  check((await val('.ld-div', 'Tokens')) === '20' && (await fact('Sentences')) === '4' && /essay\.txt/.test(await page.textContent('.ld-fnote')), 'ld: open a .txt file');
  await setv('.ld-in', 'Too short.');
  check(await page.locator('.ld-err').isVisible() && /at least 10 words/.test(await page.textContent('.ld-err')), 'ld: too-short message');
  await page.reload(); await page.waitForTimeout(700);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'lexical-diversity-readability-375.png', fullPage: false });
  page.setDefaultTimeout(30000);
  if (vp0) await page.setViewportSize(vp0);
};
