# Ember & Bean | Specialty Coffee Roastery & Cafe

A responsive website for **Ember & Bean**, an artisan specialty coffee roastery and cafe based in Portland, OR.

Built with semantic HTML5, modern CSS (with custom CSS variables, CSS Grid, and Flexbox), and vanilla JavaScript.

---

## ☕ Features

- **Sticky Navigation**: Brand logo with animated flame mark, smooth section links, working mobile menu drawer, and real-time cart counter badge.
- **Hero Section**: Editorial split-screen layout with headline, story copy, dual call-to-actions, and an animated craft coffee visual.
- **Featured Roasts**: 3-column responsive card grid featuring single-origin and house roasts with tasting notes, roast intensity meters, and an interactive "Add to Bag" system.
- **Interactive Cafe Menu**: Tabbed interface switching between *Espresso Bar*, *Pour Over*, and *Pastries* with keyboard accessibility.
- **Visit Us & Reservation**: Cafe location, weekly hours table, and an interactive booking form with real-time validation and confirmation display.
- **Footer**: Newsletter subscription with instant feedback, quick links, and social links.
- **Shopping Bag Drawer**: Slide-out cart drawer with quantity adjustments, subtotal calculations, and order management.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with full WCAG AA accessibility (`aria-labels`, `role="tablist"`, `aria-live="polite"`).
- **CSS3**: Custom CSS variables for theming, CSS Grid & Flexbox, fluid typography (`clamp()`), and animations.
- **JavaScript (ES6+)**: Vanilla JS with no external dependencies or frameworks.
- **Typography**: Google Fonts (*Playfair Display* & *Plus Jakarta Sans*).

---

## 🚀 Getting Started

### Local Setup

1. Clone or download this repository.
2. Open `index.html` directly in any web browser, or run the local Node server:

```bash
node server.js
```

3. Visit `http://localhost:3000/` in your browser.

---

## 📂 Project Structure

```
ember-and-bean/
├── index.html        # Main semantic markup
├── styles.css        # Design tokens, layouts, responsive rules & animations
├── script.js         # Navigation, cart state, accessible tabs & form logic
├── server.js         # Lightweight local development server
└── README.md         # Documentation
```
