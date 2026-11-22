// NEET UG Biology: Human health and disease (NCERT Class 12, 2023 rationalised). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `hd-${String(++n).padStart(3, '0')}`;
const ex = (level) => (level <= 3 ? ['neet', 'cuet'] : ['neet']);
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: ex(level), sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: ex(level), sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: ex(level), sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: ex(level), sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function nat(level, sub, q, answer, sol, unit, trap, tol = 0) {
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ex(level), sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}
// ---------------------------------------------------------------- Level 1
mc(1, `diseases`, `Typhoid fever is caused by`, `<i>Salmonella typhi</i>`, [`<i>Streptococcus pneumoniae</i>`, `<i>Plasmodium vivax</i>`, `<i>Entamoeba histolytica</i>`], `<i>Salmonella typhi</i> is a bacterium that enters the small intestine through contaminated food and water. The Widal test is used to confirm typhoid.`);
mc(1, `diseases`, `The test used to diagnose typhoid is`, `Widal test`, [`ELISA`, `Biopsy`, `Western blot only`], `The Widal test detects antibodies against <i>Salmonella typhi</i> in the blood. ELISA is for HIV and biopsy is for cancer.`);
mc(1, `diseases`, `Common cold is caused by`, `rhinoviruses`, [`<i>Haemophilus influenzae</i>`, `<i>Trichophyton</i>`, `<i>Wuchereria</i>`], `Rhinoviruses infect the nose and the respiratory passage but not the lungs. The infection is spread by droplets and by contaminated objects.`);
mc(1, `diseases`, `Malaria is transmitted by`, `the female <i>Anopheles</i> mosquito`, [`the male <i>Anopheles</i> mosquito`, `<i>Aedes aegypti</i>`, `the housefly`], `Only female <i>Anopheles</i> mosquitoes take blood meals, so only they carry the sporozoites of <i>Plasmodium</i> to humans.`);
mc(1, `diseases`, `The most serious (malignant) form of malaria is caused by`, `<i>Plasmodium falciparum</i>`, [`<i>Plasmodium vivax</i>`, `<i>Plasmodium malariae</i>`, `<i>Entamoeba</i>`], `<i>P. falciparum</i> causes malignant malaria, which can be fatal. <i>P. vivax</i> and <i>P. malariae</i> cause milder forms.`);
mc(1, `diseases`, `Amoebiasis (amoebic dysentery) is caused by`, `<i>Entamoeba histolytica</i>`, [`<i>Ascaris lumbricoides</i>`, `<i>Microsporum</i>`, `<i>Wuchereria bancrofti</i>`], `<i>Entamoeba histolytica</i> is a protozoan that lives in the large intestine. Houseflies carry its cysts mechanically.`);
mc(1, `diseases`, `Ascariasis is caused by a`, `roundworm (intestinal parasite)`, [`protozoan`, `bacterium`, `virus`], `<i>Ascaris</i> is a nematode that lives in the intestine. Eggs pass out in the faeces and spread through contaminated soil, water and vegetables.`);
mc(1, `diseases`, `Filariasis (elephantiasis) is caused by`, `<i>Wuchereria bancrofti</i>`, [`<i>Salmonella typhi</i>`, `<i>Trichophyton</i>`, `<i>Plasmodium</i>`], `Filarial worms damage the lymphatic vessels, mostly of the lower limbs, and cause gross swelling. The vector is the female <i>Culex</i> mosquito.`);
mc(1, `diseases`, `Ringworm is caused by`, `fungi`, [`bacteria`, `worms called ringworms`, `viruses`], `Despite the name, ringworm is a fungal disease. The fungi belong to the genera <i>Microsporum, Trichophyton</i> and <i>Epidermophyton</i>.`, `The name has "worm", but it is not a worm disease.`);
mc(1, `immunity`, `The type of immunity that a person is born with is called`, `innate immunity`, [`acquired immunity`, `active immunity`, `passive immunity only`], `Innate immunity is present from birth and is non-specific. Acquired immunity develops after exposure to a pathogen.`);
mc(1, `immunity`, `Antibodies are produced by`, `B-lymphocytes`, [`T-lymphocytes`, `neutrophils`, `red blood cells`], `B cells make antibodies (humoral immune response). T cells give the cell-mediated response.`);
mc(1, `immunity`, `The basic structure of an antibody molecule is`, `two heavy chains and two light chains`, [`four heavy chains`, `one heavy chain and one light chain`, `three light chains and one heavy chain`], `An antibody is written H<sub>2</sub>L<sub>2</sub>. It has four peptide chains: two light and two heavy.`);
mc(1, `immunity`, `A vaccine contains`, `weakened or inactivated pathogens or their antigenic proteins`, [`ready-made antibodies`, `antibiotics`, `white blood cells`], `Vaccines make the body produce its own antibodies and memory cells. Ready-made antibodies are given in passive immunisation.`);
mc(1, `AIDS`, `AIDS is caused by`, `HIV`, [`HBV`, `HPV`, `HSV`], `AIDS (acquired immuno-deficiency syndrome) is caused by the human immuno-deficiency virus, a retrovirus with an RNA genome.`);
mc(1, `AIDS`, `HIV mainly attacks`, `helper T-lymphocytes`, [`red blood cells`, `B-lymphocytes only`, `neurons`], `HIV enters helper T cells (and macrophages), multiplies, and kills the T cells. The number of helper T cells falls and immunity weakens.`);
mc(1, `cancer`, `Cancer cells differ from normal cells because they`, `divide without control`, [`never divide`, `have no nucleus`, `die very fast`], `Normal cells show contact inhibition. Cancer cells have lost it, and keep dividing to form a mass called a tumour.`);
mc(1, `cancer`, `Spread of cancer cells to other body parts is called`, `metastasis`, [`apoptosis`, `mitosis`, `contact inhibition`], `Malignant tumours shed cells that travel in blood or lymph and set up new tumours elsewhere. This is metastasis.`);
mc(1, `drug abuse`, `Heroin is obtained from`, `the latex of the poppy plant, <i>Papaver somniferum</i>`, [`<i>Cannabis sativa</i>`, `<i>Erythroxylum coca</i>`, `<i>Datura</i>`], `Heroin (smack) is made by acetylation of morphine, which comes from poppy latex. Cannabinoids come from <i>Cannabis</i> and cocaine from the coca plant.`);
mc(1, `drug abuse`, `Cocaine is obtained from`, `<i>Erythroxylum coca</i>`, [`<i>Papaver somniferum</i>`, `<i>Cannabis sativa</i>`, `<i>Atropa belladonna</i>`], `Coca alkaloid is from the coca plant of South America. It is a stimulant of the central nervous system.`);

