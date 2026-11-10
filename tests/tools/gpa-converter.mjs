// #1774 GPA converter
export const path = '/documents/gpa-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/gpa-converter/`); await page.waitForTimeout(300);
  const res = () => page.textContent('.gc .gc-res');
  check((await res()).includes('79.8% (CGPA x 9.5)') && (await res()).includes('3.36') && (await res()).includes('B+, 3.3') && (await res()).includes('First (1st)'), `gpa: CGPA 8.4 example (${await res()})`);
  await page.fill('.gc .gc-topper', '9.5');
  check((await res()).includes('3.54'), 'gpa: topper method');
  await page.selectOption('.gc .gc-kind', 'percentage'); await page.fill('.gc .gc-val', '65');
  check((await res()).includes('6.84') && (await res()).includes('Upper second'), 'gpa: percentage to CGPA and UK class');
  await page.fill('.gc .gc-val', '120');
  check(await page.isVisible('.gc .gc-err'), 'gpa: out of range message');
  await page.selectOption('.gc .gc-kind', 'us'); await page.fill('.gc .gc-val', '3.7');
  check((await res()).includes('A-'), 'gpa: US GPA to letter');
  await page.click('.gc .gc-example'); await page.waitForTimeout(100);
  check((await page.textContent('.gc .gc-wres')).startsWith('GPA 3.64 out of 4.0 from 11 credits'), `gpa: weighted example (${await page.textContent('.gc .gc-wres')})`);
  await page.selectOption('.gc .gc-scale', 'ten'); await page.waitForTimeout(100);
  check((await page.textContent('.gc .gc-wres')).startsWith('Add a grade'), 'gpa: letters not read on a 10-point scale');
};
