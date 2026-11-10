// Simple circuit lab (Learn): a cell, a switch, a torch bulb or an LED tester, and a gap where you test a material.
// Resistivities are rounded typical room-temperature values (order of magnitude for the poor conductors and
// insulators, which vary a lot). No DOM.

export type Material = { id: string; name: string; rho: number; liquid?: boolean; note: string };
export const MATERIALS: Material[] = [
  { id: 'copper', name: 'Copper wire', rho: 1.68e-8, note: 'a metal: a very good conductor, used inside wires' },
  { id: 'aluminium', name: 'Aluminium foil', rho: 2.65e-8, note: 'a metal: a very good conductor' },
  { id: 'iron', name: 'Iron nail', rho: 9.7e-8, note: 'a metal: a good conductor' },
  { id: 'coin', name: 'Steel coin', rho: 7e-7, note: 'a metal alloy: a good conductor' },
  { id: 'graphite', name: 'Pencil lead (graphite)', rho: 3e-5, note: 'graphite is a non-metal that conducts, but much less well than a metal' },
  { id: 'salt', name: 'Salt water', rho: 0.2, liquid: true, note: 'dissolved salt makes charged particles (ions) that carry current' },
  { id: 'lemon', name: 'Lemon juice', rho: 1, liquid: true, note: 'acids make ions too, so it conducts a little' },
  { id: 'tap', name: 'Tap water', rho: 20, liquid: true, note: 'tiny amounts of dissolved salts let a very small current flow' },
  { id: 'distilled', name: 'Distilled water', rho: 1e4, liquid: true, note: 'almost no ions, so almost no current' },
  { id: 'paper', name: 'Paper', rho: 1e10, note: 'an insulator' },
  { id: 'wood', name: 'Dry wood', rho: 1e11, note: 'an insulator (wet wood conducts a little)' },
  { id: 'glass', name: 'Glass', rho: 1e11, note: 'an insulator' },
  { id: 'plastic', name: 'Plastic ruler', rho: 1e13, note: 'an insulator, used to cover wires' },
  { id: 'rubber', name: 'Rubber eraser', rho: 1e13, note: 'an insulator' },
];

export const GAP = 0.05; // m: length of the sample between the clips (5 cm)
export const AREA_SOLID = 1e-6; // m²: a 1 mm² strip
export const AREA_LIQUID = 1e-4; // m²: 1 cm² of liquid between two nails
/** Resistance of the sample in the gap: R = ρ L / A. */
export const sampleR = (m: Material) => (m.rho * GAP) / (m.liquid ? AREA_LIQUID : AREA_SOLID);

export const CELL_V = 1.5;
export const BULB = { v: 2.5, i: 0.3 }; // torch bulb rating
export const BULB_R = BULB.v / BULB.i; // 8.33 Ω when hot (taken as fixed)
export const LED = { drop: 1.8, series: 100 }; // LED tester: 1.8 V across the LED, 100 Ω resistor in series

/** Current (A) through a torch bulb with `cells` cells and the sample in series. */
export const bulbCurrent = (cells: number, rs: number) => (cells * CELL_V) / (BULB_R + rs);
/** Bulb power as a share of its rated power. */
export const bulbShare = (I: number) => (I * I * BULB_R) / (BULB.v * BULB.i);
/** Current (A) through the LED tester; zero when the cells cannot beat the LED's forward voltage. */
export const ledCurrent = (cells: number, rs: number) => Math.max(0, (cells * CELL_V - LED.drop) / (LED.series + rs));

export type Glow = 'bright' | 'dim' | 'faint' | 'off';
export const bulbGlow = (I: number): Glow => { const s = bulbShare(I); return s >= 0.5 ? 'bright' : s >= 0.05 ? 'dim' : s >= 0.005 ? 'faint' : 'off'; };
export const ledGlow = (I: number): Glow => (I >= 5e-3 ? 'bright' : I >= 1e-3 ? 'dim' : I >= 1e-4 ? 'faint' : 'off');
