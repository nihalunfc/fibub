// #514 rock mass classification
export const path = '/science/rock-mass-classification/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/rock-mass-classification/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent('.rmc ' + c);
  const set = async (c, val) => { await page.fill('.rmc ' + c, val); await page.waitForTimeout(80); };
  check((await t('.rmc-note')).includes('published tables'), 'rock mass: tables-not-included notice');
  check((await t('.rm-rbig')) === 'RQD = 73.3 %' && (await t('.rm-rfacts')).includes('6 of 11') && (await t('.rm-rfacts')).includes('93.3 %'), 'rock mass: RQD example');
  await page.waitForFunction(() => document.querySelector('.rmc .rm-core').width > 0);
  check(await page.isVisible('.rmc .rm-core'), 'rock mass: core run drawing');
  check((await t('.rm-qbig')) === 'Q = 6.11' && (await t('.rm-qfacts')).includes('8.148') && (await t('.rm-qfacts')).includes('0.79'), 'rock mass: Q example and log Q');
  check((await t('.rm-mbig')) === 'RMR = 55' && (await t('.rm-mfacts')).includes('7 + 13 + 10 + 20 + 10'), 'rock mass: RMR example');
  { const f = await t('.rm-cfacts'); check(f.includes('60.3') && f.includes('3.39') && f.includes('GSI from RMR8960') && f.includes('GSI from Q′60.3'), 'rock mass: correlation and GSI'); }
  await set('.rm-min', '15');
  check((await t('.rm-rbig')) === 'RQD = 48.7 %', 'rock mass: 15 cm cut-off');
  await set('.rm-min', '10'); await set('.rm-pcs', '25, 8, 12, x');
  check((await t('.rm-rerr')).includes('not lengths: x') && (await t('.rm-qerr')).includes('Fix the core run'), 'rock mass: bad piece message');
  await set('.rm-pcs', '100, 80');
  check((await t('.rm-rerr')).includes('more than the run length'), 'rock mass: pieces longer than the run');
  await set('.rm-pcs', '25, 8, 12, 4, 30, 6, 18, 9, 11, 3, 14');
  await page.selectOption('.rmc .rm-rsrc', 'typed'); await set('.rm-rqd', '5');
  check((await t('.rm-qbig')) === 'Q = 0.833' && (await t('.rm-qfacts')).includes('taken as 10'), 'rock mass: typed RQD below 10 taken as 10');
  await page.uncheck('.rmc .rm-floor'); await page.waitForTimeout(80);
  check((await t('.rm-qbig')) === 'Q = 0.417', 'rock mass: floor switched off');
  await set('.rm-jw', '1.5');
  check((await t('.rm-qerr')).includes('Jw is at most 1'), 'rock mass: Jw above 1 message');
  await set('.rm-jw', '1'); await page.check('.rmc .rm-floor'); await page.selectOption('.rmc .rm-rsrc', 'core'); await page.waitForTimeout(80);
  await set('.rm-r4', '80');
  check((await t('.rm-merr')).includes('more than 100'), 'rock mass: RMR over 100 message');
  await set('.rm-r4', '20'); await set('.rm-adj', '3');
  check((await t('.rm-merr')).includes('0 or negative'), 'rock mass: positive adjustment message');
  await set('.rm-adj', '-5'); await set('.rm-a', '10'); await set('.rm-b', '40');
  check((await t('.rm-cfacts')).includes('58.1'), 'rock mass: edited correlation 10 ln Q + 40');
  await set('.rm-a', '9'); await set('.rm-b', '44');
  for (const c of ['.rm-r1', '.rm-r2', '.rm-r3', '.rm-r4']) await set(c, '1');
  check((await t('.rm-cfacts')).includes('not valid'), 'rock mass: GSI from low RMR flagged');
  await set('.rm-r1', '7'); await set('.rm-r2', '13'); await set('.rm-r3', '10'); await set('.rm-r4', '20');
  await page.waitForFunction(() => document.querySelector('.rmc .rm-cfig').width > 0);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rmc .rm-csv')]); const f = OUT + 'rmc.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('quantity,value') && s.includes('RQD_percent,73.33') && s.includes('Q,6.11111') && s.includes('RMR_adjusted,55') && s.includes('RMR_from_Q,60.29'), 'rock mass: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rmc .rm-cout > .dl:last-child [data-f=docx]')]); const f = OUT + 'rmc.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'rock mass: Word report'); }
};
