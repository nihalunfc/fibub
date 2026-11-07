// Word (.docx) resume: one column, real heading styles and Word bullet lists, contact details in
// the body (not the page header), no tables, text boxes or pictures.
import { zipSync, strToU8 } from 'fflate';
import type { Block, Resume } from './model';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const run = (text: string, props = '') => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';

export function resumeDocx(r: Resume, b: Block[]): Uint8Array {
  const serif = r.style === 'serif';
  const font = serif ? 'Times New Roman' : 'Calibri';
  const size = serif ? 22 : 21; // half-points
  const page = r.paper === 'a4' ? { w: 11906, h: 16838 } : { w: 12240, h: 15840 };
  const margin = 1080;
  const text = page.w - margin * 2;

  const body = b.map((k) => {
    switch (k.t) {
      case 'name': return `<w:p><w:pPr><w:pStyle w:val="Title"/></w:pPr>${run(k.text)}</w:p>`;
      case 'headline': return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr>${run(k.text, `<w:color w:val="4D5466"/><w:sz w:val="${size + 2}"/>`)}</w:p>`;
      case 'contact': return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>${run(k.text, `<w:color w:val="4D5466"/><w:sz w:val="${size - 2}"/>`)}</w:p>`;
      case 'heading': return `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>${run(k.text)}</w:p>`;
      case 'para': return `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>${run(k.text)}</w:p>`;
      case 'entry': return `<w:p><w:pPr><w:keepNext/><w:tabs><w:tab w:val="right" w:pos="${text}"/></w:tabs><w:spacing w:before="80" w:after="0"/></w:pPr>${run(k.left, '<w:b/>')}${k.right ? `<w:r><w:tab/></w:r>${run(k.right)}` : ''}</w:p>`;
      case 'sub': return `<w:p><w:pPr><w:keepNext/><w:spacing w:after="20"/></w:pPr>${run(k.text, '<w:i/><w:color w:val="4D5466"/>')}</w:p>`;
      case 'bullet': return `<w:p><w:pPr><w:pStyle w:val="ListBullet"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>${run(k.text)}</w:p>`;
    }
  }).join('');

  const document = `${XML}<w:document ${W}><w:body>${body}<w:sectPr><w:pgSz w:w="${page.w}" w:h="${page.h}"/><w:pgMar w:top="${margin}" w:right="${margin}" w:bottom="${margin}" w:left="${margin}" w:header="540" w:footer="540" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `${XML}<w:styles ${W}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:color w:val="121826"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:jc w:val="center"/><w:spacing w:after="20"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="60"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="4D5466"/></w:pBdr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:caps/><w:sz w:val="${size + 2}"/><w:szCs w:val="${size + 2}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:numPr><w:numId w:val="1"/></w:numPr><w:spacing w:after="20"/><w:ind w:left="360" w:hanging="240"/></w:pPr></w:style>
</w:styles>`;
  const numbering = `${XML}<w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="240"/></w:pPr><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
  const title = r.name.trim() ? `${r.name.trim()} - Resume` : 'Resume';
  const now = new Date().toISOString().slice(0, 10) + 'T00:00:00Z';
  return zipSync({
    '[Content_Types].xml': strToU8(`${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`),
    '_rels/.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`),
    'word/_rels/document.xml.rels': strToU8(`${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`),
    'word/document.xml': strToU8(document),
    'word/styles.xml': strToU8(styles),
    'word/numbering.xml': strToU8(numbering),
    'docProps/core.xml': strToU8(`${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(title)}</dc:title><dc:creator>${esc(r.name.trim())}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`),
  }, { level: 6 });
}
