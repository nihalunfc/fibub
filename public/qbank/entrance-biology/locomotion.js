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

// ---------------------------------------------------------------- Added items (expansion)
function mt(level, sub, key, title, L1, L2, ans, sol, trap) {
  const L = 'ABCD';
  const code = (a) => a.map((c, i) => `${L[i]}-${c}`).join(', ');
  const a = ans.split('');
  const sw = (i, j) => { const b = [...a]; [b[i], b[j]] = [b[j], b[i]]; return code(b); };
  match(level, sub, key, title, L1, L2, code(a), [sw(0, 1), sw(2, 3), sw(0, 2)], sol, trap);
}
// L2
mc(2, 'muscle structure', 'A bundle of muscle fibres is covered by a layer of collagenous connective tissue called the', 'fascia', ['sarcolemma', 'periosteum', 'pericardium'], 'Many muscle fibres make a fascicle (muscle bundle). The fascicle is covered by the fascia. The sarcolemma lines each single fibre.');
mc(2, 'muscle structure', 'The thin filaments of a sarcomere are anchored to the', 'Z line', ['M line', 'H zone', 'A band'], 'The Z line bisects the I band and holds the thin (actin) filaments. The thick filaments are held together by the M line in the middle of the A band.');
mc(2, 'contractile proteins', 'The tail of a myosin monomer (meromyosin unit) is the', 'light meromyosin', ['heavy meromyosin', 'troponin', 'tropomyosin'], 'Each meromyosin has a globular head with a short arm (heavy meromyosin, HMM) and a tail (light meromyosin, LMM).');
mc(2, 'skeletal system', 'The number of thoracic vertebrae in a human is', '12', ['7', '5', '9'], 'There are 7 cervical, 12 thoracic and 5 lumbar vertebrae, plus the sacrum and coccyx. The 12 thoracic vertebrae carry the 12 pairs of ribs.');
mc(2, 'skeletal system', 'The two bones of the forearm are the', 'radius and ulna', ['humerus and radius', 'tibia and fibula', 'scapula and clavicle'], 'The humerus is in the upper arm. Tibia and fibula are in the leg. The scapula and clavicle form the pectoral girdle.');
mc(2, 'joints', 'The hip joint is an example of a', 'ball and socket joint', ['hinge joint', 'pivot joint', 'gliding joint'], 'The head of the femur fits into the acetabulum of the pelvic girdle and moves in many directions, like the shoulder joint.');
mc(2, 'muscle types', 'Each fibre of a smooth muscle has', 'a single nucleus and no cross striations', ['many nuclei and cross striations', 'a single nucleus and cross striations', 'many nuclei and no cross striations'], 'Smooth (visceral) muscle fibres are spindle shaped, uninucleate and unstriated. Skeletal fibres are multinucleate and striated.');
mc(2, 'skeletal system', 'The ribs are joined dorsally to the', 'thoracic vertebrae', ['cervical vertebrae', 'lumbar vertebrae', 'sacrum'], 'The 12 pairs of ribs articulate behind with the 12 thoracic vertebrae. In front, most join the sternum.');
mc(2, 'mechanism', 'The direct source of energy for the movement of the myosin head is', 'ATP', ['glucose', 'creatine', 'lactic acid'], 'The ATPase of the myosin head splits ATP and the released energy is used for the power stroke.');
mc(2, 'skeletal system', 'In an adult, the sacrum and the coccyx are each formed by', 'fusion of several vertebrae', ['fusion of several ribs', 'a single vertebra each', 'cartilage only, with no vertebrae'], 'NCERT shows the sacral and the coccygeal regions as fused vertebrae (1-fused each), so the column has 26 bones in an adult.');
mc(2, 'skeletal system', 'The pectoral girdle on each side consists of', 'a clavicle and a scapula', ['a clavicle and a humerus', 'an ilium and an ischium', 'a scapula and a coxal bone'], 'Each half of the pectoral girdle has a collar bone (clavicle) and a shoulder blade (scapula).');
mc(2, 'joints', 'The elbow joint, which moves in only one plane like a door, is a', 'hinge joint', ['pivot joint', 'saddle joint', 'fibrous joint'], 'A hinge joint allows bending and straightening only. The knee is another hinge joint.');
// L3 singles
mc(3, 'muscle structure', 'The correct order from the larger to the smaller structure in a skeletal muscle is', 'muscle, fascicle, muscle fibre, myofibril', ['muscle, myofibril, fascicle, muscle fibre', 'fascicle, muscle, muscle fibre, myofibril', 'muscle fibre, fascicle, myofibril, muscle'], 'A muscle is made of fascicles; a fascicle of muscle fibres; each fibre of many myofibrils; each myofibril of sarcomeres with the filaments.');
mc(3, 'mechanism', 'When Ca<sup>2+</sup> binds to troponin, then', 'the shape of troponin changes and tropomyosin moves off the active sites of actin', ['the myosin head is released from actin', 'ATP is split by troponin', 'Ca<sup>2+</sup> is pumped back into the sarcoplasmic reticulum'], 'The troponin-tropomyosin complex unmasks the myosin-binding sites on actin, so cross bridges can form.');
mc(3, 'mechanism', 'During the power stroke the myosin head pulls the actin filament', 'towards the centre of the sarcomere (the M line)', ['away from the M line towards the Z line', 'towards the Z line of the same side only', 'it does not move the actin'], 'The thin filaments slide inwards, so the Z lines come closer to each other and the sarcomere shortens.');
mc(3, 'skeletal system', 'Which of the following is NOT a part of the appendicular skeleton?', 'Sternum', ['Scapula', 'Clavicle', 'Femur'], 'The sternum is part of the axial skeleton (with the skull, the vertebral column and the ribs). Girdles and limb bones form the appendicular skeleton.', 'The scapula and the clavicle seem to belong to the trunk but are girdle bones.');
mc(3, 'skeletal system', 'How many separate (unfused) vertebrae does an adult human have in the cervical, thoracic and lumbar regions together?', '24', ['26', '33', '21'], '7 cervical + 12 thoracic + 5 lumbar = 24.', '26 counts the sacrum and coccyx as well.');
mc(3, 'skeletal system', 'Excluding the hyoid and the ear ossicles, the human skull (cranium and face) has how many bones?', '22', ['29', '8', '14'], 'Cranium 8 + face 14 = 22. With the hyoid (1) and the 6 ear ossicles the number rises to 29.');
mc(3, 'skeletal system', 'The total number of floating ribs in a human being is', '4', ['2', '6', '12'], 'The 11th and the 12th pairs are floating ribs: 2 pairs = 4 ribs.', 'The count is of ribs, not of pairs.');
mc(3, 'muscle fibres', 'The red colour of the red muscle fibres is due to', 'myoglobin', ['haemoglobin in the plasma', 'bilirubin', 'melanin'], 'Red fibres contain plenty of myoglobin, an oxygen-storing pigment. They also have many mitochondria and work aerobically.');
mc(3, 'contractile proteins', 'Which of these proteins is NOT a part of the thin filament?', 'Myosin', ['F-actin', 'Tropomyosin', 'Troponin'], 'The thin filament is made of F-actin, tropomyosin and troponin. Myosin forms the thick filament.');
mc(3, 'mechanism', 'Why does a muscle need ATP to relax and not only to contract?', 'ATP binding to the myosin head releases it from actin', ['ATP pumps the actin filaments out of the sarcomere', 'ATP makes the troponin bind Ca<sup>2+</sup> again', 'ATP destroys the acetylcholine'], 'A new ATP molecule binds the myosin head, which breaks the cross bridge. Without ATP, the heads stay bound (as in rigor).');
mc(3, 'mechanism', 'One motor neuron supplies 120 muscle fibres and another motor neuron supplies 80 other fibres. If both neurons fire, how many fibres contract?', '200', ['120', '80', '40'], 'A motor neuron with all its fibres is a motor unit. The two motor units are separate, so 120 + 80 = 200 fibres contract.');
mc(3, 'muscle types', 'Smooth muscle fibres differ from skeletal muscle fibres in lacking', 'the regular cross striations', ['actin and myosin', 'a plasma membrane', 'any nerve supply'], 'Smooth muscle has actin and myosin but not arranged in regular sarcomeres, so it has no cross striations. It is supplied by autonomic nerves.');
// L4 singles
mc(4, 'mechanism', 'A relaxed sarcomere is 2.5 micrometres long and its A band is 1.6 micrometres. After contraction the sarcomere is 2.0 micrometres. The I band (the whole I band of the sarcomere) is now', '0.4 micrometre', ['0.9 micrometre', '1.6 micrometres', '0.5 micrometre'], 'The A band does not change. Sarcomere = A band + I band. Before: 2.5 - 1.6 = 0.9. After: 2.0 - 1.6 = 0.4 micrometre.', '0.5 is the shortening of the sarcomere, not the I band length.');
mc(4, 'mechanism', 'A muscle fibre is made of 40,000 sarcomeres in series, each 2.5 micrometres long. If every sarcomere shortens to 2.0 micrometres, the fibre shortens by', '2 cm', ['0.5 cm', '1 cm', '4 cm'], 'Original length = 40,000 &times; 2.5 = 1,00,000 micrometres = 10 cm. New length = 40,000 &times; 2.0 = 80,000 micrometres = 8 cm. Shortening = 2 cm.', 'Multiply by the number of sarcomeres.');
mc(4, 'mechanism', 'A poison stops the calcium pumps of the sarcoplasmic reticulum, so Ca<sup>2+</sup> remains high in the sarcoplasm after a stimulus. The muscle', 'stays contracted and cannot relax', ['relaxes faster', 'cannot contract at all', 'relaxes normally but contracts more weakly'], 'Relaxation needs Ca<sup>2+</sup> to be pumped back so that the active sites are masked again. With Ca<sup>2+</sup> staying high and ATP available, cross bridges keep forming.');
mc(4, 'skeletal system', 'How many bones of the appendicular skeleton lie on the right side of the body?', '63', ['60', '126', '64'], 'Right forelimb 30 + right hind limb 30 + clavicle 1 + scapula 1 + coxal bone 1 = 63. This is half of 126.', 'The two coxal bones together are a single pelvic girdle, but each side has one.');
mc(4, 'skeletal system', 'The vertebral column, the sternum and the ribs together have how many bones?', '51', ['80', '50', '57'], '26 + 1 + 24 = 51. Adding the 29 bones of the skull gives the 80 bones of the axial skeleton.');
mc(4, 'skeletal system', 'How many ribs are attached directly to the sternum?', '14', ['7', '10', '24'], 'The 7 pairs of true ribs reach the sternum: 14 ribs. The 3 pairs of false ribs join the 7th rib cartilage and the 2 pairs of floating ribs are free.', '7 is the number of pairs.');
mc(4, 'disorders', 'Tetany due to a low level of blood calcium can follow the removal of the', 'parathyroid glands', ['thyroid gland only', 'adrenal cortex', 'posterior pituitary'], 'Parathyroid hormone raises blood Ca<sup>2+</sup>. Without it, calcium falls and the muscles go into spasms. The thyroid does not make parathormone.');
mc(4, 'disorders', 'The uric acid that is deposited in the joints of a person with gout is the end product of the breakdown of', 'purines', ['fatty acids', 'starch', 'cholesterol'], 'Uric acid comes from the breakdown of purines of nucleic acids. Excess uric acid forms crystals in the joints and causes pain and swelling.');
mc(4, 'muscle structure', 'A cross section through a relaxed sarcomere at the I band would show', 'only thin filaments', ['only thick filaments', 'both thick and thin filaments', 'no filaments'], 'The I band has only actin filaments (anchored to the Z line). Thick filaments are limited to the A band.');
mc(4, 'muscle structure', 'A cross section through the H zone of a relaxed sarcomere would show', 'only thick filaments', ['only thin filaments', 'both thick and thin filaments', 'no filaments'], 'The H zone is the middle part of the A band that the thin filaments do not reach, so only myosin is seen.');
mc(4, 'skeletal system', 'Which of the following has the greatest number of bones?', 'The skull (with hyoid and ear ossicles)', ['One hand', 'One foot', 'The 24 ribs'], 'Skull 29; one hand 8 + 5 + 14 = 27; one foot 7 + 5 + 14 = 26; ribs 24.', 'The skull has more bones than the hand.');
mc(4, 'mechanism', 'The first event after a nerve impulse reaches the motor end plate is', 'release of acetylcholine into the synaptic cleft', ['release of Ca<sup>2+</sup> from the sarcoplasmic reticulum', 'binding of myosin heads to actin', 'splitting of ATP by troponin'], 'The impulse makes the nerve ending release ACh. This depolarises the sarcolemma, and then Ca<sup>2+</sup> is released from the SR.');
mc(4, 'mechanism', 'A muscle fibre is placed in a solution that contains no Ca<sup>2+</sup> at all and is then stimulated. It still contracts, because', 'the Ca<sup>2+</sup> for contraction comes from the sarcoplasmic reticulum inside the fibre', ['the sarcolemma absorbs Ca<sup>2+</sup> from the air', 'Ca<sup>2+</sup> is not needed for contraction', 'ATP supplies the Ca<sup>2+</sup>'], 'The store house of Ca<sup>2+</sup> is the sarcoplasmic reticulum. The action potential triggers its release inside the fibre.');
// L5 singles
mc(5, 'mechanism', 'A sarcomere shortens by 0.5 micrometre and the thick filaments keep their length. By how much does the H zone shorten?', '0.5 micrometre', ['0.25 micrometre', '1.0 micrometre', 'It does not change'], 'Thin filaments of the two halves each slide in by 0.25 micrometre. The Z lines move in by 0.25 on each side, so the sarcomere shortens by 0.5. The two sets of thin filaments move towards each other, so the gap between their ends (the H zone) also shortens by 2 &times; 0.25 = 0.5 micrometre.', 'The H zone changes by the full amount, not by half.');
mc(5, 'mechanism', 'When the thin filaments slide 0.25 micrometre towards the M line on each side, the sarcomere shortens by', '0.5 micrometre', ['0.25 micrometre', '1.0 micrometre', 'it does not shorten'], 'Each half-sarcomere gets shorter by 0.25 micrometre (the Z line moves inward), so the whole sarcomere, which has two halves, shortens by 0.5 micrometre.', 'A sarcomere has two halves.');
mc(5, 'muscle structure', 'Arrange from the largest to the smallest: (1) myofibril, (2) fascicle, (3) muscle fibre, (4) sarcomere. The correct order is', '2, 3, 1, 4', ['3, 2, 1, 4', '2, 1, 3, 4', '2, 3, 4, 1'], 'The fascicle has fibres, each fibre has myofibrils, and each myofibril is made of sarcomeres in series.');
// Assertion
asr(3, 'mechanism', 'A muscle needs ATP in order to relax.', 'The binding of ATP to the myosin head detaches it from actin.', 0, 'Without ATP the cross bridges stay in place (rigor). R explains A.');
asr(3, 'muscle structure', 'Skeletal muscle appears striated under the microscope.', 'The thick and the thin filaments are arranged in a regular alternating pattern of bands.', 0, 'The dark A bands and the light I bands repeat along the myofibrils, so the whole fibre looks cross-striped. R explains A.');
asr(3, 'muscle types', 'The muscles of the stomach wall are not under voluntary control.', 'They are smooth muscles supplied by the autonomic nervous system.', 0, 'Visceral muscles are unstriated and involuntary; the autonomic nerves control them. R explains A.');
asr(3, 'muscle fibres', 'Red muscle fibres look red.', 'They contain the oxygen-storing pigment myoglobin.', 0, 'Myoglobin is a red pigment, so fibres with much myoglobin look red. R explains A.');
asr(3, 'joints', 'The knee joint is a hinge joint.', 'A hinge joint allows movement in all directions.', 2, 'A is true. R is false: a hinge joint allows movement in one plane only. The ball and socket joint allows all-direction movement.');
asr(3, 'skeletal system', 'The clavicle is a part of the pectoral girdle.', 'The clavicle is also called the shoulder blade.', 2, 'A is true. R is false: the clavicle is the collar bone; the scapula is the shoulder blade.');
asr(3, 'skeletal system', 'The ribs are bicephalic.', 'Each rib has two articulation surfaces on its dorsal end.', 0, 'The dorsal end of a typical rib has two parts, the head and the tubercle, which articulate with the vertebra. R is the meaning of bicephalic.');
asr(4, 'muscle structure', 'The H zone narrows during muscle contraction.', 'The thin filaments are pulled into the central part of the A band.', 0, 'The H zone is the part of the A band not reached by thin filaments. As they slide in, the zone gets smaller. R explains A.');
asr(4, 'joints', 'The pubic symphysis permits only slight movement.', 'It is a cartilaginous joint.', 0, 'Cartilaginous joints (the pubic symphysis, joints between vertebrae) permit limited movement. R explains A.');
asr(4, 'joints', 'The sutures of the skull do not permit any movement.', 'They are fibrous joints in which the bones are bound by dense connective tissue.', 0, 'Fibrous joints are fixed. The skull sutures are of this type. R explains A.');
asr(4, 'disorders', 'Myasthenia gravis is an autoimmune disorder.', 'Antibodies attack the receptors at the neuromuscular junction.', 0, 'The antibodies against the ACh receptors make the muscle weak. R explains A.');
asr(4, 'disorders', 'Osteoporosis makes bones more likely to fracture.', 'In osteoporosis the bone mass is decreased.', 0, 'Less bone mass means fragile bones. R explains A.');
asr(5, 'mechanism', 'During contraction the distance between a Z line and the M line decreases.', 'The thin filaments are anchored to the Z line and are pulled towards the M line in the middle of the thick filaments.', 0, 'Since the thin filaments slide towards the centre, each Z line moves to the M line. R explains A.');
asr(5, 'disorders', 'Tetany is caused by a low level of Ca<sup>2+</sup> in the body fluid.', 'Low Ca<sup>2+</sup> makes the muscles show rapid spasms.', 0, 'A fall in Ca<sup>2+</sup> makes nerves and muscles over-excitable and spasms follow. R explains A.');
// Statements
stm(3, 'muscle types', 'Cardiac muscles are striated and involuntary.', 'Visceral muscles are striated and voluntary.', 2, 'I is correct. II is wrong: visceral (smooth) muscles are unstriated and involuntary.');
stm(3, 'skeletal system', 'The pelvic girdle consists of two coxal bones.', 'Each coxal bone is formed by the fusion of an ilium, an ischium and a pubis.', 0, 'Both are correct. The two coxal bones meet ventrally at the pubic symphysis.');
stm(3, 'muscle structure', 'The thin filaments are attached to the Z line.', 'The thick filaments extend through both the A band and the I band.', 2, 'I is correct. II is wrong: the thick filaments are limited to the A band; the I band has only thin filaments.');
stm(3, 'joints', 'Fibrous joints do not allow any movement.', 'Cartilaginous joints allow a considerable range of movement.', 2, 'I is correct. II is wrong: cartilaginous joints allow only limited movement.');
stm(3, 'muscle fibres', 'White muscle fibres have less myoglobin than red fibres.', 'White fibres depend mainly on anaerobic processes for their energy.', 0, 'Both are correct. White fibres have few mitochondria and little myoglobin, and are used for short bursts of activity.');
stm(3, 'skeletal system', 'The vertebral column of an adult has 26 bones.', 'The sacrum is formed by the fusion of the cervical vertebrae.', 2, 'I is correct. II is wrong: the sacrum is formed by the fusion of vertebrae of the sacral region, not the cervical ones.');
stm(4, 'skeletal system', 'Each rib is attached dorsally to a thoracic vertebra.', 'The floating ribs are attached to the sternum by cartilage.', 2, 'I is correct. II is wrong: the floating ribs are free at the ventral end.');
stm(4, 'skeletal system', 'The femur articulates with the acetabulum of the coxal bone.', 'The humerus articulates with the glenoid cavity of the scapula.', 0, 'Both are correct. They are the hip and shoulder ball and socket joints.');
stm(4, 'mechanism', 'During contraction the H zone and the I band get shorter.', 'During contraction the A band gets longer.', 2, 'I is correct. II is wrong: the A band keeps the length of the thick filaments.');
stm(4, 'contractile proteins', 'Troponin binds Ca<sup>2+</sup> during muscle contraction.', 'Tropomyosin is the protein that binds Ca<sup>2+</sup>.', 2, 'I is correct. II is wrong: tropomyosin lies along F-actin and masks the sites, while troponin binds the calcium.');
stm(4, 'disorders', 'Myasthenia gravis is an autoimmune disorder acting on the neuromuscular junction.', 'Muscular dystrophy is also an autoimmune disorder.', 2, 'I is correct. II is wrong: muscular dystrophy is mostly of genetic origin.');
mc(4, 'disorders', 'Which of the following statements are correct? (a) Gout is due to uric acid crystals in the joints. (b) Osteoporosis increases the risk of fractures. (c) Tetany is caused by a high level of Ca<sup>2+</sup>. (d) Arthritis is the inflammation of the joints. (e) Muscular dystrophy is an autoimmune disease. How many are correct?', 'Three', ['Two', 'Four', 'Five'], '(a), (b) and (d) are correct. (c) is wrong (low Ca<sup>2+</sup> causes tetany) and (e) is wrong (muscular dystrophy is genetic).', 'High and low calcium are often swapped.', 'statements');
mc(5, 'muscle structure', 'Which of the following are correct? (a) A sarcomere lies between two Z lines. (b) The A band is made of thick filaments only. (c) The I band has only thin filaments. (d) The H zone has only thick filaments. (e) The Z line bisects the I band. How many are correct?', 'Four', ['Three', 'Five', 'Two'], '(a), (c), (d) and (e) are correct. (b) is wrong: the A band also has the thin filaments that overlap the thick filaments at its two ends.', 'The A band is not purely thick.', 'statements');
mc(5, 'joints', 'Which of the following are correct pairs? (a) hinge joint - knee; (b) pivot joint - atlas and axis; (c) saddle joint - carpal and metacarpal of the thumb; (d) gliding joint - knee; (e) ball and socket - pubic symphysis. How many are correct?', 'Three', ['Two', 'Four', 'Five'], '(a), (b) and (c) are correct. (d) is wrong (gliding joints are between the carpals) and (e) is wrong (the pubic symphysis is cartilaginous).', 'Check each pair separately.', 'statements');
// Match
mt(3, 'skeletal system', 'x1', 'Parts of the vertebral column and their numbers', ['A. Cervical vertebrae', 'B. Thoracic vertebrae', 'C. Lumbar vertebrae', 'D. Total bones in an adult column'], ['p. 12', 'q. 7', 'r. 5', 's. 26'], 'qprs', 'Cervical 7 (q), thoracic 12 (p), lumbar 5 (r) and the adult column has 26 bones (s).');
mt(3, 'joints', 'x2', 'Joints and where they occur', ['A. Pivot joint', 'B. Hinge joint', 'C. Gliding joint', 'D. Saddle joint'], ['p. Between the carpals', 'q. Between the atlas and the axis', 'r. Between the carpal and the metacarpal of the thumb', 's. Knee', 't. Between the skull bones'], 'qspr', 'Atlas and axis form a pivot joint (q); the knee is a hinge (s); the carpals glide on each other (p); the thumb has a saddle joint (r). The skull bones (t) have fibrous joints.');
mt(4, 'contractile proteins', 'x3', 'Proteins of the sarcomere and their roles', ['A. F-actin', 'B. Tropomyosin', 'C. Troponin', 'D. Light meromyosin'], ['p. Rod-like tail of the myosin', 'q. Binds Ca<sup>2+</sup>', 'r. Polymer of G-actin', 's. Masks the active sites of actin'], 'rsqp', 'F-actin is a polymer of G-actin (r), tropomyosin masks the active sites (s), troponin binds Ca<sup>2+</sup> (q), LMM is the tail of myosin (p).');
mt(4, 'muscle structure', 'x4', 'Bands and lines of the sarcomere', ['A. A band', 'B. I band', 'C. H zone', 'D. Z line'], ['p. Bisects the I band; the thin filaments attach to it', 'q. Light band that has only thin filaments', 'r. Dark band with thick filaments and the overlapping thin filaments', 's. Middle part of the A band not overlapped by thin filaments', 't. Contractile unit of the myofibril'], 'rqsp', 'A band = dark band of thick filaments (r); I band = light band of thin filaments (q); H zone = central part with only thick filaments (s); Z line anchors the thin filaments and bisects the I band (p). The sarcomere (t) is not used.');
mt(3, 'disorders', 'x5', 'Disorders and their features', ['A. Myasthenia gravis', 'B. Muscular dystrophy', 'C. Tetany', 'D. Osteoporosis'], ['p. Low Ca<sup>2+</sup> in body fluid causes rapid spasms', 'q. Decreased bone mass and higher chance of fractures', 'r. Autoimmune; acts at the neuromuscular junction', 's. Progressive degeneration of skeletal muscle, mostly genetic'], 'rspq', 'Myasthenia gravis is autoimmune at the junction (r). Muscular dystrophy is genetic degeneration (s). Tetany is due to low Ca<sup>2+</sup> (p). Osteoporosis is loss of bone mass (q).');
mt(3, 'skeletal system', 'x6', 'Girdle and vertebral features', ['A. Glenoid cavity', 'B. Acetabulum', 'C. Pubic symphysis', 'D. Atlas'], ['p. Cavity of the coxal bone', 'q. First cervical vertebra', 'r. Cavity of the scapula', 's. Joins the two coxal bones ventrally'], 'rpsq', 'The glenoid cavity is in the scapula (r), the acetabulum in the coxal bone (p), the pubic symphysis joins the two coxal bones (s), and the atlas is the first vertebra (q).');
mt(4, 'skeletal system', 'x7', 'Parts of the skeleton and the number of bones', ['A. Skull (with hyoid and ossicles)', 'B. Vertebral column', 'C. Rib cage (ribs and sternum)', 'D. One forelimb'], ['p. 30', 'q. 29', 'r. 26', 's. 25'], 'qrsp', 'Skull 29 (q), vertebral column 26 (r), ribs 24 + sternum 1 = 25 (s), one forelimb 30 (p).', 'The rib cage count must include the sternum.');
mt(4, 'muscle fibres', 'x8', 'Muscle fibre features', ['A. Red fibres', 'B. White fibres', 'C. Sarcoplasmic reticulum', 'D. Motor end plate'], ['p. Anaerobic, tire quickly', 'q. Junction of a motor neuron and the sarcolemma', 'r. Store house of Ca<sup>2+</sup>', 's. Rich in myoglobin and mitochondria'], 'sprq', 'Red fibres are rich in myoglobin and mitochondria (s); white fibres are anaerobic and tire fast (p); the SR stores Ca<sup>2+</sup> (r); the motor end plate is the neuromuscular junction (q).');
mt(4, 'skeletal system', 'x9', 'Types of ribs', ['A. True ribs', 'B. False ribs', 'C. Floating ribs', 'D. All the ribs'], ['p. 12 pairs in total', 'q. Joined by cartilage to the seventh rib', 'r. Free at the ventral end', 's. Attached directly to the sternum'], 'sqrp', 'True ribs (first 7 pairs) reach the sternum (s). The 8th, 9th and 10th pairs join the 7th rib cartilage (q). The 11th and 12th pairs are free (r). The total is 12 pairs (p).');
mt(5, 'mechanism', 'x10', 'Steps of contraction and their immediate result', ['A. Release of acetylcholine at the motor end plate', 'B. Release of Ca<sup>2+</sup> from the sarcoplasmic reticulum', 'C. Binding of Ca<sup>2+</sup> to troponin', 'D. Binding of the myosin head to the exposed actin site'], ['p. Active sites on actin are unmasked', 'q. Action potential is set up in the sarcolemma', 'r. Ca<sup>2+</sup> becomes available to bind troponin', 's. Cross bridge forms and the actin is pulled'], 'qrps', 'ACh starts the action potential (q). The action potential releases Ca<sup>2+</sup>, which can then bind troponin (r). Binding unmasks the active sites (p). The head then binds actin and pulls it (s).', 'Keep the order of the events straight.');
// Passages
pass('x11', 'Sarcomere measurements', 'A relaxed sarcomere is 2.5 micrometres long and its A band is 1.6 micrometres. During contraction the sarcomere shortens to 2.0 micrometres.');
pq('x11', 3, 'mechanism', 'The length of the I band (as the whole I band of one sarcomere) in the relaxed state is', '0.9 micrometre', ['1.6 micrometres', '2.5 micrometres', '0.45 micrometre'], 'Sarcomere = A band + I band, so I band = 2.5 - 1.6 = 0.9 micrometre.', '0.45 is the half I band on one side.');
pq('x11', 3, 'mechanism', 'After the contraction the I band is', '0.4 micrometre', ['0.5 micrometre', '0.9 micrometre', '1.6 micrometres'], '2.0 - 1.6 = 0.4 micrometre.');
pq('x11', 4, 'mechanism', 'After the contraction the length of the A band is', '1.6 micrometres, unchanged', ['1.1 micrometres', '2.0 micrometres', '0.4 micrometre'], 'The A band shows the length of the thick filaments, which do not shorten. Only the overlap changes.');
pass('x12', 'Three muscle fibres under test', 'Three isolated muscle fibres are stimulated. Fibre X is in a normal solution. Fibre Y is in a solution with a poison that stops the release of Ca<sup>2+</sup> from the sarcoplasmic reticulum. Fibre Z has no ATP left after it has contracted.');
pq('x12', 4, 'mechanism', 'Fibre Y', 'does not contract, because the active sites of actin stay masked', ['contracts normally', 'contracts and cannot relax', 'contracts because ATP alone is enough'], 'No Ca<sup>2+</sup> reaches troponin, so tropomyosin keeps hiding the myosin-binding sites.');
pq('x12', 4, 'mechanism', 'Fibre Z', 'stays stiff, because the cross bridges cannot be broken without ATP', ['relaxes completely', 'shortens still more', 'loses its Ca<sup>2+</sup> at once'], 'ATP binding to the head is needed to release it from actin. Without ATP the fibre stays rigid.', 'This is the basis of rigor mortis.');
pq('x12', 5, 'mechanism', 'Fibre X relaxes after the stimulus mainly because', 'Ca<sup>2+</sup> is pumped back into the sarcoplasmic reticulum and the active sites are masked again', ['the myosin filaments leave the sarcomere', 'acetylcholine enters the fibre', 'the Z lines move apart by an active motor'], 'When the Ca<sup>2+</sup> level in the sarcoplasm falls, troponin releases it and tropomyosin covers the actin sites again, so the cross bridges stop forming.');
pass('x13', 'A list of joints', 'A student makes a list of joints: (1) between the atlas and the axis; (2) between two adjacent vertebrae; (3) the knee; (4) the sutures of the skull; (5) the shoulder; (6) between two carpals; (7) the pubic symphysis.');
pq('x13', 3, 'joints', 'Which of the joints are synovial?', '1, 3, 5 and 6', ['2, 4 and 7', '1, 2 and 3', '3, 4, 5 and 7'], 'Pivot (1), hinge (3), ball and socket (5) and gliding (6) joints are all synovial. (2) and (7) are cartilaginous and (4) is fibrous.');
pq('x13', 4, 'joints', 'Which joint in the list allows no movement?', '(4) only', ['(2) and (7)', '(1) only', '(6) only'], 'The skull sutures are fibrous joints and are immovable. The cartilaginous joints permit a little movement.');
pq('x13', 4, 'joints', 'How many of the seven joints are cartilaginous?', 'Two', ['One', 'Three', 'Four'], 'The joints between the vertebrae (2) and the pubic symphysis (7) are cartilaginous.');


