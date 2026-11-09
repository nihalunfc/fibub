// #1156 Zeros of a polynomial
export const path = '/learn/polynomial-zeros/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/polynomial-zeros/`); await page.waitForSelector('.pz .pz-z');
  const R = '.pz ';
  const txt = (s) => page.textContent(R + s);
  const box = (i) => `${R}.pz-row[data-k="${i}"] input[type=number]`;
  check((await txt('.pz-eq')) === 'p(x) = x² − x − 6' && (await txt('.pz-zeros')).startsWith('Real zeros: −2, 3.'), 'zeros: example quadratic −2, 3');
  check((await txt('.pz-rel')).includes('= 1; from the graph: (−2) + (3) = 1') && (await txt('.pz-rel')).includes('= −6; from the graph: (−2) × (3) = −6'), 'zeros: sum and product match');
  check(await page.isHidden(`${R}.pz-row[data-k="3"]`), 'zeros: d hidden for a quadratic');
  // No real zeros.
  await page.fill(box(2), '6'); await page.waitForTimeout(100);
  check((await txt('.pz-zeros')).includes('No real zeros') && (await txt('.pz-zeros')).includes('2 zeros are not real') && (await page.$$(R + '.pz-z')).length === 0, 'zeros: x² − x + 6 has none');
  await page.fill(box(0), '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pz-err'), 'zeros: a = 0 message');
  // Cubic.
  await page.click(R + '.pz-deg button[data-d="3"]'); await page.waitForTimeout(100);
  check((await txt('.pz-eq')) === 'p(x) = x³ − 2x² − 5x + 6' && (await txt('.pz-zeros')).startsWith('Real zeros: −2, 1, 3.') && await page.isHidden(R + '.pz-err'), 'zeros: cubic example');
  { const r = await txt('.pz-rel'); check(r.includes('= 2; from the graph: 2') && r.includes('= −5; from the graph: −5') && r.includes('= −6; from the graph: (−2) × (1) × (3) = −6'), 'zeros: cubic relations'); }
  // Drag the zero at 3 to 4: x³ − 3x² − 6x + 8 = (x + 2)(x − 1)(x − 4).
  const fig = page.locator(R + '.pz-fig'); await fig.scrollIntoViewIfNeeded();
  { const b = await fig.boundingBox(); const k = b.width / 340; const X = (x) => b.x + (10 + ((x + 6) / 12) * 320) * k, Y = b.y + 150 * k;
    await page.mouse.move(X(3), Y); await page.mouse.down(); await page.mouse.move(X(4), Y, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await txt('.pz-eq')) === 'p(x) = x³ − 3x² − 6x + 8' && (await page.inputValue(box(3))) === '8', `zeros: drag a zero from 3 to 4 (${await txt('.pz-eq')})`); }
  // One real zero.
  await page.fill(box(1), '0'); await page.fill(box(2), '0'); await page.fill(box(3), '-8'); await page.waitForTimeout(100);
  check((await txt('.pz-zeros')).startsWith('Real zeros: 2.') && (await txt('.pz-zeros')).includes('2 zeros are not real') && (await txt('.pz-note')).includes('can be dragged when all'), 'zeros: x³ − 8 has one real zero');
  // Linear.
  await page.click(R + '.pz-deg button[data-d="1"]'); await page.waitForTimeout(100);
  check((await txt('.pz-eq')) === 'p(x) = 2x − 3' && (await txt('.pz-rel')).includes('= 1.5') && await page.isHidden(`${R}.pz-row[data-k="2"]`), 'zeros: linear 2x − 3');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'zeros: four questions');
  await page.click(R + '.sm-q:nth-child(3) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(3) .sm-qwork'); const m = /b = (\S+) and c = (\S+)\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(3) .sm-qin', `${m[1]}, ${m[2]}`.replace(/−/g, '-')); await page.click(R + '.sm-q:nth-child(3) .sm-qcheck');
    check((await txt('.sm-q:nth-child(3) .sm-qres')) === 'Right!', `zeros: quadratic from sum and product (${w})`); }
  await page.click(R + '.sm-q:nth-child(2) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(2) .sm-qwork'); const m = /Sum = −b\/a = (\S+) and product = c\/a = (\S+)\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(2) .sm-qin', `${m[1]}, ${m[2]}`.replace(/−/g, '-')); await page.click(R + '.sm-q:nth-child(2) .sm-qcheck');
    check((await txt('.sm-q:nth-child(2) .sm-qres')) === 'Right!', `zeros: fractions accepted (${m[1]}, ${m[2]})`); }
  await page.fill(R + '.sm-q:nth-child(1) .sm-qin', '100, 200'); await page.click(R + '.sm-q:nth-child(1) .sm-qcheck');
  check((await txt('.sm-q:nth-child(1) .sm-qres')).includes('Not quite'), 'zeros: wrong answer');
};
