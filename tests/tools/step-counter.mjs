// #T1078 Step Counter. A made-up 2-steps-a-second walk is sent as devicemotion events.
export const path = '/everyday/step-counter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/step-counter/`); await page.waitForTimeout(300);
  const R = '.sc ', t = (s) => page.textContent(R + s);
  await page.click(R + '.sc-start');
  await page.waitForTimeout(1700);
  check((await t('.sc-status')).includes('No motion data'), 'step counter: no sensor gives a plain message');
  await page.fill(R + '.sc-h', '175'); await page.fill(R + '.sc-goal', '100');
  // Events carry a fake time base so the walk is exact even if the page is slow: 200 samples, 20 ms apart, 4 s at 2 Hz.
  await page.evaluate(async () => {
    for (let i = 0; i < 200; i++) {
      const s = 9.81 + 3 * Math.sin(2 * Math.PI * 2 * (i * 0.02));
      window.dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x: 0, y: s, z: 0 }, interval: 20 }));
      await new Promise((r) => setTimeout(r, 20));
    }
  });
  const n = parseInt((await t('.sc-n')).replace(/,/g, ''), 10);
  check(n >= 5 && n <= 9, `step counter: a 4 s walk at 2 steps a second counts about 8 steps (${n})`);
  check((await t('.sc-len')).includes('72 cm') && (await t('.sc-goaltext')).includes('100-step goal'), 'step counter: 175 cm gives a 72 cm step; goal bar follows the goal');
  await page.click(R + '.sc-reset');
  check((await t('.sc-n')).trim() === '0', 'step counter: reset goes back to 0');
};