// ---------------------------------------------------------------- Level 5 round (v5): top-rank items with fixed ids
const V5 = ['neet'];
const V5POS = [1, 3, 0, 2, 2, 0, 3, 1, 1, 2, 3, 0];
let v5i = 0;
const v5take = () => V5POS[v5i++ % V5POS.length];
const v5place = (correct, wrongs) => { const p = v5take(); const o = [...wrongs]; o.splice(p, 0, correct); return [o, p]; };
function v5mc(id, sub, q, correct, wrongs, sol, trap, format = 'single', group) {
  const [options, answer] = v5place(correct, wrongs);
  items.push({ id, type: 'mcq', level: 5, format, exams: V5, sub, ...(group ? { group } : {}), q, options, answer, sol, ...(trap ? { trap } : {}) });
}
function v5asr(id, sub, A, R, ans, sol, trap) {
  items.push({ id, type: 'mcq', level: 5, format: 'assertion', exams: V5, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function v5stm(id, sub, s1, s2, ans, sol, trap) {
  items.push({ id, type: 'mcq', level: 5, format: 'statements', exams: V5, sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function v5cnt(id, sub, q, correct, wrongs, sol, trap) { v5mc(id, sub, q, correct, wrongs, sol, trap, 'statements'); }
function v5match(id, sub, key, title, list1, list2, ans, sol, trap) {
  groups[key] = { title, list1, list2 };
  const L = 'ABCD';
  const code = (a) => a.map((c, i) => `${L[i]}-${c}`).join(', ');
  const a = ans.split('');
  const sw = (i, j) => { const b = [...a]; [b[i], b[j]] = [b[j], b[i]]; return code(b); };
  const [options, answer] = v5place(code(a), [sw(0, 1), sw(2, 3), sw(0, 2)]);
  items.push({ id, type: 'mcq', level: 5, format: 'match', exams: V5, sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer, sol, ...(trap ? { trap } : {}) });
}
function v5pass(key, title, passage) { groups[key] = { title, passage }; }

v5mc('lc-v501', 'skeleton counts', 'How many bones are there in the vertebral column, the rib cage (ribs and sternum), the hyoid and the ear ossicles of an adult human, taken together?', '58', ['52', '57', '64'],
  'Idea: add the parts one by one. Vertebral column 26 (7 + 12 + 5 + 1 sacrum + 1 coccyx). Ribs 24 (12 pairs) and sternum 1, so the rib cage is 25. Hyoid 1. Ear ossicles 6 (3 in each ear). Total 26 + 25 + 1 + 6 = 58. The value 52 leaves out the ossicles and 57 leaves out the hyoid. The value 64 counts the ossicles twice.',
  'The ear ossicles are 6 in all, not 3.');
v5mc('lc-v502', 'disorders and genetics', 'A form of muscular dystrophy is inherited as an X-linked recessive trait. A man without the disorder marries a woman who is a carrier. What fraction of all their children is expected to be affected?', 'one-fourth', ['one-half', 'one-eighth', 'none'],
  'Idea: work out the cross. Mother X<sup>D</sup>X<sup>d</sup>, father X<sup>D</sup>Y. Children: X<sup>D</sup>X<sup>D</sup> (normal daughter), X<sup>D</sup>X<sup>d</sup> (carrier daughter), X<sup>D</sup>Y (normal son), X<sup>d</sup>Y (affected son), each 1/4. So 1/4 of all children are affected (half of the sons). No daughter is affected, since the father gives her a normal X. The value one-half is the fraction among the sons only.',
  'Half of the sons are affected, but only a quarter of all children.');
v5mc('lc-v503', 'sarcomere', 'A relaxed sarcomere is 2.4 &micro;m long. Its A band is 1.5 &micro;m, and each thin filament is 0.9 &micro;m long, measured from its Z line. By what percentage must the sarcomere shorten for the H zone to disappear? (Assume the thick filaments keep their length.)', '25%', ['12.5%', '20%', '37.5%'],
  'Idea: the H zone is the part of the A band that has no thin filament. The I band is 2.4 &minus; 1.5 = 0.9 &micro;m, so half of it, 0.45 &micro;m, lies on each side. Each thin filament therefore enters the A band by 0.9 &minus; 0.45 = 0.45 &micro;m. H zone = 1.5 &minus; 2 &times; 0.45 = 0.6 &micro;m. For it to vanish, each thin filament must slide 0.3 &micro;m inwards from each side, so the sarcomere shortens by 0.6 &micro;m. 0.6/2.4 = 25% (the sarcomere is then 1.8 &micro;m long). The value 12.5% forgets that two sides slide. The value 37.5% is the I band as a fraction of the sarcomere.',
  'Both sides move, so the sarcomere shortens by twice the slide of one thin filament.');
v5mc('lc-v504', 'neuromuscular junction', 'A poison blocks the enzyme that breaks down acetylcholine at the motor end plate of skeletal muscle. Its immediate effect is', 'repeated stimulation of the fibre, with twitching and spasm of the muscle', ['at once a limp paralysis, because no acetylcholine is released', 'a block in the release of Ca<sup>2+</sup>, so the muscle cannot contract', 'relaxation of the muscle because ATP is not available'],
  'Idea: acetylcholine is the signal that makes the sarcolemma fire, and it is normally removed quickly. If the enzyme is blocked, acetylcholine stays at the end plate and keeps the sarcolemma stimulated, which keeps releasing Ca<sup>2+</sup>, so the muscle twitches and goes into spasm. (Later the muscle may weaken.) Acetylcholine is released normally in this case, so there is no limp paralysis at first.',
  'This is the reverse of a receptor blocker, which would make the muscle limp.');

v5match('lc-v505', 'types of movement', 'v5m1', 'Cell or organ and the way it moves or causes movement',
  ['A. Macrophages and leucocytes', 'B. Paramoecium', 'C. Hydra', 'D. Passage of ova through the female reproductive tract'],
  ['p. Cilia of the lining epithelium', 'q. Pseudopodia formed by the streaming of protoplasm', 'r. Tentacles that catch the prey and can also be used for locomotion', 's. Cilia that push food into the cavity and also move the animal', 't. Muscles of the limbs'], 'qsrp',
  'Macrophages and leucocytes show amoeboid movement by pseudopodia. In Paramoecium the cilia move food into the cavity of the body and also help locomotion. Hydra uses its tentacles to capture prey and also for locomotion. The ova move in the female tract through the cilia of the lining epithelium (with the muscles of the tube). Limb muscles (t) are not in List I.',
  'Both B and D involve cilia: choose by what the cilia do.');
v5match('lc-v506', 'sarcomere', 'v5m2', 'A relaxed sarcomere 2.5 &micro;m long, with an A band of 1.6 &micro;m and thin filaments of 1.0 &micro;m each (from the Z line); lengths in &micro;m',
  ['A. I band of the relaxed sarcomere (the whole I band)', 'B. H zone of the relaxed sarcomere', 'C. Overlap of thick and thin filaments on one side of the relaxed sarcomere', 'D. Sarcomere length at which the H zone just disappears'],
  ['p. 0.55', 'q. 2.0', 'r. 0.5', 's. 0.9', 't. 2.5'], 'srpq',
  'I band = 2.5 &minus; 1.6 = 0.9. Half of it is 0.45 on each side, so the overlap on each side is 1.0 &minus; 0.45 = 0.55. The H zone is the A band minus the two overlaps: 1.6 &minus; 2 &times; 0.55 = 0.5. The H zone vanishes when the two thin filaments meet in the middle, which is at a sarcomere length of 2 &times; 1.0 = 2.0.',
  'Overlap is counted on both sides when finding the H zone.');
v5match('lc-v507', 'skeleton counts', 'v5m3', 'Part of the limb skeleton and the number of bones',
  ['A. Carpals in one wrist', 'B. Tarsals in one ankle', 'C. Phalanges in one hand', 'D. All the bones of one hindlimb (girdle not counted)'],
  ['p. 7', 'q. 14', 'r. 30', 's. 8', 't. 26'], 'spqr',
  'One wrist has 8 carpals. One ankle has 7 tarsals. One hand has 14 phalanges (with 8 carpals and 5 metacarpals it has 27 bones). One hindlimb has femur, tibia, fibula and patella (4) plus 7 tarsals, 5 metatarsals and 14 phalanges (26 in the foot): 30 bones. The value 26 is the foot, which is not in List I.',
  'Do not mix up the foot (26) with the whole hindlimb (30).');
v5match('lc-v508', 'skeleton and joints', 'v5m4', 'Part of a bone and the bone or cavity it articulates with',
  ['A. Head of the humerus', 'B. Head of the femur', 'C. Occipital condyles of the skull', 'D. Atlas, in a pivot joint'],
  ['p. Acetabulum of the coxal bone', 'q. Atlas', 'r. Glenoid cavity of the scapula', 's. Axis', 't. Patella'], 'rpqs',
  'The humerus fits into the glenoid cavity of the scapula (shoulder joint). The femur fits into the acetabulum of the coxal bone (hip joint). The skull articulates with the atlas through its two occipital condyles. The atlas turns on the axis in a pivot joint. The patella (t) is the knee cap and is not a partner of any of these.',
  'The atlas appears twice: once as the partner of the skull and once as the bone that turns on the axis.');

v5asr('lc-v509', 'disorders', 'Gout is a form of arthritis.', 'Gout is an inflammation of the joints caused by the accumulation of uric acid crystals.', 0,
  'Both are true and R explains A. Arthritis means inflammation of the joints. In gout the inflammation is caused by uric acid crystals deposited in the joints, so gout is one kind of arthritis.',
  'Gout is not the same as osteoporosis, which is a loss of bone mass.');
v5asr('lc-v510', 'muscle contraction', 'Ca<sup>2+</sup> released from the sarcoplasmic reticulum binds to tropomyosin and exposes the active sites on actin.', 'Troponin is distributed at regular intervals on the tropomyosin.', 3,
  'Assertion A is false: Ca<sup>2+</sup> binds to a subunit of troponin, not to tropomyosin. This changes the troponin-tropomyosin complex and unmasks the active sites on actin. Reason R is true, but it does not make A correct.',
  'Ca<sup>2+</sup> binds troponin; tropomyosin masks the sites.');
v5asr('lc-v511', 'sarcomere', 'In a contracted sarcomere, both the I band and the H zone are narrower than in the relaxed state.', 'Both the thick and the thin filaments become shorter during contraction.', 2,
  'Assertion A is true: the thin filaments slide inwards, so the I band narrows and the H zone shrinks. Reason R is false: neither set of filaments changes its length. The filaments slide over each other, which is why the A band stays the same.',
  'Sliding, not shortening, of filaments.');
v5asr('lc-v512', 'joints', 'The knee joint and the elbow joint are both hinge joints.', 'Both the knee and the elbow are synovial joints.', 1,
  'Both statements are true, but R does not explain A. A synovial joint can be a ball and socket, a pivot, a gliding, a saddle or a hinge joint. Being synovial does not make a joint a hinge. The hinge type is a matter of movement in one plane.',
  'Many other synovial joints are not hinge joints.');

v5cnt('lc-v513', 'skeleton counts', 'How many of the following statements are correct? (i) Each forelimb (girdle not counted) has 30 bones. (ii) Each hand has 27 bones. (iii) Each foot has 28 bones. (iv) Each ankle has 7 tarsals. (v) Each wrist has 7 carpals.', 'Three', ['Two', 'Four', 'Five'],
  '(i) True: humerus, radius, ulna and the 27 bones of the hand. (ii) True: 8 carpals, 5 metacarpals and 14 phalanges. (iii) False: a foot has 7 + 5 + 14 = 26 bones. (iv) True. (v) False: a wrist has 8 carpals. So (i), (ii) and (iv) are correct: three.',
  'Wrist 8, ankle 7; hand 27, foot 26.');
v5stm('lc-v514', 'sarcomere', 'During contraction the A band becomes shorter, in proportion to the shortening of the sarcomere.', 'During contraction the I band and the H zone become narrower.', 3,
  'Statement I is incorrect: the A band is the length of the thick filaments, which does not change. Statement II is correct: the thin filaments slide into the A band, so the I band and the H zone narrow.',
  'The A band stays constant.');
v5stm('lc-v515', 'muscle types', 'A skeletal muscle fibre is multinucleate.', 'A smooth muscle fibre is also multinucleate, like a skeletal muscle fibre.', 2,
  'Statement I is correct: the sarcoplasm of a skeletal fibre has many nuclei, so it is a syncytium. Statement II is incorrect: a smooth muscle fibre is a spindle-shaped cell with a single nucleus.',
  'Multinucleate and syncytial go with skeletal fibres.');
v5stm('lc-v516', 'pelvic girdle', 'Each coxal bone is formed by the fusion of the ilium, the ischium and the pubis.', 'The acetabulum, which receives the head of the femur, is a cavity at the point where these three bones fuse.', 0,
  'Both are correct. The three parts fuse into a coxal bone, and at their meeting point there is a cavity, the acetabulum, to which the thigh bone (femur) articulates.',
  null);
v5stm('lc-v517', 'sarcomere', 'The thick filaments are anchored to the Z lines.', 'The H zone contains only thin filaments.', 1,
  'Both are incorrect. The thin filaments are anchored to the Z lines, and the thick filaments are held at the M line in the middle of the sarcomere. The H zone is the central part of the A band that has only thick filaments (no thin filaments reach it in the relaxed state).',
  'Thin to Z, thick to M.');

v5pass('v5p1', 'Four tubes with a muscle fibre', 'A skeletal muscle fibre whose membrane has been removed, so that chemicals reach the myofibrils directly, is placed in four tubes. Tube 1: ATP and Ca<sup>2+</sup> are present, and the fibre shortens. Tube 2: ATP is present and a chemical that binds all the Ca<sup>2+</sup>; the fibre does not shorten and stays soft. Tube 3: Ca<sup>2+</sup> is present but no ATP; the fibre does not shorten, and it becomes stiff and hard to stretch. Tube 4: ATP and Ca<sup>2+</sup> are present, with an antibody that stops Ca<sup>2+</sup> from binding to troponin; the fibre does not shorten and stays soft.');
v5mc('lc-v518', 'muscle contraction', 'The fibre of Tube 2 does not shorten because', 'with no free Ca<sup>2+</sup> the active sites on actin stay covered by the troponin-tropomyosin complex', ['the thin filaments become shorter when Ca<sup>2+</sup> is absent', 'ATP cannot reach the myosin heads when there is no Ca<sup>2+</sup>', 'the thick filaments are lost when Ca<sup>2+</sup> is bound'],
  'ATP is present in Tube 2, so the myosin heads can be energised. What is missing is the Ca<sup>2+</sup> that unmasks the active sites on actin, so cross bridges cannot form. The filaments do not change their length in either state.',
  null, 'passage', 'v5p1');
v5mc('lc-v519', 'muscle contraction', 'The stiffness of the fibre in Tube 3 is best explained by', 'the myosin heads staying attached to actin, because ATP is needed to detach them', ['the Ca<sup>2+</sup> being pumped back into the sarcoplasmic reticulum', 'the troponin-tropomyosin complex covering the active sites for good', 'the build-up of lactic acid in the tube'],
  'With Ca<sup>2+</sup> the sites are open and the heads bind actin. Without ATP the heads cannot be released, so the cross bridges stay in place and the fibre is stiff and cannot shorten or lengthen. This is the cause of rigor in a dead body. The sites are open (Ca<sup>2+</sup> is present), and no pump or lactic acid is mentioned in the tube.',
  null, 'passage', 'v5p1');
v5mc('lc-v520', 'muscle contraction', 'Which two tubes together show that Ca<sup>2+</sup> acts through troponin and not on myosin directly?', 'Tube 1 and Tube 4', ['Tube 1 and Tube 2', 'Tube 2 and Tube 3', 'Tube 3 and Tube 4'],
  'Idea: compare tubes that differ in one thing only. Tubes 1 and 4 both have ATP and Ca<sup>2+</sup>; the only difference is the antibody that blocks the binding of Ca<sup>2+</sup> to troponin, and the fibre stops shortening. So Ca<sup>2+</sup> works only if it can bind troponin. Tubes 1 and 2 differ in the presence of Ca<sup>2+</sup>, which shows that it is needed but not how it acts.',
  null, 'passage', 'v5p1');

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
