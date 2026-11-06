---
name: Link cleaner
shelf: everyday
title: "Link cleaner: remove tracking codes and UTM tags from any link"
summary: "Remove tracking codes, UTM tags and affiliate parts from any link and get the clean address. Works on a whole message at once."
status: live
ads: true
order: 8
icon: link
works: offline
updated: 2026-11-06
flow:
  - { icon: link, label: "Paste a link" }
  - { icon: search, label: "Find tags" }
  - { icon: shrink, label: "Strip them" }
  - { icon: check, label: "Copy clean" }
---

## How to clean a link

1. Paste a link into the box. You can also paste a whole message, email or document with many links in it.
2. The clean version appears straight away, with the removed parts crossed out under each link.
3. Press **Copy clean text** to copy everything, or **Copy link** next to a single link.

Nothing you paste is sent anywhere. The cleaning happens in your browser, and the page keeps working with no internet once it is open.

## What gets removed

- **Campaign tags** such as `utm_source`, `utm_medium` and `utm_campaign`, which tell a site which newsletter or post you came from.
- **Click IDs** that tie your click to an ad account: `fbclid` (Facebook), `gclid` (Google Ads), `msclkid` (Microsoft), `igshid` (Instagram), `ttclid` (TikTok), `li_fat_id` (LinkedIn) and many more.
- **Share codes** such as YouTube's and Spotify's `si`, which can link a shared video back to the person who shared it.
- **Redirect wrappers**: links from Google search, Facebook, Outlook Safe Links, YouTube descriptions and others are unwrapped to the real address.
- **Shop clutter**: an Amazon product link becomes just `amazon.ca/dp/ASIN`, without the product name, search words and reference codes.
- **Affiliate and referral tags** such as Amazon's `tag`, `ref`, `aff_id` and `irclickid`, when the switch is on. Turn it off if you want to keep supporting a creator who shared the link.

Settings that a page needs are kept: a YouTube video id and start time, a search query, a page number, a GitHub branch.

## Example

`https://www.amazon.ca/Ceramic-Mug/dp/B0ABCDEFGH/ref=sr_1_3?crid=XYZ&keywords=mug&qid=1&sr=8-3&tag=someone-20`

becomes

`https://www.amazon.ca/dp/B0ABCDEFGH`

## Questions

**Why clean links at all?** Tracking parts tell sites who shared a link and where you clicked it. They also make links long and ugly to share. A clean link opens the same page.

**What about short links like bit.ly?** A short link hides where it goes, and the only way to find out is to open it, which would tell the shortener about you. We leave short links as they are and point them out.

**Can a clean link break?** Rarely. If a page needs a part we removed, use the original link. Please tell us on the contact page so we can fix the rule.
