---
title: "The true cost of renting: how much is a shorter commute worth?"
summary: "Why the cheapest rent is often not the cheapest home: the hidden monthly bills of renting in Ontario, what each km of commute costs, and how to put a price on your travel time."
tools: [rent-compare, commute-cost, budget-calculator]
updated: 2026-11-14
sources:
  - "Commute costs are worked out with the Rent compare tool's own code (src/lib/money/rental.ts): gas $1.40 a litre, 8.5 L/100 km, $0.10 a km wear, $3.30 fare, $156 pass. These are example values, not quoted prices; check your own fuel price and transit agency."
  - "Postal area centres for the example homes: GeoNames postal code data (geonames.org, CC BY 4.0). The two homes and their bills are made up to show the method."
  - "Which utilities a tenant pays is set out in the lease; in Ontario, the government's Standard Lease form has a section for it. Check the official source."
---

When you scroll rental listings, the rent is the big number on every card, so it is natural to sort by it. But the rent is only part of what a home costs you each month. Some homes include heat and water; others leave you paying for hydro, gas, a parking spot and a long drive to work. This guide explains where the hidden costs hide, what a kilometre of commute is really worth, and how to decide whether a cheaper place further out is a good deal. To run your own numbers, [[rent-compare|compare rental homes side by side]]; for a single trip's costs use [[commute-cost]], and once you have chosen, [[budget-calculator|plan the rest of your month]].

## What it is

The **true monthly cost** of a home is three things added together:

true cost = rent + bills + travel

- **Rent** is what the landlord charges.
- **Bills** are the monthly costs the rent does not cover. In Ontario the usual ones are hydro (electricity), heat (often natural gas), water, internet, a parking spot and tenant insurance. A basement unit might share utilities as a flat fee; a condo might include heat and water but charge for parking.
- **Travel** is what it costs to get from that home to the places you go every week: work, school, daycare, the gym.

For a car, travel money per month is:

travel = round trips a month × 2 × km one way × (litres per km × gas price + wear per km) + parking

There are about 4.35 weeks in a month, so 5 round trips a week is about 21.7 a month. With gas at $1.40, a car that uses 8.5 L per 100 km and $0.10 a km for tyres, oil and repairs, each km costs about $0.22. Every extra km of one-way commute, five days a week, adds about **$9.52 a month**.

Bus and train fares work differently: the fare is the same whether the stop is 3 or 13 km away (within a zone), and a monthly pass caps what you pay. So for transit users, distance costs **time** more than money.

## Putting a price on time

A longer commute takes hours you could spend working, resting or with family. Many people find it helps to put a number on an hour: their hourly pay, or something lower. The question then becomes simple. If home B saves $229 a month but adds 25 hours of travel, you are being paid about $9.22 for each extra hour on the road. If your hour is worth more than that to you, the dearer home closer in is the better deal.

## Checked with the tools

Both charts below were worked out with the Rent compare tool's own code. The first shows the example from the tool page: an apartment in Mississauga (A) at $2,250 and a basement in Brampton (B) at $1,850, both with work in downtown Toronto 5 days a week by car and a college twice a week by bus.

