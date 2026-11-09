// #722 Reaction time experiments: run short Stroop (keys), flanker (buttons) and n-back (Space) blocks,
// then check the summary, trimming options, CSV and report downloads, and the bad-setting message.
export const path = '/science/reaction-time-experiments/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rx ';
  const txt = (s) => page.textContent(R + s);
  const dl = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  const KEY = { red: 'r', green: 'g', blue: 'b', yellow: 'y' };
  await page.goto(BASE + path);
  // Bad setting
  await page.fill(R + '.rx-n', '3'); await page.click(R + '.rx-start');
  check(/between 8 and 200/.test(await txt('.rx-err')) && await page.isHidden(R + '.rx-run'), 'rt: too few trials message');
  // Stroop by keyboard: one wrong answer on trial 3.
  await page.fill(R + '.rx-n', '8'); await page.click(R + '.rx-start');
  check(await page.isVisible(R + '.rx-stage'), 'rt: Stroop stage shown');
  for (let i = 0; i < 8; i++) {
    const a = await (await page.waitForSelector(R + '.rx-stage[data-answer]', { timeout: 5000 })).getAttribute('data-answer');
    const ink = await page.evaluate(() => document.querySelector('.rx-stim').style.color);
    if (i === 0) check(ink !== '', 'rt: Stroop word drawn in an ink colour');
    await page.waitForTimeout(60);
    await page.keyboard.press(i === 2 ? (a === 'red' ? 'g' : 'r') : KEY[a]);
    await page.waitForSelector(R + '.rx-stage:not([data-answer])');
  }
  await page.waitForSelector(R + '.rx-out:not([hidden])', { timeout: 5000 });
  check(/^Stroop effect = −?\d+ ms$/.test(await txt('.rx-big')), `rt: Stroop effect shown (${await txt('.rx-big')})`);
  const f = await txt('.rx-facts');
  check(/87\.5 %/.test(f), 'rt: accuracy 7 of 8');
  check((await page.locator(R + '.rx-trials tbody tr').count()) === 8 && (await page.locator(R + '.rx-trials td.rx-x').count()) === 1, 'rt: 8 trials listed, one error marked');
  check((await page.locator(R + '.rx-tab tbody tr').count()) === 2, 'rt: congruent and incongruent rows');
  const rts = (await page.$$eval('.rx .rx-trials tbody tr td:last-child', (t) => t.map((x) => Number(x.textContent)))).filter(Number.isFinite);
  check(rts.length === 8 && rts.every((r) => r > 30 && r < 2000), `rt: plausible times (${rts.map(Math.round).join(' ')})`);
  await page.fill(R + '.rx-min', '5000'); await page.waitForTimeout(200);
  check(/7 too fast/.test(await txt('.rx-facts')), 'rt: fastest-RT rule drops trials');
  await page.fill(R + '.rx-min', '150'); await page.selectOption(R + '.rx-sd', '2'); await page.waitForTimeout(200);
  check(/RTs left out/.test(await txt('.rx-facts')), 'rt: SD rule recalculates');
  let p = await dl('.rx-csv');
  const lines = readFileSync(p, 'utf8').trim().split('\n');
  check(lines.length === 9 && lines[0].startsWith('task,trial,condition') && lines[3].endsWith(',0,' + lines[3].split(',').at(-1)) , 'rt: CSV of 8 trials with the error');
  p = await dl('.dl [data-f=docx]');
  check(readFileSync(p).subarray(0, 2).toString() === 'PK', 'rt: Word report');
  // Flanker by touch buttons, no feedback.
  await page.click(R + '.rx-mode [data-m=flanker]');
  await page.uncheck(R + '.rx-fb'); await page.click(R + '.rx-start');
  for (let i = 0; i < 8; i++) {
    const a = await (await page.waitForSelector(R + '.rx-stage[data-answer]', { timeout: 5000 })).getAttribute('data-answer');
    const s = await txt('.rx-stim');
    if (i === 0) check(/^[←→]{5}$/.test(s) && (s[2] === '←') === (a === 'left'), 'rt: flanker arrows');
    await page.waitForTimeout(40);
    await page.click(R + `.rx-keys button[data-v=${a}]`);
    await page.waitForSelector(R + '.rx-stage:not([data-answer])');
  }
  await page.waitForSelector(R + '.rx-out:not([hidden])', { timeout: 5000 });
  check(/^Flanker effect/.test(await txt('.rx-big')) && /100\.0 %/.test(await txt('.rx-facts')), 'rt: flanker all correct by touch');
  // N-back: 1-back, fast pace, answer every target, stop early with Esc.
  await page.click(R + '.rx-mode [data-m=nback]');
  await page.selectOption(R + '.rx-lvl', '1'); await page.selectOption(R + '.rx-pace', '1500'); await page.fill(R + '.rx-n', '10');
  await page.click(R + '.rx-start');
  for (let i = 0; i < 10; i++) {
    await page.waitForFunction((n) => /^Trial (\d+) /.exec(document.querySelector('.rx .rx-prog').textContent)?.[1] === String(n) && document.querySelector('.rx .rx-stage').dataset.answer, i + 1, { timeout: 5000 });
    const a = await page.getAttribute(R + '.rx-stage', 'data-answer');
    if (a === 'match') { await page.waitForTimeout(50); await page.keyboard.press(' '); }
  }
  await page.waitForSelector(R + '.rx-out:not([hidden])', { timeout: 5000 });
  const nf = await txt('.rx-facts');
  check(/^d′ = \d/.test(await txt('.rx-big')) && /False alarms0 of/.test(nf) && /1-back/.test(await txt('.rx-hd')), `rt: n-back d′ with no false alarms (${await txt('.rx-big')})`);
  await page.selectOption(R + '.rx-pace', '1500'); await page.click(R + '.rx-start');
  await page.waitForFunction(() => /^Trial 3 /.test(document.querySelector('.rx .rx-prog').textContent)); await page.keyboard.press('Escape');
  await page.waitForSelector(R + '.rx-out:not([hidden])', { timeout: 3000 });
  check(await page.isHidden(R + '.rx-run') && (await page.locator(R + '.rx-trials tbody tr').count()) === 2, 'rt: Esc stops a run and shows what was done');
};