// ---------------------------------------------------------------- Level 2
mc(2, `diseases`, `A person with typhoid shows`, `sustained high fever (39 to 40 &deg;C), weakness, stomach pain, constipation and headache`, [`bluish lips and fluid in the alveoli`, `dry scaly lesions on the skin`, `swollen limbs`], `These are the classic signs of typhoid. Bluish lips and fluid-filled alveoli suggest pneumonia. Dry scaly lesions suggest ringworm. Swollen limbs suggest filariasis.`);
mc(2, `diseases`, `Pneumonia is caused by`, `<i>Streptococcus pneumoniae</i> and <i>Haemophilus influenzae</i>`, [`<i>Salmonella</i> and <i>Shigella</i>`, `<i>Plasmodium</i> and <i>Entamoeba</i>`, `rhinoviruses and HIV`], `These bacteria infect the alveoli of the lungs, which fill with fluid. The patient has fever, chills, cough and headache, and the lips and fingernails may turn grey to bluish.`);
mc(2, `diseases`, `Which of the following is NOT a feature of the common cold?`, `Infection of the lungs with filling of the alveoli by fluid`, [`Nasal congestion and discharge`, `Sore throat and hoarseness`, `Symptoms that last about three to seven days`], `The cold virus infects the nose and the respiratory passage, but not the lungs. Fluid in the alveoli is a feature of pneumonia.`);
mc(2, `diseases`, `Which pair of disease and vector is wrongly matched?`, `Filariasis and <i>Anopheles</i>`, [`Dengue and <i>Aedes aegypti</i>`, `Filariasis and <i>Culex</i>`, `Malaria and <i>Anopheles</i>`], `Filarial worms are carried by the female <i>Culex</i>. <i>Anopheles</i> carries the malarial parasite.`);
mc(2, `diseases`, `The infective stage of <i>Plasmodium</i> that enters the human body is the`, `sporozoite`, [`gametocyte`, `merozoite`, `trophozoite in the RBC`], `Sporozoites are in the saliva of the mosquito. Gametocytes are the stage taken up by the mosquito.`);
mc(2, `diseases`, `The stage of <i>Plasmodium</i> picked up by a mosquito from human blood is the`, `gametocyte`, [`sporozoite`, `cyst`, `egg`], `Gametocytes develop in the red blood cells. They fertilise in the gut of the mosquito and form sporozoites that go to the salivary glands.`);
mc(2, `diseases`, `The recurring chill and high fever in malaria are due to`, `haemozoin released when RBCs rupture`, [`toxins from the liver`, `rise in white blood cells`, `loss of platelets`], `The parasites burst the RBCs, which releases a toxic substance, haemozoin. This causes the chill and fever every three to four days.`);
mc(2, `diseases`, `Where do <i>Plasmodium</i> sporozoites first multiply in the human body?`, `Liver cells`, [`Red blood cells`, `Small intestine`, `Lymph nodes`], `They go to the liver cells and multiply, then attack the RBCs.`);
mc(2, `diseases`, `Houseflies act as a mechanical carrier of`, `<i>Entamoeba histolytica</i>`, [`<i>Plasmodium</i>`, `<i>Wuchereria</i>`, `HIV`], `Houseflies carry the cysts of the amoeba from faeces to food. Amoebiasis is therefore spread by contaminated food and water.`);
mc(2, `diseases`, `Symptoms of ascariasis include`, `internal bleeding, muscular pain, fever, anaemia and blockage of the intestinal passage`, [`recurring fever with chills`, `dry scaly lesions`, `swollen lymph vessels of the limbs`], `The parasite lives in the intestine and causes these symptoms. Heavy infection can block the intestine.`);
mc(2, `diseases`, `In filariasis the worms live in`, `lymphatic vessels of the lower limbs`, [`red blood cells`, `the lungs`, `the large intestine`], `The adults damage the lymphatic vessels and cause swelling of the organs in which they live, especially the legs and genital organs. Elephantiasis means gross swelling.`);
mc(2, `diseases`, `Ringworm spreads from person to person by`, `soiled clothes and towels, especially in heat and moisture`, [`mosquito bites`, `droplets from sneezing`, `contaminated water only`], `The fungi grow in warm moist skin folds like the groin and between toes. They spread by sharing clothes or towels.`);
mc(2, `prevention`, `Which one is a measure to control mosquito-borne disease?`, `Preventing stagnant water and introducing <i>Gambusia</i> fish`, [`Boiling all vegetables`, `Using dry latrines`, `Giving antibiotics to all`], `Mosquitoes breed in stagnant water. Gambusia (a fish) feeds on larvae. Other steps are the use of nets, repellents, and insecticide spray.`);
mc(2, `prevention`, `Which of these is public hygiene?`, `Proper disposal of waste and excreta and safe drinking water`, [`Keeping the body clean`, `Washing hands before food`, `Eating balanced food only`], `Personal hygiene is about one\'s own body and food. Public hygiene is about community waste, water supply and the control of vectors.`);
mc(2, `immunity`, `Which of the following is a physiological barrier of innate immunity?`, `Acid in the stomach, saliva and tears`, [`Skin`, `Neutrophils`, `Interferons`], `Physical barriers: skin and mucous. Physiological: acid, saliva, tears. Cellular: leucocytes such as neutrophils and macrophages. Cytokine: interferons.`);
mc(2, `immunity`, `Interferons are`, `proteins released by virus-infected cells that protect nearby cells`, [`antibodies made by B cells`, `enzymes in saliva`, `hormones from the thymus`], `They belong to the cytokine barriers of innate immunity. They stop viruses from infecting neighbouring cells.`);
mc(2, `immunity`, `Which cells are the cellular barriers of innate immunity?`, `Neutrophils, monocytes, natural killer cells and macrophages`, [`B cells and T cells`, `Red blood cells and platelets`, `Plasma cells`], `PMNL-neutrophils, monocytes, natural killer lymphocytes and macrophages in tissues all phagocytose or kill microbes.`);
mc(2, `immunity`, `Primary and secondary immune responses differ because the secondary response is`, `faster and of higher intensity due to memory cells`, [`slower and weaker`, `non-specific`, `shown only by innate immunity`], `On the second exposure, memory B and T cells respond quickly, so antibody level rises sharply. This is the basis of vaccination.`);
mc(2, `immunity`, `Humoral immune response is carried out by`, `antibodies in the body fluids (blood and lymph)`, [`cytotoxic T cells`, `phagocytes only`, `interferons only`], `The word humoral refers to body fluids. Cell-mediated immunity is by T cells.`);
mc(2, `immunity`, `Graft rejection after an organ transplant is due to`, `cell-mediated immunity`, [`humoral immunity only`, `innate immunity only`, `passive immunity`], `The body recognises the graft as non-self and T cells attack it. Therefore tissue matching and immunosuppressants are used.`);
mc(2, `immunity`, `Colostrum given to a newborn provides`, `natural passive immunity through IgA`, [`active immunity`, `innate immunity only`, `artificial active immunity`], `Colostrum (the first milk) is rich in IgA. Antibodies come ready-made from the mother. Some IgG also crosses the placenta.`);
mc(2, `immunity`, `An injection of snake venom antibodies (antivenom) gives`, `passive immunity`, [`active immunity`, `innate immunity`, `no immunity`], `Ready-made antibodies act at once, but they do not produce memory cells. So protection is short.`);
mc(2, `immunity`, `Hepatitis B vaccine is made from`, `a recombinant yeast`, [`killed bacteria`, `rabbit antiserum`, `horse serum`], `A gene for the surface protein of the virus is put into yeast using recombinant DNA technology. This is a safe vaccine.`);
mc(2, `allergy`, `The antibody type that is mainly involved in allergic reactions is`, `IgE`, [`IgA`, `IgG`, `IgM`], `IgE binds to mast cells. On contact with the allergen, the mast cells release histamine and serotonin.`);
mc(2, `allergy`, `Which of these chemicals released from mast cells cause symptoms of allergy?`, `Histamine and serotonin`, [`Insulin and glucagon`, `Interferon and interleukin`, `Heparin only`], `They cause sneezing, watery eyes, running nose and difficulty in breathing. Antihistamines, adrenaline and steroids reduce the symptoms.`);
mc(2, `autoimmunity`, `Rheumatoid arthritis is`, `an autoimmune disease`, [`an infectious disease`, `an allergy`, `a deficiency disease`], `In autoimmunity the body attacks its own cells. In rheumatoid arthritis, joints are damaged.`);
mc(2, `lymphoid organs`, `The primary lymphoid organs are`, `bone marrow and thymus`, [`spleen and lymph nodes`, `tonsils and appendix`, `liver and pancreas`], `Lymphocytes originate and mature in primary lymphoid organs. The secondary ones (spleen, lymph nodes, tonsils, Peyer\'s patches, appendix) are the places where lymphocytes meet the antigen.`);
mc(2, `lymphoid organs`, `The organ that degenerates with age and where T cells mature is the`, `thymus`, [`spleen`, `bone marrow`, `Peyer\'s patch`], `The thymus is a lobed organ near the heart and below the breastbone. It is large at birth and shrinks with age. B cells mature in the bone marrow.`);
mc(2, `AIDS`, `HIV is not transmitted by`, `shaking hands or sharing food with an infected person`, [`unprotected sexual contact`, `sharing infected needles`, `from an infected mother to her baby through the placenta`], `HIV spreads through body fluids only. Casual contact is safe.`);
mc(2, `AIDS`, `The enzyme that makes DNA from the RNA of HIV is`, `reverse transcriptase`, [`DNA polymerase`, `RNA polymerase`, `ligase`], `HIV is a retrovirus. Its RNA is copied into DNA by reverse transcriptase, and the DNA is inserted into the host genome.`);
mc(2, `AIDS`, `The test used for early detection of HIV is`, `ELISA`, [`Widal`, `Biopsy`, `MRI`], `ELISA (enzyme-linked immuno-sorbent assay) detects HIV antibodies or antigens. Widal is for typhoid.`);
mc(2, `cancer`, `Which is a biological carcinogen?`, `Oncogenic viruses`, [`X-rays`, `Tobacco smoke`, `UV radiation`], `Oncogenic viruses carry genes (viral oncogenes) that can transform normal cells. X-rays and UV are physical, tobacco smoke is chemical.`);
mc(2, `cancer`, `Tumours that stay at one site and do not spread are`, `benign tumours`, [`malignant tumours`, `metastatic tumours`, `oncogenes`], `Benign tumours usually cause little damage. Malignant tumours invade other tissues.`);
mc(2, `cancer`, `Which of the following techniques is used for detecting cancer in internal organs?`, `Computed tomography and MRI`, [`Widal test`, `ELISA`, `Blood sugar test`], `Radiography (X-rays), CT and MRI show tumours inside the body. Biopsy and histopathology confirm the type of cells.`);
mc(2, `drug abuse`, `Morphine acts as`, `a sedative and painkiller`, [`a stimulant`, `a hallucinogen`, `an anti-allergic drug`], `Morphine is used in surgery for pain relief. Misuse leads to dependence.`);
mc(2, `drug abuse`, `Cannabinoids bind to receptors mainly in the`, `brain`, [`liver`, `kidney`, `lung`], `Cannabinoid receptors are in the brain. Marijuana, hashish, charas and ganja are from <i>Cannabis sativa</i> and affect the cardiovascular system.`);
mc(2, `drug abuse`, `Nicotine in tobacco stimulates`, `the adrenal gland to release adrenaline and noradrenaline`, [`the pancreas to release insulin`, `the thyroid to release thyroxine`, `the pituitary to release growth hormone`], `Adrenaline and noradrenaline raise blood pressure and heart rate.`);
mc(2, `drug abuse`, `The major organ damaged by chronic heavy alcohol use is the`, `liver (cirrhosis)`, [`pancreas only`, `skin`, `eye lens`], `Alcohol also harms the nervous system. Liver cirrhosis is a major result of chronic abuse.`);

