// #T935 Jet lag planner
export const path = '/everyday/jet-lag-planner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/jet-lag-planner/`); await page.waitForTimeout(300);
  const R = '.jl ';
  await page.fill(R + '.jl-date', '2026-11-20'); await page.waitForTimeout(100);
  const beds = (c) => page.$$eval(R + `.jl-rows tr.${c}`, (rs) => rs.map((r) => r.dataset.bed).join(' '));
  check((await page.getAttribute(R + '.jl-big', 'data-diff')) === '300', 'jet lag: Toronto -> London is +5 h');
  check((await beds('jl-pre')) === '22:00 21:00 20:00' && (await beds('jl-post')) === '00:00 23:00 23:00', `jet lag: east gives earlier bedtimes 1 h a day (${await beds('jl-pre')} / ${await beds('jl-post')})`);
  check((await page.textContent(R + '.jl-rows tr.jl-pre td:nth-child(6)')) === '16:00', 'jet lag: caffeine cut-off 6 h before 22:00');
  await page.click(R + '.jl-swap'); await page.waitForTimeout(100);
  check((await beds('jl-pre')) === '00:00 01:00 02:00' && (await beds('jl-post')) === '22:00 23:00 23:00', `jet lag: west gives later bedtimes (${await beds('jl-pre')} / ${await beds('jl-post')})`);
  await page.selectOption(R + '.jl-to', 'Europe/London'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.jl-big')) === 'No plan needed' && await page.isHidden(R + '.jl-plan'), 'jet lag: same zone -> no plan needed');
  await page.click(R + '.jl-reset'); await page.waitForTimeout(100);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true))); await page.waitForTimeout(80);
  await page.fill(R + '.jl-date', '2026-11-20');
  await page.selectOption(R + '[data-k="pre"]', '1'); await page.selectOption(R + '[data-k="days"]', '5'); await page.waitForTimeout(100);
  check((await beds('jl-pre')) === '22:00' && (await page.$$(R + '.jl-rows tr.jl-post')).length === 5, `jet lag: 1 day before and 5 after (${await beds('jl-pre')})`);
  await page.selectOption(R + '[data-k="pre"]', '0'); await page.waitForTimeout(100);
  check((await page.$$(R + '.jl-rows tr.jl-pre')).length === 0 && (await beds('jl-post')).startsWith('03:00'), `jet lag: no days before shifts everything after landing (${await beds('jl-post')})`);
  await page.selectOption(R + '[data-k="land"]', 'morning'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.jl-landtip')).includes('Landing in the morning'), 'jet lag: landing tip shows');
};
