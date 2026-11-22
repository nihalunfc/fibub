// IELTS General Training Reading: Sections 1 to 3 with full question sets. Original texts written for fibub;
// all places and organisations are fictional and nothing is taken from any book or test. UK spelling throughout.
const G = (part, qtype, level, extra = {}) => ({ level, exams: ['general'], facets: { skill: 'reading', part: String(part), qtype }, ...extra });
const TFNG = ['TRUE', 'FALSE', 'NOT GIVEN'];
const YNNG = ['YES', 'NO', 'NOT GIVEN'];
// T: typed answer; M: multiple choice with own options; O: item whose options come from group.options
const T = (id, part, qtype, level, group, maxWords, q, answer, sol, trap) => ({ id, type: 'text', ...G(part, qtype, level, { maxWords }), group, q, answer, sol, ...(trap ? { trap } : {}) });
const M = (id, part, qtype, level, group, q, options, answer, sol, trap) => ({ id, type: 'mcq', ...G(part, qtype, level), group, q, options, answer, sol, ...(trap ? { trap } : {}) });

// ---------------------------------------------------------------- Section 1
const CLASSES = `<h3>Evening and weekend classes at Millbrook Community Centre</h3>
<p><b>A &nbsp;Beginners' Pottery</b><br>Tuesdays, 6.30 to 8.30 pm, for 8 weeks. Fee £96, which includes clay and firing of your finished pieces. Maximum: 10 students. Please bring an apron.</p>
<p><b>B &nbsp;Conversational Spanish</b><br>Mondays and Thursdays, 7 to 8 pm, for 6 weeks. Fee £70; the course book costs £12 extra. Taught by a native speaker. For complete beginners.</p>
<p><b>C &nbsp;Family Cooking on a Budget</b><br>Saturdays, 10 am. Children from the age of 8 are welcome when they come with an adult. All ingredients are provided. Free for families who receive council support; £8 per family for everyone else.</p>
<p><b>D &nbsp;Photography with Your Phone</b><br>Wednesdays, 7 pm, for 4 weeks. No experience needed, but please bring your own phone. The course ends with a small exhibition of students' work in the foyer.</p>
<p><b>E &nbsp;Choir for Everyone</b><br>Fridays, 6 pm. No auditions and no fixed fee: pay what you can. Sheet music is provided. The choir sings at the spring fair in May.</p>
<p><b>F &nbsp;Computer Skills for Over-60s</b><br>Thursdays, 2 pm. Friendly one-to-one help with email, video calls and online shopping. £5 per session. Tea and biscuits are provided.</p>`;

const POOL = `<h3>Riverside Leisure Centre: Swimming Pool Information</h3>
<table>
<tr><th>Ticket</th><th>Price</th></tr>
<tr><td>Adult</td><td>£4.50</td></tr>
<tr><td>Child (5 to 15 years)</td><td>£2.50</td></tr>
<tr><td>Child under 5</td><td>Free with a paying adult</td></tr>
<tr><td>Senior (over 65)</td><td>£3.00</td></tr>
<tr><td>Family (2 adults and up to 3 children)</td><td>£12.00</td></tr>
<tr><td>Adult ten-visit card</td><td>£36.00</td></tr>
</table>
<h3>Opening times</h3>
<ul>
<li>Monday to Friday: 6.30 am to 9.00 pm (lane swimming only until 8.30 am)</li>
<li>Saturday and Sunday: 8.00 am to 6.00 pm</li>
<li>Wednesday, 1.00 to 3.00 pm: parent and toddler session</li>
<li>Closed on 25 December and 1 January. The pool is also closed for a deep clean during the first week of September.</li>
</ul>
<h3>Please remember</h3>
<ul>
<li>Everyone must take a shower before swimming.</li>
<li>Swimmers with long hair must wear a cap.</li>
<li>Children under 8 must be accompanied by an adult in the water.</li>
<li>No running on the poolside, and no glass anywhere in the building.</li>
<li>Lockers cost £1 per visit.</li>
</ul>`;

const FLATS = `<h3>Eastbrook Lettings: Homes to rent this month</h3>
<p><b>A</b> Furnished studio flat, ten minutes' walk from the railway station. £620 a month, all bills included. Available from 1 March. No pets.</p>
<p><b>B</b> Two-bedroom flat with a private garden and a parking space, close to the primary school. £950 a month, unfurnished. Pets welcome. Available immediately.</p>
<p><b>C</b> Single room in a shared house for students. £380 a month, internet included. You will share the kitchen and bathroom with three other people. Bus stop outside. Available from 1 February.</p>
<p><b>D</b> One-bedroom furnished flat above a bakery, on the third floor (no lift). £700 a month, bills not included. Sunny balcony. Available from 15 March.</p>
<p><b>E</b> Three-bedroom family house with a large garden and a garage, next to the park. £1,400 a month, unfurnished. Minimum contract: 12 months. Available from 1 April.</p>
<h3>How to arrange a viewing</h3>
<p>Phone our office on 555 0142 between 9 am and 5.30 pm, Monday to Friday. Viewings take place on Saturday mornings. Please bring photo ID and proof of address.</p>
<p>If you decide to rent, a holding deposit equal to one week's rent keeps the property for you for seven days. The main deposit equals one month's rent and is returned at the end of your contract. Tenants pay no agency fee. Contracts are signed at our office.</p>`;

// ---------------------------------------------------------------- Section 2
const LEAVE = `<h3>Brightwell Foods: Staff Handbook, Section 6 (Leave)</h3>
<h3>Annual leave</h3>
<p>Full-time employees receive 25 days of paid annual leave each year, plus public holidays. Part-time employees receive the same entitlement in proportion to the hours they work. The leave year runs from 1 January to 31 December.</p>
<p>Please request leave at least two weeks ahead using the online form. In December, no more than two members of a team may be away at the same time. Taking more than ten days in a row needs the approval of a director.</p>
<p>Up to five unused days may be carried over into the next year, but only if your manager agrees before 30 November.</p>
<h3>Sick leave</h3>
<p>If you are ill, you must phone your manager before 9 am on the first day. Messages and emails are not accepted. After seven days of sickness you must give us a doctor's note.</p>
<p>You will receive full pay for the first ten days of sickness in a leave year, and half pay for the next twenty days. When you return, your manager will have a short chat with you about whether you need any support.</p>
<h3>Compassionate leave</h3>
<p>Employees may take three days of paid leave after the death of a close relative.</p>`;

