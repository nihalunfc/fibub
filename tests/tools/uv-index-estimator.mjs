// #504 UV index estimator
export const path = '/science/uv-index-estimator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.uvx';
  await page.goto(`${BASE}/science/uv-index-estimator/`); await page.waitForTimeout(500);
  const big = () => page.textContent(`${R} .uv-big`), facts = () => page.textContent(`${R} .uv-facts`), band = () => page.textContent(`${R} .uv-band`), dose = () => page.textContent(`${R} .uv-dose`);
  const set = async (c, v) => { await page.fill(`${R} ${c}`, v); await page.waitForTimeout(120); };
  check((await page.textContent(`${R} .uv-warn`)).includes('An estimate: check your local UV forecast'), 'uv: estimate notice');
  check((await big()) === 'UV index at 13:00: 10.3 (Very high)', `uv: example (${await big()})`);
  check((await band()).includes('Peak 10.4 at 13:19: Very high'), 'uv: peak and solar noon');
  { const f = await facts(); check(f.includes('20.6° (Sun 69.4° above the horizon)') && f.includes('Clear-sky formula alone10.7') && f.includes('distance × 0.968'), 'uv: zenith and factors');
    check(f.includes('UV index 3 or more09:02 to 17:37') && f.includes('UV index 11 or morenot today') && f.includes('Whole-day dose62.9 SED'), 'uv: band times and daily dose'); }
  check((await dose()).startsWith('1 SED from 13:00: 6 min following') && (await dose()).includes('at a steady UV index 10.3'), `uv: dose time (${await dose()})`);
  // Ground and ozone
  await page.selectOption(`${R} .uv-gsel`, '0.85'); await page.waitForTimeout(120);
  check((await page.inputValue(`${R} .uv-alb`)) === '0.85' && (await big()).includes(': 13.8 (Extreme)'), 'uv: fresh snow');
  await set('.uv-alb', '0.2');
  check((await page.inputValue(`${R} .uv-gsel`)) === 'custom', 'uv: typed albedo switches the ground to custom');
  await page.selectOption(`${R} .uv-gsel`, '0'); await page.waitForTimeout(80);
  await set('.uv-oz', '270');
  check((await big()).includes(': 11.7 (Extreme)'), 'uv: less ozone, more UV');
  await set('.uv-oz', '300');
  await set('.uv-alt', '2000'); await set('.uv-cmf', '0.5');
  check((await band()).includes('Peak 5.9 at 13:19: Moderate'), 'uv: height and cloud factors');
  await set('.uv-alt', '0'); await set('.uv-cmf', '1');
  // Formula settings
  await page.click(`${R} .uv-adv summary`);
  await page.uncheck(`${R} .uv-dist`); await page.waitForTimeout(120);
  check((await facts()).includes('distance × 1.000') && (await big()).includes(': 10.7'), 'uv: distance term off');
  await page.check(`${R} .uv-dist`);
  await set('.uv-a', '10');
  check((await big()).includes(': 8.3 (Very high)'), 'uv: editable formula constant');
  await set('.uv-a', '12.5');
  // Dose from another start
  await set('.uv-start', '11:00'); await set('.uv-sed', '2');
  check((await dose()).startsWith('2 SED from 11:00: 17 min following'), `uv: 2 SED from 11:00 (${await dose()})`);
  await set('.uv-start', '21:00');
  check((await dose()).includes('not reached today') && (await dose()).includes('the Sun is down'), 'uv: dose after sunset');
  // Night time and polar night
  await set('.uv-time', '23:00');
  check((await big()) === 'UV index at 23:00: 0 (the Sun is below the horizon)', 'uv: night');
  await set('.uv-lat', '78'); await set('.uv-date', '2026-12-21');
  check((await facts()).includes('UV index 3 or morenot today') && (await band()).includes('Peak 0.0'), 'uv: polar night');
  await set('.uv-lat', '43.65'); await set('.uv-date', '2026-06-21'); await set('.uv-time', '13:00');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .uv-csv`)]); const f = OUT + 'uv.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').split('\n');
    check(d.suggestedFilename() === 'uv-index-2026-06-21.csv' && t[0] === 'clock_time,solar_zenith_deg,uv_index' && t.length === 147 && t[79].startsWith('13:00,20.60,10.31') && t[145].startsWith('24:00,'), `uv: CSV (${t[79]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .uv-out [data-f="pdf"]`)]); const f = OUT + 'uv.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'uv-index-estimate.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'uv: PDF report'); }
  // Bad input
  await set('.uv-lat', '95');
  check((await page.textContent(`${R} .uv-err`)).includes('Latitude is between') && (await page.isHidden(`${R} .uv-out`)), 'uv: bad latitude');
  await set('.uv-lat', '43.65'); await set('.uv-oz', '50');
  check((await page.textContent(`${R} .uv-err`)).includes('Ozone is between 100 and 600'), 'uv: bad ozone');
  await set('.uv-oz', '300');
  await page.click(`${R} .uv-now`); await page.waitForTimeout(150);
  check(/^\d{4}-\d{2}-\d{2}$/.test(await page.inputValue(`${R} .uv-date`)) && (await page.isVisible(`${R} .uv-out`)), 'uv: now button');
};
