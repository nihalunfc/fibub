// #944 noise dose
export const path = '/science/noise-dose/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.nds ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(350); };
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}/science/noise-dose/`); await page.waitForTimeout(500);
  check((await t('.nd-big')) === 'Daily dose 228 % (TWA 88.6 dB(A))' && (await t('.nd-pill')) === 'Over the criterion', 'noise: example day NIOSH dose 228 % (NumPy 228.18), TWA 88.6');
  { const f = await t('.nd-facts'); check(f.includes('228.2 %') && f.includes('LEX,8h (3 dB, all levels)88.6 dB(A)') && f.includes('8 h 00 min') && f.includes('Time left at 95 dB(A)none'), 'noise: dose, LEX,8h, time measured, time left'); }
  { const rows = await page.$$eval(R + '.nd-tab tbody tr', (r) => r.map((x) => x.textContent)); check(rows.length === 4 && rows[0].includes('48 min') && rows[0].includes('126') && rows[2].includes('below threshold'), 'noise: table (grinding 48 min allowed, 126 %; break room below threshold)'); }
  check(await page.isVisible(R + '.nd-fig'), 'noise: chart');
  await pick('.nd-pre', '90,5,90');
  check((await t('.nd-big')) === 'Daily dose 38 % (TWA 82.9 dB(A))' && (await t('.nd-pill')) === 'Under half the criterion' && (await page.inputValue(R + '.nd-Lc')) === '90', 'noise: OSHA PEL preset 37.5 %, TWA 82.9');
  await pick('.nd-pre', '85,5,80');
  check((await t('.nd-big')) === 'Daily dose 138 % (TWA 87.3 dB(A))', 'noise: OSHA action level preset 137.5 %');
  await pick('.nd-pre', '85,3,');
  check((await t('.nd-big')) === 'Daily dose 229 % (TWA 88.6 dB(A))' && (await page.inputValue(R + '.nd-Lt')) === '', 'noise: EU/UK preset, no threshold 228.6 %');
  await set('.nd-Lc', '87');
  check((await page.inputValue(R + '.nd-pre')) === 'own', 'noise: editing a rule switches to My own rules');
  // OSHA Appendix A worked example.
  await pick('.nd-pre', '90,5,90'); await set('.nd-data', '110, 15\n100, 30\n90, 90');
  { const f = await t('.nd-facts'); check(f.includes('93.75 %') && (await t('.nd-big')) === 'Daily dose 94 % (TWA 89.5 dB(A))' && (await t('.nd-pill')) === 'Half the criterion or more', 'noise: OSHA Appendix A example 93.75 % ≈ 94 %'); }
  check((await t('.nd-facts')).includes('Time left at 110 dB(A)2 min'), 'noise: time left at the loudest level');
  await pick('.nd-unit', 'h'); await set('.nd-data', '110 0.25\n100 0:30\n90 1.5');
  check((await t('.nd-facts')).includes('93.75 %'), 'noise: hours, spaces and h:mm');
  await pick('.nd-unit', 'min');
  // Open a file.
  writeFileSync(OUT + 'dose.csv', 'Task,Level,Minutes\nSaw,100,30\nDrill,95,120\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'dose.csv'); await page.waitForTimeout(800);
  { const rows = await page.$$eval(R + '.nd-tab tbody tr', (r) => r.map((x) => x.textContent)); check(rows.length === 2 && rows[0].startsWith('Saw') && (await t('.nd-facts')).includes('Dose75 %'), 'noise: opened CSV file (Saw 100/30 + Drill 95/120 = 75 % OSHA)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nd-csv')]); const f = OUT + 'nd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[0] === 'task,level_dba,hours,allowed_hours,dose_percent' && rows[1] === 'Saw,100,0.5,2,25', 'noise: CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `noise-dose.${fmt}`, `noise: ${fmt} download`); }
  // Bad input.
  await set('.nd-data', 'Saw, 100, 30\nDrill, loud, 20');
  check((await t('.nd-err')).startsWith('Line 2: give a level') && await page.isHidden(R + '.nd-out'), 'noise: bad line message');
  await set('.nd-data', '90, 900\n90, 900');
  check((await t('.nd-err')).includes('more than a day'), 'noise: more than a day message');
  await set('.nd-data', '');
  check((await t('.nd-err')).includes('at least one line'), 'noise: empty message');
  await set('.nd-data', '90, 60'); await set('.nd-q', '0');
  check((await t('.nd-err')).includes('exchange rate'), 'noise: bad exchange rate message');
  await set('.nd-q', '5'); await set('.nd-Lt', 'abc');
  check((await t('.nd-err')).includes('threshold'), 'noise: bad threshold message');
};