<!-- fig:two-homes --><figure class="fig"><svg viewBox="0 0 640 180" width="100%" role="img" aria-label="The two example homes, worked out with the Rent compare maths. Counting money only, B is cheaper; once each hour of travel is valued at $15, A wins."><text x="112" y="23" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif">A, time at $0/h</text><rect x="120.0" y="6" width="279.5" height="24" style="fill:var(--accent)"/><rect x="399.5" y="6" width="27.9" height="24" style="fill:var(--muted)"/><rect x="427.4" y="6" width="37.7" height="24" style="fill:var(--warn)"/><rect x="465.1" y="6" width="0.0" height="24" style="fill:var(--bad)"/><text x="471.1" y="23" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">$2,779</text><text x="112" y="59" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif">B, time at $0/h</text><rect x="120.0" y="42" width="229.8" height="24" style="fill:var(--accent)"/><rect x="349.8" y="42" width="31.7" height="24" style="fill:var(--muted)"/><rect x="381.4" y="42" width="55.2" height="24" style="fill:var(--warn)"/><rect x="436.7" y="42" width="0.0" height="24" style="fill:var(--bad)"/><text x="442.7" y="59" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">$2,550</text><text x="112" y="95" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif">A, time at $15/h</text><rect x="120.0" y="78" width="279.5" height="24" style="fill:var(--accent)"/><rect x="399.5" y="78" width="27.9" height="24" style="fill:var(--muted)"/><rect x="427.4" y="78" width="37.7" height="24" style="fill:var(--warn)"/><rect x="465.1" y="78" width="87.0" height="24" style="fill:var(--bad)"/><text x="558.2" y="95" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">$3,479</text><text x="112" y="131" text-anchor="end" style="fill:var(--ink);font:12px system-ui,sans-serif">B, time at $15/h</text><rect x="120.0" y="114" width="229.8" height="24" style="fill:var(--accent)"/><rect x="349.8" y="114" width="31.7" height="24" style="fill:var(--muted)"/><rect x="381.4" y="114" width="55.2" height="24" style="fill:var(--warn)"/><rect x="436.7" y="114" width="133.3" height="24" style="fill:var(--bad)"/><text x="576.0" y="131" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">$3,623</text><rect x="120" y="158" width="12" height="12" rx="2" style="fill:var(--accent)"/><text x="136" y="168" text-anchor="start" style="fill:var(--muted);font:12px system-ui,sans-serif">Rent</text><rect x="200" y="158" width="12" height="12" rx="2" style="fill:var(--muted)"/><text x="216" y="168" text-anchor="start" style="fill:var(--muted);font:12px system-ui,sans-serif">Bills</text><rect x="280" y="158" width="12" height="12" rx="2" style="fill:var(--warn)"/><text x="296" y="168" text-anchor="start" style="fill:var(--muted);font:12px system-ui,sans-serif">Travel</text><rect x="360" y="158" width="12" height="12" rx="2" style="fill:var(--bad)"/><text x="376" y="168" text-anchor="start" style="fill:var(--muted);font:12px system-ui,sans-serif">Time</text></svg><figcaption>The two example homes, worked out with the Rent compare maths. Counting money only, B is cheaper; once each hour of travel is valued at $15, A wins.</figcaption></figure><!-- /fig -->

Counting money only, B is $229 a month cheaper ($2,550 against $2,779). But B's commute is about 72 hours a month against A's 47. At $15 an hour, those 25 extra hours are worth about $373, so A comes out ahead ($3,479 against $3,623).

The second chart shows what getting to work costs at different distances.

