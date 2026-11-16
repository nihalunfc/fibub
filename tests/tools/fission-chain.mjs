// #L341 Fission chain reaction
export const path = '/learn/fission-chain/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/fission-chain/`); await page.waitForTimeout(1200);
  const o = page.locator('.fc .fc-out');
  const set = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'input'); };
  await page.click('.fc .fc-play');
  await set('.fc .fc-e', 100);
  check(+(await o.getAttribute('data-kest')) > 1.05, 'fission-chain: 100 % U-235 has an estimated k above 1');
  await page.click('.fc .fc-fire'); await page.click('.fc .fc-next');
  check((await o.getAttribute('data-gen')) === '1', 'fission-chain: Next generation moves to generation 1');
  await page.click('.fc .fc-run');
  check(+(await o.getAttribute('data-gen')) > 3, 'fission-chain: a rich chain runs for several generations');
  await set('.fc .fc-e', 10);
  check(+(await o.getAttribute('data-kest')) < 0.95, 'fission-chain: 10 % U-235 has k below 1');
  await set('.fc .fc-e', 100); await set('.fc .fc-r', 6);
  const withRods = +(await o.getAttribute('data-kest'));
  await set('.fc .fc-r', 0);
  check(withRods < +(await o.getAttribute('data-kest')) - 0.2, 'fission-chain: control rods lower k');
  await page.check('.fc .fc-m'); await set('.fc .fc-e', 20);
  check(Math.abs(+(await o.getAttribute('data-kest')) - 1) < 0.15, 'fission-chain: moderator brings 20 % U-235 to about critical');
  { const a = await page.getAttribute('.fc .lq-item', 'data-ans'); await page.fill('.fc .lq-in', a); await page.click('.fc .lq-check');
    check((await page.textContent('.fc .lq-fb')) === 'Right.', 'fission-chain: quiz accepts the right answer'); }
};
