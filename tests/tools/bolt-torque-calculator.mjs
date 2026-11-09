// #642 bolt preload and torque
export const path = '/science/bolt-torque-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/bolt-torque-calculator/`); await page.waitForTimeout(500);
  const R = '.btq', big = () => page.textContent(`${R} .bt-big`), facts = () => page.textContent(`${R} .bt-facts`);
  check((await big()) === 'Tighten to 52.2 N·m for a preload of 26.1 kN', `bolt: example torque (${await big()})`);
  { const f = await facts(); check(f.includes('57.99 mm²') && f.includes('450 MPa') && f.includes('20.88 kN to 34.79 kN') && f.includes('C = kb / (kb + km) = 0.185') && f.includes('32 kN') && f.includes('factor 3.2 on') && f.includes('bolt 27.94 kN, clamp left 17.94 kN') && f.includes('yield factor 1.25'), 'bolt: example joint facts'); }
  check(await page.isVisible(`${R} .bt-fig`) && await page.isHidden(`${R} .bt-warn`), 'bolt: joint diagram, no warning');
  await page.selectOption(`${R} .bt-meth`, 'mu'); await page.waitForTimeout(100);
  check((await big()) === 'Tighten to 42.9 N·m for a preload of 26.1 kN' && (await facts()).includes('K = 0.164'), `bolt: friction method (${await big()})`);
  await page.selectOption(`${R} .bt-meth`, 'K'); await page.selectOption(`${R} .bt-Kpick`, '0.15'); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .bt-K`)) === '0.15' && (await big()).startsWith('Tighten to 39.1 N·m'), 'bolt: typical K fills in');
  await page.selectOption(`${R} .bt-mode`, 'F'); await page.fill(`${R} .bt-T`, '30'); await page.waitForTimeout(100);
  check((await big()) === '30 N·m gives a preload of about 20 kN' && await page.isHidden(`${R} .bt-frac`), `bolt: preload from a torque (${await big()})`);
  await page.fill(`${R} .bt-load`, '40'); await page.waitForTimeout(100);
  check(await page.isVisible(`${R} .bt-warn`) && (await page.textContent(`${R} .bt-warn`)).includes('separation load'), 'bolt: separation warning');
  await page.fill(`${R} .bt-pc`, '10.9'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .bt-pcout`)).includes('nominal tensile strength 1000 MPa and yield 900 MPa'), 'bolt: property class helper');
  // Inch: 1/2-13 UNC, 85 ksi example, 75 %.
  await page.selectOption(`${R} .bt-mode`, 'T'); await page.selectOption(`${R} .bt-sys`, 'un'); await page.fill(`${R} .bt-K`, '0.2'); await page.waitForTimeout(100);
  check((await big()) === 'Tighten to 75.4 lbf·ft for a preload of 9046 lbf' && (await facts()).includes('0.1419 in²') && await page.isHidden(`${R} .bt-pc`), `bolt: 1/2-13 UNC (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=docx]`)]); check((await d.suggestedFilename()) === 'bolt-torque.docx', 'bolt: Word report'); }
  await page.fill(`${R} .bt-n`, '0'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .bt-err`)).includes('threads per inch') && await page.isHidden(`${R} .bt-out`), 'bolt: bad thread count');
  await page.fill(`${R} .bt-n`, '13'); await page.fill(`${R} .bt-shank`, '5'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .bt-err`)).includes('no longer than the grip'), 'bolt: shank longer than grip');
};
