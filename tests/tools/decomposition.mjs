// #1458 decomposition (model checked against Python in tests/sci-tools/decomposition.mjs)
export const path = '/learn/decomposition/';
export default async ({ page, check, BASE }) => {
  const R = '.dcm ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/decomposition/`); await page.waitForTimeout(500);
  { const f = await t('.dc-facts'); check(f.includes('61.4 %') && f.includes('0.487 per year') && f.includes('1.4 years') && f.includes('6.1 years'), `decomp: temperate leaves (${f})`); }
  check((await t('.dc-formula')).includes('0.4874'), 'decomp: formula');
  await page.selectOption(R + '.dc-pl', 'rain'); check((await t('.dc-facts')).includes('7.1 months') && (await t('.dc-say')).includes('Warm and damp'), `decomp: rainforest (${await t('.dc-facts')})`);
  await page.selectOption(R + '.dc-pl', 'bog'); check((await t('.dc-say')).includes('Waterlogged'), 'decomp: bog');
  await page.selectOption(R + '.dc-pl', 'desert'); check((await t('.dc-say')).includes('Too dry'), 'decomp: desert');
  await page.selectOption(R + '.dc-pl', 'temperate'); await page.selectOption(R + '.dc-li', 'wood'); check((await t('.dc-facts')).includes('11.9 years'), 'decomp: wood');
  await slide('.dc-t', -8); check((await page.$eval(R + '.dc-pl', (e) => e.value)) === 'own' && (await t('.dc-facts')).includes('never (frozen)') && (await t('.dc-say')).includes('Frozen'), 'decomp: frozen');
  await slide('.dc-t', 20); await slide('.dc-y', 5);
  const px = await page.evaluate(() => { const c = document.querySelector('.dc-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i + 2] > 120) n++; return n; });
  check(px > 200, `decomp: curve drawn (${px})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'decomp: five quiz questions');
  const q1 = (await t('.smq-q:nth-child(1) .smq-text')).match(/\d+(?:\.\d+)?/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(Math.LN2 / q1[0])); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'decomp: quiz half-life');
};
