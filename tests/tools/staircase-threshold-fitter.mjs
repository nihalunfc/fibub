// #725 Staircase and threshold fitter: simulation, the paste-data fit (values checked against scipy),
// lapse and shape options, trial-format input, bad input, a short self-run, CSV and PDF downloads.
export const path = '/science/staircase-threshold-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.st ';
  const txt = (s) => page.textContent(R + s);
  const done = () => page.waitForSelector('.st[data-boot=done]', { timeout: 120000 });
  const settle = async () => { await page.waitForTimeout(500); await done(); };
  const dl = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  await page.goto(BASE + path);
  await done();
  check(/^75 % threshold = \d/.test(await txt('.st-big')), `stair: simulation gives a threshold (${await txt('.st-big')})`);
  let f = await txt('.st-facts');
  check(/Reversal mean/.test(f) && /70\.7 % correct/.test(f) && /True level at that %/.test(f) && / to /.test(f), 'stair: reversal mean, target and bootstrap interval shown');
  check(await page.isVisible(R + '.st-fig1') && await page.isVisible(R + '.st-fig2'), 'stair: track and curve figures');
  let p = await dl('.st-csv');
  check(readFileSync(p, 'utf8').trim().split('\n').length === 81, 'stair: CSV of 80 simulated trials');
  await page.selectOption(R + '.st-down', '1'); await settle();
  check(await page.inputValue(R + '.st-su') === '3' && /75\.0 % correct/.test(await txt('.st-facts')), 'stair: weighted 1-up-1-down aims at 75 %');
  await page.selectOption(R + '.st-down', '3'); await settle();
  check(/79\.4 % correct/.test(await txt('.st-facts')), 'stair: 1-up-3-down aims at 79.4 %');
  await page.selectOption(R + '.st-shape', 'weibull'); await page.waitForTimeout(300);
  check(/Weibull observer needs levels above 0/.test(await txt('.st-err')), 'stair: Weibull with level 0 explained');
  await page.selectOption(R + '.st-shape', 'logistic'); await settle();
  // Fit my data
  await page.click(R + '.st-mode [data-m=fit]'); await settle();
  check((await txt('.st-big')) === '75 % threshold = 4.086', `fit: logistic threshold 4.086 (${await txt('.st-big')})`);
  f = await txt('.st-facts');
  check(/Midpoint α4\.086/.test(f) && /Slope β0\.7856/.test(f) && /2\.413 on 6 df/.test(f) && /\b3\.\d+ to 4\.\d+/.test(f), 'fit: α, β, deviance and interval');
  await page.check(R + '.st-lfree'); await settle();
  check((await txt('.st-big')) === '75 % threshold = 3.996' && /0\.03975 \(fitted\)/.test(await txt('.st-facts')), `fit: free lapse (${await txt('.st-big')})`);
  await page.uncheck(R + '.st-lfree'); await page.fill(R + '.st-l', '0.02'); await page.selectOption(R + '.st-shape', 'weibull'); await settle();
  check((await txt('.st-big')) === '75 % threshold = 3.980', `fit: Weibull λ 0.02 (${await txt('.st-big')})`);
  await page.fill(R + '.st-pt', '80'); await settle();
  check(/^80 % threshold/.test(await txt('.st-big')), 'fit: threshold criterion changes');
  await page.fill(R + '.st-pt', '40'); await page.waitForTimeout(600);
  check(/between the guess rate/.test(await txt('.st-err')), 'fit: threshold below guess rate explained');
  await page.fill(R + '.st-pt', '75'); await page.fill(R + '.st-l', '0'); await page.selectOption(R + '.st-shape', 'logistic'); await settle();
  p = await dl('.st-csv');
  check(readFileSync(p, 'utf8').trim().split('\n').length === 9, 'fit: CSV of 8 levels');
  p = await dl('.dl [data-f=pdf]');
  check(readFileSync(p).subarray(0, 4).toString() === '%PDF', 'fit: PDF report');
  await page.fill(R + '.st-in', 'level\tcorrect\n1\t0\n1\t1\n2\t1\n2\t1\n3\t1\n3\t0\n4\t1\n4\t1'); await settle();
  check((await page.locator(R + '.st-tab tbody tr').count()) === 4, 'fit: one-row-per-trial data grouped into 4 levels');
  await page.fill(R + '.st-in', '1\t2\n2\t1'); await page.waitForTimeout(600);
  check(/1 \(correct\) or 0/.test(await txt('.st-err')), 'fit: bad trial code explained');
  await page.fill(R + '.st-in', '1\t5\t4\n2\t3\t4'); await page.waitForTimeout(600);
  check(/Row 1: the number correct/.test(await txt('.st-err')), 'fit: more correct than trials explained');
  // Try it yourself: 10 trials by keyboard.
  await page.click(R + '.st-mode [data-m=try]');
  check(await page.inputValue(R + '.st-start') === '24', 'try: brightness defaults loaded');
  await page.fill(R + '.st-n', '10'); await page.waitForTimeout(400);
  await page.click(R + '.st-go');
  for (let i = 0; i < 10; i++) {
    const a = await (await page.waitForSelector(R + '.st-stage[data-answer]', { timeout: 5000 })).getAttribute('data-answer');
    await page.waitForTimeout(30);
    await page.keyboard.press(i === 3 ? (a === 'left' ? 'ArrowRight' : 'ArrowLeft') : a === 'left' ? 'ArrowLeft' : 'ArrowRight');
    await page.waitForFunction((n) => { const p = document.querySelector('.st .st-prog'); return p.hidden || p.textContent.startsWith(`Trial ${n} `); }, i + 2, { timeout: 10000 });
  }
  await page.waitForSelector(R + '.st-out:not([hidden])', { timeout: 10000 }); await done();
  check(/threshold/.test(await txt('.st-big')) && await page.isHidden(R + '.st-stage'), 'try: 10-trial run fitted');
  p = await dl('.st-csv');
  const rows = readFileSync(p, 'utf8').trim().split('\n');
  check(rows.length === 11 && rows[4].split(',')[2] === '0' && rows[1].startsWith('1,24,1'), 'try: CSV has the wrong answer on trial 4');
};
