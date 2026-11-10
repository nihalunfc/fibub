// Heating effect and fuse (Learn): a teaching model of a wire heating as current flows, and of a home circuit with
// a fuse. Heat made per second is I²R, so the wire's steady temperature rise is taken as proportional to I² (the
// constants are made up so each wire behaves as described). No DOM.

export type Wire = { id: string; name: string; k: number; melt: number; note: string };
export const ROOM = 25;
export const WIRES: Wire[] = [
  { id: 'fuse', name: 'Fuse wire (5 A)', k: (230 - ROOM) / 25, melt: 230, note: 'a tin-lead alloy with a low melting point, chosen to melt just above 5 A' },
  { id: 'nichrome', name: 'Nichrome heater coil', k: 30, melt: 1400, note: 'an alloy with high resistance and a high melting point, so it glows without melting' },
  { id: 'copper', name: 'Thin copper wire', k: (1085 - ROOM) / 784, melt: 1085, note: 'copper has a low resistance, so it barely warms at normal currents' },
];

/** Steady temperature (°C) of a wire carrying current I (A): room + k I². */
export const wireTemp = (w: Wire, I: number) => ROOM + w.k * I * I;
/** The current (A) at which the wire reaches its melting point. */
export const meltCurrent = (w: Wire) => Math.sqrt((w.melt - ROOM) / w.k);
/** What a hot wire looks like (approximate glow colours of a hot solid). */
export function glowOf(T: number): string {
  if (T < 500) return 'no glow';
  if (T < 700) return 'dull red';
  if (T < 900) return 'cherry red';
  if (T < 1100) return 'orange';
  if (T < 1300) return 'yellow';
  return 'white-hot';
}

export type Appliance = { id: string; name: string; watts: number };
export const MAINS_V = 230;
export const APPLIANCES: Appliance[] = [
  { id: 'led', name: 'LED bulb', watts: 10 },
  { id: 'fan', name: 'Ceiling fan', watts: 75 },
  { id: 'tv', name: 'Television', watts: 100 },
  { id: 'fridge', name: 'Fridge', watts: 200 },
  { id: 'iron', name: 'Electric iron', watts: 1000 },
  { id: 'kettle', name: 'Kettle', watts: 1500 },
  { id: 'heater', name: 'Room heater', watts: 2000 },
];
/** Current drawn from the mains by appliances in parallel: I = P / V. */
export const homeCurrent = (watts: number[], V = MAINS_V) => watts.reduce((s, w) => s + w, 0) / V;
/** Heat (J) made in a resistance R carrying I for t seconds: H = I²Rt. */
export const heat = (I: number, R: number, t: number) => I * I * R * t;