// ---------------------------------------------------------------- Level 3
mc(3, `diseases`, `A student has a high fever with chills every third or fourth day. The best explanation is`, `rupture of RBCs infected with <i>Plasmodium</i> releasing haemozoin`, [`<i>Salmonella</i> infection of the small intestine`, `fluid in the alveoli due to bacteria`, `a viral infection of the nose`], `Synchronised rupture of infected red cells causes recurring chill and fever. The typhoid fever is sustained, not cyclic.`, `Typhoid fever is continuous, malarial fever comes in cycles.`);
mc(3, `diseases`, `Which of the following correctly shows the life cycle of the malarial parasite?`, `Sporozoites in mosquito saliva, liver cells, RBCs, gametocytes, mosquito gut, sporozoites in salivary glands`, [`Gametocytes in saliva, liver cells, RBCs, sporozoites, mosquito gut`, `Sporozoites in the RBCs, liver cells, gametocytes in the salivary glands`, `Gametocytes in the liver, sporozoites in the RBCs, mosquito gut`], `The infective stage is the sporozoite. In the human it multiplies in liver cells and then in RBCs and forms gametocytes. The mosquito takes up the gametocytes, where fertilisation and development produce sporozoites in the salivary glands.`);
mc(3, `diseases`, `Sexual reproduction (fertilisation) of <i>Plasmodium</i> takes place in the`, `gut of the female <i>Anopheles</i>`, [`liver of the human`, `RBC of the human`, `salivary gland of the mosquito`], `Gametocytes fuse in the mosquito\'s gut. Salivary glands only store the sporozoites, and the asexual multiplication in humans is in the liver and RBCs.`, `Gametocytes are formed in humans but fertilise in the mosquito.`);
mc(3, `diseases`, `Which one of the following is a correct match of disease, causal organism and organ affected?`, `Pneumonia, <i>Streptococcus pneumoniae</i>, alveoli`, [`Typhoid, <i>Haemophilus</i>, lungs`, `Filariasis, <i>Plasmodium</i>, liver`, `Amoebiasis, <i>Ascaris</i>, small intestine`], `Pneumonia is a bacterial infection of the alveoli. Typhoid is by <i>Salmonella</i> in the intestine. Filariasis is by <i>Wuchereria</i> in the lymph vessels. Amoebiasis is by <i>Entamoeba</i> in the large intestine.`);
mc(3, `diseases`, `Which of the following diseases is NOT spread by contaminated water or food?`, `Filariasis`, [`Typhoid`, `Amoebiasis`, `Ascariasis`], `Filariasis spreads through mosquito bites. The other three spread through the faecal-oral route.`);
mc(3, `diseases`, `Which of these has a mosquito as the vector?`, `Dengue and chikungunya`, [`Typhoid and cholera`, `Ringworm and common cold`, `Amoebiasis and ascariasis`], `Dengue and chikungunya are viral, spread by <i>Aedes</i> mosquitoes. Malaria and filariasis are also mosquito-borne.`);
mc(3, `diseases`, `"Typhoid Mary" was an example of`, `a carrier who spread the disease without showing symptoms`, [`a vaccinated person`, `an immune individual`, `a mechanical vector`], `She was a cook who was a carrier of <i>Salmonella typhi</i>. She infected many people through food, although she herself was not ill.`);
mc(3, `prevention`, `The best way to prevent infectious diseases spread by the faecal-oral route is`, `safe drinking water, hygienic food and sanitation`, [`use of mosquito nets`, `spraying insecticide`, `use of repellents`], `Water and food hygiene cuts the spread of typhoid, amoebiasis and ascariasis. Nets are for mosquito-borne disease.`);
mc(3, `immunity`, `Which is the correct pairing of a type of immunity and an example?`, `Natural passive: IgG crossing the placenta`, [`Artificial active: colostrum`, `Natural active: injection of antivenom`, `Artificial passive: infection with a virus`], `Passive means antibodies are received ready-made. Active means the body makes them: after infection (natural) or after a vaccine (artificial).`, `Active = body makes antibodies. Passive = received.`);
mc(3, `immunity`, `Which of the following gives life-long protection by creating memory cells?`, `A vaccine for measles`, [`An injection of tetanus antitoxin`, `Colostrum`, `Antivenom`], `A vaccine triggers the active response and forms memory cells. The other three give ready-made antibodies.`);
mc(3, `immunity`, `Which statement about antibodies is correct?`, `Each antibody has two antigen-binding sites formed by the heavy and light chains`, [`Antibodies are lipids made by T cells`, `Antibodies are single polypeptides`, `Antibodies are made by neutrophils`], `An antibody is a Y-shaped protein of four chains, with two identical antigen-binding sites. B cells and plasma cells make them.`);
mc(3, `immunity`, `The antibody that is the most abundant in the blood is`, `IgG`, [`IgA`, `IgM`, `IgE`], `IgG is the main antibody in the blood and crosses the placenta. IgA is in secretions such as colostrum, tears and saliva. IgM is the first produced and is the largest. IgE is for allergy.`);
mc(3, `immunity`, `Which statement is correct about T-lymphocytes?`, `They mature in the thymus and do not produce antibodies, but help B cells to do so`, [`They mature in the bone marrow`, `They secrete antibodies`, `They are part of innate immunity only`], `Helper T cells help B cells to produce antibodies. Cytotoxic T cells kill infected cells. B cells mature in the bone marrow.`);
mc(3, `immunity`, `Which tissue forms about half of the lymphoid tissue of the body?`, `Mucosa-associated lymphoid tissue (MALT)`, [`Thymus`, `Spleen`, `Bone marrow`], `MALT lines the respiratory, digestive and urogenital tracts and makes up about 50% of the lymphoid tissue in the body.`);
mc(3, `immunity`, `The spleen is mainly a`, `filter of blood with lymphocytes and phagocytes, and a store of RBCs`, [`site of T cell maturation`, `site where all blood cells are formed in an adult`, `gland that secretes interferon`], `The spleen is a large bean-shaped organ. It traps blood-borne microbes and stores red blood cells. T cells mature in the thymus.`);
mc(3, `immunity`, `The immune response of the body to a pathogen is called active when`, `the body itself makes antibodies after exposure to antigens`, [`antibodies are injected`, `antibodies come from the mother`, `the pathogen is killed by skin`], `Active immunity is slow and takes time, but lasts long.`);
mc(3, `immunity`, `A child bitten by a rabid dog is given both the vaccine and ready-made antibodies. The reason is`, `antibodies give immediate protection while the vaccine slowly builds active immunity`, [`vaccine acts before antibodies`, `antibodies kill the vaccine`, `both are passive`], `The virus acts fast, but active immunity needs days. So passive immunity covers the gap.`);
mc(3, `allergy`, `Which is NOT true of allergy?`, `It is caused by the pathogen itself`, [`It is an exaggerated response to an antigen in the environment`, `IgE is involved`, `Antihistamines reduce symptoms`], `The antigens that cause allergies (allergens) are harmless substances such as pollen and dust mites. They are not pathogens.`);
mc(3, `autoimmunity`, `In autoimmune disease the immune system`, `attacks the body\'s own cells because it fails to tell self from non-self`, [`fails to produce any antibody`, `attacks only pathogens`, `becomes immune to all antigens`], `The memory-based immune system is meant to tell self from non-self. In autoimmunity this goes wrong.`);
mc(3, `AIDS`, `In the life cycle of HIV, which sequence is correct?`, `Entry into a cell, RNA to DNA by reverse transcriptase, DNA integrates into the host DNA, host makes viral RNA and proteins, new viruses released`, [`DNA to RNA, RNA integrates, protein made, entry`, `Entry, DNA integrates, RNA to DNA, release`, `Viral RNA integrates into host DNA directly, then entry`], `HIV is an RNA retrovirus. The RNA is first copied into DNA, then the DNA is integrated and the cell makes viral components.`);
mc(3, `AIDS`, `After entering the macrophage, HIV`, `makes viral DNA, and the macrophage keeps producing viruses, acting like a factory`, [`kills the macrophage at once`, `is destroyed by the macrophage`, `is blocked by the cell membrane`], `The macrophage continues to produce viruses. Later HIV enters helper T cells, replicates in them, and the new viruses attack other T cells.`);
mc(3, `AIDS`, `Opportunistic infections in AIDS patients are`, `infections by organisms that do not harm people with a healthy immune system`, [`infections by HIV itself`, `allergic reactions`, `cancers only`], `The fall in helper T cells allows organisms such as <i>Mycobacterium</i>, <i>Toxoplasma</i>, viruses and fungi to cause serious disease.`);
mc(3, `cancer`, `Which statement about cancer cells is correct?`, `They have lost contact inhibition`, [`They stop dividing when in contact with other cells`, `They are always benign`, `They never spread`], `Normal cells stop dividing when they touch other cells. Cancer cells do not, so they pile up and form a tumour.`);
mc(3, `cancer`, `Proto-oncogenes (cellular oncogenes) are`, `normal genes that can become cancer-causing when activated`, [`genes that make a virus`, `genes for antibodies`, `genes only found in viruses`], `Proto-oncogenes control normal growth. When mutated or over-active they turn into oncogenes.`);
mc(3, `cancer`, `Which of these is used in cancer treatment?`, `Surgery, radiation therapy, chemotherapy and immunotherapy`, [`Antibiotics only`, `Vaccines only`, `Antihistamines`], `Surgery removes the tumour, radiation kills cells, and drugs of chemotherapy have side effects such as hair loss and anaemia. Biological response modifiers such as &alpha;-interferon activate the immune system.`);
mc(3, `cancer`, `The cancer of the blood with an abnormal number of leucocytes is`, `leukaemia`, [`carcinoma`, `sarcoma`, `lymphoma`], `Carcinoma is a cancer of the epithelium, sarcoma of connective tissue, leukaemia of blood-forming tissue, and lymphoma of lymphatic tissue.`);
mc(3, `drug abuse`, `Opioids bind to receptors in`, `the central nervous system and the gastrointestinal tract`, [`only the heart`, `only the skin`, `the kidney`], `Opioids bind to opioid receptors in the CNS and GIT. They depress the body functions.`);
mc(3, `drug abuse`, `Which drug interferes with the transport of the neurotransmitter dopamine?`, `Cocaine`, [`Morphine`, `Heroin`, `Marijuana`], `Cocaine blocks dopamine transport, so dopamine stays active longer. This gives a feeling of euphoria and energy. Excess gives hallucinations.`);
mc(3, `drug abuse`, `<i>Atropa belladonna</i> and <i>Datura</i> are the sources of`, `hallucinogens`, [`opioids`, `cannabinoids`, `anabolic steroids`], `These plants give hallucinogenic substances. Opioids are from the poppy, cannabinoids from Cannabis.`);
mc(3, `drug abuse`, `Adolescents may take to drugs because of`, `curiosity, experimentation and peer pressure`, [`only genes`, `only poverty`, `lack of oxygen`], `The adolescent period is a time of curiosity and a need for adventure. Prevention is by counselling, avoiding peer pressure and getting help from parents and teachers.`);
mc(3, `drug abuse`, `Withdrawal syndrome is`, `the set of symptoms that appears when a drug or alcohol is suddenly stopped`, [`the liking for a drug`, `a vaccine for addiction`, `the first dose`], `It includes anxiety, shakiness and nausea, and can be dangerous. It is one reason why addicts cannot easily stop.`);
mc(3, `drug abuse`, `The risk of AIDS and hepatitis B in people who take drugs by injection is mainly due to`, `sharing needles`, [`the drug itself`, `alcohol`, `loss of appetite`], `Sharing contaminated needles passes HIV and hepatitis B.`);

