---
title: Retail media 101
summary: 'Why retailers have become advertising businesses, the onsite, offsite and in-store channels, closed-loop measurement, ROAS, and the data behind it all.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a retail media network?
    choices: ['A TV channel owned by a shop', 'A retailer selling advertising to the brands it stocks, on its own sites, apps, stores and audiences', 'A social network for shoppers']
    ans: 1
    why: The grocer sells ad space (search results, app banners, store screens, its shopper audiences elsewhere) to the brands on its shelves.
  - q: What makes retail media measurement "closed-loop"?
    choices: ['The retailer sees both the ad exposure and the purchase, online and in store', 'The ads loop forever', 'Only clicks are counted']
    ans: 0
    why: Because shoppers log in and use loyalty cards, the retailer can link who saw an ad to who bought, which most publishers cannot.
  - q: A brand spends $10,000 and is credited with $50,000 of attributed sales. What is its ROAS?
    choices: ['0.2', '5', '40,000']
    ans: 1
    why: ROAS = attributed revenue ÷ ad spend = 50,000 ÷ 10,000 = 5. Lesson 7.3 shows why this overstates what the ads caused.
sources:
  - 'Interactive Advertising Bureau (IAB) and Media Rating Council (MRC), Retail Media Measurement Guidelines (2024), iab.com'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3 (Retail sales)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly'
---

**Module 7 · about 25 minutes · read first: 1.3.** You'll be able to explain what a retail media network is and why it has grown so fast, describe the onsite, offsite and in-store channels, calculate ROAS, and list the data a retail media platform needs.

<div class="bigidea">Retail media is a shop selling its shelf ends again, online: brands pay to be seen where people are already buying, and because the shop sees both the ad and the till, it can show the brand what happened next.</div>

## 1. What retail media is

A **retail media network (RMN)** is a retailer selling advertising to the brands whose products it stocks. A cereal brand pays the grocer to show its cereal at the top of search results, on the app home page, on screens in store, or to the grocer's shoppers elsewhere on the internet. General merchants, grocers, pharmacies, marketplaces and delivery apps now run media networks, and so do some travel and banking companies.

Supermarkets have always charged brands for the best shelf spots and the ends of aisles. Retail media is the same deal moved online and made measurable: the "shelf end" is now the first search result, and the retailer can tell the brand how many shoppers who saw it went on to buy.

Why it grew so fast:

1. **First-party data.** Retailers know what logged-in shoppers actually buy. "First-party" means collected directly by the company from its own customers. With privacy rules tightening and third-party cookies fading, this data is valuable.
2. **Closed-loop measurement.** The retailer sees both the ad and the sale, so it can report sales results, not just clicks.
3. **Margins.** Advertising earns far higher margins than selling groceries, so it can fund lower prices or new services.
4. **Closeness to purchase.** The ads appear where people are already shopping.

## 2. The channels

| Channel | Examples | Data involved |
|---|---|---|
| **Onsite: sponsored products** | Paid listings in search and category pages, usually priced per click by auction | Search terms, catalogue, bids, impressions, clicks, add-to-cart, orders |
| **Onsite: display** | Banners and home-page takeovers on the website and app | Placements, audiences, impressions, viewability |
| **Offsite** | The retailer's audiences targeted on social media, the open web, connected TV and streaming audio | Audience segments, identity matching, partner impression logs, clean rooms |
| **In-store** | Digital screens, audio, smart cooler doors, shelf tags, checkout coupons | Screen play logs, footfall, store sales, loyalty transactions |
| **Offers and sampling** | Personalised coupons and loyalty-points offers | Loyalty IDs, offer redemptions |

## 3. The players

- **The retailer's media team:** sells campaigns, runs the ad platform, owns the data and the measurement.
- **Brands (advertisers)** and their **agencies:** plan budgets across many networks and want numbers they can compare.
- **Ad technology partners:** ad servers, sponsored-products platforms, demand-side platforms, clean-room providers, measurement firms. Many retailers license the technology and own the data layer.
- **Shoppers:** whose privacy and experience must be protected. Too many ads hurt sales.

## 4. One campaign, from ad to till