const JOB = `<h3>Harbour View Hotel: Receptionist wanted (part-time)</h3>
<p>We are looking for a friendly, organised receptionist to join our front-desk team.</p>
<ul>
<li><b>Hours:</b> 24 hours a week, mostly evenings and weekends</li>
<li><b>Pay:</b> £13.50 per hour</li>
<li><b>Start date:</b> 3 January</li>
</ul>
<h3>About you</h3>
<p>You must have a good level of spoken English. A second language is an advantage. Hotel experience is helpful but not essential, because we offer two weeks of paid training. We provide a uniform, but you must supply your own black shoes. All staff receive a 30% discount on meals in the hotel restaurant.</p>
<h3>How to apply</h3>
<p>Send your CV and a covering letter of no more than one page by email to jobs@harbourview.example. The closing date is 12 December. Please do not telephone the hotel.</p>
<p>Interviews will be held during the week of 18 December. Shortlisted candidates will also be asked to do a short computer test. Two references are requested only when a job has been offered.</p>`;

const KITCHEN = `<h3>Welcome to the kitchen: health and safety for new staff (Corner Table Catering)</h3>
<p><b>Section A</b> Everyone must wash their hands for at least 20 seconds before starting work, after using the toilet, after touching raw meat, and whenever they have touched their face or hair. Use the hand basin only for hands; never wash vegetables or utensils in it.</p>
<p><b>Section B</b> Fridges must be kept at 5 degrees Celsius or below, and freezers at minus 18. Hot food must be kept above 63 degrees until served. Cooked food must not be left out of the fridge for more than two hours. Check and sign the temperature record twice a day.</p>
<p><b>Section C</b> Wipe up spills at once and put out a yellow warning sign until the floor is dry. Keep walkways clear of boxes and bags. Wear the non-slip shoes provided, and never run in the kitchen.</p>
<p><b>Section D</b> Bend your knees and keep the load close to your body. Do not lift more than 20 kilograms on your own: use a trolley or ask a colleague for help. Never lift heavy items above shoulder height.</p>
<p><b>Section E</b> Always carry a knife with the blade pointing down, and never try to catch one that is falling. Keep knives sharp, because blunt knives slip. Unplug machines before cleaning them, and do not use the slicer until you have been trained.</p>
<p><b>Section F</b> If the fire alarm sounds, leave at once and meet at the assembly point in the car park. Do not use the lift. The first-aid kit is on the wall beside the back door. Every accident, however small, must be written in the accident book.</p>`;

// ---------------------------------------------------------------- Section 3
const COURIER = `<h3>The bicycle courier: a short history</h3>
<p><b>A</b> Anyone who has waited at a busy city crossing has seen them: riders in bright jackets, bags across their chests, slipping between the buses. The bicycle courier looks like a modern figure, a product of the age of smartphones, yet the job is more than a century old. Its history is a story about how cities, technology and work keep reshaping one another. The people who do it are rarely thanked and often overlooked, so it is worth asking where the job came from, why it nearly vanished, and why it has returned in a new form.</p>
<p><b>B</b> The first couriers were not cyclists at all. In the nineteenth century, as telegraph offices opened in growing commercial districts, companies hired boys to carry messages the last few streets from the office to the person who needed them. They went on foot, and the work was tiring and poorly paid. When the safety bicycle, with two wheels of equal size and a chain, became affordable in the 1890s, many firms saw an opportunity. A boy on a bicycle could cover far more ground in a day than one on foot, and the cost of the machine was soon recovered in the number of deliveries. Employers valued speed above everything, and the best riders learned every short cut, back lane and staircase in their district. Messages that once took an hour to reach their destination could now arrive in a quarter of that time, which suited the banks, newspapers and shops that depended on them.</p>
<p><b>C</b> The profession then went into a long decline. As telephones spread through offices and homes, fewer urgent messages needed to be carried by hand, and as vans and motorcycles became cheaper, firms preferred them for anything heavy or distant. By the middle of the twentieth century the bicycle messenger had become a rarity in many cities, a surviving fragment of an earlier age. Some historians suggest that the job lasted mainly in the busiest financial districts, where traffic made motor vehicles slow. Wages fell, and for many young workers the job lost its appeal as better-paid work appeared in offices and factories.</p>
<p><b>D</b> A revival began in the 1970s and 1980s. City centres had grown crowded with cars, yet legal papers, contracts and printed designs still had to travel quickly between offices that were a short distance apart. Couriers on bicycles could often beat vans through the congestion, and they could take shortcuts that no vehicle could use. Radio dispatchers, who sent instructions to riders as jobs came in, made the system far more efficient, and the courier company became a recognised kind of business. Riders developed a culture of their own, with stripped-down bicycles, distinctive clothing and informal races, and the courier became a symbol of urban independence in films and fashion. Clients soon found that they would pay extra for a package delivered within the hour, and some firms built their reputations on never being late, whatever the weather.</p>
<p><b>E</b> The next change came from technology of a different kind. Email, and later the sharing of electronic documents, removed the need to send so many papers across town. Courier firms that had grown on legal and architectural work saw their volumes fall sharply during the 2000s, and many closed or merged. Those that survived diversified, offering the delivery of medical samples, small parcels, and items that cannot be sent electronically, such as keys and original certificates. Some riders left the trade altogether, while others moved into dispatching or started small firms of their own. The years of change were hard, but they left the industry leaner and more flexible than before.</p>
<p><b>F</b> Then came the smartphone. Food-delivery and parcel platforms recruited very large numbers of riders, matching them to orders using location data. Cyclists and, increasingly, riders of electric bikes and scooters became part of the daily scenery of many cities. Yet the new arrangement differs from the old in important ways. Many platform riders are classed as self-employed, so they are paid for each delivery, may receive no sick pay and must pay for their own equipment. Traditional couriers often worked in teams with a dispatcher who knew them by name, whereas a platform rider may deal with nothing more personal than an app. The change was rapid: within a few years, a service that had once needed an office, a radio and a team of dispatchers could be run by a small group of programmers and a few thousand people with phones.</p>
<p><b>G</b> Where does the profession go next? City planners increasingly want to reduce the number of vans on narrow streets, and some are testing cargo bicycles that can carry several hundred kilograms, together with small local hubs where parcels are moved from lorries to bikes for the final journey. If these ideas work, the bicycle courier may become less a fashion and more an ordinary part of urban logistics. Whether the people who do the job will be better protected than their predecessors remains an open question, and one that lawmakers in several countries are now examining. Several cities have also begun to build separated cycle lanes, partly because couriers and commuters alike find them safer, and the shape of the streets may decide how quickly these ideas spread.</p>`;

