// #1612 Serial checker
export const path = '/collecting/serial-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/collecting/serial-checker/`); await page.waitForTimeout(300);
  const row = async (i) => await page.textContent(`.sc .sc-tab tbody tr:nth-child(${i})`);
  check(/Ladder/.test(await row(1)), 'serial-checker: 12345678 is a ladder');
  check(/Radar/.test(await row(2)), 'serial-checker: 12344321 is a radar');
  const r3 = await row(3);
  check(/Solid/.test(r3) && /Radar/.test(r3), 'serial-checker: 77777777 is solid and radar');
  check(/3 of 3 with a pattern/.test(await page.textContent('.sc .sc-sum')), 'serial-checker: summary counts patterns');
  await page.fill('.sc .sc-in', '13572468\nAB 12'); await page.waitForTimeout(100);
  check(/No pattern/.test(await row(1)) && /at least 4/.test(await row(2)), 'serial-checker: plain and too-short serials');
  await page.check('.sc .sc-star'); await page.waitForTimeout(100);
  check(/Star or replacement/.test(await row(1)), 'serial-checker: star tick adds the note');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.sc .sc-in', '88888889, 109601; 25122024'); await page.waitForTimeout(100);
  check(/Near solid/.test(await row(1)), 'serial-checker: 88888889 is near solid');
  check(/Rotator/.test(await row(2)), 'serial-checker: 109601 is a rotator');
  check(/Looks like a date: 25\/12\/2024/.test(await row(3)), 'serial-checker: 25122024 looks like a date, commas split serials');
  await page.fill('.sc .sc-in', '13572468\n77777777*'); await page.check('.sc .sc-only'); await page.waitForTimeout(100);
  check((await page.locator('.sc .sc-tab tbody tr').count()) === 1 && /Star or replacement/.test(await row(1)), 'serial-checker: only-patterns filter and a typed star flags a star note');
};
