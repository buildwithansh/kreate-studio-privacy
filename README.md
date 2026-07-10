# Kreate Studio — Legal Documents

Static site (plain HTML/CSS/JS, no build step, no dependencies) for Kreate Studio's public legal pages. Dark theme by default, with a persistent light/dark toggle.

## Structure

```
index.html            Privacy Policy (also the site home)
tos.html               Terms of Service
seller-policy.html     Seller / Vendor Policy
refund-policy.html     Refund & Cancellation Policy
grievance.html         Grievance Redressal Mechanism
assets/css/style.css   Shared design system (theme tokens, layout, components)
assets/js/main.js      Theme toggle, mobile nav, TOC scrollspy, reveal animations
assets/img/logo.png    Kreate Studio logo (favicon + header/footer mark)
```

## Hosting

No build step — deploy the folder as-is to any static host (GitHub Pages, Netlify, Vercel, Firebase Hosting, S3, etc.), or open `index.html` directly. All internal links are relative.

To preview locally: `npx serve .` (or any static file server), then open `http://localhost:3000`.

## Theme

Colors are defined once as CSS custom properties in `assets/css/style.css` (`:root` for dark, `:root[data-theme="light"]` for light). The palette:

| Token | Hex |
|---|---|
| Navy | `#202C44` |
| Slate | `#242b36` |
| Sand | `#d3ccb0` |
| Fog | `#7b8a90` |
| Ink | `#111317` |
| Black / White | `#000000` / `#ffffff` |

The visitor's choice is stored in `localStorage` and applied before first paint (inline script in each page's `<head>`) to avoid a flash of the wrong theme.

## Editing content

Each policy page is self-contained HTML with numbered `<section class="clause" id="sN">` blocks; the sidebar table of contents links to these by id. Keep the five documents' cross-references (fees, dates, grievance officer details, dispute-resolution forum) in sync when editing — they're written to be consistent with each other.
