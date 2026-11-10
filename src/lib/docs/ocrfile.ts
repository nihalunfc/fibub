// Read the words in a photo or a scanned PDF (no text layer) with the shared OCR engine, on the device.
// Used by the medical records tools. PDFs: the first few pages only, so a long scan stays quick.
import { loadPdfJs } from './pdfpages';

export async function ocrText(src: Blob | Uint8Array, isPdf: boolean, say?: (msg: string) => void, maxPages = 5): Promise<string> {
  const { recognise } = await import('../ocr');
  const pct = (p: number) => Math.round(p * 100);
  if (!isPdf) {
    const blob = src instanceof Blob ? src : new Blob([src]);
    say?.('Reading the words in the photo (the first time loads the reader, about 4 MB)...');
    return (await recognise(blob, 'eng', (p) => say?.(`Reading the photo... ${pct(p)}%`))).text;
  }
  const bytes = src instanceof Blob ? new Uint8Array(await src.arrayBuffer()) : src.slice();
  const pdfjs = await loadPdfJs(), doc = await pdfjs.getDocument({ data: bytes }).promise;
  const n = Math.min(doc.numPages, maxPages), out: string[] = [];
  for (let i = 1; i <= n; i++) {
    const pg = await doc.getPage(i), v1 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: Math.min(3, 2400 / Math.max(v1.width, v1.height)) });
    const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    const x = c.getContext('2d')!; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: x, viewport: vp }).promise;
    out.push((await recognise(c, 'eng', (p) => say?.(`Reading page ${i} of ${n}... ${pct(p)}%`))).text);
  }
  return out.join('\n');
}
