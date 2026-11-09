// #898 Density altitude
export const path = '/science/density-altitude/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/density-altitude/`); await page.waitForTimeout(400);
  const R = '.dal ', big = () => page.textContent(R + '.da-big'), facts = () => page.textContent(R + '.da-facts');
  const wait = () => page.waitForTimeout(450);
  const set = async (sel, v) => { await page.fill(R + sel, v); await wait(); };
  { const f = await facts(); check((await big()) === '8,057 ft' && f.includes('Pressure altitude5,007 ft') && f.includes('Air density0.9612 kg/m³78.5 %') && f.includes('Station pressure842.9 hPa') && f.includes('Altimeter setting (QNH)1013.0 hPa') && f.includes('Rule of thumb7,997 ft') && f.includes('Density altitude, dry air7,809 ft') && f.includes('Standard temperature here5.08 °CISA +24.9 °C'), 'density alt: example'); }
  check((await page.textContent(R + '.da-sub')).startsWith('Higher than the pressure altitude by 3,050 ft') && await page.isVisible(R + '.da-fig'), 'density alt: summary and chart');
  const rows = () => page.$$eval(R + '.da-tab tbody tr', (r) => r.map((x) => x.textContent));
  { const r = await rows(); check(r.length === 12 && r[0] === '−10−15.11.11443,1993,156' && r[11] === '4539.90.91599,6079,362' && (await page.$eval(R + '.da-tab tr.hl', (x) => x.textContent)).startsWith('3024.90.9612'), 'density alt: table and the current row'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.da-csv')]); const f = OUT + 'da.csv'; await d.saveAs(f); const c = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\n');
    check(c.length === 13 && c[0] === 'Air (°C),ISA dev. (°C),Density (kg/m³),Density altitude (ft),Dry air (ft)' && c[1] === '-10,-15.1,1.1144,3199,3156', 'density alt: CSV'); }
  await page.selectOption(R + '.da-hu', 'm'); await wait();
  check((await page.inputValue(R + '.da-z')) === '1524' && (await big()) === '2,456 m' && (await page.textContent(R + '.da-tab thead')).includes('DA m'), 'density alt: metres');
  await page.selectOption(R + '.da-hu', 'ft'); await wait();
  await page.selectOption(R + '.da-pk', 'stn'); await wait();
  check((await page.inputValue(R + '.da-p')) === '842.9' && (await page.textContent(R + '.da-pl')) === 'Station pressure (hPa)' && (await facts()).includes('Altimeter setting (QNH)1013.0 hPa') && (await big()) === '8,055 ft', 'density alt: station pressure gives the same air (842.9 hPa rounded)');
  await page.selectOption(R + '.da-pk', 'qnh'); await wait();
  await page.selectOption(R + '.da-pu', 'inhg'); await wait();
  await set('.da-p', '29.92');
  check((await facts()).includes('Altimeter setting (QNH)29.92 inHg') && (await facts()).includes('Pressure altitude5,001 ft'), 'density alt: inHg');
  await set('.da-d', '');
  check((await big()) === '7,802 ft' && (await facts()).includes('no dew point given'), 'density alt: dry air (7,802 ft at 29.92 inHg, 30 °C)');
  await page.selectOption(R + '.da-tu', 'F'); await wait();
  check((await page.inputValue(R + '.da-t')) === '86' && (await big()) === '7,802 ft' && (await page.textContent(R + '.da-tab thead')).includes('Air °F'), 'density alt: °F keeps the air');
  await page.selectOption(R + '.da-tu', 'C'); await wait();
  await set('.da-d', '35');
  check((await page.textContent(R + '.da-err')).includes('dew point cannot be above') && await page.isHidden(R + '.da-out') && (await page.textContent(R + '.da-terr')).includes('Fix the air values'), 'density alt: dew point above air');
  await set('.da-d', '15'); await set('.da-p', '1013');
  check((await page.textContent(R + '.da-err')).includes('Did you pick the right unit?'), 'density alt: hPa typed in inHg mode');
  await page.selectOption(R + '.da-pu', 'hpa'); await wait(); await set('.da-p', '1013');
  check((await big()) === '8,057 ft', 'density alt: back to the example');
  await set('.da-t', '-20'); await set('.da-d', '-25'); await set('.da-z', '0');
  check((await big()).startsWith('−') && (await page.textContent(R + '.da-sub')).startsWith('Lower'), 'density alt: cold air gives a negative density altitude');
  await set('.da-t', '');
  check((await page.textContent(R + '.da-err')) === 'Type the air temperature.', 'density alt: empty temperature');
  await set('.da-t', '30'); await set('.da-z', '5000'); await set('.da-d', '15');
  await set('.da-s', '0');
  check((await page.textContent(R + '.da-terr')).includes('step above 0'), 'density alt: bad table range');
  await set('.da-s', '5');
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dal .dl [data-f=${f}]`)]); const p = OUT + 'da.' + f; await d.saveAs(p); check(readFileSync(p).length > 3000, `density alt: ${f} download`); }
};
