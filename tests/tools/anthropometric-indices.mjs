export const path = '/science/anthropometric-indices/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const runs = () => page.evaluate(() => +(document.querySelector('.an').dataset.runs || 0));
  let mark = 0;
  const before = async () => { mark = await runs(); };
  const wait = () => page.waitForFunction((n) => { const r = document.querySelector('.an'); return +(r.dataset.runs || 0) > n && !r.dataset.busy; }, mark);
  await page.goto(BASE + path, { timeout: 120000 });
  await page.waitForSelector('.an-out:not([hidden])', { timeout: 60000 });
  const cell = async (name) => (await page.locator('.an-tab tbody tr', { hasText: name }).first().textContent());
  check(/23\.0Healthy weight range/.test(await cell('Body mass index')), `anthro tool: BMI 23.0 (${await cell('Body mass index')})`);
  check(/0\.84/.test(await cell('Waist-to-hip')) && /0\.47/.test(await cell('Waist-to-height')), 'anthro tool: waist ratios');
  check(/78\.9Mesocephalic/.test(await cell('Cephalic')) && /69\.2–/.test(await cell('Nasal')), 'anthro tool: cephalic class, nasal value only');
  check(/52\.3/.test(await cell('Cormic')) && /91\.1/.test(await cell('Skelic')), 'anthro tool: Cormic and skelic');
  check((await page.locator('.an-tab tbody tr').count()) === 7 && (await page.textContent('.an-h')) === '7 indices', 'anthro tool: seven indices without bones');
  check(/100 × head breadth ÷ head length/.test(await cell('Cephalic')), 'anthro tool: formula shown');

  // Long bones
  await before();
  for (const [k, v] of [['humerus', '320'], ['radius', '240'], ['femur', '450'], ['tibia', '370']]) await page.fill(`.an-v[data-k="${k}"]`, v);
  await wait();
  check(/68\.3/.test(await cell('Intermembral')) && /75\.0/.test(await cell('Brachial')) && /82\.2/.test(await cell('Crural')) && /71\.1/.test(await cell('Humerofemoral')), 'anthro tool: limb indices');

  // Bad input
  await before(); await page.fill('.an-v[data-k="sittingHeight"]', '180'); await wait();
  check(/Sitting height must be less than stature/.test(await page.textContent('.an-err')), 'anthro tool: sitting height above stature');
  await before(); await page.fill('.an-v[data-k="sittingHeight"]', 'abc'); await wait();
  check(/Sitting height: "abc" is not a number/.test(await page.textContent('.an-err')), 'anthro tool: text reported');
  await before(); await page.fill('.an-v[data-k="sittingHeight"]', '90'); await wait();

  // Report
  const png = page.locator('.dl button[data-f="docx"]'); await png.scrollIntoViewIfNeeded();
  const [d0] = await Promise.all([page.waitForEvent('download'), png.click()]);
  check(d0.suggestedFilename() === 'anthropometric-indices.docx', 'anthro tool: Word report');

  // Batch
  await page.locator('.an-mode button[data-m="batch"]').click();
  await page.waitForSelector('.an-batch:not([hidden])', { timeout: 60000 });
  const sum = async (name) => (await page.locator('.an-sum tbody tr', { hasText: name }).first().textContent());
  check(/^Body mass index \(BMI\)1222\.753\.1418\.4820\.7121\.4826\.0127\.48$/.test(await sum('Body mass index')), `anthro tool: BMI summary matches pandas (${await sum('Body mass index')})`);
  check(/^Waist-to-hip ratio11/.test(await sum('Waist-to-hip')) && /78\.71/.test(await sum('Cephalic')), 'anthro tool: blank waist skipped (n = 11), cephalic mean');
  check(/Healthy weight range \d+/.test(await page.textContent('.an-classes')) && /Mesocephalic/.test(await page.textContent('.an-classes')), 'anthro tool: class counts');
  check((await page.locator('.an-rows tbody tr').count()) === 12 && /^S01/.test(await page.textContent('.an-rows tbody tr:first-child')), 'anthro tool: each row with its ID');
  check(/Weight \(kg\) → weight/.test(await page.textContent('.an-cols')), 'anthro tool: shows how columns were read');
  const csvBtn = page.locator('.an-csv'); await csvBtn.scrollIntoViewIfNeeded();
  const [dl] = await Promise.all([page.waitForEvent('download'), csvBtn.click()]);
  const p = OUT + 'anthro.csv'; await dl.saveAs(p); const text = readFileSync(p, 'utf8');
  check(dl.suggestedFilename() === 'anthropometric-indices.csv' && /^ID,bmi,whr,whtr,cephalic,cormic,skelic,bmi_class,cephalic_class$/m.test(text) && /^S04,26\.6\d*,,,/m.test(text), 'anthro tool: CSV with blank for the missing waist');

  // File with bones only and an unused column
  writeFileSync(OUT + 'anthro-bones.csv', 'Specimen,Humerus,Radius,Femur,Tibia,Site\nA1,300,230,420,350,North\nA2,310,236,431,357,South\n');
  await before(); await page.setInputFiles('.an .dfb-in', OUT + 'anthro-bones.csv');
  await wait();
  check((await page.locator('.an-sum tbody tr').count()) === 4 && /Not used: Site/.test(await page.textContent('.an-cols')), 'anthro tool: opens a bones file');

  // Batch errors
  await before(); await page.fill('.an-in', 'Name,Colour\nA,red'); await wait();
  check(/No measurement columns recognised/.test(await page.textContent('.an-err')), 'anthro tool: no columns recognised');
  await before(); await page.fill('.an-in', 'Weight,Height\n70,x'); await wait();
  check(/Row 1: "x" in Height is not a number/.test(await page.textContent('.an-err')), 'anthro tool: text in batch reported');
};
