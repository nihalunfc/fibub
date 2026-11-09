// #813 protocol timer (real time, with steps of a second or two)
export const path = '/science/protocol-timer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const T = '.ptm ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(300);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-protocols-v1'); } catch {} }); await page.reload(); await page.waitForTimeout(400);
  check((await page.textContent(T + '.pt-sum')) === '9 steps, 3 h 30 min in all.' && (await page.textContent(T + '.pt-store')).includes('Nothing is sent to fibub'), 'protocol: example blot loaded, total time, storage statement');
  const alarms = async () => Number(await page.getAttribute('.ptm', 'data-alarms'));
  const run = (n) => `${T}.pt-run:nth-child(${n}) `;
  // Bad input.
  await page.fill(T + '.pt-steps', 'Wash\nRinse, 30 s'); await page.waitForTimeout(100);
  check((await page.textContent(T + '.pt-err')).startsWith('Line 1 ("Wash")') && (await page.textContent(T + '.pt-sum')) === '1 step, 30 s in all.', 'protocol: unreadable line is named');
  await page.click(T + '.pt-start'); check(await page.isHidden(T + '.pt-runs-card'), 'protocol: no timer starts with errors');
  // Runs on by itself.
  await page.fill(T + '.pt-name', 'Quick'); await page.fill(T + '.pt-steps', 'Mix, 1 s\nSpin, 1 s'); await page.check(T + '.pt-auto');
  await page.click(T + '.pt-start'); await page.waitForTimeout(300);
  check((await page.textContent(run(1) + '.pt-step')) === 'Step 1 of 2: Mix' && (await page.textContent(run(1) + '.pt-meta')).includes('Next: Spin.'), 'protocol: timer started');
  await page.waitForTimeout(2300);
  check((await page.textContent(run(1) + '.pt-state')) === 'Finished' && (await alarms()) === 2 && (await page.textContent(run(1) + '.pt-meta')).startsWith('Finished at'), `protocol: both steps ran on and rang (${await alarms()} alarms)`);
  // Waits for you.
  await page.fill(T + '.pt-name', 'Hands-on'); await page.fill(T + '.pt-steps', 'Load, 1 s\nRun, 1 s'); await page.uncheck(T + '.pt-auto');
  await page.click(T + '.pt-start'); await page.waitForTimeout(1600);
  check((await page.textContent(run(2) + '.pt-state')) === 'Step done: waiting for you' && (await page.textContent(run(2) + '.pt-clock')).startsWith('+0:0') && (await page.textContent(run(2) + '[data-a=next]')) === 'Start Run' && (await alarms()) === 3, 'protocol: waits for you and counts the time over');
  await page.click(run(2) + '[data-a=next]'); await page.waitForTimeout(200);
  check((await page.textContent(run(2) + '.pt-step')) === 'Step 2 of 2: Run' && (await page.textContent(run(2) + '.pt-state')) === 'Running', 'protocol: next step started by hand');
  await page.waitForTimeout(1200);
  check((await page.textContent(run(2) + '.pt-state')) === 'Finished' && (await alarms()) === 4 && await page.isHidden(run(2) + '[data-a=next]'), 'protocol: the last step ends the run');
  // A long timer: pause, resume, add and take away time, restart, skip.
  await page.fill(T + '.pt-name', 'Long'); await page.fill(T + '.pt-steps', 'Incubate, 10 min\nCool, 20 min'); await page.check(T + '.pt-auto');
  await page.click(T + '.pt-start'); await page.waitForTimeout(300);
  const clk = async () => page.textContent(run(3) + '.pt-clock');
  check(['10:00', '9:59'].includes(await clk()) && (await page.textContent(run(3) + '.pt-meta')).includes('(30 min left)'), 'protocol: 10-minute step and finish time');
  check((await page.title()).includes('Incubate'), 'protocol: countdown in the tab title');
  await page.click(run(3) + '[data-a=pause]'); const c1 = await clk(); await page.waitForTimeout(1300);
  check((await clk()) === c1 && (await page.textContent(run(3) + '.pt-state')) === 'Paused' && (await page.textContent(run(3) + '[data-a=pause]')) === 'Resume', 'protocol: pause holds the time');
  await page.click(run(3) + '[data-a=pause]'); await page.click(run(3) + '[data-a=add]'); await page.waitForTimeout(150);
  check(['11:00', '10:59', '10:58'].includes(await clk()) && (await page.textContent(run(3) + '.pt-list li:first-child')) === 'Incubate (11 min)', `protocol: +1 min (${await clk()})`);
  await page.click(run(3) + '[data-a=sub]'); await page.click(run(3) + '[data-a=sub]'); await page.waitForTimeout(150);
  check(['9:00', '8:59', '8:58'].includes(await clk()), `protocol: −1 min twice (${await clk()})`);
  await page.click(run(3) + '[data-a=restart]'); await page.waitForTimeout(150);
  check(['9:00', '8:59'].includes(await clk()), 'protocol: restart step from its full time');
  await page.click(run(3) + '[data-a=next]'); await page.waitForTimeout(150);
  check((await page.textContent(run(3) + '.pt-step')) === 'Step 2 of 2: Cool' && ['20:00', '19:59'].includes(await clk()), 'protocol: skip to the next step');
  // A sleeping tab: block the page for 3.5 s while a 3-step timer runs.
  await page.fill(T + '.pt-name', 'Sleepy'); await page.fill(T + '.pt-steps', 'S1, 1 s\nS2, 1 s\nS3, 1 s');
  const a0 = await alarms();
  await page.click(T + '.pt-start'); await page.evaluate(() => { const t = Date.now(); while (Date.now() - t < 3500); }); await page.waitForTimeout(500);
  check((await page.textContent(run(4) + '.pt-state')) === 'Finished' && (await alarms()) === a0 + 3, 'protocol: after a blocked page all three steps are done and every alarm rang');
  // Kept after a reload, still counting.
  await page.reload(); await page.waitForTimeout(500);
  check((await page.$$eval(T + '.pt-run', (r) => r.length)) === 4 && (await page.textContent(run(3) + '.pt-step')) === 'Step 2 of 2: Cool' && /^19:5\d$/.test(await clk()), 'protocol: running timers survive a reload');
  page.once('dialog', (d) => d.accept()); await page.click(run(3) + '[data-a=stop]'); await page.waitForTimeout(100);
  await page.click(run(1) + '[data-a=stop]'); await page.waitForTimeout(100);
  check((await page.$$eval(T + '.pt-run', (r) => r.length)) === 2, 'protocol: stop and remove timers');
  // Save, export, clear, import.
  await page.fill(T + '.pt-name', 'My wash'); await page.fill(T + '.pt-steps', 'Wash 1, 5 min\nWash 2, 5:00\nWash 3, 300 s'); await page.click(T + '.pt-save'); await page.waitForTimeout(100);
  check((await page.textContent(T + '.pt-smsg')).includes('Saved "My wash"') && (await page.$eval(T + '.pt-pick', (s) => s.options[s.selectedIndex].text)) === 'My wash' && await page.isVisible(T + '.pt-del'), 'protocol: saved');
  await page.selectOption(T + '.pt-pick', ''); await page.waitForTimeout(100);
  check((await page.inputValue(T + '.pt-steps')) === '', 'protocol: new protocol clears the editor');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(T + '.pt-json')]); const jf = OUT + 'protocols.json'; await d.saveAs(jf);
  { const j = JSON.parse(readFileSync(jf, 'utf8')); check(j.protocols.length === 1 && j.protocols[0].steps.length === 3 && j.protocols[0].steps.every((s) => s.sec === 300), 'protocol: export JSON'); }
  page.once('dialog', (d) => d.accept()); await page.click(T + '.pt-clear'); await page.waitForTimeout(100);
  check(await page.isHidden(T + '.pt-runs-card') && (await page.evaluate(() => localStorage.getItem('fibub-protocols-v1'))) === null && !(await page.textContent(T + '.pt-pick')).includes('My wash'), 'protocol: clear all');
  await page.setInputFiles(T + '.pt-jfile', jf); await page.waitForTimeout(200);
  check((await page.textContent(T + '.pt-bmsg')).startsWith('Imported 1 protocol') && (await page.inputValue(T + '.pt-name')) === 'My wash', 'protocol: import JSON');
  writeFileSync(OUT + 'bad-proto.json', '{"protocols":[]}'); await page.setInputFiles(T + '.pt-jfile', OUT + 'bad-proto.json'); await page.waitForTimeout(200);
  check((await page.textContent(T + '.pt-bmsg')).includes('No protocols'), 'protocol: empty import refused');
  page.once('dialog', (d) => d.accept()); await page.click(T + '.pt-del'); await page.waitForTimeout(100);
  check(!(await page.textContent(T + '.pt-pick')).includes('My wash'), 'protocol: delete a saved protocol');
  check((await page.textContent(T + '.pt-nstate')).length > 20, 'protocol: notification state explained');
  await page.evaluate(() => { try { localStorage.removeItem('fibub-protocols-v1'); } catch {} });
};
