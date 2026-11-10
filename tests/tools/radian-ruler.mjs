// #1373 radian ruler (maths checked in tests/sci-tools/radian-ruler.mjs)
export const path = '/learn/radian-ruler/';
export default async ({ page, check, BASE }) => {
  const R = '.rdr ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/radian-ruler/`); await page.waitForTimeout(400);
  check((await t('.rd-title')) === '120° = 2π/3 ≈ 2.0944 radians', `radian: title (${await t('.rd-title')})`);
  { const f = await t('.rd-facts'); check(f.includes('3 × 2.0944 = 6.283 cm') && f.includes('= 9.425 cm²'), `radian: arc and sector (${f})`); }
  await page.fill(R + '.rd-rad', '3pi/4');
  check((await t('.rd-title')).startsWith('135° = 3π/4') && (await page.inputValue(R + '.rd-t')) === '135', 'radian: typed 3pi/4');
  await page.fill(R + '.rd-rad', 'zz');
  check(await page.isVisible(R + '.rd-err'), 'radian: bad radians message');
  await page.fill(R + '.rd-deg', '57.2958');
  check(await page.isHidden(R + '.rd-err') && (await t('.rd-facts')).includes('Radii along the arc1 '), `radian: one radian (${await t('.rd-facts')})`);
  await slide('.rd-r', 5); await slide('.rd-t', 60);
  check((await t('.rd-facts')).includes('5 × 1.0472 = 5.236 cm'), 'radian: radius change');
  await page.click(R + '.rd-wrap'); await page.waitForTimeout(3400);
  check((await page.inputValue(R + '.rd-t')) === '360' && (await t('.rd-title')).includes('2π ≈ 6.2832'), `radian: wrap to a full turn (${await t('.rd-title')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.rd-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 300, `radian: picture drawn (${px} px)`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'radian: five quiz questions');
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(2)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'radian: quiz answer');
};
