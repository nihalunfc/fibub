// #804 table converter
import { tableToXlsx } from '../../src/lib/convert/table.ts';
export const path = '/science/table-converter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/table-converter/`); await page.waitForTimeout(500);
  const out = () => page.inputValue('.tbc .tbc-out');
  check((await page.textContent('.tbc .tbc-info')) === 'Read 5 rows and 4 columns, split by tabs.', 'table: example read');
  check((await out()).includes('    E (50 \\textdegree{}C) & $-$0.4 & 62.375 & $9.995 \\times 10^{-4}$ \\\\') && (await out()).startsWith('\\begin{table}[htbp]') && (await page.textContent('.tbc .tbc-pkg')).includes('\\usepackage{booktabs}'), 'table: LaTeX booktabs output');
  check(await page.locator('.tbc .tbc-prev table tbody tr').count() === 4 && (await page.textContent('.tbc .tbc-prev')).includes('9.995 × 10−4'), 'table: preview table');
  await page.fill('.tbc .tbc-caption', 'Yields & rates'); await page.fill('.tbc .tbc-label', 'tab:y'); await page.waitForTimeout(300);
  check((await out()).includes('\\caption{Yields \\& rates}\n  \\label{tab:y}'), 'table: caption and label');
  await page.selectOption('.tbc .tbc-round', 'dp'); await page.fill('.tbc .tbc-n', '2'); await page.selectOption('.tbc .tbc-num', 'decimal'); await page.waitForTimeout(300);
  check((await out()).includes('S[table-format=-2.2] S[table-format=3.2] S[table-format=1.2e-1]') && (await out()).includes('D, heated & 1.01 & 7.05 & 2.68e-5') && (await out()).includes('& -0.40 & 62.38 & 1.00e-3') && (await page.textContent('.tbc .tbc-pkg')).includes('siunitx, booktabs'), 'table: rounding to 2 places and siunitx columns');
  await page.selectOption('.tbc .tbc-round', 'sig'); await page.fill('.tbc .tbc-n', '2'); await page.selectOption('.tbc .tbc-num', 'right'); await page.waitForTimeout(300);
  check((await out()).includes('A\\_1 (control) & 13 & 85 & $1.2 \\times 10^{-3}$'), 'table: significant figures');
  await page.uncheck('.tbc .tbc-booktabs'); await page.uncheck('.tbc .tbc-float'); await page.uncheck('.tbc .tbc-minus'); await page.waitForTimeout(200);
  check((await out()).startsWith('\\begin{tabular}{l r r r}\n  \\hline') && (await out()).includes('& -0.40 &') && await page.isDisabled('.tbc .tbc-caption'), 'table: plain tabular with \\hline, hyphen minus');
  await page.selectOption('.tbc .tbc-align', 'center'); await page.waitForTimeout(200);
  check((await out()).startsWith('\\begin{tabular}{c c c c}'), 'table: centred columns');
  await page.selectOption('.tbc .tbc-align', 'auto'); await page.selectOption('.tbc .tbc-round', 'asis');
  await page.click('.tbc .tbc-fmt [data-f=md]'); await page.waitForTimeout(200);
  check((await out()).startsWith('**Yields & rates**\n\n| Reaction') && (await out()).includes('| :------------ | ---------------: |') && (await page.textContent('.tbc .tbc-dl')) === 'Download .md' && await page.isHidden('.tbc .tbc-tex'), 'table: Markdown');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbc .tbc-dl')]); const f = OUT + 't.md'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('| E (50 °C)     |'), 'table: Markdown download'); }
  await page.click('.tbc .tbc-fmt [data-f=html]'); await page.waitForTimeout(200);
  check((await out()).startsWith('<table id="tab:y">\n  <caption>Yields &amp; rates</caption>') && (await out()).includes('<td>B &amp; C</td>'), 'table: HTML');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbc .tbc-dl')]); const f = OUT + 't.html'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('<th scope="col"'), 'table: HTML download'); }
  // No header row; CSV with quotes, pasted.
  await page.uncheck('.tbc .tbc-head'); await page.fill('.tbc .tbc-in', 'x,"1,5 apples"\ny,2\n'); await page.waitForTimeout(400);
  check((await page.textContent('.tbc .tbc-info')) === 'Read 2 rows and 2 columns, split by commas.' && (await out()).includes('<td>1,5 apples</td>') && !(await out()).includes('<thead>'), 'table: CSV with quotes, no header');
  await page.check('.tbc .tbc-head');
  // An Excel file through Open a file.
  writeFileSync(OUT + 'tab.xlsx', tableToXlsx([['Site', 'pH'], ['North', '7.25'], ['South', '6.8']]));
  await page.setInputFiles('.tbc .dfb-in', OUT + 'tab.xlsx'); await page.waitForTimeout(600);
  check((await page.textContent('.tbc .tbc-info')) === 'Read 3 rows and 2 columns, split by tabs.' && (await out()).includes('<td>North</td><td style="text-align:right">7.25</td>'), 'table: Excel file opened');
  await page.click('.tbc .tbc-fmt [data-f=latex]'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tbc .tbc-dl')]); const f = OUT + 't.tex'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('North & 7.25 \\\\'), 'table: LaTeX download'); }
  // Bad input.
  await page.selectOption('.tbc .tbc-round', 'sig'); await page.fill('.tbc .tbc-n', '0'); await page.waitForTimeout(300);
  check((await page.textContent('.tbc .tbc-err')) === 'Give 1 to 12 significant figures.' && (await out()) === '', 'table: bad number of figures');
  await page.selectOption('.tbc .tbc-round', 'asis');
  await page.click('.tbc .tbc-clear'); await page.waitForTimeout(200);
  check((await page.textContent('.tbc .tbc-err')) === 'Paste some cells or open a file first.' && await page.isDisabled('.tbc .tbc-copy'), 'table: empty box message');
  await page.click('.tbc .tbc-ex'); await page.waitForTimeout(200);
  check((await page.textContent('.tbc .tbc-info')).startsWith('Read 5 rows'), 'table: example again');
};
