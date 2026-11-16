// #T865 Roast time
export const path = '/everyday/roast-time/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/roast-time/`); await page.waitForTimeout(300);
  const R = '.rt ';
  const big = () => page.textContent(R + '.rt-big');
  const out = () => page.textContent(R + '.rt-out');
  check((await big()) === '3 h to 3 h 45 min' && (await out()).includes('74 °C (165 °F)'), `roast-time: 6 kg unstuffed turkey = 3 h to 3 h 45 min, 74 °C (${await big()})`);
  check((await out()).includes('About 3 days (63 to 79 hours)') && (await out()).includes('About 6½ hours'), 'roast-time: fridge thaw 6 kg about 3 days, cold water 6½ h');
  check((await page.textContent(R + '.rt-warn')).includes('Use a thermometer; time is only a guide'), 'roast-time: thermometer warning shown');
  await page.check(R + '[name="rt-u"][value="lb"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.rt-kg')) === '13.2' && (await big()) === '3 h to 3 h 45 min' && (await out()).includes('13.2 lb (6 kg)'), `roast-time: switching to lb converts the weight (${await page.inputValue(R + '.rt-kg')})`);
  await page.check(R + '[name="rt-u"][value="kg"]'); await page.selectOption(R + '.rt-meat', 'beef'); await page.fill(R + '.rt-kg', '2'); await page.waitForTimeout(100);
  check((await big()) === '1 h 30 min to 1 h 50 min' && (await out()).includes('71 °C (160 °F) for medium'), `roast-time: 2 kg beef medium (${await big()})`);
  // new options: carve-time plan, other weights table, huge weight
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.click(R + '.rt-reset'); await page.fill(R + '.rt-serve', '18:00'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rt-plan')) === 'Put it in the oven at 1:55 pm. It should come out between 4:55 pm and 5:40 pm, then rest 20 minutes before carving at 6:00 pm.', `roast-time: plan for 6 kg turkey at 6 pm (${await page.textContent(R + '.rt-plan')})`);
  const rowsT = await page.$$eval(R + '.rt-tab tbody tr', (trs) => trs.map((t) => t.textContent));
  check(rowsT.length === 9 && rowsT[0] === '8 lb (3.6 kg)2 h 45 min to 3 h', `roast-time: turkey table (${rowsT[0]})`);
  await page.selectOption(R + '.rt-meat', 'beef'); await page.fill(R + '.rt-kg', '2'); await page.waitForTimeout(100);
  const rowsB = await page.$$eval(R + '.rt-tab tbody tr', (trs) => trs.map((t) => t.textContent));
  check(rowsB[0] === '1 kg45 min to 55 min' && (await page.textContent(R + '.rt-plan')).startsWith('Put it in the oven at 3:50 pm.'), `roast-time: beef table and plan (${rowsB[0]} / ${await page.textContent(R + '.rt-plan')})`);
  await page.fill(R + '.rt-kg', '500'); await page.waitForTimeout(100);
  check((await big()).includes('too big') && (await page.textContent(R + '.rt-plan')) === '', `roast-time: huge weight gives a message (${await big()})`);
};
