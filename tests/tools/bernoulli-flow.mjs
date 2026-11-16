// #1342 Bernoulli, Venturi and Torricelli
export const path = '/learn/bernoulli-flow/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/bernoulli-flow/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.bf .bf-facts');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('8 m/s') && f.includes('30000 Pa') && f.includes('306.1 cm') && f.includes('15.71 litres/s'), 'bernoulli-flow: Venturi example'); }
  const px = () => page.$eval('.bf .bf-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n; });
  check((await px()) > 500, 'bernoulli-flow: picture drawn');
  { const a = await page.$eval('.bf .bf-c', (c) => c.toDataURL()); await page.waitForTimeout(300); const b = await page.$eval('.bf .bf-c', (c) => c.toDataURL()); check(a !== b, 'bernoulli-flow: the dots move'); }
  await setR('.bf .bf-d2', 2.5);
  check((await facts()).includes('32 m/s') && (await facts()).includes('510 kPa'), 'bernoulli-flow: half the throat: 4× speed, ~17× drop');
  await setR('.bf .bf-d2', 15);
  check((await page.inputValue('.bf .bf-d2')) === '10', 'bernoulli-flow: throat cannot be wider than the pipe');
  await setR('.bf .bf-d2', 5);
  await page.click('.bf .bf-fluid [data-v="air"]'); await page.waitForTimeout(100);
  check((await facts()).includes('36 Pa') && (await facts()).includes('0.3673 cm'), 'bernoulli-flow: air: 36 Pa');
  await page.click('.bf .bf-mode [data-v="tank"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('3.96 m/s') && f.includes('1.2 m') && f.includes('0.311 litres/s') && f.includes('67.3 min'), 'bernoulli-flow: tank example'); }
  await setR('.bf .bf-h', 0.2);
  check((await facts()).includes('1.98 m/s'), 'bernoulli-flow: a quarter of the depth, half the speed');
  await setR('.bf .bf-y', 0);
  check((await facts()).includes('Lands this far from the tank0 m'), 'bernoulli-flow: hole at floor level');
  const ans = await page.$eval('.bf .sq-q', (e) => e.dataset.ans);
  await page.fill('.bf .sq-q .sq-in', ans); await page.click('.bf .sq-q .sq-check');
  check((await page.textContent('.bf .sq-q .sq-res')) === 'Right!' && (await page.$$('.bf .sq-q')).length === 4, 'bernoulli-flow: quiz');

  // ---- Solve my numbers (bernoulli-flow) ----
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const psAns = () => page.textContent('.ps-host .ps-ans'), psWork = () => page.textContent('.ps-host .ps-work');
  const psPre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
  const psSet = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { const sel = await page.$eval(`.ps-host [data-k="${k}"]`, (e) => e.tagName === 'SELECT'); if (sel) await page.selectOption(`.ps-host [data-k="${k}"]`, v); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
  { // new block: no clashes with the checks above
  await psPre("Pipe 10 cm"); check((await psAns()).includes("The speed in the second part is 8 m/s (4 times the first)"), "bernoulli-flow: example Pipe 10 cm");
  await psPre("Venturi pressure"); check((await psAns()).includes("falls by 30000 Pa (30 kPa)"), "bernoulli-flow: example Venturi pressure");
  await psPre("Tank hole"); check((await psAns()).includes("The water leaves at 3.96 m/s"), "bernoulli-flow: example Tank hole");
  await psPre("Jet from"); check((await psAns()).includes("The jet lands 1.2 m from the tank"), "bernoulli-flow: example Jet from");
  await psPre("Draining time"); check((await psAns()).includes("about 67.3 minutes"), "bernoulli-flow: example Draining time");
  await psSet("dp", {"dp-fl": "1"});
  check((await psAns()).includes("falls by 36 Pa"), "bernoulli-flow: typed numbers dp falls by 36 Pa");
  await psSet("drain", {"drain-d": "200"}); check((await psAns()).includes("cannot be wider than the tank"), "bernoulli-flow: friendly message: cannot be wider than the tank");
  await psSet("cont", {"cont-d2": "0"}); check((await psAns()).includes("must be more than 0"), "bernoulli-flow: friendly message: must be more than 0");
  await psPre("Draining time"); { const w = await psWork(); check(w.includes("(100 ÷ 1)² = 10000") && w.length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), "bernoulli-flow: working shown, no NaN"); }
  }
};
