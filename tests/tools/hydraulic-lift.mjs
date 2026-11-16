// #1341 hydraulic lift
export const path = '/learn/hydraulic-lift/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/hydraulic-lift/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.hl .hl-facts');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('117.6 N') && f.includes('100 ×') && f.includes('93.58 kPa') && f.includes('2 mm') && f.includes('23.52 J') && f.includes('1000'), 'hydraulic-lift: garage example'); }
  check((await page.textContent('.hl .hl-eq')).includes('Pascal'), 'hydraulic-lift: working shown');
  check(await page.$eval('.hl .hl-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 500; }), 'hydraulic-lift: picture drawn');
  await setR('.hl .hl-d2', 20);
  check((await facts()).includes('470.4 N') && (await facts()).includes('25 ×'), 'hydraulic-lift: half the width: four times the force');
  await page.click('.hl [data-p="jack"]'); await page.waitForTimeout(100);
  check((await facts()).includes('882 N') && (await facts()).includes('11.11 ×') && (await facts()).includes('12'), 'hydraulic-lift: bottle jack preset');
  await setR('.hl .hl-x', 0);
  check((await facts()).includes('0 J'), 'hydraulic-lift: no push, no work');
  // drag the small piston
  await page.click('.hl [data-p="garage"]'); await page.waitForTimeout(100);
  { const b = await page.evaluate(() => { const c = document.querySelector('.hl .hl-c'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const sx = b.x + 20 + 0.15 * b.w;
    await page.mouse.move(sx, b.y + 120); await page.mouse.down(); await page.mouse.move(sx, b.y + 150, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(100);
    check(Number(await page.inputValue('.hl .hl-x')) >= 5, `hydraulic-lift: drag pushes the piston (${await page.inputValue('.hl .hl-x')} cm)`); }
  const ans = await page.$eval('.hl .sq-q', (e) => e.dataset.ans);
  await page.fill('.hl .sq-q .sq-in', ans); await page.click('.hl .sq-q .sq-check');
  check((await page.textContent('.hl .sq-q .sq-res')) === 'Right!' && (await page.$$('.hl .sq-q')).length === 4, 'hydraulic-lift: quiz');

  // ---- Solve my numbers (hydraulic-lift) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("Garage jack"); check((await psAns()).includes("pushes with 12000 N (100 times"), "hydraulic-lift: example Garage jack");
  await psPre("Press with areas"); check((await psAns()).includes("pushes with 2500 N"), "hydraulic-lift: example Press with areas");
  await psPre("Lift a 1200"); check((await psAns()).includes("push the small piston with 118 N"), "hydraulic-lift: example Lift a 1200");
  await psPre("Distance moved"); check((await psAns()).includes("rises 0.3 cm"), "hydraulic-lift: example Distance moved");
  await psPre("Pumps to lift"); check((await psAns()).includes("About 75 strokes, so 75 pumps"), "hydraulic-lift: example Pumps to lift");
  await psSet("p", {"p-F1": "120", "p-d1": "4"});
  check((await psAns()).includes("95.5 kPa"), "hydraulic-lift: typed numbers p 95.5 kPa");
  await psSet("F2", {"F2-F1": "0.12", "F2-d1": "40", "F2-d2": "400"});
  await page.selectOption('.ps-host [data-k="F2-F1-u"]', "kN"); await page.waitForTimeout(80);
  await page.selectOption('.ps-host [data-k="F2-d1-u"]', "mm"); await page.waitForTimeout(80);
  await page.selectOption('.ps-host [data-k="F2-d2-u"]', "mm"); await page.waitForTimeout(80);
  check((await psAns()).includes("pushes with 12000 N"), "hydraulic-lift: typed numbers F2 pushes with 12000 N");
  await psSet("F2A", {"F2A-A1": "0"}); check((await psAns()).includes("must be more than 0"), "hydraulic-lift: friendly message: must be more than 0");
  await psPre("Garage jack"); { const w = await psWork(); check(w.includes("(40 ÷ 4)² = 120 × 100") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "hydraulic-lift: working shown, no NaN"); }
  }
};
