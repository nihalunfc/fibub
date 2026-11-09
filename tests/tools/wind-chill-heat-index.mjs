// #896 Wind chill, heat index, humidex and apparent temperature
export const path = '/science/wind-chill-heat-index/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/wind-chill-heat-index/`); await page.waitForTimeout(400);
  const R = '.wch ', big = () => page.textContent(R + '.wc-big'), facts = () => page.textContent(R + '.wc-facts');
  const wait = () => page.waitForTimeout(450);
  const set = async (sel, v) => { await page.fill(R + sel, v); await wait(); };
  check((await big()) === 'Feels like −17.9 °C' && (await facts()).includes('Wind chill−17.9 °Cmoderate risk') && (await facts()).includes('Apparent temperature−17.2 °C') && (await facts()).includes('Dew point−14.4 °C'), 'feels: winter example');
  check((await facts()).includes('Heat indexdoes not apply') && (await page.textContent(R + '.wc-why')).includes('wind chill'), 'feels: heat index left out in the cold');
  check((await page.textContent(R + '.wc-rng')).includes('Wind chill applies hereair ≤ 10 °C, wind > 4.8 km/h. JAG/TI (2001), NWS and Environment Canada.') && (await page.textContent(R + '.wc-rng')).includes('Heat index not here'), 'feels: validity table');
  check(await page.isVisible(R + '.wc-fig'), 'feels: chart drawn');
  await page.selectOption(R + '.wc-tu', 'F'); await wait();
  check((await page.inputValue(R + '.wc-t')) === '14' && (await big()) === 'Feels like −0.149 °F' && (await page.textContent(R + '.wc-rng')).includes('air ≤ 50 °F'), 'feels: °F keeps the weather');
  await page.selectOption(R + '.wc-tu', 'C'); await wait();
  await page.selectOption(R + '.wc-vu', 'mph'); await wait();
  check((await page.inputValue(R + '.wc-v')) === '12.4' && (await page.textContent(R + '.wc-rng')).includes('wind > 3 mph') && (await facts()).includes('12.4 mph'), 'feels: wind in mph');
  await page.selectOption(R + '.wc-vu', 'kmh'); await wait();
  check((await page.inputValue(R + '.wc-v')) === '20' && (await page.inputValue(R + '.wc-t')) === '-10', 'feels: back to km/h and °C');
  await page.click(R + '.wc-face'); await wait();
  check((await big()) === 'Feels like −19.5 °C' && (await facts()).includes('face height × 1.5'), 'feels: face-height wind × 1.5');
  await page.click(R + '.wc-face'); await wait();
  await set('.wc-t', '32'); await set('.wc-h', '60'); await set('.wc-v', '10');
  { const f = await facts(); check((await big()) === 'Feels like 37.1 °C' && f.includes('Heat index37.1 °Cextreme caution') && f.includes('Rothfusz regression') && f.includes('Humidex42.5great discomfort') && f.includes('Apparent temperature35.4 °C') && f.includes('Wind chilldoes not applyair warmer than 10 °C'), 'feels: summer example'); }
  await page.selectOption(R + '.wc-hk', 'td'); await wait();
  check((await page.inputValue(R + '.wc-h')) === '23.3' && (await big()) === 'Feels like 37.1 °C' && (await facts()).includes('Relative humidity60.1 %'), 'feels: dew point input');
  await set('.wc-h', '35');
  check((await page.textContent(R + '.wc-err')).includes('dew point cannot be above') && await page.isHidden(R + '.wc-out'), 'feels: dew point above air');
  await page.selectOption(R + '.wc-hk', 'rh'); await set('.wc-h', '150');
  check((await page.textContent(R + '.wc-err')).includes('at most 100 %'), 'feels: humidity over 100');
  await set('.wc-h', '50'); await set('.wc-t', '20'); await set('.wc-v', '0');
  check((await big()) === 'Feels like 20 °C' && (await page.textContent(R + '.wc-why')).includes('air temperature itself') && (await facts()).includes('Apparent temperature19.8 °C'), 'feels: mild day falls back to air temperature');
  await set('.wc-t', '');
  check((await page.textContent(R + '.wc-err')).includes('Type the air temperature'), 'feels: empty temperature');
  await set('.wc-t', '-10'); await set('.wc-h', '70'); await set('.wc-v', '20');
  // Table mode.
  const tab = () => page.textContent(R + '.wc-tab');
  check((await page.$$eval(R + '.wc-tab tbody tr', (r) => r.length)) === 10 && (await page.$eval(R + '.wc-tab tbody tr:nth-child(7)', (r) => r.textContent)) === '−10−13−15−18−20−21−22−23−23−24', 'feels: wind chill table row −10 °C');
  check((await page.$$eval(R + '.wc-tab td.b3', (c) => c.length)) > 0 && (await page.textContent(R + '.wc-leg')).includes('high risk'), 'feels: table shading and legend');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wc-csv')]); const f = OUT + 'wc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\n');
    check(d.suggestedFilename() === 'wind-chill-table.csv' && rows.length === 11 && rows[0] === 'Wind chill (°C),5 km/h,10 km/h,20 km/h,30 km/h,40 km/h,50 km/h,60 km/h,70 km/h,80 km/h' && rows[7].startsWith('-10,-12.93,-15.26,-17.86,'), 'feels: wind chill CSV'); }
  await page.selectOption(R + '.wc-k', 'hi'); await wait();
  check((await page.inputValue(R + '.wc-a')) === '27' && (await page.$eval(R + '.wc-tab tbody tr:nth-child(6)', (r) => r.textContent)).startsWith('32323437'), 'feels: heat index table');
  await page.selectOption(R + '.wc-k', 'hx'); await wait();
  check((await page.$eval(R + '.wc-tab tbody tr:nth-child(6)', (r) => r.children[3].textContent)) === '36' && (await page.textContent(R + '.wc-leg')).includes('dangerous'), 'feels: humidex table (30 °C, 50 %)');
  await page.selectOption(R + '.wc-k', 'at'); await wait();
  check(await page.isVisible(R + '.wc-fixw') && (await page.$eval(R + '.wc-tab tbody tr:nth-child(7)', (r) => r.children[1].textContent)) === '20', 'feels: apparent temperature table (20 °C, 50 %, calm)');
  await set('.wc-s', '0');
  check((await page.textContent(R + '.wc-terr')).includes('step above 0') && (await tab()) === '', 'feels: bad table range');
  await set('.wc-s', '5'); await set('.wc-cols', '5, x');
  check((await page.textContent(R + '.wc-terr')).includes('separated by commas'), 'feels: bad table columns');
  await set('.wc-cols', '0, 10');
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.wch .dl [data-f=${f}]`)]); const p = OUT + 'wc.' + f; await d.saveAs(p); check(readFileSync(p).length > 3000, `feels: ${f} download`); }
};
