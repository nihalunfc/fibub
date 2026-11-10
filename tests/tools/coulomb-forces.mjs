// #1399 Coulomb's law and superposition
export const path = '/learn/coulomb-forces/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/coulomb-forces/`); await page.waitForTimeout(700);
  const R = '.cfz ', txt = (s) => page.textContent(R + s);
  check((await txt('.cfz-big')) === 'Net force on A: 1.11 N at 334°', `coulomb: example net force (${await txt('.cfz-big')})`);
  const parts = await txt('.cfz-parts');
  check(parts.includes('From B (−3 µC, r = 20 cm)') && parts.includes('= 1.35 N, attraction (pulls A towards B)') && parts.includes('r = 17.2 cm') && parts.includes('= 0.607 N, repulsion'), `coulomb: single forces (${parts})`);
  check((await txt('.cfz-sum')).includes('Fx = 0.995 N, Fy = −0.494 N'), `coulomb: components (${await txt('.cfz-sum')})`);
  const inked = () => page.$eval(R + '.cfz-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60 || Math.abs(d[i + 2] - d[2]) > 60) n++; return n; });
  check((await inked()) > 1500, 'coulomb: board drawn');
  // Tap charge C (18, 22) to choose it.
  const fig = await page.$(R + '.cfz-fig'); await fig.scrollIntoViewIfNeeded();
  const box = await fig.boundingBox(), at = (x, y) => [box.x + ((x * 10) / 360) * box.width, box.y + ((280 - y * 10) / 280) * box.height];
  await page.mouse.click(...at(18, 22)); await page.waitForTimeout(100);
  check((await txt('.cfz-name')) === 'C' && (await txt('.cfz-qv')) === '+1 µC', 'coulomb: tap chooses a charge');
  // Drag B from (28, 8) to (28, 18).
  await page.mouse.move(...at(28, 8)); await page.mouse.down(); await page.mouse.move(...at(28, 13), { steps: 4 }); await page.mouse.move(...at(28, 18), { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await txt('.cfz-name')) === 'B' && (await txt('.cfz-parts')).includes('From A (+2 µC, r = 22.4 cm)'), `coulomb: drag moves a charge (${await txt('.cfz-parts')})`);
  await page.selectOption(R + '.cfz-preset', 'two'); await page.waitForTimeout(100);
  check((await txt('.cfz-big')) === 'Net force on A: 2.11 N at 0°', `coulomb: two charges (${await txt('.cfz-big')})`);
  await page.$eval(R + '.cfz-q', (e) => { e.value = '-2'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.cfz-big')) === 'Net force on A: 2.11 N at 180°' && (await txt('.cfz-qv')) === '−2 µC', `coulomb: sign flip turns the force round (${await txt('.cfz-big')})`);
  check(await page.$eval(R + '.cfz-del', (b) => b.disabled), 'coulomb: cannot go below two charges');
  await page.click(R + '.cfz-add'); await page.waitForTimeout(100);
  check((await page.$$eval(R + '.cfz-parts li', (l) => l.length)) === 2 && (await txt('.cfz-name')) === 'C', 'coulomb: add a charge');
  await page.click(R + '.cfz-del'); await page.waitForTimeout(100);
  check((await page.$$eval(R + '.cfz-parts li', (l) => l.length)) === 1, 'coulomb: remove a charge');
  await page.selectOption(R + '.cfz-preset', 'line'); await page.waitForTimeout(100);
  check((await txt('.cfz-big')) === 'Net force on B: 3.14 N at 0°', `coulomb: line layout (${await txt('.cfz-big')})`);
  await page.selectOption(R + '.cfz-preset', 'square'); await page.check(R + '.cfz-tail'); await page.waitForTimeout(100);
  check((await txt('.cfz-big')) === 'Net force on A: 1.72 N at 225°', `coulomb: square (${await txt('.cfz-big')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'coulomb: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [a, b, r] = q1.match(/\+(\d+) µC and \+(\d+) µC are (\d+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((8.98755e9 * a * b * 1e-12) / (r / 100) ** 2)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'coulomb: right answer accepted');
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', '12345'); await page.click(R + '.eq-q:nth-child(2) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Not quite'), 'coulomb: wrong answer flagged');
};
