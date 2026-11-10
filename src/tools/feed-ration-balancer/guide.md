---
name: Feed ration balancer
num: 397
shelf: science
code: T285
section: animal-science
title: "Feed ration balancer: least-cost ration and Pearson square from your own feed analyses"
summary: "Enter your feeds (dry matter, protein, energy, calcium, phosphorus and price) and your animal's daily requirements, and get the cheapest mix of feeds that meets every limit, found by linear programming, plus a Pearson square for two feeds. Nothing is uploaded."
status: live
ads: true
order: 397
icon: calculator
works: offline
updated: 2026-11-09
related: [budget-calculator, breeding-calendar, growth-curve-tracker, stocking-density-calculator, lp-solver]
sources:
  - "Least-cost ration as a linear programme (minimise cost subject to nutrient and feed limits), solved with the two-phase simplex method and Bland's rule, as in any operations research textbook (for example Hillier and Lieberman, Introduction to Operations Research)."
  - "Pearson square for mixing two feeds to a target concentration: a standard animal nutrition teaching method."
  - "Checked against scipy.optimize.linprog (HiGHS) on the example ration and 300 random problems (same status and the same optimum to 1 part in a million), and on the Wyndor textbook problem."
  - "No feed tables or feeding standards are bundled. The example feeds and requirements are made-up round numbers for trying the tool, not real analyses or recommendations."
flow:
  - { icon: table, label: "Feeds" }
  - { icon: target, label: "Needs" }
  - { icon: calculator, label: "Least cost" }
  - { icon: sigma, label: "Square" }
---

## What it does

A **ration** is the daily mix of feeds an animal eats. Balancing it means choosing amounts of each feed so the animal gets enough dry matter, protein, energy and minerals, without going over any limit, at the lowest cost. This tool does that with your own numbers:

- **Least-cost ration**: finds the amount of every feed (kg of dry matter per day) that meets every minimum and maximum you set at the lowest cost per day. This is a small *linear programme*, solved in your browser with the simplex method.
- **Pearson square**: the classic pencil method for mixing two feeds to reach one target, such as 16 % crude protein. It shows the "parts" of each feed and the shares on a dry-matter and an as-fed basis.

No feed tables are built in. Use your own forage and feed analyses, and requirements from your nutritionist, a feeding standard you have access to, or your own records.

Follow the animals' weight on the ration with the [[growth-curve-tracker|growth curve tracker]], and plan matings with the [[breeding-calendar]].

## How to use it

1. Type or paste your feeds, one per line: name, DM % (dry matter), CP % (crude protein, of the dry matter), energy per kg of DM (in any unit, such as MJ ME or Mcal NEL), Ca % and P % (of the DM), and the price per kg **as fed**. You can add a minimum and a maximum in kg of DM per day for any feed, for example to keep some hay in the diet or limit a by-product. **Open a file** reads a CSV or Excel sheet.
2. Type the animal's daily requirements as minimums and, if you want, maximums: dry matter intake in kg DM, protein, calcium and phosphorus in grams, and energy in the same unit as your feed list.
3. Read the ration: kg of DM and kg as fed per feed, the share of the diet, the cost per day, and what the ration supplies against each limit. The note lists the **limits reached**: these are the ones that set the cost.
4. If no ration can meet every limit, the tool tries removing each limit in turn and tells you which single limit stands in the way.
5. Download the ration as CSV, or as an image, PDF or Word report.

## Worked example

Press **Use the example**. It loads five made-up feeds (grass hay, maize silage, barley, soybean meal and limestone, each marked "example") and made-up needs: 19 to 21 kg DM, at least 3000 g protein, 220 MJ ME, 100 g calcium and 60 g phosphorus. The hay has a minimum of 4 kg DM and the silage a maximum of 10 kg DM.

The cheapest ration costs **4.44 per day**: 8.01 kg DM of hay, 10.00 kg DM of silage (its maximum), no barley, 2.91 kg DM of soybean meal and 0.06 kg of limestone, 41.01 kg as fed in all. It supplies exactly 3000 g protein, 220 MJ ME and 100 g calcium (those limits are reached) and 65.4 g phosphorus, more than needed. Barley is left out because, at these made-up prices, silage and hay supply energy more cheaply.

In the Pearson square, mixing the hay (10 % CP) with the soybean meal (48 % CP) to 16 % CP takes 32 parts hay and 6 parts soybean meal: 84.2 % and 15.8 % of the dry matter, or 84.4 % and 15.6 % as fed.

## Tips

- Prices are per kg as fed, because that is how feed is bought. The tool turns them into price per kg of DM itself.
- Put a maximum on minerals and by-products, and a minimum on forage, so the cheapest answer is also a sensible diet.
- The simplex answer is exact for the numbers you give it. Feed analyses vary, so check the ration on the animals.

## FAQ

**Why is a feed at 0?** It costs more for what it supplies than the other feeds. Lower its price, or set a minimum, to see the cost of including it.

**Can I balance amino acids or fibre?** Not in this version: it covers dry matter, protein, energy, calcium and phosphorus.

**Is my data uploaded?** No. Everything runs in your browser and works offline. This is a planning aid, not a substitute for advice from a qualified nutritionist.
