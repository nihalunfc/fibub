// Input-output multipliers: the made-up table, shocks, satellite rows, total output column, downloads and bad input.
export const path = '/science/leontief-multipliers/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  page.setDefaultTimeout(120000); // pages load slowly when many builds share the machine; reset at the end
  const dl = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
  const waitErr = (re) => page.waitForFunction((s) => { const e = document.querySelector('.lt-err'); return e && !e.hidden && new RegExp(s).test(e.textContent || ''); }, re.source);
  await page.goto(BASE + path);
  check((await page.textContent('.lt-big')) === 'Highest output multiplier: Factories, 1.9890', `leontief: example (${await page.textContent('.lt-big')})`);
  const mult = await page.textContent('.lt-mult');
  check(/1\.8551/.test(mult) && /1\.7903/.test(mult) && /Key sector/.test(mult) && /1\.1598/.test(mult), `leontief: multipliers and linkages (${mult.slice(0, 200)})`);
  check(/0\.1600/.test(await page.textContent('.lt-A')) && /Column sum/.test(await page.textContent('.lt-L')), 'leontief: A and L tables');
  const sat = await page.textContent('.lt-satt');
  check(/3\.1526/.test(sat) && /1\.8502/.test(sat), `leontief: Type I jobs and wages (${sat.slice(0, 200)})`);
  const imp = await page.textContent('.lt-imp');
  check(/Farming02\.850\.8550\.342/.test(imp) && /14\.508/.test(imp) && /Total1019\.895\.351\.009/.test(imp), `leontief: +10 for Factories (${imp})`);
  await page.fill('.lt-df[data-name=Farming]', '5');
  await page.waitForFunction(() => /Total15/.test(document.querySelector('.lt-imp')?.textContent || ''));
  check(true, 'leontief: shock inputs update the total');
  const csv = readFileSync(await dl('.lt-csv'), 'utf8');
  check(/^Multipliers/.test(csv) && /Leontief inverse/.test(csv) && /Factories,250,120,1\.9890/.test(csv), 'leontief: CSV download');
  check(readFileSync(await dl('.dl [data-f=pdf]')).slice(0, 4).toString() === '%PDF', 'leontief: PDF report');
  // Total output column, checked.
  await page.fill('.lt-flows', 'x\tA\tB\tFD\tTotal\nA\t10\t20\t70\t100\nB\t30\t40\t130\t200');
  await page.waitForFunction(() => /Highest output multiplier: B/.test(document.querySelector('.lt-big')?.textContent || '') || /A,/.test(document.querySelector('.lt-big')?.textContent || ''));
  check(/Highest output multiplier/.test(await page.textContent('.lt-big')), 'leontief: total output column accepted');
  await waitErr(/needs one number for each of the 2 sectors|Wages/).catch(() => {});
  await page.fill('.lt-sat', '');
  await page.fill('.lt-flows', 'x\tA\tB\tFD\tTotal\nA\t10\t20\t70\t90\nB\t30\t40\t130\t200');
  await waitErr(/do not add up/);
  check(true, 'leontief: total output that does not add up is explained');
  await page.fill('.lt-flows', 'x\tA\tB\tFD\nA\t10\tlots\t70\nB\t30\t40\t130');
  await waitErr(/"lots"/);
  check(true, 'leontief: text in the table is explained');
  await page.fill('.lt-flows', 'x\tA\tB\nA\t10\t20\nB\t30\t40');
  await waitErr(/each row needs 2 flows/);
  check(true, 'leontief: missing final demand explained');
  await page.fill('.lt-flows', 'x\tA\tB\tFD\nA\t0\t0\t0\nB\t0\t0\t10');
  await waitErr(/total output above zero/);
  check(true, 'leontief: a sector with no output explained');
  page.setDefaultTimeout(30000);
};
