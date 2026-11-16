// #1422 Young's double slit and single slit
export const path = '/learn/double-slit/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.dsl ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.dsl-big'), facts = () => page.textContent(R + '.dsl-facts'), formula = () => page.textContent(R + '.dsl-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await big()) === 'Fringe width β = 2.4 mm', `slits: example (${await big()})`);
  { const f = await facts(); check(f.includes('7.2 mm') && f.includes('1.2 mm') && f.includes('0.138°') && f.includes('1.5 λ') && f.includes('dark'), `slits: example facts ${f}`); }
  check((await formula()).includes('= 2.4 mm') && (await formula()).includes('= 900 nm = 1.5 λ') && (await formula()).includes('2d / a = 10'), `slits: working ${await formula()}`);
  const inked = (c) => page.evaluate((c) => { const el = document.querySelector(c); const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; }, c);
  check((await inked('.dsl-strip')) > 500 && (await inked('.dsl-chart')) > 500, 'slits: strip and graph drawn');
  await page.locator(R + '.dsl-out').screenshot({ path: OUT + 'slits.png' });
  await set('.dsl-x', 4.8); await page.waitForTimeout(50);
  check((await facts()).includes('bright (fringe 2)'), 'slits: P on the 2nd bright fringe');
  await set('.dsl-d', 0.5); await page.waitForTimeout(50);
  check((await big()) === 'Fringe width β = 1.2 mm', 'slits: doubling d halves β');
  await set('.dsl-l', 400); await page.waitForTimeout(50);
  check((await big()) === 'Fringe width β = 0.8 mm', 'slits: violet light, narrower fringes');
  await page.click(R + '.dsl-light [data-w=white]'); await page.waitForTimeout(150);
  check((await big()).startsWith('Fringe width for green light (550 nm): β = 1.1 mm') && (await page.textContent(R + '.dsl-lv')).includes('white'), `slits: white light (${await big()})`);
  await page.locator(R + '.dsl-strip').screenshot({ path: OUT + 'slits-white.png' });
  await page.click(R + '.dsl-light [data-w=one]'); await set('.dsl-l', 600); await set('.dsl-d', 0.25);
  await page.click(R + '.dsl-kind [data-k=single]'); await page.waitForTimeout(100);
  check((await big()) === 'Central maximum 24 mm wide' && (await page.$eval(R + '.dsl-d', (e) => e.closest('label').hidden)), `slits: single slit (${await big()})`);
  check((await formula()).includes('= 24 mm'), 'slits: single slit working');
  await set('.dsl-a', 0.1); await page.waitForTimeout(50);
  check((await big()) === 'Central maximum 12 mm wide', 'slits: wider slit, narrower central maximum');
  await page.check(R + '.dsl-cmp'); await page.waitForTimeout(100);
  check((await inked('.dsl-chart')) > 500, 'slits: comparison drawn');
  await page.uncheck(R + '.dsl-cmp'); await set('.dsl-a', 0.05); await set('.dsl-x', 3.6); await page.click(R + '.dsl-kind [data-k=double]'); await page.waitForTimeout(100);
  check((await big()) === 'Fringe width β = 2.4 mm', 'slits: back to the example');
  check((await page.$$(R + '.dsl-quiz .sq-q')).length === 4, 'slits: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'slits: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `slits: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
  // Solve your own numbers.
  await page.evaluate(() => document.querySelectorAll('.dsl details').forEach((d) => (d.open = true)));
  const S = (k) => `${R}.dsl-solve [data-k="young-${k}"]`, ans = () => page.textContent(S('answer')), wk = () => page.textContent(S('working'));
  check((await ans()) === 'The fringe width is 2.4 mm.' && (await wk()).includes('β = λ D / d') && (await wk()).includes('Convert the wavelength: 600 nm = 6 × 10⁻⁷ m'), `slits solve: 600 nm, 0.25 mm, 1 m (${await ans()})`);
  await page.selectOption(S('example'), '1'); await page.waitForTimeout(50);
  check((await ans()) === 'The fringe width is 2.36 mm.', `slits solve: sodium light (${await ans()})`);
  await page.selectOption(S('example'), '2'); await page.waitForTimeout(50);
  check((await ans()) === 'The wavelength is 600 nm (visible light).', `slits solve: find the wavelength (${await ans()})`);
  await page.selectOption(S('example'), '3'); await page.waitForTimeout(50);
  check((await ans()) === 'The 4th bright fringe is 15 mm from the centre.' && (await wk()).includes('4 λ = 2000 nm'), `slits solve: 4th bright fringe (${await ans()})`);
  await page.selectOption(S('example'), '4'); await page.waitForTimeout(50);
  check((await ans()) === 'The 2nd dark fringe is 1.95 mm from the centre.' && (await wk()).includes('Path difference there: 1.5 λ = 975 nm'), `slits solve: 2nd dark fringe (${await ans()})`);
  await page.selectOption(S('find'), 'd'); await page.fill(S('beta'), '2.4'); await page.selectOption(S('lam-unit'), 'µm'); await page.fill(S('lam'), '0.6'); await page.fill(S('D'), '1'); await page.waitForTimeout(50);
  check((await ans()) === 'The slit separation is 0.25 mm.', `slits solve: find d, wavelength in µm (${await ans()})`);
  await page.selectOption(S('find'), 'D'); await page.fill(S('d'), '0'); await page.waitForTimeout(50);
  check((await ans()).includes('must be above zero') && !/NaN|Infinity/.test(await ans()), 'slits solve: zero separation message');
  await page.selectOption(S('find'), 'xn'); await page.fill(S('d'), '0.25'); await page.fill(S('n'), '1.5'); await page.waitForTimeout(50);
  check((await ans()).includes('whole number'), 'slits solve: fringe number must be whole');
  // Single slit
  const T = (k) => `${R}.dsl-solve1 [data-k="single-${k}"]`, tans = () => page.textContent(T('answer'));
  check((await tans()) === 'The central bright band is 24 mm wide.', `slits solve: single slit 24 mm (${await tans()})`);
  await page.selectOption(T('example'), '2'); await page.waitForTimeout(50);
  check((await tans()) === 'The wavelength is 600 nm.', `slits solve: single slit wavelength (${await tans()})`);
  await page.selectOption(T('example'), '3'); await page.waitForTimeout(50);
  check((await tans()) === 'The 2nd dark minimum is 19.5 mm from the centre.', `slits solve: 2nd minimum (${await tans()})`);
  await page.selectOption(T('find'), 'W'); await page.fill(T('a'), '0.3'); await page.selectOption(T('a-unit'), 'µm'); await page.fill(T('lam'), '600'); await page.fill(T('D'), '1'); await page.waitForTimeout(50);
  check((await tans()).includes('no first minimum'), `slits solve: slit narrower than the wavelength (${await tans()})`);
};
