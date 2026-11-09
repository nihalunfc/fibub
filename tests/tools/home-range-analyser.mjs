// #316 home range analyser
export const path = '/science/home-range-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.hra ';
  const big = () => page.textContent(R + '.hra-big'), facts = () => page.textContent(R + '.hra-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await big()) === 'Kernel 95 %: 315.2 ha; 100 % MCP: 232.4 ha', `home range: example result (${await big()})`);
  { const f = await facts(); check(f.includes('181.7 ha') && f.includes('171 fixes') && f.includes('86.64 ha') && f.includes('194.5 m') && f.includes('over 29.8 days'), 'home range: MCP 95, core area, bandwidth'); }
  { const m = await page.textContent(R + '.hra-move'); check(m.includes('469.9 m mean') && m.includes('median 400.5 m') && m.includes('usually 4 h apart') && m.includes('resultant length 0.093'), `home range: movement (${m})`); }
  check(await page.isVisible(R + '.hra-map') && await page.isVisible(R + '.hra-steps') && await page.isVisible(R + '.hra-turns'), 'home range: map and histograms');
  await page.selectOption(R + '.hra-unit', 'km2'); await page.waitForTimeout(500);
  check((await big()) === 'Kernel 95 %: 3.152 km²; 100 % MCP: 2.324 km²', 'home range: km²');
  await page.selectOption(R + '.hra-hmode', 'set'); await page.fill(R + '.hra-h', '300'); await page.waitForTimeout(600);
  check((await big()).startsWith('Kernel 95 %: 4.38') && (await facts()).includes('h ref would be 194.5 m') && (await facts()).includes('1.195 km²'), `home range: bandwidth set to 300 m (${await big()})`);
  await page.selectOption(R + '.hra-grid', '400'); await page.waitForTimeout(800);
  check((await big()).startsWith('Kernel 95 %: 4.38') && (await facts()).includes('1.195 km²') && (await facts()).includes('cells of 11.2 m'), `home range: fine grid (${await facts()})`);
  await page.selectOption(R + '.hra-unit', 'ha'); await page.selectOption(R + '.hra-hmode', 'ref'); await page.selectOption(R + '.hra-grid', '200'); await page.waitForTimeout(600);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hra-csv')]); const f = OUT + 'hr-steps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 181 && rows[0].startsWith('fix,time_utc,lat,lon,x_m,y_m,step_to_next_m') && rows[1].split(',')[1] === '2026-05-01T00:00:00Z' && rows[2].split(',')[7] === '14400', 'home range: steps CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hra-sum')]); const f = OUT + 'hr-sum.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(/mcp100_area,232\.37\d\d,ha/.test(t) && /kernel95_area,315\.2\d+,ha/.test(t), 'home range: summary CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'home range: image report'); }
  await page.fill(R + '.hra-data', 'lon,extra,lat\n-1.30,a,52.10\n-1.29,b,52.10\n-1.29,c,52.11\n-1.30,d,52.11\n-1.295,e,52.105'); await page.waitForTimeout(600);
  check((await facts()).includes('times not read') && (await page.textContent(R + '.hra-move')).includes('no times'), 'home range: columns by header name, no time column');
  await page.fill(R + '.hra-data', 'time,lat,lon\n2026-05-01 00:00,52.1,-1.3\n2026-05-01 04:00,95,-1.3'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hra-err')).includes('at least 5') && await page.isHidden(R + '.hra-out'), 'home range: too few fixes message');
  await page.fill(R + '.hra-data', 'time,lat,lon\n1,10,179.9\n2,10.1,-179.9\n3,10.2,179.8\n4,10.1,-179.8\n5,10,179.7'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hra-err')).includes('180° meridian'), 'home range: antimeridian message');
  await page.fill(R + '.hra-data', 'time,lat,lon\n1,10,20\n2,10.1,20.1\n3,10.2,20.2\n4,10.3,20.3\n5,10.4,20.4'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.hra-err')).includes('one line'), 'home range: fixes in a line message');
};
