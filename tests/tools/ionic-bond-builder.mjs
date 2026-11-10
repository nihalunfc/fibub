// #1295 Ionic bond builder
export const path = '/learn/ionic-bond-builder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/ionic-bond-builder/`); await page.waitForSelector('.ib .ib-fig .ib-sym');
  const R = '.ib ', txt = (s) => page.textContent(R + s);
  const rings = () => page.locator(R + '.ib-fig .ib-ring').count(), full = () => page.locator(R + '.ib-fig .ib-full').count();
  check((await txt('.ib-big')) === '1 Mg and 2 Cl: 2 electrons to move' && (await rings()) === 3 && (await full()) === 0, 'ionic: Mg and 2 Cl');
  check((await page.locator(R + '.ib-fig .ib-dot').count()) === 14 && (await page.locator(R + '.ib-fig .ib-x').count()) === 4, 'ionic: 14 dots and 2 crosses (4 strokes)');
  await page.click(R + '.ib-one');
  check((await txt('.ib-big')) === '1 of 2 electrons moved' && (await full()) === 1 && (await page.locator(R + '.ib-fig .ib-move').count()) === 1, 'ionic: one electron moved, one Cl full');
  await page.click(R + '.ib-one');
  check((await txt('.ib-big')) === 'MgCl₂: magnesium chloride' && (await full()) === 3 && await page.isDisabled(R + '.ib-one'), 'ionic: MgCl₂ made');
  check((await txt('.ib-fig')).includes('(2, 8)') && (await txt('.ib-fig')).includes('(2, 8, 8)') && (await txt('.ib-fig')).includes('²⁺') && (await txt('.ib-fig')).includes('⁻'), 'ionic: ion shells and charges');
  check((await txt('.ib-facts')).includes('Mg²⁺ and 2Cl⁻') && (await txt('.ib-eq')) === 'Mg + 2Cl → Mg²⁺ + 2Cl⁻ → MgCl₂', 'ionic: facts and equation');
  await page.click(R + '.ib-reset'); check((await full()) === 0 && await page.isEnabled(R + '.ib-one'), 'ionic: start again');
  await page.selectOption(R + '.ib-m', 'Al'); await page.selectOption(R + '.ib-n', 'O');
  check((await txt('.ib-big')) === '2 Al and 3 O: 6 electrons to move' && (await rings()) === 5, 'ionic: Al₂O₃ needs 5 atoms');
  await page.click(R + '.ib-all');
  check((await txt('.ib-big')) === 'Al₂O₃: aluminium oxide' && (await full()) === 5 && (await txt('.ib-steps')).includes('2 × 3 = 3 × 2 = 6'), 'ionic: Al₂O₃');
  await page.selectOption(R + '.ib-m', 'Na'); await page.selectOption(R + '.ib-n', 'Cl'); await page.click(R + '.ib-all');
  check((await txt('.ib-big')) === 'NaCl: sodium chloride', 'ionic: NaCl');
  await page.selectOption(R + '.ib-m', 'Ca'); await page.selectOption(R + '.ib-n', 'N'); await page.click(R + '.ib-all');
  check((await txt('.ib-big')) === 'Ca₃N₂: calcium nitride' && (await rings()) === 5, 'ionic: Ca₃N₂');
  const items = page.locator('.ib .cq-item');
  check((await items.count()) === 3, 'ionic: three questions');
  for (let i = 0; i < 3; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `ionic: quiz ${i + 1} (${ans})`);
  }
  // Typed with ordinary digits also counts.
  { const it = items.nth(0); const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1].replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 8320));
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click(); check((await it.locator('.cq-res').textContent()) === 'Right!', `ionic: plain digits (${ans})`); }
};
