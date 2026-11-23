// #T1079 Ergometer Link. No Bluetooth hardware in CI: the demo rower runs through the same FTMS parser.
export const path = '/everyday/ergometer-link/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/ergometer-link/`); await page.waitForTimeout(300);
  const R = '.el ', t = (s) => page.textContent(R + s);
  check((await t('.el-w')) === '–', 'ergometer: nothing shown before connecting');
  await page.click(R + '.el-demo');
  await page.waitForTimeout(2300);
  check(/\d+ W/.test(await t('.el-w')) && (await t('.el-cad')).includes('26 strokes/min'), `ergometer: demo rower shows power and 26 strokes/min (${await t('.el-w')})`);
  check(/^\d:\d\d$/.test((await t('.el-pace')).trim()) && /bpm/.test(await t('.el-bpm')), 'ergometer: pace per 500 m and heart rate shown');
  check(/kJ/.test(await t('.el-kj')) && /W/.test(await t('.el-avgw')), 'ergometer: session work and average power add up');
  await page.click(R + '.el-off');
  check((await t('.el-status')).includes('Disconnected'), 'ergometer: Disconnect all stops the demo');
};
