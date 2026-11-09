// #816 metadata builder
export const path = '/science/metadata-builder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/metadata-builder/`); await page.waitForTimeout(500);
  const R = '.mdb ';
  check((await page.textContent(R + '.md-big')) === 'Valid: all checks pass' && (await page.textContent(R + '.md-out')).includes('<identifier identifierType="DOI">10.5555/example.2026</identifier>'), 'md: DataCite example valid, XML shown');
  await page.fill(R + '.md-in[data-id=creators]', 'Rivera, Ana; 0000-0002-1825-0098; Example River Institute'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')) === '1 problem to fix' && (await page.textContent(R + '.md-issues')).includes('"0000-0002-1825-0098" is not a valid ORCID iD'), 'md: ORCID check digit');
  await page.fill(R + '.md-in[data-id=geoLat]', '95'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')) === '2 problems to fix' && await page.isVisible(R + '.md-f[data-id=geoLat] .md-msg'), 'md: latitude range, message under the field');
  await page.click(R + '.md-issues a:has-text("latitude must be")'); await page.waitForTimeout(100);
  check(await page.evaluate(() => document.activeElement?.dataset.id) === 'geoLat', 'md: tapping a message jumps to the field');
  await page.fill(R + '.md-in[data-id=geoLat]', '45.42'); await page.fill(R + '.md-in[data-id=creators]', 'Rivera, Ana; 0000-0002-1825-0097'); await page.fill(R + '.md-in[data-id=doi]', 'doi 10.5555'); await page.fill(R + '.md-in[data-id=dates]', 'Collected: 2026-02-30'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.md-issues'); check(t.includes('a DOI looks like') && t.includes('"2026-02-30" is not an ISO 8601'), 'md: DOI and date errors'); }
  await page.click(R + '.md-ex'); await page.waitForTimeout(100);
  await page.click(R + '.md-fmt button[data-f=json]'); await page.waitForTimeout(100);
  { const j = JSON.parse(await page.textContent(R + '.md-out')); check(j.creators[0].nameIdentifiers[0].nameIdentifier === 'https://orcid.org/0000-0002-1825-0097' && j.types.resourceTypeGeneral === 'Dataset', 'md: DataCite JSON'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.md-dl')]); const f = OUT + 'dc.json'; await d.saveAs(f); check(d.suggestedFilename() === 'datacite-metadata.json' && JSON.parse(readFileSync(f, 'utf8')).publisher.name === 'Example Data Repository', 'md: JSON download'); }
  await page.selectOption(R + '.md-in[data-id=rights]', 'CC0-1.0'); await page.click(R + '.md-fmt button[data-f=xml]'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-out')).includes('rightsIdentifier="CC0-1.0"'), 'md: licence chooser in the XML');
  // Dublin Core.
  await page.click(R + '.md-std button[data-s=dc]'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')).startsWith('4 problems') && (await page.textContent(R + '.md-ref')).includes('DCMI Metadata Element Set'), 'md: Dublin Core empty form asks for four');
  await page.click(R + '.md-ex'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')) === 'Valid: all checks pass' && (await page.textContent(R + '.md-out')).includes('<dc:creator>Okafor, Chidi</dc:creator>'), 'md: Dublin Core example and oai_dc XML');
  await page.click(R + '.md-fmt button[data-f=csv]'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.md-dl')]); const f = OUT + 'dc.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('term,value') && t.includes('dc:date,2026-03-01/2026-05-31') && d.suggestedFilename() === 'dublin-core-metadata.csv', 'md: Dublin Core CSV'); }
  // Darwin Core.
  await page.click(R + '.md-std button[data-s=dwc]'); await page.click(R + '.md-ex'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')) === 'Valid: all checks pass' && (await page.textContent(R + '.md-out')).startsWith('occurrenceID,basisOfRecord,scientificName'), 'md: Darwin Core example as an occurrence-core CSV');
  await page.fill(R + '.md-in[data-id=countryCode]', 'Canada'); await page.fill(R + '.md-in[data-id=decimalLongitude]', ''); await page.fill(R + '.md-in[data-id=geodeticDatum]', ''); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.md-issues'); check(t.includes('two capital letters') && t.includes('need both decimalLatitude and decimalLongitude'), 'md: countryCode and lone latitude'); }
  await page.click(R + '.md-fmt button[data-f=xml]'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-out')).includes('<dwc:scientificName>Turdus migratorius Linnaeus, 1766</dwc:scientificName>'), 'md: Simple Darwin Core XML');
  // Switching back keeps the DataCite values.
  await page.click(R + '.md-std button[data-s=datacite]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.md-in[data-id=rights]')) === 'CC0-1.0', 'md: each form keeps its values');
  await page.click(R + '.md-clear'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.md-big')).startsWith('6 problems'), 'md: clear');
};
