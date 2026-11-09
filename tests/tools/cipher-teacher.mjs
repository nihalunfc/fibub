// #581 classical cipher and hash teaching tool. SHA-256 values from Python's hashlib and FIPS 180-2's "abc" example;
// ciphers from textbook examples (see tests/sci-tools/cipher-teacher.mjs).
export const path = '/science/cipher-teacher/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const T = async (c) => (await page.textContent(`.cpt ${c}`)).trim();
  const out = () => page.inputValue('.cpt .cp-res');
  const wait = () => page.waitForTimeout(400);
  const dl = async (sel, name) => { await page.locator(`.cpt ${sel}`).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cpt ${sel}`)]); const f = OUT + name; await d.saveAs(f); return { f, name: d.suggestedFilename() }; };

  // Caesar
  check(await out() === 'Phhw ph dw wkh rog rdn wuhh dw qrrq' && await T('.cp-oh') === 'Encrypted (shift 3)', 'cipher: Caesar shift 3 example');
  check((await T('.cp-work')).includes('CipherDEFGHIJKLMNOPQRSTUVWXYZABC'), 'cipher: Caesar letter mapping');
  { const f = await T('.cp-facts'); check(f.includes('Most common in the inputE, T, O') && f.includes('Most common in the outputH, W, R') && f.includes('Index of coincidence, input0.1026') && f.includes('Index of coincidence, output0.1026') && await page.isVisible('.cpt .cp-fig'), 'cipher: letter frequencies and index of coincidence'); }
  await page.click('.cpt .cp-swap'); await wait();
  check(await out() === 'Meet me at the old oak tree at noon' && await T('.cp-oh') === 'Decrypted (shift 3)', 'cipher: output back through decrypts');
  await page.fill('.cpt .cp-shift', '30'); await wait();
  check((await T('.cp-err')) === 'Use a shift from −25 to 25.', 'cipher: shift out of range');
  await page.fill('.cpt .cp-shift', '3'); await page.selectOption('.cpt .cp-dir', 'enc');
  // Vigenère
  await page.selectOption('.cpt .cp-ci', 'vigenere'); await page.fill('.cpt .cp-in', 'ATTACKATDAWN'); await wait();
  check(await out() === 'LXFOPVEFRNHR' && (await T('.cp-work')).includes('KeyLEMONLEMONLE'), 'cipher: Vigenère LEMON example with the keyword shown');
  await page.fill('.cpt .cp-key', '123'); await wait();
  check((await T('.cp-err')) === 'The keyword needs at least one letter A to Z.', 'cipher: keyword without letters');
  await page.fill('.cpt .cp-key', 'LEMON');
  // Affine
  await page.selectOption('.cpt .cp-ci', 'affine'); await page.fill('.cpt .cp-in', 'AFFINE CIPHER'); await wait();
  check(await out() === 'IHHWVC SWFRCP', 'cipher: affine a=5 b=8 example');
  await page.selectOption('.cpt .cp-dir', 'dec'); await page.fill('.cpt .cp-in', 'IHHWVC SWFRCP'); await wait();
  check(await out() === 'AFFINE CIPHER' && (await T('.cp-oh')).includes('a⁻¹ = 21'), 'cipher: affine decrypt with the inverse');
  await page.selectOption('.cpt .cp-dir', 'enc');
  // Atbash
  await page.selectOption('.cpt .cp-ci', 'atbash'); await page.fill('.cpt .cp-in', 'Wizard'); await wait();
  check(await out() === 'Draziw', 'cipher: Atbash keeps case');
  // Rail fence
  await page.selectOption('.cpt .cp-ci', 'rail'); await page.fill('.cpt .cp-in', 'WEAREDISCOVEREDFLEEATONCE'); await wait();
  check(await out() === 'WECRLTEERDSOEEFEAOCAIVDEN' && (await T('.cp-zig')).startsWith('W···E···C···R···L···T···E') && await page.isHidden('.cpt .cp-work'), 'cipher: rail fence 3 rails with the zigzag');
  await page.fill('.cpt .cp-rails', '1'); await wait();
  check((await T('.cp-err')) === 'Use 2 to 20 rails.', 'cipher: too few rails');
  await page.fill('.cpt .cp-rails', '3'); await page.fill('.cpt .cp-in', ''); await wait();
  check((await T('.cp-err')) === 'Type some text.' && await page.isHidden('.cpt [data-o=classic]'), 'cipher: empty text');
  await page.fill('.cpt .cp-in', 'Meet me at the old oak tree at noon'); await page.selectOption('.cpt .cp-ci', 'caesar'); await wait();
  for (const [k, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    const { f, name } = await dl(`.dl [data-f=${k}]`, 'c.' + ext);
    check(name === `cipher.${ext}` && readFileSync(f).length > 1500, `cipher: ${k} download of the cipher working`);
  }

  // SHA-256
  await page.click('.cpt .cp-mode [data-m=sha]'); await page.waitForTimeout(700);
  check(await T('.cp-hash') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' && (await T('.cp-sfacts')).includes("Browser's own SHA-256agrees"), 'sha256: abc, and the browser agrees');
  check((await T('.cp-pad')).includes('61 62 63 80 00') && (await T('.cp-pad')).endsWith('00 18'), 'sha256: padding with 0x80 and the length 24');
  check((await T('.cp-wt')).includes('061626380') && (await T('.cp-wt')).includes('σ₁(W14) + W9 + σ₀(W1) + W0'), 'sha256: message schedule');
  check((await T('.cp-rt')).includes('0428a2f98616263805d6aebcd6a09e667bb67ae853c6ef372fa2a4622'), 'sha256: round 0 = FIPS 180-2');
  check((await T('.cp-fin')).includes('H06a09e667506e3058ba7816bf'), 'sha256: final addition from round 63');
  check((await T('.cp-aval')) === '128 of 256 hash bits changed (50.0 %)' && (await T('.cp-flipped')).endsWith('e1 62 63'), 'sha256: avalanche of bit 0');
  await page.fill('.cpt .cp-bit', '23'); await wait();
  check((await T('.cp-hash2')).startsWith('715edf8ba8729420') && (await T('.cp-aval')).startsWith('124 of 256') && (await T('.cp-flipped')).endsWith('"abb"'), 'sha256: abc to abb changes 124 bits (hashlib)');
  await page.fill('.cpt .cp-bit', '24'); await wait();
  check((await T('.cp-flipped')) === 'Choose a bit from 0 to 23.', 'sha256: bit out of range');
  { const { f } = await dl('.cp-rcsv', 'rounds.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 66 && r[2].startsWith('0,428a2f98,61626380,5d6aebcd') && r[65].startsWith('63,'), 'sha256: rounds CSV'); }
  await page.fill('.cpt .cp-bit', '0');
  await page.fill('.cpt .cp-smsg', 'x'.repeat(1000)); await page.waitForTimeout(700);
  check(await T('.cp-hash') === '44f8354494a5ba03ba1792a8d3e9c534c47a9181980fde7a3f44b06ef2ae7c7f' && (await T('.cp-sfacts')).includes('Blocks of 512 bits16') && await page.isVisible('.cpt .cp-blk'), 'sha256: 1000-byte message, 16 blocks');
  await page.selectOption('.cpt .cp-blk', '7'); await wait();
  check((await T('.cp-rt')).includes('76c673e2b863be957f402b52aaeec287') && (await T('.cp-wt')).includes('bytes 448–451'), 'sha256: block 8 traced (Python reference round 63)');
  await page.fill('.cpt .cp-smsg', ''); await wait();
  check(await T('.cp-hash') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' && (await T('.cp-flipped')).startsWith('The message is empty'), 'sha256: empty message');
  await page.selectOption('.cpt .cp-sin', 'hex'); await page.fill('.cpt .cp-smsg', '61 62 63'); await wait();
  check((await T('.cp-hash')).startsWith('ba7816bf'), 'sha256: hex input');
  await page.fill('.cpt .cp-smsg', '6g'); await wait();
  check((await T('.cp-err')).includes('"6g" is not a hex byte'), 'sha256: bad hex');
  await page.fill('.cpt .cp-smsg', '61 62 63'); await wait();
  { const { f, name } = await dl('.dl [data-f=pdf]', 's.pdf'); check(name === 'sha256.pdf' && readFileSync(f).length > 1500, 'sha256: PDF download'); }
  await page.setViewportSize({ width: 375, height: 800 }); await page.click('.cpt .cp-mode [data-m=classic]'); await wait();
  await page.locator('.cpt').screenshot({ path: OUT + 'cp-375.png' }); await page.setViewportSize(vp0);
};
