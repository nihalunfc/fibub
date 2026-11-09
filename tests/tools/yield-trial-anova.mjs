// #386 yield trial ANOVA and LSD
export const path = '/science/yield-trial-anova/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/yield-trial-anova/`); await page.waitForTimeout(600);
  const r = '.yta ';
  const big = () => page.textContent(r + '.ya-big'), facts = () => page.textContent(r + '.ya-facts');
  check((await big()) === 'F = 86.77, p < 0.001', 'yield anova: example RCBD F on load');
  { const t = await facts(); check(t.includes('Grand mean4.445') && t.includes('CV2.7 %') && t.includes('LSD 5 %0.188') && t.includes('Error df12') && t.includes('SE of a mean0.061'), `yield anova: example facts (${t})`); }
  { const t = await page.textContent(r + '.ya-mt'); check(t.includes('1Variety B45.225a') && t.includes('3Variety A44.300c') && t.includes('5Variety C43.750d'), 'yield anova: means and letters'); }
  check((await page.textContent(r + '.ya-tab')).includes('Blocks31.47350.491232.93< 0.001') && await page.isVisible(r + '.ya-fig'), 'yield anova: ANOVA table and figure');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.ya-csv')]); const f = OUT + 'ya.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.startsWith('treatment,plots,mean,group\nVariety B,4,5.2250000,a') && t.includes('Error,12,0.17900000') && t.includes('lsd_5_percent,0.188166'), 'yield anova: CSV'); }
  await page.selectOption(r + '.ya-alpha', '0.01'); await page.waitForTimeout(150);
  check((await facts()).includes('LSD 1 %0.264'), 'yield anova: LSD at 1 %');
  await page.selectOption(r + '.ya-alpha', '0.05'); await page.selectOption(r + '.ya-design', 'crd'); await page.waitForTimeout(150);
  { const t = await facts(); const m = await page.textContent(r + '.ya-mt'); check((await big()) === 'F = 11.75, p < 0.001' && t.includes('LSD 5 %0.500') && t.includes('CV7.5 %') && m.includes('Variety D44.775ab') && await page.isHidden(r + '.ya-cbl'), 'yield anova: as CRD'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(r + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'yield-anova-crd.docx', 'yield anova: Word report'); }
  // A Latin square from a CSV file through Open a file.
  writeFileSync(OUT + 'latin.csv', 'row,col,trt,yield\n' + [['1','1','A',10.1],['1','2','B',12.0],['1','3','C',9.2],['1','4','D',11.5],['2','1','B',12.6],['2','2','C',9.9],['2','3','D',11.1],['2','4','A',10.4],['3','1','C',8.8],['3','2','D',12.2],['3','3','A',10.0],['3','4','B',13.1],['4','1','D',11.9],['4','2','A',9.7],['4','3','B',12.4],['4','4','C',9.5]].map((x) => x.join(',')).join('\n'));
  await page.selectOption(r + '.ya-design', 'latin');
  await page.setInputFiles(r + '.dfb-in', OUT + 'latin.csv'); await page.waitForTimeout(500);
  check((await page.inputValue(r + '.ya-ct')) === '2' && (await page.inputValue(r + '.ya-cb')) === '0' && (await page.inputValue(r + '.ya-cc')) === '1' && (await page.inputValue(r + '.ya-cy')) === '3', 'yield anova: columns picked from the header');
  check((await big()) === 'F = 33.40, p < 0.001' && (await page.textContent(r + '.ya-tab')).includes('Columns30.42500.14170.560.662') && (await facts()).includes('LSD 5 %0.87'), 'yield anova: Latin square = statsmodels');
  // Protected LSD with no significant F.
  await page.selectOption(r + '.ya-design', 'rcbd');
  await page.fill(r + '.ya-in', 'trt\tblock\ty\nA\t1\t5.3\nA\t2\t4.8\nA\t3\t5.1\nB\t1\t4.85\nB\t2\t5.15\nB\t3\t5.35\nC\t1\t5.2\nC\t2\t5.4\nC\t3\t4.9'); await page.waitForTimeout(500);
  check((await page.textContent(r + '.ya-say')).includes('No significant difference') && (await page.textContent(r + '.ya-mt')).match(/a/g).length >= 3, 'yield anova: protected LSD, one group');
  await page.uncheck(r + '.ya-prot'); await page.waitForTimeout(150);
  check(!(await page.textContent(r + '.ya-say')).includes('all means share'), 'yield anova: unprotected LSD');
  // Errors.
  await page.fill(r + '.ya-in', 'trt\tblock\ty\nA\t1\t5\nB\t1\t6\nA\t2\t5.5'); await page.waitForTimeout(500);
  check((await page.textContent(r + '.ya-err')).includes('B is missing from block 2') && await page.isHidden(r + '.ya-out'), 'yield anova: missing plot message');
  await page.fill(r + '.ya-in', 'trt\ty\nA\t5\nA\t6'); await page.waitForTimeout(500);
  check((await page.textContent(r + '.ya-err')).includes('at least 3 plots'), 'yield anova: too few plots message');
  await page.click(r + '.ya-ex'); await page.waitForTimeout(150);
  check((await big()) === 'F = 86.77, p < 0.001', 'yield anova: example button restores');
};
