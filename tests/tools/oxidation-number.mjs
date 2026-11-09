// #1088 Oxidation number finder
export const path = '/learn/oxidation-number/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/oxidation-number/`); await page.waitForSelector('.ox .ox-el');
  const show = () => page.textContent('.ox .ox-show'), tab = () => page.textContent('.ox .ox-tab'), sum = () => page.textContent('.ox .ox-sum');
  check((await show()) === '+1K₂+6Cr₂−2O₇' && (await sum()).includes('2 × (+1) + 2 × (+6) + 7 × (−2) = 0'), 'oxidation: K2Cr2O7 example ' + (await show()));
  check((await tab()).includes('Group 1 metals') && (await page.locator('.ox .ox-rl li.used').count()) >= 3, 'oxidation: rules used');
  const chip = async (f) => { const b = page.locator(`.ox .ox-chip[data-f="${f}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); };
  await chip('H2O2'); check((await show()).includes('−1O₂') && (await tab()).includes('peroxide'), 'oxidation: peroxide');
  await chip('NaH'); check((await show()) === '+1Na−1H' && (await tab()).includes('metal hydrides'), 'oxidation: sodium hydride');
  await chip('Fe3O4'); check((await show()).includes('+8/3Fe₃') && (await page.textContent('.ox .ox-note')).includes('average'), 'oxidation: Fe3O4 average');
  await chip('S2O3^2-'); check((await show()) === '+2S₂−2O₃2−' && (await sum()).includes('charge of the ion'), 'oxidation: thiosulfate ion');
  await page.fill('.ox .ox-f', 'Fe3+'); check((await show()) === '+3Fe3+', 'oxidation: Fe3+ read as an ion');
  await page.fill('.ox .ox-f', 'ICl'); check((await page.textContent('.ox .ox-note')).includes('estimate'), 'oxidation: estimate note');
  await page.fill('.ox .ox-f', 'Xq2'); check(await page.isVisible('.ox .ox-err'), 'oxidation: bad formula message');
  // redox
  const fin = () => page.textContent('.ox .ox-final');
  check((await fin()) === '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O' && (await page.textContent('.ox .ox-check')).includes('charge +17'), 'oxidation: permanganate and iron(II) worked example');
  const halves = await page.textContent('.ox .ox-halves');
  check(halves.includes('Mn goes from +7 to +2 (5 electrons gained)') && halves.includes('Multiply by 5') && halves.includes('MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O'), 'oxidation: half-reaction steps');
  await page.selectOption('.ox .ox-o', 'I-IO3'); await page.selectOption('.ox .ox-r', 'MnO4-MnO2'); await page.click('.ox .ox-med [data-m=base]');
  check((await fin()) === 'I⁻ + 2MnO₄⁻ + H₂O → IO₃⁻ + 2MnO₂ + 2OH⁻' && (await page.textContent('.ox .ox-halves')).includes('In base, add'), 'oxidation: basic medium');
  await page.click('.ox .ox-med [data-m=acid]'); await page.selectOption('.ox .ox-o', 'Zn-Zn2'); await page.selectOption('.ox .ox-r', 'NO3-NO');
  check((await fin()) === '3Zn + 2NO₃⁻ + 8H⁺ → 3Zn²⁺ + 2NO + 4H₂O', 'oxidation: zinc and nitrate');
  const items = page.locator('.ox .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').scrollIntoViewIfNeeded(); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 5 && right === n, `oxidation: every worked answer accepted (${right}/${n})`);
};
