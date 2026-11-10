// #1334 work as area under a force graph
export const path = '/learn/variable-force-work/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/variable-force-work/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.vw .vw-facts'), eq = () => page.textContent('.vw .vw-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('Work done72 J') && f.includes('Speed of the cart from rest8.49 m/s'), 'variable-force-work: spring 0 to 6 m: 72 J, 8.49 m/s'); }
  check((await eq()).includes('½ × 4 × (6² − 0²) = 72 J'), 'variable-force-work: ½kx² with numbers');
  const ink = () => page.$eval('.vw .vw-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 30) n++; return n; });
  check((await ink()) > 500, 'variable-force-work: graph and area drawn');
  await setR('.vw .vw-b', 3);
  check((await facts()).includes('Work done18 J'), 'variable-force-work: half the stretch, a quarter of the work');
  await page.selectOption('.vw .vw-preset', 'const'); await setR('.vw .vw-s', 30); await setR('.vw .vw-a', 1); await setR('.vw .vw-b', 5.5);
  check((await facts()).includes('Work done135 J') && (await eq()).includes('30 × 4.5 = 135 J'), 'variable-force-work: steady 30 N over 4.5 m = 135 J');
  await page.selectOption('.vw .vw-preset', 'step'); await setR('.vw .vw-s', 40); await setR('.vw .vw-a', 0); await setR('.vw .vw-b', 10);
  { const f = await facts(); check(f.includes('Area below the axis−') && f.includes('Work done') , 'variable-force-work: negative area for the pull back'); }
  // drag the 5 m point to the top
  await page.selectOption('.vw .vw-preset', 'const'); await setR('.vw .vw-s', 10);
  { const b = await page.$eval('.vw .vw-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const L = 40, sx = (b.w - 12 - L) / 10, T = 12, B = 280 - 28, sy = (B - T) / 100, y0 = T + 50 * sy;
    await page.mouse.move(b.x + L + 5 * sx, b.y + y0 - 10 * sy); await page.mouse.down(); await page.mouse.move(b.x + L + 5 * sx, b.y + y0 - 30 * sy, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(100);
    check((await page.inputValue('.vw .vw-preset')) === 'own' && (await facts()).includes('Work done120 J'), `variable-force-work: dragging the 5 m dot to 30 N adds two 20 N triangles: 100 + 20 = 120 J (${(await facts()).slice(0, 40)})`); }
  await setR('.vw .vw-m', 10);
  check((await facts()).includes('4.9 m/s'), 'variable-force-work: 120 J on 10 kg gives 4.9 m/s');
  await page.click('.vw .vw-level [data-v="9"]'); await page.waitForTimeout(100);
  check((await page.$$('.vw .sq-q')).length === 3 && (await eq()).includes('work = force × distance'), 'variable-force-work: Class 9 level');
  const ans = await page.$eval('.vw .sq-q', (e) => e.dataset.ans);
  await page.fill('.vw .sq-q .sq-in', ans); await page.click('.vw .sq-q .sq-check');
  check((await page.textContent('.vw .sq-q .sq-res')) === 'Right!', 'variable-force-work: quiz');
};
