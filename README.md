# Halfspace Player Development — website

Static site for Coach Daniel. No build step, no dependencies — plain HTML/CSS/JS, ready for GitHub + Vercel.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, credentials, programs, testimonials, inquiry form |
| `training.html` | Private & small group training, session structure, FAQ |
| `film-room.html` | Film analysis: how it works, interactive sample analysis, submission form, FAQ |
| `about.html` | Coach Daniel bio, license ladder, timeline, philosophy |

## Deploy (GitHub + Vercel)

1. Create a new GitHub repo (e.g. `halfspace-site`) and push this folder's contents to the repo root.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: **Other**. Leave build command and output directory empty. Deploy.
4. Add a custom domain in Vercel → Project → Settings → Domains when ready.

Any later edit: commit + push, Vercel redeploys automatically.

## Before launch — 4 swaps

Search each file for `SWAP:` and `SETUP:` comments. They mark every spot below.

### 1. Connect the forms (Formspree, ~2 minutes)
- Sign up free at [formspree.io](https://formspree.io), create a form, copy its ID.
- Replace `YOUR_FORM_ID` in **both** forms:
  - `index.html` (training inquiry form)
  - `film-room.html` (film submission form)
- One form ID works for both — the hidden `_subject` field labels which form each email came from.
- Until connected, the forms fail gracefully: submissions are blocked and visitors are told to email directly.

### 2. Real photos
Drop Daniel's photos into `images/`, keeping these exact filenames (current files are styled placeholders):
- `images/coach-huddle.jpg` — the floodlight group-talk photo (used on Home + About). Portrait crop, ~3:4.
- `images/coach-session.jpg` — the daytime 1-on-1 photo (used on Training + About). Portrait crop, ~3:4.
More/better photos later? Just overwrite these two files — no HTML changes needed.

### 3. Real contact info
In the footer of all four pages, replace:
- `coach@halfspacepd.com` → Daniel's real email (appears twice per page: link text + `mailto:`)
- `https://instagram.com` → his real Instagram URL

### 4. Real testimonials
The three quotes on `index.html` ("What families say") are **placeholders**. Replace them with real quotes from families before launch — or delete the section if none are ready.

## Notes

- Fonts load from Google Fonts (Big Shoulders Display, Instrument Sans, Spline Sans Mono).
- The Film Room sample analysis is interactive: clicking a timestamped note switches the annotation on the tactical board (`main.js`).
- Tested at 1440px, 390px, 360px and 320px widths — no horizontal overflow; mobile menu, film-note sync, and form guard all verified.
- Accessibility: skip link, labeled inputs, `aria-current` nav state, visible focus styles, `prefers-reduced-motion` respected.
