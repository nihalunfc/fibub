// #820 data management plan builder
export const path = '/science/data-management-plan/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const dlg = (d) => d.accept(); page.on('dialog', dlg);
  await page.goto(`${BASE}/science/data-management-plan/`); await page.evaluate(() => { localStorage.removeItem('fibub-dmp-v1'); localStorage.removeItem('fibub-dmp-keep-v1'); });
  await page.reload(); await page.waitForTimeout(300);
  const big = () => page.textContent('.dmp .dm-big');
  const sec = (id) => `.dmp .dm-sec[data-id="${id}"]`;
  check((await big()) === '0 words, 0 of 8 sections written' && (await page.locator('.dmp .dm-sec').count()) === 8 && await page.isChecked('.dmp .dm-keep'), 'dmp: starts empty with eight sections, keep ticked');
  await page.click(`${sec('data')} .dm-q summary`);
  check((await page.locator(`${sec('data')} .dm-q li`).count()) === 5 && await page.isVisible(`${sec('data')} .dm-q li >> nth=0`), 'dmp: questions to answer open');
  await page.click('.dmp .dm-ex'); await page.waitForTimeout(100);
  check((await big()) === '339 words, 8 of 8 sections written', 'dmp: example totals');
  check((await page.textContent(`${sec('data')} .dm-count`)) === '81 of 120 words' && (await page.textContent(`${sec('docs')} .dm-count`)) === '45 words', 'dmp: per-section counts with and without a limit');
  await page.fill(`${sec('ethics')} .dm-limit`, '40'); await page.waitForTimeout(100);
  check((await page.textContent(`${sec('ethics')} .dm-count`)) === '49 of 40 words, 9 over' && (await big()).endsWith('1 over the word limit') && (await page.textContent('.dmp .dm-tab')).includes('9 words over'), 'dmp: over the word limit');
  await page.fill(`${sec('costs')} .dm-text`, ''); await page.waitForTimeout(100);
  check((await big()).startsWith('312 words, 7 of 8') && (await page.textContent('.dmp .dm-tab')).includes('Not written yet'), 'dmp: an emptied section');
  await page.fill(`${sec('costs')} .dm-text`, 'Storage is free.\n\nTen days of time.'); await page.waitForTimeout(100);
  check((await page.textContent(`${sec('costs')} .dm-count`)) === '7 words', 'dmp: typing updates the count');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dmp .dm-md')]); const f = OUT + 'dmp.md'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(d.suggestedFilename() === 'Soil-life-in-city-allotment-gardens-made-up-example.md' && t.startsWith('# Soil life') && t.includes('## Costs and resources\n\nStorage is free.\n\nTen days of time.') && t.includes('- **Date:** 2026-11-09'), 'dmp: Markdown download'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dmp .dl [data-f=${f}]`)]); const p = OUT + 'dmp.' + f; await d.saveAs(p); const b = readFileSync(p); check(b.length > 2000 && (f !== 'pdf' || b.slice(0, 4).toString() === '%PDF'), `dmp: ${f} download`); }
  // Kept in this browser: reload and it is back.
  await page.reload(); await page.waitForTimeout(300);
  check((await page.inputValue(`${sec('costs')} .dm-text`)) === 'Storage is free.\n\nTen days of time.' && (await page.inputValue(`${sec('ethics')} .dm-limit`)) === '40' && (await page.textContent('.dmp .dm-note')).includes('saved draft'), 'dmp: draft kept in this browser');
  await page.uncheck('.dmp .dm-keep'); await page.waitForTimeout(100);
  check(await page.evaluate(() => localStorage.getItem('fibub-dmp-v1')) === null && (await page.textContent('.dmp .dm-note')).includes('deleted'), 'dmp: unticking deletes the saved draft');
  await page.fill(`${sec('roles')} .dm-text`, 'Someone.'); await page.reload(); await page.waitForTimeout(300);
  check(!(await page.isChecked('.dmp .dm-keep')) && (await big()) === '0 words, 0 of 8 sections written', 'dmp: nothing saved while unticked');
  // Open the downloaded Markdown.
  await page.setInputFiles('.dmp .dm-file', OUT + 'dmp.md'); await page.waitForTimeout(300);
  check((await big()) === '319 words, 8 of 8 sections written' && (await page.inputValue('.dmp .dm-title')).startsWith('Soil life') && (await page.inputValue('.dmp .dm-date')) === '2026-11-09' && (await page.textContent('.dmp .dm-note')).includes('8 of 8 sections found'), 'dmp: opens its own Markdown');
  writeFileSync(OUT + 'bad.md', '# Notes\nJust some text\n'); await page.setInputFiles('.dmp .dm-file', OUT + 'bad.md'); await page.waitForTimeout(200);
  check((await page.textContent('.dmp .dm-err')).includes('No section headings') && (await big()).startsWith('319'), 'dmp: a file without headings is refused');
  writeFileSync(OUT + 'part.md', '## Storage and backup\nOn the lab server.\n## Timeline\nx\n'); await page.setInputFiles('.dmp .dm-file', OUT + 'part.md'); await page.waitForTimeout(200);
  check((await page.textContent('.dmp .dm-note')).includes('1 of 8 sections found') && (await page.textContent('.dmp .dm-note')).includes('Timeline') && (await big()) === '4 words, 1 of 8 sections written', 'dmp: partial file and unknown headings');
  await page.check('.dmp .dm-keep'); await page.click('.dmp .dm-clear'); await page.waitForTimeout(100);
  check((await big()) === '0 words, 0 of 8 sections written' && await page.evaluate(() => localStorage.getItem('fibub-dmp-v1')) === null && (await page.inputValue('.dmp .dm-title')) === '', 'dmp: start again clears the page');
  await page.evaluate(() => { localStorage.removeItem('fibub-dmp-v1'); localStorage.removeItem('fibub-dmp-keep-v1'); });
  page.off('dialog', dlg);
};
