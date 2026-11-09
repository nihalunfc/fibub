// #828 Glacier mass balance and ice flow
export const path = '/science/glacier-ice/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/glacier-ice/`); await page.waitForTimeout(700);
  const R = '.gli ', wait = () => page.waitForTimeout(700), txt = (s) => page.textContent(R + s);
  const dl = async (sel, name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return { d, text: readFileSync(f, 'utf8').replace(/^﻿/, '') }; };
  { const f = await txt('.gl-mfacts'); check(f.includes('−0.73 m w.e.') && f.includes('−5.08 million m³ w.e.') && f.includes('over 6.94 km²') && f.includes('2,980 m') && f.includes('34 %') && f.includes('0.57 m w.e. per 100 m') && f.includes('r² 0.978') && f.includes('10 and 9'), 'glacier: example mass balance'); }
  { const r = await page.$$eval(R + '.gl-btab tbody tr', (x) => x.map((y) => [...y.children].map((c) => c.textContent).join('|'))); check(r.length === 9 && r[0] === '2450–2550|0.42|−3.127|−1.314|0.00' && r[5] === '2950–3050|1.05|0.131|0.137|0.73', 'glacier: band table'); }
  check((await page.$$eval(R + '.gl-stab tbody tr', (x) => x.length)) === 10 && (await page.$eval(R + '.gl-stab tbody tr', (r) => r.lastElementChild.textContent)) === '−3.240', 'glacier: stake table, S1 −3.24 m w.e.');
  check(await page.$eval(R + '.gl-mfig', (c) => c.width > 300 && c.getAttribute('aria-label').includes('ELA 2980 m')), 'glacier: profile chart drawn');
  { const { d, text } = await dl('.gl-bcsv', 'gb.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'glacier-bands.csv' && rows.length === 11 && rows[1] === '2450,2550,0.42,-3.1275,-1.3135,0' && rows[10].startsWith('Glacier,,6.94,-0.7321,-5.0806,'), `glacier: bands CSV (${rows[1]} / ${rows[10]})`); }
  { const { text } = await dl('.gl-scsv', 'gs.csv'); const rows = text.trim().split('\n'); check(rows.length === 11 && rows[1] === 'S1,2480,-3.6,900,-3.24,-3.24', `glacier: stakes CSV (${rows[1]})`); }
  await page.selectOption(R + '.gl-prof', 'linear'); await wait();
  { const f = await txt('.gl-mfacts'); check(f.includes('−0.81 m w.e.') && f.includes('3,030 m'), 'glacier: straight-line profile'); }
  // Balance given directly in m w.e., a bad line, a stake outside the bands.
  await page.selectOption(R + '.gl-mode', 'we'); await page.selectOption(R + '.gl-prof', 'join');
  await page.fill(R + '.gl-st', 'Stake,Elevation,Balance\nA,1000,-2\nB,1100,-1\nC,1200,0\nD,1300,1\nbad,x,1\nE,1500,2');
  await page.fill(R + '.gl-bd', 'lo,hi,area\n1000,1100,1\n1100,1200,1\n1200,1300,1\n1300,1400,1'); await wait();
  { const f = await txt('.gl-mfacts'), n = await txt('.gl-mnote'); check(f.includes('−0.06 m w.e.') && f.includes('1,200 m') && f.includes('50 %') && n.includes('1 stake line') && n.includes('outside the bands'), `glacier: balances in m w.e. (${f} / ${n})`); }
  await page.selectOption(R + '.gl-mode', 'dh');
  await page.fill(R + '.gl-st', 'S,Z,dh,rho\nA,1000,-2\nB,1400,1,500'); await wait();
  { const n = await txt('.gl-mnote'), s = await page.$eval(R + '.gl-stab tbody tr', (r) => r.textContent); check(n.includes('ice (900 kg/m³) was used') && s.includes('900') && s.includes('−1.800'), `glacier: blank density counts as ice (${n} / ${s})`); }
  await page.fill(R + '.gl-st', 'S,Z,dh,rho\nA,1000,-2,900\nB,1400,-1,900'); await wait();
  { const f = await txt('.gl-mfacts'), n = await txt('.gl-elanote'); check(f.includes('Equilibrium line (ELA)none') && f.includes('0 %') && n.includes('loses mass'), `glacier: no ELA when all loss (${n})`); }
  await page.fill(R + '.gl-bd', 'lo,hi,area\n1000,900,1'); await wait();
  check((await txt('.gl-merr')).includes('top must be above') && await page.isHidden(R + '.gl-mout'), 'glacier: bad band refused');
  await page.click(R + '.gl-clear'); await wait();
  check((await txt('.gl-merr')).includes('at least two stakes'), 'glacier: start empty');
  // Open files.
  writeFileSync(OUT + 'gst.csv', 'Stake;Elevation;Change;Density\nX;2000;-1;900\nY;2200;1;500\n');
  writeFileSync(OUT + 'gbd.csv', 'lo,hi,area\n2000,2100,2\n2100,2200,2\n');
  const ins = await page.$$(R + '.dfb-in');
  await ins[0].setInputFiles(OUT + 'gst.csv'); await ins[1].setInputFiles(OUT + 'gbd.csv'); await page.waitForTimeout(1200);
  { const f = await txt('.gl-mfacts'); check(f.includes('−0.20 m w.e.') && f.includes('2,129 m') && f.includes('2 and 2'), `glacier: stakes and bands from files (${f})`); }
  await page.click(R + '.gl-ex'); await page.selectOption(R + '.gl-prof', 'join'); await wait();
  check((await txt('.gl-mfacts')).includes('2,980 m'), 'glacier: example again');
  // Flow tab.
  await page.click(R + '.gl-tab [data-t=flow]'); await wait();
  check(await page.isHidden(R + '[data-p=mb]') && await page.isVisible(R + '.gl-ffig'), 'glacier: flow tab shows');
  { const f = await txt('.gl-ffacts'); check(f.includes('94.16 kPa') && f.includes('5.269 m/yr') && f.includes('4.215 m/yr') && f.includes('843.1 m²/yr') && f.includes('0.0527 per year'), 'glacier: flow example'); }
  { const { d, text } = await dl('.gl-fcsv', 'gf.csv'); const rows = text.trim().split('\n'); check(d.suggestedFilename() === 'ice-velocity-profile.csv' && rows.length === 22 && rows[1] === '0,200,94.1604,0' && rows[21].startsWith('200,0,0,5.269'), `glacier: velocity profile CSV (${rows[1]} / ${rows[21]})`); }
  await page.fill(R + '.gl-ub', '10'); await page.fill(R + '.gl-f', '0.8'); await wait();
  { const f = await txt('.gl-ffacts'); check(f.includes('75.33 kPa') && f.includes('12.70 m/yr') && f.includes('from deformation + 10 sliding'), `glacier: sliding and shape factor (${f})`); }
  await page.fill(R + '.gl-n', '9'); await wait();
  check((await txt('.gl-ferr')).includes('exponent n') && await page.isHidden(R + '.gl-fout'), 'glacier: bad n refused');
  await page.fill(R + '.gl-n', '3'); await page.fill(R + '.gl-ub', '0'); await page.fill(R + '.gl-f', '1'); await wait();
  // Active layer tab.
  await page.click(R + '.gl-tab [data-t=al]'); await wait();
  { const f = await txt('.gl-afacts'); check(f.includes('1.33 m') && f.includes('859 °C·days') && f.includes('100 MJ/m³'), 'glacier: Stefan example'); }
  await page.selectOption(R + '.gl-imode', 'value'); await wait();
  check(await page.isVisible(R + '.gl-I') && await page.isHidden(R + '.gl-mon') && (await txt('.gl-afacts')).includes('1.44 m'), 'glacier: typed thawing index');
  await page.fill(R + '.gl-nt', '0.5'); await wait();
  check((await txt('.gl-afacts')).includes('1.02 m') && (await txt('.gl-afacts')).includes('500 °C·days'), 'glacier: n-factor');
  await page.fill(R + '.gl-th', '0'); await wait();
  check((await txt('.gl-aerr')).includes('Water content') && await page.isHidden(R + '.gl-aout'), 'glacier: bad water content');
  await page.fill(R + '.gl-th', '0.3'); await page.fill(R + '.gl-nt', '1'); await page.selectOption(R + '.gl-imode', 'months'); await page.fill(R + '.gl-mon', '1, 2, 3'); await wait();
  check((await txt('.gl-aerr')).includes('12 monthly'), 'glacier: needs 12 months');
  await page.fill(R + '.gl-mon', '-28, -27, -23, -14, -3, 7, 11, 8, 2, -9, -20, -25'); await wait();
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gli .dl [data-f=${f}]`)]); const p = OUT + 'gl.' + f; await d.saveAs(p); check(readFileSync(p).length > 5000, `glacier: ${f} report`); }
  await page.click(R + '.gl-tab [data-t=mb]'); await wait();
};
