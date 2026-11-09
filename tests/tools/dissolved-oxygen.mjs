// #841 Dissolved oxygen and plankton density
export const path = '/science/dissolved-oxygen/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/dissolved-oxygen/`); await page.waitForTimeout(700);
  const R = '.dox ', wait = () => page.waitForTimeout(600), txt = (s) => page.textContent(R + s);
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { d, text: readFileSync(f, 'utf8').replace(/^﻿/, '') }; };
  { const f = await txt('.do-sat'); check(f.includes('8.13 mg/L') && f.includes('247.8 µmol/kg, 254.2 µmol/L, 5.69 mL/L') && f.includes('1025.97 kg/m³') && f.includes('pressure factor 1.0000'), 'oxygen: saturation at 15 °C, S 35'); }
  { const f = await txt('.do-meas'); check(f.includes('92.8 %') && f.includes('AOU17.8 µmol/kg') && f.includes('0.41 mL/L, 0.58 mg/L') && f.includes('7.55 mg/L') && f.includes('236.0 µmol/L'), 'oxygen: measurement, AOU and conversions'); }
  await page.selectOption(R + '.do-u', 'mgL'); await page.fill(R + '.do-m', '8.1345'); await wait();
  check((await txt('.do-meas')).includes('100.0 %'), 'oxygen: mg/L at saturation is 100 %');
  await page.fill(R + '.do-m', '-1'); await wait();
  check((await txt('.do-merr')).includes('0 or more'), 'oxygen: negative measurement refused');
  await page.selectOption(R + '.do-u', 'umolkg'); await page.fill(R + '.do-m', '230'); await wait();
  await page.click(R + '.do-fresh'); await wait();
  check((await txt('.do-sat')).includes('10.08 mg/L') && (await txt('.do-sat')).includes('315.4 µmol/kg'), 'oxygen: fresh water');
  await page.selectOption(R + '.do-pm', 'alt'); await page.fill(R + '.do-alt', '1500'); await wait();
  { const f = await txt('.do-sat'); check(await page.isVisible(R + '.do-alt') && await page.isHidden(R + '.do-p') && f.includes('845.6 hPa') && f.includes('8.39 mg/L') && f.includes('pressure factor 0.8318'), `oxygen: altitude 1500 m (${f.slice(0, 120)})`); }
  await page.selectOption(R + '.do-pm', 'hpa'); await page.click(R + '.do-sea'); await wait();
  await page.fill(R + '.do-t', '45'); await wait();
  check((await txt('.do-err')).includes('between −2 and 40 °C') && await page.isHidden(R + '.do-out'), 'oxygen: temperature out of range');
  await page.fill(R + '.do-t', '15'); await wait();
  check((await txt('.do-sat')).includes('8.13 mg/L'), 'oxygen: back to the example');
  { const { d, text } = await dl('.do-ccsv', 'dc.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'oxygen-solubility.csv' && rows.length === 42 && rows[16] === '15,35,1013.25,247.778,254.214,8.1345,5.6923', `oxygen: solubility table CSV (${rows[16]})`); }
  await page.selectOption(R + '.do-cu', 'umolkg'); await wait();
  check(await page.$eval(R + '.do-cfig', (c) => c.width > 300 && c.getAttribute('aria-label').includes('1013 hPa')), 'oxygen: solubility chart');
  // Batch / profile.
  { const r = await page.$$eval(R + '.do-btab tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|'))); check(r.length === 9 && r[0] === '0|18.4|35.1|236.0|232.1|101.7|−3.9' && r[7] === '800|5.1|34.5|72.0|307.8|23.4|235.8', 'oxygen: example profile table'); }
  check(await page.$eval(R + '.do-bfig', (c) => c.getAttribute('aria-label').startsWith('Oxygen profile')), 'oxygen: profile chart');
  { const { text } = await dl('.do-bcsv', 'db.csv'); const rows = text.trim().split('\n'); check(rows.length === 10 && rows[0].startsWith('Sample,Temperature (C),Salinity,O2 (umol/kg),O2 (mg/L)') && rows[1].startsWith('0,18.4,35.1,236,'), 'oxygen: samples CSV'); }
  writeFileSync(OUT + 'do.csv', 'Sample;T;S;O2\nA;10;0;11\nB;20;0;9\nbad;x;0;1\nC;50;0;5\n');
  await page.selectOption(R + '.do-bu', 'mgL'); await page.uncheck(R + '.do-depth');
  await page.setInputFiles(R + '.dfb-in', OUT + 'do.csv'); await page.waitForTimeout(1200);
  { const n = await txt('.do-bnote'), r = await page.$$eval(R + '.do-btab tbody tr', (x) => x.length); check(r === 2 && n.includes('1 line without') && n.includes('1 sample outside') && await page.$eval(R + '.do-bfig', (c) => c.getAttribute('aria-label').startsWith('Percent saturation of 2')), `oxygen: file in mg/L, bad lines (${n})`); }
  await page.click(R + '.do-clear'); await wait();
  check((await txt('.do-berr')).includes('Paste or open samples') && await page.isHidden(R + '.do-bout'), 'oxygen: start empty');
  await page.check(R + '.do-depth'); await page.click(R + '.do-ex'); await wait();
  check((await page.$$eval(R + '.do-btab tbody tr', (x) => x.length)) === 9, 'oxygen: example again');
  // Plankton.
  { const f = await txt('.do-pfacts'); check(f.includes('4600 cells/L') && f.includes('4.6 cells/mL') && f.includes('4020 to 5230 cells/L') && f.includes('× 50') && f.includes('± 13.2 %'), `oxygen: plankton water sample (${f})`); }
  await page.selectOption(R + '.do-vm', 'fields'); await wait();
  check(await page.isVisible(R + '.do-nf') && (await txt('.do-pfacts')).includes('460,000 cells/L') && (await txt('.do-pfacts')).includes('Volume examined0.01 mL') && (await txt('.do-pfacts')).includes('402,000 to 523,000'), `oxygen: volume from fields (${await txt('.do-pfacts')})`);
  await page.fill(R + '.do-vc', '2000'); await wait();
  check((await txt('.do-perr')).includes('cannot be more than'), 'oxygen: concentrate larger than sample refused');
  await page.fill(R + '.do-vc', '20'); await page.selectOption(R + '.do-vm', 'ml'); await page.selectOption(R + '.do-pk', 'net'); await wait();
  { const f = await txt('.do-pfacts'); check(await page.isHidden(R + '.do-vo') && f.includes('368 per m³') && f.includes('12.5 %') && f.includes('about 1840'), `oxygen: net tow (${f})`); }
  await page.selectOption(R + '.do-fm', 'tow'); await wait();
  check((await txt('.do-pfacts')).includes('374.8 per m³') && (await txt('.do-pfacts')).includes('4.909 m³'), 'oxygen: tow volume from net size');
  await page.fill(R + '.do-fr', '2'); await wait();
  check((await txt('.do-perr')).includes('at most 1'), 'oxygen: bad fraction');
  await page.fill(R + '.do-fr', '1/8'); await page.fill(R + '.do-n', '0'); await wait();
  { const f = await txt('.do-pfacts'); check(f.includes('Density0 per m³') && f.includes('0 to 6.01 per m³') && f.includes('count 0 to 3.69'), `oxygen: zero count has an upper limit (${f})`); }
  await page.fill(R + '.do-n', '230'); await page.selectOption(R + '.do-pk', 'water'); await wait();
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dox .dl [data-f=${f}]`)]); const p = OUT + 'do.' + f; await d.saveAs(p); check(readFileSync(p).length > 5000, `oxygen: ${f} report`); }
};
