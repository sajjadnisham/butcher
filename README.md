# The Butcher's Block — website

Static multi-page website for The Butcher's Block steakhouse, Hulhumalé, Maldives.
The layout follows thelanding.nyc (a BentoBox site): black header with overlay menu, full-screen photo slideshows with arrows and pause, centred intro text, checkerboard photo/text grids, a tabbed three-column menu, and centred Hours & Location / Contact pages.

## Pages
| File | Page |
|---|---|
| `index.html` | Home |
| `menu.html` | Menu (tabs: Steaks & Grills, From the Kitchen) |
| `hours-location.html` | Hours, address, map, directions |
| `about.html` | About |
| `private-events.html` | Private events + event request form |
| `gallery.html` | Photo gallery with lightbox |
| `reservations.html` | Booking form (opens WhatsApp) + opening hours |
| `contact.html` | Contact form (opens WhatsApp) |

Open `index.html` in a browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel).

## Editing
- **Hours and WhatsApp number:** `SITE` at the top of `assets/js/main.js`. Hours text also appears on `hours-location.html` and in the home page copy.
- **Menu:** `menu.html`. Prices are average prices in MVR and sit in each item's `<span class="price">`.
- **Photos:** `assets/images/`. Replace a file with one of the same name, or add a new one and reference it.

Forms have no server: they compose a WhatsApp message to +960 989 9981, then show a "Send on WhatsApp" button.

Photos are placeholders from the owner and will be replaced later.

## Still to confirm with the owner
- Menu prices: these are average estimates, not the restaurant's price list.
- The side dishes, starters and mains, which were taken from photos, not a printed menu.
- "Cash only" and "Outdoor seating" (from the Google listing).
