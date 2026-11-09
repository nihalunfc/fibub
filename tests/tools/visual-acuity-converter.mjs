// #496 visual acuity converter
export const path = '/science/visual-acuity-converter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/visual-acuity-converter/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.va .va-big'), tab = () => page.textContent('.va .va-tab');
  check((await page.textContent('.va .va-warn')).includes('not medical advice'), 'acuity: medical note at the top');
  check((await big()) === 'Right eye: 20/40 = 6/12 = decimal 0.50 = logMAR 0.30', `acuity: example first value (${await big()})`);
  { const f = await page.textContent('.va .va-facts'); check(f.includes('84.9') && f.includes('69.9') && f.includes('Average of 6 values'), 'acuity: example facts (VAS, letters, average)'); }
  { const t = await tab(); check(t.includes('Left eye') && t.includes('20/27.4') && t.includes('20/25 −2') && t.includes('78'), 'acuity: 6/9+2 row'); }
  check((await page.$$('.va .va-lines tr.va-hit')).length >= 4, 'acuity: chart lines highlighted');
  await page.fill('.va .va-in', '0.3\n0.5'); await page.selectOption('.va .va-plain', 'logmar'); await page.waitForTimeout(400);
  check((await big()).includes('20/39.9') && (await big()).includes('logMAR 0.30'), 'acuity: plain numbers as logMAR');
  await page.selectOption('.va .va-plain', 'vas'); await page.fill('.va .va-in', '85'); await page.waitForTimeout(400);
  check((await big()).includes('logMAR 0.30'), 'acuity: plain numbers as VAS');
  await page.selectOption('.va .va-plain', 'letters'); await page.fill('.va .va-in', '35'); await page.waitForTimeout(400);
  check((await big()).includes('20/200') && (await big()).includes('6/60'), 'acuity: plain numbers as letters');
  await page.selectOption('.va .va-plain', 'mar'); await page.fill('.va .va-in', '2'); await page.waitForTimeout(400);
  check((await big()).includes('20/40'), 'acuity: plain numbers as MAR');
  await page.selectOption('.va .va-plain', 'decimal');
  await page.fill('.va .va-in', '20/40+2'); await page.fill('.va .va-per', '4'); await page.waitForTimeout(400);
  check((await big()).includes('logMAR 0.25'), 'acuity: letters per line');
  await page.fill('.va .va-per', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.va .va-err')).includes('Letters per line') && await page.isHidden('.va .va-out'), 'acuity: bad letters per line');
  await page.fill('.va .va-per', '5'); await page.fill('.va .va-in', '20/20\n20/200\nhello'); await page.waitForTimeout(400);
  check((await page.textContent('.va .va-err')).includes('"hello" is not an acuity value') && (await page.textContent('.va .va-facts')).includes('20/63.2'), 'acuity: bad value left out, Holladay average');
  await page.fill('.va .va-in', ''); await page.waitForTimeout(400);
  check((await page.textContent('.va .va-err')).includes('Type an acuity value') && await page.isHidden('.va .va-out'), 'acuity: empty input message');
  await page.fill('.va .va-in', 'OD, 20/40\nOS, 6/6'); await page.waitForTimeout(400);
  await page.locator('.va .va-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.va .va-csv')]); const f = OUT + 'acuity.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 3 && r[0].startsWith('name,entered') && r[1].startsWith('OD,20/40,Snellen fraction,20/40,6/12,0.5,0.301') && r[2].includes('6/6'), 'acuity: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.va .dl [data-f=png]')]); const f = OUT + 'acuity.png'; await d.saveAs(f); check(readFileSync(f).length > 5000, 'acuity: PNG report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.va .dl [data-f=pdf]')]); const f = OUT + 'acuity.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'acuity: PDF report'); }
  writeFileSync(OUT + 'acuity.tsv', 'Patient\tAcuity\nA\t20/50\nB\t6/18\n');
  await page.setInputFiles('.va .dfb-in', OUT + 'acuity.tsv'); await page.waitForTimeout(500);
  check((await tab()).includes('20/50') && (await tab()).includes('6/18'), 'acuity: open a file');
};
