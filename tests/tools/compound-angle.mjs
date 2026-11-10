// #1370 compound angle proof (maths checked in tests/sci-tools/compound-angle.mjs)
export const path = '/learn/compound-angle/';
export default async ({ page, check, BASE }) => {
  const R = '.cpa ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/compound-angle/`); await page.waitForTimeout(400);
  check((await t('.cp-title')) === 'sin(30° + 45°) = sin 75° = 0.9659', `compound: title (${await t('.cp-title')})`);
  check((await t('.cp-sum')).includes('0.3536 + 0.6124 = 0.9659'), `compound: sine sum (${await t('.cp-sum')})`);
  await page.click(R + '.cp-show button[data-s="cos"]');
  check((await t('.cp-sum')).includes('0.6124 − 0.3536 = 0.2588'), `compound: cosine (${await t('.cp-sum')})`);
  await slide('.cp-a', 60); await slide('.cp-b', 50);
  check((await t('.cp-title')).includes('cos 110° = −0.342'), `compound: past 90° (${await t('.cp-title')})`);
  const rows = await page.$$eval(R + '.cp-tab tbody tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent)));
  check(rows.length === 9 && rows.every((r) => r[1] === r[2]), `compound: table agrees (${rows.length} rows)`);
  await slide('.cp-a', 45); await page.click(R + '.cp-dbl');
  check((await page.inputValue(R + '.cp-b')) === '45' && (await t('.cp-tab')).includes('undefined'), 'compound: B = A, tan 90° undefined');
  const px = await page.evaluate(() => { const c = document.querySelector('.cp-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 100, `compound: picture drawn (${px} px)`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'compound: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'compound: quiz answer');
};
