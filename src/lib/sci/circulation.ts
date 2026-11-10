// Double circulation (#1302): the route blood takes in a fish (single circulation), a frog (three chambers, mixing)
// and a human (four chambers, double circulation), and the round numbers for cardiac output and lap time.
// No DOM. Body figures are typical round adult values for teaching, not medical.

export type O2 = 'de' | 'ox' | 'mix';
export type Animal = 'fish' | 'frog' | 'human';

/** One stop on the route: where the blood is, and its oxygen state after it. */
export type Place = { id: string; name: string; o2: O2 };

export const ROUTES: Record<Animal, Place[]> = {
  human: [
    { id: 'body', name: 'body capillaries (oxygen given to the cells)', o2: 'de' },
    { id: 'vc', name: 'vena cava', o2: 'de' },
    { id: 'ra', name: 'right atrium', o2: 'de' },
    { id: 'rv', name: 'right ventricle', o2: 'de' },
    { id: 'pa', name: 'pulmonary artery', o2: 'de' },
    { id: 'lungs', name: 'lung capillaries (oxygen picked up, carbon dioxide given off)', o2: 'ox' },
    { id: 'pv', name: 'pulmonary vein', o2: 'ox' },
    { id: 'la', name: 'left atrium', o2: 'ox' },
    { id: 'lv', name: 'left ventricle', o2: 'ox' },
    { id: 'ao', name: 'aorta', o2: 'ox' },
  ],
  frog: [
    { id: 'body', name: 'body capillaries', o2: 'de' },
    { id: 'vc', name: 'vena cava', o2: 'de' },
    { id: 'ra', name: 'right atrium', o2: 'de' },
    { id: 'v', name: 'the one ventricle (blood mixes)', o2: 'mix' },
    { id: 'pa', name: 'artery to the lungs and skin', o2: 'mix' },
    { id: 'lungs', name: 'lung and skin capillaries', o2: 'ox' },
    { id: 'pv', name: 'pulmonary vein', o2: 'ox' },
    { id: 'la', name: 'left atrium', o2: 'ox' },
    { id: 'v', name: 'the one ventricle again (blood mixes)', o2: 'mix' },
    { id: 'ao', name: 'aorta', o2: 'mix' },
  ],
  fish: [
    { id: 'body', name: 'body capillaries', o2: 'de' },
    { id: 'vc', name: 'vein back to the heart', o2: 'de' },
    { id: 'a', name: 'atrium', o2: 'de' },
    { id: 'v', name: 'ventricle', o2: 'de' },
    { id: 'pa', name: 'artery to the gills', o2: 'de' },
    { id: 'gills', name: 'gill capillaries (oxygen picked up from the water)', o2: 'ox' },
    { id: 'ao', name: 'artery to the body', o2: 'ox' },
  ],
};

export const CHAMBERS: Record<Animal, number> = { fish: 2, frog: 3, human: 4 };

/** How many times blood passes through the heart on one full trip round the body. */
export const heartPasses = (a: Animal) => ROUTES[a].filter((p) => ['ra', 'rv', 'la', 'lv', 'v', 'a'].includes(p.id) && /ventricle/.test(p.name)).length;

/** Cardiac output in litres a minute from heart rate (beats a minute) and stroke volume (mL). */
export const cardiacOutput = (hr: number, sv: number) => (hr * sv) / 1000;

/** Seconds for the whole blood volume (litres) to go round once. */
export const lapSeconds = (hr: number, sv: number, volume = 5) => {
  const co = cardiacOutput(hr, sv);
  return co > 0 ? (60 * volume) / co : Infinity;
};

/** Laps in a day. */
export const lapsPerDay = (hr: number, sv: number, volume = 5) => (24 * 3600) / lapSeconds(hr, sv, volume);

/** Litres pumped in a day. */
export const litresPerDay = (hr: number, sv: number) => cardiacOutput(hr, sv) * 60 * 24;
