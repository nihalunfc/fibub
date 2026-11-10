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
};
