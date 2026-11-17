// #10 Graph digitiser: digits, even spacing and area (the picture and click checks are in run.mjs).
export const path = '/science/graph-digitizer/';
export default async ({ page, check, BASE, OUT, writeFileSync, readFileSync }) => {
  await page.goto(BASE + path);
  const png = await page.evaluate(() => {
    const c = document.createElement('canvas'); c.width = 400; c.height = 300; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 400, 300); g.strokeStyle = '#000'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(50.5, 20); g.lineTo(50.5, 250.5); g.lineTo(380, 250.5); g.stroke();
    return c.toDataURL('image/png').split(',')[1];
  });
  writeFileSync(OUT + 'gd-plot.png', Buffer.from(png, 'base64'));
  await page.setInputFiles('.gd-file', OUT + 'gd-plot.png');
  await page.waitForSelector('.gd-work:not([hidden])');
  const at = async (x, y) => { const b = await page.locator('.gd-cv').boundingBox(); await page.locator('.gd-cv').click({ position: { x: (x * b.width) / 400, y: (y * b.height) / 300 } }); };
  // x: 20 at pixel 110, 80 at 290. y: 2 at pixel 210, 8 at 90.
  await at(110, 250); await at(290, 250); await at(50, 210); await at(50, 90);
  for (const [k, v] of [['x1', '20'], ['x2', '80'], ['y1', '2'], ['y2', '8']]) await page.fill(`.gd-v[data-k=${k}]`, v);
  await page.click('.gd-steps [data-mode=points]');
  await at(110, 210); await at(170, 170); await at(290, 90);
  check((await page.locator('.gd-tab tbody tr').count()) === 3, 'digitiser: three points clicked');
  const st = await page.textContent('.gd-stats');
  check(st.includes('Area under the curve (trapezoid rule, from x = ') && /: \d/.test(st), `digitiser: area line (${st})`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.gd-rs', '5'); await page.waitForTimeout(200);
  const rows = await page.$$eval('.gd-tab tbody tr', (rs) => rs.map((r) => [...r.cells].slice(1, 3).map((c) => Number(c.textContent))));
  check(rows.length === 5 && Math.abs(rows[0][0] - 20) < 0.7 && Math.abs(rows[4][0] - 80) < 0.7 && Math.abs(rows[2][0] - 50) < 0.7, `digitiser: five evenly spaced x values (${JSON.stringify(rows.map((r) => r[0]))})`);
  check((await page.textContent('.gd-stats')).startsWith('5 evenly spaced values.') && (await page.locator('.gd-tab tbody button').count()) === 0, 'digitiser: even spacing note, no delete buttons');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gd-csv')]); const f = OUT + 'gd.csv'; await d.saveAs(f);
  check(readFileSync(f, 'utf8').trim().split('\n').length === 6, 'digitiser: CSV follows even spacing');
  await page.fill('.gd-rs', ''); await page.selectOption('.gd-dig', '3'); await page.waitForTimeout(200);
  const cells = await page.$$eval('.gd-tab tbody tr:first-child td', (t) => t.map((c) => c.textContent));
  check((await page.locator('.gd-tab tbody tr').count()) === 3 && cells[1].replace(/[-.]/g, '').length <= 3, `digitiser: three significant digits (${cells[1]})`);
};
