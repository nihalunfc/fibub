// #1004 Prism and dispersion
export const path = '/learn/prism-dispersion/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.psm ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.psm-big'), facts = () => page.textContent(R + '.psm-facts'), formula = () => page.textContent(R + '.psm-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await big()) === 'Deviation δ = 38.9°', `prism: example (${await big()})`);
  { const f = await facts(); check(f.includes('30.3°') && f.includes('29.7°') && f.includes('48.9°') && f.includes('at i = e = 49.5°'), `prism: example angles ${f}`); }
  check((await formula()).includes('δ = i + e − A = 50° + 48.9° − 60° = 38.9°'), 'prism: deviation working');
  const inked = (c) => page.evaluate((c) => { const el = document.querySelector(c); const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; }, c);
  check((await inked('.psm-fig')) > 500 && (await inked('.psm-chart')) > 500, 'prism: picture and graph drawn');
  await page.locator(R + '.psm-out').screenshot({ path: OUT + 'prism.png' });
  await page.click(R + '.psm-min'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.psm-i')) === '49' && (await big()) === 'Deviation δ = 38.9°', 'prism: go to minimum deviation');
  await set('.psm-i', 20); await page.waitForTimeout(100);
  check((await big()) === 'No ray comes out' && (await page.textContent(R + '.psm-err')).includes('totally reflected'), 'prism: total internal reflection at small i');
  await set('.psm-i', 50); await page.click(R + '.psm-light [data-w=white]'); await page.waitForTimeout(150);
  check((await big()) === 'Spectrum: violet bent 40.1°, red 38.7°' && (await facts()).includes('1.40°') && (await facts()).includes('1.517') && (await facts()).includes('1.533'), `prism: white light (${await big()})`);
  await page.locator(R + '.psm-fig').screenshot({ path: OUT + 'prism-white.png' });
  await page.selectOption(R + '.psm-g', '1.65'); await page.waitForTimeout(100);
  { const b = await big(), m = b.match(/violet bent ([\d.]+)°, red ([\d.]+)°/); check(m && Number(m[1]) - Number(m[2]) > 1.4, `prism: flint spreads more (${b})`); }
  await page.click(R + '.psm-level [data-l="12"]'); await page.waitForTimeout(100);
  check((await formula()).includes('n = sin((A + δm)/2) / sin(A/2)') && (await formula()).includes('= 1.65'), `prism: class 12 working ${await formula()}`);
  await page.selectOption(R + '.psm-g', '2.42'); await set('.psm-a', 80); await page.waitForTimeout(100);
  check((await big()) === 'No light gets through' && (await page.textContent(R + '.psm-err')).includes('smaller'), 'prism: diamond 80° lets nothing through');
  await set('.psm-a', 60); await page.selectOption(R + '.psm-g', '1.52'); await page.click(R + '.psm-light [data-w=one]'); await page.click(R + '.psm-level [data-l="10"]'); await page.waitForTimeout(100);
  check((await big()) === 'Deviation δ = 38.9°', 'prism: back to the example');
  check((await page.$$(R + '.psm-quiz .sq-q')).length === 4, 'prism: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'prism: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `prism: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
