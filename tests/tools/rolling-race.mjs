// #1492 Rolling race
export const path = '/learn/rolling-race/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rolling-race/`); await page.waitForTimeout(300);
  const rows = () => page.textContent('.rr .rr-rows');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const t = await rows(); check(t.includes('0.904 s') && t.includes('1.07 s') && t.includes('1.11 s') && t.includes('1.28 s'), `rolling-race: 30°, 2 m times match g sinθ/(1+I/mr²) (${t})`); }
  { const e = await page.textContent('.rr .rr-eq'); check(e.includes('Order: Block, then Sphere, then Disc, then Ring'), `rolling-race: order block, sphere, disc, ring (${e})`); }
  await setR('.rr .rr-a', 45); await setR('.rr .rr-l', 3);
  { const e = await page.textContent('.rr .rr-eq'); check(e.includes('Order: Block, then Sphere, then Disc, then Ring'), 'rolling-race: same order on another ramp'); }
  await setR('.rr .rr-a', 30); await setR('.rr .rr-l', 2);
  await page.click('.rr .rr-go'); await page.waitForTimeout(2600);
  check((await page.$eval('.rr .rr-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) n++; return n; })) > 300, 'rolling-race: race draws');
  { const a = await page.getAttribute('.rr .lq-item', 'data-ans'); await page.fill('.rr .lq-in', a); await page.click('.rr .lq-check');
    check((await page.textContent('.rr .lq-fb')) === 'Right.', 'rolling-race: quiz accepts the right answer'); }
};
