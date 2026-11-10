// Phototropism plant (#1307): a teaching model of a shoot bending towards light. The tip senses light and sends more
// auxin down the shaded side, so cells there grow longer and the shoot curves towards the light. Gravity makes the
// shoot turn up and the root turn down. Made-up round rates for teaching. No DOM. Angles in radians, SVG frame
// (x right, y down): straight up is −π/2.

export type Experiment = 'normal' | 'cut' | 'cover';
export type Seg = { a: number; len: number };
export type Plant = { shoot: Seg[]; root: Seg[]; hours: number };

export const RATE = {
  shootGrow: 4.5,      // units an hour added at the tip
  rootGrow: 2.5,
  zone: 6,             // how many newest segments can still bend
  light: (2 * Math.PI) / 180, // turn an hour for each bending segment at full sideways light
  gravity: (0.6 * Math.PI) / 180,
  rootGravity: (4 * Math.PI) / 180,
  rootLight: (0.3 * Math.PI) / 180,
  maxRoot: 18,
};

/** Signed angle (−π..π) to turn from direction a to direction b. */
export const turn = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

/** Auxin shares at the tip: the shaded side gets more when light comes from one side. */
export function auxin(tipAngle: number, lightAngle: number | null, exp: Experiment = 'normal') {
  if (exp === 'cut') return { shaded: 0, lit: 0, sideways: 0 };
  if (lightAngle === null || exp === 'cover') return { shaded: 0.5, lit: 0.5, sideways: 0 };
  const s = Math.sin(Math.abs(turn(tipAngle, lightAngle)));
  return { shaded: 0.5 + 0.3 * s, lit: 0.5 - 0.3 * s, sideways: s };
}

export function newPlant(tilted = false): Plant {
  const up = -Math.PI / 2, down = Math.PI / 2;
  // laid on its side: the pot turns 90° clockwise, so the shoot points right and the root left
  return { shoot: [{ a: tilted ? 0 : up, len: 4 }], root: [{ a: tilted ? Math.PI : down, len: 3 }], hours: 0 };
}

/** Tip position of a chain of segments from a start point. */
export function tip(segs: Seg[], x0 = 0, y0 = 0) {
  let x = x0, y = y0;
  for (const s of segs) { x += s.len * Math.cos(s.a); y += s.len * Math.sin(s.a); }
  return { x, y };
}

/** Grow one hour. `light` is the point the light shines from (same frame as the shoot base at 0,0) or null for dark. */
export function growHour(p: Plant, light: { x: number; y: number } | null, exp: Experiment = 'normal'): Plant {
  const shoot = p.shoot.map((s) => ({ ...s })), root = p.root.map((s) => ({ ...s }));
  const t = tip(shoot);
  const la = light ? Math.atan2(light.y - t.y, light.x - t.x) : null;
  const k0 = Math.max(0, shoot.length - RATE.zone);
  for (let i = k0; i < shoot.length; i++) {
    let d = 0;
    if (exp === 'normal' && la !== null) {
      // turn towards the light: in proportion to sin(angle) when it is in front, at full rate when it is behind
      const off = turn(shoot[i].a, la);
      d += RATE.light * (Math.abs(off) > Math.PI / 2 ? Math.sign(off) : Math.sin(off));
    }
    if (exp !== 'cut') d += RATE.gravity * Math.sin(turn(shoot[i].a, -Math.PI / 2));
    // a segment turns its own direction and everything above it
    for (let j = i; j < shoot.length; j++) shoot[j].a += d;
  }
  shoot.push({ a: shoot[shoot.length - 1].a, len: RATE.shootGrow * (exp === 'cut' ? 0.3 : 1) });
  if (root.length < RATE.maxRoot) {
    const r = root[root.length - 1];
    let d = RATE.rootGravity * Math.sin(turn(r.a, Math.PI / 2));
    if (light) { const away = Math.atan2(-(light.y - 0), -(light.x - 0)); d += RATE.rootLight * Math.sin(turn(r.a, away)); }
    root.push({ a: r.a + d, len: RATE.rootGrow });
  }
  return { shoot, root, hours: p.hours + 1 };
}

/** Angle between the shoot tip and the direction to the light, in degrees (0 = pointing at it). */
export function aimError(p: Plant, light: { x: number; y: number }) {
  const t = tip(p.shoot), la = Math.atan2(light.y - t.y, light.x - t.x);
  return (Math.abs(turn(p.shoot[p.shoot.length - 1].a, la)) * 180) / Math.PI;
}
