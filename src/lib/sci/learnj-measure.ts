// Measurement and parallax (Learn): reading a ruler, thermometer or measuring cylinder with the eye at an angle.
// The thing measured sits a small gap d behind (or below) the scale marks, so a sight line at angle θ from the
// straight-on direction meets the scale d·tanθ away from where it meets the object. No DOM.

export type Instrument = { id: string; name: string; unit: string; min: number; max: number; least: number; gapMm: number; mmPerUnit: number; vertical: boolean; what: string };
export const INSTRUMENTS: Instrument[] = [
  { id: 'ruler', name: 'Ruler', unit: 'cm', min: 0, max: 15, least: 0.1, gapMm: 3, mmPerUnit: 10, vertical: false, what: 'the end of a pencil lying beside a ruler 3 mm thick' },
  { id: 'thermo', name: 'Thermometer', unit: '°C', min: 0, max: 50, least: 1, gapMm: 3, mmPerUnit: 1.5, vertical: true, what: 'the top of the liquid thread, 3 mm behind the printed scale' },
  { id: 'cylinder', name: 'Measuring cylinder', unit: 'mL', min: 0, max: 100, least: 2, gapMm: 12, mmPerUnit: 1.8, vertical: true, what: 'the bottom of the curved water surface (meniscus) at the middle of a cylinder 24 mm wide' },
];

/** The scale reading lined up with the object when the eye is at angle θ (degrees; + means the eye is moved
 * towards bigger scale values: above for upright scales, to the right for a ruler). */
export const apparent = (trueValue: number, thetaDeg: number, inst: Instrument) => trueValue + (inst.gapMm * Math.tan((thetaDeg * Math.PI) / 180)) / inst.mmPerUnit;
/** Parallax error = apparent − true. */
export const parallaxError = (thetaDeg: number, inst: Instrument) => apparent(0, thetaDeg, inst);
/** Round a value to the nearest scale mark (least count). */
export const toMark = (x: number, least: number) => Math.round(x / least) * least;
/** Percentage error of a reading. */
export const pctError = (reading: number, trueValue: number) => (100 * Math.abs(reading - trueValue)) / Math.abs(trueValue);