<!-- fig:km-cost --><figure class="fig"><svg viewBox="0 0 640 280" width="100%" role="img" aria-label="Monthly cost of getting to work 5 days a week by distance, from the Rent compare maths: gas $1.40/L, 8.5 L/100 km, $0.10/km wear, $3.30 fare capped at a $156 pass (example values). Valued time costs more than gas."><line x1="50" x2="620" y1="230" y2="230" style="stroke:var(--line)"/><text x="44" y="234" text-anchor="end" style="fill:var(--muted);font:12px system-ui,sans-serif">$0</text><line x1="50" x2="620" y1="158.66666666666669" y2="158.66666666666669" style="stroke:var(--line)"/><text x="44" y="162.66666666666669" text-anchor="end" style="fill:var(--muted);font:12px system-ui,sans-serif">$500</text><line x1="50" x2="620" y1="87.33333333333334" y2="87.33333333333334" style="stroke:var(--line)"/><text x="44" y="91.33333333333334" text-anchor="end" style="fill:var(--muted);font:12px system-ui,sans-serif">$1,000</text><line x1="50" x2="620" y1="16" y2="16" style="stroke:var(--line)"/><text x="44" y="20" text-anchor="end" style="fill:var(--muted);font:12px system-ui,sans-serif">$1,500</text><text x="50" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">0</text><text x="164" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">10</text><text x="278" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">20</text><text x="392" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">30</text><text x="506" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">40</text><text x="620" y="246" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">50</text><text x="345" y="264" text-anchor="middle" style="fill:var(--muted);font:12px system-ui,sans-serif">one-way road distance to work, km (5 round trips a week)</text><polyline fill="none" stroke-width="2.5" style="stroke:var(--warn)" points="50.0,230.0 61.4,228.6 72.8,227.3 84.2,225.9 95.6,224.6 107.0,223.2 118.4,221.8 129.8,220.5 141.2,219.1 152.6,217.8 164.0,216.4 175.4,215.1 186.8,213.7 198.2,212.3 209.6,211.0 221.0,209.6 232.4,208.3 243.8,206.9 255.2,205.5 266.6,204.2 278.0,202.8 289.4,201.5 300.8,200.1 312.2,198.8 323.6,197.4 335.0,196.0 346.4,194.7 357.8,193.3 369.2,192.0 380.6,190.6 392.0,189.2 403.4,187.9 414.8,186.5 426.2,185.2 437.6,183.8 449.0,182.5 460.4,181.1 471.8,179.7 483.2,178.4 494.6,177.0 506.0,175.7 517.4,174.3 528.8,172.9 540.2,171.6 551.6,170.2 563.0,168.9 574.4,167.5 585.8,166.1 597.2,164.8 608.6,163.4 620.0,162.1"/><rect x="60" y="20" width="12" height="3" style="fill:var(--warn)"/><text x="78" y="26" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">Car, money only</text><polyline fill="none" stroke-width="2.5" style="stroke:var(--bad)" points="50.0,230.0 61.4,218.2 72.8,214.2 84.2,210.2 95.6,206.2 107.0,202.2 118.4,198.1 129.8,194.1 141.2,190.1 152.6,186.1 164.0,182.1 175.4,178.1 186.8,174.0 198.2,170.0 209.6,166.0 221.0,162.0 232.4,158.0 243.8,154.0 255.2,149.9 266.6,145.9 278.0,141.9 289.4,137.9 300.8,133.9 312.2,129.9 323.6,125.8 335.0,121.8 346.4,117.8 357.8,113.8 369.2,109.8 380.6,105.7 392.0,101.7 403.4,97.7 414.8,93.7 426.2,89.7 437.6,85.7 449.0,81.6 460.4,77.6 471.8,73.6 483.2,69.6 494.6,65.6 506.0,61.6 517.4,57.5 528.8,53.5 540.2,49.5 551.6,45.5 563.0,41.5 574.4,37.5 585.8,33.4 597.2,29.4 608.6,25.4 620.0,21.4"/><rect x="60" y="38" width="12" height="3" style="fill:var(--bad)"/><text x="78" y="44" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">Car, time at $15/h</text><polyline fill="none" stroke-width="2.5" style="stroke:var(--accent)" points="50.0,230.0 61.4,209.5 72.8,209.5 84.2,209.5 95.6,209.5 107.0,209.5 118.4,209.5 129.8,209.5 141.2,209.5 152.6,209.5 164.0,209.5 175.4,209.5 186.8,209.5 198.2,209.5 209.6,209.5 221.0,209.5 232.4,209.5 243.8,209.5 255.2,209.5 266.6,209.5 278.0,209.5 289.4,209.5 300.8,209.5 312.2,209.5 323.6,209.5 335.0,209.5 346.4,209.5 357.8,209.5 369.2,209.5 380.6,209.5 392.0,209.5 403.4,209.5 414.8,209.5 426.2,209.5 437.6,209.5 449.0,209.5 460.4,209.5 471.8,209.5 483.2,209.5 494.6,209.5 506.0,209.5 517.4,209.5 528.8,209.5 540.2,209.5 551.6,209.5 563.0,209.5 574.4,209.5 585.8,209.5 597.2,209.5 608.6,209.5 620.0,209.5"/><rect x="60" y="56" width="12" height="3" style="fill:var(--accent)"/><text x="78" y="62" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">Bus with a $156 pass, money only</text><polyline fill="none" stroke-width="2.5" style="stroke:var(--ink)" points="50.0,230.0 61.4,189.4 72.8,184.7 84.2,180.1 95.6,175.4 107.0,170.8 118.4,166.1 129.8,161.5 141.2,156.8 152.6,152.1 164.0,147.5 175.4,142.8 186.8,138.2 198.2,133.5 209.6,128.9 221.0,124.2 232.4,119.6 243.8,114.9 255.2,110.3 266.6,105.6 278.0,101.0 289.4,96.3 300.8,91.7 312.2,87.0 323.6,82.4 335.0,77.7 346.4,73.1 357.8,68.4 369.2,63.7 380.6,59.1 392.0,54.4 403.4,49.8 414.8,45.1 426.2,40.5 437.6,35.8 449.0,31.2 460.4,26.5 471.8,21.9 483.2,17.2 494.6,16.0 506.0,16.0 517.4,16.0 528.8,16.0 540.2,16.0 551.6,16.0 563.0,16.0 574.4,16.0 585.8,16.0 597.2,16.0 608.6,16.0 620.0,16.0"/><rect x="60" y="74" width="12" height="3" style="fill:var(--ink)"/><text x="78" y="80" text-anchor="start" style="fill:var(--ink);font:12px system-ui,sans-serif">Bus with a $156 pass, time at $15/h</text></svg><figcaption>Monthly cost of getting to work 5 days a week by distance, from the Rent compare maths: gas $1.40/L, 8.5 L/100 km, $0.10/km wear, $3.30 fare capped at a $156 pass (example values). Valued time costs more than gas.</figcaption></figure><!-- /fig -->

