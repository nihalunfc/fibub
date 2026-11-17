// T52 habitable zone calculator (usefulness upgrade)
export const path = '/science/habitable-zone-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/habitable-zone-calculator/`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.hz details').forEach((d) => (d.open = true)));
  const big = () => page.textContent('.hz .hz-big'), facts = () => page.textContent('.hz .hz-facts'), tab = () => page.textContent('.hz .hz-tab');
  check((await big()) === 'Inside the conservative habitable zone', 'habitable zone: Earth default');
  check((await facts()).includes('0.951 to 1.677 AU') && (await facts()).includes('254 K (−19 °C)'), 'habitable zone: Earth zone and temperature');
  // distance units
  await page.selectOption('.hz .hz-du', 'mkm'); await page.waitForTimeout(150);
  check((await facts()).includes('142.3 to 250.9 million km') && (await tab()).includes('Distance (million km)'), 'habitable zone: million km');
  await page.selectOption('.hz .hz-du', 'lmin'); await page.waitForTimeout(150);
  check((await facts()).includes('7.908 to 13.95 light-minutes'), 'habitable zone: light-minutes');
  await page.selectOption('.hz .hz-du', 'au');
  // temperature units
  await page.selectOption('.hz .hz-tu', 'C'); await page.waitForTimeout(150);
  check((await facts()).includes('−19 °C') && (await tab()).includes('°C'), 'habitable zone: Celsius');
  await page.selectOption('.hz .hz-tu', 'F'); await page.waitForTimeout(150);
  check((await facts()).includes('−2 °F'), 'habitable zone: Fahrenheit');
  await page.selectOption('.hz .hz-tu', 'K');
  // target temperature: 255 K -> 0.992 AU
  await page.fill('.hz .hz-tt', '255'); await page.waitForTimeout(150);
  { const t = await page.textContent('.hz .hz-tt-out'); check(t.includes('0.992 AU') && t.includes('361 days') && t.includes('inside the habitable zone'), 'habitable zone: distance for 255 K'); }
  await page.fill('.hz .hz-tt', '-5'); await page.waitForTimeout(150);
  check((await page.textContent('.hz .hz-tt-out')).includes('above 0'), 'habitable zone: bad target temperature');
  await page.fill('.hz .hz-tt', '');
  // snap buttons
  await page.click('.hz .hz-snap [data-at=mid]'); await page.waitForTimeout(200);
  check((await page.inputValue('.hz .hz-d')) === '1.314034' || (await page.inputValue('.hz .hz-d')).startsWith('1.3140'), 'habitable zone: middle of the zone') ;
  await page.click('.hz .hz-snap [data-at=out]'); await page.waitForTimeout(200);
  check((await big()) === 'Inside the conservative habitable zone', 'habitable zone: outer edge is still inside');
  await page.click('.hz .hz-snap [data-at=in]'); await page.waitForTimeout(200);
  check((await big()) === 'Inside the conservative habitable zone', 'habitable zone: inner edge is still inside');
  // Mercury and Jupiter presets
  await page.selectOption('.hz .hz-pl', 'mercury'); await page.waitForTimeout(200);
  check((await big()) === 'Too close to the star for liquid water' && (await facts()).includes('437 K (164 °C)'), 'habitable zone: Mercury preset');
  await page.selectOption('.hz .hz-pl', 'jupiter'); await page.waitForTimeout(200);
  check((await big()) === 'Too far from the star for liquid water', 'habitable zone: Jupiter preset');
  await page.fill('.hz .hz-d', ''); await page.waitForTimeout(150);
  check((await page.textContent('.hz .hz-err')).includes('distance') && await page.isHidden('.hz .hz-out'), 'habitable zone: blank distance message');
};
