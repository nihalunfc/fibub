// #1470 definite integral properties (maths checked against sympy in tests/sci-tools/integral-properties.mjs)
export const path = '/learn/integral-properties/';
export default async ({ page, check, BASE }) => {
  const R = '.ipr ';
  const t = (s) => page.textContent(R + s);
  const set = (sel, v) => page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/integral-properties/`); await page.waitForTimeout(500);
  { const l = await t('.ip-lines'); check(l.includes('f is odd') && l.includes('Left half ∫₋ₖ⁰ = −0.1406, right half ∫₀ᵏ = 0.1406') && l.includes('= 0'), `props: odd x³ − x (${l})`); }
  check((await t('.ip-verdict')).includes('cancel'), 'props: odd verdict');
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.ip-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0, m = 0; for (let i = 0; i < g.length; i += 4) { if (g[i] < 200 && g[i + 2] > g[i] + 40) n++; if (g[i] > g[i + 2] + 40) m++; } return [n, m]; });
  check(px[0] > 100 && px[1] > 100, `props: both halves shaded (${px})`);
  await page.selectOption(R + '.ip-fn', 'x2');
  check((await t('.ip-verdict')) === 'Even: whole = 2 × 1.125 = 2.25.', `props: even x² (${await t('.ip-verdict')})`);
  await page.selectOption(R + '.ip-fn', 'exp');
  check((await t('.ip-verdict')).startsWith('Neither'), 'props: eˣ neither');
  // Split.
  await page.selectOption(R + '.ip-fn', 'x2'); await page.selectOption(R + '.ip-prop', 'split');
  check(await page.isVisible(R + '.ip-s-c') && await page.isHidden(R + '.ip-s-k'), 'props: split sliders');
  { const l = await t('.ip-lines'); check(l.includes('= 0.1823') && l.includes('∫ from a to b = 2.7083'), `props: split numbers match sympy (${l})`); }
  await set('.ip-c', 2.5);
  check((await t('.ip-verdict')).includes('outside'), `props: c outside (${await t('.ip-verdict')})`);
  // Swap.
  await page.selectOption(R + '.ip-prop', 'swap');
  { const l = await t('.ip-lines'); check(l.includes('= 2.7083') && l.includes('= −2.7083'), `props: swap (${l})`); }
  // King.
  await page.selectOption(R + '.ip-prop', 'king');
  check(await page.isVisible(R + '.ip-fig2') && (await t('.ip-verdict')).startsWith('Equal'), 'props: mirror trick with second picture');
  // Double.
  await page.selectOption(R + '.ip-prop', 'double'); await page.selectOption(R + '.ip-fn', 'sin');
  check((await t('.ip-verdict')).startsWith('They match') && (await t('.ip-lines')).includes('∫₀²ᵏ f(x) dx = 1.99'), `props: sin on [0, 3] in two halves (${await t('.ip-lines')})`);
  // FTC.
  await page.selectOption(R + '.ip-prop', 'ftc'); await page.selectOption(R + '.ip-fn', 'x2'); await set('.ip-a', 0); await set('.ip-x', 1.5);
  { const l = await t('.ip-lines'); check(l.includes('A(1.5) = ∫ from 0 to 1.5 of f(t) dt = 1.125') && l.includes('Height f(1.5) = 2.25'), `props: area function (${l})`); }
  check((await t('.ip-verdict')).includes('Slope of A = height'), 'props: FTC verdict');
  // Own function and bad input.
  await page.selectOption(R + '.ip-fn', 'own');
  await page.fill(R + '.ip-own', 'x + q');
  check(await page.isVisible(R + '.ip-err'), 'props: bad own function message');
  await page.fill(R + '.ip-own', 'x^2 cos(x)'); await page.selectOption(R + '.ip-prop', 'sym');
  check(await page.isHidden(R + '.ip-err') && (await t('.ip-lines')).includes('f is even'), 'props: own even function');
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'props: five quiz questions');
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', '0'); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'props: odd quiz answer');
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', '1'); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')).startsWith('Not quite'), 'props: wrong answer caught');
};
