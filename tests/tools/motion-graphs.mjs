// #1021 motion graphs live
export const path = '/learn/motion-graphs/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/motion-graphs/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.mg .mg-facts'), eq = () => page.textContent('.mg .mg-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('Position x9 m') && f.includes('Velocity v3 m/s') && f.includes('Acceleration a0 m/s²') && f.includes('Displacement from t = 09 m') && f.includes('Distance travelled9 m'), 'motion-graphs: stop and go at 4 s (x 9 m, v 3 m/s)'); }
  check((await eq()).includes('9 m ÷ 4 s = 2.25 m/s'), 'motion-graphs: average velocity with the live numbers');
  const h9 = await page.$eval('.mg .mg-g', (c) => c.getBoundingClientRect().height);
  check(h9 > 200 && await page.$eval('.mg .mg-g', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'motion-graphs: graphs drawn');
  await page.selectOption('.mg .mg-story', 'outback'); await setR('.mg .mg-t', 10);
  { const f = await facts(); check(f.includes('Position x10 m') && f.includes('Velocity v−4 m/s') && f.includes('Displacement from t = 010 m') && f.includes('Distance travelled26 m'), 'motion-graphs: out and back at 10 s: displacement 10 m, distance 26 m'); }
  await setR('.mg .mg-t', 12);
  check((await facts()).includes('Distance travelled36 m') && (await facts()).includes('Displacement from t = 00 m'), 'motion-graphs: back at the start after 12 s');
  await page.selectOption('.mg .mg-story', 'custom'); await page.waitForTimeout(150);
  check(await page.isVisible('.mg .mg-a2') && (await facts()).includes('Position x28 m'), 'motion-graphs: make your own (2 m/s, 0 / 0.5 / −1 m/s²) ends at 28 m');
  await setR('.mg .mg-a3', 0); await setR('.mg .mg-u', 0);
  check((await facts()).includes('Position x12 m') && (await page.textContent('.mg .mg-a3v')) === '0 m/s²', 'motion-graphs: custom sliders change the motion');
  // level
  await page.click('.mg .mg-level [data-l="11"]'); await page.waitForTimeout(200);
  const h11 = await page.$eval('.mg .mg-g', (c) => c.getBoundingClientRect().height);
  check(h11 > h9 + 100 && (await eq()).includes('v = dx/dt') && (await eq()).includes('∫ a dt') && await page.isVisible('.mg .mg-k3w'), 'motion-graphs: Class 11 adds the a-t graph, tangent and calculus forms');
  check((await page.$$eval('.mg .sq-q', (l) => l.map((e) => e.textContent).join(' '))).includes('rolls back'), 'motion-graphs: Class 11 question set');
  await page.click('.mg .mg-level [data-l="9"]'); await page.waitForTimeout(150);
  // drag on the graph moves the time
  await page.selectOption('.mg .mg-story', 'steady');
  { const b = await page.$eval('.mg .mg-g', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    await page.mouse.click(b.x + 46 + (b.w - 56) / 2, b.y + 60); await page.waitForTimeout(150);
    const t = parseFloat(await page.textContent('.mg .mg-tv')), x = parseFloat((await facts()).split('Position x')[1]);
    check(Math.abs(t - 6) <= 0.2 && Math.abs(x - 1.5 * t) < 0.01, `motion-graphs: tap the middle of the graph moves to about 6 s (${t} s, ${x} m)`); }
  // play
  await setR('.mg .mg-t', 11); await page.click('.mg .mg-play'); await page.waitForTimeout(1600);
  check((await page.textContent('.mg .mg-tv')) === '12 s' && (await page.textContent('.mg .mg-play')) === 'Play', 'motion-graphs: Play runs to the end');
  // drive
  await page.click('.mg .mg-mode [data-m="drive"]'); await page.waitForTimeout(150);
  await setR('.mg .mg-dv', 2); await page.click('.mg .mg-go'); await page.waitForTimeout(3000);
  check((await page.textContent('.mg .mg-go')) === 'Driving…' && parseFloat((await page.textContent('.mg .mg-tv'))) > 1.5, 'motion-graphs: driving runs the clock');
  await page.waitForTimeout(10000);
  { const f = await facts(); const x = parseFloat(f.split('Position x')[1]); check((await page.textContent('.mg .mg-go')) === 'Start again' && f.includes('Velocity v2 m/s') && Math.abs(x - 23) < 0.2, `motion-graphs: drive at 2 m/s for 12 s ends near 23 m (${x})`); }
  // match
  await page.click('.mg .mg-mode [data-m="match"]'); await page.waitForTimeout(150);
  check(await page.isVisible('.mg .mg-k4w') && await page.isHidden('.mg .mg-p-drive'), 'motion-graphs: match mode shows the target');
  await page.click('.mg .mg-show'); await page.waitForTimeout(13000);
  { const s = await page.textContent('.mg .mg-score'); const n = Number((s.match(/Score (\d+)/) || [])[1]); check(n >= 90, `motion-graphs: Show me follows the target (${s})`); }
  await page.click('.mg .mg-new'); await page.waitForTimeout(150);
  check((await page.textContent('.mg .mg-score')) === '', 'motion-graphs: new target clears the score');
  await page.click('.mg .mg-mode [data-m="story"]'); await page.waitForTimeout(150);
  // check yourself
  const qs = await page.$$('.mg .sq-q');
  check(qs.length === 4, 'motion-graphs: four questions');
  const ans = await page.$eval('.mg .sq-q', (e) => e.dataset.ans);
  await page.fill('.mg .sq-q .sq-in', String(Number(ans) + 5)); await page.click('.mg .sq-q .sq-check');
  check((await page.textContent('.mg .sq-q .sq-res')).startsWith('Not quite') && await page.isHidden('.mg .sq-q .sq-work'), 'motion-graphs: wrong answer');
  await page.fill('.mg .sq-q .sq-in', ans.replace('-', '−')); await page.click('.mg .sq-q .sq-check');
  check((await page.textContent('.mg .sq-q .sq-res')) === 'Right!' && await page.isVisible('.mg .sq-q .sq-work'), 'motion-graphs: right answer shows the working');
  await page.click('.mg .sq-q:nth-child(2) .sq-show');
  check(await page.isVisible('.mg .sq-q:nth-child(2) .sq-work'), 'motion-graphs: show answer');
  const before = await page.$$eval('.mg .sq-text', (l) => l.map((e) => e.textContent).join('|'));
  await page.click('.mg .sq-new'); await page.waitForTimeout(100);
  check(before !== await page.$$eval('.mg .sq-text', (l) => l.map((e) => e.textContent).join('|')), 'motion-graphs: new questions');
};
