// #550 numerical methods teacher
export const path = '/science/numerical-methods/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.nmc ';
  const big = () => page.textContent(R + '.nm-big'), facts = () => page.textContent(R + '.nm-facts');
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(450); };
  await page.goto(`${BASE}/science/numerical-methods/`); await page.waitForTimeout(700);
  check((await big()) === 'x ≈ 2.094551482 after 5 iterations' && (await facts()).includes('f′(x)3x² − 2'), `numerics: Newton example (${await big()})`);
  { const t = await page.textContent(R + '.nm-t1'); check(t.includes('2.1') && t.includes('2.094568121'), 'numerics: Newton iteration table'); }
  { const rows = await page.$$eval(R + '.nm-t2 tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent))); check(rows.map((r) => r[1]).join() === '34,22,5,7', `numerics: all four methods compared (${rows.map((r) => r[1]).join()})`); }
  check(await page.isVisible(R + '.nm-fig1') && await page.isVisible(R + '.nm-fig2'), 'numerics: function and error plots');
  await page.selectOption(R + '.nm-meth', 'bisection'); await page.waitForTimeout(200);
  check((await big()).endsWith('after 34 iterations') && (await page.textContent(R + '.nm-t1')).includes('Error bound'), 'numerics: bisection table');
  await page.selectOption(R + '.nm-meth', 'secant'); await page.waitForTimeout(200);
  check((await big()).endsWith('after 7 iterations') && (await facts()).includes('theory: 1.618'), 'numerics: secant with order estimate');
  await page.selectOption(R + '.nm-meth', 'false'); await page.waitForTimeout(200);
  check((await big()).endsWith('after 22 iterations'), 'numerics: false position');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nm-csv')]); const f = OUT + 'it.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 23 && rows[0].startsWith('n,a,b,x (new point)'), 'numerics: iterations CSV'); }
  await page.selectOption(R + '.nm-meth', 'bisection'); await fill('.nm-a', '3'); await fill('.nm-b', '4');
  check((await big()) === 'No root found' && (await page.textContent(R + '.nm-note')).includes('same sign'), 'numerics: bracket without a sign change');
  await fill('.nm-b', '2');
  check((await page.textContent(R + '.nm-err')).includes('larger than a'), 'numerics: b below a refused');
  await page.click(R + '.nm-ex[data-ex^="root|cos"]'); await page.waitForTimeout(300);
  check((await big()) === 'x ≈ 0.7390851332 after 34 iterations', `numerics: cos x = x by bisection (${await big()})`);
  await page.click(R + '.nm-ex[data-ex^="root|atan"]'); await page.waitForTimeout(300);
  check((await big()) === 'No root found' && (await page.textContent(R + '.nm-note')).includes('ran away'), 'numerics: Newton fails for atan from 1.5');
  await fill('.nm-f', 'x^2 + y');
  check((await page.textContent(R + '.nm-err')).includes('only letter'), 'numerics: other letters refused');
  await page.click(R + '.nm-tabs button[data-t=quad]'); await page.waitForTimeout(300);
  check((await big()) === '≈ 1.718284155 (Simpson, n = 8)' && (await facts()).includes('e − 1 = 1.718281828 (exact)'), `numerics: Simpson for e^x with an exact reference (${await facts()})`);
  { const t = await page.textContent(R + '.nm-t1'); check(t.includes('1.720518592') && t.includes('1.718281004') && t.includes('1.717163665'), 'numerics: trapezoid, Gauss and midpoint values'); }
  check((await page.$$(R + '.nm-t2 tbody tr')).length === 6, 'numerics: Romberg table');
  await fill('.nm-n', '7');
  check((await big()).includes('trapezoid, n = 7') && (await page.textContent(R + '.nm-note')).includes('even number'), 'numerics: odd n leaves Simpson out');
  await fill('.nm-if', 'sin(x)'); await fill('.nm-ib', 'pi'); await fill('.nm-n', '8');
  check((await facts()).includes('2 (exact)') || (await facts()).startsWith('Reference value2 = 2 (exact)'), `numerics: ∫₀^π sin = 2 exact reference (${await facts()})`);
  await fill('.nm-if', 'e^(-x^2)');
  check((await facts()).includes('20-point Gauss on 64 panels') && (await facts()).includes('0.') , 'numerics: numerical reference when no exact integral');
  await fill('.nm-if', '1/x'); await fill('.nm-ia', '-1');
  check((await page.textContent(R + '.nm-err')).includes('undefined at x'), 'numerics: singular integrand refused');
  await fill('.nm-ia', '0'); await fill('.nm-if', 'e^x'); await fill('.nm-ib', '1');
  await page.click(R + '.nm-tabs button[data-t=interp]'); await page.waitForTimeout(300);
  check((await big()) === 'At x = 3: polynomial 2.7, spline 3.321721311' && (await facts()).includes('−0.2x^4 + 1.98333x^3 − 6.05x^2 + 6.26667x + 1'), `numerics: interpolation example (${await big()})`);
  { const t = await page.textContent(R + '.nm-t1'); check(t.includes('−1.5') && (await page.$$(R + '.nm-t2 tbody tr')).length === 4, 'numerics: divided differences and spline pieces'); }
  await fill('.nm-at', '7');
  check((await page.textContent(R + '.nm-note')).includes('extrapolation'), 'numerics: extrapolation warning');
  await fill('.nm-pts', 'x y\n0 1\n1 3\n1 4');
  check((await page.textContent(R + '.nm-err')).includes('same x'), 'numerics: repeated x refused');
  await fill('.nm-pts', '0 1\n1 oops');
  check((await page.textContent(R + '.nm-err')).includes('Line 2 needs two numbers'), 'numerics: bad point line');
  await fill('.nm-pts', '0 1\n1 3\n2 2\n4 5\n5 4');
  await page.click(R + '.nm-ex[data-ex="interp|fn"]'); await page.waitForTimeout(400);
  { const f = await facts(); check(f.includes('Largest error, polynomial1.91') && f.includes('Largest error, spline0.02') && await page.isVisible(R + '.nm-fig2'), `numerics: Runge example errors (${f.slice(-80)})`); }
  await page.selectOption(R + '.nm-sp', 'cheb'); await page.waitForTimeout(300);
  check((await facts()).includes('Largest error, polynomial0.10'), 'numerics: Chebyshev points tame Runge');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check(d.suggestedFilename() === 'numerical-interp.docx', 'numerics: Word download'); }
};