asr(3, `diseases`, `Common cold does not cause pneumonia directly.`, `The rhinovirus infects the nose and the upper respiratory passage but not the lungs.`, 0, `The cold virus does not infect the alveoli. R explains A.`);
asr(3, `diseases`, `Malaria patients show recurring fever.`, `Rupture of RBCs releases haemozoin in synchronised cycles.`, 0, `The chill and fever occur when infected RBCs rupture together. R explains A.`);
asr(3, `immunity`, `The secondary immune response is stronger than the primary response.`, `Memory cells formed in the first exposure respond rapidly in the second.`, 0, `Memory B and T cells create the higher and quicker response. R explains A.`);
asr(3, `immunity`, `Colostrum gives active immunity to a newborn.`, `Colostrum contains IgA antibodies.`, 3, `A is false: the baby gets ready-made antibodies, which is passive. R is true.`, `Ready-made antibodies mean passive immunity.`);
asr(3, `AIDS`, `HIV infection leads to the fall of helper T cells.`, `HIV replicates inside helper T cells and kills them.`, 0, `T helper cells carry the CD4 receptor which HIV uses. R explains A.`);
asr(3, `cancer`, `Cancer cells form a mass called a tumour.`, `Cancer cells have lost contact inhibition.`, 0, `Normal cells stop dividing when they touch their neighbours. Cancer cells do not and pile up as a tumour. R explains A.`);
asr(3, `drug abuse`, `Heroin is a depressant of the central nervous system.`, `Heroin is made from cocaine.`, 2, `A is true: it slows body functions. R is false: heroin is made by acetylation of morphine, from poppy.`);
asr(3, `allergy`, `Antihistamines reduce allergy symptoms.`, `Histamine released by mast cells causes the symptoms of allergy.`, 0, `The drug blocks histamine action. R explains A.`);

