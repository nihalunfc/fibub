// Centrifuge maths: rpm ↔ relative centrifugal force (× g) at a radius, rotor k-factor and pelleting time from a
// sedimentation coefficient, and moving a protocol from one rotor to another.
export const G0 = 9.80665; // standard gravity, m/s² (exact by definition)

/** RCF (× g) at radius r (cm) and speed rpm: ω²r/g. */
export const rcf = (rpm: number, rCm: number) => ((2 * Math.PI * rpm) / 60) ** 2 * (rCm / 100) / G0;
/** Speed (rpm) for a given RCF at radius r (cm). */
export const rpmFor = (g: number, rCm: number) => (60 / (2 * Math.PI)) * Math.sqrt((g * G0) / (rCm / 100));
/** The familiar constant in RCF = C · r(cm) · rpm². */
export const RCF_CONST = rcf(1, 1);

/**
 * k-factor (hours × svedbergs): pelleting efficiency of a rotor at a speed, from its minimum and maximum radius.
 * t (hours) = k / S. k = ln(rmax/rmin) · 10¹³ / (3600 · ω²).
 */
export function kFactor(rpm: number, rMin: number, rMax: number): number {
  if (!(rMax > rMin && rMin > 0)) throw new Error('The maximum radius must be larger than the minimum radius, and both above zero.');
  const w = (2 * Math.PI * rpm) / 60;
  return (Math.log(rMax / rMin) * 1e13) / (3600 * w * w);
}
/** Hours to pellet particles of sedimentation coefficient S (svedbergs) in a rotor with factor k. */
export const pelletHours = (k: number, S: number) => k / S;
/** The same separation in another rotor: t₂ = t₁ · k₂ / k₁. */
export const convertTime = (t1: number, k1: number, k2: number) => (t1 * k2) / k1;
/** k-factor at another speed: k scales with 1/rpm². */
export const kAtSpeed = (k: number, rpm: number, rpm2: number) => k * (rpm / rpm2) ** 2;

/** Rough sedimentation coefficients for orientation (svedbergs). Ribosome and subunit names are their S values. */
export const PARTICLES: { name: string; S: number }[] = [
  { name: 'tRNA (about 4 S)', S: 4 },
  { name: 'Antibody, IgG (about 7 S)', S: 7 },
  { name: 'Ribosome small subunit, bacterial (30 S)', S: 30 },
  { name: 'Ribosome large subunit, bacterial (50 S)', S: 50 },
  { name: 'Ribosome, bacterial (70 S)', S: 70 },
  { name: 'Ribosome, eukaryotic (80 S)', S: 80 },
  { name: 'Polysomes (about 200 S and up)', S: 200 },
];

/** Readable time from hours. */
export function hms(h: number): string {
  if (!Number.isFinite(h)) return '–';
  const s = Math.round(h * 3600);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 120) return `${m} min`;
  const hh = Math.floor(m / 60), mm = m % 60;
  return mm ? `${hh} h ${mm} min` : `${hh} h`;
}
