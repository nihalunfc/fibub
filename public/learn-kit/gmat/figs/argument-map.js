// 6.1 Argument map: evidence, the hidden assumption and the conclusion, for the five common argument patterns.
import { row, choice, readout } from '../../kit.js';
import { stack, card, down, clear } from './_verbal.js';
const P = {
  cause: { name: 'Cause', ev: 'In towns where more people own dogs, fewer people visit the doctor.', con: 'Owning a dog makes people healthier.', gap: 'Nothing else explains the link: for example, healthier people are not simply more likely to get dogs.', hit: 'Show another cause, or that the cause runs the other way (healthy people choose dogs).', help: 'Show that people got healthier after they got a dog.' },
  plan: { name: 'Plan', ev: 'Late deliveries cost the shop 200 orders a month. A second van would halve late deliveries.', con: 'Buying a second van will raise profit.', gap: 'The van costs less than the profit on the orders it saves.', hit: 'Show a side effect or cost that cancels the gain (the van and driver cost more than the saved orders earn).', help: 'Show the cost is small or the saved orders are worth a lot.' },
  sample: { name: 'Sample', ev: 'In a survey of a cycling club, 80% of members backed new bike lanes.', con: 'Most of the city backs new bike lanes.', gap: 'The cycling club is typical of the city.', hit: 'Show the sample is not typical (cyclists like bike lanes more than other people).', help: 'Show that a random city-wide poll gave a similar result.' },
  numbers: { name: 'Numbers', ev: 'The share of complaints about late trains fell from 30% to 20%.', con: 'Fewer people complained about late trains.', gap: 'The total number of complaints did not grow.', hit: 'Show that total complaints doubled, so 20% of the new total is more people.', help: 'Show that total complaints stayed the same or fell.' },
  analogy: { name: 'Analogy', ev: 'A four-day work week raised output at a software firm.', con: 'A four-day week will raise output at our hospital.', gap: 'The hospital and the software firm are alike in the ways that matter.', hit: 'Show a difference that matters (patients need care seven days a week).', help: 'Show the two workplaces share the features that made the change work.' },
};
export default function (host) {
  const ctl = row(host); const box = stack(host); const out = readout(host);
  const go = (k) => {
    const p = P[k]; clear(box);
    card(box, 'Evidence', p.ev); down(box);
    card(box, 'Hidden assumption (the gap)', p.gap, 'gap'); down(box);
    card(box, 'Conclusion', p.con);
    out.innerHTML = `<b>Weaken:</b> ${p.hit}<br><b>Strengthen:</b> ${p.help}`;
  };
  choice(ctl, 'Pattern', Object.entries(P).map(([k, v]) => [k, v.name]), 'cause', go);
  go('cause');
}
