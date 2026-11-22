// NEET UG Biology: Locomotion and movement (NCERT Class 11, Chapter 20). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const E = ['neet'];
const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [3, 0, 2, 1];
const nid = () => `lc-${String(++n).padStart(3, '0')}`;
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: E, sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: E, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: E, sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: E, sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: E, sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'movement', 'The three main types of movement shown by cells of the human body are', 'amoeboid, ciliary and muscular', ['amoeboid, flagellar and ciliary only', 'muscular, skeletal and neural', 'ciliary, flagellar and muscular only'], 'NCERT names amoeboid, ciliary and muscular movements for the cells and organs of the human body.');
mc(1, 'movement', 'Macrophages and leucocytes show', 'amoeboid movement', ['ciliary movement', 'muscular movement', 'flagellar movement only'], 'They move by pseudopodia formed by the streaming of protoplasm, with microfilaments taking part.');
mc(1, 'movement', 'The coordinated movement of cilia in the trachea helps in', 'removing dust particles from inhaled air', ['absorbing oxygen', 'secreting mucus only', 'contraction of the lungs'], 'Ciliary movement in the lined tubular organs sweeps foreign particles out. In the female reproductive tract it helps the passage of ova.');
mc(1, 'movement', 'Movement that results in a change of place or location of the whole body is', 'locomotion', ['peristalsis', 'secretion', 'circulation'], 'Locomotion is voluntary movement such as walking, running or swimming.');
mc(1, 'muscle types', 'Muscles attached to the bones of the skeleton are', 'skeletal muscles', ['visceral muscles', 'cardiac muscles', 'smooth muscles'], 'Skeletal muscles are striated and voluntary and help in locomotion.');
mc(1, 'muscle types', 'Muscles of the heart are', 'striated and involuntary', ['smooth and voluntary', 'striated and voluntary', 'smooth and involuntary'], 'Cardiac muscle looks striated like skeletal muscle but works involuntarily.');
mc(1, 'muscle types', 'Which muscles are unstriated and involuntary?', 'Visceral (smooth) muscles', ['Skeletal muscles', 'Cardiac muscles', 'Muscles of the limbs'], 'Smooth muscles line the walls of hollow organs like the stomach and blood vessels.');
mc(1, 'muscle structure', 'The functional unit of contraction in a myofibril is', 'the sarcomere', ['the neuron', 'the nephron', 'the sarcolemma'], 'A sarcomere lies between two successive Z lines.');
mc(1, 'contractile proteins', 'The thick filament of a sarcomere is made of', 'myosin', ['actin', 'tropomyosin', 'troponin'], 'Myosin forms thick filaments and actin forms thin filaments.');
mc(1, 'contractile proteins', 'The thin filament is mainly made of', 'actin', ['myosin', 'keratin', 'collagen'], 'Actin filaments are thinner than myosin filaments.');
mc(1, 'mechanism', 'Which ion triggers muscle contraction by binding to troponin?', 'Ca2+', ['Na+', 'Cl-', 'Mg2+'], 'Calcium released from the sarcoplasmic reticulum binds a subunit of troponin.');
mc(1, 'skeletal system', 'The total number of bones in an adult human skeleton is', '206', ['180', '212', '300'], 'The human skeleton is made of 206 bones and a few cartilages.');
mc(1, 'skeletal system', 'The number of cervical vertebrae in humans is', 'seven', ['five', 'twelve', 'nine'], 'Almost all mammals, including humans, have seven cervical vertebrae.');
mc(1, 'skeletal system', 'The collar bone is', 'the clavicle', ['the scapula', 'the humerus', 'the ulna'], 'Each clavicle is a long slender bone with two curvatures.');
mc(1, 'skeletal system', 'The knee cap is the', 'patella', ['tibia', 'fibula', 'femur'], 'The patella is a cup-shaped bone covering the knee ventrally.');
mc(1, 'skeletal system', 'The longest bone of the human body is the', 'femur', ['humerus', 'tibia', 'ulna'], 'The femur (thigh bone) is the longest.');
mc(1, 'joints', 'The knee joint is a', 'hinge joint', ['ball and socket joint', 'pivot joint', 'saddle joint'], 'It allows movement in one plane like a door hinge.');
mc(1, 'disorders', 'Gout is caused by the accumulation of', 'uric acid crystals in the joints', ['calcium in the blood', 'lactic acid in muscles', 'oxalates in the kidney'], 'Uric acid crystals cause inflammation of the joints.');
mc(1, 'muscle types', 'Which of these muscle fibres have plenty of myoglobin?', 'Red fibres', ['White fibres', 'None', 'Smooth muscle only'], 'Myoglobin gives the red colour, and red fibres also have many mitochondria.');
mc(1, 'skeletal system', 'The number of pairs of ribs in humans is', 'twelve', ['seven', 'ten', 'fourteen'], 'There are 12 pairs, 24 ribs in all.');

