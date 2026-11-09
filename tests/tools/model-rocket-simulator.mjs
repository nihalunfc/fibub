// #670 model rocket flight simulator
export const path = '/science/model-rocket-simulator/';
export default async ({ page, check, OUT, readFileSync, writeFileSync, BASE }) => {
  await page.goto(`${BASE}/science/model-rocket-simulator/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent(`.mrs ${c}`);
  check((await t('.rs-big')) === 'Apogee 163 m at 6.25 s', `rocket: example apogee (${await t('.rs-big')})`);
  { const f = await t('.rs-facts'); check(f.includes('C class, 8.335 N·s') && f.includes('51.8 m/s') && f.includes('4.5 s') && f.includes('within 1 s of apogee: good') && f.includes('12.8 m/s') && f.includes('longer rod'), 'rocket: example facts, delay advice, rod warning'); }
  check(await page.isVisible('.mrs .rs-f1') && await page.isVisible('.mrs .rs-f2') && await page.isVisible('.mrs .rs-f3'), 'rocket: three plots');
  await page.fill('.mrs .rs-delay', '8'); await page.waitForTimeout(400);
  check((await t('.rs-facts')).includes('after apogee: too long'), 'rocket: long delay advice');
  await page.fill('.mrs .rs-delay', '2'); await page.waitForTimeout(400);
  check((await t('.rs-facts')).includes('before apogee: too short'), 'rocket: short delay advice');
  await page.fill('.mrs .rs-elev', '1500'); await page.fill('.mrs .rs-temp', '20.25'); await page.waitForTimeout(400);
  check((await t('.rs-big')) === 'Apogee 170 m at 6.41 s', `rocket: high, warm site flies higher (${await t('.rs-big')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrs .rs-csv')]); const f = OUT + 'flight.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0].startsWith('time_s,altitude_m,velocity_m_s') && r.length > 600 && r[1].startsWith('0.000,0.000,0.000'), 'rocket: flight CSV'); }
  await page.selectOption('.mrs .rs-src', 'shape'); await page.waitForTimeout(400);
  check(await page.isHidden('.mrs .rs-curve') && (await t('.rs-facts')).includes('C class, 10 N·s'), 'rocket: made-up spike shape');
  await page.selectOption('.mrs .rs-shape', 'flat'); await page.fill('.mrs .rs-I', '40'); await page.waitForTimeout(400);
  check((await t('.rs-facts')).includes('E class, 40 N·s'), 'rocket: flat shape, bigger motor');
  await page.fill('.mrs .rs-m', '5000'); await page.waitForTimeout(400);
  check((await t('.rs-err')).includes('never leaves the pad') && await page.isHidden('.mrs .rs-out'), 'rocket: too heavy message');
  await page.fill('.mrs .rs-m', '120'); await page.selectOption('.mrs .rs-src', 'paste');
  writeFileSync(OUT + 'motor.csv', 'time,thrust\n0.0,0\n0.1,20\n0.8,15\n0.9,0\n');
  await page.setInputFiles('.mrs .dfb-in', OUT + 'motor.csv'); await page.waitForTimeout(600);
  check((await t('.dfb-note')).includes('motor.csv') && (await t('.rs-facts')).includes('1 line without numbers skipped') && (await t('.rs-facts')).includes('D class'), 'rocket: open a thrust curve file');
  await page.fill('.mrs .rs-curve', '0 1\n0.5 4\n0.4 3'); await page.waitForTimeout(400);
  check((await t('.rs-err')).includes('must go up'), 'rocket: bad curve message');
  await page.fill('.mrs .rs-curve', '0, 0\n0.05, 9\n0.12, 14\n0.2, 6\n0.5, 4.5\n1.2, 4.2\n1.6, 3.8\n1.75, 0'); await page.fill('.mrs .rs-elev', '0'); await page.fill('.mrs .rs-temp', '15'); await page.waitForTimeout(400);
  check((await t('.rs-big')) === 'Apogee 163 m at 6.25 s', 'rocket: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.mrs .dl button[data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'rocket: PDF report'); }
};
