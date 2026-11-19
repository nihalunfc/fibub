// #T1058 Gamepad Test. No controller headless: navigator.getGamepads is replaced (missing first, then a fake standard pad).
export const path = '/everyday/gamepad-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/gamepad-test/`); await page.waitForTimeout(300);
  const R = '.gp ', t = (s) => page.textContent(R + s);
  check((await t('.gp-status')).includes('Press any button'), 'gamepad-test: with no controller it asks for a button press');
  await page.evaluate(() => { navigator.getGamepads = undefined; }); await page.waitForTimeout(150);
  check((await t('.gp-status')).includes('does not support'), 'gamepad-test: a browser without the Gamepad API gets a clear sentence');
  await page.evaluate(() => {
    window.__rumble = null;
    const btn = (p, v = p ? 1 : 0) => ({ pressed: p, touched: p, value: v });
    const pad = { index: 0, id: 'Test Pad (STANDARD GAMEPAD)', connected: true, mapping: 'standard', timestamp: 1,
      axes: [0.5, -0.5, 0.15, 0], buttons: Array.from({ length: 17 }, (_, i) => (i === 0 ? btn(true) : i === 7 ? btn(false, 0.5) : btn(false))),
      vibrationActuator: { playEffect: async (type, o) => { window.__rumble = [type, o.duration]; } } };
    navigator.getGamepads = () => [pad];
  });
  await page.waitForTimeout(200);
  check((await t('.gp-status')).includes('1 controller') && (await t('.gp-id')).includes('Test Pad') && (await t('.gp-meta')).includes('standard'), 'gamepad-test: shows the pad name and standard layout');
  const on = await page.$$eval(R + '.gp-bt.on span', (e) => e.map((x) => x.textContent));
  check(on.join() === 'A' && (await page.textContent(R + '.gp-bt:nth-child(8) b')) === '0.50', `gamepad-test: A lit, right trigger reads 0.50 (${on})`);
  check((await t('.gp-v')).includes('x 0.50') && (await t('.dv-table')).includes('0.150'), 'gamepad-test: stick position and axes table read the stubbed values');
  await page.click(R + '.gp-drift'); await page.waitForTimeout(1350);
  const d = await page.$$eval(R + '.gp-d', (e) => e.map((x) => x.textContent));
  check(d[0].includes('moving') === false && d[1].startsWith('Drift'), `gamepad-test: drift check flags the right stick resting at 15% (${d.join(' | ')})`);
  await page.click(R + '.gp-rum');
  check((await page.evaluate(() => window.__rumble))?.[0] === 'dual-rumble', 'gamepad-test: rumble button calls dual-rumble');
};