stm(3, `immunity`, `Antibodies are produced by B cells.`, `Antibodies are produced by T cells.`, 2, `Only I is correct. T cells control or kill but do not secrete antibodies.`);
stm(3, `immunity`, `Active immunity is slow and long lasting.`, `Passive immunity is quick but short.`, 0, `Both are correct.`);
stm(3, `diseases`, `Ringworm is a fungal disease.`, `Ringworm is caused by a nematode.`, 2, `I is correct. II is false.`);
stm(3, `AIDS`, `HIV is a DNA virus.`, `HIV can pass through placenta to the baby.`, 3, `I is wrong as HIV is an RNA retrovirus. II is correct.`);
stm(3, `lymphoid organs`, `The thymus is a secondary lymphoid organ.`, `Peyer\'s patches are in the small intestine.`, 3, `The thymus is primary. Peyer\'s patches of the small intestine are secondary lymphoid tissue.`);
stm(3, `drug abuse`, `Cocaine is a stimulant.`, `Morphine is a stimulant.`, 2, `Cocaine stimulates the CNS. Morphine is a sedative and painkiller.`);

match(3, `diseases`, `hd-m1`, `Disease and causative organism`, [`A. Typhoid`, `B. Pneumonia`, `C. Filariasis`, `D. Ringworm`], [`p. <i>Wuchereria bancrofti</i>`, `q. <i>Trichophyton</i>`, `r. <i>Salmonella typhi</i>`, `s. <i>Streptococcus pneumoniae</i>`], `A-r, B-s, C-p, D-q`, [`A-s, B-r, C-p, D-q`, `A-r, B-s, C-q, D-p`, `A-p, B-s, C-r, D-q`], `Typhoid is by <i>Salmonella typhi</i> (r), pneumonia by <i>Streptococcus pneumoniae</i> (s), filariasis by <i>Wuchereria</i> (p), ringworm by the fungus <i>Trichophyton</i> (q).`);
match(3, `drug abuse`, `hd-m2`, `Drug and its source`, [`A. Heroin`, `B. Marijuana`, `C. Cocaine`, `D. Hallucinogen`], [`p. <i>Cannabis sativa</i>`, `q. <i>Erythroxylum coca</i>`, `r. <i>Datura</i>`, `s. Acetylation of morphine from poppy latex`], `A-s, B-p, C-q, D-r`, [`A-p, B-s, C-q, D-r`, `A-s, B-q, C-p, D-r`, `A-s, B-p, C-r, D-q`], `Heroin is from morphine (s). Marijuana is from Cannabis (p). Cocaine is from coca (q). <i>Datura</i> gives hallucinogens (r).`);
match(3, `immunity`, `hd-m3`, `Antibody and its feature`, [`A. IgA`, `B. IgE`, `C. IgG`, `D. IgM`], [`p. Crosses the placenta`, `q. Found in colostrum`, `r. Involved in allergy`, `s. First antibody made in an infection`], `A-q, B-r, C-p, D-s`, [`A-r, B-q, C-p, D-s`, `A-q, B-r, C-s, D-p`, `A-p, B-r, C-q, D-s`], `IgA is in secretions and colostrum (q). IgE is for allergy (r). IgG is abundant and crosses the placenta (p). IgM is the first in an infection (s).`);
match(3, `lymphoid organs`, `hd-m4`, `Organ and its role`, [`A. Bone marrow`, `B. Thymus`, `C. Spleen`, `D. Peyer\'s patches`], [`p. T cell maturation`, `q. Source of all blood cells`, `r. Store of RBCs and filter`, `s. Lymphoid tissue of the small intestine`], `A-q, B-p, C-r, D-s`, [`A-p, B-q, C-r, D-s`, `A-q, B-p, C-s, D-r`, `A-r, B-p, C-q, D-s`], `Bone marrow makes all blood cells (q). Thymus is the site of T cell maturation (p). Spleen filters blood and stores RBCs (r). Peyer\'s patches are in the small intestine (s).`);

pass(`hd-p1`, `Antibody levels after vaccination`, `A child was given a vaccine on day 0. The antibody level in the blood rose slowly and reached a low peak on day 14, and then fell. On day 60 the child was given the same vaccine again. This time the antibody level rose within 3 days and reached a peak that was ten times higher than the first peak.`);
pq(`hd-p1`, 3, `immunity`, `The faster and larger rise after the second dose is due to`, `memory B and T cells`, [`innate immunity`, `passive immunity`, `interferons`], `Memory cells formed after the first dose respond quickly on the second exposure.`);
pq(`hd-p1`, 3, `immunity`, `The immunity produced by this vaccine is`, `artificial active immunity`, [`natural active immunity`, `natural passive immunity`, `artificial passive immunity`], `The body made the antibodies itself (active) after a vaccine given by people (artificial).`);
pq(`hd-p1`, 4, `immunity`, `If the child had instead received ready-made antibodies on day 0 and again on day 60, the second peak would be`, `no higher than the first, with no memory formed`, [`ten times higher than the first`, `much faster than the first`, `absent in both cases`], `Ready-made antibodies do not stimulate memory cells. The second dose would only add to the level.`);

pass(`hd-p2`, `A fever pattern`, `A man returns from a village in a hot, wet region with chills and fever that recur at regular intervals. A blood smear shows rings inside his red blood cells. His doctor says the cycle is related to the rupture of cells.`);
pq(`hd-p2`, 3, `diseases`, `The most likely disease is`, `malaria`, [`typhoid`, `filariasis`, `amoebiasis`], `Rings in the RBCs and cyclical fever indicate <i>Plasmodium</i>.`);
pq(`hd-p2`, 3, `diseases`, `The toxic substance linked to the fever is`, `haemozoin`, [`histamine`, `interferon`, `adrenaline`], `Haemozoin is released when the RBCs burst.`);
pq(`hd-p2`, 3, `prevention`, `A good way to control this disease in the village is`, `removing stagnant water and using nets and larvivorous fish`, [`boiling drinking water only`, `vaccinating against typhoid`, `washing hands only`], `It is a mosquito-borne disease, so vector control is the key.`);

