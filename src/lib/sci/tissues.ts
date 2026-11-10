// Tissue identifier: simple teaching drawings of plant and animal tissues, made from shapes (no DOM), with the
// features that tell them apart, where each is found and what it does. Drawings are fibub's own diagrams, not
// micrographs. Plain TypeScript.

export type Shape = { t: 'circle' | 'ellipse' | 'rect' | 'path' | 'line' | 'polygon'; a: Record<string, number | string>; c: string };
export type Feature = { label: string; x: number; y: number };
export type Tissue = {
  id: string; name: string; group: 'plant' | 'animal'; type: string; where: string; job: string;
  features: Feature[]; draw: (rnd: () => number) => Shape[];
};

/** Small seeded random numbers, so a drawing looks the same each time for the same seed. */
export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

const C = (cx: number, cy: number, r: number, c: string): Shape => ({ t: 'circle', a: { cx, cy, r }, c });
const E = (cx: number, cy: number, rx: number, ry: number, c: string, rot = 0): Shape => ({ t: 'ellipse', a: { cx, cy, rx, ry, transform: `rotate(${rot} ${cx} ${cy})` }, c });
const Rr = (x: number, y: number, width: number, height: number, c: string, rx = 0): Shape => ({ t: 'rect', a: { x, y, width, height, rx }, c });
const P = (d: string, c: string): Shape => ({ t: 'path', a: { d }, c });
const L = (x1: number, y1: number, x2: number, y2: number, c: string): Shape => ({ t: 'line', a: { x1, y1, x2, y2 }, c });
const hex = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, k) => [cx + r * Math.cos((Math.PI / 3) * k + Math.PI / 6), cy + r * Math.sin((Math.PI / 3) * k + Math.PI / 6)]);
const poly = (pts: number[][], c: string): Shape => ({ t: 'polygon', a: { points: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ') }, c });
/** Centres of a honeycomb filling the 300 × 200 frame. */
function honey(r: number): number[][] {
  const out: number[][] = [], dx = r * Math.sqrt(3), dy = r * 1.5;
  for (let row = 0, y = 0; y < 200 + r; row++, y += dy) for (let x = row % 2 ? dx / 2 : 0; x < 300 + r; x += dx) out.push([x, y]);
  return out;
}

export const TISSUES: Tissue[] = [
  {
    id: 'meristem', name: 'Meristematic tissue', group: 'plant', type: 'Plant: dividing tissue', where: 'Tips of roots and shoots, and the ring that makes stems thicker', job: 'Divides again and again to make new cells, so the plant grows',
    features: [{ label: 'Large nucleus in every cell', x: 62, y: 62 }, { label: 'Small cells packed with no spaces', x: 175, y: 112 }, { label: 'Thin walls, dense cytoplasm, no big vacuole', x: 238, y: 162 }],
    draw: (r) => { const s: Shape[] = []; for (let y = 0; y < 200; y += 25) for (let x = 0; x < 300; x += 25) { s.push(Rr(x + 1, y + 1, 23, 23, 'tz-dense', 2)); s.push(C(x + 12.5 + (r() - 0.5) * 3, y + 12.5 + (r() - 0.5) * 3, 7, 'tz-nuc')); } return s; },
  },
  {
    id: 'parenchyma', name: 'Parenchyma', group: 'plant', type: 'Plant: simple permanent tissue', where: 'Soft parts of stems, roots, leaves and fruits', job: 'Stores food and water; with chloroplasts (chlorenchyma) it makes food; air spaces help water plants float (aerenchyma)',
    features: [{ label: 'Spaces between the cells', x: 52, y: 38 }, { label: 'Thin cell wall', x: 150, y: 76 }, { label: 'Large vacuole, nucleus pushed to the side', x: 222, y: 140 }],
    draw: (r) => { const s: Shape[] = []; for (const [x, y] of honey(26)) { const rad = 21 + r() * 2; s.push(C(x, y, rad, 'tz-cell')); s.push(C(x, y, rad - 5, 'tz-vac')); const a = r() * 6.28; s.push(C(x + (rad - 5) * Math.cos(a), y + (rad - 5) * Math.sin(a), 4, 'tz-nuc')); } return s; },
  },
  {
    id: 'collenchyma', name: 'Collenchyma', group: 'plant', type: 'Plant: simple permanent tissue', where: 'Leaf stalks and young stems, just under the skin', job: 'Gives support but lets the part bend without breaking',
    features: [{ label: 'Walls thickened at the corners', x: 101, y: 78 }, { label: 'Living cells, little space between them', x: 200, y: 120 }],
    draw: (r) => { const s: Shape[] = []; for (const [x, y] of honey(26)) { const h = hex(x, y, 26); s.push(poly(h, 'tz-cell')); s.push(C(x + (r() - 0.5) * 8, y + (r() - 0.5) * 8, 4, 'tz-nuc')); for (const [px, py] of h) s.push(C(px, py, 6.5, 'tz-thick')); } return s; },
  },
  {
    id: 'sclerenchyma', name: 'Sclerenchyma', group: 'plant', type: 'Plant: simple permanent tissue', where: 'Husk of coconut, stems, veins of leaves, seed coats', job: 'Makes parts hard and stiff; the cells are dead when mature',
    features: [{ label: 'Very thick walls (lignin)', x: 60, y: 95 }, { label: 'Tiny empty space (lumen), no nucleus: dead cells', x: 150, y: 150 }],
    draw: (r) => { const s: Shape[] = []; for (const [x, y] of honey(22)) { s.push(poly(hex(x, y, 22), 'tz-scl')); s.push(C(x, y, 3 + r() * 3, 'tz-lumen')); } return s; },
  },
  {
    id: 'xylem', name: 'Xylem', group: 'plant', type: 'Plant: complex permanent tissue (conducting)', where: 'Veins of leaves, the wood of stems and roots', job: 'Carries water and minerals up from the roots; its thick walls also support the plant',
    features: [{ label: 'Long hollow tubes (vessels)', x: 60, y: 30 }, { label: 'Spiral and ring thickening on the walls', x: 165, y: 100 }, { label: 'Tracheid with tapering ends', x: 270, y: 150 }],
    draw: () => { const s: Shape[] = []; for (const [x0, ring] of [[20, false], [120, true], [180, false]] as [number, boolean][]) { s.push(Rr(x0, -2, 46, 204, 'tz-tube')); for (let y = 4; y < 200; y += 12) s.push(ring ? E(x0 + 23, y, 21, 3, 'tz-ring') : P(`M${x0 + 2},${y} Q${x0 + 23},${y + 9} ${x0 + 44},${y + 4}`, 'tz-spiral')); }
      s.push(P('M250,10 L270,0 L290,10 L290,190 L270,200 L250,190 Z', 'tz-tube')); for (let y = 20; y < 190; y += 14) s.push(C(270, y, 2.5, 'tz-pit')); s.push(Rr(70, -2, 46, 204, 'tz-tube')); for (let y = 6; y < 200; y += 10) s.push(P(`M72,${y} Q93,${y + 8} 114,${y + 3}`, 'tz-spiral')); return s; },
  },
  {
    id: 'phloem', name: 'Phloem', group: 'plant', type: 'Plant: complex permanent tissue (conducting)', where: 'Veins of leaves, the inner bark of stems, roots', job: 'Carries food (sugars) made in the leaves to every part of the plant, up or down',
    features: [{ label: 'Sieve plate with pores', x: 70, y: 100 }, { label: 'Sieve tube (no nucleus)', x: 70, y: 150 }, { label: 'Companion cell with a nucleus', x: 132, y: 60 }],
    draw: (r) => { const s: Shape[] = []; for (const x0 of [30, 170]) { s.push(Rr(x0, -2, 80, 204, 'tz-tube')); for (const y of [0, 100, 200]) { s.push(Rr(x0, y - 3, 80, 6, 'tz-plate')); for (let k = 1; k < 8; k++) s.push(C(x0 + k * 10, y, 1.8, 'tz-pore')); } s.push(Rr(x0 + 82, -2, 22, 102, 'tz-cell', 4)); s.push(Rr(x0 + 82, 102, 22, 100, 'tz-cell', 4)); s.push(E(x0 + 93, 50 + (r() - 0.5) * 20, 6, 10, 'tz-nuc')); s.push(E(x0 + 93, 150 + (r() - 0.5) * 20, 6, 10, 'tz-nuc')); for (let k = 0; k < 6; k++) s.push(C(x0 + 15 + r() * 50, 20 + r() * 160, 1.5, 'tz-pit')); } return s; },
  },
  {
    id: 'epidermis', name: 'Epidermis with stomata', group: 'plant', type: 'Plant: protective tissue', where: 'The outer layer of leaves, young stems and roots', job: 'Protects the plant and cuts water loss; stomata open and close to let gases in and out and water vapour out',
    features: [{ label: 'Two bean-shaped guard cells', x: 168, y: 84 }, { label: 'Stoma (the pore)', x: 150, y: 114 }, { label: 'Wavy-edged cells fitting with no gaps', x: 60, y: 160 }],
    draw: () => { const s: Shape[] = []; for (let y = 0; y < 200; y += 50) for (let x = (y / 50) % 2 ? -30 : 0; x < 300; x += 60) s.push(P(`M${x},${y} q15,8 30,0 q15,-8 30,0 l0,50 q-15,8 -30,0 q-15,-8 -30,0 z`, 'tz-cell'));
      for (const [cx, cy] of [[150, 100], [60, 50], [240, 150]]) { s.push(E(cx - 10, cy, 10, 22, 'tz-guard')); s.push(E(cx + 10, cy, 10, 22, 'tz-guard')); s.push(E(cx, cy, 3, 14, 'tz-pore2')); } return s; },
  },
  {
    id: 'squamous', name: 'Squamous epithelium', group: 'animal', type: 'Animal: epithelial tissue', where: 'Lining of the mouth, skin surface, lining of blood vessels and air sacs', job: 'A thin, smooth covering that protects and lets things pass through easily',
    features: [{ label: 'Flat cells fitting like floor tiles', x: 90, y: 120 }, { label: 'One nucleus in the middle of each cell', x: 195, y: 64 }],
    draw: (r) => { const s: Shape[] = []; for (const [x, y] of honey(32)) { const h = hex(x, y, 32).map(([px, py]) => [px + (r() - 0.5) * 6, py + (r() - 0.5) * 6]); s.push(poly(h, 'tz-flat')); s.push(E(x, y, 6, 5, 'tz-nuc')); } return s; },
  },
  {
    id: 'columnar', name: 'Columnar epithelium', group: 'animal', type: 'Animal: epithelial tissue', where: 'Lining of the stomach and intestine; with cilia, the windpipe', job: 'Absorbs food and makes mucus; hair-like cilia sweep mucus along',
    features: [{ label: 'Tall, narrow cells side by side', x: 120, y: 90 }, { label: 'Nuclei near the base', x: 60, y: 150 }, { label: 'Cilia on top (in the windpipe)', x: 240, y: 22 }, { label: 'Basement membrane', x: 180, y: 182 }],
    draw: (r) => { const s: Shape[] = []; for (let x = 0; x < 300; x += 30) { s.push(Rr(x + 1, 30, 28, 148, 'tz-cell', 3)); s.push(E(x + 15, 148 + (r() - 0.5) * 6, 8, 11, 'tz-nuc')); for (let k = 0; k < 4; k++) s.push(L(x + 5 + k * 6, 30, x + 3 + k * 6 + (r() - 0.5) * 4, 14, 'tz-cilia')); } s.push(Rr(0, 178, 300, 8, 'tz-base')); return s; },
  },
  {
    id: 'blood', name: 'Blood', group: 'animal', type: 'Animal: fluid connective tissue', where: 'Heart and blood vessels, all through the body', job: 'Carries oxygen, food, waste and hormones; white cells fight germs; platelets help clotting',
    features: [{ label: 'Red blood cells: discs with no nucleus', x: 60, y: 50 }, { label: 'White blood cell with a lobed nucleus', x: 224, y: 94 }, { label: 'Platelets (tiny fragments)', x: 120, y: 170 }, { label: 'Plasma (the liquid)', x: 260, y: 30 }],
    draw: (r) => { const s: Shape[] = [Rr(0, 0, 300, 200, 'tz-plasma')]; const wbc = [[205, 110], [80, 130]];
      for (let k = 0; k < 40; k++) { const x = 10 + r() * 280, y = 10 + r() * 180; if (wbc.some(([a, b]) => Math.hypot(a - x, b - y) < 32) || (Math.hypot(260 - x, 30 - y) < 22) || (Math.hypot(120 - x, 170 - y) < 16)) continue; s.push(C(x, y, 11, 'tz-rbc')); s.push(C(x, y, 4.5, 'tz-rbc-c')); }
      for (const [x, y] of wbc) { s.push(C(x, y, 18, 'tz-wbc')); s.push(C(x - 6, y - 3, 6, 'tz-nuc')); s.push(C(x + 5, y - 5, 5.5, 'tz-nuc')); s.push(C(x + 1, y + 6, 6, 'tz-nuc')); }
      for (const [x, y] of [[120, 170], [112, 162], [128, 176], [160, 40], [30, 100]]) s.push(E(x, y, 3, 2, 'tz-plt', 30)); return s; },
  },
  {
    id: 'bone', name: 'Bone', group: 'animal', type: 'Animal: connective tissue', where: 'The skeleton', job: 'A hard frame that supports the body, protects organs and anchors muscles',
    features: [{ label: 'Central canal (blood vessels and nerves)', x: 90, y: 100 }, { label: 'Lacunae: spaces holding bone cells', x: 128, y: 100 }, { label: 'Rings of hard matrix (calcium and phosphorus)', x: 272, y: 45 }],
    draw: (r) => { const s: Shape[] = [Rr(0, 0, 300, 200, 'tz-matrix')]; for (const [cx, cy, R] of [[90, 100, 78], [235, 70, 62], [240, 185, 40]]) { for (let rr = R; rr > 12; rr -= 13) s.push(C(cx, cy, rr, 'tz-ringb')); s.push(C(cx, cy, 10, 'tz-canal'));
      for (let rr = R - 6; rr > 14; rr -= 13) for (let a = r() * 1; a < 6.28; a += 0.9 + r() * 0.3) { const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a); s.push(E(x, y, 4.5, 2.2, 'tz-lac', (a * 180) / Math.PI + 90)); s.push(L(x, y, x + 6 * Math.cos(a), y + 6 * Math.sin(a), 'tz-canl')); } } s.push(E(128, 100, 4.5, 2.2, 'tz-lac', 90)); return s; },
  },
  {
    id: 'skeletal', name: 'Striated (skeletal) muscle', group: 'animal', type: 'Animal: muscular tissue', where: 'Muscles attached to bones, in arms, legs and the face', job: 'Moves the bones; works when you choose to (voluntary) and can tire',
    features: [{ label: 'Light and dark stripes (striations)', x: 150, y: 40 }, { label: 'Many nuclei at the edge of each fibre', x: 72, y: 72 }, { label: 'Long, unbranched cylindrical fibres', x: 230, y: 150 }],
    draw: (r) => { const s: Shape[] = []; for (let y = 8; y < 200; y += 64) { s.push(Rr(-4, y, 308, 58, 'tz-fibre', 6)); for (let x = 2; x < 300; x += 8) s.push(Rr(x, y + 1, 3.5, 56, 'tz-band')); for (let k = 0; k < 4; k++) { const x = 20 + k * 70 + r() * 30; s.push(E(x, y + (k % 2 ? 54 : 4), 11, 3.5, 'tz-nuc')); } } return s; },
  },
  {
    id: 'smooth', name: 'Smooth (unstriated) muscle', group: 'animal', type: 'Animal: muscular tissue', where: 'Walls of the stomach, intestine, blood vessels, iris of the eye, bladder', job: 'Squeezes slowly and steadily, for example to push food along; works without you choosing (involuntary)',
    features: [{ label: 'Spindle-shaped cells, pointed at both ends', x: 70, y: 52 }, { label: 'One nucleus in the middle', x: 152, y: 100 }, { label: 'No stripes', x: 245, y: 150 }],
    draw: (r) => { const s: Shape[] = []; for (let row = 0; row < 5; row++) for (let k = -1; k < 4; k++) { const cx = k * 100 + (row % 2 ? 50 : 0) + 52, cy = 20 + row * 40 + (r() - 0.5) * 6; s.push(P(`M${cx - 60},${cy} Q${cx},${cy - 22} ${cx + 60},${cy} Q${cx},${cy + 22} ${cx - 60},${cy} Z`, 'tz-fibre')); s.push(E(cx, cy, 13, 4, 'tz-nuc')); } return s; },
  },
  {
    id: 'cardiac', name: 'Cardiac muscle', group: 'animal', type: 'Animal: muscular tissue', where: 'Only in the walls of the heart', job: 'Contracts and relaxes rhythmically all through life without tiring (involuntary)',
    features: [{ label: 'Branched fibres joined in a network', x: 150, y: 70 }, { label: 'Intercalated discs (dark cross lines)', x: 92, y: 40 }, { label: 'One nucleus in the middle of each cell', x: 230, y: 40 }, { label: 'Faint stripes', x: 50, y: 160 }],
    draw: () => { const s: Shape[] = []; for (const y of [20, 80, 140]) { s.push(Rr(-4, y, 308, 40, 'tz-fibre', 8)); for (let x = 2; x < 300; x += 9) s.push(Rr(x, y + 2, 2.5, 36, 'tz-band2')); for (const x of [92, 195]) s.push(Rr(x - 2, y - 1, 5, 42, 'tz-disc')); for (const x of [40, 145, 250]) s.push(E(x - 10 + (y % 3) * 5, y + 20, 10, 5, 'tz-nuc')); }
      for (const [x1, y1] of [[140, 60], [250, 60], [60, 120], [200, 120]]) s.push(P(`M${x1 - 12},${y1 - 1} L${x1 + 12},${y1 - 1} L${x1 + 22},${y1 + 21} L${x1 - 2},${y1 + 21} Z`, 'tz-fibre')); return s; },
  },
  {
    id: 'neuron', name: 'Nervous tissue (neuron)', group: 'animal', type: 'Animal: nervous tissue', where: 'Brain, spinal cord and nerves', job: 'Carries messages as electrical signals, very quickly, from one part of the body to another',
    features: [{ label: 'Cell body with a nucleus', x: 70, y: 100 }, { label: 'Dendrites: short branches that receive messages', x: 25, y: 40 }, { label: 'Axon: one long fibre that sends the message on', x: 190, y: 104 }, { label: 'Nerve endings', x: 285, y: 92 }],
    draw: () => { const s: Shape[] = [P('M45,85 Q70,70 95,88 Q105,100 92,116 Q70,132 48,116 Q35,100 45,85 Z', 'tz-soma'), C(70, 100, 10, 'tz-nuc')];
      for (const [x2, y2, x3, y3] of [[20, 50, 8, 30], [25, 150, 10, 175], [70, 40, 60, 15], [60, 165, 75, 190], [10, 100, 2, 85]]) { s.push(P(`M70,100 L${x2},${y2}`, 'tz-dend')); s.push(P(`M${x2},${y2} L${x3},${y3} M${x2},${y2} L${x2 + (x3 - x2) * 0.2 + 12},${y3 + 5}`, 'tz-dend2')); }
      s.push(P('M95,100 C150,95 200,110 270,100', 'tz-axon')); for (let x = 130; x < 260; x += 30) s.push(E(x + 8, 100 + ((x - 130) / 130) * 2, 12, 6, 'tz-myel'));
      for (const [x, y] of [[292, 82], [295, 100], [290, 118]]) s.push(P(`M270,100 L${x},${y}`, 'tz-dend2')); return s; },
  },
];

export const byId = (id: string) => TISSUES.find((t) => t.id === id)!;

/** Four different answer choices for an identify question, the right one included. */
export function choicesFor(id: string, rnd: () => number): string[] {
  const t = byId(id), same = TISSUES.filter((x) => x.id !== id && x.group === t.group), other = TISSUES.filter((x) => x.id !== id && x.group !== t.group);
  const pool = [...same].sort(() => rnd() - 0.5).slice(0, 2).concat([...other].sort(() => rnd() - 0.5).slice(0, 1));
  return [...pool.map((x) => x.id), id].sort(() => rnd() - 0.5);
}

/** The three muscle types compared (general school biology). */
export const MUSCLES = [
  ['Feature', 'Striated (skeletal)', 'Smooth', 'Cardiac'],
  ['Shape', 'Long cylinders, unbranched', 'Spindles, pointed ends', 'Short cylinders, branched'],
  ['Stripes', 'Yes, clear', 'No', 'Yes, faint'],
  ['Nuclei', 'Many, at the edge', 'One, in the middle', 'One (or two), in the middle'],
  ['Control', 'Voluntary', 'Involuntary', 'Involuntary'],
  ['Tires?', 'Yes', 'Slowly', 'No, works for life'],
  ['Found in', 'Limbs, attached to bones', 'Gut, blood vessels, iris', 'Heart only'],
];
