// Sliding filament model of a sarcomere (Learn #1394). No DOM. Lengths in micrometres, rounded general values for a
// vertebrate skeletal muscle: thick (myosin) filament 1.6 µm long with a 0.2 µm bare zone in the middle (no heads),
// thin (actin) filaments 1.0 µm long from each Z line. The A band is the length of the thick filaments, so it never
// changes; the I band is the part with thin filaments only; the H zone is the middle part with thick filaments only.

export const THICK = 1.6, THIN = 1.0, BARE = 0.2;

export function bands(S: number) {
  const A = THICK;
  const I = Math.max(0, S - THICK);
  const Hz = Math.max(0, S - 2 * THIN);
  const overlap = Math.max(0, Math.min(THIN, THICK / 2 - Math.max(0, S / 2 - THIN))); // per half
  // Myosin heads in one half sit from BARE/2 to THICK/2 from the middle; thin filament covers from S/2 − THIN to S/2.
  const lo = Math.max(BARE / 2, S / 2 - THIN), hi = Math.min(THICK / 2, S / 2);
  const reach = Math.max(0, hi - lo) / (THICK / 2 - BARE / 2);
  return { S, A, I, H: Hz, overlap, reach };
}

/** Percentage shortening from one sarcomere length to another. */
export const shortening = (from: number, to: number) => ((from - to) / from) * 100;

export const CYCLE = [
  { id: 'ca', title: 'Signal arrives', text: 'A nerve impulse reaches the muscle fibre. The sarcoplasmic reticulum releases calcium ions (Ca²⁺) into the cytoplasm.' },
  { id: 'trop', title: 'Binding sites open', text: 'Ca²⁺ binds to troponin on the thin filament. Troponin pulls tropomyosin off the binding sites on actin.' },
  { id: 'bind', title: 'Cross-bridge forms', text: 'A myosin head, already holding ADP and phosphate from a split ATP, binds to actin: a cross-bridge.' },
  { id: 'stroke', title: 'Power stroke', text: 'The head tilts and pulls the thin filament towards the middle of the sarcomere (the M line). ADP and phosphate are released.' },
  { id: 'release', title: 'ATP lets go', text: 'A fresh ATP binds to the head and the head lets go of actin. Without ATP the head stays stuck (this is why muscles stiffen after death).' },
  { id: 'cock', title: 'Head re-cocked', text: 'The head splits ATP into ADP and phosphate and swings back, ready to bind further along. The cycle repeats while Ca²⁺ is there.' },
  { id: 'relax', title: 'Relaxation', text: 'When the impulses stop, Ca²⁺ is pumped back into the sarcoplasmic reticulum, tropomyosin covers the sites again and the filaments slide back apart.' },
];