// ---------------------------------------------------------------- Level 4
mc(4, `immunity`, `Which of the following is NOT a feature of acquired immunity?`, `It acts in the same way against every pathogen`, [`It is pathogen-specific`, `It has memory`, `It involves lymphocytes`], `Acquired immunity is specific, shows memory, and is carried out by B and T cells. Acting the same on all pathogens is innate immunity.`);
mc(4, `immunity`, `A person receives a heart transplant. Which cells most directly attack the graft?`, `Cytotoxic T-lymphocytes`, [`B-lymphocytes only`, `Mast cells`, `Red blood cells`], `Graft rejection is cell-mediated. This is why drugs that suppress T cell activity are used.`);
mc(4, `immunity`, `A person has had chickenpox once and does not get it again. This is best explained by`, `memory B and T cells`, [`innate immunity`, `passive immunity`, `skin barriers`], `On re-exposure memory cells respond quickly and strongly.`);
mc(4, `immunity`, `In humoral immunity the first step after antigen entry is`, `B cells recognise the antigen and divide into plasma cells and memory cells`, [`T cells make antibodies`, `phagocytes make memory cells`, `RBCs destroy the antigen`], `B cells bind the antigen, divide, and give plasma cells that secrete antibodies and memory cells that stay for the future.`);
mc(4, `immunity`, `Which statement is correct about the structure of an antibody?`, `The four chains are held together by disulphide bonds`, [`The two heavy chains are held by hydrogen bonds only`, `It has one binding site`, `It is made of nucleotides`], `Disulphide bridges join the light and heavy chains. The molecule has two antigen-binding sites.`);
mc(4, `immunity`, `Which of the following would be the best way to protect a person immediately after a tetanus-prone wound if never vaccinated?`, `Injection of antitoxin (preformed antibodies)`, [`First dose of vaccine only`, `Antibiotics only`, `Interferon`], `Preformed antibodies give immediate protection. The vaccine is also given for later active immunity.`);
mc(4, `immunity`, `Which statement about vaccination is correct?`, `Vaccines make memory cells without causing the disease`, [`Vaccines give passive immunity`, `Vaccines contain active antibodies`, `Vaccines are used after a disease is severe`], `Antigens in the vaccine trigger the active response. Antibodies are not given.`);
mc(4, `immunity`, `Which of these is a correct comparison?`, `Primary response is slow and low, and the secondary is quick and high`, [`Both responses are the same`, `Primary is quick and high, secondary slow and low`, `Both are quick and low`], `The secondary response is the memory (anamnestic) response.`);
mc(4, `immunity`, `The antibody class that is a pentamer is IgM. The one found as a dimer in secretions is`, `IgA`, [`IgG`, `IgE`, `IgD`], `IgA is secreted as a dimer into tears, saliva and milk. IgM is a pentamer. IgG and IgE are monomers.`);
mc(4, `lymphoid organs`, `In which organ are T-lymphocytes produced and matured respectively?`, `Produced in bone marrow and matured in the thymus`, [`Produced in the thymus and matured in the bone marrow`, `Both in the spleen`, `Produced in the spleen and matured in the lymph nodes`], `All blood cells are made in the bone marrow. T cells move to the thymus to mature. B cells mature in the bone marrow.`);
mc(4, `lymphoid organs`, `Which is NOT a secondary lymphoid organ?`, `Thymus`, [`Spleen`, `Lymph nodes`, `Tonsils`], `The thymus and bone marrow are primary. The others are secondary lymphoid organs.`);
mc(4, `allergy`, `A person is allergic to pollen. The first exposure usually does NOT cause symptoms because`, `IgE has to be made and attached to mast cells first`, [`pollen is destroyed at once`, `histamine is absent in the body`, `IgG blocks it`], `The allergic reaction occurs on later exposure when the IgE on mast cells meets the allergen again.`);
mc(4, `AIDS`, `Which statement correctly describes the course of AIDS?`, `Helper T cells fall in number, so the person gets infections that normal individuals resist`, [`B cells rise in number`, `The red blood cells are destroyed`, `Platelets decline`], `Loss of TH cells weakens both humoral and cell-mediated immunity.`);
mc(4, `AIDS`, `Which of the following cannot be used to prevent the spread of HIV?`, `A mosquito net`, [`Use of disposable needles`, `Use of condoms`, `Screening of blood`], `HIV is not spread by mosquitoes. The others are standard preventive steps.`);
mc(4, `AIDS`, `A newborn tests positive in an ELISA test for HIV antibodies. The most likely reason is`, `maternal antibodies in the baby, or a real infection through the placenta`, [`HIV antibodies are produced by the baby`, `HIV does not cross the placenta`, `the test is for DNA`], `Maternal antibodies (IgG) cross the placenta. Infection of the baby is possible but must be confirmed.`);
mc(4, `cancer`, `Which of these is a chemical carcinogen?`, `Tobacco smoke`, [`Gamma rays`, `UV radiation`, `Oncogenic viruses`], `Tobacco smoke is a major chemical carcinogen. Gamma rays and UV are physical.`);
mc(4, `cancer`, `Biopsy is`, `taking a thin piece of tissue and studying it under a microscope`, [`taking blood to find antibodies`, `taking an X-ray`, `using a magnetic field to produce an image`], `The tissue is stained and examined (histopathology). CT and MRI are imaging methods.`);
mc(4, `cancer`, `Which statement is correct about malignant and benign tumours?`, `Malignant tumours invade neighbouring tissues and may metastasise`, [`Benign tumours spread to distant sites`, `Malignant tumours are confined to one site`, `Both are caused only by viruses`], `Benign tumours stay in place. Malignant ones invade and spread.`);
mc(4, `cancer`, `Which of these is NOT a side effect of chemotherapy?`, `Gain of immunity to infections`, [`Loss of hair`, `Anaemia`, `Nausea`], `Chemotherapy drugs harm rapidly dividing normal cells too, giving hair loss and anaemia. They may reduce immunity.`);
mc(4, `drug abuse`, `Which pair of drug and effect is correct?`, `Cocaine: stimulant causing euphoria`, [`Morphine: stimulant`, `Heroin: hallucinogen`, `Marijuana: sedative that works on the kidney`], `Cocaine excites the CNS. Morphine and heroin are depressants. Cannabinoids act on the brain and the cardiovascular system.`);
mc(4, `drug abuse`, `Anabolic steroids used by some sportspersons can cause in males`, `acne, mood swings, reduced sperm production and enlarged prostate`, [`enlarged breasts and deep voice only`, `increased fertility`, `improved kidney function`], `Steroids bring many side effects: aggression, depression, a reduced testicle size, premature baldness and kidney and liver problems.`);
mc(4, `drug abuse`, `Which of the following is a result of chronic tobacco smoking?`, `Emphysema and a higher risk of lung and throat cancers`, [`Increased lung capacity`, `Higher oxygen binding of haemoglobin`, `Lower blood pressure`], `Smoking damages the alveolar walls (emphysema). Carbon monoxide reduces oxygen binding to haemoglobin. Nicotine raises blood pressure.`);
mc(4, `drug abuse`, `Which of these is a warning sign of drug abuse in a teenager?`, `Sudden drop in academic performance and changed friends and moods`, [`Regular sleep`, `Good appetite`, `Improved school work`], `Parents and teachers should watch for changes in behaviour, secrecy and lack of interest. Early counselling helps.`);
nat(4, `cancer`, `A single cancer cell divides every 24 hours, and every cell survives and divides. How many cells will there be after 10 days?`, 1024, `Idea: the number doubles each day, so after n days it is 2<sup>n</sup>. After 10 days, 2<sup>10</sup> = 1024.`, ``, `Do not use 10 &times; 2.`);
nat(4, `immunity`, `An antibody molecule has 4 polypeptide chains. How many heavy chains are present in 25 such antibody molecules?`, 50, `Each antibody has two heavy and two light chains. 25 &times; 2 = 50 heavy chains.`, ``, `Four chains do not mean four heavy chains.`);

mc(4, `immunity`, `Which of the following statements is correct?`, `Antibodies of IgA type in milk protect the gut of the infant`, [`Antibodies come only from the bone marrow`, `IgE makes up most of the antibodies in the blood`, `IgM is the smallest antibody`], `IgA in colostrum and milk coats the mucosa of the infant\'s gut. IgG, not IgE, is most abundant in the blood. IgM is the largest.`);
mc(4, `diseases`, `Consider: (i) Plasmodium multiplies in the liver cells. (ii) Gametocytes are formed in the RBCs. (iii) The sporozoites are found in the gut wall of the mosquito at the time of the bite. (iv) A mosquito becomes infective after it has taken the sporozoite. How many are correct?`, `Two`, [`One`, `Three`, `Four`], `(i) and (ii) are correct. (iii) The sporozoites are in the salivary glands at the time of the bite. (iv) The mosquito takes up gametocytes, not sporozoites, to become infective.`, `The stage that infects humans is not the stage that infects the mosquito.`, `statements`);
mc(4, `drug abuse`, `Consider: (i) Heroin is obtained from poppy. (ii) Cocaine is obtained from <i>Cannabis</i>. (iii) Morphine is a sedative. (iv) Marijuana acts on the cardiovascular system. How many are correct?`, `Three`, [`Two`, `Four`, `One`], `(i), (iii) and (iv) are correct. (ii) is wrong: cocaine is from the coca plant.`, ``, `statements`);

