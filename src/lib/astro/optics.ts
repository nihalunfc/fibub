// Telescope, eyepiece and camera arithmetic.
export const TELESCOPES = [
  { name: '70 mm f/5.7 refractor (70/400)', ap: 70, fl: 400 },
  { name: '80 mm f/6 refractor (80/480)', ap: 80, fl: 480 },
  { name: '102 mm f/7 refractor (102/714)', ap: 102, fl: 714 },
  { name: '114 mm f/8 reflector (114/900)', ap: 114, fl: 900 },
  { name: '130 mm f/5 reflector (130/650)', ap: 130, fl: 650 },
  { name: '150 mm f/5 reflector (150/750)', ap: 150, fl: 750 },
  { name: '6-inch Dobsonian (150/1200)', ap: 150, fl: 1200 },
  { name: '8-inch Dobsonian (203/1200)', ap: 203, fl: 1200 },
  { name: '10-inch Dobsonian (254/1250)', ap: 254, fl: 1250 },
  { name: '12-inch Dobsonian (305/1500)', ap: 305, fl: 1500 },
  { name: '90 mm Maksutov (90/1250)', ap: 90, fl: 1250 },
  { name: '127 mm Maksutov (127/1500)', ap: 127, fl: 1500 },
  { name: '8-inch SCT (203/2032)', ap: 203, fl: 2032 },
  { name: '11-inch SCT (280/2800)', ap: 280, fl: 2800 },
  { name: '61 mm f/5.9 imaging refractor (61/360)', ap: 61, fl: 360 },
  { name: '50 mm guide scope (50/200)', ap: 50, fl: 200 },
  { name: 'Camera lens 135 mm f/2.8', ap: 48, fl: 135 },
];
export const SENSORS = [
  { name: 'Full frame camera (36 × 24 mm, 5.9 µm)', w: 36, h: 24, px: 5.9 },
  { name: 'Full frame, high resolution (36 × 24 mm, 4.4 µm)', w: 36, h: 24, px: 4.4 },
  { name: 'APS-C camera, Canon (22.3 × 14.9 mm, 4.3 µm)', w: 22.3, h: 14.9, px: 4.3 },
  { name: 'APS-C camera, Nikon/Sony (23.5 × 15.6 mm, 3.9 µm)', w: 23.5, h: 15.6, px: 3.9 },
  { name: 'Micro Four Thirds (17.3 × 13 mm, 3.75 µm)', w: 17.3, h: 13, px: 3.75 },
  { name: 'IMX571 APS-C astro camera (23.5 × 15.7 mm, 3.76 µm)', w: 23.5, h: 15.7, px: 3.76 },
  { name: 'IMX455 full frame astro camera (36 × 24 mm, 3.76 µm)', w: 36, h: 24, px: 3.76 },
  { name: 'IMX533 square astro camera (11.3 × 11.3 mm, 3.76 µm)', w: 11.3, h: 11.3, px: 3.76 },
  { name: 'IMX294 4/3" astro camera (19.1 × 13 mm, 4.63 µm)', w: 19.1, h: 13, px: 4.63 },
  { name: 'IMX585 planetary camera (11.2 × 6.3 mm, 2.9 µm)', w: 11.2, h: 6.3, px: 2.9 },
  { name: 'IMX462 planetary camera (5.6 × 3.2 mm, 2.9 µm)', w: 5.6, h: 3.2, px: 2.9 },
  { name: 'IMX183 1" camera (13.2 × 8.8 mm, 2.4 µm)', w: 13.2, h: 8.8, px: 2.4 },
];

export function scope(ap: number, fl: number) {
  return {
    ap, fl, f: fl / ap,
    grasp: (ap / 7) ** 2,
    limit: 2.7 + 5 * Math.log10(ap), // about 7.7 + 5 log10(D in cm)
    dawes: 116 / ap, rayleigh: 138 / ap,
    maxMag: 2 * ap, minMag: ap / 7,
  };
}
export function eyepiece(s: ReturnType<typeof scope>, fl: number, afov: number) {
  const mag = s.fl / fl, exit = s.ap / mag, tfov = afov / mag;
  const use = mag > s.maxMag ? 'Too much power; image goes soft'
    : exit > 7.5 ? 'Exit pupil wider than your eye; wasted light'
    : exit >= 4 ? 'Wide views: star fields, big clusters, nebulae'
    : exit >= 2 ? 'Galaxies and most deep-sky objects'
    : exit >= 1 ? 'Planetary nebulae, small galaxies, the Moon'
    : 'Planets, double stars, Moon detail on steady nights';
  return { mag, exit, tfov, use };
}
export function camera(s: ReturnType<typeof scope>, w: number, h: number, px: number, seeing: number) {
  const scale = (206.265 * px) / s.fl;
  const fovW = (3437.75 * w) / s.fl, fovH = (3437.75 * h) / s.fl;
  // Good sampling: 2 to 3 pixels across the seeing disc (FWHM).
  const ratio = seeing / scale;
  const verdict = ratio < 1.5 ? 'Undersampled' : ratio <= 3.5 ? 'Well matched' : 'Oversampled';
  const advice = ratio < 1.5 ? `stars may look square; ${(seeing / 2).toFixed(2)}″/px would suit ${seeing}″ seeing`
    : ratio <= 3.5 ? `${ratio.toFixed(1)} pixels across a ${seeing}″ star`
    : `${ratio.toFixed(1)} px per star; try 2×2 binning or a reducer`;
  // Gauge: 0 = very under (ratio 0.5), 0.5 = ideal (ratio 2.5), 1 = very over (ratio 6).
  const gauge = ratio < 1.5 ? ((ratio - 0.5) / 1) / 3 : ratio <= 3.5 ? 1 / 3 + ((ratio - 1.5) / 2) / 3 : 2 / 3 + Math.min(1, (ratio - 3.5) / 3) / 3;
  return { scale, fovW, fovH, verdict, advice, gauge };
}
