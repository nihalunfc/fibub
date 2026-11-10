// #1331 vector adder
export const path = '/learn/vector-adder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/vector-adder/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.va .va-facts'), eq = () => page.textContent('.va .va-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('Size of R8.72') && f.includes('Direction of R23.4°') && f.includes('Angle between A and B60°') && f.includes('(8, 3.46)'), 'vector-adder: example 6 at 0° + 4 at 60° = 8.72 at 23.4°'); }
  check((await eq()).includes('= 8.72'), 'vector-adder: law of cosines with numbers');
  const ink = (sel) => page.$eval(sel, (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink('.va .va-c')) > 300, 'vector-adder: arrows drawn');
  await setR('.va .va-am', 3); await setR('.va .va-bm', 4); await setR('.va .va-ba', 90);
  check((await facts()).includes('Size of R5'), 'vector-adder: 3 and 4 at 90° make 5');
  for (const m of ['par', 'comp', 'tri']) { await page.click(`.va .va-mode [data-v="${m}"]`); await page.waitForTimeout(80); }
  check((await facts()).includes('Size of R5'), 'vector-adder: every view gives the same R');
  await page.check('.va .va-sub'); await page.waitForTimeout(80);
  check((await facts()).includes('Size of A − B5'), 'vector-adder: A − B shown');
  // drag the tip of A to (0, 5): straight up
  await page.click('.va .va-reset');
  { const b = await page.$eval('.va .va-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const s = Math.min(b.w / 2 - 14, b.h / 2 - 14) / 11, ox = b.x + b.w / 2, oy = b.y + b.h / 2;
    await page.mouse.move(ox + 6 * s, oy); await page.mouse.down(); await page.mouse.move(ox, oy - 5 * s, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(100);
    check((await page.inputValue('.va .va-aa')) === '90' && (await page.inputValue('.va .va-am')) === '5', `vector-adder: drag A to 5 at 90° (${await page.inputValue('.va .va-am')} at ${await page.inputValue('.va .va-aa')})`); }
  { const f = await page.textContent('.va .va-lfacts'); check(f.includes('Left tension T₁50 N') && f.includes('Right tension T₂86.6 N') && f.includes('90°'), 'vector-adder: Lami 100 N at 30°/60° gives 50 N and 86.6 N'); }
  await setR('.va .va-t1', 45); await setR('.va .va-t2', 45);
  check((await page.textContent('.va .va-lfacts')).includes('Left tension T₁70.7 N'), 'vector-adder: symmetric strings 45° give 70.7 N each');
  check((await ink('.va .va-l')) > 100, 'vector-adder: Lami picture drawn');
  check((await page.$$('.va .sq-q')).length === 4, 'vector-adder: four questions');
  const ans = await page.$eval('.va .sq-q', (e) => e.dataset.ans);
  await page.fill('.va .sq-q .sq-in', ans); await page.click('.va .sq-q .sq-check');
  check((await page.textContent('.va .sq-q .sq-res')) === 'Right!', 'vector-adder: quiz');
};
