// Pure maths and rules for the Wall fixings course (#L380 pick-wall-plug, #L381 hang-picture-mirror).
// No DOM, so tests/tools/pick-wall-plug.mjs and hang-picture-mirror.mjs can import it directly.
// The weight limits are cautious rules of thumb (fibub's own), not product ratings: the packet's rating wins.

export type Wall = 'stud' | 'drywall' | 'lath' | 'brick' | 'block' | 'concrete' | 'aircrete';
export type Item = 'flat' | 'shelf' | 'grab';
export type Kind = 'stud-screw' | 'pin-hook' | 'self-drill' | 'metal-anchor' | 'snap-toggle' | 'spring-toggle'
  | 'plastic-plug' | 'masonry-screw' | 'resin' | 'aircrete-plug' | 'into-studs';

export interface Pick { kind: Kind; fixing: string; bit: string; why: string; notes: string[] }

export const WALLS: Record<Wall, string> = {
  stud: 'Drywall or plasterboard, over a stud',
  drywall: 'Drywall or plasterboard, between studs (hollow)',
  lath: 'Lath and plaster (older house)',
  brick: 'Solid brick',
  block: 'Dense block (breeze or cinder block)',
  concrete: 'Concrete',
  aircrete: 'Lightweight block (aircrete)',
};

/** How hard the fixings are pulled: a flat picture hangs straight down; a shelf or bracket levers the top
 *  fixings out of the wall, so it counts as about twice its weight. Grab and hand rails get their own rule. */
export const load = (kg: number, item: Item) => (item === 'shelf' ? kg * 2 : kg);

