# The Butcher's Block — website

Static multi-page website for The Butcher's Block steakhouse, Hulhumalé, Maldives.
Its structure follows the page layout of thelanding.nyc: announcement bar, sticky header, full-width banners, alternating image/text sections, reservations CTA, and a detailed footer.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `menu.html` | Menu (steaks, burgers, starters, sides, desserts, drinks) |
| `about.html` | About / our story + cut guide |
| `private-events.html` | Private events + WhatsApp enquiry |
| `gallery.html` | Photo gallery with lightbox |
| `reservations.html` | Hours, FAQ, WhatsApp booking form |
| `contact.html` | Address, phone, map, WhatsApp message form |

Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Adding photos and the logo
Put the images in `assets/images/` using these exact filenames. Until a file exists, a dark placeholder is shown in its slot, and the text wordmark is shown in place of the logo.

- `about-1.jpg`
- `about-2.jpg`
- `about-banner.jpg`
- `contact-banner.jpg`
- `cta.jpg`
- `dining.jpg`
- `event-1.jpg`
- `event-2.jpg`
- `event-3.jpg`
- `event-4.jpg`
- `events-banner.jpg`
- `favicon.png`
- `gallery-1.jpg`
- `gallery-10.jpg`
- `gallery-11.jpg`
- `gallery-2.jpg`
- `gallery-3.jpg`
- `gallery-4.jpg`
- `gallery-5.jpg`
- `gallery-6.jpg`
- `gallery-7.jpg`
- `gallery-8.jpg`
- `gallery-9.jpg`
- `gallery-banner.jpg`
- `hero.jpg`
- `logo.png`
- `menu-banner.jpg`
- `reserve-banner.jpg`
- `steak.jpg`
- `tile-gallery.jpg`
- `tile-menu.jpg`
- `tile-reserve.jpg`

Photos are cropped to fill their slot, so landscape JPGs around 2000px wide work best. The logo should be a transparent PNG, ideally light-coloured for the dark header.

## Editing content
- **Hours, phone and WhatsApp number:** `SITE` at the top of `assets/js/main.js`, plus the text in each page's footer.
- **Menu items and prices:** `menu.html`. Prices are hidden right now. To show one, add `<span class="lead"></span><span class="price">MVR 000</span>` after the item name.

## Still to confirm with the owner
Menu items and prices, halal status, the owner's story and beef sourcing, WhatsApp number (currently +960 989-9981), and payment and delivery options.