// ---------------------------------------------------------------- Level 2
mc(2, 'movement', 'Which of these is movement but NOT locomotion?', 'Ciliary beating in the trachea', ['Walking', 'Swimming of a fish', 'Flying of a bird'], 'Locomotion changes the place of the body. Ciliary beating moves particles inside the body. All locomotions are movements, but not all movements are locomotions.', 'The reverse statement is wrong.');
mc(2, 'movement', 'Amoeboid movement involves the following besides pseudopodia', 'cytoskeletal elements like microfilaments', ['cilia', 'myosin heads of skeletal muscle only', 'sarcomeres'], 'Streaming of protoplasm with microfilaments gives the pseudopodia.');
mc(2, 'movement', 'Cilia help the passage of ova in the', 'female reproductive tract', ['male reproductive tract', 'gut', 'ureter'], 'The ciliated lining of the oviduct moves the ovum along.');
mc(2, 'muscle types', 'The origin of muscles is mainly', 'mesodermal', ['ectodermal', 'endodermal', 'neural crest only'], 'Muscle is a specialised tissue of mesodermal origin and forms 40-50 per cent of the body weight.');
mc(2, 'muscle types', 'Which of these is NOT a property of muscles?', 'Conductivity of electrical signals only', ['Excitability', 'Contractility', 'Extensibility'], 'The four properties listed are excitability, contractility, extensibility and elasticity.');
mc(2, 'muscle structure', 'A bundle of muscle fibres is called', 'a fascicle', ['a sarcomere', 'a myofibril', 'a sarcolemma'], 'Fascicles are held together by fascia, a collagenous connective tissue layer.');
mc(2, 'muscle structure', 'The plasma membrane of a muscle fibre is the', 'sarcolemma', ['sarcoplasm', 'sarcomere', 'sarcosome'], 'The sarcolemma encloses the sarcoplasm.');
mc(2, 'muscle structure', 'A muscle fibre is described as a syncytium because it', 'has many nuclei in one continuous sarcoplasm', ['has no nucleus', 'is made of one nucleus', 'is branched'], 'The sarcoplasm contains many nuclei.');
mc(2, 'muscle structure', 'The store house of calcium ions in a muscle fibre is the', 'sarcoplasmic reticulum', ['mitochondria', 'sarcolemma', 'M line'], 'The sarcoplasmic reticulum, the endoplasmic reticulum of a muscle fibre, stores Ca2+.');
mc(2, 'muscle structure', 'The dark band of a myofibril is the', 'A band, containing myosin', ['I band, containing actin', 'A band, containing actin only', 'Z line'], 'A means anisotropic, dark, with myosin (and overlapping actin).', 'The light band is I.');
mc(2, 'muscle structure', 'The light band of a myofibril is the', 'I band, which has actin', ['A band, which has myosin', 'H zone, which has myosin', 'M line'], 'I means isotropic and has thin filaments only.');
mc(2, 'muscle structure', 'The elastic fibre that bisects the I band is the', 'Z line', ['M line', 'H zone', 'A band'], 'Actin filaments are firmly attached to the Z line.');
mc(2, 'muscle structure', 'The M line is found', 'in the middle of the A band, holding thick filaments', ['at the middle of the I band', 'at the end of the sarcomere', 'in the H zone only'], 'The M line is a thin fibrous membrane that holds the thick filaments together in the A band.');
mc(2, 'muscle structure', 'The H zone is the', 'central part of the thick filaments not overlapped by thin filaments', ['part where only thin filaments exist', 'region between two Z lines', 'part of the I band'], 'In a resting sarcomere the thin filaments partially overlap the ends of thick filaments, leaving the H zone.');
mc(2, 'contractile proteins', 'An actin filament is made of', 'two helically wound F-actin strands, each a polymer of G-actin', ['two myosin strands', 'one long G-actin strand only', 'troponin only'], 'Each F-actin is a chain of globular G-actin monomers.');
mc(2, 'contractile proteins', 'In relaxed muscle the active sites on actin are covered by', 'a subunit of troponin (with tropomyosin)', ['myosin tail', 'Ca2+ ions', 'ATP'], 'In the resting state troponin masks the active sites for myosin.');
mc(2, 'contractile proteins', 'Troponin is distributed at regular intervals on', 'tropomyosin', ['myosin', 'the Z line', 'the M line'], 'Tropomyosin runs close to F-actin through its length and troponin sits on it.');
mc(2, 'contractile proteins', 'The heavy meromyosin of a myosin filament contains', 'the globular head and short arm', ['the tail only', 'tropomyosin', 'the M line'], 'HMM has the head and short arm, the cross arm. The tail is light meromyosin.');
mc(2, 'contractile proteins', 'The globular head of myosin has', 'ATPase activity and binding sites for ATP and actin', ['only binding sites for Ca2+', 'only binding sites for troponin', 'no enzyme activity'], 'The head is an active ATPase enzyme and has binding sites for ATP and active sites for actin.');
mc(2, 'mechanism', 'The neurotransmitter at the neuromuscular junction of skeletal muscle is', 'acetylcholine', ['dopamine', 'serotonin', 'adrenaline'], 'ACh generates an action potential in the sarcolemma.');
mc(2, 'mechanism', 'A motor neuron along with the muscle fibres it supplies is called a', 'motor unit', ['fascicle', 'sarcomere', 'synapse'], 'A motor unit is one motor neuron with all the muscle fibres connected to it.');
mc(2, 'mechanism', 'During contraction the A band', 'retains its length', ['shortens', 'lengthens', 'disappears'], 'The thick filaments do not change in length. The I band and H zone become shorter.');
mc(2, 'mechanism', 'Fatigue in a muscle after repeated contraction is due to', 'accumulation of lactic acid from anaerobic breakdown of glycogen', ['accumulation of acetylcholine', 'excess ATP', 'lack of troponin'], 'Repeated activation leads to anaerobic breakdown of glycogen and lactic acid builds up.');
mc(2, 'muscle fibres', 'White muscle fibres are best suited for', 'short bursts of activity', ['long sustained work', 'storing oxygen', 'aerobic respiration'], 'They have less myoglobin and fewer mitochondria and depend on anaerobic processes, so they work for short bursts.');
mc(2, 'skeletal system', 'The axial skeleton has how many bones?', '80', ['126', '206', '29'], 'Axial: skull 29 (with hyoid and ear ossicles), vertebral column 26, sternum 1, ribs 24 = 80.');
mc(2, 'skeletal system', 'The appendicular skeleton has how many bones?', '126', ['80', '206', '60'], 'Limbs 60 + 60 and girdles 4 + 2 = 126. 80 + 126 = 206.');
mc(2, 'skeletal system', 'Cranial and facial bones of the human skull together number', '22', ['29', '8', '14'], 'Cranial 8 + facial 14 = 22. Adding the hyoid and the six ear ossicles gives 29.');
mc(2, 'skeletal system', 'The U-shaped bone at the base of the buccal cavity is the', 'hyoid', ['mandible', 'sternum', 'vomer'], 'The hyoid is included with the skull bones.');
mc(2, 'skeletal system', 'The three bones of each middle ear are', 'malleus, incus and stapes', ['atlas, axis and hyoid', 'ilium, ischium and pubis', 'radius, ulna and humerus'], 'They are called the ear ossicles.');
mc(2, 'skeletal system', 'The first vertebra, which articulates with the occipital condyles, is the', 'atlas', ['axis', 'sacrum', 'coccyx'], 'The atlas carries the skull. The human skull is dicondylic.');
mc(2, 'skeletal system', 'The human vertebral column has the following number of vertebrae in the thoracic and lumbar regions', '12 and 5', ['7 and 12', '5 and 12', '12 and 7'], 'Cervical 7, thoracic 12, lumbar 5, sacral 1 (fused), coccygeal 1 (fused).');
mc(2, 'skeletal system', 'The first seven pairs of ribs are called', 'true ribs', ['false ribs', 'floating ribs', 'vertebrochondral ribs'], 'They attach dorsally to thoracic vertebrae and ventrally to the sternum by hyaline cartilage.');
mc(2, 'skeletal system', 'Floating ribs are the', '11th and 12th pairs', ['7th and 8th pairs', '8th to 10th pairs', '1st and 2nd pairs'], 'They are not connected ventrally.');
mc(2, 'skeletal system', 'The cavity of the scapula that articulates with the head of the humerus is the', 'glenoid cavity', ['acetabulum', 'neural canal', 'acromion'], 'The glenoid cavity lies below the acromion. The acetabulum is in the coxal bone.');
mc(2, 'skeletal system', 'The cavity in the coxal bone to which the femur articulates is the', 'acetabulum', ['glenoid cavity', 'neural canal', 'pelvic cavity'], 'It forms at the point of fusion of ilium, ischium and pubis.');
mc(2, 'skeletal system', 'The two halves of the pelvic girdle meet ventrally at the', 'pubic symphysis', ['sacral suture', 'acromion', 'glenoid cavity'], 'The pubic symphysis contains fibrous cartilage.');
mc(2, 'skeletal system', 'The number of carpals and tarsals in humans is respectively', '8 and 7', ['7 and 8', '5 and 14', '14 and 5'], 'Wrist bones (carpals) are 8; ankle bones (tarsals) are 7.');
mc(2, 'joints', 'The joint between atlas and axis is a', 'pivot joint', ['hinge joint', 'gliding joint', 'saddle joint'], 'The atlas rotates on the axis.');
mc(2, 'joints', 'Joints between the carpals are', 'gliding joints', ['pivot joints', 'ball and socket joints', 'fibrous joints'], 'The flat surfaces slide over each other.');
mc(2, 'joints', 'The joint between the carpal and metacarpal of the thumb is a', 'saddle joint', ['hinge joint', 'pivot joint', 'ball and socket joint'], 'This allows the thumb to oppose the fingers.');
mc(2, 'joints', 'The shoulder joint is a', 'ball and socket joint', ['hinge joint', 'saddle joint', 'cartilaginous joint'], 'The head of the humerus fits the glenoid cavity of the pectoral girdle.');
mc(2, 'joints', 'Sutures in the skull are examples of', 'fibrous joints', ['cartilaginous joints', 'synovial joints', 'hinge joints'], 'Flat skull bones fuse end to end with dense fibrous tissue and allow no movement.');
mc(2, 'joints', 'The joint between adjacent vertebrae is', 'cartilaginous and allows limited movement', ['fibrous and immovable', 'synovial and freely movable', 'pivot'], 'Cartilages join the bones and give limited movement.');
mc(2, 'disorders', 'An autoimmune disorder at the neuromuscular junction causing weakness and paralysis of skeletal muscle is', 'myasthenia gravis', ['muscular dystrophy', 'tetany', 'gout'], 'In myasthenia gravis the neuromuscular transmission is impaired, causing fatigue and weakness.');
mc(2, 'disorders', 'Rapid spasms of muscle due to low Ca2+ in body fluid is', 'tetany', ['gout', 'osteoporosis', 'myasthenia gravis'], 'Low calcium makes the muscle contract wildly.');
mc(2, 'disorders', 'Progressive degeneration of skeletal muscle, mostly of genetic origin, is', 'muscular dystrophy', ['myasthenia gravis', 'arthritis', 'tetany'], 'It is mostly caused by a genetic fault.');
mc(2, 'disorders', 'An age-related condition with decreased bone mass and higher chances of fracture is', 'osteoporosis', ['arthritis', 'gout', 'tetany'], 'A fall in oestrogen is a common cause.');
mc(2, 'disorders', 'Inflammation of the joints is called', 'arthritis', ['tetany', 'osteoporosis', 'dystrophy'], 'Gout is one cause of arthritis, due to uric acid crystals.');

