// #T951 Wi-Fi Finder
import { mockSpeed } from '../lib/speed-mock.mjs';
export const path = '/everyday/wifi-spot-finder/';
export default async ({ page, check, BASE }) => {
  await mockSpeed(page);
  await page.goto(`${BASE}/everyday/wifi-spot-finder/`); await page.waitForTimeout(300);
  check(await page.isHidden('.wsf .wsf-out'), 'wifi-spot-finder: no table before a test');
  await page.click('.wsf .wsf-sample');
  check(await page.$$eval('.wsf .wsf-table tbody tr', (r) => r.length) === 5, 'wifi-spot-finder: sample has five spots');
  check(/Best spot: Living room/.test(await page.textContent('.wsf .wsf-best')) && /Weakest: Basement/.test(await page.textContent('.wsf .wsf-best')), 'wifi-spot-finder: ranks living room first, basement last');
  check(/Back porch: strong signal but poor connection/.test(await page.textContent('.wsf .wsf-mismatch')), 'wifi-spot-finder: flags full bars with a poor connection');
  await page.fill('.wsf .wsf-name', 'Desk'); await page.selectOption('.wsf .wsf-sig', 'dbm'); await page.fill('.wsf .wsf-dbm', '-62');
  await page.click('.wsf .wsf-test');
  await page.waitForFunction(() => document.querySelectorAll('.wsf .wsf-table tbody tr').length === 6, null, { timeout: 30000 });
  check(/-62 dBm/.test(await page.textContent('.wsf .wsf-table')), 'wifi-spot-finder: a tested spot joins the table with its signal');
  check(await page.evaluate(() => localStorage.getItem('fibub-wifispots-v1') === null), 'wifi-spot-finder: nothing stored unless ticked');
  // More options (sample spots are reloaded so the numbers are known)
  await page.click('.wsf .wsf-sample');
  check(await page.isHidden('.wsf .wsf-fith'), 'wifi-spot-finder: no Enough column until a use is picked');
  await page.selectOption('.wsf [data-k="need"]', 'call');
  const col = await page.$$eval('.wsf .wsf-table tbody tr', (rs) => rs.map((r) => r.children[7].textContent));
  // Sorted by score: Living room (Yes) ... Basement 2.4 down / 0.8 up (No)
  check(col[0] === 'Yes' && col[col.length - 1] === 'No', `wifi-spot-finder: Enough? column (${col.join()})`);
  check(/far behind Living room/.test(await page.textContent('.wsf .wsf-tips')), 'wifi-spot-finder: gives a next step for the weak spot');
  await page.click('.wsf [data-chip="Kitchen"]');
  check((await page.inputValue('.wsf [data-k="name"]')) === 'Kitchen', 'wifi-spot-finder: quick name fills the box');
  await page.click('.wsf .wsf-retest');
  await page.waitForFunction(() => document.querySelectorAll('.wsf .wsf-table tbody tr').length === 5 && !document.querySelector('.wsf .wsf-test').disabled, null, { timeout: 30000 });
  check(/Basement/.test(await page.textContent('.wsf .wsf-table')) && await page.$$eval('.wsf .wsf-table tbody tr', (r) => r.length) === 5, 'wifi-spot-finder: retest replaces the weakest spot');
};
