---
name: JWT decoder
num: 2003
shelf: everyday
code: T851
section: encode-decode
title: "JWT decoder: read a JSON Web Token's header, payload and expiry"
summary: "Paste a JSON Web Token to see its header and payload as tidy JSON, with iat, nbf and exp shown as dates and whether it has expired. The token stays on your device and the signature is not checked."
status: live
ads: false
order: 2003
icon: lock
works: offline
updated: 2026-11-10
related: [base64-converter, hash-checker]
sources:
  - "RFC 7519, JSON Web Token (IETF), section 4.1 for the iat, nbf and exp claims; RFC 7515 (JWS) for the three-part layout."
flow:
  - { icon: copy, label: "Paste" }
  - { icon: eye, label: "Read" }
  - { icon: clock, label: "Expiry" }
---

## What it does

A JSON Web Token (JWT) is the long string of letters with two dots that many apps use to say who is logged in. It has three parts: a header (which algorithm signed it), a payload (the claims, such as a user id and expiry time) and a signature. The first two are only Base64url-encoded JSON, so anyone can read them. This page decodes them as you paste and turns the time claims into dates.

The signature is shown but **not verified**. Checking it needs the secret or public key, and a decoder should never ask for that. The token is never sent anywhere. To decode other Base64 text use the [[base64-converter]]; to compare a fingerprint of a file use the [[hash-checker]].

## How to use it

1. Paste the token in **Token (JWT)**. A leading "Bearer " is ignored.
2. Read the header and payload below, laid out as JSON.
3. Check the times: each one is shown in UTC and in your own time.
4. Press **Clear** to remove the token from the page.

## What each part shows

- **Header**: the algorithm (`alg`, such as HS256 or RS256) and type. `none` means the token is not signed at all.
- **Payload**: every claim in the token.
- **Issued at (iat)**: when the token was made, and how long ago.
- **Not before (nbf)**: the token is not valid before this time; you see whether it is active yet.
- **Expires (exp)**: says **Expired ... ago** or **Valid for ... more**, based on your device clock.
- **Signature**: the raw third part, for reference only.

## Worked example

The example on the page has the header `{"alg":"HS256","typ":"JWT"}` and the payload `{"sub":"123","name":"Asha","iat":1700000000}`. The iat value 1700000000 seconds after 1 January 1970 is **2023-11-14 22:13:20 UTC**. It has no exp, so it never expires by itself.

Paste just `abc.def` and you get an error: a JWT needs three parts.

## FAQs

**Is it safe to paste a real token?** The page does all its work in your browser and sends nothing. Still, press Clear when you are done.

**Why is it not verified?** Verifying needs the signing key. Without it nobody can tell a genuine token from a made-up one, so never trust the payload just because it decodes.

**It says 5 parts.** That is an encrypted token (JWE); only the key holder can read its contents.
