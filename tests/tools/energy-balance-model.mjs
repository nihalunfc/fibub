// #834 Energy balance climate model
export const path = '/science/energy-balance-model/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/energy-balance-model/`); await page.waitForTimeout(800);
  const R = '.ebm ', wait = () => page.waitForTimeout(600), txt = (s) => page.textContent(R + s);
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { d, text: readFileSync(f, 'utf8').replace(/^﻿/, '') }; };
  { const f = await txt('.eb-facts'); check(f.includes('3.71 W/m²') && f.includes('15.53 °C') && f.includes('14.34 °C') && f.includes('Warming (radiative)1.19 K') && f.includes('λ = 3.16 W/m²/K') && f.includes('Warming (linear, F/λ)3.09 K') && f.includes('Albedo at equilibrium0.303'), 'ebm: example equilibrium'); }
  { const f = await txt('.eb-tfacts'); check(f.includes('Radiative after 200 years1.19 K') && f.includes('Linear after 200 years3.09 K') && f.includes('11 years') && f.includes('418 MJ/m²/K'), 'ebm: time evolution facts'); }
  check((await txt('.eb-hnote')).includes('from 1163 to 1314 W/m²'), 'ebm: hysteresis range');
  { const f = await txt('.eb-lfacts'); check(f.includes('14.91 °C') && f.includes('−30.92 °C') && f.includes('−18.57 °C') && f.includes('33.49 K'), 'ebm: one-layer model'); }
  check(await page.$$eval(R + 'canvas.ax-fig', (cs) => cs.every((c) => c.width > 300)), 'ebm: three charts drawn');
  { const { d, text } = await dl('.eb-tcsv', 'eb.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'energy-balance-run.csv' && rows.length === 402 && rows[0] === 'Year,Forcing (W/m2),Radiative T (K),Radiative warming (K),Linear warming (K)' && rows[1].startsWith('0,3.7083,287.4879,0,0') && rows[401].startsWith('200,3.7083,288.6763,1.1884,3.0903'), `ebm: time series CSV (${rows[401]})`); }
  { const { text } = await dl('.eb-hcsv', 'ebh.csv'); const rows = text.trim().split('\n'); check(rows.length === 1402 && rows[0] === 'Temperature (K),Solar constant for balance (W/m2),Stable' && rows[1].endsWith(',yes') && rows.some((r) => r.endsWith(',no')), 'ebm: equilibrium curve CSV'); }
  // Slider and box move together.
  await page.fill(R + '.eb-lam', '3.3'); await wait();
  check((await page.inputValue(R + '.eb-r-lam')) === '3.3' && (await txt('.eb-facts')).includes('Warming (linear, F/λ)1.12 K'), 'ebm: typed λ moves the slider');
  await page.$eval(R + '.eb-r-lam', (r) => { r.value = '1.2'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await wait();
  check((await page.inputValue(R + '.eb-lam')) === '1.2' && (await txt('.eb-facts')).includes('3.09 K'), 'ebm: slider moves the box');
  // Ice off.
  await page.click(R + '.eb-ice'); await wait();
  check(await page.isHidden(R + '.eb-hyw') && await page.isHidden(R + '.eb-icew') && (await txt('.eb-facts')).includes('15.79 °C') && (await txt('.eb-facts')).includes('14.68 °C') && (await txt('.eb-facts')).includes('fixed'), 'ebm: ice-albedo off');
  await page.click(R + '.eb-ice'); await wait();
  // Low sun, frozen start: three equilibria, stays frozen.
  await page.fill(R + '.eb-S', '1250'); await page.fill(R + '.eb-T0', '230'); await wait();
  { const e = await txt('.eb-eqs'), f = await txt('.eb-tfacts'); check((e.match(/stable/g) ?? []).length >= 3 && e.includes('unstable') && e.includes('depends on where it starts') && /Radiative after 200 years[\d.]+ K−\d/.test(f), `ebm: frozen start stays frozen (${e} / ${f.slice(0, 60)})`); }
  await page.fill(R + '.eb-T0', '20'); await wait();
  check((await txt('.eb-err')).includes('between 50 and 600 K') && await page.isHidden(R + '.eb-out'), 'ebm: bad start temperature');
  await page.fill(R + '.eb-T0', ''); await page.fill(R + '.eb-S', '1361'); await wait();
  // Ramp.
  await page.selectOption(R + '.eb-kind', 'ramp'); await page.fill(R + '.eb-years', '50'); await wait();
  { const f = await txt('.eb-tfacts'); check(f.includes("Linear after 50 years1.73 K") && f.includes("Radiative after 50 years0.78 K"), `ebm: 1 % a year ramp lags (${f.slice(0, 80)})`); }
  await page.selectOption(R + '.eb-kind', 'step'); await page.fill(R + '.eb-years', '200'); await wait();
  // Bad values.
  await page.fill(R + '.eb-eps', '0'); await wait();
  check((await txt('.eb-err')).includes('Emissivity') && await page.isHidden(R + '.eb-out'), 'ebm: bad emissivity');
  await page.fill(R + '.eb-eps', '0.612'); await wait();
  await page.fill(R + '.eb-ea', '1.5'); await wait();
  check((await txt('.eb-lerr')).includes('between 0 and 1') && await page.isHidden(R + '.eb-lfacts'), 'ebm: bad atmosphere emissivity');
  await page.fill(R + '.eb-ea', '0.78'); await wait();
  check((await txt('.eb-facts')).includes('15.53 °C') && (await txt('.eb-lfacts')).includes('14.91 °C'), 'ebm: back to the example');
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.ebm .dl [data-f=${f}]`)]); const p = OUT + 'eb.' + f; await d.saveAs(p); check(readFileSync(p).length > 5000, `ebm: ${f} report`); }
};
