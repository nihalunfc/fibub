// Small helpers for the PDF tool checks: make test PDFs, count pages, read text back.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { PDFDocument, StandardFonts } = require('pdf-lib');
export async function makePdf(n, label = 'Page') {
  const d = await PDFDocument.create(), f = await d.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= n; i++) d.addPage([300, 400]).drawText(`${label} body ${i}`, { x: 40, y: 200, size: 18, font: f });
  return Buffer.from(await d.save());
}
export async function pages(buf) { return (await PDFDocument.load(buf)).getPageCount(); }
export async function text(buf) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, useSystemFonts: true }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) out.push((await (await doc.getPage(i)).getTextContent()).items.map((x) => x.str).join(' '));
  return out;
}
export async function saved(page, action) {
  const [dl] = await Promise.all([page.waitForEvent('download'), action()]);
  return { name: dl.suggestedFilename(), buf: readFileSync(await dl.path()) };
}
