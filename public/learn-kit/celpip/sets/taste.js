// A first taste of CELPIP-style listening (lesson 1.1). Original scripts and questions by fibub.
export default {
  title: 'a first taste of CELPIP listening',
  accent: 'en-CA',
  groups: {
    g1: { title: 'Listen to a conversation between two neighbours.', audio: [
      { who: 'A', name: 'Priya', text: 'Hi Mark, sorry to bother you. Did you get a notice about the water being shut off tomorrow?' },
      { who: 'B', name: 'Mark', text: 'I did. The building manager slipped it under the door last night. It says from nine in the morning until about two.' },
      { who: 'A', name: 'Priya', text: 'Oh no. I work from home on Thursdays, and I have clients calling all morning. I was hoping to at least make coffee.' },
      { who: 'B', name: 'Mark', text: 'Fill a couple of jugs tonight. That is what I always do. And the community centre on Elm Street is open from eight if you need a washroom.' },
      { who: 'A', name: 'Priya', text: 'Good idea. I might just work from the library instead. It is quieter there anyway.' },
    ] },
    g2: { title: 'Listen to a conversation at work.', audio: [
      { who: 'A', name: 'Daniel', text: 'Lena, have you got a minute? The client moved our meeting from Friday to Wednesday.' },
      { who: 'B', name: 'Lena', text: 'Wednesday? That is two days earlier. The sales figures will not be ready until Thursday.' },
      { who: 'A', name: 'Daniel', text: 'I know. I was thinking we could show them last month’s numbers and promise the new ones by email on Friday.' },
      { who: 'B', name: 'Lena', text: 'That could work, but I would rather ask Sam in accounts if he can give us a rough estimate by Tuesday. Clients like to see something current.' },
      { who: 'A', name: 'Daniel', text: 'Fair enough. Can you message him? I will update the slides.' },
    ] },
    g3: { title: 'Listen to a phone call to a dental office.', audio: [
      { who: 'A', name: 'Receptionist', text: 'Bright Smile Dental, how can I help you?' },
      { who: 'B', name: 'Caller', text: 'Hi, I have a cleaning booked for next Monday at ten, but my daughter’s school just called a parent meeting at the same time.' },
      { who: 'A', name: 'Receptionist', text: 'No problem. I have Tuesday at four thirty, or Wednesday at eight in the morning.' },
      { who: 'B', name: 'Caller', text: 'Tuesday afternoon works better, since I start work at eight. Will there be a fee for changing it?' },
      { who: 'A', name: 'Receptionist', text: 'Not at all. We only charge if you cancel with less than twenty-four hours’ notice.' },
    ] },
  },
  items: [
    { id: 'ta-01', type: 'mcq', group: 'g1', q: 'What is Priya worried about?', options: ['Working without water during her calls', 'Finding a new apartment', 'A late rent payment', 'A broken coffee machine'], answer: 0, sol: 'She works from home on Thursdays and has calls all morning, which is exactly when the water is off.' },
    { id: 'ta-02', type: 'mcq', group: 'g1', q: 'What will Priya probably do tomorrow?', options: ['Work at the library', 'Go to the community centre all day', 'Ask the manager to change the date', 'Take the day off'], answer: 0, sol: 'Her last line: "I might just work from the library instead."', trap: 'Mark mentions the community centre, but only for the washroom. Speakers often mention places or ideas that are not the answer.' },
    { id: 'ta-03', type: 'mcq', group: 'g2', q: 'Why is the new meeting date a problem?', options: ['The new sales figures will not be ready', 'Lena is on holiday on Wednesday', 'The slides are lost', 'The client wants a lower price'], answer: 0, sol: 'Lena says the sales figures will not be ready until Thursday, after the new Wednesday meeting.' },
    { id: 'ta-04', type: 'mcq', group: 'g2', q: 'What does Lena suggest?', options: ['Asking a colleague for a rough estimate first', 'Cancelling the meeting', 'Showing only last month’s numbers', 'Emailing the client today'], answer: 0, sol: 'She would "rather ask Sam in accounts" for a rough estimate by Tuesday.', trap: 'Showing last month’s numbers was Daniel’s idea, which Lena politely changes. Listen for "I would rather..." as a sign of a new suggestion.' },
    { id: 'ta-05', type: 'mcq', group: 'g3', q: 'Why does the caller want to change the appointment?', options: ['She has a meeting at her daughter’s school', 'She is sick', 'She starts a new job on Monday', 'The dentist is away'], answer: 0, sol: 'The school "called a parent meeting at the same time".' },
    { id: 'ta-06', type: 'mcq', group: 'g3', q: 'When is the new appointment?', options: ['Tuesday at 4:30 p.m.', 'Wednesday at 8:00 a.m.', 'Monday at 10:00 a.m.', 'Tuesday at 8:00 a.m.'], answer: 0, sol: 'She says Tuesday afternoon works better because she starts work at eight.', trap: 'Wednesday at eight is offered, but she rejects it: she starts work at eight.' },
  ],
};
