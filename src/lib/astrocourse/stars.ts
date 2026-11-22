// Bright stars for the course figures: name, right ascension (hours, J2000), declination (degrees, J2000) and
// visual magnitude, rounded. Positions and magnitudes from the Yale Bright Star Catalogue (5th ed., Hoffleit and
// Warren 1991), via the public NASA HEASARC copy. Lines join stars into the usual IAU constellation figures.
export type Star = [name: string, ra: number, dec: number, mag: number];
export const STARS: Star[] = [
  ['Polaris', 2.530, 89.26, 2.0], ['Kochab', 14.845, 74.16, 2.1],
  ['Dubhe', 11.062, 61.75, 1.8], ['Merak', 11.031, 56.38, 2.4], ['Phecda', 11.897, 53.69, 2.4], ['Megrez', 12.257, 57.03, 3.3],
  ['Alioth', 12.900, 55.96, 1.8], ['Mizar', 13.399, 54.93, 2.2], ['Alkaid', 13.792, 49.31, 1.9],
  ['Caph', 0.153, 59.15, 2.3], ['Schedar', 0.675, 56.54, 2.2], ['Gamma Cas', 0.945, 60.72, 2.4], ['Ruchbah', 1.430, 60.24, 2.7], ['Segin', 1.907, 63.67, 3.4],
  ['Betelgeuse', 5.919, 7.41, 0.5], ['Bellatrix', 5.419, 6.35, 1.6], ['Mintaka', 5.533, -0.30, 2.2], ['Alnilam', 5.604, -1.20, 1.7],
  ['Alnitak', 5.679, -1.94, 1.8], ['Saiph', 5.796, -9.67, 2.1], ['Rigel', 5.242, -8.20, 0.1],
  ['Sirius', 6.752, -16.72, -1.5], ['Procyon', 7.655, 5.22, 0.4], ['Aldebaran', 4.599, 16.51, 0.9], ['Capella', 5.278, 46.00, 0.1],
  ['Castor', 7.577, 31.89, 1.6], ['Pollux', 7.755, 28.03, 1.1], ['Regulus', 10.140, 11.97, 1.4], ['Arcturus', 14.261, 19.18, 0.0],
  ['Spica', 13.420, -11.16, 1.0], ['Antares', 16.490, -26.43, 1.1], ['Vega', 18.616, 38.78, 0.0], ['Deneb', 20.690, 45.28, 1.3],
  ['Altair', 19.846, 8.87, 0.8], ['Fomalhaut', 22.961, -29.62, 1.2], ['Thuban', 14.073, 64.38, 3.7],
  ['Acrux', 12.443, -63.10, 0.8], ['Gacrux', 12.519, -57.11, 1.6], ['Mimosa', 12.795, -59.69, 1.3], ['Imai', 12.252, -58.75, 2.8],
  ['Canopus', 6.399, -52.70, -0.7], ['Rigil Kentaurus', 14.660, -60.84, -0.3], ['Achernar', 1.629, -57.24, 0.5],
];
export const LINES: [string, string][] = [
  ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
  ['Caph', 'Schedar'], ['Schedar', 'Gamma Cas'], ['Gamma Cas', 'Ruchbah'], ['Ruchbah', 'Segin'],
  ['Betelgeuse', 'Bellatrix'], ['Betelgeuse', 'Alnitak'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'],
  ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel'], ['Castor', 'Pollux'], ['Acrux', 'Gacrux'], ['Mimosa', 'Imai'],
  ['Vega', 'Deneb'], ['Deneb', 'Altair'], ['Altair', 'Vega'],
];
export const star = (name: string) => STARS.find((s) => s[0] === name)!;
