// Astronomy (nihal, 2026-11-22): astronomy as a science, from light and gravity to stars, galaxies and the
// methods researchers use. Split from the first plan (/mnt/project-files/astronomy-course/plan.md) on nihal's
// request: sky watching is its own course (src/courses/sky-watching/), and cosmology (the distance ladder beyond
// Cepheids, dark matter, expansion, the CMB) belongs to the cosmology course; lessons link across, never repeat.
// Science only: astronomy, never astrology.
//
// Same engine as ML foundations (src/courses/types.ts): a lesson goes live when src/courses/astronomy/<slug>.md
// exists. Figures sit in the text as <!--fig:name--> (src/courses/astronomy/figures/index.ts, drawn with the
// shared kit in src/courses/ml-foundations/figures/kit.ts). The sums behind every simulation live in
// src/lib/astrocourse/ and are checked by tests/astrocourse.mjs.
import type { CourseSyllabus } from '../types';

export const ASTRONOMY: CourseSyllabus = {
  id: 'astronomy',
  name: 'Astronomy',
  title: 'Astronomy: the science of stars, planets and galaxies',
  text: 'How we know what we know about the sky: light and spectra, gravity and orbits, how stars shine, live and die, what galaxies are, and the methods researchers use, from photometry to open archives. Every lesson has interactive figures and the maths worked by hand.',
  audience: 'For anyone curious about how the universe works, from Class 11 up: students, hobbyists and physics graduates. School maths is enough; each lesson explains the rest. Observing the sky yourself is in the Sky watching course; the universe as a whole is in the Cosmology course.',
  kit: true,
  updated: '2026-11-22',
  footnote: 'Numbers in the examples are made up to show the idea unless a source is given. Simulations run in your browser on made-up data; nothing you type is sent anywhere. Astronomy only: nothing here is astrology.',
  parts: [
    { name: 'Part A: The physics of the sky', modules: [
      { n: 1, name: 'Light: the messenger', lessons: [
        ['1.1', 'electromagnetic-spectrum', 'The electromagnetic spectrum and the atmosphere\'s windows'],
        ['1.2', 'blackbody-radiation', 'Blackbody radiation: colour is temperature'],
        ['1.3', 'spectral-lines', 'Spectral lines: fingerprints of atoms'],
        ['1.4', 'doppler-shift', 'The Doppler shift'],
        ['1.5', 'flux-luminosity', 'Flux, luminosity and the inverse square law'],
        ['1.6', 'beyond-visible', 'Telescopes beyond visible light'],
      ] },
      { n: 2, name: 'Gravity and the Solar System', lessons: [
        ['2.1', 'keplers-laws', 'Kepler\'s laws'],
        ['2.2', 'newtons-gravity', 'Newton\'s gravity and orbital speed'],
        ['2.3', 'orbital-elements', 'Describing an orbit: the six elements'],
        ['2.4', 'transfers-rockets', 'Transfer orbits and the rocket equation'],
        ['2.5', 'planets-small-bodies', 'Planets, moons and small bodies'],
        ['2.6', 'the-sun', 'The Sun and the solar cycle'],
      ] },
      { n: 3, name: 'Stars', lessons: [
        ['3.1', 'parallax', 'Parallax: measuring the distance to a star'],
        ['3.2', 'hr-diagram', 'The Hertzsprung-Russell diagram'],
        ['3.3', 'how-stars-shine', 'How stars shine and age'],
        ['3.4', 'binary-stars', 'Binary stars and stellar masses'],
        ['3.5', 'variable-stars', 'Pulsating stars and the period-luminosity law'],
        ['3.6', 'stellar-remnants', 'White dwarfs, neutron stars and black holes'],
      ] },
      { n: 4, name: 'Galaxies', lessons: [
        ['4.1', 'milky-way', 'The Milky Way, our galaxy'],
        ['4.2', 'galaxy-types', 'Galaxy types'],
        ['4.3', 'beyond-our-galaxy', 'Beyond our galaxy: the gateway to cosmology'],
      ] },
    ] },
    { name: 'Part B: Doing research', modules: [
      { n: 5, name: 'Doing real research', lessons: [
        ['5.1', 'aperture-photometry', 'Aperture photometry'],
        ['5.2', 'periodograms', 'Time series and periodograms'],
        ['5.3', 'exoplanet-methods', 'Finding exoplanets: transits and radial velocity'],
        ['5.4', 'spectroscopy-pipeline', 'Spectroscopy: from raw frame to line'],
        ['5.5', 'fits-python', 'FITS files and Python on your own laptop'],
        ['5.6', 'open-archives', 'Surveys and open archives'],
        ['5.7', 'fitting-errors', 'Fitting models and honest error bars'],
        ['5.8', 'papers-arxiv', 'How papers get written, refereed and posted'],
        ['5.9', 'pro-am-science', 'Pro-am and citizen science'],
        ['5.10', 'capstone', 'Capstone: weigh a planet and measure the Hubble constant'],
      ] },
    ] },
  ],
};
