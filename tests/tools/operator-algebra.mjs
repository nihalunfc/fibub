// #929 operator algebra helper
export const path = '/science/operator-algebra/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/operator-algebra/`); await page.waitForTimeout(1000);
  const big = () => page.textContent('.opa .oa-big'), facts = () => page.textContent('.opa .oa-facts');
  const set = async (e, c) => { await page.fill('.opa .oa-e', e); if (c !== undefined) await page.fill('.opa .oa-c', c); await page.waitForTimeout(500); };
  check((await big()) === '[Jx, Jy] = i Jz', 'ops: [Jx, Jy] = i Jz example');
  { const f = await facts(); check(f.includes('anti-Hermitian') && f.includes('−0.5i, 0.5i') && f.includes('equal to i*Jz'), 'ops: example kind, eigenvalues and check'); }
  check((await page.textContent('.opa .oa-tab')).includes('m=1/2') && (await page.textContent('.opa .oa-tab')).includes('0.5i'), 'ops: matrix with basis labels');
  await page.click('.opa .oa-quick button:has-text("{X, Y}")'); await page.waitForTimeout(300);
  check((await big()) === '{X, Y} = 0', 'ops: Pauli anticommutator');
  await set('H X H', 'Z'); check((await big()) === 'H X H = Z' && (await facts()).includes('unitary') && (await facts()).includes('equal to Z'), 'ops: HXH = Z');
  await page.selectOption('.opa .oa-sp', 's1.5'); await page.waitForTimeout(300); await set('J2', '');
  check((await big()) === 'J2 = 3.75 I' && (await facts()).includes('3.75 (×4)'), 'ops: J² = 15/4 for spin 3/2');
  await set('Jx + i*Jz^2'); check((await facts()).includes('−1.20711 + 0.542893i') && (await big()).includes('a 4 × 4 matrix'), 'ops: general eigenvalues (NumPy)');
  await page.selectOption('.opa .oa-sp', 'two'); await page.waitForTimeout(300);
  await set('S2', ''); check((await facts()).includes('0, 2 (×3)') && (await page.textContent('.opa .oa-tab')).includes('↑↓'), 'ops: singlet and triplet');
  await page.click('.opa .oa-quick button:has-text("SWAP")'); await page.waitForTimeout(300);
  check((await facts()).includes('equal to (I + X1 X2 + Y1 Y2 + Z1 Z2)/2'), 'ops: SWAP identity');
  await page.selectOption('.opa .oa-sp', 'osc'); await page.waitForTimeout(400);
  check((await big()) === '[a, ad]: a 6 × 6 matrix' && (await facts()).includes('not equal to I'), 'ops: truncated [a, a†] is not quite I');
  await set('[x, p]', 'i'); check((await page.textContent('.opa .oa-tab')).includes('−5i') && (await facts()).includes('not equal'), 'ops: truncated [x, p]');
  await set('ad*a', 'n'); check((await big()) === 'ad*a = n' && (await facts()).includes('0, 1, 2, 3, 4, 5'), 'ops: number operator');
  await page.fill('.opa .oa-n', '30'); await page.waitForTimeout(500);
  check((await page.textContent('.opa .oa-note')).includes('first 16 rows'), 'ops: big matrix note');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.opa .oa-csv')]); const f = OUT + 'op.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 31 && r[0].startsWith(',n=0,n=1'), 'ops: matrix CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.opa .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'ops: PDF report'); }
  await set('tr(n)', ''); check((await big()) === 'tr(n) = 435', 'ops: scalar result');
  await page.fill('.opa .oa-n', '100'); await page.waitForTimeout(500);
  check((await page.textContent('.opa .oa-err')).includes('between 2 and 40'), 'ops: N message');
  await page.fill('.opa .oa-n', '6'); await set('[a, Q]'); check((await page.textContent('.opa .oa-err')).includes('"Q" is not an operator') && await page.isHidden('.opa .oa-out'), 'ops: unknown operator message');
  await set('[a, ad'); check((await page.textContent('.opa .oa-err')).includes('Expected "]"'), 'ops: unclosed bracket message');
  await set('a / ad'); check((await page.textContent('.opa .oa-err')).includes('divide'), 'ops: division message');
};
