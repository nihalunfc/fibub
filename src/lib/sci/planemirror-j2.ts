// Plane mirror lab maths (#1230): the law of reflection, images in two mirrors at an angle (traced by repeated
// reflection, so the count is right whatever the angle and wherever the object sits), and a two-mirror periscope.
// Angles in degrees; no DOM.

const rad = (d: number) => (d * Math.PI) / 180;
const norm = (a: number) => ((a % 360) + 360) % 360;

/** Law of reflection for a ray hitting a mirror: angle of reflection = angle of incidence, both from the normal. */
export const reflectAngle = (i: number) => i;

/** Reflect a direction (dx, dy) in a mirror whose surface runs at `deg` degrees to the x axis. */
export function reflectDir(dx: number, dy: number, deg: number): [number, number] {
  const nx = -Math.sin(rad(deg)), ny = Math.cos(rad(deg)), d = dx * nx + dy * ny;
  return [dx - 2 * d * nx, dy - 2 * d * ny];
}

export type Img = { angle: number; flips: number; matrix: [number, number, number, number]; via: string };

/**
 * Images of an object at angle `phi` (0 < phi < theta, at any distance) between two mirrors along the rays at 0° and
 * `theta` from their meeting point, with their shiny sides facing each other. Each image is the object reflected in
 * a chain of mirrors (A first or B first); a chain stops once its last image is behind the next mirror. Images that
 * both chains reach at the same place count once. `matrix` maps the object's shape onto the image (2 × 2, column-major).
 */
export function wedgeImages(theta: number, phi: number): Img[] {
  const out: Img[] = [];
  const mirrors = [0, theta];
  for (const first of [0, 1]) {
    let beta = phi, m = first, M: [number, number, number, number] = [1, 0, 0, 1], via = '', flips = 0;
    for (let k = 0; k < 400; k++) {
      const a = mirrors[m], s = Math.sin(rad(beta - a));
      // Mirror A (0°) reflects what is on its counter-clockwise side; mirror B (theta) what is on its clockwise side.
      if (m === 0 ? s <= 1e-9 : s >= -1e-9) break;
      beta = norm(2 * a - beta);
      const c = Math.cos(rad(2 * a)), sn = Math.sin(rad(2 * a));
      // Reflection matrix about the line at angle a: [[c, s], [s, −c]], applied after M.
      M = [c * M[0] + sn * M[1], sn * M[0] - c * M[1], c * M[2] + sn * M[3], sn * M[2] - c * M[3]];
      via += m === 0 ? 'A' : 'B'; flips++;
      out.push({ angle: beta, flips, matrix: [...M] as Img['matrix'], via });
      m = 1 - m;
    }
  }
  // Merge images at the same place.
  const merged: Img[] = [];
  for (const im of out) if (!merged.some((x) => Math.min(Math.abs(x.angle - im.angle), 360 - Math.abs(x.angle - im.angle)) < 1e-6)) merged.push(im);
  return merged.sort((a, b) => a.angle - b.angle);
}

/** The textbook rule: 360/θ − 1 images when 360/θ is even, or odd with the object on the bisector; else 360/θ. */
export function ruleCount(theta: number, onBisector: boolean): number | null {
  const q = 360 / theta;
  if (Math.abs(q - Math.round(q)) > 1e-9) return null;
  return Math.round(q) % 2 === 0 || onBisector ? Math.round(q) - 1 : Math.round(q);
}

/**
 * Periscope: a vertical tube of width w and height h (x from 0 to w, y from 0 at the bottom to h at the top) with a
 * mirror across each end at `deg` to the horizontal ("/" at 45°), top mirror centred at (w/2, h − w/2) and bottom
 * mirror at (w/2, w/2), parallel. Light comes in from the right at the top, going left. Returns the light's path and
 * whether it gets down the tube to the bottom mirror and out of the bottom-left opening.
 */
export function periscope(deg: number, w: number, h: number): { path: [number, number][]; out: boolean; down: number } {
  const top: [number, number] = [w / 2, h - w / 2], bot: [number, number] = [w / 2, w / 2];
  const path: [number, number][] = [[2 * w, top[1]], top];
  const [dx, dy] = reflectDir(-1, 0, deg);
  const down = (Math.atan2(dx, -dy) * 180) / Math.PI;   // tilt of the light going down, from straight down (+ to the right)
  const nx = -Math.sin(rad(deg)), ny = Math.cos(rad(deg)), dn = dx * nx + dy * ny;
  const s = Math.abs(dn) < 1e-12 ? -1 : ((bot[0] - top[0]) * nx + (bot[1] - top[1]) * ny) / dn;
  const hx = top[0] + s * dx, hy = top[1] + s * dy;
  if (s > 0 && hx >= -1e-9 && hx <= w + 1e-9) {
    path.push([hx, hy]);
    const [ex, ey] = reflectDir(dx, dy, deg);
    path.push([hx + ex * 2 * w, hy + ey * 2 * w]);
    return { path, out: ex < 0, down };
  }
  const sw = dx < 0 ? -top[0] / dx : dx > 0 ? (w - top[0]) / dx : Infinity;
  const sb = dy < 0 ? -top[1] / dy : Infinity, st = Math.min(sw, sb);
  path.push([top[0] + st * dx, top[1] + st * dy]);
  return { path, out: false, down };
}
