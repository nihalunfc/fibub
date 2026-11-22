// IELTS Listening Part 1: everyday conversations between two people, with form, note and table completion.
// Original scripts written for fibub. Each group's `audio` is read aloud by the browser (speechSynthesis):
// who 'A' and 'B' get different voices where the device has them; 'N' is the narrator.
// Answers: accepted spellings in `answer`; numbers accept digits or words where both are natural.
const L = (level, extra = {}) => ({ type: 'text', level, exams: ['academic', 'general'], facets: { skill: 'listening', part: '1', qtype: 'form' }, maxWords: 2, ...extra });

export default {
  topic: 'listening-part1',
  groups: {
    gym: {
      title: 'Joining a sports centre',
      passage: `<p><b>Questions 1 to 8.</b> Complete the form below. Write <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> for each answer.</p>
<table class="qb-form"><caption>Riverside Sports Centre: new member</caption>
<tr><td>Name</td><td>Daniel (1) ______</td></tr><tr><td>Address</td><td>(2) ______ Road, Westfield</td></tr>
<tr><td>Postcode</td><td>(3) ______</td></tr><tr><td>Membership type</td><td>(4) ______</td></tr>
<tr><td>Monthly fee</td><td>£(5) ______</td></tr><tr><td>Preferred class</td><td>(6) ______ on Thursday evenings</td></tr>
<tr><td>Medical note</td><td>Problem with his (7) ______</td></tr><tr><td>Heard about centre from</td><td>a (8) ______</td></tr></table>`,
      audio: [
        { who: 'N', text: 'You will hear a man phoning a sports centre to join. First, look at questions 1 to 8.' },
        { who: 'A', text: 'Good morning, Riverside Sports Centre. How can I help?' },
        { who: 'B', text: 'Hi, I would like to become a member, please.' },
        { who: 'A', text: 'Of course. I can take your details now. What is your name?' },
        { who: 'B', text: 'Daniel Okafor. That is O, K, A, F, O, R.' },
        { who: 'A', text: 'Thank you, Mr Okafor. And your address?' },
        { who: 'B', text: 'Flat 2, 48 Bramley Road. That is B, R, A, M, L, E, Y. In Westfield.' },
        { who: 'A', text: 'And the postcode?' },
        { who: 'B', text: 'W F 7, 3 L N.' },
        { who: 'A', text: 'W F 7, 3 L N. Lovely. Now, we have three types of membership. Off-peak, standard and premium.' },
        { who: 'B', text: 'I work in the daytime, so off-peak is no good for me. I was thinking of premium, but I do not really need the spa. So, standard, I think.' },
        { who: 'A', text: 'Standard is normally thirty-five pounds a month, but this month there is a discount, so you would pay twenty-nine pounds.' },
        { who: 'B', text: 'Great. Twenty-nine.' },
        { who: 'A', text: 'Are there any classes you are interested in? Yoga is very popular on Tuesdays.' },
        { who: 'B', text: 'I have tried yoga. I would rather do something faster. Is there a spinning class?' },
        { who: 'A', text: 'There is, but it is full until March. There is a circuit training class on Thursday evenings with spaces.' },
        { who: 'B', text: 'Circuit training on Thursdays. Perfect, put me down for that.' },
        { who: 'A', text: 'Do you have any injuries or medical conditions the trainers should know about?' },
        { who: 'B', text: 'My back is fine now, but I hurt my knee playing football last year, so I have to be a bit careful.' },
        { who: 'A', text: 'I will note that down. Finally, how did you hear about us? Was it our website?' },
        { who: 'B', text: 'No, actually, it was a colleague. She comes here every morning.' },
        { who: 'A', text: 'Wonderful. That is everything for now.' },
      ],
    },
    hall: {
      title: 'Booking a community hall',
      passage: `<p><b>Questions 1 to 7.</b> Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.</p>
<div class="qb-notes"><p><b>Booking: Oak Lane Community Hall</b></p><ul>
<li>Event: a (1) ______ party for about 40 guests</li><li>Date: Saturday (2) ______ June</li>
<li>Room chosen: the (3) ______ Room</li><li>Cost per hour: £(4) ______</li>
<li>Must leave the building by (5) ______ pm</li><li>Extra: hire of a (6) ______ for music</li>
<li>Deposit paid by: (7) ______</li></ul></div>`,
      audio: [
        { who: 'N', text: 'You will hear a woman booking a hall for a party. First, look at questions 1 to 7.' },
        { who: 'A', text: 'Oak Lane Community Hall, Peter speaking.' },
        { who: 'B', text: 'Hello. I would like to book the hall for a party. It is for my parents. It is their fortieth wedding anniversary.' },
        { who: 'A', text: 'Congratulations to them. How many guests?' },
        { who: 'B', text: 'We have invited sixty, but I think about forty will come.' },
        { who: 'A', text: 'And the date?' },
        { who: 'B', text: 'Saturday the fourteenth of June. Sorry, no, the fourteenth is a Friday. Saturday the fifteenth.' },
        { who: 'A', text: 'Saturday the fifteenth. Let me look. The Main Hall is booked that day, but the Garden Room is free. It holds fifty.' },
        { who: 'B', text: 'The Garden Room sounds lovely.' },
        { who: 'A', text: 'It is eighteen pounds an hour on weekdays and twenty-two pounds an hour at weekends.' },
        { who: 'B', text: 'So twenty-two for us. That is fine.' },
        { who: 'A', text: 'One thing: the licence means all guests must be out of the building by eleven pm. Cleaning up can happen until half past eleven.' },
        { who: 'B', text: 'Eleven. Understood. Do you have any equipment we could use? We have a projector already.' },
        { who: 'A', text: 'We can hire you a speaker for music, for ten pounds.' },
        { who: 'B', text: 'Yes, please, a speaker would be great.' },
        { who: 'A', text: 'We need a deposit of fifty pounds. You can pay by card over the phone, or bring cash.' },
        { who: 'B', text: 'I will pay by card now, if that is OK.' },
      ],
    },
    tour: {
      title: 'Booking a city walking tour',
      passage: `<p><b>Questions 1 to 6.</b> Complete the table below. Write <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> for each answer.</p>
<table class="qb-form"><thead><tr><th>Tour</th><th>Starts at</th><th>Length</th><th>Price</th></tr></thead><tbody>
<tr><td>Old Harbour</td><td>the (1) ______</td><td>90 minutes</td><td>£12</td></tr>
<tr><td>Street Food</td><td>Market Square</td><td>(2) ______ hours</td><td>£(3) ______ (food included)</td></tr>
<tr><td>Ghost Walk</td><td>outside the (4) ______</td><td>1 hour</td><td>£9; not suitable for children under (5) ______</td></tr>
</tbody></table><p>Booking name: Mrs (6) ______</p>`,
      audio: [
        { who: 'N', text: 'You will hear a tourist asking about city walking tours. Look at questions 1 to 6.' },
        { who: 'B', text: 'Hi, I picked up a leaflet about your walking tours. Could you tell me a bit more?' },
        { who: 'A', text: 'Of course. We run three. The Old Harbour tour starts at the lighthouse, not the bus station as it says in the old leaflet. It takes ninety minutes and costs twelve pounds.' },
        { who: 'B', text: 'And the food one?' },
        { who: 'A', text: 'The Street Food tour starts in Market Square. It used to be two hours, but people kept asking for more stops, so now it is three hours. It is thirty-five pounds, and that includes all the food.' },
        { who: 'B', text: 'Thirty-five. OK. And is there something in the evening?' },
        { who: 'A', text: 'The Ghost Walk. We meet outside the cathedral at eight. It is an hour long and costs nine pounds. Some of the stories are quite scary, so we say no children under twelve.' },
        { who: 'B', text: 'My son is fourteen, so that is fine. Can I book the Ghost Walk for two, please?' },
        { who: 'A', text: 'Certainly. What name is it?' },
        { who: 'B', text: 'Mrs Lindqvist. L, I, N, D, Q, V, I, S, T.' },
      ],
    },
    rental: {
      title: 'Renting a flat',
      passage: `<p><b>Questions 1 to 8.</b> Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.</p>
<div class="qb-notes"><p><b>Flat: 9 Castle Street</b></p><ul>
<li>Rent: £(1) ______ per month, bills not included</li><li>Number of bedrooms: (2) ______</li>
<li>The kitchen has a new (3) ______</li><li>No (4) ______ allowed</li>
<li>Nearest station: about (5) ______ minutes on foot</li><li>Parking: on the (6) ______</li>
<li>Available from: (7) ______ September</li><li>Viewing: Wednesday at (8) ______</li></ul></div>`,
      audio: [
        { who: 'N', text: 'You will hear a student calling about a flat to rent. Look at questions 1 to 8.' },
        { who: 'B', text: 'Hello, I am calling about the flat on Castle Street. Is it still available?' },
        { who: 'A', text: 'Number nine? Yes, it is. Would you like some details?' },
        { who: 'B', text: 'Please. How much is the rent?' },
        { who: 'A', text: 'It is eight hundred and fifty pounds a month. That does not include gas, electricity or internet.' },
        { who: 'B', text: 'And how many bedrooms?' },
        { who: 'A', text: 'The advert says three, but honestly the third is more of a study. So two proper bedrooms.' },
        { who: 'B', text: 'OK. What about the kitchen?' },
        { who: 'A', text: 'The cupboards are a little old, but the cooker is brand new, we put it in last month.' },
        { who: 'B', text: 'Good. I have a cat. Is that a problem?' },
        { who: 'A', text: 'I am afraid the owner does not allow pets of any kind. Smoking on the balcony is fine, though.' },
        { who: 'B', text: 'Oh. Well, my cat could stay with my parents. Is it near the station?' },
        { who: 'A', text: 'It is about a five-minute drive, or fifteen minutes on foot.' },
        { who: 'B', text: 'And parking?' },
        { who: 'A', text: 'There is no garage, but you can park on the street with a permit.' },
        { who: 'B', text: 'When could I move in?' },
        { who: 'A', text: 'The current tenants leave at the end of August, so from the first of September.' },
        { who: 'B', text: 'Could I see it this week?' },
        { who: 'A', text: 'Wednesday at ten past four?' },
        { who: 'B', text: 'Could we make it later? I have a lecture until five.' },
        { who: 'A', text: 'Then half past five.' },
        { who: 'B', text: 'Half past five on Wednesday. Great.' },
      ],
    },
    lostprop: {
      title: 'Reporting lost property',
      passage: `<p><b>Questions 1 to 7.</b> Complete the form below. Write <b>NO MORE THAN TWO WORDS AND/OR A NUMBER</b> for each answer.</p>
<table class="qb-form"><caption>City Transport: lost property report</caption>
<tr><td>Item</td><td>a black (1) ______</td></tr><tr><td>Lost on</td><td>bus number (2) ______</td></tr>
<tr><td>Time</td><td>about (3) ______ am</td></tr><tr><td>Contents</td><td>a laptop, a (4) ______ and some keys</td></tr>
<tr><td>Special feature</td><td>a (5) ______ on the front pocket</td></tr><tr><td>Owner's surname</td><td>(6) ______</td></tr>
<tr><td>Phone</td><td>(7) ______</td></tr></table>`,
      audio: [
        { who: 'N', text: 'You will hear a woman reporting a lost item to a bus company. Look at questions 1 to 7.' },
        { who: 'A', text: 'Lost property, how can I help?' },
        { who: 'B', text: 'I left my bag on a bus this morning. A black backpack.' },
        { who: 'A', text: 'Which bus was it?' },
        { who: 'B', text: 'The number seventy. No wait, I changed buses. It was the seventeen, from the hospital into town.' },
        { who: 'A', text: 'The seventeen. And what time?' },
        { who: 'B', text: 'I got on at about a quarter past eight and got off at about eight forty.' },
        { who: 'A', text: 'So about eight forty, when you got off. What was in the bag?' },
        { who: 'B', text: 'My laptop, which is the main worry, a notebook and my house keys. My purse is in my coat, luckily.' },
        { who: 'A', text: 'Anything that would help us recognise it?' },
        { who: 'B', text: 'There is a badge on the front pocket, a yellow badge shaped like a sun.' },
        { who: 'A', text: 'Lovely. Can I take your name?' },
        { who: 'B', text: 'Priya Ramanathan. R, A, M, A, N, A, T, H, A, N.' },
        { who: 'A', text: 'And a phone number?' },
        { who: 'B', text: 'Oh seven seven double oh, four nine one, three six two.' },
        { who: 'A', text: 'Zero seven seven zero zero, four nine one, three six two. We will call you if it comes in.' },
      ],
    },
    course: {
      title: 'Enrolling on an evening course',
      passage: `<p><b>Questions 1 to 7.</b> Complete the notes below. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.</p>
<div class="qb-notes"><p><b>Evening course enquiry</b></p><ul>
<li>Course wanted: beginners' (1) ______</li><li>Day: (2) ______</li><li>Length: (3) ______ weeks</li>
<li>Fee: £(4) ______ (with student discount)</li><li>Bring: an (5) ______ and comfortable shoes</li>
<li>First class in Room (6) ______</li><li>Teacher's name: (7) ______ Hart</li></ul></div>`,
      audio: [
        { who: 'N', text: 'You will hear a man asking about an evening course. Look at questions 1 to 7.' },
        { who: 'A', text: 'Adult Learning Centre, good evening.' },
        { who: 'B', text: 'Hi, I want to sign up for a course. I was looking at photography, but I see that is full. Do you still have the beginners\' pottery course?' },
        { who: 'A', text: 'Pottery, yes, there are a few places left. It runs on Mondays.' },
        { who: 'B', text: 'The website said Tuesdays.' },
        { who: 'A', text: 'It was moved this term. It is Mondays now, seven to nine.' },
        { who: 'B', text: 'Mondays is fine. How long is it?' },
        { who: 'A', text: 'Ten weeks. There is a break at half term, so it finishes in December.' },
        { who: 'B', text: 'And how much does it cost?' },
        { who: 'A', text: 'The full price is one hundred and twenty pounds. Are you a student or over sixty?' },
        { who: 'B', text: 'I am a student, yes.' },
        { who: 'A', text: 'Then it is ninety pounds.' },
        { who: 'B', text: 'Do I need to bring anything?' },
        { who: 'A', text: 'All the clay and tools are provided. Just bring an apron, because it gets messy, and wear shoes you can stand in for two hours.' },
        { who: 'B', text: 'Where do I go on the first night?' },
        { who: 'A', text: 'Room fourteen, on the ground floor. Later classes are in the studio.' },
        { who: 'B', text: 'And who is the teacher?' },
        { who: 'A', text: 'Joanna Hart. She is lovely.' },
      ],
    },
  },
  items: [
    // gym
    { id: 'lp1-gym-1', ...L(1), group: 'gym', q: '(1) Surname', answer: ['Okafor'], sol: 'He spells it: O, K, A, F, O, R.' },
    { id: 'lp1-gym-2', ...L(1), group: 'gym', q: '(2) ______ Road', answer: ['Bramley'], sol: '"48 Bramley Road", spelled B, R, A, M, L, E, Y. The flat and house number are not needed because the form already says "Road".' },
    { id: 'lp1-gym-3', ...L(2), group: 'gym', q: '(3) Postcode', answer: ['WF7 3LN', 'WF73LN'], sol: 'W F 7, 3 L N. Write it as WF7 3LN.', trap: 'Letters and numbers read in a row: write them down as you hear them, then tidy up.' },
    { id: 'lp1-gym-4', ...L(2), group: 'gym', q: '(4) Membership type', answer: ['standard'], sol: 'He rejects off-peak (he works days) and premium (does not need the spa), and chooses standard.', trap: 'All three types are mentioned. The answer is the one he finally chooses.' },
    { id: 'lp1-gym-5', ...L(2), group: 'gym', q: '(5) Monthly fee £______', answer: ['29', 'twenty-nine', 'twenty nine'], sol: 'Normally £35, but with this month\'s discount he pays £29.', trap: '35 is the normal price, said first.' },
    { id: 'lp1-gym-6', ...L(2), group: 'gym', q: '(6) ______ on Thursday evenings', answer: ['circuit training'], sol: 'Yoga is on Tuesdays (he prefers something faster) and spinning is full. Circuit training on Thursdays has spaces.' },
    { id: 'lp1-gym-7', ...L(2), group: 'gym', q: '(7) Problem with his ______', answer: ['knee'], sol: '"My back is fine now, but I hurt my knee."', trap: '"Back" is mentioned and then ruled out.' },
    { id: 'lp1-gym-8', ...L(2), group: 'gym', q: '(8) Heard about centre from a ______', answer: ['colleague'], sol: 'The receptionist suggests the website; he says "No, actually, it was a colleague."' },
    // hall
    { id: 'lp1-hall-1', ...L(1, { maxWords: 1 }), group: 'hall', q: '(1) a ______ party', answer: ['anniversary'], sol: 'Her parents\' fortieth wedding anniversary.', trap: 'Spelling: a-n-n-i-v-e-r-s-a-r-y.' },
    { id: 'lp1-hall-2', ...L(2, { maxWords: 1 }), group: 'hall', q: '(2) Saturday ______ June', answer: ['15', '15th', 'fifteenth'], sol: 'She first says the 14th, then corrects herself: the 14th is a Friday, so Saturday the 15th.', trap: 'Speakers often correct themselves. Wait for the final answer.' },
    { id: 'lp1-hall-3', ...L(2, { maxWords: 1 }), group: 'hall', q: '(3) the ______ Room', answer: ['Garden'], sol: 'The Main Hall is booked, so she chooses the Garden Room.' },
    { id: 'lp1-hall-4', ...L(2, { maxWords: 1 }), group: 'hall', q: '(4) Cost per hour £______', answer: ['22', 'twenty-two'], sol: '£18 on weekdays, £22 at weekends. The party is on a Saturday.', trap: 'Two prices: you must work out which applies.' },
    { id: 'lp1-hall-5', ...L(2, { maxWords: 1 }), group: 'hall', q: '(5) Leave the building by ______ pm', answer: ['11', 'eleven', '11.00', '11:00'], sol: 'Guests out by 11 pm; cleaning until 11.30 does not change when guests must leave.' },
    { id: 'lp1-hall-6', ...L(1, { maxWords: 1 }), group: 'hall', q: '(6) hire of a ______ for music', answer: ['speaker'], sol: 'They already have a projector; they hire a speaker for £10.' },
    { id: 'lp1-hall-7', ...L(2, { maxWords: 1 }), group: 'hall', q: '(7) Deposit paid by ______', answer: ['card'], sol: 'Card or cash are offered; she pays by card.' },
    // tour
    { id: 'lp1-tour-1', ...L(2), group: 'tour', q: '(1) Old Harbour tour starts at the ______', answer: ['lighthouse'], sol: '"Starts at the lighthouse, not the bus station as it says in the old leaflet."' },
    { id: 'lp1-tour-2', ...L(2), group: 'tour', q: '(2) Street Food: ______ hours', answer: ['3', 'three'], sol: 'It used to be two hours; now it is three.' },
    { id: 'lp1-tour-3', ...L(1), group: 'tour', q: '(3) Street Food price £______', answer: ['35', 'thirty-five'], sol: 'Thirty-five pounds, food included.', trap: 'Do not mix up 35 and 53, or thirty and thirteen-style numbers.' },
    { id: 'lp1-tour-4', ...L(1), group: 'tour', q: '(4) Ghost Walk meets outside the ______', answer: ['cathedral'], sol: '"We meet outside the cathedral at eight."' },
    { id: 'lp1-tour-5', ...L(2), group: 'tour', q: '(5) not suitable for children under ______', answer: ['12', 'twelve'], sol: 'No children under twelve. Her son is fourteen, which is a distractor.' },
    { id: 'lp1-tour-6', ...L(1), group: 'tour', q: '(6) Booking name: Mrs ______', answer: ['Lindqvist'], sol: 'Spelled L, I, N, D, Q, V, I, S, T.' },
    // rental
    { id: 'lp1-rent-1', ...L(1, { maxWords: 1 }), group: 'rental', q: '(1) Rent £______ per month', answer: ['850'], sol: '"Eight hundred and fifty pounds a month." Write 850.' },
    { id: 'lp1-rent-2', ...L(3, { maxWords: 1 }), group: 'rental', q: '(2) Number of bedrooms', answer: ['2', 'two'], sol: 'The advert says three, but the third is really a study: two proper bedrooms.', trap: 'The first number you hear is corrected.' },
    { id: 'lp1-rent-3', ...L(2, { maxWords: 1 }), group: 'rental', q: '(3) The kitchen has a new ______', answer: ['cooker'], sol: 'The cupboards are old; the cooker is brand new.', trap: '"Brand new" is a paraphrase of "new".' },
    { id: 'lp1-rent-4', ...L(2, { maxWords: 1 }), group: 'rental', q: '(4) No ______ allowed', answer: ['pets', 'animals'], sol: '"The owner does not allow pets of any kind." Smoking on the balcony is allowed.' },
    { id: 'lp1-rent-5', ...L(2, { maxWords: 1 }), group: 'rental', q: '(5) about ______ minutes on foot', answer: ['15', 'fifteen'], sol: 'Five minutes is by car; fifteen on foot.' },
    { id: 'lp1-rent-6', ...L(1, { maxWords: 1 }), group: 'rental', q: '(6) Parking: on the ______', answer: ['street'], sol: 'No garage; park on the street with a permit.' },
    { id: 'lp1-rent-7', ...L(2, { maxWords: 1 }), group: 'rental', q: '(7) Available from ______ September', answer: ['1', '1st', 'first'], sol: 'Tenants leave at the end of August, so from the first of September.' },
    { id: 'lp1-rent-8', ...L(3, { maxWords: 1 }), group: 'rental', q: '(8) Viewing: Wednesday at ______', answer: ['5.30', '5:30', '17.30', '17:30', '5.30pm', '5:30pm'], sol: 'Ten past four is suggested, but he has a lecture until five, so they agree on half past five.', trap: 'The time changes. "Half past five" is written 5.30.' },
    // lost property
    { id: 'lp1-lost-1', ...L(1), group: 'lostprop', q: '(1) a black ______', answer: ['backpack', 'back pack', 'rucksack'], sol: '"A black backpack."' },
    { id: 'lp1-lost-2', ...L(2), group: 'lostprop', q: '(2) bus number ______', answer: ['17', 'seventeen'], sol: 'She first says seventy, then corrects herself: the seventeen.', trap: 'Seventy and seventeen: listen for the stress, se-ven-TEEN versus SE-ven-ty.' },
    { id: 'lp1-lost-3', ...L(3), group: 'lostprop', q: '(3) about ______ am', answer: ['8.40', '8:40', 'eight forty'], sol: 'The clerk asks when she got off: about 8.40.', trap: '8.15 is when she got on.' },
    { id: 'lp1-lost-4', ...L(2), group: 'lostprop', q: '(4) a laptop, a ______ and some keys', answer: ['notebook'], sol: 'Laptop, notebook and house keys. The purse was in her coat.' },
    { id: 'lp1-lost-5', ...L(2), group: 'lostprop', q: '(5) a ______ on the front pocket', answer: ['badge', 'yellow badge'], sol: 'A yellow badge shaped like a sun.' },
    { id: 'lp1-lost-6', ...L(2), group: 'lostprop', q: '(6) Owner\'s surname', answer: ['Ramanathan'], sol: 'Spelled R, A, M, A, N, A, T, H, A, N.' },
    { id: 'lp1-lost-7', ...L(3, { maxWords: undefined }), group: 'lostprop', q: '(7) Phone', answer: ['07700491362', '07700 491362', '07700 491 362'], sol: '"Oh seven seven double oh, four nine one, three six two" = 07700 491 362.', trap: '"Double oh" means two zeros. "Oh" means zero.' },
    // course
    { id: 'lp1-course-1', ...L(2, { maxWords: 1 }), group: 'course', q: '(1) beginners\' ______', answer: ['pottery'], sol: 'Photography is full; he asks for pottery.' },
    { id: 'lp1-course-2', ...L(2, { maxWords: 1 }), group: 'course', q: '(2) Day', answer: ['Monday', 'Mondays'], sol: 'The website said Tuesdays, but the course moved to Mondays.' },
    { id: 'lp1-course-3', ...L(1, { maxWords: 1 }), group: 'course', q: '(3) Length: ______ weeks', answer: ['10', 'ten'], sol: '"Ten weeks."' },
    { id: 'lp1-course-4', ...L(2, { maxWords: 1 }), group: 'course', q: '(4) Fee £______ (with student discount)', answer: ['90', 'ninety'], sol: 'Full price £120; for a student, £90.' },
    { id: 'lp1-course-5', ...L(2, { maxWords: 1 }), group: 'course', q: '(5) Bring: an ______', answer: ['apron'], sol: 'Clay and tools are provided; bring an apron.', trap: 'The form says "an", which hints the word starts with a vowel sound.' },
    { id: 'lp1-course-6', ...L(1, { maxWords: 1 }), group: 'course', q: '(6) First class in Room ______', answer: ['14', 'fourteen'], sol: 'Room fourteen, ground floor.' },
    { id: 'lp1-course-7', ...L(1, { maxWords: 1 }), group: 'course', q: '(7) Teacher: ______ Hart', answer: ['Joanna'], sol: '"Joanna Hart."' },
  ],
};
