// #580 error-correcting codes playground. Reed-Solomon codeword checked against reedsolo (RSCodec(4).encode(b'Hello, fibub!')),
// CRC check values against crcmod; Hamming against the textbook example 1011 -> 0110011.
export const path = '/science/error-correcting-codes/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const T = async (c) => (await page.textContent(`.ecx ${c}`)).trim();
  const wait = () => page.waitForTimeout(350);
  const bits = (row) => page.$$eval(`.ecx ${row} b`, (bs) => bs.map((b) => b.textContent).join(''));
  const flip = async (i) => { await page.locator(`.ecx .ec-recv button[data-i="${i}"]`).scrollIntoViewIfNeeded(); await page.click(`.ecx .ec-recv button[data-i="${i}"]`); await page.waitForTimeout(100); };
  const dl = async (sel, name) => { await page.locator(`.ecx ${sel}`).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.ecx ${sel}`)]); const f = OUT + name; await d.saveAs(f); return { f, name: d.suggestedFilename() }; };
  const mode = async (m) => { await page.click(`.ecx .ec-mode [data-m=${m}]`); await wait(); };

  // Hamming (7,4), starts with bit 5 flipped
  check(await bits('.ec-sent') === '0110011' && await bits('.ec-recv') === '0110111', 'ecc: 1011 sent as 0110011, bit 5 flipped');
  check(await T('.ec-bbig') === 'Error at position 5 (d2): corrected' && (await T('.ec-bfacts')).includes('Syndrome101 = 5') && (await T('.ec-bfacts')).includes('Decoded data1011'), 'ecc: syndrome 5 corrects the error');
  check((await T('.ec-btab')).includes('p11, 3, 5, 71 (fails)') && (await T('.ec-btab')).includes('p22, 3, 6, 70 (passes)'), 'ecc: parity check table');
  check(await page.$eval('.ecx .ec-recv button[data-i="4"]', (b) => b.classList.contains('fix')), 'ecc: corrected bit marked');
  await flip(1);
  check((await T('.ec-bbig')).startsWith('Decoder flipped position 7 (d4), but the data is now wrong'), 'ecc: plain Hamming miscorrects two errors');
  await page.click('.ecx .ec-bclear'); await wait();
  check(await T('.ec-bbig') === 'Syndrome 0: no error', 'ecc: clear errors');
  // SECDED (8,4)
  await page.selectOption('.ecx .ec-code', 'h8'); await wait();
  check(await bits('.ec-sent') === '00110011', 'ecc: (8,4) adds p0');
  await flip(5);
  check(await T('.ec-bbig') === 'Error at position 5 (d2): corrected' && (await T('.ec-bfacts')).includes('Overall parityfails'), 'ecc: SECDED corrects one');
  await flip(2);
  check(await T('.ec-bbig') === 'Two errors detected: cannot correct, ask again', 'ecc: SECDED detects two');
  await page.click('.ecx .ec-bclear'); await wait(); await flip(0);
  check(await T('.ec-bbig') === 'Error in p0 only: corrected', 'ecc: error in the overall parity bit');
  // (15,11) and (16,11)
  await page.selectOption('.ecx .ec-code', 'h15'); await wait();
  check((await bits('.ec-sent')).length === 15 && await page.inputValue('.ecx .ec-data') === '10110011101', 'ecc: (15,11) with 11 data bits');
  await flip(9);
  check(await T('.ec-bbig') === 'Error at position 10 (d6): corrected' && (await T('.ec-bfacts')).includes('Syndrome1010 = 10'), 'ecc: (15,11) corrects position 10');
  await page.selectOption('.ecx .ec-code', 'h16'); await wait(); await flip(3); await flip(12);
  check(await T('.ec-bbig') === 'Two errors detected: cannot correct, ask again', 'ecc: (16,11) SECDED detects two');
  await page.fill('.ecx .ec-data', '101'); await wait();
  check((await T('.ec-err')) === 'Hamming (16,11) SECDED takes exactly 11 data bits; you typed 3.' && await page.isHidden('.ecx .ec-bo'), 'ecc: wrong number of data bits');
  await page.fill('.ecx .ec-data', '10a1'); await wait();
  check((await T('.ec-err')) === 'Use only 0s and 1s.', 'ecc: non-binary data');
  // Parity
  await page.selectOption('.ecx .ec-code', 'parity'); await wait();
  check(await bits('.ec-sent') === '10110010' && await T('.ec-bbig') === 'Check passes: no error seen', 'ecc: even parity bit');
  await flip(2);
  check(await T('.ec-bbig') === 'Check fails: error detected (1 flipped)', 'ecc: parity detects one error');
  await flip(6);
  check(await T('.ec-bbig') === 'Check passes, but 2 bits are wrong: undetected', 'ecc: parity misses two errors');
  await page.selectOption('.ecx .ec-odd', '1'); await wait();
  check((await bits('.ec-sent')).endsWith('1'), 'ecc: odd parity');

  // CRC
  await mode('crc');
  check(await T('.ec-cbig') === 'CRC-32 (zip, PNG, Ethernet) = 0xCBF43926', 'ecc: CRC-32 check value');
  await page.selectOption('.ecx .ec-crc', '3'); await wait();
  check(await T('.ec-cbig') === 'CRC-16/CCITT-FALSE = 0x29B1', 'ecc: CRC-16/CCITT-FALSE');
  await page.selectOption('.ecx .ec-crc', '0'); await page.selectOption('.ecx .ec-cin', 'hex'); await page.fill('.ecx .ec-cmsg', '31 32 33 34 35 36 37 38 39'); await wait();
  check(await T('.ec-cbig') === 'CRC-8 (SMBus) = 0xF4', 'ecc: CRC-8 of hex bytes');
  await page.fill('.ecx .ec-cmsg', '3g'); await wait();
  check((await T('.ec-err')).includes('"3g" is not a hex byte'), 'ecc: bad hex message');
  await page.selectOption('.ecx .ec-cin', 'text'); await page.fill('.ecx .ec-cmsg', 'hello world'); await page.selectOption('.ecx .ec-crc', '6'); await wait();
  check(await T('.ec-cbig') === 'CRC-32 (zip, PNG, Ethernet) = 0x0D4A1185', 'ecc: CRC-32 of hello world (zlib)');
  check((await T('.ec-div')).endsWith('remainder 100') && (await T('.ec-dnote')).includes('Codeword: 11010011101100100') && await T('.ec-drxout') === 'Remainder 000: the bits pass the check.', 'ecc: long division and passing check');
  await page.fill('.ecx .ec-drx', '11010011101100101'); await wait();
  check(await T('.ec-drxout') === 'Remainder 001: error detected.', 'ecc: damaged codeword detected');
  await page.fill('.ecx .ec-dgen', '0110'); await wait();
  check((await T('.ec-div')).startsWith('The generator must'), 'ecc: bad generator message');
  await page.fill('.ecx .ec-dgen', '1011'); await wait();
  check(await T('.ec-drxout') === 'Remainder 000: the bits pass the check.', 'ecc: received box follows a new division');

  // Reed-Solomon
  await mode('rs');
  check(await T('.ec-rcells') === '48656c6c6f2c206669627562219b068800' && await T('.ec-rbig') === 'All syndromes are zero: no errors', 'ecc: RS(17,13) codeword equals reedsolo');
  for (const i of [2, 15]) { await page.locator(`.ecx .ec-rcells button[data-i="${i}"]`).scrollIntoViewIfNeeded(); await page.click(`.ecx .ec-rcells button[data-i="${i}"]`); await page.waitForTimeout(100); }
  { const f = await T('.ec-rfacts'); check(await T('.ec-rbig') === '2 errors found and corrected' && f.includes('Error positions (byte numbers)2, 15') && f.includes('Error values (XOR)5a 5a') && f.includes('Decoded messageHello, fibub!') && f.includes('Syndromes S₀…00 93 56 85'), 'ecc: two damaged bytes found and corrected'); }
  check((await page.$$('.ecx .ec-bm tr')).length === 5, 'ecc: Berlekamp-Massey steps');
  { const { f } = await dl('.ec-rcsv', 'rs.csv'); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 18 && r[3] === '2,message,6c,36,6c' && r[16] === '15,check,88,d2,88', 'ecc: Reed-Solomon bytes CSV'); }
  await page.click('.ecx .ec-rcells button[data-i="7"]'); await wait();
  check(/^(Too many errors|Decoded to a different codeword)/.test(await T('.ec-rbig')), `ecc: three errors with 4 check bytes not corrected (${await T('.ec-rbig')})`);
  await page.click('.ecx .ec-rclear'); await wait();
  await page.click('.ecx .ec-rrand'); await page.waitForTimeout(150); await page.click('.ecx .ec-rrand'); await wait();
  check(await T('.ec-rbig') === '2 errors found and corrected' && (await page.$$('.ecx .ec-rcells button.bad')).length === 2, 'ecc: two random errors corrected');
  await page.selectOption('.ecx .ec-nsym', '10'); await wait();
  check((await T('.ec-rsize')).startsWith('RS(23, 13)') && (await page.$$('.ecx .ec-rcells button.bad')).length === 0, 'ecc: 10 check bytes');
  await page.selectOption('.ecx .ec-rin', 'hex'); await page.fill('.ecx .ec-rmsg', '68 65 6c 6c 6f 20 77 6f 72 6c 64'); await wait();
  check(await T('.ec-rcells') === '68656c6c6f20776f726c64ed2554c4fdfd89f3a8aa', 'ecc: RS(10) of hello world as hex equals reedsolo');
  await page.fill('.ecx .ec-rmsg', ''); await wait();
  check((await T('.ec-err')) === 'Type a message to encode.', 'ecc: empty message');
  await page.selectOption('.ecx .ec-rin', 'text'); await page.fill('.ecx .ec-rmsg', 'Hello, fibub!'); await wait();
  for (const [k, ext] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    const { f, name } = await dl(`.dl [data-f=${k}]`, 'r.' + ext);
    check(name === `error-correcting-codes.${ext}` && readFileSync(f).length > 1500, `ecc: ${k} report download`);
  }
  await page.setViewportSize({ width: 375, height: 800 }); await mode('block'); await page.locator('.ecx').screenshot({ path: OUT + 'ec-375.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