// ---------------------------------------------------------------- Level 3
mc(3, 'mechanism', 'During contraction of a skeletal muscle, which of these does NOT change in length?', 'The A band', ['The I band', 'The H zone', 'The sarcomere'], 'The filaments slide; they do not shorten. The A band stays the same because thick filaments remain the same length.', 'The filaments are not what shortens.');
mc(3, 'mechanism', 'During contraction, the distance between two Z lines', 'decreases', ['increases', 'remains the same', 'becomes zero'], 'Actin filaments attached to Z lines are pulled toward the centre of the A band, so Z lines approach each other.');
mc(3, 'mechanism', 'Which sequence is correct for the start of contraction?', 'Neural signal, acetylcholine release, action potential in sarcolemma, release of Ca2+, binding to troponin', ['Ca2+ release, ACh release, neural signal, action potential, troponin', 'Troponin, ACh, Ca2+, neural signal, action potential', 'Action potential, neural signal, troponin, ACh, Ca2+'], 'A signal from a motor neuron releases ACh at the motor end plate; the sarcolemma depolarises; Ca2+ is released from the SR and binds troponin.');
mc(3, 'mechanism', 'The myosin head binds actin after', 'Ca2+ binds troponin and exposes the active sites', ['ATP binds to the actin', 'Mg2+ binds the M line', 'the Z line splits'], 'Removal of the masking exposes sites on actin where the myosin head forms a cross bridge.');
mc(3, 'mechanism', 'The cross bridge is broken when', 'a new ATP binds the myosin head', ['Ca2+ leaves the sarcomere', 'the Z line dissolves', 'troponin is destroyed'], 'ATP binding releases myosin from actin; hydrolysis then re-sets the head.', 'ATP is needed to detach, not to attach.');
mc(3, 'mechanism', 'The myosin head releases ADP and Pi', 'after the power stroke, returning to its relaxed state', ['before binding to actin', 'during Ca2+ release', 'when the neuron is excited'], 'The head pulls the actin, releases ADP and Pi, and then binds new ATP.');
mc(3, 'mechanism', 'Relaxation of a muscle occurs when', 'Ca2+ is pumped back into the sarcoplasmic cisternae and active sites are masked again', ['more Ca2+ is released', 'ACh is released in large amounts', 'the A band lengthens'], 'Without Ca2+ the troponin again covers the active sites and the Z lines return.');
mc(3, 'mechanism', 'A muscle fibre in the resting state has', 'thin filaments partly overlapping the ends of thick filaments', ['thin filaments fully overlapping thick ones', 'no overlap of thin and thick filaments', 'thick filaments attached to Z lines'], 'The edges of thin filaments partially overlap the free ends of thick filaments, leaving the H zone.');
mc(3, 'muscle fibres', 'Red muscle fibres', 'have a large amount of myoglobin and many mitochondria', ['have little myoglobin and many sarcoplasmic reticula', 'depend on anaerobic respiration', 'fatigue within seconds'], 'The red fibres are aerobic and can contract for a long time. White fibres have more SR and use anaerobic energy.');
mc(3, 'muscle fibres', 'Which is a feature of white muscle fibres?', 'Abundant sarcoplasmic reticulum and few mitochondria', ['abundant myoglobin', 'many mitochondria', 'aerobic ATP production'], 'They have little myoglobin, few mitochondria and a good deal of sarcoplasmic reticulum.');
mc(3, 'skeletal system', 'How many bones form the human skull including hyoid and the ear ossicles?', '29', ['22', '23', '28'], '22 + hyoid 1 + ossicles 6 = 29.', 'Forgetting that each ear has three ossicles (two ears, six bones).');
mc(3, 'skeletal system', 'How many bones form the rib cage of an adult human?', '37', ['25', '24', '12'], '12 thoracic vertebrae + 24 ribs + 1 sternum = 37.');
mc(3, 'skeletal system', 'The number of bones in one human limb (forelimb or hindlimb, excluding girdle) is', '30', ['27', '32', '24'], 'Forelimb: humerus, radius, ulna, 8 carpals, 5 metacarpals, 14 phalanges = 30. Hindlimb has patella in place of one, still 30.');
mc(3, 'skeletal system', 'The total number of bones in the two pectoral and pelvic girdles together is', '6', ['4', '8', '12'], 'Pectoral girdle: 2 clavicles + 2 scapulae = 4. Pelvic girdle: 2 coxal bones. Total 6.');
mc(3, 'skeletal system', 'A coxal bone is formed by the fusion of', 'ilium, ischium and pubis', ['clavicle, scapula and humerus', 'tibia, fibula and femur', 'atlas, axis and sacrum'], 'Each half of the pelvic girdle is a coxal bone from these three.');
mc(3, 'skeletal system', 'The ribs are bicephalic because they', 'have two articulation surfaces at the dorsal end', ['have two ventral ends', 'join two vertebrae at the sternum', 'are double bones'], 'Each rib articulates with the vertebral column by two surfaces.');
mc(3, 'skeletal system', 'Vertebrochondral ribs are', 'the 8th, 9th and 10th pairs, which join the 7th rib by hyaline cartilage', ['the 1st to 7th pairs', 'the 11th and 12th pairs', 'ribs attached to the sacrum'], 'False ribs do not reach the sternum directly.');
mc(3, 'skeletal system', 'The scapula lies in the dorsal part of the thorax between', 'the 2nd and 7th ribs', ['the 1st and 12th ribs', 'the 7th and 10th ribs', 'the atlas and axis'], 'It is a large, flat, triangular bone with a spine ending in the acromion.');
mc(3, 'skeletal system', 'The number of facial bones in the skull is', '14', ['8', '22', '29'], 'The face has 14 skeletal elements; the cranium has 8 bones.');
mc(3, 'skeletal system', 'The vertebral column of an adult has how many vertebrae as per NCERT?', '26', ['33', '24', '31'], '7 + 12 + 5 + 1 (sacral fused) + 1 (coccygeal fused) = 26.', 'The older count of 33 vertebrae counts the fused ones separately.');
mc(3, 'skeletal system', 'The neural canal is found in', 'each vertebra', ['the skull only', 'the sternum', 'the ribs'], 'The spinal cord passes through the central hollow portion of the vertebrae.');
mc(3, 'skeletal system', 'Which of these is NOT included in the skull as per NCERT?', 'Sternum', ['Hyoid', 'Ear ossicles', 'Facial bones'], 'The sternum belongs to the rib cage, not the skull.');
mc(3, 'joints', 'Which of these joints is correctly matched?', 'Ball and socket - humerus and pectoral girdle', ['Hinge - atlas and axis', 'Pivot - knee', 'Gliding - hip'], 'Pivot is at atlas and axis; hinge at knee; gliding between carpals; hip is ball and socket.');
mc(3, 'joints', 'Synovial joints are characterised by', 'a fluid-filled cavity between the articulating surfaces', ['sutures of fibrous tissue', 'cartilage joining bones', 'fusion of bones'], 'The synovial fluid allows considerable movement.');
mc(3, 'joints', 'Which type of joint permits NO movement?', 'Fibrous', ['Cartilaginous', 'Synovial', 'Ball and socket'], 'Fibrous joints are fixed. Cartilaginous give limited movement.');
mc(3, 'joints', 'In a joint, the contracting muscle uses the joint as', 'a fulcrum', ['a load', 'an effort', 'a muscle'], 'Force from the muscle is carried through bones, with the joint acting as the fulcrum of a lever.');
mc(3, 'disorders', 'Which disorder has an autoimmune cause?', 'Myasthenia gravis', ['Gout', 'Tetany', 'Osteoporosis'], 'In myasthenia gravis the immune system attacks the neuromuscular junction.');
mc(3, 'disorders', 'A person with low blood Ca2+ is likely to show', 'tetany', ['gout', 'osteoporosis from the oestrogen deficiency', 'myasthenia gravis'], 'Low Ca2+ in body fluid causes spasms called tetany.', 'Tetany is not tetanus (a bacterial disease).');
mc(3, 'disorders', 'A common cause of osteoporosis in older women is', 'decreased levels of oestrogen', ['excess calcium', 'excess uric acid', 'excess acetylcholine'], 'Decreased oestrogen leads to loss of bone mass.');
mc(3, 'disorders', 'Gout differs from osteoporosis because gout', 'is caused by uric acid crystals in joints', ['reduces bone mass', 'is due to low oestrogen', 'is a muscle disorder'], 'Gout is an inflammatory joint disease from uric acid crystals. Osteoporosis is loss of bone mass.');
mc(3, 'muscle structure', 'In a resting sarcomere which band contains both thick and thin filaments?', 'A band', ['I band only', 'H zone', 'Z line only'], 'The A band holds the whole thick filament and the overlapping ends of thin filaments. The H zone is the part with thick filaments only.');
mc(3, 'muscle structure', 'Which structure has no filaments at all but separates sarcomeres?', 'Z line', ['H zone', 'M line', 'A band'], 'The Z line is an elastic structure that bisects the I band and attaches actin.');

