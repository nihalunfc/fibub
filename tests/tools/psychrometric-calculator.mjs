// T34 psychrometrics (usefulness upgrade)
export const path = '/science/psychrometric-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/psychrometric-calculator/`); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelectorAll('.ps details').forEach((d) => (d.open = true)));
  const big = () => page.textContent('.ps .ps-big'), facts = () => page.textContent('.ps .ps-facts'), proc = () => page.textContent('.ps .ps-proc');
  const wait = () => page.waitForTimeout(450);
  check((await big()) === '50 % RH, dew point 13.9 °C' && (await facts()).includes('101.33 kPa') && (await facts()).includes('9.881 g/kg'), 'psychrometrics: 25 C 50 % RH');
  // pressure units
  await page.selectOption('.ps .ps-pu', 'atm'); await wait();
  check((await facts()).includes('1 atm'), 'psychrometrics: atm');
  await page.selectOption('.ps .ps-pu', 'psi'); await wait();
  check((await facts()).includes('14.696 psi'), 'psychrometrics: psi');
  await page.selectOption('.ps .ps-pu', 'inHg'); await wait();
  check((await facts()).includes('29.921 inHg'), 'psychrometrics: inHg');
  await page.selectOption('.ps .ps-pu', 'kPa'); await wait();
  // altitude in feet: 1000 ft is 97.717 kPa
  await page.selectOption('.ps .ps-zu', 'ft'); await page.fill('.ps .ps-z', '1000'); await wait();
  check((await facts()).includes('97.717 kPa') && (await page.textContent('.ps .ps-zl')) === 'Altitude (ft)', 'psychrometrics: altitude in feet');
  await page.fill('.ps .ps-z', '0'); await wait();
  // cooling to 10 C with airflow
  await page.fill('.ps .ps-t2', '10'); await page.fill('.ps .ps-flow', '1000'); await wait();
  { const t = await proc(); check(t.includes('10 °C, 100 % RH') && t.includes('Heat removed') && t.includes('20.94 kJ per kg') && t.includes('2.25 g per kg') && t.includes('6.780 kW') && t.includes('2.62 litres of water per hour'), 'psychrometrics: cooling to 10 C, water and load'); }
  await page.fill('.ps .ps-t2', '35'); await wait();
  { const t = await proc(); check(t.includes('Heat added') && t.includes('10.24 kJ per kg') && t.includes('28.2 % RH') && t.includes('none'), 'psychrometrics: heating to 35 C'); }
  await page.fill('.ps .ps-t2', '0'); await wait();
  check((await proc()).includes('frost'), 'psychrometrics: frost message');
  await page.fill('.ps .ps-t2', ''); await page.fill('.ps .ps-flow', ''); await wait();
  check(await page.isHidden('.ps .ps-procw'), 'psychrometrics: no process block when blank');
  // surface condensation check
  await page.fill('.ps .ps-surf', '10'); await wait();
  check((await proc()).includes('water condenses on it') && (await proc()).includes('3.86 °C below the dew point'), 'psychrometrics: cold window condenses');
  await page.fill('.ps .ps-surf', '20'); await wait();
  check((await proc()).includes('stays dry') && (await proc()).includes('6.14 °C above'), 'psychrometrics: warm surface stays dry');
  await page.fill('.ps .ps-surf', 'abc'); await wait();
  check((await proc()).includes('surface temperature as a number'), 'psychrometrics: bad surface temperature message');
  await page.fill('.ps .ps-surf', ''); await page.fill('.ps .ps-flow', '0'); await page.fill('.ps .ps-t2', '10'); await wait();
  check((await proc()).includes('above zero'), 'psychrometrics: zero airflow message');
};
