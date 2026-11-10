// School chemistry: how soap cleans (Class 10 carbon compounds). A teaching model, not a measurement: soap
// molecules have a water-loving head and an oil-loving tail. Hard-water ions (Ca²⁺, Mg²⁺) each take two soap
// anions out as insoluble scum. Above a threshold amount of free soap (the critical micelle concentration, here
// a made-up round number of molecules) the rest gather into micelles of about `AGG` molecules, which hold oil. No DOM.

export const CMC = 20;   // free soap molecules that stay single (made-up teaching number)
export const AGG = 24;   // molecules per micelle in the picture (made-up teaching number)
export const OIL_PER_MICELLE = 1; // one oil droplet per micelle

export type Wash = { soap: number; hard: number; oil: number; detergent: boolean };

/** What happens in the model: scum made, free soap left, micelles formed, oil droplets lifted. */
export function wash(w: Wash) {
  const soap = Math.max(0, Math.floor(w.soap)), hard = Math.max(0, Math.floor(w.hard)), oil = Math.max(0, Math.floor(w.oil));
  // Soap: each hardness ion uses two soap anions. Detergents (sulfonates) do not form scum.
  const used = w.detergent ? 0 : Math.min(soap, 2 * hard);
  const scumIons = w.detergent ? 0 : Math.floor(used / 2);
  const free = soap - used;
  const single = Math.min(free, CMC);
  const micelles = free > CMC ? Math.floor((free - CMC) / AGG) : 0;
  const lifted = Math.min(oil, micelles * OIL_PER_MICELLE);
  return { used, scumIons, free, single, micelles, lifted, clean: oil === 0 ? true : lifted >= oil, leftOil: oil - lifted };
}

/** Least soap (molecules) that lifts all the oil in water with `hard` hardness ions. */
export const soapNeeded = (oil: number, hard: number, detergent = false) => (detergent ? 0 : 2 * hard) + CMC + oil * AGG;