// ---------------------------------------------------------------- Level 4
mc(4, 'mechanism', 'A sarcomere shortens from 2.5 to 2.0 micrometres. The A band, which is 1.6 micrometres long, now', 'is still 1.6 micrometres long', ['is 1.1 micrometres long', 'is 1.3 micrometres long', 'is 2.0 micrometres long'], 'Only the I band and H zone shorten, not the A band. The I band shrinks from 0.9 to 0.4 micrometres.', 'People shorten the A band by the same 0.5.');
mc(4, 'mechanism', 'Which of these correctly lists what shortens during contraction?', 'Sarcomere, I band and H zone', ['Actin filament and myosin filament', 'A band and H zone', 'Myosin filament only'], 'Filaments only slide. The sarcomere (Z to Z), the I band and the H zone become shorter.');
mc(4, 'mechanism', 'At full contraction when thin filaments from both sides meet in the middle of the sarcomere, the', 'H zone disappears', ['A band disappears', 'Z lines move away', 'I band lengthens'], 'The H zone is the space between the ends of thin filaments. It vanishes if they meet.');
mc(4, 'mechanism', 'If the sarcoplasmic reticulum could not release Ca2+, then', 'the active sites on actin would stay masked and there would be no contraction', ['myosin would bind actin faster', 'ATP would be broken down faster', 'tropomyosin would become active'], 'No Ca2+ means troponin keeps masking the sites even if ATP and myosin are there.');
mc(4, 'mechanism', 'A poison that blocks ATP binding to the myosin head after the power stroke would cause', 'a rigid, locked muscle as cross bridges cannot be broken', ['complete relaxation', 'faster contraction', 'more Ca2+ release'], 'ATP is needed to detach myosin from actin, so lack of ATP leaves the heads attached (as in rigor).', 'ATP is used for detachment first and for the next power stroke next.');
mc(4, 'mechanism', 'A drug that blocks acetylcholine receptors of the motor end plate would', 'prevent the action potential in the sarcolemma', ['increase Ca2+ release', 'raise ACh production', 'activate troponin'], 'No ACh signal means no depolarisation and therefore no Ca2+ release from the SR.');
mc(4, 'mechanism', 'Which of the following is correct about the thin filament?', 'It is anchored to the Z line and pulled toward the centre of the A band', ['It is attached to the M line', 'It has ATPase heads', 'It is in the A band only'], 'Myosin heads, not actin, have ATPase activity. Thick filaments are held at the M line.');
mc(4, 'mechanism', 'Which of the following changes does NOT occur during muscle relaxation?', 'Release of Ca2+ from the sarcoplasmic reticulum', ['Pumping back of Ca2+ into the sarcoplasmic cisternae', 'Masking of actin\'s active sites by troponin', 'Return of Z lines to their original position'], 'Relaxation needs Ca2+ to be taken up. Release of Ca2+ starts contraction.');
mc(4, 'muscle fibres', 'A marathon runner depends mostly on muscle fibres that', 'have much myoglobin and mitochondria', ['rely on anaerobic glycolysis', 'have a lot of SR but few mitochondria', 'are pale in colour'], 'Red (aerobic) fibres use the stored oxygen for sustained ATP supply.');
mc(4, 'muscle fibres', 'Which statement is correct?', 'Red fibres contain myoglobin that stores oxygen', ['White fibres have more mitochondria than red fibres', 'Red fibres rely on anaerobic metabolism', 'Myoglobin is found in the I band only'], 'Myoglobin is the red pigment that stores oxygen in red fibres.');
mc(4, 'skeletal system', 'The axial skeleton total of 80 bones is obtained as (skull + vertebral column + sternum + ribs)', '29 + 26 + 1 + 24', ['22 + 26 + 1 + 24', '29 + 33 + 1 + 24', '22 + 26 + 12 + 24'], 'Skull 29 (22 + hyoid + 6 ossicles), vertebral column 26, sternum 1, ribs 24.');
mc(4, 'skeletal system', 'The number of bones in a human hand (carpals, metacarpals and phalanges) is', '27', ['30', '19', '14'], '8 + 5 + 14 = 27. A whole forelimb has 30 with humerus, radius and ulna.');
mc(4, 'skeletal system', 'How many bones are in both hind limbs together with the pelvic girdle?', '62', ['60', '64', '63'], 'Each hind limb 30 = 60; the pelvic girdle has 2 coxal bones; total 62.');
mc(4, 'skeletal system', 'The number of bones in both fore limbs together with the pectoral girdle is', '64', ['60', '62', '66'], 'Limbs 2 × 30 = 60; girdle 2 clavicles + 2 scapulae = 4; total 64.');
mc(4, 'skeletal system', 'The number of ribs that are not true ribs is', '10', ['5', '12', '14'], 'Total ribs 24, true ribs 14 (7 pairs), so 10 are false (6) or floating (4).', 'Counting pairs instead of ribs.');
mc(4, 'skeletal system', 'Which of the following is the order of parts of the vertebral column starting from the skull?', 'Cervical, thoracic, lumbar, sacral, coccygeal', ['Cervical, lumbar, thoracic, sacral, coccygeal', 'Thoracic, cervical, lumbar, coccygeal, sacral', 'Sacral, lumbar, thoracic, cervical, coccygeal'], 'The regions are 7, 12, 5, 1 and 1 vertebrae in that order.');
mc(4, 'skeletal system', 'Which statement about the human skull is correct?', 'It has two occipital condyles for articulation with the atlas', ['It has one condyle', 'It articulates with the axis directly', 'It has three condyles'], 'The human skull is dicondylic.');
mc(4, 'skeletal system', 'Choose the incorrect statement.', 'The femur is attached to the pectoral girdle', ['The humerus articulates with the glenoid cavity', 'The femur articulates with the acetabulum', 'The clavicle articulates with the acromion'], 'The femur joins the pelvic girdle, not the pectoral girdle.');
mc(4, 'joints', 'Which one is a synovial joint?', 'Joint between the humerus and the glenoid cavity', ['Sutures of the skull', 'Pubic symphysis', 'Joint between two adjacent vertebrae'], 'The shoulder joint has a synovial cavity. The pubic symphysis (fibrous cartilage) and the vertebral joint are cartilaginous; sutures are fibrous.');
mc(4, 'joints', 'In which pair are both joints freely movable?', 'Ball and socket and pivot', ['Suture and symphysis', 'Fibrous and cartilaginous', 'Pubic symphysis and suture'], 'Ball and socket and pivot are synovial and movable. The rest are fibrous or cartilaginous.');
mc(4, 'joints', 'Between which pair of bones is there a hinge joint?', 'Femur and tibia (with patella)', ['Atlas and axis', 'Humerus and scapula', 'Carpals'], 'The knee is a hinge joint. Atlas-axis is pivot; shoulder is ball and socket; carpals are gliding.');
mc(4, 'disorders', 'A patient has muscle weakness that worsens with activity and improves with rest. Antibodies against acetylcholine receptors are found. The disorder is', 'myasthenia gravis', ['muscular dystrophy', 'tetany', 'osteoporosis'], 'It is an autoimmune attack on the neuromuscular junction.', 'Muscular dystrophy is genetic and progressive without antibodies.');
mc(4, 'disorders', 'A baby boy shows progressive muscle weakness, runs in the family and gets worse with age. The likely disorder is', 'muscular dystrophy', ['tetany', 'myasthenia gravis', 'gout'], 'It is mostly genetic and progressive. Tetany is quick spasm; myasthenia is autoimmune.');
mc(4, 'disorders', 'Uric acid crystals deposited in joints cause', 'gout', ['osteoporosis', 'tetany', 'myasthenia gravis'], 'The crystals cause inflammation of joints.');
mc(4, 'mixed', 'A person suffering from gout will have a high level of', 'uric acid in blood, from purine breakdown', ['urea in blood only', 'ammonia in urine only', 'creatinine only'], 'Uric acid is the end product of purine breakdown; excess crystallises in joints. Compare with uric acid as the nitrogenous waste of birds.');
mc(4, 'mixed', 'A person with low Ca2+ in blood will show', 'tetany, as Ca2+ is needed to regulate muscle excitability', ['gout', 'myasthenia gravis', 'muscular dystrophy'], 'Low Ca2+ in body fluid leads to rapid spasms.', 'Ca2+ is also needed for contraction; its deficiency in blood raises excitability.');
mc(4, 'muscle structure', 'Which of the following correctly describes the sarcomere?', 'Portion of the myofibril between two successive Z lines', ['Portion between two M lines', 'Portion between two A bands', 'The H zone'], 'Z to Z is the sarcomere. The M line is within the A band.');

