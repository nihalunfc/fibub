// #1336 centre of mass finder
export const path = '/learn/centre-of-mass/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/centre-of-mass/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.cm .cm-facts'), pill = () => page.textContent('.cm .cm-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check((await pill()).startsWith('Balanced') && f.includes('Anticlockwise moment294 N m') && f.includes('Clockwise moment294 N m') && f.includes('Balance point (centre of mass)0 m') && f.includes('Mass 2 balances it at1.5 m'), 'centre-of-mass: example 30 kg at −1 m, 20 kg at 1.5 m balance'); }
  const ink = () => page.$eval('.cm .cm-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - x[i + 2]) > 60) n++; return n; });
  check((await ink()) > 200, 'centre-of-mass: seesaw drawn');
  await setR('.cm .cm-m2', 40);
  check((await pill()).includes('right side goes down') && (await facts()).includes('Mass 2 balances it at0.75 m'), 'centre-of-mass: heavier child tips it; 40 kg balances at 0.75 m');
  await page.click('.cm .cm-bal'); await page.waitForTimeout(100);
  check((await page.textContent('.cm .cm-pv')) === '0.43 m' && (await pill()).startsWith('Balanced'), `centre-of-mass: pivot moved to the CM (30 × −1 + 40 × 1.5) ÷ 70 = 0.43 m (${await page.textContent('.cm .cm-pv')})`);
  // drag mass 1 along the plank
  await setR('.cm .cm-m2', 20); await setR('.cm .cm-p', 0);
  { const b = await page.$eval('.cm .cm-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const s = (b.w - 40) / 4.4, ox = b.x + b.w / 2;
    await page.mouse.move(ox - 1 * s, b.y + 130); await page.mouse.down(); await page.mouse.move(ox - 2 * s, b.y + 130, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
    check((await facts()).includes('Anticlockwise moment588 N m') && (await facts()).includes('Mass 2 balances it at'), `centre-of-mass: drag mass 1 to −2 m doubles its moment (${(await facts()).slice(0, 60)})`); }
  await setR('.cm .cm-M', 10);
  check((await facts()).includes('Balance point'), 'centre-of-mass: plank mass included');
  await page.click('.cm .cm-mode [data-v="pts"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('x of the centre4.4 m') && f.includes('y of the centre2.4 m'), 'centre-of-mass: point masses: (4.4, 2.4)'); }
  check(!(await page.isVisible('.cm .cm-p')), 'centre-of-mass: no pivot for point masses');
  await setR('.cm .cm-m3', 50);
  check((await facts()).includes('Total mass100 kg'), 'centre-of-mass: third ball added');
  await page.click('.cm .cm-mode [data-v="shape"]'); await page.waitForTimeout(150);
  check((await pill()).includes('balance it on a pin') && (await facts()).includes('Squares14'), 'centre-of-mass: L shape, 14 squares');
  await page.click('.cm .cm-shapes [data-s="ring"]'); await page.waitForTimeout(100);
  check((await pill()).includes('outside the shape') && (await facts()).includes('4.5 squares'), 'centre-of-mass: frame CM outside, at 4.5');
  await page.click('.cm .cm-shapes [data-s="clear"]'); await page.waitForTimeout(100);
  { const b = await page.$eval('.cm .cm-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
    const cell = Math.min((b.w - 20) / 9, 240 / 7), gx = (b.w - cell * 9) / 2;
    await page.mouse.click(b.x + gx + cell * 0.5, b.y + 10 + cell * 0.5); await page.waitForTimeout(80);
    await page.mouse.click(b.x + gx + cell * 2.5, b.y + 10 + cell * 0.5); await page.waitForTimeout(100);
    check((await facts()).includes('Squares2') && (await facts()).includes('1.5 squares'), 'centre-of-mass: tap two squares, centre halfway'); }
  check((await page.$$('.cm .sq-q')).length === 4, 'centre-of-mass: four questions');
  const ans = await page.$eval('.cm .sq-q', (e) => e.dataset.ans);
  await page.fill('.cm .sq-q .sq-in', ans); await page.click('.cm .sq-q .sq-check');
  check((await page.textContent('.cm .sq-q .sq-res')) === 'Right!', 'centre-of-mass: quiz');
};
