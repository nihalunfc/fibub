// #482 DICOM viewer: the reader against pydicom 3.0.2 (synthetic files in tests/fixtures/dicom, made with pydicom;
// no real patient data). Reference numbers come from pydicom's pixel_array and apply_rescale, and numpy.
import { readFileSync } from 'node:fs';
import * as D from '../../src/lib/sci/dicom.ts';

export default async (check) => {
  const fx = (f) => D.parse(new Uint8Array(readFileSync(new URL('../fixtures/dicom/' + f, import.meta.url))));
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const sum = (a) => { let s = 0; for (const v of a) s += v; return s; };

  // Explicit VR little endian CT, intercept -1024.
  const ct = fx('ct-explicit.dcm'), ci = D.imageInfo(ct), g = D.getter(ct);
  const hu = D.frame(ct, ci);
  check('dicom: CT explicit LE tags', ct.ts === D.TS.explicitLE && ct.preamble && g.s(0x00100010) === 'Test^Synthetic^Q' && ci.rows === 48 && ci.cols === 64 && ci.units === 'HU' && ci.wc.join() === '40,400' && ci.ww.join() === '400,2000');
  check('dicom: CT pixel spacing [row, col]', ci.spacing[0] === 0.75 && ci.spacing[1] === 0.5 && ci.spacingFrom === 'Pixel Spacing');
  check('dicom: CT HU match pydicom', sum(hu) === 420517 && Math.min(...hu) === -980 && Math.max(...hu) === 1020 && hu[24 * 64 + 32] === 1010 && hu[0] === -980 && hu[47 * 64 + 63] === 24);
  check('dicom: sequences read', g.el(0x00081140).items.length === 1 && D.str(D.find(g.el(0x00081140).items[0], 0x00081155)) === '1.2.826.0.1.3680043.9.7482.1.99');
  check('dicom: private tags flagged', D.tagRows(ct).some((r) => r.private && r.value === 'secret private note'));
  // ROI statistics against numpy (pixel centres inside; SD with n − 1).
  const rect = D.roiStats(hu, 64, 48, [20, 12, 44, 36], false, ci.spacing);
  check('dicom: rectangle ROI = numpy', rect.n === 576 && near(rect.mean, 931.7482638888889) && near(rect.sd, 248.65727242012338, 1e-12) && rect.min === 20 && rect.max === 1020 && near(rect.area, 576 * 0.375));
  const ell = D.roiStats(hu, 64, 48, [20, 12, 44, 36], true, ci.spacing);
  check('dicom: ellipse ROI = numpy', ell.n === 448 && near(ell.mean, 1000.8482142857143) && near(ell.sd, 11.913340948429683, 1e-12));
  // Big endian, signed, slope 0.5 intercept 10.
  const be = fx('ct-bigendian.dcm'), bi = D.imageInfo(be), bh = D.frame(be, bi);
  check('dicom: explicit VR big endian, signed, slope 0.5', be.ts === D.TS.explicitBE && !be.little && sum(bh) === -39052.5 && bh[0] === 4487.5 && bh[19 * 24 + 23] === -9721);
  const mr = fx('mr-implicit.dcm'), mi = D.imageInfo(mr), mh = D.frame(mr, mi);
  check('dicom: implicit VR LE, 12 of 16 bits', mr.ts === D.TS.implicitLE && !mr.explicit && mi.bitsStored === 12 && sum(mh) === 2453832 && mh[5 * 30 + 7] === 3092 && mi.units === '');
  const dx = fx('dx-mono1-2frames.dcm'), di = D.imageInfo(dx);
  check('dicom: MONOCHROME1 8-bit, 2 frames, imager spacing', di.photo === 'MONOCHROME1' && di.frames === 2 && sum(D.frame(dx, di, 0)) === 40871 && sum(D.frame(dx, di, 1)) === 39953 && D.frame(dx, di, 1)[3 * 20 + 4] === 175 && di.spacing[0] === 0.2 && di.spacingFrom.startsWith('Imager'));
  const rgb = fx('rgb-planar-2frames.dcm'), ri = D.imageInfo(rgb), r1 = D.rgbFrame(rgb, ri, 1);
  check('dicom: RGB planar configuration 1, 2 frames', ri.spp === 3 && ri.planar === 1 && [...r1.slice((2 * 12 + 3) * 3, (2 * 12 + 3) * 3 + 3)].join() === '189,24,126' && sum(D.rgbFrame(rgb, ri, 0)) + sum(r1) === 92706);
  check('dicom: deflated explicit LE', fx('deflated.dcm').deflated && sum(D.frame(fx('deflated.dcm'), D.imageInfo(fx('deflated.dcm')))) === 83847);
  const raw = fx('raw-nometa.dcm');
  check('dicom: bare data set with no file meta', !raw.preamble && raw.ts === D.TS.implicitLE && raw.warnings.length === 1 && D.getter(raw).s(0x00100020) === 'FAKE-0001' && sum(D.frame(raw, D.imageInfo(raw))) === 9157);
  const rle = fx('ct-rle.dcm'), rli = D.imageInfo(rle);
  check('dicom: RLE compressed is recognised, not decoded', rli.compressed && !rli.supported && rli.why.includes('compressed (RLE lossless)') && D.getter(rle).s(0x00100020) === 'FAKE-0001');
  check('dicom: not DICOM', (() => { try { D.parse(new TextEncoder().encode('hello, this is not a DICOM file at all')); return false; } catch (e) { return /DICOM/.test(e.message); } })());
  { const b = new Uint8Array(readFileSync(new URL('../fixtures/dicom/ct-explicit.dcm', import.meta.url)));
    const cut = (n) => { try { const d = D.parse(b.subarray(0, n)); return d.warnings.join(' ') + ' ' + D.imageInfo(d).why; } catch (e) { return e.message; } };
    check('dicom: cut short', /cut short/.test(cut(703)) && /cut short|damaged/.test(cut(1200)) && /shorter than the image size/.test(cut(3000))); }

  // VOI linear window (PS3.3 C.11.2.1.2.1), worked by hand: c 40, w 400 → lo -160.5, hi 239.5.
  check('dicom: window formula', D.windowLevel(-161, 40, 400) === 0 && D.windowLevel(240, 40, 400) === 255 && near(D.windowLevel(39.5, 40, 400), 127.5) && near(D.windowLevel(100, 40, 400), ((100 - 39.5) / 399 + 0.5) * 255));
  // Distance and angle in mm with unequal spacing (row 0.75, column 0.5): 3-4-5 triangle of 6 cols × 4 rows.
  check('dicom: distance uses row and column spacing', near(D.distance([0, 0], [6, 4], [0.75, 0.5]), Math.hypot(3, 3)) && near(D.distance([0, 0], [8, 0], [0.75, 0.5]), 4));
  check('dicom: angle in physical space', near(D.angle([10, 0], [0, 0], [0, 10]), 90) && near(D.angle([4, 0], [0, 0], [4, 4], [0.5, 1]), Math.atan2(2, 4) * 180 / Math.PI));

  // A shuffled 6-slice stack: sorted by position (instance numbers run the other way), regular, 3 mm apart.
  const files = [0, 1, 2, 3, 4, 5].map((k) => fx(`stack-${k}.dcm`)).reverse();
  const infos = files.map(D.imageInfo);
  const st = D.sortSlices(infos);
  const zs = st.order.map((i) => infos[i].ipp[2]);
  check('dicom: series sorted by position, regular', st.regular && near(st.spacing, 3) && zs.join() === '-20,-17,-14,-11,-8,-5' && D.planeOf(st.normal) === 'Axial');
  const vol = st.order.map((i) => D.frame(files[i], infos[i]));
  const cor = D.reslice(vol, 24, 20, 'row', 12), sag = D.reslice(vol, 24, 20, 'col', 10);
  check('dicom: reslices = numpy vol[:,12,:] and vol[:,:,10]', cor.w === 20 && cor.h === 6 && sum(cor.data) === 10740 && sum(sag.data) === 11640 && cor.data[0] === 50 && cor.data[5 * 20 + 19] === 19);
  const bad = D.sortSlices([infos[0], infos[1], { ...infos[2], ipp: [-8, -9.6, -14 + 1] }]);
  check('dicom: uneven gaps are not a regular stack', !bad.regular && /not even/.test(bad.why));
  check('dicom: two slices are too few', !D.sortSlices(infos.slice(0, 2)).regular);
  check('dicom: plane names', D.planeOf([0, 0, 1]) === 'Axial' && D.planeOf([0, -1, 0]) === 'Coronal' && D.planeOf([1, 0, 0.2]) === 'Sagittal');

  // Writing: a round trip keeps every byte of every value (also checked in pydicom for all 14 files).
  const back = D.parse(D.write(ct));
  check('dicom: write and read back', back.elements.length === ct.elements.length && back.elements.every((e, i) => e.tag === ct.elements[i].tag && (e.items ? e.items.length === ct.elements[i].items.length : e.value.length === ct.elements[i].value.length && e.value.every((b, k) => b === ct.elements[i].value[k]))));
  const braw = D.parse(D.write(raw));
  check('dicom: writing a bare data set adds file meta', braw.preamble && braw.ts === D.TS.implicitLE && D.getter(braw).s(0x00020002) === '1.2.840.10008.5.1.4.1.1.2' && braw.warnings.length === 0);
  const brle = D.parse(D.write(rle));
  check('dicom: compressed fragments written back unchanged', brle.ts === '1.2.840.10008.1.2.5' && D.getter(brle).el(0x7fe00010).fragments.length === D.getter(rle).el(0x7fe00010).fragments.length);
  check('dicom: words', D.words('PatientName') === 'Patient Name' && D.words('SOPInstanceUID') === 'SOP Instance UID');
};