// ---------------------------------------------------------------- Level 5
mc(5, `immunity`, `A patient with no thymus (congenital) most likely shows`, `very few T cells, and reduced cell-mediated and antibody responses to many antigens`, [`no B cells and no antibodies`, `no red blood cells`, `loss of innate immunity`], `T cells mature in the thymus. Without them there is no cell-mediated response, and helper T cells needed for most antibody responses are missing too. B cells and innate defences stay.`, `Humoral immunity depends on helper T cells as well.`);
mc(5, `immunity`, `A mother who has had measles passes antibodies to her baby. Which statement about the baby\'s immunity is correct?`, `The baby has natural passive immunity that fades and no memory cells for measles`, [`The baby has lifelong active immunity`, `The baby has innate immunity only`, `The baby makes memory cells from the mother\'s antibodies`], `Antibodies are borrowed and decay in months. Active memory needs the baby\'s own exposure or a vaccine.`);
mc(5, `immunity`, `A person is first bitten by a venomous snake and is given the antivenom. He later is bitten again. Which statement is correct?`, `The antivenom gives only short passive protection, so he needs it again`, [`He is permanently immune`, `He has memory cells against the venom`, `His B cells made the antivenom`], `Antivenom is made in other animals. It contains ready antibodies and no memory for the person.`);
mc(5, `AIDS`, `A drug that blocks reverse transcriptase would act at which point of the HIV life cycle?`, `Making DNA from viral RNA inside the host cell`, [`Entry of HIV into the cell`, `Release of new viruses`, `Making viral proteins from mRNA`], `Reverse transcriptase makes cDNA from RNA. Blocking it stops the viral DNA from forming and from integrating.`);
mc(5, `AIDS`, `HIV is not killed quickly by the immune system chiefly because`, `it infects and kills helper T cells, the cells that coordinate the response, and its DNA hides in the host genome`, [`it has no genetic material`, `it is a bacterium`, `it is outside all cells`], `The virus is integrated into the host DNA, and the loss of TH cells weakens the response.`);
mc(5, `cancer`, `Contact inhibition is lost in cancer cells. Which of the following behaviours would you expect in a culture dish?`, `Normal cells form a single layer, while cancer cells pile up in many layers`, [`Both form many layers`, `Both form one layer`, `Cancer cells stop dividing early`], `Normal cells stop dividing when they touch. Cancer cells go on and form clumps.`);
mc(5, `cancer`, `Which statement correctly joins genes and cancer?`, `Cellular proto-oncogenes, when changed or over-expressed, can lead to oncogenic transformation`, [`Viruses are the only cause of cancer`, `Cancer does not involve any gene`, `Only inherited genes cause cancer`], `Cancer arises through changes in the genes that control growth. Physical, chemical and biological agents can cause these changes.`);
mc(5, `cancer`, `Which is the best reason for biopsy being the confirmatory test for cancer?`, `It shows the structure of the cells and tissue, to tell benign from malignant`, [`It shows the number of white cells only`, `It measures blood sugar`, `It detects antibodies`], `Imaging may show a mass but cannot say what it is. Histopathology of a biopsy confirms the type.`);
mc(5, `drug abuse`, `A teenager takes an unknown tablet at a party and is later found with slow breathing and a very slow pulse. The drug is most likely`, `an opioid-type depressant`, [`cocaine`, `a stimulant like amphetamine`, `caffeine`], `Opioids depress breathing and heart rate. Overdose can lead to death by respiratory failure. Cocaine would raise heart rate.`);
mc(5, `drug abuse`, `Sharing a needle for an injection of drugs is dangerous because it can spread`, `HIV and hepatitis B`, [`malaria and typhoid`, `common cold and pneumonia`, `ascariasis and filariasis`], `Blood-borne viruses pass through contaminated needles. The other diseases spread by other routes.`);
mc(5, `immunity`, `Which of these shows a mismatch between feature and cell?`, `Neutrophils: memory cells of the acquired response`, [`Macrophages: phagocytosis`, `Natural killer cells: innate defence`, `Plasma cells: antibody secretion`], `Neutrophils belong to innate immunity. Memory cells are B and T lymphocytes.`);
asr(5, `immunity`, `A second dose of the same vaccine gives a stronger response than the first.`, `Ready-made antibodies are present in the vaccine.`, 2, `A is true as memory cells are present. R is false: vaccines contain antigens (weakened or killed pathogen or a protein), not antibodies.`, `Antigen is given in a vaccine and antibody in an antiserum.`);
asr(5, `AIDS`, `An ELISA test may be negative in the first few weeks after HIV infection.`, `Antibodies against HIV take time to appear after infection.`, 0, `ELISA detects antibodies, which are made only after some time. R explains A.`);
asr(5, `cancer`, `Radiation therapy and chemotherapy also affect normal cells.`, `These treatments are aimed at rapidly dividing cells, and some healthy tissues also divide rapidly.`, 0, `Hair follicles and bone marrow divide fast and so are hit, giving hair loss and anaemia. R explains A.`);
asr(5, `diseases`, `Malaria cannot be controlled by vaccinating people against typhoid.`, `The parasite is a protozoan and the vector is a mosquito.`, 0, `The typhoid vaccine acts only against <i>Salmonella typhi</i>. R shows that malaria has a different cause and route. So R explains A.`);

