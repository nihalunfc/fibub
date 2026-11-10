// #1298 Esterification
export const path = '/learn/esterification/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/esterification/`); await page.waitForSelector('.es .es-fig text');
  const R = '.es ', txt = (s) => page.textContent(R + s);
  check((await txt('.es-big')) === 'Press React.' && (await txt('.es-eq')).startsWith('CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O'), 'ester: equation');
  await page.click(R + '.es-go');
  check((await txt('.es-big')) === 'ethyl ethanoate: smells sweet, like nail-polish remover or pear drops' && (await txt('.es-fig')).includes('H₂O (water) leaves'), 'ester: react ethanoic acid + ethanol');
  check((await txt('.es-facts')).includes('CH₃COOC₂H₅ (C₄H₈O₂)') && (await txt('.es-facts')).includes('88.11 g/mol') && (await txt('.es-facts')).includes('(ethyl)') && (await txt('.es-facts')).includes('(ethanoate)'), 'ester: facts');
  const st = await txt('.es-steps');
  check(st.includes('the alcohol runs out first') && st.includes('= 8.80 g of ethyl ethanoate') && st.includes('= 5.87 g, 67%'), `ester: amounts (${st})`);
  await page.click(R + '.es-back'); check((await txt('.es-big')) === 'Press React.', 'ester: back');
  await page.selectOption(R + '.es-b', '5'); await page.click(R + '.es-go');
  check((await txt('.es-big')) === 'pentyl ethanoate: smells banana' && (await page.inputValue(R + '.es-gb')) === '8.8', 'ester: banana; masses reset to 0.1 mol');
  await page.selectOption(R + '.es-a', '4'); await page.selectOption(R + '.es-b', '1'); await page.click(R + '.es-go');
  check((await txt('.es-big')).startsWith('methyl butanoate') && (await txt('.es-eq')).startsWith('C₃H₇COOH + CH₃OH ⇌ C₃H₇COOCH₃'), 'ester: methyl butanoate');
  await page.selectOption(R + '.es-a', '1'); await page.selectOption(R + '.es-b', '2'); await page.click(R + '.es-go');
  check((await txt('.es-big')).startsWith('ethyl methanoate') && (await txt('.es-eq')).startsWith('HCOOH + C₂H₅OH ⇌ HCOOC₂H₅'), 'ester: ethyl methanoate');
  await page.fill(R + '.es-gb', '13.8'); check((await txt('.es-steps')).includes('the acid runs out first'), 'ester: excess alcohol');
  await page.fill(R + '.es-gb', '0'); check(await page.isVisible(R + '.es-err'), 'ester: bad mass');
  const items = page.locator('.es .cq-item');
  check((await items.count()) === 3, 'ester: three questions');
  for (let i = 0; i < 3; i++) {
    const it = items.nth(i); await it.locator('.cq-show').click();
    const ans = /Answer: (.+)\.$/.exec(await it.locator('.cq-work').textContent())[1];
    await it.locator('.cq-in').fill(ans); await it.locator('.cq-check').click();
    check((await it.locator('.cq-res').textContent()) === 'Right!', `ester: quiz ${i + 1} (${ans})`);
  }
};
