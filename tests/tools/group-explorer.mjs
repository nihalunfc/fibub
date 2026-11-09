// #545 group theory explorer
export const path = '/science/group-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.gex ';
  const facts = async (sel = '.gex-facts') => Object.fromEntries(await page.$$eval(P + sel + ' div', (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  const csv = async (btn, name) => { await page.locator(P + btn).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + btn)]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  const pick = async (v, n) => { await page.selectOption(P + '.gex-k', v); if (n !== undefined) { await page.fill(P + '.gex-n', String(n)); await page.waitForTimeout(500); } await page.waitForTimeout(200); };

  await page.goto(`${BASE}/science/group-explorer/`); await page.waitForTimeout(700);
  check((await page.textContent(P + '.gex-big')) === 'D4: order 8, not abelian', 'groups: example D4');
  { const f = await facts(); check(f['Centre Z(G)'] === '{e, r^2}' && f['Subgroups'] === '10' && f['Normal subgroups'] === '6' && f['Exponent'] === '4' && f['Conjugacy classes'] === '5, sizes 1, 2, 1, 2, 2' && f['Element orders'] === '1 of order 1, 5 of order 2, 2 of order 4', 'groups: D4 centre, subgroups, classes, orders'); }
  check(await page.isVisible(P + '.gex-cay') && await page.isVisible(P + '.gex-lat'), 'groups: Cayley table and lattice drawn');
  { const rows = await csv('.gex-csv', 'cay.csv'); check(rows.length === 9 && rows[0] === '×,e,r,r^2,r^3,s,rs,r^2s,r^3s' && rows[5].startsWith('s,s,r^3s,r^2s,rs,e'), 'groups: Cayley table CSV (s·r = r^3s)'); }
  { const t = await page.textContent(P + '.gex-el'); check(t.includes('r^3') && (await page.$$(P + '.gex-el tbody tr')).length === 8, 'groups: element table'); }
  { const f = await facts('.gex-cf'); const c = await page.textContent(P + '.gex-cos'); check(f['Normal?'].startsWith('No') && f['Index [G : H]'].startsWith('4') && c.includes('rH = {r, rs}') && c.includes('Hr = {r, r^3s}'), 'groups: cosets of ⟨s⟩, not normal'); }
  await page.selectOption(P + '.gex-h-sel', '6'); await page.waitForTimeout(200);
  { const f = await facts('.gex-cf'); check(f['Normal?'].startsWith('Yes') && f['Quotient G/H'] === 'G/H has order 2, cyclic' && await page.isVisible(P + '.gex-same'), 'groups: ⟨r⟩ normal, quotient of order 2'); }
  { const rows = await csv('.gex-scsv', 'subs.csv'); check(rows.length === 11 && rows[0] === '#,order,index,generators,normal,elements' && rows[10] === '10,8,1,r s,yes,e r r^2 r^3 s rs r^2s r^3s', 'groups: subgroups CSV'); }

  await pick('S4');
  { const f = await facts(); check(f['Subgroups'] === '30' && f['Normal subgroups'] === '4' && f['Conjugacy classes'].startsWith('5,'), 'groups: S4 has 30 subgroups, 4 normal'); }
  await pick('A5');
  { const f = await facts(); check(f['Subgroups'] === '59' && f['Normal subgroups'].includes('simple'), 'groups: A5 is simple, 59 subgroups'); }
  await pick('A4');
  { const f = await facts(); check(f['Subgroups'] === '10' && f['Commutator subgroup'].startsWith('order 4'), 'groups: A4'); }
  await pick('Q');
  { const f = await facts(); check(f['Normal subgroups'] === '6' && f['Subgroups'] === '6' && f['Abelian?'] === 'No' && f['Centre Z(G)'] === '{1, −1}', 'groups: Q8, every subgroup normal'); }
  await pick('V');
  check((await page.textContent(P + '.gex-big')) === 'V4: order 4, abelian', 'groups: Klein four-group');
  await pick('S3');
  check((await facts())['Subgroups'] === '6', 'groups: S3');
  await pick('Z', 12);
  check((await page.textContent(P + '.gex-big')) === 'Z12: order 12, cyclic' && (await facts())['Subgroups'] === '6', 'groups: Z12 has 6 subgroups');
  await pick('U', 24);
  { const f = await facts(); check((await page.textContent(P + '.gex-big')) === 'Z24^×: order 8, abelian' && f['Subgroups'] === '16' && f['Exponent'] === '2', 'groups: Z24^× = Z2^3, 16 subgroups'); }
  await pick('D', 12);
  check((await facts())['Subgroups'] === '34', 'groups: D12 has 34 subgroups');
  await page.fill(P + '.gex-n', '40'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.gex-err')).includes('2 to 32') && await page.isHidden(P + '.gex-out'), 'groups: n too large message');
  await page.fill(P + '.gex-n', '5'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'groups: PDF download'); }
};
