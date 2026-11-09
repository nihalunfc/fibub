// #390 greenhouse heating and ventilation calculator
export const path = '/science/greenhouse-heating/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/greenhouse-heating/`); await page.waitForTimeout(600);
  const r = '.ghh ', t = (c) => page.textContent(r + c);
  check((await t('.gh-geo')).includes('Floor area288.0 m²') && (await t('.gh-geo')).includes('Cover area562.5 m²') && (await t('.gh-geo')).includes('Air volume1,123.2 m³'), 'greenhouse: example geometry');
  check((await t('.gh-hbig')) === 'Heater: 82.3 kW', 'greenhouse: heater size');
  { const x = await t('.gh-hf'); check(x.includes('Heat loss74.8 kW') && x.includes('63.0 kW (84 %)') && x.includes('11.8 kW (16 %)') && x.includes('280,694 BTU/h') && x.includes('260 W/m²'), `greenhouse: heat loss facts (${x})`); }
  { const x = await t('.gh-ff'); check(x.includes('192,303 kWh') && x.includes('Natural gas used21,433 m³') && !x.includes('cost'), 'greenhouse: seasonal gas'); }
  check((await t('.gh-vbig')) === '15.19 m³/s = 0.81 air changes a minute' && (await t('.gh-vf')).includes('Fans needed2') && (await t('.gh-vf')).includes('32,183 CFM'), 'greenhouse: ventilation');
  check(await page.isVisible(r + '.gh-hfig') && await page.isVisible(r + '.gh-vfig'), 'greenhouse: both charts');
  // Cover choice, fuel choice and price.
  await page.selectOption(r + '.gh-cover', 'glass'); await page.waitForTimeout(100);
  check((await page.inputValue(r + '.gh-u')) === '6' && (await t('.gh-hf')).includes('Through the cover94.5 kW'), 'greenhouse: single glass cover');
  await page.fill(r + '.gh-u', '3'); await page.waitForTimeout(400);
  check((await page.inputValue(r + '.gh-cover')) === 'custom', 'greenhouse: typed U switches to my own');
  await page.selectOption(r + '.gh-fuel', 'elec'); await page.fill(r + '.gh-price', '0.2'); await page.waitForTimeout(400);
  { const x = await t('.gh-ff'); check((await page.inputValue(r + '.gh-eff')) === '100' && x.includes('Electricity used') && x.includes('kWh') && x.includes('Fuel cost'), 'greenhouse: electricity with a price'); }
  // Altitude lowers only the air-leak part.
  const leak0 = await t('.gh-hf'); await page.fill(r + '.gh-alt', '2000'); await page.waitForTimeout(400);
  check((await t('.gh-hf')) !== leak0 && (await t('.gh-hf')).includes('Air density outside1.052'), 'greenhouse: altitude');
  // Ventilation options.
  await page.uncheck(r + '.gh-cc'); await page.waitForTimeout(150);
  check(!(await t('.gh-vf')).includes('Lost through the cover'), 'greenhouse: ventilation without cover loss');
  await page.check(r + '.gh-cc'); await page.fill(r + '.gh-sun', '30'); await page.waitForTimeout(400);
  check((await t('.gh-vbig')).startsWith('No ventilation needed'), 'greenhouse: weak sun needs no fans');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'greenhouse-heating.docx', 'greenhouse: Word report'); }
  // Bad input.
  await page.fill(r + '.gh-ridge', '2'); await page.waitForTimeout(400);
  check((await t('.gh-gerr')).includes('ridge height') && await page.isHidden(r + '.gh-hout') && await page.isHidden(r + '.gh-vout2'), 'greenhouse: ridge below eave message');
  await page.fill(r + '.gh-ridge', '4.8'); await page.fill(r + '.gh-tout', '25'); await page.waitForTimeout(400);
  check((await t('.gh-herr')).includes('inside temperature must be above'), 'greenhouse: warm outside message');
  await page.fill(r + '.gh-tout', '-10'); await page.waitForTimeout(400); await page.fill(r + '.gh-eff', '0'); await page.waitForTimeout(400);
  check((await t('.gh-ferr')).includes('efficiency'), 'greenhouse: bad efficiency message');
  await page.fill(r + '.gh-evap', '100'); await page.waitForTimeout(400);
  check((await t('.gh-verr')).includes('below 100'), 'greenhouse: crop share message');
  await page.click(r + '.gh-ex'); await page.waitForTimeout(200);
  check((await t('.gh-hbig')) === 'Heater: 82.3 kW' && (await t('.gh-vbig')).startsWith('15.19'), 'greenhouse: example button restores');
};
