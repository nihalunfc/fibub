// #1765 Excel viewer
import { makeXlsx } from '../lib/officekit.mjs';
import { text as pdfText, saved, pages } from '../lib/pdfkit.mjs';
export const path = '/documents/excel-viewer/';
const R = 'xmlns="http://schemas.openxmlformats.org/package/2006/relationships"';
const cell = (r, v) => (/^\d+$/.test(v) ? `<c r="${r}"><v>${v}</v></c>` : `<c r="${r}" t="inlineStr"><is><t>${v}</t></is></c>`);
const sheet = (rows, hiddenRow = 0, hiddenCol = 0) => `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${hiddenCol ? `<cols><col min="${hiddenCol}" max="${hiddenCol}" width="9" hidden="1"/></cols>` : ''}<sheetData>${rows.map((row, i) => `<row r="${i + 1}"${hiddenRow === i + 1 ? ' hidden="1"' : ''}>${row.map((v, j) => cell(String.fromCharCode(65 + j) + (i + 1), v)).join('')}</row>`).join('')}</sheetData></worksheet>`;
const wb = '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sales" sheetId="1" r:id="rId1"/><sheet name="Costs" sheetId="2" r:id="rId2"/><sheet name="Secret" sheetId="3" state="hidden" r:id="rId3"/></sheets></workbook>';
const rels = `<Relationships ${R}><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="t"/><Relationship Id="rId2" Target="worksheets/sheet2.xml" Type="t"/><Relationship Id="rId3" Target="worksheets/sheet3.xml" Type="t"/></Relationships>`;
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  const xlsx = makeXlsx(wb, sheet([['Region', 'Units', 'Note'], ['North', '10', 'a'], ['South', '20', 'b'], ['East', '30', 'c']], 3, 3), {
    'xl/_rels/workbook.xml.rels': rels, 'xl/worksheets/sheet2.xml': sheet([['Item', 'Cost'], ['Rent', '500']]), 'xl/worksheets/sheet3.xml': sheet([['Hidden', 'data']]),
  });
  await page.setInputFiles('.xv-file', { name: 'book.xlsx', mimeType: 'application/octet-stream', buffer: xlsx });
  await page.waitForSelector('.xv-grid td', { timeout: 10000 });
  const tabs = await page.$$eval('.xv-tabs button', (b) => b.map((x) => x.textContent));
  check(tabs.length === 3 && tabs[2].includes('hidden'), `excel-viewer: 3 sheet tabs, hidden one marked (${tabs.join('|')})`);
  check((await page.textContent('.xv-info')).includes('1 row, 1 column'), 'excel-viewer: hidden row and column counted');
  check((await page.$$('.xv-grid td.hid')).length >= 4 && (await page.textContent('.xv-grid tbody')).includes('South'), 'excel-viewer: hidden cells marked in the grid');
  const csv = await saved(page, () => page.click('.xv-csv'));
  const lines = csv.buf.toString('utf8').replace(/^﻿/, '').trim().split(/\r?\n/);
  check(lines.length === 4 && lines[0] === 'Region,Units,Note', 'excel-viewer: CSV of sheet 1 has 4 rows');
  await page.check('.xv-skip');
  const csv2 = await saved(page, () => page.click('.xv-csv'));
  const l2 = csv2.buf.toString('utf8').replace(/^﻿/, '').trim().split(/\r?\n/);
  check(l2.length === 3 && l2[0] === 'Region,Units', 'excel-viewer: CSV can leave out hidden row and column');
  const pdf = await saved(page, () => page.click('.xv-pdf'));
  check(await pages(pdf.buf) === 1 && (await pdfText(pdf.buf)).join(' ').includes('Region'), 'excel-viewer: PDF has the header text');
  await page.click('.xv-tabs button:nth-child(2)');
  check((await page.textContent('.xv-grid tbody')).includes('Rent'), 'excel-viewer: second sheet shows its rows');
};
