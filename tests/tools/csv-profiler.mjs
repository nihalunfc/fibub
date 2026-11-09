// #568 CSV and Excel data profiler
export const path = '/science/csv-profiler/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  const T = (s) => page.textContent('.cpf ' + s);
  await page.goto(`${BASE}/science/csv-profiler/`); await page.waitForTimeout(700);
  check((await T('.cpf-big')) === '41 rows × 8 columns', 'profiler: example size');
  { const t = await T('.cpf-facts'); check(t.includes('5 (1.52 %)') && t.includes('Duplicate rows1') && t.includes('4 number, 1 date, 1 yes/no, 2 text') && t.includes('Rows with a gap5'), `profiler: overview facts (${t})`); }
  { const t = await T('.cpf-notes'); check(t.includes('1 row is an exact copy') && t.includes('height_cm: 2 values outside 1.5 × IQR'), 'profiler: things to check list'); }
  { const row = await page.$$eval('.cpf .cpf-sum tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); const h = row.find((r) => r[0] === 'height_cm');
    check(row.length === 8 && h[1] === 'number' && h[2] === '2 (4.88 %)' && h[4] === '43.67' && h[5] === '13.49' && h[7] === '42' && h[6] === '29.8' && h[8] === '118', `profiler: column table (${h})`);
    const s = row.find((r) => r[0] === 'sown'); check(s[1] === 'date' && s[6] === '2026-03-01' && s[8] === '2026-04-12', 'profiler: date column first and last'); }
  check((await page.inputValue('.cpf .cpf-col')) === '3' && (await T('.cpf-cfacts')).includes('Upper quartile45.3') && await page.isVisible('.cpf .cpf-hist'), 'profiler: detail starts on the first number column, with a histogram');
  await page.selectOption('.cpf .cpf-col', '2'); await page.waitForTimeout(150);
  { const t = await T('.cpf-top'); check(t.includes('East1230 %') && (await T('.cpf-cfacts')).includes('Missing1 (2.44 %)') && await page.isVisible('.cpf .cpf-hist'), `profiler: text column top values (${t.slice(0, 60)})`); }
  check((await T('.cpf-pairs')).includes('height_cm and mass_g0.540'), 'profiler: Pearson pairs');
  await page.selectOption('.cpf .cpf-corr', 'spearman'); await page.waitForTimeout(250);
  { const t = await T('.cpf-pairs'); check(t.startsWith('Strongest pairs') && t.includes('height_cm and mass_g0.845') && (await T('.cpf-corr-help')).startsWith('Spearman correlation of 4 number columns'), 'profiler: Spearman correlation'); }
  await page.selectOption('.cpf .cpf-col', '4'); await page.selectOption('.cpf .cpf-bins', '10'); await page.waitForTimeout(250);
  check((await page.getAttribute('.cpf .cpf-hist', 'aria-label')).includes('10 bins from 82.8 to 164.6'), 'profiler: fixed histogram bins');
  await page.selectOption('.cpf .cpf-bins', 'auto'); await page.waitForTimeout(250);
  check((await page.getAttribute('.cpf .cpf-hist', 'aria-label')).includes('7 bins'), 'profiler: automatic bins (7, as numpy)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cpf .cpf-csv')]); const f = OUT + 'prof.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'example-profile.csv' && rows.length === 9 && rows[0].startsWith('column,type,present,missing') && rows[4].startsWith('height_cm,number,39,2,33,43.66666667'), 'profiler: column statistics CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cpf .cpf-html')]); const f = OUT + 'prof.html'; await d.saveAs(f); const h = readFileSync(f, 'utf8');
    check(h.startsWith('<!doctype html>') && !h.includes('<script') && (h.match(/<img src="data:image\/png/g) || []).length === 9 && h.includes('<h2>height_cm (number)</h2>') && h.includes('Correlations'), 'profiler: HTML report, 9 pictures, no scripts'); }
  for (const [ff, ext] of [['pdf', 'pdf'], ['docx', 'docx'], ['png', 'png']]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cpf .dl [data-f=${ff}]`)]); const f = OUT + 'prof.' + ext; await d.saveAs(f); const b = readFileSync(f);
    check(b.length > 5000 && (ext !== 'pdf' || b.subarray(0, 4).toString() === '%PDF'), `profiler: ${ext} report (${b.length} bytes)`);
  }
  // A file with a semicolon, no header, a mostly-number column and an all-missing column.
  writeFileSync(OUT + 'sales.csv', 'id,amount,flag,empty\n1,10,TRUE,\n2,12.5,false,\n3,n/d,true,\n4,14,FALSE,NA\n5,15,true,\n6,16,false,\n');
  await page.setInputFiles('.cpf .dfb-in', OUT + 'sales.csv'); await page.waitForTimeout(900);
  { const t = await T('.cpf-notes'); check((await T('.cpf-big')) === '6 rows × 4 columns' && t.includes('amount: 5 of 6 values are numbers but 1 are not (for example "n/d")') && t.includes('empty: Every value is missing.') && !(await page.isVisible('.cpf .cpf-corr-card')), `profiler: opened file, mixed and empty columns (${t.slice(0, 120)})`); }
  { const row = await page.$$eval('.cpf .cpf-sum tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent))); check(row[2][1] === 'yes/no' && row[3][1] === 'empty' && row[0][1] === 'number', 'profiler: yes/no and empty column types'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cpf .cpf-csv')]); check(d.suggestedFilename() === 'sales-profile.csv', 'profiler: download named after the file'); }
  await page.fill('.cpf .cpf-in', '1\t2\n3\t4\n5\t6'); await page.waitForTimeout(600);
  check((await T('.cpf-facts')).includes('none in the first row') && (await T('.cpf-big')) === '3 rows × 2 columns' && await page.isVisible('.cpf .cpf-corr-card'), 'profiler: pasted numbers with no header row');
  await page.fill('.cpf .cpf-in', 'a,b'); await page.waitForTimeout(600);
  check((await T('.cpf-err')).includes('at least one row of data') && await page.isHidden('.cpf .cpf-out'), 'profiler: header only message');
  await page.fill('.cpf .cpf-in', ''); await page.waitForTimeout(600);
  check((await T('.cpf-err')).includes('Paste a table or open a file'), 'profiler: empty box message');
  await page.click('.cpf .cpf-ex'); await page.waitForTimeout(400);
  check((await T('.cpf-big')) === '41 rows × 8 columns' && await page.isHidden('.cpf .cpf-err'), 'profiler: load the example again');
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.screenshot({ path: OUT + 'csv-profiler-375.png', fullPage: true });
  await page.setViewportSize(vp0);
};
