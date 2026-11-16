# MenuPro – Restaurant Menu Management System

A responsive, frontend-only restaurant menu management application built with HTML5, CSS3 and vanilla JavaScript. No backend or database is required. Data is stored in the browser using `localStorage`.

## Run locally
1. Download or clone this project.
2. Open `index.html` in Chrome, Edge or Firefox. For best results use VS Code Live Server.
3. Sign in with the demo credentials:
   - Email: `admin@menupro.com`
   - Password: `admin123`
   - Choose Admin, Manager or Staff role.

## Included modules
- Dashboard with item/category counts, popular dishes and low-stock alerts
- Category CRUD (add, edit, delete; prevents deleting a category that still has items)
- Menu item CRUD with name, description, price, image URL, category, ingredients, allergens, status and dietary tags
- Customer-facing digital menu with category tabs and unavailable items hidden
- Pricing management with dated special prices and offer validation
- Inventory CRUD with reorder levels and low-stock status
- Analytics using illustrative sample order/view data
- Menu and inventory reports, CSV export and browser Print / Save as PDF
- Menu snapshots, version history and restore
- Simulated sign-in with Admin, Manager and Staff role selection
- Search and filters, daily specials via Chef's Special tag, QR menu, dark mode and English/Hindi language toggle
- Responsive desktop, tablet and mobile layout

## Notes and limitations
- This is a frontend demonstration. Login is simulated and is not secure authentication; roles are recorded but not permission-enforced.
- Analytics values are sample/demo data, not connected to a live point-of-sale system.
- Data belongs to the browser and device where it is entered. Clearing browser storage removes it.
- QR generation uses QRCode.js from a CDN. Dish images use Unsplash image URLs; internet access is needed for those external assets.
- The language control is a demonstration toggle, not a complete translation of every label.

## Technologies
HTML5, CSS3, JavaScript (ES6), localStorage, QRCode.js CDN, Google Fonts and Font Awesome-free Unicode symbols.

## Deployment
Publish the project folder to a public GitHub repository. Enable GitHub Pages from **Settings → Pages → Deploy from branch**, or drag the folder into Netlify Drop. No build step is required.
