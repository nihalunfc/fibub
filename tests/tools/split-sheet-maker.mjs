// #T1049 Split sheet
export const path = '/everyday/split-sheet-maker/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/split-sheet-maker/`); await page.waitForTimeout(300);
  const R = '.ssm ';
  await page.fill(R + '.ssm-title', 'Night Drive');
  await page.click(R + '.ssm-add');
  check((await page.$$(R + '.ssm-person')).length === 3, 'split sheet: three people after Add');
  await page.click(R + '.ssm-equal');
  const t = await page.textContent(R + '.ssm-result');
  check(t.includes('Writing total 100%') && t.includes('master total 100%') && t.includes('Both columns add up'), `split sheet: equal split of 3 totals 100 (${t})`);
  check((await page.inputValue(R + '.ssm-person:nth-child(1) [data-k=writing]')) === '33.34', 'split sheet: first person gets the extra 0.01');
  await page.fill(R + '.ssm-person:nth-child(1) [data-k=writing]', '50');
  const u = await page.textContent(R + '.ssm-result');
  check(u.includes('Writing adds up to 116.66%') && u.includes('16.66% too much'), `split sheet: friendly over-100 message (${u})`);
  await page.fill(R + '.ssm-person:nth-child(1) [data-k=name]', 'Ana, A');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ssm-csv')]); const f = OUT + 'ss.csv'; await d.saveAs(f);
  const lines = readFileSync(f, 'utf8').trim().split('\n');
  check(lines.length === 5 && lines[1].includes('"Ana, A"') && lines[4].endsWith('116.66,100'), `split sheet: CSV rows and totals (${lines[4]})`);
};
