// #882 seismic refraction interpreter
export const path = '/science/seismic-refraction/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/seismic-refraction/`); await page.waitForTimeout(500);
  const R = '.srf ';
  check((await page.textContent(R + '.sr-big')) === 'Layer tops at 5.0 m and 19.3 m under the forward shot, 9.2 m and 28.5 m under the reverse shot', 'refraction: example depths');
  { const f = await page.textContent(R + '.sr-facts'); check(f.includes('492.1, 1631, 3090 m/s') && f.includes('V2 1795 m/s, dip 1.67°') && f.includes('5.06 m forward, 9.19 m reverse') && f.includes('about 4089 m/s') && f.includes('difference 0.1 ms'), 'refraction: speeds, dipping layer, reciprocal times'); }
  { const t = await page.textContent(R + '.sr-tab'); check(t.includes('13.7') && t.includes('14.27') && t.includes('6042'), 'refraction: layer table'); }
  check(await page.isVisible(R + '.sr-fig'), 'refraction: travel-time plot');
  check((await page.textContent(R + '.sr-mtab')).includes('19.21') && (await page.textContent(R + '.sr-mrms')).includes('RMS 5.45 ms'), 'refraction: forward model table and RMS');
  await page.check(R + '.sr-show'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.sr-fig'), 'refraction: model drawn on the plot');
  await page.uncheck(R + '.sr-org'); await page.waitForTimeout(150);
  { const rows = await page.$$eval(R + '.sr-tab tr', (r) => r.map((x) => [...x.children].map((c) => c.textContent))); const f1 = rows[1]; check(f1[7] !== f1[8] && f1[5] !== '0.00', `refraction: free direct-wave intercept makes the two methods differ (${f1.join(' ')})`); }
  await page.check(R + '.sr-org');
  await page.selectOption(R + '.sr-n', '2'); await page.waitForTimeout(150);
  { const b = await page.textContent(R + '.sr-big'); check(/^Layer tops at \d+\.\d m under the forward shot, \d+\.\d m under the reverse shot$/.test(b), `refraction: two layers (${b})`); }
  await page.selectOption(R + '.sr-n', '3');
  await page.fill(R + '.sr-fb', '12, 57'); await page.waitForTimeout(150);
  { const t = await page.textContent(R + '.sr-tab'); check(t.includes('15–55') && t.includes('60–120'), 'refraction: manual breaks'); }
  await page.fill(R + '.sr-fb', '12'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sr-err')).includes('Give 2 break offsets'), 'refraction: wrong number of breaks');
  await page.fill(R + '.sr-fb', '');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sr-csv')]); const f = OUT + 'refr.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 49 && rows[0] === 'shot,offset_m,position_m,time_ms,layer,fitted_ms' && rows[25].startsWith('reverse,5,120,9.4,1,'), 'refraction: CSV'); }
  await page.fill(R + '.sr-r', ''); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sr-big')) === 'Layer tops at 5.0 m and 19.3 m under the forward shot' && !(await page.textContent(R + '.sr-facts')).includes('Dipping'), 'refraction: forward shot only');
  await page.fill(R + '.sr-f', '5 10\n10 20'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sr-err')).includes('at least 6 picks'), 'refraction: too few picks');
  await page.fill(R + '.sr-mh', '5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sr-merr')).includes('Enter 2 thicknesses'), 'refraction: bad model');
};
