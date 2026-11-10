// #1386 five-kingdom sorter (rules checked in tests/sci-tools/five-kingdoms.mjs)
export const path = '/learn/five-kingdoms/';
export default async ({ page, check, BASE }) => {
  const R = '.fkg ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/five-kingdoms/`); await page.waitForTimeout(400);
  const kingdomOf = { 'Gut bacterium (E. coli)': 'Monera', 'Cyanobacterium (Nostoc)': 'Monera', Amoeba: 'Protista', Paramecium: 'Protista', Euglena: 'Protista', Diatom: 'Protista', Yeast: 'Fungi', Mushroom: 'Fungi', 'Bread mould (Rhizopus)': 'Fungi', 'Green alga (Spirogyra)': 'Plantae', Moss: 'Plantae', Fern: 'Plantae', 'Mango tree': 'Plantae', 'Dodder (Cuscuta)': 'Plantae', Sponge: 'Animalia', Earthworm: 'Animalia', Housefly: 'Animalia', 'Rohu fish': 'Animalia' };
  let ok = true, drawn = true;
  for (let i = 0; i < 18; i++) {
    const name = await t('.fk-name'), k = kingdomOf[name];
    drawn &&= (await page.$$eval(R + '.fk-pic .fk-d > *', (e) => e.length)) > 0;
    const wrong = ['Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia'].find((x) => x !== k);
    await page.click(R + `.fk-kbtn button[data-k="${wrong}"]`);
    ok &&= (await t('.fk-res')).startsWith(`Not ${wrong}`);
    await page.click(R + `.fk-kbtn button[data-k="${k}"]`);
    ok &&= (await t('.fk-res')).startsWith(`Right: ${k}`);
    await page.click(R + '.fk-next');
  }
  check(ok, 'kingdoms: all 18 cards sorted, wrong then right');
  check(drawn, 'kingdoms: every card has a drawing');
  check((await t('.fk-score')) === '0 of 18 right first time', `kingdoms: score counts first tries (${await t('.fk-score')})`);
  check((await page.$$eval(R + '.fk-gi', (e) => e.length)) === 18, 'kingdoms: gallery of 18');
  await page.click(R + '.fk-mode button[data-m="build"]');
  check((await t('.fk-out')).startsWith('Plantae.') && (await t('.fk-match')).includes('Mango tree'), `kingdoms: build starts at a plant (${await t('.fk-out')})`);
  check((await page.$$eval(R + '.fk-tab .fk-hl', (e) => e.length)) === 6, 'kingdoms: table column highlighted');
  await page.click(R + '.fk-q[data-f="food"] button[data-v="hetero"]');
  check((await t('.fk-match')).includes('Dodder'), 'kingdoms: dodder');
  await page.click(R + '.fk-q[data-f="wall"] button[data-v="none"]');
  check((await t('.fk-out')).startsWith('Animalia.'), 'kingdoms: animal');
  await page.click(R + '.fk-q[data-f="food"] button[data-v="auto"]');
  check((await t('.fk-out')).startsWith('No kingdom fits.'), 'kingdoms: impossible mix');
  await page.click(R + '.fk-q[data-f="cell"] button[data-v="pro"]');
  check((await t('.fk-out')).startsWith('Monera.'), 'kingdoms: prokaryote');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'kingdoms: five quiz questions');
  await page.click(R + '.smq-q:nth-child(3) .smq-choices button:nth-child(1)'); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', 'kingdoms: quiz answer');
};
