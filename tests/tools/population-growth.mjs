// #1452 population growth (maths checked against scipy in tests/sci-tools/population-growth.mjs)
export const path = '/learn/population-growth/';
export default async ({ page, check, BASE }) => {
  const R = '.pgr ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/population-growth/`); await page.waitForTimeout(500);
  { const f = await t('.pg-facts'); check(f.includes('1484.1') && f.includes('599.9') && f.includes('1.39') && f.includes('125 per unit time') && f.includes('N = K/2 = 500'), `pop: bacteria facts (${f})`); }
  check((await t('.pg-formula')).includes('dN/dt = rN(1 − N/K)'), 'pop: formula with numbers');
  check((await t('.pg-rsay')).includes('Between K/2 and K'), 'pop: rate sentence');
  await slide('.pg-t', 2); check((await t('.pg-facts')).includes('Time to reach K/2') && (await t('.pg-rsay')).includes('Below K/2'), 'pop: early time');
  await slide('.pg-t', 40); check((await t('.pg-rsay')).includes('at K'), 'pop: at K');
  await page.selectOption(R + '.pg-st', 'fish'); await slide('.pg-n0', 200); await slide('.pg-k', 100);
  check((await page.$eval(R + '.pg-st', (e) => e.value)) === 'own' && (await t('.pg-rsay')).includes('Above K'), `pop: above K (${await t('.pg-rsay')})`);
  await page.click(R + '.pg-show button[data-v=exp]'); await page.click(R + '.pg-show button[data-v=log]');
  const px = await page.evaluate(() => { const c = document.querySelector('.pg-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i + 2] > 120) n++; return n; });
  check(px > 200, `pop: logistic curve drawn (${px})`);
  check((await t('.pg-psay')).includes('Under 20: 47 %'), 'pop: expanding pyramid');
  await page.click(R + '.pg-pyr button[data-v=declining]');
  check((await t('.pg-psay')).includes('Declining') && (await t('.pg-psay')).includes('Under 20: 15 %'), 'pop: declining pyramid');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'pop: five quiz questions');
  const q3 = (await t('.smq-q:nth-child(3) .smq-text')).match(/\d+(?:\.\d+)?/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(3) .smq-in', String(q3[1] / 2)); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', `pop: quiz K/2 (${q3})`);
};