// ---------------------------------------------------------------- Templates
const DIS = [
  ['typhoid', '<i>Salmonella typhi</i>', 'contaminated food and water', 'small intestine'],
  ['pneumonia', '<i>Streptococcus pneumoniae</i>', 'droplets from an infected person', 'alveoli of the lungs'],
  ['common cold', 'rhinovirus', 'droplets and contaminated objects', 'nose and upper respiratory tract'],
  ['malaria', '<i>Plasmodium</i>', 'bite of the female <i>Anopheles</i>', 'liver and red blood cells'],
  ['amoebiasis', '<i>Entamoeba histolytica</i>', 'food contaminated by faeces, carried by houseflies', 'large intestine'],
  ['ascariasis', '<i>Ascaris</i>', 'soil, water and vegetables with eggs', 'intestine'],
  ['filariasis', '<i>Wuchereria</i>', 'bite of the female <i>Culex</i>', 'lymphatic vessels'],
  ['ringworm', '<i>Trichophyton</i> (a fungus)', 'soiled clothes and towels', 'skin, nails and scalp'],
];
const gens = [
  {
    id: `hd-g01`, type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'diseases',
    make(rng) {
      const k = int(rng, 0, DIS.length - 1);
      const a = DIS[k][1];
      const o = shuffleOpts(rng, a, DIS.filter((d, i) => i !== k).map((d) => d[1]).slice(0, 5).sort(() => rng() - 0.5).slice(0, 3));
      return { k, a, q: `The causative organism of ${DIS[k][0]} is`, options: o.options, answer: o.answer, sol: `Idea: recall the disease table. ${DIS[k][0]} is caused by ${a}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g02`, type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'diseases',
    make(rng) {
      const k = int(rng, 0, DIS.length - 1);
      const a = DIS[k][0];
      const o = shuffleOpts(rng, a, DIS.filter((d, i) => i !== k).map((d) => d[0]).sort(() => rng() - 0.5).slice(0, 3));
      return { k, a, q: `A disease is spread through ${DIS[k][2]}. Its causative organism is ${DIS[k][1]}. The disease is`, options: o.options, answer: o.answer, sol: `Idea: match organism and route. ${DIS[k][1]} spreads through ${DIS[k][2]} and affects the ${DIS[k][3]}, so the disease is ${a}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g03`, type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'drug abuse',
    make(rng) {
      const rows = [
        ['Heroin (smack)', 'latex of the poppy, <i>Papaver somniferum</i>, by acetylation of morphine', 'depressant'],
        ['Morphine', 'latex of the poppy, <i>Papaver somniferum</i>', 'sedative and painkiller'],
        ['Cocaine', '<i>Erythroxylum coca</i>', 'stimulant of the CNS'],
        ['Marijuana', 'flower tops of <i>Cannabis sativa</i>', 'acts on cannabinoid receptors in the brain'],
        ['Charas', 'resin of <i>Cannabis sativa</i>', 'acts on cannabinoid receptors in the brain'],
      ];
      const k = int(rng, 0, rows.length - 1);
      const a = rows[k][1];
      const o = shuffleOpts(rng, a, ['<i>Datura</i> seeds', '<i>Atropa belladonna</i> roots', 'bark of the cinchona tree', 'seeds of the opium poppy only'].filter((x) => x !== a));
      return { k, a, q: `${rows[k][0]} is obtained from the`, options: o.options, answer: o.answer, sol: `Idea: ${rows[k][0]} comes from the ${a}. It is a ${rows[k][2]}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g04`, type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'immunity',
    make(rng) {
      const cases = [
        ['A baby drinks colostrum after birth', 'Natural passive immunity'],
        ['A child recovers from chickenpox and is then protected for life', 'Natural active immunity'],
        ['A child is given the BCG vaccine', 'Artificial active immunity'],
        ['A man bitten by a snake is given antivenom', 'Artificial passive immunity'],
        ['IgG from the mother crosses the placenta to the foetus', 'Natural passive immunity'],
        ['An injection of tetanus antitoxin is given after a deep wound', 'Artificial passive immunity'],
        ['A person is given a dose of the hepatitis B vaccine', 'Artificial active immunity'],
      ];
      const [s, a] = choose(rng, cases);
      const all = ['Natural active immunity', 'Natural passive immunity', 'Artificial active immunity', 'Artificial passive immunity'];
      const o = shuffleOpts(rng, a, all.filter((x) => x !== a));
      return { s, a, q: `${s}. This is an example of`, options: o.options, answer: o.answer, sol: `Idea: active = the body makes its own antibodies; passive = ready-made antibodies are received. Natural = by infection or from mother; artificial = by medical means. Here: ${a}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g05`, type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'cancer',
    make(rng) {
      const d = choose(rng, [1, 2, 3, 4]);
      const times = int(rng, 2, 8);
      const hours = d * 6 * times;
      return { d, times, hours, q: `A single cancer cell in a culture divides every ${d * 6} hours, and every cell keeps dividing. How many cells are present after ${hours} hours?`, answer: 2 ** times, tol: 0, sol: `Idea: the number of divisions = ${hours}/${d * 6} = ${times}. Each division doubles the number, so cells = 2<sup>${times}</sup> = ${2 ** times}.`, trap: 'The cell number doubles, it does not add the same amount.' };
    },
    verify(p) { return 2 ** (p.hours / (p.d * 6)); },
  },
  {
    id: `hd-g06`, type: 'nat', level: 2, format: 'integer', exams: ex(2), sub: 'immunity',
    make(rng) {
      const k = int(rng, 3, 40);
      const w = int(rng, 0, 3);
      const asks = ['heavy chains', 'light chains', 'polypeptide chains in all', 'antigen-binding sites'];
      const per = [2, 2, 4, 2];
      return { k, w, q: `A sample contains ${k} antibody molecules (each H<sub>2</sub>L<sub>2</sub>). How many ${asks[w]} are present in all?`, answer: k * per[w], tol: 0, sol: `Idea: one antibody has 2 heavy chains, 2 light chains (4 chains in all) and 2 antigen-binding sites. For ${k} molecules, ${asks[w]} = ${k} &times; ${per[w]} = ${k * per[w]}.` };
    },
    verify(p) { return p.k * [2, 2, 4, 2][p.w]; },
  },
  {
    id: `hd-g07`, type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'AIDS',
    make(rng) {
      const k = choose(rng, [2, 3, 4, 5]);
      const n = int(rng, 2, 5);
      return { k, n, q: `One helper T cell is infected by HIV. In each round every infected cell releases ${k} new viruses, and each new virus infects exactly one new T cell. How many T cells are newly infected in round ${n}? (Round 1 is the infection of the first ${k} cells.)`, answer: k ** n, tol: 0, sol: `Idea: each round multiplies by ${k}. Round 1: ${k}. Round 2: ${k * k}. Round ${n}: ${k}<sup>${n}</sup> = ${k ** n}.`, trap: 'Newly infected cells in a round are not cumulative.' };
    },
    verify(p) { let c = 1; for (let i = 0; i < p.n; i++) c *= p.k; return c; },
  },
  {
    id: `hd-g08`, type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'lymphoid organs',
    make(rng) {
      const prim = ['Bone marrow', 'Thymus'];
      const sec = ['Spleen', 'Lymph nodes', 'Tonsils', 'Peyer\'s patches', 'Appendix'];
      const askPrim = rng() < 0.5;
      const a = askPrim ? choose(rng, prim) : choose(rng, sec);
      const pool = askPrim ? sec.slice() : prim.concat(['Liver']);
      const wr = askPrim ? [...pool].sort(() => rng() - 0.5).slice(0, 3) : [...pool.filter((x) => x !== 'Liver'), 'Liver'].slice(0, 3);
      const o = shuffleOpts(rng, a, wr);
      return { a, askPrim, q: `Which of these is a ${askPrim ? 'primary' : 'secondary'} lymphoid organ?`, options: o.options, answer: o.answer, sol: `Idea: primary organs (bone marrow, thymus) are where lymphocytes are made and mature. Secondary organs (spleen, lymph nodes, tonsils, Peyer\'s patches, appendix) are where they meet antigens. ${a} is ${askPrim ? 'primary' : 'secondary'}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g09`, type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'immunity',
    make(rng) {
      const a = choose(rng, [5, 8, 10, 12, 20]), f = choose(rng, [4, 5, 10, 20]);
      const b = a * f;
      return { a, b, q: `After a first vaccine dose the peak antibody level is ${a} units. After the booster dose the peak is ${b} units. By what percentage is the booster response higher than the primary response?`, answer: (f - 1) * 100, tol: 0.5, unit: '%', sol: `Idea: increase % = (new &minus; old)/old &times; 100 = (${b} &minus; ${a})/${a} &times; 100 = ${(f - 1) * 100}%. This is the memory (secondary) response.`, trap: 'A ' + f + '-fold rise is a ' + (f - 1) * 100 + '% increase, not ' + f * 100 + '%.' };
    },
    verify(p) { return ((p.b - p.a) / p.a) * 100; },
  },
  {
    id: `hd-g10`, type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'cancer',
    make(rng) {
      const rows = [
        ['X-rays', 'physical'], ['gamma rays', 'physical'], ['UV radiation', 'physical'],
        ['tobacco smoke', 'chemical'], ['mustard gas', 'chemical'], ['oncogenic viruses', 'biological'],
      ];
      const [s, a] = choose(rng, rows);
      const all = ['physical', 'chemical', 'biological', 'genetic only'];
      const o = shuffleOpts(rng, a, all.filter((x) => x !== a));
      return { s, a, q: `${s[0].toUpperCase() + s.slice(1)} act as which type of carcinogen?`, options: o.options, answer: o.answer, sol: `Idea: physical agents are radiations, chemical agents are substances such as tobacco smoke, and biological agents are oncogenic viruses. ${s} is ${a}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
  {
    id: `hd-g11`, type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'cancer',
    make(rng) {
      const k = int(rng, 4, 20);
      return { k, q: `A single cancer cell grows to a tumour of ${2 ** k} cells by repeated division, with no cell death. How many rounds of division were needed?`, answer: k, tol: 0, sol: `Idea: after n divisions there are 2<sup>n</sup> cells. 2<sup>${k}</sup> = ${2 ** k}, so n = ${k}.`, trap: 'The number of divisions is the power of 2, not the number of cells.' };
    },
    verify(p) { return Math.log2(2 ** p.k); },
  },
  {
    id: `hd-g12`, type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'diseases',
    make(rng) {
      const rows = [
        ['typhoid', 'Widal test'], ['HIV infection', 'ELISA'], ['cancer type confirmation', 'biopsy and histopathology'], ['a tumour deep in the brain', 'MRI or CT scan'],
      ];
      const [s, a] = choose(rng, rows);
      const all = ['Widal test', 'ELISA', 'biopsy and histopathology', 'MRI or CT scan'];
      const o = shuffleOpts(rng, a, all.filter((x) => x !== a));
      return { s, a, q: `The best test for ${s} is`, options: o.options, answer: o.answer, sol: `Idea: pair the test with its job. Widal is for typhoid, ELISA for HIV, biopsy for confirming cancer cells, and CT or MRI to see internal tumours. For ${s}: ${a}.` };
    },
    verify(p) { return p.options.indexOf(p.a); },
  },
];

export default { topic: 'health-disease', groups, items, gens };
