# Cerebral Soccer — website

Static site for Coach Daniel. No build step, no dependencies — plain HTML/CSS/JS, ready for GitHub + Vercel.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, credentials, programs, testimonials, inquiry form |
| `training.html` | Private & small group training, session structure, FAQ |
| `film-room.html` | Film analysis: how it works, interactive sample analysis, submission form, FAQ |
| `about.html` | Coach Daniel bio, license ladder, timeline, philosophy |

## Deploy (GitHub + Vercel)

1. Create a new GitHub repo (e.g. `dans-soccer-lab`) and push this folder's contents to the repo root.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: **Other**. Leave build command and output directory empty. Deploy.
4. Add a custom domain in Vercel → Project → Settings → Domains when ready.

Any later edit: commit + push, Vercel redeploys automatically.

## Status

Live at https://cerebralsoccer.com — forms connected (Formspree → dansoccerlab@gmail.com),
phone & email in footer, SEO files (sitemap.xml, robots.txt, JSON-LD), Search Console verified,
homepage indexed by Google. Google Business Profile created (verification pending).

## Remaining swaps

1. **Testimonials** — the three quotes on `index.html` are placeholders. Replace with real family quotes.
2. **Instagram** — footer link points to instagram.com generically; set Daniel's real profile URL or remove.
3. **Photos (optional)** — overwrite `images/coach-huddle.jpg` and `images/coach-session.jpg` anytime; no HTML changes needed.
4. **Custom domain (optional)** — add in Vercel → Settings → Domains, then update og:url/og:image URLs in all pages + sitemap.xml.

## Notes

- Fonts load from Google Fonts (Big Shoulders Display, Instrument Sans, Spline Sans Mono).
- The Film Room sample analysis is interactive: clicking a timestamped note switches the annotation on the tactical board (`main.js`).
- Tested at 1440px, 390px, 360px and 320px widths — no horizontal overflow; mobile menu, film-note sync, and form guard all verified.
- Accessibility: skip link, labeled inputs, `aria-current` nav state, visible focus styles, `prefers-reduced-motion` respected.
