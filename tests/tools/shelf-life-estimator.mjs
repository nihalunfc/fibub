// #392 water activity and shelf-life estimator
export const path = '/science/shelf-life-estimator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const S = '.shelf ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await page.textContent(S + '.sl-big1')) === '720 days at 5 °C', 'shelf life: default Q10 2 shift');
  await page.click(S + '.sl-ex'); await page.waitForTimeout(200);
  check((await page.textContent(S + '.sl-big1')) === '1125 days at 5 °C' && (await page.textContent(S + '.sl-tab1')).includes('50 °C'), 'shelf life: example Q10 shift and table');
  check((await page.textContent(S + '.sl-big2')) === 'At 20 °C: 276 days (Q10 model), 289 days (Arrhenius)', 'shelf life: example predictions');
  { const t = await page.textContent(S + '.sl-facts'); check(t.includes('Fitted Q102.37') && t.includes('68.1 kJ/mol') && t.includes('Q10 from Ea at 20 °C2.51') && t.includes('0.9999'), 'shelf life: fitted Q10 and Ea'); }
  check(await page.isVisible(S + '.sl-fig'), 'shelf life: chart shown');
  check((await page.textContent(S + '.sl-big3')).includes('From ERH 85 %: aw = 0.850') && (await page.textContent(S + '.sl-big3')).includes('aw = 0.9694'), 'water activity: ERH and Norrish');
  await page.fill(S + '.sl-k', '6'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-big3')).includes('aw = 0.9640'), 'water activity: Norrish constant used');
  await page.selectOption(S + '.sl-unit', 'weeks'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.sl-big1')).endsWith('weeks at 5 °C') && (await page.textContent(S + '.sl-tab2')).includes('Measured (weeks)'), 'shelf life: time unit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.sl-csv')]); const f = OUT + 'sl.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('temperature_C,shelf_life_weeks') && t.includes('q10,2.37171') && t.includes('Ea_J_per_mol,68097.5'), 'shelf life: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'shelf-life.pdf', 'shelf life: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'shelf-life.docx', 'shelf life: Word download'); }
  await page.fill(S + '.sl-pts', '25, 180\n35, 75'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-facts')).includes('Fitted Q102.4') && (await page.textContent(S + '.sl-facts')).includes('R² (Q10 model)1.0000'), 'shelf life: two points give exact Q10');
  await page.fill(S + '.sl-pts', '30, 10\n30, 20'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-err2')).includes('two different temperatures') && await page.isHidden(S + '.sl-out2'), 'shelf life: one temperature refused');
  await page.fill(S + '.sl-pts', '30, x'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-err2')).includes('needs a temperature and a shelf life'), 'shelf life: bad row message');
  await page.fill(S + '.sl-q10', '0.5'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-err1')).includes('below 1'), 'shelf life: Q10 below 1 warning');
  await page.fill(S + '.sl-q10', ''); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-err1')).includes('Fill in all five'), 'shelf life: empty box message');
  await page.fill(S + '.sl-erh', '120'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-err3')).includes('0 to 100'), 'water activity: ERH over 100 refused');
  writeFileSync(OUT + 'sl.csv', 'Temperature,Days\n20,100\n30,50\n40,25\n');
  await page.setInputFiles(S + '.dfb-in', OUT + 'sl.csv'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sl-facts')).includes('Fitted Q102'), 'shelf life: open a CSV file with a header');
  await page.click(S + '.sl-ex'); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.shelf').screenshot({ path: OUT + 'shelf-375.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