// ---------------------------------------------------------------- Level 5
mc(5, 'mechanism', 'Which statement about a contracting sarcomere is NOT correct?', 'The length of thick filaments decreases', ['The I band shortens', 'The A band length remains the same', 'Z lines move closer'], 'No filament shortens; sliding explains everything.');
mc(5, 'mechanism', 'Which of these shortens during contraction? (a) A band (b) I band (c) H zone (d) Thin filament (e) Sarcomere', '(b), (c) and (e)', ['(a), (b) and (c)', '(a), (d) and (e)', '(b), (d) and (e)'], 'The I band, H zone and sarcomere shorten. The A band and the filaments keep their length.');
mc(5, 'mechanism', 'Which sequence correctly shows events from Ca2+ release to the sarcomere shortening?', 'Ca2+ binds troponin, active sites exposed, myosin head binds actin, power stroke, Z lines pulled in', ['Myosin head binds actin, Ca2+ binds troponin, power stroke, Z lines pulled in', 'Power stroke, Ca2+ binds, active sites exposed, binding', 'Z lines pulled in, binding of ATP, Ca2+ release'], 'Ca2+ must unmask the sites before the head can bind.');
mc(5, 'mechanism', 'The muscle in a dead body becomes stiff because', 'ATP is not available to detach the myosin heads from actin', ['Ca2+ is not released', 'thin filaments break', 'troponin is destroyed'], 'The cross bridges formed stay locked as there is no ATP to break them.');
mc(5, 'skeletal system', 'Pick the correct count: bones of one half of the pectoral girdle and the arm plus hand', '32', ['30', '31', '33'], 'One clavicle + one scapula + forelimb 30 = 32.');
mc(5, 'skeletal system', 'Which of these correctly matches a girdle to its bones?', 'Pelvic girdle - two coxal bones', ['Pectoral girdle - two coxal bones', 'Pelvic girdle - clavicle and scapula', 'Pectoral girdle - ilium, ischium, pubis'], 'The pectoral girdle has clavicle and scapula on each side. The pelvic girdle has two coxal bones each of ilium, ischium and pubis.');
mc(5, 'skeletal system', 'How many pairs of ribs articulate dorsally with thoracic vertebrae?', 'All 12 pairs', ['7', '10', '5'], 'All the 12 pairs are connected dorsally to the thoracic vertebrae. Only the first seven reach the sternum directly.', 'True ribs are those that reach the sternum, not those that reach the vertebrae.');
mc(5, 'joints', 'Select the incorrect pair.', 'Hinge joint - atlas and axis', ['Ball and socket joint - shoulder', 'Saddle joint - thumb', 'Gliding joint - carpals'], 'Atlas and axis have a pivot joint.');
mc(5, 'joints', 'Which is a cartilaginous joint?', 'Pubic symphysis', ['Skull sutures', 'Shoulder joint', 'Knee joint'], 'The pubic symphysis has fibrous cartilage. Sutures are fibrous; shoulder and knee are synovial.');
mc(5, 'disorders', 'How many of the following are disorders caused by problems at or near joints: gout, arthritis, osteoporosis, tetany, myasthenia gravis?', 'Two', ['One', 'Three', 'Five'], 'Gout and arthritis involve joints. Osteoporosis is bone loss; tetany and myasthenia gravis affect muscles.');

