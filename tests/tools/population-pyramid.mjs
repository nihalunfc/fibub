export const path = '/science/population-pyramid/';
export default async ({ page, check, BASE, readFileSync, writeFileSync, OUT }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.pp-big');
  const sum = () => page.$$eval('.pp-sum tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check((await big()) === '2025: median age 38.6 (2000: 31.9)', `pyramid: medians (${await big()})`);
  let s = await sum();
  check(s[0][1] === '86,310' && s[0][2] === '77,140' && s[1][1] === '98.0' && s[5][1] === '25.9' && s[5][2] === '37.1' && s[6][1] === '23.6' && s[7][2] === '53.4' && s[8][1] === '15.8 %', `pyramid: summary table (${s.map((r) => r[1]).join(' ')})`);
  const g = await page.$$eval('.pp-tab tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  check(g.length === 18 && g[0][0] === '85+' && g[0][5] === '56.0', `pyramid: age table oldest first, 85+ sex ratio (${g[0].join(' ')})`);
  const drawn = (re) => page.waitForFunction((src) => { const c = document.querySelector('.pp-fig'); return c && c.width > 0 && new RegExp(src).test(c.getAttribute('aria-label') || ''); }, re, { timeout: 10000 }).then(() => true, () => false);
  check(await drawn('2000 as an outline'), 'pyramid: drawn with overlay');
  // Options.
  await page.selectOption('.pp-old', '60'); await page.waitForTimeout(300);
  s = await sum();
  check(s[6][0].startsWith('Old-age dependency (60+') && s[6][1] === '35.0', `pyramid: old age from 60 (${s[6][1]})`);
  await page.selectOption('.pp-old', '65');
  await page.selectOption('.pp-mode', 'count'); await page.waitForTimeout(300);
  check(await drawn('Population pyramid'), 'pyramid: counts mode');
  // Downloads.
  const [png] = await Promise.all([page.waitForEvent('download'), page.click('.pp-png')]);
  check(png.suggestedFilename() === 'pyramid-2025-2000.png', `pyramid: PNG (${png.suggestedFilename()})`);
  const [svg] = await Promise.all([page.waitForEvent('download'), page.click('.pp-svg')]);
  const sv = readFileSync(await svg.path(), 'utf8');
  check(svg.suggestedFilename() === 'pyramid-2025-2000.svg' && /<svg/.test(sv) && (sv.match(/<polygon/g) || []).length >= 37, 'pyramid: SVG');
  const [cs] = await Promise.all([page.waitForEvent('download'), page.click('.pp-csv')]);
  const ct = readFileSync(await cs.path(), 'utf8');
  check(/^Age,Male,Female,2000 male,2000 female/.test(ct) && /85\+,470,840,210,380/.test(ct), 'pyramid: CSV');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.pp .dl button[data-f="pdf"]')]);
  check(pdf.suggestedFilename() === 'pyramid-2025-2000.pdf', 'pyramid: PDF report');
  // Overlay off, rename.
  await page.uncheck('.pp-ov'); await page.fill('.pp-na', 'Town'); await page.waitForTimeout(400);
  check((await big()) === 'Town: median age 38.6' && (await page.isHidden('.pp-bbox')), 'pyramid: single population');
  // File, oldest first, groups not at 15/65.
  const f = OUT + 'pyr.csv';
  writeFileSync(f, 'Age,Female,Male\n20+,10,10\n10-19,10,10\n0-9,10,10\n');
  await page.setInputFiles('.pp .dfb-in >> nth=0', f);
  const ok = await page.waitForFunction(() => document.querySelector('.pp-big')?.textContent === 'Town: median age 15.0' && /start at 15 and 65/.test(document.querySelector('.pp-note')?.textContent || ''), null, { timeout: 15000 }).then(() => true, () => false);
  check(ok, `pyramid: file, reversed rows, no dependency (${await big()} | ${await page.textContent('.pp-note')})`);
  // Bad input.
  await page.check('.pp-ov'); await page.waitForTimeout(400);
  check(/same age groups/.test(await page.textContent('.pp-err')), 'pyramid: mismatched groups refused');
  await page.uncheck('.pp-ov');
  await page.fill('.pp-a', 'Age,Male\n0,1\n1,2'); await page.waitForTimeout(400);
  check(/Age, Male and Female/.test(await page.textContent('.pp-err')), 'pyramid: missing column explained');
};
