// NPV and IRR: the made-up project, several IRRs, calendar-year periods, MIRR rates, downloads and bad input.
export const path = '/science/npv-irr-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  page.setDefaultTimeout(120000); // pages load slowly when many builds share the machine; reset at the end
  const dl = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
  const waitBig = (re) => page.waitForFunction((s) => new RegExp(s).test(document.querySelector('.nv-big')?.textContent || ''), re.source);
  const waitErr = (re) => page.waitForFunction((s) => { const e = document.querySelector('.nv-err'); return e && !e.hidden && new RegExp(s).test(e.textContent || ''); }, re.source);
  await page.goto(BASE + path);
  check((await page.textContent('.nv-big')) === 'NPV $2,443.57 at 10.00 %', `npv: example (${await page.textContent('.nv-big')})`);
  const f = await page.textContent('.nv-facts');
  check(/IRR20\.01 %/.test(f) && /MIRR14\.92 %/.test(f) && /Payback2\.58 years/.test(f) && /Discounted payback3\.11 years/.test(f) && /index1\.244/.test(f) && /\$644\.61/.test(f), `npv: facts (${f})`);
  check(await page.isHidden('.nv-warn') && /Positive/.test(await page.textContent('.nv-verdict')), 'npv: one IRR, no warning');
  check((await page.locator('.nv-tab tbody tr').count()) === 6 && /0\.6209/.test(await page.textContent('.nv-tab')), 'npv: period table with discount factors');
  const csv = readFileSync(await dl('.nv-csv'), 'utf8');
  check(/^Measure,Value\nNPV,2443\.5737747/.test(csv) && /IRR 1,0\.200141737/.test(csv), 'npv: CSV download');
  check(readFileSync(await dl('.dl [data-f=pdf]')).slice(0, 4).toString() === '%PDF', 'npv: PDF report');
  // New options: compare with project B, dated cash flows (XNPV and XIRR).
  await page.evaluate(() => document.querySelectorAll('.nv details').forEach((d) => { d.open = true; }));
  await page.fill('.nv-b', '-8000\n2000\n3000\n3500\n3500');
  await page.waitForFunction(() => !document.querySelector('.nv-cw')?.hidden);
  { const t = await page.textContent('.nv-cmp'), n = await page.textContent('.nv-cmpn');
    check((await page.locator('.nv-cmp tr').count()) === 7 && t.includes('$2,443.57') && t.includes('$1,317.67') && t.includes('16.73 %'), `npv: compare table (${t})`);
    check(n.startsWith('At 10.00 %, A has the higher NPV, by $1,125.90.') && n.includes('equal at 33.74 %') && n.includes('padded with zeros'), `npv: compare sentence (${n})`); }
  await page.fill('.nv-b', '-8000\nlots');
  await page.waitForFunction(() => /Project B/.test(document.querySelector('.nv-cmpn')?.textContent || ''));
  check((await page.textContent('.nv-cmpn')).includes('"lots" is not an amount'), 'npv: bad project B explained');
  await page.fill('.nv-b', '');
  await page.waitForFunction(() => document.querySelector('.nv-cw')?.hidden);
  await page.fill('.nv-cf', '2026-01-01\t-10000\n2027-01-01\t3000\n2028-01-01\t4200\n2029-01-01\t4800\n2030-01-01\t2500\n2031-01-01\t1500');
  await page.check('.nv-dated');
  await page.waitForFunction(() => /XNPV/.test(document.querySelector('.nv-dbig')?.textContent || ''));
  check((await page.textContent('.nv-dbig')) === 'XNPV $2,441.94 at 10.00 % a year' && await page.isHidden('.nv-out'), `npv: XNPV (${await page.textContent('.nv-dbig')})`);
  { const f = await page.textContent('.nv-dfacts'); check(f.includes('XIRR20.00 %') && f.includes('5.003 years') && f.includes('1826 days'), `npv: XIRR and span (${f})`); }
  check((await page.locator('.nv-dtab tr').count()) === 7 && (await page.textContent('.nv-dtab')).includes('1461'), 'npv: dated table');
  { const c = readFileSync(await dl('.nv-dcsv'), 'utf8'); check(/^Measure,Value\nXNPV,2441\.9432/.test(c), 'npv: dated CSV'); }
  await page.fill('.nv-cf', '2026-01-01\t-10000\n2026-13-01\t3000');
  await waitErr(/is not a date/);
  check(true, 'npv: bad date explained');
  await page.fill('.nv-cf', '2026-01-01\t-10000\n2025-06-01\t3000');
  await waitErr(/earlier than the first date/);
  check(true, 'npv: earlier date explained');
  await page.uncheck('.nv-dated');
  await page.fill('.nv-cf', '0\t-10000\n1\t3000\n2\t4200\n3\t4800\n4\t2500\n5\t1500');
  await waitBig(/NPV \$2,443\.57/);
  await page.fill('.nv-fin', '8'); await page.fill('.nv-re', '12');
  await page.waitForFunction(() => /MIRR15\.53 %|finance 8\.00 %/.test(document.querySelector('.nv-facts')?.textContent || ''));
  check(/finance 8\.00 %, reinvestment 12\.00 %/.test(await page.textContent('.nv-facts')), 'npv: MIRR rates');
  await page.fill('.nv-cf', '-1600\n10000\n-10000');
  await waitBig(/−\$773\.55/);
  check(/25\.00 %, 400\.00 %/.test(await page.textContent('.nv-facts')) && /no single meaning/.test(await page.textContent('.nv-warn')) && /Negative/.test(await page.textContent('.nv-verdict')), 'npv: two IRRs warned');
  await page.fill('.nv-cf', 'Year\tFlow\n2025\t-500\n2026\t300\n2027\t300');
  await waitBig(/NPV \$20\.66/);
  check(/Payback1\.67 years/.test(await page.textContent('.nv-facts')), 'npv: calendar years as periods');
  await page.selectOption('.nv-per', 'month');
  await page.waitForFunction(() => /months/.test(document.querySelector('.nv-facts')?.textContent || ''));
  check(/Equivalent monthly amount/.test(await page.textContent('.nv-facts')), 'npv: monthly periods');
  await page.fill('.nv-cf', '100\n200\n300');
  await waitBig(/NPV/);
  await page.waitForFunction(() => /IRRnone/.test(document.querySelector('.nv-facts')?.textContent || ''));
  check(/never change sign/.test(await page.textContent('.nv-facts')), 'npv: no IRR when flows never change sign');
  await page.fill('.nv-cf', 'Year\tFlow\n2025\t-500\n2027\t300');
  await waitErr(/follow on one by one/);
  check(true, 'npv: skipped period explained');
  await page.fill('.nv-cf', '-500\nlots');
  await waitErr(/"lots" is not an amount/);
  check(true, 'npv: text explained');
  await page.fill('.nv-cf', '-500\n600'); await page.fill('.nv-r', '-150');
  await waitErr(/above −100 %/);
  check(true, 'npv: impossible rate explained');
  page.setDefaultTimeout(30000);
};
