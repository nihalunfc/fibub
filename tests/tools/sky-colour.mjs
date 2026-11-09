// #1007 Why the sky is blue
export const path = '/learn/sky-colour/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.sky ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.sky-big'), facts = () => page.textContent(R + '.sky-facts');
  const set = (v) => page.$eval(R + '.sky-alt', (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  const px = (x, y) => page.evaluate(([x, y]) => { const c = document.querySelector('.sky-fig'); const k = c.width / 400; return [...c.getContext('2d').getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data]; }, [x, y]);
  check((await big()) === 'Blue sky: blue light is scattered far more than red', `sky: example (${await big()})`);
  { const f = await facts(); check(f.includes('5.86× more scattered') && f.includes('1.15× overhead') && f.includes('77.6%') && f.includes('95.2%'), `sky: example facts ${f}`); }
  check((await page.textContent(R + '.sky-formula')).includes('(700/450)⁴ = 5.86'), 'sky: working');
  { const [r, g, b] = await px(380, 20); check(b > r && b > 100, `sky: sky drawn blue (${r},${g},${b})`); }
  await page.locator(R + '.sky-fig').screenshot({ path: OUT + 'sky-noon.png' });
  await set(5); await page.waitForTimeout(100);
  check((await big()).startsWith('Red-orange sun') && (await facts()).includes('10.3× overhead') && (await facts()).includes('10.4%') && (await facts()).includes('64.7%'), `sky: sunset (${await facts()})`);
  await page.locator(R + '.sky-fig').screenshot({ path: OUT + 'sky-sunset.png' });
  await set(0); await page.waitForTimeout(100);
  check((await facts()).includes('37.9× overhead'), 'sky: horizon air mass 37.9');
  await set(60); await page.selectOption(R + '.sky-p', '0'); await page.waitForTimeout(100);
  check((await big()).startsWith('White or grey') && (await facts()).includes('1× more'), `sky: clouds (${await big()})`);
  { const [r, g, b] = await px(380, 20); check(Math.abs(r - b) < 25 && r > 100, `sky: cloud sky is white-grey (${r},${g},${b})`); }
  await page.selectOption(R + '.sky-p', '1.5'); await page.waitForTimeout(100);
  check((await big()).startsWith('Pale') && (await facts()).includes('1.94×'), 'sky: haze');
  await page.selectOption(R + '.sky-p', 'none'); await page.waitForTimeout(100);
  check((await big()).startsWith('Black sky') && (await facts()).includes('100%'), 'sky: no air');
  { const [r, g, b] = await px(380, 20); check(r + g + b < 30, `sky: black sky (${r},${g},${b})`); }
  await page.selectOption(R + '.sky-p', '4'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sky-quiz .sq-q')).length === 4, 'sky: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'sky: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `sky: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
