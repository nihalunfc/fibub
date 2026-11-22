// IELTS Listening Part 2: one speaker in an everyday setting (a guide, a manager, a radio presenter).
// Original scripts written for fibub. Map, multiple choice and matching questions.
const B = (qtype, level, extra = {}) => ({ level, exams: ['academic', 'general'], facets: { skill: 'listening', part: '2', qtype }, ...extra });
const MAP_OPTS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// A simple plan drawn in SVG (currentColor, so it follows light, dark and red modes).
const LIBRARY_PLAN = `<svg viewBox="0 0 320 220" role="img" aria-label="Ground floor plan of a library with areas lettered A to H, the entrance at the bottom centre" style="max-width:420px;width:100%;color:inherit">
<g fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="10" width="300" height="190"/><line x1="140" y1="200" x2="140" y2="10" stroke-dasharray="4 4"/><line x1="180" y1="200" x2="180" y2="10" stroke-dasharray="4 4"/>
<rect x="20" y="20" width="110" height="50"/><rect x="20" y="80" width="110" height="50"/><rect x="20" y="140" width="110" height="50"/>
<rect x="190" y="20" width="110" height="50"/><rect x="190" y="80" width="110" height="50"/><rect x="190" y="140" width="110" height="50"/>
<rect x="145" y="20" width="30" height="30"/><rect x="145" y="105" width="30" height="30"/></g>
<g font-family="system-ui,sans-serif" font-size="16" font-weight="700" fill="currentColor" text-anchor="middle">
<text x="75" y="50">A</text><text x="75" y="110">B</text><text x="75" y="170">C</text><text x="245" y="50">D</text><text x="245" y="110">E</text><text x="245" y="170">F</text><text x="160" y="41">G</text><text x="160" y="126">H</text></g>
<g font-family="system-ui,sans-serif" font-size="11" fill="currentColor" text-anchor="middle"><text x="160" y="214">Entrance ↑</text><text x="160" y="190">Main corridor</text></g></svg>`;

