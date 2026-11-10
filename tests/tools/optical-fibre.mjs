// #1421 Total internal reflection and optical fibre
export const path = '/learn/optical-fibre/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.ofb ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.ofb-big'), facts = () => page.textContent(R + '.ofb-facts'), formula = () => page.textContent(R + '.ofb-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await big()) === 'Guided to the far end: 4 total internal reflections', `fibre: example (${await big()})`);
  { const f = await facts(); check(f.includes('60.1°') && f.includes('13.2°') && f.includes('76.8°'), `fibre: example facts ${f}`); }
  check((await formula()).includes('= 0.8667 → C = 60.1°'), 'fibre: critical angle working');
  const inked = () => page.evaluate(() => { const el = document.querySelector('.ofb-fig'); const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'fibre: picture drawn');
  await page.locator(R + '.ofb-out').screenshot({ path: OUT + 'fibre.png' });
  await set('.ofb-r', 60); await set('.ofb-t', 10); await page.waitForTimeout(100);
  check((await big()).startsWith('Leaks out after 1 reflection:'), `fibre: tight bend leaks (${await big()})`);
  await page.locator(R + '.ofb-fig').screenshot({ path: OUT + 'fibre-leak.png' });
  await page.click(R + '.ofb-shape [data-s=straight]'); await page.waitForTimeout(100);
  check(await page.$eval(R + '.ofb-r', (e) => e.closest('label').hidden), 'fibre: bend slider hidden for a straight fibre');
  await set('.ofb-t', 45); await page.waitForTimeout(50);
  check((await big()) === 'Guided to the far end: 10 total internal reflections', `fibre: straight 45° (${await big()})`);
  await set('.ofb-t', 50); await page.waitForTimeout(50);
  check((await big()).startsWith('Leaks out after 0 reflections'), `fibre: straight 50° leaks (${await big()})`);
  await page.click(R + '.ofb-level [data-l=more]'); await page.waitForTimeout(50);
  check((await facts()).includes('0.748') && (await facts()).includes('48.4°') && (await formula()).includes('θa = 48.4°'), 'fibre: going further NA and acceptance');
  await set('.ofb-n2', 1.0); await set('.ofb-t', 80); await page.waitForTimeout(50);
  check((await big()).startsWith('Guided') && (await formula()).includes('NA ≥ 1'), `fibre: glass in air traps everything (${await big()})`);
  await set('.ofb-n2', 1.79); await page.waitForTimeout(50);
  check((await page.textContent(R + '.ofb-n2v')).includes('kept below n₁'), 'fibre: cladding kept below core');
  await set('.ofb-n2', 1.3); await set('.ofb-t', 20); await page.click(R + '.ofb-shape [data-s=bent]'); await set('.ofb-r', 100); await page.click(R + '.ofb-level [data-l="12"]'); await page.waitForTimeout(100);
  check((await big()) === 'Guided to the far end: 4 total internal reflections', 'fibre: back to the example');
  check((await page.$$(R + '.ofb-quiz .sq-q')).length === 4, 'fibre: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'fibre: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `fibre: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