// ---------------------------------------------------------------- Assertion-reason
asr(2, 'mechanism', 'Calcium ions are needed for muscle contraction.', 'Ca2+ binds to a subunit of troponin and unmasks the active sites on actin.', 0, 'Both are true and R explains A.');
asr(2, 'skeletal system', 'The human skull is dicondylic.', 'It has two occipital condyles that articulate with the atlas.', 0, 'Both are true; di- means two condyles.');
asr(3, 'muscle fibres', 'Red muscle fibres can contract for a long time.', 'They contain plenty of mitochondria and myoglobin for aerobic ATP production.', 0, 'The stored oxygen and mitochondria supply ATP continuously, so they resist fatigue.');
asr(3, 'mechanism', 'The A band shortens during muscle contraction.', 'Thick filaments slide over thin filaments.', 3, 'A is false: the A band stays the same. R is true.', 'Sliding does not mean shortening of filaments.');
asr(3, 'mechanism', 'Muscles become fatigued after repeated activation.', 'Lactic acid accumulates from anaerobic breakdown of glycogen.', 0, 'Both are true and R gives the cause.');
asr(3, 'skeletal system', 'The cervical vertebrae number seven in almost all mammals.', 'The giraffe has a very long neck and so has more cervical vertebrae.', 2, 'A is true; R is false: the giraffe also has seven cervical vertebrae, though each is long.', 'Long neck does not mean more vertebrae.');
asr(4, 'joints', 'The shoulder joint allows a wider range of movement than the knee joint.', 'The shoulder is a ball and socket joint and the knee is a hinge joint.', 0, 'Ball and socket joints permit movement in many planes. Hinge allows one plane.');
asr(4, 'disorders', 'Muscular dystrophy is not an autoimmune disease.', 'It is mostly caused by genetic changes.', 0, 'Both are true and R is the reason.');
asr(4, 'disorders', 'Tetany is caused by high levels of calcium in body fluid.', 'Calcium causes muscle contraction.', 3, 'A is false: tetany is due to low Ca2+. R is true but does not make A true.', 'High Ca2+ does not cause tetany.');
asr(4, 'skeletal system', 'The sternum is part of the axial skeleton.', 'It lies on the ventral midline of the thorax and joins the ribs.', 0, 'Both are true and the position explains why it belongs to the axis.');
asr(5, 'mechanism', 'In a muscle with no ATP, myosin heads remain bound to actin.', 'ATP is needed to break the cross bridge.', 0, 'Without ATP the heads cannot detach, so the muscle stays stiff.');
asr(5, 'joints', 'Skull sutures permit no movement.', 'Sutures are cartilaginous joints.', 2, 'A is true. R is false: sutures are fibrous joints.', 'Fibrous and cartilaginous are often mixed.');
asr(2, 'disorders', 'Osteoporosis is more common in women after menopause.', 'Oestrogen level falls and bone mass decreases.', 0, 'Reduced oestrogen is a common cause of bone loss.');

// ---------------------------------------------------------------- Statements
stm(2, 'muscle types', 'Skeletal muscles are striated and voluntary.', 'Cardiac muscles are smooth and involuntary.', 2, 'Statement I is correct. Cardiac muscle is striated and involuntary, so Statement II is incorrect.');
stm(2, 'skeletal system', 'There are 12 pairs of ribs in humans.', 'The first seven pairs are floating ribs.', 2, 'The first seven pairs are true ribs. Floating ribs are the last two pairs. Statement II is incorrect.');
stm(3, 'contractile proteins', 'Actin filaments are thinner than myosin filaments.', 'Tropomyosin masks the active sites in resting muscle with troponin.', 0, 'Both are correct.');
stm(3, 'muscle structure', 'The I band contains actin.', 'The A band contains only myosin.', 2, 'The A band contains myosin and the overlapping actin ends, so the first is correct and the second incorrect.');
stm(3, 'mechanism', 'Neuromuscular junction releases acetylcholine.', 'Calcium ions are released from the sarcolemma.', 2, 'Ca2+ comes from the sarcoplasmic reticulum, not the sarcolemma. Statement II is incorrect.');
stm(3, 'skeletal system', 'The femur is the longest bone.', 'The humerus is a bone of the hind limb.', 2, 'The humerus belongs to the fore limb. Statement II is incorrect.');
stm(3, 'disorders', 'Gout is due to deposition of uric acid crystals in joints.', 'Osteoporosis is inflammation of joints.', 2, 'Osteoporosis is loss of bone mass; arthritis is inflammation of joints.');
stm(4, 'muscle fibres', 'Red fibres are aerobic.', 'White fibres have more mitochondria than red fibres.', 2, 'White fibres have few mitochondria. Statement II is incorrect.');
stm(4, 'joints', 'Cartilaginous joints permit limited movement.', 'The pubic symphysis is an example.', 0, 'Both correct: the joint between adjacent vertebrae is also of this type.');
stm(4, 'skeletal system', 'The atlas articulates with the occipital condyles.', 'The axis articulates with the atlas in a pivot joint.', 0, 'Both are correct.');
stm(4, 'mechanism', 'The myosin head has ATPase activity.', 'The actin filament has ATPase heads.', 2, 'Only myosin heads are ATPase.');
stm(5, 'mechanism', 'During contraction the Z lines are pulled toward each other.', 'During contraction the H zone becomes wider.', 2, 'The H zone narrows or disappears.');
mc(3, 'skeletal system', 'Consider: (i) skull has 29 bones with hyoid and ossicles; (ii) vertebral column has 26 bones; (iii) there are 14 pairs of ribs; (iv) the sternum is flat. How many are correct?', 'Three', ['Two', 'Four', 'One'], '(i), (ii) and (iv) are correct. There are 12 pairs of ribs, not 14.', null, 'statements');
mc(4, 'joints', 'Which of the following are correctly paired? (a) Pivot - atlas and axis (b) Hinge - knee (c) Saddle - hip (d) Gliding - carpals', '(a), (b) and (d) only', ['(a), (b) and (c) only', '(b), (c) and (d) only', '(a) and (c) only'], 'Hip is a ball and socket joint, so (c) is wrong. The others are right.', null, 'statements');
mc(4, 'mechanism', 'How many of the following shorten during contraction: A band, I band, H zone, sarcomere, myosin filament, actin filament?', 'Three', ['Two', 'Four', 'Six'], 'I band, H zone and sarcomere shorten. Neither band of filaments nor the A band shorten.', null, 'statements');
mc(5, 'disorders', 'Which of these statements is NOT correct?', 'Myasthenia gravis is caused by low blood calcium', ['Tetany is due to low Ca2+ in body fluid', 'Muscular dystrophy is mostly genetic', 'Gout is due to uric acid crystals'], 'Myasthenia gravis is autoimmune at the neuromuscular junction.', null, 'statements');

