// #1132 Cell division
export const path = '/learn/cell-division/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.cdv ';
  await page.goto(`${BASE}/learn/cell-division/?seed=5`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.cdv-big'), facts = () => page.textContent(R + '.cdv-facts');
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(250); };
  const snap = () => page.$eval(R + '.cdv-fig', (c) => c.toDataURL());
  check((await big()) === 'Interphase: G1: 4 chromosomes in the cell', `division: start (${await big()})`);
  check((await page.$$eval(R + '.cdv-strip button', (b) => b.length)) === 7 && await page.isDisabled(R + '.cdv-prev'), 'division: mitosis has 7 stages');
  const pics = new Set([await snap()]);
  for (let k = 0; k < 5; k++) { await tap('.cdv-next'); pics.add(await snap()); }
  check((await big()) === 'Anaphase: 8 chromosomes in the cell, for a moment' && (await facts()).includes('92 chromosomes'), `division: anaphase doubles (${await big()})`);
  await tap('.cdv-next');
  check((await big()) === 'Telophase and cytokinesis: 4 chromosomes in each cell, 2 cells' && await page.isDisabled(R + '.cdv-next'), `division: telophase (${await big()})`);
  pics.add(await snap());
  check(pics.size === 7, `division: every mitosis stage drawn differently (${pics.size})`);
  // meiosis with 2n = 6
  await tap('.cdv-kind button[data-v=meiosis]'); await tap('.cdv-n button[data-v="6"]');
  check(await page.isVisible(R + '.cdv-xo') && (await page.$$eval(R + '.cdv-strip button', (b) => b.length)) === 8, 'division: meiosis has 8 stages and crossing over');
  await tap('.cdv-strip button:nth-child(5)');
  check((await big()) === 'Telophase I: 3 chromosomes in each cell, 2 cells' && (await facts()).includes('23 chromosomes'), `division: telophase I halves (${await big()})`);
  await tap('.cdv-strip button:nth-child(3)');
  check(await page.isVisible(R + '.cdv-shuf'), 'division: shuffle shown in metaphase I');
  { const a = await snap(); let changed = false; for (let k = 0; k < 6 && !changed; k++) { await tap('.cdv-shuf'); changed = (await snap()) !== a; } check(changed, 'division: shuffle changes the line-up'); }
  { const a = await snap(); await page.uncheck(R + '.cdv-xo'); await page.waitForTimeout(200); check((await snap()) !== a, 'division: crossing over switch redraws'); await page.check(R + '.cdv-xo'); }
  await tap('.cdv-strip button:nth-child(8)');
  check((await big()) === 'Telophase II: 3 chromosomes in each cell, 4 cells', `division: telophase II (${await big()})`);
  // Class 11 extras
  await tap('.cdv-level button[data-v="11"]');
  { const f = await facts(); check(f.includes('1C per cell') && f.includes('8 kinds') && f.includes('8,388,608'), `division: Class 11 facts (${f.slice(0, 160)})`); }
  check((await page.$$eval(R + '.cdv-tab thead th', (t) => t.map((x) => x.textContent).join('|'))) === 'Stage|Chromosomes|DNA|Cells', 'division: DNA column at Class 11');
  // play
  await tap('.cdv-kind button[data-v=mitosis]');
  await tap('.cdv-play'); await page.waitForTimeout(1900);
  check((await big()).startsWith('Interphase: S') && (await page.textContent(R + '.cdv-play')) === 'Pause', `division: play steps on (${await big()})`);
  await tap('.cdv-play');
  // root tip
  check(await page.isDisabled(R + '.cdv-csv'), 'division: CSV waits for a field');
  await tap('.cdv-look'); await tap('.cdv-look');
  const mi = await page.textContent(R + '.cdv-mi');
  check(/^Mitotic index \d+\.\d % \(\d+ dividing of 120 cells, 2 fields\)$/.test(mi), `division: mitotic index (${mi})`);
  const rows = await page.$$eval(R + '.cdv-count tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent)));
  check(rows.length === 5 && rows.reduce((s, r) => s + Number(r[1]), 0) === 120 && rows[0][4] === '21.60 h', `division: counts table (${rows[0]})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cdv-csv')]); const f = OUT + 'division.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'stage,cells,share_percent,estimated_hours,model_hours' && l.length === 6 && l[1].startsWith('interphase,'), `division: CSV (${l[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'division.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'division: image report'); }
  await tap('.cdv-reset');
  check((await page.textContent(R + '.cdv-mi')) === '' && await page.isDisabled(R + '.cdv-csv'), 'division: start again');
  // Check yourself at both levels
  for (const [lv, n] of [['11', 5], ['10', 4]]) {
    await tap(`.cdv-level button[data-v="${lv}"]`);
    await tap('.cdv-check');
    check((await page.textContent(R + '.cdv-score')) === `0 of ${n} right.`, `division: Class ${lv} quiz blanks are wrong`);
    await page.$$eval(R + '.cdv-qs li', (lis) => lis.forEach((li) => { li.querySelector('.cdv-ans').value = li.dataset.a; }));
    await tap('.cdv-check');
    check((await page.textContent(R + '.cdv-score')) === `${n} of ${n} right.` && (await page.$$eval(R + '.cdv-worked', (w) => w.every((e) => e.textContent.startsWith('✓')))), `division: Class ${lv} quiz right answers`);
  }
  await tap('.cdv-new');
  check((await page.textContent(R + '.cdv-score')) === '', 'division: new questions');
};
