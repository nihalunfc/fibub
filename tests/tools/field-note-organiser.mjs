// #763 Field note organiser: browser checks.
export const path = '/science/field-note-organiser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const accept = (d) => d.accept().catch(() => {});
  page.on('dialog', accept);
  const vp0 = page.viewportSize();
  page.setDefaultTimeout(120000); // slow shared test machines
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto(BASE + path); await page.waitForTimeout(700);
  await page.evaluate(() => localStorage.removeItem('fibub-fieldnotes-v1'));
  await page.reload(); await page.waitForTimeout(600);
  const cards = () => page.$$eval('.fn-note h3', (h) => h.map((x) => x.textContent));
  const chipsOf = (sel) => page.$$eval(sel + ' button', (b) => b.map((x) => x.textContent));
  const click = async (sel) => { const l = page.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await l.click(); await page.waitForTimeout(150); };

  check(!(await page.isChecked('.fn-keep')) && /No notes yet/.test(await page.textContent('.fn-list')), 'fn: starts empty, keeping off');
  check((await page.inputValue('.fn-date')).match(/^\d{4}-\d{2}-\d{2}$/) !== null, 'fn: date starts as today');
  await click('.fn-sample');
  check((await cards()).join('|') === '2026-10-05 · Ferry landing|2026-10-03 · Tea stall|2026-10-02 · Harbour market', 'fn: example notes newest first');
  check((await chipsOf('.fn-tagc')).join('|') === 'trade · 3|kinship · 1|morning · 1|transport · 1' && (await chipsOf('.fn-pc')).join('|') === 'Fisher A · 2|Vendor B · 2|Ferry worker C · 1', 'fn: tag and people counts');
  await page.fill('.fn-q', 'fisher trade'); await page.waitForTimeout(1000);
  check((await cards()).length === 2 && /Showing 2 of 3/.test(await page.textContent('.fn-shown')), 'fn: search needs every word');
  await click('.fn-reset');
  await click('.fn-tagc button:has-text("kinship")');
  check((await cards()).join() === '2026-10-03 · Tea stall' && (await page.inputValue('.fn-ftag')) === 'kinship', 'fn: tag chip filters');
  await click('.fn-tagc button:has-text("kinship")'); check((await cards()).length === 3, 'fn: tap again clears');
  await page.selectOption('.fn-fplace', 'Harbour market'); await page.waitForTimeout(200);
  check((await cards()).length === 1, 'fn: place filter');
  await click('.fn-reset');
  await page.fill('.fn-from', '2026-10-03'); await page.fill('.fn-to', '2026-10-04'); await page.waitForTimeout(1000);
  check((await cards()).join() === '2026-10-03 · Tea stall', 'fn: date range');
  await click('.fn-reset');

  // CSV of the kinship note
  await page.selectOption('.fn-ftag', 'kinship'); await page.waitForTimeout(200);
  const [c] = await Promise.all([page.waitForEvent('download'), click('.fn-x[data-f="csv"]')]);
  const csv = readFileSync(await c.path(), 'utf8');
  check(/^field-notes-\d{4}-\d{2}-\d{2}\.csv$/.test(c.suggestedFilename()) && csv.startsWith('﻿date,place,people,tags,text\r\n2026-10-03,Tea stall,Vendor B,kinship; trade,') && csv.trim().split('\r\n').length === 2, 'fn: CSV of the notes shown');
  await page.selectOption('.fn-which', 'all');
  const [m] = await Promise.all([page.waitForEvent('download'), click('.fn-x[data-f="md"]')]);
  const md = readFileSync(await m.path(), 'utf8');
  check(md.startsWith('# Field notes\n\n## 2026-10-05 · Ferry landing') && (md.match(/^## /gm) || []).length === 3, 'fn: Markdown of all notes');
  const [j] = await Promise.all([page.waitForEvent('download'), click('.fn-x[data-f="json"]')]);
  const jsonPath = OUT + 'fn-export.json'; writeFileSync(jsonPath, readFileSync(await j.path()));
  check(JSON.parse(readFileSync(jsonPath, 'utf8')).notes.length === 3, 'fn: JSON of all notes');
  await click('.fn-reset');

  // Write, validate, edit, delete
  await page.fill('.fn-text', ''); await click('.fn-save');
  check(/Write something/.test(await page.textContent('.fn-ferr')), 'fn: empty note message');
  await page.fill('.fn-date', '2026-10-07'); await page.fill('.fn-place', 'School yard'); await page.fill('.fn-people', 'Teacher D, teacher d, Pupil E'); await page.fill('.fn-tags', '#education, trade');
  await page.fill('.fn-text', 'Break time; pupils traded stickers.'); await click('.fn-save');
  check((await cards())[0] === '2026-10-07 · School yard' && /People: Teacher D, Pupil E · Tags: education, trade/.test(await page.textContent('.fn-note')), 'fn: new note saved, lists tidied');
  check((await chipsOf('.fn-tagc'))[0] === 'trade · 4', 'fn: counts update');
  await click('.fn-note .fn-edit');
  check((await page.textContent('.fn-formh')) === 'Edit note from 2026-10-07' && (await page.inputValue('.fn-place')) === 'School yard', 'fn: edit fills the form');
  await page.fill('.fn-place', 'Playground'); await click('.fn-save');
  check((await cards())[0] === '2026-10-07 · Playground' && (await cards()).length === 4, 'fn: edit saved in place');
  await click('.fn-note .fn-del');
  check((await cards()).length === 3, 'fn: delete');

  // Keeping in the browser
  await page.check('.fn-keep'); await page.waitForTimeout(150);
  const kept = await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-fieldnotes-v1') || 'null'));
  check(kept && kept.notes.length === 3 && /kept in this browser/.test(await page.textContent('.fn-status')), 'fn: kept when ticked');
  await page.reload(); await page.waitForTimeout(600);
  check((await cards()).length === 3 && (await page.isChecked('.fn-keep')), 'fn: notes back after reload');
  await page.uncheck('.fn-keep'); await page.waitForTimeout(150);
  check((await page.evaluate(() => localStorage.getItem('fibub-fieldnotes-v1'))) === null, 'fn: unticking removes the saved copy');
  await click('.fn-clear');
  check((await cards()).length === 0 && /No notes yet/.test(await page.textContent('.fn-list')), 'fn: clear all');

  // Import
  await page.setInputFiles('.fn-file', jsonPath); await page.waitForTimeout(1000);
  check((await cards()).length === 3 && /Imported 3 notes/.test(await page.textContent('.fn-impnote')), 'fn: import JSON');
  await page.setInputFiles('.fn-file', jsonPath); await page.waitForTimeout(1000);
  check((await cards()).length === 3 && /Imported 0 notes.*3 already here/.test(await page.textContent('.fn-impnote')), 'fn: re-import skips duplicates');
  await page.setInputFiles('.fn-file', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{oops') });
  await page.waitForTimeout(300);
  check(/not valid JSON/.test(await page.textContent('.fn-imperr')), 'fn: bad file message');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: OUT + 'field-note-organiser-375.png', fullPage: false });
  page.setDefaultTimeout(30000);
  if (vp0) await page.setViewportSize(vp0);
  await click('.fn-clear');
  await page.evaluate(() => localStorage.removeItem('fibub-fieldnotes-v1'));
  page.off('dialog', accept);
};
