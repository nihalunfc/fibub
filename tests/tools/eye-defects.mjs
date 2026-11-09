// #1005 Eye defects and glasses
export const path = '/learn/eye-defects/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.eyd ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.eyd-big'), facts = () => page.textContent(R + '.eyd-facts'), formula = () => page.textContent(R + '.eyd-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  const kind = (k) => page.click(`${R}.eyd-kind [data-k=${k}]`);
  check((await big()) === 'Focus falls on the retina: sharp' && (await facts()).includes('+40 D') && (await facts()).includes('40 to 44 D'), `eye: normal eye far away (${await big()})`);
  check(await page.isHidden(R + '.eyd-glasses'), 'eye: no glasses for a normal eye');
  const inked = () => page.evaluate(() => { const c = document.querySelector('.eyd-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'eye: picture drawn');
  await set('.eyd-x', 35); await page.waitForTimeout(100);
  check((await page.textContent(R + '.eyd-xv')) === '51 cm' && (await big()).includes('sharp'), `eye: normal eye at 51 cm (${await page.textContent(R + '.eyd-xv')})`);
  await set('.eyd-x', 0); await page.waitForTimeout(100);
  check((await big()) === 'Focus falls behind the retina: blurred' && (await facts()).includes('+50 D'), 'eye: 10 cm is too close for a normal eye');
  await kind('myopia'); await page.waitForTimeout(100);
  check((await big()) === 'Focus falls in front of the retina: blurred' && (await facts()).includes('−1.25 D') && (await facts()).includes('19 cm') && (await formula()).includes('100/(−80) = −1.25 D'), `eye: myopia far away (${await facts()})`);
  await page.locator(R + '.eyd-fig').screenshot({ path: OUT + 'eye-myopia.png' });
  await page.check(R + '.eyd-glasses'); await page.waitForTimeout(100);
  check((await big()) === 'Focus falls on the retina: sharp', 'eye: concave glasses fix myopia');
  await page.locator(R + '.eyd-fig').screenshot({ path: OUT + 'eye-myopia-glasses.png' });
  await set('.eyd-fp', 200); await page.waitForTimeout(100);
  check((await facts()).includes('−0.5 D') && (await big()).includes('sharp'), 'eye: far point 200 cm needs −0.5 D');
  await kind('hyper'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.eyd-xv')) === '25 cm' && (await big()) === 'Focus falls behind the retina: blurred' && (await facts()).includes('+3 D') && !(await page.isChecked(R + '.eyd-glasses')), `eye: long sight at 25 cm (${await big()})`);
  await page.check(R + '.eyd-glasses'); await page.waitForTimeout(100);
  check((await big()).includes('sharp') && (await formula()).includes('100/25 − 100/100 = +3 D'), 'eye: convex glasses fix long sight');
  await set('.eyd-np', 50); await page.waitForTimeout(100);
  check((await facts()).includes('+2 D'), 'eye: near point 50 cm needs +2 D');
  await kind('presby'); await set('.eyd-np', 200); await page.waitForTimeout(100);
  check((await big()).includes('behind') && (await facts()).includes('+3.5 D') && (await facts()).includes('40 to 40.5 D'), `eye: presbyopia (${await facts()})`);
  await page.check(R + '.eyd-glasses'); await page.waitForTimeout(100);
  check((await big()).includes('sharp'), 'eye: reading glasses fix presbyopia');
  check((await page.$$(R + '.eyd-quiz .sq-q')).length === 4, 'eye: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'eye: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `eye: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
