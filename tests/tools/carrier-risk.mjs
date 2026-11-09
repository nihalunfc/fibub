// #500 carrier risk calculator
export const path = '/science/carrier-risk/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/carrier-risk/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.cr .cr-big'), facts = () => page.textContent('.cr .cr-facts'), tab = () => page.textContent('.cr .cr-tab');
  const set = async (c, v) => { await page.fill(c, v); await page.waitForTimeout(350); };
  check((await page.textContent('.cr .cr-warn')).includes('not medical advice'), 'carrier: medical note');
  check((await big()) === 'Carrier risk: 1/9 (11.1 %)', `carrier: classic DMD example 1/9 (${await big()})`);
  { const t = await tab(); check(t.includes('3 unaffected sons') && t.includes('1/16') && t.includes('8/9'), 'carrier: Bayes table rows'); }
  { const f = await facts(); check(f.includes('A son is affected1/18') && f.includes('1/36'), 'carrier: offspring risks'); }
  check((await page.textContent('.cr .cr-steps')).includes('9/16'), 'carrier: steps');
  await set('.cr .cr-sons', '2'); check((await big()) === 'Carrier risk: 1/5 (20 %)', 'carrier: 2 sons gives 1/5');
  await page.check('.cr .cr-test'); await page.waitForTimeout(300);
  check((await big()).startsWith('Carrier risk: 1/41') && (await tab()).includes('Negative carrier test (detection rate 90 %)'), `carrier: negative test 90 % (${await big()})`);
  await set('.cr .cr-dr', '0.5'); check((await big()).startsWith('Carrier risk: 1/9 '), 'carrier: detection rate 0.5');
  await page.uncheck('.cr .cr-test'); await page.waitForTimeout(300);
  await page.selectOption('.cr .cr-pos', 'isolated-mother'); await page.waitForTimeout(300);
  check((await page.inputValue('.cr .cr-prior')) === '2/3' && (await big()) === 'Carrier risk: 1/3 (33.3 %)', 'carrier: mother of an isolated case with 2 sons: 1/3');
  await set('.cr .cr-prior', '1/10');
  check((await page.inputValue('.cr .cr-pos')) === 'custom' && (await big()).startsWith('Carrier risk: 1/37'), 'carrier: own prior');
  await page.selectOption('.cr .cr-gen', '2'); await page.waitForTimeout(300);
  check(await page.isVisible('.cr .cr-gen2') && (await big()) === 'Carrier risk: 1/9 (11.1 %)' && (await facts()).includes("Mother's carrier risk5/9"), 'carrier: two generations, isolated case: 1/9 and mother 5/9');
  check((await tab()).includes('Mother and daughter carriers') && (await tab()).includes('1/12'), 'carrier: three-column table');
  await set('.cr .cr-msons', '1'); await page.check('.cr .cr-mtest'); await page.waitForTimeout(300);
  await set('.cr .cr-sons', '3'); await page.check('.cr .cr-test'); await set('.cr .cr-dr', '0.75');
  check((await big()).startsWith('Carrier risk: 1/673') && (await facts()).includes('33/673'), 'carrier: two generations with sons and tests (Python 1/673, 33/673)');
  await page.selectOption('.cr .cr-mode', 'ar'); await page.waitForTimeout(300);
  check(await page.isVisible('.cr .cr-partner') && await page.isHidden('.cr .cr-sons') && (await page.inputValue('.cr .cr-prior')) === '2/3', 'carrier: autosomal recessive layout');
  await set('.cr .cr-dr', '90 %'); await page.check('.cr .cr-ptest'); await page.waitForTimeout(300);
  { const f = await facts(); check((await big()) === 'Carrier risk: 1/6 (16.7 %)' && f.includes('1/241') && f.includes('1 in 5,784') && f.includes('41/482'), `carrier: AR example 1/6, 1/241, 1/5784 (${f.slice(0, 120)})`); }
  check(await page.isVisible('.cr .cr-ptab'), 'carrier: partner table');
  await page.selectOption('.cr .cr-ppos', 'carrier'); await page.waitForTimeout(300);
  check((await facts()).includes('A child is affected1/24'), 'carrier: partner a known carrier');
  await page.selectOption('.cr .cr-pos', 'cousin'); await page.waitForTimeout(300);
  check((await page.inputValue('.cr .cr-prior')) === '1/4', 'carrier: first cousin prior');
  await set('.cr .cr-dr', '150 %');
  check((await page.textContent('.cr .cr-err')).includes('more than 1') && await page.isHidden('.cr .cr-out'), 'carrier: bad detection rate');
  await set('.cr .cr-dr', '100 %'); await page.selectOption('.cr .cr-pos', 'parent'); await page.waitForTimeout(300);
  check((await page.textContent('.cr .cr-err')).includes('cannot all be true'), 'carrier: impossible evidence');
  await set('.cr .cr-dr', '90 %'); await set('.cr .cr-prior', 'half');
  check((await page.textContent('.cr .cr-err')).includes('not a probability'), 'carrier: bad prior');
  await set('.cr .cr-prior', '2/3');
  await page.selectOption('.cr .cr-mode', 'xl'); await page.waitForTimeout(300); await page.selectOption('.cr .cr-gen', '1'); await set('.cr .cr-sons', '2.5');
  check((await page.textContent('.cr .cr-err')).includes('whole number'), 'carrier: bad number of sons');
  await set('.cr .cr-sons', '3'); await page.uncheck('.cr .cr-test'); await page.waitForTimeout(300);
  await page.locator('.cr .dl [data-f=png]').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cr .dl [data-f=png]')]); const f = OUT + 'carrier.png'; await d.saveAs(f); check(readFileSync(f).length > 10000, 'carrier: PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cr .dl [data-f=pdf]')]); const f = OUT + 'carrier.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 4).toString() === '%PDF', 'carrier: PDF'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cr .dl [data-f=docx]')]); const f = OUT + 'carrier.docx'; await d.saveAs(f); check(readFileSync(f).slice(0, 2).toString() === 'PK', 'carrier: Word'); }
};
