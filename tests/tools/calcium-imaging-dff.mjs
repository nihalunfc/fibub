// #350 Calcium imaging ΔF/F
export const path = '/science/calcium-imaging-dff/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const P = '.ca ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(1200);
  const facts = () => page.textContent(P + '.ca-facts'), row1 = () => page.textContent(P + '.ca-tab tbody tr');
  { const f = await facts(); check(f.includes('ROIs8') && f.includes('1,200 (60 s at 20 Hz)') && f.includes('Events54') && f.includes('6.75 per ROI per min') && f.includes('8 of 8'), `calcium: example summary (${f})`); }
  check((await row1()) === 'ROI1103.30.03580.161881.20', `calcium: ROI1 row (${await row1()})`);
  check(await page.isDisabled(P + '.ca-fr') && await page.isVisible(P + '.ca-heat') && await page.isVisible(P + '.ca-tr') && await page.isVisible(P + '.ca-raw'), 'calcium: frame rate from time column, three figures');
  // Downloads.
  { await page.locator(P + '.ca-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ca-csv')]); const f = OUT + 'dff.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 1201 && r[0] === 'time_s,ROI1,ROI2,ROI3,ROI4,ROI5,ROI6,ROI7,ROI8' && r[1].split(',').length === 9, 'calcium: ΔF/F CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ca-ecsv')]); const f = OUT + 'ev.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 55 && r[0] === 'roi,onset_s,peak_s,end_s,peak_dff' && r[1].startsWith('ROI1,'), 'calcium: events CSV, 54 events'); }
  { await page.locator(P + '.dl [data-f=pdf]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=pdf]')]); const f = OUT + 'ca.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'calcium: PDF report'); }
  // Options.
  await page.fill(P + '.ca-r', '0'); await page.waitForTimeout(600);
  check((await row1()) !== 'ROI1103.30.03580.161881.20', 'calcium: neuropil factor 0');
  await page.fill(P + '.ca-r', '0.7');
  await page.selectOption(P + '.ca-bm', 'first'); await page.waitForTimeout(600);
  check(await page.isVisible(P + '.ca-n') && await page.isHidden(P + '.ca-w') && /Events\d+/.test(await facts()), 'calcium: first-N baseline');
  await page.fill(P + '.ca-n', '50'); await page.waitForTimeout(600);
  await page.selectOption(P + '.ca-bm', 'whole'); await page.fill(P + '.ca-p', '20'); await page.waitForTimeout(600);
  check(await page.isHidden(P + '.ca-w') && await page.isVisible(P + '.ca-p'), 'calcium: whole-trace percentile baseline');
  await page.selectOption(P + '.ca-bm', 'sliding'); await page.fill(P + '.ca-p', '8'); await page.fill(P + '.ca-w', '10'); await page.waitForTimeout(600);
  check(!(await facts()).includes('Events54'), 'calcium: 10 s window changes the result');
  await page.fill(P + '.ca-w', '30'); await page.waitForTimeout(600);
  check((await facts()).includes('Events54'), 'calcium: back to the example');
  await page.selectOption(P + '.ca-ns', 'sd'); await page.waitForTimeout(600);
  { const m = (await facts()).match(/Events(\d+)/); check(Number(m[1]) < 54, `calcium: SD noise gives fewer events (${m[1]})`); }
  await page.selectOption(P + '.ca-ns', 'robust'); await page.fill(P + '.ca-k', '6'); await page.waitForTimeout(600);
  { const m = (await facts()).match(/Events(\d+)/); check(Number(m[1]) < 54, `calcium: threshold 6 gives fewer events (${m[1]})`); }
  await page.fill(P + '.ca-k', '3'); await page.fill(P + '.ca-md', '30'); await page.waitForTimeout(600);
  { const m = (await facts()).match(/Events(\d+)/); check(Number(m[1]) < 54, `calcium: shortest event 30 frames (${m[1]})`); }
  await page.fill(P + '.ca-md', '3'); await page.waitForTimeout(500);
  await page.selectOption(P + '.ca-roi', '3'); await page.selectOption(P + '.ca-cm', 'grey'); await page.fill(P + '.ca-top', '0.5'); await page.waitForTimeout(400);
  check((await page.getAttribute(P + '.ca-tr', 'aria-label')).includes('ROI4') && (await page.getAttribute(P + '.ca-heat', 'aria-label')).includes('Heat map'), 'calcium: ROI picker, grey colours, colour scale top');
  // Bad input and no time column.
  await page.locator(P + '.ca-npw summary').scrollIntoViewIfNeeded(); await page.click(P + '.ca-npw summary'); await page.fill(P + '.ca-np', 'a\tb\n1\t2'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.ca-err')).includes('They must match'), 'calcium: neuropil shape message');
  await page.fill(P + '.ca-np', ''); await page.fill(P + '.ca-in', 'cellA\tcellB\n100\t200\n101\tx\n99\t202'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.ca-err')).includes('cellB, row 3 is not a number'), 'calcium: bad number message');
  await page.fill(P + '.ca-in', 'cellA\tcellB\n' + Array.from({ length: 200 }, (_, i) => `${100 + (i % 50 === 10 ? 80 : 0) + (i % 3)}\t${200 + (i % 2)}`).join('\n')); await page.waitForTimeout(600);
  check(!(await page.isDisabled(P + '.ca-fr')) && (await page.textContent(P + '.ca-frn')).includes('type the imaging rate') && (await facts()).includes('ROIs2'), 'calcium: no time column, typed rate');
  await page.fill(P + '.ca-fr', '10'); await page.waitForTimeout(600);
  check((await facts()).includes('200 (20 s at 10 Hz)'), 'calcium: frame rate 10 Hz');
  await page.fill(P + '.ca-in', 'a\n0\n0\n0\n0'); await page.waitForTimeout(600);
  check((await page.textContent(P + '.ca-err')).includes('baseline F0 falls to zero'), 'calcium: zero baseline message');
  writeFileSync(OUT + 'ca.csv', 'time_ms,r1\n' + Array.from({ length: 100 }, (_, i) => `${i * 50},${100 + (i === 50 ? 50 : 0) + (i % 2)}`).join('\n'));
  await page.locator(P + '.dfb-in').first().setInputFiles(OUT + 'ca.csv'); await page.waitForTimeout(800);
  check((await page.inputValue(P + '.ca-fr')) === '20' && (await facts()).includes('ROIs1'), 'calcium: CSV file with time in ms');
};
