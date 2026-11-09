// #815 science file converter
import zlib from 'node:zlib';
export const path = '/science/science-file-converter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/science-file-converter/`); await page.waitForTimeout(600);
  const R = '.sfc ';
  check((await page.textContent(R + '.sf-facts')).includes('NetCDF classic (CDF-1)') && (await page.textContent(R + '.sf-facts')).includes('5 variables'), 'sfc: example opens as NetCDF classic with 5 variables');
  check((await page.textContent(R + '.sf-dims')).includes('3 (unlimited, records)') && (await page.textContent(R + '.sf-globals')).includes('CF-1.8'), 'sfc: dimensions and global attributes');
  check((await page.inputValue(R + '.sf-item')) === '3' && (await page.textContent(R + '.sf-prevnote')).includes('60 rows and 4 columns'), 'sfc: temperature picked, 60 rows');
  { const rows = await page.$$eval(R + '.sf-prev tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent).join(',')));
    check(rows[1] === '0,40,-77.5,20.75' && rows[7] === '0,42.5,-75,', `sfc: unpacked value and blank fill (${rows[1]} | ${rows[7]})`); }
  await page.uncheck(R + '.sf-scale'); await page.waitForTimeout(100);
  { const rows = await page.$$eval(R + '.sf-prev tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent).join(',')));
    check(rows[1] === '0,40,-77.5,575' && rows[7] === '0,42.5,-75,-32767', 'sfc: raw stored values'); }
  await page.check(R + '.sf-scale');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-csv')]); const f = OUT + 'sfc.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split(/\r?\n/);
    check(t.length === 61 && t[0] === 'time,lat,lon,temperature' && t[2] === '0,40,-77.5,20.75' && d.suggestedFilename() === 'example-temperature-temperature.csv', 'sfc: CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-json')]); const f = OUT + 'sfc.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8'));
    check(j.shape.join() === '3,4,5' && j.data[0][1][2] === null && j.data[2][3][4] === 20 && j.attributes.units === 'degC', 'sfc: JSON download keeps the shape'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-djson')]); const f = OUT + 'sfcd.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8'));
    check(j.items.length === 5 && j.dimensions[0].unlimited === true && j.attributes.Conventions === 'CF-1.8', 'sfc: description download'); }
  // Grid layout is offered only for two dimensions.
  check(await page.isDisabled(R + '.sf-layout'), 'sfc: grid disabled for 3-D variable');
  await page.selectOption(R + '.sf-item', '1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.sf-prevnote')).includes('4 rows'), 'sfc: coordinate variable lat');
  // A FITS file with an image and a binary table, built here byte by byte.
  const card = (s) => s.padEnd(80); const hdr = (cs) => { let h = cs.map(card).join('') + card('END'); while (h.length % 2880) h += ' '; return Buffer.from(h, 'latin1'); };
  const pad = (b) => Buffer.concat([b, Buffer.alloc((2880 - (b.length % 2880)) % 2880)]);
  const img = Buffer.alloc(2 * 3 * 2); [1, 2, 3, 4, 5, 6].forEach((v, i) => img.writeInt16BE(v, 2 * i));
  const row = (n, x) => { const b = Buffer.alloc(12); b.write(n.padEnd(4), 0, 'latin1'); b.writeDoubleBE(x, 4); return b; };
  const tab = Buffer.concat([row('Vega', 0.03), row('Sun', -26.7)]);
  const fitsBuf = Buffer.concat([
    hdr(['SIMPLE  =                    T', 'BITPIX  =                   16', 'NAXIS   =                    2', 'NAXIS1  =                    3', 'NAXIS2  =                    2', "OBJECT  = 'Test'"]), pad(img),
    hdr(["XTENSION= 'BINTABLE'", 'BITPIX  =                    8', 'NAXIS   =                    2', 'NAXIS1  =                   12', 'NAXIS2  =                    2', 'PCOUNT  =                    0', 'GCOUNT  =                    1', 'TFIELDS =                    2', "TTYPE1  = 'name'", "TFORM1  = '4A'", "TTYPE2  = 'mag'", "TFORM2  = 'D'", "TUNIT2  = 'mag'", "EXTNAME = 'STARS'"]), pad(tab)]);
  writeFileSync(OUT + 'test.fits.gz', zlib.gzipSync(fitsBuf));
  await page.setInputFiles(R + '.sf-file', OUT + 'test.fits.gz'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.sf-facts')).includes('FITS') && (await page.textContent(R + '.sf-items')).includes('HDU 1 STARS: binary table'), 'sfc: gzipped FITS opens');
  check((await page.textContent(R + '.sf-prevnote')).includes('6 rows'), 'sfc: FITS image first');
  await page.selectOption(R + '.sf-layout', 'grid'); await page.waitForTimeout(100);
  { const rows = await page.$$eval(R + '.sf-prev tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent).join(','))); check(rows.join('|') === '1,1,2,3|2,4,5,6', 'sfc: FITS image as a grid'); }
  await page.selectOption(R + '.sf-item', '1'); await page.waitForTimeout(100);
  { const rows = await page.$$eval(R + '.sf-prev tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent).join(','))); check(rows.join('|') === 'Vega,0.03|Sun,-26.7' && (await page.textContent(R + '.sf-attrs')).includes('mag'), 'sfc: FITS binary table'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-json')]); const f = OUT + 'sft.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8')); check(j.rows[1].mag === -26.7 && d.suggestedFilename() === 'test-hdu1-STARS.json', `sfc: table JSON (${d.suggestedFilename()})`); }
  // CSV in, JSON out.
  writeFileSync(OUT + 'sites.csv', 'site,n,ph\nA,3,7.1\nB,5,\n');
  await page.setInputFiles(R + '.sf-file', OUT + 'sites.csv'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.sf-attrs')).includes('integer') && (await page.textContent(R + '.sf-facts')).includes('CSV'), 'sfc: CSV columns with types');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-json')]); const f = OUT + 'sites.json'; await d.saveAs(f); check(readFileSync(f, 'utf8').replace(/\s/g, '') === '[{"site":"A","n":3,"ph":7.1},{"site":"B","n":5,"ph":null}]', 'sfc: CSV to JSON'); }
  // Refusals.
  writeFileSync(OUT + 'x.nc', Buffer.concat([Buffer.from([0x89, 0x48, 0x44, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(100)]));
  await page.setInputFiles(R + '.sf-file', OUT + 'x.nc'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.sf-err')).includes('NetCDF-4') && await page.isHidden(R + '.sf-sum'), 'sfc: HDF5 / NetCDF-4 refused plainly');
  writeFileSync(OUT + 'x.parquet', Buffer.concat([Buffer.from('PAR1'), Buffer.alloc(50)]));
  await page.setInputFiles(R + '.sf-file', OUT + 'x.parquet'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.sf-err')).includes('Parquet'), 'sfc: Parquet refused');
  writeFileSync(OUT + 'cut.nc', Buffer.from('CDF\x01\x00\x00\x00\x03\x00\x00\x00\x0a', 'latin1'));
  await page.setInputFiles(R + '.sf-file', OUT + 'cut.nc'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.sf-err')).includes('cut off'), 'sfc: cut-off NetCDF message');
  await page.click(R + '.sf-ex'); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.sf-sum') && await page.isHidden(R + '.sf-err'), 'sfc: example again clears the error');
};
