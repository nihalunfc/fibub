// #807 response to reviewers builder
export const path = '/science/reviewer-response/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/reviewer-response/`); await page.waitForTimeout(500);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-reviewer-response-v1'); } catch {} });
  await page.reload(); await page.waitForTimeout(500);
  const ids = () => page.$$eval('.rvr .rr-pt', (els) => els.map((e) => e.dataset.id).join());
  check((await ids()) === 'R1.0,R1.1,R1.2,R1.3,R1.4,R2.1,R2.2,R2.3', `reviewers: example split (${await ids()})`);
  check((await page.textContent('.rvr .rr-prog')).startsWith('0 of 8 points answered') && (await page.textContent('.rvr .rr-list')).includes('Major comments') && (await page.textContent('.rvr .rr-list')).includes('Reviewer 2 (3 points)'), 'reviewers: progress and groups');
  check(await page.evaluate(() => localStorage.getItem('fibub-reviewer-response-v1')) === null, 'reviewers: nothing stored by default');
  await page.fill('.rvr .rr-pt[data-id="R1.1"] .rr-resp', 'We added six plants per group (n = 12) & repeated the analysis.');
  await page.fill('.rvr .rr-pt[data-id="R1.1"] .rr-chg', 'Methods, lines 80-85.');
  check((await page.textContent('.rvr .rr-prog')).startsWith('1 of 8') && (await page.getAttribute('.rvr .rr-pt[data-id="R1.1"]', 'class')).includes('done'), 'reviewers: answering a point');
  await page.fill('.rvr .rr-title', 'Plant growth under three light levels'); await page.fill('.rvr .rr-id', 'MS-2026-001');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rvr .rr-tex')]); const f = OUT + 'resp.tex'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(d.suggestedFilename() === 'response-MS-2026-001.tex' && t.includes('\\paragraph{Comment R1.1}') && t.includes('\\textbf{Response:} We added six plants per group (n = 12) \\& repeated the analysis.') && t.includes('(MS-2026-001)') && t.includes('[Response to be written.]'), 'reviewers: LaTeX download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rvr .rr-md')]); const f = OUT + 'resp.md'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('**Changes in the manuscript:** Methods, lines 80-85.'), 'reviewers: Markdown download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rvr .rr-exp [data-f="docx"]')]); const f = OUT + 'resp.docx'; await d.saveAs(f); const b = readFileSync(f); check(d.suggestedFilename() === 'response-MS-2026-001.docx' && b[0] === 0x50 && b[1] === 0x4b && b.length > 2000, 'reviewers: Word download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rvr .rr-exp [data-f="pdf"]')]); check(d.suggestedFilename().endsWith('.pdf'), 'reviewers: PDF download'); }
  await page.click('.rvr .rr-copy'); await page.waitForTimeout(150);
  check((await page.textContent('.rvr .rr-msg')) === 'Copied.', 'reviewers: copy LaTeX');
  // Keeping the draft.
  await page.check('.rvr .rr-keep'); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-reviewer-response-v1') || '')).includes('six plants'), 'reviewers: draft kept when ticked');
  await page.reload(); await page.waitForTimeout(600);
  check((await page.inputValue('.rvr .rr-pt[data-id="R1.1"] .rr-resp')).startsWith('We added six plants') && await page.isChecked('.rvr .rr-keep') && (await page.inputValue('.rvr .rr-id')) === 'MS-2026-001' && (await page.textContent('.rvr .rr-saved')).includes('loaded'), 'reviewers: draft restored after reload');
  await page.uncheck('.rvr .rr-keep'); await page.waitForTimeout(100);
  check(await page.evaluate(() => localStorage.getItem('fibub-reviewer-response-v1')) === null, 'reviewers: unticking deletes the draft');
  await page.check('.rvr .rr-keep'); await page.click('.rvr .rr-clear'); await page.waitForTimeout(400);
  check(await page.evaluate(() => localStorage.getItem('fibub-reviewer-response-v1')) === null && (await page.inputValue('.rvr .rr-in')) === '' && await page.isHidden('.rvr .rr-out') && !(await page.isChecked('.rvr .rr-keep')), 'reviewers: clear draft');
  // Other shapes.
  await page.fill('.rvr .rr-in', 'Editor comments:\nPlease shorten the abstract.\n\nReferee #2:\n(a) First lettered point\n(b) Second\nMinor issues\nComment 7: typo on page 3'); await page.waitForTimeout(500);
  check((await ids()) === 'E.1,R2.1,R2.2,R2.3' && (await page.textContent('.rvr .rr-list')).includes('Minor issues'), `reviewers: editor and lettered points (${await ids()})`);
  await page.fill('.rvr .rr-in', '   \n'); await page.waitForTimeout(500);
  check(await page.isHidden('.rvr .rr-out') && await page.isHidden('.rvr .rr-err'), 'reviewers: empty box');
  await page.setInputFiles('.rvr .rr-file', { name: 'r.txt', mimeType: 'text/plain', buffer: Buffer.from('Reviewer 1\n1. One\n2. Two\nReviewer 2\n1. Three') }); await page.waitForTimeout(400);
  check((await ids()) === 'R1.1,R1.2,R2.1', 'reviewers: open a text file');
  await page.setInputFiles('.rvr .rr-file', { name: 'r.pdf', mimeType: 'application/pdf', buffer: Buffer.from([0x25, 0x50, 0, 0, 1]) }); await page.waitForTimeout(300);
  check((await page.textContent('.rvr .rr-ferr')).includes('not a text file'), 'reviewers: binary file refused');
  await page.click('.rvr .rr-ex'); await page.waitForTimeout(300);
};
