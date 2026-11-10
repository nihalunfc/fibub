// #1298 Esterification and ester names
export const path = '/learn/esterification/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/esterification/`); await page.waitForSelector('.es .es-box');
  const R = '.es ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.es-box')).length === 2 && (await txt('.es-big')) === 'Ethanoic acid + ethanol', 'ester: acid and alcohol with OH and H boxed');
  await page.click(R + '.es-join'); await page.waitForTimeout(80);
  check((await txt('.es-big')) === 'Ethyl ethanoate' && (await txt('.es-out')).includes('CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O') && (await txt('.es-out')).includes('C₄H₈O₂, molar mass 88 g/mol'), 'ester: ethyl ethanoate 88');
  check((await txt('.es-out')).includes('nail-polish') && (await page.$$(R + '.es-new')).length === 1, 'ester: smell and new bond');
  await page.click(R + '.es-split'); await page.waitForTimeout(80);
  check((await txt('.es-big')).startsWith('Split: sodium ethanoate') && (await txt('.es-out')).includes('CH₃COONa') && (await txt('.es-out')).includes('saponification'), 'ester: split with NaOH');
  await page.click(R + '.es-join'); await page.waitForTimeout(80);
  check((await txt('.es-big')) === 'Ethanoic acid + ethanol', 'ester: start again');
  await page.selectOption(R + '.es-r', 'pentanol'); await page.click(R + '.es-join'); await page.waitForTimeout(80);
  check((await txt('.es-big')) === 'Pentyl ethanoate' && (await txt('.es-out')).includes('banana') && (await txt('.es-out')).includes('130 g/mol'), 'ester: pentyl ethanoate banana');
  await page.selectOption(R + '.es-a', 'benzoic'); await page.selectOption(R + '.es-r', 'methanol'); await page.click(R + '.es-join'); await page.waitForTimeout(80);
  check((await txt('.es-big')) === 'Methyl benzoate' && (await txt('.es-out')).includes('C₈H₈O₂, molar mass 136'), 'ester: methyl benzoate');
  await page.selectOption(R + '.es-a', 'methanoic'); await page.click(R + '.es-join'); await page.waitForTimeout(80);
  check((await txt('.es-out')).includes('HCOOH + CH₃OH ⇌ HCOOCH₃ + H₂O'), 'ester: methyl methanoate');
  check(await page.isHidden(R + '.es-eq'), 'ester: equilibrium hidden at class 10');
  await page.click(R + '.es-lvl button[data-l="12"]'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.es-eq') && (await txt('.es-eqout')).includes('x = 0.6667 mol') && (await txt('.es-eqout')).includes('66.7 %') && (await txt('.es-out')).includes('¹⁸O'), 'ester: 1 : 1 gives 2/3 mol');
  await page.fill(R + '.es-nr', '3'); await page.waitForTimeout(80);
  check((await txt('.es-eqout')).includes('x = 0.9028 mol'), 'ester: 1 : 3 gives 0.9028 mol');
  await page.fill(R + '.es-nw', '2'); await page.waitForTimeout(80);
  check(!(await txt('.es-eqout')).includes('x = 0.9028'), 'ester: water at the start lowers it');
  await page.fill(R + '.es-k', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.es-err'), 'ester: K = 0 rejected');
  await page.fill(R + '.es-k', '4'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.es-err'), 'ester: message clears');
  const items = page.locator('.es .cq-item'); const n = await items.count(); let right = 0;
  for (let i = 0; i < n; i++) {
    const it = items.nth(i); await it.locator('.cq-show').scrollIntoViewIfNeeded(); await it.locator('.cq-show').click();
    const ans = (await it.locator('.cq-work').textContent()).match(/Answer: (.+)\.$/)[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    if ((await it.locator('.cq-res').textContent()) === 'Right!') right++;
  }
  check(n === 4 && right === n, `ester: every worked answer accepted (${right}/${n})`);
};
