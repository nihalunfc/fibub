// #417 Correspondence network visualiser
export const path = '/science/correspondence-network/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/correspondence-network/`); await page.waitForTimeout(500);
  await page.click('.cnw .cn-ex'); await page.waitForTimeout(300);
  check((await page.textContent('.cnw .cn-big')) === '8 people, 35 letters, 2 communities', 'network: example summary');
  { const f = await page.textContent('.cnw .cn-facts'); check(f.includes('Modularity0.296') && f.includes('Most lettersEdward Moss (15)') && f.includes('Main go-betweenEdward Moss (0.595)') && f.includes('Pairs who wrote12'), `network: example facts ${f}`); }
  { const t = await page.textContent('.cnw .cn-ptab'); check(t.includes('Henry Price') && t.includes('0.571') && (await page.textContent('.cnw .cn-ptab tr:nth-child(2) td:first-child')) === 'Edward Moss', 'network: people table sorted by letters'); }
  check((await page.textContent('.cnw .cn-etab tr:nth-child(2)')).startsWith('Anna Price – Clara Price74 / 3'), 'network: pairs table');
  check(await page.isVisible('.cnw .cn-fig') && (await page.textContent('.cnw .cn-leg')).includes('and 2 more'), 'network: figure and legend');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cnw .cn-csv')]); const f = OUT + 'people.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0] === 'person,community,sent,received,degree,strength,betweenness' && rows.some((r) => r === 'Edward Moss,1,7,8,4,15,0.595238'), 'network: people CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cnw .cn-ecsv')]); const f = OUT + 'pairs.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 13 && rows[1] === 'Anna Price,Clara Price,7,4,3', 'network: pairs CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cnw .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'network: Word report'); }
  await page.fill('.cnw .cn-from', '1822'); await page.fill('.cnw .cn-to', '1823'); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-big')) === '7 people, 18 letters, 2 communities' && (await page.textContent('.cnw .cn-facts')).includes('Main go-betweenHenry Price (0.600)'), 'network: date filter 1822-1823');
  await page.fill('.cnw .cn-to', 'soon'); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-err')).includes('"To" should be a date'), 'network: bad date message');
  await page.fill('.cnw .cn-from', '1900'); await page.fill('.cnw .cn-to', ''); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-err')).startsWith('No letters fall between'), 'network: empty period message');
  await page.fill('.cnw .cn-from', ''); await page.selectOption('.cnw .cn-lab', 'all'); await page.fill('.cnw .cn-seed', '7'); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-big')) === '8 people, 35 letters, 2 communities', 'network: all names, another seed');
  await page.selectOption('.cnw .cn-lab', '0'); await page.waitForTimeout(200);
  check(await page.isVisible('.cnw .cn-fig'), 'network: no names');
  await page.fill('.cnw .cn-in', 'To\tFrom\tYear\nB\tA\t1800\nC\tA\t\nA\t\t1801\nD\tC\t1802'); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-big')) === '4 people, 3 letters, 2 communities' && (await page.textContent('.cnw .cn-facts')).includes('Left out1 unreadable row'), 'network: tab-separated with a header, a bad row');
  await page.fill('.cnw .cn-in', 'just one name'); await page.waitForTimeout(600);
  check((await page.textContent('.cnw .cn-err')).startsWith('No letters found'), 'network: no letters message');
  writeFileSync(OUT + 'letters.csv', 'from,to,date,place\n"Smith, John",Jane Roe,1790,London\nJane Roe,"Smith, John",1791,Paris\n');
  await page.setInputFiles('.cnw .dfb-in', OUT + 'letters.csv'); await page.waitForTimeout(700);
  check((await page.textContent('.cnw .cn-big')) === '2 people, 2 letters, 1 community' && (await page.textContent('.cnw .cn-ptab')).includes('Smith, John'), 'network: opened CSV file with quoted names');
};
