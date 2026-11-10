// #1432 Logic gates and truth tables
import { quiz } from '../school-quiz-q.mjs';
export const path = '/learn/logic-gates/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/logic-gates/`); await page.waitForSelector('.lg .lg-svg .lamp');
  const big = () => page.textContent('.lg .lg-big'), onRow = () => page.textContent('.lg .lg-tt tr.on'), lamp = () => page.locator('.lg .lg-svg .lamp.hi').count();
  check((await big()) === 'Y = 0' && (await onRow()) === '000' && (await lamp()) === 0, 'gates: AND 0,0');
  await page.click('.lg .lg-a'); await page.click('.lg .lg-b');
  check((await big()) === 'Y = 1' && (await onRow()) === '111' && (await lamp()) === 1 && (await page.textContent('.lg .lg-a')) === 'A = 1', 'gates: AND 1,1 lights the lamp');
  const ys = async () => page.locator('.lg .lg-tt tbody tr td:last-child').allTextContents();
  const want = { OR: '0111', NAND: '1110', NOR: '1000', XOR: '0110', XNOR: '1001' };
  for (const [g, w] of Object.entries(want)) { await page.click(`.lg .lg-g [data-g="${g}"]`); check((await ys()).join('') === w && (await page.textContent('.lg .lg-expr')).length > 4, `gates: ${g} table`); }
  await page.click('.lg .lg-g [data-g="NOT"]');
  check((await page.isHidden('.lg .lg-b')) && (await big()) === 'Y = 0' && (await ys()).join('') === '10' && (await page.locator('.lg .lg-svg circle.body').count()) === 1, 'gates: NOT hides B, has a bubble');
  // universal gates
  const ut = async () => page.locator('.lg .lg-ut tbody tr').evaluateAll((rs) => rs.every((r) => { const c = [...r.cells].map((x) => x.textContent); return c[c.length - 1] === c[c.length - 2]; }));
  for (const u of ['NAND', 'NOR']) for (const t of ['NOT', 'AND', 'OR']) { await page.click(`.lg .lg-u [data-u="${u}"]`); await page.click(`.lg .lg-t [data-t="${t}"]`); check(await ut(), `gates: ${t} from ${u} matches`); }
  check((await page.textContent('.lg .lg-urecipe')).includes('3 NOR gates'), 'gates: OR from NOR... recipe count');
  // chain
  check((await page.textContent('.lg .lg-cbig')) === 'Y = 1' && (await page.textContent('.lg .lg-cwork')).includes('G1 = AND(1, 0) = 0; Y = OR(0, 1) = 1') && (await page.locator('.lg .lg-ct tbody tr').count()) === 8, 'gates: chain worked example');
  await page.selectOption('.lg .lg-g2', 'NOT');
  check((await page.isHidden('.lg .lg-cc')) && (await page.locator('.lg .lg-ct tbody tr td:last-child').allTextContents()).join('') === '11111100', 'gates: AND then NOT is NAND');
  await page.click('.lg .lg-cb'); check((await page.textContent('.lg .lg-cbig')) === 'Y = 0', 'gates: chain input toggles');
  await quiz(page, check, '.lg', 'gates');
};
