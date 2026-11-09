// #803 equation converter: LaTeX to MathML and back. Checked against latex2mathml 3.81.1 (Python) on 87 expressions:
// 85 give the same tree (allowing mi/mo for symbols such as \\infty and \\pm, where the two differ by convention); the other two
// are latex2mathml slips (\\sim written as ~, \\arg unknown). Every expression also survives LaTeX -> MathML -> LaTeX -> MathML unchanged.
import { texToMathML, mathmlToTex, parseXml, placeText, styled, unstyled, MathError } from '../../src/lib/sci/texmath.ts';

const SET = ["\\frac{a}{b}","\\frac12 + \\frac{3}{4}","x_i^2","x^{2n+1}","a_{ij}","\\sqrt{x^2+y^2}","\\sqrt[3]{x}","\\sum_{i=1}^n i^2 = \\frac{n(n+1)(2n+1)}{6}","\\prod_{k=1}^{N} (1 + x_k)","\\int_0^1 f(x)\\,dx","\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}","\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}","\\iint_D f \\, dA","\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}","\\begin{bmatrix}1&0&0\\\\0&1&0\\\\0&0&1\\end{bmatrix}","\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix} = ad - bc","\\begin{matrix}a&b\\\\c&d\\end{matrix}","\\begin{Bmatrix}x\\\\y\\end{Bmatrix}","\\left(\\frac12\\right)","\\left[ \\frac{a}{b} \\right]","\\left\\{ x \\right\\}","\\left| x \\right|","\\left\\langle \\psi \\right|","\\hat{x}+\\bar{y}+\\tilde{z}","\\dot{x} + \\ddot{x}","\\overline{AB}","\\underline{x}","\\alpha + \\beta + \\gamma + \\delta","\\Gamma(z) = \\int_0^\\infty t^{z-1} e^{-t} dt","\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}","\\theta \\phi \\psi \\omega \\lambda \\mu \\sigma \\tau","\\Omega \\Phi \\Psi \\Sigma \\Pi \\Lambda \\Theta","\\sin^2 x + \\cos^2 x = 1","\\log_{10} x","\\ln(1+x)","\\exp(x)","\\lim_{x\\to0}\\frac{\\sin x}{x}=1","\\max_{i} x_i","a \\pm b \\mp c","a \\times b \\div c","a \\cdot b","a \\leq b \\geq c \\neq d","a \\approx b \\equiv c \\sim d \\propto e","x \\in A \\subset B \\subseteq C","A \\cup B \\cap C","\\forall x \\exists y","p \\Rightarrow q \\Leftrightarrow r","x \\to \\infty","\\partial_t u = \\nabla^2 u","\\frac{\\partial f}{\\partial x}","\\frac{d^2 y}{dx^2}","f'(x)","f''(x)","\\mathbf{F} = m\\mathbf{a}","\\mathbb{R}^n","\\mathcal{L}","\\mathrm{d}x","\\text{if } x > 0","E = mc^2","e^{i\\pi} + 1 = 0","x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}","a_1, a_2, \\ldots, a_n","1 + 2 + \\cdots + n","\\binom{n}{k}","\\vec{v}","\\{ x \\mid x > 0 \\}","|x|","\\|v\\|","\\langle x, y \\rangle","\\lfloor x \\rfloor + \\lceil y \\rceil","\\overset{\\text{def}}{=}","\\underset{x}{\\arg\\min}","\\quad x \\qquad y","a\\,b\\;c\\!d","3.14159","2x + 3y = 7","f(x) = \\begin{cases} 1 & x > 0 \\\\ 0 & x \\leq 0 \\end{cases}","\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N (x_i - \\mu)^2}","\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}","\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}","P(A|B) = \\frac{P(B|A)P(A)}{P(B)}","\\hbar \\omega","\\ell","\\varepsilon \\varphi \\vartheta","x^{a^b}","{}^{14}C","\\left( \\sum_{k=0}^n a_k \\right)^2"];
// MathML written by latex2mathml for some of them, to read back.
const L2M = [["\\sum_{i=1}^n i^2 = \\frac{n(n+1)(2n+1)}{6}", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msubsup><mo>&#x02211;</mo><mrow><mi>i</mi><mo>&#x0003D;</mo><mn>1</mn></mrow><mi>n</mi></msubsup><msup><mi>i</mi><mn>2</mn></msup><mo>&#x0003D;</mo><mfrac><mrow><mi>n</mi><mo stretchy=\"false\">&#x00028;</mo><mi>n</mi><mo>&#x0002B;</mo><mn>1</mn><mo stretchy=\"false\">&#x00029;</mo><mo stretchy=\"false\">&#x00028;</mo><mn>2</mn><mi>n</mi><mo>&#x0002B;</mo><mn>1</mn><mo stretchy=\"false\">&#x00029;</mo></mrow><mrow><mn>6</mn></mrow></mfrac></mrow></math>"], ["\\int_0^1 f(x)\\,dx", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><msubsup><mo>&#x0222B;</mo><mn>0</mn><mn>1</mn></msubsup><mi>f</mi><mo stretchy=\"false\">&#x00028;</mo><mi>x</mi><mo stretchy=\"false\">&#x00029;</mo><mspace width=\"0.167em\" /><mi>d</mi><mi>x</mi></mrow></math>"], ["\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mo>&#x00028;</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable><mo>&#x00029;</mo></mrow></math>"], ["\\left(\\frac12\\right)", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mrow><mo stretchy=\"true\" fence=\"true\" form=\"prefix\">&#x00028;</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mo stretchy=\"true\" fence=\"true\" form=\"postfix\">&#x00029;</mo></mrow></mrow></math>"], ["\\hat{x}+\\bar{y}+\\tilde{z}", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mover accent=\"true\"><mrow><mi>x</mi></mrow><mo>&#x0005E;</mo></mover><mo>&#x0002B;</mo><mover><mrow><mi>y</mi></mrow><mo stretchy=\"true\">&#x000AF;</mo></mover><mo>&#x0002B;</mo><mover><mrow><mi>z</mi></mrow><mo stretchy=\"false\">&#x0007E;</mo></mover></mrow></math>"], ["\\mathbf{F} = m\\mathbf{a}", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>&#x1D405;</mi><mo>&#x0003D;</mo><mi>m</mi><mi>&#x1D41A;</mi></mrow></math>"], ["x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", "<math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"inline\"><mrow><mi>x</mi><mo>&#x0003D;</mo><mfrac><mrow><mo>&#x02212;</mo><mi>b</mi><mi>&#x000B1;</mi><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x02212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>"]];
const M = (body, d = 'inline') => `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${d}"><mrow>${body}</mrow></math>`;
const err = (f) => { try { f(); return null; } catch (e) { return e; } };

export default async (check) => {
  // Exact MathML for the main structures.
  const exact = [
    [String.raw`\frac{a}{b}`, '<mfrac><mi>a</mi><mi>b</mi></mfrac>'],
    [String.raw`x_i^2`, '<msubsup><mi>x</mi><mi>i</mi><mn>2</mn></msubsup>'],
    [String.raw`\sqrt[3]{x}`, '<mroot><mi>x</mi><mn>3</mn></mroot>'],
    [String.raw`\sqrt{x+1}`, '<msqrt><mi>x</mi><mo>+</mo><mn>1</mn></msqrt>'],
    [String.raw`\sum_{i=1}^n i`, '<munderover><mo movablelimits="true">∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mi>i</mi>'],
    [String.raw`\int_0^1 x\,dx`, '<msubsup><mo>∫</mo><mn>0</mn><mn>1</mn></msubsup><mi>x</mi><mspace width="0.167em"/><mi>d</mi><mi>x</mi>'],
    [String.raw`\sin x`, '<mi>sin</mi><mo>&#x2061;</mo><mi>x</mi>'],
    [String.raw`\Gamma`, '<mi mathvariant="normal">Γ</mi>'],
    [String.raw`\mathbb{R}^n`, '<msup><mi>ℝ</mi><mi>n</mi></msup>'],
    [String.raw`\mathbf{F}`, '<mi>𝐅</mi>'],
    [String.raw`\text{if } x`, '<mtext>if&#xA0;</mtext><mi>x</mi>'],
    [String.raw`\hat{x}`, '<mover accent="true"><mi>x</mi><mo stretchy="false">^</mo></mover>'],
    [String.raw`a-b`, '<mi>a</mi><mo>−</mo><mi>b</mi>'],
    [String.raw`f(x)`, '<mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo>'],
    [String.raw`\binom{n}{k}`, '<mo>(</mo><mfrac linethickness="0"><mi>n</mi><mi>k</mi></mfrac><mo>)</mo>'],
    [String.raw`3.14`, '<mn>3.14</mn>'],
    [String.raw`x \neq y`, '<mi>x</mi><mo>≠</mo><mi>y</mi>'],
    [String.raw`x \not< y`, '<mi>x</mi><mo>≮</mo><mi>y</mi>'],
  ];
  for (const [tex, body] of exact) check(`texmath: ${tex}`, texToMathML(tex) === M(body));
  check('texmath: \\left( \\right) stretchy fences', texToMathML(String.raw`\left(\frac12\right)`) === M('<mrow><mo fence="true" stretchy="true" form="prefix">(</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mo fence="true" stretchy="true" form="postfix">)</mo></mrow>').replace('<mrow><mrow>', '<mrow>').replace('</mrow></mrow>', '</mrow>'));
  check('texmath: pmatrix', texToMathML(String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`).includes('<mo fence="true" stretchy="true" form="prefix">(</mo><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr><mtr><mtd><mi>c</mi></mtd><mtd><mi>d</mi></mtd></mtr></mtable>'));
  check('texmath: display block and $$ unwrapped', texToMathML('$$E=mc^2$$', { display: true }) === M('<mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup>', 'block'));
  check('texmath: annotation keeps the LaTeX', texToMathML('a<b', { annotate: true }).includes('<semantics><mrow><mi>a</mi><mo>&lt;</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a&lt;b</annotation></semantics>'));
  check('texmath: pretty print indents', texToMathML('x^2', { pretty: true }).split('\n').length === 8);
  check('texmath: maths letters', styled('A', 'bold') === '𝐀' && styled('C', 'double-struck') === 'ℂ' && styled('α', 'bold') === '𝛂' && styled('L', 'script') === 'ℒ' && unstyled('𝐱')?.join() === 'x,bold');

  // Round trips: LaTeX -> MathML -> LaTeX -> MathML gives the same MathML for every expression.
  let same = 0; const bad = [];
  for (const s of SET) { const m = texToMathML(s), back = mathmlToTex(m); if (texToMathML(back) === m) same++; else bad.push(s); }
  check(`texmath: ${same} of ${SET.length} round trips unchanged ${bad.join(' | ')}`, same === SET.length);

  // MathML back to LaTeX.
  const back = [
    [String.raw`\frac{n(n+1)}{2}`, String.raw`\frac{n(n + 1)}{2}`],
    [String.raw`\sum_{i=1}^n i^2`, String.raw`\sum_{i = 1}^n i^2`],
    [String.raw`\int\limits_a^b f`, String.raw`\int\limits_a^b f`],
    [String.raw`\begin{bmatrix}1&0\\0&1\end{bmatrix}`, String.raw`\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}`],
    [String.raw`f(x)=\begin{cases}1&x>0\\0&x\le0\end{cases}`, String.raw`f(x) = \begin{cases} 1 & x > 0 \\ 0 & x \leq 0 \end{cases}`],
    [String.raw`\mathbf{F}=m\mathbf a`, String.raw`\mathbf{F} = m\mathbf{a}`],
    [String.raw`\lim_{x\to0}\frac{\sin x}{x}`, String.raw`\lim_{x \to 0}\frac{\sin x}{x}`],
    [String.raw`f''(x)`, "f''(x)"],
    [String.raw`\overbrace{a+b}^{n}`, String.raw`\overbrace{a + b}^n`],
    [String.raw`\operatorname{erf}(x)`, String.raw`\operatorname{erf}(x)`],
    [String.raw`\mathrm{d}x`, String.raw`\mathrm{d}x`],
    [String.raw`\text{if } x`, String.raw`\text{if }x`],
    [String.raw`a\,b\;c\quad d`, String.raw`a\,b\;c\quad d`],
    [String.raw`\left\langle\psi\middle|\phi\right\rangle`, String.raw`\left\langle \psi\middle|\phi \right\rangle`],
    [String.raw`-x + y`, String.raw`-x + y`],
  ];
  for (const [tex, want] of back) { const got = mathmlToTex(texToMathML(tex)); check(`texmath back: ${tex} -> ${got}`, got === want); }

  // MathML from other programs: latex2mathml, Word (mml: prefix), mfenced, entities.
  const fromL2m = { [String.raw`\int_0^1 f(x)\,dx`]: String.raw`\int_0^1 f(x)\,dx`, [String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`]: String.raw`x = \frac{-b\pm\sqrt{b^2 - 4ac}}{2a}`, [String.raw`\left(\frac12\right)`]: String.raw`\left( \frac{1}{2} \right)`, [String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`]: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`, [String.raw`\mathbf{F} = m\mathbf{a}`]: String.raw`\mathbf{F} = m\mathbf{a}`, [String.raw`\sum_{i=1}^n i^2 = \frac{n(n+1)(2n+1)}{6}`]: String.raw`\sum\nolimits_{i = 1}^n i^2 = \frac{n(n + 1)(2n + 1)}{6}`, [String.raw`\hat{x}+\bar{y}+\tilde{z}`]: String.raw`\hat{x} + \overline{y} + \tilde{z}`, ["f'(x)"]: "f'(x)" };
  for (const [tex, mml] of L2M) { const got = mathmlToTex(mml); check(`texmath: latex2mathml MathML for ${tex} -> ${got}`, got === fromL2m[tex]); }
  const word = '<mml:math xmlns:mml="http://www.w3.org/1998/Math/MathML"><mml:mi>x</mml:mi><mml:mo>=</mml:mo><mml:mfrac><mml:mrow><mml:mo>-</mml:mo><mml:mi>b</mml:mi><mml:mo>&#xB1;</mml:mo><mml:msqrt><mml:msup><mml:mrow><mml:mi>b</mml:mi></mml:mrow><mml:mrow><mml:mn>2</mml:mn></mml:mrow></mml:msup><mml:mo>-</mml:mo><mml:mn>4</mml:mn><mml:mi>a</mml:mi><mml:mi>c</mml:mi></mml:msqrt></mml:mrow><mml:mrow><mml:mn>2</mml:mn><mml:mi>a</mml:mi></mml:mrow></mml:mfrac></mml:math>';
  check('texmath: Word-style MathML with mml: prefix', mathmlToTex(word) === String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`);
  check('texmath: mfenced, named entities, invisible times', mathmlToTex('<math><mfenced><mi>a</mi><mi>b</mi></mfenced><mo>&InvisibleTimes;</mo><mi>&alpha;</mi></math>') === String.raw`\left( a,b \right)\alpha`);
  check('texmath: mfenced matrix', mathmlToTex('<math><mfenced open="[" close="]"><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr></mtable></mfenced></math>') === String.raw`\begin{bmatrix} 1 & 2 \end{bmatrix}`);
  check('texmath: italic maths letters read as plain', mathmlToTex('<math><mi>𝑥</mi><mo>+</mo><mi>ℎ</mi></math>') === 'x + h');
  check('texmath: XML parser keeps nesting', parseXml('<math><mrow><mi>a</mi></mrow></math>').kids[0].kids[0].text === 'a');

  // Errors say what is wrong and where.
  const e1 = err(() => texToMathML(String.raw`\frac{a}`));
  check('texmath error: missing denominator', e1 instanceof MathError && /denominator is missing/.test(e1.message) && e1.pos === 8);
  const e2 = err(() => texToMathML('x^2^3'));
  check('texmath error: double superscript at character 4', /Double superscript/.test(e2.message) && placeText('x^2^3', e2.pos) === 'character 4');
  const e3 = err(() => texToMathML(String.raw`\left( x`));
  check('texmath error: \\left without \\right', /no \\right/.test(e3.message) && e3.pos === 0);
  const e4 = err(() => texToMathML(String.raw`a + \foo`));
  check('texmath error: unknown command', /Unknown command \\foo/.test(e4.message) && e4.pos === 4);
  const e5 = err(() => texToMathML('{x'));
  check('texmath error: unclosed brace', /never closed/.test(e5.message) && e5.pos === 0);
  const e6 = err(() => texToMathML('x}'));
  check('texmath error: stray }', /no \{ to match/.test(e6.message) && e6.pos === 1);
  const e7 = err(() => texToMathML(String.raw`\begin{pmatrix} a \end{bmatrix}`));
  check('texmath error: mismatched environment', /closed by \\end\{bmatrix\}/.test(e7.message));
  const e8 = err(() => texToMathML('a & b'));
  check('texmath error: & outside a matrix', /only works inside a matrix/.test(e8.message) && e8.pos === 2);
  const e9 = err(() => texToMathML('x^'));
  check('texmath error: empty superscript', /needs something after it/.test(e9.message));
  const e10 = err(() => texToMathML('$x$ and $y$'));
  check('texmath error: $ inside', /\$ sign here/.test(e10.message));
  const e11 = err(() => texToMathML('a\n+ \\bad'));
  check('texmath error: line and character on a second line', placeText('a\n+ \\bad', e11.pos) === 'line 2, character 3');
  const e12 = err(() => texToMathML(String.raw`\begin{foo}x\end{foo}`));
  check('texmath error: unknown environment', /environment \{foo\} is not supported/.test(e12.message));
  const m1 = err(() => mathmlToTex('<math><mi>x</mn></math>'));
  check('texmath error: MathML closed by the wrong tag', /closed here by <\/mn>/.test(m1.message) && m1.pos === 11);
  const m2 = err(() => mathmlToTex('<math><mfrac><mi>a</mi></mfrac></math>'));
  check('texmath error: mfrac with one child', /exactly 2 child elements/.test(m2.message));
  const m3 = err(() => mathmlToTex('<math><mi>x</mi>'));
  check('texmath error: MathML never closed', /never closed/.test(m3.message));
  const m4 = err(() => mathmlToTex('<math><mi>&foo;</mi></math>'));
  check('texmath error: unknown entity', /Unknown entity &foo;/.test(m4.message));
};
