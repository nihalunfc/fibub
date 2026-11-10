// Combined solids for Class 10 surface areas and volumes: a cone on a hemisphere, a capsule, a cylinder with a
// cone or a hemisphere on top, and a cube with a hemisphere on top. Each shape lists its visible surfaces (hidden
// joins left out) and its parts' volumes, so the page can show the sum term by term. No DOM.

export type Part = { name: string; formula: string; value: number };
export type Solid = { surfaces: Part[]; hidden: Part[]; volumes: Part[]; area: number; volume: number; height: number; width: number };
export type ShapeId = 'icecream' | 'capsule' | 'rocket' | 'dome' | 'cubedome';
export type Dims = { r: number; h: number; H: number; a: number };

export const SHAPES: { id: ShapeId; name: string; uses: ('r' | 'h' | 'H' | 'a')[] }[] = [
  { id: 'icecream', name: 'Cone on a hemisphere', uses: ['r', 'H'] },
  { id: 'capsule', name: 'Capsule', uses: ['r', 'h'] },
  { id: 'rocket', name: 'Cylinder with a cone', uses: ['r', 'h', 'H'] },
  { id: 'dome', name: 'Cylinder with a dome', uses: ['r', 'h'] },
  { id: 'cubedome', name: 'Cube with a dome', uses: ['a', 'r'] },
];

const sum = (p: Part[]) => p.reduce((s, x) => s + x.value, 0);

/** Slant height of a cone. */
export const slant = (r: number, H: number) => Math.hypot(r, H);

export function solid(id: ShapeId, d: Dims, pi = Math.PI): Solid {
  const { r, h, H, a } = d, l = slant(r, H);
  const cyl = (): Part => ({ name: 'Cylinder, curved surface', formula: '2πrh', value: 2 * pi * r * h });
  const hemi = (): Part => ({ name: 'Hemisphere, curved surface', formula: '2πr²', value: 2 * pi * r * r });
  const cone = (): Part => ({ name: 'Cone, curved surface', formula: 'πrl', value: pi * r * l });
  const disc = (name: string): Part => ({ name, formula: 'πr²', value: pi * r * r });
  const vCyl = (): Part => ({ name: 'Cylinder', formula: 'πr²h', value: pi * r * r * h });
  const vHemi = (): Part => ({ name: 'Hemisphere', formula: '⅔πr³', value: (2 / 3) * pi * r ** 3 });
  const vCone = (): Part => ({ name: 'Cone', formula: '⅓πr²H', value: (1 / 3) * pi * r * r * H });
  let surfaces: Part[], hidden: Part[], volumes: Part[], height: number, width: number;
  switch (id) {
    case 'icecream':
      surfaces = [cone(), hemi()]; hidden = [disc('Flat face where cone meets hemisphere (×2)')];
      volumes = [vCone(), vHemi()]; height = H + r; width = 2 * r; break;
    case 'capsule':
      surfaces = [cyl(), { ...hemi(), name: 'Two hemispheres, curved surfaces', formula: '2 × 2πr²', value: 4 * pi * r * r }];
      hidden = [disc('Two flat faces at each join (×4)')];
      volumes = [vCyl(), { ...vHemi(), name: 'Two hemispheres (one sphere)', formula: '⁴⁄₃πr³', value: (4 / 3) * pi * r ** 3 }];
      height = h + 2 * r; width = 2 * r; break;
    case 'rocket':
      surfaces = [disc('Base of the cylinder'), cyl(), cone()]; hidden = [disc('Top of cylinder and base of cone')];
      volumes = [vCyl(), vCone()]; height = h + H; width = 2 * r; break;
    case 'dome':
      surfaces = [disc('Base of the cylinder'), cyl(), hemi()]; hidden = [disc('Top of cylinder and base of hemisphere')];
      volumes = [vCyl(), vHemi()]; height = h + r; width = 2 * r; break;
    case 'cubedome':
      surfaces = [{ name: 'Six faces of the cube', formula: '6a²', value: 6 * a * a }, { name: 'Circle covered by the dome', formula: '− πr²', value: -pi * r * r }, hemi()];
      hidden = [disc('Base of the hemisphere')];
      volumes = [{ name: 'Cube', formula: 'a³', value: a ** 3 }, vHemi()]; height = a + r; width = a; break;
  }
  return { surfaces, hidden, volumes, area: sum(surfaces), volume: sum(volumes), height, width };
}

/** Why a set of sizes cannot make the shape, or null if it can. */
export function invalid(id: ShapeId, d: Dims): string | null {
  const need = SHAPES.find((s) => s.id === id)!.uses;
  for (const k of need) if (!(d[k] > 0)) return `${k} must be more than 0.`;
  if (id === 'cubedome' && 2 * d.r > d.a) return 'The dome must fit on the top face: its diameter 2r can be at most the side a.';
  return null;
}