const LIBRARY = `<h3>The public library reinvents itself</h3>
<p><b>A</b> When people hear the word "library", most still picture silent rooms of shelves, a stern desk and a rule against talking. Yet in many towns the public library has become one of the busiest community spaces. In some places the number of printed books borrowed has fallen, and observers once predicted that libraries would disappear with the arrival of the internet. They did not. Instead, they have changed what they offer. Their story is worth telling, because it shows how a public institution can survive by listening to the people it serves instead of defending the past.</p>
<p><b>B</b> The first public libraries paid for by taxes appeared in the nineteenth century, when reformers argued that free access to books would help working people to improve themselves. These libraries were built as grand, serious buildings, and borrowers were expected to behave accordingly. For a hundred years the model barely changed: a collection of books, a catalogue, a counter and a quiet reading room. Membership was often free, and for many families a library card was the first access they had to a large collection of reading. Librarians of the period saw themselves as protectors of order and quiet, and the rules posted on the walls reflected that.</p>
<p><b>C</b> The first major shock was electronic. As online encyclopaedias and search engines made basic facts instantly available, some councils began to ask why they should pay for reference shelves. Libraries responded by buying computers and offering free internet access, which proved to be of great importance to people without a connection at home, such as jobseekers filling in online forms or older residents learning to use email. In other words, the library did not compete with the internet; it became a door to it. Staff had to learn quickly, since many visitors needed help not only with the machines but also with understanding what they found on the screen. Training sessions for beginners soon became a regular part of the weekly programme.</p>
<p><b>D</b> A second change concerns the space itself. Many newly designed libraries have fewer shelves and more room to sit, meet and work. Cafés, children's areas, meeting rooms and quiet study booths now share a building with the books. Some include "makerspaces", workshops equipped with 3D printers, sewing machines and recording equipment that members can use after a short introduction. Librarians in these places describe their role less as guardians of a collection and more as guides who help people find what they need, whether that is a book, a skill or another person who shares an interest. Natural light, comfortable chairs and flexible furniture are common, and some buildings have been designed so that a quiet corner and a noisy workshop can exist under the same roof without disturbing each other. Visitors who once came for ten minutes now stay for an afternoon.</p>
<p><b>E</b> Not everyone is convinced. Critics argue that libraries risk losing their central purpose if they try to do everything. A building with a busy café and a games room, they say, may attract visitors, but visitors are not the same as readers, and counting entrances is a poor measure of success. Supporters reply that a person who comes in for a free film evening may leave with a novel, and that the library's willingness to welcome everyone is exactly what makes it valuable. They also worry that the money spent on equipment and furniture might have been better used to buy more books for the collection.</p>
<p><b>F</b> Funding is the other difficulty. Libraries are usually paid for by local government, and when budgets tighten they are an easy target: unlike a road or a hospital, their benefits are spread thinly and are hard to measure. Several towns have responded by closing small branches or cutting opening hours, and in some cases volunteers now run services once offered by paid staff. Defenders point out that the people who lose most when libraries shrink are those with the fewest alternatives: children from homes with few books, people without internet access, and anyone who cannot afford to buy what they wish to read. Some councils have tried to share buildings with other services, such as health clinics or advice centres, so that the costs are spread and visitors have more reasons to come.</p>
<p><b>G</b> Looking ahead, many libraries are experimenting with lending things other than books: tools, musical instruments, seeds and even fishing rods. Electronic books and audiobooks, borrowed through a phone app, now sit alongside printed volumes. What is likely to endure, most librarians say, is not any particular object but the idea that knowledge and shared space should be open to everyone. A library, in this view, is less a building than a promise. Others are creating small collections in railway stations and community halls, so that a book is never far away. Whatever form it takes, the library of the future will probably look quite different from the one in most people's memories.</p>`;

