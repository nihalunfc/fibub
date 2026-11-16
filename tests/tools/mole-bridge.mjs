// #1085 Mole bridge
export const path = '/learn/mole-bridge/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/mole-bridge/`); await page.waitForSelector('.mb .mb-svg rect');
  const steps = () => page.textContent('.mb .mb-steps'), svgT = () => page.textContent('.mb .mb-svg');
  check((await steps()).includes('2 × 1 + 1 × 16 = 18 g/mol') && (await steps()).includes('36 ÷ 18 = 2 mol') && (await steps()).includes('1.204 × 10²⁴') && (await steps()).includes('2 × 22.4 = 44.8 L'), 'mole: water example steps');
  check((await svgT()).includes('2 mol') && (await svgT()).includes('44.8 L') && await page.locator('.mb .mb-svg line.lk.on').count() === 1, 'mole: bridge picture, grams link lit');
  await page.click('.mb .mb-lvl [data-l="11"]');
  check((await steps()).includes('18.02 g/mol') && (await steps()).includes('× 22.7'), 'mole: Class 11 IUPAC and 22.7 L');
  await page.click('.mb .mb-lvl [data-l="9"]');
  await page.locator('.mb .mb-chip[data-f="CO2"]').click(); await page.selectOption('.mb .mb-u', 'L'); await page.fill('.mb .mb-v', '11.2');
  check((await steps()).includes('11.2 ÷ 22.4 = 0.5 mol') && (await steps()).includes('0.5 × 44 = 22 g'), 'mole: litres of CO2 to grams');
  await page.selectOption('.mb .mb-u', 'N'); await page.fill('.mb .mb-v', '6.022e23');
  check((await steps()).includes('= 1 mol') && (await svgT()).includes('44 g'), 'mole: particles to moles');
  await page.fill('.mb .mb-f', 'H2Q'); check(await page.isVisible('.mb .mb-err'), 'mole: bad formula message');
  await page.fill('.mb .mb-f', 'NaCl'); await page.fill('.mb .mb-v', '-1'); check((await page.textContent('.mb .mb-err')).includes('zero or more'), 'mole: negative amount refused');
  await page.fill('.mb .mb-v', '1');
  // empirical
  check((await page.textContent('.mb .mb-ebig')) === 'Empirical formula CH₂O, molecular C₆H₁₂O₆' && (await page.textContent('.mb .mb-eeq')).includes('n = 180 ÷ 30 = 6'), 'mole: glucose empirical example');
  await page.fill('.mb .mb-M', '60'); check((await page.textContent('.mb .mb-ebig')).includes('C₂H₄O₂'), 'mole: molar mass 60');
  await page.fill('.mb .mb-M', '100'); check((await page.textContent('.mb .mb-eeq')).includes('not a whole-number multiple'), 'mole: bad molar mass');
  await page.fill('.mb .mb-M', '');
  await page.locator('.mb .mb-er').nth(2).locator('.mb-x').click();
  await page.locator('.mb .mb-er').nth(0).locator('.mb-es').fill('Fe'); await page.locator('.mb .mb-er').nth(0).locator('.mb-ep').fill('69.9');
  await page.locator('.mb .mb-er').nth(1).locator('.mb-es').fill('O'); await page.locator('.mb .mb-er').nth(1).locator('.mb-ep').fill('30.1');
  check((await page.textContent('.mb .mb-ebig')) === 'Empirical formula Fe₂O₃' && (await page.textContent('.mb .mb-etab')).includes('× 2'), 'mole: Fe2O3 needs ×2');
  await page.click('.mb .mb-add'); await page.locator('.mb .mb-er').nth(2).locator('.mb-es').fill('Zz'); await page.locator('.mb .mb-er').nth(2).locator('.mb-ep').fill('5');
  check((await page.textContent('.mb .mb-eerr')).includes('not an element symbol'), 'mole: unknown element');
  // limiting
  check((await page.textContent('.mb .mb-lbig')) === 'O₂ runs out first' && (await page.textContent('.mb .mb-leq')).includes('4 mol H₂O') && (await page.textContent('.mb .mb-leq')).includes('1 mol H₂'), 'mole: limiting example');
  check(await page.locator('.mb .mb-lsvg circle').count() === 7 && await page.locator('.mb .mb-lsvg circle.mp').count() === 1, 'mole: limiting picture');
  await page.selectOption('.mb .mb-rx', 'ammonia'); await page.fill('.mb .mb-a', '1'); await page.fill('.mb .mb-b', '3');
  check((await page.textContent('.mb .mb-lbig')) === 'Both run out together' && (await page.textContent('.mb .mb-leq')).includes('2 mol NH₃'), 'mole: ammonia exact amounts');
  await page.fill('.mb .mb-b', 'x'); check(await page.isVisible('.mb .mb-lerr'), 'mole: bad amount');
  // new options
  const open = () => page.evaluate(() => document.querySelectorAll('.mb details').forEach((d) => (d.open = true)));
  await open();
  await page.fill('.mb .mb-f', 'H2O'); await page.selectOption('.mb .mb-u', 'kg'); await page.fill('.mb .mb-v', '1');
  check((await page.textContent('.mb .mb-ans')).startsWith('1 kg of H₂O is 55.56 mol') && (await steps()).includes('1 kg = 1000 g'), 'mole: kilograms ' + (await page.textContent('.mb .mb-ans')));
  check((await page.textContent('.mb .mb-pc')).includes('H 11.11 %') && (await page.textContent('.mb .mb-pc')).includes('O 88.89 %'), 'mole: percent composition of water');
  await page.selectOption('.mb .mb-u', 'mg'); await page.fill('.mb .mb-f', 'NaCl'); await page.fill('.mb .mb-v', '250');
  check((await steps()).includes('0.004274 mol'), 'mole: 250 mg NaCl is 0.004274 mol');
  await page.fill('.mb .mb-f', 'H2Q'); await page.selectOption('.mb .mb-u', 'g'); await page.fill('.mb .mb-v', '50'); await page.fill('.mb .mb-om', '100');
  check(!(await page.isVisible('.mb .mb-err')) && (await steps()).includes('50 ÷ 100 = 0.5 mol'), 'mole: own molar mass 100');
  await page.fill('.mb .mb-om', ''); await page.fill('.mb .mb-f', 'NaCl');
  await page.fill('.mb .mb-mn', '0.5'); await page.fill('.mb .mb-mv', '250'); await page.selectOption('.mb .mb-mu', '0.001');
  check((await page.textContent('.mb .mb-mbig')) === 'Concentration = 2 mol/L' && (await page.textContent('.mb .mb-meq')).includes('29.25 g'), 'mole: molarity 0.5 mol in 250 mL ' + (await page.textContent('.mb .mb-mbig')));
  await page.fill('.mb .mb-mv', ''); await page.selectOption('.mb .mb-mu', '1'); await page.fill('.mb .mb-mn', '0.1'); await page.fill('.mb .mb-mc', '0.5');
  check((await page.textContent('.mb .mb-mbig')) === 'Volume = 0.2 L', 'mole: volume from moles and concentration');
  await page.fill('.mb .mb-mc', '0'); check((await page.textContent('.mb .mb-merr')).includes('above zero'), 'mole: zero concentration refused');
  await page.selectOption('.mb .mb-rx', 'water'); await page.selectOption('.mb .mb-lu', 'g'); await page.fill('.mb .mb-a', '4'); await page.fill('.mb .mb-b', '16');
  check((await page.textContent('.mb .mb-lbig')) === 'O₂ runs out first' && (await page.textContent('.mb .mb-leq')).includes('18 g H₂O') && (await page.textContent('.mb .mb-leq')).includes('2 g H₂'), 'mole: limiting reactant from grams ' + (await page.textContent('.mb .mb-leq')));
  const items = page.locator('.mb .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `mole: every worked answer accepted (${right}/${n})`);
};
