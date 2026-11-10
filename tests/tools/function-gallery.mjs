// #1369 function gallery (maths checked in tests/sci-tools/function-gallery.mjs)
export const path = '/learn/function-gallery/';
export default async ({ page, check, BASE }) => {
  const R = '.fgl ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/function-gallery/`); await page.waitForTimeout(400);
  check((await t('.fg-title')) === 'Square (polynomial): f(x) = x²', `gallery: starts on x² (${await t('.fg-title')})`);
  { const f = await t('.fg-facts'); check(f.includes('Range[0, ∞)') && f.includes('f(1.5)2.25'), `gallery: x² facts (${f})`); }
  await page.click(R + '.fg-picks button[data-id="gif"]');
  await slide('.fg-x', -2.3);
  { const f = await t('.fg-facts'); check(f.includes('f(−2.3)−3') && f.includes('Z (the integers)'), `gallery: [−2.3] = −3 (${f})`); }
  await page.click(R + '.fg-picks button[data-id="reciprocal"]'); await slide('.fg-x', 0);
  check((await t('.fg-facts')).includes('not defined here'), 'gallery: 1/0 not defined');
  await page.click(R + '.fg-picks button[data-id="signum"]');
  check((await t('.fg-facts')).includes('f(0)0') && (await t('.fg-facts')).includes('{−1, 0, 1}'), 'gallery: signum(0) = 0');
  const px = await page.evaluate(() => { const c = document.querySelector('.fg-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 200, `gallery: graph drawn (${px} px)`);
  await page.click(R + '.fg-mode button[data-m="combine"]');
  check(await page.isHidden(R + '.fg-gal') && await page.isVisible(R + '.fg-comb'), 'gallery: combine mode shows');
  await slide('.fg-x', 1.5);
  { const f = await t('.fg-facts'); check(f.includes('Domain of the resultR') && f.includes('2.25 + 0.5 = 2.75'), `gallery: f + g (${f})`); }
  await page.click(R + '.fg-op button[data-op="/"]');
  { const f = await t('.fg-facts'); check(f.includes('R − {1}') && f.includes('2.25 ÷ 0.5 = 4.5') && (await t('.fg-title')) === '(f ÷ g)(x) = (x²) / (x − 1)', `gallery: f ÷ g (${f})`); }
  await page.selectOption(R + '.fg-gk', 'sqrt'); await page.fill(R + '.fg-gb', '0');
  check((await t('.fg-facts')).includes('(0, ∞)'), `gallery: x²/√x domain (${await t('.fg-facts')})`);
  await page.click(R + '.fg-op button[data-op="*"]');
  check((await t('.fg-facts')).includes('[0, ∞)'), 'gallery: x²√x domain');
  await page.fill(R + '.fg-fa', 'abc');
  check(await page.isVisible(R + '.fg-err'), 'gallery: bad number message');
  await page.fill(R + '.fg-fa', '1');
  check(await page.isHidden(R + '.fg-err'), 'gallery: message clears');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'gallery: five quiz questions');
  const q2 = await t('.smq-q:nth-child(2) .smq-text'); const s = Number(q2.match(/of (-?\d+)/)[1]);
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', String(Math.sign(s))); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'gallery: quiz answer');
};
