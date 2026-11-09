// #405 Seriation and correspondence analysis
export const path = '/science/seriation-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/seriation-analyser/`); await page.waitForTimeout(700);
  check((await page.textContent('.ser .se-big')) === '8 sites × 6 types, 531 finds. Axis 1 holds 54.4 % of the inertia.', 'seriation: example loads with the page');
  check((await page.textContent('.ser .se-facts')).includes('1.4430') && (await page.textContent('.ser .se-facts')).includes('766.2') && (await page.textContent('.ser .se-facts')).includes('30.9 %'), 'seriation: total inertia, χ² and axis 2');
  { const t = await page.textContent('.ser .se-rtab'); check(t.indexOf('Long Meadow') < t.indexOf('Old Ford') && t.indexOf('Mill Lane') < t.indexOf('Quarry Pit') && t.includes('−1.208'), 'seriation: sites in CA order with scores'); }
  check((await page.textContent('.ser .se-itab')).includes('0.78517') && await page.isVisible('.ser .se-bfig') && await page.isVisible('.ser .se-cfig'), 'seriation: inertia table and both figures');
  check((await page.textContent('.ser .se-brnote')).includes('0 breaks of that pattern, against 28') && (await page.textContent('.ser .se-br')).includes('142'), 'seriation: Brainerd-Robinson matrix');
  await page.check('.ser .se-rev'); await page.waitForTimeout(200);
  { const t = await page.textContent('.ser .se-rtab'); check(t.indexOf('Quarry Pit') < t.indexOf('Long Meadow'), 'seriation: reverse order'); }
  const dl = async (sel, name) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8'); };
  { const t = (await dl('.ser .se-csv', 'ser-ord.csv')).trim().split('\n'); check(t.length === 9 && t[0] === 'Site,Glazed,Stamped,Painted black,Painted red,Incised,Cord-marked' && t[1].startsWith('Quarry Pit,40,18'), 'seriation: ordered table CSV'); }
  { const t = await dl('.ser .se-scsv', 'ser-sc.csv'); check(t.startsWith('kind,name,order,mass,axis_1,axis_2,axis_3,axis_4,axis_5') && t.includes('site,Long Meadow,8,') && t.includes('\n1,0.78516'), 'seriation: CA scores CSV'); }
  { const t = (await dl('.ser .se-bcsv', 'ser-br.csv')).trim().split('\n'); check(t.length === 9 && t[1].startsWith('Quarry Pit,200,'), 'seriation: Brainerd-Robinson CSV'); }
  { await page.locator('.ser .dl [data-f=docx]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ser .dl [data-f=docx]')]); const f = OUT + 'ser.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'seriation: Word report'); }
  await page.fill('.ser .se-in', 'Site,A,B,C\nX,1,2,3\nY,4,oops,1\nZ,1,1,1'); await page.waitForTimeout(500);
  check((await page.textContent('.ser .se-msg')).includes('"oops" under B is not a count') && await page.isHidden('.ser .se-out'), 'seriation: bad count message');
  await page.fill('.ser .se-in', 'Site,A,B\nX,1,2\nY,4,1\nZ,1,1'); await page.waitForTimeout(500);
  check((await page.textContent('.ser .se-msg')).includes('at least 3 sites and 3 types'), 'seriation: too small');
  writeFileSync(OUT + 'ser.csv', 'Site,A,B,C,D\nP1,10,4,0,0\nP2,3,9,5,0\nP3,0,2,8,6\nP4,0,0,0,0\n');
  await page.setInputFiles('.ser .dfb-in', OUT + 'ser.csv'); await page.waitForTimeout(600);
  check((await page.textContent('.ser .se-big')).startsWith('3 sites × 4 types, 47 finds') && (await page.textContent('.ser .se-msg')).includes('Left out 1 site(s) with no finds: P4'), 'seriation: opened file, empty site left out');
  await page.uncheck('.ser .se-rev'); await page.click('.ser .se-ex'); await page.waitForTimeout(300);
};