<div class="steps">
<div class="step"><b>Booking.</b> A soft-drink brand books two weeks of sponsored products on "cola" searches and screens in 100 stores. Budget: $20,000.</div>
<div class="step"><b>Exposure.</b> Loyalty member L-5521 searches "cola" in the app. The brand's 2-litre bottle shows first. An <b>impression</b> event is written with her hashed loyalty ID, the campaign and the time.</div>
<div class="step"><b>Click.</b> She taps the ad. A <b>click</b> event follows, with the same campaign and ID.</div>
<div class="step"><b>Purchase.</b> Two days later she buys the bottle in store and scans her loyalty card. The till line lands in the nightly batch with the same loyalty ID.</div>
<div class="step"><b>Closing the loop.</b> The measurement job joins the click to the purchase within the 14-day window and credits $3.49 of <b>attributed sales</b> to the campaign. Added up over all shoppers, this becomes the brand's ROAS.</div>
</div>

**ROAS** (return on ad spend) = attributed sales ÷ ad spend. **ACoS** (advertising cost of sales, common for sponsored products) is the same two numbers the other way round: spend ÷ attributed sales.

<div class="problem" data-problem="retail-media-101-roas"></div>

<div class="meaning">

<dl>
<dt>Retail media network</dt><dd>A retailer's advertising business, selling space on its sites, apps, stores and audiences.</dd>
<dt>First-party data</dt><dd>What the retailer learns directly from its own customers: purchases, searches, loyalty sign-ups.</dd>
<dt>Closed loop</dt><dd>Seeing both the ad exposure and the later purchase for the same shopper.</dd>
<dt>ROAS</dt><dd>Attributed sales per dollar of advertising.</dd>
<dt>Physical meaning</dt><dd>When a snack brand's manager tells their boss "every dollar on the grocer's app brought back four dollars of sales", that number came from a pipeline joining billions of impressions and clicks to loyalty-card till lines. Whether the ads really caused those sales is a harder question, and it is the subject of Lesson 7.3.</dd>
</dl>

</div>

<div class="myth">

**"A ROAS of 5 means the ads created five dollars of sales for every dollar spent."** It means five dollars of sales were credited to the ads under an attribution rule. Many of those shoppers would have bought the brand anyway. Only an experiment with a holdout group shows what the ads caused.

</div>

## 5. The data that makes it work

1. **Product catalogue** with categories, brands, stock and prices (ads for out-of-stock items waste money and annoy shoppers).
2. **Ad events:** requests, impressions, viewable impressions and clicks, with time, placement, campaign, creative and a user or device identifier.
3. **Commerce events:** product views, add-to-cart and orders online; **till transactions** in store, linked by loyalty ID.
4. **Identity:** linking app, web, loyalty and email identities for one person, with consent.
5. **Campaign set-up:** budgets, bids, flight dates, targeting, attribution windows.

Moving and joining these at scale is exactly the Spark, Kafka, BigQuery and Druid work from Modules 2 to 5.

## 6. Questions a retail media data team answers

- "How many impressions has this campaign served, and is it on pace to spend its budget by the end date?" (streaming, Druid)
- "What ROAS did it achieve?" (attribution, BigQuery, Spark)
- "Did it actually **cause** extra sales, or would these shoppers have bought anyway?" (incrementality, Lesson 7.3)
- "Which audiences should the next campaign target?" (machine learning, Module 6)

## 7. Try it

A soft-drink brand runs a two-week campaign with a grocer: sponsored products in the app, a home-page banner, and screens in 100 stores. List every dataset you would need to report results, and mark which arrive in real time and which in batch.

<details>
<summary>One list, and what to check</summary>

Real time: ad requests, impressions and clicks from the app and website ad server; store screen play logs (often sent hourly). Near real time: online orders. Daily batch: store till transactions with loyalty IDs, campaign set-up and budgets, product and store tables, the list of stores with screens (test) and comparable stores without (control). Also the identity map and consent flags.

**Check:** your list includes a control group for the store screens, consent flags, and the product catalogue; these are the three most often forgotten.
</details>

**New words:** *retail media network*, *first-party data*, *closed-loop measurement*, *sponsored products*, *display*, *offsite*, *impression*, *attributed sales*, *ROAS*, *ACoS*.

<div class="keypoints">

- A retail media network is a retailer selling ad space on its sites, apps, stores and audiences to the brands it stocks.
- It grew because of first-party data, closed-loop measurement, high margins and closeness to purchase.
- Channels: onsite sponsored products and display, offsite audiences, in-store screens, and personalised offers.
- ROAS = attributed sales ÷ spend; it counts credited sales, not caused sales.

</div>