export default {
  topic: 'reading-general',
  groups: {
    classes: {
      title: 'Section 1: Evening classes (matching)',
      passage: `<p><b>Look at the six adverts, A to F.</b> For which class are the following statements true? Choose the correct letter, A to F. You may use any letter more than once.</p>` + CLASSES,
      options: ['A Beginners\' Pottery', 'B Conversational Spanish', 'C Family Cooking on a Budget', 'D Photography with Your Phone', 'E Choir for Everyone', 'F Computer Skills for Over-60s'],
    },
    classesQ: {
      title: 'Section 1: Evening classes (short answers)',
      passage: `<p><b>Answer the questions below.</b> Write NO MORE THAN THREE WORDS AND/OR A NUMBER from the adverts for each answer.</p>` + CLASSES,
    },
    pool: {
      title: 'Section 1: Swimming pool notice',
      passage: `<p><b>Read the notice below.</b> Questions 1 to 7: write TRUE if the statement agrees with the information, FALSE if it contradicts it, and NOT GIVEN if there is no information on this. Questions 8 to 13: answer in NO MORE THAN THREE WORDS AND/OR A NUMBER.</p>` + POOL,
    },
    flats: {
      title: 'Section 1: Homes to rent (matching)',
      passage: `<p><b>Look at the five adverts, A to E.</b> Which home matches each statement? Write the correct letter, A to E. You may use any letter more than once.</p>` + FLATS,
      options: ['A Furnished studio', 'B Two-bedroom flat with garden', 'C Room in a shared house', 'D One-bedroom flat above the bakery', 'E Three-bedroom house'],
    },
    flatsQ: {
      title: 'Section 1: How to arrange a viewing (completion)',
      passage: `<p><b>Complete the sentences using the information in the text.</b> Write NO MORE THAN TWO WORDS for each answer.</p>` + FLATS,
    },
    leave: {
      title: 'Section 2: Staff handbook on leave',
      passage: `<p><b>Read the handbook page.</b> Questions 1 to 6: complete the sentences with NO MORE THAN TWO WORDS OR A NUMBER from the text. Questions 7 to 13: write TRUE, FALSE or NOT GIVEN.</p>` + LEAVE,
    },
    job: {
      title: 'Section 2: Job advertisement and how to apply',
      passage: `<p><b>Read the advertisement.</b> Questions 1 to 6: answer in NO MORE THAN THREE WORDS AND/OR A NUMBER. Questions 7 to 13: choose the correct letter, A, B, C or D.</p>` + JOB,
    },
    kitchenH: {
      title: 'Section 2: Kitchen safety guide (headings)',
      passage: `<p><b>The guide has six sections, A to F.</b> Choose the correct heading for each section from the list of headings below. There are more headings than sections.</p>` + KITCHEN,
      options: ['i Keeping floors clear and dry', 'ii Working safely with knives and machines', 'iii What to do in an emergency', 'iv Washing and personal cleanliness', 'v Storing and serving food at safe temperatures', 'vi Protecting your back', 'vii Choosing the right uniform', 'viii Dealing with food waste', 'ix Giving allergy information to customers'],
    },
    kitchenS: {
      title: 'Section 2: Kitchen safety guide (completion)',
      passage: `<p><b>Complete the sentences.</b> Write NO MORE THAN TWO WORDS OR A NUMBER from the guide for each answer.</p>` + KITCHEN,
    },
    courierH: {
      title: 'Section 3: The bicycle courier (headings)',
      passage: `<p><b>The passage has seven paragraphs, A to G.</b> Choose the correct heading for paragraphs B to G from the list. There are more headings than paragraphs.</p>` + COURIER,
      options: ['i Competition from telephones and motor vehicles', 'ii Fewer papers to carry, and new things to deliver', 'iii Early messengers and a new machine', 'iv Possible futures for city delivery', 'v An old job given new life by crowded streets', 'vi How apps have changed riders\' working conditions', 'vii The decline of the telegraph', 'viii Why couriers prefer electric bikes', 'ix The dangers of cycling in traffic'],
    },
    courierQ: {
      title: 'Section 3: The bicycle courier (questions)',
      passage: `<p><b>Questions 7 to 9:</b> write TRUE, FALSE or NOT GIVEN. <b>Question 10:</b> write YES, NO or NOT GIVEN according to the writer's views. <b>Questions 11 to 13:</b> choose the correct letter, A, B, C or D.</p>` + COURIER,
    },
    libraryQ: {
      title: 'Section 3: The public library (questions)',
      passage: `<p><b>Questions 1 to 5:</b> do the statements agree with the views of the writer? Write YES, NO or NOT GIVEN. <b>Questions 6 to 8:</b> choose the correct letter, A, B, C or D.</p>` + LIBRARY,
    },
    librarySum: {
      title: 'Section 3: The public library (summary)',
      passage: `<p><b>Complete the summary below.</b> Choose ONE WORD ONLY from the passage for each answer.</p>` + LIBRARY,
    },
  },
  items: [
    // ---- Section 1a: classes, matching information (6) + short answers (7)
    { id: 'rg-cls-1', type: 'mcq', ...G(1, 'matchinfo', 1), group: 'classes', q: '1 Which class ends with a public display of students\' work?', answer: 3, sol: 'Advert D: "The course ends with a small exhibition of students\' work in the foyer."' },
    { id: 'rg-cls-2', type: 'mcq', ...G(1, 'matchinfo', 1), group: 'classes', q: '2 Which class has no fixed fee?', answer: 4, sol: 'Advert E: "No auditions and no fixed fee: pay what you can."', trap: 'Class C is free only for some families; it still has a fee for everyone else.' },
    { id: 'rg-cls-3', type: 'mcq', ...G(1, 'matchinfo', 1), group: 'classes', q: '3 Which class is held in the afternoon?', answer: 5, sol: 'Advert F: "Thursdays, 2 pm". All the other times are in the morning or evening (6 pm and later; C is at 10 am).' },
    { id: 'rg-cls-4', type: 'mcq', ...G(1, 'matchinfo', 1), group: 'classes', q: '4 Which class welcomes children as long as an adult comes too?', answer: 2, sol: 'Advert C: "Children from the age of 8 are welcome when they come with an adult."' },
    { id: 'rg-cls-5', type: 'mcq', ...G(1, 'matchinfo', 2), group: 'classes', q: '5 Which class fee includes the cost of the materials students use?', answer: 0, sol: 'Advert A: "Fee £96, which includes clay and firing". In B the course book costs "£12 extra", and in D students bring their own phone.', trap: 'Class C also provides ingredients, but its fee is for the family session, not a course fee for materials; the pottery advert states the fee includes them.' },
    { id: 'rg-cls-6', type: 'mcq', ...G(1, 'matchinfo', 1), group: 'classes', q: '6 Which class is taught by someone who speaks the language as a first language?', answer: 1, sol: 'Advert B: "Taught by a native speaker."' },
    T('rg-cls-7', 1, 'short', 1, 'classesQ', 1, '7 How many students can join the pottery class at most?', ['10'], 'Advert A: "Maximum: 10 students."'),
    T('rg-cls-8', 1, 'short', 1, 'classesQ', 1, '8 On which day does the choir meet?', ['Fridays', 'Friday'], 'Advert E: "Fridays, 6 pm."'),
    T('rg-cls-9', 1, 'short', 1, 'classesQ', 2, '9 What do choir members receive?', ['sheet music'], 'Advert E: "Sheet music is provided."'),
    T('rg-cls-10', 1, 'short', 2, 'classesQ', 3, '10 What is provided for students at the computer class?', ['tea', 'tea and biscuits'], 'Advert F: "Tea and biscuits are provided."'),
    T('rg-cls-11', 1, 'short', 1, 'classesQ', 2, '11 How long does the Spanish course last?', ['6 weeks', 'six weeks'], 'Advert B: "for 6 weeks".'),
    T('rg-cls-12', 1, 'short', 2, 'classesQ', 3, '12 Where will the photography students\' work be shown?', ['foyer', 'the foyer', 'in the foyer'], 'Advert D: "a small exhibition of students\' work in the foyer".'),
    T('rg-cls-13', 1, 'short', 1, 'classesQ', 2, '13 What should pottery students bring with them?', ['apron', 'an apron'], 'Advert A: "Please bring an apron."'),

    // ---- Section 1b: swimming pool
    M('rg-pool-1', 1, 'tfng', 1, 'pool', '1 Children under five must pay a reduced price.', TFNG, 1, 'The table says children under 5 are "Free with a paying adult". They pay nothing, so the statement is FALSE.', 'Free is not the same as reduced.'),
    M('rg-pool-2', 1, 'tfng', 1, 'pool', '2 A family ticket covers two adults and up to three children.', TFNG, 0, 'Table: "Family (2 adults and up to 3 children)". TRUE.'),
    M('rg-pool-3', 1, 'tfng', 2, 'pool', '3 The pool stays open later on weekdays than at weekends.', TFNG, 0, 'Weekdays close at "9.00 pm"; weekends at "6.00 pm". TRUE.'),
    M('rg-pool-4', 1, 'tfng', 2, 'pool', '4 Buying a ten-visit card makes each visit cheaper than paying for a single adult ticket.', TFNG, 0, 'The card costs £36.00 for ten visits, so £3.60 a visit, against £4.50 for one adult ticket. TRUE.'),
    M('rg-pool-5', 1, 'tfng', 2, 'pool', '5 The pool is closed for cleaning at Christmas.', TFNG, 1, 'The pool is closed on "25 December" but the deep clean is in "the first week of September". The cleaning is not at Christmas: FALSE.', 'Closed at Christmas is true, but the reason given for the cleaning closure is a different time.'),
    M('rg-pool-6', 1, 'tfng', 1, 'pool', '6 Swimmers with long hair are required to wear a cap.', TFNG, 0, '"Swimmers with long hair must wear a cap." TRUE.'),
    M('rg-pool-7', 1, 'tfng', 2, 'pool', '7 The centre offers swimming lessons for adults.', TFNG, 2, 'The notice lists tickets, times and rules, but says nothing about lessons. NOT GIVEN.'),
    T('rg-pool-8', 1, 'short', 1, 'pool', 1, '8 How much is a senior ticket?', ['£3.00', '3.00', '£3'], 'Table: "Senior (over 65): £3.00".'),
    T('rg-pool-9', 1, 'short', 1, 'pool', 2, '9 At what time does the pool open on Sundays?', ['8.00 am', '8 am', '8am'], 'Opening times: "Saturday and Sunday: 8.00 am to 6.00 pm".'),
    T('rg-pool-10', 1, 'short', 1, 'pool', 1, '10 On which day is there a session for parents and toddlers?', ['Wednesday'], 'Opening times: "Wednesday, 1.00 to 3.00 pm: parent and toddler session".'),
    T('rg-pool-11', 1, 'short', 2, 'pool', 2, '11 Who must be with children under 8 in the water?', ['an adult', 'adult'], '"Children under 8 must be accompanied by an adult in the water."'),
    T('rg-pool-12', 1, 'short', 1, 'pool', 1, '12 In which month is the pool closed for a deep clean?', ['September'], '"The pool is also closed for a deep clean during the first week of September."'),
    T('rg-pool-13', 1, 'short', 2, 'pool', 3, '13 What must everyone do before swimming?', ['take a shower', 'a shower', 'shower'], '"Everyone must take a shower before swimming."'),

    // ---- Section 1c: homes to rent
    { id: 'rg-flat-1', type: 'mcq', ...G(1, 'matching', 1), group: 'flats', q: '1 Which home has the cost of bills included in the rent?', answer: 0, sol: 'Advert A: "£620 a month, all bills included." In D "bills not included"; C includes only internet.', trap: 'C says "internet included", which is not all bills.' },
    { id: 'rg-flat-2', type: 'mcq', ...G(1, 'matching', 1), group: 'flats', q: '2 Which home would be shared with other people?', answer: 2, sol: 'Advert C: "You will share the kitchen and bathroom with three other people."' },
    { id: 'rg-flat-3', type: 'mcq', ...G(1, 'matching', 1), group: 'flats', q: '3 Which home has a balcony?', answer: 3, sol: 'Advert D: "Sunny balcony."' },
    { id: 'rg-flat-4', type: 'mcq', ...G(1, 'matching', 2), group: 'flats', q: '4 Which home can only be rented for a year or more?', answer: 4, sol: 'Advert E: "Minimum contract: 12 months."' },
    { id: 'rg-flat-5', type: 'mcq', ...G(1, 'matching', 1), group: 'flats', q: '5 Which home can be moved into straight away?', answer: 1, sol: 'Advert B: "Available immediately." The others have a date in the future.' },
    { id: 'rg-flat-6', type: 'mcq', ...G(1, 'matching', 1), group: 'flats', q: '6 Which home is near the railway station?', answer: 0, sol: 'Advert A: "ten minutes\' walk from the railway station."' },
    T('rg-flat-7', 1, 'sentence', 1, 'flatsQ', 1, '7 Viewings take place on ______ mornings.', ['Saturday'], '"Viewings take place on Saturday mornings."'),
    T('rg-flat-8', 1, 'sentence', 1, 'flatsQ', 1, '8 Visitors should bring photo ID and proof of ______.', ['address'], '"Please bring photo ID and proof of address."'),
    T('rg-flat-9', 1, 'sentence', 2, 'flatsQ', 1, '9 The holding deposit is equal to one week\'s ______.', ['rent'], '"a holding deposit equal to one week\'s rent".'),
    T('rg-flat-10', 1, 'sentence', 2, 'flatsQ', 1, '10 The holding deposit keeps the property for ______ days.', ['seven', '7'], '"keeps the property for you for seven days".'),
    T('rg-flat-11', 1, 'sentence', 2, 'flatsQ', 2, '11 The main deposit equals ______ rent.', ['one month\'s', '1 month\'s'], '"The main deposit equals one month\'s rent".'),
    T('rg-flat-12', 1, 'sentence', 2, 'flatsQ', 1, '12 Tenants pay no ______ fee.', ['agency'], '"Tenants pay no agency fee."'),
    T('rg-flat-13', 1, 'sentence', 1, 'flatsQ', 1, '13 Contracts are signed at the agency\'s ______.', ['office'], '"Contracts are signed at our office."'),

    // ---- Section 2a: staff handbook, leave
    T('rg-lv-1', 2, 'sentence', 2, 'leave', 1, '1 Full-time employees receive ______ days of paid annual leave each year, plus public holidays.', ['25'], 'Annual leave, first paragraph: "25 days of paid annual leave each year, plus public holidays".'),
    T('rg-lv-2', 2, 'sentence', 2, 'leave', 2, '2 The leave year begins on ______.', ['1 January'], '"The leave year runs from 1 January to 31 December."'),
    T('rg-lv-3', 2, 'sentence', 2, 'leave', 1, '3 To carry unused days over, you need your ______ to agree before 30 November.', ['manager'], '"only if your manager agrees before 30 November".'),
    T('rg-lv-4', 2, 'sentence', 2, 'leave', 1, '4 Requests for leave should be made using the ______ form.', ['online'], '"request leave at least two weeks ahead using the online form".'),
    T('rg-lv-5', 2, 'sentence', 2, 'leave', 1, '5 An employee who is ill must ______ their manager before 9 am on the first day.', ['phone'], 'Sick leave: "you must phone your manager before 9 am on the first day".'),
    T('rg-lv-6', 2, 'sentence', 2, 'leave', 2, '6 After seven days of sickness you must give the company a ______.', ['doctor\'s note'], '"After seven days of sickness you must give us a doctor\'s note."'),
    M('rg-lv-7', 2, 'tfng', 2, 'leave', '7 Part-time staff receive the same number of leave days as full-time staff.', TFNG, 1, 'They receive the entitlement "in proportion to the hours they work", so fewer days: FALSE.'),
    M('rg-lv-8', 2, 'tfng', 2, 'leave', '8 An employee may carry over up to five days of unused leave if the manager agrees.', TFNG, 0, '"Up to five unused days may be carried over ... only if your manager agrees." TRUE.'),
    M('rg-lv-9', 2, 'tfng', 3, 'leave', '9 A manager can approve a request to take more than ten days in a row.', TFNG, 1, 'The text says this "needs the approval of a director", not a manager: FALSE.', 'A director, not the manager, must approve.'),
    M('rg-lv-10', 2, 'tfng', 2, 'leave', '10 In December, only two members of a team can be away at once.', TFNG, 0, '"In December, no more than two members of a team may be away at the same time." TRUE.'),
    M('rg-lv-11', 2, 'tfng', 3, 'leave', '11 Staff may report sickness by text message.', TFNG, 1, '"Messages and emails are not accepted." FALSE.'),
    M('rg-lv-12', 2, 'tfng', 3, 'leave', '12 Sick pay falls after the first ten days of sickness in a leave year.', TFNG, 0, 'Full pay for ten days, then "half pay for the next twenty days". TRUE.'),
    M('rg-lv-13', 2, 'tfng', 3, 'leave', '13 Employees who work on a public holiday receive extra pay.', TFNG, 2, 'Public holidays are mentioned only as additional paid days off. Nothing is said about extra pay: NOT GIVEN.'),

    // ---- Section 2b: job advertisement
    T('rg-job-1', 2, 'short', 1, 'job', 1, '1 How many hours a week will the receptionist work?', ['24'], '"Hours: 24 hours a week".'),
    T('rg-job-2', 2, 'short', 1, 'job', 1, '2 How much is the hourly pay?', ['£13.50', '13.50'], '"Pay: £13.50 per hour".'),
    T('rg-job-3', 2, 'short', 2, 'job', 2, '3 What is the closing date for applications?', ['12 December', 'December 12'], 'How to apply: "The closing date is 12 December."'),
    T('rg-job-4', 2, 'short', 2, 'job', 2, '4 How long may the covering letter be?', ['one page', '1 page'], '"a covering letter of no more than one page".'),
    T('rg-job-5', 2, 'short', 2, 'job', 1, '5 Staff get a 30% discount on what?', ['meals'], '"a 30% discount on meals in the hotel restaurant".'),
    T('rg-job-6', 2, 'short', 2, 'job', 2, '6 What must staff supply themselves as part of their uniform?', ['black shoes'], '"We provide a uniform, but you must supply your own black shoes."'),
    M('rg-job-7', 2, 'mcq', 2, 'job', '7 The job would suit a person who', ['wants a daytime job', 'can work evenings and weekends', 'is looking for full-time work', 'hopes to work from home'], 1, '"24 hours a week, mostly evenings and weekends." It is part-time and based at the hotel.'),
    M('rg-job-8', 2, 'mcq', 2, 'job', '8 Applicants must have', ['two years of hotel experience', 'a second language', 'a good level of spoken English', 'a driving licence'], 2, '"You must have a good level of spoken English." A second language is only "an advantage", and hotel experience is "not essential".', 'A second language is an advantage, not a requirement.'),
    M('rg-job-9', 2, 'mcq', 3, 'job', '9 What is said about training?', ['It is unpaid for the first week.', 'It takes place online.', 'It is only for people without experience.', 'It lasts two weeks and is paid.'], 3, '"we offer two weeks of paid training".'),
    M('rg-job-10', 2, 'mcq', 3, 'job', '10 The interviews will', ['be held by telephone', 'be given to every applicant', 'take place in the week of 18 December', 'be held at weekends'], 2, '"Interviews will be held during the week of 18 December." Only shortlisted candidates are interviewed.'),
    M('rg-job-11', 2, 'mcq', 2, 'job', '11 What are applicants asked not to do?', ['telephone the hotel', 'visit during interview week', 'apply on paper', 'send photographs'], 0, '"Please do not telephone the hotel."'),
    M('rg-job-12', 2, 'mcq', 3, 'job', '12 When will the hotel ask for references?', ['when a job has been offered', 'with the first application', 'at the interview', 'at the end of training'], 0, '"Two references are requested only when a job has been offered."'),
    M('rg-job-13', 2, 'mcq', 2, 'job', '13 What will shortlisted candidates be asked to do?', ['give a presentation', 'do a short computer test', 'bring examples of their work', 'take a language exam'], 1, '"Shortlisted candidates will also be asked to do a short computer test."'),

    // ---- Section 2c: kitchen safety, matching headings (6) + sentence completion (7)
    { id: 'rg-kit-1', type: 'mcq', ...G(2, 'headings', 2), group: 'kitchenH', q: 'Section A', answer: 3, sol: 'Everything in Section A is about washing hands for "at least 20 seconds": iv Washing and personal cleanliness.' },
    { id: 'rg-kit-2', type: 'mcq', ...G(2, 'headings', 2), group: 'kitchenH', q: 'Section B', answer: 4, sol: 'Fridges "at 5 degrees Celsius or below", hot food "above 63 degrees": v Storing and serving food at safe temperatures.' },
    { id: 'rg-kit-3', type: 'mcq', ...G(2, 'headings', 2), group: 'kitchenH', q: 'Section C', answer: 0, sol: '"Wipe up spills at once ... Keep walkways clear": i Keeping floors clear and dry.', trap: 'Non-slip shoes are mentioned, but they are part of floor safety, not a heading about uniform.' },
    { id: 'rg-kit-4', type: 'mcq', ...G(2, 'headings', 3), group: 'kitchenH', q: 'Section D', answer: 5, sol: '"Bend your knees ... Do not lift more than 20 kilograms": vi Protecting your back.' },
    { id: 'rg-kit-5', type: 'mcq', ...G(2, 'headings', 2), group: 'kitchenH', q: 'Section E', answer: 1, sol: 'Knives, the slicer and machines: ii Working safely with knives and machines.' },
    { id: 'rg-kit-6', type: 'mcq', ...G(2, 'headings', 2), group: 'kitchenH', q: 'Section F', answer: 2, sol: 'Fire alarm, assembly point, first-aid kit, accident book: iii What to do in an emergency.' },
    T('rg-kit-7', 2, 'sentence', 2, 'kitchenS', 1, '7 Staff must wash their hands for at least ______ seconds.', ['20'], 'Section A: "at least 20 seconds".'),
    T('rg-kit-8', 2, 'sentence', 2, 'kitchenS', 1, '8 Fridges must be kept at ______ degrees Celsius or below.', ['5'], 'Section B: "Fridges must be kept at 5 degrees Celsius or below".'),
    T('rg-kit-9', 2, 'sentence', 2, 'kitchenS', 1, '9 Cooked food must not be left out of the fridge for more than ______ hours.', ['two', '2'], 'Section B: "for more than two hours".'),
    T('rg-kit-10', 2, 'sentence', 2, 'kitchenS', 1, '10 Nobody should lift more than ______ kilograms on their own.', ['20'], 'Section D: "Do not lift more than 20 kilograms on your own".'),
    T('rg-kit-11', 2, 'sentence', 2, 'kitchenS', 1, '11 When carrying a knife, always point the blade ______.', ['down'], 'Section E: "carry a knife with the blade pointing down".'),
    T('rg-kit-12', 2, 'sentence', 3, 'kitchenS', 2, '12 Every accident must be written in the ______.', ['accident book'], 'Section F: "must be written in the accident book".'),
    T('rg-kit-13', 2, 'sentence', 3, 'kitchenS', 1, '13 If the fire alarm sounds, staff meet at the ______ point in the car park.', ['assembly'], 'Section F: "meet at the assembly point in the car park".'),

    // ---- Section 3a: the bicycle courier
    { id: 'rg-cou-1', type: 'mcq', ...G(3, 'headings', 3), group: 'courierH', q: '1 Paragraph B', answer: 2, sol: 'Telegraph boys on foot, then "the safety bicycle": iii Early messengers and a new machine.' },
    { id: 'rg-cou-2', type: 'mcq', ...G(3, 'headings', 3), group: 'courierH', q: '2 Paragraph C', answer: 0, sol: '"As telephones spread ... as vans and motorcycles became cheaper": i Competition from telephones and motor vehicles.', trap: 'Heading vii mentions the telegraph, which the paragraph does not discuss.' },
    { id: 'rg-cou-3', type: 'mcq', ...G(3, 'headings', 3), group: 'courierH', q: '3 Paragraph D', answer: 4, sol: '"A revival began in the 1970s and 1980s" because city centres "had grown crowded with cars": v An old job given new life by crowded streets.' },
    { id: 'rg-cou-4', type: 'mcq', ...G(3, 'headings', 4), group: 'courierH', q: '4 Paragraph E', answer: 1, sol: 'Email removed the need to send papers; survivors delivered "medical samples, small parcels" and keys: ii Fewer papers to carry, and new things to deliver.' },
    { id: 'rg-cou-5', type: 'mcq', ...G(3, 'headings', 3), group: 'courierH', q: '5 Paragraph F', answer: 5, sol: 'Self-employment, no sick pay, riders pay for equipment: vi How apps have changed riders\' working conditions.', trap: 'Electric bikes are mentioned only in passing, so viii is wrong.' },
    { id: 'rg-cou-6', type: 'mcq', ...G(3, 'headings', 3), group: 'courierH', q: '6 Paragraph G', answer: 3, sol: 'Cargo bicycles and local hubs are plans for "where the profession goes next": iv Possible futures for city delivery.' },
    M('rg-cou-7', 3, 'tfng', 3, 'courierQ', '7 Early telegraph messengers were adults who travelled by bicycle.', TFNG, 1, 'Paragraph B: companies "hired boys" who "went on foot". The bicycle came later: FALSE.'),
    M('rg-cou-8', 3, 'tfng', 3, 'courierQ', '8 Radio dispatchers helped courier companies to work more efficiently.', TFNG, 0, 'Paragraph D: radio dispatchers "made the system far more efficient". TRUE.'),
    M('rg-cou-9', 3, 'tfng', 4, 'courierQ', '9 Couriers in the 1980s were paid more than platform riders are paid today.', TFNG, 2, 'Paragraph F discusses how platform riders are paid, but no pay figures or comparison with the 1980s are given. NOT GIVEN.', 'The passage compares conditions in general, not wages.'),
    M('rg-cou-10', 3, 'ynng', 4, 'courierQ', '10 The writer is certain that cargo bicycles will replace vans in cities.', YNNG, 1, 'Paragraph G: "If these ideas work, the bicycle courier may become ..." The writer uses "if" and "may", so is not certain: NO.'),
    M('rg-cou-11', 3, 'mcq', 3, 'courierQ', '11 Why did firms like bicycles for messengers in the 1890s?', ['They were safer than motorcycles.', 'They needed no training to ride.', 'They let one messenger cover more ground.', 'They replaced the telegraph.'], 2, 'Paragraph B: "A boy on a bicycle could cover far more ground in a day than one on foot".'),
    M('rg-cou-12', 3, 'mcq', 4, 'courierQ', '12 According to paragraph E, courier firms that survived', ['stopped delivering paper documents', 'began to offer a wider range of services', 'merged with telephone companies', 'increased their legal work'], 1, '"Those that survived diversified, offering the delivery of medical samples, small parcels, and items ..."'),
    M('rg-cou-13', 3, 'mcq', 4, 'courierQ', '13 In paragraph F the writer suggests that platform riders', ['know their dispatchers by name', 'often carry the cost of their own equipment', 'are all classed as employees', 'work only on electric bikes'], 1, '"Many platform riders are classed as self-employed ... and must pay for their own equipment." The others contradict the text.', '"Many" riders are self-employed, so option C is wrong.'),

    // ---- Section 3b: the public library
    M('rg-lib-1', 3, 'ynng', 3, 'libraryQ', '1 The writer believes that the internet has made public libraries unnecessary.', YNNG, 1, 'Paragraph A: observers predicted libraries "would disappear ... They did not." The writer disagrees: NO.'),
    M('rg-lib-2', 3, 'ynng', 3, 'libraryQ', '2 Free internet access in libraries has been especially valuable to some groups of people.', YNNG, 0, 'Paragraph C: it "proved to be of great importance to people without a connection at home". YES.'),
    M('rg-lib-3', 3, 'ynng', 4, 'libraryQ', '3 Makerspaces are the most popular feature of modern libraries.', YNNG, 2, 'Paragraph D describes makerspaces as something "some" libraries include. Nothing says they are the most popular feature: NOT GIVEN.'),
    M('rg-lib-4', 3, 'ynng', 4, 'libraryQ', '4 Library services have been reduced in every town because of funding problems.', YNNG, 1, 'Paragraph F says "Several towns" have cut services, not every town: NO.', '"Several" is not the same as "every".'),
    M('rg-lib-5', 3, 'ynng', 3, 'libraryQ', '5 The writer suggests that people with few alternatives suffer most when libraries shrink.', YNNG, 0, 'Paragraph F: "the people who lose most when libraries shrink are those with the fewest alternatives". YES.'),
    M('rg-lib-6', 3, 'mcq', 3, 'libraryQ', '6 What is the purpose of paragraph B?', ['to criticise the first public libraries', 'to describe the original model of the public library', 'to explain why libraries became unpopular', 'to compare libraries in different countries'], 1, 'It describes how early libraries began and the unchanging model: "a collection of books, a catalogue, a counter and a quiet reading room".'),
    M('rg-lib-7', 3, 'mcq', 3, 'libraryQ', '7 In paragraph D, how do librarians in new libraries see their role?', ['as keepers of a collection', 'as teachers of children', 'as guides who help people find what they need', 'as managers of cafés'], 2, '"less as guardians of a collection and more as guides who help people find what they need".', 'Option A is the old role that the paragraph says they describe themselves as moving away from.'),
    M('rg-lib-8', 3, 'mcq', 4, 'libraryQ', '8 What do defenders of libraries say about cuts?', ['They save more money than expected.', 'They mostly affect wealthy readers.', 'They allow volunteers to improve services.', 'They harm people who have few other choices.'], 3, 'Paragraph F: "those with the fewest alternatives: children from homes with few books, people without internet access ..."'),
    T('rg-lib-9', 3, 'summary', 3, 'librarySum', 1, '9 When basic facts became easy to find online, libraries bought ______ and offered free internet access.', ['computers'], 'Paragraph C: "Libraries responded by buying computers and offering free internet access".'),
    T('rg-lib-10', 3, 'summary', 3, 'librarySum', 1, '10 The free access helped people such as ______ who needed to fill in online forms.', ['jobseekers'], 'Paragraph C: "jobseekers filling in online forms".'),
    T('rg-lib-11', 3, 'summary', 3, 'librarySum', 1, '11 Newly designed libraries have fewer ______ and more space to sit and work.', ['shelves'], 'Paragraph D: "fewer shelves and more room to sit, meet and work".'),
    T('rg-lib-12', 3, 'summary', 4, 'librarySum', 1, '12 Some libraries have workshops called ______ where members use machines such as 3D printers.', ['makerspaces'], 'Paragraph D: "makerspaces, workshops equipped with 3D printers".'),
    T('rg-lib-13', 3, 'summary', 4, 'librarySum', 1, '13 Some libraries now lend items such as tools, musical instruments and ______.', ['seeds'], 'Paragraph G: "tools, musical instruments, seeds and even fishing rods".', '"Fishing rods" is also in the list but comes after "even", and the sentence has only one gap.'),
  ],
};
