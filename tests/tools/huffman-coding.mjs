// #579 Huffman and arithmetic coding visualiser. Expected codes, bits and intervals from the Python reference
// (see tests/sci-tools/huffman-coding.mjs).
export const path = '/science/huffman-coding/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const T = async (c) => (await page.textContent(`.hfc ${c}`)).trim();
  const wait = () => page.waitForTimeout(400);
  const dl = async (sel, name) => { await page.locator(`.hfc ${sel}`).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.hfc ${sel}`)]); const f = OUT + name; await d.saveAs(f); return { f, name: d.suggestedFilename() }; };
  const codes = async () => page.$$eval('.hfc .hf-tab tr', (rs) => Object.fromEntries(rs.slice(1).map((r) => [r.cells[0].textContent, r.cells[3].textContent]).sort()));

  // Example message
  check(await T('.hf-big') === '2.0909 bits per symbol (entropy 2.0404)', 'huffman: abracadabra average length and entropy');
  { const f = await T('.hf-facts'); check(f.includes('Efficiency H / L97.58 %') && f.includes('Huffman bits23') && f.includes('Fixed-length bits33') && f.includes('As UTF-8 text88 bits') && f.includes('Kraft sum Σ 2^−length1'), 'huffman: comparison with fixed-length and UTF-8'); }
  check(JSON.stringify(await codes()) === JSON.stringify({ a: '0', b: '110', c: '100', d: '101', r: '111' }), 'huffman: codes match the Python reference');
  check(await page.isVisible('.hfc .hf-tree'), 'huffman: tree drawn');
  check(await T('.hf-bits') === '01101110100010101101110' && await T('.hf-decout') === 'Decoded: abracadabra', 'huffman: encoded bits and decoded again');
  await page.fill('.hfc .hf-dec', '0 110 1'); await page.waitForTimeout(150);
  check(await T('.hf-decout') === 'Decoded: ab (then 1, the start of an unfinished code word)', 'huffman: decode typed bits with a leftover');
  await page.fill('.hfc .hf-dec', '012'); await page.waitForTimeout(150);
  check(await T('.hf-decout') === 'Only 0s, 1s and spaces, please.', 'huffman: bad bits message');
  // Arithmetic coding
  check(await T('.hf-abig') === '23 bits (Huffman 23, information 22.444)', 'arithmetic: abracadabra 23 bits');
  { const f = await T('.hf-afacts'); check(f.includes('Code bits01000011110110101010100') && f.includes('[6874847395/25937424601, 75623371345/285311670611)') && f.includes('matches the message') && f.includes('24 bits'), 'arithmetic: exact final interval, tag and decode check'); }
  check((await page.$$('.hfc .hf-atab tr')).length === 12 && await page.isVisible('.hfc .hf-afig'), 'arithmetic: 11 steps and the interval picture');
  { const { f } = await dl('.hf-csv', 'codes.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[0] === 'Symbol,Count,Probability,Code,Length,p × length' && r[1].startsWith('a,5,'), 'huffman: code table CSV'); }
  { const { f } = await dl('.hf-acsv', 'steps.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 12 && r[11].startsWith('11,a,0.26505512789,0.26505530314,22.4441'), 'arithmetic: steps CSV'); }
  // Canonical
  await page.check('.hfc .hf-canon'); await wait();
  check(JSON.stringify(await codes()) === JSON.stringify({ a: '0', b: '100', c: '110', d: '111', r: '101' }) && await T('.hf-decout') === 'Decoded: abracadabra', 'huffman: canonical codes, still decodes');
  await page.uncheck('.hfc .hf-canon'); await wait();
  // Longer example
  await page.click('.hfc .hf-ex2'); await wait();
  check(await T('.hf-abig') === '112 bits (Huffman 114, information 111.45)' && (await codes())['␣'] === '111', 'huffman: tongue twister, arithmetic beats Huffman, spaces shown');
  await page.fill('.hfc .hf-msg', ''); await wait();
  check((await T('.hf-err')) === 'Type a message to code.' && await page.isHidden('.hfc .hf-out'), 'huffman: empty message');
  await page.fill('.hfc .hf-msg', 'ab'.repeat(600)); await wait();
  check((await T('.hf-abig')).startsWith('Arithmetic coding is shown for messages up to 1,000') && await T('.hf-big') === '1 bits per symbol (entropy 1)', 'arithmetic: long message limit');
  await page.click('.hfc .hf-ex'); await wait();

  // Probabilities
  await page.click('.hfc .hf-mode [data-m=prob]'); await wait();
  check(await T('.hf-big') === '2.2 bits per symbol (entropy 2.1219)' && JSON.stringify(await codes()) === JSON.stringify({ a: '11', b: '00', c: '01', d: '100', e: '101' }), 'huffman: probabilities with ties match Python');
  check((await T('.hf-afacts')).includes('matches the message') && (await T('.hf-facts')).includes('Message8 symbols'), 'arithmetic: message coded with typed probabilities');
  await page.click('.hfc .hf-ex2'); await wait();
  check(await T('.hf-big') === '2.5 bits per symbol (entropy 2.5)' && await T('.hf-decout') === 'Decoded: the cat sat on a mat', 'huffman: word symbols with power-of-two probabilities');
  await page.fill('.hfc .hf-pmsg', 'the dog'); await wait();
  check((await T('.hf-err')).includes('"dog", which is not in your list'), 'huffman: unknown symbol in the message');
  await page.fill('.hfc .hf-probs', 'a 1\na 2'); await wait();
  check((await T('.hf-err')) === '"a" is listed twice.', 'huffman: duplicate symbol');
  await page.fill('.hfc .hf-probs', 'a 0.5\nb'); await wait();
  check((await T('.hf-err')).startsWith('Line 2: write a symbol'), 'huffman: line without a probability');
  await page.fill('.hfc .hf-pmsg', 'xyyx');
  writeFileSync(OUT + 'probs.csv', 'symbol,probability\nx,0.5\ny,0.5\n');
  await page.setInputFiles('.hfc .dfb-in', OUT + 'probs.csv'); await wait();
  check(await T('.hf-big') === '1 bits per symbol (entropy 1)' && (await T('.hf-abig')).startsWith('4 bits'), 'huffman: probabilities from a CSV file');
  await page.click('.hfc .hf-ex'); await wait();
  for (const [k, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    const { f, name } = await dl(`.dl [data-f=${k}]`, 'r.' + ext);
    check(name === `huffman-coding.${ext}` && readFileSync(f).length > 2000, `huffman: ${k} report download`);
  }
  await page.setViewportSize({ width: 375, height: 800 }); await page.click('.hfc .hf-mode [data-m=msg]'); await wait();
  await page.locator('.hfc').screenshot({ path: OUT + 'hf-375.png' }); await page.setViewportSize(vp0);
};
