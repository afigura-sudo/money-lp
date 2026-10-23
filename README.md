# Money Hub page

Static build of the Claude Design prototype `Money Hub v2.dc.html` (the U.S. News Money section front). No framework or build step. Open `index.html` directly or serve the folder.

- `index.html`: all content is in the markup, so every topic panel, goal result and calculator renders without JS. Inactive panels use `hidden`.
- `assets/money-hub.css`: styles, with breakpoints at 1300px (burger menu), 980px (single column) and 560px (mobile).
- `assets/money-hub.js`: goal picker (saved in `localStorage` under `usn-money-goal`), topic and calculator tabs (arrow-key support), live calculator results, jump-nav highlight, mobile menu, advisor search and newsletter form.

## Placeholders to replace before launch

- The lead "Latest in money" image (`editorial-1-couple-advisor.jpg`) is a stand-in from the insurance hub.
- The ranking-card descriptions for Banking, Mortgages, Personal & Auto Loans and Student Loans were written for the design, not taken from the live page.
- The calculator default values are examples, not current rates.
- The newsletter form only shows its confirmation state. It still has to be connected to the subscription endpoint (see the `TODO` in `money-hub.js`)## Design v2 and search markup

The page follows `Money Hub v2.dc.html` (Oct. 23, 2026): navy hero with the H1 "Compare Credit Cards, Loans, Banks and Brokers" and an "Updated / Reviewed by" line, an accordion FAQ, and the Invested newsletter block.

Search, social and AI markup in `<head>`:
- A robots meta tag, Open Graph and Twitter Card tags, and a 1200×630 share image (`assets/money-hub-share.jpg`).
- One JSON-LD `@graph` with Organization, WebSite (with SearchAction), CollectionPage (with `dateModified` and speakable selectors), BreadcrumbList, an ItemList of rankings, an ItemList of the latest articles, and FAQPage.

Additions not in the design file: the latest-articles ItemList, the longer meta description, `<time datetime>` on bylines, and the responsive WebP/640px versions of the lead photo.

**Check before launch:**
- `og:image` uses the GitHub Pages host so previews work now. The design names `https://money.usnews.com/static/money-hub-share.jpg` for production: upload `assets/money-hub-share.jpg` there and change `ASSET_BASE`/`og:image`.
- **Update together:** the "Updated Oct. 20, 2026" line and the schema `dateModified` must change at the same time.
- **Unverified URLs:** the social profiles, the `@usnews` handle, the logo at `www.usnews.com/static/img/usn-logo-large.png` and the favicon couldn't be checked from the build environment.
- **FAQ:** the visible FAQ text and the FAQPage schema must stay word-for-word identical.
- **Alt text:** the design's alt text for the lead photo ("Older couple...") doesn't match the image, so the page uses "Couple reviewing financial documents with an advisor at a table".
