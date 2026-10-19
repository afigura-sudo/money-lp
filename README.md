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

## Design options

The prototype's Tweaks panel options map to the markup like this:
- **Sticky nav off:** delete the `<nav class="jump-nav">` block.
- **Default topic or calculator:** move `aria-selected="true"`/`tabindex="0"` to that tab and remove `hidden` from its panel (and add `hidden` to the old one). For the calculator, also update the prerendered result in `.calc__result`.
