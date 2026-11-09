// #727 Memory and attention tasks: run digit span, Corsi, visual search and simple/choice RT end to end,
// checking scores, the session table, the CSV, a false start, Stop, and bad settings.
export const path = '/science/memory-attention-tasks/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ma ';
  const txt = (s) => page.textContent(R + s);
  const dl = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  // Wait until trial n has begun, or the run has ended.
  const next = (n) => page.waitForFunction((k) => { const r = document.querySelector('.ma .ma-run'); return r.hidden || document.querySelector('.ma .ma-prog').textContent.startsWith(`Trial ${k} `); }, n, { timeout: 15000 });
  await page.goto(BASE + path);
  // Watch what the stage shows: digits, and which Corsi blocks light up.
  await page.evaluate(() => {
    const w = window; w.__seq = []; w.__ready = null; w.__lit = [];
    const stim = document.querySelector('.ma .ma-stim');
    new MutationObserver(() => { const t = stim.textContent; if (/^\d$/.test(t)) w.__seq.push(Number(t)); if (t === '?') { w.__ready = w.__seq; w.__seq = []; } }).observe(stim, { childList: true, characterData: true, subtree: true });
    new MutationObserver((ms) => { for (const m of ms) if (m.target.classList?.contains('ma-lit') && !String(m.oldValue).includes('ma-lit')) w.__lit.push(Number(m.target.dataset.i)); }).observe(document.querySelector('.ma .ma-blocks'), { attributes: true, attributeFilter: ['class'], attributeOldValue: true, subtree: true });
  });
  // Bad setting
  await page.fill(R + '.ma-len', '12'); await page.click(R + '.ma-start');
  await page.waitForSelector(R + '.ma-err:not([hidden])');
  check(/start length from 2 to 9/.test(await txt('.ma-err')), 'span: bad start length explained');
  // Digit span forward from 3: right, right, then wrong twice at 4.
  await page.fill(R + '.ma-len', '3'); await page.click(R + '.ma-start');
  for (let i = 0; i < 4; i++) {
    await page.waitForSelector(R + '.ma-recall:not([hidden])', { timeout: 15000 });
    const seq = await page.evaluate(() => { const s = window.__ready; window.__ready = null; return s; });
    if (i === 0) check(seq.length === 3, `span: three digits shown (${seq.join('')})`);
    await page.fill(R + '.ma-ans', i < 2 ? seq.join('') : '0');
    await page.press(R + '.ma-ans', 'Enter');
    await page.waitForSelector(R + '.ma-recall', { state: 'hidden' });
  }
  await page.waitForSelector(R + '.ma-out:not([hidden])', { timeout: 10000 });
  check((await txt('.ma-big')) === 'Span = 3' && /2 of 4/.test(await txt('.ma-facts')), `span: digit span 3, 2 of 4 (${await txt('.ma-big')})`);
  check((await page.locator(R + '.ma-tab td.ma-x').count()) === 2, 'span: wrong tries marked');
  // Corsi forward from 2: right twice, wrong (reversed) twice at 3.
  await page.click(R + '.ma-mode [data-m=corsi]'); await page.fill(R + '.ma-len', '2');
  await page.click(R + '.ma-start');
  for (let i = 0; i < 4; i++) {
    const L = i < 2 ? 2 : 3;
    await page.waitForFunction((n) => window.__lit.length >= n, L, { timeout: 15000 });
    await page.waitForTimeout(1300);
    const lit = await page.evaluate(() => { const s = window.__lit; window.__lit = []; return s; });
    const taps = i < 2 ? lit : lit.slice().reverse();
    for (const b of taps) await page.click(R + `.ma-blk[data-i="${b}"]`);
  }
  // The digit span result is still on screen, so wait for the Corsi result itself.
  await page.waitForFunction(() => { const o = document.querySelector('.ma .ma-out'); return !o.hidden && /Total score \(span × correct\)/.test(document.querySelector('.ma .ma-facts').textContent); }, null, { timeout: 15000 });
  check((await txt('.ma-big')) === 'Span = 2' && /Total score \(span × correct\)4/.test(await txt('.ma-facts')), `corsi: span 2, total score 4 (${await txt('.ma-big')})`);
  // Visual search: sizes 4 and 8, one trial each, keyboard.
  await page.click(R + '.ma-mode [data-m=search]'); await page.fill(R + '.ma-sizes', '4'); await page.click(R + '.ma-start');
  await page.waitForSelector(R + '.ma-err:not([hidden])');
  check(/two or more different set sizes/.test(await txt('.ma-err')), 'search: one set size explained');
  await page.fill(R + '.ma-sizes', '4, 8'); await page.fill(R + '.ma-per', '1'); await page.click(R + '.ma-start');
  for (let i = 0; i < 4; i++) {
    const a = await (await page.waitForSelector(R + '.ma-stage[data-answer]', { timeout: 8000 })).getAttribute('data-answer');
    if (i === 0) { const n = await page.locator(R + '.ma-it').count(); check(n === 4 || n === 8, `search: display has ${n} items`); }
    await page.waitForTimeout(50 + 20 * i);
    await page.keyboard.press(a === 'present' ? 'j' : 'f');
    await next(i + 2);
  }
  await page.waitForSelector(R + '.ma-out:not([hidden])', { timeout: 10000 });
  check(/ms per item \(target present\)/.test(await txt('.ma-big')) && /Absent ÷ present slope/.test(await txt('.ma-facts')), `search: slopes (${await txt('.ma-big')})`);
  check((await page.locator(R + '.ma-tab tbody tr').count()) === 4 && /100\.0 %/.test(await txt('.ma-facts')), 'search: 4 cells, all correct');
  // Simple RT with one false start.
  await page.click(R + '.ma-mode [data-m=rt]'); await page.fill(R + '.ma-rtn', '3'); await page.click(R + '.ma-start');
  // Press during the first wait (1 to 3 s), once the trial is listening: a fixed 300 ms could land before the run started on a busy machine.
  await page.waitForFunction((r) => document.querySelector(r + '.ma-prog')?.textContent === 'Trial 1 of 3' && document.querySelector(r + '.ma-stim')?.textContent === 'Wait…', R);
  await page.waitForTimeout(100); await page.keyboard.press(' ');
  for (let i = 0; i < 2; i++) {
    await page.waitForSelector(R + '.ma-stage[data-answer]', { timeout: 8000 });
    await page.waitForTimeout(80); await page.keyboard.press(' ');
    await next(i + 3);
  }
  await page.waitForSelector(R + '.ma-out:not([hidden])', { timeout: 10000 });
  const rf = await txt('.ma-facts');
  check(/^Median RT = \d+ ms$/.test(await txt('.ma-big')) && /False starts1/.test(rf) && /RTs used2 of 3/.test(rf), `rt: simple RT with a false start (${await txt('.ma-big')})`);
  // Choice RT by touch.
  await page.selectOption(R + '.ma-rtk', 'choice'); await page.click(R + '.ma-start');
  for (let i = 0; i < 3; i++) {
    const a = await (await page.waitForSelector(R + '.ma-stage[data-answer]', { timeout: 8000 })).getAttribute('data-answer');
    await page.waitForTimeout(60); await page.click(R + `.ma-keys button[data-v=${a}]`);
    await next(i + 2);
  }
  await page.waitForSelector(R + '.ma-out:not([hidden])', { timeout: 10000 });
  check(/Accuracy100\.0 %/.test(await txt('.ma-facts')), 'rt: choice RT all correct by touch');
  check((await page.locator(R + '.ma-sess tbody tr').count()) === 5, 'session table lists 5 runs');
  // Stop a run: nothing added.
  await page.click(R + '.ma-start'); await page.waitForTimeout(400); await page.keyboard.press('Escape');
  await page.waitForSelector(R + '.ma-err:not([hidden])');
  check(/Stopped/.test(await txt('.ma-err')) && await page.isHidden(R + '.ma-run'), 'Esc stops without scoring');
  const p = await dl('.ma-csv');
  const rows = readFileSync(p, 'utf8').trim().split('\n');
  check(rows.length === 1 + 4 + 4 + 4 + 3 + 3 && rows[0] === 'task,trial,condition,length,set_size,target,shown,response,correct,rt_ms' && rows.some((r) => r.includes('false start')), `CSV holds all ${rows.length - 1} trials`);
  const d = await dl('.dl [data-f=png]');
  check(readFileSync(d).subarray(1, 4).toString() === 'PNG', 'PNG report');
};
