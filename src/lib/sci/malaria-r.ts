// Life cycle of the malaria parasite (Plasmodium) for school biology: the nine stages in order, which host
// and organ each happens in, and the fever rhythm from red blood cells bursting together. Teaching data only.

export type Stage = { id: string; host: 'human' | 'mosquito'; place: string; name: string; text: string };

export const STAGES: Stage[] = [
  { id: 'bite', host: 'human', place: 'skin and blood', name: 'Sporozoites enter', text: 'An infected female Anopheles mosquito bites a person. Thread-like sporozoites in her saliva pass into the blood.' },
  { id: 'liver', host: 'human', place: 'liver cells', name: 'Multiply in the liver', text: 'Within about an hour the sporozoites reach the liver. Inside liver cells each one divides many times, without any signs of illness yet.' },
  { id: 'rbc', host: 'human', place: 'red blood cells', name: 'Invade red blood cells', text: 'The liver cells burst and release merozoites, which enter red blood cells.' },
  { id: 'burst', host: 'human', place: 'red blood cells', name: 'Burst together: fever', text: 'In each red blood cell the parasite divides again. The cells burst together, releasing new merozoites and a toxin, haemozoin, which brings on chills and high fever. The new merozoites infect more red blood cells, so the fever comes back in a rhythm.' },
  { id: 'gameto', host: 'human', place: 'red blood cells', name: 'Gametocytes form', text: 'Some parasites in red blood cells turn into male and female gametocytes, the sexual stages. They wait in the blood.' },
  { id: 'suck', host: 'mosquito', place: 'mosquito gut', name: 'Taken up by a mosquito', text: 'A female Anopheles bites the infected person and sucks up blood with gametocytes in it.' },
  { id: 'fert', host: 'mosquito', place: 'mosquito gut', name: 'Fertilisation', text: 'In the mosquito\'s gut, male and female gametes fuse to make a zygote. This is the sexual part of the cycle, so the mosquito is the primary (definitive) host.' },
  { id: 'oocyst', host: 'mosquito', place: 'stomach wall', name: 'Sporozoites made', text: 'The zygote settles in the stomach wall as an oocyst and divides into thousands of sporozoites.' },
  { id: 'gland', host: 'mosquito', place: 'salivary glands', name: 'Ready to infect', text: 'The oocyst bursts and the sporozoites travel to the mosquito\'s salivary glands. Her next bite starts the cycle again.' },
];

/** Hours between fever attacks for some Plasmodium species (round textbook-style values). */
export const RHYTHM: Record<string, number> = { vivax: 48, malariae: 72 };

/** Times (hours from the first attack) of fever attacks in the first `days` days, one every `every` hours. */
export function feverTimes(every: number, days: number): number[] {
  const out: number[] = [];
  for (let h = 0; h <= days * 24 + 1e-9; h += every) out.push(h);
  return out;
}
/** Day numbers (day 1 = first attack) on which an attack falls. */
export const feverDays = (every: number, days: number) => feverTimes(every, days - 1).map((h) => Math.floor(h / 24) + 1);