export default {
  topic: 'listening-part2',
  groups: {
    library: {
      title: 'A tour of the new library',
      passage: `<p><b>Questions 11 to 16.</b> Label the plan. Write the correct letter, <b>A to H</b>, next to each place.</p>${LIBRARY_PLAN}`,
      options: MAP_OPTS,
      audio: [
        { who: 'N', text: 'You will hear a librarian giving new members a tour of the ground floor. Look at the plan.' },
        { who: 'A', text: 'Welcome, everyone, to the new Central Library. We are standing just inside the entrance, at the bottom of your plan, looking down the main corridor.' },
        { who: 'A', text: 'Immediately on your right as you come in is the children\'s area. It is the room nearest the entrance on that side, so parents can keep an eye on the door.' },
        { who: 'A', text: 'Opposite the children\'s area, on your left, you will find the quiet study room. Please keep phones on silent in there.' },
        { who: 'A', text: 'Walk on down the corridor, and half way along there is a small kiosk in the middle of the corridor. That is the help desk, and staff are there all day.' },
        { who: 'A', text: 'The middle room on the left-hand side used to be the café, but the café has moved upstairs. That room now holds the computer suite, with forty machines you can book.' },
        { who: 'A', text: 'At the far end of the corridor, the room in the top right corner is the newspaper and magazine section. There are comfortable chairs by the windows.' },
        { who: 'A', text: 'And finally, right at the end of the corridor, in the centre, is a little lift. It is the only way up to the first floor apart from the stairs at the back.' },
        { who: 'A', text: 'The other rooms are for staff, so please don\'t go in there.' },
      ],
    },
    festival: {
      title: 'A radio notice about a town festival',
      passage: '<p><b>Questions 11 to 15.</b> Choose the correct letter, <b>A, B or C</b>.</p>',
      audio: [
        { who: 'N', text: 'You will hear a radio presenter talking about a summer festival.' },
        { who: 'A', text: 'Good morning, and if you are wondering what to do this weekend, the Harbourside Festival is back. In past years it was a one-day event, but this year it runs from Friday evening right through to Sunday night.' },
        { who: 'A', text: 'The organisers had planned to hold the opening concert in the park, as usual, but with the park being re-turfed, they have moved it to the beach, which should make for a lovely sunset.' },
        { who: 'A', text: 'Now, tickets. Entry to the festival itself is free, as always. You will only need to pay for the evening concerts, and there is a discount if you book online before Thursday.' },
        { who: 'A', text: 'The organisers are especially proud of the food market this year. Last year people complained about the long queues, not the food, so they have doubled the number of stalls.' },
        { who: 'A', text: 'For families, there is a sandcastle competition on Saturday morning. You do not need to register in advance. Just turn up by ten with a bucket and spade, and the judges will come round at noon.' },
        { who: 'A', text: 'Finally, getting there. Parking near the harbour is very limited, and the council is asking people not to drive. Extra buses will run every ten minutes from the station, and they are free with a festival wristband.' },
      ],
    },
    volunteer: {
      title: 'A talk to new volunteers at a wildlife centre',
      passage: '<p><b>Questions 16 to 20.</b> What does the manager say about each job? Choose <b>FIVE</b> answers from the box and write the correct letter, <b>A to G</b>, next to each job.</p><p><b>A</b> needs a short training course · <b>B</b> is only on weekends · <b>C</b> involves heavy lifting · <b>D</b> is the most popular · <b>E</b> needs good computer skills · <b>F</b> can be done from home · <b>G</b> starts very early</p>',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      audio: [
        { who: 'N', text: 'You will hear the manager of a wildlife centre talking to new volunteers.' },
        { who: 'A', text: 'Thank you all for coming. Let me tell you about the jobs we need help with, so you can choose.' },
        { who: 'A', text: 'First, feeding the animals. People assume this is the job everyone wants, but actually it is the opposite: the feeding round begins at six in the morning, so not many people sign up.' },
        { who: 'A', text: 'Then there is guiding visitors. It is the job most of our volunteers choose, I think because you get to chat to people all day. You do not need any special training for it.' },
        { who: 'A', text: 'Our gift shop needs people too. It is open every day, but we only use volunteers there on Saturdays and Sundays, because paid staff cover the weekdays.' },
        { who: 'A', text: 'Then there is the newsletter. We send it to our members every month, and whoever does it can work on it on their own laptop in their own time, so you never have to come in.' },
        { who: 'A', text: 'And last, the rescue team, who collect injured birds and animals from the public. Before you can join, you must complete a two-day course on handling animals safely. Despite what people think, there is not much carrying involved: the boxes are light.' },
      ],
    },
    sports: {
      title: 'Changes at a leisure centre',
      passage: '<p><b>Questions 11 to 14.</b> Choose the correct letter, <b>A, B or C</b>.</p>',
      audio: [
        { who: 'N', text: 'You will hear the manager of a leisure centre talking to members about changes.' },
        { who: 'A', text: 'Thanks for coming to this members\' meeting. I want to explain the changes we are making this autumn.' },
        { who: 'A', text: 'Many of you asked for longer opening hours. We looked at opening earlier, at six, but very few people use the pool before seven. So instead we will stay open later, until ten every weeknight.' },
        { who: 'A', text: 'The biggest change is the gym. The equipment is fine, so we are not replacing it. What members told us is that it is too crowded in the evenings, so we are knocking through into the old storage room to make it twice the size.' },
        { who: 'A', text: 'While the building work happens, the gym will close for two weeks in October. We had hoped to do it in a week, but the builders said that was not possible.' },
        { who: 'A', text: 'And prices. Membership fees will stay the same this year. The only increase is for parking, which goes up by fifty pence, because the council has raised its charges to us.' },
      ],
    },
  },
  items: [
    // library map
    { id: 'lp2-lib-1', type: 'mcq', ...B('map', 2), group: 'library', q: '11 Children\'s area', answer: 5, sol: 'Immediately on your right as you come in, nearest the entrance: F (bottom right).', trap: 'Facing up the corridor, right is the right side of the plan.' },
    { id: 'lp2-lib-2', type: 'mcq', ...B('map', 2), group: 'library', q: '12 Quiet study room', answer: 2, sol: 'Opposite the children\'s area, on the left: C.' },
    { id: 'lp2-lib-3', type: 'mcq', ...B('map', 2), group: 'library', q: '13 Help desk', answer: 7, sol: 'A small kiosk in the middle of the corridor, half way along: H.' },
    { id: 'lp2-lib-4', type: 'mcq', ...B('map', 3), group: 'library', q: '14 Computer suite', answer: 1, sol: 'The middle room on the left, which used to be the café: B.', trap: '"Café" is mentioned, but it has moved upstairs.' },
    { id: 'lp2-lib-5', type: 'mcq', ...B('map', 2), group: 'library', q: '15 Newspapers and magazines', answer: 3, sol: 'Top right corner: D.' },
    { id: 'lp2-lib-6', type: 'mcq', ...B('map', 2), group: 'library', q: '16 Lift', answer: 6, sol: 'At the end of the corridor, in the centre: G.' },
    // festival mcq
    { id: 'lp2-fest-1', type: 'mcq', ...B('mcq', 2), group: 'festival', q: '11 This year the festival will last', options: ['one day.', 'two days.', 'three days.'], answer: 2, sol: 'Friday evening to Sunday night: three days.', trap: '"One-day event" was in past years.' },
    { id: 'lp2-fest-2', type: 'mcq', ...B('mcq', 2), group: 'festival', q: '12 The opening concert will be held', options: ['in the park.', 'on the beach.', 'at the harbour.'], answer: 1, sol: 'Moved from the park (being re-turfed) to the beach.' },
    { id: 'lp2-fest-3', type: 'mcq', ...B('mcq', 3), group: 'festival', q: '13 What do visitors have to pay for?', options: ['entry to the festival', 'the evening concerts', 'the food market'], answer: 1, sol: 'Entry is free; you pay only for the evening concerts.' },
    { id: 'lp2-fest-4', type: 'mcq', ...B('mcq', 3), group: 'festival', q: '14 Why have the organisers changed the food market?', options: ['Visitors disliked the food.', 'Visitors had to wait too long.', 'There were too many stalls.'], answer: 1, sol: 'People complained about long queues, "not the food", so they doubled the stalls.', trap: 'Option A uses "food", which is said, but denied.' },
    { id: 'lp2-fest-5', type: 'mcq', ...B('mcq', 2), group: 'festival', q: '15 For the sandcastle competition, children must', options: ['register before the day.', 'arrive by ten o\'clock.', 'bring their own judges.'], answer: 1, sol: 'No advance registration; just turn up by ten.' },
    { id: 'lp2-fest-6', type: 'mcq', ...B('mcq', 2), group: 'festival', q: '16 The best way to reach the festival is', options: ['by car.', 'by train only.', 'by a free bus from the station.'], answer: 2, sol: 'Extra buses from the station, free with a wristband; people are asked not to drive.' },
    // volunteer matching
    { id: 'lp2-vol-1', type: 'mcq', ...B('matching', 3), group: 'volunteer', q: '16 Feeding the animals', answer: 6, sol: 'The feeding round begins at six in the morning: G.', trap: '"The job everyone wants" sounds like D, but she says it is the opposite.' },
    { id: 'lp2-vol-2', type: 'mcq', ...B('matching', 2), group: 'volunteer', q: '17 Guiding visitors', answer: 3, sol: '"The job most of our volunteers choose": D, the most popular.' },
    { id: 'lp2-vol-3', type: 'mcq', ...B('matching', 2), group: 'volunteer', q: '18 Gift shop', answer: 1, sol: 'Volunteers only on Saturdays and Sundays: B.' },
    { id: 'lp2-vol-4', type: 'mcq', ...B('matching', 3), group: 'volunteer', q: '19 Newsletter', answer: 5, sol: 'On your own laptop, in your own time, never come in: F, from home.', trap: 'A laptop is mentioned, but nothing about computer skills (E).' },
    { id: 'lp2-vol-5', type: 'mcq', ...B('matching', 3), group: 'volunteer', q: '20 Rescue team', answer: 0, sol: 'A two-day course on handling animals: A. Heavy lifting (C) is denied: "the boxes are light".' },
    // sports mcq
    { id: 'lp2-sport-1', type: 'mcq', ...B('mcq', 3), group: 'sports', q: '11 What change will be made to opening hours?', options: ['The centre will open earlier.', 'The centre will close later on weeknights.', 'The pool will open at seven.'], answer: 1, sol: 'Opening at six was rejected; they will stay open until ten every weeknight.' },
    { id: 'lp2-sport-2', type: 'mcq', ...B('mcq', 3), group: 'sports', q: '12 What will happen to the gym?', options: ['It will get new equipment.', 'It will be made bigger.', 'It will move to the storage room.'], answer: 1, sol: 'Knocking through into the storage room to make it twice the size. The equipment is not being replaced.', trap: 'C uses words from the talk but the gym grows into the storage room, it does not move.' },
    { id: 'lp2-sport-3', type: 'mcq', ...B('mcq', 2), group: 'sports', q: '13 The gym will be closed for', options: ['one week.', 'two weeks.', 'the whole of October.'], answer: 1, sol: 'Two weeks in October; one week was hoped for but not possible.' },
    { id: 'lp2-sport-4', type: 'mcq', ...B('mcq', 2), group: 'sports', q: '14 What will cost more this year?', options: ['membership', 'swimming lessons', 'parking'], answer: 2, sol: 'Fees stay the same; only parking rises, by 50p.' },
  ],
};