// ---------------------------------------------------------------- Match
match(2, 'skeletal system', 'm1', 'Region and bone count', ['A. Cranial bones', 'B. Facial bones', 'C. Vertebral column', 'D. Axial skeleton'], ['p. 80', 'q. 14', 'r. 8', 's. 26'], 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-s, B-q, C-r, D-p'], 'Cranial 8, facial 14, vertebral column 26, axial skeleton 80.');
match(3, 'joints', 'm2', 'Joint and location', ['A. Ball and socket', 'B. Hinge', 'C. Pivot', 'D. Gliding'], ['p. Atlas and axis', 'q. Carpals', 'r. Shoulder', 's. Knee'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'], 'Shoulder is ball and socket, knee is hinge, atlas and axis is pivot, carpals is gliding.');
match(3, 'disorders', 'm3', 'Disorder and cause or feature', ['A. Myasthenia gravis', 'B. Tetany', 'C. Gout', 'D. Osteoporosis'], ['p. Low Ca2+ in body fluid', 'q. Autoimmune at neuromuscular junction', 'r. Uric acid crystals', 's. Decreased bone mass'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'These are the standard NCERT disorders.');
match(3, 'muscle structure', 'm4', 'Part of the sarcomere and description', ['A. A band', 'B. I band', 'C. Z line', 'D. M line'], ['p. Bisects the I band', 'q. Holds thick filaments together', 'r. Contains myosin (dark)', 's. Contains actin only (light)'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-r, B-p, C-s, D-q'], 'A band dark with myosin; I band light with actin; Z line bisects I; M line holds thick filaments.');
match(4, 'skeletal system', 'm5', 'Bone and region', ['A. Scapula', 'B. Patella', 'C. Hyoid', 'D. Acetabulum'], ['p. Knee', 'q. Pelvic girdle', 'r. Pectoral girdle', 's. Base of the buccal cavity'], 'A-r, B-p, C-s, D-q', ['A-q, B-p, C-s, D-r', 'A-r, B-s, C-p, D-q', 'A-p, B-r, C-s, D-q'], 'Scapula - pectoral girdle; patella - knee; hyoid - buccal cavity; acetabulum - coxal bone of pelvic girdle.');
match(4, 'contractile proteins', 'm6', 'Protein and role', ['A. Myosin head', 'B. Troponin', 'C. Tropomyosin', 'D. F-actin'], ['p. Masks active sites with troponin', 'q. ATPase activity', 'r. Binds Ca2+', 's. Thin filament backbone'], 'A-q, B-r, C-p, D-s', ['A-q, B-p, C-r, D-s', 'A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p'], 'The myosin head is ATPase; troponin binds Ca2+; tropomyosin helps mask the sites; F-actin forms the thin filament.');

// ---------------------------------------------------------------- Passages
pass('p1', 'Passage: a sarcomere at work', 'In a relaxed muscle a sarcomere is 2.5 micrometres long. The A band is 1.6 micrometres. On stimulation, calcium ions are released and the sarcomere shortens to 2.1 micrometres. During this the A band does not change.');
pq('p1', 3, 'mechanism', 'The length of the I band in the relaxed state is', '0.9 micrometres', ['1.6 micrometres', '2.5 micrometres', '0.5 micrometres'], 'Sarcomere = A band + I band (one full I band shared by neighbouring half bands). 2.5 - 1.6 = 0.9 micrometres.');
pq('p1', 3, 'mechanism', 'After contraction the I band length is', '0.5 micrometres', ['0.9 micrometres', '1.2 micrometres', '0.1 micrometres'], '2.1 - 1.6 = 0.5 micrometres.');
pq('p1', 4, 'mechanism', 'Which is the best explanation of the change?', 'Thin filaments slid over thick filaments after Ca2+ unmasked the actin sites', ['Thick filaments became shorter', 'Thin filaments became shorter', 'The A band became narrower'], 'The sliding filament mechanism explains the change with no shortening of filaments.');
pass('p2', 'Passage: a hospital ward', 'Patient P is a young man with a family history of progressive muscle weakness. Patient Q is a woman whose muscle weakness worsens through the day; tests show antibodies against receptors at the neuromuscular junction. Patient R is a woman of 70 who has a fractured hip after a small fall and low bone density. Patient S has a painful swollen big toe with uric acid crystals.');
pq('p2', 3, 'disorders', 'Patient Q most likely has', 'myasthenia gravis', ['muscular dystrophy', 'tetany', 'gout'], 'Autoimmune attack on the neuromuscular junction.');
pq('p2', 3, 'disorders', 'Patient R most likely has', 'osteoporosis', ['gout', 'tetany', 'myasthenia gravis'], 'Low bone density and fractures from minor falls fit osteoporosis.');
pq('p2', 4, 'disorders', 'Patient P and patient S have', 'muscular dystrophy and gout respectively', ['gout and tetany respectively', 'myasthenia gravis and gout respectively', 'tetany and muscular dystrophy respectively'], 'Familial progressive weakness suggests muscular dystrophy; uric acid crystals in a joint mean gout.');
pass('p3', 'Passage: counting bones', 'A museum chart lists a human skeleton as follows. Skull: cranial bones 8, facial bones 14, hyoid 1, ear ossicles 6. Vertebral column: cervical 7, thoracic 12, lumbar 5, sacral 1, coccygeal 1. Sternum 1 and ribs 24. Limbs 30 bones each. Pectoral and pelvic girdles.');
pq('p3', 3, 'skeletal system', 'The number of bones in the axial skeleton from this chart is', '80', ['79', '82', '126'], '29 + 26 + 1 + 24 = 80.');
pq('p3', 3, 'skeletal system', 'The number of bones in the appendicular skeleton is', '126', ['120', '130', '80'], 'Limbs 4 × 30 = 120; girdles 4 + 2 = 6; total 126.');
pq('p3', 4, 'skeletal system', 'Total bones in the whole skeleton are', '206', ['200', '212', '186'], '80 + 126 = 206.');

// ---------------------------------------------------------------- Extra variety
mc(2, 'skeletal system', 'Bone and cartilage differ because', 'bone has a hard matrix with calcium salts and cartilage has a pliable matrix with chondroitin salts', ['both have the same hard matrix', 'cartilage has more calcium', 'bone is not connective tissue'], 'Both are specialised connective tissues. Bone matrix is hard due to calcium salts; cartilage is pliable with chondroitin salts.');
mc(3, 'muscle structure', 'A muscle fibre is lined by', 'sarcolemma', ['fascia', 'sarcomere', 'endomysium only'], 'Fascia covers the bundle. Each fibre is lined by the plasma membrane called the sarcolemma.', 'Fascia covers fascicles, sarcolemma covers fibres.');
mc(2, 'mechanism', 'The junction of a motor neuron and the sarcolemma is the', 'neuromuscular junction or motor end plate', ['synaptic cleft of two neurons', 'Z line', 'sarcoplasmic cisterna'], 'The motor neuron releases acetylcholine here.');
mc(3, 'skeletal system', 'Which of the following is a feature of the vertebrae of the sacral region?', 'They are fused into one bone', ['They are 7 separate bones', 'They have no neural canal anywhere', 'They are attached to ribs'], 'In NCERT the sacral and coccygeal regions are counted as one fused bone each.');
mc(4, 'skeletal system', 'Which of these bones articulates with the axis?', 'The atlas', ['The femur', 'The occipital bone directly', 'The clavicle'], 'The atlas articulates with the occipital condyles above and the axis below.');
mc(3, 'muscle types', 'The muscles of the stomach wall are', 'smooth and involuntary', ['striated and voluntary', 'striated and involuntary', 'smooth and voluntary'], 'Visceral muscles line the digestive tract and other hollow organs.');
mc(5, 'mechanism', 'The molecular motor protein in muscle that hydrolyses ATP is', 'myosin (heavy meromyosin head)', ['actin', 'troponin', 'tropomyosin'], 'The globular head of HMM carries the ATPase site.');
mc(4, 'skeletal system', 'Which statement about limbs is correct?', 'Each limb has 14 phalanges', ['Each limb has 8 metacarpals', 'Forelimbs have 7 tarsals', 'Hind limbs have 8 carpals'], 'Metacarpals and metatarsals are 5 each; carpals 8; tarsals 7; phalanges 14 in each limb.');

export default { topic: 'locomotion', groups, items, gens: makeGens() };

function makeGens() {
  const gens = [];
  gens.push({
    id: 'lc-g01', type: 'nat', level: 2, exams: E, sub: 'bone counts',
    make(rng) {
      const f = int(rng, 1, 2), h = int(rng, 1, 2);
      const a = 30 * (f + h);
      return { q: `How many bones are there in ${f} human fore limb${f > 1 ? 's' : ''} and ${h} hind limb${h > 1 ? 's' : ''} together (girdles not counted)?`, answer: a, tol: 0, f, h, sol: `Idea: every limb has 30 bones.<br>Forelimb: humerus, radius, ulna, 8 carpals, 5 metacarpals and 14 phalanges = 30. Hind limb: femur, tibia, fibula, patella, 7 tarsals, 5 metatarsals and 14 phalanges = 30.<br>Total limbs = ${f} + ${h} = ${f + h}, so ${f + h} × 30 = ${a}.` };
    },
    verify(p) { return (p.f + p.h) * 30; },
  });
  gens.push({
    id: 'lc-g02', type: 'nat', level: 2, exams: E, sub: 'vertebral column',
    make(rng) {
      const regs = [['cervical', 7], ['thoracic', 12], ['lumbar', 5], ['sacral', 1], ['coccygeal', 1]];
      const k = int(rng, 2, 4);
      const idx = [0, 1, 2, 3, 4].sort(() => rng() - 0.5).slice(0, k);
      const names = idx.map((i) => regs[i][0]);
      const a = idx.reduce((s, i) => s + regs[i][1], 0);
      return { q: `How many vertebrae are there in the ${names.join(', ')} regions of the human vertebral column together (NCERT counts the sacrum and coccyx as one each)?`, answer: a, tol: 0, idx, sol: `Idea: add the counts of the regions.<br>Cervical 7, thoracic 12, lumbar 5, sacral 1, coccygeal 1.<br>Chosen: ${idx.map((i) => regs[i][0] + ' ' + regs[i][1]).join(' + ')} = ${a}.` };
    },
    verify(p) { const c = [7, 12, 5, 1, 1]; return p.idx.reduce((s, i) => s + c[i], 0); },
  });
  gens.push({
    id: 'lc-g03', type: 'nat', level: 3, exams: E, sub: 'sarcomere',
    make(rng) {
      const A = pick(rng, 1.4, 1.8, 0.1), I = pick(rng, 0.6, 1.0, 0.1), d = pick(rng, 0.2, 0.5, 0.1);
      const a = +(A + I - d).toFixed(2);
      return { q: `A relaxed sarcomere has an A band of ${A} µm and an I band of ${I} µm (the I band counted as one full band between two A bands). During contraction the I band shortens by ${d} µm. Find the new length of the sarcomere in µm.`, answer: a, tol: 0.01, unit: 'µm', A, I, d, sol: `Idea: sarcomere = A band + I band, and the A band does not change.<br>Relaxed length = ${A} + ${I} = ${+(A + I).toFixed(2)} µm.<br>New I band = ${I} - ${d} = ${+(I - d).toFixed(2)} µm.<br>New sarcomere = ${A} + ${+(I - d).toFixed(2)} = ${a} µm.`, trap: 'Do not shorten the A band; only the I band and H zone shorten.' };
    },
    verify(p) { return p.A + (p.I - p.d); },
  });
  gens.push({
    id: 'lc-g04', type: 'nat', level: 3, exams: E, sub: 'sarcomere',
    make(rng) {
      const L = pick(rng, 2.2, 2.6, 0.1), s = pick(rng, 10, 25, 5);
      const a = +(L * (1 - s / 100)).toFixed(3);
      return { q: `A sarcomere is ${L} µm long at rest. It shortens by ${s} per cent when the muscle contracts. What is its length in µm after contraction? Give three decimals.`, answer: a, tol: 0.005, unit: 'µm', L, s, sol: `Idea: new length = old length × (1 - fraction shortened).<br>${L} × (1 - ${s}/100) = ${L} × ${+(1 - s / 100).toFixed(2)} = ${a} µm.<br>The A band stays the same, so all the loss is in the I band and H zone.` };
    },
    verify(p) { return p.L - p.L * p.s / 100; },
  });
  gens.push({
    id: 'lc-g05', type: 'nat', level: 4, exams: E, sub: 'bone counts',
    make(rng) {
      const x = int(rng, 0, 2), y = int(rng, 0, 2);
      const a = 126 - x * 32 - y * 31;
      return { q: `A museum skeleton is missing ${x} complete fore limb${x === 1 ? '' : 's'} (with the clavicle and scapula of that side) and ${y} complete hind limb${y === 1 ? '' : 's'} (with the coxal bone of that side). How many bones remain in its appendicular skeleton (total 126)?`, answer: a, tol: 0, x, y, sol: `Idea: remove the limb and its half girdle from 126.<br>Fore limb side = 30 + clavicle + scapula = 32 bones. Hind limb side = 30 + 1 coxal bone = 31 bones.<br>126 - ${x} × 32 - ${y} × 31 = ${a}.`, trap: 'Forgetting the girdle bones that go with each limb.' };
    },
    verify(p) { return 126 - (p.x * 30 + p.x * 2) - (p.y * 30 + p.y); },
  });
  gens.push({
    id: 'lc-g06', type: 'nat', level: 3, exams: E, sub: 'ribs',
    make(rng) {
      const kinds = [['true', 7], ['vertebrochondral (false)', 3], ['floating', 2]];
      const k = int(rng, 1, 2);
      const idx = [0, 1, 2].sort(() => rng() - 0.5).slice(0, k + 1);
      const a = idx.reduce((s, i) => s + kinds[i][1] * 2, 0);
      return { q: `The ribs are grouped as true (7 pairs), vertebrochondral (3 pairs) and floating (2 pairs). How many individual ribs are there in the ${idx.map((i) => kinds[i][0]).join(' and ')} groups together?`, answer: a, tol: 0, idx, sol: `Idea: each pair has 2 ribs.<br>${idx.map((i) => `${kinds[i][0]}: ${kinds[i][1]} pairs = ${kinds[i][1] * 2}`).join('; ')}.<br>Total = ${a}.` };
    },
    verify(p) { const c = [7, 3, 2]; return p.idx.reduce((s, i) => s + 2 * c[i], 0); },
  });
  gens.push({
    id: 'lc-g07', type: 'nat', level: 2, exams: E, sub: 'bone counts',
    make(rng) {
      const k = int(rng, 1, 4);
      const a = 27 * k;
      return { q: `How many bones (carpals, metacarpals and phalanges) are there in ${k} human hand${k > 1 ? 's' : ''}?`, answer: a, tol: 0, k, sol: `Idea: one hand = 8 carpals + 5 metacarpals + 14 phalanges = 27 bones.<br>${k} × 27 = ${a}.` };
    },
    verify(p) { return (8 + 5 + 14) * p.k; },
  });
  gens.push({
    id: 'lc-g08', type: 'mcq', level: 3, exams: E, sub: 'skull',
    make(rng) {
      const e = int(rng, 1, 2), h = int(rng, 0, 1);
      const a = 22 + 3 * e + h;
      const o = numOpts(rng, a, [22 + e + h, 22 + 6 * e + h, a + 1], '');
      const t = `${e === 1 ? 'one ear' : 'both ears'}${h ? ' and the hyoid' : ''}`;
      return { q: `The skull has 22 cranial and facial bones. How many bones is that if we add the ear ossicles of ${t}?`, options: o.options, answer: o.answer, e, h, opts: o.options, sol: `Idea: add 3 ossicles for each ear (malleus, incus, stapes) and 1 for the hyoid if counted.<br>22 + 3 × ${e}${h ? ' + 1' : ''} = ${a}.` };
    },
    verify(p) { const v = 22 + 3 * p.e + p.h; return p.opts.findIndex((t) => t.trim() === String(v)); },
  });
  return gens;
}
