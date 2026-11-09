// #484 energy needs
export const path = '/science/energy-needs/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/energy-needs/`); await page.waitForTimeout(500);
  const R = '.en ', txt = (c) => page.textContent(R + c);
  check((await txt('.en-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'energy: medical note shown');
  check((await txt('.en-big')) === 'About 2,085 to 2,198 kcal a day in total', `energy: example range (${await txt('.en-big')})`);
  { const t = await txt('.en-tab'); check(['1,345', '2,085', '1,418', '2,198', '1,408', '2,183', '1,353', '2,097'].every((x) => t.includes(x)), 'energy: example table, all four equations'); }
  check((await txt('.en-gapout')).includes('about 1,585 kcal') && (await txt('.en-gapout')).includes('roughly 0.45 kg'), `energy: weight change (${await txt('.en-gapout')})`);
  await page.selectOption(R + '.en-sex', 'male'); await page.fill(R + '.en-age', '40'); await page.fill(R + '.en-w', '80'); await page.fill(R + '.en-h', '180'); await page.fill(R + '.en-bf', '20'); await page.waitForTimeout(100);
  { const t = await txt('.en-tab'); check(t.includes('1,730') && t.includes('1,797') && t.includes('1,752') && t.includes('2,682'), 'energy: male case'); }
  await page.selectOption(R + '.en-act', '1.2'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.en-f')) === '1.2' && (await txt('.en-tab')).includes('2,076'), 'energy: example activity level fills the factor');
  await page.fill(R + '.en-f', '1.4'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.en-act')) === '' && (await txt('.en-tab')).includes('2,422'), 'energy: own factor');
  await page.selectOption(R + '.en-u', 'kJ'); await page.waitForTimeout(100);
  check((await txt('.en-tab')).includes('7,238') && (await txt('.en-tab')).includes('Resting (kJ)'), 'energy: kJ');
  await page.selectOption(R + '.en-u', 'kcal'); await page.fill(R + '.en-bf', ''); await page.waitForTimeout(100);
  check((await txt('.en-tab')).includes('needs body fat'), 'energy: Katch-McArdle without body fat');
  await page.selectOption(R + '.en-wu', 'lb'); await page.selectOption(R + '.en-hu', 'in'); await page.fill(R + '.en-w', '176.37'); await page.fill(R + '.en-h', '70.866'); await page.waitForTimeout(100);
  check((await txt('.en-tab')).includes('1,730'), 'energy: pounds and inches');
  await page.fill(R + '.en-gap', '-1500'); await page.waitForTimeout(100);
  check((await txt('.en-gapout')).includes('below the resting energy'), 'energy: warns below resting energy');
  await page.fill(R + '.en-gap', '300'); await page.waitForTimeout(100);
  check((await txt('.en-gapout')).includes('more per week'), 'energy: surplus');
  await page.fill(R + '.en-gap', 'x'); await page.waitForTimeout(100);
  check((await txt('.en-gapout')).includes('Type a gap'), 'energy: bad gap message');
  await page.fill(R + '.en-f', '3'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.en-err') && (await txt('.en-err')).includes('activity factor') && await page.isHidden(R + '.en-res'), 'energy: bad factor message');
  await page.fill(R + '.en-f', '1.4'); await page.fill(R + '.en-age', '0'); await page.waitForTimeout(100);
  check((await txt('.en-err')).includes('Age'), 'energy: bad age message');
  await page.fill(R + '.en-age', '40'); await page.fill(R + '.en-bf', '90'); await page.waitForTimeout(100);
  check((await txt('.en-err')).includes('Body fat'), 'energy: bad body fat message');
  await page.fill(R + '.en-bf', '20'); await page.waitForTimeout(100);
  await page.locator(R + '.dl').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="pdf"]')]); const f = OUT + 'energy.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'energy: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f="docx"]')]); const f = OUT + 'energy.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'energy: Word download'); }
};
