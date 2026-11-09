// #416 Manuscript image annotator: W3C Web Annotation and CSV export, re-import (round trips), IIIF manifests.
import { toWebAnnotation, fromWebAnnotation, toCsv, parseManifest, matchCanvases, bbox, area, rectPoints, EXAMPLE_REGIONS } from '../../src/lib/sci/annotate.ts';
export default async (check) => {
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const T = [{ name: 'example-page.png', width: 900, height: 1200 }];
  const page = toWebAnnotation(EXAMPLE_REGIONS, T);
  check('annotate: AnnotationPage with the W3C context and one Annotation per region', page['@context'] === 'http://www.w3.org/ns/anno.jsonld' && page.type === 'AnnotationPage' && page.items.length === 3 && page.items.every((a) => a.type === 'Annotation' && a.id && a.target.source === 'example-page.png'));
  check('annotate: rectangle as a media-fragment xywh selector', eq(page.items[0].target.selector, { type: 'FragmentSelector', conformsTo: 'http://www.w3.org/TR/media-frags/', value: 'xywh=120,110,660,70' }));
  check('annotate: polygon as an SvgSelector', page.items[2].target.selector.type === 'SvgSelector' && page.items[2].target.selector.value === '<svg xmlns="http://www.w3.org/2000/svg"><polygon points="640,860 800,840 830,960 700,1010 620,950"/></svg>');
  check('annotate: transcription and note bodies with purposes', eq(page.items[0].body, [{ type: 'TextualBody', purpose: 'transcribing', value: 'Accompt of the Mill at Ashford', format: 'text/plain' }, { type: 'TextualBody', purpose: 'commenting', value: 'Heading, larger hand.', format: 'text/plain' }]) && page.items[2].motivation === 'commenting');
  const back = fromWebAnnotation(JSON.parse(JSON.stringify(page)), T);
  check('annotate: export then import gives the same regions', back.skipped === 0 && eq(back.regions, EXAMPLE_REGIONS));
  // With a IIIF canvas twice the image size, coordinates scale out and back.
  const TC = [{ name: 'f1r.jpg', width: 1000, height: 1500, canvas: { id: 'https://example.org/iiif/c1', width: 2000, height: 3000 } }];
  const regs = [{ id: 'a', image: 'f1r.jpg', shape: 'polygon', points: [[10.5, 20], [100, 20.25], [60, 90]], transcription: 'x "quoted", & <odd>', note: 'line1\nline2' }];
  const pc = toWebAnnotation(regs, TC);
  check('annotate: canvas target scaled to canvas pixels', pc.items[0].target.source === 'https://example.org/iiif/c1' && pc.items[0].target.selector.value.includes('points="21,40 200,40.5 120,180"'));
  check('annotate: canvas round trip (scaling, escaping, line breaks)', eq(fromWebAnnotation(pc, TC).regions, regs));
  check('annotate: CSV round-trip-safe quoting and bounding box', toCsv(regs, TC) === 'id,image,canvas,shape,x,y,width,height,points,transcription,note\na,f1r.jpg,https://example.org/iiif/c1,polygon,10.5,20,89.5,70,"10.5,20 100,20.25 60,90","x ""quoted"", & <odd>","line1\nline2"\n');
  // Other people's annotations: target strings with #xywh, an SVG rect, a path, Open Annotation (IIIF 2) style, bad items.
  const other = { type: 'AnnotationCollection', first: { items: [
    { type: 'Annotation', body: { type: 'TextualBody', value: 'hello', purpose: 'transcribing' }, target: 'f1r.jpg#xywh=1,2,3,4' },
    { type: 'Annotation', body: { value: 'note only' }, target: { source: 'f1r.jpg', selector: { type: 'SvgSelector', value: "<svg><rect x='5' y='6' width='7' height='8'/></svg>" } } },
    { type: 'Annotation', motivation: 'supplementing', body: { value: 'sup' }, target: { source: 'f1r.jpg', selector: [{ type: 'SvgSelector', value: '<svg><path d="M0,0 L10,0 L10,10 Z"/></svg>' }] } },
    { type: 'Annotation', target: { source: 'f1r.jpg', selector: { type: 'SvgSelector', value: '<svg><circle r="3"/></svg>' } } },
    { type: 'Annotation', target: 'f1r.jpg#xywh=percent:1,2,3,4' },
  ] } };
  const o = fromWebAnnotation(other, TC);
  check('annotate: reads #xywh targets, SVG rect and path, motivations; skips circles and percent', o.skipped === 2 && o.regions.length === 3 && eq(o.regions[0].points, rectPoints(1, 2, 3, 4)) && o.regions[0].transcription === 'hello' && o.regions[1].note === 'note only' && eq(o.regions[1].points, rectPoints(5, 6, 7, 8)) && o.regions[2].transcription === 'sup' && eq(o.regions[2].points, [[0, 0], [10, 0], [10, 10]]));
  const oa = { '@type': 'sc:AnnotationList', resources: [{ '@type': 'oa:Annotation', motivation: 'sc:painting', resource: { '@type': 'cnt:ContentAsText', chars: 'old style' }, on: 'https://example.org/iiif/c1#xywh=200,300,400,600' }] };
  const r2 = fromWebAnnotation(oa, TC).regions;
  check('annotate: IIIF 2 annotation list (on/resource/chars), scaled back to image pixels', r2.length === 1 && r2[0].image === 'f1r.jpg' && eq(bbox(r2[0].points), { x: 100, y: 150, w: 200, h: 300 }) && r2[0].note === 'old style');
  check('annotate: shoelace area', area(rectPoints(0, 0, 4, 3)) === 12 && area([[0, 0], [4, 0], [0, 3]]) === 6);
  const m3 = { '@context': 'http://iiif.io/api/presentation/3/context.json', id: 'm', type: 'Manifest', label: { en: ['Account book'] }, items: [
    { id: 'c1', type: 'Canvas', label: { none: ['f. 1r'] }, width: 2000, height: 3000, items: [{ type: 'AnnotationPage', items: [{ type: 'Annotation', motivation: 'painting', body: { id: 'https://example.org/iiif/img-f1r/full/max/0/default.jpg', type: 'Image' }, target: 'c1' }] }] },
    { id: 'c2', type: 'Canvas', label: { none: ['f. 1v'] }, width: 2000, height: 3000, items: [{ type: 'AnnotationPage', items: [{ type: 'Annotation', body: { id: 'https://example.org/f1v.jpg' } }] }] }] };
  const p3 = parseManifest(m3);
  check('annotate: IIIF 3 manifest canvases', p3.version === 3 && p3.label === 'Account book' && p3.canvases.length === 2 && p3.canvases[0].label === 'f. 1r' && p3.canvases[0].width === 2000 && p3.canvases[1].image === 'https://example.org/f1v.jpg');
  const m2 = { '@context': 'http://iiif.io/api/presentation/2/context.json', '@type': 'sc:Manifest', label: 'Book', sequences: [{ canvases: [{ '@id': 'x1', label: 'p1', width: 10, height: 20, images: [{ resource: { '@id': 'https://e.org/p1.png' } }] }] }] };
  check('annotate: IIIF 2 manifest canvases', eq(parseManifest(m2), { label: 'Book', version: 2, canvases: [{ id: 'x1', label: 'p1', width: 10, height: 20, image: 'https://e.org/p1.png' }] }));
  let threw = false; try { parseManifest({ hello: 1 }); } catch { threw = true; }
  check('annotate: not a manifest is an error', threw);
  check('annotate: images matched to canvases by file name, then in order', eq(matchCanvases(['F1V.JPG', 'other.png', 'img-f1r.tif'], p3.canvases).map((c) => c?.id), ['c2', undefined, 'c1']) && eq(matchCanvases(['a.png', 'b.png'], p3.canvases).map((c) => c?.id), ['c1', 'c2']));
};
