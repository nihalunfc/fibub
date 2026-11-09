// #803 equation converter
export const path = '/science/equation-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/equation-converter/`); await page.waitForTimeout(500);
  const out = () => page.inputValue('.eqc .eqc-out');
  check((await out()).startsWith('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac>'), 'equation: example converts to MathML');
  { const box = await page.locator('.eqc .eqc-prev math mfrac').boundingBox(); check(box && box.height > 30 && await page.locator('.eqc .eqc-prev msqrt').count() === 1, 'equation: preview drawn from the MathML (a real fraction and root)'); }
  await page.fill('.eqc .eqc-in', String.raw`\sum_{i=1}^n i^2`); await page.waitForTimeout(300);
  check((await out()).includes('<munderover><mo movablelimits="true">∑</mo>'), 'equation: typing updates the MathML');
  await page.selectOption('.eqc .eqc-disp', 'inline'); await page.waitForTimeout(100);
  check((await out()).includes('display="inline"'), 'equation: inline option');
  await page.check('.eqc .eqc-ann'); await page.waitForTimeout(100);
  check((await out()).includes('<annotation encoding="application/x-tex">\\sum_{i=1}^n i^2</annotation>') && await page.locator('.eqc .eqc-prev annotation').count() === 0, 'equation: LaTeX kept as an annotation, not drawn');
  await page.check('.eqc .eqc-pretty'); await page.waitForTimeout(100);
  check((await out()).split('\n').length > 5, 'equation: indented MathML');
  await page.uncheck('.eqc .eqc-ann'); await page.uncheck('.eqc .eqc-pretty');
  for (const [ex, want] of [['gauss', '<msubsup><mo>∫</mo>'], ['matrix', '<mtable>'], ['cases', '<mo fence="true" stretchy="true" form="prefix">{</mo><mtable columnalign="left left">'], ['maxwell', 'columnalign="right left"']]) {
    await page.locator(`.eqc [data-ex=${ex}]`).scrollIntoViewIfNeeded(); await page.click(`.eqc [data-ex=${ex}]`); await page.waitForTimeout(100);
    check((await out()).includes(want), `equation: example ${ex}`);
  }
  // Download the .mml file.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.eqc .eqc-dl')]); const f = OUT + 'eq.mml'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('<?xml') && t.includes('<mtable'), 'equation: .mml download'); }
  // Errors with a position and a caret.
  await page.fill('.eqc .eqc-in', String.raw`\frac{a}`); await page.waitForTimeout(300);
  check((await page.textContent('.eqc .eqc-err')).startsWith('Character 9: \\frac needs two arguments') && (await page.textContent('.eqc .eqc-err')).includes('denominator is missing here') && (await page.textContent('.eqc .eqc-caret')).includes('\\frac{a}\n        ^') && (await out()) === '' && await page.isDisabled('.eqc .eqc-copy'), 'equation: error message with position and caret');
  await page.fill('.eqc .eqc-in', String.raw`a + \foo`); await page.waitForTimeout(300);
  check((await page.textContent('.eqc .eqc-err')).startsWith('Character 5: Unknown command \\foo'), 'equation: unknown command named');
  // MathML to LaTeX, carrying the result across.
  await page.fill('.eqc .eqc-in', String.raw`\hat{x} + \vec{v}`); await page.waitForTimeout(300);
  await page.click('.eqc .eqc-dir [data-d=mml]'); await page.waitForTimeout(200);
  check((await out()) === String.raw`\hat{x} + \vec{v}` && (await page.textContent('.eqc .eqc-outh')) === 'LaTeX', 'equation: MathML back to LaTeX (round trip)');
  await page.fill('.eqc .eqc-in', '<mml:math xmlns:mml="http://www.w3.org/1998/Math/MathML"><mml:msup><mml:mi>e</mml:mi><mml:mrow><mml:mi>i</mml:mi><mml:mi>π</mml:mi></mml:mrow></mml:msup><mml:mo>+</mml:mo><mml:mn>1</mml:mn><mml:mo>=</mml:mo><mml:mn>0</mml:mn></mml:math>'); await page.waitForTimeout(300);
  check((await out()) === 'e^{i\\pi} + 1 = 0' && await page.locator('.eqc .eqc-prev msup').count() === 1, 'equation: Word-style MathML to LaTeX with preview');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.eqc .eqc-dl')]); const f = OUT + 'eq.tex'; await d.saveAs(f); check(readFileSync(f, 'utf8') === 'e^{i\\pi} + 1 = 0\n', 'equation: .tex download'); }
  await page.fill('.eqc .eqc-in', '<math><mi>x</mn></math>'); await page.waitForTimeout(300);
  check((await page.textContent('.eqc .eqc-err')).includes('is closed here by </mn>'), 'equation: bad MathML message');
  await page.click('.eqc .eqc-dir [data-d=tex]'); await page.waitForTimeout(200);
  check(await page.isVisible('.eqc .eqc-ex') && (await page.textContent('.eqc .eqc-copy')) === 'Copy MathML', 'equation: back to LaTeX to MathML');
  check((await page.locator('.eqc .eqc-cmds code').count()) > 200, 'equation: supported command list');
};
