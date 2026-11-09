// #942 speaker box designer
export const path = '/science/speaker-box-designer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.spb ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/speaker-box-designer/`); await page.waitForTimeout(500);
  check((await t('.sb-big')) === 'Sealed 30 L: f3 65.6 Hz · Ported 50 L: f3 37.2 Hz', 'speaker box: example f3 sealed 65.6 Hz, ported 37.2 Hz (NumPy circuit + SciPy)');
  { const f = await t('.sb-facts'); check(f.includes('60.6 Hz') && f.includes('0.658') && f.includes('no bump: smooth') && f.includes('161.4 mm') && f.includes('6.57 m/s') && f.includes('132 cm³') && f.includes('89.9 dB at 1 W') && f.includes('0.598 %') && f.includes('f3 79.4 Hz'), 'speaker box: example facts'); }
  check(await page.isVisible(R + '.sb-fig'), 'speaker box: chart');
  await page.click(R + '.sb-fit'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.sb-vbs')) === '24.37' && (await t('.sb-big')).startsWith('Sealed 24.37 L: f3 65.2 Hz'), 'speaker box: size for Qtc 0.707 = 24.37 L');
  await set('.sb-qtc', '0.3'); await page.click(R + '.sb-fit'); await page.waitForTimeout(300);
  check((await t('.sb-err')).includes('must be higher than the driver'), 'speaker box: target Qtc below Qts message');
  await set('.sb-vbs', '10');
  check((await t('.sb-facts')).includes('bump above f3'), 'speaker box: small sealed box has a bump');
  await set('.sb-vbs', '30'); await set('.sb-fb', '40');
  check((await t('.sb-facts')).includes('bump of +0.6 dB') && (await t('.sb-big')).endsWith('f3 38.1 Hz'), 'speaker box: fb 40 Hz gives +0.6 dB bump, f3 38.1 Hz');
  await set('.sb-fb', '35'); await set('.sb-np', '2');
  check(/Port length\d+(\.\d+)? mm2 ports/.test(await t('.sb-facts')) && !(await t('.sb-facts')).includes('161.4 mm'), 'speaker box: two ports');
  await set('.sb-np', '1'); await set('.sb-dp', '1');
  check((await t('.sb-facts')).includes('too short') && (await t('.sb-facts')).includes('chuff'), 'speaker box: thin port too short and too fast');
  await set('.sb-dp', '7.5'); await set('.sb-qes', ''); await set('.sb-sd', '');
  check(!(await t('.sb-facts')).includes('Sensitivity') && !(await t('.sb-facts')).includes('Port air speed'), 'speaker box: optional parameters left out');
  await set('.sb-qes', '0.3');
  check((await t('.sb-err')).includes('Qes cannot be smaller than Qts'), 'speaker box: Qes < Qts message');
  await set('.sb-qes', '0.42'); await set('.sb-sd', '220'); await set('.sb-qts', '0');
  check((await t('.sb-err')).includes('Qts') && await page.isHidden(R + '.sb-out'), 'speaker box: bad Qts message');
  await set('.sb-qts', '0.38'); await set('.sb-ql', '0');
  check((await t('.sb-err')).includes('losses QL'), 'speaker box: bad QL message');
  await set('.sb-ql', '7');
  check((await t('.sb-big')) === 'Sealed 30 L: f3 65.6 Hz · Ported 50 L: f3 37.2 Hz', 'speaker box: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sb-csv')]); const f = OUT + 'box.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'frequency_hz,sealed_db,ported_db,infinite_baffle_db' && rows[1].startsWith('10,-31.345,-43.699,') && rows.length > 100, 'speaker box: response CSV (10 Hz matches NumPy)'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `speaker-box.${fmt}`, `speaker box: ${fmt} download`); }
};
