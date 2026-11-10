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
};
