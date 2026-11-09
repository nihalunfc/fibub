// #211 genome browser lite
import { gzipSync } from 'node:zlib';
export const path = '/science/genome-browser-lite/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const G = '.gbl ';
  await page.goto(`${BASE}${path}`);
  await page.waitForFunction(() => (document.querySelector('.gbl .gb-region')?.value ?? '').startsWith('demo_chr1'));
  await page.waitForTimeout(300);
  const region = () => page.inputValue(G + '.gb-region');
  const facts = () => page.textContent(G + '.gb-facts');
  const go = async (r) => { await page.fill(G + '.gb-region', r); await page.click(G + '.gb-go'); await page.waitForTimeout(200); };
  const span = async () => { const m = /:([\d,]+)-([\d,]+)$/.exec(await region()); return Number(m[2].replace(/,/g, '')) - Number(m[1].replace(/,/g, '')) + 1; };
  const startOf = async () => Number(/:([\d,]+)-/.exec(await region())[1].replace(/,/g, ''));
  // Tap down the canvas at base `bp` until something is selected that matches.
  const tapAt = async (bp, want) => {
    const cv = page.locator(G + '.gb-cv'); await cv.scrollIntoViewIfNeeded();
    const bb = await cv.boundingBox(), r = /:([\d,]+)-([\d,]+)$/.exec(await region()), s = Number(r[1].replace(/,/g, '')) - 1, e = Number(r[2].replace(/,/g, ''));
    const x = bb.x + ((bp - s) / (e - s)) * bb.width;
    for (let y = 60; y < bb.height - 2; y += 5) {
      await page.mouse.click(x, bb.y + y); await page.waitForTimeout(40);
      if (await page.isVisible(G + '.gb-sel') && (await page.textContent(G + '.gb-sname')).includes(want)) return true;
    }
    return false;
  };
  const dl = async (sel, name) => { await page.locator(G + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(G + sel)]); const f = OUT + name; await d.saveAs(f); return { f, name: d.suggestedFilename() }; };

  // The example.
  check((await region()) === 'demo_chr1:1-48,000' && (await page.locator(G + '.gb-files li').count()) === 4, 'genome browser: example opens with 4 files on the whole of demo_chr1');
  { const t = await facts(); check(t.includes('GC in view47.2 %') && t.includes('Genes10 in view') && t.includes('Peaks5 in view') && t.includes('Variants36 in view') && t.includes('48,000 bp'), `genome browser: example facts (${t.slice(0, 200)})`); }
  check((await page.textContent(G + '.gb-files')).includes('FASTA: 2 contigs, 64,000 bases') && (await page.textContent(G + '.gb-legend')).includes('SNV'), 'genome browser: file list and legend');
  // Regions and names.
  await go('alfA');
  check((await region()) === 'demo_chr1:1,671-5,630' && (await page.isHidden(G + '.gb-rerr')), 'genome browser: gene name jumps to the gene plus 10 %');
  check(await tapAt(3650, 'alfA.1'), 'genome browser: tap on alfA selects it');
  { const t = await page.textContent(G + '.gb-sfacts'); check(t.includes('3 exons, 1,900 nt spliced') && t.includes('1,500 nt') && t.includes('demo_chr1:2,001-5,300') && t.includes('plus strand'), `genome browser: gene details (${t})`); }
  check((await page.textContent(G + '.gb-attrs')).includes('gene Name') && (await page.textContent(G + '.gb-attrs')).includes('alfA'), 'genome browser: attributes with the gene\'s');
  { const v = await page.inputValue(G + '.gb-seq'); const s = v.split('\n').slice(1).join(''); check(v.startsWith('>alfA.1 demo_chr1:2001-5300(+) spliced') && s.length === 1900 && /^[ACGT]+$/.test(s), 'genome browser: spliced sequence'); }
  await page.selectOption(G + '.gb-kind', 'protein'); await page.waitForTimeout(100);
  { const s = (await page.inputValue(G + '.gb-seq')).split('\n').slice(1).join(''); check(s.length === 500 && s[0] === 'M' && s.indexOf('*') === 499 && (await page.textContent(G + '.gb-shelp')).startsWith('500 amino acids'), 'genome browser: protein is an open reading frame'); }
  await page.selectOption(G + '.gb-kind', 'cds'); await page.waitForTimeout(100);
  { const { f, name } = await dl('.gb-fa', 'alfA.fasta'); const t = readFileSync(f, 'utf8'); check(name === 'alfA-1-cds.fasta' && t.startsWith('>alfA.1') && t.split('\n').slice(1).join('').length === 1500 && t.split('\n')[1].length === 60, `genome browser: CDS FASTA download (${name})`); }
  await page.click(G + '.gb-copy'); await page.waitForTimeout(150);
  check((await page.textContent(G + '.gb-msg')) === 'Copied.', 'genome browser: copy');
  // Minus strand.
  await go('betB'); check(await tapAt(8200, 'betB.1'), 'genome browser: tap on betB');
  await page.selectOption(G + '.gb-kind', 'cds'); await page.waitForTimeout(100);
  { const s = (await page.inputValue(G + '.gb-seq')).split('\n').slice(1).join(''); check(s.length === 1200 && s.startsWith('ATG') && (await page.textContent(G + '.gb-shelp')).includes('reverse-complemented'), 'genome browser: minus-strand CDS is reverse-complemented'); }
  await page.selectOption(G + '.gb-kind', 'genomic'); await page.waitForTimeout(100);
  check((await page.inputValue(G + '.gb-seq')).split('\n').slice(1).join('').length === 2400, 'genome browser: genomic span');
  // Buttons, keys, drag and pinch.
  await go('demo_chr1:10,001-14,000');
  await page.click(G + '.gb-in'); check((await region()) === 'demo_chr1:11,001-13,000', 'genome browser: zoom in keeps the middle');
  await page.click(G + '.gb-out'); check((await span()) === 4000, 'genome browser: zoom out');
  await page.click(G + '.gb-right'); check((await startOf()) === 12001, 'genome browser: move right by half a view');
  await page.click(G + '.gb-left'); await page.click(G + '.gb-left'); check((await startOf()) === 8001, 'genome browser: move left');
  await page.focus(G + '.gb-cv'); await page.keyboard.press('+'); await page.waitForTimeout(100); check((await span()) === 2000, 'genome browser: + key zooms in');
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100); check((await startOf()) === 9401, 'genome browser: arrow key moves');
  { const cv = page.locator(G + '.gb-cv'); const bb = await cv.boundingBox(), s0 = await startOf();
    await page.mouse.move(bb.x + bb.width / 2, bb.y + 30); await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 2 - bb.width / 4, bb.y + 30, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
    check(Math.abs((await startOf()) - s0 - 500) <= 2 && (await span()) === 2000, `genome browser: drag moves the view (${await region()})`); }
  { const before = await span();
    await page.evaluate(() => { const c = document.querySelector('.gbl .gb-cv'), r = c.getBoundingClientRect(), y = r.top + 30, ev = (t, id, x) => c.dispatchEvent(new PointerEvent(t, { pointerId: id, clientX: r.left + x, clientY: y, bubbles: true, pointerType: 'touch', isPrimary: id === 11 }));
      ev('pointerdown', 11, 100); ev('pointerdown', 12, 200); ev('pointermove', 12, 250); ev('pointermove', 12, 300); ev('pointerup', 12, 300); ev('pointerup', 11, 100); });
    await page.waitForTimeout(150);
    check((await span()) === before / 2, `genome browser: pinch zooms (${before} to ${await span()})`); }
  await page.click(G + '.gb-all'); check((await region()) === 'demo_chr1:1-48,000', 'genome browser: whole contig');
  await page.selectOption(G + '.gb-chrom', 'demo_chr2'); await page.waitForTimeout(100);
  check((await region()) === 'demo_chr2:1-16,000' && (await facts()).includes('Variants12 in view'), 'genome browser: other contig');
  // A variant.
  await go('demo_chr1:700-780');
  check((await facts()).includes('px per base'), 'genome browser: base level');
  check(await tapAt(739, 'G > A at demo_chr1:739'), 'genome browser: tap on a variant');
  { const t = await page.textContent(G + '.gb-sel'); check(t.includes('SNV') && t.includes('QUAL97') && t.includes('INFO DP44') && t.includes('GT demo_sample0/1') && await page.isHidden(G + '.gb-seqbox'), 'genome browser: variant details'); }
  // Errors.
  await go('demo_chr1:5-2'); check((await page.textContent(G + '.gb-rerr')) === 'The end comes before the start.', 'genome browser: backwards region message');
  await go('nothing'); check((await page.textContent(G + '.gb-rerr')).startsWith('No contig or feature called "nothing"'), 'genome browser: unknown name message');
  await go('demo_chr2:15000'); check(await page.isHidden(G + '.gb-rerr') && (await region()) === 'demo_chr2:14,950-15,049', 'genome browser: one position');
  // Pictures.
  await go('alfA');
  { const { f, name } = await dl('.gb-svg', 'v.svg'); const t = readFileSync(f, 'utf8'); check(name === 'demo-chr1-1671-5630.svg' && t.startsWith('<svg') && t.includes('alfA.1') && t.includes('GC % (windows of') && t.includes('#ffffff'), 'genome browser: SVG download'); }
  await page.selectOption(G + '.gb-gcw', '1000'); await page.uncheck(G + '.gb-sseq');
  { const { f } = await dl('.gb-svg', 'v2.svg'); const t = readFileSync(f, 'utf8'); check(t.includes('windows of 1,000 bp') && !t.includes('>Sequence<'), 'genome browser: GC window and sequence options'); }
  await page.uncheck(G + '.gb-sgc');
  { const { f } = await dl('.gb-svg', 'v3.svg'); check(!readFileSync(f, 'utf8').includes('GC %'), 'genome browser: GC off'); }
  await page.check(G + '.gb-sseq'); await page.check(G + '.gb-sgc'); await page.selectOption(G + '.gb-gcw', '0');
  { const { f } = await dl('.gb-png', 'v.png'); const b = readFileSync(f); check(b.slice(1, 4).toString() === 'PNG' && b.readUInt32BE(16) >= 2000, 'genome browser: PNG download, 1,000 px wide at 2×'); }
  // Your own files, one gzipped, one bad, one on another contig.
  const seq = 'ATG' + 'GCC'.repeat(30) + 'TAA' + 'ACGT'.repeat(50) + 'N'.repeat(10) + 'GGGCCC'.repeat(10);
  writeFileSync(OUT + 'my.fa.gz', gzipSync(`>myctg test contig\r\n${seq.match(/.{1,60}/g).join('\r\n')}\r\n`));
  writeFileSync(OUT + 'my.gtf', 'myctg\tx\texon\t1\t96\t.\t+\t.\tgene_id "g1"; transcript_id "t1"; gene_name "myGene";\nmyctg\tx\tCDS\t1\t96\t.\t+\t0\tgene_id "g1"; transcript_id "t1";\n');
  writeFileSync(OUT + 'my.bed', 'chrZ\t10\t20\tfar\nmyctg\t100\t150\tbox\t0\t-\n');
  writeFileSync(OUT + 'bad.vcf', '##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n');
  await page.setInputFiles(G + '.gb-file', [OUT + 'my.fa.gz', OUT + 'my.gtf', OUT + 'my.bed', OUT + 'bad.vcf']);
  await page.waitForFunction(() => (document.querySelector('.gbl .gb-region')?.value ?? '').startsWith('myctg'), null, { timeout: 5000 }).catch(() => {});
  { const t = await page.textContent(G + '.gb-files'); check((await page.locator(G + '.gb-files li').count()) === 3 && t.includes('FASTA: 1 contig, 366 bases') && t.includes('GTF: 1 feature') && t.includes('not in the FASTA (chrZ)'), `genome browser: own files replace the example (${t})`); }
  check((await page.textContent(G + '.gb-err')).includes('bad.vcf: no variant records found') && (await region()) === 'myctg:1-366', 'genome browser: bad file message, others still open');
  await go('myGene'); check(await tapAt(50, 'myGene'), 'genome browser: GTF gene_name found and tapped');
  await page.selectOption(G + '.gb-kind', 'protein'); await page.waitForTimeout(100);
  check((await page.inputValue(G + '.gb-seq')).split('\n')[1] === 'M' + 'A'.repeat(30) + '*', 'genome browser: protein from your own files');
  { const t = await facts(); check(t.includes('GC in view'), 'genome browser: GC with N left out'); }
  await page.locator(G + '.gb-files li').nth(0).locator('.gb-rm').click(); await page.waitForTimeout(150);
  check((await page.locator(G + '.gb-files li').count()) === 2 && !(await facts()).includes('GC in view') && (await page.textContent(G + '.gb-chrom')).includes('chrZ'), 'genome browser: remove the FASTA, tracks stay');
  await page.click(G + '.gb-ex'); await page.waitForTimeout(200);
  check((await region()) === 'demo_chr1:1-48,000' && (await page.locator(G + '.gb-files li').count()) === 4, 'genome browser: back to the example');
  // Dark mode redraw.
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.dispatchEvent(new Event('fibub:theme')); });
  await page.waitForTimeout(150);
  { const px = await page.evaluate(() => { const c = document.querySelector('.gbl .gb-cv'); const d = c.getContext('2d').getImageData(c.width - 3, c.height - 3, 1, 1).data; return d[0] + d[1] + d[2]; }); check(px < 60, 'genome browser: dark mode draws on black'); }
  await page.evaluate(() => { delete document.documentElement.dataset.theme; document.dispatchEvent(new Event('fibub:theme')); });
};
