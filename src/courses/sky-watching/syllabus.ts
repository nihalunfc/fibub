// Sky watching (nihal, 2026-11-22): amateur astronomy from the naked eye to binoculars, telescopes and
// astrophotography. Split out of the astronomy course on nihal's request; the science of light, stars and galaxies
// is in src/courses/astronomy/ and cosmology in its own course. Lessons link across, never repeat.
// Science only: astronomy, never astrology.
//
// Same engine as ML foundations (src/courses/types.ts): a lesson goes live when src/courses/sky-watching/<slug>.md
// exists. Figures: src/courses/sky-watching/figures/index.ts, drawn with src/courses/ml-foundations/figures/kit.ts.
// The sums live in src/lib/astrocourse/ (sky.ts, optics.ts, stars.ts), checked by tests/astrocourse.mjs.
import type { CourseSyllabus } from '../types';

export const SKYWATCH: CourseSyllabus = {
  id: 'sky-watching',
  name: 'Sky watching',
  title: 'Sky watching: from your own eyes to telescopes and astrophotography',
  text: 'Learn the night sky with your own eyes, then with binoculars, a telescope and a camera: how the sky moves, finding anything with coordinates, dark skies, choosing and setting up a telescope, what to observe, and taking honest astrophotos. Every lesson has interactive figures and the maths worked by hand.',
  audience: 'For anyone who wants to start looking up, from Class 8 up. No equipment needed to begin. The physics behind what you see is in the Astronomy course.',
  kit: true,
  updated: '2026-11-22',
  footnote: 'Numbers in the examples are made up to show the idea unless a source is given. Simulations run in your browser on made-up data; nothing you type is sent anywhere. Astronomy only: nothing here is astrology.',
  parts: [
    { name: 'Part A: With your own eyes', modules: [
      { n: 1, name: 'The sky above you', lessons: [
        ['1.1', 'celestial-sphere', 'The celestial sphere: a map painted on a dome'],
        ['1.2', 'turning-sky', 'Why the sky turns: daily motion and circumpolar stars'],
        ['1.3', 'seasons', 'Seasons and the Sun\'s path'],
        ['1.4', 'moon-phases', 'Moon phases and eclipses'],
        ['1.5', 'wandering-planets', 'Planets that wander'],
        ['1.6', 'constellations', 'Constellations and star charts'],
        ['1.7', 'magnitudes', 'How bright is it? The magnitude scale'],
      ] },
      { n: 2, name: 'Finding your way: coordinates and time', lessons: [
        ['2.1', 'altitude-azimuth', 'Altitude and azimuth: pointing from where you stand'],
        ['2.2', 'right-ascension-declination', 'Right ascension and declination: the sky\'s latitude and longitude'],
        ['2.3', 'sidereal-time', 'Sidereal time: why stars rise 4 minutes earlier each night'],
        ['2.4', 'julian-date', 'Universal Time and the Julian date'],
        ['2.5', 'precession', 'Precession: the pole star changes'],
        ['2.6', 'airmass', 'Airmass: why low objects look dim'],
      ] },
      { n: 3, name: 'Dark skies and your eyes', lessons: [
        ['3.1', 'dark-adaptation', 'Dark adaptation and averted vision'],
        ['3.2', 'light-pollution', 'Light pollution and the Bortle scale'],
        ['3.3', 'seeing-transparency', 'Seeing and transparency'],
        ['3.4', 'planning-a-night', 'Planning a night: Sun, Moon and twilight'],
      ] },
    ] },
    { name: 'Part B: Instruments, observing and imaging', modules: [
      { n: 4, name: 'Binoculars and telescopes', lessons: [
        ['4.1', 'lenses-mirrors', 'How lenses and mirrors make an image'],
        ['4.2', 'aperture', 'Aperture: the bucket that catches light'],
        ['4.3', 'focal-length-magnification', 'Focal length, f-ratio and magnification'],
        ['4.4', 'resolution', 'Resolution, the Dawson limit and the atmosphere'],
        ['4.5', 'telescope-types', 'Refractors, reflectors and catadioptrics'],
        ['4.6', 'mounts-polar-alignment', 'Mounts and polar alignment'],
        ['4.7', 'first-setup', 'Choosing a first setup'],
      ] },
      { n: 5, name: 'What to observe and how', lessons: [
        ['5.1', 'moon-planets', 'The Moon and the planets'],
        ['5.2', 'deep-sky', 'Deep-sky objects: Messier and NGC'],
        ['5.3', 'double-stars', 'Double stars'],
        ['5.4', 'variable-star-estimates', 'Variable stars: making a brightness estimate'],
        ['5.5', 'meteor-showers', 'Meteor showers and the ZHR'],
        ['5.6', 'eclipses-occultations', 'Eclipses, transits and occultations'],
        ['5.7', 'observing-log', 'Keeping an observing log'],
      ] },
      { n: 6, name: 'Astrophotography', lessons: [
        ['6.1', 'image-scale', 'Cameras, pixels and image scale'],
        ['6.2', 'signal-to-noise', 'Exposure, noise and signal-to-noise'],
        ['6.3', 'calibration-frames', 'Calibration frames: darks, flats and bias'],
        ['6.4', 'stacking', 'Stacking: why many short shots beat one long one'],
        ['6.5', 'tracking-guiding', 'Tracking, guiding and star trails'],
        ['6.6', 'field-of-view-mosaics', 'Field of view and mosaics'],
        ['6.7', 'processing-honestly', 'Processing honestly: stretch, colour and what is real'],
      ] },
    ] },
  ],
};
