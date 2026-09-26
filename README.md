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
- **Menu:** `menu.html`. Prices are not shown. To add one, put ` · <span class="price">MVR 450</span>` inside the item's `<h3>`.
- **Photos:** `assets/images/`. Replace a file with one of the same name, or add a new one and reference it.

Forms have no server: they compose a WhatsApp message to +960 989 9981.

## Still to confirm with the owner
- Prices, and the side dishes, starters and mains (taken from photos, not a printed menu).
- Friday opening time (2pm, from the brief; Instagram says 12 noon daily).
- "Cash only" and "Outdoor seating" (from the Google listing).
