// #1481 hand-washing
export const path = '/learn/hand-washing/';
export default async ({ page, check, BASE }) => {
  const R = '.hw ';
  const t = (s) => page.textContent(R + s);
  const setS = (v) => page.$eval(R + '.hw-s', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(`${BASE}/learn/hand-washing/`); await page.waitForTimeout(400);
  check((await t('.hw-out')).startsWith('49,787 germs left after 20 s'), 'hand-washing: soap 20 s from 1 million = 49,787');
  await setS('0');
  check((await t('.hw-out')).startsWith('1 million germs left after 0 s'), 'hand-washing: 0 s = start count');
  await setS('10'); const a = await t('.hw-out');
  await setS('30'); const b = await t('.hw-out');
  check(+a.match(/^([\d,]+)/)[1].replace(/,/g, '') > +b.match(/^([\d,]+)/)[1].replace(/,/g, ''), 'hand-washing: count falls with time');
  await setS('20'); await page.uncheck(R + '.hw-soap');
  check((await t('.hw-out')).startsWith('449,329 germs'), 'hand-washing: water only 20 s = 449,329 (more than soap)');
  await page.click(R + 'button:has-text("Soap, 5 s")');
  check((await t('.hw-out')).startsWith('472,367 germs'), 'hand-washing: Soap, 5 s preset');
  { const a = await page.getAttribute(R + '.lq-item', 'data-ans'); await page.fill(R + '.lq-in', a); await page.click(R + '.lq-check');
    check((await page.textContent(R + '.lq-fb')) === 'Right.', 'hand-washing: quiz accepts the right answer'); }
};
