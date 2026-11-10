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
};
