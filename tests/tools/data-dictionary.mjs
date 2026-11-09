// #817 data dictionary
import { tableToXlsx } from '../../src/lib/convert/table.ts';
export const path = '/science/data-dictionary/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/data-dictionary/`); await page.waitForTimeout(500);
  const out = () => page.inputValue('.ddg .ddg-out');
  check((await page.textContent('.ddg .ddg-big')) === '12 rows, 9 columns, 11 missing cells' && await page.locator('.ddg .ddg-col').count() === 9, 'datadict: example profiled');
  { const t = await page.locator('.ddg .ddg-col').nth(4).textContent(); check(t.includes('temp_c') && t.includes('2 of 12 (16.7 %)') && t.includes('9.8 to 17.2') && t.includes('13.45 ± 2.515') && t.includes('Median13.3'), 'datadict: number column facts'); }
  { const t = await page.locator('.ddg .ddg-col').nth(2).textContent(); check(t.includes('text, categories') && t.includes('Allowed values: forest (4), grassland (4), wetland (4)'), 'datadict: categories'); }
  check((await page.locator('.ddg .ddg-col').nth(7).textContent()).includes('leading zeros'), 'datadict: warning for codes');
  check((await out()).includes('| temp_c | number |  |  | 2 (16.7 %) | 10 | 9.8 to 17.2 | 13.45 ± 2.515 | e.g. 11.5, 13.0, 10.2 |'), 'datadict: Markdown export');
  // Describe a column.
  await page.locator('.ddg .ddg-m-title[data-col=temp_c]').scrollIntoViewIfNeeded();
  await page.fill('.ddg .ddg-m-title[data-col=temp_c]', 'Air temperature'); await page.fill('.ddg .ddg-m-description[data-col=temp_c]', 'Shade, 1.5 m above ground'); await page.fill('.ddg .ddg-m-unit[data-col=temp_c]', '°C');
  await page.fill('.ddg .ddg-name', 'Bird survey'); await page.waitForTimeout(100);
  check((await out()).startsWith('# Data dictionary: Bird survey') && (await out()).includes('| temp_c (Air temperature) | number | °C | Shade, 1.5 m above ground |'), 'datadict: descriptions and units in the export');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ddg .ddg-dl')]); check(d.suggestedFilename() === 'Bird-survey-dictionary.md', 'datadict: Markdown download'); }
  await page.click('.ddg .ddg-fmt [data-f=csv]'); await page.waitForTimeout(100);
  check((await out()).split('\n')[5] === 'temp_c,Air temperature,"Shade, 1.5 m above ground",number,°C,2,16.7,10,9.8 to 17.2,13.45,2.51496,13.3,examples,"11.5, 13.0, 10.2",', 'datadict: CSV export');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ddg .ddg-dl')]); const f = OUT + 'dd.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').replace(/^﻿/, '').split('\n').length === 11, 'datadict: CSV download'); }
  await page.click('.ddg .ddg-fmt [data-f=json]'); await page.waitForTimeout(100);
  { const s = JSON.parse(await out()); check(s.fields.length === 9 && s.fields[4].unit === '°C' && s.fields[4].description === 'Shade, 1.5 m above ground. Unit: °C.' && s.fields[2].constraints.enum.length === 3 && s.missingValues.includes('NA'), 'datadict: Table Schema export'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ddg .ddg-dl')]); check(d.suggestedFilename() === 'Bird-survey.schema.json', 'datadict: JSON download'); }
  // Missing codes change the result; notes survive.
  await page.fill('.ddg .ddg-miss', 'NA, windy'); await page.waitForTimeout(500);
  check((await page.textContent('.ddg .ddg-big')) === '12 rows, 9 columns, 12 missing cells' && (await page.inputValue('.ddg .ddg-m-unit[data-col=temp_c]')) === '°C', 'datadict: custom missing codes, notes kept');
  // An Excel file.
  writeFileSync(OUT + 'dd.xlsx', tableToXlsx([['id', 'when', 'ok', 'mass_g'], ['1', '2025-01-02', 'yes', '1.5'], ['2', '2025-01-03', 'no', '-999'], ['3', '2025-01-04', 'yes', '2.5']]));
  await page.fill('.ddg .ddg-miss', '-999');
  await page.setInputFiles('.ddg .dfb-in', OUT + 'dd.xlsx'); await page.waitForTimeout(700);
  check((await page.textContent('.ddg .ddg-big')) === '3 rows, 4 columns, 1 missing cell' && (await page.locator('.ddg .ddg-col').nth(2).textContent()).includes('true/false'), 'datadict: Excel file opened');
  // No header row.
  await page.uncheck('.ddg .ddg-head'); await page.waitForTimeout(200);
  check((await page.textContent('.ddg .ddg-col code')) === 'column_1' && (await page.textContent('.ddg .ddg-big')).startsWith('4 rows'), 'datadict: no header row');
  await page.check('.ddg .ddg-head');
  // Bad input.
  await page.click('.ddg .ddg-clear'); await page.waitForTimeout(300);
  check((await page.textContent('.ddg .ddg-err')) === 'Paste a table or open a file first.' && await page.isHidden('.ddg .ddg-res'), 'datadict: empty box');
  await page.fill('.ddg .ddg-in', 'a,b,c'); await page.waitForTimeout(400);
  check((await page.textContent('.ddg .ddg-err')).startsWith('There is only one row.'), 'datadict: header only');
  await page.click('.ddg .ddg-ex'); await page.waitForTimeout(200);
  check(await page.locator('.ddg .ddg-col').count() === 9, 'datadict: example again');
};
