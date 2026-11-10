// #T906 Glasses prescription reader
export const path = '/documents/glasses-prescription/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/glasses-prescription/`); await page.waitForTimeout(400);
  check((await page.textContent('.gp .gp-note')).includes('not medical advice'), 'glasses: banner at the top');
  check(await page.isHidden('.gp .gp-out'), 'glasses: nothing shown before typing');
  await page.fill('.gp .gp-od-sph', '-2.00'); await page.fill('.gp .gp-od-cyl', '-0.75'); await page.fill('.gp .gp-od-axis', '180'); await page.waitForTimeout(100);
  const od = await page.textContent('.gp .gp-eye[data-eye=od]');
  check(od.includes('−2.75 +0.75 × 90'), `glasses: OD -2.00 -0.75 x180 transposes to -2.75 +0.75 x90`);
  check(od.includes('−2.38') && od.includes('halves away from zero'), 'glasses: spherical equivalent -2.375 shows -2.38 with the rounding stated');
  check(od.includes('short-sightedness') && !(await page.textContent('.gp .gp-err')).trim(), 'glasses: minus sphere described, no error');
  await page.fill('.gp .gp-od-axis', '190'); await page.waitForTimeout(100);
  check(await page.isVisible('.gp .gp-err') && (await page.textContent('.gp .gp-err')).includes('AXIS must be a whole number from 1 to 180'), 'glasses: axis 190 shows an error');
  await page.fill('.gp .gp-od-axis', ''); await page.waitForTimeout(100);
  check((await page.textContent('.gp .gp-err')).includes('CYL but no AXIS'), 'glasses: CYL without AXIS warns');
  await page.fill('.gp .gp-od-axis', '90'); await page.fill('.gp .gp-od-add', '+1.50'); await page.fill('.gp .gp-od-sph', '+1.00'); await page.fill('.gp .gp-od-cyl', '');  await page.fill('.gp .gp-od-axis', ''); await page.waitForTimeout(100);
  { const t = await page.textContent('.gp .gp-eye[data-eye=od]'); check(t.includes('+2.50') && t.includes('long-sightedness'), 'glasses: near prescription +1.00 +1.50 = +2.50'); }
  await page.fill('.gp .gp-od-sph', '-1.10'); await page.waitForTimeout(100);
  check((await page.textContent('.gp .gp-err')).includes('multiple of 0.25'), 'glasses: step of 0.25 checked');
  const dl = page.waitForEvent('download');
  await page.click('.gp .dl button[data-f=pdf]');
  check((await dl).suggestedFilename() === 'glasses-prescription.pdf', 'glasses: PDF download');
  check(!(await page.evaluate(() => Object.keys(localStorage).some((k) => /gp|glass|presc/i.test(k)))), 'glasses: nothing stored');
};
