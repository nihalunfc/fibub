// #498 Contrast and readability checker: example, levels, suggestions and Use, swap, picker, CVD tiles, readability.
export const path = '/science/contrast-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/contrast-checker/`); await page.waitForTimeout(600);
  const R = '.cc ', txt = (s) => page.textContent(R + s);
  const results = () => page.$$eval(R + '.cc-tab tbody tr', (r) => r.map((x) => x.cells[2].textContent).join());
  check((await txt('.cc-med')).includes('For study and teaching, not medical advice.'), 'contrast: medical note at the top');
  check((await txt('.cc-big')) === 'Contrast 4.47:1' && (await results()) === 'Fail,Pass,Fail,Fail,Pass', 'contrast: #777 on white is 4.47:1, AA normal fails');
  { const t = await txt('.cc-sugg'); check(t.includes('#767676') && t.includes('Text for AA: 4.54:1') && t.includes('#595959') && t.includes('7.00:1') && t.includes('#060606') && t.includes('No background colour of this hue reaches AAA'), 'contrast: nearest passing colours'); }
  check((await page.$eval(R + '.cc-prev', (e) => getComputedStyle(e).color)) === 'rgb(119, 119, 119)', 'contrast: preview in the chosen colours');
  { const t = await txt('.cc-cvd'); check(t.includes('Deuteranopia') && t.includes('Achromatopsia') && (await page.$$(R + '.cc-cvd > div')).length === 5, 'contrast: colour vision tiles'); }
  await page.locator(R + '.cc-sugg button').first().scrollIntoViewIfNeeded(); await page.locator(R + '.cc-sugg button').first().click(); await page.waitForTimeout(100);
  check(await page.inputValue(R + '.cc-fg') === '#767676' && (await txt('.cc-big')) === 'Contrast 4.54:1' && (await results()) === 'Pass,Pass,Fail,Pass,Pass', 'contrast: Use the AA suggestion');
  await page.fill(R + '.cc-fg', 'rgb(214, 39, 40)'); await page.fill(R + '.cc-bg', '#2ca02c'); await page.waitForTimeout(100);
  { const t = await txt('.cc-cvd'); check((await txt('.cc-big')) === 'Contrast 1.47:1' && t.includes('Deuteranopia: #85850a on #878734'), `contrast: red on green, deuteranopia tile (${t.slice(0, 80)})`); }
  await page.fill(R + '.cc-fg', '#000'); await page.fill(R + '.cc-bg', 'fff'); await page.waitForTimeout(100);
  check((await txt('.cc-big')) === 'Contrast 21.00:1' && (await txt('.cc-sugg')).includes('already pass AAA') && await page.inputValue(R + '.cc-bgp') === '#ffffff', 'contrast: black on white 21:1, short hex');
  await page.click(R + '.cc-swap'); await page.waitForTimeout(100);
  check(await page.inputValue(R + '.cc-fg') === 'fff' && await page.inputValue(R + '.cc-bg') === '#000', 'contrast: swap');
  await page.$eval(R + '.cc-fgp', (e) => { e.value = '#1f63c6'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check(await page.inputValue(R + '.cc-fg') === '#1f63c6' && (await txt('.cc-big')).startsWith('Contrast 3.'), 'contrast: colour picker');
  await page.fill(R + '.cc-fg', '#11223344'); await page.waitForTimeout(100);
  check((await txt('.cc-err')).includes('transparency') && await page.isHidden(R + '.cc-out'), 'contrast: transparent colour message');
  await page.fill(R + '.cc-fg', 'blueish'); await page.waitForTimeout(100);
  check((await txt('.cc-err')).startsWith('Text colour: "blueish" is not a colour'), 'contrast: bad colour message');
  await page.fill(R + '.cc-fg', '#777777'); await page.fill(R + '.cc-bg', 'rgb(300,0,0)'); await page.waitForTimeout(100);
  check((await txt('.cc-err')).startsWith('Background:') && (await txt('.cc-err')).includes('0 to 255'), 'contrast: bad background message');
  await page.fill(R + '.cc-bg', '#ffffff'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.cc-out') && await page.isHidden(R + '.cc-err'), 'contrast: recovers');
  // Readability.
  { const t = await txt('.cc-rf'); check(t.includes('79.0 (fairly easy)') && t.includes('Flesch-Kincaid grade4.6') && t.includes('Words48') && t.includes('Sentences5'), `contrast: readability of the example (${t})`); }
  await page.fill(R + '.cc-text', 'The cat sat on the mat.'); await page.waitForTimeout(400);
  check((await txt('.cc-rf')).includes('116.1 (very easy)'), 'contrast: short sentence reads very easy');
  await page.fill(R + '.cc-text', '   '); await page.waitForTimeout(400);
  check((await txt('.cc-rf')).includes('paste some text'), 'contrast: empty text');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cc .dl [data-f=docx]')]); check(/\.docx$/.test(d.suggestedFilename()), 'contrast: Word report'); }
};
