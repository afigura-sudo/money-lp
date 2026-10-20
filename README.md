# Money Hub page

Static build of the Claude Design prototype `Money Hub.dc.html` (the U.S. News Money section front). No framework or build step. Open `index.html` directly or serve the folder.

- `index.html`: all content is in the markup, so every topic panel, goal result and calculator renders without JS. Inactive panels use `hidden`.
- `assets/money-hub.css`: styles, with breakpoints at 1300px (burger menu), 980px (single column) and 560px (mobile).
- `assets/money-hub.js`: goal picker (saved in `localStorage` under `usn-money-goal`), topic and calculator tabs (arrow-key support), live calculator results, jump-nav highlight, mobile menu, advisor search and newsletter form.

## Placeholders to replace before launch

- The lead "Latest in money" image (`editorial-1-couple-advisor.jpg`) is a stand-in from the insurance hub.
- The ranking-card descriptions for Banking, Mortgages, Personal & Auto Loans and Student Loans were written for the design, not taken from the live page.
- The calculator default values are examples, not current rates.
- The newsletter form only shows its confirmation state. It still has to be connected to the subscription endpoint (see the `TODO` in `money-hub.js`).

## SEO / GEO / AEO additions (from the Oct. 2026 audit)

- **Structured data:** one JSON-LD `@graph` in `<head>` with Organization, WebSite, CollectionPage, BreadcrumbList, an ItemList of the six ranking categories, an ItemList of the latest articles (with authors and dates), and FAQPage.
- **Social sharing:** Open Graph and Twitter Card tags, with a 1200×630 share image at `assets/og-money-hub.png`.
- **Content:** a "How we rank" note under the rankings and a six-question FAQ section (also in the jump nav).
- **Markup:** the H1 now includes "U.S. News Money", bylines use `<time datetime>`, "Latest in money" is an `<ol>`, the lead photo has descriptive alt text plus WebP and 640px versions, and the footer links to social profiles.

**Check before launch:**
- `og:image` and the schema logo use absolute URLs on the GitHub Pages host (`https://afigura-sudo.github.io/money-lp/assets/`). Change them to the production asset host.
- The social profile URLs, the `@usnews` Twitter handle and the `usnews.com/favicon.ico` link couldn't be checked from the build environment. Verify them.
- The FAQ and "How we rank" copy needs editorial review, especially the description of the ranking criteria. Keep the visible FAQ text and the FAQPage schema in sync.
- Not done yet, because they need data or information this page doesn't have: a live rates table, links from bylines to author pages, robots.txt and sitemap.xml (production already has these), and self-hosted fonts.

## Design options

The prototype's Tweaks panel options map to the markup like this:
- **Sticky nav off:** delete the `<nav class="jump-nav">` block.
- **Default topic or calculator:** move `aria-selected="true"`/`tabindex="0"` to that tab and remove `hidden` from its panel (and add `hidden` to the old one). For the calculator, also update the prerendered result in `.calc__result`.
