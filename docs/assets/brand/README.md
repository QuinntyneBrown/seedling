# Seedlings brand assets

Logo and style values extracted from the Seedlings brand guidelines v1.0 (October 2026), published
at <https://project-seedlings-branding-system-888.magicpatterns.app>. `brand-guidelines-v1.0.png`
is a full-page capture of that source.

The leaf and stem paths are copied exactly from the source page. The wordmark is Fraunces
Semibold 600 with `SOFT` 100, converted to outlines, so the SVGs render the same without the font
installed. Lockup spacing follows the source: in the horizontal lockup the gap is 0.14 × the mark
height and the wordmark is 0.78 × the mark height, with −0.025em tracking.

## Logo

| File                                                                | Use                                                                            |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `seedlings-logo-horizontal-light.svg`                               | Default. On Cream, White or Sand                                               |
| `seedlings-logo-horizontal-dark.svg`                                | On Forest and in dark mode (large leaf becomes Leaf green)                     |
| `seedlings-logo-horizontal-mono-ink.svg`                            | Single-colour print, forms, fax                                                |
| `seedlings-logo-horizontal-mono-white.svg`                          | Over photos, on Sprout, or wherever colour clashes                             |
| `seedlings-logo-stacked-*.svg`                                      | Square spaces, merch, splash screens (same four variants)                      |
| `seedlings-mark-*.svg`                                              | Mark alone, once people know the brand or below 96px wide (same four variants) |
| `seedlings-app-icon.svg`, `seedlings-app-icon-{512,192,180,32}.png` | App icon: Forest tile, 23% corner radius                                       |

Rules from the guide:

- Clear space around the logo is half the mark's height.
- Minimum width of the horizontal lockup is 96px on screen and 25mm in print. Never use the mark
  below 16px.
- The small leaf is always Mango in colour versions. Don't recolour or swap the leaves.
- Don't stretch, rotate, outline or add shadows to the logo. Don't set the wordmark in capitals
  or another typeface.
- Don't place the colour logo on busy photos; use mono white instead.

## Colour

| Token    | Hex       | Role                                                           |
| -------- | --------- | -------------------------------------------------------------- |
| Forest   | `#123B2A` | Trust: wordmark, headings, dark surfaces, app icon tile        |
| Sprout   | `#2E8049` | Growth: primary buttons, links, progress, the large leaf       |
| Mango    | `#F5A524` | Hope: dollar amounts, highlights, celebrations, the small leaf |
| Leaf     | `#7CC47F` | Sprout's partner on Forest and in dark mode                    |
| Hibiscus | `#E4573D` | Illustration accents, deadlines, moments of delight            |
| Cream    | `#FFF6E9` | Default background                                             |
| Sand     | `#F1E3C8` | Cards on cream, dividers, inactive states                      |
| Ink      | `#16231C` | Body copy; never pure black                                    |

Balance: Cream 45%, Forest 25%, Sprout 15%, Mango 10%, Hibiscus 5%.

Accessible pairings (WCAG 2.1, recomputed and confirmed):

| Pair              | Ratio            | Use               |
| ----------------- | ---------------- | ----------------- |
| Ink on Cream      | 15.2:1 AAA       | Body text         |
| Forest on Cream   | 11.6:1 AAA       | Headings          |
| White on Sprout   | 4.9:1 AA         | Buttons           |
| Ink on Mango      | 8.0:1 AAA        | Highlights        |
| Mango on Forest   | 6.1:1 AA         | Amounts on dark   |
| Hibiscus on Cream | 3.4:1 large only | Icons, 24px+ text |

## Typography

- **Fraunces** Semibold 600, `font-variation-settings: 'SOFT' 100, 'WONK' 0`: display, H1 and H2
  only.
- **Figtree** 400, 500, 600, 700: body, labels, buttons and numbers.

| Style     | Font     | Size / line height | Weight |
| --------- | -------- | ------------------ | ------ |
| Display   | Fraunces | 40 / 44            | 600    |
| Heading 1 | Fraunces | 32 / 38            | 600    |
| Heading 2 | Fraunces | 24 / 30            | 600    |
| Heading 3 | Figtree  | 18 / 24            | 700    |
| Body      | Figtree  | 16 / 24            | 400    |
| Small     | Figtree  | 14 / 20            | 500    |
| Caption   | Figtree  | 12 / 16            | 600    |

Write in sentence case and plain language. Body text never goes below 16px.

`brand-tokens.css` (custom properties) and `brand-tokens.json` (DTCG) hold these values.
