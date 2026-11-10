// #1259 Solution, colloid or suspension
export const path = '/learn/tyndall-effect/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/tyndall-effect/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.ty .ty-facts'), msg = () => page.textContent('.ty .ty-msg'), pill = () => page.textContent('.ty .ty-pill');
  check((await pill()) === 'A colloid' && (await msg()).includes('Tyndall effect') && (await facts()).includes('Type of colloidemulsion') && (await facts()).includes('400 nm'), 'tyndall-effect: milk is a colloid, an emulsion');
  check(await page.$eval('.ty .ty-scene', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 120) n++; return n > 300; }), 'tyndall-effect: scene drawn');
  await page.click('.ty .ty-filter'); await page.waitForTimeout(100);
  check((await msg()).includes('everything passes through'), 'tyndall-effect: milk passes filter paper');
  await page.selectOption('.ty .ty-sample', 'salt'); await page.waitForTimeout(100);
  check((await pill()) === 'A true solution' && (await msg()).includes('cannot be seen') && (await facts()).includes('yes (homogeneous)'), 'tyndall-effect: salt water is a true solution');
  await page.selectOption('.ty .ty-sample', 'mud'); await page.waitForTimeout(100);
  await page.click('.ty .ty-stand'); await page.waitForTimeout(2200);
  check((await pill()) === 'A suspension' && (await msg()).includes('settled at the bottom'), 'tyndall-effect: mud settles');
  await page.click('.ty .ty-torch'); await page.waitForTimeout(80);
  check((await page.textContent('.ty .ty-torch')) === 'Torch on' && !(await msg()).includes('beam'), 'tyndall-effect: torch off');
  await page.click('.ty .ty-torch');
  await page.$eval('.ty .ty-nm', (e) => { e.value = '1'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await pill()) === 'A colloid' && (await page.$eval('.ty .ty-sample', (e) => e.value)) === 'custom' && (await page.textContent('.ty .ty-nmv')) === '10 nm', 'tyndall-effect: slider 10 nm is a colloid, own size');
  await page.click('.ty .ty-level [data-l="8"]'); await page.waitForTimeout(80);
  check(!(await page.textContent('.ty .ty-eq')).includes('emulsion'), 'tyndall-effect: Class 8 leaves out colloid types');
  check((await page.textContent('.ty .ty-conc')).includes('= 10 %'), 'tyndall-effect: 20 g in 180 g = 10 %');
  const ans = await page.$eval('.ty .sq-q', (e) => e.dataset.ans);
  await page.fill('.ty .sq-q .sq-in', ans); await page.press('.ty .sq-q .sq-in', 'Enter');
  check((await page.textContent('.ty .sq-q .sq-res')) === 'Right!', 'tyndall-effect: quiz answer with Enter');
};
