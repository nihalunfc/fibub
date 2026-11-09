// #622 resistor colour code
export const path = '/science/resistor-colour-code/';
export default async ({ page, check, BASE }) => {
  const R = '.rcc ';
  await page.goto(`${BASE}/science/resistor-colour-code/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c);
  check((await t('.rc-big1')) === '4.7 kΩ ±5 %' && (await t('.rc-facts1')).includes('4.465 kΩ to 4.935 kΩ') && (await t('.rc-facts1')).includes('Yes, in E6'), `resistor: example bands (${await t('.rc-big1')})`);
  await page.selectOption(R + '.rc-b2', 'orange'); await page.selectOption(R + '.rc-b3', 'brown'); await page.waitForTimeout(100);
  check((await t('.rc-big1')) === '47 kΩ ±1 %', 'resistor: change multiplier and tolerance');
  await page.selectOption(R + '.rc-n', '6'); await page.waitForTimeout(100);
  check((await t('.rc-big1')) === '1 kΩ ±1 %' && (await t('.rc-facts1')).includes('100 ppm/K'), `resistor: 6-band default (${await t('.rc-big1')})`);
  await page.selectOption(R + '.rc-b1', 'red'); await page.waitForTimeout(100);
  check((await t('.rc-big1')) === '1.2 kΩ ±1 %' && (await t('.rc-facts1')).includes('Not in any E series') === false, 'resistor: 6-band 1.2 kΩ is E12');
  await page.selectOption(R + '.rc-n', '3'); await page.waitForTimeout(100);
  check((await t('.rc-big1')) === '1 kΩ ±20 %', 'resistor: 3-band');
  await page.selectOption(R + '.rc-n', '5'); await page.selectOption(R + '.rc-b1', 'violet'); await page.selectOption(R + '.rc-b2', 'black'); await page.waitForTimeout(100);
  check((await t('.rc-facts1')).includes('Not in any E series'), 'resistor: non-standard value flagged');
  check((await t('.rc-big2')) === 'yellow, violet, red, gold' && (await t('.rc-near')).includes('4.64 kΩ') && (await t('.rc-near')).includes('exact'), 'resistor: 4.7k to bands and nearest table');
  await page.fill(R + '.rc-val', '5000'); await page.waitForTimeout(100);
  { const n = await t('.rc-near'); check(n.includes('E24 (±5 %)4.7 kΩ5.1 kΩ5.1 kΩ+2 %') && n.includes('4.99 kΩ') && n.includes('−0.2 %'), 'resistor: nearest values to 5 kΩ'); }
  await page.selectOption(R + '.rc-n2', '5'); await page.selectOption(R + '.rc-tol', 'brown'); await page.waitForTimeout(100);
  check((await t('.rc-big2')) === 'green, black, black, brown, brown', 'resistor: 5 kΩ 5-band');
  await page.selectOption(R + '.rc-n2', '6'); await page.selectOption(R + '.rc-tc', 'red'); await page.fill(R + '.rc-val', '4k7'); await page.waitForTimeout(100);
  check((await t('.rc-big2')) === 'yellow, violet, black, brown, brown, red', 'resistor: 4k7 6-band with 50 ppm/K');
  await page.fill(R + '.rc-val', '12345'); await page.waitForTimeout(100);
  check((await t('.rc-facts2')).includes('rounded from 12.345 kΩ'), 'resistor: rounding noted');
  await page.selectOption(R + '.rc-tol', 'none'); await page.waitForTimeout(100);
  check((await t('.rc-err2')).includes('always have a tolerance band'), 'resistor: no tolerance band on a 6-band part');
  await page.fill(R + '.rc-val', 'abc'); await page.waitForTimeout(100);
  check((await t('.rc-err2')).startsWith('Type a resistance'), 'resistor: bad value message');
  check((await t('.rc-big3')) === 'R1 = 2.4 kΩ, R2 = 910 Ω: 3.299 V (−0.0275 %)' && (await t('.rc-div')).includes('3.065 to 3.544') && (await t('.rc-div')).includes('3.63 mA'), `resistor: example divider (${await t('.rc-big3')})`);
  await page.fill(R + '.rc-load', '10k'); await page.waitForTimeout(100);
  check((await t('.rc-big3')).startsWith('R1 = 2.2 kΩ, R2 = 910 Ω'), 'resistor: divider with a load');
  await page.selectOption(R + '.rc-ser', '96'); await page.fill(R + '.rc-load', ''); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.rc-dtol')) === '1' && (await t('.rc-div')).split('kΩ').length > 3, 'resistor: E96 sets 1 % tolerance');
  await page.fill(R + '.rc-vout', '15'); await page.waitForTimeout(100);
  check((await t('.rc-err3')).includes('below the input'), 'resistor: output above input message');
  await page.fill(R + '.rc-vout', '5'); await page.fill(R + '.rc-tmax', '10'); await page.waitForTimeout(100);
  check((await t('.rc-err3')).includes('smallest and largest'), 'resistor: bad range message');
  await page.fill(R + '.rc-tmax', '100k'); await page.fill(R + '.rc-vin', '10'); await page.waitForTimeout(100);
  check((await t('.rc-big3')).includes(': 5 V (+0 %)') || (await t('.rc-big3')).includes('5 V (exact)') || (await t('.rc-div')).includes('exact'), `resistor: exact 2:1 (${await t('.rc-big3')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'resistor: Word download'); }
};
