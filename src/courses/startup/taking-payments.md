---
title: 'Taking payments: UPI, cards and payment gateways'
seoTitle: 'How to accept payments as a business: UPI, cards, Stripe'
summary: 'How customers pay you and what it costs: UPI and payment gateways in India, Interac, cards and pre-authorised debit in Canada, ACH and cards in the USA. Fees compared, payouts, chargebacks, foreign payments, and the KYC every payment provider runs.'
minutes: 13
updated: 2026-11-22
quiz:
  - q: 'Which is usually the cheapest way for an Indian shop to receive small payments?'
    choices: ['International card', 'UPI to a merchant account', 'Cheque by courier']
    ans: 1
    why: 'UPI person-to-merchant payments have zero MDR for most merchants.'
  - q: 'What is a chargeback?'
    choices: ['A refund you choose to give', 'A customer disputing a card payment with their bank, which takes the money back from you while it is investigated', 'A tax refund']
    ans: 1
    why: 'Card networks let customers dispute charges. You can respond with evidence, but you pay a fee either way in many cases.'
  - q: 'An Indian freelancer is paid by a US client. What does the bank give for each payment?'
    choices: ['Nothing', 'A Foreign Inward Remittance Certificate (FIRC) or advice proving it was an export receipt', 'A GST bill']
    ans: 1
    why: 'The FIRC or e-FIRA proves the foreign currency receipt, which supports zero-rated export treatment for GST.'
sources:
  - 'NPCI, UPI: https://www.npci.org.in'
  - 'RBI, Payment aggregator guidelines: https://www.rbi.org.in'
  - 'Payments Canada: https://www.payments.ca'
  - 'FTC and CFPB guidance on payments: https://www.consumerfinance.gov'
---

<!--fig:country-->

**Module 6 · about 13 minutes.** You'll choose the payment methods your customers expect at the lowest cost, and handle refunds and disputes properly.

<div class="bigidea">Offer the ways your customers already pay, know what each costs you, and prevent chargebacks with clear prices, a recognisable statement name and quick refunds.</div>

## 1. What customers expect

<div class="cc" data-cc="in">

**UPI** dominates: a QR code at the counter or UPI in your app, usually free for the merchant. Online, a **payment aggregator** (licensed by the RBI) adds cards, net banking, wallets and EMI. B2B clients pay by **NEFT, RTGS or IMPS** against an invoice.

</div>

<div class="cc" data-cc="ca">

**Interac** debit in person and e-Transfer for invoices; credit cards online and in store; **pre-authorised debit (PAD)** for subscriptions and rent. B2B clients often pay by EFT.

</div>

<div class="cc" data-cc="us">

Cards (in person and online), digital wallets, **ACH** bank debits for subscriptions and large invoices, and Zelle or wires for B2B.

</div>

<!--fig:payment-fees-->

## 2. Getting set up

<div class="su-steps">

Setting up online payments

1. Open the business bank account (Lesson 6.1).
2. Apply to a payment provider; it runs KYC on the business and owners and checks your website (prices, refund policy, contact details, terms).
3. Choose payout timing (daily, weekly) and connect the bank account.
4. Turn on fraud tools (3-D Secure in India is standard for cards), and set your statement name so customers recognise charges.
5. Record fees as expenses in your books and keep the provider's monthly reports for tax.

</div>

> **Key idea:** A clear refund policy and recognisable statement name prevent most chargebacks. Refund quickly when a customer complains: a chargeback costs you the sale, a fee and your standing with the provider.

## 3. Foreign customers

- **India:** money from abroad arrives through your bank or a licensed cross-border aggregator; keep the FIRC or e-FIRA for each receipt (it supports GST zero-rating of exports).
- **Canada and USA:** multi-currency accounts avoid repeated conversion fees; card providers charge extra (often 1 to 2 %) for foreign cards and currency conversion.

<div class="meaning">

<dl>
<dt>Payment gateway / processor</dt><dd>the service that takes card or wallet payments</dd>
<dt>MDR</dt><dd>merchant discount rate: the percentage fee per payment</dd>
<dt>Chargeback</dt><dd>a customer’s bank reversing a payment</dd>
<dt>UPI AutoPay / pre-authorised debit / ACH</dt><dd>bank-to-bank recurring payments</dd>
<dt>Settlement</dt><dd>when the processor pays your bank</dd>
<dt>What it means for you</dt><dd>Pick processors your customers trust, compare the real fee on your average payment, and refund fast to avoid chargebacks.</dd>
</dl>

</div>

<div class="problem" data-problem="taking-payments-fees"></div>

## 4. Worked example

*Made-up founder.* Ravi bills 120 pharmacies ₹1,770 each (₹1,500 + GST) monthly. Card and wallet collection through a gateway at 2 % plus GST on the fee costs about ₹5,000 a month; switching to UPI AutoPay mandates for most clients brings it near zero. He keeps the gateway for clients who prefer cards.

<div class="myth">

**"Card fees are too small to matter."** A 2.9 % plus 30-cent fee is over 5 % on a $10 sale and can be a quarter of your margin. Bank transfers, UPI or ACH for regular customers can save a lot.

</div>

## 5. Practice

1. Two ways to cut card fees?
2. What makes a chargeback more likely?
3. Which Canadian method suits monthly subscriptions?

<details>
<summary>Answers</summary>

1. Move regular customers to bank debits (UPI AutoPay, PAD, ACH); negotiate volume rates; add a surcharge where allowed.
2. Unclear statement names, slow refunds, unclear policies, fraud.
3. Pre-authorised debit (PAD), or cards on file.
</details>

<div class="keypoints">

- India: UPI (no MDR on most UPI payments), cards and wallets through a gateway.
- Canada: Interac e-Transfer and debit, cards, pre-authorised debit.
- USA: cards, ACH, digital wallets.
- Compare fees on your typical payment size and include fixed per-payment fees.
- Clear policies, a recognisable statement name and fast refunds prevent chargebacks.

</div>

**Next:** [Bookkeeping basics](/learn/courses/startup/bookkeeping/). The [[invoice-maker]] makes invoices with payment details.

**New words:** *MDR*, *payment aggregator*, *chargeback*, *ACH*, *PAD*, *FIRC*, *payout*.

<p class="su-asof">Rates and rules as of November 2026; check your provider. Not financial advice.</p>
