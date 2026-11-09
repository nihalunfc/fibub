// #315 ethogram logger
export const path = '/science/ethogram-logger/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.eth ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(400);
  check((await page.$$(R + '.eth-pad button')).length === 6 && await page.isDisabled(R + '.eth-pad button') && await page.isHidden(R + '.eth-out'), 'ethogram: six behaviour buttons, idle');
  // The made-up example session.
  await page.click(R + '.eth-example'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.eth-big')) === '11:00 observed; most time Foraging (50.6 %)', `ethogram: example headline (${await page.textContent(R + '.eth-big')})`);
  { const t = await page.textContent(R + '.eth-states'); check(t.includes('Foraging334.250.6937.142.48.860.0') && t.includes('Resting189.028.64') && t.includes('Vigilant54.88.304'), `ethogram: time budget table (${t})`); }
  { const t = await page.textContent(R + '.eth-events'); check(t.includes('Call80.727') && t.includes('Scratch90.818'), 'ethogram: events'); }
  check((await page.textContent(R + '.eth-facts')).includes('97 %') && (await page.textContent(R + '.eth-facts')).includes('20.0 s with no state'), 'ethogram: unscored time');
  check(await page.isVisible(R + '.eth-tl') && await page.isVisible(R + '.eth-bud'), 'ethogram: timeline and budget charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.eth-csv')]); const f = OUT + 'eth-log.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 40 && rows[0] === 'time_s,clock,behaviour,type' && rows[1] === '0.0,0:00.0,Vigilant,state' && rows.some((r) => r.endsWith(',,stop')), 'ethogram: log CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.eth-scsv')]); const f = OUT + 'eth-sum.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8');
    check(t.includes('Foraging,state,334.20,0.50636,9,37.13,42.40,8.80,60.00,') && t.includes('Call,event,,,8,,,,,0.7273') && t.includes('(no state),unscored,20.00'), 'ethogram: summary CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'ethogram: PDF report'); }
  // A live session on a fake clock: keys, taps, a stop by pressing the running key, an event and undo.
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') }); await page.goto(`${BASE}${path}`); await page.waitForTimeout(200); await page.clock.pauseAt(new Date('2026-01-01T01:00:00Z'));
  await page.fill(R + '.eth-def', 'a, Alert, state\nb, Browse, state\nx, Sneeze, event');
  check((await page.$$(R + '.eth-pad button')).length === 3, 'ethogram: own ethogram');
  await page.click(R + '.eth-start');
  await page.keyboard.press('a'); await page.clock.runFor(10000);
  await page.keyboard.press('b'); await page.clock.runFor(5000);
  await page.keyboard.press('x'); await page.clock.runFor(5000);
  check((await page.textContent(R + '.eth-now')) === 'Browse' && (await page.getAttribute(R + '.eth-pad button[data-key=b]', 'aria-pressed')) === 'true', 'ethogram: running state shown');
  await page.keyboard.press('b'); await page.clock.runFor(4000);
  check((await page.textContent(R + '.eth-now')) === 'no state', 'ethogram: pressing the running key stops it');
  await page.locator(R + '.eth-pad button[data-key=a]').scrollIntoViewIfNeeded(); await page.click(R + '.eth-pad button[data-key=a]'); await page.clock.runFor(6000);
  await page.keyboard.press('x'); await page.click(R + '.eth-undo');
  check((await page.$$(R + '.eth-log tbody tr')).length === 5, 'ethogram: undo removes the last entry');
  await page.click(R + '.eth-stop'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.eth-states'); check(t.includes('Alert16.0') && t.includes('Browse10.0') && (await page.textContent(R + '.eth-events')).includes('Sneeze1') && (await page.textContent(R + '.eth-big')).startsWith('0:30 observed; most time Alert (53.3 %)'), `ethogram: live session result (${t})`); }
  // Remember the ethogram, then clear it.
  await page.check(R + '.eth-remember');
  check((await page.evaluate(() => localStorage.getItem('fibub-ethogram-v1'))).includes('Sneeze'), 'ethogram: remembered only when ticked');
  await page.reload(); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.eth-def')).includes('Browse') && await page.isChecked(R + '.eth-remember'), 'ethogram: remembered after reload');
  await page.click(R + '.eth-clear');
  check((await page.evaluate(() => localStorage.getItem('fibub-ethogram-v1'))) === null && !(await page.isChecked(R + '.eth-remember')), 'ethogram: clear removes it');
  // Bad definitions.
  await page.fill(R + '.eth-def', 'a, Alert, state\nA, Again, state');
  check((await page.textContent(R + '.eth-deferr')).includes('used twice'), 'ethogram: duplicate key message');
  await page.fill(R + '.eth-def', 'a, Alert, sometimes');
  check((await page.textContent(R + '.eth-deferr')).includes('"state" or "event"'), 'ethogram: bad type message');
  await page.clock.resume(); // let time run again for the tools tested after this one
};
