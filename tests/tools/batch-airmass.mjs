// #833 Batch airmass planner
export const path = '/science/batch-airmass/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.bam ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.bm-big');
  const wait = () => page.waitForTimeout(600);
  const rows = () => page.$$eval(R + '.bm-tab tbody tr', (trs) => trs.map((t) => [...t.cells].map((c) => c.textContent)));
  await page.goto(`${BASE}${path}`);
  await page.evaluate(() => sessionStorage.setItem('fibub-sky-place-v1', JSON.stringify({ name: 'Toronto', lat: 43.65, lon: -79.38, elev: 76, tz: 'America/Toronto' })));
  await page.goto(`${BASE}${path}?date=2026-01-14`); await page.waitForTimeout(900);
  await page.selectOption('.sp-tz', 'America/Toronto'); await wait();
  check((await big()) === '6 of 8 targets reach airmass 2 or better between 18:47 and 06:06 (11 h 19 min)', `bam: dark-time headline (${await big()})`);
  check((await txt('.bm-night')).includes('Airmass 2 is 29.90° up by Kasten and Young (1989)') && (await txt('.bm-night')).includes('12 % lit'), 'bam: night line');
  await page.selectOption(R + '.bm-span', 'sun'); await wait();
  check((await big()) === '7 of 8 targets reach airmass 2 or better between 17:05 and 07:47 (14 h 43 min)', `bam: sunset to sunrise (${await big()})`);
  { const r = await rows(); const o = r[0]; check(o[0] === 'Orion Nebula' && o[3] === '22:15' && o[4] === '41.0°' && o[7] === '1.522' && o[8] === '5 h 08 min' && o[9] === '19:41–00:49' && o[10] === '145°', `bam: Orion Nebula row (${o.join('|')})`); check(r[5][0] === 'Omega Centauri' && r[5][7] === 'not up' && r[5][8] === '–', 'bam: a target that never rises'); }
  await page.waitForFunction(() => document.querySelector('.bam .bm-fig').width > 100);
  check((await txt('.bm-figleg')).includes('every target'), 'bam: chart of every target');
  // Sorting.
  await page.click(R + '.bm-sort[data-k="8"]'); await wait();
  { const r = await rows(); check(r[0][0] === 'Omega Centauri' && r[7][0] === 'Crab Nebula', 'bam: sort by time below the limit, ascending'); }
  await page.click(R + '.bm-sort[data-k="8"]'); await wait();
  { const r = await rows(); check(r[0][0] === 'Crab Nebula' && (await txt('.bm-tab thead')).includes('Time ≤ limit ▼'), 'bam: and descending'); }
  await page.click(R + '.bm-sort[data-k="0"]'); await wait();
  check((await rows())[0][0] === 'Andromeda Galaxy', 'bam: sort by name');
  // Formula, limit, refraction, step.
  await page.selectOption(R + '.bm-f', 'secz'); await wait();
  check((await txt('.bm-night')).includes('Airmass 2 is 30.00° up by sec z') && (await txt('.bm-cite')).includes('flat atmosphere'), 'bam: sec z');
  await page.selectOption(R + '.bm-f', 'hardie'); await wait();
  check((await txt('.bm-cite')).includes('Hardie, R. H. 1962'), 'bam: Hardie cited');
  await page.selectOption(R + '.bm-f', 'pickering'); await wait();
  check((await txt('.bm-night')).includes('by Pickering (2002)'), 'bam: Pickering');
  await page.selectOption(R + '.bm-f', 'ky');
  await page.fill(R + '.bm-lim', '1.5'); await wait();
  check((await big()).startsWith('6 of 8 targets reach airmass 1.5'), `bam: limit 1.5 (${await big()})`);
  await page.fill(R + '.bm-lim', '0.5'); await wait();
  check((await txt('.bm-err')).includes('between 1 and 40'), 'bam: bad limit');
  await page.fill(R + '.bm-lim', '2'); await page.uncheck(R + '.bm-ref'); await wait();
  check((await big()).startsWith('7 of 8'), 'bam: without refraction');
  await page.check(R + '.bm-ref');
  await page.fill(R + '.bm-step', '30'); await wait();
  check((await page.$$eval(R + '.bm-steps tbody tr', (t) => t.length)) === 30, 'bam: 30-minute steps');
  await page.fill(R + '.bm-step', '0'); await wait();
  check((await txt('.bm-err')).includes('1 to 240 minutes'), 'bam: bad step');
  await page.fill(R + '.bm-step', '60'); await wait();
  // CSVs.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bm-csv')]); const f = OUT + 'bm.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); const o = r.find((x) => x.startsWith('Orion Nebula')).split(','); check(r.length === 9 && r[0].startsWith('name,ra_deg,dec_deg,transit_utc') && o[3].startsWith('2026-01-15T03:15:4') && Math.abs(+o[8] - 5.13) < 0.01, 'bam: summary CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bm-csv2')]); const f = OUT + 'bm2.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 16 && r[0].startsWith('time_utc,time_America_Toronto,') && r[0].split(',').length === 2 + 24, `bam: step CSV (${r.length})`); }
  // Own times, other spans.
  await page.selectOption(R + '.bm-span', 'own'); await page.fill(R + '.bm-t0', '21:00'); await page.fill(R + '.bm-t1', '01:30'); await page.dispatchEvent(R + '.bm-t1', 'input'); await wait();
  check((await big()).endsWith('between 21:00 and 01:30 (4 h 30 min)'), `bam: own times (${await big()})`);
  for (const s of ['naut', 'civil']) { await page.selectOption(R + '.bm-span', s); await wait(); check((await big()).includes('targets reach'), `bam: ${s} twilight span`); }
  // Parsing: decimal hours, bad lines.
  await page.fill(R + '.bm-data', 'A 5.5881 -5.39\nB, 05:35:17, -5.39\nC, 99 00 00, 10'); await page.check(R + '.bm-rah'); await wait();
  { const r = await rows(); check(r.length === 2 && r[0][1] === '05h 35m 17.2s' && (await txt('.bm-bad')).includes('line 3'), 'bam: decimal RA in hours, and a bad line'); }
  await page.uncheck(R + '.bm-rah'); await wait();
  check((await rows())[0][1] === '00h 22m 21.1s', 'bam: decimal RA in degrees');
  await page.fill(R + '.bm-data', ''); await wait();
  check((await txt('.bm-err')).includes('Paste a target list'), 'bam: empty list');
  await page.click(R + '.bm-ex'); await page.selectOption(R + '.bm-span', 'dark'); await wait();
  check((await big()) === '6 of 8 targets reach airmass 2 or better between 18:47 and 06:06 (11 h 19 min)', 'bam: example restored');
  // A midsummer night far north has no dark time.
  await page.evaluate(() => sessionStorage.setItem('fibub-sky-place-v1', JSON.stringify({ name: 'North', lat: 64.1, lon: -21.9, elev: 0, tz: 'Atlantic/Reykjavik' })));
  await page.goto(`${BASE}${path}?date=2026-06-21`); await wait();
  check((await txt('.bm-err')).includes('never gets fully dark'), 'bam: no dark time at midsummer, 64° N');
  { const vp = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await page.selectOption(R + '.bm-span', 'sun'); await wait(); await page.locator(R + '.bm-out').screenshot({ path: OUT + 'bm-375-out.png' }); await page.setViewportSize(vp); }
  await page.evaluate(() => sessionStorage.removeItem('fibub-sky-place-v1'));
};
