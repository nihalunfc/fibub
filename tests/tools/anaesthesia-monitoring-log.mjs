// #400 anaesthesia monitoring log
export const path = '/science/anaesthesia-monitoring-log/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/anaesthesia-monitoring-log/`); await page.waitForTimeout(500);
  check((await page.$$('.aml .am-log tr')).length === 13 && (await page.inputValue('.aml .am-log tr:nth-child(3) input.t')) === '09:05' && await page.isHidden('.aml .am-out'), 'anaes: 12 blank rows every 5 min');
  check((await page.textContent('.aml .am-alerts')) === 'No alert ranges set.' && (await page.inputValue('.aml .am-r-hr-min')) === '', 'anaes: alert ranges blank by default');
  check(!(await page.textContent('.aml')).match(/dose|mg\/kg|drug/i), 'anaes: no dose or drug fields');
  await page.click('.aml .am-ex'); await page.waitForTimeout(300);
  check((await page.$$('.aml .am-log tr')).length === 10 && (await page.inputValue('.aml .am-log tr:nth-child(6) input.v-sap')) === '88', 'anaes: example record loaded');
  check((await page.textContent('.aml .am-alerts')) === 'No alert ranges set.' && (await page.$$('.aml input.out')).length === 0, 'anaes: no alerts without ranges');
  { const t = await page.textContent('.aml .am-sum'); check(t.includes('Heart rate (beats/min)98811298.44112102'), 'anaes: summary'); }
  await page.click('.aml .am-prac'); await page.waitForTimeout(300);
  { const t = await page.textContent('.aml .am-alerts'); check(t.startsWith('6 readings outside your ranges: 09:20 EtCO₂ 47 (above 45); 09:20 Systolic BP 88 (below 90); 09:20 Mean BP 58 (below 60)') && t.includes('09:30 Temperature 36.9 (below 37)') && (await page.$$('.aml input.out')).length === 6 && await page.isVisible('.aml .am-pnote'), 'anaes: practice ranges mark 6 readings'); }
  await page.fill('.aml .am-r-temp-min', ''); await page.waitForTimeout(300);
  check((await page.textContent('.aml .am-alerts')).startsWith('3 readings'), 'anaes: editing a range');
  await page.selectOption('.aml .am-g', '1'); await page.waitForTimeout(150);
  check((await page.getAttribute('.aml .am-fig', 'aria-label')) === 'Blood pressure over time', 'anaes: blood pressure chart');
  await page.selectOption('.aml .am-g', '4'); await page.waitForTimeout(150);
  check((await page.getAttribute('.aml .am-fig', 'aria-label')) === 'Temperature over time', 'anaes: temperature chart');
  // Typing in a row.
  await page.fill('.aml .am-log tr:nth-child(2) input.v-hr', '170'); await page.waitForTimeout(400);
  check((await page.textContent('.aml .am-alerts')).includes('09:00 Heart rate 170 (above 160)'), 'anaes: typed reading flagged');
  await page.fill('.aml .am-log tr:nth-child(2) input.v-spo2', '104'); await page.waitForTimeout(400);
  check((await page.textContent('.aml .am-err')).includes('SpO₂ cannot be above 100 %'), 'anaes: impossible reading message');
  await page.fill('.aml .am-log tr:nth-child(2) input.v-spo2', 'abc'); await page.waitForTimeout(400);
  check((await page.textContent('.aml .am-err')).includes('"abc" is not a number'), 'anaes: not a number message');
  await page.fill('.aml .am-log tr:nth-child(2) input.v-spo2', '98'); await page.waitForTimeout(400);
  await page.click('.aml .am-add'); await page.waitForTimeout(150);
  check((await page.$$('.aml .am-log tr')).length === 11 && (await page.inputValue('.aml .am-log tr:last-child input.t')) === '09:45', 'anaes: add a row');
  await page.click('.aml .am-del'); await page.waitForTimeout(150);
  check((await page.$$('.aml .am-log tr')).length === 10 && (await page.inputValue('.aml .am-log tr:nth-child(2) input.v-hr')) === '170', 'anaes: remove a row keeps the others');
  await page.selectOption('.aml .am-tu', '°F'); await page.waitForTimeout(200);
  check((await page.textContent('.aml .am-log tr')).includes('Temp (°F)') && (await page.textContent('.aml .am-ranges')).includes('Temperature (°F)'), 'anaes: Fahrenheit labels');
  await page.selectOption('.aml .am-tu', '°C');
  await page.fill('.aml .am-date', '2026-11-09');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.aml .am-csv')]); const f = OUT + 'anaes.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(d.suggestedFilename() === 'anaesthesia-log-2026-11-09.csv' && t.length === 10 && t[0] === 'time,hr,rr,spo2,etco2,temp,sap,map,dap,depth_and_notes' && t[1] === '09:00,170,18,98,38,37.9,128,92,72,"Induced; eye central, jaw tone moderate"', 'anaes: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.aml .dl [data-f=pdf]')]); const f = OUT + 'anaes.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'anaesthesia-record-2026-11-09.pdf' && readFileSync(f).length > 5000, 'anaes: PDF record'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.aml .am-blank')]); check(d.suggestedFilename() === 'anaesthesia-monitoring-sheet.pdf', 'anaes: blank sheet PDF'); }
  // Open the saved CSV again.
  await page.click('.aml .am-clear'); await page.fill('.aml .am-n', '3'); await page.dispatchEvent('.aml .am-n', 'change'); await page.waitForTimeout(200);
  check((await page.$$('.aml .am-log tr')).length === 4 && (await page.textContent('.aml .am-alerts')) === 'No alert ranges set.', 'anaes: fewer rows, ranges cleared');
  await page.setInputFiles('.aml .am-file', OUT + 'anaes.csv'); await page.waitForTimeout(400);
  check((await page.$$('.aml .am-log tr')).length === 10 && (await page.inputValue('.aml .am-log tr:nth-child(2) input.d')) === 'Induced; eye central, jaw tone moderate' && (await page.inputValue('.aml .am-log tr:nth-child(2) input.v-hr')) === '170', 'anaes: saved CSV opened again');
  writeFileSync(OUT + 'bad.csv', 'a,b\n1,2\n');
  await page.setInputFiles('.aml .am-file', OUT + 'bad.csv'); await page.waitForTimeout(300);
  check((await page.textContent('.aml .am-ferr')).includes('"time" column'), 'anaes: wrong file message');
};
