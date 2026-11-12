// #T938 Trip Tracker
export const path = '/everyday/trip-tracker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/trip-tracker/`); await page.waitForTimeout(400);
  check(await page.isHidden('.tt .tt-out'), 'trip-tracker: no results before a trip');
  check(await page.isDisabled('.tt .tt-stop') && await page.isEnabled('.tt .tt-start'), 'trip-tracker: Start is on and Stop is off before recording');
  check(/Keep this page open with the screen on/.test(await page.textContent('.tt .tt-keepopen')), 'trip-tracker: the keep-open note is shown');
  check(await page.$eval('.tt .tt-keep', (e) => !e.checked), 'trip-tracker: keeping trips is off by default');
  await page.click('.tt .tt-sample'); await page.waitForTimeout(300);
  check(await page.isVisible('.tt .tt-out'), 'trip-tracker: the sample trip shows results');
  check(/2\.84 km/.test(await page.textContent('.tt .tt-facts')) && /4:46/.test(await page.textContent('.tt .tt-facts')), 'trip-tracker: the sample is 2.84 km in 4:46');
  check(await page.$$eval('.tt .tt-events tbody tr', (r) => r.length) === 2, 'trip-tracker: the sample lists a speed-up and a slow-down');
  check(await page.$$eval('.tt .tt-gaps tbody tr', (r) => r.length) === 1, 'trip-tracker: the sample lists one gap');
  check(await page.$$eval('.tt .tt-legs tbody tr', (r) => r.length) === 5, 'trip-tracker: the sample has five legs');
  check(await page.$eval('.tt .tt-route', (c) => c.width > 100 && c.height > 100), 'trip-tracker: the route chart is drawn');
  await page.selectOption('.tt .tt-units', 'mi'); await page.waitForTimeout(200);
  check(/1\.7\d mi/.test(await page.textContent('.tt .tt-facts')), 'trip-tracker: miles shows about 1.77 mi');
  const dl = page.waitForEvent('download');
  await page.click('.tt .tt-gpx');
  const gpx = await (await dl).createReadStream(); let txt = ''; for await (const c of gpx) txt += c;
  check(txt.includes('<gpx version="1.1"') && (txt.match(/<trkseg>/g) || []).length === 2, 'trip-tracker: the GPX has a segment break at the gap');
  check(await page.isVisible('.tt .tt-keepopen') && (await page.textContent('.tt .tt-saved-n')).includes('No saved trips'), 'trip-tracker: nothing is saved unless ticked');
  check(await page.evaluate(() => localStorage.getItem('fibub-trips-v1') === null), 'trip-tracker: nothing in storage without the box ticked');
};