export function pickFixing(wall: Wall, kg: number, item: Item, tiled = false): Pick {
  const L = load(kg, item), notes: string[] = [];
  let p: Omit<Pick, 'notes'>;
  const studs: Omit<Pick, 'notes'> = { kind: 'into-studs', fixing: 'Screw into the studs (or a timber batten fixed across two studs)',
    bit: '3 mm pilot drill (wood or HSS bit) for 5 mm wood screws',
    why: 'This is more than hollow-wall anchors should carry. Find the studs and screw into the wood, at least 25 mm (1 in) past the board.' };
  if (item === 'grab') {
    if (wall === 'drywall' || wall === 'lath') p = { ...studs, why: 'People pull and lean on grab rails and handrails. In a hollow wall they must go into studs or a timber noggin, never into anchors in the board alone.' };
    else if (wall === 'stud') p = { kind: 'stud-screw', fixing: '6 mm (No. 12) wood screws, at least 40 mm (1.5 in) into the stud', bit: '3.5 to 4 mm pilot drill', why: 'People pull and lean on rails, so use big screws deep into the wood, as the rail maker says.' };
    else if (wall === 'aircrete') p = { kind: 'resin', fixing: 'Resin (chemical) anchors with threaded studs', bit: 'As the resin packet says (often 10 to 12 mm), no hammer', why: 'Lightweight block crumbles under a pull. Resin bonds a long length of the hole.' };
    else p = { kind: 'masonry-screw', fixing: 'Masonry screws or frame fixings, as the rail maker says', bit: 'As the packet says (often 6 to 8 mm masonry bit), hammer on', why: 'People pull and lean on rails. Masonry screws and frame fixings grip much harder than small plastic plugs.' };
  } else if (wall === 'stud') {
    p = L <= 40
      ? { kind: 'stud-screw', fixing: '4 to 5 mm (No. 8 or 10) wood screw, about 25 mm (1 in) into the stud', bit: '2.5 to 3 mm pilot drill (wood or HSS bit)', why: 'A screw in solid wood is the strongest, simplest fixing in a stud wall. No plug needed.' }
      : { kind: 'stud-screw', fixing: '6 mm (No. 12) wood screws or coach screws, at least 40 mm (1.5 in) into the stud, across two studs', bit: '3.5 to 4 mm pilot drill', why: 'Heavy loads want bigger screws deep in the wood, spread over two studs.' };
  } else if (wall === 'drywall') {
    if (L <= 3 && item === 'flat') p = { kind: 'pin-hook', fixing: 'Picture hook with hardened pins (or a self-drill drywall anchor)', bit: 'No drill: tap the pins in with a hammer', why: 'A light frame hanging straight down is held fine by the angled pins of a picture hook.' };
    else if (L <= 10) p = { kind: 'self-drill', fixing: 'Self-drill drywall anchor (screw-in plastic or zinc)', bit: 'No drill bit: screw it in with a screwdriver', why: 'Its wide thread bites into the board. Quick, and good for light items.' };
    else if (L <= 25) p = { kind: 'metal-anchor', fixing: 'Metal hollow-wall anchor (spring-out cavity anchor)', bit: 'As the packet says (often 8 to 10 mm)', why: 'It squashes into a wide grip behind the board, spreading the load.' };
    else if (L <= 40) p = { kind: 'snap-toggle', fixing: 'Snap toggle (strap toggle) or gravity toggle', bit: 'As the packet says (often 13 mm or 1/2 in)', why: 'A steel bar flips behind the board and spreads the load over a wide area.' };
    else p = studs;
  } else if (wall === 'lath') {
    if (L <= 5) p = { kind: 'plastic-plug', fixing: 'Plastic wall plug pushed into the lath, 4 mm screw', bit: '6 mm masonry or HSS bit, hammer off', why: 'Light things can hold in the wooden lath behind the plaster. Drill gently so the plaster does not crack.' };
    else if (L <= 20) p = { kind: 'spring-toggle', fixing: 'Spring toggle (butterfly toggle)', bit: 'As the packet says (often 10 to 13 mm), hammer off', why: 'Its wings open behind the lath and plaster and grip a wide area.' };
    else p = { ...studs, why: 'Old plaster can crumble off the lath. For heavy things, find the studs and screw into the wood.' };
  } else if (wall === 'aircrete') {
    p = L <= 20
      ? { kind: 'aircrete-plug', fixing: 'Aircrete plug (spiral or finned plug for lightweight block)', bit: 'As the packet says (some are hammered in with no hole), hammer off', why: 'Lightweight block is soft. Ordinary plugs spin in it; aircrete plugs have big fins or a spiral that bite.' }
      : { kind: 'resin', fixing: 'Resin (chemical) anchor with threaded studs', bit: 'As the resin packet says (often 10 to 12 mm), hammer off', why: 'Resin glues a long length of the hole, so the soft block cannot crumble out.' };
  } else {
    if (L <= 15) p = { kind: 'plastic-plug', fixing: 'Plastic wall plug, 5 mm (No. 10) screw, at least 30 mm (1.25 in) into the wall', bit: '6 mm masonry bit, hammer on', why: 'The screw spreads the plug so it grips the sides of the hole. Fine for most everyday things in solid walls.' };
    else if (L <= 60) p = { kind: 'masonry-screw', fixing: 'Masonry screws (concrete screws) or frame fixings', bit: 'As the packet says (often 6 mm masonry bit), hammer on', why: 'They cut their own thread into the masonry and hold much more than small plugs.' };
    else p = { kind: 'resin', fixing: 'Resin (chemical) anchors with threaded studs, or heavy-duty anchor bolts', bit: 'As the packet says (often 10 to 12 mm), hammer on', why: 'For very heavy loads, resin bonds the whole length of the hole.' };
    if (wall === 'concrete') notes.push('Concrete is hard: use a hammer drill. If the bit stops dead on steel (rebar), stop and move the hole.');
    if (wall === 'block') notes.push('If the bit suddenly breaks into a hollow core, use a toggle or resin with a mesh sleeve instead.');
    if (wall === 'brick') notes.push('Drill into the brick, not the soft mortar joint between bricks.');
  }
  if (tiled) notes.push('Tiles: stick masking tape over the spot, drill the tile with a tile (or glass) bit with the hammer off, then change to the bit above for the wall behind. Push the plug in past the tile so it does not crack it.');
  if (kg > 100) notes.push('Over 100 kg is a job for a professional or a bracket system rated for it.');
  if (item === 'shelf') notes.push('Shelves and brackets lever the top fixings out of the wall, so this counts your item as twice its weight. Add what will go on the shelf.');
  notes.push('Screw into a stud whenever you can. Whatever this says, the rating on the packet wins.');
  return { ...p, notes };
}

/** Where to put the hook (or the two hooks) so the picture's centre ends up at `centre` above the floor.
 *  `height`: frame height. `drop`: from the top of the frame down to the wire pulled taut up to a hook,
 *  or down to the top of the D-rings or the cleat. Optional `spacing` (two D-rings, measured centre to centre)
 *  and `wall` (wall width) give the side-to-side positions. Any units, as long as they match. */
export function hookPosition(o: { height: number; drop: number; centre: number; spacing?: number; wall?: number }) {
  const top = o.centre + o.height / 2, bottom = o.centre - o.height / 2, hook = top - o.drop;
  const mid = o.wall ? o.wall / 2 : undefined;
  const hooks = o.spacing && mid !== undefined ? [mid - o.spacing / 2, mid + o.spacing / 2] : undefined;
  return { top, bottom, hook, mid, hooks };
}
