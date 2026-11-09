// #544 number theory toolkit
export const path = '/science/number-theory-toolkit/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.ntk ';
  const facts = async () => Object.fromEntries(await page.$$eval(P + '.ntk-facts div', (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  const big = () => page.textContent(P + '.ntk-big');
  const mode = async (m) => { await page.locator(`${P}.ntk-modes button[data-m="${m}"]`).scrollIntoViewIfNeeded(); await page.click(`${P}.ntk-modes button[data-m="${m}"]`); await page.waitForTimeout(150); };
  const type = async (sel, val) => { await page.fill(P + sel, val); await page.waitForTimeout(450); };
  const csv = async (name) => { await page.locator(P + '.ntk-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.ntk-csv')]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };

  await page.goto(`${BASE}/science/number-theory-toolkit/`); await page.waitForTimeout(600);
  check((await big()) === '4294967297 = 641 × 6700417', 'number theory: example, Fermat F5 = 641 × 6700417');
  { const f = await facts(); check(f['Euler phi φ(n)'] === '4288266240' && f['Carmichael λ(n)'] === '33502080' && f['Sum of divisors σ(n)'] === '4301668356' && f['Number of divisors τ(n)'] === '4' && f['Next prime'] === '4294967311' && f['Previous prime'] === '4294967291' && f['Möbius μ(n)'] === '1', 'number theory: phi, lambda, sigma, tau, mu, next and previous prime'); }
  { const rows = await csv('nt-div.csv'); check(rows.length === 5 && rows[0] === '#,Divisor,Paired with n ÷ d' && rows[2] === '2,641,6700417', 'number theory: divisors CSV'); }
  await type('.ntk-n', '2^127 - 1');
  { const f = await facts(); check((await big()).endsWith('is probably prime') && f['Prime?'].startsWith('Probably') && f['Method'].includes('Baillie-PSW'), 'number theory: Mersenne prime 2^127 − 1, probable prime above 3.3e24'); }
  await type('.ntk-n', '2^61 - 1');
  check((await big()) === '2305843009213693951 is prime' && (await facts())['Method'].includes('proof'), 'number theory: 2^61 − 1 proven prime');
  await type('.ntk-n', '561');
  check((await big()) === '561 = 3 × 11 × 17' && (await facts())['Kind'].startsWith('Deficient'), 'number theory: Carmichael number 561 factored');
  await type('.ntk-n', '28');
  check((await facts())['Kind'].startsWith('Perfect'), 'number theory: 28 is perfect');
  await type('.ntk-n', '1000000007 * 1000000009 * 2^5');
  check((await big()) === '32000000512000002016 = 2^5 × 1000000007 × 1000000009', 'number theory: Pollard rho splits two 10-digit primes');
  await type('.ntk-n', '-360');
  check((await big()) === '−360 = −1 × 2^3 × 3^2 × 5' && (await facts())['Note'].includes('Negative'), 'number theory: negative number');
  await type('.ntk-n', '7/2');
  check((await page.textContent(P + '.ntk-err')).includes('whole number') && await page.isHidden(P + '.ntk-out'), 'number theory: bad input message');

  await mode('g');
  check((await big()) === 'gcd = 2, lcm = 5520', 'number theory: gcd and lcm of 240, 46');
  check((await facts())['Bézout'] === '240 × (−9) + 46 × 47 = 2', 'number theory: Bézout identity');
  { const rows = await csv('nt-euclid.csv'); check(rows.length === 8 && rows[0] === 'Step,Quotient q,Remainder r,s,t' && rows[6] === '5,1,2,-9,47', 'number theory: extended Euclid CSV'); }
  await type('.ntk-g', '12, 18, 30\n2^3');
  check((await big()) === 'gcd = 2, lcm = 360' && await page.isHidden(P + '.ntk-tw'), 'number theory: gcd and lcm of a list');

  await mode('m');
  { const f = await facts(); check((await big()) === '7^560 ≡ 1 (mod 561)' && f['Inverse of a'] === '481' && f['Order of a'] === '80' && f['Solve 7·x ≡ 3 (mod 561)'] === 'x ≡ 321 (mod 561)', 'number theory: modular power, inverse, order and congruence'); }
  await type('.ntk-a', '6'); await type('.ntk-m', '10'); await type('.ntk-b', '4'); await type('.ntk-e', '-1');
  { const f = await facts(); check(f['Inverse of a'].startsWith('none') && f['Solve 6·x ≡ 4 (mod 10)'] === 'x ≡ 4 (mod 5): 2 solutions below 10' && f['a^e mod m'].startsWith('none'), 'number theory: no inverse, two solutions'); }
  await type('.ntk-a', '3'); await type('.ntk-m', '7'); await type('.ntk-e', '');
  check((await big()) === '3⁻¹ ≡ 5 (mod 7)' && (await facts())['Primitive root?'] === 'Yes', 'number theory: inverse and primitive root');
  await type('.ntk-m', '0');
  check((await page.textContent(P + '.ntk-err')).includes('modulus'), 'number theory: modulus 0 message');

  await mode('c');
  check((await big()) === 'x ≡ 23 (mod 105)', 'number theory: CRT, Sunzi example');
  { const rows = await csv('nt-crt.csv'); check(rows.length === 4 && rows[1] === '1,2,3,2,yes', 'number theory: CRT check CSV'); }
  await type('.ntk-c', 'x = 3 mod 6\nx ≡ 5 (mod 10)');
  check((await big()) === 'x ≡ 15 (mod 30)' && (await facts())['Moduli coprime?'].startsWith('No'), 'number theory: CRT with moduli not coprime');
  await type('.ntk-c', '1, 4\n2, 6');
  check((await big()).startsWith('No solution') && (await facts())['Clash'].includes('lines 1 and 2'), 'number theory: CRT contradiction');
  await type('.ntk-c', '1 4');
  check((await page.textContent(P + '.ntk-err')).includes('Could not read'), 'number theory: CRT bad line');

  await mode('f');
  check((await big()).startsWith('π = [3; 7, 15, 1, 292, 1, 1, 1, 2, 1, 3,') && (await page.textContent(P + '.ntk-tab')).includes('355/113'), 'number theory: continued fraction of π');
  await page.click(P + '.ntk-try[data-v="sqrt(61)"]'); await page.waitForTimeout(200);
  { const f = await facts(); check(f['Periodic form'] === '[7; (1, 4, 3, 1, 2, 2, 1, 3, 4, 1, 14)]' && f['Pell equation x² − 61y² = 1'] === 'x = 1766319049, y = 226153980', 'number theory: √61 period and Pell equation'); }
  await page.click(P + '.ntk-try[data-v="415/93"]'); await page.waitForTimeout(200);
  { const rows = await csv('nt-cf.csv'); check((await big()) === '415/93 = [4; 2, 6, 7]' && rows.length === 5 && rows[4] === '3,7,415/93,4.46236559139784946236', 'number theory: fraction 415/93 and convergents CSV'); }
  await page.click(P + '.ntk-try[data-v="e"]'); await page.waitForTimeout(200);
  check((await big()).startsWith('e = [2; 1, 2, 1, 1, 4, 1, 1, 6,'), 'number theory: continued fraction of e');
  await type('.ntk-f', '0.75');
  check((await big()) === '0.75 = [0; 1, 3]', 'number theory: exact decimal');
  await type('.ntk-f', 'banana');
  check((await page.textContent(P + '.ntk-err')).includes('not a decimal'), 'number theory: bad continued fraction input');
  await type('.ntk-f', '355/113');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'number theory: image download'); }
};
