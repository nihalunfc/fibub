// Mosaic planning: how many camera frames cover a target with a chosen overlap, and the sky
// position of each panel centre (tangent-plane offsets turned into RA and Dec).

/** Field of view (arcmin) of a sensor dimension (mm) at a focal length (mm). */
export const fovArcmin = (sensorMm: number, focalMm: number) => ((2 * Math.atan(sensorMm / (2 * focalMm))) * 180 * 60) / Math.PI;

/** Frames along one side: n frames of size f with overlap o cover n·f − (n − 1)·f·o. */
export function framesAlong(target: number, f: number, overlap: number) {
  if (!(f > 0)) throw new Error('The field of view must be above zero');
  if (!(overlap >= 0 && overlap < 0.9)) throw new Error('Overlap must be between 0 and 90 %');
  return Math.max(1, Math.ceil((target - f * overlap) / (f * (1 - overlap)) - 1e-9));
}

/** Tangent-plane offsets (arcmin; ξ to the east, η to the north) to RA/Dec in degrees around a centre. */
export function offsetToRaDec(ra0: number, dec0: number, xi: number, eta: number) {
  const r = Math.PI / 180, x = (xi / 60) * r, y = (eta / 60) * r, d0 = dec0 * r;
  const den = Math.cos(d0) - y * Math.sin(d0);
  const ra = ra0 + Math.atan2(x, den) / r;
  const dec = Math.atan2(Math.sin(d0) + y * Math.cos(d0), Math.hypot(x, den)) / r;
  return { ra: ((ra % 360) + 360) % 360, dec };
}

export type Panel = { row: number; col: number; xi: number; eta: number; ra: number; dec: number };

/** Panels for a target of size tw × th arcmin, frames fw × fh arcmin, overlap (0–1), and pa: the position angle of the
 *  target's width (long side), in degrees east of north, as catalogues give it for galaxies. 90 = width runs east-west. */
export function mosaic(o: { ra: number; dec: number; tw: number; th: number; fw: number; fh: number; overlap: number; pa: number }) {
  const cols = framesAlong(o.tw, o.fw, o.overlap), rows = framesAlong(o.th, o.fh, o.overlap);
  const sx = o.fw * (1 - o.overlap), sy = o.fh * (1 - o.overlap), a = (o.pa * Math.PI) / 180;
  const panels: Panel[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    // u along the width (towards position angle pa), v along the height (pa − 90°). Column 1 is the end at pa,
    // row 1 the end at pa − 90° (north and east when pa = 90°).
    const u = ((cols - 1) / 2 - c) * sx, v = ((rows - 1) / 2 - r) * sy;
    const xi = u * Math.sin(a) - v * Math.cos(a), eta = u * Math.cos(a) + v * Math.sin(a);
    panels.push({ row: r + 1, col: c + 1, xi, eta, ...offsetToRaDec(o.ra, o.dec, xi, eta) });
  }
  const coverW = cols * o.fw - (cols - 1) * o.fw * o.overlap, coverH = rows * o.fh - (rows - 1) * o.fh * o.overlap;
  return { cols, rows, panels, coverW, coverH };
}
