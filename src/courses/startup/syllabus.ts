// Start a startup in India, Canada and the USA (nihal, 2026-11-22): an A to Z course for online and offline
// businesses, solo founders and teams. Plan: /mnt/project-files/startup-course/plan.md (12 modules, 4 PRs).
// Same engine as the other long text courses (src/courses/types.ts): a lesson goes live when
// src/courses/startup/<slug>.md exists; figures are <!--fig:name--> (src/courses/startup/figures/index.ts).
// Country switch: every lesson starts with <!--fig:country-->; parts that differ by country sit in
// <div class="cc" data-cc="in|ca|us"> boxes (blank line after the opening tag so the Markdown inside is
// read). The switch only hides the other boxes, so every page keeps all three countries for search.
// Legal and tax facts: cite the official source in `sources:` and say "as of" in the text.
import type { CourseSyllabus } from '../types';

export const STARTUP: CourseSyllabus = {
  id: 'startup',
  name: 'Start a startup',
  title: 'Start a startup in India, Canada or the USA: idea to official business',
  text: 'How to start a business in India, Canada or the USA, online or offline, alone or with co-founders: from the idea to registering, licences, GST and sales tax, income tax, payroll, IP and co-founder agreements, with official sources and interactive tools.',
  audience: 'For first-time founders, freelancers and side-project builders. No business or legal background needed; every term is explained.',
  updated: '2026-11-22',
  footnote: 'Not legal or tax advice. Laws, rates and fees change, and your situation may differ: follow the official source linked in the lesson and check with a lawyer, chartered accountant or CPA before you act. Calculators run in your browser; nothing you type is sent anywhere.',
  parts: [
    { name: 'Part A: From idea to a business shape', modules: [
      { n: 1, name: 'Start here', lessons: [
        ['1.1', 'what-is-a-startup', 'What a startup is, and how it differs from a small business'],
        ['1.2', 'online-vs-offline', 'Online or offline: what changes legally'],
        ['1.3', 'solo-or-team', 'Solo founder or a team'],
        ['1.4', 'a-to-z-map', 'The A to Z map: every step from idea to official'],
        ['1.5', 'official-sources', 'Finding the official rule: government sources you can trust'],
      ] },
      { n: 2, name: 'Idea to first customer', lessons: [
        ['2.1', 'problem-worth-solving', 'A problem worth solving'],
        ['2.2', 'customer-interviews', 'Talking to customers without fooling yourself'],
        ['2.3', 'mvp', 'The smallest product that tests the idea (MVP)'],
        ['2.4', 'pricing-unit-economics', 'Pricing and unit economics'],
        ['2.5', 'break-even-runway', 'Break-even and runway: how long your money lasts'],
        ['2.6', 'one-page-plan', 'A one-page business plan'],
      ] },
      { n: 3, name: 'Choosing a legal structure', lessons: [
        ['3.1', 'sole-proprietor', 'Sole proprietor: the simplest start'],
        ['3.2', 'partnership-llp', 'Partnerships and LLPs'],
        ['3.3', 'company-corporation', 'Companies and corporations: a separate legal person'],
        ['3.4', 'llc-c-corp-s-corp', 'USA: LLC, C corporation or S corporation'],
        ['3.5', 'structure-chooser', 'Choosing your structure: a guided chooser'],
        ['3.6', 'where-to-register', 'Where to register: state, province or federal'],
        ['3.7', 'changing-structure', 'Changing structure later'],
      ] },
    ] },
    { name: 'Part B: Becoming official', modules: [
      { n: 4, name: 'Register and become official', lessons: [
        ['4.1', 'business-name', 'Picking and checking a business name'],
        ['4.2', 'india-company-llp', 'India: registering a company or LLP'],
        ['4.3', 'india-udyam-startup-india', 'India: Udyam, Startup India and the shop licence'],
        ['4.4', 'canada-incorporation', 'Canada: registering or incorporating, federal or provincial'],
        ['4.5', 'canada-business-number', 'Canada: Business Number and CRA accounts'],
        ['4.6', 'usa-forming-llc-corp', 'USA: forming an LLC or corporation in a state'],
        ['4.7', 'usa-ein-registered-agent', 'USA: EIN, registered agent and other states'],
        ['4.8', 'address-domain-records', 'Address, domain and the records to keep'],
      ] },
      { n: 5, name: 'Licences and permits', lessons: [
        ['5.1', 'licence-finder', 'Which licences you need: a finder'],
        ['5.2', 'food-health-alcohol', 'Food, health and alcohol businesses'],
        ['5.3', 'home-based-zoning', 'Running a business from home: zoning and permits'],
        ['5.4', 'online-selling-rules', 'Rules for selling online'],
        ['5.5', 'import-export', 'Importing and exporting'],
      ] },
      { n: 6, name: 'Banking and funding', lessons: [
        ['6.1', 'business-bank-account', 'Opening a business bank account'],
        ['6.2', 'taking-payments', 'Taking payments: UPI, cards and payment gateways'],
        ['6.3', 'bookkeeping', 'Bookkeeping basics'],
        ['6.4', 'loans-grants', 'Loans, grants and government schemes'],
        ['6.5', 'raising-investment', 'Raising money: SAFEs, notes and priced rounds'],
        ['6.6', 'cap-table-dilution', 'The cap table and dilution'],
      ] },
    ] },
    { name: 'Part C: Tax and people', modules: [
      { n: 7, name: 'Sales tax: GST, HST and US sales tax', lessons: [
        ['7.1', 'how-gst-works', 'How GST and sales taxes work'],
        ['7.2', 'india-gst', 'India: GST registration, rates and returns'],
        ['7.3', 'canada-gst-hst', 'Canada: GST, HST, PST and QST'],
        ['7.4', 'usa-sales-tax-nexus', 'USA: sales tax and nexus'],
        ['7.5', 'selling-across-borders', 'Selling online across borders'],
        ['7.6', 'invoices', 'Invoices that pass a tax check'],
      ] },
      { n: 8, name: 'Income tax for founders', lessons: [
        ['8.1', 'business-income-tax', 'How business income is taxed'],
        ['8.2', 'india-income-tax-business', 'India: tax for proprietors, LLPs and companies'],
        ['8.3', 'canada-income-tax-business', 'Canada: tax for sole proprietors and corporations'],
        ['8.4', 'usa-income-tax-business', 'USA: tax for LLCs and corporations'],
        ['8.5', 'paying-yourself', 'Paying yourself: salary, dividends or draws'],
        ['8.6', 'expenses-records', 'Business expenses and the records that prove them'],
        ['8.7', 'tax-calendar', 'The founder tax calendar'],
      ] },
      { n: 9, name: 'Hiring and payroll', lessons: [
        ['9.1', 'employee-or-contractor', 'Employee or contractor'],
        ['9.2', 'india-payroll', 'India: payroll, PF, ESI and the labour codes'],
        ['9.3', 'canada-payroll', 'Canada: payroll, CPP, EI and employment standards'],
        ['9.4', 'usa-payroll', 'USA: payroll, FICA, W-2 and 1099'],
        ['9.5', 'true-cost-of-hire', 'The true cost of a hire'],
        ['9.6', 'employment-contracts-safety', 'Offer letters, contracts and workplace safety'],
      ] },
    ] },
    { name: 'Part D: Team, protection and growth', modules: [
      { n: 10, name: 'Co-founders and equity', lessons: [
        ['10.1', 'co-founder-agreement', 'The co-founder agreement'],
        ['10.2', 'splitting-equity', 'Splitting equity fairly'],
        ['10.3', 'vesting-cliffs', 'Vesting and cliffs'],
        ['10.4', 'employee-stock-options', 'Employee stock options (ESOPs)'],
        ['10.5', 'disputes-exits', 'When a co-founder leaves'],
      ] },
      { n: 11, name: 'Protect what you build', lessons: [
        ['11.1', 'ip-basics', 'Intellectual property: trademark, copyright, patent, secret'],
        ['11.2', 'trademarks', 'Registering a trademark'],
        ['11.3', 'contracts-nda-ip-assignment', 'Contracts: terms, NDAs and IP assignment'],
        ['11.4', 'privacy-email-laws', 'Privacy and email marketing laws'],
        ['11.5', 'website-legal-pages', 'The legal pages your website needs'],
      ] },
      { n: 12, name: 'Stay compliant and grow', lessons: [
        ['12.1', 'annual-filings', 'Annual filings that keep you in good standing'],
        ['12.2', 'compliance-calendar', 'Your compliance calendar'],
        ['12.3', 'business-insurance', 'Business insurance'],
        ['12.4', 'expanding-across-borders', 'Expanding to another country'],
        ['12.5', 'closing-a-business', 'Closing a business properly'],
        ['12.6', 'launch-plan', 'Capstone: your launch plan'],
      ] },
    ] },
  ],
};