By car, money alone climbs steadily: about $95 a month at 10 km, $238 at 25 km and $381 at 40 km. Add time at $15 an hour and the same trips cost about $336, $758 and $1,181. The bus line stays flat in money ($143 a month at 21.7 round trips, under the pass), but the time cost climbs faster than the car's, because buses are slower door to door.

## How to use it

1. Open the Rent compare tool and type each home you are considering, with its rent and every bill. Ask the landlord which utilities are included and how much the last tenant paid.
2. Give each home a location: a postal code, or exact coordinates copied from your map app.
3. Add the places you go and how you get there. Add the nearest bus stop or GO station with 0 trips if you only want to see how far it is.
4. Check the gas price, fare and pass values against what you really pay.
5. Read the ranking with time at 0, then try your hourly value. If the winner changes, you know exactly what the trade-off is.
6. For the trips that matter most, type the real km and minutes from your map app.

## Where it is used

- **Newcomers to Canada** comparing a first apartment before they know the city, often from abroad.
- **Students** choosing between a room near campus and a cheaper one a bus ride away.
- **Families** weighing a bigger home further out against school runs and daycare drop-offs.
- **Anyone changing jobs**: the same home can become the expensive one when your workplace moves.

## Common mistakes

- **Comparing rents only.** A $200 cheaper unit with $150 of extra utilities and a longer drive is not cheaper. List every bill.
- **Forgetting seasonal bills.** Heat in an Ontario winter can be several times the summer bill. Ask for a yearly average, not one month.
- **Using straight-line distance as driving distance.** Roads wind; a 10 km straight line is often 12 to 14 km by road. The tool multiplies by a road factor, but real km from a map app are better.
- **Ignoring parking.** A downtown lot or a paid parking spot at the building can add $100 or more a month.

## Questions people ask

**What percentage of income should go on rent?** A common guide is about 30% of gross income on housing. Use the true cost, not the rent alone, when you check it.

**Is it worth paying more rent to live closer to work?** It is when the extra rent is less than the travel money you save plus the value you put on the hours you get back. The tool shows that number for your own homes.

**Do landlords in Ontario have to say which utilities are included?** The Standard Lease has a section that says who pays for each utility. Read it before you sign.
