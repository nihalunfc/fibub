// #578 entropy and channel capacity calculator. Expected numbers from scipy/numpy (see tests/sci-tools/entropy-calculator.mjs).
export const path = '/science/entropy-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const T = async (c) => (await page.textContent(`.enc ${c}`)).trim();
  const wait = () => page.waitForTimeout(400);
  const mode = async (m) => { await page.click(`.enc .en-mode [data-m=${m}]`); await page.waitForTimeout(150); };
  const errShown = async (re) => (await page.isVisible('.enc .en-err')) && re.test(await T('.en-err')) && await page.isHidden('.enc .en-out');
  const dl = async (sel, name) => { await page.locator(`.enc ${sel}`).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.enc ${sel}`)]); const f = OUT + name; await d.saveAs(f); return { f, name: d.suggestedFilename() }; };

  // Distribution
  check(await T('.en-big') === 'H = 1.75 bits', 'entropy: example distribution 1.75 bits');
  { const t = await T('.en-facts'); check(t.includes('87.5 %') && t.includes('12.5 %') && t.includes('Perplexity3.36359') && t.includes('Min-entropy H∞1 bits') && t.includes('1.54057 bits'), 'entropy: efficiency, perplexity, min and collision entropy'); }
  check(await page.isVisible('.enc .en-fig') && (await page.$$('.enc .en-tab tr')).length === 5, 'entropy: chart and symbol table');
  await page.selectOption('.enc .en-base', 'e'); await wait();
  check(await T('.en-big') === 'H = 1.21301 nats', 'entropy: nats');
  await page.selectOption('.enc .en-base', '10'); await wait();
  check(await T('.en-big') === 'H = 0.526802 hartleys', 'entropy: hartleys');
  await page.selectOption('.enc .en-base', '2');
  await page.fill('.enc .en-dist', 'symbol,count\na,5\nb,3\nc,2'); await wait();
  check(await T('.en-big') === 'H = 1.48548 bits' && (await T('.en-facts')).includes('counts (total 10)') && (await T('.en-tab')).includes('a0.5'), 'entropy: labelled counts from a spreadsheet');
  await page.fill('.enc .en-dist', '1/2 1/4 1/8 1/8'); await wait();
  check(await T('.en-big') === 'H = 1.75 bits', 'entropy: fractions');
  await page.fill('.enc .en-dist', '0.5, half'); await wait();
  check(await errShown(/"half" is not a number/), 'entropy: words rejected');
  await page.fill('.enc .en-dist', '0.5, -0.2'); await wait();
  check(await errShown(/cannot be negative/), 'entropy: negatives rejected');
  writeFileSync(OUT + 'dist.csv', 'outcome,count\nheads,30\ntails,10\n');
  await page.setInputFiles('.enc [data-p=dist] .dfb-in', OUT + 'dist.csv'); await wait();
  check(await T('.en-big') === 'H = 0.811278 bits', 'entropy: distribution from a CSV file');
  { const { f } = await dl('.en-csv', 'dist-out.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 3 && r[0].startsWith('Symbol,Probability') && r[1].startsWith('heads,0.75'), 'entropy: distribution CSV'); }

  // Text or file
  await mode('text');
  check(await T('.en-big') === '4.24063 bits per character' && (await T('.en-facts')).includes('Different characters27') && (await T('.en-facts')).includes('339.251 bits'), 'entropy: example text');
  check((await T('.en-tab')).startsWith('SymbolCountShareSurprise (bits)␣1620 %'), 'entropy: spaces shown as ␣, most common first');
  { const { f } = await dl('.en-csv', 'sym.csv'); check(readFileSync(f, 'utf8').trim().split('\n').length === 28, 'entropy: symbol CSV has all 27'); }
  await page.selectOption('.enc .en-unit', 'word'); await wait();
  check(await T('.en-big') === '3.61687 bits per word', 'entropy: words');
  await page.fill('.enc .en-text', 'naïve café — ünïcödé ☃'); await page.selectOption('.enc .en-unit', 'byte'); await wait();
  check(await T('.en-big') === '3.89032 bits per byte' && (await T('.en-facts')).includes('Bytes32'), 'entropy: UTF-8 bytes');
  await page.selectOption('.enc .en-unit', 'char'); await wait();
  check(await T('.en-big') === '3.64125 bits per character', 'entropy: Unicode characters');
  await page.fill('.enc .en-text', ''); await wait();
  check(await errShown(/Type or paste some text/), 'entropy: empty text message');
  { const b = Buffer.concat([Buffer.from(Array.from({ length: 768 }, (_, i) => i % 256)), Buffer.from('hello')]); writeFileSync(OUT + 'bytes.bin', b); }
  await page.setInputFiles('.enc .en-file', OUT + 'bytes.bin'); await page.waitForTimeout(600);
  check(await T('.en-big') === '7.99815 bits per byte' && (await T('.en-h')) === 'Entropy of bytes.bin' && (await T('.en-facts')).includes('99.98 %') && (await T('.en-flimit')).includes('773 bytes'), 'entropy: a file\'s bytes');
  check((await T('.en-tab')).includes("108 (0x6C 'l')5"), 'entropy: byte table with hex and character');
  await page.click('.enc .en-clear'); await wait();
  check(await errShown(/Type or paste some text/) && !(await page.isDisabled('.enc .en-text')), 'entropy: back to the text');
  await page.click('.enc .en-ex'); await wait();
  check(await T('.en-big') === '4.24063 bits per character', 'entropy: text example button');

  // Joint table
  await mode('joint');
  check(await T('.en-big') === 'I(X;Y) = 0.292947 bits', 'entropy: mutual information of the example');
  { const t = await T('.en-facts'); check(t.includes('H(X)1.51289 bits') && t.includes('H(Y)0.958042 bits') && t.includes('H(X,Y)2.17798 bits') && t.includes('H(X|Y)1.21994') && t.includes('H(Y|X)0.665095'), 'entropy: joint and conditional entropies'); }
  check((await T('.en-tab')).includes('sun0.40.050.45') && (await T('.en-tab')).includes('P(y)0.620.381'), 'entropy: joint probabilities with names and marginals');
  await page.fill('.enc .en-joint', '1 2\n2 4'); await wait();
  check(await T('.en-big') === 'I(X;Y) = 0 bits', 'entropy: independent table');
  await page.fill('.enc .en-joint', '1 2\n3'); await wait();
  check(await errShown(/same number of values/), 'entropy: ragged table message');
  await page.click('.enc .en-ex'); await wait();

  // Divergence
  await mode('kl');
  check(await T('.en-big') === 'D(P‖Q) = 0.153561 bits' && (await T('.en-facts')).includes('D(Q‖P)0.175687 bits') && (await T('.en-facts')).includes('Jensen-Shannon divergence0.0402016 bits') && (await T('.en-facts')).includes('Cross-entropy H(P, Q)2 bits'), 'entropy: KL both ways, cross-entropy, JS');
  await page.fill('.enc .en-pp', '0.5, 0.5'); await page.fill('.enc .en-qq', '1, 0'); await wait();
  check(await T('.en-big') === 'D(P‖Q) = ∞ bits' && (await T('.en-facts')).includes('Q is 0 where P is not (value 2)'), 'entropy: infinite KL explained');
  await page.fill('.enc .en-qq', '1, 0, 0'); await wait();
  check(await errShown(/P has 2 values and Q has 3/), 'entropy: different lengths message');
  await page.click('.enc .en-ex'); await wait();

  // Channels
  await mode('chan');
  check(await T('.en-big') === 'C = 0.500084 bits per use' && (await T('.en-facts')).includes('Blahut-Arimoto check0.500084'), 'entropy: BSC p = 0.11');
  await page.selectOption('.enc .en-ch', 'bec'); await page.fill('.enc .en-cp', '0.3'); await wait();
  check(await T('.en-big') === 'C = 0.7 bits per use' && (await T('.en-tab')).includes('y = ?'), 'entropy: erasure channel');
  await page.selectOption('.enc .en-ch', 'z'); await page.fill('.enc .en-cp', '0.5'); await wait();
  check(await T('.en-big') === 'C = 0.321928 bits per use' && (await T('.en-facts')).includes('Best share of 1s sent0.4'), 'entropy: Z channel');
  await page.selectOption('.enc .en-base', 'e'); await wait();
  check(await T('.en-big') === `C = ${+(0.32192809488736235 * Math.LN2).toPrecision(6)} nats per use`, 'entropy: capacity in nats');
  await page.selectOption('.enc .en-base', '2');
  await page.fill('.enc .en-cp', '1.5'); await wait();
  check(await errShown(/between 0 and 1/), 'entropy: bad p message');
  await page.selectOption('.enc .en-ch', 'gen'); await wait();
  check(await T('.en-big') === 'C = 0.67919287 bits per use' && (await T('.en-facts')).includes('yes, gap under 10⁻¹²') && (await T('.en-tab')).includes('x10.383883'), 'entropy: Blahut-Arimoto on the example channel');
  await page.fill('.enc .en-px', '1/3, 1/3, 1/3'); await wait();
  check((await T('.en-facts')).includes('I(X;Y) at your input0.662568 bits'), 'entropy: I(X;Y) at a chosen input');
  await page.fill('.enc .en-px', '0.5, 0.5'); await wait();
  check(await errShown(/has 2 values; the channel has 3 inputs/), 'entropy: input length message');
  await page.fill('.enc .en-px', ''); await page.fill('.enc .en-W', '2 2\n1 3'); await wait();
  check((await T('.en-facts')).includes('rescaled to add up to 1'), 'entropy: rows of counts rescaled');
  await page.fill('.enc .en-W', '0.5 0.5\n0.5 0.5'); await wait();
  check(await T('.en-big') === 'C = 0 bits per use', 'entropy: useless channel');
  await page.click('.enc .en-ex'); await wait();
  await page.screenshot({ path: OUT + 'enc-chan.png', fullPage: true });
  { const { f } = await dl('.en-csv', 'chan.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4 && r[0] === 'Input,Best input probability,y1,y2,y3', 'entropy: channel CSV'); }
  for (const [k, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    const { f, name } = await dl(`.dl [data-f=${k}]`, 'r.' + ext);
    check(name.endsWith('.' + ext) && readFileSync(f).length > 2000, `entropy: ${k} report download (${name})`);
  }
  await page.setViewportSize({ width: 375, height: 800 }); await mode('dist'); await page.locator('.enc').screenshot({ path: OUT + 'enc-375.png' }); await mode('joint'); await page.locator('.enc .en-out').screenshot({ path: OUT + 'enc-375j.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
