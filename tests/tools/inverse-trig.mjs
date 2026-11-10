// #1460 inverse trig (maths checked against sympy in tests/sci-tools/inverse-trig.mjs)
export const path = '/learn/inverse-trig/';
export default async ({ page, check, BASE }) => {
  const R = '.itg ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/inverse-trig/`); await page.waitForTimeout(500);
  check((await t('.it-pv')) === 'sin⁻¹(0.5) = π/6', `inverse trig: sin⁻¹(1/2) (${await t('.it-pv')})`);
  { const f = await t('.it-facts'); check(f.includes('In degrees30°') && f.includes('sin⁻¹(−0.5)−π/6') && f.includes('sin⁻¹x + cos⁻¹xπ/2'), `inverse trig: facts (${f})`); }
  check((await t('.it-all')).includes('−11π/6, −7π/6, π/6, 5π/6'), `inverse trig: all angles (${await t('.it-all')})`);
  check((await t('.it-dr')).includes('[−π/2, π/2]'), 'inverse trig: principal range shown');
  await page.click(R + '.it-fn button[data-f=cos]'); await page.waitForTimeout(60);
  check((await t('.it-pv')) === 'cos⁻¹(−0.5) = 2π/3' && (await t('.it-facts')).includes('120°'), `inverse trig: cos⁻¹(−1/2) (${await t('.it-pv')})`);
  await page.click(R + '.it-fn button[data-f=cot]'); await page.fill(R + '.it-x', '-1'); await page.waitForTimeout(60);
  check((await t('.it-pv')) === 'cot⁻¹(−1) = 3π/4', `inverse trig: cot⁻¹(−1) in (0, π) (${await t('.it-pv')})`);
  await page.click(R + '.it-fn button[data-f=sec]'); await page.fill(R + '.it-x', '0.5'); await page.waitForTimeout(60);
  check((await t('.it-pv')).includes('not defined') && (await t('.it-all')).includes('x ≤ −1'), 'inverse trig: sec⁻¹(0.5) undefined');
  await page.fill(R + '.it-x', 'abc'); await page.waitForTimeout(60);
  check(!(await page.$eval(R + '.it-err', (e) => e.hidden)), 'inverse trig: bad input message');
  await page.click(R + '.it-fn button[data-f=sin]'); await page.fill(R + '.it-x', 'sqrt(3)/2'); await page.waitForTimeout(60);
  check((await t('.it-pv')).endsWith('= π/3'), `inverse trig: sqrt(3)/2 (${await t('.it-pv')})`);
  check((await t('.it-trapsay')).includes('sin⁻¹(sin 5π/6) = π/6, not θ'), `inverse trig: trap at 5π/6 (${await t('.it-trapsay')})`);
  await page.$eval(R + '.it-th', (e) => { e.value = '30'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.it-trapsay')).includes('sin⁻¹(sin π/6) = π/6 = θ'), `inverse trig: trap on the branch (${await t('.it-trapsay')})`);
  await page.check(R + '.it-whole'); await page.$eval(R + '.it-t', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.it-fnote')).includes('Red dashed') && (await t('.it-tv')) === 'not yet', 'inverse trig: whole graph and slider');
  await page.click(R + '.it-play'); await page.waitForTimeout(2400);
  check((await t('.it-tv')) === 'done', 'inverse trig: play the reflection');
  const px = await page.evaluate(() => { const c = document.querySelector('.it-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || d[i + 2] < 200) n++; return n; });
  check(px > 3000, `inverse trig: graph drawn (${px} px)`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'inverse trig: five quiz questions');
  await page.fill(R + '.smq-q:nth-child(5) .smq-in', 'pi/2'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'inverse trig: quiz accepts pi/2');
};
