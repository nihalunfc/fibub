// #T1056 Touch Test. Headless Chromium has no touch screen: touches are synthetic PointerEvents (pointerType "touch") on the canvas.
export const path = '/everyday/touch-test/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/touch-test/`); await page.waitForTimeout(300);
  const R = '.tt ', t = (s) => page.textContent(R + s);
  const fire = (type, id, fx, fy, extra = {}) => page.evaluate(([type, id, fx, fy, extra]) => {
    const cv = document.querySelector('.tt .tt-cv'), r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: extra.pen ? 'pen' : 'touch', clientX: r.left + r.width * fx, clientY: r.top + r.height * fy, pressure: extra.pressure ?? 0.5, width: extra.w ?? 20, height: extra.h ?? 20, tiltX: extra.tilt ?? 0, tiltY: 0, bubbles: true, isPrimary: id === 1 }));
  }, [type, id, fx, fy, extra]);
  check((await t('.tt-max')) === '0' && /touch|no touch|not reported/.test(await t('.tt-mtp')), `touch-test: starts at 0 and shows what the device supports (${await t('.tt-mtp')})`);
  await fire('pointerdown', 1, 0.2, 0.3); await fire('pointerdown', 2, 0.7, 0.6); await fire('pointerdown', 3, 0.5, 0.9);
  check((await t('.tt-now')) === '3' && (await t('.tt-max')) === '3', 'touch-test: three fingers down counts 3 now and 3 at most');
  check((await t('.tt-pr')) === '0.50' && (await t('.tt-size')).startsWith('20 × 20') && (await t('.tt-type')) === 'touch', `touch-test: pressure, size and type shown (${await t('.tt-pr')}, ${await t('.tt-size')})`);
  await fire('pointerup', 1, 0.2, 0.3); await fire('pointerup', 2, 0.7, 0.6); await fire('pointerup', 3, 0.5, 0.9);
  check((await t('.tt-now')) === '0' && (await t('.tt-max')) === '3', 'touch-test: lifting fingers keeps the maximum');
  await page.click(R + '.tt-mode[data-mode="grid"]');
  const [c, r] = (await t('.tt-grid')).split('×').map((n) => +n);
  await page.click(R + '.tt-clear');
  for (const [i, [x, y]] of [[0.05, 0.05], [0.55, 0.05], [0.05, 0.55], [0.95, 0.95]].entries()) { await fire('pointerdown', 10 + i, x, y); await fire('pointerup', 10 + i, x, y); }
  const want = Math.round((4 / (c * r)) * 1000) / 10;
  check(c * r >= 48 && Math.abs(parseFloat(await t('.tt-cov')) - want) < 0.11, `touch-test: 4 touched squares of ${c}x${r} read ${want}% (${await t('.tt-cov')})`);
  await fire('pointerdown', 20, 0.3, 0.3, { pen: true, tilt: 30, pressure: 0.8 });
  check((await t('.tt-type')) === 'stylus' && (await t('.tt-tilt')).startsWith('30') && (await t('.tt-pr')) === '0.80', 'touch-test: a stylus shows pressure and tilt');
};
