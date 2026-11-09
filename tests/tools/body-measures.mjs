// #478 body measures
export const path = '/science/body-measures/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/body-measures/`); await page.waitForTimeout(500);
  const R = '.bdm';
  check((await page.textContent(`${R} .bdm-med`)).includes('not medical advice'), 'body: medical line at the top');
  check((await page.textContent(`${R} .bdm-big`)) === 'BMI 30.9 kg/m²' && (await page.textContent(`${R} .bdm-pill`)) === 'Obese class I', 'body: example BMI and WHO class');
  { const t = await page.textContent(`${R} .bdm-bsa`); check(t.includes('2.24 m²') && t.includes('2.20 m²') && t.includes('2.26 m²') && t.includes('2.25 m²'), 'body: example BSA by four formulas'); }
  { const t = await page.textContent(`${R} .bdm-w`); check(t.includes('75.0 kg') && t.includes('72.6 kg') && t.includes('71.5 kg') && t.includes('85.0 kg') && t.includes('69.5 kg') && t.includes('133 % of IBW'), `body: example weights`); }
  check(await page.isVisible(`${R} .bdm-fig`), 'body: chart drawn');
  await page.selectOption(`${R} .bdm-sex`, 'female'); await page.waitForTimeout(100);
  { const t = await page.textContent(`${R} .bdm-w`); check(t.includes('70.5 kg') && t.includes('45.5 + 2.3'), 'body: female formulas (Devine 45.5 + 2.3 × 10.87 in)'); }
  await page.selectOption(`${R} .bdm-sex`, 'male');
  await page.click(`${R} .bdm-units button[data-u=us]`); await page.waitForTimeout(300);
  check((await page.inputValue(`${R} .bdm-ft`)) === '5' && (await page.inputValue(`${R} .bdm-lb`)) === '220.46' && (await page.textContent(`${R} .bdm-big`)) === 'BMI 30.9 kg/m²', 'body: switch to US units keeps the numbers');
  await page.fill(`${R} .bdm-ft`, '6'); await page.fill(`${R} .bdm-in`, '0'); await page.fill(`${R} .bdm-lb`, '180'); await page.waitForTimeout(400);
  { const t = await page.textContent(`${R} .bdm-w`); check(t.includes('171.1 lb (77.6 kg)') && (await page.textContent(`${R} .bdm-big`)) === 'BMI 24.4 kg/m²', 'body: 6 ft man in US units, Devine 77.6 kg'); }
  await page.click(`${R} .bdm-units button[data-u=metric]`); await page.waitForTimeout(300);
  check((await page.inputValue(`${R} .bdm-cm`)) === '182.9', 'body: back to metric');
  await page.fill(`${R} .bdm-cm`, '150'); await page.fill(`${R} .bdm-kg`, '40'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bdm-notes`)).includes('5 ft (152.4 cm)') && (await page.textContent(`${R} .bdm-pill`)).includes('mild thinness'), 'body: short height warning and thinness class');
  await page.fill(`${R} .bdm-f`, '0.5'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bdm-w`)).includes('IBW + 0.5 ×'), 'body: adjusted-weight factor');
  await page.fill(`${R} .bdm-kg`, 'abc'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bdm-err`)).includes('as numbers') && await page.isHidden(`${R} .bdm-out`), 'body: bad input message');
  await page.fill(`${R} .bdm-kg`, '70'); await page.fill(`${R} .bdm-cm`, '400'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .bdm-err`)).includes('between 50 and 250'), 'body: height out of range');
  await page.fill(`${R} .bdm-cm`, '170'); await page.waitForTimeout(400);
  for (const [f, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`${R} .dl button[data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=${f}]`)]);
    const p = OUT + 'body.' + ext; await d.saveAs(p);
    check(readFileSync(p).length > 2000 && d.suggestedFilename().endsWith('.' + ext), `body: ${f} download`);
  }
};
