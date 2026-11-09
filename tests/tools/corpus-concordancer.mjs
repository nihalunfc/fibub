// #733 Corpus concordancer: browser checks.
export const path = '/science/corpus-concordancer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  page.setDefaultTimeout(120000); // slow shared test machines
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  const rows = () => page.$$eval('.cc-tab tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent)));
  const fact = (k) => page.$$eval('.cc-facts div', (ds, k) => ds.find((d) => d.querySelector('dt').textContent === k)?.querySelector('dd').textContent, k);
  const setv = async (sel, v) => { await page.fill(sel, String(v)); await page.waitForTimeout(1200); };
  const mode = async (m) => { const b = page.locator(`.cc-mode button[data-m="${m}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); await page.waitForTimeout(200); };

  let r = await rows();
  check(r.length === 6 && (await fact('Words (tokens)')) === '136' && (await fact('Different words (types)')) === '83', `cc: example has 6 ferry lines, 136 words, 83 types (${r.length}, ${await fact('Words (tokens)')})`);
  check(r[0][1] === 'ferry' && r[0][2].startsWith(' crosses again') && r[1][2].startsWith(' is loading'), `cc: sorted by 1st word right (${r[0][2]} | ${r[1][2]})`);
  await page.selectOption('.cc-sort', 'text'); await page.waitForTimeout(200);
  r = await rows(); check(r[0][0].endsWith('are open and the ') && r[0][2].startsWith(' is loading'), `cc: order in the text (${r[0][0]})`);
  await page.selectOption('.cc-sort', 'L1'); await page.waitForTimeout(200);
  r = await rows(); check(r[0][0].endsWith('old '), `cc: sort by 1st word left puts "old ferry" first (${r[0][0]})`);
  await setv('.cc-width', 2); r = await rows(); check(r.every((x) => x[2].trim().split(/\s+/).length <= 2), 'cc: context width 2 words');
  await setv('.cc-q', 'Strong tea'); r = await rows(); check(r.length === 3, `cc: phrase search finds 3 (${r.length})`);
  await page.locator('.cc-cs').check(); await page.waitForTimeout(200);
  r = await rows(); check(r.length === 1 && r[0][1] === 'Strong tea', `cc: match case finds 1 (${r.length})`);
  await page.locator('.cc-cs').uncheck(); await page.locator('.cc-re').check();
  await setv('.cc-q', 't(ea|ide)'); r = await rows(); check(r.length === 6, `cc: regex t(ea|ide) gives 6 (${r.length})`);
  await setv('.cc-q', 't(ea'); check(await page.locator('.cc-err').isVisible() && /not a valid regular expression/.test(await page.textContent('.cc-err')), 'cc: bad regex message');
  await page.locator('.cc-re').uncheck(); await setv('.cc-q', 'zebra');
  check((await rows()).length === 0 && /No hits/.test(await page.textContent('.cc-note')), 'cc: no hits note');
  await setv('.cc-q', 'ferr*'); check((await rows()).length === 6, 'cc: wildcard ferr*');

  const csvDl = async () => { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cc-csv')]); return { name: d.suggestedFilename(), text: readFileSync(await d.path(), 'utf8') }; };
  let f = await csvDl(); check(f.name === 'concordance.csv' && f.text.split('\n')[0] === 'Left,Hit,Right' && f.text.trim().split('\n').length === 7, `cc: concordance CSV (${f.name})`);

  await mode('freq'); r = await rows();
  check(r[0][1] === 'the' && r[0][2] === '21' && r[0][3] === '15.44 %' && r[2][1] === 'ferry', `cc: word list (${r[0].join('|')})`);
  check((await fact('Type-token ratio')) === '0.610', 'cc: type-token ratio 83/136');
  await setv('.cc-min', 4); r = await rows(); check(r.length === 6 && r.every((x) => Number(x[2]) >= 4), `cc: word list min count 4 (${r.length})`);
  f = await csvDl(); check(f.name === 'word-list.csv' && f.text.startsWith('Rank,Word,Count,Share'), 'cc: word list CSV');

  await mode('ngram'); await setv('.cc-min', 1); r = await rows();
  check(r[0][1] === 'the ferry is' && r[0][2] === '3' && !r.some((x) => x[1] === 'a bridge the'), `cc: trigrams stop at sentence ends (${r[0].join('|')})`);
  await page.locator('.cc-stop').uncheck(); await page.waitForTimeout(200); r = await rows();
  check(r.some((x) => x[1] === 'a bridge the'), 'cc: trigrams across sentences when unticked');
  await page.selectOption('.cc-nn', '2'); await page.waitForTimeout(200); r = await rows();
  check(r[0][1] === 'the ferry' && r[0][2] === '5', `cc: bigrams (${r[0].join('|')})`);

  await mode('coll'); await setv('.cc-q', 'ferry'); r = await rows();
  check(r[0][0] === 'is' && r[0][1] === '4' && r[0][2] === '1.32' && r[0][6] === '1.60' && r[0][7] === '1.34' && r[0][8] === '6.53', `cc: ferry collocates (${r[0].join('|')})`);
  await setv('.cc-q', 'tea'); r = await rows();
  check(r[0][0] === 'strong' && r[0][3] === '3' && r[0][4] === '0' && r[0][6] === '2.63' && r[0][8] === '11.29', `cc: tea collocates (${r[0].join('|')})`);
  await page.selectOption('.cc-by', 'T'); await page.waitForTimeout(200); r = await rows();
  check(r.map((x) => Number(x[7].replace('−', '-'))).every((v, i, a) => !i || a[i - 1] >= v), 'cc: rank by t-score');
  await setv('.cc-L', 0); await setv('.cc-R', 0); check(await page.locator('.cc-err').isVisible(), 'cc: empty window message');
  await setv('.cc-L', 3); await setv('.cc-R', 3);
  f = await csvDl(); check(f.name === 'collocates.csv' && f.text.startsWith('Collocate,Together (O),Expected (E)'), 'cc: collocates CSV');
  const [png] = await Promise.all([page.waitForEvent('download'), page.click('.dl [data-f="png"]')]);
  check(png.suggestedFilename() === 'collocates.png', 'cc: PNG report');

  await page.fill('.cc-in', '');
  await page.setInputFiles('.cc-file', [{ name: 'one.txt', mimeType: 'text/plain', buffer: Buffer.from('Strong tea and strong coffee. The tea was cold.') }, { name: 'two.txt', mimeType: 'text/plain', buffer: Buffer.from('Green tea is not strong tea.') }]);
  await page.waitForTimeout(1000);
  check((await page.$$('.cc-files li')).length === 2 && (await fact('Files')) === '2' && (await fact('Words (tokens)')) === '15', `cc: two files opened (${await fact('Words (tokens)')})`);
  await mode('kwic'); r = await rows();
  check(r.length === 4 && r[0].length === 4 && ['one.txt', 'two.txt'].includes(r[0][0]), `cc: concordance has a file column (${r.length})`);
  await page.click('.cc-files li:nth-child(1) .cc-rm'); await page.waitForTimeout(200);
  check((await fact('Words (tokens)')) === '6' && (await rows()).length === 2, 'cc: remove a file');
  await page.click('.cc-files li .cc-rm'); await page.waitForTimeout(200);
  check(await page.locator('.cc-err').isVisible() && /no words/.test(await page.textContent('.cc-err')), 'cc: empty corpus message');
  await page.goto(BASE + path); await page.waitForSelector('.cc-tab tbody tr');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'corpus-concordancer-375.png', fullPage: true });
  page.setDefaultTimeout(30000);
  if (vp0) await page.setViewportSize(vp0);
};
